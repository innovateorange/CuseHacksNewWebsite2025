import mongoose from 'mongoose'

// Simple database connection
let cachedDb = null
async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI)
    cachedDb = db
    return db
  } catch (error) {
    console.error('DB connection error:', error)
    throw error
  }
}

// Team Member Schema
const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  role: { type: String, required: true, maxlength: 100 },
  image: { type: String, maxlength: 500 },
  bio: { type: String, maxlength: 1000 },
  startYear: { type: Number, required: true },
  endYear: { type: Number, default: null },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 999 },
  links: {
    linkedin: { type: String, maxlength: 500 },
    github: { type: String, maxlength: 500 },
    twitter: { type: String, maxlength: 500 },
    website: { type: String, maxlength: 500 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema)

// Default team members (from your mockData.ts)
const defaultTeamMembers = [
  {
    _id: '1',
    name: 'Jason Kapodistrias',
    role: 'President',
    image: '/images/team/Jason.jpg',
    bio: 'Some of my hobbies are music production and hiking.',
    startYear: 2025,
    endYear: null,
    isActive: true,
    order: 1,
    links: { linkedin: '' }
  },
  {
    _id: '2',
    name: 'Alan Tom',
    role: 'Vice President',
    image: '/images/team/Alan.jpg',
    bio: 'Hobbies: Playing video games, cooking, gardening, and I\'m also interested in aquascaping!',
    startYear: 2025,
    endYear: null,
    isActive: true,
    order: 2,
    links: { linkedin: '' }
  },
  {
    _id: '3',
    name: 'Kamaljit Aulakh',
    role: 'Web Dev Chair',
    image: '/images/team/Kamaljit.jpg',
    bio: 'Fueled by chai and fluent in at least five languages (some human, some code).',
    startYear: 2025,
    endYear: null,
    isActive: true,
    order: 3,
    links: { linkedin: '' }
  },
  {
    _id: '4',
    name: 'Danielle Lawton',
    role: 'Secretary',
    image: '/images/team/Dani.jpg',
    bio: 'CS major from Harvard, MA. Lover of big dogs.',
    startYear: 2025,
    endYear: null,
    isActive: true,
    order: 4,
    links: { linkedin: '' }
  },
  {
    _id: '5',
    name: 'Hunter Mimaroglu',
    role: 'Sponsorship',
    image: '/images/team/Hunter.jpg',
    bio: 'Some of my hobbies are basketball and mountain biking!',
    startYear: 2025,
    endYear: null,
    isActive: true,
    order: 7,
    links: { linkedin: '' }
  },
  {
    _id: '6',
    name: 'Alex Levy',
    role: 'Design Chair',
    image: '/images/team/Alex.jpg',
    bio: 'I like creating stuff, playing video games, and watching cat videos!',
    startYear: 2025,
    endYear: null,
    isActive: true,
    order: 8,
    links: { linkedin: '' }
  }
]

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectDB()

    // Get team members from database
    const teamMembers = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 })

    // If no team members in database, return default team members
    if (teamMembers.length === 0) {
      console.log('No team members in DB, returning default team members')
      return res.json(defaultTeamMembers)
    }

    return res.json(teamMembers)

  } catch (error) {
    console.error('Team fetch error:', error)

    // Fallback to default team members on database error
    console.log('Database error, returning default team members')
    return res.json(defaultTeamMembers)
  }
}