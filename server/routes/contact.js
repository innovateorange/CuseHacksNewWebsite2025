import express from 'express'
import ContactMessage from '../models/ContactMessage.js'
import { authenticateAdmin } from '../middleware/auth.js'
import { contactLimiter } from '../middleware/security.js'
import { validateContactMessage, validateObjectId } from '../middleware/validation.js'

const router = express.Router()

// Submit contact message
router.post('/', contactLimiter, validateContactMessage, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message
    })

    await contactMessage.save()

    res.status(201).json({
      success: true,
      messageId: contactMessage._id,
      message: 'Message sent successfully'
    })
  } catch (error) {
    console.error('Contact message error:', error)
    res.status(500).json({ success: false, message: 'Failed to send message' })
  }
})

// Get all contact messages (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    
    const stats = {
      total: messages.length,
      unread: messages.filter(m => !m.isRead).length,
      new: messages.filter(m => m.status === 'new').length,
      replied: messages.filter(m => m.status === 'replied').length
    }

    res.json({ messages, stats })
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ message: 'Failed to get messages' })
  }
})

// Mark message as read
router.patch('/:id/read', authenticateAdmin, validateObjectId, async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true })
    res.json({ success: true })
  } catch (error) {
    console.error('Mark read error:', error)
    res.status(500).json({ message: 'Failed to mark as read' })
  }
})

// Update message status
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body
    await ContactMessage.findByIdAndUpdate(req.params.id, { 
      status, 
      isRead: true 
    })
    res.json({ success: true })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ message: 'Failed to update status' })
  }
})

// Delete message
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ message: 'Failed to delete message' })
  }
})

export default router