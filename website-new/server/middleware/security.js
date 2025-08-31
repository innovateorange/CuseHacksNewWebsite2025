import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss'
import hpp from 'hpp'

// Rate limiting configurations
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 contact submissions per hour
  message: {
    error: 'Too many contact messages from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Security middleware setup
export const setupSecurity = (app) => {
  // Set security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:3001", "https://api.cusehacks.org"]
      }
    },
    crossOriginEmbedderPolicy: false
  }))

  // Prevent NoSQL injection
  app.use(mongoSanitize({
    replaceWith: '_'
  }))

  // Prevent HTTP Parameter Pollution
  app.use(hpp({
    whitelist: ['tags', 'technologies'] // Allow arrays for these fields
  }))

  // Apply general rate limiting
  app.use('/api', generalLimiter)
}

// XSS sanitization function - optimized for performance
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

// Input validation middleware
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