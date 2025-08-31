import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

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