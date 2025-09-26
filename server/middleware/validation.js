import { body, param, query, validationResult } from 'express-validator'

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

// Common validation rules
const emailValidation = body('email')
  .isEmail()
  .withMessage('Valid email is required')
  .normalizeEmail()
  .isLength({ max: 255 })
  .withMessage('Email must be less than 255 characters')

const nameValidation = body('name')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Name must be between 1 and 100 characters')
  .matches(/^[a-zA-Z\s\-'\.]+$/)
  .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods')

const passwordValidation = body('password')
  .isLength({ min: 8, max: 128 })
  .withMessage('Password must be between 8 and 128 characters')

// Contact message validation
export const validateContactMessage = [
  nameValidation,
  emailValidation,
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
    .withMessage('Subject contains invalid characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .custom((value) => {
      // Basic spam detection - optimized for performance
      const urlCount = (value.match(/https?:\/\/\S+/g) || []).length
      const emailCount = (value.match(/\S+@\S+\.\S+/g) || []).length

      if (urlCount > 2) throw new Error('Too many URLs')
      if (emailCount > 1) throw new Error('Too many emails')

      // Prevent common injection patterns
      const suspiciousPatterns = [
        /<script/i, /javascript:/i, /on\w+=/i,
        /\{\{.*\}\}/i, /%7B%7B.*%7D%7D/i,
        /\$\{.*\}/i, /%24%7B.*%7D/i,
        /eval\(/i, /function\(/i, /exec\(/i
      ]

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          throw new Error('Message contains prohibited content')
        }
      }

      return true
    }),
  handleValidationErrors
]

// Auth validation - allow "admin" username or email
export const validateLogin = [
  body('email')
    .custom((value) => {
      // Allow "admin" as a special case
      if (value === 'admin') return true

      // Otherwise validate as email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        throw new Error('Valid email is required')
      }

      if (value.length > 255) {
        throw new Error('Email must be less than 255 characters')
      }

      return true
    }),
  passwordValidation,
  handleValidationErrors
]

// Team member validation
export const validateTeamMember = [
  nameValidation,
  body('role')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s\-&]+$/)
    .withMessage('Role can only contain letters, spaces, hyphens, and ampersands'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
  body('order')
    .isInt({ min: 1, max: 100 })
    .withMessage('Order must be between 1 and 100'),
  body('image')
    .optional()
    .custom((value) => {
      if (value && !value.startsWith('data:image/') && !value.startsWith('/images/') && !value.startsWith('http')) {
        throw new Error('Invalid image format')
      }
      if (value && value.length > 50000) {
        throw new Error('Image data too large')
      }
      return true
    }),
  body('links.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),
  body('links.github')
    .optional()
    .isURL()
    .withMessage('GitHub must be a valid URL'),
  body('links.website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('links.email')
    .optional()
    .isEmail()
    .withMessage('Email must be valid'),
  handleValidationErrors
]

// MongoDB ObjectId validation
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
]

// Registration validation
export const validateRegistration = [
  nameValidation,
  emailValidation,
  body('school')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('School name must be between 2 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-&.,'"()]+$/)
    .withMessage('School name contains invalid characters')
    .custom((value) => {
      // Prevent common injection patterns
      const suspiciousPatterns = [
        /<script/i, /javascript:/i, /on\w+=/i,
        /\{\{.*\}\}/i, /%7B%7B.*%7D%7D/i,
        /\$\{.*\}/i, /%24%7B.*%7D/i
      ]

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          throw new Error('School name contains prohibited content')
        }
      }
      return true
    }),
  handleValidationErrors
]

// Feature flag validation
export const validateFeatureFlag = [
  param('key')
    .isIn(['projectSubmissionsEnabled', 'registrationEnabled', 'votingEnabled', 'adminPanelEnabled'])
    .withMessage('Invalid feature flag key'),
  body('value')
    .isBoolean()
    .withMessage('Feature flag value must be boolean'),
  handleValidationErrors
]