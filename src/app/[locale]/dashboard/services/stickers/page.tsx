'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdLabel, MdArrowBack } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function StickersServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'طباعة الملصقات وتسميات المنتجات (Stickers)', en: 'Sticker Labels & Custom Die-Cut', fr: 'Autocollants & Étiquettes sur mesure', de: 'Sticker & Etiketten' },
    pricePerM2: 12,
    minQty: 100,
    coverImage: '',
    materials: ['Vinyl مقاوم للماء', 'Paper Glossy', 'Transparent شفاف', 'Metallic ذهبي'],
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdLabel />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة طباعة الملصقات (Sticker Printing)</h1>
            <p className="text-xs text-white/60">حاسبة المتر المربع m²، المواد، وقص الفينيل المخصص</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">غلاف وصور عينات الملصقات (Cloudinary Uploader)</h3>
        <CloudinaryUploader
          label="إسقاط صورة عينة الاستيكر"
          currentUrl={formData.coverImage}
          onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
        />
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">أسعار وسعة الإنتاج</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">السعر للمتر المربع (€/m²)</label>
            <input type="number" value={formData.pricePerM2} onChange={(e) => setFormData({ ...formData, pricePerM2: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">الحد الأدنى للطلب (قطع)</label>
            <input type="number" value={formData.minQty} onChange={(e) => setFormData({ ...formData, minQty: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center" />
          </div>
        </div>
      </div>
    </div>
  );
}
