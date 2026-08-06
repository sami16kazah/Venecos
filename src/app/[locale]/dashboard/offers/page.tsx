'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MdAdd, MdEdit, MdDelete, MdLocalOffer } from 'react-icons/md';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

interface IOffer {
  _id?: string;
  title: { ar: string; en: string; fr: string; de: string };
  description: { ar: string; en: string; fr: string; de: string };
  originalPrice: number;
  discountedPrice: number;
  badge?: { ar: string; en: string; fr: string; de: string } | string;
  features: Array<{ ar: string; en: string; fr: string; de: string }>;
  active: boolean;
}

const dbOffersUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'العروض الحصرية',
    en: 'Exclusive Offers',
    fr: 'Offres Exclusives',
    de: 'Exklusive Angebote',
  },
  pageSubtitle: {
    ar: 'باقات العروض الخاصة المخصصة للصفحة الرئيسية',
    en: 'Manage special promotional packages displayed on the homepage',
    fr: 'Gérer les forfaits promotionnels spéciaux de la page d\'accueil',
    de: 'Verwalten Sie die Sonderangebots-Pakete für die Homepage',
  },
  addNewOffer: {
    ar: 'إضافة عرض جديد',
    en: 'Add New Offer',
    fr: 'Ajouter une nouvelle offre',
    de: 'Neues Angebot hinzufügen',
  },
  editOffer: {
    ar: 'تعديل العرض',
    en: 'Edit Offer',
    fr: 'Modifier l\'offre',
    de: 'Angebot bearbeiten',
  },
  loading: {
    ar: 'جاري التحميل...',
    en: 'Loading offers...',
    fr: 'Chargement des offres...',
    de: 'Angebote werden geladen...',
  },
  noOffers: {
    ar: 'لا توجد عروض مضافة بعد',
    en: 'No offers created yet',
    fr: 'Aucune offre créée pour le moment',
    de: 'Noch keine Angebote erstellt',
  },
  addFirstOffer: {
    ar: 'إضافة أول عرض',
    en: 'Add First Offer',
    fr: 'Ajouter la première offre',
    de: 'Erstes Angebot hinzufügen',
  },
  activeStatus: {
    ar: '● نشط',
    en: '● Active',
    fr: '● Actif',
    de: '● Aktiv',
  },
  inactiveStatus: {
    ar: '○ غير نشط',
    en: '○ Inactive',
    fr: '○ Inactif',
    de: '○ Inaktiv',
  },
  originalPriceLabel: {
    ar: 'السعر الأصلي (€)',
    en: 'Original Price (€)',
    fr: 'Prix d\'origine (€)',
    de: 'Originalpreis (€)',
  },
  discountedPriceLabel: {
    ar: 'السعر المخصم (€)',
    en: 'Discounted Price (€)',
    fr: 'Prix réduit (€)',
    de: 'Rabattierter Preis (€)',
  },
  titleLabel: {
    ar: 'عنوان العرض',
    en: 'Offer Title',
    fr: 'Titre de l\'offre',
    de: 'Angebotstitel',
  },
  badgeLabel: {
    ar: 'شارة العرض (Badge)',
    en: 'Offer Badge',
    fr: 'Badge de l\'offre',
    de: 'Angebots-Badge',
  },
  descLabel: {
    ar: 'وصف العرض',
    en: 'Offer Description',
    fr: 'Description de l\'offre',
    de: 'Angebotsbeschreibung',
  },
  activeCheckbox: {
    ar: 'عرض على الموقع',
    en: 'Display on Website',
    fr: 'Afficher sur le site',
    de: 'Auf Website anzeigen',
  },
  cancel: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  save: {
    ar: 'حفظ العرض',
    en: 'Save Offer',
    fr: 'Enregistrer l\'offre',
    de: 'Angebot speichern',
  },
  deleteConfirm: {
    ar: 'هل أنت تأكد من حذف هذا العرض؟',
    en: 'Are you sure you want to delete this offer?',
    fr: 'Êtes-vous sûr de vouloir supprimer cette offre ?',
    de: 'Sind Sie sicher, dass Sie dieses Angebot löschen möchten?',
  },
};

