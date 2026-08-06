'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdCampaign, MdArrowBack, MdCheckCircle, MdTune, MdSave } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';

// ... dbAdvUi ...

const dbAdvUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة الطباعة الإعلانية والدعائية',
    en: 'Advertising & Promotional Printing Management',
    fr: 'Gestion de l\'impression publicitaire & promotionnelle',
    de: 'Werbe- & Werbedruckverwaltung',
  },
  pageSubtitle: {
    ar: 'أكواب، أقلام، تيشيرتات، هدايا دعاية، وتقنيات Silk Screen & UV',
    en: 'Mugs, pens, t-shirts, promotional gifts, Silk Screen & UV techniques',
    fr: 'Mugs, stylos, t-shirts, cadeaux publicitaires, sérigraphie & UV',
    de: 'Tassen, Stifte, T-Shirts, Werbegeschenke, Siebdruck & UV-Techniken',
  },
  backBtn: {
    ar: 'الرجوع للخدمات',
    en: 'Back to Services',
    fr: 'Retour aux Services',
    de: 'Zurück zu den Diensten',
  },
  draftBtn: {
    ar: '💾 مسودة',
    en: '💾 Draft',
    fr: '💾 Brouillon',
    de: '💾 Entwurf',
  },
  publishBtn: {
    ar: '✓ حفظ ونشر',
    en: '✓ Save & Publish',
    fr: '✓ Enregistrer & Publier',
    de: '✓ Speichern & Veröffentlichen',
  },
  cancelBtn: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  multiLangTitle: {
    ar: '🌐 النصوص والشرح بالأربع لغات',
    en: '🌐 Text & Description (4 Languages)',
    fr: '🌐 Textes & Descriptions (4 langues)',
    de: '🌐 Texte & Beschreibungen (4 Sprachen)',
  },
  titleLabel: {
    ar: 'عنوان الخدمة',
    en: 'Service Title',
    fr: 'Titre du service',
    de: 'Servicetitel',
  },
  shortDescLabel: {
    ar: 'وصف مختصر',
    en: 'Short Description',
    fr: 'Courte description',
    de: 'Kurzbeschreibung',
  },
  fullDescLabel: {
    ar: 'الشرح التفصيلي للمنتجات الإعلانية',
    en: 'Full Description & Specifications',
    fr: 'Description détaillée & spécifications',
    de: 'Vollständige Beschreibung & Spezifikationen',
  },
  techniquesTitle: {
    ar: 'تقنيات الطباعة الإعلانية المتاحة',
    en: 'Available Printing Techniques',
    fr: 'Techniques d\'impression disponibles',
    de: 'Verfügbare Drucktechniken',
  },
  pricingTitle: {
    ar: 'نطاق الأسعار (€)',
    en: 'Price Range (€)',
    fr: 'Gamme de prix (€)',
    de: 'Preisspanne (€)',
  },
  coverTitle: {
    ar: 'رفع غلاف الهدايا والمطبوعات الإعلانية',
    en: 'Upload Cover Image for Promotional Items',
    fr: 'Téléverser l\'image de couverture des articles',
    de: 'Titelbild für Werbeartikel hochladen',
  },
  dropzoneLabel: {
    ar: 'إسقاط صورة الأكواب أو المطبوعات الإعلانية',
    en: 'Drop promotional product or mug image here',
    fr: 'Déposer l\'image de l\'article promotionnel ici',
    de: 'Bild des Werbeartikels hier ablegen',
  },
  savedSuccess: {
    ar: 'تم حفظ ونشر خدمة الطباعة الإعلانية بنجاح',
    en: 'Advertising print service saved & published successfully',
    fr: 'Service d\'impression publicitaire enregistré avec succès',
    de: 'Werbedruckservice erfolgreich gespeichert',
  },
};

