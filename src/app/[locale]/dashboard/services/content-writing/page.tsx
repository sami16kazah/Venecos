'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdEditDocument, MdArrowBack, MdCheckCircle, MdTune, MdSave } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';
import { combineMultiLangSubServices } from '@/lib/i18nUtils';

// ... dbContentUi ...

const dbContentUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة خدمة كتابة المحتوى',
    en: 'Content Writing & Copywriting Management',
    fr: 'Gestion de la rédaction de contenu',
    de: 'Texterstellung & Copywriting Verwaltung',
  },
  pageSubtitle: {
    ar: 'صياغة المقالات، سكريبتات، ومستندات العينات عبر Cloudinary',
    en: 'Article copywriting, video scripts & sample documents',
    fr: 'Rédaction d\'articles, scripts vidéo & documents d\'exemple',
    de: 'Artikel-Texte, Skripte & Beispiel-Dokumente',
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
    en: '🌐 Text Content (4 Languages)',
    fr: '🌐 Contenu textuel (4 langues)',
    de: '🌐 Textinhalte (4 Sprachen)',
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
    ar: 'الشرح التفصيلي للخدمة والمواصفات',
    en: 'Full Description & Specifications',
    fr: 'Description détaillée & spécifications',
    de: 'Vollständige Beschreibung & Spezifikationen',
  },
  coverTitle: {
    ar: 'غلاف كتابة المحتوى (Cloudinary Uploader)',
    en: 'Service Cover Image (Cloudinary)',
    fr: 'Image de couverture du service',
    de: 'Service-Titelbild (Cloudinary)',
  },
  docTitle: {
    ar: 'مستند عينة مقال (PDF / DOCX Uploader)',
    en: 'Sample Article Document (PDF / DOCX)',
    fr: 'Document d\'exemple (PDF / DOCX)',
    de: 'Beispiel-Dokument (PDF / DOCX)',
  },
  stylesTitle: {
    ar: 'أنواع واساليب المحتوى',
    en: 'Content Types & Writing Styles',
    fr: 'Types de contenu & Styles de rédaction',
    de: 'Inhaltstypen & Schreibstile',
  },
  pricingTitle: {
    ar: 'أسعار الكلمات ومواعيد التسليم',
    en: 'Word Pricing & Delivery Timeframes',
    fr: 'Tarifs au mot & Délais de livraison',
    de: 'Wortpreise & Lieferfristen',
  },
  dropCoverLabel: {
    ar: 'إسقاط صورة غلاف الخدمة',
    en: 'Drop cover image here',
    fr: 'Déposer l\'image de couverture ici',
    de: 'Titelbild hier ablegen',
  },
  dropDocLabel: {
    ar: 'رفع مستند عينة PDF أو Word',
    en: 'Upload sample PDF or Word document',
    fr: 'Téléverser le document d\'exemple (PDF/Word)',
    de: 'Beispiel-Dokument hochladen (PDF/Word)',
  },
  contentTypesLabel: {
    ar: 'أنواع المحتوى المقبولة',
    en: 'Accepted Content Types',
    fr: 'Types de contenu acceptés',
    de: 'Akzeptierte Inhaltstypen',
  },
  writingStylesLabel: {
    ar: 'أسلوب الكتابة',
    en: 'Writing Styles',
    fr: 'Styles de rédaction',
    de: 'Schreibstile',
  },
  pricePer100Label: {
    ar: 'السعر لكل 100 كلمة (€)',
    en: 'Price / 100 words (€)',
    fr: 'Prix / 100 mots (€)',
    de: 'Preis / 100 Wörter (€)',
  },
  minWordsLabel: {
    ar: 'الحد الأدنى للكلمات',
    en: 'Minimum Words',
    fr: 'Nombre minimum de mots',
    de: 'Mindestanzahl an Wörtern',
  },
  deliveryDaysFromLabel: {
    ar: 'التسليم من (أيام)',
    en: 'Delivery From (days)',
    fr: 'Livraison de (jours)',
    de: 'Lieferung ab (Tage)',
  },
  deliveryDaysToLabel: {
    ar: 'التسليم إلى (أيام)',
    en: 'Delivery To (days)',
    fr: 'Livraison jusqu\'à (jours)',
    de: 'Lieferung bis (Tage)',
  },
  savedSuccess: {
    ar: 'تم حفظ ونشر خدمة كتابة المحتوى بنجاح',
    en: 'Content writing service saved & published successfully',
    fr: 'Service de rédaction enregistré avec succès',
    de: 'Texterstellungsservice erfolgreich gespeichert',
  },
};

