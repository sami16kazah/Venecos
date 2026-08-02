import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedDatabase';

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({ message: 'Database seeded successfully with test data!' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
