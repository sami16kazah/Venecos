import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    await connectToDatabase();
    
    let services = await ServiceContent.find({ locale }).sort({ order: 1 }).lean();
    
    // Fallback if no services exist for active locale
    if (services.length === 0) {
      services = await ServiceContent.find({ locale: 'ar' }).sort({ order: 1 }).lean();
    }
    if (services.length === 0) {
      services = await ServiceContent.find({}).sort({ order: 1 }).lean();
    }

    return NextResponse.json(services, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'admin' && userRole !== 'employee')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { serviceKey, locale = 'en', title, description, iconType = 'react-icon', iconName, iconUrl, order = 0, isSpecial = false, subServices = [] } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // If serviceKey is provided, upsert across all 4 locales so the service is available globally
    const localesToUpdate = ['ar', 'en', 'fr', 'de'];
    let primaryService = null;

    if (serviceKey) {
      for (const loc of localesToUpdate) {
        const existing = await ServiceContent.findOne({ serviceKey, locale: loc });
        const updated = await ServiceContent.findOneAndUpdate(
          { serviceKey, locale: loc },
          {
            $set: {
              serviceKey,
              locale: loc,
              title: existing?.title || title,
              description: existing?.description || description,
              iconType: iconType || 'react-icon',
              iconName: iconName || 'FaServer',
              iconUrl,
              order,
              isSpecial: !!isSpecial,
              subServices: subServices || []
            }
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if (loc === locale) primaryService = updated;
      }
    } else {
      primaryService = await ServiceContent.create({
        serviceKey,
        locale,
        title,
        description,
        iconType,
        iconName,
        iconUrl,
        order,
        isSpecial: !!isSpecial,
        subServices: subServices || []
      });
    }

    return NextResponse.json({ message: 'Service published successfully', data: primaryService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error creating content' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'admin' && userRole !== 'employee')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { _id, serviceKey, locale, title, description, iconType, iconName, iconUrl, order, isSpecial, subServices } = await req.json();
    if (!_id && !serviceKey) return NextResponse.json({ message: 'ID or serviceKey required' }, { status: 400 });

    await connectToDatabase();
    
    let updated;
    if (_id) {
      updated = await ServiceContent.findByIdAndUpdate(
        _id,
        { title, description, iconType, iconName, iconUrl, order, isSpecial: !!isSpecial, subServices: subServices || [] },
        { new: true }
      );
    } else if (serviceKey && locale) {
      updated = await ServiceContent.findOneAndUpdate(
        { serviceKey, locale },
        { title, description, iconType, iconName, iconUrl, order, isSpecial: !!isSpecial, subServices: subServices || [] },
        { new: true, upsert: true }
      );
    }

    return NextResponse.json({ message: 'Service updated', data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'admin' && userRole !== 'employee')) {
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
