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

// Team Member Schema
const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  role: { type: String, required: true, maxlength: 100 },
  image: { type: String, maxlength: 500000 }, // Increased to 500KB for base64 images
  bio: { type: String, maxlength: 1000 },
  startYear: { type: Number, required: true },
  endYear: { type: Number, default: null },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 999 },
  links: {
    linkedin: { type: String, maxlength: 500 },
    github: { type: String, maxlength: 500 },
    twitter: { type: String, maxlength: 500 },
    website: { type: String, maxlength: 500 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    if (req.method === 'GET') {
      // Get all team members
      const teamMembers = await TeamMember.find({}).sort({ order: 1, createdAt: 1 })
      return res.json(teamMembers)
    }

    if (req.method === 'POST') {
      // Create new team member
      console.log('POST request body:', req.body)

      const {
        name,
        role,
        image,
        bio,
        startYear,
        endYear,
        isActive = true,
        order = 999,
        links = {}
      } = req.body

      console.log('Extracted fields:', { name, role, startYear, order, links })
      console.log('Image size:', image ? image.length : 0, 'characters')

      if (!name || !role || !startYear) {
        console.log('Validation failed:', { name: !!name, role: !!role, startYear: !!startYear })
        return res.status(400).json({
          success: false,
          message: 'Name, role, and startYear are required'
        })
      }

      // Check image size limit (MongoDB document limit is 16MB, base64 is ~4/3 larger)
      if (image && image.length > 500000) { // 500KB limit for base64 image
        console.log('Image too large:', image.length, 'characters')
        return res.status(400).json({
          success: false,
          message: `Image size too large (${Math.round(image.length/1000)}KB). Maximum allowed: 500KB.`
        })
      }

      const teamMember = new TeamMember({
        name: name.trim(),
        role: role.trim(),
        image: image?.trim(),
        bio: bio?.trim(),
        startYear: parseInt(startYear),
        endYear: endYear ? parseInt(endYear) : null,
        isActive,
        order: parseInt(order) || 999,
        links: {
          linkedin: links.linkedin?.trim() || '',
          github: links.github?.trim() || '',
          twitter: links.twitter?.trim() || '',
          website: links.website?.trim() || ''
        },
        updatedAt: new Date()
      })

      await teamMember.save()
      console.log('Team member created:', teamMember._id)

      return res.status(201).json({
        success: true,
        member: teamMember,
        message: 'Team member created successfully'
      })
    }

    if (req.method === 'PUT') {
      // Update team member
      const { id, ...updateData } = req.body

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Team member ID is required'
        })
      }

      const teamMember = await TeamMember.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        })
      }

      console.log('Team member updated:', teamMember._id)

      return res.json({
        success: true,
        member: teamMember,
        message: 'Team member updated successfully'
      })
    }

    if (req.method === 'DELETE') {
      // Delete team member
      const { id } = req.query

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Team member ID is required'
        })
      }

      const teamMember = await TeamMember.findByIdAndDelete(id)

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        })
      }

      console.log('Team member deleted:', teamMember._id)

      return res.json({
        success: true,
        message: 'Team member deleted successfully'
      })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error) {
    console.error('Team admin error:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)

    res.status(500).json({
      success: false,
      message: `Database error: ${error.message}`,
      error: process.env.NODE_ENV === 'development' ? error.stack : 'Internal server error'
    })
  }
}