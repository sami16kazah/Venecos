'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdMic, MdArrowBack, MdCheckCircle, MdAudioFile, MdSave, MdPerson, MdChildCare, MdAdd, MdDelete } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

interface IAudioSample {
  id: number;
  name: string;
  url: string;
}

interface IPriceTier {
  wordsFrom: number;
  wordsTo: number;
  priceFrom: number;
  priceTo: number;
  daysFrom: number;
  daysTo: number;
  daysUnit: string;
}

export default function VoiceOverServicePage() {
  const [saved, setSaved] = useState(false);
  const [selectedVoiceTypes, setSelectedVoiceTypes] = useState<string[]>(['male']);

  const [formData, setFormData] = useState({
    titleAr: 'معلق بصوت رجل فصيح',
    titleEn: 'Male Voiceover Artist',
    titleFr: 'Rédacteur vocal homme',
    titleDe: 'Männlicher Sprecher',

    shortAr: 'وصف مختصر المعلق...',
    shortEn: 'Short description...',
    shortFr: 'Description courte...',
    shortDe: 'Kurzbeschreibung...',

    fullAr: 'شرح تفصيلي عن المعلق وخبراته وأسلوبه...',
    fullEn: 'Detailed description about narrator skills...',
    fullFr: 'Description détaillée...',
    fullDe: 'Detaillierte Beschreibung...',
  });

  const [audioSamples, setAudioSamples] = useState<IAudioSample[]>([
    { id: 1, name: 'عينة فصحى إعلانية', url: '' },
    { id: 2, name: 'عينة وثائقية سينمائية', url: '' },
  ]);

  const [priceTiers, setPriceTiers] = useState<IPriceTier[]>([
    { wordsFrom: 1, wordsTo: 100, priceFrom: 15, priceTo: 30, daysFrom: 1, daysTo: 2, daysUnit: 'يوم' },
    { wordsFrom: 101, wordsTo: 500, priceFrom: 35, priceTo: 70, daysFrom: 2, daysTo: 4, daysUnit: 'يوم' },
  ]);

  const toggleVoiceType = (type: string) => {
    if (selectedVoiceTypes.includes(type)) {
      if (selectedVoiceTypes.length > 1) {
        setSelectedVoiceTypes(selectedVoiceTypes.filter(t => t !== type));
      }
    } else {
      setSelectedVoiceTypes([...selectedVoiceTypes, type]);
    }
  };

  const handleAddSample = () => {
    if (audioSamples.length >= 7) return;
    setAudioSamples([...audioSamples, { id: Date.now(), name: `عينة ${audioSamples.length + 1}`, url: '' }]);
  };

  const handleRemoveSample = (id: number) => {
    setAudioSamples(audioSamples.filter(s => s.id !== id));
  };

  const handleAddPriceTier = () => {
    const last = priceTiers[priceTiers.length - 1];
    const newFrom = last ? last.wordsTo + 1 : 1;
    setPriceTiers([...priceTiers, { wordsFrom: newFrom, wordsTo: newFrom + 499, priceFrom: 40, priceTo: 80, daysFrom: 2, daysTo: 5, daysUnit: 'يوم' }]);
  };

  const handleRemovePriceTier = (idx: number) => {
    setPriceTiers(priceTiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx: number, field: keyof IPriceTier, value: any) => {
    const updated = [...priceTiers];
    (updated[idx] as any)[field] = value;
    setPriceTiers(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header matching Legacy Screenshot 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdMic className="text-venecos-gold text-3xl" />
            إضافة معلق جديد
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            كل معلق عرض مستقل بعينات صوتية وجدول أسعار خاص
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/services" className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack /> رجوع
          </Link>
          <button type="button" onClick={handleSave} className="px-4 py-2 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
            💾 مسودة
          </button>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            ✓ حفظ ونشر
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Voice Type Cards matching Screenshot 1 */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
              <MdMic /> نوع الصوت
            </h3>
            <span className="text-[11px] text-white/50">يمكن اختيار أكثر من نوع صوت واحد</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Male Voice */}
            <div
              onClick={() => toggleVoiceType('male')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                selectedVoiceTypes.includes('male')
                  ? 'bg-venecos-gold/15 border-venecos-gold text-venecos-gold shadow-gold-glow'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <MdPerson className="text-4xl" />
              <span className="font-extrabold text-sm">صوت رجل</span>
            </div>

            {/* Card 2: Female Voice */}
            <div
              onClick={() => toggleVoiceType('female')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                selectedVoiceTypes.includes('female')
                  ? 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <MdPerson className="text-4xl" />
              <span className="font-extrabold text-sm">صوت امرأة</span>
            </div>

            {/* Card 3: Child Voice */}
            <div
              onClick={() => toggleVoiceType('child')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                selectedVoiceTypes.includes('child')
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <MdChildCare className="text-4xl" />
              <span className="font-extrabold text-sm">صوت طفل</span>
            </div>
          </div>
        </div>

        {/* Section 2: 2x2 Multilingual Grid matching Screenshot 1 */}
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
                <label className="block text-xs font-bold text-white/80 mb-1.5">العنوان *</label>
                <input
                  type="text"
                  required
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="مثال: معلق بصوت رجل فصيح"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">وصف مختصر</label>
                <input
                  type="text"
                  value={formData.shortAr}
                  onChange={(e) => setFormData({ ...formData, shortAr: e.target.value })}
                  placeholder="وصف مختصر..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">الشرح التفصيلي</label>
                <textarea
                  rows={4}
                  value={formData.fullAr}
                  onChange={(e) => setFormData({ ...formData, fullAr: e.target.value })}
                  placeholder="شرح تفصيلي عن المعلق وخبراته وأسلوبه..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
                />
              </div>
            </div>

            {/* English */}
            <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇬🇧 GB English
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="e.g. Male Voiceover Artist"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Short description</label>
                <input
                  type="text"
                  value={formData.shortEn}
                  onChange={(e) => setFormData({ ...formData, shortEn: e.target.value })}
                  placeholder="Short description..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Detailed description</label>
                <textarea
                  rows={4}
                  value={formData.fullEn}
                  onChange={(e) => setFormData({ ...formData, fullEn: e.target.value })}
                  placeholder="Detailed description..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* French */}
            <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇫🇷 FR Français
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Titre *</label>
                <input
                  type="text"
                  value={formData.titleFr}
                  onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                  placeholder="ex: Rédacteur vocal homme"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Description courte</label>
                <input
                  type="text"
                  value={formData.shortFr}
                  onChange={(e) => setFormData({ ...formData, shortFr: e.target.value })}
                  placeholder="Description courte..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Description détaillée</label>
                <textarea
                  rows={4}
                  value={formData.fullFr}
                  onChange={(e) => setFormData({ ...formData, fullFr: e.target.value })}
                  placeholder="Description détaillée..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* German */}
            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-5 space-y-4" dir="ltr">
              <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-xl text-xs font-bold inline-block">
                🇩🇪 DE Deutsch
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Titel *</label>
                <input
                  type="text"
                  value={formData.titleDe}
                  onChange={(e) => setFormData({ ...formData, titleDe: e.target.value })}
                  placeholder="z.B. Männlicher Sprecher"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Kurzbeschreibung</label>
                <input
                  type="text"
                  value={formData.shortDe}
                  onChange={(e) => setFormData({ ...formData, shortDe: e.target.value })}
                  placeholder="Kurzbeschreibung..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">Detaillierte Beschreibung</label>
                <textarea
                  rows={4}
                  value={formData.fullDe}
                  onChange={(e) => setFormData({ ...formData, fullDe: e.target.value })}
                  placeholder="Detaillierte Beschreibung..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Audio Samples with Cloudinary */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
              <MdAudioFile /> العينات الصوتية (max 7 عينات)
            </h3>
            <button type="button" onClick={handleAddSample} className="flex items-center gap-1 text-xs bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-3 py-1.5 rounded-xl font-bold hover:bg-venecos-gold/30">
              <MdAdd /> إضافة عينة
            </button>
          </div>

          <div className="space-y-4">
            {audioSamples.map((sample, idx) => (
              <div key={sample.id} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-venecos-gold">عينة صوتية #{idx + 1}</span>
                  <button type="button" onClick={() => handleRemoveSample(sample.id)} className="p-1 text-red-400 hover:text-red-300">
                    <MdDelete />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">اسم العينة (مثال: فصحى — إعلان تجاري)</label>
                    <input
                      type="text"
                      value={sample.name}
                      onChange={(e) => {
                        const updated = [...audioSamples];
                        updated[idx].name = e.target.value;
                        setAudioSamples(updated);
                      }}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>

                  <div>
                    <CloudinaryUploader
                      label="رفع الملف الصوتي (MP3/WAV)"
                      acceptTypes="audio/*"
                      mediaType="raw"
                      currentUrl={sample.url}
                      onUploadSuccess={(url) => {
                        const updated = [...audioSamples];
                        updated[idx].url = url;
                        setAudioSamples(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Price Tiers Table matching Legacy */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">جدول الأسعار (حسب عدد الكلمات وفترة التسليم)</h3>
            <button type="button" onClick={handleAddPriceTier} className="flex items-center gap-1 text-xs bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-3 py-1.5 rounded-xl font-bold hover:bg-venecos-gold/30">
              <MdAdd /> إضافة شريحة
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-white">
              <thead className="bg-white/5 border-b border-white/10 text-white/60 font-bold">
                <tr>
                  <th className="p-3">الكلمات من</th>
                  <th className="p-3">الكلمات إلى</th>
                  <th className="p-3">السعر (€) من — إلى</th>
                  <th className="p-3">فترة التسليم</th>
                  <th className="p-3 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {priceTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="p-2">
                      <input type="number" value={tier.wordsFrom} onChange={(e) => handleTierChange(idx, 'wordsFrom', Number(e.target.value))} className="w-20 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={tier.wordsTo} onChange={(e) => handleTierChange(idx, 'wordsTo', Number(e.target.value))} className="w-20 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <input type="number" value={tier.priceFrom} onChange={(e) => handleTierChange(idx, 'priceFrom', Number(e.target.value))} className="w-20 bg-white/5 border border-venecos-gold/30 text-venecos-gold rounded-lg px-2 py-1 text-center font-bold" />
                        <span className="text-white/40">—</span>
                        <input type="number" value={tier.priceTo} onChange={(e) => handleTierChange(idx, 'priceTo', Number(e.target.value))} className="w-20 bg-white/5 border border-venecos-gold/30 text-venecos-gold rounded-lg px-2 py-1 text-center font-bold" />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <input type="number" value={tier.daysFrom} onChange={(e) => handleTierChange(idx, 'daysFrom', Number(e.target.value))} className="w-16 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center text-blue-400 font-bold" />
                        <span className="text-white/40">—</span>
                        <input type="number" value={tier.daysTo} onChange={(e) => handleTierChange(idx, 'daysTo', Number(e.target.value))} className="w-16 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center text-blue-400 font-bold" />
                        <select value={tier.daysUnit} onChange={(e) => handleTierChange(idx, 'daysUnit', e.target.value)} className="bg-venecos-black border border-white/15 rounded-lg px-2 py-1 text-xs">
                          <option value="ساعة">ساعة</option>
                          <option value="يوم">يوم</option>
                          <option value="أسبوع">أسبوع</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <button type="button" onClick={() => handleRemovePriceTier(idx)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sticky Bottom Bar matching Screenshot 1 */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            {saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم الحفظ بنجاح</span>}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/services" className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              إلغاء
            </Link>
            <button type="button" onClick={handleSave} className="px-5 py-2.5 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
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
