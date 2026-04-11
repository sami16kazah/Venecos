'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname(); // e.g. /en/dashboard/about
  
  // Reconstruct path for a new locale
  const getPathForLocale = (newLocale: string) => {
    if (!pathname) return `/${newLocale}/dashboard`;
    const segments = pathname.split('/').filter(Boolean);
    // segments[0] is the current locale (e.g. 'en')
    if (segments.length > 0 && segments[0] === currentLocale) {
      segments[0] = newLocale;
      return `/${segments.join('/')}`;
    }
    return `/${newLocale}/dashboard`;
  };

  return (
    <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-lg shadow-sm border border-gray-200">
      {['en', 'ar', 'fr', 'de'].map((l) => (
        <Link 
          key={l} 
          href={getPathForLocale(l)} 
          className={`p-1.5 w-7 md:w-8 h-7 md:h-8 flex items-center justify-center rounded-md font-bold text-[10px] md:text-xs transition-all ${currentLocale === l ? 'bg-venecos-black text-venecos-gold shadow-md scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
