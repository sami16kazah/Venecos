'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Md3dRotation, MdArrowBack, MdCheckCircle, MdAdd, MdDelete, MdTune } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';
import { combineMultiLangSubServices } from '@/lib/i18nUtils';

// ... db3dPrintUi ...

const db3dPrintUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة الطباعة ثلاثية الأبعاد (3D Printing)',
    en: '3D Printing & Prototyping Management',
    fr: 'Gestion de l\'impression 3D & prototypage',
    de: '3D-Druck & Prototypenbau Verwaltung',
  },
  pageSubtitle: {
    ar: 'حاسبة الغرامات، رفع ملفات STL/OBJ، وخيارات المواد المتقدمة',
    en: 'Gram calculator, STL/OBJ uploads, and material options',
    fr: 'Calculateur au gramme, téléversement STL/OBJ et matériaux',
    de: 'Gramm-Rechner, STL/OBJ-Uploads und Materialoptionen',
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
    ar: 'الشرح التفصيلي للطباعة ثلاثية الأبعاد',
    en: 'Full Description & Technical Specs',
    fr: 'Description détaillée & spécifications',
    de: 'Vollständige Beschreibung & Spezifikationen',
  },
  materialsTitle: {
    ar: 'خامات ومواد الطباعة وسعر الغرام (€/g)',
    en: 'Filaments / Materials & Price per Gram (€/g)',
    fr: 'Matériaux & Prix au gramme (€/g)',
    de: 'Materialien & Preis pro Gramm (€/g)',
  },
  coverTitle: {
    ar: 'رفع غلاف المجسمات المطبوعة (Cloudinary)',
    en: 'Upload 3D Print Cover Image',
    fr: 'Téléverser l\'image de couverture 3D',
    de: '3D-Druck Titelbild hochladen',
  },
  stlTitle: {
    ar: 'رفع ملف نموذجي (.STL / .OBJ / .ZIP)',
    en: 'Sample 3D Model File (.STL / .OBJ)',
    fr: 'Fichier modèle 3D exemple (.STL / .OBJ)',
    de: 'Beispiel 3D-Modelldatei (.STL / .OBJ)',
  },
  savedSuccess: {
    ar: 'تم حفظ ونشر خدمة الطباعة 3D بنجاح',
    en: '3D Printing service saved & published successfully',
    fr: 'Service d\'impression 3D enregistré avec succès',
    de: '3D-Druckservice erfolgreich gespeichert',
  },
};

export default function ThreeDPrintServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => db3dPrintUi[key]?.[locale] || db3dPrintUi[key]?.['en'] || '';

  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: {
      ar: 'الطباعة ثلاثية الأبعاد (3D Printing)',
      en: '3D Printing & Prototyping',
      fr: 'Impression 3D & Prototypage',
      de: '3D-Druck & Prototypenbau',
    },
    shortDesc: {
      ar: 'طباعة نماذج ومجسمات بخامات PLA, PETG, ABS, وResin عالية الدقة',
      en: 'Precision 3D printing with PLA, PETG, ABS & Resin materials',
      fr: 'Impression 3D de précision en PLA, PETG, ABS et Résine',
      de: 'Präziser 3D-Druck mit PLA, PETG, ABS & Resin Materialien',
    },
    fullDesc: {
      ar: 'خدمة طباعة مجسمات هندسية ونماذج أولية بدقة تصل إلى 0.05 مم مع حاسبة غرامات تلقائية.',
      en: 'Engineering prototype & 3D object printing with precision up to 0.05mm and automatic gram calculator.',
      fr: 'Prototypage d\'ingénierie et impression 3D haute précision avec calculateur au gramme.',
      de: 'Ingenieur-Prototypenbau und 3D-Objektdruck mit bis zu 0,05 mm Präzision.',
    },
    sampleStlFile: '',
    coverImage: '',
  });

  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=3d-print');
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
          serviceKey: '3d-print',
          titles: formData.title,
          descriptions: formData.shortDesc,
          iconName: 'FaCube',
          iconType: 'react-icon',
          order: 11,
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

  const [materials, setMaterials] = useState([
    { name: 'PLA Standard', priceGram: 0.12 },
    { name: 'PETG Technical', priceGram: 0.18 },
    { name: 'ABS Heavy Duty', priceGram: 0.22 },
    { name: 'Resin Ultra High-Detail', priceGram: 0.35 },
  ]);

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: 'New Material', priceGram: 0.20 }]);
  };

  const handleRemoveMaterial = (idx: number) => {
    setMaterials(materials.filter((_, i) => i !== idx));
  };

  const handleMaterialChange = (idx: number, field: 'name' | 'priceGram', val: any) => {
    const updated = [...materials];
    (updated[idx] as any)[field] = field === 'priceGram' ? Number(val) : val;
    setMaterials(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <Md3dRotation />
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

        {/* Materials list */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
              <MdTune /> {tUi('materialsTitle')}
            </h3>
            <button
              type="button"
              onClick={handleAddMaterial}
              className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl font-bold hover:bg-red-500/30"
            >
              <MdAdd /> {isRtl ? 'إضافة مادة' : 'Add Material'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((mat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                <input
                  type="text"
                  value={mat.name}
                  onChange={(e) => handleMaterialChange(idx, 'name', e.target.value)}
                  className="flex-grow bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs font-bold"
                  placeholder="Material Name"
                />
                <div className="flex items-center gap-1 w-28">
                  <input
                    type="number"
                    step="0.01"
                    value={mat.priceGram}
                    onChange={(e) => handleMaterialChange(idx, 'priceGram', e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-venecos-gold text-center text-xs font-black"
                  />
                  <span className="text-[11px] text-white/50">€/g</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(idx)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('coverTitle')}</h3>
            <CloudinaryUploader
              label={isRtl ? 'إسقاط صورة غلاف الطباعة الـ 3D' : 'Drop 3D cover image here'}
              currentUrl={formData.coverImage}
              onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
            />
          </div>

          <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('stlTitle')}</h3>
            <CloudinaryUploader
              label={isRtl ? 'رفع ملف STL أو OBJ نموذج تجريبي' : 'Upload sample STL or OBJ file'}
              acceptTypes=".stl,.obj,.zip,.rar"
              mediaType="raw"
              currentUrl={formData.sampleStlFile}
              onUploadSuccess={(url) => setFormData({ ...formData, sampleStlFile: url })}
            />
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="3d-print"
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

