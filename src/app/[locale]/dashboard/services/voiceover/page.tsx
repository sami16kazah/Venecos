'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdMic, MdArrowBack, MdCheckCircle, MdAudioFile, MdTune, MdSave } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function VoiceOverServicePage() {
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [saved, setSaved] = useState(false);

  const [accents] = useState<string[]>(['الفصحى البيضاء', 'الخليجية (Saudi/UAE)', 'المصرية', 'الشامية', 'English (US)', 'English (UK)', 'Deutsch', 'Français']);
  const [genders] = useState<string[]>(['رجل (Male)', 'امرأة (Female)', 'طفل (Child)']);
  const [purposes] = useState<string[]>(['إعلانات تجارية', 'وثائقيات وشارحة', 'رد آلي IVR', 'كتب صوتية', 'أفلام ورسوم متحركة']);

  const [selectedAccents, setSelectedAccents] = useState<string[]>(['الفصحى البيضاء', 'الخليجية (Saudi/UAE)', 'English (US)']);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(['رجل (Male)', 'امرأة (Female)']);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(['إعلانات تجارية', 'وثائقيات وشارحة']);

  const [formData, setFormData] = useState({
    title: { ar: 'خدمات التعليق الصوتي والدوبلاج الاحترافي', en: 'Professional Voice Over & Audio Dubbing', fr: 'Voix off professionnelle', de: 'Professionelles Voiceover' },
    shortDesc: { ar: 'تسجيلات استوديو معالجة من الهندسة الصوتية بشتى اللغات واللهجات', en: 'Studio recordings with audio engineering in various accents', fr: 'Enregistrements studio de haute qualité', de: 'Studioaufnahmen in verschiedenen Sprachen' },
    pricePerMin: 25,
    minOrderPrice: 50,
    deliveryHoursFrom: 24,
    deliveryHoursTo: 72,
    coverImage: '',
    sampleAudioUrl: '',
  });

  const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdMic />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة خدمة التعليق الصوتي (Voice Over 1:1)</h1>
            <p className="text-xs text-white/60">تسجيلات الاستوديو، خيارات اللهجات، والعينات الصوتية عبر Cloudinary</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Multilingual Text */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">النصوص باللغات الأربع</h3>
            <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {(['ar', 'en', 'fr', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    activeLangTab === lang ? 'bg-venecos-gold text-black shadow' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? '🇸🇦 العربية' : lang === 'en' ? '🇬🇧 English' : lang === 'fr' ? '🇫🇷 Français' : '🇩🇪 Deutsch'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">عنوان الخدمة ({activeLangTab.toUpperCase()})</label>
              <input
                type="text"
                value={formData.title[activeLangTab]}
                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [activeLangTab]: e.target.value } })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">وصف مختصر ({activeLangTab.toUpperCase()})</label>
              <textarea
                rows={2}
                value={formData.shortDesc[activeLangTab]}
                onChange={(e) => setFormData({ ...formData, shortDesc: { ...formData.shortDesc, [activeLangTab]: e.target.value } })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Media & Audio Sample Cloudinary Uploaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-venecos-gold">غلاف الاستوديو (Cloudinary Uploader)</h3>
            <CloudinaryUploader
              label="إسقاط صورة غلاف التعليق الصوتي"
              currentUrl={formData.coverImage}
              onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
            />
          </div>

          <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
              <MdAudioFile /> عينة نموذج صوتي (MP3/WAV Uploader)
            </h3>
            <CloudinaryUploader
              label="رفع ملف عينة صوتية (MP3 / WAV)"
              acceptTypes="audio/*,video/*"
              mediaType="raw"
              currentUrl={formData.sampleAudioUrl}
              onUploadSuccess={(url) => setFormData({ ...formData, sampleAudioUrl: url })}
            />
          </div>
        </div>

        {/* Accent, Gender & Purpose Selection Chips */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdTune /> خيارات اللهجات والأصوات والمجال
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">اللهجات واللغات المتاحة (Accents)</label>
            <div className="flex flex-wrap gap-2">
              {accents.map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => toggleSelection(selectedAccents, setSelectedAccents, acc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedAccents.includes(acc)
                      ? 'bg-venecos-gold/20 text-venecos-gold border-venecos-gold shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedAccents.includes(acc) ? '✓ ' : ''}{acc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">نوع الصوت (Gender)</label>
            <div className="flex flex-wrap gap-2">
              {genders.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleSelection(selectedGenders, setSelectedGenders, g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedGenders.includes(g)
                      ? 'bg-pink-500/20 text-pink-400 border-pink-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedGenders.includes(g) ? '✓ ' : ''}{g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">مجال الاستخدام (Purpose)</label>
            <div className="flex flex-wrap gap-2">
              {purposes.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleSelection(selectedPurposes, setSelectedPurposes, p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedPurposes.includes(p)
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedPurposes.includes(p) ? '✓ ' : ''}{p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Delivery Rates */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">أسعار الدقيقة وتسليم الملفات الصوتية</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">السعر للدقيقة (€/min)</label>
              <input type="number" value={formData.pricePerMin} onChange={(e) => setFormData({ ...formData, pricePerMin: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">الحد الأدنى للطلب (€)</label>
              <input type="number" value={formData.minOrderPrice} onChange={(e) => setFormData({ ...formData, minOrderPrice: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">التسليم من (ساعة)</label>
              <input type="number" value={formData.deliveryHoursFrom} onChange={(e) => setFormData({ ...formData, deliveryHoursFrom: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">التسليم إلى (ساعة)</label>
              <input type="number" value={formData.deliveryHoursTo} onChange={(e) => setFormData({ ...formData, deliveryHoursTo: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          {saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم الحفظ بنجاح</span>}
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-venecos-gold hover:opacity-90 text-black font-extrabold text-sm rounded-xl shadow-lg">
            <MdSave /> حفظ إعدادات التعليق الصوتي 1:1
          </button>
        </div>
      </form>
    </div>
  );
}
