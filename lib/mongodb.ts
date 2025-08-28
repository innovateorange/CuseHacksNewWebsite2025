// MONGODB_INTEGRATION: This file provides mock data for UI preview
// When ready to connect to MongoDB:
// 1. Install MongoDB dependencies: npm install mongodb
// 2. Implement proper MongoDB connection

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// After the check, we know MONGODB_URI is defined
const MONGODB_CONNECTION_STRING = MONGODB_URI as string;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_CONNECTION_STRING, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

// Mock data functions for UI preview
export const getMongoDb = async () => {
  console.log("MongoDB connection temporarily disabled for UI preview")
  return null
}

// Mock team members data
export const getMockTeamMembers = () => [
  { id: 1, name: "Alex Johnson", role: "President", year: "2025", image: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Jamie Smith", role: "Vice President", year: "2025", image: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "Taylor Brown", role: "Treasurer", year: "2025", image: "/placeholder.svg?height=200&width=200" },
  {
    id: 4,
    name: "Morgan Lee",
    role: "Event Coordinator",
    year: "2025",
    image: "/placeholder.svg?height=200&width=200",
  },
  { id: 5, name: "Casey Wilson", role: "Marketing Lead", year: "2025", image: "/placeholder.svg?height=200&width=200" },
]

// Mock events data
export const getMockEvents = () => [
  {
    id: 1,
    title: "Opening Ceremony",
    date: "2025-10-04",
    time: "09:00 AM - 10:00 AM",
    location: "Life Sciences Building, Main Auditorium",
    description: "Join us for the official kickoff of CuseHacks 2025!",
  },
  {
    id: 2,
    title: "Workshop: Intro to AI",
    date: "2025-10-04",
    time: "11:00 AM - 12:30 PM",
    location: "Room 132, Computer Science Building",
    description: "Learn the basics of artificial intelligence and machine learning.",
  },
  {
    id: 3,
    title: "Hacking Ends",
    date: "2025-10-05",
    time: "09:00 AM",
    location: "All Venues",
    description: "Pencils down! Time to submit your projects.",
  },
]

// Mock sponsors data
export const getMockSponsors = () => [
  { id: 1, name: "TechCorp", tier: "Platinum", logo: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "InnovateTech", tier: "Platinum", logo: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "DataSystems", tier: "Gold", logo: "/placeholder.svg?height=200&width=200" },
]

// Mock prizes data
export const getMockPrizes = () => [
  { id: 1, category: "Best Overall", description: "Best overall project", value: "$1,000" },
  { id: 2, category: "Best UI/UX", description: "Best user interface and experience", value: "$500" },
  { id: 3, category: "Best Hardware Hack", description: "Best hardware project", value: "$500" },
]
