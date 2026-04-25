import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const notifications = await Notification.find({ userId: (session.user as any).id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(notifications);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    await connectToDatabase();
    await Notification.findOneAndUpdate(
       { _id: id, userId: (session.user as any).id },
       { isRead: true }
    );

    return NextResponse.json({ message: 'Marked as read' });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
