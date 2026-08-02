'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdCode, MdArrowBack, MdSave, MdCheckCircle } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function ProgrammingServicePage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: { ar: 'خدمة البرمجة والتطوير المخصص', en: 'Custom Software & Web Development', fr: 'Développement sur mesure', de: 'Individuelle Softwareentwicklung' },
    shortDesc: { ar: 'تطوير مواقع، برامج، وتطبيقات حسب الطلب', en: 'Custom web, app & software solutions', fr: 'Solutions web et logiciels sur mesure', de: 'Maßgeschneiderte Web- und Softwarelösungen' },
    priceFrom: 300,
    priceTo: 5000,
    daysFrom: 5,
    daysTo: 30,
    coverImage: '',
    galleryImages: [] as string[],
    fullContent: {
      ar: 'نطور برمجيات متكاملة بمواصفات عالية وفق أحدث التقنيات (React, Next.js, Node.js, PHP, Python).\n\nيشمل:\n• البنية التحتية وقواعد البيانات\n• تصميم الواجهات الذكية UX/UI\n• ضمان واستقرار التشغيل',
      en: 'Full-stack software development with React, Next.js, Node.js & cloud infrastructure.',
      fr: 'Développement web et logiciel complet avec technologies modernes.',
      de: 'Vollständige Softwareentwicklung mit modernen Webtechnologien.'
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdCode />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة خدمة البرمجة (Programming Service)</h1>
            <p className="text-xs text-white/60">استمارة خاصة بمواصفات وأسعار ومرفقات خدمة البرمجة</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> العودة للخدمات
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cover Upload via Cloudinary */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">صورة غلاف الخدمة (Cloudinary Uploader)</h3>
          <CloudinaryUploader
            label="إسقاط صورة غلاف الخدمة هنا"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Pricing & Delivery */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">السعر وفترة التسليم</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">السعر من (€)</label>
              <input
                type="number"
                value={formData.priceFrom}
                onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">السعر إلى (€)</label>
              <input
                type="number"
                value={formData.priceTo}
                onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">التسليم من (أيام)</label>
              <input
                type="number"
                value={formData.daysFrom}
                onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">التسليم إلى (أيام)</label>
              <input
                type="number"
                value={formData.daysTo}
                onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center"
              />
            </div>
          </div>
        </div>

        {/* Texts Multi-language */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">النصوص والشرح التفصيلي</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">العنوان (عربي)</label>
              <input
                type="text"
                value={formData.title.ar}
                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">الشرح التفصيلي (عربي)</label>
              <textarea
                rows={5}
                value={formData.fullContent.ar}
                onChange={(e) => setFormData({ ...formData, fullContent: { ...formData.fullContent, ar: e.target.value } })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم الحفظ بنجاح</span>}
          <button type="submit" className="flex items-center gap-2 bg-venecos-gold text-black font-bold px-6 py-2.5 rounded-xl shadow-lg hover:opacity-90">
            <MdSave /> حفظ الإعدادات
          </button>
        </div>
      </form>
    </div>
  );
}