export default function ContentWritingServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbContentUi[key]?.[locale] || dbContentUi[key]?.['en'] || '';

  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [saved, setSaved] = useState(false);
  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=content-writing');
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items) && items.length > 0) {
            setPackages(combineMultiLangSubServices(items));
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
          serviceKey: 'content-writing',
          titles: formData.title,
          descriptions: formData.shortDesc,
          iconName: 'FaPen',
          iconType: 'react-icon',
          order: 9,
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

  const contentTypes = [
    { id: 'seo', ar: 'مقالات متوافقة مع SEO', en: 'SEO-Friendly Articles', fr: 'Articles optimisés SEO', de: 'SEO-optimierte Artikel' },
    { id: 'copywriting', ar: 'نصوص إعلانات وتسويق', en: 'Advertising & Marketing Copywriting', fr: 'Rédaction publicitaire & marketing', de: 'Werbe- & Marketingtexte' },
    { id: 'scripts', ar: 'سيناريوهات وفيديو', en: 'Video & Audio Scripts', fr: 'Scripts vidéo & audio', de: 'Video- & Skriptkonzepte' },
    { id: 'translation', ar: 'ترجمة وصياغة بلغات', en: 'Multi-language Translation & Localization', fr: 'Traduction & Adaptation multilingue', de: 'Mehrsprachige Übersetzung & Lokalisierung' },
    { id: 'profile', ar: 'بروفايل ومحتوى تعريفي', en: 'Company Profile & Bio Content', fr: 'Profil d\'entreprise & Présentation', de: 'Unternehmensprofil & Präsentation' },
  ];

  const writingStyles = [
    { id: 'corporate', ar: 'احترافي رسمي (Corporate)', en: 'Official & Corporate', fr: 'Professionnel & Officiel', de: 'Offiziell & Professionell' },
    { id: 'persuasive', ar: 'تسويقي حماسي (Persuasive)', en: 'Persuasive & Marketing', fr: 'Persuasif & Marketing', de: 'Überzeugend & Marketing' },
    { id: 'technical', ar: 'تقني مبسط (Technical)', en: 'Simplified Technical', fr: 'Technique simplifié', de: 'Vereinfacht Technisch' },
    { id: 'storytelling', ar: 'قصصي جذّاب (Storytelling)', en: 'Engaging Storytelling', fr: 'Storytelling captivant', de: 'Ansprechendes Storytelling' },
  ];

  const [selectedTypes, setSelectedTypes] = useState<string[]>(['seo', 'copywriting']);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['corporate', 'persuasive']);

  const [formData, setFormData] = useState({
    title: { ar: 'كتابة المحتوى وصياغة المقالات الحصرية', en: 'Content Writing & Professional Copywriting', fr: 'Rédaction de contenu professionnel', de: 'Professionelle Texterstellung' },
    shortDesc: { ar: 'صياغة مقالات ونصوص إعلانات متوافقة مع محركات البحث SEO ومستهدفة للجمهور', en: 'SEO friendly articles and persuasive copywriting', fr: 'Rédaction SEO et textes publicitaires', de: 'SEO-Texte und Werbetexte' },
    fullDesc: { ar: 'كتابة مقالات واحترافية حصرية 100% متوافقة مع قواعد SEO وسيناريوهات إعلانية جذابة.', en: '100% original SEO articles and compelling marketing video scripts.', fr: 'Rédaction d\'articles SEO 100% originaux et scripts publicitaires.', de: '100% originale SEO-Texte und überzeugende Werbeschreibungen.' },
    pricePer100Words: 5.00,
    minWordsOrder: 500,
    deliveryDaysFrom: 2,
    deliveryDaysTo: 5,
    coverImage: '',
    sampleDocUrl: '',
  });

  const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdEditDocument />
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

        {/* Media & Document Cloudinary Uploaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('coverTitle')}</h3>
            <CloudinaryUploader
              label={tUi('dropCoverLabel')}
              currentUrl={formData.coverImage}
              onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
            />
          </div>

          <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('docTitle')}</h3>
            <CloudinaryUploader
              label={tUi('dropDocLabel')}
              acceptTypes=".pdf,.doc,.docx"
              mediaType="raw"
              currentUrl={formData.sampleDocUrl}
              onUploadSuccess={(url) => setFormData({ ...formData, sampleDocUrl: url })}
            />
          </div>
        </div>

        {/* Content Types & Styles Selection Chips */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdTune /> {tUi('stylesTitle')}
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">{tUi('contentTypesLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleSelection(selectedTypes, setSelectedTypes, type.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedTypes.includes(type.id)
                      ? 'bg-venecos-gold/20 text-venecos-gold border-venecos-gold shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedTypes.includes(type.id) ? '✓ ' : ''}{type[locale as keyof typeof type] || type['en']}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">{tUi('writingStylesLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {writingStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => toggleSelection(selectedStyles, setSelectedStyles, style.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedStyles.includes(style.id)
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedStyles.includes(style.id) ? '✓ ' : ''}{style[locale as keyof typeof style] || style['en']}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Word Pricing Matrix */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('pricingTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('pricePer100Label')}</label>
              <input type="number" step="0.5" value={formData.pricePer100Words} onChange={(e) => setFormData({ ...formData, pricePer100Words: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('minWordsLabel')}</label>
              <input type="number" value={formData.minWordsOrder} onChange={(e) => setFormData({ ...formData, minWordsOrder: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('deliveryDaysFromLabel')}</label>
              <input type="number" value={formData.deliveryDaysFrom} onChange={(e) => setFormData({ ...formData, deliveryDaysFrom: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('deliveryDaysToLabel')}</label>
              <input type="number" value={formData.deliveryDaysTo} onChange={(e) => setFormData({ ...formData, deliveryDaysTo: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center text-sm" />
            </div>
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="content-writing"
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

