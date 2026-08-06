'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdMic, MdArrowBack, MdCheckCircle, MdAudioFile, MdSave, MdPerson, MdChildCare, MdAdd, MdDelete } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';

// ... dbVoiceUi ...

interface IAudioSample {
  id: number;
  name: string;
  url: string;
}

interface IPriceTier {
  wordsFrom: number;
  wordsTo: number;
  priceFrom: number;
  priceTo: number;
  daysFrom: number;
  daysTo: number;
  daysUnit: string;
}

const dbVoiceUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة التعليق الصوتي والمعلقين',
    en: 'Voiceover & Narrator Management',
    fr: 'Gestion de la voix off & narrateurs',
    de: 'Sprecher- & Voiceover-Verwaltung',
  },
  pageSubtitle: {
    ar: 'كل معلق عرض مستقل بعينات صوتية وجدول أسعار خاص',
    en: 'Individual narrator showcase with audio samples & pricing table',
    fr: 'Profil narrateur avec échantillons audio & grille tarifaire',
    de: 'Sprecherprofil mit Hörproben & Preisstaffel',
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
  voiceTypeTitle: {
    ar: 'نوع الصوت',
    en: 'Voice Gender / Type',
    fr: 'Type de voix',
    de: 'Stimmtyp',
  },
  maleVoice: {
    ar: 'صوت رجل',
    en: 'Male Voice',
    fr: 'Voix homme',
    de: 'Männerstimme',
  },
  femaleVoice: {
    ar: 'صوت امرأة',
    en: 'Female Voice',
    fr: 'Voix femme',
    de: 'Frauenstimme',
  },
  childVoice: {
    ar: 'صوت طفل',
    en: 'Child Voice',
    fr: 'Voix enfant',
    de: 'Kinderstimme',
  },
  multiLangTitle: {
    ar: '🌐 العنوان والنصوص بالأربع لغات',
    en: '🌐 Title & Description (4 Languages)',
    fr: '🌐 Titre & Descriptions (4 langues)',
    de: '🌐 Titel & Beschreibungen (4 Sprachen)',
  },
  samplesTitle: {
    ar: 'العينات الصوتية للمعلق',
    en: 'Narrator Audio Samples',
    fr: 'Échantillons audio du narrateur',
    de: 'Sprecher-Hörproben',
  },
  pricingTitle: {
    ar: 'جدول الأسعار (حسب عدد الكلمات وفترة التسليم)',
    en: 'Pricing Table (by Word Count & Delivery)',
    fr: 'Grille tarifaire (par nombre de mots)',
    de: 'Preisstaffel (nach Wortanzahl & Lieferzeit)',
  },
  addSampleBtn: {
    ar: 'إضافة عينة',
    en: 'Add Sample',
    fr: 'Ajouter échantillon',
    de: 'Probe hinzufügen',
  },
  addTierBtn: {
    ar: 'إضافة شريحة',
    en: 'Add Tier',
    fr: 'Ajouter palier',
    de: 'Staffel hinzufügen',
  },
  audioSamplesTitle: {
    ar: 'العينات الصوتية (max 7 عينات)',
    en: 'Audio Samples (max 7 samples)',
    fr: 'Échantillons audio (max 7)',
    de: 'Hörproben (max 7 Proben)',
  },
  sampleNameLabel: {
    ar: 'اسم العينة (مثال: فصحى — إعلان تجاري)',
    en: 'Sample Name (e.g. Classical Arabic - Commercial)',
    fr: 'Nom de l\'échantillon (ex: Arabe classique - Publicité)',
    de: 'Stichwort (z.B. Klassisches Arabisch - Werbung)',
  },
  uploadAudioLabel: {
    ar: 'رفع الملف الصوتي (MP3/WAV)',
    en: 'Upload Audio File (MP3/WAV)',
    fr: 'Téléverser le fichier audio (MP3/WAV)',
    de: 'Audiodatei hochladen (MP3/WAV)',
  },
  wordsFrom: {
    ar: 'الكلمات من',
    en: 'Words From',
    fr: 'Mots de',
    de: 'Wörter von',
  },
  wordsTo: {
    ar: 'الكلمات إلى',
    en: 'Words To',
    fr: 'Mots jusqu\'à',
    de: 'Wörter bis',
  },
  priceRange: {
    ar: 'السعر (€) من — إلى',
    en: 'Price (€) From — To',
    fr: 'Prix (€) De — À',
    de: 'Preis (€) Von — Bis',
  },
  deliveryTime: {
    ar: 'فترة التسليم',
    en: 'Delivery Time',
    fr: 'Délai de livraison',
    de: 'Lieferzeit',
  },
  deleteCol: {
    ar: 'حذف',
    en: 'Delete',
    fr: 'Supprimer',
    de: 'Löschen',
  },
  savedSuccess: {
    ar: 'تم الحفظ بنجاح',
    en: 'Saved successfully',
    fr: 'Enregistré avec succès',
    de: 'Erfolgreich gespeichert',
  },
};

