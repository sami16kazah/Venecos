'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdHeadset, MdArrowBack, MdSave, MdCheckCircle } from 'react-icons/md';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';

// ... dbSupportUi ...

const dbSupportUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إضافة خدمة الدعم الفني',
    en: 'Add Technical Support Service',
    fr: 'Ajouter Service Support Technique',
    de: 'Technischen Support hinzufügen',
  },
  backBtn: {
    ar: 'رجوع',
    en: 'Back',
    fr: 'Retour',
    de: 'Zurück',
  },
  savePublishBtn: {
    ar: '✓ حفظ ونشر',
    en: '✓ Save & Publish',
    fr: '✓ Enregistrer & Publier',
    de: '✓ Speichern & Veröffentlichen',
  },
  pricingExecutionTitle: {
    ar: '⚡ السعر ومدة التنفيذ',
    en: '⚡ Price & Execution Timeframe',
    fr: '⚡ Prix & Délais d\'exécution',
    de: '⚡ Preis & Ausführungszeit',
  },
  priceRangeLabel: {
    ar: 'نطاق السعر (€)',
    en: 'Price Range (€)',
    fr: 'Gamme de prix (€)',
    de: 'Preisspanne (€)',
  },
  fromLabel: {
    ar: 'من',
    en: 'From',
    fr: 'De',
    de: 'Von',
  },
  toLabel: {
    ar: 'إلى',
    en: 'To',
    fr: 'À',
    de: 'Bis',
  },
  executionTimeLabel: {
    ar: 'مدة التنفيذ',
    en: 'Execution Duration',
    fr: 'Durée d\'exécution',
    de: 'Ausführungsdauer',
  },
  unitLabel: {
    ar: 'الوحدة',
    en: 'Unit',
    fr: 'Unité',
    de: 'Einheit',
  },
  unitDay: {
    ar: 'يوم',
    en: 'Day',
    fr: 'Jour',
    de: 'Tag',
  },
  unitHour: {
    ar: 'ساعة',
    en: 'Hour',
    fr: 'Heure',
    de: 'Stunde',
  },
  unitMonth: {
    ar: 'شهر',
    en: 'Month',
    fr: 'Mois',
    de: 'Monat',
  },
  monthlyNotice: {
    ar: 'ℹ️ الاشتراك الشهري: المشرف يقترح للعميل باقة ساعات شهرية (مثلاً 10 ساعات/شهر) بسعر مخصص بعد مراجعة الطلب',
    en: 'ℹ️ Monthly Subscription: The supervisor offers a monthly hours package (e.g., 10 hrs/month) at a custom rate after review.',
    fr: 'ℹ️ Abonnement mensuel: Le superviseur propose un forfait d\'heures mensuel personnalisé après étude de la demande.',
    de: 'ℹ️ Monatliches Paket: Der Supervisor schlägt nach Prüfung des Antrags ein individuelles Monats-Stundenpaket vor.',
  },
  multiLangTextsTitle: {
    ar: '🔤 النصوص بالأربع لغات',
    en: '🔤 4-Language Content',
    fr: '🔤 Contenu en 4 langues',
    de: '🔤 4-Sprachen Inhalte',
  },
  titleLabel: {
    ar: 'العنوان / Title',
    en: 'Service Title',
    fr: 'Titre du service',
    de: 'Titel',
  },
  titlePlaceholder: {
    ar: '...الدعم الفني والخدمات',
    en: 'e.g. Technical Support & Maintenance',
    fr: 'ex. Support technique et maintenance',
    de: 'z.B. Technischer Support',
  },
  shortDescLabel: {
    ar: 'وصف مختصر',
    en: 'Short Description',
    fr: 'Courte description',
    de: 'Kurzbeschreibung',
  },
  shortDescPlaceholder: {
    ar: '...وصف قصير للخدمة',
    en: 'Short summary of the support service...',
    fr: 'Bref résumé du service support...',
    de: 'Kurze Zusammenfassung des Support-Dienstes...',
  },
  fullDescLabel: {
    ar: 'الوصف الكامل',
    en: 'Full Description',
    fr: 'Description complète',
    de: 'Vollständige Beschreibung',
  },
  fullDescPlaceholder: {
    ar: '...وصف تفصيلي للخدمة والمميزات',
    en: 'Full detailed description of support features and terms...',
    fr: 'Description détaillée des fonctionnalités et conditions...',
    de: 'Ausführliche Beschreibung der Support-Leistungen...',
  },
  cancelBtn: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  savedSuccess: {
    ar: 'تم حفظ ونشر خدمة الدعم الفني بنجاح',
    en: 'Technical Support service saved & published successfully',
    fr: 'Service support technique enregistré avec succès',
    de: 'Technischer Support erfolgreich gespeichert',
  },
};

