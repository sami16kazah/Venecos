import { NextResponse } from 'next/server';

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  AE: 'AED',
  SA: 'SAR',
  US: 'USD',
  CA: 'USD',
  GB: 'GBP',
  EG: 'EGP',
  SY: 'SYP',
  TR: 'TRY',
  DE: 'EUR',
  FR: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  GR: 'EUR',
  PT: 'EUR',
  FI: 'EUR',
  IE: 'EUR',
};

export async function GET(req: Request) {
  try {
    const headers = req.headers;
    let country = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || headers.get('x-country-code');

    if (!country || country === 'XX') {
      try {
        const geoRes = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(2500) });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.country_code) {
            country = geoData.country_code;
          }
        }
      } catch (e) {
        // Fallback silently if offline or blocked
      }
    }

    const detectedCountry = country ? country.toUpperCase() : null;
    const detectedCurrency = detectedCountry && COUNTRY_CURRENCY_MAP[detectedCountry] ? COUNTRY_CURRENCY_MAP[detectedCountry] : null;

    return NextResponse.json({
      country: detectedCountry,
      currency: detectedCurrency,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ country: null, currency: null }, { status: 200 });
  }
}
