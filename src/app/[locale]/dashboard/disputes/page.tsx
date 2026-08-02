'use client';

import { useState, useEffect } from 'react';
import { MdGavel, MdVisibility, MdCheckCircle, MdCancel, MdShield } from 'react-icons/md';

interface IDispute {
  _id: string;
  disputeNumber: string;
  orderNumber?: string;
  clientName: string;
  employeeName: string;
  serviceName: string;
  currentTier: 'supervisor' | 'admin' | 'legal';
  status: 'in_progress' | 'resolved_client' | 'resolved_company' | 'legal_action';
  timeline: Array<{
    step: string;
    icon: string;
    color: string;
    done: boolean;
    current?: boolean;
    date: string;
    note?: string;
  }>;
  adminDecision?: string;
  createdAt: string;
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<IDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<IDispute | null>(null);
  const [decisionText, setDecisionText] = useState('');

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/disputes');
      if (res.ok) {
        const data = await res.json();
        setDisputes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (status: 'resolved_client' | 'resolved_company' | 'legal_action') => {
    if (!selectedDispute) return;
    try {
      const res = await fetch(`/api/disputes/${selectedDispute._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminDecision: decisionText,
          currentTier: status === 'legal_action' ? 'legal' : 'admin',
        }),
      });

      if (res.ok) {
        setSelectedDispute(null);
        setDecisionText('');
        fetchDisputes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdGavel className="text-venecos-gold text-3xl" />
            سجل النزاعات والتحكيم — Dispute Log
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            جميع النزاعات بين العملاء والموظفين — مراحل التحكيم الثلاث (المشرف ← الأدمن ← قانوني)
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-bold">
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1.5 rounded-xl">
            جارٍ: {disputes.filter((d) => d.status === 'in_progress').length}
          </span>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
            محلول: {disputes.filter((d) => d.status.startsWith('resolved')).length}
          </span>
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-xl">
            قانوني: {disputes.filter((d) => d.status === 'legal_action').length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : disputes.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdGavel className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">لا توجد نزاعات مفتوحة حالياً</p>
        </div>
      ) : (
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right text-sm text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">رقم النزاع</th>
                <th className="p-4">العميل</th>
                <th className="p-4">الموظف</th>
                <th className="p-4">الخدمة</th>
                <th className="p-4">المرحلة</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {disputes.map((dispute) => (
                <tr key={dispute._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4 font-mono font-bold text-venecos-gold">{dispute.disputeNumber}</td>
                  <td className="p-4 font-bold text-white">{dispute.clientName}</td>
                  <td className="p-4 text-white/80">{dispute.employeeName}</td>
                  <td className="p-4 text-xs text-white/70">{dispute.serviceName}</td>
                  <td className="p-4 text-xs">
                    <span className="bg-venecos-gold/15 text-venecos-gold border border-venecos-gold/30 px-3 py-1 rounded-full font-bold">
                      {dispute.currentTier === 'supervisor' ? '1. المشرف' : dispute.currentTier === 'admin' ? '2. الأدمن' : '3. قانوني'}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-bold">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        dispute.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-400'
                          : dispute.status === 'resolved_client'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : dispute.status === 'resolved_company'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {dispute.status === 'in_progress'
                        ? 'قيد النظر'
                        : dispute.status === 'resolved_client'
                        ? 'لصالح العميل'
                        : dispute.status === 'resolved_company'
                        ? 'لصالح الشركة'
                        : 'تصعيد قانوني'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setDecisionText(dispute.adminDecision || '');
                      }}
                      className="px-3 py-1.5 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1"
                    >
                      <MdVisibility /> التفاصيل والقرار
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resolution Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdGavel className="text-venecos-gold" />
                تفاصيل النزاع {selectedDispute.disputeNumber}
              </h2>
              <button onClick={() => setSelectedDispute(null)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
              <div>
                <span className="text-white/50 block mb-1">العميل</span>
                <span className="font-bold text-white text-sm">{selectedDispute.clientName}</span>
              </div>
              <div>
                <span className="text-white/50 block mb-1">الموظف المسؤول</span>
                <span className="font-bold text-white text-sm">{selectedDispute.employeeName}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white/70">مراحل النزاع:</h4>
              <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                {selectedDispute.timeline.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${t.done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-venecos-gold/20 text-venecos-gold'}`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-white">{t.step} {t.current && '(الآن)'}</p>
                      {t.note && <p className="text-white/60 mt-0.5">{t.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Decision Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/70">قرار الأدمن النهائي والتوجيهات:</label>
              <textarea
                rows={3}
                value={decisionText}
                onChange={(e) => setDecisionText(e.target.value)}
                placeholder="اكتب مبررات القرار هنا..."
                className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-white text-sm outline-none focus:border-venecos-gold"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => handleResolve('legal_action')}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-500/40"
              >
                ⚖️ تصعيد قانوني
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleResolve('resolved_client')}
                  className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black rounded-xl text-xs font-bold transition-all border border-emerald-500/40"
                >
                  ✓ لصالح العميل (استرداد)
                </button>
                <button
                  onClick={() => handleResolve('resolved_company')}
                  className="px-4 py-2 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black rounded-xl text-xs font-bold transition-all border border-venecos-gold/40"
                >
                  ✓ لصالح الشركة (مستحق)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
