import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // Return all users, excluding passwords
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // Prevent self-role-change? Maybe useful, but let's at least prevent self-deletion.
    // However, changing from admin to employee might lock the user out of the dashboard.

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { roles: [role] }, // Our schema uses an array for roles
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User role updated', user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }

    // Prevent self-deletion
    if ((session.user as any).id === userId) {
      return NextResponse.json({ message: 'You cannot delete yourself' }, { status: 400 });
    }

    await connectToDatabase();
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error deleting user' }, { status: 500 });
  }
}
