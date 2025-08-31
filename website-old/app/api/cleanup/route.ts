import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function DELETE() {
  try {
    await connectDB();
    
    // Delete all projects
    await Project.deleteMany({});

    return NextResponse.json({ 
      message: 'Successfully deleted all data',
      details: {
        projects: 'All projects deleted'
      }
    });
  } catch (error) {
    console.error('Database cleanup error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to clean database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 