'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  MdAdd, MdEdit, MdDelete, MdVisibility, MdCheckCircle, MdCancel, 
  MdImage, MdDragHandle, MdSlideshow 
} from 'react-icons/md';

interface ISlide {
  _id?: string;
  title: { ar: string; en: string; fr: string; de: string };
  subtitle: { ar: string; en: string; fr: string; de: string };
  imageUrl: string;
  linkUrl?: string;
  order: number;
  active: boolean;
}

export default function SliderPage() {
  const [slides, setSlides] = useState<ISlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<ISlide | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');

  const [formData, setFormData] = useState<ISlide>({
    title: { ar: '', en: '', fr: '', de: '' },
    subtitle: { ar: '', en: '', fr: '', de: '' },
    imageUrl: '',
    linkUrl: '',
    order: 0,
    active: true,
  });

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
      setFormData(slide);
    } else {
      setEditingSlide(null);
      setFormData({
        title: { ar: '', en: '', fr: '', de: '' },
        subtitle: { ar: '', en: '', fr: '', de: '' },
        imageUrl: '',
        linkUrl: '',
        order: slides.length + 1,
        active: true,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSlide ? `/api/slider/${editingSlide._id}` : '/api/slider';
      const method = editingSlide ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchSlides();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await fetch(`/api/slider/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSlides();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (slide: ISlide) => {
    try {
      const res = await fetch(`/api/slider/${slide._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !slide.active }),
      });
      if (res.ok) fetchSlides();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdSlideshow className="text-venecos-gold text-3xl" />
            إدارة السلايدر — Homepage Slider
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            شرائح الصفحة الرئيسية ({slides.length}/12) — يدعم 4 لغات
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          إضافة شريحة جديدة
        </button>
      </div>

      {/* Slide list */}
      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : slides.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdImage className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">لا توجد شرائح مضافة بعد</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold hover:bg-venecos-gold/30 transition-all"
          >
            <MdAdd /> إضافة أول شريحة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide._id}
              className="bg-venecos-black/70 border border-white/10 hover:border-venecos-gold/40 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-gray-900 border-b border-white/10">
                  <img
                    src={slide.imageUrl || 'https://via.placeholder.com/600x300'}
                    alt={slide.title.ar || 'Slide'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md ${
                        slide.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {slide.active ? <MdCheckCircle /> : <MdCancel />}
                      {slide.active ? 'نشط' : 'معطل'}
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-white truncate">
                    {slide.title.ar || slide.title.en || 'بدون عنوان'}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2">
                    {slide.subtitle.ar || slide.subtitle.en || 'لا يوجد وصف فرعي'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
                <span className="text-xs text-venecos-gold font-mono font-bold"># Order: {slide.order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(slide)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold transition-all"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => slide._id && handleDelete(slide._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdSlideshow className="text-venecos-gold" />
                {editingSlide ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2">رابط الصورة (Image URL) *</label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-2">رابط الزر (Link URL - اختياري)</label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="/services"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              {/* Multi-language Tabs */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2">النصوص والترجمة (4 لغات)</label>
                <div className="flex gap-2 border-b border-white/10 pb-2 mb-4">
                  {(['ar', 'en', 'fr', 'de'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLangTab(lang)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeLangTab === lang
                          ? 'bg-venecos-gold text-black'
                          : 'bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {lang === 'ar' ? '🇸🇦 بالعربي' : lang === 'en' ? '🇬🇧 English' : lang === 'fr' ? '🇫🇷 Français' : '🇩🇪 Deutsch'}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">
                      العنوان ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.title[activeLangTab]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: { ...formData.title, [activeLangTab]: e.target.value },
                        })
                      }
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:border-venecos-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">
                      الوصف الفرعي ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={formData.subtitle[activeLangTab]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subtitle: { ...formData.subtitle, [activeLangTab]: e.target.value },
                        })
                      }
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:border-venecos-gold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 accent-venecos-gold"
                  />
                  تفعيل الشريحة فوراً
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 transition-all shadow-md"
                  >
                    حفظ الشريحة
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
