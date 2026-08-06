'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  MdArrowForward, MdCheckCircle, MdOutlineLocalOffer, MdLocationOn, 
  MdWork, MdPhone, MdEmail, MdDesignServices, MdLaunch,
  MdClose, MdLocalOffer, MdFlashOn, MdStar, MdCode, MdLayers
} from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

import { getLocString } from '@/lib/i18nUtils';

// Icon Resolver Component
function ServiceIcon({ iconName, className = "text-2xl text-venecos-gold" }: { iconName?: string; className?: string }) {
  if (!iconName) return <FaIcons.FaCode className={className} />;
  const FaIcon = (FaIcons as any)[iconName];
  if (FaIcon) return <FaIcon className={className} />;
  const MdIcon = (MdIcons as any)[iconName];
  if (MdIcon) return <MdIcon className={className} />;
  return <FaIcons.FaCode className={className} />;
}

// Helper to categorize services into 4 main categories matching the screenshot design
function getServiceCategory(svc: any): 'tech' | 'design' | 'print' | 'content' {
  const key = (svc.serviceKey || '').toLowerCase();
  if (['programming', 'shared-hosting', 'vps', 'domains', 'support'].includes(key)) return 'tech';
  if (['photography', 'video', '3d-design'].includes(key)) return 'design';
  if (['paper-print', 'stickers', 'adv-print', '3d-print'].includes(key)) return 'print';
  if (['voiceover', 'content-writing'].includes(key)) return 'content';

  const title = getLocString(svc.title, 'ar').toLowerCase() + getLocString(svc.title, 'en').toLowerCase();
  if (title.includes('طباعة') || title.includes('print') || title.includes('ملصقات') || title.includes('sticker')) return 'print';
  if (title.includes('فيديو') || title.includes('تصميم') || title.includes('design') || title.includes('photo') || title.includes('فوتوغرافي')) return 'design';
  if (title.includes('صوت') || title.includes('محتوى') || title.includes('writing') || title.includes('voice') || title.includes('تعليق')) return 'content';
  return 'tech';
}

