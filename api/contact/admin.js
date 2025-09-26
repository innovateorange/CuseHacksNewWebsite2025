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

// Contact Message Schema
const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 255 },
  subject: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true, minlength: 10, maxlength: 2000 },
  submittedAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  status: { type: String, enum: ['new', 'replied'], default: 'new' }
})

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    if (req.method === 'GET') {
      // Get all contact messages for admin
      const messages = await ContactMessage.find({}).sort({ submittedAt: -1 })

      // Calculate stats
      const stats = {
        total: messages.length,
        unread: messages.filter(m => !m.isRead).length,
        new: messages.filter(m => m.status === 'new').length,
        replied: messages.filter(m => m.status === 'replied').length
      }

      return res.json({
        messages,
        stats
      })
    }

    if (req.method === 'PATCH') {
      // Update message status or read status
      const { id, isRead, status } = req.body

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Message ID is required'
        })
      }

      const updateData = {}
      if (typeof isRead === 'boolean') updateData.isRead = isRead
      if (status) updateData.status = status

      const message = await ContactMessage.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )

      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Contact message not found'
        })
      }

      console.log(`Contact message ${id} updated:`, updateData)

      return res.json({
        success: true,
        message: message,
        info: 'Contact message updated successfully'
      })
    }

    if (req.method === 'DELETE') {
      // Delete contact message
      const { id } = req.query

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Message ID is required'
        })
      }

      const message = await ContactMessage.findByIdAndDelete(id)

      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Contact message not found'
        })
      }

      console.log('Contact message deleted:', message._id)

      return res.json({
        success: true,
        message: 'Contact message deleted successfully'
      })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Contact admin error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to manage contact messages'
    })
  }
}