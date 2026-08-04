'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MdArrowBack, MdCheckCircle, MdFlashOn, MdStar, MdDns, MdCloud,
  MdPrint, MdLabel, MdMic, MdEditDocument, MdCameraAlt, MdVideoLibrary,
  Md3dRotation, MdCampaign, MdLanguage, MdHeadset, MdCode, MdTune,
  MdCalculate, MdLocalShipping, MdShield, MdTune as MdSliders
} from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

function getLocString(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'object') {
    return val[lang] || val['en'] || val['ar'] || val['fr'] || val['de'] || Object.values(val)[0] || '';
  }
  if (typeof val === 'string') {
    if (val.trim().startsWith('{') && val.trim().endsWith('}')) {
      try {
        const parsed = JSON.parse(val);
        return parsed[lang] || parsed['en'] || parsed['ar'] || parsed['fr'] || parsed['de'] || val;
      } catch (e) {
        return val;
      }
    }
    return val;
  }
  return String(val);
}

function ServiceIcon({ iconName, className = "text-4xl text-venecos-gold" }: { iconName?: string; className?: string }) {
  if (!iconName) return <FaIcons.FaCode className={className} />;
  const FaIcon = (FaIcons as any)[iconName];
  if (FaIcon) return <FaIcon className={className} />;
  const MdIcon = (MdIcons as any)[iconName];
  if (MdIcon) return <MdIcon className={className} />;
  return <FaIcons.FaCode className={className} />;
}

const uiDict: Record<string, Record<string, string>> = {
  backToServices: { ar: 'العودة لجميع الخدمات', en: 'Back to All Services', fr: 'Retour aux services', de: 'Zurück zu allen Diensten' },
  availablePackages: { ar: 'الباقات والخطط المتاحة', en: 'Available Packages & Plans', fr: 'Forfaits disponibles', de: 'Verfügbare Pakete' },
  orderPackage: { ar: 'اطلب هذه الباقة الآن ➔', en: 'Order Package Now ➔', fr: 'Commander ce forfait ➔', de: 'Dieses Paket bestellen ➔' },
  featuresIncluded: { ar: 'المميزات المتضمنة بالخدمة:', en: 'Key Features Included:', fr: 'Caractéristiques incluses :', de: 'Enthaltene Funktionen:' },
  calcTitle: { ar: 'محاكي وسيموليتر الحاسبة الفورية', en: 'Instant Price Calculator Simulator', fr: 'Simulateur de prix instantané', de: 'Sofortiger Preissimulator' },
  widthLabel: { ar: 'العرض (سم)', en: 'Width (cm)', fr: 'Largeur (cm)', de: 'Breite (cm)' },
  heightLabel: { ar: 'الارتفاع (سم)', en: 'Height (cm)', fr: 'Hauteur (cm)', de: 'Höhe (cm)' },
  qtyLabel: { ar: 'الكمية المطلوب طباعتها', en: 'Quantity (pcs)', fr: 'Quantité', de: 'Menge' },
  estTotal: { ar: 'السعر التقديري الإجمالي:', en: 'Estimated Total Price:', fr: 'Prix estimé total :', de: 'Geschätzter Gesamtpreis:' },
  materialsTitle: { ar: 'الخامات والتشطيبات المتاحة', en: 'Available Materials & Finishes', fr: 'Matériaux & Finitions', de: 'Materialien & Veredelungen' },
  guaranteeTitle: { ar: 'ضمان الاستقرار والجودة العالية', en: 'High Quality & Stability Guarantee', fr: 'Garantie de qualité et stabilité', de: 'Qualitäts- und Stabilitätsgarantie' },
  specsTitle: { ar: 'المواصفات الفنية المتقدمة', en: 'Advanced Technical Specifications', fr: 'Spécifications techniques', de: 'Technische Spezifikationen' },
  noPackages: { ar: 'لا توجد باقات محددة لهذه الخدمة حالياً، يمكنك التواصل معنا مباشرة.', en: 'No specific packages listed yet. Contact us directly!', fr: 'Aucun forfait répertorié. Contactez-nous !', de: 'Noch keine Pakete gelistet.' }
};

