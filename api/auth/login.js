import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // Check environment variables
    if (!process.env.ADMIN_PASSWORD_HASH || !process.env.JWT_SECRET) {
      console.error('Missing environment variables')
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      })
    }

    // Verify credentials
    if (email === 'admin') {
      const isValidPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)

      if (isValidPassword) {
        // Generate real JWT token
        const token = jwt.sign(
          { userId: 'admin', email: 'admin', role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        )

        return res.json({
          success: true,
          token,
          user: {
            email: 'admin',
            role: 'admin'
          },
          message: 'Login successful'
        })
      }
    }

    // Always return same error message to prevent user enumeration
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}