'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MdArrowForward, MdCheckCircle, MdOutlineLocalOffer, MdLocationOn, 
  MdWork, MdPhone, MdEmail, MdDesignServices, MdLaunch, MdPlayCircle
} from 'react-icons/md';
import { FaCode } from 'react-icons/fa';

// Strict local string parser ensuring NO language mixing
function getLocString(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') {
    // If string is JSON stringified, parse it
    if (val.trim().startsWith('{') && val.trim().endsWith('}')) {
      try {
        const parsed = JSON.parse(val);
        return parsed[lang] || parsed['ar'] || parsed['en'] || parsed['fr'] || parsed['de'] || '';
      } catch (e) {
        return val;
      }
    }
    return val;
  }
  if (typeof val === 'object') {
    return val[lang] || val['ar'] || val['en'] || val['fr'] || val['de'] || Object.values(val)[0] || '';
  }
  return String(val);
}

interface Props {
  locale: string;
  sliders: any[];
  offers: any[];
  gallery: any[];
  branches: any[];
  services: any[];
}

export default function PublicHomepageClient({
  locale,
  sliders = [],
  offers = [],
  gallery = [],
  branches = [],
  services = [],
}: Props) {
  const isRtl = locale === 'ar';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');

  // Filter services strictly by active locale
  const filteredServices = services.filter((svc) => {
    if (svc.locale) return svc.locale === locale || svc.locale === 'ar';
    return true;
  });

  // Deduplicate services by title to prevent repetition
  const uniqueServices = Array.from(
    new Map(filteredServices.map((item) => [getLocString(item.title, locale), item])).values()
  );

  // Active sliders from DB
  const displaySlides = sliders.length > 0 ? sliders : [
    {
      title: { ar: 'حلول استضافة وسيرفرات سحابية فائقة الأداء', en: 'High Performance Cloud & Hosting Solutions' },
      subtitle: { ar: 'بنية تحتية متطورة في ألمانيا وفرنسا مع حماية شاملة وسرعة فائقة', en: 'Advanced infrastructure in Germany & France with DDoS protection' },
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      btnText: { ar: 'تصفح الخدمات', en: 'Explore Services' },
      btnUrl: '#services',
      overlayOpacity: 50,
    }
  ];

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  const slide = displaySlides[currentSlide] || displaySlides[0];

  const filteredGallery = activeGalleryTab === 'all' 
    ? gallery 
    : gallery.filter((item) => item.category === activeGalleryTab);

  return (
    <div className="space-y-24 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ══ HERO SLIDER SECTION (DYNAMIC FROM DASHBOARD) ══ */}
      <section className="relative overflow-hidden rounded-3xl border border-venecos-gold/30 bg-black min-h-[460px] flex items-center shadow-2xl">
        {/* Background Image / Video */}
        {slide.mediaType === 'video' ? (
          slide.ytUrl ? (
            <iframe
              src={`https://www.youtube.com/embed/${slide.ytUrl.split('v=')[1]?.split('&')[0]}?autoplay=1&mute=1&controls=0&loop=1`}
              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
            />
          ) : slide.videoUrl ? (
            <video
              src={slide.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          ) : null
        ) : (
          <img
            src={slide.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'}
            alt="Hero Slide"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay opacity from dashboard setting */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: (slide.overlayOpacity ?? 50) / 100 }}
        />

        <div className="relative z-10 p-8 md:p-16 max-w-3xl space-y-6">
          <span className="inline-block bg-venecos-gold/20 border border-venecos-gold/40 text-venecos-gold text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full backdrop-blur-md">
            VENECOS OFFERS 2026
          </span>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
            {getLocString(slide.title, locale)}
          </h1>

          <p className="text-white/80 text-base md:text-lg font-light leading-relaxed drop-shadow-md">
            {getLocString(slide.subtitle, locale)}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {getLocString(slide.btnText, locale) && (
              <a
                href={slide.btnUrl || '#services'}
                className="px-8 py-3.5 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black font-black text-sm rounded-xl shadow-xl transition-all flex items-center gap-2"
              >
                {getLocString(slide.btnText, locale)} <MdArrowForward className={isRtl ? 'rotate-180 text-lg' : 'text-lg'} />
              </a>
            )}
            <a
              href="#offers"
              className="px-8 py-3.5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all"
            >
              {locale === 'ar' ? 'العروض الحصرية' : locale === 'fr' ? 'Offres Exclusives' : locale === 'de' ? 'Exklusive Angebote' : 'Exclusive Offers'}
            </a>
          </div>

          {displaySlides.length > 1 && (
            <div className="flex items-center gap-2 pt-6">
              {displaySlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-8 bg-venecos-gold' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ STATS SECTION ══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: locale === 'ar' ? 'مشروع منجز' : 'Projects Done', val: '+250', icon: '🚀' },
          { label: locale === 'ar' ? 'رضا العملاء' : 'Client Satisfaction', val: '100%', icon: '⭐' },
          { label: locale === 'ar' ? 'فروع عالمية' : 'Global Offices', val: '4', icon: '🌐' },
          { label: locale === 'ar' ? 'دعم فني متاح' : '24/7 Support', val: '24/7', icon: '🎧' },
        ].map((st, i) => (
          <div
            key={i}
            className="bg-venecos-black/80 border border-white/10 hover:border-venecos-gold/30 p-6 rounded-2xl text-center space-y-2 shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="text-3xl mb-1">{st.icon}</div>
            <div className="text-3xl font-black text-venecos-gold font-mono">{st.val}</div>
            <div className="text-xs font-bold text-white/60">{st.label}</div>
          </div>
        ))}
      </section>

      {/* ══ SERVICES SHOWCASE SECTION (NO LANGUAGE MIXING & NO DUPLICATES) ══ */}
      <section id="services" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
              <MdDesignServices /> {locale === 'ar' ? 'خدمات VENECOS الرئيسية' : 'VENECOS Core Services'}
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              {locale === 'ar' ? 'الخدمات المتكاملة' : 'Core Services Solutions'}
            </h2>
          </div>
          <Link
            href={`/${locale}/dashboard/services`}
            className="text-xs font-bold text-venecos-gold hover:underline flex items-center gap-1"
          >
            {locale === 'ar' ? 'دليل الخدمات والإعدادات' : 'Services Directory'} <MdArrowForward className={isRtl ? 'rotate-180' : ''} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueServices.map((svc) => {
            const title = getLocString(svc.title, locale);
            const desc = getLocString(svc.description, locale);

            return (
              <div
                key={svc._id}
                className="bg-venecos-black/80 border border-white/10 hover:border-venecos-gold/50 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-venecos-gold/10 rounded-2xl flex items-center justify-center border border-venecos-gold/20 text-venecos-gold text-2xl font-black">
                    <FaCode />
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{desc}</p>
                </div>

                {svc.subServices && svc.subServices.length > 0 && (
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2 text-xs">
                    <span className="block font-bold text-venecos-gold text-[10px]">
                      {locale === 'ar' ? 'الباقات المتوفرة:' : 'Available Packages:'}
                    </span>
                    {svc.subServices.slice(0, 3).map((sub: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-white/80">
                        <span>• {getLocString(sub.title, locale)}</span>
                        <span className="font-mono text-venecos-gold font-bold">€{sub.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-white/10">
                  <Link
                    href={`/${locale}/services`}
                    className="w-full py-2.5 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {locale === 'ar' ? 'اطلب الخدمة الآن' : 'Order Now'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ EXCLUSIVE OFFERS SECTION ══ */}
      {offers.length > 0 && (
        <section id="offers" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
                <MdOutlineLocalOffer /> {locale === 'ar' ? 'باقات وتخفيضات خاصة' : 'Special Offers & Packages'}
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                {locale === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((off) => {
              const title = getLocString(off.title, locale);
              const desc = getLocString(off.description, locale);
              const badge = getLocString(off.badge, locale);

              return (
                <div
                  key={off._id}
                  className="bg-venecos-black/80 border border-white/10 hover:border-venecos-gold/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:-translate-y-1 transition-all"
                >
                  <div className="space-y-4">
                    {badge && (
                      <span className="inline-block bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        {badge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-venecos-gold font-mono">
                        €{off.discountedPrice}
                      </span>
                      <span className="text-xs text-white/40 line-through font-mono">
                        €{off.originalPrice}
                      </span>
                    </div>

                    <Link
                      href={`/${locale}/services`}
                      className="w-full py-3 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      {locale === 'ar' ? 'اطلب الباقة والحصول على العرض' : 'Order Offer Package'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══ WORK GALLERY SHOWCASE ══ */}
      {gallery.length > 0 && (
        <section id="gallery" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
                <MdWork /> {locale === 'ar' ? 'معارض الأعمال والمشاريع' : 'Work Portfolio'}
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                {locale === 'ar' ? 'معرض الأعمال' : 'Portfolio Showcase'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div key={item._id} className="bg-venecos-black/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl space-y-3">
                <div className="h-48 bg-gray-900 overflow-hidden relative">
                  <img src={item.coverImage || item.mediaUrl} alt={getLocString(item.title, locale)} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-black/80 text-venecos-gold text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-base font-bold text-white">{getLocString(item.title, locale)}</h3>
                  <p className="text-xs text-white/60 line-clamp-2">{getLocString(item.description, locale)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ BRANCHES SECTION ══ */}
      {branches.length > 0 && (
        <section id="branches" className="space-y-8">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
              <MdLocationOn /> {locale === 'ar' ? 'فروعنا حول العالم' : 'Global Offices'}
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              {locale === 'ar' ? 'الفروع الدولية' : 'International Branches'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((b) => (
              <div key={b._id} className="bg-venecos-black/80 border border-white/10 p-6 rounded-2xl space-y-3 shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MdLocationOn className="text-venecos-gold text-xl" /> {b.city || getLocString(b.name, locale)}
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/30">
                    {b.countryName || b.countryCode}
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{b.address}</p>
                <div className="pt-2 text-xs space-y-1 border-t border-white/10 text-venecos-gold font-mono">
                  {b.phone && <div>📞 {b.phone}</div>}
                  {b.email && <div>✉️ {b.email}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
