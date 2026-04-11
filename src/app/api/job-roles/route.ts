import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import JobRole from '@/models/JobRole';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Publicly accessible for the apply page
export async function GET() {
  try {
    await connectToDatabase();
    const roles = await JobRole.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ roles }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Admin only
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ message: 'Valid role name is required' }, { status: 400 });
    }

    await connectToDatabase();

    const existingName = await JobRole.findOne({ name: name.trim() });
    if (existingName) {
      return NextResponse.json({ message: 'Role already exists' }, { status: 400 });
    }

    const lastRole = await JobRole.findOne().sort('-order');
    const order = (lastRole?.order || 0) + 1;

    const role = await JobRole.create({ name: name.trim(), order });
    return NextResponse.json({ message: 'Role added successfully', role }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT - Update order
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roles } = await req.json();
    if (!Array.isArray(roles)) {
      return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    await connectToDatabase();

    const bulkOps = roles.map((r: any) => ({
      updateOne: {
        filter: { _id: r._id },
        update: { $set: { order: r.order } },
      }
    }));

    await JobRole.bulkWrite(bulkOps);

    return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