export default function AdvPrintServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbAdvUi[key]?.[locale] || dbAdvUi[key]?.['en'] || '';

  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [saved, setSaved] = useState(false);
  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=adv-print');
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
          serviceKey: 'adv-print',
          titles: formData.title,
          descriptions: formData.shortDesc,
          iconName: 'FaBullhorn',
          iconType: 'react-icon',
          order: 10,
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

  const [allTechniques] = useState<string[]>([
    'Silk Screen طباعة حريرية',
    'UV Digital طباعة يو في',
    'Laser Engraving حفر ليزر',
    'Foil Stamping ذهبي/فضائي',
    'Sublimation حراري',
  ]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([
    'Silk Screen طباعة حريرية',
    'UV Digital طباعة يو في',
  ]);

  const [formData, setFormData] = useState({
    title: {
      ar: 'الطباعة الإعلانية والدعائية',
      en: 'Advertising & Promotional Printing',
      fr: 'Impression publicitaire',
      de: 'Werbedruck & Promotion',
    },
    shortDesc: {
      ar: 'طباعة حريرية وUV على الأكواب، الأقلام، والتيشيرتات والهدايا',
      en: 'Silk screen & UV printing on mugs, pens, t-shirts and corporate gifts',
      fr: 'Impression sérigraphique et UV sur mugs, stylos et t-shirts',
      de: 'Sieb- und UV-Druck auf Tassen, Stiften, T-Shirts und Geschenken',
    },
    fullDesc: {
      ar: 'طباعة مخصصة عالية الدقة لجميع الهدايا الدعائية مع خيارات دمج شعارك بتقنية الحفر بالليزر والطباعة الحرارية.',
      en: 'High-precision custom printing for promotional merchandise with laser engraving & thermal transfer.',
      fr: 'Impression haute précision pour objets publicitaires avec gravure laser.',
      de: 'Hochpräziser Druck für Werbeartikel mit Lasergravur und Thermotransfer.',
    },
    priceFrom: 5,
    priceTo: 100,
    coverImage: '',
  });

  const toggleTechnique = (tech: string) => {
    if (selectedTechniques.includes(tech)) {
      setSelectedTechniques(selectedTechniques.filter(t => t !== tech));
    } else {
      setSelectedTechniques([...selectedTechniques, tech]);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdCampaign />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{tUi('pageTitle')}</h1>
            <p className="text-xs text-white/60">{tUi('pageSubtitle')}</p>
          </div>
        </div>
        <Link href={`/${locale}/dashboard/services`} className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backBtn')}
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Multilingual Text */}
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
                    activeLangTab === lang ? 'bg-venecos-gold text-black shadow' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? '🇸🇦 العربية' : lang === 'en' ? '🇬🇧 English' : lang === 'fr' ? '🇫🇷 Français' : '🇩🇪 Deutsch'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('titleLabel')} ({activeLangTab.toUpperCase()})</label>
              <input
                type="text"
                value={formData.title[activeLangTab]}
                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [activeLangTab]: e.target.value } })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:border-venecos-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('shortDescLabel')} ({activeLangTab.toUpperCase()})</label>
              <textarea
                rows={2}
                value={formData.shortDesc[activeLangTab]}
                onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, [activeLangTab]: e.target.value } })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm resize-none focus:border-venecos-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('fullDescLabel')} ({activeLangTab.toUpperCase()})</label>
              <textarea
                rows={3}
                value={formData.fullDesc[activeLangTab] || ''}
                onChange={(e) => setFormData({ ...formData, fullDesc: { ...formData.fullDesc, [activeLangTab]: e.target.value } })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm resize-none focus:border-venecos-gold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Printing Techniques */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdTune /> {tUi('techniquesTitle')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTechniques.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTechnique(tech)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedTechniques.includes(tech)
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500 shadow'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                }`}
              >
                {selectedTechniques.includes(tech) ? '✓ ' : ''}{tech}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Range */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('pricingTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{isRtl ? 'من (€)' : 'From (€)'}</label>
              <input
                type="number"
                value={formData.priceFrom}
                onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{isRtl ? 'إلى (€)' : 'To (€)'}</label>
              <input
                type="number"
                value={formData.priceTo}
                onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center text-sm"
              />
            </div>
          </div>
        </div>

        {/* Cover Media */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('coverTitle')}</h3>
          <CloudinaryUploader
            label={tUi('dropzoneLabel')}
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="adv-print"
            packages={packages}
            onChange={setPackages}
            onSave={savePackagesToDb}
          />
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {tUi('savedSuccess')}</span>}</div>
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/dashboard/services`} className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              {tUi('cancelBtn')}
            </Link>
            <button type="button" onClick={handleSave} className="px-5 py-2.5 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
              {tUi('draftBtn')}
            </button>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              {tUi('publishBtn')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

