'use client';

import { usePathname, useRouter } from 'next/navigation';
import { MdLanguage } from 'react-icons/md';

const LANGUAGE_LABELS: Record<string, string> = {
  ar: 'AR - العربية',
  en: 'EN - English',
  fr: 'FR - Français',
  de: 'DE - Deutsch',
};

export default function DashboardLanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname(); // e.g. /en/dashboard/about
  const router = useRouter();
  
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
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
      <MdLanguage className="text-venecos-gold text-lg shrink-0" />
      <select
        aria-label="Dashboard Language Switcher"
        value={currentLocale}
        onChange={(e) => router.push(getPathForLocale(e.target.value))}
        className="bg-transparent text-gray-800 text-xs font-bold uppercase cursor-pointer outline-none border-none py-0.5 pe-1"
      >
        {['en', 'ar', 'fr', 'de'].map((l) => (
          <option key={l} value={l} className="bg-white text-gray-800 font-semibold">
            {LANGUAGE_LABELS[l] || l.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
