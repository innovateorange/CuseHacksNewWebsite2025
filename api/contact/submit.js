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
  message: { type: String, required: true, minlength: 3, maxlength: 2000 },
  submittedAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  status: { type: String, enum: ['new', 'replied'], default: 'new' }
})

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema)

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

    const { name, email, subject, message } = req.body

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
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

    // Length validations
    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name must be less than 100 characters'
      })
    }

    if (subject.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Subject must be less than 200 characters'
      })
    }

    if (message.length < 3 || message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 3 and 2000 characters'
      })
    }

    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i, /javascript:/i, /on\w+=/i,
      /\{\{.*\}\}/i, /%7B%7B.*%7D%7D/i,
      /\$\{.*\}/i, /%24%7B.*%7D/i,
      /eval\(/i, /function\(/i, /exec\(/i
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(message) || pattern.test(subject) || pattern.test(name)) {
        return res.status(400).json({
          success: false,
          message: 'Message contains prohibited content'
        })
      }
    }

    // Save to MongoDB
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      isRead: false,
      status: 'new'
    })

    await contactMessage.save()
    console.log('Contact message saved to DB:', contactMessage._id)

    res.status(201).json({
      success: true,
      messageId: contactMessage._id,
      message: 'Message sent successfully! We\'ll get back to you soon.'
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    })
  }
}