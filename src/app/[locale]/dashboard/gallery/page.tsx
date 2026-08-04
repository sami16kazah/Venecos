'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  MdAdd, MdEdit, MdDelete, MdPhotoLibrary, 
  MdGridView, MdFormatListBulleted, MdCheckCircle, MdCancel,
  MdLaunch, MdImage, MdVideoLibrary, MdCode, MdPrint, MdColorLens, MdViewCarousel
} from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

interface IGalleryItem {
  _id?: string;
  title: { ar: string; en: string; fr: string; de: string };
  description: { ar: string; en: string; fr: string; de: string };
  category: 'identity' | 'video' | 'software' | 'print' | 'other';
  client?: string;
  date?: string;
  order?: number;
  coverImage?: string;
  images?: string[];
  ytUrl?: string;
  videoUrl?: string;
  demoUrl?: string;
  screenshots?: string[];
  mediaType: 'image' | 'video' | 'carousel';
  mediaUrl?: string;
  active: boolean;
  status?: string;
}

const dbGalleryUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'معرض الأعمال',
    en: 'Work Portfolio Gallery',
    fr: 'Galerie de Portfolio',
    de: 'Portfolio Galerie',
  },
  pageSubtitle: {
    ar: 'إدارة أعمال ومعارض الشركة على الموقع الرئيسي',
    en: 'Manage portfolio showcase items on the main website',
    fr: 'Gérer la vitrine du portfolio sur le site principal',
    de: 'Verwalten Sie die Portfolio-Showcase-Elemente auf der Website',
  },
  addNewWork: {
    ar: 'إضافة عمل جديد',
    en: 'Add New Project',
    fr: 'Ajouter un nouveau projet',
    de: 'Neues Projekt hinzufügen',
  },
  editWork: {
    ar: 'تعديل عمل المعرض',
    en: 'Edit Portfolio Project',
    fr: 'Modifier le projet de portfolio',
    de: 'Portfolio-Projekt bearbeiten',
  },
  loading: {
    ar: 'جاري التحميل...',
    en: 'Loading portfolio...',
    fr: 'Chargement du portfolio...',
    de: 'Portfolio wird geladen...',
  },
  emptyCategory: {
    ar: 'المعرض فارغ لهذا التصنيف',
    en: 'No projects in this category',
    fr: 'Aucun projet dans cette catégorie',
    de: 'Keine Projekte in dieser Kategorie',
  },
  addFirstWork: {
    ar: 'إضافة أول عمل',
    en: 'Add First Project',
    fr: 'Ajouter le premier projet',
    de: 'Erstes Projekt hinzufügen',
  },
  publishedStatus: {
    ar: 'منشور',
    en: 'Published',
    fr: 'Publié',
    de: 'Veröffentlicht',
  },
  hiddenStatus: {
    ar: 'مخفي',
    en: 'Hidden',
    fr: 'Masqué',
    de: 'Ausgeblendet',
  },
  tableWork: {
    ar: 'العمل',
    en: 'Project',
    fr: 'Projet',
    de: 'Projekt',
  },
  tableCategory: {
    ar: 'التصنيف',
    en: 'Category',
    fr: 'Catégorie',
    de: 'Kategorie',
  },
  tableClient: {
    ar: 'العميل',
    en: 'Client',
    fr: 'Client',
    de: 'Kunde',
  },
  tableDate: {
    ar: 'التاريخ',
    en: 'Date',
    fr: 'Date',
    de: 'Datum',
  },
  tableStatus: {
    ar: 'الحالة',
    en: 'Status',
    fr: 'Statut',
    de: 'Status',
  },
  tableActions: {
    ar: 'الإجراءات',
    en: 'Actions',
    fr: 'Actions',
    de: 'Aktionen',
  },
  categoryLabel: {
    ar: 'التصنيف',
    en: 'Category',
    fr: 'Catégorie',
    de: 'Kategorie',
  },
  clientLabel: {
    ar: 'اسم العميل / الشركة',
    en: 'Client / Company Name',
    fr: 'Nom du client / entreprise',
    de: 'Kunde / Firmenname',
  },
  mediaTypeLabel: {
    ar: 'نوع الوسائط (Media Type)',
    en: 'Media Type',
    fr: 'Type de média',
    de: 'Medientyp',
  },
  coverImageLabel: {
    ar: 'رفع صورة الغلاف عبر Cloudinary',
    en: 'Upload Cover Image from Device (Cloudinary)',
    fr: 'Télécharger l\'image de couverture depuis l\'appareil (Cloudinary)',
    de: 'Titelbild vom Gerät hochladen (Cloudinary)',
  },
  videoUrlLabel: {
    ar: 'رفع ملف فيديو عبر Cloudinary',
    en: 'Upload Video File from Device (Cloudinary)',
    fr: 'Télécharger le fichier vidéo depuis l\'appareil (Cloudinary)',
    de: 'Videodatei vom Gerät hochladen (Cloudinary)',
  },
  demoUrlLabel: {
    ar: 'رابط المعاينة المباشرة (Demo URL)',
    en: 'Live Demo URL',
    fr: 'URL de démonstration en direct',
    de: 'Live-Demo-URL',
  },
  additionalImagesLabel: {
    ar: 'رفع صور وفيديوهات إضافية للعرض (Cloudinary Slides)',
    en: 'Upload Additional Project Media (Cloudinary Slides)',
    fr: 'Télécharger des médias supplémentaires (Diaporama Cloudinary)',
    de: 'Zusätzliche Projektmedien hochladen (Cloudinary-Karussell)',
  },
  addImageBtn: {
    ar: 'إضافة صورة من رابط',
    en: 'Add Image URL',
    fr: 'Ajouter une URL d\'image',
    de: 'Bild-URL hinzufügen',
  },
  titleLabel: {
    ar: 'عنوان العمل',
    en: 'Project Title',
    fr: 'Titre du projet',
    de: 'Projekttitel',
  },
  descLabel: {
    ar: 'وصف العمل',
    en: 'Project Description',
    fr: 'Description du projet',
    de: 'Projektbeschreibung',
  },
  cancel: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  save: {
    ar: 'حفظ التعديلات',
    en: 'Save Changes',
    fr: 'Enregistrer les modifications',
    de: 'Änderungen speichern',
  },
  deleteConfirm: {
    ar: 'هل أنت تأكد من حذف هذا العمل من المعرض؟',
    en: 'Are you sure you want to delete this portfolio project?',
    fr: 'Êtes-vous sûr de vouloir supprimer ce projet du portfolio ?',
    de: 'Sind Sie sicher, dass Sie dieses Portfolio-Projekt löschen möchten?',
  },
};

