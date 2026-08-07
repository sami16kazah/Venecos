'use client';

import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdStar, MdTimer, MdCheckCircle, MdLanguage } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { ISubService } from '@/models/ServiceContent';
import { getLocString, getLocArray } from '@/lib/i18nUtils';

interface DashboardPackageManagerProps {
  serviceKey: string;
  packages: ISubService[];
  onChange: (updatedPackages: ISubService[]) => void;
  onSave?: (updatedPackages: ISubService[]) => Promise<void>;
}

type LangTab = 'ar' | 'en' | 'fr' | 'de';

export default function DashboardPackageManager({
  serviceKey,
  packages,
  onChange,
  onSave,
}: DashboardPackageManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<LangTab>('ar');

  const [pkgForm, setPkgForm] = useState<{
    title: Record<LangTab, string>;
    description: Record<LangTab, string>;
    badge: Record<LangTab, string>;
    deliveryDuration: Record<LangTab, string>;
    deliveryAndRevisionsText: Record<LangTab, string>;
    ownershipAndRightsText: Record<LangTab, string>;
    highlightsText: Record<LangTab, string>;
    deliveryEstimate: Record<LangTab, string>;
    warrantyTitle: Record<LangTab, string>;
    warrantyPrice: number;
    priceFrom: number;
    priceTo: number;
    originalPrice: number;
    rating: number;
    ratingCount: number;
    image: string;
    images: string[];
  }>({
    title: { ar: '', en: '', fr: '', de: '' },
    description: { ar: '', en: '', fr: '', de: '' },
    badge: { ar: '★ الأكثر طلباً', en: '★ Most Popular', fr: '★ Le plus populaire', de: '★ Beliebtestes' },
    deliveryDuration: { ar: '12 — 24 ساعة', en: '12 — 24 Hours', fr: '12 — 24 Heures', de: '12 — 24 Stunden' },
    deliveryAndRevisionsText: {
      ar: 'يشمل السعر ما يصل إلى 3 جولات مراجعة.\nيُحسب وقت التسليم من استلام جميع المواد.',
      en: 'Includes up to 3 revision rounds.\nDelivery time starts upon receiving all materials.',
      fr: 'Comprend jusqu\'à 3 tours de révision.\nLe délai commence à la réception des éléments.',
      de: 'Enthält bis zu 3 Überarbeitungsrunden.\nLieferzeit beginnt nach Erhalt aller Unterlagen.'
    },
    ownershipAndRightsText: {
      ar: 'يُدفع 50% مقدماً عند تأكيد الطلب.\nلا يُسترد المبلغ المقدم بعد بدء العمل.',
      en: '50% deposit required upon order confirmation.\nDeposit is non-refundable once work begins.',
      fr: 'Acompte de 50% requis à la confirmation.\nAcompte non remboursable après le début des travaux.',
      de: '50% Anzahlung bei Auftragsbestätigung erforderlich.\nAnzahlung nach Arbeitsbeginn nicht erstattungsfähig.'
    },
    highlightsText: {
      ar: 'جودة عالية, حماية مضاعفة, جاهزية للتسليم',
      en: 'High Quality, Extra Protection, Ready for Delivery',
      fr: 'Haute Qualité, Protection Réglable, Prêt à Livrer',
      de: 'Hohe Qualität, Extra Schutz, Lieferbereit'
    },
    deliveryEstimate: {
      ar: 'جاهز للتسليم في خلال 3-5 أيام عمل',
      en: 'Deliverable in 3-5 business days',
      fr: 'Livrable en 3-5 jours ouvrables',
      de: 'Lieferbar - in 3-5 Werktagen bei dir'
    },
    warrantyTitle: {
      ar: '24 شهر حماية وضمان ممتد للخدمة',
      en: '24 Months Extended Warranty & Service Protection',
      fr: '24 Mois Garantie et protection étendue',
      de: '24 Monate Produktschutz & Garantie'
    },
    warrantyPrice: 41.99,
    priceFrom: 20,
    priceTo: 50,
    originalPrice: 60,
    rating: 4.8,
    ratingCount: 32,
    image: '',
    images: [],
  });

  const extractLangString = (val: any, lang: LangTab): string => {
    if (!val) return '';
    if (typeof val === 'object' && !Array.isArray(val)) {
      const specific = val[lang];
      if (typeof specific === 'string' && specific.trim()) {
        if (lang !== 'ar' && /[\u0600-\u06FF]/.test(specific) && !/[\u0600-\u06FF]/.test(val['en'] || '')) {
          return '';
        }
        return specific;
      }
      return '';
    }
    if (typeof val === 'string') {
      if (/[\u0600-\u06FF]/.test(val)) {
        return lang === 'ar' ? val : '';
      }
      return lang === 'en' ? val : '';
    }
    return '';
  };

  const extractLangArrayText = (val: any, lang: LangTab): string => {
    if (!val) return '';
    if (typeof val === 'object' && !Array.isArray(val)) {
      const arr = val[lang];
      if (Array.isArray(arr)) {
        const text = arr.join('\n').trim();
        if (lang !== 'ar' && /[\u0600-\u06FF]/.test(text)) {
          return '';
        }
        return text;
      }
      if (typeof arr === 'string') return arr;
      return '';
    }
    if (Array.isArray(val)) {
      const text = val.join('\n');
      if (/[\u0600-\u06FF]/.test(text)) {
        return lang === 'ar' ? text : '';
      }
      return lang === 'en' ? text : '';
    }
    if (typeof val === 'string') {
      if (/[\u0600-\u06FF]/.test(val)) {
        return lang === 'ar' ? val : '';
      }
      return lang === 'en' ? val : '';
    }
    return '';
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setPkgForm({
      title: { ar: '', en: '', fr: '', de: '' },
      description: { ar: '', en: '', fr: '', de: '' },
      badge: { ar: '★ الأكثر طلباً', en: '★ Most Popular', fr: '★ Le plus populaire', de: '★ Beliebtestes' },
      deliveryDuration: { ar: '24 — 48 ساعة', en: '24 — 48 Hours', fr: '24 — 48 Heures', de: '24 — 48 Stunden' },
      deliveryAndRevisionsText: {
        ar: 'يشمل السعر ما يصل إلى 3 جولات مراجعة.\nيُحسب وقت التسليم من استلام جميع المواد.',
        en: 'Includes up to 3 revision rounds.\nDelivery time starts upon receiving all materials.',
        fr: 'Comprend jusqu\'à 3 tours de révision.\nLe délai commence à la réception des éléments.',
        de: 'Enthält bis zu 3 Überarbeitungsrunden.\nLieferzeit beginnt nach Erhalt aller Unterlagen.'
      },
      ownershipAndRightsText: {
        ar: 'يُدفع 50% مقدماً عند تأكيد الطلب.\nلا يُسترد المبلغ المقدم بعد بدء العمل.',
        en: '50% deposit required upon order confirmation.\nDeposit is non-refundable once work begins.',
        fr: 'Acompte de 50% requis à la confirmation.\nAcompte non remboursable après le début des travaux.',
        de: '50% Anzahlung bei Auftragsbestätigung erforderlich.\nAnzahlung nach Arbeitsbeginn nicht erstattungsfähig.'
      },
      highlightsText: {
        ar: 'جودة عالية, حماية مضاعفة, جاهزية للتسليم',
        en: 'High Quality, Extra Protection, Ready for Delivery',
        fr: 'Haute Qualité, Protection Réglable, Prêt à Livrer',
        de: 'Hohe Qualität, Extra Schutz, Lieferbereit'
      },
      deliveryEstimate: {
        ar: 'جاهز للتسليم في خلال 3-5 أيام عمل',
        en: 'Deliverable in 3-5 business days',
        fr: 'Livrable en 3-5 jours ouvrables',
        de: 'Lieferbar - in 3-5 Werktagen bei dir'
      },
      warrantyTitle: {
        ar: '24 شهر حماية وضمان ممتد للخدمة',
        en: '24 Months Extended Warranty & Service Protection',
        fr: '24 Mois Garantie et protection étendue',
        de: '24 Monate Produktschutz & Garantie'
      },
      warrantyPrice: 41.99,
      priceFrom: 25,
      priceTo: 60,
      originalPrice: 85,
      rating: 4.8,
      ratingCount: 32,
      image: '',
      images: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: ISubService, index: number) => {
    setEditingIndex(index);

    const langs: LangTab[] = ['ar', 'en', 'fr', 'de'];
    
    const titles: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const descs: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const badges: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const durations: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const deliveryTexts: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const rightsTexts: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const highlightsTexts: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const deliveryEstTexts: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const warrantyTitles: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };

    const firstAddon = pkg.addons?.[0];

    langs.forEach((l) => {
      titles[l] = extractLangString(pkg.title, l);
      descs[l] = extractLangString(pkg.description, l);
      badges[l] = extractLangString(pkg.badge, l);
      durations[l] = extractLangString(pkg.deliveryDuration, l);
      deliveryTexts[l] = extractLangArrayText(pkg.deliveryAndRevisions, l);
      rightsTexts[l] = extractLangArrayText(pkg.ownershipAndRights, l);
      highlightsTexts[l] = extractLangArrayText(pkg.highlights, l);
      deliveryEstTexts[l] = extractLangString(pkg.deliveryEstimate, l);
      warrantyTitles[l] = firstAddon ? extractLangString(firstAddon.title, l) : '';
    });

    setPkgForm({
      title: titles,
      description: descs,
      badge: badges,
      deliveryDuration: durations,
      deliveryAndRevisionsText: deliveryTexts,
      ownershipAndRightsText: rightsTexts,
      highlightsText: highlightsTexts,
      deliveryEstimate: deliveryEstTexts,
      warrantyTitle: warrantyTitles,
      warrantyPrice: firstAddon?.price || 41.99,
      priceFrom: pkg.priceFrom || pkg.price || 0,
      priceTo: pkg.priceTo || pkg.priceFrom || pkg.price || 0,
      originalPrice: pkg.originalPrice || 0,
      rating: pkg.rating || 4.8,
      ratingCount: pkg.ratingCount || 24,
      image: pkg.image || '',
      images: Array.isArray(pkg.images) && pkg.images.length > 0 ? pkg.images : (pkg.image ? [pkg.image] : []),
    });
    setModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const primaryTitle = pkgForm.title.ar || pkgForm.title.en || pkgForm.title.fr || pkgForm.title.de;
    if (!primaryTitle.trim()) return;

    const langs: LangTab[] = ['ar', 'en', 'fr', 'de'];
    const deliveryRules: Record<string, string[]> = {};
    const rightsRules: Record<string, string[]> = {};
    const highlightRules: Record<string, string[]> = {};

    langs.forEach(l => {
      deliveryRules[l] = (pkgForm.deliveryAndRevisionsText[l] || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      rightsRules[l] = (pkgForm.ownershipAndRightsText[l] || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      highlightRules[l] = (pkgForm.highlightsText[l] || '')
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(Boolean);
    });

    const updatedItem: ISubService = {
      title: pkgForm.title as any,
      description: pkgForm.description as any,
      price: Number(pkgForm.priceFrom) || 0,
      originalPrice: Number(pkgForm.originalPrice) || 0,
      badge: pkgForm.badge as any,
      priceFrom: Number(pkgForm.priceFrom) || 0,
      priceTo: Number(pkgForm.priceTo) || Number(pkgForm.priceFrom) || 0,
      deliveryDuration: pkgForm.deliveryDuration as any,
      image: pkgForm.images[0] || pkgForm.image.trim(),
      images: pkgForm.images,
      rating: Number(pkgForm.rating) || 4.8,
      ratingCount: Number(pkgForm.ratingCount) || 24,
      deliveryAndRevisions: deliveryRules as any,
      ownershipAndRights: rightsRules as any,
      highlights: highlightRules as any,
      deliveryEstimate: pkgForm.deliveryEstimate as any,
      addons: [{
        title: pkgForm.warrantyTitle as any,
        price: Number(pkgForm.warrantyPrice) || 41.99
      }],
    };

    let nextPackages: ISubService[] = [];
    if (editingIndex !== null) {
      nextPackages = packages.map((p, idx) => (idx === editingIndex ? { ...p, ...updatedItem } : p));
    } else {
      nextPackages = [...packages, updatedItem];
    }

    onChange(nextPackages);
    setModalOpen(false);

    if (onSave) {
      await onSave(nextPackages);
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    const nextPackages = packages.filter((_, idx) => idx !== deleteIndex);
    onChange(nextPackages);
    setDeleteIndex(null);

    if (onSave) {
      await onSave(nextPackages);
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url) return;
    setPkgForm(prev => ({
      ...prev,
      image: prev.image || url,
      images: [...prev.images, url]
    }));
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setPkgForm(prev => {
      const nextImages = prev.images.filter((_, i) => i !== idxToRemove);
      return {
        ...prev,
        image: nextImages[0] || '',
        images: nextImages
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MdStar className="text-venecos-gold text-xl" />
            إدارة باقات الخدمة وصور المنتجات (Packages & Products Manager)
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            إضافة وتعديل صور المعرض المتعددة، أسعار خصم UVP، تقييمات المنتجات، والمواصفات بالأربع لغات
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black px-4 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all"
        >
          <MdAdd className="text-base" /> إضافة باقة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={handleOpenAdd}
          className="bg-white/5 border-2 border-dashed border-white/20 hover:border-venecos-gold/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[320px] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 group-hover:bg-venecos-gold/20 text-white group-hover:text-venecos-gold flex items-center justify-center text-2xl mb-3 transition-colors">
            <MdAdd />
          </div>
          <span className="text-sm font-bold text-white/80 group-hover:text-venecos-gold transition-colors">
            إضافة منتج/باقة جديدة
          </span>
          <span className="text-xs text-white/40 mt-1">مع معرض صور متعدد واسعار الخصم</span>
        </div>

        {packages.map((pkg, idx) => {
          const cardTitle = getLocString(pkg.title, 'ar');
          const cardDesc = getLocString(pkg.description, 'ar');
          const cardBadge = getLocString(pkg.badge, 'ar');
          const cardDuration = getLocString(pkg.deliveryDuration, 'ar');
          const original = pkg.originalPrice || 0;
          const current = pkg.priceFrom || pkg.price || 0;
          const discountPct = original > current ? Math.round(((original - current) / original) * 100) : 0;

          return (
            <div
              key={pkg._id || idx}
              className="bg-venecos-black/90 border border-white/15 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl hover:border-venecos-gold/50 transition-all duration-300 group"
            >
              <div className="relative h-44 bg-neutral-900 overflow-hidden">
                {pkg.image || (pkg.images && pkg.images[0]) ? (
                  <img
                    src={pkg.image || pkg.images?.[0]}
                    alt={cardTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">
                    🛍️
                  </div>
                )}

                {discountPct > 0 && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                    -{discountPct}% UVP
                  </div>
                )}

                {cardBadge && (
                  <div className="absolute top-3 right-3 bg-venecos-gold text-black text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg">
                    {cardBadge}
                  </div>
                )}

                {pkg.images && pkg.images.length > 0 && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
                    📷 {pkg.images.length} صور
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3 flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white line-clamp-1">{cardTitle}</h4>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    ★ {pkg.rating || 4.8} <span className="text-white/40">({pkg.ratingCount || 24})</span>
                  </div>
                </div>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{cardDesc}</p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    {original > current && (
                      <span className="block text-[10px] text-white/40 line-through">
                        {original} €
                      </span>
                    )}
                    <span className="text-base font-black text-venecos-gold">
                      {current} €
                    </span>
                  </div>
                  {cardDuration && (
                    <div className="text-right text-[11px] text-blue-400 font-bold">
                      ⚡ {cardDuration}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(pkg, idx)}
                  className="flex-1 py-2 rounded-xl bg-venecos-gold/20 hover:bg-venecos-gold/30 text-venecos-gold text-xs font-bold transition-all"
                >
                  تعديل الباقة والمواصفات
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteIndex(idx)}
                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-all"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MdStar className="text-venecos-gold" />
                {editingIndex !== null ? 'تعديل بيانات المنتج/الباقة' : 'إضافة منتج/باقة جديدة'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Price, Ratings & Gallery Controls */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-venecos-gold flex items-center gap-2">
                💰 الأسعار والتقييمات والمعرض Multi-Photo Gallery
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">السعر الحالي (€) *</label>
                  <input
                    type="number"
                    value={pkgForm.priceFrom}
                    onChange={(e) => setPkgForm({ ...pkgForm, priceFrom: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-venecos-gold font-black text-center text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">السعر الأصلي UVP (€)</label>
                  <input
                    type="number"
                    value={pkgForm.originalPrice}
                    onChange={(e) => setPkgForm({ ...pkgForm, originalPrice: Number(e.target.value) })}
                    placeholder="مثال: 699"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-red-400 font-bold text-center text-sm outline-none focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">التقييم Stars (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pkgForm.rating}
                    onChange={(e) => setPkgForm({ ...pkgForm, rating: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-amber-400 font-bold text-center text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">عدد التقييمات Reviews</label>
                  <input
                    type="number"
                    value={pkgForm.ratingCount}
                    onChange={(e) => setPkgForm({ ...pkgForm, ratingCount: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-400 mb-1">سعر الضمان Addon (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pkgForm.warrantyPrice}
                    onChange={(e) => setPkgForm({ ...pkgForm, warrantyPrice: Number(e.target.value) })}
                    placeholder="41.99"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-amber-400 font-bold text-center text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Multi-Photo Gallery Uploader */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <label className="block text-[11px] font-bold text-white/80">
                  🖼️ معرض الصور المتعددة للمنتج (Multi-Angle Gallery Thumbnails)
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {pkgForm.images.map((imgUrl, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 group">
                      <img src={imgUrl} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute inset-0 bg-red-600/80 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                  <div className="w-48">
                    <CloudinaryUploader
                      label="إضافة صورة جديدة"
                      currentUrl=""
                      onUploadSuccess={handleAddGalleryImage}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: 4 Languages Grid */}
            <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
                🌐 Package Details & Terms (4 Languages)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Arabic */}
                <div className="bg-[#202127] border border-amber-500/30 rounded-2xl p-4 space-y-3" dir="rtl">
                  <div className="bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                    SA العربية (AR)
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">عنوان الباقة *</label>
                    <input
                      type="text"
                      required
                      value={pkgForm.title.ar}
                      onChange={(e) => setPkgForm({ ...pkgForm, title: { ...pkgForm.title, ar: e.target.value } })}
                      placeholder="عنوان الباقة بالعربية..."
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">الشارة (Badge)</label>
                    <input
                      type="text"
                      value={pkgForm.badge.ar}
                      onChange={(e) => setPkgForm({ ...pkgForm, badge: { ...pkgForm.badge, ar: e.target.value } })}
                      placeholder="★ الأكثر طلباً"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">الوصف المختصر</label>
                    <textarea
                      rows={2}
                      value={pkgForm.description.ar}
                      onChange={(e) => setPkgForm({ ...pkgForm, description: { ...pkgForm.description, ar: e.target.value } })}
                      placeholder="وصف مختصر للباقة..."
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">مدة التسليم</label>
                    <input
                      type="text"
                      value={pkgForm.deliveryDuration.ar}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryDuration: { ...pkgForm.deliveryDuration, ar: e.target.value } })}
                      placeholder="24 — 48 ساعة"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1">🛡️ عنوان ضمان الخدمة (Warranty Title)</label>
                    <input
                      type="text"
                      value={pkgForm.warrantyTitle.ar}
                      onChange={(e) => setPkgForm({ ...pkgForm, warrantyTitle: { ...pkgForm.warrantyTitle, ar: e.target.value } })}
                      placeholder="24 شهر حماية وضمان ممتد للخدمة"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1">⚡ مواصفات المنتج Highlights (مفصولة بفواصل)</label>
                    <input
                      type="text"
                      value={pkgForm.highlightsText.ar}
                      onChange={(e) => setPkgForm({ ...pkgForm, highlightsText: { ...pkgForm.highlightsText, ar: e.target.value } })}
                      placeholder="جودة عالية, حماية مضاعفة, تسليم سريع"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1">🚚 وعد التسليم (مثال: جاهز في 3-5 أيام)</label>
                    <input
                      type="text"
                      value={pkgForm.deliveryEstimate.ar}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryEstimate: { ...pkgForm.deliveryEstimate, ar: e.target.value } })}
                      placeholder="جاهز للتسليم في خلال 3-5 أيام عمل"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1">📋 التسليم والمراجعات (سطر لكل شرط)</label>
                    <textarea
                      rows={2}
                      value={pkgForm.deliveryAndRevisionsText.ar}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryAndRevisionsText: { ...pkgForm.deliveryAndRevisionsText, ar: e.target.value } })}
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>

                {/* English */}
                <div className="bg-[#202127] border border-blue-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
                  <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                    GB English (EN)
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Package Title *</label>
                    <input
                      type="text"
                      value={pkgForm.title.en}
                      onChange={(e) => setPkgForm({ ...pkgForm, title: { ...pkgForm.title, en: e.target.value } })}
                      placeholder="Package title in English..."
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Package Badge</label>
                    <input
                      type="text"
                      value={pkgForm.badge.en}
                      onChange={(e) => setPkgForm({ ...pkgForm, badge: { ...pkgForm.badge, en: e.target.value } })}
                      placeholder="★ Most Popular"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={pkgForm.description.en}
                      onChange={(e) => setPkgForm({ ...pkgForm, description: { ...pkgForm.description, en: e.target.value } })}
                      placeholder="Short description..."
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Delivery Time</label>
                    <input
                      type="text"
                      value={pkgForm.deliveryDuration.en}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryDuration: { ...pkgForm.deliveryDuration, en: e.target.value } })}
                      placeholder="24 — 48 Hours"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-400 mb-1">🛡️ Warranty Title (English)</label>
                    <input
                      type="text"
                      value={pkgForm.warrantyTitle.en}
                      onChange={(e) => setPkgForm({ ...pkgForm, warrantyTitle: { ...pkgForm.warrantyTitle, en: e.target.value } })}
                      placeholder="24 Months Extended Warranty & Service Protection"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-400 mb-1">⚡ Highlights (comma-separated)</label>
                    <input
                      type="text"
                      value={pkgForm.highlightsText.en}
                      onChange={(e) => setPkgForm({ ...pkgForm, highlightsText: { ...pkgForm.highlightsText, en: e.target.value } })}
                      placeholder="High Quality, Extra Protection, Fast Delivery"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-400 mb-1">🚚 Delivery Promise (e.g. 3-5 business days)</label>
                    <input
                      type="text"
                      value={pkgForm.deliveryEstimate.en}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryEstimate: { ...pkgForm.deliveryEstimate, en: e.target.value } })}
                      placeholder="Deliverable in 3-5 business days"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-400 mb-1">📋 Delivery & Revisions (1 rule per line)</label>
                    <textarea
                      rows={2}
                      value={pkgForm.deliveryAndRevisionsText.en}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryAndRevisionsText: { ...pkgForm.deliveryAndRevisionsText, en: e.target.value } })}
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-400 resize-none"
                    />
                  </div>
                </div>

                {/* French */}
                <div className="bg-[#202127] border border-emerald-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                    FR Français (FR)
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Titre du forfait</label>
                    <input
                      type="text"
                      value={pkgForm.title.fr}
                      onChange={(e) => setPkgForm({ ...pkgForm, title: { ...pkgForm.title, fr: e.target.value } })}
                      placeholder="Titre du forfait..."
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Badge</label>
                    <input
                      type="text"
                      value={pkgForm.badge.fr}
                      onChange={(e) => setPkgForm({ ...pkgForm, badge: { ...pkgForm.badge, fr: e.target.value } })}
                      placeholder="★ Le plus populaire"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Description courte</label>
                    <textarea
                      rows={2}
                      value={pkgForm.description.fr}
                      onChange={(e) => setPkgForm({ ...pkgForm, description: { ...pkgForm.description, fr: e.target.value } })}
                      placeholder="Description courte..."
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Délai de livraison</label>
                    <input
                      type="text"
                      value={pkgForm.deliveryDuration.fr}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryDuration: { ...pkgForm.deliveryDuration, fr: e.target.value } })}
                      placeholder="24 — 48 Heures"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1">🛡️ Titre de garantie (Français)</label>
                    <input
                      type="text"
                      value={pkgForm.warrantyTitle.fr}
                      onChange={(e) => setPkgForm({ ...pkgForm, warrantyTitle: { ...pkgForm.warrantyTitle, fr: e.target.value } })}
                      placeholder="24 Mois Garantie et protection étendue"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1">⚡ Spécifications (séparées par des virgules)</label>
                    <input
                      type="text"
                      value={pkgForm.highlightsText.fr}
                      onChange={(e) => setPkgForm({ ...pkgForm, highlightsText: { ...pkgForm.highlightsText, fr: e.target.value } })}
                      placeholder="Haute Qualité, Extra Protection, Livraison Rapide"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1">🚚 Promesse de livraison (ex. 3-5 jours)</label>
                    <input
                      type="text"
                      value={pkgForm.deliveryEstimate.fr}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryEstimate: { ...pkgForm.deliveryEstimate, fr: e.target.value } })}
                      placeholder="Livrable en 3-5 jours ouvrables"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1">📋 Livraison & Révisions</label>
                    <textarea
                      rows={2}
                      value={pkgForm.deliveryAndRevisionsText.fr}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryAndRevisionsText: { ...pkgForm.deliveryAndRevisionsText, fr: e.target.value } })}
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-400 resize-none"
                    />
                  </div>
                </div>

                {/* German */}
                <div className="bg-[#202127] border border-purple-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
                  <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                    DE Deutsch (DE)
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Pakettitel</label>
                    <input
                      type="text"
                      value={pkgForm.title.de}
                      onChange={(e) => setPkgForm({ ...pkgForm, title: { ...pkgForm.title, de: e.target.value } })}
                      placeholder="Pakettitel..."
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Badge</label>
                    <input
                      type="text"
                      value={pkgForm.badge.de}
                      onChange={(e) => setPkgForm({ ...pkgForm, badge: { ...pkgForm.badge, de: e.target.value } })}
                      placeholder="★ Beliebtestes"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Kurzbeschreibung</label>
                    <textarea
                      rows={2}
                      value={pkgForm.description.de}
                      onChange={(e) => setPkgForm({ ...pkgForm, description: { ...pkgForm.description, de: e.target.value } })}
                      placeholder="Kurzbeschreibung..."
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Lieferzeit</label>
                    <input
                      type="text"
                      value={pkgForm.deliveryDuration.de}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryDuration: { ...pkgForm.deliveryDuration, de: e.target.value } })}
                      placeholder="24 — 48 Stunden"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-purple-400 mb-1">🛡️ Garantietitel (Deutsch)</label>
                    <input
                      type="text"
                      value={pkgForm.warrantyTitle.de}
                      onChange={(e) => setPkgForm({ ...pkgForm, warrantyTitle: { ...pkgForm.warrantyTitle, de: e.target.value } })}
                      placeholder="24 Monate Produktschutz & Garantie"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-purple-400 mb-1">⚡ Produkthighlights (kommagetrennt)</label>
                    <input
                      type="text"
                      value={pkgForm.highlightsText.de}
                      onChange={(e) => setPkgForm({ ...pkgForm, highlightsText: { ...pkgForm.highlightsText, de: e.target.value } })}
                      placeholder="Hohe Qualität, Extra Schutz, Lieferbereit"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-purple-400 mb-1">🚚 Lieferversprechen (z. B. in 3-5 Werktagen)</label>
                    <input
                      type="text"
                      value={pkgForm.deliveryEstimate.de}
                      onChange={(e) => setPkgForm({ ...pkgForm, deliveryEstimate: { ...pkgForm.deliveryEstimate, de: e.target.value } })}
                      placeholder="Lieferbar - in 3-5 Werktagen bei dir"
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-purple-400 mb-1">📋 Ownership & Terms (1 rule per line)</label>
                    <textarea
                      rows={2}
                      value={pkgForm.ownershipAndRightsText.de}
                      onChange={(e) => setPkgForm({ ...pkgForm, ownershipAndRightsText: { ...pkgForm.ownershipAndRightsText, de: e.target.value } })}
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-purple-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSavePackage}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black text-xs font-extrabold shadow-md flex items-center gap-1.5"
              >
                <MdCheckCircle /> حفظ الباقة بالـ 4 لغات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteIndex !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
