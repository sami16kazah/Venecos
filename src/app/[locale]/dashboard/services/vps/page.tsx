'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdCloud, MdArrowBack, MdAdd, MdEdit, MdDelete } from 'react-icons/md';

interface IVpsPlan {
  id: number;
  name: string;
  priceMonthly: number;
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  server: string;
  os: string;
  status: string;
}

export default function VpsServicePage() {
  const [plans, setPlans] = useState<IVpsPlan[]>([
    { id: 1, name: 'VPS-1', priceMonthly: 29.99, cpu: 2, ram: 4, storage: 80, bandwidth: 1, server: 'ألمانيا', os: 'Ubuntu 22.04', status: 'منشورة' },
    { id: 2, name: 'VPS-2', priceMonthly: 49.99, cpu: 4, ram: 8, storage: 160, bandwidth: 2, server: 'ألمانيا', os: 'Ubuntu 22.04', status: 'منشورة' },
    { id: 3, name: 'VPS-PRO', priceMonthly: 89.99, cpu: 8, ram: 16, storage: 320, bandwidth: 5, server: 'فرنسا', os: 'Debian 12', status: 'منشورة' },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdCloud />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة سيرفرات VPS السحابية</h1>
            <p className="text-xs text-white/60">باقات جاهزة + طلبات مخصصة (Custom VPS Specs)</p>
          </div>
        </div>
        <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack /> الرجوع للخدمات
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{p.name}</h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {p.status}
              </span>
            </div>

            <div className="text-3xl font-black text-venecos-gold">
              €{p.priceMonthly}<span className="text-xs text-white/50 font-normal">/شهر</span>
            </div>

            <div className="space-y-2 text-xs border-t border-white/10 pt-3">
              <div className="flex justify-between"><span className="text-white/60">المعالج (CPU):</span><span className="font-bold text-blue-400">{p.cpu} vCPU</span></div>
              <div className="flex justify-between"><span className="text-white/60">الذاكرة (RAM):</span><span className="font-bold text-venecos-gold">{p.ram} GB RAM</span></div>
              <div className="flex justify-between"><span className="text-white/60">التخزين (NVMe):</span><span className="font-bold text-white">{p.storage} GB NVMe</span></div>
              <div className="flex justify-between"><span className="text-white/60">الباندويث:</span><span className="font-bold text-white">{p.bandwidth} TB</span></div>
              <div className="flex justify-between"><span className="text-white/60">نظام التشغيل:</span><span className="font-bold text-white">{p.os}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
