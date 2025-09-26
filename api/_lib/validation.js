// Validation helpers for Vercel functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

export const validateName = (name) => {
  if (!name || typeof name !== 'string') return false
  const trimmed = name.trim()
  return trimmed.length >= 1 && trimmed.length <= 100 && /^[a-zA-Z\s\-'\.]+$/.test(trimmed)
}

export const validatePassword = (password) => {
  return password && typeof password === 'string' && password.length >= 8 && password.length <= 128
}

export const validateContactMessage = (data) => {
  const errors = []

  if (!validateName(data.name)) {
    errors.push('Name must be between 1 and 100 characters and contain only letters, spaces, hyphens, apostrophes, and periods')
  }

  if (!validateEmail(data.email)) {
    errors.push('Valid email is required')
  }

  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length < 1 || data.subject.trim().length > 200) {
    errors.push('Subject must be between 1 and 200 characters')
  }

  if (!data.subject || !/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(data.subject)) {
    errors.push('Subject contains invalid characters')
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10 || data.message.trim().length > 2000) {
    errors.push('Message must be between 10 and 2000 characters')
  }

  // Basic spam detection
  if (data.message) {
    const urlCount = (data.message.match(/https?:\/\/\S+/g) || []).length
    const emailCount = (data.message.match(/\S+@\S+\.\S+/g) || []).length

    if (urlCount > 2) errors.push('Too many URLs in message')
    if (emailCount > 1) errors.push('Too many emails in message')

    // Prevent common injection patterns
    const suspiciousPatterns = [
      /<script/i, /javascript:/i, /on\w+=/i,
      /\{\{.*\}\}/i, /%7B%7B.*%7D%7D/i,
      /\$\{.*\}/i, /%24%7B.*%7D/i,
      /eval\(/i, /function\(/i, /exec\(/i
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(data.message)) {
        errors.push('Message contains prohibited content')
        break
      }
    }
  }

  return { isValid: errors.length === 0, errors }
}

export const validateLogin = (data) => {
  const errors = []

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else if (data.email !== 'admin' && !validateEmail(data.email)) {
    errors.push('Valid email is required')
  }

  if (!validatePassword(data.password)) {
    errors.push('Password must be between 8 and 128 characters')
  }

  return { isValid: errors.length === 0, errors }
}

export const validateRegistration = (data) => {
  const errors = []

  if (!validateName(data.name)) {
    errors.push('Name must be between 1 and 100 characters and contain only letters, spaces, hyphens, apostrophes, and periods')
  }

  if (!validateEmail(data.email)) {
    errors.push('Valid email is required')
  }

  if (!data.school || typeof data.school !== 'string' || data.school.trim().length < 2 || data.school.trim().length > 200) {
    errors.push('School name must be between 2 and 200 characters')
  }

  if (data.school && !/^[a-zA-Z0-9\s\-&.,'"()]+$/.test(data.school)) {
    errors.push('School name contains invalid characters')
  }

  // Prevent common injection patterns in school field
  if (data.school) {
    const suspiciousPatterns = [
      /<script/i, /javascript:/i, /on\w+=/i,
      /\{\{.*\}\}/i, /%7B%7B.*%7D%7D/i,
      /\$\{.*\}/i, /%24%7B.*%7D/i
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(data.school)) {
        errors.push('School name contains prohibited content')
        break
      }
    }
  }

  return { isValid: errors.length === 0, errors }
}

export const validateMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

export const validateFeatureFlag = (key, value) => {
  const validKeys = ['projectSubmissionsEnabled', 'registrationEnabled', 'votingEnabled', 'adminPanelEnabled']
  const errors = []

  if (!validKeys.includes(key)) {
    errors.push('Invalid feature flag key')
  }

  if (typeof value !== 'boolean') {
    errors.push('Feature flag value must be boolean')
  }

  return { isValid: errors.length === 0, errors }
}