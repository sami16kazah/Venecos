import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendAccountSetupEmail } from '@/lib/mailer';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// PATCH — Admin: update application status (accept/reject)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    await connectToDatabase();

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    application.status = status;
    await application.save();

    // If accepted, promote user to employee role, or create them and send a setup email
    if (status === 'accepted' && application.email) {
      const existingUser = await User.findOne({ email: application.email });

      if (existingUser) {
        // User exists, just add 'employee' to roles if not there
        const rolesSet = new Set(existingUser.roles || []);
        rolesSet.add('employee');
        existingUser.roles = Array.from(rolesSet);
        await existingUser.save();
      } else {
        // User does not exist – create new user account
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);

        const baseUsername = `${application.firstName.toLowerCase()}_${application.lastName.toLowerCase()}`.replace(/[^a-z0-9_]/g, '');
        const finalUsername = baseUsername || 'user';

        const newUser = await User.create({
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          phoneNumber: application.phone,
          username: finalUsername,
          isEmailVerified: true,
          roles: ['employee'], // Start directly as employee
          resetPasswordToken: token,
          resetPasswordExpiry: expiry
        });

        // Optional: link the application
        application.userId = newUser._id;
        await application.save();

        // Send email with the generated token
        await sendAccountSetupEmail(application.email, token);
      }
    }

    return NextResponse.json({ message: `Application ${status}`, application }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// GET — Get a single application
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const application = await Application.findById(id).lean();
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE — Remove rejected application and CV
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'rejected') {
      return NextResponse.json({ message: 'Only rejected applications can be cleanly deleted' }, { status: 400 });
    }

    if (application.cvPublicId) {
      await cloudinary.uploader.destroy(application.cvPublicId, { resource_type: 'raw' });
    }

    await application.deleteOne();

    return NextResponse.json({ message: 'Application cleanly removed' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
