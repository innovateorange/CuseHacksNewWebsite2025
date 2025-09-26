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

// Project Schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  category: { type: String, required: true, maxlength: 50 },
  teamMembers: [{ type: String, maxlength: 100 }],
  technologies: [{ type: String, maxlength: 50 }],
  githubUrl: { type: String, maxlength: 500 },
  liveUrl: { type: String, maxlength: 500 },
  videoUrl: { type: String, maxlength: 500 },
  submissionDate: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false },
  votes: { type: Number, default: 0 }
})

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectDB()

    const {
      title,
      description,
      category,
      teamMembers,
      technologies,
      githubUrl,
      liveUrl,
      videoUrl
    } = req.body

    // Basic validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      })
    }

    // Length validations
    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Title must be less than 100 characters'
      })
    }

    if (description.length < 50 || description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Description must be between 50 and 1000 characters'
      })
    }

    // URL validations
    const urlRegex = /^https?:\/\/.+/
    if (githubUrl && !urlRegex.test(githubUrl)) {
      return res.status(400).json({
        success: false,
        message: 'GitHub URL must be a valid URL starting with http:// or https://'
      })
    }

    if (liveUrl && !urlRegex.test(liveUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Live URL must be a valid URL starting with http:// or https://'
      })
    }

    if (videoUrl && !urlRegex.test(videoUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Video URL must be a valid URL starting with http:// or https://'
      })
    }

    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i, /javascript:/i, /on\w+=/i,
      /\{\{.*\}\}/i, /\$\{.*\}/i,
      /eval\(/i, /function\(/i, /exec\(/i
    ]

    const fieldsToCheck = [title, description, category]
    for (const field of fieldsToCheck) {
      if (field) {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(field)) {
            return res.status(400).json({
              success: false,
              message: 'Project submission contains prohibited content'
            })
          }
        }
      }
    }

    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      teamMembers: Array.isArray(teamMembers) ? teamMembers.map(m => m.trim()).filter(m => m) : [],
      technologies: Array.isArray(technologies) ? technologies.map(t => t.trim()).filter(t => t) : [],
      githubUrl: githubUrl?.trim(),
      liveUrl: liveUrl?.trim(),
      videoUrl: videoUrl?.trim(),
      isApproved: false,
      votes: 0
    })

    await project.save()

    res.status(201).json({
      success: true,
      projectId: project._id,
      message: 'Project submitted successfully! It will be reviewed and published soon.',
      project: {
        title: project.title,
        description: project.description,
        category: project.category,
        submissionDate: project.submissionDate,
        isApproved: project.isApproved
      }
    })
  } catch (error) {
    console.error('Project submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Project submission failed. Please try again later.'
    })
  }
}