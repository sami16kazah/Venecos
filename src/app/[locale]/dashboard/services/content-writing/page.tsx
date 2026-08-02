'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdEditDocument, MdArrowBack, MdCheckCircle, MdTune, MdSave } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function ContentWritingServicePage() {
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [saved, setSaved] = useState(false);

  const [contentTypes] = useState<string[]>(['مقالات متوافقة مع SEO', 'نصوص إعلانات وتسويق (Copywriting)', 'سيناريوهات وفيديو', 'ترجمة وصياغة بلغات', 'بروفايل ومحتوى تعريفي']);
  const [writingStyles] = useState<string[]>(['احترافي رسمي (Corporate)', 'تسويقي حماسي (Persuasive)', 'تقني مبسط (Technical)', 'قصصي جذّاب (Storytelling)']);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(['مقالات متوافقة مع SEO', 'نصوص إعلانات وتسويق (Copywriting)']);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['احترافي رسمي (Corporate)', 'تسويقي حماسي (Persuasive)']);

  const [formData, setFormData] = useState({
    title: { ar: 'كتابة المحتوى وصياغة المقالات الحصرية', en: 'Content Writing & Professional Copywriting', fr: 'Rédaction de contenu professionnel', de: 'Professionelle Texterstellung' },
    shortDesc: { ar: 'صياغة مقالات ونصوص إعلانات متوافقة مع محركات البحث SEO ومستهدفة للجمهور', en: 'SEO friendly articles and persuasive copywriting', fr: 'Rédaction SEO et textes publicitaires', de: 'SEO-Texte und Werbetexte' },
    pricePer100Words: 5.00,
    minWordsOrder: 500,
    deliveryDaysFrom: 2,
    deliveryDaysTo: 5,
    coverImage: '',
    sampleDocUrl: '',
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
          <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdEditDocument />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة خدمة كتابة المحتوى (Content Writing 1:1)</h1>
            <p className="text-xs text-white/60">صياغة المقالات، سكريبتات، ومستندات العينات عبر Cloudinary</p>
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

        {/* Media & Document Cloudinary Uploaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-venecos-gold">غلاف كتابة المحتوى (Cloudinary Uploader)</h3>
            <CloudinaryUploader
              label="إسقاط صورة غلاف الخدمة"
              currentUrl={formData.coverImage}
              onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
            />
          </div>

          <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-venecos-gold">مستند عينة مقال (PDF / DOCX Document Uploader)</h3>
            <CloudinaryUploader
              label="رفع مستند عينة PDF أو Word"
              acceptTypes=".pdf,.doc,.docx"
              mediaType="raw"
              currentUrl={formData.sampleDocUrl}
              onUploadSuccess={(url) => setFormData({ ...formData, sampleDocUrl: url })}
            />
          </div>
        </div>

        {/* Content Types & Styles Selection Chips */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdTune /> أنواع واساليب المحتوى
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">أنواع المحتوى المقبولة (Content Types)</label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleSelection(selectedTypes, setSelectedTypes, type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedTypes.includes(type)
                      ? 'bg-venecos-gold/20 text-venecos-gold border-venecos-gold shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedTypes.includes(type) ? '✓ ' : ''}{type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">أسلوب الكتابة (Writing Styles)</label>
            <div className="flex flex-wrap gap-2">
              {writingStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleSelection(selectedStyles, setSelectedStyles, style)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedStyles.includes(style)
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedStyles.includes(style) ? '✓ ' : ''}{style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Word Pricing Matrix */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">أسعار الكلمات ومواعيد التسليم</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">السعر لكل 100 كلمة (€)</label>
              <input type="number" step="0.5" value={formData.pricePer100Words} onChange={(e) => setFormData({ ...formData, pricePer100Words: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">الحد الأدنى للكلمات</label>
              <input type="number" value={formData.minWordsOrder} onChange={(e) => setFormData({ ...formData, minWordsOrder: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">التسليم من (أيام)</label>
              <input type="number" value={formData.deliveryDaysFrom} onChange={(e) => setFormData({ ...formData, deliveryDaysFrom: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">التسليم إلى (أيام)</label>
              <input type="number" value={formData.deliveryDaysTo} onChange={(e) => setFormData({ ...formData, deliveryDaysTo: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white font-bold text-center" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          {saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم الحفظ بنجاح</span>}
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-venecos-gold hover:opacity-90 text-black font-extrabold text-sm rounded-xl shadow-lg">
            <MdSave /> حفظ إعدادات كتابة المحتوى 1:1
          </button>
        </div>
      </form>
    </div>
  );
}
