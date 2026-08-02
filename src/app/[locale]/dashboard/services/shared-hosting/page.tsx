'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdArrowBack, MdAdd, MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md';
import { FaServer } from 'react-icons/fa';

interface IHostingPlan {
  id: number;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  storage: string;
  sites: string;
  emails: string;
  databases: string;
  bandwidth: string;
  panel: string;
  backup: string;
  ssl: boolean;
  ddos: boolean;
  server: string;
  featured: boolean;
  status: string;
}

export default function SharedHostingPage() {
  const [plans, setPlans] = useState<IHostingPlan[]>([
    { id: 1, name: 'Starter', priceMonthly: 4.99, priceYearly: 49, storage: '10 GB SSD', sites: '1', emails: '5', databases: '1', bandwidth: '100 GB', panel: 'cPanel', backup: 'أسبوعي', ssl: true, ddos: true, server: 'ألمانيا', featured: false, status: 'منشورة' },
    { id: 2, name: 'Business', priceMonthly: 9.99, priceYearly: 99, storage: '50 GB NVMe SSD', sites: '5', emails: '20', databases: '10', bandwidth: '500 GB', panel: 'cPanel', backup: 'يومي', ssl: true, ddos: true, server: 'ألمانيا', featured: true, status: 'منشورة' },
    { id: 3, name: 'Pro', priceMonthly: 19.99, priceYearly: 199, storage: '150 GB NVMe SSD', sites: '20', emails: '100', databases: '50', bandwidth: 'Unlimited', panel: 'cPanel', backup: 'يومي', ssl: true, ddos: true, server: 'ألمانيا', featured: false, status: 'منشورة' },
    { id: 4, name: 'Ultimate', priceMonthly: 39.99, priceYearly: 399, storage: '500 GB NVMe SSD', sites: 'Unlimited', emails: 'Unlimited', databases: 'Unlimited', bandwidth: 'Unlimited', panel: 'cPanel', backup: 'يومي', ssl: true, ddos: true, server: 'ألمانيا', featured: false, status: 'مسودة' },
  ]);

  const [editingPlan, setEditingPlan] = useState<IHostingPlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (plan?: IHostingPlan) => {
    if (plan) setEditingPlan(plan);
    else setEditingPlan({
      id: Date.now(),
      name: '',
      priceMonthly: 9.99,
      priceYearly: 99,
      storage: '50 GB SSD',
      sites: '5',
      emails: '10',
      databases: '5',
      bandwidth: '500 GB',
      panel: 'cPanel',
      backup: 'يومي',
      ssl: true,
      ddos: true,
      server: 'ألمانيا',
      featured: false,
      status: 'منشورة'
    });
    setModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    const exists = plans.some(p => p.id === editingPlan.id);
    if (exists) {
      setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
    } else {
      setPlans([...plans, editingPlan]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('حذف هذه الخطة؟')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <FaServer />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">إدارة Shared Hosting (الاستضافة المشتركة)</h1>
            <p className="text-xs text-white/60">إدارة خطط الاستضافة ومواصفات السيرفرات والأمان 1:1</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleOpenModal()} className="flex items-center gap-1.5 text-xs bg-venecos-gold text-black px-4 py-2 rounded-xl font-bold hover:opacity-90">
            <MdAdd /> إضافة خطة استضافة
          </button>
          <Link href="/dashboard/services" className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
            <MdArrowBack /> الرجوع للخدمات
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <div key={p.id} className={`bg-venecos-black/80 border ${p.featured ? 'border-venecos-gold shadow-gold-glow' : 'border-white/10'} rounded-2xl p-5 relative flex flex-col justify-between`}>
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-venecos-gold text-black text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow">
                ⭐ مميزة Featured
              </span>
            )}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'منشورة' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/50'}`}>
                  {p.status}
                </span>
              </div>
              <div className="text-2xl font-black text-venecos-gold">
                €{p.priceMonthly}<span className="text-xs text-white/50 font-normal">/شهر</span>
              </div>
              <div className="text-xs text-white/40">أو €{p.priceYearly}/سنة</div>

              <div className="space-y-2 pt-2 text-xs border-t border-white/10">
                <div className="flex justify-between"><span className="text-white/60">التخزين:</span><span className="font-bold text-white">{p.storage}</span></div>
                <div className="flex justify-between"><span className="text-white/60">المواقع:</span><span className="font-bold text-white">{p.sites}</span></div>
                <div className="flex justify-between"><span className="text-white/60">الإيميلات:</span><span className="font-bold text-white">{p.emails}</span></div>
                <div className="flex justify-between"><span className="text-white/60">قواعد البيانات:</span><span className="font-bold text-white">{p.databases}</span></div>
                <div className="flex justify-between"><span className="text-white/60">لوحة التحكم:</span><span className="font-bold text-white">{p.panel}</span></div>
                <div className="flex justify-between"><span className="text-white/60">السيرفر:</span><span className="font-bold text-white">{p.server}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/10 mt-4">
              <button onClick={() => handleOpenModal(p)} className="p-2 rounded-xl bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold transition-all text-xs font-bold flex-1 flex items-center justify-center gap-1">
                <MdEdit /> تعديل
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-xs">
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">إضافة / تعديل خطة استضافة</h3>
            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">اسم الخطة</label>
                  <input type="text" required value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">السعر الشهري (€)</label>
                  <input type="number" step="0.01" value={editingPlan.priceMonthly} onChange={(e) => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">سعة التخزين</label>
                  <input type="text" value={editingPlan.storage} onChange={(e) => setEditingPlan({ ...editingPlan, storage: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">عدد المواقع</label>
                  <input type="text" value={editingPlan.sites} onChange={(e) => setEditingPlan({ ...editingPlan, sites: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-venecos-gold text-black text-xs font-bold">حفظ الخطة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
