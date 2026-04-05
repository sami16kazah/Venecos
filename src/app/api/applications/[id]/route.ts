import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

// PATCH — Admin: update application status (accept/reject)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    await connectToDatabase();

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    application.status = status;
    await application.save();

    // If accepted, promote user to employee role
    if (status === 'accepted' && application.userId) {
      await User.findByIdAndUpdate(
        application.userId,
        { $addToSet: { roles: 'employee' } }
      );
    } else if (status === 'accepted' && application.email) {
      // Try to find user by email even if no userId was stored
      await User.findOneAndUpdate(
        { email: application.email },
        { $addToSet: { roles: 'employee' } }
      );
    }

    return NextResponse.json({ message: `Application ${status}`, application }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// GET — Get a single application
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const application = await Application.findById(id).lean();
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
