import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, username, email, password, phoneNumber, cv, address } = body;

    // Validation
    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Auto-admin for the seeded email
    const roles = email === 'samkazh444@gmail.com' ? ['admin'] : ['client'];

    // Create verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
    const isEmailVerified = false; // Require verification

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      cv,
      roles,
      address,
      provider: 'credentials',
      isEmailVerified,
      verifyToken,
      verifyTokenExpiry
    });

    try {
      await sendVerificationEmail(newUser.email, verifyToken);
    } catch (err) {
      console.error("Failed to send verification email via Mailjet:", err);
    }

    return NextResponse.json({ message: 'User registered successfully. Please check your email to verify your account.', userId: newUser._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
