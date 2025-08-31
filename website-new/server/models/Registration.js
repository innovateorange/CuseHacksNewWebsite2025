import mongoose from 'mongoose'

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  school: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'waitlisted'],
    default: 'pending'
  }
}, {
  timestamps: true
})

export default mongoose.model('Registration', registrationSchema)