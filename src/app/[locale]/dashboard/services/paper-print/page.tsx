'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdPrint, MdArrowBack, MdCheckCircle, MdImage, MdAdd, MdDelete, MdTune, MdCalculate, MdLocalShipping, MdInfo } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

interface IPriceTier {
  qtyFrom: number;
  qtyTo: number;
  pricePerM2: number;
  minOrder: number;
}

const dbPaperUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة وتخصيص خدمات الطباعة الورقية',
    en: 'Paper Printing Services Management',
    fr: 'Gestion des services d\'impression papier',
    de: 'Papierdruckdienste-Verwaltung',
  },
  backBtn: {
    ar: 'رجوع للخدمات',
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
  langSectionTitle: {
    ar: '🌐 اسم المنتج والنصوص بالأربع لغات',
    en: '🌐 Product Name & Texts (4 Languages)',
    fr: '🌐 Nom du produit & Textes (4 langues)',
    de: '🌐 Produktname & Texte (4 Sprachen)',
  },
  nameLabel: {
    ar: 'اسم المنتج',
    en: 'Product Name',
    fr: 'Nom du produit',
    de: 'Produktname',
  },
  shortDescLabel: {
    ar: 'وصف مختصر',
    en: 'Short Description',
    fr: 'Courte description',
    de: 'Kurzbeschreibung',
  },
  fullDescLabel: {
    ar: 'الشرح التفصيلي والمواصفات',
    en: 'Full Specifications & Details',
    fr: 'Spécifications détaillées',
    de: 'Detaillierte Spezifikationen',
  },
  productImagesTitle: {
    ar: 'صور المنتج (Product Images) — الصورة الأولى تكون الغلاف',
    en: 'Product Images — First image is cover (max 7 photos)',
    fr: 'Images du produit — La première est la couverture (max 7)',
    de: 'Produktbilder — Erstes Bild ist das Titelbild (max 7 Fotos)',
  },
  dropzoneLabel: {
    ar: 'اسحب صور المنتج أو انقر للاختيار',
    en: 'Drag & drop product images or click to select',
    fr: 'Glissez des images ou cliquez pour sélectionner',
    de: 'Produktbilder hierhin ziehen oder klicken',
  },
  optionsTitle: {
    ar: 'خيارات المادة والشكل والإنهاء والاستخدام',
    en: 'Material, Shape, Finishing & Usage Options',
    fr: 'Options de matériau, forme, finition & usage',
    de: 'Material-, Form-, Veredelungs- & Nutzungsoptionen',
  },
  materialTypeLabel: {
    ar: 'نوع المادة',
    en: 'Material Type',
    fr: 'Type de matériau',
    de: 'Materialart',
  },
  shapeLabel: {
    ar: 'شكل الملصق / المنتج',
    en: 'Product / Sticker Shape',
    fr: 'Forme du produit / autocollant',
    de: 'Produkt- / Stickerform',
  },
  finishingLabel: {
    ar: 'التشطيب',
    en: 'Finishing Options',
    fr: 'Options de finition',
    de: 'Veredelung',
  },
  usageLabel: {
    ar: 'الاستخدام',
    en: 'Usage Environment',
    fr: 'Environnement d\'utilisation',
    de: 'Nutzung',
  },
  sizeBoundsTitle: {
    ar: 'حدود المقاس',
    en: 'Dimensions Range',
    fr: 'Plage de dimensions',
    de: 'Größenbereich',
  },
  minSizeLabel: {
    ar: 'الحد الأدنى للمقاس (cm)',
    en: 'Minimum Dimensions (cm)',
    fr: 'Dimensions minimales (cm)',
    de: 'Mindestgröße (cm)',
  },
  maxSizeLabel: {
    ar: 'الحد الأقصى للمقاس (cm)',
    en: 'Maximum Dimensions (cm)',
    fr: 'Dimensions maximales (cm)',
    de: 'Maximale Größe (cm)',
  },
  widthLabel: {
    ar: 'عرض (cm)',
    en: 'Width (cm)',
    fr: 'Largeur (cm)',
    de: 'Breite (cm)',
  },
  heightLabel: {
    ar: 'ارتفاع (cm)',
    en: 'Height (cm)',
    fr: 'Hauteur (cm)',
    de: 'Höhe (cm)',
  },
  tiersTitle: {
    ar: 'جدول الأسعار (شرائح الكمية)',
    en: 'Quantity Price Tiers (€/m²)',
    fr: 'Barème de prix par quantité (€/m²)',
    de: 'Preisstaffeln nach Menge (€/m²)',
  },
  tierInfoAlert: {
    ar: 'السعر النهائي = سعر المتر² لهذه الشريحة × (العرض × الارتفاع بالمتر²) × الكمية. مثال: شريحة 100 قطعة بـ 25€/m² — العميل يطلب 10×15cm = 37.50€',
    en: 'Final Price = Tier price/m² × (Width × Height in m²) × Quantity. e.g. 100 pcs tier @ €25/m² — 10×15cm order = €37.50',
    fr: 'Prix final = Prix au m² du palier × (Largeur × Hauteur en m²) × Quantité.',
    de: 'Endpreis = Staffelpreis pro m² × (Breite × Höhe in m²) × Menge.',
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
    ar: 'الكمية إلى',
    en: 'Quantity To',
    fr: 'Quantité jusqu\'à',
    de: 'Menge bis',
  },
  priceM2Col: {
    ar: 'سعر المتر² (€)',
    en: 'Price per m² (€)',
    fr: 'Prix au m² (€)',
    de: 'Preis pro m² (€)',
  },
  minOrderCol: {
    ar: 'الحد الأدنى للطلب (€)',
    en: 'Min Order (€)',
    fr: 'Commande min (€)',
    de: 'Mindestbestellung (€)',
  },
  deleteCol: {
    ar: 'حذف',
    en: 'Delete',
    fr: 'Supprimer',
    de: 'Löschen',
  },
  simTitle: {
    ar: 'محاكاة حساب السعر',
    en: 'Price Calculation Simulator',
    fr: 'Simulateur de calcul de prix',
    de: 'Preissimulations-Rechner',
  },
  quantityLabel: {
    ar: 'الكمية',
    en: 'Quantity',
    fr: 'Quantité',
    de: 'Menge',
  },
  shippingTitle: {
    ar: 'التوصيل',
    en: 'Shipping & Delivery',
    fr: 'Livraison & Expédition',
    de: 'Versand & Lieferung',
  },
  shipEULabel: {
    ar: '🇪🇺 داخل الاتحاد الأوروبي',
    en: '🇪🇺 Inside European Union (EU)',
    fr: '🇪🇺 Union Européenne (UE)',
    de: '🇪🇺 Innerhalb der EU',
  },
  shipWorldLabel: {
    ar: '🌐 خارج الاتحاد الأوروبي',
    en: '🌐 Worldwide (Non-EU)',
    fr: '🌐 International (Hors UE)',
    de: '🌐 Weltweit (Außerhalb der EU)',
  },
  shippingPriceLabel: {
    ar: 'سعر التوصيل (€)',
    en: 'Shipping Price (€)',
    fr: 'Frais de port (€)',
    de: 'Versandkosten (€)',
  },
  deliveryTimeLabel: {
    ar: 'فترة التسليم (أيام عمل)',
    en: 'Delivery Period (business days)',
    fr: 'Délai de livraison (jours)',
    de: 'Lieferzeitraum (Tage)',
  },
  noTierMsg: {
    ar: 'أضف شريحة سعر واحدة على الأقل',
    en: 'Add at least one price tier',
    fr: 'Ajoutez au moins un palier de prix',
    de: 'Mindestens eine Preisstaffel hinzufügen',
  },
  savedSuccess: {
    ar: 'تم حفظ ونشر خدمة الطباعة الورقية بنجاح',
    en: 'Paper print service saved & published successfully',
    fr: 'Service d\'impression papier enregistré avec succès',
    de: 'Papierdruckdienst erfolgreich gespeichert',
  },
};

