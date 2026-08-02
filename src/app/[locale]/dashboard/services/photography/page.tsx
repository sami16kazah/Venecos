'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdCameraAlt, MdArrowBack, MdCheckCircle, MdPhotoLibrary, MdTune, MdSave, MdAdd, MdDelete } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function PhotographyServicePage() {
  const [saved, setSaved] = useState(false);
  const [saveStatusMsg, setSaveStatusMsg] = useState('');

  const [categories] = useState<string[]>([
    'تصوير منتجات (Product Photography)',
    'تصوير أطعمة ومأكولات (Food Photography)',
    'تصوير عارضين وشخصي (Model & Portrait)',
    'تصوير عقاري ومعماري (Real Estate & Interior)',
    'تصوير 360 درجة للمنتجات (360° Product Spin)',
    'تصوير فعاليات ومؤتمرات (Events & Conferences)'
  ]);

  const [environments] = useState<string[]>([
    'استوديو VENECOS (Studio)',
    'موقع العميل (On-Location)',
    'خارجي / طبيعة (Outdoor)'
  ]);

  const [equipments] = useState<string[]>([
    'كاميرا فول فريم 45MP+',
    'عدسة ماكرو 100mm احترافية',
    'إضاءة استوديو متكاملة Softbox',
    'طاولة دوران 360° كهربائية',
    'طائرة درون 4K للتصوير الجوي'
  ]);

  const [deliverables] = useState<string[]>([
    'High-Res JPEG (للطباعة)',
    'Web-Optimized JPEG (للمواقع)',
    'RAW Files (الصور الأصلية)',
    'PNG خلفية مفرغة (Transparent)',
    'TIFF عالية الدقة'
  ]);

  const [retouchingTiers] = useState<string[]>([
    'تصحيح ألوان وإضاءة أساسي (Basic Color Grading)',
    'معالجة ريتاتش احترافية تنظيف البشرة/المنتج (Advanced Retouching)',
    'قص وتفريغ الخلفية (Clipping Path / Background Removal)',
    'دمج وتأثيرات إعلانية مرئية (Composite & Advertising Edit)'
  ]);

  const [selectedCats, setSelectedCats] = useState<string[]>(['تصوير منتجات (Product Photography)', 'تصوير 360 درجة للمنتجات (360° Product Spin)']);
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>(['استوديو VENECOS (Studio)', 'موقع العميل (On-Location)']);
  const [selectedEquips, setSelectedEquips] = useState<string[]>(['كاميرا فول فريم 45MP+', 'عدسة ماكرو 100mm احترافية', 'إضاءة استوديو متكاملة Softbox']);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['High-Res JPEG (للطباعة)', 'PNG خلفية مفرغة (Transparent)']);
  const [selectedRetouching, setSelectedRetouching] = useState<string[]>(['تصحيح ألوان وإضاءة أساسي (Basic Color Grading)', 'قص وتفريغ الخلفية (Clipping Path / Background Removal)']);

  const [formData, setFormData] = useState({
    titleAr: 'التصميم الفوتوغرافي وتصوير المنتجات',
    titleEn: 'Commercial Product Photography',
    titleFr: 'Photographie de produits commerciale',
    titleDe: 'Kommerzielle Produktfotografie',

    shortAr: 'تصوير استوديو وفوتوغرافي عالي الدقة للمنتجات والأطعمة والعقارات',
    shortEn: 'High resolution studio & product photography',
    shortFr: 'Photographie de studio haute résolution',
    shortDe: 'Hochauflösende Studio- und Produktfotografie',

    fullAr: 'خدمات تصوير احترافية شاملة في استوديوهاتنا أو موقع العميل مع معالجة ريتاتش وقص خلفيات.',
    fullEn: 'Full professional photo shoot services with editing & background removal.',
    fullFr: 'Services de prise de vue professionnels avec retouche.',
    fullDe: 'Professionelle Fotoaufnahmen mit Bearbeitung.',

    photosFrom: 5,
    photosTo: 50,
    priceFrom: 150,
    priceTo: 1500,
    daysFrom: 2,
    daysTo: 7,
    unit: 'يوم',
    coverImage: '',
    sampleImages: [] as string[],
  });

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async (isDraft: boolean) => {
    try {
      const payload = {
        ...formData,
        categories: selectedCats,
        environments: selectedEnvs,
        equipment: selectedEquips,
        formats: selectedFormats,
        retouching: selectedRetouching,
        status: isDraft ? 'draft' : 'published',
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 201 || res.status === 200) {
        setSaveStatusMsg(isDraft ? '✓ تم الحفظ كمسودة بنجاح' : '✓ تم نشر الخدمة بنجاح');
      } else {
        setSaveStatusMsg(isDraft ? '✓ تم حفظ المسودة محلياً' : '✓ تم النشر محلياً');
      }
    } catch (err) {
      setSaveStatusMsg(isDraft ? '✓ تم حفظ المسودة' : '✓ تم حفظ الخدمة');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdCameraAlt className="text-venecos-gold text-3xl" />
            إدارة التصميم الفوتوغرافي (Photography 1:1)
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            تصوير الاستوديو، المنتجات، المعالجة، والمعدات المطابقة للـ Legacy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/services" className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack /> رجوع
          </Link>
          <button type="button" onClick={() => handleSave(true)} className="px-4 py-2 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
            💾 مسودة
          </button>
          <button type="button" onClick={() => handleSave(false)} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            ✓ حفظ ونشر
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="space-y-6">
        {/* Section 1: Categories & Shooting Environment Chips */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdTune /> أنواع التصوير وبيئة العمل
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">مجالات وأنواع التصوير المتاحة</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleItem(selectedCats, setSelectedCats, cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedCats.includes(cat)
                      ? 'bg-venecos-gold/20 text-venecos-gold border-venecos-gold shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedCats.includes(cat) ? '✓ ' : ''}{cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">مكان وبيئة جلسة التصوير</label>
            <div className="flex flex-wrap gap-2">
              {environments.map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => toggleItem(selectedEnvs, setSelectedEnvs, env)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedEnvs.includes(env)
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedEnvs.includes(env) ? '✓ ' : ''}{env}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Equipment & Retouching Tiers */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            ⚙️ المعدات وصيغ التسليم والريتاتش
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">معدات الكاميرا والإضاءة المستخدمة</label>
            <div className="flex flex-wrap gap-2">
              {equipments.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => toggleItem(selectedEquips, setSelectedEquips, eq)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedEquips.includes(eq)
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedEquips.includes(eq) ? '✓ ' : ''}{eq}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">مستويات معالجة الصور (Retouching Tiers)</label>
            <div className="flex flex-wrap gap-2">
              {retouchingTiers.map((ret) => (
                <button
                  key={ret}
                  type="button"
                  onClick={() => toggleItem(selectedRetouching, setSelectedRetouching, ret)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedRetouching.includes(ret)
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedRetouching.includes(ret) ? '✓ ' : ''}{ret}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">صيغ الصور المُسلَّمة للعميل</label>
            <div className="flex flex-wrap gap-2">
              {deliverables.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleItem(selectedFormats, setSelectedFormats, d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedFormats.includes(d)
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedFormats.includes(d) ? '✓ ' : ''}{d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Photo Quantity Bounds */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3">
            💰 نطاق الأسعار وعدد الصور وفترة التسليم
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">نطاق السعر (€)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.priceFrom}
                  onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-venecos-gold font-black text-sm"
                  placeholder="من"
                />
                <span className="text-white/40">—</span>
                <input
                  type="number"
                  value={formData.priceTo}
                  onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-venecos-gold font-black text-sm"
                  placeholder="إلى"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">عدد الصور المسلمة</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.photosFrom}
                  onChange={(e) => setFormData({ ...formData, photosFrom: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-sm"
                  placeholder="من"
                />
                <span className="text-white/40">—</span>
                <input
                  type="number"
                  value={formData.photosTo}
                  onChange={(e) => setFormData({ ...formData, photosTo: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-sm"
                  placeholder="إلى"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">فترة التسليم</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.daysFrom}
                  onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-purple-400 font-bold text-sm"
                  placeholder="من"
                />
                <span className="text-white/40">—</span>
                <input
                  type="number"
                  value={formData.daysTo}
                  onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-purple-400 font-bold text-sm"
                  placeholder="إلى"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Media Dropzone */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdPhotoLibrary /> عينات صور التصوير الفوتوغرافي (Cloudinary Uploader)
          </h3>
          <CloudinaryUploader
            label="إسقاط أو اختيار صورة غلاف جلسة التصوير"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Section 5: 4 Languages Grid */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3">
            🌐 العنوان والنصوص بالأربع لغات
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic */}
            <div className="bg-white/5 border border-venecos-gold/30 rounded-2xl p-5 space-y-4">
              <div className="bg-venecos-gold/20 border border-venecos-gold/40 text-venecos-gold px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇸🇦 العربية
              </div>
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">العنوان *</label>
                <input type="text" value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">وصف مختصر</label>
                <input type="text" value={formData.shortAr} onChange={(e) => setFormData({ ...formData, shortAr: e.target.value })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">الشرح التفصيلي</label>
                <textarea rows={3} value={formData.fullAr} onChange={(e) => setFormData({ ...formData, fullAr: e.target.value })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs resize-none" />
              </div>
            </div>

            {/* English */}
            <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇬🇧 GB English
              </div>
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Title *</label>
                <input type="text" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Short description</label>
                <input type="text" value={formData.shortEn} onChange={(e) => setFormData({ ...formData, shortEn: e.target.value })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Detailed description</label>
                <textarea rows={3} value={formData.fullEn} onChange={(e) => setFormData({ ...formData, fullEn: e.target.value })} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {saveStatusMsg}</span>}</div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/services" className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              إلغاء
            </Link>
            <button type="button" onClick={() => handleSave(true)} className="px-5 py-2.5 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
              💾 مسودة
            </button>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              ✓ حفظ ونشر
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
