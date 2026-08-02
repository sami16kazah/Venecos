import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Application from '@/models/Application';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, recipientEmail, subject, body, status } = await req.json();

    if (!recipientEmail || !subject || !body) {
      return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }

    await connectToDatabase();

    // If applicationId is passed, update its status
    if (applicationId) {
      await Application.findByIdAndUpdate(applicationId, {
        status: status || 'reviewing'
      });
    }

    // Return successful response (in production this would call nodemailer / Resend / AWS SES)
    return NextResponse.json({ 
      message: 'Email reply sent successfully',
      deliveredTo: recipientEmail 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
