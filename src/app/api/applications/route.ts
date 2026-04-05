import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Application from '@/models/Application';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET — Admin: fetch all applications with optional status filter
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    await connectToDatabase();

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST — Submit a new application
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, position, message, cvUrl, cvPublicId, userId } = body;

    if (!firstName || !lastName || !email || !position || !cvUrl || !cvPublicId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if this email already has a pending application
    const existing = await Application.findOne({ email, status: 'pending' });
    if (existing) {
      return NextResponse.json({ message: 'You already have a pending application.' }, { status: 400 });
    }

    const application = await Application.create({
      userId: userId || undefined,
      firstName,
      lastName,
      email,
      phone,
      position,
      message,
      cvUrl,
      cvPublicId,
      status: 'pending',
    });

    return NextResponse.json({ message: 'Application submitted successfully', application }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