export default function ServiceDetailClient({
  locale,
  service,
  serviceId
}: {
  locale: string;
  service: any;
  serviceId: string;
}) {
  const isRtl = locale === 'ar';
  const key = (service.serviceKey || '').toLowerCase();
  const tUi = (k: string) => uiDict[k]?.[locale] || uiDict[k]?.['en'] || '';

  const title = getLocString(service.title, locale);
  const description = getLocString(service.description, locale);
  const subServices = service.subServices || [];

  // Simulator Calculator State (for Print Services)
  const [simW, setSimW] = useState(10);
  const [simH, setSimH] = useState(10);
  const [simQty, setSimQty] = useState(100);

  const areaM2 = (simW * simH) / 10000;
  const calcPrice = Math.max(15, Math.round(areaM2 * simQty * 25 * 100) / 100);

  // Category determination
  const isTech = ['vps', 'shared-hosting', 'programming', 'domains', 'support'].includes(key);
  const isPrint = ['paper-print', 'stickers', 'adv-print', '3d-print'].includes(key);
  const isMedia = ['photography', 'video', '3d-design'].includes(key);
  const isAudioContent = ['voiceover', 'content-writing'].includes(key);

  return (
    <div className="space-y-12 pb-20 text-white font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ══ HEADER BAR ══ */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <Link
          href={`/${locale}/services`}
          className="inline-flex items-center gap-2 text-xs font-bold text-venecos-gold bg-venecos-gold/10 hover:bg-venecos-gold/20 border border-venecos-gold/30 px-4 py-2 rounded-xl transition-all"
        >
          <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backToServices')}
        </Link>

        <div className="flex items-center gap-2 text-xs text-white/60 font-mono">
          <span>VENECOS</span> / <span className="text-venecos-gold font-bold uppercase">{key || 'SERVICE'}</span>
        </div>
      </div>

      {/* ══ MAIN HERO CARD WITH BESPOKE CATEGORY STYLING ══ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-venecos-black via-neutral-900 to-venecos-black border border-venecos-gold/40 p-8 md:p-12 shadow-2xl space-y-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-venecos-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-venecos-gold/20 to-black/60 border-2 border-venecos-gold/40 flex items-center justify-center shadow-xl shrink-0">
            <ServiceIcon iconName={service.iconName} className="text-5xl text-venecos-gold" />
          </div>

          <div className="space-y-4 max-w-3xl">
            <span className="inline-block bg-venecos-gold/15 text-venecos-gold border border-venecos-gold/30 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              {key ? `SERVICE CATEGORY: ${key.toUpperCase()}` : 'VENECOS OFFICIAL SERVICE'}
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {title}
            </h1>

            <p className="text-white/80 text-base md:text-lg font-light leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* BESPOKE SPEC HIGHLIGHTS PER CATEGORY */}
        {isTech && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdCloud className="text-2xl text-cyan-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Datacenters</span>
                <span className="font-bold text-white">Germany 🇩🇪 & France 🇫🇷</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdShield className="text-2xl text-emerald-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Security</span>
                <span className="font-bold text-white">DDoS Protected + SSL</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdDns className="text-2xl text-venecos-gold" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Architecture</span>
                <span className="font-bold text-white">NVMe SSD High Speed</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdHeadset className="text-2xl text-purple-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Support</span>
                <span className="font-bold text-white">24/7 Monitoring</span>
              </div>
            </div>
          </div>
        )}

        {isPrint && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdPrint className="text-2xl text-amber-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Quality</span>
                <span className="font-bold text-white">High Res Full Color</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdLabel className="text-2xl text-venecos-gold" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Materials</span>
                <span className="font-bold text-white">Vinyl, Matte, Glossy, UV</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdLocalShipping className="text-2xl text-emerald-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Shipping</span>
                <span className="font-bold text-white">Fast EU & Global Express</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdSliders className="text-2xl text-purple-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Customization</span>
                <span className="font-bold text-white">Custom Sizes & Cut</span>
              </div>
            </div>
          </div>
        )}

        {isMedia && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdVideoLibrary className="text-2xl text-purple-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Resolution</span>
                <span className="font-bold text-white">4K Ultra HD & 1080p</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdCameraAlt className="text-2xl text-venecos-gold" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Equipment</span>
                <span className="font-bold text-white">Cinema Gear & Studio</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <Md3dRotation className="text-2xl text-cyan-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Interactivity</span>
                <span className="font-bold text-white">3D 360° & Motion</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdStar className="text-2xl text-amber-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Revisions</span>
                <span className="font-bold text-white">Free Edits Included</span>
              </div>
            </div>
          </div>
        )}

        {isAudioContent && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdMic className="text-2xl text-emerald-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Studio</span>
                <span className="font-bold text-white">Mastered Audio HD</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdEditDocument className="text-2xl text-venecos-gold" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">SEO & Copy</span>
                <span className="font-bold text-white">100% Unique Writing</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdLanguage className="text-2xl text-cyan-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Languages</span>
                <span className="font-bold text-white">AR / EN / FR / DE</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <MdStar className="text-2xl text-purple-400" />
              <div>
                <span className="block text-white/50 text-[10px] uppercase font-bold">Delivery</span>
                <span className="font-bold text-white">Fast Turnaround</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ BESPOKE WIDGET: LIVE PRINTING CALCULATOR (FOR PRINT SERVICES) ══ */}
      {isPrint && (
        <div className="bg-venecos-black/90 border border-amber-500/40 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <MdCalculate className="text-3xl text-amber-400" />
            <div>
              <h3 className="text-xl font-bold text-white">{tUi('calcTitle')}</h3>
              <p className="text-xs text-white/60">اختر أبعاد وحجم المطبوعات واحسب تكلفة التوريد فورياً</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">{tUi('widthLabel')}</label>
              <input
                type="number"
                value={simW}
                onChange={(e) => setSimW(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">{tUi('heightLabel')}</label>
              <input
                type="number"
                value={simH}
                onChange={(e) => setSimH(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">{tUi('qtyLabel')}</label>
              <input
                type="number"
                value={simQty}
                onChange={(e) => setSimQty(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="block text-xs font-bold text-white/70">{tUi('estTotal')}</span>
              <span className="text-3xl font-black text-amber-400 font-mono">€{calcPrice}</span>
              <span className="text-[11px] text-white/50 block font-mono">({areaM2.toFixed(3)} m² × {simQty} pcs)</span>
            </div>

            <Link
              href={`/${locale}/services/${serviceId}/order`}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              اطلب بنفس الأبعاد الآن ➔
            </Link>
          </div>
        </div>
      )}

      {/* ══ AVAILABLE PACKAGES & TIERS LISTING ══ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <MdStar className="text-venecos-gold" />
            {tUi('availablePackages')}
          </h2>

          <span className="text-xs text-venecos-gold font-mono font-bold bg-venecos-gold/10 px-3 py-1 rounded-full border border-venecos-gold/30">
            {subServices.length} PACKAGES AVAILABLE
          </span>
        </div>

        {subServices.length === 0 ? (
          <div className="bg-venecos-black/80 border border-white/10 rounded-3xl p-10 text-center text-white/60 italic shadow-xl">
            {tUi('noPackages')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {subServices.map((sub: any, i: number) => {
              const subTitle = getLocString(sub.title, locale);
              const subDesc = getLocString(sub.description, locale);
              const subId = sub._id?.toString() || i;

              return (
                <div
                  key={subId}
                  className="bg-venecos-black/90 border border-white/15 hover:border-venecos-gold/60 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-venecos-gold opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 flex items-center justify-center font-mono font-black text-sm">
                        0{i + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-white group-hover:text-venecos-gold transition-colors">
                        {subTitle}
                      </h3>
                    </div>

                    <p className="text-sm text-white/70 leading-relaxed max-w-3xl">
                      {subDesc}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
                    <div className="text-3xl md:text-4xl font-black text-venecos-gold font-mono tracking-tight">
                      €{sub.price}
                    </div>

                    <Link href={`/${locale}/services/${serviceId}/order?subId=${subId}`}>
                      <button className="w-full md:w-auto bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 active:scale-95 text-black font-extrabold py-3.5 px-8 rounded-2xl shadow-xl transition-all text-xs tracking-wider uppercase">
                        {tUi('orderPackage')}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
