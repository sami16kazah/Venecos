'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdPrint, MdArrowBack } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function PaperPrintServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'الطباعة الورقية والكتيبات', en: 'Paper Printing & Brochures', fr: 'Impression papier & Brochures', de: 'Papierdruck & Broschüren' },
    priceFrom: 15,
    priceTo: 300,
    coverImage: '',
    paperTypes: ['80g عادي', '150g كوشيه لامع', '300g مقوى'],
    sizes: ['A4', 'A5', 'A3', 'Flyer DL'],
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdPrint />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة الطباعة الورقية (Paper Print)</h1>
            <p className="text-xs text-white/60">كتيبات، بروشورات، كروت شخصية، خيارات GSM والقص</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-venecos-gold">رفع غلاف ورسم الطباعة (Cloudinary Uploader)</h3>
        <CloudinaryUploader
          label="إسقاط تصميم الكروت أو الكتيبات"
          currentUrl={formData.coverImage}
          onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
        />
      </div>
    </div>
  );
}
