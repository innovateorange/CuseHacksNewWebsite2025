import mongoose from 'mongoose'

// Simple database connection
let cachedDb = null
async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI)
    cachedDb = db
    return db
  } catch (error) {
    console.error('DB connection error:', error)
    throw error
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectDB()
    const db = mongoose.connection.db

    // Get database stats
    const dbStats = await db.stats()

    // Get collection stats
    const collections = await db.listCollections().toArray()
    const collectionStats = []

    for (const collection of collections) {
      const collName = collection.name

      // Get basic collection info
      const collectionObj = db.collection(collName)
      const count = await collectionObj.countDocuments()

      // Get largest documents in this collection
      const largestDocs = await collectionObj
        .find({})
        .limit(5)
        .toArray()

      // Calculate document sizes
      const docSizes = largestDocs.map(doc => {
        const docStr = JSON.stringify(doc)
        return {
          id: doc._id,
          size: docStr.length,
          sizeKB: Math.round(docStr.length / 1024 * 100) / 100,
          hasImage: doc.image ? true : false,
          imageSize: doc.image ? doc.image.length : 0,
          imageSizeKB: doc.image ? Math.round(doc.image.length / 1024 * 100) / 100 : 0,
          name: doc.name || doc.email || doc.subject || 'Unknown'
        }
      })

      // Calculate estimated sizes
      const totalEstimatedSize = docSizes.reduce((sum, doc) => sum + doc.size, 0)
      const avgSize = count > 0 ? Math.round(totalEstimatedSize / count) : 0

      collectionStats.push({
        name: collName,
        count: count,
        estimatedSize: totalEstimatedSize,
        estimatedSizeKB: Math.round(totalEstimatedSize / 1024 * 100) / 100,
        estimatedSizeMB: Math.round(totalEstimatedSize / 1024 / 1024 * 100) / 100,
        avgObjSize: avgSize,
        avgObjSizeKB: Math.round(avgSize / 1024 * 100) / 100,
        largestDocs: docSizes
      })
    }

    // Sort collections by estimated size
    collectionStats.sort((a, b) => b.estimatedSize - a.estimatedSize)

    // Find overall largest documents
    let allLargestDocs = []
    collectionStats.forEach(coll => {
      coll.largestDocs.forEach(doc => {
        allLargestDocs.push({
          ...doc,
          collection: coll.name
        })
      })
    })
    allLargestDocs.sort((a, b) => b.size - a.size)
    allLargestDocs = allLargestDocs.slice(0, 10) // Top 10 largest

    const response = {
      database: {
        name: db.databaseName,
        totalSize: dbStats.dataSize,
        totalSizeKB: Math.round((dbStats.dataSize || 0) / 1024 * 100) / 100,
        totalSizeMB: Math.round((dbStats.dataSize || 0) / 1024 / 1024 * 100) / 100,
        totalStorageSize: dbStats.storageSize || 0,
        totalStorageSizeKB: Math.round((dbStats.storageSize || 0) / 1024 * 100) / 100,
        totalStorageSizeMB: Math.round((dbStats.storageSize || 0) / 1024 / 1024 * 100) / 100,
        totalIndexSize: dbStats.indexSize || 0,
        totalIndexSizeKB: Math.round((dbStats.indexSize || 0) / 1024 * 100) / 100,
        totalIndexSizeMB: Math.round((dbStats.indexSize || 0) / 1024 / 1024 * 100) / 100,
        collectionsCount: dbStats.collections,
        objectsCount: dbStats.objects,
        avgObjSize: Math.round(dbStats.avgObjSize || 0),
        avgObjSizeKB: Math.round((dbStats.avgObjSize || 0) / 1024 * 100) / 100
      },
      collections: collectionStats,
      largestDocuments: allLargestDocs,
      summary: {
        totalDocuments: collectionStats.reduce((sum, coll) => sum + coll.count, 0),
        largestCollection: collectionStats[0]?.name || 'None',
        largestCollectionSize: collectionStats[0]?.estimatedSizeMB || 0,
        avgDocumentSize: Math.round((dbStats.avgObjSize || 0) / 1024 * 100) / 100,
        documentsWithImages: collectionStats.reduce((sum, coll) =>
          sum + coll.largestDocs.filter(doc => doc.hasImage).length, 0
        )
      }
    }

    res.json(response)

  } catch (error) {
    console.error('Database stats error:', error)
    res.status(500).json({
      success: false,
      message: `Database error: ${error.message}`,
      error: process.env.NODE_ENV === 'development' ? error.stack : 'Internal server error'
    })
  }
}