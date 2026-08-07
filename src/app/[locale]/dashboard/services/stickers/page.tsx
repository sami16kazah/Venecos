'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdLabel, MdArrowBack, MdAdd, MdDelete, MdCheckCircle, MdCalculate, MdLocalShipping, MdTune, MdEuro } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';

// ... interface IPriceTier ...

interface IPriceTier {
  qtyFrom: number;
  qtyTo: number;
  pricePerM2: number;
  minOrder: number;
}

const dbStickersUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة طباعة الملصقات وتسميات المنتجات',
    en: 'Stickers & Product Label Printing Management',
    fr: 'Gestion de l\'impression d\'autocollants & étiquettes',
    de: 'Sticker- & Etikettendruckverwaltung',
  },
  pageSubtitle: {
    ar: 'شرائح الأسعار، المواد، وحاسبة المساحة m²',
    en: 'Price tiers, materials, and m² area calculator',
    fr: 'Grille tarifaire, matériaux et calculateur de surface m²',
    de: 'Preisstaffeln, Materialien und m² Flächenrechner',
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
    ar: 'الشرح التفصيلي للملصقات والمواصفات',
    en: 'Full Description & Specifications',
    fr: 'Description détaillée & spécifications',
    de: 'Vollständige Beschreibung & Spezifikationen',
  },
  simTitle: {
    ar: 'محاكاة حساب السعر المباشر (Legacy Simulator)',
    en: 'Live Price Calculation Simulator',
    fr: 'Simulateur de calcul de prix en direct',
    de: 'Live-Preissimulationsrechner',
  },
  mediaTitle: {
    ar: 'صور غلاف وعينات ملصقات المنتجات (Cloudinary Uploader)',
    en: 'Cover Image & Product Sticker Samples (Cloudinary Uploader)',
    fr: 'Image de couverture et échantillons d\'autocollants',
    de: 'Titelbild und Etikettenbeispiele',
  },
  dropCoverLabel: {
    ar: 'إسقاط صورة غلاف الملصق',
    en: 'Drop sticker cover image here',
    fr: 'Déposer l\'image de couverture ici',
    de: 'Sticker-Titelbild hier ablegen',
  },
  optionsTitle: {
    ar: 'خيارات المواد والشكل والإنهاء',
    en: 'Material, Shape & Finishing Options',
    fr: 'Options de matériau, forme et finition',
    de: 'Material-, Form- und Veredelungsoptionen',
  },
  materialTypeLabel: {
    ar: 'نوع المادة (Material Type)',
    en: 'Material Type',
    fr: 'Type de matériau',
    de: 'Materialart',
  },
  shapeLabel: {
    ar: 'شكل الملصق (Sticker Shape)',
    en: 'Sticker Shape',
    fr: 'Forme de l\'autocollant',
    de: 'Stickerform',
  },
  sizeBoundsTitle: {
    ar: 'حدود المقاس بالسنتمتر (cm)',
    en: 'Dimensions Range (cm)',
    fr: 'Plage de dimensions (cm)',
    de: 'Größenbereich (cm)',
  },
  minSizeLabel: {
    ar: 'الحد الأدنى للمقاس (Min Size cm)',
    en: 'Minimum Dimensions (Min Size cm)',
    fr: 'Dimensions minimales (cm)',
    de: 'Mindestgröße (cm)',
  },
  maxSizeLabel: {
    ar: 'الحد الأقصى للمقاس (Max Size cm)',
    en: 'Maximum Dimensions (Max Size cm)',
    fr: 'Dimensions maximales (cm)',
    de: 'Maximale Größe (cm)',
  },
  widthLabel: {
    ar: 'عرض',
    en: 'Width',
    fr: 'Largeur',
    de: 'Breite',
  },
  heightLabel: {
    ar: 'ارتفاع',
    en: 'Height',
    fr: 'Hauteur',
    de: 'Höhe',
  },
  tiersTitle: {
    ar: 'جدول الأسعار حسب شرائح الكميات (€/m²)',
    en: 'Quantity Price Tiers (€/m²)',
    fr: 'Barème de prix par quantité (€/m²)',
    de: 'Preisstaffeln nach Menge (€/m²)',
  },
  addTierBtn: {
    ar: 'إضافة شريحة',
    en: 'Add Tier',
    fr: 'Ajouter un palier',
    de: 'Staffel hinzufügen',
  },
  qtyFromCol: {
    ar: 'الكمية من',
    en: 'Quantity From',
    fr: 'Quantité de',
    de: 'Menge ab',
  },
  qtyToCol: {
    ar: 'الكمية إلى (0 = بلا حد)',
    en: 'Quantity To (0 = no limit)',
    fr: 'Quantité jusqu\'à (0 = illimité)',
    de: 'Menge bis (0 = unbegrenzt)',
  },
  priceM2Col: {
    ar: 'سعر المتر² (€/m²)',
    en: 'Price per m² (€/m²)',
    fr: 'Prix au m² (€/m²)',
    de: 'Preis pro m² (€/m²)',
  },
  minOrderCol: {
    ar: 'الحد الأدنى للطلب (€)',
    en: 'Minimum Order (€)',
    fr: 'Commande minimum (€)',
    de: 'Mindestbestellung (€)',
  },
  deleteCol: {
    ar: 'حذف',
    en: 'Delete',
    fr: 'Supprimer',
    de: 'Löschen',
  },
  quantityLabel: {
    ar: 'الكمية',
    en: 'Quantity',
    fr: 'Quantité',
    de: 'Menge',
  },
  shippingTitle: {
    ar: 'أسعار ومواعيد الشحن والتوصيل',
    en: 'Shipping Rates & Delivery Timeframes',
    fr: 'Frais d\'expédition & Délais de livraison',
    de: 'Versandkosten & Lieferzeiten',
  },
  shipEULabel: {
    ar: '🇪🇺 داخل الاتحاد الأوروبي',
    en: '🇪🇺 Inside European Union (EU)',
    fr: '🇪🇺 Union Européenne (UE)',
    de: '🇪🇺 Innerhalb der Europäischen Union (EU)',
  },
  shipWorldLabel: {
    ar: '🌐 خارج الاتحاد الأوروبي',
    en: '🌐 Worldwide (Non-EU)',
    fr: '🌐 International (Hors UE)',
    de: '🌐 Weltweit (Außerhalb der EU)',
  },
  shippingPriceLabel: {
    ar: 'سعر الشحن (€)',
    en: 'Shipping Price (€)',
    fr: 'Frais de port (€)',
    de: 'Versandpreis (€)',
  },
  deliveryTimeLabel: {
    ar: 'فترة التسليم (أيام)',
    en: 'Delivery Timeframe (days)',
    fr: 'Délai de livraison (jours)',
    de: 'Lieferzeitraum (Tage)',
  },
  savedSuccess: {
    ar: 'تم حفظ ونشر خدمة الملصقات بنجاح',
    en: 'Stickers service saved & published successfully',
    fr: 'Service d\'autocollants enregistré avec succès',
    de: 'Stickerservice erfolgreich gespeichert',
  },
};

