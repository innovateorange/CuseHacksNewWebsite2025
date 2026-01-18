import express from 'express'
import FeatureFlag from '../models/FeatureFlag.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Initialize default feature flags
const initializeFeatureFlags = async () => {
  const defaultFlags = [
    { key: 'projectSubmissionsEnabled', value: false, description: 'Allow users to submit datathon projects' },
    { key: 'registrationEnabled', value: true, description: 'Allow new users to register for the datathon' },
    { key: 'votingEnabled', value: true, description: 'Allow users to vote on submitted projects' },
    { key: 'adminPanelEnabled', value: true, description: 'Enable admin panel access' }
  ]

  for (const flag of defaultFlags) {
    const existing = await FeatureFlag.findOne({ key: flag.key })
    if (!existing) {
      await FeatureFlag.create(flag)
    }
  }
}

// Get all feature flags
router.get('/', async (req, res) => {
  try {
    await initializeFeatureFlags()
    const flags = await FeatureFlag.find()
    
    // Convert to object format expected by frontend
    const flagsObj = {}
    flags.forEach(flag => {
      flagsObj[flag.key] = flag.value
    })
    
    res.json(flagsObj)
  } catch (error) {
    console.error('Get feature flags error:', error)
    res.status(500).json({ message: 'Failed to get feature flags' })
  }
})

// Update feature flag
router.patch('/:key', authenticateAdmin, async (req, res) => {
  try {
    const { value } = req.body
    
    await FeatureFlag.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { upsert: true, new: true }
    )

    // Return all flags
    const flags = await FeatureFlag.find()
    const flagsObj = {}
    flags.forEach(flag => {
      flagsObj[flag.key] = flag.value
    })

    res.json({ success: true, flags: flagsObj })
  } catch (error) {
    console.error('Update feature flag error:', error)
    res.status(500).json({ message: 'Failed to update feature flag' })
  }
})

export default router