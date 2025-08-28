require('dotenv').config({ path: '.env.local' });
const connectDB = require('../lib/mongodb').default;
const Team = require('../models/Team').default;

async function initDB() {
  try {
    await connectDB();
    
    // Initial team data
    const initialTeam = {
      teamMembers: [
        {
          name: "Alex Johnson",
          role: "President",
          year: "2025",
          image: "/images/team/alex.jpg",
          linkedinUrl: "https://linkedin.com/in/alexjohnson"
        },
        {
          name: "Jamie Smith",
          role: "Vice President",
          year: "2024",
          image: "/images/team/jamie.jpg",
          linkedinUrl: "https://linkedin.com/in/jamiesmith"
        },
        {
          name: "Taylor Brown",
          role: "Treasurer",
          year: "2025",
          image: "/images/team/taylor.jpg",
          linkedinUrl: "https://linkedin.com/in/taylorbrown"
        }
      ],
      roles: [
        'President',
        'Vice President',
        'Treasurer',
        'Event Coordinator',
        'Marketing Lead',
        'Member'
      ]
    };

    // Clear existing data
    await Team.deleteMany({});

    // Insert new data
    const team = await Team.create(initialTeam);
    console.log('Database initialized with team data:', team);

  } catch (error) {
    console.error('Failed to initialize database:', error);
  } finally {
    process.exit();
  }
}

initDB(); 