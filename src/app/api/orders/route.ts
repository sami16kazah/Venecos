import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import ServiceContent from '@/models/ServiceContent';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get all orders (Admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // Use select to avoid issues with non-existent fields and populate correctly
    const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'email firstName lastName').lean();
    
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Submit a new order (User only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { serviceId, subServiceId, serviceName, subServiceName, price, customerDetails } = body;

    if (!serviceId || !subServiceId || !customerDetails) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    let resolvedServiceId = serviceId;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const foundSvc = await ServiceContent.findOne({ serviceKey: serviceId }).lean();
      if (foundSvc) {
        resolvedServiceId = foundSvc._id;
      }
    }

    const newOrder = await Order.create({ 
      userId: (session.user as any).id,
      serviceId: resolvedServiceId,
      subServiceId: String(subServiceId),
      serviceName: typeof serviceName === 'object' ? (serviceName.en || serviceName.ar || 'Service') : serviceName,
      subServiceName: typeof subServiceName === 'object' ? (subServiceName.en || subServiceName.ar || 'Sub Service') : subServiceName,
      price: Number(price) || 0,
      customerDetails,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    return NextResponse.json({ message: 'Order submitted successfully', order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error creating order' }, { status: 500 });
  }
}
