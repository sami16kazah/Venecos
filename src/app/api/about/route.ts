import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AboutContent from '@/models/AboutContent';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    await connectToDatabase();
    
    const about = await AboutContent.findOne({ locale }).lean();
    if (!about) {
      // Fallback empty structure
      return NextResponse.json({ 
        title: 'About Us', 
        content: 'Content has not been added yet.',
        locale
      }, { status: 200 });
    }

    return NextResponse.json(about, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { locale, title, content } = await req.json();

    if (!locale || !title || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedAbout = await AboutContent.findOneAndUpdate(
      { locale },
      { title, content },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'About content updated successfully', data: updatedAbout }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error updating content' }, { status: 500 });
  }
}
