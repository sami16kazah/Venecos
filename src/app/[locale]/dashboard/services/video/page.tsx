'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdVideoLibrary, MdArrowBack, MdCheckCircle, MdImage, MdPlayCircle, MdTune, MdSave } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function VideoProductionServicePage() {
  const [saved, setSaved] = useState(false);
  const [coverType, setCoverType] = useState<'image' | 'video'>('image');

  const [resolutions] = useState<string[]>(['720p HD', '1080p Full HD', '2K', '4K Ultra HD', 'Vertical 9:16']);
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>(['1080p Full HD', '4K Ultra HD', 'Vertical 9:16']);

  const [formData, setFormData] = useState({
    priceFrom: 200,
    priceTo: 3000,
    daysFrom: 3,
    daysTo: 14,
    unit: 'يوم',

    durFrom: 30,
    durTo: 180,
    durUnit: 'ثانية',

    ytCover: '',
    ytExample: '',
    coverImage: '',
    exampleVideoUrl: '',

    titleAr: 'إنتاج الفيديو والإعلانات التجارية',
    titleEn: '4K Commercial Video Production',
    titleFr: 'Production vidéo commerciale 4K',
    titleDe: '4K Werbevideoproduktion',

    shortAr: 'تصوير وإخراج وإنتاج فيديو احترافي بدقة 4K',
    shortEn: 'Professional video shooting & editing in 4K',
    shortFr: 'Tournage et montage vidéo professionnel 4K',
    shortDe: 'Professioneller Videodreh und Schnitt 4K',

    ptsAr: 'سكريبت وإعداد النص\nتصوير استوديو أو خارجي\nمونتاج وتعديل ألوان\nمراجعة مجانية واحدة',
    ptsEn: 'Scriptwriting\nStudio or Outdoor Shooting\nVideo Editing & Color Grading\n1 Free Revision',
    ptsFr: 'Écriture du script\nTournage studio ou extérieur\nMontage et étalonnage\n1 révision gratuite',
    ptsDe: 'Drehbucherstellung\nStudio- oder Außendreh\nSchnitt & Color Grading\n1 kostenlose Überarbeitung',
  });

  const toggleRes = (res: string) => {
    if (selectedResolutions.includes(res)) {
      setSelectedResolutions(selectedResolutions.filter(r => r !== res));
    } else {
      setSelectedResolutions([...selectedResolutions, res]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header matching Screenshot 3 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MdVideoLibrary className="text-venecos-gold text-3xl" />
          إضافة خدمة إنتاج الفيديو
        </h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/services" className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack /> رجوع
          </Link>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            ✓ حفظ ونشر
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Cover Type Selector matching Screenshot 3 */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdImage /> غلاف الخدمة (يظهر في البطاقة)
          </h3>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCoverType('image')}
              className={`flex-1 py-4 px-6 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                coverType === 'image'
                  ? 'bg-venecos-gold/20 border-venecos-gold text-venecos-gold font-bold shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <MdImage className="text-2xl" />
              <span className="text-xs">صورة غلاف</span>
            </button>

            <button
              type="button"
              onClick={() => setCoverType('video')}
              className={`flex-1 py-4 px-6 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                coverType === 'video'
                  ? 'bg-venecos-gold/20 border-venecos-gold text-venecos-gold font-bold shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <MdPlayCircle className="text-2xl" />
              <span className="text-xs">فيديو غلاف</span>
            </button>
          </div>

          {coverType === 'image' ? (
            <CloudinaryUploader
              label="انقر لرفع صورة الغلاف (16:9)"
              currentUrl={formData.coverImage}
              onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CloudinaryUploader
                label="رفع فيديو الغلاف (MP4)"
                acceptTypes="video/*"
                mediaType="video"
                currentUrl={formData.exampleVideoUrl}
                onUploadSuccess={(url) => setFormData({ ...formData, exampleVideoUrl: url })}
              />
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/80">أو رابط YouTube للغلاف</label>
                <input
                  type="text"
                  value={formData.ytCover}
                  onChange={(e) => setFormData({ ...formData, ytCover: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Specifications & Price Range matching Screenshot 3 */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            <MdTune /> السعر والمواصفات
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">نطاق السعر (€)</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">من</span>
                  <input
                    type="number"
                    value={formData.priceFrom}
                    onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-venecos-gold font-black text-base"
                    placeholder="200"
                  />
                </div>
                <span className="text-white/40 font-bold pt-4">—</span>
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">إلى</span>
                  <input
                    type="number"
                    value={formData.priceTo}
                    onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-venecos-gold font-black text-base"
                    placeholder="3000"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Period */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">فترة التسليم</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">من</span>
                  <input
                    type="number"
                    value={formData.daysFrom}
                    onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-base"
                    placeholder="3"
                  />
                </div>
                <span className="text-white/40 font-bold pt-4">—</span>
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">إلى</span>
                  <input
                    type="number"
                    value={formData.daysTo}
                    onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-blue-400 font-bold text-base"
                    placeholder="14"
                  />
                </div>
                <div className="w-24">
                  <span className="block text-[10px] text-white/50 mb-1">الوحدة</span>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-venecos-black border border-white/15 rounded-xl px-2 py-2 text-xs text-white"
                  >
                    <option value="ساعة">ساعة</option>
                    <option value="يوم">يوم</option>
                    <option value="أسبوع">أسبوع</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">مدة الفيديو</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">من</span>
                  <input
                    type="number"
                    value={formData.durFrom}
                    onChange={(e) => setFormData({ ...formData, durFrom: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-purple-400 font-bold text-base"
                    placeholder="30"
                  />
                </div>
                <span className="text-white/40 font-bold pt-4">—</span>
                <div className="flex-1">
                  <span className="block text-[10px] text-white/50 mb-1">إلى</span>
                  <input
                    type="number"
                    value={formData.durTo}
                    onChange={(e) => setFormData({ ...formData, durTo: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-purple-400 font-bold text-base"
                    placeholder="180"
                  />
                </div>
                <div className="w-24">
                  <span className="block text-[10px] text-white/50 mb-1">الوحدة</span>
                  <select
                    value={formData.durUnit}
                    onChange={(e) => setFormData({ ...formData, durUnit: e.target.value })}
                    className="w-full bg-venecos-black border border-white/15 rounded-xl px-2 py-2 text-xs text-white"
                  >
                    <option value="ثانية">ثانية</option>
                    <option value="دقيقة">دقيقة</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resolutions Chips matching Screenshot 3 */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">🖥️ دقة الفيديو المتاحة</label>
              <div className="flex flex-wrap gap-2">
                {resolutions.map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => toggleRes(res)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedResolutions.includes(res)
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow'
                        : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                    }`}
                  >
                    {selectedResolutions.includes(res) ? '✓ ' : ''}{res}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 4 Languages Grid */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3">
            🌐 النصوص بالأربع لغات (العنوان، الوصف، ما يشمله العرض)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic */}
            <div className="bg-white/5 border border-venecos-gold/30 rounded-2xl p-5 space-y-4">
              <div className="bg-venecos-gold/20 border border-venecos-gold/40 text-venecos-gold px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇸🇦 العربية
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">العنوان *</label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">وصف مختصر</label>
                <input
                  type="text"
                  value={formData.shortAr}
                  onChange={(e) => setFormData({ ...formData, shortAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">ما يشمله العرض (سطر = نقطة)</label>
                <textarea
                  rows={4}
                  value={formData.ptsAr}
                  onChange={(e) => setFormData({ ...formData, ptsAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs resize-none"
                />
              </div>
            </div>

            {/* English */}
            <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇬🇧 GB English
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Short description</label>
                <input
                  type="text"
                  value={formData.shortEn}
                  onChange={(e) => setFormData({ ...formData, shortEn: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Included points (Line = Point)</label>
                <textarea
                  rows={4}
                  value={formData.ptsEn}
                  onChange={(e) => setFormData({ ...formData, ptsEn: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar matching Screenshot 3 */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            {saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم الحفظ بنجاح</span>}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/services" className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              إلغاء
            </Link>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              ✓ حفظ ونشر
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
