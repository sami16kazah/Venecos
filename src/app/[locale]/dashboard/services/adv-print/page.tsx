'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdCampaign, MdArrowBack } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function AdvPrintServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'الطباعة الإعلانية والدعائية', en: 'Advertising & Promotional Printing', fr: 'Impression publicitaire', de: 'Werbedruck' },
    priceFrom: 5,
    priceTo: 100,
    coverImage: '',
    techniques: ['Silk Screen طباعة حريرية', 'UV Digital', 'Laser Engraving حفر ليزر', 'Foil Stamping ذهبي/فضائي'],
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdCampaign />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة الطباعة الإعلانية (Advertising Print)</h1>
            <p className="text-xs text-white/60">أكواب، أقلام، تيشيرتات، هدايا دعاية، وتقنيات Silk Screen & UV</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">رفع غلاف الهدايا الإعلانية (Cloudinary Uploader)</h3>
        <CloudinaryUploader
          label="إسقاط صورة الأكواب أو المطبوعات الإعلانية"
          currentUrl={formData.coverImage}
          onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
        />
      </div>
    </div>
  );
}
