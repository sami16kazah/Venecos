'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Dialog } from '@mui/material';
import { MdAccountTree, MdChat, MdCheckCircle, MdPerson } from 'react-icons/md';
import OrderChat from '@/components/OrderChat';

interface IPaymentStage {
  name: string;
  pct: number;
  amount: number;
  status: 'pending' | 'paid';
}

interface IProject {
  _id: string;
  projectNumber: string;
  orderId?: string;
  clientName: string;
  employeeName: string;
  supervisorName?: string;
  title: string;
  completionPercentage: number;
  totalAmount: number;
  paidAmount: number;
  paymentStages: IPaymentStage[];
  status: 'active' | 'completed' | 'suspended';
}

export default function ProjectsPage() {
  const params = useParams() as { locale?: string };
  const locale = params?.locale || 'ar';
  const isRtl = locale === 'ar';
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || 'client';

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatDialog, setChatDialog] = useState<{ open: boolean; orderId: string | null; projectName?: string; employeeName?: string }>({
    open: false,
    orderId: null
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdAccountTree className="text-venecos-gold text-3xl" />
            {isRtl ? 'المشاريع قيد التنفيذ' : 'Active Projects'}
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            {isRtl
              ? 'متابعة إنجاز المشاريع ونسبة التقدم ومراحل الدفع والمحادثة المباشرة مع الموظف'
              : 'Track project milestones, payment stages, and chat directly with your assigned specialist'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">
          {isRtl ? 'جاري التحميل...' : 'Loading projects...'}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdAccountTree className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">{isRtl ? 'لا توجد مشاريع مضافة حالياً' : 'No active projects found'}</p>
        </div>
      ) : (
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-start text-sm text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">{isRtl ? 'المشروع' : 'Project'}</th>
                <th className="p-4">{isRtl ? 'العميل' : 'Client'}</th>
                <th className="p-4">{isRtl ? 'الموظف المسؤول' : 'Assigned Specialist'}</th>
                <th className="p-4">{isRtl ? 'نسبة الإنجاز' : 'Completion'}</th>
                <th className="p-4">{isRtl ? 'الدفع' : 'Payment'}</th>
                <th className="p-4 text-center">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className="p-4 text-center">{isRtl ? 'المحادثة' : 'Chat'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((prj) => (
                <tr key={prj._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <p className="font-bold text-white">{prj.title}</p>
                    <span className="text-xs text-venecos-gold font-mono">{prj.projectNumber}</span>
                  </td>
                  <td className="p-4 text-white/90">{prj.clientName}</td>
                  <td className="p-4 text-white/90">
                    <div className="flex items-center gap-1.5">
                      <MdPerson className="text-venecos-gold" />
                      <span>{prj.employeeName || (isRtl ? 'لم يُحدد' : 'Unassigned')}</span>
                    </div>
                  </td>
                  <td className="p-4 w-44">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-500 to-venecos-gold h-full rounded-full"
                          style={{ width: `${prj.completionPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-venecos-gold font-mono">
                        {prj.completionPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    <span className="text-emerald-400">€{prj.paidAmount}</span>
                    <span className="text-white/40 text-xs"> / €{prj.totalAmount}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        prj.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : prj.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {prj.status === 'active'
                        ? isRtl ? 'جارٍ العمل' : 'Active'
                        : prj.status === 'completed'
                        ? isRtl ? 'مكتمل' : 'Completed'
                        : isRtl ? 'معلق' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {prj.orderId ? (
                      <button
                        onClick={() => setChatDialog({ open: true, orderId: prj.orderId!, projectName: prj.title, employeeName: prj.employeeName })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-venecos-gold/20 hover:bg-venecos-gold/30 text-venecos-gold border border-venecos-gold/40 text-xs font-bold transition-all"
                      >
                        <MdChat size={16} />
                        <span>{isRtl ? 'محادثة' : 'Chat'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-white/30 font-mono">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CHAT DIALOG */}
      {chatDialog.open && chatDialog.orderId && (
        <Dialog
          open={chatDialog.open}
          onClose={() => setChatDialog({ open: false, orderId: null })}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', m: { xs: 1, sm: 2 }, maxH: '95vh', overflow: 'hidden' } }}
        >
          <OrderChat
            orderId={chatDialog.orderId}
            onClose={() => setChatDialog({ open: false, orderId: null })}
            isStaff={role === 'employee' || role === 'admin'}
            customerName={chatDialog.employeeName}
            projectName={chatDialog.projectName}
          />
        </Dialog>
      )}
    </div>
  );
}
