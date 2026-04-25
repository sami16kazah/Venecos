import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // Fetch users with admin or employee roles
    const staff = await User.find({
      roles: { $in: ['admin', 'employee'] }
    }).select('firstName lastName email roles').lean();

    return NextResponse.json(staff);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