export default function PaperPrintServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbPaperUi[key]?.[locale] || dbPaperUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');

  const materials = [
    { id: 'paper', ar: 'ورقي', en: 'Paper', fr: 'Papier', de: 'Papier' },
    { id: 'transparent', ar: 'شفاف (Transparent)', en: 'Transparent', fr: 'Transparent', de: 'Transparent' },
    { id: 'waterproof', ar: 'مقاوم للماء', en: 'Waterproof', fr: 'Étanche', de: 'Wasserfest' },
    { id: 'vinyl', ar: 'فينيل (Vinyl)', en: 'Vinyl', fr: 'Vinyle', de: 'Vinyl' },
    { id: 'kraft', ar: 'كرافت', en: 'Kraft', fr: 'Kraft', de: 'Kraftpapier' },
    { id: 'phosphor', ar: 'فوسفوري', en: 'Phosphorescent', fr: 'Phosphorescent', de: 'Phosphoreszierend' },
    { id: 'mirror', ar: 'مرآة (Mirror)', en: 'Mirror', fr: 'Miroir', de: 'Spiegel' },
    { id: 'oneway', ar: 'One Way Vision', en: 'One Way Vision', fr: 'One Way Vision', de: 'One-Way-Vision' },
  ];

  const shapes = [
    { id: 'square', ar: 'مربع / مستطيل', en: 'Square / Rectangle', fr: 'Carré / Rectangulaire', de: 'Quadratisch / Rechteckig' },
    { id: 'circle', ar: 'دائري / بيضاوي', en: 'Circle / Oval', fr: 'Cercle / Ovale', de: 'Kreis / Oval' },
    { id: 'diecut', ar: 'مقطوع حسب الشكل (Die Cut)', en: 'Die Cut', fr: 'Découpe sur forme', de: 'Stanzschnitt' },
    { id: 'kisscut', ar: 'Kiss Cut', en: 'Kiss Cut', fr: 'Kiss Cut', de: 'Kiss-Cut' },
    { id: 'custom', ar: 'مخصص', en: 'Custom', fr: 'Personnalisé', de: 'Individuell' },
  ];

  const finishes = [
    { id: 'matte', ar: 'مطفي (Matte)', en: 'Matte', fr: 'Mat', de: 'Matt' },
    { id: 'glossy', ar: 'لامع (Glossy)', en: 'Glossy', fr: 'Brillant', de: 'Glänzend' },
    { id: 'uv', ar: 'UV Spot', en: 'UV Spot', fr: 'Vernis UV', de: 'UV-Lack' },
    { id: 'nofinish', ar: 'بدون تشطيب', en: 'No Finishing', fr: 'Sans finition', de: 'Ohne Veredelung' },
  ];

  const usages = [
    { id: 'indoor', ar: 'داخلي', en: 'Indoor', fr: 'Intérieur', de: 'Innenbereich' },
    { id: 'outdoor', ar: 'خارجي', en: 'Outdoor', fr: 'Extérieur', de: 'Außenbereich' },
    { id: 'sun', ar: 'مقاوم للشمس', en: 'Sun Resistant', fr: 'Résistant au soleil', de: 'Sonnengeschützt' },
    { id: 'heat', ar: 'مقاوم للحرارة', en: 'Heat Resistant', fr: 'Résistant à la chaleur', de: 'Hitzebeständig' },
    { id: 'fridge', ar: 'للثلاجات', en: 'For Refrigerators', fr: 'Pour frigos', de: 'Für Kühlschränke' },
    { id: 'vehicles', ar: 'للسيارات', en: 'For Vehicles', fr: 'Pour véhicules', de: 'Für Fahrzeuge' },
  ];

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['paper', 'vinyl']);
  const [selectedShapes, setSelectedShapes] = useState<string[]>(['square', 'diecut']);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(['matte']);
  const [selectedUsages, setSelectedUsages] = useState<string[]>(['indoor']);

  const [priceTiers, setPriceTiers] = useState<IPriceTier[]>([
    { qtyFrom: 1, qtyTo: 50, pricePerM2: 35.00, minOrder: 15.00 },
    { qtyFrom: 51, qtyTo: 200, pricePerM2: 25.00, minOrder: 20.00 },
    { qtyFrom: 201, qtyTo: 0, pricePerM2: 18.00, minOrder: 30.00 },
  ]);

  const [simQty, setSimQty] = useState(100);
  const [simW, setSimW] = useState(10);
  const [simH, setSimH] = useState(15);

  const [formData, setFormData] = useState({
    nameAr: 'بطاقة عمل فاخرة',
    nameEn: 'Premium Business Card',
    nameFr: 'Carte de visite premium',
    nameDe: 'Premium Visitenkarte',

    descAr: 'وصف قصير يظهر في البطاقة...',
    descEn: 'Short description for the card...',
    descFr: 'Description courte...',
    descDe: 'Kurzbeschreibung...',

    fullAr: 'طباعة بطاقات عمل بورق 350 جرام مع سلفان مطفي وحواف دائرية.',
    fullEn: 'Premium business card printing on 350gsm paper with matte lamination.',
    fullFr: 'Impression de cartes de visite premium sur papier 350g avec pelliculage mat.',
    fullDe: 'Premium Visitenkartendruck auf 350g Papier mit matter Kaschierung.',

    minW: 2,
    minH: 2,
    maxW: 100,
    maxH: 100,

    shipEU: 4.99,
    shipEUFrom: 2,
    shipEUTo: 5,

    shipWorld: 9.99,
    shipWorldFrom: 5,
    shipWorldTo: 10,

    coverImage: '',
  });

  const toggleSelection = (list: string[], setList: (l: string[]) => void, id: string) => {
    if (list.includes(id)) {
      setList(list.filter(i => i !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleAddTier = () => {
    setPriceTiers([...priceTiers, { qtyFrom: 1, qtyTo: 0, pricePerM2: 20, minOrder: 10 }]);
  };

  const handleRemoveTier = (idx: number) => {
    setPriceTiers(priceTiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx: number, field: keyof IPriceTier, val: number) => {
    const updated = [...priceTiers];
    updated[idx][field] = val;
    setPriceTiers(updated);
  };

  const calculateSim = () => {
    const areaM2 = (simW / 100) * (simH / 100);
    const totalAreaM2 = areaM2 * simQty;
    const tier = priceTiers.find(t => simQty >= t.qtyFrom && (t.qtyTo === 0 || simQty <= t.qtyTo));
    if (!tier) return { price: 0, detail: tUi('noTierMsg') };
    const calcPrice = Math.max(tier.minOrder, totalAreaM2 * tier.pricePerM2);
    return { price: calcPrice, detail: `€${tier.pricePerM2}/m² × ${totalAreaM2.toFixed(3)}m²` };
  };

  const simResult = calculateSim();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: 'paper-print',
          locale,
          title: formData.nameEn || formData.nameAr || 'Paper Printing Services',
          description: formData.descEn || formData.descAr || 'High quality custom paper printing services',
          iconName: 'FaPrint',
          iconType: 'react-icon',
          order: 5,
          isSpecial: true,
          subServices: priceTiers.map((t, idx) => ({
            title: `Tier ${idx + 1}: ${t.qtyFrom} - ${t.qtyTo === 0 ? 'Unlimited' : t.qtyTo} units`,
            description: `€${t.pricePerM2}/m² (Min Order: €${t.minOrder})`,
            price: t.pricePerM2
          }))
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
          <MdPrint className="text-venecos-gold text-3xl" />
          {tUi('pageTitle')}
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/dashboard/services`} className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backBtn')}
          </Link>
          <button type="button" onClick={handleSave} className="px-4 py-2 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
            {tUi('draftBtn')}
          </button>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            {tUi('publishBtn')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: 4 Languages Grid */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            {tUi('langSectionTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic */}
            <div className="bg-white/5 border border-venecos-gold/30 rounded-2xl p-5 space-y-4">
              <div className="bg-venecos-gold/20 border border-venecos-gold/40 text-venecos-gold px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇸🇦 العربية (AR)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('nameLabel')} *</label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: بطاقة عمل فاخرة"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('shortDescLabel')}</label>
                <textarea
                  rows={2}
                  value={formData.descAr}
                  onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                  placeholder="وصف قصير..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('fullDescLabel')}</label>
                <textarea
                  rows={3}
                  value={formData.fullAr}
                  onChange={(e) => setFormData({ ...formData, fullAr: e.target.value })}
                  placeholder="الشرح التفصيلي..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
                />
              </div>
            </div>

            {/* English */}
            <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇬🇧 English (EN)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Premium Business Card"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  placeholder="Short description..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Full Specifications</label>
                <textarea
                  rows={3}
                  value={formData.fullEn}
                  onChange={(e) => setFormData({ ...formData, fullEn: e.target.value })}
                  placeholder="Full specifications..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* French */}
            <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇫🇷 Français (FR)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Nom du produit *</label>
                <input
                  type="text"
                  value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  placeholder="ex: Carte de visite premium"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Description courte</label>
                <textarea
                  rows={2}
                  value={formData.descFr}
                  onChange={(e) => setFormData({ ...formData, descFr: e.target.value })}
                  placeholder="Description courte..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Spécifications détaillées</label>
                <textarea
                  rows={3}
                  value={formData.fullFr}
                  onChange={(e) => setFormData({ ...formData, fullFr: e.target.value })}
                  placeholder="Spécifications détaillées..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* German */}
            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇩🇪 Deutsch (DE)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Produktname *</label>
                <input
                  type="text"
                  value={formData.nameDe}
                  onChange={(e) => setFormData({ ...formData, nameDe: e.target.value })}
                  placeholder="z.B. Premium Visitenkarte"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Kurzbeschreibung</label>
                <textarea
                  rows={2}
                  value={formData.descDe}
                  onChange={(e) => setFormData({ ...formData, descDe: e.target.value })}
                  placeholder="Kurzbeschreibung..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Detaillierte Spezifikationen</label>
                <textarea
                  rows={3}
                  value={formData.fullDe}
                  onChange={(e) => setFormData({ ...formData, fullDe: e.target.value })}
                  placeholder="Detaillierte Spezifikationen..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Product Images Dropzone */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdImage /> {tUi('productImagesTitle')}
          </h3>
          <CloudinaryUploader
            label={tUi('dropzoneLabel')}
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Section 3: Material, Shape, Finishing & Usage Options */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdTune /> {tUi('optionsTitle')}
          </h3>

          {/* Material Type */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">{tUi('materialTypeLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {materials.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleSelection(selectedMaterials, setSelectedMaterials, m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedMaterials.includes(m.id)
                      ? 'bg-venecos-gold/20 text-venecos-gold border-venecos-gold shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedMaterials.includes(m.id) ? '✓ ' : ''}{m[locale as keyof typeof m] || m['en']}
                </button>
              ))}
            </div>
          </div>

          {/* Shape */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">{tUi('shapeLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSelection(selectedShapes, setSelectedShapes, s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedShapes.includes(s.id)
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedShapes.includes(s.id) ? '✓ ' : ''}{s[locale as keyof typeof s] || s['en']}
                </button>
              ))}
            </div>
          </div>

          {/* Finishing */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">{tUi('finishingLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleSelection(selectedFinishes, setSelectedFinishes, f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedFinishes.includes(f.id)
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedFinishes.includes(f.id) ? '✓ ' : ''}{f[locale as keyof typeof f] || f['en']}
                </button>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">{tUi('usageLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {usages.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleSelection(selectedUsages, setSelectedUsages, u.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedUsages.includes(u.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedUsages.includes(u.id) ? '✓ ' : ''}{u[locale as keyof typeof u] || u['en']}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Size Bounds */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3">{tUi('sizeBoundsTitle')}</h3>
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

        {/* Section 5: Quantity Price Tiers Table */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('tiersTitle')}</h3>
            <button type="button" onClick={handleAddTier} className="flex items-center gap-1 text-xs bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-3 py-1.5 rounded-xl font-bold hover:bg-venecos-gold/30">
              <MdAdd /> {tUi('addTierBtn')}
            </button>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <MdInfo className="text-lg flex-shrink-0" />
            <span>{tUi('tierInfoAlert')}</span>
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

        {/* Section 6: Live Simulation Calculator */}
        <div className="bg-venecos-black/80 border border-venecos-gold/30 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdCalculate /> {tUi('simTitle')}
          </h3>
          <div className="flex flex-wrap items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('quantityLabel')}</label>
              <input type="number" value={simQty} onChange={(e) => setSimQty(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-blue-400 text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('widthLabel')}</label>
              <input type="number" value={simW} onChange={(e) => setSimW(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-white text-sm" />
            </div>
            <span className="text-white/40 font-bold pb-2">×</span>
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('heightLabel')}</label>
              <input type="number" value={simH} onChange={(e) => setSimH(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-white text-sm" />
            </div>
            <span className="text-white/40 font-bold pb-2">=</span>
            <div className="bg-venecos-gold/10 border border-venecos-gold/40 px-6 py-2 rounded-xl text-center">
              <div className="text-2xl font-black text-venecos-gold font-mono">€{simResult.price.toFixed(2)}</div>
              <div className="text-[10px] text-white/60 mt-0.5">{simResult.detail}</div>
            </div>
          </div>
        </div>

        {/* Section 7: Shipping Rates */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
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

        {/* Sticky Bottom Bar */}
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
