'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdLanguage, MdArrowBack, MdCheckCircle } from 'react-icons/md';

export default function DomainServicePage() {
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    extension: '.com',
    regPrice: 12.99,
    renPrice: 14.99,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header matching Screenshot 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MdLanguage className="text-venecos-gold text-3xl" />
          إضافة لاحقة نطاق
        </h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/services" className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack /> رجوع
          </Link>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            ✓ حفظ
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Domain Extension Specs matching Screenshot 5 */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            🌐 بيانات اللاحقة
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">اللاحقة *</label>
            <input
              type="text"
              required
              value={formData.extension}
              onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
              placeholder="مثال: .com .net .store .shop"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-venecos-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">سعر التسجيل (€/سنة) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.regPrice}
              onChange={(e) => setFormData({ ...formData, regPrice: Number(e.target.value) })}
              className="w-full bg-black/40 border border-venecos-gold/40 text-venecos-gold font-bold text-center text-base rounded-xl px-4 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">سعر التجديد (€/سنة) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.renPrice}
              onChange={(e) => setFormData({ ...formData, renPrice: Number(e.target.value) })}
              className="w-full bg-black/40 border border-white/15 text-blue-400 font-bold text-center text-base rounded-xl px-4 py-2.5 outline-none"
            />
          </div>
        </div>

        {/* Sticky Bottom Bar matching Screenshot 5 */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم إضافة لاحقة النطاق بنجاح</span>}</div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/services" className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              إلغاء
            </Link>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              ✓ إضافة اللاحقة
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
