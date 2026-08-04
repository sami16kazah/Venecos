'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdVideoLibrary, MdArrowBack, MdCheckCircle, MdImage, MdPlayCircle, MdTune, MdSave } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

const dbVideoUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إضافة / إدارة خدمة إنتاج الفيديو 4K',
    en: 'Add / Manage 4K Video Production Service',
    fr: 'Ajouter / Gérer Service Production Vidéo 4K',
    de: '4K Videoproduktion hinzufügen / verwalten',
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
  coverSectionTitle: {
    ar: 'غلاف الخدمة (يظهر في البطاقة)',
    en: 'Service Cover (Card Preview)',
    fr: 'Couverture du service',
    de: 'Service-Titelbild / Video',
  },
  imageCoverLabel: {
    ar: 'صورة غلاف',
    en: 'Image Cover',
    fr: 'Couverture Image',
    de: 'Bild-Cover',
  },
  videoCoverLabel: {
    ar: 'فيديو غلاف',
    en: 'Video Cover',
    fr: 'Couverture Vidéo',
    de: 'Video-Cover',
  },
  dropCoverImg: {
    ar: 'انقر لرفع صورة الغلاف (16:9)',
    en: 'Click to upload cover image (16:9)',
    fr: 'Cliquer pour téléverser l\'image (16:9)',
    de: 'Titelbild hochladen (16:9)',
  },
  dropVideoMp4: {
    ar: 'رفع فيديو الغلاف (MP4)',
    en: 'Upload Cover Video (MP4)',
    fr: 'Téléverser la vidéo (MP4)',
    de: 'Titelvideo hochladen (MP4)',
  },
  orYtLink: {
    ar: 'أو رابط YouTube للغلاف',
    en: 'Or YouTube Cover Link',
    fr: 'Ou lien YouTube',
    de: 'Oder YouTube-Link',
  },
  cancelBtn: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  savedSuccess: {
    ar: 'تم حفظ ونشر خدمة الفيديو بنجاح',
    en: 'Video service saved & published successfully',
    fr: 'Service vidéo enregistré avec succès',
    de: 'Videoservice erfolgreich gespeichert',
  },
  specsTitle: {
    ar: 'السعر والمواصفات',
    en: 'Pricing & Specifications',
    fr: 'Tarifs & Spécifications',
    de: 'Preise & Spezifikationen',
  },
  priceRangeTitle: {
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
  deliveryPeriodTitle: {
    ar: 'فترة التسليم',
    en: 'Delivery Period',
    fr: 'Délai de livraison',
    de: 'Lieferzeitraum',
  },
  unitLabel: {
    ar: 'الوحدة',
    en: 'Unit',
    fr: 'Unité',
    de: 'Einheit',
  },
  videoDurationTitle: {
    ar: 'مدة الفيديو',
    en: 'Video Duration',
    fr: 'Durée de la vidéo',
    de: 'Videodauer',
  },
  resolutionsTitle: {
    ar: 'دقة الفيديو المتاحة',
    en: 'Available Video Resolutions',
    fr: 'Résolutions vidéo disponibles',
    de: 'Verfügbare Videoauflösungen',
  },
  multiLangGridTitle: {
    ar: '🌐 النصوص بالأربع لغات (العنوان، الوصف، ما يشمله العرض)',
    en: '🌐 Text Content (4 Languages: Title, Short Description, Included Points)',
    fr: '🌐 Contenu textuel (4 langues: Titre, Description, Points inclus)',
    de: '🌐 Textinhalte (4 Sprachen: Titel, Kurzbeschreibung, Enthaltene Punkte)',
  },
};

