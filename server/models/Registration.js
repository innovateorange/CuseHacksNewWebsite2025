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
  },
  resumeUrl: {
    type: String,
    required: false
  },
  resumeFileName: {
    type: String,
    required: false
  },
  resumeFileSize: {
    type: Number,
    required: false
  },
  resumeUploadDate: {
    type: Date,
    required: false
  },
  hasResume: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.model('Registration', registrationSchema)