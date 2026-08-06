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

import { getLocString, getLocArray } from '@/lib/i18nUtils';

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
  availablePackages: { ar: 'الباقات والخطط المتاحة', en: 'Available Packages & Plans', fr: 'Forfaits & plans disponibles', de: 'Verfügbare Pakete & Pläne' },
  availablePackagesLabel: { ar: 'باقات متاحة', en: 'PACKAGES AVAILABLE', fr: 'FORFAITS DISPONIBLES', de: 'PAKETE VERFÜGBAR' },
  fromLabel: { ar: 'من', en: 'From', fr: 'De', de: 'Ab' },
  toLabel: { ar: 'إلى', en: 'To', fr: 'À', de: 'Bis' },
  deliveryTimeLabel: { ar: 'مدة التسليم:', en: 'Delivery Time:', fr: 'Délai de livraison :', de: 'Lieferzeit:' },
  defaultDeliveryDuration: { ar: '24 — 48 ساعة', en: '24 — 48 Hours', fr: '24 — 48 Heures', de: '24 — 48 Stunden' },
  termsBtn: { ar: 'الشروط', en: 'Terms', fr: 'Conditions', de: 'Bedingungen' },
  orderServiceBtn: { ar: 'طلب الخدمة', en: 'Order Service', fr: 'Commander', de: 'Dienst bestellen' },
  termsModalTitle: { ar: 'شروط وأحكام الباقة — ', en: 'Package Terms & Conditions — ', fr: 'Conditions du forfait — ', de: 'Paketbedingungen — ' },
  deliveryRevisionsTitle: { ar: '📋 التسليم والمراجعات', en: '📋 Delivery & Revisions', fr: '📋 Livraison & Révisions', de: '📋 Lieferung & Überarbeitungen' },
  paymentRightsTitle: { ar: '📋 الدفع والإلغاء وحقوق الملكية', en: '📋 Payment, Cancellation & Ownership Rights', fr: '📋 Paiement, Annulation & Droits', de: '📋 Zahlung, Stornierung & Rechte' },
  termsConsentWarning: { 
    ar: 'بالضغط على "طلب الخدمة" فإنك توافق على هذه الشروط كاملةً. للاستفسار تواصل معنا قبل تأكيد الطلب.', 
    en: 'By clicking "Order Service Now" you accept these terms in full. Contact us for any inquiries prior to order placement.', 
    fr: 'En cliquant sur "Commander", vous acceptez pleinement ces conditions. Contactez-nous pour toute question.', 
    de: 'Mit dem Klick auf "Dienst jetzt bestellen" akzeptieren Sie diese Bedingungen vollständig.' 
  },
  orderNowBtn: { ar: 'طلب الخدمة الآن', en: 'Order Service Now', fr: 'Commander le service maintenant', de: 'Dienst jetzt bestellen' },
  calcTitle: { ar: 'محاكي وسيموليتر الحاسبة الفورية', en: 'Instant Price Calculator Simulator', fr: 'Simulateur de prix instantané', de: 'Sofortiger Preissimulator' },
  calcSubtitle: { ar: 'اختر أبعاد وحجم المطبوعات واحسب تكلفة التوريد فورياً', en: 'Select print dimensions & quantity to simulate instant pricing', fr: 'Sélectionnez les dimensions pour calculer le prix instantané', de: 'Wählen Sie Maße und Menge für die sofortige Preissimulation' },
  widthLabel: { ar: 'العرض (سم)', en: 'Width (cm)', fr: 'Largeur (cm)', de: 'Breite (cm)' },
  heightLabel: { ar: 'الارتفاع (سم)', en: 'Height (cm)', fr: 'Hauteur (cm)', de: 'Höhe (cm)' },
  qtyLabel: { ar: 'الكمية المطلوب طباعتها', en: 'Quantity (pcs)', fr: 'Quantité', de: 'Menge' },
  estTotal: { ar: 'السعر التقديري الإجمالي:', en: 'Estimated Total Price:', fr: 'Prix estimé total :', de: 'Geschätzter Gesamtpreis:' },
  calcOrderBtn: { ar: 'اطلب بنفس الأبعاد الآن ➔', en: 'Order With These Dimensions Now ➔', fr: 'Commander avec ces dimensions ➔', de: 'Mit diesen Maßen bestellen ➔' },
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

  // Selected Package Terms Modal state
  const [selectedTermsPkg, setSelectedTermsPkg] = useState<any | null>(null);

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

      {/* ══ AVAILABLE PACKAGES & TIERS LISTING (PHOTO 2 & PHOTO 3 DESIGN) ══ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <MdStar className="text-venecos-gold" />
            {tUi('availablePackages')}
          </h2>

          <span className="text-xs text-venecos-gold font-mono font-bold bg-venecos-gold/10 px-3 py-1 rounded-full border border-venecos-gold/30 uppercase">
            {subServices.length} {tUi('availablePackagesLabel') || 'PACKAGES AVAILABLE'}
          </span>
        </div>

        {subServices.length === 0 ? (
          <div className="bg-venecos-black/80 border border-white/10 rounded-3xl p-10 text-center text-white/60 italic shadow-xl">
            {tUi('noPackages')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subServices.map((sub: any, i: number) => {
              const subTitle = getLocString(sub.title, locale);
              const subDesc = getLocString(sub.description, locale);
              const subBadge = getLocString(sub.badge, locale);
              const subDuration = getLocString(sub.deliveryDuration, locale) || tUi('defaultDeliveryDuration');
              const priceFrom = sub.priceFrom || sub.price || 20;
              const priceTo = sub.priceTo || priceFrom || 35;
              const subId = sub._id?.toString() || i;

              return (
                <div
                  key={subId}
                  className="bg-venecos-black/90 border border-venecos-gold/30 hover:border-venecos-gold rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* Top Badge Header */}
                  {subBadge ? (
                    <div className="bg-gradient-to-r from-venecos-gold via-yellow-500 to-amber-600 text-black text-[11px] font-black px-4 py-1.5 flex items-center justify-between shadow-md">
                      <span>★ {subBadge}</span>
                      <span className="opacity-80 font-mono">0{i + 1}</span>
                    </div>
                  ) : (
                    <div className="bg-white/5 border-b border-white/10 px-4 py-1.5 flex justify-end">
                      <span className="text-[10px] text-white/40 font-mono font-bold">0{i + 1}</span>
                    </div>
                  )}

                  {/* Thumbnail / Header Area */}
                  <div className="h-40 bg-gradient-to-b from-gray-900 to-black relative flex items-center justify-center border-b border-white/10">
                    {sub.image ? (
                      <img src={sub.image} alt={subTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl text-venecos-gold/60 shadow-inner">
                        📄
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 md:p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-venecos-gold transition-colors leading-tight">
                        {subTitle}
                      </h3>
                      <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                        {subDesc}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Price Range Box */}
                      <div className="bg-white/5 border border-venecos-gold/20 rounded-2xl p-3 flex items-center justify-between text-xs font-mono">
                        <div className="text-center flex-1">
                          <span className="block text-[10px] text-white/50 mb-0.5">{tUi('fromLabel')}</span>
                          <span className="text-lg font-black text-venecos-gold font-mono">€{priceFrom}</span>
                        </div>
                        <span className="text-white/30 font-bold">—</span>
                        <div className="text-center flex-1">
                          <span className="block text-[10px] text-white/50 mb-0.5">{tUi('toLabel')}</span>
                          <span className="text-lg font-black text-venecos-gold font-mono">€{priceTo}</span>
                        </div>
                      </div>

                      {/* Delivery Duration Box */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex items-center justify-center gap-2 text-xs text-white/80 font-medium">
                        <span>⏱️</span>
                        <span>{tUi('deliveryTimeLabel')} <strong>{subDuration}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action Bar (PHOTO 2 DESIGN) */}
                  <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
                    {/* Terms Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedTermsPkg(sub)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/10"
                    >
                      📋 <span>{tUi('termsBtn')}</span>
                    </button>

                    {/* More Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedTermsPkg(sub)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-all border border-white/10"
                      title="More details"
                    >
                      ...
                    </button>

                    {/* Order Service Button */}
                    <Link href={`/${locale}/services/${serviceId}/order?subId=${subId}`} className="flex-1">
                      <button className="w-full bg-gradient-to-r from-venecos-gold via-yellow-500 to-amber-500 hover:opacity-90 text-black font-extrabold py-2.5 px-3 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-1.5">
                        🛒 <span>{tUi('orderServiceBtn')}</span>
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══ TERMS & CONDITIONS MODAL (PHOTO 3 DESIGN) ══ */}
      {selectedTermsPkg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/40 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl text-right" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 flex items-center justify-center text-lg">📋</span>
                <h3 className="text-xl font-bold text-white">
                  {tUi('termsModalTitle')}{getLocString(selectedTermsPkg.title, locale)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTermsPkg(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 2-Column Rules Grid (PHOTO 3 DESIGN) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Delivery & Revisions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-venecos-gold flex items-center gap-2 border-b border-white/10 pb-2">
                  {tUi('deliveryRevisionsTitle')}
                </h4>
                <ul className="space-y-2 text-xs text-white/80 leading-relaxed">
                  {getLocArray(selectedTermsPkg.deliveryAndRevisions, locale).length > 0 ? (
                    getLocArray(selectedTermsPkg.deliveryAndRevisions, locale).map((rule: string, rIdx: number) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-venecos-gold mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2"><span className="text-venecos-gold">•</span><span>{locale === 'ar' ? 'يشمل السعر ما يصل إلى 3 جولات مراجعة.' : 'Includes up to 3 revision rounds.'}</span></li>
                      <li className="flex items-start gap-2"><span className="text-venecos-gold">•</span><span>{locale === 'ar' ? 'يُحسب وقت التسليم من استلام جميع المواد.' : 'Delivery time starts upon receiving all assets.'}</span></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Column 2: Payment & Rights */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-venecos-gold flex items-center gap-2 border-b border-white/10 pb-2">
                  {tUi('paymentRightsTitle')}
                </h4>
                <ul className="space-y-2 text-xs text-white/80 leading-relaxed">
                  {getLocArray(selectedTermsPkg.ownershipAndRights, locale).length > 0 ? (
                    getLocArray(selectedTermsPkg.ownershipAndRights, locale).map((rule: string, rIdx: number) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-venecos-gold mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2"><span className="text-venecos-gold">•</span><span>{locale === 'ar' ? 'يُدفع 50% مقدماً عند تأكيد الطلب.' : '50% deposit required upon confirmation.'}</span></li>
                      <li className="flex items-start gap-2"><span className="text-venecos-gold">•</span><span>{locale === 'ar' ? 'لا يُسترد المبلغ المقدم بعد بدء العمل.' : 'Deposit is non-refundable once work begins.'}</span></li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Warning Banner (PHOTO 3 DESIGN) */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-400 leading-relaxed flex items-start gap-2">
              <span className="text-base mt-0.5">⚠️</span>
              <p>
                {tUi('termsConsentWarning')}
              </p>
            </div>

            {/* Bottom Bar (PHOTO 3 DESIGN) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto justify-around">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
                  <span className="block text-[10px] text-white/50">{tUi('deliveryTimeLabel')}</span>
                  <span className="text-xs font-bold text-white">⏱️ {getLocString(selectedTermsPkg.deliveryDuration, locale) || tUi('defaultDeliveryDuration')}</span>
                </div>

                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center font-mono">
                  <span className="block text-[10px] text-white/50">{locale === 'ar' ? 'النطاق السعري' : locale === 'fr' ? 'Gamme de prix' : locale === 'de' ? 'Preisspanne' : 'Price Range'}</span>
                  <span className="text-sm font-black text-venecos-gold">€{selectedTermsPkg.priceFrom || selectedTermsPkg.price || 20} — €{selectedTermsPkg.priceTo || selectedTermsPkg.priceFrom || 35}</span>
                </div>
              </div>

              <Link href={`/${locale}/services/${serviceId}/order?subId=${selectedTermsPkg._id || 0}`} className="w-full md:w-auto">
                <button className="w-full md:w-auto bg-gradient-to-r from-venecos-gold via-yellow-500 to-amber-500 hover:opacity-90 text-black font-extrabold py-3.5 px-8 rounded-2xl shadow-xl text-xs flex items-center justify-center gap-2">
                  🛒 <span>{tUi('orderNowBtn')}</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
