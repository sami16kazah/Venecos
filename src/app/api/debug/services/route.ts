import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';

export async function GET() {
  try {
    await connectToDatabase();
    const services = await ServiceContent.find({}).lean();
    return NextResponse.json({
      count: services.length,
      data: services.map((s: any) => ({
        id: s._id,
        title: s.title,
        locale: s.locale,
        subServices: s.subServices
      }))
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
