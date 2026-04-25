'use client';

import { useTranslations } from 'next-intl';

export default function CommonFooter() {
  const tFooter = useTranslations('Footer');
  return (
    <footer className="bg-venecos-black text-white/50 py-12 text-center border-t border-white/10 w-full">
      <div className="flex justify-center mb-6">
        <img src="/Venecos.png" alt="Venecos" className="h-16 md:h-20 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" />
      </div>
      <p>{tFooter('copyright')}</p>
    </footer>
  );
}
