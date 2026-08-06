'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdCameraAlt, MdArrowBack, MdCheckCircle, MdPhotoLibrary, MdTune, MdSave, MdAdd, MdDelete } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';

// ... dbPhotoUi ...

const dbPhotoUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة التصميم الفوتوغرافي وتصوير المنتجات',
    en: 'Photography & Product Photo Management',
    fr: 'Gestion de la Photographie & Studio',
    de: 'Fotografie & Produktfoto-Verwaltung',
  },
  pageSubtitle: {
    ar: 'تصوير الاستوديو، المنتجات، المعالجة، والمعدات المطابقة للـ Legacy',
    en: 'Studio shooting, product specs, retouching & equipment setup',
    fr: 'Prise de vue studio, retouche et équipement',
    de: 'Studioaufnahmen, Produktfotos, Bearbeitung & Ausrüstung',
  },
  backBtn: {
    ar: 'رجوع',
    en: 'Back',
    fr: 'Retour',
    de: 'Zurück',
  },
  draftBtn: {
    ar: '💾 مسودة',
    en: '💾 Draft',
    fr: '💾 Brouillon',
    de: '💾 Entwurf',
  },
  publishBtn: {
    ar: '✓ نشر الخدمة',
    en: '✓ Publish Service',
    fr: '✓ Publier le service',
    de: '✓ Service veröffentlichen',
  },
  coverImageTitle: {
    ar: 'صورة غلاف الخدمة (Cloudinary Uploader)',
    en: 'Service Cover Image (Cloudinary Uploader)',
    fr: 'Image de couverture du service (Cloudinary)',
    de: 'Service-Titelbild (Cloudinary)',
  },
  dropCoverLabel: {
    ar: 'انقر أو اسحب صورة غلاف الاستوديو هنا',
    en: 'Click or drop studio cover image here',
    fr: 'Déposer l\'image de couverture studio ici',
    de: 'Titelbild hier ablegen',
  },
  sampleGalleryTitle: {
    ar: 'معرض النماذج والصور التوضيحية',
    en: 'Sample Showcase Gallery',
    fr: 'Galerie de démonstration',
    de: 'Beispielgalerie',
  },
  dropGalleryLabel: {
    ar: 'رفع صور نموذج جديدة لمعرض الاستوديو',
    en: 'Upload sample images to gallery',
    fr: 'Téléverser des images d\'exemple',
    de: 'Beispielbilder hochladen',
  },
  pricingTitle: {
    ar: 'أسعار ونطاق عدد الصور والتسليم',
    en: 'Pricing, Photo Count Range & Delivery',
    fr: 'Tarifs, Nombre de photos & Livraison',
    de: 'Preise, Anzahl der Fotos & Lieferung',
  },
  photosFrom: {
    ar: 'عدد الصور من',
    en: 'Photos Count From',
    fr: 'Nombre de photos de',
    de: 'Fotos Anzahl von',
  },
  photosTo: {
    ar: 'عدد الصور إلى',
    en: 'Photos Count To',
    fr: 'Nombre de photos à',
    de: 'Fotos Anzahl bis',
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
    ar: 'التسليم من',
    en: 'Delivery From',
    fr: 'Livraison de',
    de: 'Lieferung ab',
  },
  daysTo: {
    ar: 'التسليم إلى',
    en: 'Delivery To',
    fr: 'Livraison à',
    de: 'Lieferung bis',
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
  multiLangTitle: {
    ar: 'النصوص والشرح بالأربع لغات',
    en: 'Text Content (4 Languages)',
    fr: 'Contenu textuel (4 langues)',
    de: 'Textinhalte (4 Sprachen)',
  },
  titleLabel: {
    ar: 'عنوان الخدمة',
    en: 'Service Title',
    fr: 'Titre du service',
    de: 'Titel',
  },
  shortDescLabel: {
    ar: 'الوصف المختصر',
    en: 'Short Description',
    fr: 'Courte description',
    de: 'Kurzbeschreibung',
  },
  fullContentLabel: {
    ar: 'الشرح التفصيلي للخدمة والمميزات',
    en: 'Full Description & Specifications',
    fr: 'Description détaillée & spécifications',
    de: 'Vollständige Beschreibung & Spezifikationen',
  },
  cancelBtn: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  photoTypesTitle: {
    ar: 'أنواع التصوير وبيئة العمل',
    en: 'Photography Types & Shooting Environment',
    fr: 'Types de photographie & Environnement',
    de: 'Fotografiearten & Aufnahmeumgebung',
  },
  availablePhotoTypes: {
    ar: 'مجالات وأنواع التصوير المتاحة',
    en: 'Available Photography Categories',
    fr: 'Catégories de photographie disponibles',
    de: 'Verfügbare Fotografiekategorien',
  },
  shootingEnv: {
    ar: 'مكان وبيئة جلسة التصوير',
    en: 'Shooting Location & Environment',
    fr: 'Lieu & Environnement de prise de vue',
    de: 'Aufnahmeort & Umgebung',
  },
  equipAndFormats: {
    ar: 'المعدات وصيغ التسليم والريتاتش',
    en: 'Equipment, Deliverables & Retouching Tiers',
    fr: 'Équipement, Formats & Retouche',
    de: 'Ausrüstung, Formate & Bearbeitung',
  },
  cameraEquip: {
    ar: 'معدات الكاميرا والإضاءة المستخدمة',
    en: 'Camera & Lighting Gear Used',
    fr: 'Matériel photo & éclairage utilisé',
    de: 'Verwendete Kamera- & Lichtausrüstung',
  },
  retouchingLevels: {
    ar: 'مستويات معالجة الصور (Retouching Tiers)',
    en: 'Photo Retouching & Post-Processing Tiers',
    fr: 'Niveaux de retouche photo',
    de: 'Bildbearbeitungs- & Retusche-Stufen',
  },
  deliveryFormats: {
    ar: 'صيغ الصور المُسلَّمة للعميل',
    en: 'Delivered Image File Formats',
    fr: 'Formats d\'image livrés au client',
    de: 'Gelieferte Bilddateiformate',
  },
  pricingSectionTitle: {
    ar: 'نطاق الأسعار وعدد الصور وفترة التسليم',
    en: 'Pricing Range, Photo Count & Delivery Timeframe',
    fr: 'Plage de prix, Nombre de photos & Délais',
    de: 'Preisspanne, Fotos-Anzahl & Lieferzeitraum',
  },
  samplesSectionTitle: {
    ar: 'عينات صور التصوير الفوتوغرافي',
    en: 'Photography Showcase Samples',
    fr: 'Échantillons de travaux photographiques',
    de: 'Fotografie-Beispielgalerie',
  },
};