function getLocValue(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val[lang] || val['en'] || val['ar'] || val['fr'] || val['de'] || Object.values(val)[0] || '';
  }
  return String(val);
}

export default function GalleryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbGalleryUi[key]?.[locale] || dbGalleryUi[key]?.['en'] || '';

  const CATEGORIES = [
    { id: 'all', label: locale === 'ar' ? 'الكل' : locale === 'fr' ? 'Tous' : locale === 'de' ? 'Alle' : 'All', icon: MdPhotoLibrary, color: 'text-white' },
    { id: 'identity', label: locale === 'ar' ? 'هوية بصرية' : locale === 'fr' ? 'Identité' : locale === 'de' ? 'Identität' : 'Identity', icon: MdColorLens, color: 'text-purple-400' },
    { id: 'video', label: locale === 'ar' ? 'إنتاج فيديو' : locale === 'fr' ? 'Production Vidéo' : locale === 'de' ? 'Videoproduktion' : 'Video Production', icon: MdVideoLibrary, color: 'text-blue-400' },
    { id: 'software', label: locale === 'ar' ? 'برامج ومواقع' : locale === 'fr' ? 'Logiciel & Web' : locale === 'de' ? 'Software & Web' : 'Software & Web', icon: MdCode, color: 'text-emerald-400' },
    { id: 'print', label: locale === 'ar' ? 'طباعة إعلانية' : locale === 'fr' ? 'Impression' : locale === 'de' ? 'Drucken' : 'Print Design', icon: MdPrint, color: 'text-amber-400' },
    { id: 'other', label: locale === 'ar' ? 'أخرى' : locale === 'fr' ? 'Autre' : locale === 'de' ? 'Sonstiges' : 'Other', icon: MdPhotoLibrary, color: 'text-white/60' },
  ];

  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IGalleryItem | null>(null);
  const [previewItem, setPreviewItem] = useState<IGalleryItem | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');

  const emptyFormData: IGalleryItem = {
    title: { ar: '', en: '', fr: '', de: '' },
    description: { ar: '', en: '', fr: '', de: '' },
    category: 'identity',
    client: '',
    date: new Date().toISOString().split('T')[0],
    order: 1,
    coverImage: '',
    images: [],
    ytUrl: '',
    videoUrl: '',
    demoUrl: '',
    screenshots: [],
    mediaType: 'image',
    mediaUrl: '',
    active: true,
    status: 'منشور',
  };

  const [formData, setFormData] = useState<IGalleryItem>(emptyFormData);
  const [imageInput, setImageInput] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const url = filterCategory === 'all' ? '/api/gallery' : `/api/gallery?category=${filterCategory}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filterCategory]);

  const handleOpenModal = (item?: IGalleryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...emptyFormData,
        ...item,
        title: { ...emptyFormData.title, ...(item.title || {}) },
        description: { ...emptyFormData.description, ...(item.description || {}) },
        images: item.images || [],
        screenshots: item.screenshots || [],
      });
    } else {
      setEditingItem(null);
      setFormData({
        ...emptyFormData,
        order: items.length + 1,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/gallery/${editingItem._id}` : '/api/gallery';
      const method = editingItem ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        mediaUrl: formData.coverImage || formData.videoUrl || formData.mediaUrl || (formData.images && formData.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tUi('deleteConfirm'))) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (item: IGalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !item.active, status: !item.active ? 'منشور' : 'مخفي' }),
      });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData({
      ...formData,
      images: [...(formData.images || []), imageInput.trim()],
    });
    setImageInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: (formData.images || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdPhotoLibrary className="text-venecos-gold text-3xl" />
            {tUi('pageTitle')}
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            {tUi('pageSubtitle')} ({items.length})
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 active:scale-95 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          {tUi('addNewWork')}
        </button>
      </div>

      {/* Filter Bar & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterCategory === cat.id
                    ? 'bg-venecos-gold text-black shadow-md'
                    : 'bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Icon className={filterCategory === cat.id ? 'text-black' : cat.color} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl text-lg ${viewMode === 'grid' ? 'bg-venecos-gold text-black' : 'bg-white/10 text-white/70'}`}
          >
            <MdGridView />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl text-lg ${viewMode === 'list' ? 'bg-venecos-gold text-black' : 'bg-white/10 text-white/70'}`}
          >
            <MdFormatListBulleted />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">{tUi('loading')}</div>
      ) : items.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdPhotoLibrary className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">{tUi('emptyCategory')}</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <MdAdd /> {tUi('addFirstWork')}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const titleText = getLocValue(item.title, locale);
            const descText = getLocValue(item.description, locale);
            const videoSrc = item.videoUrl || item.mediaUrl || '';
            const coverSrc = item.coverImage || item.mediaUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={item._id}
                className={`bg-venecos-black/70 border ${item.active ? 'border-white/10 hover:border-venecos-gold/40' : 'border-red-500/20 opacity-60'} rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="h-48 bg-gray-900 overflow-hidden relative">
                    {(item.mediaType === 'video' || videoSrc) && videoSrc.trim().length > 0 ? (
                      <video
                        src={videoSrc}
                        controls
                        muted
                        className="w-full h-full object-cover"
                        poster={coverSrc || undefined}
                      />
                    ) : (
                      <img
                        src={coverSrc}
                        alt={titleText}
                        className="w-full h-full object-cover"
                      />
                    )}

                    <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-venecos-gold text-[11px] font-bold px-3 py-1 rounded-full border border-venecos-gold/30">
                      {item.category.toUpperCase()}
                    </span>

                    {item.mediaType && (
                      <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 uppercase flex items-center gap-1">
                        {item.mediaType === 'video' ? <MdVideoLibrary /> : item.mediaType === 'carousel' ? <MdViewCarousel /> : <MdImage />}
                        {item.mediaType}
                      </span>
                    )}

                    {item.demoUrl && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 left-3 bg-blue-500/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-400/40 flex items-center gap-1 hover:bg-blue-600"
                      >
                        <MdLaunch /> Demo
                      </a>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-white truncate">
                      {titleText || 'Untitled Project'}
                    </h3>
                    {item.client && (
                      <p className="text-xs text-venecos-gold font-medium">🏢 {item.client}</p>
                    )}
                    <p className="text-xs text-white/60 line-clamp-2">
                      {descText || '—'}
                    </p>
                    {item.images && item.images.length > 0 && (
                      <span className="inline-block text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono">
                        🖼️ {item.images.length} Slides
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`text-xs font-bold flex items-center gap-1.5 ${item.active ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {item.active ? <MdCheckCircle /> : <MdCancel />}
                    {item.active ? tUi('publishedStatus') : tUi('hiddenStatus')}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      title="Preview"
                    >
                      <MdPhotoLibrary />
                    </button>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => item._id && handleDelete(item._id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right text-sm text-white/80" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">{tUi('tableWork')}</th>
                <th className="p-4">{tUi('tableCategory')}</th>
                <th className="p-4">{tUi('tableClient')}</th>
                <th className="p-4">{tUi('tableDate')}</th>
                <th className="p-4">{tUi('tableStatus')}</th>
                <th className="p-4 text-center">{tUi('tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => {
                const titleText = getLocValue(item.title, locale);

                return (
                  <tr key={item._id} className="hover:bg-white/5 transition-all">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                        <img
                          src={item.coverImage || item.mediaUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                          alt={titleText}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div>{titleText}</div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-venecos-gold">{item.category}</td>
                    <td className="p-4 text-xs">{item.client || '—'}</td>
                    <td className="p-4 text-xs text-white/60">{item.date || '—'}</td>
                    <td className="p-4 text-xs font-bold">
                      <span className={item.active ? 'text-emerald-400' : 'text-red-400'}>
                        {item.active ? tUi('publishedStatus') : tUi('hiddenStatus')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => item._id && handleDelete(item._id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal matching multi-language + video/carousel & Cloudinary Device Upload controls */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdPhotoLibrary className="text-venecos-gold" />
                {editingItem ? tUi('editWork') : tUi('addNewWork')}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Category & Media Type & Client */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('categoryLabel')} *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-venecos-black border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                  >
                    <option value="identity">هوية بصرية (Identity)</option>
                    <option value="video">إنتاج فيديو (Video Production)</option>
                    <option value="software">برامج ومواقع (Software/Web)</option>
                    <option value="print">طباعة إعلانية (Printing)</option>
                    <option value="other">أخرى (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('mediaTypeLabel')} *</label>
                  <select
                    value={formData.mediaType || 'image'}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                    className="w-full bg-venecos-black border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                  >
                    <option value="image">📷 صورة (Single Image)</option>
                    <option value="video">🎬 فيديو (Video MP4 / YouTube)</option>
                    <option value="carousel">🖼️ معرض صور متعدد (Carousel Slides)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('clientLabel')}</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="Company name..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                  />
                </div>
              </div>

              {/* Cloudinary Uploaders for Cover Image and Video */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <CloudinaryUploader
                    label={tUi('coverImageLabel')}
                    sublabel="JPG, PNG, WEBP"
                    acceptTypes="image/*"
                    onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
                    currentUrl={formData.coverImage}
                  />
                </div>

                <div className="space-y-2">
                  <CloudinaryUploader
                    label={tUi('videoUrlLabel')}
                    sublabel="MP4, WEBM, MOV"
                    acceptTypes="video/*"
                    mediaType="video"
                    onUploadSuccess={(url) => setFormData({ ...formData, videoUrl: url, mediaType: 'video' })}
                    currentUrl={formData.videoUrl}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('demoUrlLabel')}</label>
                <input
                  type="text"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://client-website.com"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              {/* Cloudinary Multiple Slide Uploads for Carousel */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <CloudinaryUploader
                  label={tUi('additionalImagesLabel')}
                  sublabel="اختر صورة/فيديو من جهازك لإضافتها لشرائح المعرض"
                  acceptTypes="image/*,video/*"
                  onUploadSuccess={(url) => {
                    if (url) {
                      setFormData((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), url],
                        mediaType: prev.images && prev.images.length > 0 ? 'carousel' : prev.mediaType,
                      }));
                    }
                  }}
                />

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="أو أدخل رابط صورة مباشر (URL)..."
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-xs font-bold hover:bg-venecos-gold/30"
                  >
                    {tUi('addImageBtn')}
                  </button>
                </div>

                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative h-20 rounded-lg overflow-hidden border border-white/10 group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all shadow-md"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Multi-language Texts */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-venecos-gold">
                    {locale === 'ar' ? 'النصوص بالأربع لغات' : 'Multi-Language Text Content'}
                  </h3>
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
                    <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('titleLabel')} ({activeLangTab.toUpperCase()}) *</label>
                    <input
                      type="text"
                      required
                      value={formData.title[activeLangTab]}
                      onChange={(e) => setFormData({
                        ...formData,
                        title: { ...formData.title, [activeLangTab]: e.target.value }
                      })}
                      placeholder="Project title..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('descLabel')} ({activeLangTab.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={formData.description[activeLangTab]}
                      onChange={(e) => setFormData({
                        ...formData,
                        description: { ...formData.description, [activeLangTab]: e.target.value }
                      })}
                      placeholder="Detailed project description..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
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
                  {tUi('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">{getLocValue(previewItem.title, locale)}</h3>
              <button onClick={() => setPreviewItem(null)} className="text-white/60 hover:text-white">✕</button>
            </div>
            <div className="h-64 rounded-xl overflow-hidden bg-gray-900">
              {(previewItem.mediaType === 'video' || previewItem.videoUrl) && (previewItem.videoUrl || previewItem.mediaUrl)?.trim() ? (
                <video src={previewItem.videoUrl || previewItem.mediaUrl} controls className="w-full h-full object-cover" />
              ) : (
                <img
                  src={previewItem.coverImage || previewItem.mediaUrl || (previewItem.images && previewItem.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{getLocValue(previewItem.description, locale)}</p>
            {previewItem.demoUrl && (
              <a
                href={previewItem.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                <MdLaunch /> Demo URL
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

