'use client';

import Link from 'next/link';
import Button from '@mui/material/Button';
import { useTranslations } from 'next-intl';

export default function JoinUsSection({ locale }: { locale: string }) {
  const tJoinUs = useTranslations('JoinUs');
  return (
    <section id="join" className="py-20 md:py-28 px-6 bg-venecos-black text-white relative overflow-hidden w-full">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-venecos-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-venecos-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="max-w-4xl mx-auto relative text-center">
        <span className="inline-block bg-venecos-gold/10 border border-venecos-gold/30 text-venecos-gold text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
          {tJoinUs('badge')}
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          {tJoinUs('title')}
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {tJoinUs('description')}
        </p>
        <Link href={`/${locale}/apply`} passHref>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 9999, px: 8, py: 2, fontWeight: 'bold', fontSize: '1rem' }}
          >
            {tJoinUs('button')} →
          </Button>
        </Link>
      </div>
    </section>
  );
}
