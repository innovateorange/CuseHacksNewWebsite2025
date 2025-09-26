import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  teamMembers: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  githubUrl: {
    type: String,
    trim: true
  },
  liveUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  votes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.model('Project', projectSchema)