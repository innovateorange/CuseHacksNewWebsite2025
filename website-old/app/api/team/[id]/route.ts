import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Team from '@/models/Team';
import connectDB from '@/lib/mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    const deletedMember = await Team.findByIdAndDelete(id);
    
    if (!deletedMember) {
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