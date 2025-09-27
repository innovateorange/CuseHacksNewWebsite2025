import xss from 'xss'

// Rate limiting for Vercel functions (simulated in-memory store)
// In production, use a proper cache like Redis or Vercel KV
const rateLimitStore = new Map()

export const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return (req, res, next) => {
    const key = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    const now = Date.now()

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      return next()
    }

    const store = rateLimitStore.get(key)

    if (now > store.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      return next()
    }

    if (store.count >= max) {
      return res.status(429).json({
        error: 'Too many requests from this IP, please try again later.'
      })
    }

    store.count++
    next()
  }
}

// Specific rate limiters
export const generalLimiter = rateLimit(15 * 60 * 1000, 100) // 100 requests per 15 minutes
export const authLimiter = rateLimit(15 * 60 * 1000, 5) // 5 attempts per 15 minutes
export const contactLimiter = rateLimit(60 * 60 * 1000, 10) // 10 submissions per hour
export const uploadLimiter = rateLimit(60 * 60 * 1000, 5) // 5 uploads per hour

// XSS sanitization function
const xssOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script']
}

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input, xssOptions)
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }

  return input
}

// Input validation middleware for Vercel functions
export const validateAndSanitize = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeInput(req.body)
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeInput(req.query)
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeInput(req.params)
  }

  next()
}

// CORS handler for Vercel functions
export const cors = (req, res, next) => {
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-domain.com'])
    : ['http://localhost:5173', 'http://127.0.0.1:5173']

  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (next) next()
}

// Security headers for Vercel functions
export const setSecurityHeaders = (res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.cusehacks.org")
}

// File validation function
export const validateFileUpload = (file) => {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['application/pdf']

  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF files are allowed' }
  }

  return { valid: true }
}

// Apply rate limit as async function for Vercel
export const applyRateLimit = async (req, res) => {
  return new Promise((resolve, reject) => {
    uploadLimiter(req, res, (result) => {
      if (result) {
        reject(new Error('Rate limit exceeded'))
      } else {
        resolve()
      }
    })
  })
}

// Auth requirement placeholder
export const requireAuth = (req, res, next) => {
  // For now, skip auth - add proper auth later if needed
  if (next) next()
}