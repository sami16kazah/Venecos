import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface IHiringStatus extends Document {
  open: boolean;
}

const HiringStatusSchema = new Schema({
  open: { type: Boolean, default: true }
});

const HiringStatus = (mongoose.models.HiringStatus as Model<IHiringStatus>) || mongoose.model<IHiringStatus>('HiringStatus', HiringStatusSchema);

export async function GET() {
  try {
    await connectToDatabase();
    let statusDoc = await HiringStatus.findOne();
    if (!statusDoc) {
      statusDoc = await HiringStatus.create({ open: true });
    }
    return NextResponse.json({ open: statusDoc.open }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ open: true }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { open } = await req.json();
    await connectToDatabase();
    let statusDoc = await HiringStatus.findOne();
    if (!statusDoc) {
      statusDoc = await HiringStatus.create({ open });
    } else {
      statusDoc.open = open;
      await statusDoc.save();
    }

    return NextResponse.json({ open: statusDoc.open }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
