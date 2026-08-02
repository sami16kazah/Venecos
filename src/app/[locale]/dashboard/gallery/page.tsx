'use client';

import { useState, useEffect } from 'react';
import { 
  MdAdd, MdEdit, MdDelete, MdPhotoLibrary, 
  MdGridView, MdFormatListBulleted, MdCheckCircle, MdCancel,
  MdLaunch, MdImage, MdVideoLibrary, MdCode, MdPrint, MdColorLens
} from 'react-icons/md';

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
  mediaType: 'image' | 'video';
  mediaUrl?: string;
  active: boolean;
  status?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: MdPhotoLibrary, color: 'text-white' },
  { id: 'identity', label: 'هوية بصرية', icon: MdColorLens, color: 'text-purple-400' },
  { id: 'video', label: 'إنتاج فيديو', icon: MdVideoLibrary, color: 'text-blue-400' },
  { id: 'software', label: 'برامج وم مواقع', icon: MdCode, color: 'text-emerald-400' },
  { id: 'print', label: 'طباعة إعلانية', icon: MdPrint, color: 'text-amber-400' },
  { id: 'other', label: 'أخرى', icon: MdPhotoLibrary, color: 'text-white/60' },
];

export default function GalleryPage() {
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
        mediaUrl: formData.coverImage || formData.mediaUrl || (formData.images && formData.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
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
    if (!confirm('هل أنت تأكد من حذف هذا العمل من المعرض؟')) return;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdPhotoLibrary className="text-venecos-gold text-3xl" />
            معرض الأعمال (Portfolio Gallery)
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            إدارة أعمال ومعارض الشركة على الموقع الرئيسي ({items.length} عمل مضاف)
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          إضافة عمل جديد
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
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : items.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdPhotoLibrary className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">المعرض فارغ لهذا التصنيف</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <MdAdd /> إضافة أول عمل
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className={`bg-venecos-black/70 border ${item.active ? 'border-white/10 hover:border-venecos-gold/40' : 'border-red-500/20 opacity-60'} rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="h-48 bg-gray-900 overflow-hidden relative">
                  <img
                    src={item.coverImage || item.mediaUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title.ar || 'Gallery Work'}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-venecos-gold text-[11px] font-bold px-3 py-1 rounded-full border border-venecos-gold/30">
                    {item.category.toUpperCase()}
                  </span>
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
                    {item.title.ar || item.title.en || 'بدون عنوان'}
                  </h3>
                  {item.client && (
                    <p className="text-xs text-venecos-gold font-medium">🏢 العميل: {item.client}</p>
                  )}
                  <p className="text-xs text-white/60 line-clamp-2">
                    {item.description.ar || item.description.en || 'لا يوجد وصف'}
                  </p>
                  {item.images && item.images.length > 0 && (
                    <span className="inline-block text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      🖼️ {item.images.length} صور مرفقة
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
                  {item.active ? 'منشور' : 'مخفي'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    title="معاينة"
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
          ))}
        </div>
      ) : (
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right text-sm text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">العمل</th>
                <th className="p-4">التصنيف</th>
                <th className="p-4">العميل</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <div className="w-12 h-9 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                      <img
                        src={item.coverImage || item.mediaUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                        alt={item.title.ar}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div>{item.title.ar || item.title.en}</div>
                      <div className="text-[11px] text-white/40 font-normal">{item.title.en}</div>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-venecos-gold">{item.category}</td>
                  <td className="p-4 text-xs">{item.client || '—'}</td>
                  <td className="p-4 text-xs text-white/60">{item.date || '—'}</td>
                  <td className="p-4 text-xs font-bold">
                    <span className={item.active ? 'text-emerald-400' : 'text-red-400'}>
                      {item.active ? 'منشور' : 'مخفي'}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal matching legacy 1:1 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdPhotoLibrary className="text-venecos-gold" />
                {editingItem ? 'تعديل عمل المعرض' : 'إضافة عمل جديد للمعرض'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Category & Client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">التصنيف (Category) *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-venecos-black border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                  >
                    <option value="identity">هوية بصرية (Identity)</option>
                    <option value="video">إنتاج فيديو (Video Production)</option>
                    <option value="software">برامج وم مواقع (Software/Web)</option>
                    <option value="print">طباعة إعلانية (Printing)</option>
                    <option value="other">أخرى (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">اسم العميل / الشركة (Client Name)</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="مثال: شركة الأمل، مطعم نور..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                  />
                </div>
              </div>

              {/* Cover Image & Demo URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">صورة الغلاف (Cover Image URL) *</label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">رابط المعاينة المباشرة (Demo URL)</label>
                  <input
                    type="text"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://client-website.com"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                  />
                </div>
              </div>

              {/* Multiple Gallery Images */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white/90">صور العمل الإضافية (Gallery Images)</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-venecos-gold outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-xs font-bold hover:bg-venecos-gold/30"
                  >
                    إضافة
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
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all"
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
                  <h3 className="text-sm font-bold text-venecos-gold">النصوص بالأربع لغات</h3>
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
                        {lang === 'ar' ? '🇸🇦 العربية' : lang === 'en' ? '🇬🇧 English' : lang === 'fr' ? '🇫🇷 Français' : '🇩🇪 Deutsch'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1.5">عنوان العمل ({activeLangTab.toUpperCase()}) *</label>
                    <input
                      type="text"
                      required
                      value={formData.title[activeLangTab]}
                      onChange={(e) => setFormData({
                        ...formData,
                        title: { ...formData.title, [activeLangTab]: e.target.value }
                      })}
                      placeholder="عنوان المشروع..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1.5">وصف العمل ({activeLangTab.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={formData.description[activeLangTab]}
                      onChange={(e) => setFormData({
                        ...formData,
                        description: { ...formData.description, [activeLangTab]: e.target.value }
                      })}
                      placeholder="وصف تفصيلي للمشروع والخدمات المنجزة..."
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
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black text-sm font-bold shadow-lg transition-all"
                >
                  {editingItem ? 'حفظ التعديلات' : 'إضافة العمل'}
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
              <h3 className="text-lg font-bold text-white">{previewItem.title.ar || previewItem.title.en}</h3>
              <button onClick={() => setPreviewItem(null)} className="text-white/60 hover:text-white">✕</button>
            </div>
            <div className="h-64 rounded-xl overflow-hidden bg-gray-900">
              <img
                src={previewItem.coverImage || previewItem.mediaUrl}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{previewItem.description.ar || previewItem.description.en}</p>
            {previewItem.demoUrl && (
              <a
                href={previewItem.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                <MdLaunch /> زيارة رابط المعاينة Mباشرة
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
