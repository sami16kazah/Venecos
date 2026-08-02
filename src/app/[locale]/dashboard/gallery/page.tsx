'use client';

import { useState, useEffect } from 'react';
import { 
  MdAdd, MdEdit, MdDelete, MdPhotoLibrary, MdFilterList, 
  MdGridView, MdFormatListBulleted 
} from 'react-icons/md';

interface IGalleryItem {
  _id?: string;
  title: { ar: string; en: string; fr: string; de: string };
  description: { ar: string; en: string; fr: string; de: string };
  category: 'identity' | 'video' | 'software' | 'print' | 'other';
  mediaType: 'image' | 'video';
  mediaUrl: string;
  active: boolean;
}

export default function GalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IGalleryItem | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');

  const [formData, setFormData] = useState<IGalleryItem>({
    title: { ar: '', en: '', fr: '', de: '' },
    description: { ar: '', en: '', fr: '', de: '' },
    category: 'identity',
    mediaType: 'image',
    mediaUrl: '',
    active: true,
  });

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
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: { ar: '', en: '', fr: '', de: '' },
        description: { ar: '', en: '', fr: '', de: '' },
        category: 'identity',
        mediaType: 'image',
        mediaUrl: '',
        active: true,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/gallery/${editingItem._id}` : '/api/gallery';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    if (!confirm('هل أنت تأكد من حذف هذا العمل؟')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdPhotoLibrary className="text-venecos-gold text-3xl" />
            معرض الأعمال — Portfolio Gallery
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            يظهر على الموقع الرئيسي للزوار ({items.length} عمل مضاف)
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

      {/* Category Bar & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'identity', label: 'هوية بصرية' },
            { id: 'video', label: 'إنتاج فيديو' },
            { id: 'software', label: 'برامج ومواقع' },
            { id: 'print', label: 'طباعة' },
            { id: 'other', label: 'أخرى' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat.id
                  ? 'bg-venecos-gold text-black shadow-md'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
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
              className="bg-venecos-black/70 border border-white/10 hover:border-venecos-gold/40 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-gray-900 overflow-hidden relative">
                  {item.mediaType === 'image' ? (
                    <img src={item.mediaUrl} alt={item.title.ar} className="w-full h-full object-cover" />
                  ) : (
                    <iframe src={item.mediaUrl} className="w-full h-full" />
                  )}
                  <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-venecos-gold text-xs font-bold px-3 py-1 rounded-full border border-venecos-gold/30">
                    {item.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">{item.title.ar || item.title.en}</h3>
                  <p className="text-xs text-white/60 line-clamp-2">{item.description.ar || item.description.en}</p>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
                <span className={`text-xs font-bold ${item.active ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.active ? '● معروض' : '○ مخفي'}
                </span>
                <div className="flex gap-2">
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
                <th className="p-4">النوع</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4 font-bold text-white">{item.title.ar || item.title.en}</td>
                  <td className="p-4 text-xs text-venecos-gold">{item.category}</td>
                  <td className="p-4 text-xs">{item.mediaType}</td>
                  <td className="p-4 text-xs font-bold">
                    <span className={item.active ? 'text-emerald-400' : 'text-red-400'}>
                      {item.active ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(item)} className="p-2 bg-white/10 hover:bg-venecos-gold/20 text-white rounded-lg">
                        <MdEdit />
                      </button>
                      <button onClick={() => item._id && handleDelete(item._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg">
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdPhotoLibrary className="text-venecos-gold" />
                {editingItem ? 'تعديل عمل' : 'إضافة عمل جديد'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">التصنيف</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  >
                    <option value="identity">هوية بصرية</option>
                    <option value="video">إنتاج فيديو</option>
                    <option value="software">برامج ومواقع</option>
                    <option value="print">طباعة</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">نوع الوسائط</label>
                  <select
                    value={formData.mediaType}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  >
                    <option value="image">صورة (Image)</option>
                    <option value="video">فيديو (Embed Video Link)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">رابط الوسائط (Image or Embed URL) *</label>
                <input
                  type="text"
                  required
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                />
              </div>

              {/* Multi language */}
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
                      عنوان العمل ({activeLangTab.toUpperCase()})
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
                      وصف العمل ({activeLangTab.toUpperCase()})
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
                  عرض العمل في معرض الموقع
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
                    حفظ العمل
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
