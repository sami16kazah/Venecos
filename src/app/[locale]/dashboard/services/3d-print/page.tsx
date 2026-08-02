'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Md3dRotation, MdArrowBack } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function ThreeDPrintServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'الطباعة ثلاثية الأبعاد (3D Printing)', en: '3D Printing & Prototyping', fr: 'Impression 3D & Prototypage', de: '3D-Druck & Prototypenbau' },
    pricePerGram: 0.15,
    sampleStlFile: '',
    coverImage: '',
    materials: [
      { name: 'PLA Standard', priceGram: 0.12 },
      { name: 'PETG Technical', priceGram: 0.18 },
      { name: 'ABS Heavy Duty', priceGram: 0.22 },
      { name: 'Resin Ultra High-Detail', priceGram: 0.35 },
    ],
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <Md3dRotation />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة الطباعة ثلاثية الأبعاد (3D Printing)</h1>
            <p className="text-xs text-white/60">حاسبة الغرامات، رفع ملفات STL/OBJ عبر Cloudinary 1:1</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">رفع غلاف المجسمات المطبوعة (Cloudinary Uploader)</h3>
          <CloudinaryUploader
            label="إسقاط صورة غلاف الطباعة الـ 3D"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">رفع ملف نموذجي (.STL / .OBJ Document Uploader)</h3>
          <CloudinaryUploader
            label="رفع ملف STL أو OBJ نموذج تجريبي"
            acceptTypes=".stl,.obj,.zip,.rar"
            mediaType="raw"
            currentUrl={formData.sampleStlFile}
            onUploadSuccess={(url) => setFormData({ ...formData, sampleStlFile: url })}
          />
        </div>
      </div>
    </div>
  );
}
