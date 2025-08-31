import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'

// Security middleware
import { setupSecurity, validateAndSanitize } from './middleware/security.js'

// Import routes
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contact.js'
import teamRoutes from './routes/team.js'
import featureFlagRoutes from './routes/featureFlags.js'

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 3001

// Setup security middleware
setupSecurity(app)

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-domain.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing middleware with size limits
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ 
  extended: true, 
  limit: '1mb',
  parameterLimit: 20
}))

// Apply input validation and sanitization
app.use(validateAndSanitize)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/feature-flags', featureFlagRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CuseHacks API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message)
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    })
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid ID format' 
    })
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ 
      success: false, 
      message: 'Duplicate entry' 
    })
  }
  
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Server error' 
      : err.message 
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})