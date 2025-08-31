import express from 'express'
import TeamMember from '../models/TeamMember.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all team members
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true }).sort({ order: 1 })
    res.json(teamMembers)
  } catch (error) {
    console.error('Get team error:', error)
    res.status(500).json({ message: 'Failed to get team members' })
  }
})

// Get all team members (admin - includes inactive)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ order: 1 })
    res.json(teamMembers)
  } catch (error) {
    console.error('Get team admin error:', error)
    res.status(500).json({ message: 'Failed to get team members' })
  }
})

// Add team member
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const teamMember = new TeamMember(req.body)
    await teamMember.save()
    res.status(201).json({ success: true, member: teamMember })
  } catch (error) {
    console.error('Add team member error:', error)
    res.status(500).json({ message: 'Failed to add team member' })
  }
})

// Update team member
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    )
    res.json(teamMember)
  } catch (error) {
    console.error('Update team member error:', error)
    res.status(500).json({ message: 'Failed to update team member' })
  }
})

// Delete team member
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete team member error:', error)
    res.status(500).json({ message: 'Failed to delete team member' })
  }
})

export default router