import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BanItem from '@/models/BanList';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const bannedItems = await BanItem.find().sort({ createdAt: -1 });
    return NextResponse.json(bannedItems, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { type, value, reason } = await req.json();
    if (!type || !value) {
      return NextResponse.json({ message: 'Missing type or value' }, { status: 400 });
    }

    await connectToDatabase();
    const item = await BanItem.findOneAndUpdate(
      { type, value },
      { type, value, reason: reason || 'Banned by admin' },
      { upsert: true, new: true }
    );

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
