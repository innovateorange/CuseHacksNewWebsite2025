import mongoose from 'mongoose'

const featureFlagSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

export default mongoose.model('FeatureFlag', featureFlagSchema)