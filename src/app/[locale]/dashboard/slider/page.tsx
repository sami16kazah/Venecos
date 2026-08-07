'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  MdAdd, MdEdit, MdDelete, MdCheckCircle, MdCancel, 
  MdImage, MdVideoLibrary, MdSlideshow, MdLink, MdArrowUpward, MdArrowDownward,
  MdFormatAlignRight, MdFormatAlignCenter, MdFormatAlignLeft, MdRemoveRedEye
} from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

interface ISlide {
  _id?: string;
  title: { ar: string; en: string; fr: string; de: string };
  subtitle: { ar: string; en: string; fr: string; de: string };
  mediaType: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
  ytUrl?: string;
  overlayOpacity: number;
  btnText: { ar: string; en: string; fr: string; de: string };
  btnUrl?: string;
  btnStyle: string;
  vPosition: string;
  textAlign: string;
  duration: number;
  order: number;
  active: boolean;
  status: string;
}

const dbSliderUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة السلايدر',
    en: 'Slider Management',
    fr: 'Gestion du Slider',
    de: 'Slider-Verwaltung',
  },
  pageSubtitle: {
    ar: 'شرائح الصفحة الرئيسية — يدعم صور/فيديو وخيارات التنسيق بالأربع لغات',
    en: 'Main homepage hero slides — Supports 4K images/videos with 4-language support',
    fr: 'Diapositives principales du site — Prise en charge 4K images/vidéos et 4 langues',
    de: 'Hauptseiten-Slider — Unterstützt 4K-Bilder/Videos und 4 Sprachen',
  },
  addNewSlide: {
    ar: 'إضافة شريحة جديدة',
    en: 'Add New Slide',
    fr: 'Ajouter une nouvelle diapositive',
    de: 'Neue Folie hinzufügen',
  },
  editSlide: {
    ar: 'تعديل الشريحة',
    en: 'Edit Slide',
    fr: 'Modifier la diapositive',
    de: 'Folie bearbeiten',
  },
  loading: {
    ar: 'جاري التحميل...',
    en: 'Loading slides...',
    fr: 'Chargement des diapositives...',
    de: 'Folien werden geladen...',
  },
  emptySlides: {
    ar: 'لا توجد شرائح بعد',
    en: 'No slides created yet',
    fr: 'Aucune diapositive pour le moment',
    de: 'Noch keine Folien vorhanden',
  },
  addFirstSlide: {
    ar: 'إضافة أول شريحة',
    en: 'Add First Slide',
    fr: 'Ajouter la première diapositive',
    de: 'Erste Folie hinzufügen',
  },
  publishedStatus: {
    ar: 'منشورة',
    en: 'Published',
    fr: 'Publié',
    de: 'Veröffentlicht',
  },
  hiddenStatus: {
    ar: 'مخفية',
    en: 'Hidden',
    fr: 'Masqué',
    de: 'Ausgeblendet',
  },
  noTitle: {
    ar: 'شريحة بدون عنوان',
    en: 'Untitled Slide',
    fr: 'Diapositive sans titre',
    de: 'Unbenannte Folie',
  },
  noSubtitle: {
    ar: 'لا يوجد نص فرعي',
    en: 'No subtitle provided',
    fr: 'Pas de sous-titre',
    de: 'Kein Untertitel',
  },
  deleteConfirm: {
    ar: 'هل أنت تأكد من حذف هذه الشريحة؟',
    en: 'Are you sure you want to delete this slide?',
    fr: 'Êtes-vous sûr de vouloir supprimer cette diapositive ?',
    de: 'Sind Sie sicher, dass Sie diese Folie löschen möchten?',
  },
  mediaImage: {
    ar: 'صورة',
    en: 'Image',
    fr: 'Image',
    de: 'Bild',
  },
  mediaVideo: {
    ar: 'فيديو',
    en: 'Video',
    fr: 'Vidéo',
    de: 'Video',
  },
};

import { getLocString } from '@/lib/i18nUtils';

