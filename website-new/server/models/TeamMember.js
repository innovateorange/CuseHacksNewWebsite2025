import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: '/images/robot-mascot-transparent.png'
  },
  bio: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  links: {
    github: String,
    linkedin: String,
    email: String,
    website: String
  }
}, {
  timestamps: true
})

export default mongoose.model('TeamMember', teamMemberSchema)