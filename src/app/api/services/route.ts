import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Seed default services natively mapped 
const defaultServices = [
  { title: "Coding", description: "Expert web and mobile development using cutting edge technologies. Build scalable, high-performance applications.", iconName: "FaCode", order: 1, isSpecial: true },
  { title: "UI Design", description: "Premium UI/UX design focused on modern aesthetics, user-centric approaches, and responsive layouts tailored to your brand.", iconName: "FaPaintBrush", order: 2, isSpecial: true },
  { title: "Video Design", description: "High-quality video production, motion graphics, and post-production editing to visually captivate your audience.", iconName: "FaVideo", order: 3, isSpecial: true }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    await connectToDatabase();
    
    let services = await ServiceContent.find({ locale }).sort({ order: 1 }).lean();
    
    // Seed generic static defaults exactly once dynamically 
    if (services.length === 0 && locale === 'en') {
      const docs = defaultServices.map(s => ({ ...s, locale }));
      services = await ServiceContent.insertMany(docs);
    } else if (services.length === 0) {
      // Create empty ones or localized copies from english default structure
      const docs = defaultServices.map(s => ({ ...s, locale, title: `${s.title} (${locale})` }));
      services = await ServiceContent.insertMany(docs);
    }

    return NextResponse.json(services, { status: 200 });
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

    const { locale, title, description, iconType, iconName, iconUrl, order, isSpecial, subServices } = await req.json();

    if (!locale || !title || !description || (!iconName && !iconUrl)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    const newService = await ServiceContent.create({ 
      locale, 
      title, 
      description, 
      iconType: iconType || 'react-icon', 
      iconName, 
      iconUrl, 
      order: order || 0,
      isSpecial: !!isSpecial,
      subServices: subServices || []
    });

    return NextResponse.json({ message: 'Service created successfully', data: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error creating content' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { _id, title, description, iconType, iconName, iconUrl, order, isSpecial, subServices } = await req.json();
    if (!_id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

    await connectToDatabase();
    const updated = await ServiceContent.findByIdAndUpdate(
      _id,
      { title, description, iconType, iconName, iconUrl, order, isSpecial: !!isSpecial, subServices: subServices || [] },
      { new: true }
    );

    return NextResponse.json({ message: 'Service updated', data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

    await connectToDatabase();
    await ServiceContent.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Service deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
