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
    const order = await Order.findById(id).select('userId assignedId status').lean();

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    const isOwner = order.userId?.toString() === userId;
    const isAssigned = order.assignedId?.toString() === userId;
    const isAdmin = ['admin', 'supervisor'].includes(userRole);

    if (!isOwner && !isAssigned && !isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const messages = await ChatMessage.find({ orderId: id })
      .sort({ createdAt: 1 })
      .select('_id orderId senderId senderName text isPaymentLink createdAt')
      .lean();

    return NextResponse.json(messages, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
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
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ message: 'Message text is required' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const userName = session.user?.name || 'User';

    await connectToDatabase();
    const order = await Order.findById(id).select('userId assignedId status').lean();
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    const isOwner = order.userId?.toString() === userId;
    const isAssigned = order.assignedId?.toString() === userId;
    const isAdmin = ['admin', 'supervisor'].includes(userRole);

    if (!isOwner && !isAssigned && !isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const message = await ChatMessage.create({
      orderId: id,
      senderId: userId,
      senderName: userName,
      text: text.trim(),
      isPaymentLink: isPaymentLink || false,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
