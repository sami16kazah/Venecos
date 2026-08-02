import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ExchangeRate from '@/models/ExchangeRate';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const DEFAULT_RATES = [
  { currencyCode: 'EUR', symbol: '€', rateAgainstEur: 1 },
  { currencyCode: 'USD', symbol: '$', rateAgainstEur: 1.08 },
  { currencyCode: 'SAR', symbol: 'ر.س', rateAgainstEur: 4.05 },
  { currencyCode: 'AED', symbol: 'د.إ', rateAgainstEur: 3.96 },
  { currencyCode: 'SYP', symbol: 'ل.س', rateAgainstEur: 14500 },
  { currencyCode: 'EGP', symbol: 'ج.م', rateAgainstEur: 52.4 },
  { currencyCode: 'GBP', symbol: '£', rateAgainstEur: 0.85 },
  { currencyCode: 'TRY', symbol: '₺', rateAgainstEur: 35.2 },
];

export async function GET() {
  try {
    await connectToDatabase();
    let rates = await ExchangeRate.find().sort({ currencyCode: 1 });
    
    // Seed initial rates if DB is empty
    if (!rates || rates.length === 0) {
      await ExchangeRate.insertMany(DEFAULT_RATES);
      rates = await ExchangeRate.find().sort({ currencyCode: 1 });
    }

    return NextResponse.json(rates, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json(); // Array of { currencyCode, symbol, rateAgainstEur }
    await connectToDatabase();

    if (Array.isArray(body)) {
      for (const item of body) {
        await ExchangeRate.findOneAndUpdate(
          { currencyCode: item.currencyCode },
          { ...item, lastUpdated: new Date() },
          { upsert: true, new: true }
        );
      }
    }

    const updatedRates = await ExchangeRate.find().sort({ currencyCode: 1 });
    return NextResponse.json(updatedRates, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