// Sub-component for Work Gallery Items
function GalleryCardItem({ item, locale }: { item: any; locale: string }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const title = getLocString(item.title, locale);
  const desc = getLocString(item.description, locale);

  const imagesList = item.images && item.images.length > 0
    ? item.images
    : item.coverImage || item.mediaUrl
      ? [item.coverImage || item.mediaUrl]
      : [];

  const isVideo = item.mediaType === 'video' || !!item.videoUrl;
  const isCarousel = (item.mediaType === 'carousel' || imagesList.length > 1) && !isVideo;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx((prev) => (prev + 1) % imagesList.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <div className="bg-venecos-black/80 border border-white/10 hover:border-venecos-gold/40 rounded-2xl overflow-hidden shadow-xl space-y-3 flex flex-col justify-between group transition-all">
      <div className="h-52 bg-gray-900 overflow-hidden relative">
        {isVideo ? (
          <video
            src={(item.videoUrl || item.mediaUrl) || undefined}
            controls
            playsInline
            muted
            poster={item.coverImage || undefined}
            className="w-full h-full object-cover"
          />
        ) : isCarousel ? (
          <div className="relative w-full h-full">
            <img
              src={imagesList[slideIdx]}
              alt={title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/75 text-white p-2 rounded-full hover:bg-venecos-gold hover:text-black transition-all text-xs z-10 opacity-80 hover:opacity-100 shadow-md"
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/75 text-white p-2 rounded-full hover:bg-venecos-gold hover:text-black transition-all text-xs z-10 opacity-80 hover:opacity-100 shadow-md"
            >
              ❯
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
              {imagesList.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideIdx(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    slideIdx === idx ? 'bg-venecos-gold w-4' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            src={imagesList[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        <span className="absolute top-3 right-3 bg-black/80 text-venecos-gold text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-venecos-gold/30">
          {item.category}
        </span>

        {isVideo && (
          <span className="absolute top-3 left-3 bg-red-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
            🎬 Video
          </span>
        )}

        {isCarousel && (
          <span className="absolute top-3 left-3 bg-emerald-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
            🖼️ {imagesList.length} Slides
          </span>
        )}
      </div>

      <div className="p-5 space-y-2">
        <h3 className="text-base font-bold text-white group-hover:text-venecos-gold transition-colors">{title}</h3>
        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{desc}</p>
        
        {item.demoUrl && (
          <a
            href={item.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-venecos-gold hover:underline pt-1"
          >
            Live Demo <MdLaunch size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

// Translations dictionary for inline UI elements across all 4 locales
const uiText: Record<string, Record<string, string>> = {
  heroExclusiveOffers: {
    ar: 'العروض الحصرية والتخفيضات ⚡',
    en: 'Exclusive Offers & Deals ⚡',
    fr: 'Offres Exclusives & Promos ⚡',
    de: 'Exklusive Angebote & Deals ⚡',
  },
  specialOffersBadge: {
    ar: 'باقات وتخفيضات مميزة 2026',
    en: 'Special Packages & Discounts 2026',
    fr: 'Forfaits & Réductions Spéciaux 2026',
    de: 'Sonderpakete & Rabatte 2026',
  },
  orderOfferBtn: {
    ar: 'احصل على الباقة بخصم خاص',
    en: 'Claim Package Discount',
    fr: 'Profiter de la réduction',
    de: 'Rabatt jetzt sichern',
  },
  claimOfferNow: {
    ar: 'احصل على العرض الآن',
    en: 'Claim Offer Now',
    fr: 'Réclamer l\'offre maintenant',
    de: 'Angebot jetzt sichern',
  },
  saveAmount: {
    ar: 'وفر',
    en: 'Save',
    fr: 'Économisez',
    de: 'Sparen Sie',
  },
  includedFeatures: {
    ar: 'المميزات والمحتويات المتضمنة:',
    en: 'Included Features & Benefits:',
    fr: 'Caractéristiques & Avantages inclus :',
    de: 'Enthaltene Funktionen & Vorteile:',
  },
  limitedOfferBadge: {
    ar: 'عرض مميز حصري',
    en: 'Exclusive Offer',
    fr: 'Offre Exclusive',
    de: 'Exklusives Angebot',
  },
  ourServicesBadge: {
    ar: 'خدماتنا | VENECOS',
    en: 'OUR SERVICES | VENECOS',
    fr: 'NOS SERVICES | VENECOS',
    de: 'UNSERE DIENSTE | VENECOS',
  },
  ourServicesTitle: {
    ar: 'خدماتنا',
    en: 'Our Services',
    fr: 'Nos Services',
    de: 'Unsere Dienste',
  },
  orderServiceBtn: {
    ar: 'اطلب الخدمة ←',
    en: 'Order Service ←',
    fr: 'Commander ←',
    de: 'Dienst bestellen ←',
  },
  viewDetailsBtn: {
    ar: 'التفاصيل والخيارات',
    en: 'Details & Packages',
    fr: 'Détails & Forfaits',
    de: 'Details & Pakete',
  },
  galleryBadge: {
    ar: 'معرض الأعمال',
    en: 'Portfolio Gallery',
    fr: 'Galerie de Projets',
    de: 'Projekt-Galerie',
  },
  galleryTitle: {
    ar: 'معرض أعمالنا الإبداعية',
    en: 'Our Creative Portfolio',
    fr: 'Notre Galerie Créative',
    de: 'Unser kreatives Portfolio',
  },
  galAll: { ar: 'الكل', en: 'All', fr: 'Tous', de: 'Alle' },
  galPhotos: { ar: 'الصور 📷', en: 'Photos 📷', fr: 'Photos 📷', de: 'Fotos 📷' },
  galVideos: { ar: 'الفيديو 🎬', en: 'Videos 🎬', fr: 'Vidéos 🎬', de: 'Videos 🎬' },
  globalOfficesBadge: {
    ar: 'فروعنا حول العالم',
    en: 'Global Offices',
    fr: 'Nos Bureaux dans le Monde',
    de: 'Standorte Weltweit',
  },
  internationalBranchesTitle: {
    ar: 'الفروع الدولية والتواصل المباشر',
    en: 'International Branches & Direct Contact',
    fr: 'Filiales Internationales & Contact Direct',
    de: 'Internationale Filialen & Direktkontakt',
  },
  statsProjects: { ar: 'مشروع منجز', en: 'Projects Done', fr: 'Projets Réalisés', de: 'Abgeschlossene Projekte' },
  statsSatisfaction: { ar: 'رضا العملاء', en: 'Client Satisfaction', fr: 'Satisfaction Clients', de: 'Kundenzufriedenheit' },
  statsOffices: { ar: 'فروع عالمية', en: 'Global Offices', fr: 'Bureaux Internationaux', de: 'Globale Standorte' },
  statsSupport: { ar: 'دعم فني متاح', en: '24/7 Support', fr: 'Support 24/7', de: '24/7 Support' },
  catTechTitle: { ar: 'الخدمات التقنية والسحابية', en: 'Tech & Cloud Services', fr: 'Services Techniques & Cloud', de: 'Technische & Cloud-Dienste' },
  catDesignTitle: { ar: 'خدمات التصميم والإنتاج الإبداعي', en: 'Creative Design & Media Production', fr: 'Design Créatif & Production Média', de: 'Kreatives Design & Medienproduktion' },
  catPrintTitle: { ar: 'خدمات الطباعة والدعاية الشاملة', en: 'Printing & Merchandise Services', fr: 'Services d\'Impression & Publicité', de: 'Druck- & Werbedienste' },
  catContentTitle: { ar: 'خدمات المحتوى والإنتاج الصوتي', en: 'Content & Voice Over Services', fr: 'Services de Contenu & Voix Off', de: 'Inhalts- & Voice-Over-Dienste' },
  servicesAvailable: { ar: 'خدمات متاحة', en: 'services available', fr: 'services disponibles', de: 'verfügbare Dienste' },
  viewAllServicesBtn: { ar: 'عرض دليل كافة الخدمات ➔', en: 'View All Services Directory ➔', fr: 'Voir le répertoire des services ➔', de: 'Alle Dienste anzeigen ➔' },
  bannerTechBadge: { ar: 'البرمجة والتطوير', en: 'Software & Development', fr: 'Développement & Logiciels', de: 'Software & Entwicklung' },
  bannerTechTitle: { ar: 'نحوّل أفكارك لتطبيقات تعمل فعلاً', en: 'We turn your ideas into functional applications', fr: 'Nous transformons vos idées en applications fonctionnelles', de: 'Wir verwandeln Ihre Ideen in funktionierende Anwendungen' },
  bannerTechDesc: { ar: 'مواقع React/Next.js، تطبيقات موبايل iOS/Android، APIs وأنظمة إدارة مخصصة. نبدأ بتحليل احتياجاتك وننتهي بتسليم مشروع جاهز للإطلاق.', en: 'React/Next.js websites, iOS/Android mobile apps, APIs & custom management systems. We analyze your needs and deliver ready-to-launch projects.', fr: 'Sites React/Next.js, applications mobiles iOS/Android, APIs et systèmes de gestion sur mesure. Nous analysons vos besoins et livrons des projets prêts à lancer.', de: 'React/Next.js Webseiten, iOS/Android Apps, APIs & benutzerdefinierte Systeme. Wir analysieren Ihre Bedürfnisse und liefern startbereite Projekte.' },
  bannerDesignBadge: { ar: 'تصميم وإعلانات', en: 'Design & Advertising', fr: 'Design & Publicité', de: 'Design & Werbung' },
  bannerDesignTitle: { ar: 'صورة تساوي ألف كلمة - تصنع الكلمات الصح', en: 'A picture worth a thousand words - making the right statement', fr: 'Une image vaut mille mots - marquer les esprits', de: 'Ein Bild sagt mehr als tausend Worte - das richtige Statement setzen' },
  bannerDesignDesc: { ar: 'جلسات تصوير استوديو، إخراج سينمائي، وإعلانات موشن جرافيك ورندر ثلاثي الأبعاد تجذب الانتباه وتعزز مبيعات علاماتك التجارية.', en: 'Studio photo sessions, cinematic direction, motion graphics ads and 3D rendering to boost your brand sales.', fr: 'Séances photo studio, réalisation cinématographique, publicités motion design et rendu 3D pour booster vos ventes.', de: 'Studio-Fotoshootings, Regie, Motion-Graphics-Werbung und 3D-Rendering zur Steigerung Ihres Markenumsatzes.' },
  bannerPrintBadge: { ar: 'طباعة ودعاية', en: 'Print & Merchandise', fr: 'Impression & Publicité', de: 'Druck & Werbeartikel' },
  bannerPrintTitle: { ar: 'مطبوعاتك واجهتك الأولى أمام كل عميل', en: 'Your prints are your brand\'s first impression', fr: 'Vos impressions sont la première impression de votre marque', de: 'Ihre Drucke sind der erste Eindruck Ihrer Marke' },
  bannerPrintDesc: { ar: 'كروت عمل، ملصقات فينيل مقاومة للماء، طباعة حريرية وUV على الأكواب والهدايا الدعائية ومجسمات 3D عالية الدقة.', en: 'Business cards, waterproof vinyl stickers, silk screen & UV printing on mugs, corporate gifts and high-precision 3D models.', fr: 'Cartes de visite, autocollants en vinyle étanches, sérigraphie et impression UV sur tasses, cadeaux d\'entreprise et modèles 3D.', de: 'Visitenkarten, wasserdichte Vinylsticker, Sieb- und UV-Druck auf Tassen, Werbegeschenken und hochpräzisen 3D-Modellen.' },
};

function tUi(key: string, lang: string): string {
  return uiText[key]?.[lang] || uiText[key]?.['en'] || '';
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
  const [activeGalleryTab, setActiveGalleryTab] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [highlightOffers, setHighlightOffers] = useState(false);

  // Deduplicate services by serviceKey or title
  const uniqueServices = useMemo(() => {
    const map = new Map();
    for (const svc of services) {
      const k = svc.serviceKey || getLocString(svc.title, locale);
      if (!map.has(k)) {
        map.set(k, svc);
      }
    }
    return Array.from(map.values());
  }, [services, locale]);

  // Group unique services into 4 main categories matching the screenshot photo
  const categorizedServices = useMemo(() => {
    const groups = {
      tech: [] as any[],
      design: [] as any[],
      print: [] as any[],
      content: [] as any[],
    };

    for (const svc of uniqueServices) {
      const cat = getServiceCategory(svc);
      groups[cat].push(svc);
    }
    return groups;
  }, [uniqueServices]);

  // Active sliders from DB
  const displaySlides = sliders.length > 0 ? sliders : [
    {
      title: { ar: 'حلول استضافة وسيرفرات سحابية فائقة الأداء', en: 'High Performance Cloud & Hosting Solutions', fr: 'Solutions Cloud et Hébergement Haute Performance', de: 'Hochleistungs-Cloud- & Hosting-Lösungen' },
      subtitle: { ar: 'بنية تحتية متطورة في ألمانيا وفرنسا مع حماية شاملة وسرعة فائقة', en: 'Advanced infrastructure in Germany & France with DDoS protection', fr: 'Infrastructure avancée en Allemagne et en France avec protection DDoS', de: 'Fortschrittliche Infrastruktur in Deutschland & Frankreich mit DDoS-Schutz' },
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      btnText: { ar: 'تصفح الخدمات', en: 'Explore Services', fr: 'Explorer les services', de: 'Dienste erkunden' },
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

  // Gallery filtering strictly by photo or video or all as requested
  const filteredGallery = useMemo(() => {
    if (activeGalleryTab === 'all') return gallery;
    if (activeGalleryTab === 'photo') {
      return gallery.filter(item => item.mediaType === 'image' || (!item.mediaType && !item.videoUrl));
    }
    return gallery.filter(item => item.mediaType === 'video' || !!item.videoUrl);
  }, [gallery, activeGalleryTab]);

  const handleSmoothScrollToOffers = (e: React.MouseEvent) => {
    e.preventDefault();
    const offersEl = document.getElementById('offers');
    if (offersEl) {
      offersEl.scrollIntoView({ behavior: 'smooth' });
      setHighlightOffers(true);
      setTimeout(() => setHighlightOffers(false), 2000);
    }
  };

  return (
    <div className="space-y-20 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ══ 1. HERO SLIDER SECTION (DYNAMIC FROM DASHBOARD) ══ */}
      <section className="relative overflow-hidden rounded-3xl border border-venecos-gold/30 bg-black min-h-[460px] flex items-center shadow-2xl">
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
                className="px-8 py-3.5 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 active:scale-95 text-black font-black text-sm rounded-xl shadow-xl transition-all flex items-center gap-2"
              >
                {getLocString(slide.btnText, locale)} <MdArrowForward className={isRtl ? 'rotate-180 text-lg' : 'text-lg'} />
              </a>
            )}
            <a
              href="#offers"
              onClick={handleSmoothScrollToOffers}
              className="px-8 py-3.5 bg-white/10 backdrop-blur-md hover:bg-white/20 active:scale-95 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <MdOutlineLocalOffer className="text-venecos-gold text-lg" />
              {tUi('heroExclusiveOffers', locale)}
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

      {/* ══ 2. STATS SECTION ══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: tUi('statsProjects', locale), val: '+250', icon: '🚀' },
          { label: tUi('statsSatisfaction', locale), val: '100%', icon: '⭐' },
          { label: tUi('statsOffices', locale), val: '4', icon: '🌐' },
          { label: tUi('statsSupport', locale), val: '24/7', icon: '🎧' },
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

      {/* ══ 3. EXCLUSIVE OFFERS SECTION (MOVED TO THE TOP RIGHT UNDER SLIDER & STATS!) ══ */}
      {offers.length > 0 && (
        <section 
          id="offers" 
          className={`space-y-8 transition-all duration-700 rounded-3xl p-6 bg-gradient-to-b from-venecos-gold/10 via-venecos-black/90 to-venecos-black border border-venecos-gold/30 shadow-2xl ${
            highlightOffers ? 'ring-2 ring-venecos-gold bg-venecos-gold/10 animate-gold-pulse' : ''
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
                <MdOutlineLocalOffer className="animate-bounce" /> {tUi('specialOffersBadge', locale)}
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
                {tUi('heroExclusiveOffers', locale)}
                <span className="text-xs bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-3 py-1 rounded-full font-bold">
                  2026 SPECIAL
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((off) => {
              const title = getLocString(off.title, locale);
              const desc = getLocString(off.description, locale);
              const badge = getLocString(off.badge, locale);
              const savings = off.originalPrice > off.discountedPrice 
                ? off.originalPrice - off.discountedPrice 
                : null;

              return (
                <div
                  key={off._id}
                  onClick={() => setSelectedOffer(off)}
                  className="bg-venecos-black/90 border border-white/15 hover:border-venecos-gold/70 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:-translate-y-2 active:scale-95 cursor-pointer transition-all duration-300 transform"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-venecos-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      {badge ? (
                        <span className="inline-block bg-gradient-to-r from-red-500/30 to-amber-500/30 text-amber-300 border border-red-500/40 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                          {badge}
                        </span>
                      ) : (
                        <span className="inline-block bg-venecos-gold/10 text-venecos-gold border border-venecos-gold/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                          {tUi('limitedOfferBadge', locale)}
                        </span>
                      )}
                      
                      {savings && (
                        <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
                          {tUi('saveAmount', locale)} €{savings}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-venecos-gold transition-colors duration-200">
                      {title}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-venecos-gold font-mono tracking-tight drop-shadow-md">
                        €{off.discountedPrice}
                      </span>
                      <span className="text-xs text-white/40 line-through font-mono">
                        €{off.originalPrice}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOffer(off);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-venecos-gold via-yellow-400 to-yellow-500 hover:opacity-95 active:scale-95 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all duration-150 shadow-lg group-hover:shadow-venecos-gold/20"
                    >
                      <MdFlashOn className="text-base" />
                      {tUi('orderOfferBtn', locale)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══ 4. SERVICES SECTION MATCHING EXACT PHOTO LAYOUT (PACKED & CATEGORIZED) ══ */}
      <section id="services" className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-venecos-gold rounded-full" />
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              {tUi('ourServicesTitle', locale)}
            </h2>
          </div>

          <Link
            href={`/${locale}/services`}
            className="text-xs font-bold text-venecos-gold hover:underline border border-venecos-gold/30 bg-venecos-gold/10 px-4 py-2 rounded-xl"
          >
            {tUi('viewAllServicesBtn', locale)}
          </Link>
        </div>

        {/* ── CATEGORY BOX 1: SERVICES TECH (الخدمات التقنية) ── */}
        <div className="bg-venecos-black/90 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xl">
                💻
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{tUi('catTechTitle', locale)}</h3>
                <span className="text-[11px] text-white/50">{categorizedServices.tech.length} {tUi('servicesAvailable', locale)}</span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categorizedServices.tech.map((svc) => {
              const sTitle = getLocString(svc.title, locale);
              const sDesc = getLocString(svc.description, locale);
              const sSlug = svc.serviceKey || svc._id.toString();

              return (
                <div
                  key={svc._id.toString()}
                  className="bg-neutral-900/80 border border-white/10 hover:border-venecos-gold/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-venecos-gold text-2xl group-hover:scale-110 transition-transform">
                      <ServiceIcon iconName={svc.iconName} />
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-venecos-gold transition-colors">{sTitle}</h4>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{sDesc}</p>
                  </div>

                  <Link
                    href={`/${locale}/services/${sSlug}`}
                    className="w-full py-2.5 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    {tUi('orderServiceBtn', locale)}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Feature Banner Card matching screenshot */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-neutral-900/90 to-neutral-950 border border-cyan-500/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                {tUi('bannerTechBadge', locale)}
              </span>
              <h4 className="text-2xl font-black text-white">{tUi('bannerTechTitle', locale)}</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                {tUi('bannerTechDesc', locale)}
              </p>
            </div>
            <div className="w-24 h-24 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-4xl shrink-0">
              ⚙️
            </div>
          </div>
        </div>

        {/* ── CATEGORY BOX 2: DESIGN & MEDIA (خدمات التصميم) ── */}
        <div className="bg-venecos-black/90 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center text-xl">
                🎨
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{tUi('catDesignTitle', locale)}</h3>
                <span className="text-[11px] text-white/50">{categorizedServices.design.length} {tUi('servicesAvailable', locale)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categorizedServices.design.map((svc) => {
              const sTitle = getLocString(svc.title, locale);
              const sDesc = getLocString(svc.description, locale);
              const sSlug = svc.serviceKey || svc._id.toString();

              return (
                <div
                  key={svc._id.toString()}
                  className="bg-neutral-900/80 border border-white/10 hover:border-venecos-gold/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-venecos-gold text-2xl group-hover:scale-110 transition-transform">
                      <ServiceIcon iconName={svc.iconName} />
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-venecos-gold transition-colors">{sTitle}</h4>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{sDesc}</p>
                  </div>

                  <Link
                    href={`/${locale}/services/${sSlug}`}
                    className="w-full py-2.5 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    {tUi('orderServiceBtn', locale)}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-purple-950/40 via-neutral-900/90 to-neutral-950 border border-purple-500/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                {tUi('bannerDesignBadge', locale)}
              </span>
              <h4 className="text-2xl font-black text-white">{tUi('bannerDesignTitle', locale)}</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                {tUi('bannerDesignDesc', locale)}
              </p>
            </div>
            <div className="w-24 h-24 bg-purple-500/10 rounded-2xl border border-purple-500/30 flex items-center justify-center text-purple-400 text-4xl shrink-0">
              📸
            </div>
          </div>
        </div>

        {/* ── CATEGORY BOX 3: PRINTING & MERCHANDISE (خدمات الطباعة) ── */}
        <div className="bg-venecos-black/90 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xl">
                🖨️
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{tUi('catPrintTitle', locale)}</h3>
                <span className="text-[11px] text-white/50">{categorizedServices.print.length} {tUi('servicesAvailable', locale)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {categorizedServices.print.map((svc) => {
              const sTitle = getLocString(svc.title, locale);
              const sDesc = getLocString(svc.description, locale);
              const sSlug = svc.serviceKey || svc._id.toString();

              return (
                <div
                  key={svc._id.toString()}
                  className="bg-neutral-900/80 border border-white/10 hover:border-venecos-gold/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-venecos-gold text-2xl group-hover:scale-110 transition-transform">
                      <ServiceIcon iconName={svc.iconName} />
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-venecos-gold transition-colors">{sTitle}</h4>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{sDesc}</p>
                  </div>

                  <Link
                    href={`/${locale}/services/${sSlug}`}
                    className="w-full py-2.5 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    {tUi('orderServiceBtn', locale)}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900/90 to-neutral-950 border border-amber-500/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                {tUi('bannerPrintBadge', locale)}
              </span>
              <h4 className="text-2xl font-black text-white">{tUi('bannerPrintTitle', locale)}</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                {tUi('bannerPrintDesc', locale)}
              </p>
            </div>
            <div className="w-24 h-24 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-400 text-4xl shrink-0">
              📄
            </div>
          </div>
        </div>

        {/* ── CATEGORY BOX 4: CONTENT & AUDIO (خدمات المحتوى والتعليق الصوتي) ── */}
        <div className="bg-venecos-black/90 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xl">
                🎙️
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{tUi('catContentTitle', locale)}</h3>
                <span className="text-[11px] text-white/50">{categorizedServices.content.length} {tUi('servicesAvailable', locale)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categorizedServices.content.map((svc) => {
              const sTitle = getLocString(svc.title, locale);
              const sDesc = getLocString(svc.description, locale);
              const sSlug = svc.serviceKey || svc._id.toString();

              return (
                <div
                  key={svc._id.toString()}
                  className="bg-neutral-900/80 border border-white/10 hover:border-venecos-gold/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-venecos-gold text-2xl group-hover:scale-110 transition-transform">
                      <ServiceIcon iconName={svc.iconName} />
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-venecos-gold transition-colors">{sTitle}</h4>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{sDesc}</p>
                  </div>

                  <Link
                    href={`/${locale}/services/${sSlug}`}
                    className="w-full py-2.5 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    {tUi('orderServiceBtn', locale)}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 5. WORK PORTFOLIO GALLERY SECTION (SORTED AS PHOTO OR VIDEO OR ALL ONLY) ══ */}
      {gallery.length > 0 && (
        <section id="gallery" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
                <MdWork /> {tUi('galleryBadge', locale)}
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                {tUi('galleryTitle', locale)}
              </h2>
            </div>

            {/* Gallery Sorting Buttons: STRICTLY PHOTO OR VIDEO OR ALL */}
            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveGalleryTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeGalleryTab === 'all'
                    ? 'bg-venecos-gold text-black shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tUi('galAll', locale)}
              </button>
              <button
                type="button"
                onClick={() => setActiveGalleryTab('photo')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeGalleryTab === 'photo'
                    ? 'bg-venecos-gold text-black shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tUi('galPhotos', locale)}
              </button>
              <button
                type="button"
                onClick={() => setActiveGalleryTab('video')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeGalleryTab === 'video'
                    ? 'bg-venecos-gold text-black shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tUi('galVideos', locale)}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <GalleryCardItem key={item._id} item={item} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* ══ 6. GLOBAL BRANCHES SECTION ══ */}
      {branches.length > 0 && (
        <section id="branches" className="space-y-8">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-venecos-gold font-bold text-xs uppercase tracking-widest mb-1">
              <MdLocationOn /> {tUi('globalOfficesBadge', locale)}
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              {tUi('internationalBranchesTitle', locale)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((b) => (
              <div
                key={b._id}
                className="bg-venecos-black/80 border border-white/10 hover:border-venecos-gold/40 rounded-2xl p-6 space-y-4 shadow-xl group transition-all"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-venecos-gold transition-colors flex items-center gap-2">
                    <span className="text-xl">📍</span> {getLocString(b.city, locale)}
                  </h3>
                  <span className="text-xs font-mono text-venecos-gold font-bold bg-venecos-gold/10 px-2.5 py-1 rounded-full border border-venecos-gold/30">
                    {getLocString(b.country, locale)}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-white/70">
                  {b.address && (
                    <p className="flex items-start gap-2">
                      <MdLocationOn className="text-venecos-gold text-sm shrink-0 mt-0.5" />
                      <span>{getLocString(b.address, locale)}</span>
                    </p>
                  )}
                  {b.phone && (
                    <p className="flex items-center gap-2">
                      <MdPhone className="text-venecos-gold text-sm shrink-0" />
                      <span className="font-mono" dir="ltr">{b.phone}</span>
                    </p>
                  )}
                  {b.email && (
                    <p className="flex items-center gap-2">
                      <MdEmail className="text-venecos-gold text-sm shrink-0" />
                      <span className="font-mono">{b.email}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ INTERACTIVE OFFER DETAILS & ORDERING MODAL ══ */}
      {selectedOffer && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedOffer(null)}
        >
          <div 
            className="bg-venecos-black border border-venecos-gold/40 rounded-3xl w-full max-w-xl p-6 md:p-8 space-y-6 shadow-2xl relative animate-modal-pop text-white"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <MdLocalOffer /> VENECOS SPECIAL OFFER
                  </span>
                  {selectedOffer.badge && (
                    <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {getLocString(selectedOffer.badge, locale)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white pt-1">
                  {getLocString(selectedOffer.title, locale)}
                </h2>
              </div>

              <button 
                onClick={() => setSelectedOffer(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 transition-all"
              >
                <MdClose size={22} />
              </button>
            </div>

            <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
              {getLocString(selectedOffer.description, locale)}
            </p>

            <div className="flex items-center justify-between bg-gradient-to-r from-venecos-gold/15 to-transparent p-4 rounded-2xl border border-venecos-gold/30">
              <div>
                <span className="block text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  SPECIAL PROMO PRICE
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-black text-venecos-gold font-mono">
                    €{selectedOffer.discountedPrice}
                  </span>
                  <span className="text-sm text-white/40 line-through font-mono">
                    €{selectedOffer.originalPrice}
                  </span>
                </div>
              </div>

              {selectedOffer.originalPrice > selectedOffer.discountedPrice && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 rounded-xl text-emerald-400 font-bold text-xs text-center font-mono">
                  {tUi('saveAmount', locale)} €{selectedOffer.originalPrice - selectedOffer.discountedPrice}!
                </div>
              )}
            </div>

            {selectedOffer.features && selectedOffer.features.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-venecos-gold uppercase tracking-widest flex items-center gap-1.5">
                  <MdStar className="text-venecos-gold" /> {tUi('includedFeatures', locale)}
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedOffer.features.map((feat: any, idx: number) => {
                    const featText = getLocString(feat, locale);
                    if (!featText) return null;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-xs font-medium text-white/90 bg-white/5 p-3 rounded-xl border border-white/10">
                        <MdCheckCircle className="text-venecos-gold text-lg shrink-0" />
                        <span>{featText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row gap-3">
              <Link
                href={`/${locale}/services/vps/order`}
                onClick={() => setSelectedOffer(null)}
                className="flex-1 py-3.5 bg-gradient-to-r from-venecos-gold via-yellow-400 to-yellow-500 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl hover:opacity-95 active:scale-95 transition-all"
              >
                <MdFlashOn className="text-lg" /> {tUi('claimOfferNow', locale)}
              </Link>
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/15"
              >
                {tUi('viewDetails', locale)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
