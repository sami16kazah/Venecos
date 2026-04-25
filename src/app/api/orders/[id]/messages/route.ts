import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import ChatMessage from '@/models/ChatMessage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    await connectToDatabase();
    const order = await Order.findById(id);

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    // Authorization: Customer, Assigned Staff, or Admin
    const isOwner = order.userId.toString() === userId;
    const isAssigned = order.assignedId?.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAssigned && !isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const messages = await ChatMessage.find({ orderId: id }).sort({ createdAt: 1 }).lean();
    return NextResponse.json(messages);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { text, isPaymentLink } = await req.json();
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const userName = session.user?.name || "User";

    await connectToDatabase();
    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    const isOwner = order.userId.toString() === userId;
    const isAssigned = order.assignedId?.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAssigned && !isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const message = await ChatMessage.create({
      orderId: id,
      senderId: userId,
      senderName: userName,
      text,
      isPaymentLink: isPaymentLink || false
    });

    return NextResponse.json(message);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
