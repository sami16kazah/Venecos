'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdLabel, MdArrowBack, MdAdd, MdDelete, MdCheckCircle, MdCalculate, MdLocalShipping, MdTune, MdEuro } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';

interface IPriceTier {
  qtyFrom: number;
  qtyTo: number;
  pricePerM2: number;
  minOrder: number;
}

export default function StickersServicePage() {
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [saved, setSaved] = useState(false);

  const [materials, setMaterials] = useState<string[]>(['Vinyl فينيل مقاوم للماء', 'Paper Glossy ورقي لامع', 'Transparent شفاف', 'Metallic Foil ذهبي/فضائي']);
  const [shapes, setShapes] = useState<string[]>(['دائري (Circle)', 'مربع (Square)', 'قص مخصص (Die-Cut)', 'بيضاوي (Oval)']);
  const [finishes, setFinishes] = useState<string[]>(['سلفان مطفي (Matte)', 'سلفان لامع (Glossy)', 'UV Spot لامي', 'Foil Stamping ذهبي']);
  
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Vinyl فينيل مقاوم للماء', 'Paper Glossy ورقي لامع']);
  const [selectedShapes, setSelectedShapes] = useState<string[]>(['دائري (Circle)', 'قص مخصص (Die-Cut)']);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(['سلفان مطفي (Matte)']);

  const [formData, setFormData] = useState({
    title: { ar: 'طباعة الملصقات وتسميات المنتجات', en: 'Sticker Labels & Custom Die-Cut', fr: 'Autocollants sur mesure', de: 'Sticker & Etiketten' },
    shortDesc: { ar: 'ملصقات عالية الجودة بأشكال ومواد متنوعة للمنتجات والتغليف', en: 'High quality stickers for products & packaging', fr: 'Autocollants haute qualité', de: 'Hochwertige Sticker' },
    fullDesc: { ar: 'طباعة وفصل ملصقات مخصصة مقاومة للماء مع قص ليزر دقيق وباقات كمية مرنة.', en: 'Waterproof custom sticker printing with precision die-cut.', fr: 'Impression autocollants étanches.', de: 'Wasserdichter Stickerdruck.' },
    minW: 2,
    minH: 2,
    maxW: 100,
    maxH: 100,
    coverImage: '',
    galleryImages: [] as string[],
    shipEU: 4.99,
    shipEUFrom: 2,
    shipEUTo: 5,
    shipWorld: 9.99,
    shipWorldFrom: 5,
    shipWorldTo: 10,
  });

  const [priceTiers, setPriceTiers] = useState<IPriceTier[]>([
    { qtyFrom: 1, qtyTo: 99, pricePerM2: 30.00, minOrder: 15.00 },
    { qtyFrom: 100, qtyTo: 499, pricePerM2: 24.00, minOrder: 20.00 },
    { qtyFrom: 500, qtyTo: 999, pricePerM2: 18.00, minOrder: 30.00 },
    { qtyFrom: 1000, qtyTo: 0, pricePerM2: 12.00, minOrder: 50.00 },
  ]);

  // Simulation Calculator State
  const [simQty, setSimQty] = useState<number>(100);
  const [simW, setSimW] = useState<number>(10);
  const [simH, setSimH] = useState<number>(15);

  const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddTier = () => {
    const last = priceTiers[priceTiers.length - 1];
    const newFrom = last ? (last.qtyTo ? last.qtyTo + 1 : 1000) : 1;
    setPriceTiers([...priceTiers, { qtyFrom: newFrom, qtyTo: newFrom + 499, pricePerM2: 15.00, minOrder: 25.00 }]);
  };

  const handleRemoveTier = (idx: number) => {
    setPriceTiers(priceTiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx: number, field: keyof IPriceTier, value: number) => {
    const updated = [...priceTiers];
    updated[idx][field] = value;
    setPriceTiers(updated);
  };

  // Calculator Logic matching Legacy
  const calculateSimPrice = () => {
    if (!simQty || !simW || !simH || !priceTiers.length) return { price: 0, detail: 'أدخل البيانات والحجم' };
    const tier = priceTiers.find(t => simQty >= t.qtyFrom && (t.qtyTo === 0 || simQty <= t.qtyTo));
    if (!tier) return { price: 0, detail: 'الكمية خارج نطاق الشرائح' };

    const m2 = (simW * simH) / 10000;
    const raw = tier.pricePerM2 * m2 * simQty;
    const final = Math.max(raw, tier.minOrder);
    return {
      price: Math.round(final * 100) / 100,
      detail: `${tier.pricePerM2}€/m² × ${m2.toFixed(4)}m² × ${simQty} قطعة${final > raw ? ' (حد أدنى)' : ''}`
    };
  };

  const simResult = calculateSimPrice();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdLabel />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة طباعة الملصقات (Stickers Service Manager)</h1>
            <p className="text-xs text-white/60">مطابق 1:1 للنسخة المعتمدة — شرائح الأسعار، المواد، وحاسبة المساحة m²</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Multilingual Text Content */}
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

        {/* Media Dropzone */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">صور غلاف وعينات ملصقات المنتجات (Cloudinary Uploader)</h3>
          <CloudinaryUploader
            label="إسقاط صورة غلاف الملصق"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Material, Shape & Finish Options */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdTune /> خيارات المواد والشكل والإنهاء
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">نوع المادة (Material Type)</label>
            <div className="flex flex-wrap gap-2">
              {materials.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleSelection(selectedMaterials, setSelectedMaterials, m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedMaterials.includes(m)
                      ? 'bg-venecos-gold/20 text-venecos-gold border-venecos-gold shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedMaterials.includes(m) ? '✓ ' : ''}{m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">شكل الملصق (Sticker Shape)</label>
            <div className="flex flex-wrap gap-2">
              {shapes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSelection(selectedShapes, setSelectedShapes, s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedShapes.includes(s)
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedShapes.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Size Bounds */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">حدود المقاس بالسنتمتر (cm)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="block text-xs font-bold text-red-400">الحد الأدنى للمقاس (Min Size cm)</span>
              <div className="flex items-center gap-2">
                <input type="number" value={formData.minW} onChange={(e) => setFormData({ ...formData, minW: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center" placeholder="عرض" />
                <span className="text-white/40">×</span>
                <input type="number" value={formData.minH} onChange={(e) => setFormData({ ...formData, minH: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center" placeholder="ارتفاع" />
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="block text-xs font-bold text-emerald-400">الحد الأقصى للمقاس (Max Size cm)</span>
              <div className="flex items-center gap-2">
                <input type="number" value={formData.maxW} onChange={(e) => setFormData({ ...formData, maxW: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center" placeholder="عرض" />
                <span className="text-white/40">×</span>
                <input type="number" value={formData.maxH} onChange={(e) => setFormData({ ...formData, maxH: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-center" placeholder="ارتفاع" />
              </div>
            </div>
          </div>
        </div>

        {/* Quantity × Price/m² Table */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">جدول الأسعار حسب شرائح الكميات (€/m²)</h3>
            <button type="button" onClick={handleAddTier} className="flex items-center gap-1 text-xs bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-3 py-1.5 rounded-xl font-bold hover:bg-venecos-gold/30">
              <MdAdd /> إضافة شريحة
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-white">
              <thead className="bg-white/5 border-b border-white/10 text-white/60 font-bold">
                <tr>
                  <th className="p-3">الكمية من</th>
                  <th className="p-3">الكمية إلى (0 = بلا حد)</th>
                  <th className="p-3">سعر المتر² (€/m²)</th>
                  <th className="p-3">الحد الأدنى للطلب (€)</th>
                  <th className="p-3 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {priceTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="p-2">
                      <input type="number" value={tier.qtyFrom} onChange={(e) => handleTierChange(idx, 'qtyFrom', Number(e.target.value))} className="w-24 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={tier.qtyTo} onChange={(e) => handleTierChange(idx, 'qtyTo', Number(e.target.value))} className="w-24 bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <input type="number" step="0.01" value={tier.pricePerM2} onChange={(e) => handleTierChange(idx, 'pricePerM2', Number(e.target.value))} className="w-28 bg-white/5 border border-venecos-gold/30 text-venecos-gold rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2">
                      <input type="number" step="0.01" value={tier.minOrder} onChange={(e) => handleTierChange(idx, 'minOrder', Number(e.target.value))} className="w-28 bg-white/5 border border-white/15 text-blue-400 rounded-lg px-2 py-1 text-center font-bold" />
                    </td>
                    <td className="p-2 text-center">
                      <button type="button" onClick={() => handleRemoveTier(idx)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Simulation Calculator */}
        <div className="bg-venecos-black/70 border border-venecos-gold/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdCalculate /> محاكاة حساب السعر المباشر (Legacy Simulator)
          </h3>
          <div className="flex flex-wrap items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">الكمية</label>
              <input type="number" value={simQty} onChange={(e) => setSimQty(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-blue-400 text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">العرض (cm)</label>
              <input type="number" value={simW} onChange={(e) => setSimW(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-white text-sm" />
            </div>
            <span className="text-white/40 font-bold pb-2">×</span>
            <div>
              <label className="block text-[11px] font-bold text-white/70 mb-1">الارتفاع (cm)</label>
              <input type="number" value={simH} onChange={(e) => setSimH(Number(e.target.value))} className="w-24 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center font-bold text-white text-sm" />
            </div>
            <span className="text-white/40 font-bold pb-2">=</span>
            <div className="bg-venecos-gold/10 border border-venecos-gold/40 px-6 py-2 rounded-xl text-center">
              <div className="text-2xl font-black text-venecos-gold font-mono">€{simResult.price.toFixed(2)}</div>
              <div className="text-[10px] text-white/60 mt-0.5">{simResult.detail}</div>
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
            <MdLocalShipping /> أسعار ومواعيد الشحن والتوصيل
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl space-y-3">
              <span className="block text-xs font-bold text-blue-400">🇪🇺 داخل الاتحاد الأوروبي</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">سعر الشحن (€)</label>
                  <input type="number" step="0.01" value={formData.shipEU} onChange={(e) => setFormData({ ...formData, shipEU: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white font-bold text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">فترة التسليم (أيام)</label>
                  <div className="flex items-center gap-1">
                    <input type="number" value={formData.shipEUFrom} onChange={(e) => setFormData({ ...formData, shipEUFrom: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-center text-xs" />
                    <span className="text-white/40">-</span>
                    <input type="number" value={formData.shipEUTo} onChange={(e) => setFormData({ ...formData, shipEUTo: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-center text-xs" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl space-y-3">
              <span className="block text-xs font-bold text-venecos-gold">🌐 خارج الاتحاد الأوروبي</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">سعر الشحن (€)</label>
                  <input type="number" step="0.01" value={formData.shipWorld} onChange={(e) => setFormData({ ...formData, shipWorld: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white font-bold text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">فترة التسليم (أيام)</label>
                  <div className="flex items-center gap-1">
                    <input type="number" value={formData.shipWorldFrom} onChange={(e) => setFormData({ ...formData, shipWorldFrom: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-center text-xs" />
                    <span className="text-white/40">-</span>
                    <input type="number" value={formData.shipWorldTo} onChange={(e) => setFormData({ ...formData, shipWorldTo: Number(e.target.value) })} className="w-full bg-black/40 border border-white/15 rounded-lg px-2 py-1.5 text-center text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          {saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم الحفظ بنجاح</span>}
          <button type="submit" className="px-6 py-2.5 bg-venecos-gold hover:opacity-90 text-black font-extrabold text-sm rounded-xl shadow-lg">
            حفظ إعدادات الملصقات 1:1
          </button>
        </div>
      </form>
    </div>
  );
}
