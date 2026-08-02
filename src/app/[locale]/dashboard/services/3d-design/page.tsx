'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdViewInAr, MdArrowBack, MdSave } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function ThreeDDesignServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'التصميم والرندر ثلاثي الأبعاد (3D Design)', en: '3D Design & Rendering', fr: 'Modélisation et rendu 3D', de: '3D-Design & Rendering' },
    priceFrom: 250,
    priceTo: 1200,
    daysFrom: 4,
    daysTo: 10,
    sketchfabEmbed: 'https://sketchfab.com/models/baed39352e804fca920b13ba8110fb27/embed',
    coverImage: '',
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdViewInAr />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة خدمة التصميم ثلاثي الأبعاد (3D Design)</h1>
            <p className="text-xs text-white/60">مجسمات، رندر زوايا، وعرض تفاعلي عبر Sketchfab 1:1</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">رفع غلاف مجسم الـ 3D (Cloudinary Uploader)</h3>
        <CloudinaryUploader
          label="إسقاط صورة الرندر أو مجسم 3D"
          currentUrl={formData.coverImage}
          onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
        />
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">رابط تضمين Sketchfab 3D Viewer</h3>
        <input
          type="text"
          value={formData.sketchfabEmbed}
          onChange={(e) => setFormData({ ...formData, sketchfabEmbed: e.target.value })}
          placeholder="https://sketchfab.com/models/.../embed"
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm"
        />
      </div>
    </div>
  );
}
