import express from 'express'
import { createAdminToken } from '../middleware/auth.js'
import { authLimiter } from '../middleware/security.js'
import { validateLogin } from '../middleware/validation.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Admin login
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body

    // Check against environment variables (in production, use database)
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' })
    }

    // Simple check for demo - in production, hash and store in database
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' })
    }

    const token = createAdminToken({ email: email, role: 'admin' })

    res.json({
      success: true,
      token,
      user: { email, role: 'admin' }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router