export default function SliderPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbSliderUi[key]?.[locale] || dbSliderUi[key]?.['en'] || '';

  const [slides, setSlides] = useState<ISlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<ISlide | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');

  const emptyFormData: ISlide = {
    title: { ar: '', en: '', fr: '', de: '' },
    subtitle: { ar: '', en: '', fr: '', de: '' },
    mediaType: 'image',
    imageUrl: '',
    videoUrl: '',
    ytUrl: '',
    overlayOpacity: 50,
    btnText: { ar: '', en: '', fr: '', de: '' },
    btnUrl: '',
    btnStyle: 'ذهبي مملوء',
    vPosition: 'وسط',
    textAlign: 'وسط',
    duration: 5,
    order: 0,
    active: true,
    status: 'منشورة',
  };

  const [formData, setFormData] = useState<ISlide>(emptyFormData);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/slider');
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenModal = (slide?: ISlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        ...emptyFormData,
        ...slide,
        title: { ...emptyFormData.title, ...(slide.title || {}) },
        subtitle: { ...emptyFormData.subtitle, ...(slide.subtitle || {}) },
        btnText: { ...emptyFormData.btnText, ...(slide.btnText || {}) },
      });
    } else {
      setEditingSlide(null);
      setFormData({
        ...emptyFormData,
        order: slides.length + 1,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSlide ? `/api/slider/${editingSlide._id}` : '/api/slider';
      const method = editingSlide ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        imageUrl: formData.imageUrl || (formData.mediaType === 'image' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' : ''),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchSlides();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/slider/${deleteId}`, { method: 'DELETE' });
      if (res.ok) fetchSlides();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (slide: ISlide) => {
    try {
      const res = await fetch(`/api/slider/${slide._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !slide.active, status: !slide.active ? 'منشورة' : 'مخفية' }),
      });
      if (res.ok) fetchSlides();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (index: number, direction: -1 | 1) => {
    const newSlides = [...slides];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    setSlides(newSlides);

    try {
      await Promise.all([
        fetch(`/api/slider/${newSlides[index]._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: index + 1 }),
        }),
        fetch(`/api/slider/${newSlides[targetIndex]._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: targetIndex + 1 }),
        })
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const getYoutubeEmbed = (url?: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&controls=0&loop=1` : '';
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdSlideshow className="text-venecos-gold text-3xl" />
            {tUi('pageTitle')}
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            {tUi('pageSubtitle')} ({slides.length}/12)
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={slides.length >= 12}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 disabled:opacity-50 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          {tUi('addNewSlide')}
        </button>
      </div>

      {/* Slide list */}
      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">{tUi('loading')}</div>
      ) : slides.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdImage className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">{tUi('emptySlides')}</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold hover:bg-venecos-gold/30 transition-all"
          >
            <MdAdd /> {tUi('addFirstSlide')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => {
            const titleText = getLocString(slide.title, locale);
            const subtitleText = getLocString(slide.subtitle, locale);
            const btnLabel = getLocString(slide.btnText, locale);

            return (
              <div
                key={slide._id}
                className={`bg-venecos-black/80 border ${slide.active ? 'border-white/10 hover:border-venecos-gold/40' : 'border-red-500/20 opacity-60'} rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col md:flex-row items-stretch`}
              >
                {/* Index number */}
                <div className="w-12 bg-white/5 border-l border-white/10 flex items-center justify-center font-bold text-venecos-gold text-lg">
                  {index + 1}
                </div>

                {/* Media Thumbnail */}
                <div className="w-full md:w-56 h-36 bg-gray-900 border-b md:border-b-0 md:border-l border-white/10 relative overflow-hidden flex-shrink-0">
                  {slide.mediaType === 'video' ? (
                    slide.ytUrl ? (
                      <iframe src={getYoutubeEmbed(slide.ytUrl)} className="w-full h-full pointer-events-none" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-black flex flex-col items-center justify-center text-blue-400">
                        <MdVideoLibrary className="text-4xl mb-1" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">{tUi('mediaVideo')}</span>
                      </div>
                    )
                  ) : (
                    <img
                      src={slide.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                      alt={titleText}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                    {slide.mediaType === 'video' ? `🎬 ${tUi('mediaVideo')}` : `🖼️ ${tUi('mediaImage')}`}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 space-y-2 flex flex-col justify-center min-w-0">
                  <h3 className="text-base font-bold text-white truncate">
                    {titleText || tUi('noTitle')}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-1">
                    {subtitleText || tUi('noSubtitle')}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                    {btnLabel && (
                      <span className="px-2.5 py-0.5 bg-venecos-gold/10 border border-venecos-gold/30 rounded-full text-venecos-gold font-medium">
                        🎯 {btnLabel}
                      </span>
                    )}
                    {slide.btnUrl && (
                      <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 font-mono">
                        🔗 {slide.btnUrl}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/60">
                      ⏱️ {slide.duration || 5}s
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="p-4 bg-white/5 border-t md:border-t-0 md:border-r border-white/10 flex items-center justify-between md:justify-center gap-3">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      slide.active
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {slide.active ? <MdCheckCircle /> : <MdCancel />}
                    {slide.active ? tUi('publishedStatus') : tUi('hiddenStatus')}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(index, -1)}
                      disabled={index === 0}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <MdArrowUpward />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 1)}
                      disabled={index === slides.length - 1}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <MdArrowDownward />
                    </button>
                    <button
                      onClick={() => handleOpenModal(slide)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold transition-all"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => slide._id && setDeleteId(slide._id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdSlideshow className="text-venecos-gold" />
                {editingSlide ? tUi('editSlide') : tUi('addNewSlide')}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Media Section */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2 border-b border-white/10 pb-2">
                  <MdVideoLibrary /> {tUi('slideMedia')}
                </h3>

                {/* Media Type Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 font-bold text-sm transition-all ${
                      formData.mediaType === 'image'
                        ? 'bg-venecos-gold/20 border-venecos-gold text-venecos-gold shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <MdImage className="text-xl" />
                    {tUi('coverImageLabel')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: 'video' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 font-bold text-sm transition-all ${
                      formData.mediaType === 'video'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <MdVideoLibrary className="text-xl" />
                    {tUi('videoCoverLabel')}
                  </button>
                </div>

                <CloudinaryUploader
                  label={tUi('uploadDeviceLabel')}
                  sublabel="JPG, PNG, WEBP · MP4, WEBM"
                  acceptTypes="image/*,video/*"
                  onUploadSuccess={(url) => {
                    if (url.includes('/video/') || url.match(/\.(mp4|webm|mov)$/i)) {
                      setFormData((prev) => ({ ...prev, videoUrl: url, mediaType: 'video' }));
                    } else {
                      setFormData((prev) => ({ ...prev, imageUrl: url, mediaType: 'image' }));
                    }
                  }}
                  currentUrl={formData.imageUrl || formData.videoUrl}
                />

                {formData.mediaType === 'image' ? (
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('directImageUrlLabel')}</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('directVideoUrlLabel')}</label>
                      <input
                        type="text"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://example.com/video.mp4"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('youtubeUrlLabel')}</label>
                      <input
                        type="text"
                        value={formData.ytUrl}
                        onChange={(e) => setFormData({ ...formData, ytUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Overlay Opacity Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-white/80">{tUi('overlayOpacityLabel')}</span>
                    <span className="text-venecos-gold font-mono">{formData.overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={formData.overlayOpacity}
                    onChange={(e) => setFormData({ ...formData, overlayOpacity: Number(e.target.value) })}
                    className="w-full accent-venecos-gold cursor-pointer"
                  />
                </div>
              </div>

              {/* Multi-language Texts 4-Languages 2x2 Grid */}
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
                      <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('mainTitleLabel')} *</label>
                      <input
                        type="text"
                        value={formData.title.ar}
                        onChange={(e) => setFormData({
                          ...formData,
                          title: { ...formData.title, ar: e.target.value }
                        })}
                        placeholder="العنوان الرئيسية..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('subtitleLabel')}</label>
                      <textarea
                        rows={2}
                        value={formData.subtitle.ar}
                        onChange={(e) => setFormData({
                          ...formData,
                          subtitle: { ...formData.subtitle, ar: e.target.value }
                        })}
                        placeholder="الوصف الفرعي..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('ctaTextLabel')}</label>
                      <input
                        type="text"
                        value={formData.btnText.ar}
                        onChange={(e) => setFormData({
                          ...formData,
                          btnText: { ...formData.btnText, ar: e.target.value }
                        })}
                        placeholder="نص الزر..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* English */}
                  <div className="bg-[#202127] border border-blue-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
                    <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                      GB English (EN)
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">Main Title *</label>
                      <input
                        type="text"
                        value={formData.title.en}
                        onChange={(e) => setFormData({
                          ...formData,
                          title: { ...formData.title, en: e.target.value }
                        })}
                        placeholder="Main Slide Title..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">Subtitle</label>
                      <textarea
                        rows={2}
                        value={formData.subtitle.en}
                        onChange={(e) => setFormData({
                          ...formData,
                          subtitle: { ...formData.subtitle, en: e.target.value }
                        })}
                        placeholder="Slide Subtitle..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">CTA Button Text</label>
                      <input
                        type="text"
                        value={formData.btnText.en}
                        onChange={(e) => setFormData({
                          ...formData,
                          btnText: { ...formData.btnText, en: e.target.value }
                        })}
                        placeholder="Button Label..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* French */}
                  <div className="bg-[#202127] border border-emerald-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                      FR Français (FR)
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">Titre principal</label>
                      <input
                        type="text"
                        value={formData.title.fr}
                        onChange={(e) => setFormData({
                          ...formData,
                          title: { ...formData.title, fr: e.target.value }
                        })}
                        placeholder="Titre principal..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">Sous-titre</label>
                      <textarea
                        rows={2}
                        value={formData.subtitle.fr}
                        onChange={(e) => setFormData({
                          ...formData,
                          subtitle: { ...formData.subtitle, fr: e.target.value }
                        })}
                        placeholder="Sous-titre..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">Texte du bouton</label>
                      <input
                        type="text"
                        value={formData.btnText.fr}
                        onChange={(e) => setFormData({
                          ...formData,
                          btnText: { ...formData.btnText, fr: e.target.value }
                        })}
                        placeholder="Texte du bouton..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* German */}
                  <div className="bg-[#202127] border border-purple-500/30 rounded-2xl p-4 space-y-3" dir="ltr">
                    <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
                      DE Deutsch (DE)
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">Haupttitel</label>
                      <input
                        type="text"
                        value={formData.title.de}
                        onChange={(e) => setFormData({
                          ...formData,
                          title: { ...formData.title, de: e.target.value }
                        })}
                        placeholder="Haupttitel..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">Untertitel</label>
                      <textarea
                        rows={2}
                        value={formData.subtitle.de}
                        onChange={(e) => setFormData({
                          ...formData,
                          subtitle: { ...formData.subtitle, de: e.target.value }
                        })}
                        placeholder="Untertitel..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1.5">Button-Text</label>
                      <input
                        type="text"
                        value={formData.btnText.de}
                        onChange={(e) => setFormData({
                          ...formData,
                          btnText: { ...formData.btnText, de: e.target.value }
                        })}
                        placeholder="Button-Text..."
                        className="w-full bg-[#141519] border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button & Styling Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                    <MdLink className="text-venecos-gold text-base" /> {tUi('btnLinkStyle')}
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('btnUrlLabel')}</label>
                    <input
                      type="text"
                      value={formData.btnUrl}
                      onChange={(e) => setFormData({ ...formData, btnUrl: e.target.value })}
                      placeholder="/services..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('btnStyleLabel')}</label>
                    <select
                      value={formData.btnStyle}
                      onChange={(e) => setFormData({ ...formData, btnStyle: e.target.value })}
                      className="w-full bg-venecos-black border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                    >
                      <option value="ذهبي مملوء">Gold Solid</option>
                      <option value="ذهبي شفاف">Gold Outline</option>
                      <option value="أبيض مملوء">White Solid</option>
                      <option value="أبيض شفاف">White Outline</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white/90">{tUi('textPositionDuration')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('vPositionLabel')}</label>
                      <select
                        value={formData.vPosition}
                        onChange={(e) => setFormData({ ...formData, vPosition: e.target.value })}
                        className="w-full bg-venecos-black border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                      >
                        <option value="أعلى">Top</option>
                        <option value="وسط">Middle</option>
                        <option value="أسفل">Bottom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('textAlignLabel')}</label>
                      <select
                        value={formData.textAlign}
                        onChange={(e) => setFormData({ ...formData, textAlign: e.target.value })}
                        className="w-full bg-venecos-black border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                      >
                        <option value="يمين">Right</option>
                        <option value="وسط">Center</option>
                        <option value="يسار">Left</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">{tUi('durationLabel')}</label>
                    <input
                      type="number"
                      min="2"
                      max="15"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all"
                >
                  {tUi('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black text-sm font-bold shadow-lg transition-all"
                >
                  {editingSlide ? tUi('saveChanges') : tUi('addSlideBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
