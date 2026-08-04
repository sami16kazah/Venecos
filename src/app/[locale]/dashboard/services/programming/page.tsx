'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdCode, MdArrowBack, MdSave, MdCheckCircle } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

const dbProgUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة خدمة البرمجة والتطوير المخصص',
    en: 'Programming & Software Development Management',
    fr: 'Gestion du Service Programmation & Développement',
    de: 'Software- & Webentwicklung Verwaltung',
  },
  pageSubtitle: {
    ar: 'مواصفات وأسعار ومرفقات ونصوص خدمة البرمجة بالأربع لغات',
    en: 'Specifications, pricing, media attachments and 4-language content',
    fr: 'Spécifications, tarifs, pièces jointes et contenu en 4 langues',
    de: 'Spezifikationen, Preise, Medien und 4-sprachige Inhalte',
  },
  backToServices: {
    ar: 'العودة للخدمات',
    en: 'Back to Services',
    fr: 'Retour aux Services',
    de: 'Zurück zu den Diensten',
  },
  coverImageLabel: {
    ar: 'صورة غلاف الخدمة (Cloudinary Uploader)',
    en: 'Service Cover Image (Cloudinary Uploader)',
    fr: 'Image de couverture du service (Cloudinary)',
    de: 'Service-Titelbild (Cloudinary)',
  },
  dropCover: {
    ar: 'اختر أو اسحب صورة غلاف الخدمة هنا',
    en: 'Drop or select service cover image here',
    fr: 'Déposer l\'image de couverture ici',
    de: 'Titelbild hier ablegen',
  },
  priceDeliveryTitle: {
    ar: 'السعر وفترة التسليم',
    en: 'Pricing & Delivery Timeframe',
    fr: 'Tarifs & Délais de livraison',
    de: 'Preise & Lieferzeitraum',
  },
  priceFrom: {
    ar: 'السعر من (€)',
    en: 'Price From (€)',
    fr: 'Prix à partir de (€)',
    de: 'Preis ab (€)',
  },
  priceTo: {
    ar: 'السعر إلى (€)',
    en: 'Price To (€)',
    fr: 'Prix jusqu\'à (€)',
    de: 'Preis bis (€)',
  },
  daysFrom: {
    ar: 'التسليم من (أيام)',
    en: 'Delivery From (days)',
    fr: 'Livraison de (jours)',
    de: 'Lieferung ab (Tage)',
  },
  daysTo: {
    ar: 'التسليم إلى (أيام)',
    en: 'Delivery To (days)',
    fr: 'Livraison jusqu\'à (jours)',
    de: 'Lieferung bis (Tage)',
  },
  multiLangTitle: {
    ar: 'النصوص والشرح التفصيلي (4 لغات)',
    en: 'Text Content & Specifications (4 Languages)',
    fr: 'Contenu textuel & spécifications (4 langues)',
    de: 'Textinhalte & Spezifikationen (4 Sprachen)',
  },
  titleInputLabel: {
    ar: 'عنوان الخدمة',
    en: 'Service Title',
    fr: 'Titre du service',
    de: 'Dienstbezeichnung',
  },
  shortDescLabel: {
    ar: 'الوصف المختصر',
    en: 'Short Description',
    fr: 'Courte description',
    de: 'Kurzbeschreibung',
  },
  fullContentLabel: {
    ar: 'الشرح التفصيلي والخصائص',
    en: 'Full Detailed Content & Features',
    fr: 'Description détaillée & caractéristiques',
    de: 'Ausführliche Beschreibung & Funktionen',
  },
  savedSuccess: {
    ar: 'تم الحفظ بنجاح',
    en: 'Saved successfully',
    fr: 'Enregistré avec succès',
    de: 'Erfolgreich gespeichert',
  },
  saveSettings: {
    ar: 'حفظ الإعدادات',
    en: 'Save Settings',
    fr: 'Enregistrer les paramètres',
    de: 'Einstellungen speichern',
  },
};

