'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdMic, MdArrowBack } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function VoiceOverServicePage() {
  const [formData, setFormData] = useState({
    title: { ar: 'خدمات التعليق الصوتي الاحترافي (Voice Over)', en: 'Voice Over & Audio Dubbing', fr: 'Voix off professionnelle', de: 'Professionelles Voiceover' },
    pricePerMinute: 25,
    minPrice: 50,
    coverImage: '',
    sampleAudioUrl: '',
    accents: ['الفصحى البيضاء', 'الخليجية', 'المصرية', 'الشامية', 'English US', 'English UK', 'Deutsch'],
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdMic />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة خدمة التعليق الصوتي (Voice Over)</h1>
            <p className="text-xs text-white/60">لهجات متعددة، تسجيل عينات صوتية عبر Cloudinary 1:1</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">رفع غلاف الاستوديو والصوت (Cloudinary Uploader)</h3>
          <CloudinaryUploader
            label="إسقاط صورة غلاف التعليق الصوتي"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">رفع عينة صوتية (Audio Sample MP3/WAV)</h3>
          <CloudinaryUploader
            label="رفع عينة صوتية (MP3, WAV)"
            acceptTypes="audio/*,video/*"
            currentUrl={formData.sampleAudioUrl}
            onUploadSuccess={(url) => setFormData({ ...formData, sampleAudioUrl: url })}
          />
        </div>
      </div>
    </div>
  );
}
