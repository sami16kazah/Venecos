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
    priceFrom: number;
    priceTo: number;
    image: string;
  }>({
    title: { ar: '', en: '', fr: '', de: '' },
    description: { ar: '', en: '', fr: '', de: '' },
    badge: { ar: '★ الأكثر طلباً', en: '★ Most Popular', fr: '★ Le plus populaire', de: '★ Beliebtestes' },
    deliveryDuration: { ar: '12 — 24 ساعة', en: '12 — 24 Hours', fr: '12 — 24 Heures', de: '12 — 24 Stunden' },
    deliveryAndRevisionsText: {
      ar: 'يشمل السعر ما يصل إلى 3 جولات مراجعة.\nيُحسب وقت التسليم من استلام جميع المواد.\nيُسلَّم بصيغ عالية الدقة جاهزة للاستخدام.\nالتعديلات الإضافية تُحتسب خارج الباقة.',
      en: 'Includes up to 3 revision rounds.\nDelivery time starts upon receiving all materials.\nDelivered in high-resolution ready formats.\nAdditional edits are billed separately.',
      fr: 'Comprend jusqu\'à 3 tours de révision.\nLe délai commence à la réception des éléments.\nLivré en haute résolution prêt à l\'emploi.\nLes modifications supplémentaires sont facturées à part.',
      de: 'Enthält bis zu 3 Überarbeitungsrunden.\nLieferzeit beginnt nach Erhalt aller Unterlagen.\nLieferung in hochauflösenden Formaten.\nZusätzliche Änderungen werden separat berechnet.'
    },
    ownershipAndRightsText: {
      ar: 'يُدفع 50% مقدماً عند تأكيد الطلب.\nلا يُسترد المبلغ المقدم بعد بدء العمل.\nيتغير السعر النهائي حسب تعقيد الخدمة.\nالتأخر في تسليم المواد يؤجل موعد التسليم.',
      en: '50% deposit required upon order confirmation.\nDeposit is non-refundable once work begins.\nFinal price may vary based on service complexity.\nDelays in sending materials will adjust delivery date.',
      fr: 'Acompte de 50% requis à la confirmation.\nAcompte non remboursable après le début des travaux.\nLe prix final peut varier selon la complexité.\nLes retards de matériel ajusteront la date.',
      de: '50% Anzahlung bei Auftragsbestätigung erforderlich.\nAnzahlung nach Arbeitsbeginn nicht erstattungsfähig.\nEndpreis kann je nach Komplexität variieren.\nVerzögerungen bei Unterlagen verschieben den Liefertermin.'
    },
    priceFrom: 20,
    priceTo: 50,
    image: '',
  });

  const extractLangString = (val: any, lang: LangTab): string => {
    if (!val) return '';
    if (typeof val === 'string') return getLocString(val, lang);
    if (typeof val === 'object' && !Array.isArray(val)) {
      return val[lang] || val['en'] || val['ar'] || getLocString(val, lang);
    }
    return getLocString(val, lang);
  };

  const extractLangArrayText = (val: any, lang: LangTab): string => {
    if (!val) return '';
    const arr = getLocArray(val, lang);
    if (arr.length > 0) return arr.join('\n');
    if (typeof val === 'string') return val;
    return '';
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setActiveTab('ar');
    setPkgForm({
      title: { ar: '', en: '', fr: '', de: '' },
      description: { ar: '', en: '', fr: '', de: '' },
      badge: { ar: '★ الأكثر طلباً', en: '★ Most Popular', fr: '★ Le plus populaire', de: '★ Beliebtestes' },
      deliveryDuration: { ar: '24 — 48 ساعة', en: '24 — 48 Hours', fr: '24 — 48 Heures', de: '24 — 48 Stunden' },
      deliveryAndRevisionsText: {
        ar: 'يشمل السعر ما يصل إلى 3 جولات مراجعة.\nيُحسب وقت التسليم من استلام جميع المواد.\nيُسلَّم بصيغ عالية الدقة جاهزة للاستخدام.',
        en: 'Includes up to 3 revision rounds.\nDelivery time starts upon receiving all materials.\nDelivered in high-resolution ready formats.',
        fr: 'Comprend jusqu\'à 3 tours de révision.\nLe délai commence à la réception des éléments.\nLivré en haute résolution prêt à l\'emploi.',
        de: 'Enthält bis zu 3 Überarbeitungsrunden.\nLieferzeit beginnt nach Erhalt aller Unterlagen.\nLieferung in hochauflösenden Formaten.'
      },
      ownershipAndRightsText: {
        ar: 'يُدفع 50% مقدماً عند تأكيد الطلب.\nلا يُسترد المبلغ المقدم بعد بدء العمل.\nالتأخر في تسليم المواد يؤجل موعد التسليم.',
        en: '50% deposit required upon order confirmation.\nDeposit is non-refundable once work begins.\nDelays in sending materials will adjust delivery date.',
        fr: 'Acompte de 50% requis à la confirmation.\nAcompte non remboursable après le début des travaux.\nLes retards de matériel ajusteront la date.',
        de: '50% Anzahlung bei Auftragsbestätigung erforderlich.\nAnzahlung nach Arbeitsbeginn nicht erstattungsfähig.\nVerzögerungen bei Unterlagen verschieben den Liefertermin.'
      },
      priceFrom: 25,
      priceTo: 60,
      image: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: ISubService, index: number) => {
    setEditingIndex(index);
    setActiveTab('ar');

    const langs: LangTab[] = ['ar', 'en', 'fr', 'de'];
    
    const titles: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const descs: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const badges: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const durations: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const deliveryTexts: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };
    const rightsTexts: Record<LangTab, string> = { ar: '', en: '', fr: '', de: '' };

    langs.forEach((l) => {
      titles[l] = extractLangString(pkg.title, l);
      descs[l] = extractLangString(pkg.description, l);
      badges[l] = extractLangString(pkg.badge, l);
      durations[l] = extractLangString(pkg.deliveryDuration, l);
      deliveryTexts[l] = extractLangArrayText(pkg.deliveryAndRevisions, l);
      rightsTexts[l] = extractLangArrayText(pkg.ownershipAndRights, l);
    });

    setPkgForm({
      title: titles,
      description: descs,
      badge: badges,
      deliveryDuration: durations,
      deliveryAndRevisionsText: deliveryTexts,
      ownershipAndRightsText: rightsTexts,
      priceFrom: pkg.priceFrom || pkg.price || 0,
      priceTo: pkg.priceTo || pkg.priceFrom || pkg.price || 0,
      image: pkg.image || '',
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

    langs.forEach(l => {
      deliveryRules[l] = (pkgForm.deliveryAndRevisionsText[l] || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      rightsRules[l] = (pkgForm.ownershipAndRightsText[l] || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
    });

    const updatedItem: ISubService = {
      title: pkgForm.title as any,
      description: pkgForm.description as any,
      price: Number(pkgForm.priceFrom) || 0,
      badge: pkgForm.badge as any,
      priceFrom: Number(pkgForm.priceFrom) || 0,
      priceTo: Number(pkgForm.priceTo) || Number(pkgForm.priceFrom) || 0,
      deliveryDuration: pkgForm.deliveryDuration as any,
      image: pkgForm.image.trim(),
      deliveryAndRevisions: deliveryRules as any,
      ownershipAndRights: rightsRules as any,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MdStar className="text-venecos-gold text-xl" />
            إدارة باقات الخدمة بالأربع لغات (4-Language Package Manager)
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            إضافة وتعديل وحذف باقات الخدمة وشروطها بجميع اللغات (العربية، الإنجليزية، الفرنسية، الألمانية)
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

      {/* Package Cards Grid Matching Photo 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashed Add Card */}
        <div
          onClick={handleOpenAdd}
          className="bg-white/5 border-2 border-dashed border-white/20 hover:border-venecos-gold/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[320px] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 group-hover:bg-venecos-gold/20 text-white group-hover:text-venecos-gold flex items-center justify-center text-2xl mb-3 transition-colors">
            <MdAdd />
          </div>
          <span className="text-sm font-bold text-white/80 group-hover:text-venecos-gold transition-colors">
            عرض جديد من لوحة التحكم
          </span>
          <span className="text-xs text-white/40 mt-1">انقر لإضافة باقة بسعر وشروط جديدة</span>
        </div>

        {/* Existing Package Cards */}
        {packages.map((pkg, idx) => {
          const cardTitle = getLocString(pkg.title, 'ar');
          const cardDesc = getLocString(pkg.description, 'ar');
          const cardBadge = getLocString(pkg.badge, 'ar');
          const cardDuration = getLocString(pkg.deliveryDuration, 'ar');

          return (
            <div
              key={pkg._id || idx}
              className="bg-venecos-black/90 border border-white/15 hover:border-venecos-gold/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between relative group transition-all duration-300"
            >
              {/* Top Badge */}
              {cardBadge ? (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black px-4 py-1 text-center shadow-md">
                  {cardBadge}
                </div>
              ) : (
                <div className="bg-white/5 border-b border-white/10 px-4 py-1 flex justify-end">
                  <span className="text-[10px] text-white/40 font-mono font-bold">0{idx + 1}</span>
                </div>
              )}

              {/* Thumbnail Header */}
              <div className="h-32 bg-gray-900/60 relative overflow-hidden flex items-center justify-center border-b border-white/10">
                {pkg.image ? (
                  <img src={pkg.image} alt={cardTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl text-white/20">📄</div>
                )}
                {/* Card Actions overlay */}
                <div className="absolute top-2 right-2 flex gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(pkg, idx)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold text-sm"
                    title="Edit Package"
                  >
                    <MdEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteIndex(idx)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm"
                    title="Delete Package"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>

              {/* Body Info */}
              <div className="p-5 space-y-3 flex-grow">
                <h4 className="text-base font-bold text-white line-clamp-1">{cardTitle}</h4>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{cardDesc}</p>

                {/* Price Range Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                  <div className="text-center flex-1">
                    <span className="block text-[10px] text-white/50">من</span>
                    <span className="text-base font-black text-blue-400">
                      {pkg.priceFrom || pkg.price || 0} €
                    </span>
                  </div>
                  <span className="text-white/30 font-bold">—</span>
                  <div className="text-center flex-1">
                    <span className="block text-[10px] text-white/50">إلى</span>
                    <span className="text-base font-black text-blue-400">
                      {pkg.priceTo || pkg.priceFrom || pkg.price || 0} €
                    </span>
                  </div>
                </div>

                {/* Delivery Time Box */}
                {cardDuration && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-center gap-2 text-xs text-white/80 font-medium">
                    <MdTimer className="text-venecos-gold text-sm" />
                    <span>مدة التسليم: <strong>{cardDuration}</strong></span>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
                <span className="text-[11px] text-white/50 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  🌐 4 لغات مفعلة
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(pkg, idx)}
                  className="flex-1 py-2 rounded-xl bg-venecos-gold/20 hover:bg-venecos-gold/30 text-venecos-gold text-xs font-bold transition-all"
                >
                  تعديل بالأربع لغات
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4-Language Package Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MdStar className="text-venecos-gold" />
                {editingIndex !== null ? 'تعديل الباقة (الأربع لغات)' : 'إضافة باقة جديدة (الأربع لغات)'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Language Selector Tabs */}
            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-white/60 px-3 flex items-center gap-1">
                <MdLanguage className="text-venecos-gold text-base" /> اختيار اللغة:
              </span>
              {(['ar', 'en', 'fr', 'de'] as LangTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-venecos-gold to-yellow-500 text-black shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'ar' ? 'العربية 🇸🇦' : tab === 'en' ? 'English 🇬🇧' : tab === 'fr' ? 'Français 🇫🇷' : 'Deutsch 🇩🇪'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Fields for active language tab */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    عنوان الباقة ({activeTab.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgForm.title[activeTab]}
                    onChange={(e) =>
                      setPkgForm({
                        ...pkgForm,
                        title: { ...pkgForm.title, [activeTab]: e.target.value },
                      })
                    }
                    placeholder="عنوان الباقة بهذه اللغة..."
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-venecos-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    شارة الباقة ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={pkgForm.badge[activeTab]}
                    onChange={(e) =>
                      setPkgForm({
                        ...pkgForm,
                        badge: { ...pkgForm.badge, [activeTab]: e.target.value },
                      })
                    }
                    placeholder="مثال: ★ الأكثر طلباً"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-venecos-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  وصف الباقة المختصر ({activeTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={pkgForm.description[activeTab]}
                  onChange={(e) =>
                    setPkgForm({
                      ...pkgForm,
                      description: { ...pkgForm.description, [activeTab]: e.target.value },
                    })
                  }
                  placeholder="وصف مختصر للباقة..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-venecos-gold resize-none"
                />
              </div>

              {/* Price Range & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">السعر من (€)</label>
                  <input
                    type="number"
                    value={pkgForm.priceFrom}
                    onChange={(e) => setPkgForm({ ...pkgForm, priceFrom: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-venecos-gold font-black text-center text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">السعر إلى (€)</label>
                  <input
                    type="number"
                    value={pkgForm.priceTo}
                    onChange={(e) => setPkgForm({ ...pkgForm, priceTo: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-venecos-gold font-black text-center text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    مدة التسليم ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={pkgForm.deliveryDuration[activeTab]}
                    onChange={(e) =>
                      setPkgForm({
                        ...pkgForm,
                        deliveryDuration: { ...pkgForm.deliveryDuration, [activeTab]: e.target.value },
                      })
                    }
                    placeholder="مثال: 12 — 24 ساعة"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white text-xs text-center outline-none focus:border-venecos-gold"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">صورة الباقة (غلاف البطاقة)</label>
                <CloudinaryUploader
                  label="انقر لرفع صورة الباقة"
                  currentUrl={pkgForm.image}
                  onUploadSuccess={(url) => setPkgForm({ ...pkgForm, image: url })}
                />
              </div>

              {/* Delivery Rules */}
              <div>
                <label className="block text-xs font-bold text-venecos-gold mb-1">
                  📋 التسليم والمراجعات ({activeTab.toUpperCase()}) — كل شرط في سطر مستقل
                </label>
                <textarea
                  rows={3}
                  value={pkgForm.deliveryAndRevisionsText[activeTab]}
                  onChange={(e) =>
                    setPkgForm({
                      ...pkgForm,
                      deliveryAndRevisionsText: {
                        ...pkgForm.deliveryAndRevisionsText,
                        [activeTab]: e.target.value,
                      },
                    })
                  }
                  placeholder="سطر لكل شرط..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-venecos-gold resize-none leading-relaxed"
                />
              </div>

              {/* Payment & Rights Rules */}
              <div>
                <label className="block text-xs font-bold text-venecos-gold mb-1">
                  📋 الدفع والإلغاء وحقوق الملكية ({activeTab.toUpperCase()}) — كل شرط في سطر مستقل
                </label>
                <textarea
                  rows={3}
                  value={pkgForm.ownershipAndRightsText[activeTab]}
                  onChange={(e) =>
                    setPkgForm({
                      ...pkgForm,
                      ownershipAndRightsText: {
                        ...pkgForm.ownershipAndRightsText,
                        [activeTab]: e.target.value,
                      },
                    })
                  }
                  placeholder="سطر لكل شرط..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-venecos-gold resize-none leading-relaxed"
                />
              </div>

              {/* Buttons */}
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
