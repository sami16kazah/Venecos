import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale');
    const serviceKey = searchParams.get('serviceKey');

    await connectToDatabase();
    
    if (serviceKey) {
      const items = await ServiceContent.find({ serviceKey }).lean();
      return NextResponse.json(items, { status: 200 });
    }

    const targetLocale = locale || 'en';
    let services = await ServiceContent.find({ locale: targetLocale }).sort({ order: 1 }).lean();
    
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

    const { 
      serviceKey, 
      locale = 'en', 
      title, 
      description, 
      titles, 
      descriptions, 
      iconType = 'react-icon', 
      iconName, 
      iconUrl, 
      order = 0, 
      isSpecial = false, 
      subServices = [] 
    } = await req.json();

    if (!serviceKey && (!title || !description)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const localesToUpdate = ['ar', 'en', 'fr', 'de'];
    let primaryService = null;

    if (serviceKey) {
      for (const loc of localesToUpdate) {
        const locTitle = (titles && titles[loc]) ? titles[loc] : (typeof title === 'object' ? title[loc] || title.en || title.ar : title);
        const locDesc = (descriptions && descriptions[loc]) ? descriptions[loc] : (typeof description === 'object' ? description[loc] || description.en || description.ar : description);

        const locSubServices = subServices.map((sub: any) => {
          const getLocVal = (val: any, fallbackKey = 'en') => {
            if (!val) return '';
            if (typeof val === 'object' && !Array.isArray(val)) {
              return val[loc] || val[fallbackKey] || val.ar || val.en || '';
            }
            return String(val);
          };

          const getLocArrVal = (val: any) => {
            if (!val) return [];
            if (Array.isArray(val)) return val.map(String);
            if (typeof val === 'object') {
              const arr = val[loc] || val.en || val.ar || [];
              if (Array.isArray(arr)) return arr.map(String);
              if (typeof arr === 'string' && arr.trim()) return [arr];
              return [];
            }
            return [String(val)];
          };

          const firstAddon = sub.addons?.[0];
          const addonTitle = getLocVal(firstAddon?.title, 'en');

          return {
            _id: sub._id,
            title: getLocVal(sub.title, 'en'),
            description: getLocVal(sub.description, 'en'),
            price: Number(sub.price) || Number(sub.priceFrom) || 0,
            originalPrice: Number(sub.originalPrice) || 0,
            badge: getLocVal(sub.badge, 'en'),
            priceFrom: Number(sub.priceFrom) || Number(sub.price) || 0,
            priceTo: Number(sub.priceTo) || Number(sub.priceFrom) || Number(sub.price) || 0,
            deliveryDuration: getLocVal(sub.deliveryDuration, 'en'),
            deliveryEstimate: getLocVal(sub.deliveryEstimate, 'en'),
            deliveryAndRevisions: getLocArrVal(sub.deliveryAndRevisions),
            ownershipAndRights: getLocArrVal(sub.ownershipAndRights),
            highlights: getLocArrVal(sub.highlights),
            addons: firstAddon ? [{
              title: addonTitle,
              price: Number(firstAddon.price) || 41.99
            }] : [],
            image: sub.image || '',
            images: Array.isArray(sub.images) ? sub.images : (sub.image ? [sub.image] : []),
            rating: Number(sub.rating) || 4.8,
            ratingCount: Number(sub.ratingCount) || 24,
          };
        });

        const existing = await ServiceContent.findOne({ serviceKey, locale: loc });
        const updated = await ServiceContent.findOneAndUpdate(
          { serviceKey, locale: loc },
          {
            $set: {
              serviceKey,
              locale: loc,
              title: locTitle || existing?.title || 'Service Title',
              description: locDesc || existing?.description || 'Service Description',
              iconType: iconType || 'react-icon',
              iconName: iconName || 'FaServer',
              iconUrl,
              order,
              isSpecial: !!isSpecial,
              subServices: locSubServices
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
