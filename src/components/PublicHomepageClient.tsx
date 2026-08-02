'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MdArrowForward, MdChevronLeft, MdChevronRight, 
  MdCheckCircle, MdOutlineLocalOffer, MdLocationOn, 
  MdWork, MdPhone, MdEmail, MdAccessTime, MdOpenInNew, 
  MdPlayArrow, MdCategory, MdInfo, MdStar, MdDesignServices, MdLaptop, MdPalette, MdPrint
} from 'react-icons/md';
import { FaApple, FaAndroid, FaCode } from 'react-icons/fa';

// Helper for multi-language or string properties
function getLocString(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
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

  // Fallback Slides if DB has no slides yet
  const displaySlides = sliders.length > 0 ? sliders : [
    {
      title: { ar: 'حلول برمجية وإبداعية متكاملة', en: 'Complete Software & Creative Solutions' },
      subtitle: { ar: 'نبتكر المستقبل ونطور الأعمال بأحدث التقنيات وأعلى معايير الإبداع', en: 'Innovating the future with cutting-edge technology' },
      badge: { ar: 'VENECOS 2026', en: 'VENECOS 2026' },
      linkUrl: '#services',
    },
    {
      title: { ar: 'تصميم الهوية البصرية وإنتاج الفيديو 3D', en: 'Brand Identity & 3D Video Production' },
      subtitle: { ar: 'نبني لعلامتك التجارية حضوراً استثنائياً يلفت الأنظار ويحقق نتائج ملموسة', en: 'Crafting an exceptional presence for your brand' },
      badge: { ar: 'إبداع بلا حدود', en: 'LIMITLESS CREATIVITY' },
      linkUrl: '#gallery',
    }
  ];

  // Slide Auto Rotation
  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  const filteredGallery = activeGalleryTab === 'all' 
    ? gallery 
    : gallery.filter((item) => item.category === activeGalleryTab);

  const slide = displaySlides[currentSlide] || displaySlides[0];

  return (
    <div className="space-y-24 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ══ HERO SLIDER SECTION ══ */}
      <section className="relative overflow-hidden rounded-3xl border border-venecos-gold/25 bg-gradient-to-b from-venecos-black via-neutral-950 to-neutral-900 shadow-2xl p-8 md:p-16">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-venecos-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          {getLocString(slide?.badge, locale) && (
            <span className="inline-block bg-venecos-gold/15 border border-venecos-gold/40 text-venecos-gold text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
              {getLocString(slide.badge, locale)}
            </span>
          )}

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            {getLocString(slide?.title, locale)}
          </h1>

          <p className="text-white/70 text-base md:text-xl font-light leading-relaxed max-w-2xl">
            {getLocString(slide?.subtitle, locale)}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={slide?.linkUrl || '#services'}
              className="px-8 py-3.5 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:from-yellow-400 hover:to-venecos-gold text-black font-black text-sm rounded-xl shadow-lg hover:shadow-venecos-gold/20 transition-all flex items-center gap-2"
            >
              استكشف خدماتنا <MdArrowForward className={isRtl ? 'rotate-180 text-lg' : 'text-lg'} />
            </a>
            <a
              href="#offers"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl border border-white/15 hover:border-venecos-gold/40 transition-all"
            >
              العروض الحصرية
            </a>
          </div>
        </div>

        {/* Slide Indicators */}
        {displaySlides.length > 1 && (
          <div className="flex items-center gap-2 pt-10">
            {displaySlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-venecos-gold' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══ STATS SECTION ══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'مشروع منجز', val: '+250', icon: '🚀' },
          { label: 'رضا العملاء', val: '100%', icon: '⭐' },
          { label: 'فروع عالمية', val: '4', icon: '🌐' },
          { label: 'دعم فني متاح', val: '24/7', icon: '🎧' },
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

      {/* ══ SERVICES SHOWCASE SECTION ══ */}
      <section id="services" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
              <MdDesignServices /> خدمات VENECOS البرمجية والإبداعية
            </div>
            <h2 className="text-3xl font-extrabold text-white">خدماتنا الرئيسية — Our Core Services</h2>
          </div>
          <Link
            href={`/${locale}/services`}
            className="text-xs font-bold text-venecos-gold hover:underline flex items-center gap-1"
          >
            عرض دليل الخدمات الكامل <MdArrowForward className={isRtl ? 'rotate-180' : ''} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const title = getLocString(svc.title, locale);
            const desc = getLocString(svc.description, locale);

            return (
              <div
                key={svc._id}
                className="bg-venecos-black/80 border border-white/10 hover:border-venecos-gold/50 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-venecos-gold/10 rounded-2xl flex items-center justify-center border border-venecos-gold/20 text-venecos-gold text-2xl font-black">
                    {svc.iconUrl ? (
                      <img src={svc.iconUrl} alt={title} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <FaCode />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{desc}</p>
                </div>

                {/* Sub-services / Packages */}
                {svc.subServices && svc.subServices.length > 0 && (
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2 text-xs">
                    <span className="block font-bold text-venecos-gold text-[10px]">الباقات المتوفرة:</span>
                    {svc.subServices.slice(0, 3).map((sub: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-white/80">
                        <span>• {sub.title}</span>
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
                    اطلب الخدمة الآن
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ EXCLUSIVE OFFERS SECTION ══ */}
      <section id="offers" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
              <MdOutlineLocalOffer /> باقات وتخفيضات خاصة
            </div>
            <h2 className="text-3xl font-extrabold text-white">العروض الحصرية — Exclusive Offers</h2>
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
                    className="w-full py-3 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    اطلب الباقة الآن
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ WORK GALLERY SHOWCASE ══ */}
      <section id="gallery" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
              <MdWork /> معارض الأعمال والمشاريع
            </div>
            <h2 className="text-3xl font-extrabold text-white">معرض الأعمال — Work Portfolio</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'الكل (All)' },
              { key: 'software', label: 'البرمجة والتطبيقات' },
              { key: 'video', label: 'إنتاج الفيديو' },
              { key: 'identity', label: 'الهوية البصرية' },
              { key: 'print', label: 'الطباعة والافتتاح' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveGalleryTab(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeGalleryTab === cat.key
                    ? 'bg-venecos-gold text-black border-venecos-gold shadow-md'
                    : 'bg-white/5 text-white/70 border-white/10 hover:border-venecos-gold/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map((item) => {
            const title = getLocString(item.title, locale);
            const desc = getLocString(item.description, locale);

            return (
              <div
                key={item._id}
                className="group bg-venecos-black/80 border border-white/10 hover:border-venecos-gold/40 rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={item.mediaUrl}
                    alt={title || 'Portfolio'}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-venecos-gold border border-venecos-gold/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-white line-clamp-1">{title}</h4>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ GLOBAL BRANCHES SECTION ══ */}
      <section id="branches" className="space-y-8">
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
            <MdLocationOn /> انتشارنا العالمي
          </div>
          <h2 className="text-3xl font-extrabold text-white">فروعنا العالمية — Global Offices</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div
              key={b._id}
              className="bg-venecos-black/80 border border-white/10 hover:border-venecos-gold/40 rounded-2xl p-6 shadow-xl space-y-4 relative transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{b.city}</h3>
                  <p className="text-xs text-white/50">{b.countryName}</p>
                </div>
                {b.isHeadquarters && (
                  <span className="bg-venecos-gold/15 text-venecos-gold border border-venecos-gold/30 text-[10px] font-black px-2.5 py-1 rounded-full">
                    المقر الرئيسي HQ
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs text-white/70 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <MdLocationOn className="text-venecos-gold" /> <span>{b.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdPhone className="text-venecos-gold" /> <span dir="ltr">{b.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-venecos-gold" /> <span>{b.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdAccessTime className="text-venecos-gold" /> <span>{b.workingHours}</span>
                </div>
              </div>

              {b.googleMapsUrl && (
                <a
                  href={b.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pt-2 text-xs font-bold text-venecos-gold hover:underline inline-flex items-center gap-1"
                >
                  <MdOpenInNew /> خريطة الموقع (Google Maps)
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHO WE ARE SECTION ══ */}
      <section id="who" className="bg-gradient-to-r from-venecos-black to-neutral-900 border border-venecos-gold/20 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-venecos-gold font-bold text-xs uppercase tracking-widest block">
              من نحن — Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              رؤيتنا إحداث ثورة في الخدمات البرمجية والإبداعية
            </h2>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed">
              تأسست VENECOS لتكون الشريك الاستراتيجي الأول للشركات والمؤسسات الطامحة للتميز الرقمي والابتكار الإبداعي بعقول وخبرات عالمية.
            </p>

            <div className="space-y-2 pt-2">
              {[
                'التزام مطلق بالجودة والسرعة في التنفيذ',
                'فريق متخصص بأحدث التقنيات وأدوات الذكاء الاصطناعي',
                'دعم فني وتطوير مستمر لجميع البرمجيات والمشاريع',
              ].map((val, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-white/80 font-medium">
                  <span className="w-2 h-2 rounded-full bg-venecos-gold" />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-venecos-gold/15 border border-venecos-gold/40 text-venecos-gold flex items-center justify-center text-3xl mx-auto">
              🏆
            </div>
            <h3 className="font-bold text-lg text-white">التميز والجودة العالمية</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              نضمن لك تجربة فريدة ترتقي بعلامتك التجارية إلى آفاق جديدة بلمسات ذهبية فاخرة.
            </p>
          </div>
        </div>
      </section>

      {/* ══ APP DOWNLOAD BADGES FOOTER ══ */}
      <section className="bg-venecos-black border border-white/10 rounded-3xl p-8 text-center space-y-6">
        <h3 className="text-xl font-bold text-white">تطبيقنا قريباً على الأجهزة الذكية</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="flex items-center gap-3 bg-white/5 border border-white/15 hover:border-venecos-gold px-6 py-3 rounded-2xl text-white text-xs font-bold transition-all">
            <FaApple className="text-2xl text-venecos-gold" />
            <div className="text-right">
              <span className="block text-[10px] text-white/50">قريباً على</span>
              <span>App Store</span>
            </div>
          </button>
          <button className="flex items-center gap-3 bg-white/5 border border-white/15 hover:border-venecos-gold px-6 py-3 rounded-2xl text-white text-xs font-bold transition-all">
            <FaAndroid className="text-2xl text-emerald-400" />
            <div className="text-right">
              <span className="block text-[10px] text-white/50">قريباً على</span>
              <span>Google Play</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
