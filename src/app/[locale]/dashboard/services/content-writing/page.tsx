'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdEditDocument, MdArrowBack } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function ContentWritingServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'كتابة المحتوى وصياغة المقالات (Content Writing)', en: 'Content Writing & Copywriting', fr: 'Rédaction de contenu', de: 'Texterstellung & Redaktion' },
    pricePer100Words: 5,
    coverImage: '',
    sampleDocUrl: '',
    styles: ['تسويقي جذاب', 'تقني متخصص', 'محتوى SEO للمواقع', 'سيناريو فيديو / سكريبت'],
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdEditDocument />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة كتابة المحتوى (Content Writing)</h1>
            <p className="text-xs text-white/60">باقات الكلمات، صياغة سيناريو، ورفع نماذج المقالات PDF/DOCX 1:1</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">رفع غلاف كتابة المحتوى (Cloudinary Uploader)</h3>
          <CloudinaryUploader
            label="إسقاط صورة غلاف الخدمة"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">رفع مستند نموذج مقال (PDF / DOCX Document Uploader)</h3>
          <CloudinaryUploader
            label="رفع ملف مستند PDF أو Word"
            acceptTypes=".pdf,.doc,.docx"
            mediaType="raw"
            currentUrl={formData.sampleDocUrl}
            onUploadSuccess={(url) => setFormData({ ...formData, sampleDocUrl: url })}
          />
        </div>
      </div>
    </div>
  );
}
