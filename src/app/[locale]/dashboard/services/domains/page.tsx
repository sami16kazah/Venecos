'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdArrowBack, MdSearch, MdCheckCircle } from 'react-icons/md';
import { FaGlobe } from 'react-icons/fa';

export default function DomainsServicePage() {
  const [exts] = useState([
    { ext: '.com', reg: 12.99, renew: 14.99 },
    { ext: '.net', reg: 11.99, renew: 13.99 },
    { ext: '.de', reg: 8.99, renew: 9.99 },
    { ext: '.org', reg: 10.99, renew: 12.99 },
    { ext: '.io', reg: 39.99, renew: 44.99 },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <FaGlobe />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة أسعار ولواحق الدومينات (Domain Extensions)</h1>
            <p className="text-xs text-white/60">أسعار التسجيل والتجديد والتحقق من التوفر 1:1</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 overflow-hidden">
        <table className="w-full text-right text-sm text-white">
          <thead className="bg-white/5 text-xs text-white/60 font-bold border-b border-white/10">
            <tr>
              <th className="p-4">اللاحقة</th>
              <th className="p-4">سعر التسجيل (€/سنة)</th>
              <th className="p-4">سعر التجديد (€/سنة)</th>
              <th className="p-4">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {exts.map((e) => (
              <tr key={e.ext} className="hover:bg-white/5">
                <td className="p-4 font-mono font-bold text-venecos-gold text-base">{e.ext}</td>
                <td className="p-4 font-bold">€{e.reg}</td>
                <td className="p-4 font-bold text-white/70">€{e.renew}</td>
                <td className="p-4"><span className="text-xs text-emerald-400 font-bold">● متاح</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
