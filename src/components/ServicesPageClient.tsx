'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  MdSearch, MdDesignServices, MdArrowForward, MdCheckCircle, 
  MdOutlineLocalOffer, MdFlashOn, MdStar, MdFilterList, MdCode, MdLayers
} from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

import { getLocString } from '@/lib/i18nUtils';

function ServiceIcon({ iconName, className = "text-3xl text-venecos-gold" }: { iconName?: string; className?: string }) {
  if (!iconName) return <FaIcons.FaCode className={className} />;
  const FaIcon = (FaIcons as any)[iconName];
  if (FaIcon) return <FaIcon className={className} />;
  const MdIcon = (MdIcons as any)[iconName];
  if (MdIcon) return <MdIcon className={className} />;
  return <FaIcons.FaCode className={className} />;
}

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

const uiText: Record<string, Record<string, string>> = {
  badge: {
    ar: 'دليل خدمات VENECOS 2026',
    en: 'VENECOS SERVICES DIRECTORY 2026',
    fr: 'RÉPERTOIRE DES SERVICES VENECOS 2026',
    de: 'VENECOS DIENSTVERZEICHNIS 2026',
  },
  title: {
    ar: 'الخدمات الرقمية والإعلانية الشاملة',
    en: 'Comprehensive Digital & Media Services',
    fr: 'Services Numériques & Médias Complets',
    de: 'Umfassende digitale & Medien-Dienste',
  },
  subtitle: {
    ar: 'استكشف كافة باقتنا الاحترافية في البرمجة، الاستضافة، الإنتاج الإبداعي، الطباعة والتعليق الصوتي',
    en: 'Explore our full suite of software development, cloud infrastructure, media production, printing & voiceover services.',
    fr: 'Découvrez notre gamme complète de développement web, cloud, production média, impression et voix off.',
    de: 'Entdecken Sie unser gesamtes Angebot an Softwareentwicklung, Cloud-Hosting, Medienproduktion und Druck.',
  },
  searchPlaceholder: {
    ar: 'ابحث عن أي خدمة أو باقة...',
    en: 'Search any service or package...',
    fr: 'Rechercher un service ou forfait...',
    de: 'Suchen Sie nach einem Dienst...',
  },
  catAll: { ar: 'الكل', en: 'All', fr: 'Tous', de: 'Alle' },
  catTech: { ar: '💻 التقنية والسحابية', en: '💻 Tech & Cloud', fr: '💻 Tech & Cloud', de: '💻 Tech & Cloud' },
  catDesign: { ar: '🎨 التصميم والإنتاج', en: '🎨 Design & Media', fr: '🎨 Design & Média', de: '🎨 Design & Medien' },
  catPrint: { ar: '🖨️ الطباعة والدعاية', en: '🖨️ Printing & Merchandise', fr: '🖨️ Impression', de: '🖨️ Druck' },
  catContent: { ar: '🎙️ المحتوى والصوتيات', en: '🎙️ Content & Voice', fr: '🎙️ Contenu & Voix', de: '🎙️ Inhalt' },
  orderServiceBtn: { ar: 'اطلب الخدمة ←', en: 'Order Service ←', fr: 'Commander ←', de: 'Bestellen ←' },
  noResults: { ar: 'لم يتم العثور على خدمات تطابق البحث.', en: 'No services found matching your search.', fr: 'Aucun service ne correspond à votre recherche.', de: 'Keine Dienste gefunden.' },
  catTechTitle: { ar: 'الخدمات التقنية والسحابية', en: 'Tech & Cloud Services', fr: 'Services Techniques & Cloud', de: 'Technische & Cloud-Dienste' },
  catDesignTitle: { ar: 'خدمات التصميم والإنتاج الإبداعي', en: 'Creative Design & Media Production', fr: 'Design Créatif & Production Média', de: 'Kreatives Design & Medienproduktion' },
  catPrintTitle: { ar: 'خدمات الطباعة والدعاية الشاملة', en: 'Printing & Merchandise Services', fr: 'Services d\'Impression & Publicité', de: 'Druck- & Werbedienste' },
  catContentTitle: { ar: 'خدمات المحتوى والإنتاج الصوتي', en: 'Content & Voice Over Services', fr: 'Services de Contenu & Voix Off', de: 'Inhalts- & Voice-Over-Dienste' },
  servicesAvailable: { ar: 'خدمات متاحة', en: 'services available', fr: 'services disponibles', de: 'verfügbare Dienste' },
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

export default function ServicesPageClient({
  locale,
  services = []
}: {
  locale: string;
  services: any[];
}) {
  const isRtl = locale === 'ar';
  const [selectedCat, setSelectedCat] = useState<'all' | 'tech' | 'design' | 'print' | 'content'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tUi = (key: string) => uiText[key]?.[locale] || uiText[key]?.['en'] || '';

  // Deduplicate services by title/serviceKey
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

  // Group services into 4 main categories matching the screenshot design
  const categorizedServices = useMemo(() => {
    const groups = {
      tech: [] as any[],
      design: [] as any[],
      print: [] as any[],
      content: [] as any[],
    };

    for (const svc of uniqueServices) {
      const cat = getServiceCategory(svc);
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = getLocString(svc.title, locale).toLowerCase();
        const desc = getLocString(svc.description, locale).toLowerCase();
        const subTitles = (svc.subServices || []).map((s: any) => getLocString(s.title, locale).toLowerCase()).join(' ');
        if (!title.includes(query) && !desc.includes(query) && !subTitles.includes(query)) {
          continue;
        }
      }
      groups[cat].push(svc);
    }
    return groups;
  }, [uniqueServices, searchQuery, locale]);

  const showTech = selectedCat === 'all' || selectedCat === 'tech';
  const showDesign = selectedCat === 'all' || selectedCat === 'design';
  const showPrint = selectedCat === 'all' || selectedCat === 'print';
  const showContent = selectedCat === 'all' || selectedCat === 'content';

  return (
    <div className="space-y-12 pb-16 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ══ HERO BANNER ══ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-venecos-black via-neutral-900 to-venecos-black border border-venecos-gold/30 p-8 md:p-14 text-center space-y-6 shadow-2xl">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-venecos-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <span className="inline-block bg-venecos-gold/15 border border-venecos-gold/30 text-venecos-gold text-xs font-black tracking-widest uppercase px-5 py-2 rounded-full backdrop-blur-md">
          {tUi('badge')}
        </span>

        <h1 className="text-4xl md:text-6xl font-black leading-tight text-white drop-shadow-md">
          {tUi('title')}
        </h1>

        <p className="text-white/70 text-base md:text-lg max-w-3xl mx-auto font-light leading-relaxed">
          {tUi('subtitle')}
        </p>

        {/* Search Input & Category Filters */}
        <div className="pt-6 max-w-4xl mx-auto space-y-6">
          <div className="relative max-w-xl mx-auto">
            <MdSearch className={`absolute top-1/2 -translate-y-1/2 text-venecos-gold text-xl ${isRtl ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tUi('searchPlaceholder')}
              className={`w-full bg-black/60 border border-white/20 focus:border-venecos-gold rounded-2xl py-3.5 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-white text-sm outline-none transition-all placeholder:text-white/40 shadow-inner`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {[
              { id: 'all', label: tUi('catAll') },
              { id: 'tech', label: tUi('catTech') },
              { id: 'design', label: tUi('catDesign') },
              { id: 'print', label: tUi('catPrint') },
              { id: 'content', label: tUi('catContent') },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-gradient-to-r from-venecos-gold to-yellow-500 text-black border-venecos-gold shadow-lg shadow-venecos-gold/20 scale-105 font-black'
                    : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CATEGORIZED PACKED SERVICES DISPLAY MATCHING PHOTO LAYOUT ══ */}
      <div className="space-y-12">
        {/* ── 1. TECH CATEGORY BOX ── */}
        {showTech && categorizedServices.tech.length > 0 && (
          <div className="bg-venecos-black/90 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xl">
                  💻
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{tUi('catTechTitle')}</h3>
                  <span className="text-[11px] text-white/50">{categorizedServices.tech.length} {tUi('servicesAvailable')}</span>
                </div>
              </div>
            </div>

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
                      {tUi('orderServiceBtn')}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-cyan-950/40 via-neutral-900/90 to-neutral-950 border border-cyan-500/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {tUi('bannerTechBadge')}
                </span>
                <h4 className="text-2xl font-black text-white">{tUi('bannerTechTitle')}</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {tUi('bannerTechDesc')}
                </p>
              </div>
              <div className="w-24 h-24 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-4xl shrink-0">
                ⚙️
              </div>
            </div>
          </div>
        )}

        {/* ── 2. DESIGN CATEGORY BOX ── */}
        {showDesign && categorizedServices.design.length > 0 && (
          <div className="bg-venecos-black/90 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center text-xl">
                  🎨
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{tUi('catDesignTitle')}</h3>
                  <span className="text-[11px] text-white/50">{categorizedServices.design.length} {tUi('servicesAvailable')}</span>
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
                      {tUi('orderServiceBtn')}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-purple-950/40 via-neutral-900/90 to-neutral-950 border border-purple-500/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {tUi('bannerDesignBadge')}
                </span>
                <h4 className="text-2xl font-black text-white">{tUi('bannerDesignTitle')}</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {tUi('bannerDesignDesc')}
                </p>
              </div>
              <div className="w-24 h-24 bg-purple-500/10 rounded-2xl border border-purple-500/30 flex items-center justify-center text-purple-400 text-4xl shrink-0">
                📸
              </div>
            </div>
          </div>
        )}

        {/* ── 3. PRINT CATEGORY BOX ── */}
        {showPrint && categorizedServices.print.length > 0 && (
          <div className="bg-venecos-black/90 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xl">
                  🖨️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{tUi('catPrintTitle')}</h3>
                  <span className="text-[11px] text-white/50">{categorizedServices.print.length} {tUi('servicesAvailable')}</span>
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
                      {tUi('orderServiceBtn')}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900/90 to-neutral-950 border border-amber-500/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {tUi('bannerPrintBadge')}
                </span>
                <h4 className="text-2xl font-black text-white">{tUi('bannerPrintTitle')}</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {tUi('bannerPrintDesc')}
                </p>
              </div>
              <div className="w-24 h-24 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-400 text-4xl shrink-0">
                📄
              </div>
            </div>
          </div>
        )}

        {/* ── 4. CONTENT CATEGORY BOX ── */}
        {showContent && categorizedServices.content.length > 0 && (
          <div className="bg-venecos-black/90 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xl">
                  🎙️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{tUi('catContentTitle')}</h3>
                  <span className="text-[11px] text-white/50">{categorizedServices.content.length} {tUi('servicesAvailable')}</span>
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
                      {tUi('orderServiceBtn')}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