export default function StickersServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbStickersUi[key]?.[locale] || dbStickersUi[key]?.['en'] || '';

  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [saved, setSaved] = useState(false);
  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=stickers');
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
          serviceKey: 'stickers',
          titles: formData.title,
          descriptions: formData.shortDesc,
          iconName: 'FaTags',
          iconType: 'react-icon',
          order: 6,
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

  const [materials, setMaterials] = useState<string[]>(['Vinyl فينيل مقاوم للماء', 'Paper Glossy ورقي لامع', 'Transparent شفاف', 'Metallic Foil ذهبي/فضائي']);
  const [shapes, setShapes] = useState<string[]>(['دائري (Circle)', 'مربع (Square)', 'قص مخصص (Die-Cut)', 'بيضاوي (Oval)']);
  const [finishes, setFinishes] = useState<string[]>(['سلفان مطفي (Matte)', 'سلفان لامع (Glossy)', 'UV Spot لامي', 'Foil Stamping ذهبي']);
  
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Vinyl فينيل مقاوم للماء', 'Paper Glossy ورقي لامع']);
  const [selectedShapes, setSelectedShapes] = useState<string[]>(['دائري (Circle)', 'قص مخصص (Die-Cut)']);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(['سلفان مطفي (Matte)']);

  const [formData, setFormData] = useState({
    title: { ar: 'طباعة الملصقات وتسميات المنتجات', en: 'Sticker Labels & Custom Die-Cut', fr: 'Autocollants sur mesure', de: 'Sticker & Etiketten' },
    shortDesc: { ar: 'ملصقات عالية الجودة بأشكال ومواد متنوعة للمنتجات والتغليف', en: 'High quality stickers for products & packaging', fr: 'Autocollants haute qualité', de: 'Hochwertige Sticker' },
    fullDesc: { ar: 'طباعة وفصل ملصقات مخصصة مقاومة للماء مع قص ليزر دقيق وباقات كمية مرنة.', en: 'Waterproof custom sticker printing with precision die-cut.', fr: 'Impression autocollants étanches avec découpe sur mesure.', de: 'Wasserdichter Stickerdruck mit Präzisionsstanzung.' },
    minW: 2,
    minH: 2,
    maxW: 100,
    maxH: 100,
    coverImage: '',
    galleryImages: [] as string[],
    shipEU: 4.99,
    shipEUFrom: 2,
    shipEUTo: 5,
    shipWorld: 9.99,
    shipWorldFrom: 5,
    shipWorldTo: 10,
  });

  const [priceTiers, setPriceTiers] = useState<IPriceTier[]>([
    { qtyFrom: 1, qtyTo: 99, pricePerM2: 30.00, minOrder: 15.00 },
    { qtyFrom: 100, qtyTo: 499, pricePerM2: 24.00, minOrder: 20.00 },
    { qtyFrom: 500, qtyTo: 999, pricePerM2: 18.00, minOrder: 30.00 },
    { qtyFrom: 1000, qtyTo: 0, pricePerM2: 12.00, minOrder: 50.00 },
  ]);

  // Simulation Calculator State
  const [simQty, setSimQty] = useState<number>(100);
  const [simW, setSimW] = useState<number>(10);
  const [simH, setSimH] = useState<number>(15);

  const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddTier = () => {
    const last = priceTiers[priceTiers.length - 1];
    const newFrom = last ? (last.qtyTo ? last.qtyTo + 1 : 1000) : 1;
    setPriceTiers([...priceTiers, { qtyFrom: newFrom, qtyTo: newFrom + 499, pricePerM2: 15.00, minOrder: 25.00 }]);
  };

  const handleRemoveTier = (idx: number) => {
    setPriceTiers(priceTiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx: number, field: keyof IPriceTier, value: number) => {
    const updated = [...priceTiers];
    updated[idx][field] = value;
    setPriceTiers(updated);
  };

  const calculateSimPrice = () => {
    if (!simQty || !simW || !simH || !priceTiers.length) return { price: 0, detail: isRtl ? 'أدخل البيانات والحجم' : 'Enter dimensions & quantity' };
    const tier = priceTiers.find(t => simQty >= t.qtyFrom && (t.qtyTo === 0 || simQty <= t.qtyTo));
    if (!tier) return { price: 0, detail: isRtl ? 'الكمية خارج نطاق الشرائح' : 'Quantity out of bounds' };

    const m2 = (simW * simH) / 10000;
    const raw = tier.pricePerM2 * m2 * simQty;
    const final = Math.max(raw, tier.minOrder);
    return {
      price: Math.round(final * 100) / 100,
      detail: `${tier.pricePerM2}€/m² × ${m2.toFixed(4)}m² × ${simQty} pcs${final > raw ? ' (min)' : ''}`
    };
  };

  const simResult = calculateSimPrice();

  // ...

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdLabel />
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
        {/* Multilingual Text (4 Simultaneous Forms) */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
              🌐 Service Text & Description (4 Languages Forms)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['ar', 'en', 'fr', 'de'] as const).map((langKey) => {
              const langNames = {
                ar: '🇸🇦 العربية (AR)',
                en: '🇬🇧 English (EN)',
                fr: '🇫🇷 Français (FR)',
                de: '🇩🇪 Deutsch (DE)',
              };

              const borderColor = langKey === 'ar' ? 'border-amber-500/30' : langKey === 'en' ? 'border-blue-500/30' : langKey === 'fr' ? 'border-emerald-500/30' : 'border-purple-500/30';
              const badgeColor = langKey === 'ar' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : langKey === 'en' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : langKey === 'fr' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-purple-500/20 text-purple-400 border-purple-500/40';

              return (
                <div key={langKey} className={`bg-[#202127] border ${borderColor} rounded-2xl p-4 space-y-3`} dir={langKey === 'ar' ? 'rtl' : 'ltr'}>
                  <div className={`${badgeColor} border px-3 py-1 rounded-full text-xs font-bold inline-block`}>
                    {langNames[langKey]}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {tUi('titleLabel')} ({langKey.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.title[langKey] || ''}
                      onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [langKey]: e.target.value } })}
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-venecos-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {tUi('shortDescLabel')} ({langKey.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDesc[langKey] || ''}
                      onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, [langKey]: e.target.value } })}
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-venecos-gold resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {tUi('fullDescLabel')} ({langKey.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={formData.fullDesc[langKey] || ''}
                      onChange={(e) => setFormData({ ...formData, fullDesc: { ...formData.fullDesc, [langKey]: e.target.value } })}
                      className="w-full bg-[#141519] border border-white/15 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-venecos-gold resize-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Media Dropzone */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('mediaTitle')}</h3>
          <CloudinaryUploader
            label={tUi('dropCoverLabel')}
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Material, Shape & Finish Options */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdTune /> {tUi('optionsTitle')}
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">{tUi('materialTypeLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {materials.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleSelection(selectedMaterials, setSelectedMaterials, m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedMaterials.includes(m)
                      ? 'bg-venecos-gold/20 text-venecos-gold border-venecos-gold shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedMaterials.includes(m) ? '✓ ' : ''}{m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">{tUi('shapeLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {shapes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSelection(selectedShapes, setSelectedShapes, s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedShapes.includes(s)
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedShapes.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Size Bounds */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('sizeBoundsTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="block text-xs font-bold text-red-400">{tUi('minSizeLabel')}</span>
              <div className="flex items-center gap-2">
                <input type="number" value={formData.minW} onChange={(e) => setFormData({ ...formData, minW: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center" placeholder={tUi('widthLabel')} />
                <span className="text-white/40">×</span>
                <input type="number" value={formData.minH} onChange={(e) => setFormData({ ...formData, minH: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center" placeholder={tUi('heightLabel')} />
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="block text-xs font-bold text-emerald-400">{tUi('maxSizeLabel')}</span>
              <div className="flex items-center gap-2">
                <input type="number" value={formData.maxW} onChange={(e) => setFormData({ ...formData, maxW: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center" placeholder={tUi('widthLabel')} />
                <span className="text-white/40">×</span>
                <input type="number" value={formData.maxH} onChange={(e) => setFormData({ ...formData, maxH: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center" placeholder={tUi('heightLabel')} />
              </div>
            </div>
          </div>
        </div>

        {/* Quantity × Price/m² Table */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('tiersTitle')}</h3>
            <button type="button" onClick={handleAddTier} className="flex items-center gap-1 text-xs bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-3 py-1.5 rounded-xl font-bold hover:bg-venecos-gold/30">
              <MdAdd /> {tUi('addTierBtn')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-white">
              <thead className="bg-white/5 border-b border-white/10 text-white/60 font-bold">
                <tr>
                  <th className="p-3">{tUi('qtyFromCol')}</th>
                  <th className="p-3">{tUi('qtyToCol')}</th>
                  <th className="p-3">{tUi('priceM2Col')}</th>
                  <th className="p-3">{tUi('minOrderCol')}</th>
                  <th className="p-3 text-center">{tUi('deleteCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {priceTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="p-2">
                      <input type="number" value={tier.qtyFrom} onChange={(e) => handleTierChange(idx, 'qtyFrom', Number(e.target.value))} className="w-24 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={tier.qtyTo} onChange={(e) => handleTierChange(idx, 'qtyTo', Number(e.target.value))} className="w-24 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <input type="number" step="0.01" value={tier.pricePerM2} onChange={(e) => handleTierChange(idx, 'pricePerM2', Number(e.target.value))} className="w-28 bg-white/5 border border-venecos-gold/30 text-venecos-gold rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <input type="number" step="0.01" value={tier.minOrder} onChange={(e) => handleTierChange(idx, 'minOrder', Number(e.target.value))} className="w-28 bg-white/5 border border-white/15 text-blue-400 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2 text-center">
                      <button type="button" onClick={() => handleRemoveTier(idx)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Simulation Calculator */}
        <div className="bg-venecos-black/70 border border-venecos-gold/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdCalculate /> {tUi('simTitle')}
          </h3>
          <div className="flex flex-wrap items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('quantityLabel')}</label>
              <input type="number" value={simQty} onChange={(e) => setSimQty(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-blue-400 text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('widthLabel')} (cm)</label>
              <input type="number" value={simW} onChange={(e) => setSimW(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-white text-sm" />
            </div>
            <span className="text-white/40 font-bold pb-2">×</span>
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('heightLabel')} (cm)</label>
              <input type="number" value={simH} onChange={(e) => setSimH(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-white text-sm" />
            </div>
            <span className="text-white/40 font-bold pb-2">=</span>
            <div className="bg-venecos-gold/10 border border-venecos-gold/40 px-6 py-2 rounded-xl text-center">
              <div className="text-2xl font-black text-venecos-gold font-mono">€{simResult.price.toFixed(2)}</div>
              <div className="text-[10px] text-white/60 mt-0.5">{simResult.detail}</div>
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdLocalShipping /> {tUi('shippingTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl space-y-3">
              <span className="block text-xs font-bold text-blue-400">{tUi('shipEULabel')}</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">{tUi('shippingPriceLabel')}</label>
                  <input type="number" step="0.01" value={formData.shipEU} onChange={(e) => setFormData({ ...formData, shipEU: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white font-bold text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">{tUi('deliveryTimeLabel')}</label>
                  <div className="flex items-center gap-1">
                    <input type="number" value={formData.shipEUFrom} onChange={(e) => setFormData({ ...formData, shipEUFrom: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-center text-xs" />
                    <span className="text-white/40">-</span>
                    <input type="number" value={formData.shipEUTo} onChange={(e) => setFormData({ ...formData, shipEUTo: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-center text-xs" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl space-y-3">
              <span className="block text-xs font-bold text-venecos-gold">{tUi('shipWorldLabel')}</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">{tUi('shippingPriceLabel')}</label>
                  <input type="number" step="0.01" value={formData.shipWorld} onChange={(e) => setFormData({ ...formData, shipWorld: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white font-bold text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">{tUi('deliveryTimeLabel')}</label>
                  <div className="flex items-center gap-1">
                    <input type="number" value={formData.shipWorldFrom} onChange={(e) => setFormData({ ...formData, shipWorldFrom: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-center text-xs" />
                    <span className="text-white/40">-</span>
                    <input type="number" value={formData.shipWorldTo} onChange={(e) => setFormData({ ...formData, shipWorldTo: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-center text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="stickers"
            packages={packages}
            onChange={setPackages}
            onSave={savePackagesToDb}
          />
        </div>

        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {tUi('savedSuccess')}</span>}</div>
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/dashboard/services`} className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              {tUi('backBtn')}
            </Link>
            <button type="button" onClick={() => setSaved(true)} className="px-5 py-2.5 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
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
