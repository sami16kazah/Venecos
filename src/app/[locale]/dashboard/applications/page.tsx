'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Button, Chip, CircularProgress, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { MdCheckCircle, MdCancel, MdOpenInNew, MdPerson, MdWork, MdCalendarToday, MdFilterList, MdWarning } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type AppStatus = 'pending' | 'accepted' | 'rejected';
type FilterStatus = 'pending' | 'accepted' | 'rejected' | 'all';

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
  createdAt: string;
}

interface ConfirmModal {
  open: boolean;
  appId: string;
  appName: string;
  actionType: 'accepted' | 'rejected' | null;
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
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error'; msg: string } | null>(null);
  const [modal, setModal] = useState<ConfirmModal>({
    open: false,
    appId: '',
    appName: '',
    actionType: null,
  });

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (session && role !== 'admin') {
      router.replace(`/${locale}/dashboard`);
    }
  }, [session, role]);

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
  }, [fetchApplications]);

  const openModal = (app: Application, actionType: 'accepted' | 'rejected') => {
    setModal({
      open: true,
      appId: app._id,
      appName: `${app.firstName} ${app.lastName}`,
      actionType,
    });
  };

  const closeModal = () => {
    setModal({ open: false, appId: '', appName: '', actionType: null });
  };

  const handleAction = async () => {
    if (!modal.appId || !modal.actionType) return;
    const { appId, actionType } = modal;
    closeModal();
    setActionLoading(appId + actionType);

    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: actionType }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ id: appId, type: 'success', msg: t('updateSuccess') });
        fetchApplications();
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ id: appId, type: 'error', msg: data.message });
      }
    } catch {
      setFeedback({ id: appId, type: 'error', msg: 'Something went wrong.' });
    } finally {
      setActionLoading(null);
    }
  };

  const statusColor = (s: AppStatus) => {
    if (s === 'accepted') return 'success';
    if (s === 'rejected') return 'error';
    return 'warning';
  };

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'pending', label: t('filterPending') },
    { key: 'accepted', label: t('filterAccepted') },
    { key: 'rejected', label: t('filterRejected') },
    { key: 'all', label: t('filterAll') },
  ];

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-venecos-black">{t('title')}</h2>
        <p className="text-gray-400 text-sm mt-1">{t('subtitle')}</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
              filterStatus === f.key
                ? 'bg-venecos-black text-venecos-gold border-venecos-black shadow-md'
                : 'bg-white text-gray-500 border-gray-200 hover:border-venecos-gold/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <CircularProgress sx={{ color: '#D4AF37' }} />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <MdFilterList size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium">{t('noApplications')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map(app => (
            <div
              key={app._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Applicant Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-venecos-gold/10 flex items-center justify-center text-venecos-gold font-bold text-base shrink-0">
                    {app.firstName[0]}{app.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-venecos-black text-base leading-tight">
                      {app.firstName} {app.lastName}
                    </p>
                    <p className="text-gray-400 text-sm">{app.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MdWork size={14} className="text-venecos-gold" />
                    {app.position}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdCalendarToday size={14} className="text-venecos-gold" />
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                  {app.phone && (
                    <span className="flex items-center gap-1">
                      <MdPerson size={14} className="text-venecos-gold" />
                      {app.phone}
                    </span>
                  )}
                </div>

                {app.message && (
                  <p className="mt-3 text-gray-500 text-sm line-clamp-2 bg-gray-50 rounded-lg p-3 italic">
                    "{app.message}"
                  </p>
                )}
              </div>

              {/* Status + Actions */}
              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <Chip
                  label={t(app.status as any)}
                  color={statusColor(app.status)}
                  size="small"
                  sx={{ fontWeight: 'bold', borderRadius: 99 }}
                />

                {feedback?.id === app._id && (
                  <p className={`text-xs font-semibold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {feedback.msg}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {/* View CV */}
                  <Tooltip title={t('viewCv')}>
                    <a href={app.cvUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<MdOpenInNew />}
                        sx={{ borderRadius: 9999, borderColor: '#e0e0e0', color: '#666', fontSize: '0.75rem' }}
                      >
                        CV
                      </Button>
                    </a>
                  </Tooltip>

                  {/* Accept */}
                  {app.status !== 'accepted' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={actionLoading === app._id + 'accepted' ? <CircularProgress size={12} color="inherit" /> : <MdCheckCircle />}
                      disabled={!!actionLoading}
                      onClick={() => openModal(app, 'accepted')}
                      sx={{ borderRadius: 9999, fontSize: '0.75rem' }}
                    >
                      {t('accept')}
                    </Button>
                  )}

                  {/* Reject */}
                  {app.status !== 'rejected' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={actionLoading === app._id + 'rejected' ? <CircularProgress size={12} color="inherit" /> : <MdCancel />}
                      disabled={!!actionLoading}
                      onClick={() => openModal(app, 'rejected')}
                      sx={{ borderRadius: 9999, fontSize: '0.75rem' }}
                    >
                      {t('reject')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog
        open={modal.open}
        onClose={closeModal}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            minWidth: { xs: '90vw', sm: 440 },
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold', pb: 1 }}>
          <MdWarning
            size={24}
            color={modal.actionType === 'accepted' ? '#16a34a' : '#dc2626'}
          />
          {modal.actionType === 'accepted' ? t('accept') : t('reject')} — {modal.appName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#555', fontSize: '0.95rem' }}>
            {modal.actionType === 'accepted' ? t('confirmAccept') : t('confirmReject')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={closeModal}
            variant="outlined"
            sx={{ borderRadius: 9999, borderColor: '#e0e0e0', color: '#666' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={modal.actionType === 'accepted' ? 'success' : 'error'}
            sx={{ borderRadius: 9999, fontWeight: 'bold' }}
          >
            {modal.actionType === 'accepted' ? t('accept') : t('reject')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
