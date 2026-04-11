'use client';

import React from 'react';

interface Props {
  selectedLocale: string;
  onLocaleChange: (locale: string) => void;
  availableLocales?: string[];
}

export default function DashboardContentLocaleSelector({ 
  selectedLocale, 
  onLocaleChange, 
  availableLocales = ['en', 'ar', 'fr', 'de'] 
}: Props) {
  return (
    <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-fit">
      {availableLocales.map((l) => (
        <button
          key={l}
          onClick={() => onLocaleChange(l)}
          className={`
            px-4 py-1.5 rounded-xl font-bold transition-all duration-300
            ${selectedLocale === l 
              ? 'bg-venecos-black text-venecos-gold shadow-lg shadow-black/20 scale-105' 
              : 'text-gray-400 hover:bg-white hover:text-gray-600'
            }
            text-xs uppercase tracking-wider
          `}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
