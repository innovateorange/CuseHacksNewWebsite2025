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

// Feature Flag Schema
const FeatureFlagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
  description: { type: String },
  lastModified: { type: Date, default: Date.now },
  modifiedBy: { type: String, default: 'admin' }
})

const FeatureFlag = mongoose.models.FeatureFlag || mongoose.model('FeatureFlag', FeatureFlagSchema)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    if (req.method === 'GET') {
      // Get all feature flags
      const flags = await FeatureFlag.find({}).sort({ name: 1 })

      // Convert to the format expected by frontend
      const flagsObject = {}
      flags.forEach(flag => {
        flagsObject[flag.name] = flag.enabled
      })

      // Ensure default flags exist
      const defaultFlags = {
        projectSubmissionsEnabled: false,
        registrationEnabled: true,
        votingEnabled: true,
        adminPanelEnabled: true
      }

      // Merge with existing flags, keeping database values where they exist
      const result = { ...defaultFlags, ...flagsObject }

      return res.json(result)
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const { flagName, enabled } = req.body

      if (!flagName || typeof enabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'flagName and enabled boolean are required'
        })
      }

      // Update or create feature flag
      const flag = await FeatureFlag.findOneAndUpdate(
        { name: flagName },
        {
          enabled,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        { upsert: true, new: true }
      )

      console.log(`Feature flag ${flagName} set to ${enabled} in DB`)

      return res.json({
        success: true,
        flag: {
          name: flag.name,
          enabled: flag.enabled,
          lastModified: flag.lastModified
        }
      })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Feature flags error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to manage feature flags'
    })
  }
}