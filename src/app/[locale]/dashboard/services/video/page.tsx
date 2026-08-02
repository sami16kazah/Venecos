'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdVideocam, MdArrowBack, MdSave, MdCheckCircle } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function VideoServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'إنتاج الفيديو والموشن جرافيك', en: 'Video Production & Motion Graphics', fr: 'Production vidéo & Motion design', de: 'Videoproduktion & Motion Graphics' },
    priceFrom: 350,
    priceTo: 1500,
    daysFrom: 5,
    daysTo: 14,
    durFrom: 30,
    durTo: 180,
    durUnit: 'ثانية',
    resolutions: ['1080p Full HD', '4K Ultra HD', 'Vertical 9:16'],
    coverType: 'video',
    coverMediaUrl: '',
    exampleVideoUrl: '',
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdVideocam />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة خدمة إنتاج الفيديو (Video Production)</h1>
            <p className="text-xs text-white/60">موشن جرافيك، مونتاج 4K، خيارات الغلاف وعرض الأمثلة</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      {/* Cloudinary Video Uploaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-venecos-gold">فيديو/صورة الغلاف (Cloudinary Video Uploader)</h3>
          <CloudinaryUploader
            label="رفع فيديو الغلاف (MP4/WebM)"
            acceptTypes="video/*,image/*"
            currentUrl={formData.coverMediaUrl}
            onUploadSuccess={(url) => setFormData({ ...formData, coverMediaUrl: url })}
          />
        </div>

        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-venecos-gold">فيديو نموذج الإنجازات (Example Video)</h3>
          <CloudinaryUploader
            label="رفع فيديو نموذج عمل سابق"
            acceptTypes="video/*"
            currentUrl={formData.exampleVideoUrl}
            onUploadSuccess={(url) => setFormData({ ...formData, exampleVideoUrl: url })}
          />
        </div>
      </div>

      {/* Resolution & Specs */}
      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">المواصفات والدقة والمدة</h3>
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
            <label className="block text-xs font-bold text-white/80 mb-1">مدة الفيديو من (ثانية)</label>
            <input type="number" value={formData.durFrom} onChange={(e) => setFormData({ ...formData, durFrom: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-purple-400 font-bold text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">مدة الفيديو إلى (ثانية)</label>
            <input type="number" value={formData.durTo} onChange={(e) => setFormData({ ...formData, durTo: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-purple-400 font-bold text-center" />
          </div>
        </div>
      </div>
    </div>
  );
}
