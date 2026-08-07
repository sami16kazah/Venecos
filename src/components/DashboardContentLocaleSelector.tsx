'use client';

import React from 'react';
import { MdLanguage } from 'react-icons/md';

interface Props {
  selectedLocale: string;
  onLocaleChange: (locale: string) => void;
  availableLocales?: string[];
}

const LOCALE_LABELS: Record<string, string> = {
  ar: 'العربية (AR)',
  en: 'English (EN)',
  fr: 'Français (FR)',
  de: 'Deutsch (DE)',
};

export default function DashboardContentLocaleSelector({ 
  selectedLocale, 
  onLocaleChange, 
  availableLocales = ['en', 'ar', 'fr', 'de'] 
}: Props) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-200 w-fit">
      <MdLanguage className="text-venecos-gold text-lg shrink-0" />
      <select
        aria-label="Select Content Language"
        value={selectedLocale}
        onChange={(e) => onLocaleChange(e.target.value)}
        className="bg-transparent text-gray-800 font-bold text-xs uppercase tracking-wider cursor-pointer outline-none pe-1"
      >
        {availableLocales.map((l) => (
          <option key={l} value={l} className="bg-white text-gray-800 font-semibold">
            {LOCALE_LABELS[l] || l.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
