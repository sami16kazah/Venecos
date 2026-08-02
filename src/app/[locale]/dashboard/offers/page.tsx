'use client';

import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdLocalOffer, MdCheckCircle, MdCancel } from 'react-icons/md';

interface IOffer {
  _id?: string;
  title: { ar: string; en: string; fr: string; de: string };
  description: { ar: string; en: string; fr: string; de: string };
  originalPrice: number;
  discountedPrice: number;
  badge?: string;
  features: Array<{ ar: string; en: string; fr: string; de: string }>;
  active: boolean;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<IOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<IOffer | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');

  const [formData, setFormData] = useState<IOffer>({
    title: { ar: '', en: '', fr: '', de: '' },
    description: { ar: '', en: '', fr: '', de: '' },
    originalPrice: 100,
    discountedPrice: 79,
    badge: 'خصم 20%',
    features: [{ ar: 'ميزة 1', en: 'Feature 1', fr: 'Option 1', de: 'Feature 1' }],
    active: true,
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/offers');
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenModal = (offer?: IOffer) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData(offer);
    } else {
      setEditingOffer(null);
      setFormData({
        title: { ar: '', en: '', fr: '', de: '' },
        description: { ar: '', en: '', fr: '', de: '' },
        originalPrice: 100,
        discountedPrice: 79,
        badge: 'عروض حصرية',
        features: [{ ar: '', en: '', fr: '', de: '' }],
        active: true,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingOffer ? `/api/offers/${editingOffer._id}` : '/api/offers';
      const method = editingOffer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchOffers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت تأكد من حذف هذا العرض؟')) return;
    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (res.ok) fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdLocalOffer className="text-venecos-gold text-3xl" />
            العروض الحصرية — Exclusive Offers
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            باقات العروض الخاصة المخصصة للصفحة الرئيسية
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          إضافة عرض جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : offers.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdLocalOffer className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">لا توجد عروض مضافة بعد</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <MdAdd /> إضافة أول عرض
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-venecos-black/70 border border-white/10 hover:border-venecos-gold/40 rounded-2xl p-6 shadow-xl relative flex flex-col justify-between"
            >
              <div>
                {offer.badge && (
                  <span className="inline-block bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {offer.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{offer.title.ar || offer.title.en}</h3>
                <p className="text-xs text-white/60 mb-4 line-clamp-2">{offer.description.ar || offer.description.en}</p>
                
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-black text-venecos-gold">€{offer.discountedPrice}</span>
                  <span className="text-sm text-white/40 line-through">€{offer.originalPrice}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className={`text-xs font-bold ${offer.active ? 'text-emerald-400' : 'text-red-400'}`}>
                  {offer.active ? '● نشط' : '○ غير نشط'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(offer)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => offer._id && handleDelete(offer._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
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
                <MdLocalOffer className="text-venecos-gold" />
                {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">السعر الأصل (€)</label>
                  <input
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">السعر المخصم (€)</label>
                  <input
                    type="number"
                    required
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">شارة العرض (Badge)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="باقة مميزة"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
              </div>

              {/* Multi-language inputs */}
              <div>
                <div className="flex gap-2 border-b border-white/10 pb-2 mb-4">
                  {(['ar', 'en', 'fr', 'de'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLangTab(lang)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                        activeLangTab === lang ? 'bg-venecos-gold text-black' : 'bg-white/5 text-white/60'
                      }`}
                    >
                      {lang === 'ar' ? '🇸🇦 عربي' : lang === 'en' ? '🇬🇧 EN' : lang === 'fr' ? '🇫🇷 FR' : '🇩🇪 DE'}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">
                      عنوان العرض ({activeLangTab.toUpperCase()})
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
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">
                      وصف العرض ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description[activeLangTab]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: { ...formData.description, [activeLangTab]: e.target.value },
                        })
                      }
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
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
                  عرض على الموقع
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/10"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-venecos-gold to-yellow-500"
                  >
                    حفظ العرض
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
