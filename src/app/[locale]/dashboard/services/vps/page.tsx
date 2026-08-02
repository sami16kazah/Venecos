'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdDns, MdArrowBack, MdCheckCircle, MdSave } from 'react-icons/md';

export default function VpsServicePage() {
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    packageName: 'VPS-2 Pro',
    monthlyPrice: 29.99,
    vcpu: 2,
    ram: 4,
    storage: 80,
    bandwidth: 1,
    location: 'ألمانيا 🇩🇪',
    osList: 'Ubuntu 22.04 LTS, Debian 12, CentOS Stream 9, AlmaLinux 9',
    controlPanel: 'cPanel (€15/mo), Plesk (€12/mo), CyberPanel (مجاني)',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header matching Screenshot 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MdDns className="text-venecos-gold text-3xl" />
          إضافة باقة VPS
        </h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/services" className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack /> رجوع
          </Link>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            ✓ حفظ الباقة
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Package Specifications matching Screenshot 4 */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            ⚙️ مواصفات الباقة
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">اسم الباقة *</label>
            <input
              type="text"
              required
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              placeholder="مثال: VPS-1, VPS-2..."
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">السعر الشهري (€) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.monthlyPrice}
              onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
              className="w-full bg-black/40 border border-venecos-gold/40 text-venecos-gold font-bold text-center text-base rounded-xl px-4 py-2.5 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">عدد المعالجات (vCPU)</label>
              <input
                type="number"
                value={formData.vcpu}
                onChange={(e) => setFormData({ ...formData, vcpu: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">الذاكرة (GB) RAM</label>
              <input
                type="number"
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">التخزين (GB) NVMe</label>
              <input
                type="number"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">الباندويث (TB)</label>
              <input
                type="number"
                value={formData.bandwidth}
                onChange={(e) => setFormData({ ...formData, bandwidth: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-white text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">موقع السيرفر</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-venecos-black border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm"
            >
              <option value="ألمانيا 🇩🇪">ألمانيا (Frankfurt 🇩🇪)</option>
              <option value="فرنسا 🇫🇷">فرنسا (Paris 🇫🇷)</option>
              <option value="فنلندا 🇫🇮">فنلندا (Helsinki 🇫🇮)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">أنظمة التشغيل المتاحة</label>
            <input
              type="text"
              value={formData.osList}
              onChange={(e) => setFormData({ ...formData, osList: e.target.value })}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">لوحة التحكم (كإضافة مدفوعة)</label>
            <input
              type="text"
              value={formData.controlPanel}
              onChange={(e) => setFormData({ ...formData, controlPanel: e.target.value })}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs"
            />
          </div>
        </div>

        {/* Sticky Bottom Bar matching Screenshot 4 */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> تم حفظ باقة VPS بنجاح</span>}</div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/services" className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              إلغاء
            </Link>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              ✓ حفظ الباقة
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