export default function VideoProductionServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbVideoUi[key]?.[locale] || dbVideoUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [coverType, setCoverType] = useState<'image' | 'video'>('image');

  const [resolutions] = useState<string[]>(['720p HD', '1080p Full HD', '2K', '4K Ultra HD', 'Vertical 9:16']);
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>(['1080p Full HD', '4K Ultra HD', 'Vertical 9:16']);

  const [formData, setFormData] = useState({
    priceFrom: 200,
    priceTo: 3000,
    daysFrom: 3,
    daysTo: 14,
    unit: 'يوم',

    durFrom: 30,
    durTo: 180,
    durUnit: 'ثانية',

    ytCover: '',
    ytExample: '',
    coverImage: '',
    exampleVideoUrl: '',

    titleAr: 'إنتاج الفيديو والإعلانات التجارية',
    titleEn: '4K Commercial Video Production',
    titleFr: 'Production vidéo commerciale 4K',
    titleDe: '4K Werbevideoproduktion',

    shortAr: 'تصوير وإخراج وإنتاج فيديو احترافي بدقة 4K',
    shortEn: 'Professional video shooting & editing in 4K',
    shortFr: 'Tournage et montage vidéo professionnel 4K',
    shortDe: 'Professioneller Videodreh und Schnitt 4K',

    ptsAr: 'سكريبت وإعداد النص\nتصوير استوديو أو خارجي\nمونتاج وتعديل ألوان\nمراجعة مجانية واحدة',
    ptsEn: 'Scriptwriting\nStudio or Outdoor Shooting\nVideo Editing & Color Grading\n1 Free Revision',
    ptsFr: 'Écriture du script\nTournage studio ou extérieur\nMontage et étalonnage\n1 révision gratuite',
    ptsDe: 'Drehbucherstellung\nStudio- oder Außendreh\nSchnitt & Color Grading\n1 kostenlose Überarbeitung',
  });

  const toggleRes = (res: string) => {
    if (selectedResolutions.includes(res)) {
      setSelectedResolutions(selectedResolutions.filter(r => r !== res));
    } else {
      setSelectedResolutions([...selectedResolutions, res]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: 'video',
          locale,
          title: formData.titleEn || formData.titleAr || 'Video Production & Motion Graphics',
          description: formData.shortEn || formData.shortAr || 'High quality 4K video production and animation',
          iconName: 'FaVideo',
          iconType: 'react-icon',
          order: 3,
          isSpecial: true,
          subServices: [
            {
              title: `Video Package (${formData.durFrom}-${formData.durTo} ${formData.durUnit})`,
              description: `Resolutions: ${selectedResolutions.join(', ')}`,
              price: formData.priceFrom || 200
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
          <MdVideoLibrary className="text-venecos-gold text-3xl" />
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
        {/* Cover Type Selector */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdImage /> {tUi('coverSectionTitle')}
          </h3>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCoverType('image')}
              className={`flex-1 py-4 px-6 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                coverType === 'image'
                  ? 'bg-venecos-gold/20 border-venecos-gold text-venecos-gold font-bold shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <MdImage className="text-2xl" />
              <span className="text-xs">{tUi('imageCoverLabel')}</span>
            </button>

            <button
              type="button"
              onClick={() => setCoverType('video')}
              className={`flex-1 py-4 px-6 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                coverType === 'video'
                  ? 'bg-venecos-gold/20 border-venecos-gold text-venecos-gold font-bold shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <MdPlayCircle className="text-2xl" />
              <span className="text-xs">{tUi('videoCoverLabel')}</span>
            </button>
          </div>

          {coverType === 'image' ? (
            <CloudinaryUploader
              label={tUi('dropCoverImg')}
              currentUrl={formData.coverImage}
              onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CloudinaryUploader
                label={tUi('dropVideoMp4')}
                acceptTypes="video/*"
                mediaType="video"
                currentUrl={formData.exampleVideoUrl}
                onUploadSuccess={(url) => setFormData({ ...formData, exampleVideoUrl: url })}
              />
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/80">{tUi('orYtLink')}</label>
                <input
                  type="text"
                  value={formData.ytCover}
                  onChange={(e) => setFormData({ ...formData, ytCover: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs focus:border-venecos-gold outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Specifications & Price Range */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdTune /> {tUi('specsTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">{tUi('priceRangeTitle')}</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('fromLabel')}</span>
                  <input
                    type="number"
                    value={formData.priceFrom}
                    onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-venecos-gold font-black text-base"
                    placeholder="200"
                  />
                </div>
                <span className="text-white/40 font-bold pt-4">—</span>
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('toLabel')}</span>
                  <input
                    type="number"
                    value={formData.priceTo}
                    onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-venecos-gold font-black text-base"
                    placeholder="3000"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Period */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">{tUi('deliveryPeriodTitle')}</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('fromLabel')}</span>
                  <input
                    type="number"
                    value={formData.daysFrom}
                    onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-base"
                    placeholder="3"
                  />
                </div>
                <span className="text-white/40 font-bold pt-4">—</span>
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('toLabel')}</span>
                  <input
                    type="number"
                    value={formData.daysTo}
                    onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-base"
                    placeholder="14"
                  />
                </div>
                <div className="w-24">
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('unitLabel')}</span>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-venecos-black border border-white/15 rounded-xl px-2 py-2 text-xs text-white"
                  >
                    <option value="ساعة">ساعة / Hour</option>
                    <option value="يوم">يوم / Day</option>
                    <option value="أسبوع">أسبوع / Week</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">{tUi('videoDurationTitle')}</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('fromLabel')}</span>
                  <input
                    type="number"
                    value={formData.durFrom}
                    onChange={(e) => setFormData({ ...formData, durFrom: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-purple-400 font-bold text-base"
                    placeholder="30"
                  />
                </div>
                <span className="text-white/40 font-bold pt-4">—</span>
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('toLabel')}</span>
                  <input
                    type="number"
                    value={formData.durTo}
                    onChange={(e) => setFormData({ ...formData, durTo: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-purple-400 font-bold text-base"
                    placeholder="180"
                  />
                </div>
                <div className="w-24">
                  <span className="block text-[10px] text-white/50 mb-1">{tUi('unitLabel')}</span>
                  <select
                    value={formData.durUnit}
                    onChange={(e) => setFormData({ ...formData, durUnit: e.target.value })}
                    className="w-full bg-venecos-black border border-white/15 rounded-xl px-2 py-2 text-xs text-white"
                  >
                    <option value="ثانية">ثانية / Sec</option>
                    <option value="دقيقة">دقيقة / Min</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resolutions Chips */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">🖥️ {tUi('resolutionsTitle')}</label>
              <div className="flex flex-wrap gap-2">
                {resolutions.map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => toggleRes(res)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedResolutions.includes(res)
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow'
                        : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                    }`}
                  >
                    {selectedResolutions.includes(res) ? '✓ ' : ''}{res}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 4 Languages Grid */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3">
            {tUi('multiLangGridTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic */}
            <div className="bg-white/5 border border-venecos-gold/30 rounded-2xl p-5 space-y-4">
              <div className="bg-venecos-gold/20 border border-venecos-gold/40 text-venecos-gold px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇸🇦 العربية (AR)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">العنوان *</label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">وصف مختصر</label>
                <input
                  type="text"
                  value={formData.shortAr}
                  onChange={(e) => setFormData({ ...formData, shortAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">ما يشمله العرض (سطر = نقطة)</label>
                <textarea
                  rows={4}
                  value={formData.ptsAr}
                  onChange={(e) => setFormData({ ...formData, ptsAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs resize-none focus:border-venecos-gold outline-none"
                />
              </div>
            </div>

            {/* English */}
            <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇬🇧 English (EN)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Short description</label>
                <input
                  type="text"
                  value={formData.shortEn}
                  onChange={(e) => setFormData({ ...formData, shortEn: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Included points (Line = Point)</label>
                <textarea
                  rows={4}
                  value={formData.ptsEn}
                  onChange={(e) => setFormData({ ...formData, ptsEn: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs resize-none focus:border-blue-400 outline-none"
                />
              </div>
            </div>

            {/* French */}
            <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇫🇷 Français (FR)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Titre *</label>
                <input
                  type="text"
                  value={formData.titleFr}
                  onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Description courte</label>
                <input
                  type="text"
                  value={formData.shortFr}
                  onChange={(e) => setFormData({ ...formData, shortFr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Points inclus (Ligne = Point)</label>
                <textarea
                  rows={4}
                  value={formData.ptsFr}
                  onChange={(e) => setFormData({ ...formData, ptsFr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs resize-none focus:border-emerald-400 outline-none"
                />
              </div>
            </div>

            {/* German */}
            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇩🇪 Deutsch (DE)
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Titel *</label>
                <input
                  type="text"
                  value={formData.titleDe}
                  onChange={(e) => setFormData({ ...formData, titleDe: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Kurzbeschreibung</label>
                <input
                  type="text"
                  value={formData.shortDe}
                  onChange={(e) => setFormData({ ...formData, shortDe: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Enthaltene Punkte (Zeile = Punkt)</label>
                <textarea
                  rows={4}
                  value={formData.ptsDe}
                  onChange={(e) => setFormData({ ...formData, ptsDe: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs resize-none focus:border-purple-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            {saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {tUi('savedSuccess')}</span>}
          </div>
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
