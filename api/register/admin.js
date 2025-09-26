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

// Registration Schema
const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 255, unique: true },
  school: { type: String, required: true, maxlength: 200 },
  graduationYear: { type: String, maxlength: 4 },
  major: { type: String, maxlength: 100 },
  experience: { type: String, maxlength: 500 },
  dietaryRestrictions: { type: String, maxlength: 200 },
  emergencyContact: { type: String, maxlength: 100 },
  emergencyPhone: { type: String, maxlength: 20 },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'waitlisted'], default: 'pending' }
})

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    if (req.method === 'GET') {
      // Get all registrations with pagination
      const { page = 1, limit = 50, status } = req.query
      const skip = (parseInt(page) - 1) * parseInt(limit)

      // Build query
      const query = status ? { status } : {}

      // Get registrations with pagination
      const registrations = await Registration.find(query)
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))

      // Get total count for pagination
      const total = await Registration.countDocuments(query)

      // Calculate stats
      const stats = {
        total: await Registration.countDocuments(),
        confirmed: await Registration.countDocuments({ status: 'confirmed' }),
        pending: await Registration.countDocuments({ status: 'pending' }),
        waitlisted: await Registration.countDocuments({ status: 'waitlisted' })
      }

      return res.json({
        registrations,
        stats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      })
    }

    if (req.method === 'PUT') {
      // Update registration status
      const { id, status } = req.body

      if (!id || !status) {
        return res.status(400).json({
          success: false,
          message: 'Registration ID and status are required'
        })
      }

      const registration = await Registration.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      )

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found'
        })
      }

      console.log(`Registration ${id} status updated to ${status}`)

      return res.json({
        success: true,
        registration,
        message: 'Registration status updated successfully'
      })
    }

    if (req.method === 'DELETE') {
      // Delete registration
      const { id } = req.query

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Registration ID is required'
        })
      }

      const registration = await Registration.findByIdAndDelete(id)

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found'
        })
      }

      console.log('Registration deleted:', registration._id)

      return res.json({
        success: true,
        message: 'Registration deleted successfully'
      })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Registration admin error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to manage registrations'
    })
  }
}