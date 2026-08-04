'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdHeadset, MdArrowBack, MdSave, MdCheckCircle } from 'react-icons/md';

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: 'support',
          locale,
          title: formData.title[activeLangTab] || formData.title.ar || 'Technical Support & Maintenance',
          description: formData.shortDesc[activeLangTab] || formData.shortDesc.ar || 'Server and website troubleshooting & maintenance',
          iconName: 'FaHeadset',
          iconType: 'react-icon',
          order: 13,
          isSpecial: true,
          subServices: [
            {
              title: `Technical Support Package`,
              description: formData.fullContent[activeLangTab] || 'Full technical support including bug fixes and security tuning',
              price: formData.priceFrom || 20
            }
          ]
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

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

        {/* 4 Languages Section */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('multiLangTextsTitle')}</h3>
            <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {(['ar', 'en', 'fr', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    activeLangTab === lang
                      ? 'bg-venecos-gold text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'SA العربية' : lang === 'en' ? 'GB English' : lang === 'fr' ? 'FR Français' : 'DE Deutsch'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {tUi('titleLabel')} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData.title[activeLangTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, [activeLangTab]: e.target.value },
                  })
                }
                placeholder={tUi('titlePlaceholder')}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {tUi('shortDescLabel')} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData.shortDesc[activeLangTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDesc: { ...formData.shortDesc, [activeLangTab]: e.target.value },
                  })
                }
                placeholder={tUi('shortDescPlaceholder')}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {tUi('fullDescLabel')} ({activeLangTab.toUpperCase()})
              </label>
              <textarea
                rows={5}
                value={formData.fullContent[activeLangTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullContent: { ...formData.fullContent, [activeLangTab]: e.target.value },
                  })
                }
                placeholder={tUi('fullDescPlaceholder')}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
              />
            </div>
          </div>
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
