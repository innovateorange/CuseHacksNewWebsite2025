import jwt from 'jsonwebtoken'

export const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded
    next()
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' })
  }
}

export const createAdminToken = (adminData) => {
  return jwt.sign(adminData, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// Middleware wrapper for Vercel functions
export const withAuth = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.admin = decoded
      return await handler(req, res)
    } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' })
    }
  }
}