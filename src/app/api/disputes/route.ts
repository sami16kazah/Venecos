import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const disputes = await Dispute.find().sort({ createdAt: -1 });
    return NextResponse.json(disputes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const count = await Dispute.countDocuments();
    const disputeNumber = `#DSP-${String(count + 1).padStart(3, '0')}`;

    const dispute = await Dispute.create({
      ...body,
      disputeNumber,
      timeline: [
        { step: 'المشرف', icon: 'fa-user-tie', color: 'var(--green)', done: true, date: new Date().toISOString().split('T')[0] },
        { step: 'الأدمن', icon: 'fa-shield-halved', color: 'var(--gold)', done: false, current: true, date: 'جارٍ الآن' },
        { step: 'قانوني', icon: 'fa-gavel', color: 'var(--red)', done: false, date: '—' },
      ]
    });

    return NextResponse.json(dispute, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
