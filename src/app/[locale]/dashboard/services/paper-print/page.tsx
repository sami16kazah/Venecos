'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdPrint, MdArrowBack, MdCheckCircle, MdImage } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function PaperPrintServicePage() {
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    nameAr: 'بطاقة عمل فاخرة',
    nameEn: 'Premium Business Card',
    nameFr: 'Carte de visite premium',
    nameDe: 'Premium Visitenkarte',

    descAr: 'وصف قصير يظهر في البطاقة...',
    descEn: 'Short description for the card...',
    descFr: 'Description courte...',
    descDe: 'Kurzbeschreibung...',

    coverImage: '',
    galleryImages: [] as string[],
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header matching Screenshot 2 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MdPrint className="text-venecos-gold text-3xl" />
          إضافة منتج طباعة جديد
        </h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/services" className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack /> رجوع
          </Link>
          <button type="button" onClick={handleSave} className="px-4 py-2 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
            💾 مسودة
          </button>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            ✓ حفظ ونشر
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: 4 Languages Grid matching Screenshot 2 */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            🌐 اسم المنتج بالأربع لغات
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic */}
            <div className="bg-white/5 border border-venecos-gold/30 rounded-2xl p-5 space-y-4">
              <div className="bg-venecos-gold/20 border border-venecos-gold/40 text-venecos-gold px-3 py-1 rounded-xl text-xs font-bold inline-block">
                SA العربية
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">الاسم / Name *</label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: بطاقة عمل فاخرة"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">وصف مختصر</label>
                <textarea
                  rows={3}
                  value={formData.descAr}
                  onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                  placeholder="وصف قصير يظهر في البطاقة..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
                />
              </div>
            </div>

            {/* English */}
            <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                GB English
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Name / الاسم *</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Premium Business Card"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Short description</label>
                <textarea
                  rows={3}
                  value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  placeholder="Short description..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* French */}
            <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                FR Français
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Nom / Name *</label>
                <input
                  type="text"
                  value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  placeholder="ex: Carte de visite premium"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Description courte</label>
                <textarea
                  rows={3}
                  value={formData.descFr}
                  onChange={(e) => setFormData({ ...formData, descFr: e.target.value })}
                  placeholder="Description courte..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* German */}
            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                DE Deutsch
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={formData.nameDe}
                  onChange={(e) => setFormData({ ...formData, nameDe: e.target.value })}
                  placeholder="z.B. Premium Visitenkarte"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Kurzbeschreibung</label>
                <textarea
                  rows={3}
                  value={formData.descDe}
                  onChange={(e) => setFormData({ ...formData, descDe: e.target.value })}
                  placeholder="Kurzbeschreibung..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Mockup Photos Dropzone matching Screenshot 2 */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdImage /> صور المنتج (Mockups) — الصورة الأولى تكون الغلاف (max 7 صور)
          </h3>
          <CloudinaryUploader
            label="اسحب أو انقر لرفع صور المنتج (Mockups)"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Sticky Bottom Bar matching Screenshot 2 */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم الحفظ بنجاح</span>}</div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/services" className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              إلغاء
            </Link>
            <button type="button" onClick={handleSave} className="px-5 py-2.5 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
              💾 مسودة
            </button>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              ✓ حفظ ونشر
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
