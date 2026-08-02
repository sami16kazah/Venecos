import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedDatabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true' || true; // Always force seed when calling /api/seed
    await seedDatabase(force);
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB Atlas database force-seeded successfully with live test data across all collections!' 
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