export default function VoiceOverServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbVoiceUi[key]?.[locale] || dbVoiceUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=voiceover');
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
          serviceKey: 'voiceover',
          titles: {
            ar: 'التعليق الصوتي والهندسة الصوتية',
            en: 'Voiceover & Audio Engineering',
            fr: 'Voix off & ingénierie sonore',
            de: 'Voiceover & Tontechnik',
          },
          descriptions: {
            ar: 'تسجيل تعليق صوتي احترافي بأصوات وإسكتشات متنوعة',
            en: 'Professional voiceover recording & sound design',
            fr: 'Enregistrement de voix off professionnelle et design sonore',
            de: 'Professionelle Voiceover-Aufnahmen und Sounddesign',
          },
          iconName: 'FaMicrophone',
          iconType: 'react-icon',
          order: 8,
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

  const [selectedVoiceTypes, setSelectedVoiceTypes] = useState<string[]>(['male']);

  const [formData, setFormData] = useState({
    titleAr: 'معلق بصوت رجل فصيح',
    titleEn: 'Male Voiceover Artist',
    titleFr: 'Rédacteur vocal homme',
    titleDe: 'Männlicher Sprecher',

    shortAr: 'وصف مختصر المعلق...',
    shortEn: 'Short description...',
    shortFr: 'Description courte...',
    shortDe: 'Kurzbeschreibung...',

    fullAr: 'شرح تفصيلي عن المعلق وخبراته وأسلوبه...',
    fullEn: 'Detailed description about narrator skills...',
    fullFr: 'Description détaillée...',
    fullDe: 'Detaillierte Beschreibung...',
  });

  const [audioSamples, setAudioSamples] = useState<IAudioSample[]>([
    { id: 1, name: 'عينة فصحى إعلانية', url: '' },
    { id: 2, name: 'عينة وثائقية سينمائية', url: '' },
  ]);

  const [priceTiers, setPriceTiers] = useState<IPriceTier[]>([
    { wordsFrom: 1, wordsTo: 100, priceFrom: 15, priceTo: 30, daysFrom: 1, daysTo: 2, daysUnit: 'يوم' },
    { wordsFrom: 101, wordsTo: 500, priceFrom: 35, priceTo: 70, daysFrom: 2, daysTo: 4, daysUnit: 'يوم' },
  ]);

  const toggleVoiceType = (type: string) => {
    if (selectedVoiceTypes.includes(type)) {
      if (selectedVoiceTypes.length > 1) {
        setSelectedVoiceTypes(selectedVoiceTypes.filter(t => t !== type));
      }
    } else {
      setSelectedVoiceTypes([...selectedVoiceTypes, type]);
    }
  };

  const handleAddSample = () => {
    if (audioSamples.length >= 7) return;
    setAudioSamples([...audioSamples, { id: Date.now(), name: `عينة ${audioSamples.length + 1}`, url: '' }]);
  };

  const handleRemoveSample = (id: number) => {
    setAudioSamples(audioSamples.filter(s => s.id !== id));
  };

  const handleAddPriceTier = () => {
    const last = priceTiers[priceTiers.length - 1];
    const newFrom = last ? last.wordsTo + 1 : 1;
    setPriceTiers([...priceTiers, { wordsFrom: newFrom, wordsTo: newFrom + 499, priceFrom: 40, priceTo: 80, daysFrom: 2, daysTo: 5, daysUnit: 'يوم' }]);
  };

  const handleRemovePriceTier = (idx: number) => {
    setPriceTiers(priceTiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx: number, field: keyof IPriceTier, value: any) => {
    const updated = [...priceTiers];
    (updated[idx] as any)[field] = value;
    setPriceTiers(updated);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdMic className="text-venecos-gold text-3xl" />
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
          <button type="button" onClick={handleSave} className="px-4 py-2 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
            {tUi('draftBtn')}
          </button>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            {tUi('publishBtn')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Voice Type Cards */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
              <MdMic /> {tUi('voiceTypeTitle')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Male Voice */}
            <div
              onClick={() => toggleVoiceType('male')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                selectedVoiceTypes.includes('male')
                  ? 'bg-venecos-gold/15 border-venecos-gold text-venecos-gold shadow-gold-glow'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <MdPerson className="text-4xl" />
              <span className="font-extrabold text-sm">{tUi('maleVoice')}</span>
            </div>

            {/* Card 2: Female Voice */}
            <div
              onClick={() => toggleVoiceType('female')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                selectedVoiceTypes.includes('female')
                  ? 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <MdPerson className="text-4xl" />
              <span className="font-extrabold text-sm">{tUi('femaleVoice')}</span>
            </div>

            {/* Card 3: Child Voice */}
            <div
              onClick={() => toggleVoiceType('child')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                selectedVoiceTypes.includes('child')
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <MdChildCare className="text-4xl" />
              <span className="font-extrabold text-sm">{tUi('childVoice')}</span>
            </div>
          </div>
        </div>

        {/* Section 2: 2x2 Multilingual Grid matching Screenshot 1 */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3">
            🌐 العنوان والنصوص بالأربع لغات
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic */}
            <div className="bg-white/5 border border-venecos-gold/30 rounded-2xl p-5 space-y-4">
              <div className="bg-venecos-gold/20 border border-venecos-gold/40 text-venecos-gold px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇸🇦 العربية
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">العنوان *</label>
                <input
                  type="text"
                  required
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="مثال: معلق بصوت رجل فصيح"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">وصف مختصر</label>
                <input
                  type="text"
                  value={formData.shortAr}
                  onChange={(e) => setFormData({ ...formData, shortAr: e.target.value })}
                  placeholder="وصف مختصر..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">الشرح التفصيلي</label>
                <textarea
                  rows={4}
                  value={formData.fullAr}
                  onChange={(e) => setFormData({ ...formData, fullAr: e.target.value })}
                  placeholder="شرح تفصيلي عن المعلق وخبراته وأسلوبه..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
                />
              </div>
            </div>

            {/* English */}
            <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇬🇧 GB English
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="e.g. Male Voiceover Artist"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Short description</label>
                <input
                  type="text"
                  value={formData.shortEn}
                  onChange={(e) => setFormData({ ...formData, shortEn: e.target.value })}
                  placeholder="Short description..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Detailed description</label>
                <textarea
                  rows={4}
                  value={formData.fullEn}
                  onChange={(e) => setFormData({ ...formData, fullEn: e.target.value })}
                  placeholder="Detailed description..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* French */}
            <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇫🇷 FR Français
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Titre *</label>
                <input
                  type="text"
                  value={formData.titleFr}
                  onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                  placeholder="ex: Rédacteur vocal homme"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Description courte</label>
                <input
                  type="text"
                  value={formData.shortFr}
                  onChange={(e) => setFormData({ ...formData, shortFr: e.target.value })}
                  placeholder="Description courte..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Description détaillée</label>
                <textarea
                  rows={4}
                  value={formData.fullFr}
                  onChange={(e) => setFormData({ ...formData, fullFr: e.target.value })}
                  placeholder="Description détaillée..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* German */}
            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇩🇪 DE Deutsch
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Titel *</label>
                <input
                  type="text"
                  value={formData.titleDe}
                  onChange={(e) => setFormData({ ...formData, titleDe: e.target.value })}
                  placeholder="z.B. Männlicher Sprecher"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Kurzbeschreibung</label>
                <input
                  type="text"
                  value={formData.shortDe}
                  onChange={(e) => setFormData({ ...formData, shortDe: e.target.value })}
                  placeholder="Kurzbeschreibung..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Detaillierte Beschreibung</label>
                <textarea
                  rows={4}
                  value={formData.fullDe}
                  onChange={(e) => setFormData({ ...formData, fullDe: e.target.value })}
                  placeholder="Detaillierte Beschreibung..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Audio Samples with Cloudinary */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
              <MdAudioFile /> {tUi('audioSamplesTitle')}
            </h3>
            <button type="button" onClick={handleAddSample} className="flex items-center gap-1 text-xs bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-3 py-1.5 rounded-xl font-bold hover:bg-venecos-gold/30">
              <MdAdd /> {tUi('addSampleBtn')}
            </button>
          </div>

          <div className="space-y-4">
            {audioSamples.map((sample, idx) => (
              <div key={sample.id} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-venecos-gold">{isRtl ? `عينة صوتية #${idx + 1}` : `Audio Sample #${idx + 1}`}</span>
                  <button type="button" onClick={() => handleRemoveSample(sample.id)} className="p-1 text-red-400 hover:text-red-300">
                    <MdDelete />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('sampleNameLabel')}</label>
                    <input
                      type="text"
                      value={sample.name}
                      onChange={(e) => {
                        const updated = [...audioSamples];
                        updated[idx].name = e.target.value;
                        setAudioSamples(updated);
                      }}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                    />
                  </div>

                  <div>
                    <CloudinaryUploader
                      label={tUi('uploadAudioLabel')}
                      acceptTypes="audio/*"
                      mediaType="raw"
                      currentUrl={sample.url}
                      onUploadSuccess={(url) => {
                        const updated = [...audioSamples];
                        updated[idx].url = url;
                        setAudioSamples(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Price Tiers Table */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('pricingTitle')}</h3>
            <button type="button" onClick={handleAddPriceTier} className="flex items-center gap-1 text-xs bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-3 py-1.5 rounded-xl font-bold hover:bg-venecos-gold/30">
              <MdAdd /> {tUi('addTierBtn')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-white">
              <thead className="bg-white/5 border-b border-white/10 text-white/60 font-bold">
                <tr>
                  <th className="p-3">{tUi('wordsFrom')}</th>
                  <th className="p-3">{tUi('wordsTo')}</th>
                  <th className="p-3">{tUi('priceRange')}</th>
                  <th className="p-3">{tUi('deliveryTime')}</th>
                  <th className="p-3 text-center">{tUi('deleteCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {priceTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="p-2">
                      <input type="number" value={tier.wordsFrom} onChange={(e) => handleTierChange(idx, 'wordsFrom', Number(e.target.value))} className="w-20 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={tier.wordsTo} onChange={(e) => handleTierChange(idx, 'wordsTo', Number(e.target.value))} className="w-20 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <input type="number" value={tier.priceFrom} onChange={(e) => handleTierChange(idx, 'priceFrom', Number(e.target.value))} className="w-20 bg-white/5 border border-venecos-gold/30 text-venecos-gold rounded-lg px-2 py-1 text-center font-bold" />
                        <span className="text-white/40">—</span>
                        <input type="number" value={tier.priceTo} onChange={(e) => handleTierChange(idx, 'priceTo', Number(e.target.value))} className="w-20 bg-white/5 border border-venecos-gold/30 text-venecos-gold rounded-lg px-2 py-1 text-center font-bold" />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <input type="number" value={tier.daysFrom} onChange={(e) => handleTierChange(idx, 'daysFrom', Number(e.target.value))} className="w-16 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center text-blue-400 font-bold" />
                        <span className="text-white/40">—</span>
                        <input type="number" value={tier.daysTo} onChange={(e) => handleTierChange(idx, 'daysTo', Number(e.target.value))} className="w-16 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center text-blue-400 font-bold" />
                        <select value={tier.daysUnit} onChange={(e) => handleTierChange(idx, 'daysUnit', e.target.value)} className="bg-venecos-black border border-white/15 rounded-lg px-2 py-1 text-xs">
                          <option value="ساعة">ساعة / Hour</option>
                          <option value="يوم">يوم / Day</option>
                          <option value="أسبوع">أسبوع / Week</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <button type="button" onClick={() => handleRemovePriceTier(idx)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="voiceover"
            packages={packages}
            onChange={setPackages}
            onSave={savePackagesToDb}
          />
        </div>

        {/* Sticky Bottom Bar */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            {saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {tUi('savedSuccess')}</span>}
          </div>
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
