'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdCode, MdArrowBack, MdSave, MdCheckCircle } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';

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

  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=programming');
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items) && items.length > 0) {
            const arDoc = items.find((i: any) => i.locale === 'ar');
            const enDoc = items.find((i: any) => i.locale === 'en');
            const frDoc = items.find((i: any) => i.locale === 'fr');
            const deDoc = items.find((i: any) => i.locale === 'de');

            if (arDoc && arDoc.subServices) {
              setPackages(arDoc.subServices);
            }

            setFormData(prev => ({
              ...prev,
              title: {
                ar: arDoc?.title || prev.title.ar,
                en: enDoc?.title || prev.title.en,
                fr: frDoc?.title || prev.title.fr,
                de: deDoc?.title || prev.title.de,
              },
              shortDesc: {
                ar: arDoc?.description || prev.shortDesc.ar,
                en: enDoc?.description || prev.shortDesc.en,
                fr: frDoc?.description || prev.shortDesc.fr,
                de: deDoc?.description || prev.shortDesc.de,
              },
            }));
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
          serviceKey: 'programming',
          titles: formData.title,
          descriptions: formData.shortDesc,
          iconName: 'FaCode',
          iconType: 'react-icon',
          order: 0,
          isSpecial: true,
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

        {/* Texts Multi-language 4-Languages 2x2 Grid */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            🌐 {tUi('multiLangTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Arabic */}
            <div className="bg-[#202127] border border-amber-500/30 rounded-2xl p-4 space-y-3" dir="rtl">
              <div className="bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                SA العربية (AR)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">{tUi('titleInputLabel')} *</label>
                <input
                  type="text"
                  required
                  value={formData.title.ar || ''}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                  placeholder="البرمجة ومواقع الويب..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">{tUi('shortDescLabel')}</label>
                <input
                  type="text"
                  value={formData.shortDesc.ar || ''}
                  onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, ar: e.target.value } })}
                  placeholder="وصف مختصر..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">{tUi('fullContentLabel')}</label>
                <textarea
                  rows={4}
                  value={formData.fullContent.ar || ''}
                  onChange={(e) => setFormData({ ...formData, fullContent: { ...formData.fullContent, ar: e.target.value } })}
                  placeholder="التفاصيل الكاملة..."
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
                  placeholder="Programming & Web..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDesc.en || ''}
                  onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, en: e.target.value } })}
                  placeholder="Short description..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Full Specifications</label>
                <textarea
                  rows={4}
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
                  placeholder="Programmation & Web..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Description courte</label>
                <input
                  type="text"
                  value={formData.shortDesc.fr || ''}
                  onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, fr: e.target.value } })}
                  placeholder="Description courte..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Spécifications détaillées</label>
                <textarea
                  rows={4}
                  value={formData.fullContent.fr || ''}
                  onChange={(e) => setFormData({ ...formData, fullContent: { ...formData.fullContent, fr: e.target.value } })}
                  placeholder="Spécifications détaillées..."
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
                  placeholder="Programmierung & Web..."
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
                  rows={4}
                  value={formData.fullContent.de || ''}
                  onChange={(e) => setFormData({ ...formData, fullContent: { ...formData.fullContent, de: e.target.value } })}
                  placeholder="Detaillierte Spezifikationen..."
                  className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="programming"
            packages={packages}
            onChange={setPackages}
            onSave={savePackagesToDb}
          />
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
