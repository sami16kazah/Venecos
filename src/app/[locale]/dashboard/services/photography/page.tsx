'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdCameraAlt, MdArrowBack, MdSave, MdCheckCircle } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function PhotographyServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'التصميم الفوتوغرافي والجلسات الاحترافية', en: 'Professional Photography & Retouching', fr: 'Photographie professionnelle', de: 'Professionelle Fotografie' },
    priceFrom: 200,
    priceTo: 800,
    daysFrom: 3,
    daysTo: 7,
    coverImage: '',
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdCameraAlt />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة خدمة التصميم الفوتوغرافي (Photography)</h1>
            <p className="text-xs text-white/60">تصوير المنتجات والفعاليات ومعالجة الصور بالألوان</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">رفع غلاف الجلسة التصويرية (Cloudinary Uploader)</h3>
        <CloudinaryUploader
          label="إسقاط صورة غلاف الخدمة"
          currentUrl={formData.coverImage}
          onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
        />
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">السعر وفترة التسليم</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">السعر من (€)</label>
            <input type="number" value={formData.priceFrom} onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">السعر إلى (€)</label>
            <input type="number" value={formData.priceTo} onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">التسليم من (أيام)</label>
            <input type="number" value={formData.daysFrom} onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">التسليم إلى (أيام)</label>
            <input type="number" value={formData.daysTo} onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center" />
          </div>
        </div>
      </div>
    </div>
  );
}
