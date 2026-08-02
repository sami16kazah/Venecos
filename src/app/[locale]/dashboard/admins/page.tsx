'use client';

import { useState, useEffect } from 'react';
import { MdAdminPanelSettings, MdSecurity, MdCheck, MdShield } from 'react-icons/md';

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  permissions?: string[];
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.filter((u: IUser) => u.roles.includes('admin')));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdAdminPanelSettings className="text-venecos-gold text-3xl" />
            إدارة الأدمنز والصلاحيات — Admins & Permissions
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            السوبر أدمن محمي تلقائياً — كل أدمن إضافي له صلاحيات مخصصة بشكل فردي
          </p>
        </div>
      </div>

      {/* Super Admin Protection Banner */}
      <div className="bg-gradient-to-r from-venecos-gold/20 to-yellow-500/10 border border-venecos-gold/40 rounded-2xl p-5 flex items-center gap-4 text-venecos-gold">
        <div className="w-12 h-12 rounded-full bg-venecos-gold text-black flex items-center justify-center font-black text-xl flex-shrink-0">
          ⭐
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">السوبر أدمن (Super Admin)</h3>
          <p className="text-xs text-white/70 mt-0.5">
            صلاحيات كاملة مطلقة غير قابلة للتعديل أو الحذف من قِبل أي شخص داخل المنصة.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : (
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right text-sm text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">الأدمن</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">الدور</th>
                <th className="p-4 text-center">مستوى الحماية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-venecos-gold/20 text-venecos-gold font-bold text-xs flex items-center justify-center border border-venecos-gold/40">
                      {admin.firstName[0]}
                      {admin.lastName[0]}
                    </span>
                    {admin.firstName} {admin.lastName}
                  </td>
                  <td className="p-4 text-white/70">{admin.email}</td>
                  <td className="p-4 text-xs font-bold text-venecos-gold">
                    <span className="bg-venecos-gold/15 border border-venecos-gold/30 px-3 py-1 rounded-full">
                      SUPER ADMIN
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
                      🛡️ محمي بالكامل
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
