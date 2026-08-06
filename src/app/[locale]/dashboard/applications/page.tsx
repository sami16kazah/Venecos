'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import {
  Button, Chip, CircularProgress, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
  Switch, FormControlLabel
} from '@mui/material';
import { 
  MdCheckCircle, MdCancel, MdOpenInNew, MdPerson, MdWork, 
  MdCalendarToday, MdFilterList, MdWarning, MdSettings, MdAdd, 
  MdDelete, MdArrowUpward, MdArrowDownward, MdBlock, MdEmail, MdSend 
} from 'react-icons/md';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { useSession } from 'next-auth/react';

type AppStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'banned';
type FilterStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'all';

interface Application {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  message?: string;
  cvUrl: string;
  status: AppStatus;
  ipAddress?: string;
  country?: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const t = useTranslations('Applications');
  const params = useParams() as { locale: string };
  const locale = params?.locale || 'en';
  const { data: session } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Hiring status toggle
  const [hiringOpen, setHiringOpen] = useState(true);
  const [hiringLoading, setHiringLoading] = useState(false);

  // Email Reply Modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedAppForReply, setSelectedAppForReply] = useState<Application | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [replyTemplate, setReplyTemplate] = useState<'review' | 'accept' | 'reject'>('review');

  // Ban List Modal
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banItems, setBanItems] = useState<{ _id: string; type: string; value: string; reason?: string }[]>([]);

  // Roles modal state
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [jobRoles, setJobRoles] = useState<{ _id: string; name: string; order?: number }[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [rolesLoading, setRolesLoading] = useState(false);

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (session && role !== 'admin') {
      router.replace(`/${locale}/dashboard`);
    }
  }, [session, role]);

  const fetchHiringStatus = async () => {
    try {
      const res = await fetch('/api/recruitment/hiring-status');
      if (res.ok) {
        const data = await res.json();
        setHiringOpen(data.open);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHiringStatus = async () => {
    try {
      setHiringLoading(true);
      const res = await fetch('/api/recruitment/hiring-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ open: !hiringOpen }),
      });
      if (res.ok) {
        const data = await res.json();
        setHiringOpen(data.open);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHiringLoading(false);
    }
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?status=${filterStatus}`);
      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchApplications();
    fetchHiringStatus();
  }, [fetchApplications]);

  const fetchBanList = async () => {
    try {
      const res = await fetch('/api/ban-list');
      if (res.ok) {
        const data = await res.json();
        setBanItems(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenBanModal = () => {
    fetchBanList();
    setBanModalOpen(true);
  };

  const [banTarget, setBanTarget] = useState<{ ip: string; email: string } | null>(null);
  const [banLoading, setBanLoading] = useState(false);

  const confirmBanIp = async () => {
    if (!banTarget) return;
    try {
      setBanLoading(true);
      await fetch('/api/ban-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ip', value: banTarget.ip, reason: `Ban applicant ${banTarget.email}` }),
      });
      await fetch('/api/ban-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', value: banTarget.email, reason: `Ban applicant email` }),
      });
      fetchApplications();
    } catch (err) {
      console.error(err);
    } finally {
      setBanLoading(false);
      setBanTarget(null);
    }
  };

  const handleOpenReplyModal = (app: Application) => {
    setSelectedAppForReply(app);
    setReplyTemplate('review');
    setReplySubject(`VENECOS — طلب توظيفك (${app.position}) قيد المراجعة`);
    setReplyBody(`عزيزي ${app.firstName}،\n\nشكراً لتقدمك للعمل في فريق Venecos.\n\nيسعدنا إبلاغك بأن طلبك قيد المراجعة حالياً وسيتم التواصل معك قريباً.\n\nمع التحية،\nفريق Venecos`);
    setReplyModalOpen(true);
  };

  const handleSelectTemplate = (tpl: 'review' | 'accept' | 'reject') => {
    if (!selectedAppForReply) return;
    setReplyTemplate(tpl);
    if (tpl === 'review') {
      setReplySubject(`VENECOS — طلب توظيفك (${selectedAppForReply.position}) قيد المراجعة`);
      setReplyBody(`عزيزي ${selectedAppForReply.firstName}،\n\nشكراً لتقدمك للعمل في فريق Venecos.\n\nيسعدنا إبلاغك بأن طلبك قيد المراجعة حالياً وسيتم التواصل معك قريباً.\n\nمع التحية،\nفريق Venecos`);
    } else if (tpl === 'accept') {
      setReplySubject(`VENECOS — قبول طلب توظيفك 🎉`);
      setReplyBody(`عزيزي ${selectedAppForReply.firstName}،\n\nتهانينا! نود إعلامك بأنه تم قبول طلب انضمامك إلى فريق Venecos.\n\nسنقوم بالارتباط معك عبر الهاتف وترتيب مقابلة العمل.\n\nأهلاً بك معنا،\nفريق Venecos`);
    } else {
      setReplySubject(`VENECOS — التحديث بشأن طلب التوظيف`);
      setReplyBody(`عزيزي ${selectedAppForReply.firstName}،\n\nنشكرك على اهتمامك ووقتك في التقدم لوظيفة لدينا.\n\nللأسف نعتذر عن قبول الطلب في هذه الدورة التوظيفية ونتمى لك التوفيق.\n\nمع التحية،\nفريق Venecos`);
    }
  };

  const handleSendReply = async () => {
    if (!selectedAppForReply) return;
    try {
      const status = replyTemplate === 'accept' ? 'accepted' : replyTemplate === 'reject' ? 'rejected' : 'reviewing';
      const res = await fetch('/api/recruitment/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedAppForReply._id,
          recipientEmail: selectedAppForReply.email,
          subject: replySubject,
          body: replyBody,
          status,
        }),
      });

      if (res.ok) {
        setReplyModalOpen(false);
        fetchApplications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdWork className="text-venecos-gold text-3xl" />
            طلبات التوظيف — Recruitment Dashboard
          </h2>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            إدارة طلبات التوظيف الواردة والردود البريدية وحظر عناوين IP
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Hiring Status Toggle */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white">
            <span>باب التوظيف:</span>
            <button
              onClick={toggleHiringStatus}
              disabled={hiringLoading}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                hiringOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
            >
              {hiringOpen ? '● مفتوح' : '○ مغلق'}
            </button>
          </div>

          <button
            onClick={handleOpenBanModal}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <MdBlock /> قوائم الحظر
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'pending', label: 'جديد (Pending)' },
          { key: 'reviewing', label: 'قيد المراجعة (Reviewing)' },
          { key: 'accepted', label: 'مقبول (Accepted)' },
          { key: 'rejected', label: 'مرفوض (Rejected)' },
          { key: 'all', label: 'الكل (All)' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key as any)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
              filterStatus === f.key
                ? 'bg-venecos-gold text-black border-venecos-gold shadow-md'
                : 'bg-white/5 text-white/70 border-white/10 hover:border-venecos-gold/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : applications.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdFilterList className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">لا توجد طلبات توظيف لهذه الحالة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-venecos-black/70 border border-white/10 hover:border-venecos-gold/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-venecos-gold/20 text-venecos-gold font-bold text-sm flex items-center justify-center border border-venecos-gold/40">
                    {app.firstName[0]}
                    {app.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {app.firstName} {app.lastName}
                    </h3>
                    <p className="text-xs text-white/60">{app.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-white/70 pt-1">
                  <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-venecos-gold font-bold">
                    {app.position}
                  </span>
                  <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                  {app.phone && <span>📞 {app.phone}</span>}
                  {app.ipAddress && <span className="font-mono text-white/40">🌐 IP: {app.ipAddress}</span>}
                </div>

                {/* Safety & Documents badges */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    هوية موثوقة ✓
                  </span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    مؤهل أكاديمي ✓
                  </span>
                </div>

                {app.message && (
                  <p className="text-xs text-white/60 bg-white/5 p-3 rounded-xl border border-white/10 italic leading-relaxed">
                    &quot;{app.message}&quot;
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    app.status === 'accepted'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : app.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : app.status === 'reviewing'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {app.status.toUpperCase()}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={app.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <MdOpenInNew /> عرض CV
                  </a>

                  <button
                    onClick={() => handleOpenReplyModal(app)}
                    className="px-3 py-1.5 bg-venecos-gold/20 hover:bg-venecos-gold text-venecos-gold hover:text-black rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <MdEmail /> الرد بريدياً
                  </button>

                  <button
                    onClick={() => app.ipAddress && setBanTarget({ ip: app.ipAddress, email: app.email })}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold flex items-center gap-1 text-[11px]"
                    title="Ban IP & Email"
                  >
                    <MdBlock /> حظر
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyModalOpen && selectedAppForReply && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MdEmail className="text-venecos-gold" />
                إرسال رد بريدي إلى: {selectedAppForReply.email}
              </h3>
              <button onClick={() => setReplyModalOpen(false)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            {/* Template Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectTemplate('review')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  replyTemplate === 'review'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                    : 'bg-white/5 text-white/60 border-white/10'
                }`}
              >
                ⏳ قيد المراجعة
              </button>
              <button
                type="button"
                onClick={() => handleSelectTemplate('accept')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  replyTemplate === 'accept'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                    : 'bg-white/5 text-white/60 border-white/10'
                }`}
              >
                ✅ قبول الطلب
              </button>
              <button
                type="button"
                onClick={() => handleSelectTemplate('reject')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  replyTemplate === 'reject'
                    ? 'bg-red-500/20 text-red-400 border-red-500'
                    : 'bg-white/5 text-white/60 border-white/10'
                }`}
              >
                ❌ اعتذار ورفض
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">موضوع الرسالة</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">نص الرسالة البريدية</label>
                <textarea
                  rows={6}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-4 text-white text-sm outline-none focus:border-venecos-gold leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setReplyModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/10"
              >
                إلغاء
              </button>
              <button
                onClick={handleSendReply}
                className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-venecos-gold to-yellow-500 flex items-center gap-2"
              >
                <MdSend /> إرسال البريد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban List Modal */}
      {banModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MdBlock className="text-red-400" />
                قوائم الحظر المسجلة (IPs & Emails)
              </h3>
              <button onClick={() => setBanModalOpen(false)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {banItems.length === 0 ? (
                <p className="text-center text-white/50 py-8 text-sm">لا توجد عناصر محظورة</p>
              ) : (
                banItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-white text-sm block">{item.value}</span>
                      <span className="text-white/50 text-[10px]">{item.reason || 'حظر محدد'}</span>
                    </div>
                    <span className="bg-red-500/20 text-red-400 font-bold px-2.5 py-1 rounded-full uppercase">
                      {item.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* Ban Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!banTarget}
        title="تأكيد الحظر النهائي"
        description={`هل أنت متأكد من حظر عنوان الـ IP (${banTarget?.ip}) والبريد الإلكتروني (${banTarget?.email})؟`}
        confirmText="نعم، حظر الآن"
        onConfirm={confirmBanIp}
        onCancel={() => setBanTarget(null)}
        loading={banLoading}
      />
    </div>
  );
}