import { getLocString } from '@/lib/i18nUtils';

export default function OffersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbOffersUi[key]?.[locale] || dbOffersUi[key]?.['en'] || '';

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
    badge: { ar: 'خصم 20%', en: '20% OFF', fr: '20% de réduction', de: '20% Rabatt' },
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
      const normalizedBadge = typeof offer.badge === 'object' && offer.badge
        ? { ar: offer.badge.ar || '', en: offer.badge.en || '', fr: offer.badge.fr || '', de: offer.badge.de || '' }
        : { ar: String(offer.badge || ''), en: 'Special Offer', fr: 'Offre Spéciale', de: 'Sonderangebot' };

      setEditingOffer(offer);
      setFormData({
        ...offer,
        badge: normalizedBadge
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: { ar: '', en: '', fr: '', de: '' },
        description: { ar: '', en: '', fr: '', de: '' },
        originalPrice: 100,
        discountedPrice: 79,
        badge: { ar: 'خصم 40% لفترة محدودة', en: '40% OFF Limited Time', fr: '40% de réduction - Durée limitée', de: '40% Rabatt - Begrenzte Zeit' },
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

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/offers/${deleteId}`, { method: 'DELETE' });
      if (res.ok) fetchOffers();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdLocalOffer className="text-venecos-gold text-3xl" />
            {tUi('pageTitle')}
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            {tUi('pageSubtitle')}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 active:scale-95 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          {tUi('addNewOffer')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">{tUi('loading')}</div>
      ) : offers.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdLocalOffer className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">{tUi('noOffers')}</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <MdAdd /> {tUi('addFirstOffer')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const badgeText = getLocString(offer.badge, locale);
            const titleText = getLocString(offer.title, locale);
            const descText = getLocString(offer.description, locale);

            return (
              <div
                key={offer._id}
                className="bg-venecos-black/70 border border-white/10 hover:border-venecos-gold/40 rounded-2xl p-6 shadow-xl relative flex flex-col justify-between"
              >
                <div>
                  {badgeText && (
                    <span className="inline-block bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {badgeText}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{titleText}</h3>
                  <p className="text-xs text-white/60 mb-4 line-clamp-2">{descText}</p>
                  
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl font-black text-venecos-gold">€{offer.discountedPrice}</span>
                    <span className="text-sm text-white/40 line-through">€{offer.originalPrice}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className={`text-xs font-bold ${offer.active ? 'text-emerald-400' : 'text-red-400'}`}>
                    {offer.active ? tUi('activeStatus') : tUi('inactiveStatus')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(offer)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold transition-all"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => offer._id && setDeleteId(offer._id)}
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdLocalOffer className="text-venecos-gold" />
                {editingOffer ? tUi('editOffer') : tUi('addNewOffer')}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">{tUi('originalPriceLabel')}</label>
                  <input
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">{tUi('discountedPriceLabel')}</label>
                  <input
                    type="number"
                    required
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: parseFloat(e.target.value) })}
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
                      {tUi('titleLabel')} ({activeLangTab.toUpperCase()})
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
                      {tUi('badgeLabel')} ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={typeof formData.badge === 'object' ? (formData.badge[activeLangTab] || '') : (formData.badge || '')}
                      onChange={(e) => {
                        const curBadge = typeof formData.badge === 'object' && formData.badge ? { ...formData.badge } : { ar: '', en: '', fr: '', de: '' };
                        curBadge[activeLangTab] = e.target.value;
                        setFormData({ ...formData, badge: curBadge });
                      }}
                      placeholder="40% OFF / خصم 40%"
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">
                      {tUi('descLabel')} ({activeLangTab.toUpperCase()})
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
                  {tUi('activeCheckbox')}
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/10"
                  >
                    {tUi('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-venecos-gold to-yellow-500"
                  >
                    {tUi('save')}
                  </button>
                </div>
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

