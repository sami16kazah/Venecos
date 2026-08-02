'use client';

import { useState, useEffect } from 'react';
import { MdSupervisorAccount, MdCheckCircle, MdShield, MdEdit, MdBlock } from 'react-icons/md';

interface ISupervisor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  activeOrdersCount: number;
  activeProjectsCount: number;
}

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<ISupervisor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/supervisors');
      if (res.ok) {
        const data = await res.json();
        setSupervisors(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdSupervisorAccount className="text-venecos-gold text-3xl" />
            إدارة المشرفين — Supervisors Panel
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            عرض بيانات المشرفين ونشاطهم الكامل والمشاريع المسندة تحت إشرافهم
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : supervisors.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdSupervisorAccount className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">لا يوجد مشرفون محددون بعد</p>
        </div>
      ) : (
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right text-sm text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">المشرف</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">الطلبات النشطة</th>
                <th className="p-4">المشاريع تحت الإشراف</th>
                <th className="p-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {supervisors.map((sup) => (
                <tr key={sup._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-venecos-gold/20 text-venecos-gold font-bold text-xs flex items-center justify-center border border-venecos-gold/40">
                      {sup.firstName[0]}
                      {sup.lastName[0]}
                    </span>
                    {sup.firstName} {sup.lastName}
                  </td>
                  <td className="p-4 text-white/70">{sup.email}</td>
                  <td className="p-4 font-mono font-bold text-venecos-gold">{sup.activeOrdersCount}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{sup.activeProjectsCount}</td>
                  <td className="p-4 text-center">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
                      ● متاح
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