export default function PhotographyServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbPhotoUi[key]?.[locale] || dbPhotoUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [saveStatusMsg, setSaveStatusMsg] = useState('');
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=photography');
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
          serviceKey: 'photography',
          titles: formData.title,
          descriptions: formData.shortDesc,
          iconName: 'FaCamera',
          iconType: 'react-icon',
          order: 7,
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

  const categories = [
    { id: 'product', ar: 'تصوير منتجات', en: 'Product Photography', fr: 'Photographie de produits', de: 'Produktfotografie' },
    { id: 'food', ar: 'تصوير أطعمة ومأكولات', en: 'Food Photography', fr: 'Photographie culinaire', de: 'Food-Fotografie' },
    { id: 'model', ar: 'تصوير عارضين وشخصي', en: 'Model & Portrait', fr: 'Portrait et mannequin', de: 'Modell & Porträt' },
    { id: 'realestate', ar: 'تصوير عقاري ومعماري', en: 'Real Estate & Interior', fr: 'Immobilier & Architecture', de: 'Immobilien & Architektur' },
    { id: 'spin360', ar: 'تصوير 360 درجة للمنتجات', en: '360° Product Spin', fr: 'Spin 360° produit', de: '360° Produktansicht' },
    { id: 'events', ar: 'تصوير فعاليات ومؤتمرات', en: 'Events & Conferences', fr: 'Événements & Conférences', de: 'Events & Konferenzen' },
  ];

  const environments = [
    { id: 'studio', ar: 'استوديو VENECOS', en: 'VENECOS Studio', fr: 'Studio VENECOS', de: 'VENECOS Studio' },
    { id: 'onlocation', ar: 'موقع العميل', en: 'On-Location', fr: 'Sur site client', de: 'Vor Ort beim Kunden' },
    { id: 'outdoor', ar: 'خارجي / طبيعة', en: 'Outdoor / Nature', fr: 'Extérieur / Nature', de: 'Außenbereich / Natur' },
  ];

  const equipments = [
    { id: 'camera45', ar: 'كاميرا فول فريم 45MP+', en: '45MP+ Full-Frame Camera', fr: 'Appareil photo plein format 45MP+', de: '45MP+ Vollformat-Kamera' },
    { id: 'macro100', ar: 'عدسة ماكرو 100mm احترافية', en: 'Professional 100mm Macro Lens', fr: 'Objectif macro 100mm pro', de: 'Profi 100mm Makro-Objektiv' },
    { id: 'softbox', ar: 'إضاءة استوديو متكاملة Softbox', en: 'Full Studio Softbox Lighting', fr: 'Éclairage studio softbox complet', de: 'Komplette Studio-Softbox-Beleuchtung' },
    { id: 'turntable', ar: 'طاولة دوران 360° كهربائية', en: '360° Electric Turntable', fr: 'Plateau tournant électrique 360°', de: 'Elektrischer 360°-Drehteller' },
    { id: 'drone4k', ar: 'طائرة درون 4K للتصوير الجوي', en: '4K Aerial Drone', fr: 'Drone aérien 4K', de: '4K-Luftaufnahmen-Drohne' },
  ];

  const deliverables = [
    { id: 'highres', ar: 'High-Res JPEG (للطباعة)', en: 'High-Res JPEG (For Print)', fr: 'JPEG haute résolution (pour impression)', de: 'Hochauflösendes JPEG (Druck)' },
    { id: 'webopt', ar: 'Web-Optimized JPEG (للمواقع)', en: 'Web-Optimized JPEG', fr: 'JPEG optimisé pour le web', de: 'Web-optimiertes JPEG' },
    { id: 'raw', ar: 'RAW Files (الصور الأصلية)', en: 'Original RAW Files', fr: 'Fichiers RAW originaux', de: 'Originale RAW-Dateien' },
    { id: 'png', ar: 'PNG خلفية مفرغة (Transparent)', en: 'Transparent PNG', fr: 'PNG fond transparent', de: 'Transparente PNG' },
    { id: 'tiff', ar: 'TIFF عالية الدقة', en: 'High-Res TIFF', fr: 'TIFF haute résolution', de: 'Hochauflösendes TIFF' },
  ];

  const retouchingTiers = [
    { id: 'basic', ar: 'تصحيح ألوان وإضاءة أساسي', en: 'Basic Color Grading & Lighting', fr: 'Étalonnage des couleurs de base', de: 'Basis-Farbkorrektur & Licht' },
    { id: 'advanced', ar: 'معالجة ريتاتش احترافية تنظيف البشرة/المنتج', en: 'Advanced Retouching & Cleaning', fr: 'Retouche avancée peau/produit', de: 'Erweiterte Retusche (Haut/Produkt)' },
    { id: 'clipping', ar: 'قص وتفريغ الخلفية', en: 'Clipping Path & Background Removal', fr: 'Détourage & Suppression de fond', de: 'Freistellen & Hintergrundentfernung' },
    { id: 'composite', ar: 'دمج وتأثيرات إعلانية مرئية', en: 'Composite & Advertising Edit', fr: 'Montage composite & effets pub', de: 'Komposition & Werbeeffekte' },
  ];

  const [selectedCats, setSelectedCats] = useState<string[]>(['product', 'spin360']);
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>(['studio', 'onlocation']);
  const [selectedEquips, setSelectedEquips] = useState<string[]>(['camera45', 'macro100', 'softbox']);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['highres', 'png']);
  const [selectedRetouching, setSelectedRetouching] = useState<string[]>(['basic', 'clipping']);

  const [formData, setFormData] = useState({
    title: {
      ar: 'التصميم الفوتوغرافي وتصوير المنتجات',
      en: 'Commercial Product Photography',
      fr: 'Photographie de produits commerciale',
      de: 'Kommerzielle Produktfotografie',
    },
    shortDesc: {
      ar: 'تصوير استوديو وفوتوغرافي عالي الدقة للمنتجات والأطعمة والعقارات',
      en: 'High resolution studio & product photography',
      fr: 'Photographie de studio haute résolution',
      de: 'Hochauflösende Studio- und Produktfotografie',
    },
    fullContent: {
      ar: 'خدمات تصوير احترافية شاملة في استوديوهاتنا أو موقع العميل مع معالجة ريتاتش وقص خلفيات.',
      en: 'Full professional photo shoot services with editing & background removal.',
      fr: 'Services de prise de vue professionnels avec retouche.',
      de: 'Professionelle Fotoaufnahmen mit Bearbeitung.',
    },
    photosFrom: 5,
    photosTo: 50,
    priceFrom: 150,
    priceTo: 1500,
    daysFrom: 2,
    daysTo: 7,
    unit: 'يوم',
    coverImage: '',
    sampleImages: [] as string[],
  });

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdCameraAlt className="text-venecos-gold text-3xl" />
            {tUi('pageTitle')}
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            {tUi('pageSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/dashboard/services`} className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backBtn')}
          </Link>
          <button type="button" onClick={() => savePackagesToDb(packages)} className="px-4 py-2 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
            {tUi('draftBtn')}
          </button>
          <button type="button" onClick={() => savePackagesToDb(packages)} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            {tUi('publishBtn')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Categories & Shooting Environment Chips */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdTune /> {tUi('photoTypesTitle')}
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">{tUi('availablePhotoTypes')}</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleItem(selectedCats, setSelectedCats, cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedCats.includes(cat.id)
                      ? 'bg-venecos-gold/20 text-venecos-gold border-venecos-gold shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedCats.includes(cat.id) ? '✓ ' : ''}{cat[locale as keyof typeof cat] || cat['en']}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">{tUi('shootingEnv')}</label>
            <div className="flex flex-wrap gap-2">
              {environments.map((env) => (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => toggleItem(selectedEnvs, setSelectedEnvs, env.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedEnvs.includes(env.id)
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedEnvs.includes(env.id) ? '✓ ' : ''}{env[locale as keyof typeof env] || env['en']}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Equipment & Retouching Tiers */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            ⚙️ {tUi('equipAndFormats')}
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">{tUi('cameraEquip')}</label>
            <div className="flex flex-wrap gap-2">
              {equipments.map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => toggleItem(selectedEquips, setSelectedEquips, eq.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedEquips.includes(eq.id)
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedEquips.includes(eq.id) ? '✓ ' : ''}{eq[locale as keyof typeof eq] || eq['en']}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">{tUi('retouchingLevels')}</label>
            <div className="flex flex-wrap gap-2">
              {retouchingTiers.map((ret) => (
                <button
                  key={ret.id}
                  type="button"
                  onClick={() => toggleItem(selectedRetouching, setSelectedRetouching, ret.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedRetouching.includes(ret.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedRetouching.includes(ret.id) ? '✓ ' : ''}{ret[locale as keyof typeof ret] || ret['en']}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">{tUi('deliveryFormats')}</label>
            <div className="flex flex-wrap gap-2">
              {deliverables.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleItem(selectedFormats, setSelectedFormats, d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedFormats.includes(d.id)
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedFormats.includes(d.id) ? '✓ ' : ''}{d[locale as keyof typeof d] || d['en']}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Photo Quantity Bounds */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3">
            💰 {tUi('pricingSectionTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">نطاق السعر (€)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.priceFrom}
                  onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-venecos-gold font-black text-sm"
                  placeholder="من"
                />
                <span className="text-white/40">—</span>
                <input
                  type="number"
                  value={formData.priceTo}
                  onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-venecos-gold font-black text-sm"
                  placeholder="إلى"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">عدد الصور المسلمة</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.photosFrom}
                  onChange={(e) => setFormData({ ...formData, photosFrom: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-sm"
                  placeholder="من"
                />
                <span className="text-white/40">—</span>
                <input
                  type="number"
                  value={formData.photosTo}
                  onChange={(e) => setFormData({ ...formData, photosTo: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-sm"
                  placeholder="إلى"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">فترة التسليم</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.daysFrom}
                  onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-purple-400 font-bold text-sm"
                  placeholder="من"
                />
                <span className="text-white/40">—</span>
                <input
                  type="number"
                  value={formData.daysTo}
                  onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-purple-400 font-bold text-sm"
                  placeholder="إلى"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Media Dropzone */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdPhotoLibrary /> عينات صور التصوير الفوتوغرافي (Cloudinary Uploader)
          </h3>
          <CloudinaryUploader
            label="إسقاط أو اختيار صورة غلاف جلسة التصوير"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Section 5: 4 Languages Tabbed Inputs */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
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
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {tUi('titleLabel')} ({activeLangTab.toUpperCase()}) *
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
                placeholder="Product Photography..."
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
                placeholder="Short description..."
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {tUi('fullContentLabel')} ({activeLangTab.toUpperCase()})
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
                placeholder="Full description..."
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="photography"
            packages={packages}
            onChange={setPackages}
            onSave={savePackagesToDb}
          />
        </div>

        {/* Sticky Bottom Bar */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {saveStatusMsg}</span>}</div>
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
