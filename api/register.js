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
  resumeUrl: { type: String, required: false },
  resumeFileName: { type: String, required: false },
  resumeUploadDate: { type: Date, required: false },
  hasResume: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'waitlisted'], default: 'pending' }
})

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema)

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
      name,
      email,
      school,
      graduationYear,
      major,
      experience,
      dietaryRestrictions,
      emergencyContact,
      emergencyPhone,
      resumeUrl,
      resumeFileName,
      resumeUploadDate,
      hasResume
    } = req.body

    // Basic validation
    if (!name || !email || !school) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and school are required'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      })
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({ email: email.toLowerCase() })
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered'
      })
    }

    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i, /javascript:/i, /on\w+=/i,
      /\{\{.*\}\}/i, /\$\{.*\}/i,
      /eval\(/i, /function\(/i, /exec\(/i
    ]

    const fieldsToCheck = [name, school, major, experience, dietaryRestrictions]
    for (const field of fieldsToCheck) {
      if (field) {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(field)) {
            return res.status(400).json({
              success: false,
              message: 'Registration contains prohibited content'
            })
          }
        }
      }
    }

    const registration = new Registration({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      school: school.trim(),
      graduationYear: graduationYear?.trim(),
      major: major?.trim(),
      experience: experience?.trim(),
      dietaryRestrictions: dietaryRestrictions?.trim(),
      emergencyContact: emergencyContact?.trim(),
      emergencyPhone: emergencyPhone?.trim(),
      resumeUrl: resumeUrl || null,
      resumeFileName: resumeFileName || null,
      resumeUploadDate: resumeUploadDate ? new Date(resumeUploadDate) : null,
      hasResume: Boolean(hasResume && resumeUrl),
      status: 'pending'
    })

    await registration.save()
    console.log('Registration saved to DB:', registration._id)

    res.status(201).json({
      success: true,
      registrationId: registration._id,
      message: 'Registration successful! You\'ll receive a confirmation email soon.',
      registration: {
        name: registration.name,
        email: registration.email,
        school: registration.school,
        status: registration.status,
        registrationDate: registration.registrationDate
      }
    })
  } catch (error) {
    console.error('Registration error:', error)

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.'
    })
  }
}