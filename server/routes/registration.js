import express from 'express'
import Registration from '../models/Registration.js'
import { authenticateAdmin } from '../middleware/auth.js'
import { contactLimiter } from '../middleware/security.js'
import { validateRegistration, validateObjectId } from '../middleware/validation.js'

const router = express.Router()

// Submit registration
router.post('/', contactLimiter, validateRegistration, async (req, res) => {
  try {
    const { name, email, school } = req.body

    // Check if email already exists
    const existingRegistration = await Registration.findOne({ email })
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered'
      })
    }

    const registration = new Registration({
      name,
      email,
      school,
      status: 'pending'
    })

    await registration.save()

    res.status(201).json({
      success: true,
      registrationId: registration._id,
      message: 'Registration submitted successfully! You will receive a confirmation email soon.'
    })
  } catch (error) {
    console.error('Registration error:', error)

    // Handle duplicate key error (email uniqueness)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered'
      })
    }

    res.status(500).json({ success: false, message: 'Failed to submit registration' })
  }
})

// Get all registrations (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) {
      filter.status = req.query.status
    }

    const [registrations, total] = await Promise.all([
      Registration.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Registration.countDocuments(filter)
    ])

    const stats = await Registration.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const statusStats = {
      total,
      pending: 0,
      confirmed: 0,
      waitlisted: 0
    }

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count
    })

    res.json({
      registrations,
      stats: statusStats,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get registrations error:', error)
    res.status(500).json({ message: 'Failed to get registrations' })
  }
})

// Update registration status (admin only)
router.patch('/:id/status', authenticateAdmin, validateObjectId, async (req, res) => {
  try {
    const { status } = req.body

    if (!['pending', 'confirmed', 'waitlisted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, confirmed, or waitlisted'
      })
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      })
    }

    res.json({ success: true, registration })
  } catch (error) {
    console.error('Update registration status error:', error)
    res.status(500).json({ message: 'Failed to update registration status' })
  }
})

// Delete registration (admin only)
router.delete('/:id', authenticateAdmin, validateObjectId, async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id)

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      })
    }

    res.json({ success: true, message: 'Registration deleted successfully' })
  } catch (error) {
    console.error('Delete registration error:', error)
    res.status(500).json({ message: 'Failed to delete registration' })
  }
})

export default router