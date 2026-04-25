import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const role = (session.user as any)?.role;
    if (role !== 'admin' && role !== 'employee') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const orders = await Order.find({ assignedId: (session.user as any).id })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
