import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'supervisor'].includes((session.user as any)?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const dispute = await Dispute.findById(id);
    if (!dispute) {
      return NextResponse.json({ message: 'Dispute not found' }, { status: 404 });
    }

    // Update fields
    if (body.status) dispute.status = body.status;
    if (body.currentTier) dispute.currentTier = body.currentTier;
    if (body.adminDecision !== undefined) dispute.adminDecision = body.adminDecision;

    // Timeline updates
    if (body.status === 'resolved_client' || body.status === 'resolved_company') {
      dispute.timeline = dispute.timeline.map((t: any) => {
        if (t.step === 'الأدمن') return { ...t, done: true, current: false };
        return t;
      });
    } else if (body.status === 'legal_action') {
      dispute.timeline = dispute.timeline.map((t: any) => {
        if (t.step === 'الأدمن') return { ...t, done: true, current: false };
        if (t.step === 'قانوني') return { ...t, done: false, current: true, date: 'جارٍ الآن' };
        return t;
      });
    }

    await dispute.save();
    return NextResponse.json(dispute, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
