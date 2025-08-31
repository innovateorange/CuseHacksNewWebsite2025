import * as dotenv from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, default: '' },
  year: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, required: true },
  links: {
    github: String,
    linkedin: String,
    email: String,
    website: String
  }
}, { timestamps: true });

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

// Function to generate a placeholder image URL
const getPlaceholderImage = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=560BAD&color=fff&size=256`
};

// Definitive list of team members
const definitiveTeamMembers = [
  {
    name: 'Jason Kapodistrias',
    role: 'President',
    image: getPlaceholderImage('Jason Kapodistrias'),
    bio: 'Some of my hobbies are music production and hiking.',
    year: 2025,
    isActive: true,
    order: 1,
    links: { linkedin: '' }
  },
  {
    name: 'Alan Tom',
    role: 'Vice President',
    image: getPlaceholderImage('Alan Tom'),
    bio: 'Hobbies: Playing video games, cooking, gardening, and I\'m also interested in aquascaping!',
    year: 2025,
    isActive: true,
    order: 2,
    links: { linkedin: '' }
  },
  {
    name: 'Kamaljit Aulakh',
    role: 'Web Dev Chair',
    image: '/team_picture/Kamaljit.jpg',
    bio: 'Fueled by chai and fluent in at least five languages (some human, some code).',
    year: 2025,
    isActive: true,
    order: 3,
    links: { linkedin: '' }
  },
  {
    name: 'Danielle Lawton',
    role: 'Secretary',
    image: '/team_picture/Dani.jpg',
    bio: 'CS major from Harvard, MA. Lover of big dogs.',
    year: 2025,
    isActive: true,
    order: 4,
    links: { linkedin: '' }
  },
  {
    name: 'Caleb Aguirre-Leon',
    role: 'Sponsorship',
    image: '/team_picture/Caleb.jpeg',
    bio: 'I\'m a singer/songwriter who produces his own music.',
    year: 2025,
    isActive: true,
    order: 5,
    links: { linkedin: '' }
  },
  {
    name: 'Andrew Markarian',
    role: 'Sponsorship',
    image: '/team_picture/Andrew.jpg',
    bio: 'I\'ve been attempting to do a 180 jump on my snowboard for the past four years (unsuccessful).',
    year: 2025,
    isActive: true,
    order: 6,
    links: { linkedin: '' }
  },
  {
    name: 'Hunter Mimaroglu',
    role: 'Sponsorship',
    image: '/team_picture/Hunter.jpg',
    bio: 'Some of my hobbies are basketball and mountain biking!',
    year: 2025,
    isActive: true,
    order: 7,
    links: { linkedin: '' }
  },
  {
    name: 'Alex Levy',
    role: 'Design Chair',
    image: '/team_picture/Alex.jpg',
    bio: 'I like creating stuff, playing video games, and watching cat videos!',
    year: 2025,
    isActive: true,
    order: 8,
    links: { linkedin: '' }
  },
  {
    name: 'Phebe Kwarteng',
    role: 'Design Chair',
    image: '/team_picture/Phebee.jpg',
    bio: 'I am pescatarian!',
    year: 2025,
    isActive: true,
    order: 9,
    links: { linkedin: '' }
  },
  {
    name: 'Peter Cheng',
    role: 'Senior Workshop Lead',
    image: '/team_picture/Peter.jpg',
    bio: 'Sometimes I also do photography!',
    year: 2025,
    isActive: true,
    order: 10,
    links: { linkedin: '' }
  },
  {
    name: 'Adhishree Viti',
    role: 'Workshop Lead',
    image: '/team_picture/Adi.jpg',
    bio: 'Some of my hobbies are badminton and reading.',
    year: 2025,
    isActive: true,
    order: 11,
    links: { linkedin: '' }
  },
  {
    name: 'Liam Wasserman',
    role: 'Workshop Lead',
    image: '/team_picture/Liam.jpg',
    bio: 'I have seven cats.',
    year: 2025,
    isActive: true,
    order: 12,
    links: { linkedin: '' }
  },
  {
    name: 'Mackenzie Anderson',
    role: 'PR Chair',
    image: '/team_picture/Mackenzie.jpg',
    bio: 'I lived in Scotland for half a year!',
    year: 2025,
    isActive: true,
    order: 13,
    links: { linkedin: '' }
  },
  {
    name: 'Daniela Lat',
    role: 'Treasurer',
    image: getPlaceholderImage('Daniela Lat'),
    bio: 'I love to play sports and cook!',
    year: 2025,
    isActive: true,
    order: 14,
    links: { linkedin: '' }
  },
  {
    name: 'Leah Bowman',
    role: 'Illustrator',
    image: '/team_picture/Leah.jpeg',
    bio: 'I love sleeping, Formula 1, and reading (in that order).',
    year: 2025,
    isActive: true,
    order: 15,
    links: { linkedin: '' }
  },
  {
    name: 'Dorothea Dolan',
    role: 'Illustrator',
    image: '/team_picture/Dolan.jpeg',
    bio: 'I like birds.',
    year: 2025,
    isActive: true,
    order: 16,
    links: { linkedin: '' }
  },
  // Alumni
  {
    name: 'Schneider Joachim',
    role: 'Alumni',
    image: '/team_picture/Schneider.jpeg',
    bio: 'I am a professional sleeper.',
    year: 2024,
    isActive: false,
    order: 1,
    links: { linkedin: '' }
  },
  {
    name: 'Anthony Mazzacane',
    role: 'Alumni',
    image: '/team_picture/Anthony.png',
    bio: 'Hiker, hacker, coder.',
    year: 2024,
    isActive: false,
    order: 2,
    links: { linkedin: '' }
  },
  {
    name: 'Ekaterina Kladova',
    role: 'Alumni',
    image: '/team_picture/Ekaterina.png',
    bio: 'Got a Master\'s degree only to figure out that I like to be a coding monkey.',
    year: 2024,
    isActive: false,
    order: 3,
    links: { linkedin: '' }
  }
];

async function resetDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Drop the existing collection
    console.log('\nDropping existing team collection...');
    await mongoose.connection.collection('teams').drop().catch(() => {
      console.log('Collection did not exist, skipping drop');
    });

    // Insert the definitive team members
    console.log('\nSeeding database with definitive team members...');
    await Team.insertMany(definitiveTeamMembers);
    
    // Verify the data
    const count = await Team.countDocuments();
    console.log(`\nVerification: ${count} team members inserted`);
    
    const teamMembers = await Team.find().lean();
    console.log('\nInserted team members:');
    teamMembers.forEach(member => {
      console.log(`- ${member.name} (${member.role}, ${member.year})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

resetDatabase(); 