export default function SupportServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbSupportUi[key]?.[locale] || dbSupportUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=support');
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items) && items.length > 0) {
            const arDoc = items.find((i: any) => i.locale === 'ar');
            if (arDoc && arDoc.subServices) {
              setPackages(arDoc.subServices);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const savePackagesToDb = async (newPackages: ISubService[]) => {
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: 'support',
          titles: formData.title,
          descriptions: formData.shortDesc,
          iconName: 'FaHeadset',
          iconType: 'react-icon',
          order: 13,
          isSpecial: false,
          subServices: newPackages
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePackagesToDb(packages);
  };

  const [formData, setFormData] = useState({
    priceFrom: 20,
    priceTo: 200,
    daysFrom: 1,
    daysTo: 3,
    unit: 'يوم',
    title: {
      ar: 'خدمة الدعم الفني والصيانة',
      en: 'Technical Support & Maintenance',
      fr: 'Support technique et maintenance',
      de: 'Technischer Support & Wartung',
    },
    shortDesc: {
      ar: 'حل مشكلات السيرفرات والمواقع وصيانتها',
      en: 'Server and website troubleshooting & maintenance',
      fr: 'Dépannage et maintenance des serveurs et sites web',
      de: 'Fehlerbehebung & Wartung von Servern und Webseiten',
    },
    fullContent: {
      ar: 'دعم فني متكامل للمواقع والسيرفرات تشمل إصلاح الأخطاء، تحديث البرمجيات، وضبط الأمان.',
      en: 'Full technical support including bug fixes, software updates, and security tuning.',
      fr: 'Support technique complet incluant correction de bugs et mises à jour.',
      de: 'Vollständiger technischer Support inklusive Fehlerbehebung und Sicherheits-Tuning.',
    },
  });
  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MdHeadset className="text-venecos-gold text-3xl" />
          {tUi('pageTitle')}
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/dashboard/services`} className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backBtn')}
          </Link>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            {tUi('savePublishBtn')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Price & Execution Section */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            {tUi('pricingExecutionTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">{tUi('priceRangeLabel')}</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('fromLabel')}</span>
                  <input
                    type="number"
                    value={formData.priceFrom}
                    onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-center text-venecos-gold font-bold text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('toLabel')}</span>
                  <input
                    type="number"
                    value={formData.priceTo}
                    onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-center text-venecos-gold font-bold text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
              </div>
            </div>

            {/* Execution Duration */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">{tUi('executionTimeLabel')}</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('fromLabel')}</span>
                  <input
                    type="number"
                    value={formData.daysFrom}
                    onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-sm outline-none"
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('toLabel')}</span>
                  <input
                    type="number"
                    value={formData.daysTo}
                    onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-sm outline-none"
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('unitLabel')}</span>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-venecos-black border border-white/15 rounded-xl px-2 py-2 text-center text-white text-xs font-bold outline-none"
                  >
                    <option value="يوم">{tUi('unitDay')}</option>
                    <option value="ساعة">{tUi('unitHour')}</option>
                    <option value="شهر">{tUi('unitMonth')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 font-medium">
            {tUi('monthlyNotice')}
          </div>
        </div>

        {/* 4 Languages Section 2x2 Grid */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            🌐 {tUi('multiLangTextsTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Arabic */}
            <div className="bg-[#202127] border border-amber-500/30 rounded-2xl p-4 space-y-3" dir="rtl">
              <div className="bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                SA العربية (AR)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">{tUi('titleLabel')} *</label>
                <input
                  type="text"
                  value={formData.title.ar || ''}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                  placeholder="الدعم الفني والتقني..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">{tUi('shortDescLabel')}</label>
                <input
                  type="text"
                  value={formData.shortDesc.ar || ''}
                  onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, ar: e.target.value } })}
                  placeholder="وصف الدعم الفني..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">{tUi('fullDescLabel')}</label>
                <textarea
                  rows={3}
                  value={formData.fullContent.ar || ''}
                  onChange={(e) => setFormData({ ...formData, fullContent: { ...formData.fullContent, ar: e.target.value } })}
                  placeholder="تفاصيل الخدمات والحلول..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>

            {/* English */}
            <div className="bg-[#202127] border border-blue-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                GB English (EN)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Service Title *</label>
                <input
                  type="text"
                  value={formData.title.en || ''}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  placeholder="Technical Support..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDesc.en || ''}
                  onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, en: e.target.value } })}
                  placeholder="Support description..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Full Specifications</label>
                <textarea
                  rows={3}
                  value={formData.fullContent.en || ''}
                  onChange={(e) => setFormData({ ...formData, fullContent: { ...formData.fullContent, en: e.target.value } })}
                  placeholder="Full specifications..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-400 resize-none"
                />
              </div>
            </div>

            {/* French */}
            <div className="bg-[#202127] border border-emerald-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                FR Français (FR)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Nom du service</label>
                <input
                  type="text"
                  value={formData.title.fr || ''}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, fr: e.target.value } })}
                  placeholder="Support Technique..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Description courte</label>
                <input
                  type="text"
                  value={formData.shortDesc.fr || ''}
                  onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, fr: e.target.value } })}
                  placeholder="Description..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Spécifications détaillées</label>
                <textarea
                  rows={3}
                  value={formData.fullContent.fr || ''}
                  onChange={(e) => setFormData({ ...formData, fullContent: { ...formData.fullContent, fr: e.target.value } })}
                  placeholder="Spécifications..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-400 resize-none"
                />
              </div>
            </div>

            {/* German */}
            <div className="bg-[#202127] border border-purple-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
              <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                DE Deutsch (DE)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Dienstname</label>
                <input
                  type="text"
                  value={formData.title.de || ''}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, de: e.target.value } })}
                  placeholder="Technischer Support..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Kurzbeschreibung</label>
                <input
                  type="text"
                  value={formData.shortDesc.de || ''}
                  onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, de: e.target.value } })}
                  placeholder="Kurzbeschreibung..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Detaillierte Spezifikationen</label>
                <textarea
                  rows={3}
                  value={formData.fullContent.de || ''}
                  onChange={(e) => setFormData({ ...formData, fullContent: { ...formData.fullContent, de: e.target.value } })}
                  placeholder="Spezifikationen..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="support"
            packages={packages}
            onChange={setPackages}
            onSave={savePackagesToDb}
          />
        </div>

        {/* Sticky Bottom Actions */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {tUi('savedSuccess')}</span>}</div>
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/dashboard/services`} className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              {tUi('cancelBtn')}
            </Link>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              {tUi('savePublishBtn')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
