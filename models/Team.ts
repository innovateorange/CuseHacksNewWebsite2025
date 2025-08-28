import mongoose, { Document, Schema } from 'mongoose';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  year: number;
  isActive: boolean;
  order: number;
  links: {
    github?: string;
    linkedin?: string;
    email?: string;
    website?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamMemberDocument extends TeamMember, Document {}

const teamSchema = new Schema<TeamMemberDocument>({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return v.startsWith('data:image') || v.startsWith('http') || v.startsWith('/');
      },
      message: 'Image must be a valid Base64 string, data URL, or file path'
    }
  },
  bio: {
    type: String,
    default: ''
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
    required: true
  },
  links: {
    github: String,
    linkedin: String,
    email: String,
    website: String
  }
}, { timestamps: true });

// Add a pre-save hook to update the updatedAt timestamp
teamSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Team = mongoose.models.Team || mongoose.model<TeamMemberDocument>('Team', teamSchema);

export default Team; 