export default function ProgrammingServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbProgUi[key]?.[locale] || dbProgUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');

  const [formData, setFormData] = useState({
    title: {
      ar: 'خدمة البرمجة والتطوير المخصص',
      en: 'Custom Software & Web Development',
      fr: 'Développement sur mesure',
      de: 'Individuelle Softwareentwicklung',
    },
    shortDesc: {
      ar: 'تطوير مواقع، برامج، وتطبيقات حسب الطلب',
      en: 'Custom web, app & software solutions',
      fr: 'Solutions web et logiciels sur mesure',
      de: 'Maßgeschneiderte Web- und Softwarelösungen',
    },
    priceFrom: 300,
    priceTo: 5000,
    daysFrom: 5,
    daysTo: 30,
    coverImage: '',
    galleryImages: [] as string[],
    fullContent: {
      ar: 'نطور برمجيات متكاملة بمواصفات عالية وفق أحدث التقنيات (React, Next.js, Node.js, PHP, Python).\n\nيشمل:\n• البنية التحتية وقواعد البيانات\n• تصميم الواجهات الذكية UX/UI\n• ضمان واستقرار التشغيل',
      en: 'Full-stack software development with React, Next.js, Node.js & cloud infrastructure.\n\nIncludes:\n• Database & Cloud Architecture\n• Modern UX/UI Interface Design\n• 100% Stability Guarantee',
      fr: 'Développement logiciel complet avec React, Next.js, Node.js et infrastructure cloud.\n\nComprend:\n• Architecture de base de données\n• Design UX/UI moderne\n• Garantie de stabilité',
      de: 'Full-Stack-Softwareentwicklung mit React, Next.js, Node.js und Cloud-Infrastruktur.\n\nEnthält:\n• Datenbank & Cloud-Architektur\n• Modernes UX/UI Design\n• Stabilitätsgarantie',
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: 'programming',
          locale,
          title: formData.title[activeLangTab] || formData.title.ar || 'Custom Programming Services',
          description: formData.shortDesc[activeLangTab] || formData.shortDesc.ar || 'Custom web & app software engineering',
          iconName: 'FaCode',
          iconType: 'react-icon',
          order: 0,
          isSpecial: true,
          subServices: [
            {
              title: `Custom Full-Stack Development`,
              description: formData.fullContent[activeLangTab] || 'Web and mobile app engineering',
              price: 499
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
    <div className="space-y-6 max-w-5xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdCode />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{tUi('pageTitle')}</h1>
            <p className="text-xs text-white/60 mt-0.5">{tUi('pageSubtitle')}</p>
          </div>
        </div>
        <Link
          href={`/${locale}/dashboard/services`}
          className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold"
        >
          <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backToServices')}
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cover Upload via Cloudinary */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('coverImageLabel')}</h3>
          <CloudinaryUploader
            label={tUi('dropCover')}
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Pricing & Delivery */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('priceDeliveryTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('priceFrom')}</label>
              <input
                type="number"
                value={formData.priceFrom}
                onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('priceTo')}</label>
              <input
                type="number"
                value={formData.priceTo}
                onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('daysFrom')}</label>
              <input
                type="number"
                value={formData.daysFrom}
                onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('daysTo')}</label>
              <input
                type="number"
                value={formData.daysTo}
                onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center"
              />
            </div>
          </div>
        </div>

        {/* Texts Multi-language with 4 Tabs */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('multiLangTitle')}</h3>
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
                  {lang === 'ar' ? '🇸🇦 عربي' : lang === 'en' ? '🇬🇧 EN' : lang === 'fr' ? '🇫🇷 FR' : '🇩🇪 DE'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">
                {tUi('titleInputLabel')} ({activeLangTab.toUpperCase()}) *
              </label>
              <input
                type="text"
                required
                value={formData.title[activeLangTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, [activeLangTab]: e.target.value },
                  })
                }
                placeholder="Software Development..."
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">
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
                placeholder="Custom web & app solutions..."
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">
                {tUi('fullContentLabel')} ({activeLangTab.toUpperCase()})
              </label>
              <textarea
                rows={6}
                value={formData.fullContent[activeLangTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullContent: { ...formData.fullContent, [activeLangTab]: e.target.value },
                  })
                }
                placeholder="Detailed specifications..."
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {saved && (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <MdCheckCircle /> {tUi('savedSuccess')}
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all"
          >
            <MdSave /> {tUi('saveSettings')}
          </button>
        </div>
      </form>
    </div>
  );
}
