import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { TeamMember, TeamMemberDocument } from '../models/Team';

// Create the Team model schema
const teamSchema = new mongoose.Schema<TeamMemberDocument>({
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

const Team = mongoose.models.Team || mongoose.model<TeamMemberDocument>('Team', teamSchema);

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    const count = await Team.countDocuments();
    console.log(`Total team members in database: ${count}`);

    if (count === 0) {
      console.log('Database is empty');
    } else {
      const teamMembers = await Team.find();
      console.log('Team members in database:', teamMembers.map(m => ({
        name: m.name,
        role: m.role,
        year: m.year,
        isActive: m.isActive
      })));
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase(); 