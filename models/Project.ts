import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  teamMembers: [{
    type: String,
    required: [true, 'At least one team member is required'],
  }],
  githubLink: {
    type: String,
    trim: true,
  },
  demoLink: {
    type: String,
    trim: true,
  },
  technologies: [{
    type: String,
    required: [true, 'At least one technology is required'],
  }],
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project; 