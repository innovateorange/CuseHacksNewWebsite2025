import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import mongoose from 'mongoose';

// Default fallback image as base64 data URL (a simple gray placeholder)
const DEFAULT_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAZABkAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t0UKMCloooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z"

// MONGODB_INTEGRATION: This file is temporarily modified for UI preview
// When ready to connect to MongoDB:
// 1. Uncomment the MongoDB connection code
// 2. Implement proper CRUD operations with MongoDB
// 3. Remove the mock data functions

// Function to generate a placeholder image URL
const getPlaceholderImage = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=560BAD&color=fff&size=256`
}

// Definitive list of CuseHacks 2025 E-Board Members & Alumni
export const definitiveTeamMembers = [
  {
    _id: '1', // Added dummy IDs for consistency if needed by frontend key props
    name: 'Jason Kapodistrias',
    role: 'President',
    image: getPlaceholderImage('Jason Kapodistrias'), // Placeholder
    bio: 'Some of my hobbies are music production and hiking.',
    year: 2025,
    isActive: true,
    order: 1,
    links: { linkedin: '' }
  },
  {
    _id: '2',
    name: 'Alan Tom',
    role: 'Vice President',
    image: getPlaceholderImage('Alan Tom'), // Placeholder
    bio: 'Hobbies: Playing video games, cooking, gardening, and I\'m also interested in aquascaping!',
    year: 2025, // Assuming 2025, adjust if needed
    isActive: true,
    order: 2,
    links: { linkedin: '' }
  },
  {
    _id: '3',
    name: 'Kamaljit Aulakh',
    role: 'Web Dev Chair',
    image: '/team_picture/Kamaljit.jpg',
    bio: 'Fueled by chai and fluent in at least five languages (some human, some code).',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 3,
    links: { linkedin: '' }
  },
  {
    _id: '4',
    name: 'Danielle Lawton',
    role: 'Secretary',
    image: '/team_picture/Dani.jpg',
    bio: 'CS major from Harvard, MA. Lover of big dogs.',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 4,
    links: { linkedin: '' }
  },
  {
    _id: '5',
    name: 'Caleb Aguirre-Leon',
    role: 'Sponsorship',
    image: '/team_picture/Caleb.jpeg',
    bio: 'I\'m a singer/songwriter who produces his own music.',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 5,
    links: { linkedin: '' }
  },
  {
    _id: '6',
    name: 'Andrew Markarian',
    role: 'Sponsorship',
    image: '/team_picture/Andrew.jpg',
    bio: 'I\'ve been attempting to do a 180 jump on my snowboard for the past four years (unsuccessful).',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 6,
    links: { linkedin: '' }
  },
  {
    _id: '7',
    name: 'Hunter Mimaroglu',
    role: 'Sponsorship',
    image: '/team_picture/Hunter.jpg',
    bio: 'Some of my hobbies are basketball and mountain biking!',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 7,
    links: { linkedin: '' }
  },
  {
    _id: '8',
    name: 'Alex Levy',
    role: 'Design Chair',
    image: '/team_picture/Alex.jpg',
    bio: 'I like creating stuff, playing video games, and watching cat videos!',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 8,
    links: { linkedin: '' }
  },
  {
    _id: '9',
    name: 'Phebe Kwarteng',
    role: 'Design Chair',
    image: '/team_picture/Phebee.jpg',
    bio: 'I am pescatarian!',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 9,
    links: { linkedin: '' }
  },
  {
    _id: '10',
    name: 'Peter Cheng',
    role: 'Senior Workshop Lead',
    image: '/team_picture/Peter.jpg',
    bio: 'Sometimes I also do photography!',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 10,
    links: { linkedin: '' }
  },
  {
    _id: '11',
    name: 'Adhishree Viti',
    role: 'Workshop Lead',
    image: '/team_picture/Adi.jpg',
    bio: 'Some of my hobbies are badminton and reading.',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 11,
    links: { linkedin: '' }
  },
  {
    _id: '12',
    name: 'Liam Wasserman',
    role: 'Workshop Lead',
    image: '/team_picture/Liam.jpg',
    bio: 'I have seven cats.',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 12,
    links: { linkedin: '' }
  },
  {
    _id: '13',
    name: 'Mackenzie Anderson',
    role: 'PR Chair',
    image: '/team_picture/Mackenzie.jpg',
    bio: 'I lived in Scotland for half a year!',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 13,
    links: { linkedin: '' }
  },
  {
    _id: '14',
    name: 'Daniela Lat',
    role: 'Treasurer',
    image: getPlaceholderImage('Daniela Lat'), // Placeholder
    bio: 'I love to play sports and cook!',
    year: 2025,
    isActive: true,
    order: 14,
    links: { linkedin: '' }
  },
  {
    _id: '15',
    name: 'Leah Bowman',
    role: 'Illustrator',
    image: '/team_picture/Leah.jpeg',
    bio: 'I love sleeping, Formula 1, and reading (in that order).',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 15,
    links: { linkedin: '' }
  },
  {
    _id: '16',
    name: 'Dorothea Dolan',
    role: 'Illustrator',
    image: '/team_picture/Dolan.jpeg',
    bio: 'I like birds.',
    year: 2025, // Assuming 2025
    isActive: true,
    order: 16,
    links: { linkedin: '' }
  },
  // Alumni
  {
    _id: '17',
    name: 'Schneider Joachim',
    role: 'Alumni',
    image: '/team_picture/Schneider.jpeg',
    bio: 'I am a professional sleeper.',
    year: 2024, // Previous Year
    isActive: false,
    order: 1,
    links: { linkedin: '' }
  },
  {
    _id: '18',
    name: 'Anthony Mazzacane',
    role: 'Alumni',
    image: '/team_picture/Anthony.png',
    bio: 'Hiker, hacker, coder.',
    year: 2024, // Previous Year
    isActive: false,
    order: 2,
    links: { linkedin: '' }
  },
  {
    _id: '19',
    name: 'Ekaterina Kladova',
    role: 'Alumni',
    image: '/team_picture/Ekaterina.png',
    bio: 'Got a Master\'s degree only to figure out that I like to be a coding monkey.',
    year: 2024, // Previous Year
    isActive: false,
    order: 3,
    links: { linkedin: '' }
  }
];

// Extract unique roles from the definitive list
const definitiveRoles = Array.from(new Set(definitiveTeamMembers.map(m => m.role)));

// Function to validate and convert image paths
// Currently, just ensures it exists or returns default.
// TODO: Potentially add more robust validation or conversion if needed.
async function validateAndConvertImage(imagePath: string | null | undefined): Promise<string> {
  // If it's a valid relative path (starts with /) or data URL, return as is
  if (imagePath && (imagePath.startsWith('/') || imagePath.startsWith('data:image'))) {
    return imagePath;
  }
  
  // If it's an external URL (simple check)
  if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
     return imagePath;
  }

  // Otherwise, return the default placeholder
  console.warn(`Invalid or missing image path provided: ${imagePath}. Using default.`);
  return DEFAULT_IMAGE;
}

// Function to seed the database with team members if empty
async function seedDatabase() {
  try {
    await connectDB();
    const count = await Team.countDocuments();
    if (count === 0) {
      console.log('Seeding database with team members...');
      await Team.insertMany(definitiveTeamMembers);
      console.log('Database seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// GET /api/team - Get all team members
export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully');
    
    // Log database status
    const count = await Team.countDocuments();
    console.log(`Total team members in database: ${count}`);

    const teamMembers = await Team.find();
    
    // Log full details of each team member with raw ID
    console.log('\nTeam members in database (with raw IDs):');
    teamMembers.forEach(member => {
      console.log(JSON.stringify({
        _id: member._id.toString(),
        name: member.name,
        role: member.role,
        year: member.year,
        isActive: member.isActive
      }, null, 2));
    });
    
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error in GET /api/team:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

// POST /api/team - Create a new team member
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.role || !body.year) {
      return NextResponse.json(
        { error: 'Name, role, and year are required fields' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Convert year to number if it's a string
    const year = typeof body.year === 'string' ? parseInt(body.year) : body.year;
    
    // Prepare the new team member data
    const newTeamMemberData = {
      ...body,
      year,
      createdAt: new Date(),
      updatedAt: new Date(),
      links: body.links || {},
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0
    };

    // Log the creation attempt
    console.log('Attempting to create new team member:', {
      name: newTeamMemberData.name,
      role: newTeamMemberData.role,
      year: newTeamMemberData.year
    });

    const newTeamMember = new Team(newTeamMemberData);
    await newTeamMember.save();

    // Log successful creation
    console.log('Successfully created new team member:', {
      id: newTeamMember._id,
      name: newTeamMember.name,
      role: newTeamMember.role,
      year: newTeamMember.year
    });

    return NextResponse.json(newTeamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}

// PUT /api/team/:id - Update a team member
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Team member ID is required' }, { status: 400 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.role || !body.year) {
      return NextResponse.json(
        { error: 'Name, role, and year are required fields' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Convert year to number if it's a string
    const year = typeof body.year === 'string' ? parseInt(body.year) : body.year;
    
    // Prepare the update data
    const updateData = {
      ...body,
      year,
      updatedAt: new Date(),
      links: body.links || {},
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0
    };

    // Log the update attempt
    console.log('Attempting to update team member:', {
      id,
      updateData
    });

    const updatedTeamMember = await Team.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTeamMember) {
      console.error('Team member not found for update:', id);
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Log successful update
    console.log('Successfully updated team member:', {
      id: updatedTeamMember._id,
      name: updatedTeamMember.name,
      role: updatedTeamMember.role,
      year: updatedTeamMember.year
    });

    return NextResponse.json(updatedTeamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/:id - Delete a team member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const result = await Team.findByIdAndDelete(objectId);

    if (!result) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Team member deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
