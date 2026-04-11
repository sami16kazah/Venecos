'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Button, Chip, CircularProgress, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
  Switch, FormControlLabel
} from '@mui/material';
import { MdCheckCircle, MdCancel, MdOpenInNew, MdPerson, MdWork, MdCalendarToday, MdFilterList, MdWarning, MdSettings, MdAdd, MdDelete, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
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
  actionType: 'accepted' | 'rejected' | 'delete' | null;
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

  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [jobRoles, setJobRoles] = useState<{ _id: string; name: string; order?: number }[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [rolesLoading, setRolesLoading] = useState(false);
  const [sortAlpha, setSortAlpha] = useState(false);

  const displayedRoles = useMemo(() => {
    if (sortAlpha) {
      return [...jobRoles].sort((a, b) => a.name.localeCompare(b.name));
    }
    return jobRoles;
  }, [jobRoles, sortAlpha]);

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

  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const res = await fetch('/api/job-roles');
      const data = await res.json();
      if (res.ok) {
        setJobRoles(data.roles);
      }
    } catch (err) {
      console.error('Failed to fetch job roles', err);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (rolesModalOpen) {
      fetchRoles();
    }
  }, [rolesModalOpen, fetchRoles]);

  const handleAddRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      const res = await fetch('/api/job-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName })
      });
      if (res.ok) {
        setNewRoleName('');
        fetchRoles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const res = await fetch(`/api/job-roles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRoles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwap = async (index: number, direction: 'up' | 'down') => {
    if (sortAlpha) return;
    const newRoles = [...jobRoles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newRoles.length) return;

    [newRoles[index], newRoles[targetIndex]] = [newRoles[targetIndex], newRoles[index]];
    
    const payload = newRoles.map((r, i) => ({ _id: r._id, order: i }));
    setJobRoles(newRoles.map((r, i) => ({ ...r, order: i })));

    try {
      await fetch('/api/job-roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: payload })
      });
    } catch {
      fetchRoles();
    }
  };

  const openModal = (app: Application, actionType: 'accepted' | 'rejected' | 'delete') => {
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
      const isDelete = actionType === 'delete';
      const url = `/api/applications/${appId}`;
      const res = await fetch(url, {
        method: isDelete ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: isDelete ? undefined : JSON.stringify({ status: actionType }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ id: appId, type: 'success', msg: isDelete ? 'Application removed' : t('updateSuccess') });
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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-venecos-black">{t('title')}</h2>
          <p className="text-gray-400 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <Button
          variant="outlined"
          startIcon={<MdSettings />}
          onClick={() => setRolesModalOpen(true)}
          sx={{ borderRadius: 9999, borderColor: '#D4AF37', color: '#D4AF37', '&:hover': { borderColor: '#FFDF00', bgcolor: 'transparent' } }}
        >
          {t('manageRoles') || 'Manage Roles'}
        </Button>
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

                  {/* Delete / Remove (Only when rejected) */}
                  {app.status === 'rejected' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={actionLoading === app._id + 'delete' ? <CircularProgress size={12} color="inherit" /> : <MdDelete />}
                      disabled={!!actionLoading}
                      onClick={() => openModal(app, 'delete')}
                      sx={{ borderRadius: 9999, fontSize: '0.75rem' }}
                    >
                      Remove
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
            color={modal.actionType === 'accepted' ? '#16a34a' : modal.actionType === 'rejected' ? '#dc2626' : '#991b1b'}
          />
          {modal.actionType === 'accepted' ? t('accept') : modal.actionType === 'delete' ? 'Remove Application' : t('reject')} — {modal.appName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#555', fontSize: '0.95rem' }}>
            {modal.actionType === 'accepted' ? t('confirmAccept') : modal.actionType === 'delete' ? 'Are you sure you want to permanently delete this application? This action cannot be reversed.' : t('confirmReject')}
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
            {modal.actionType === 'accepted' ? t('accept') : modal.actionType === 'delete' ? 'Remove' : t('reject')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Roles Modal */}
      <Dialog
        open={rolesModalOpen}
        onClose={() => setRolesModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1, minWidth: { xs: '90vw', sm: 500 } }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>{t('rolesDialogTitle') || 'Manage Job Roles'}</DialogTitle>
        <DialogContent sx={{ minHeight: 300 }}>
          <div className="flex gap-2 mb-4 mt-2">
            <TextField
              size="small"
              fullWidth
              label={t('newRoleName') || 'New Role Name'}
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRole}
              disabled={!newRoleName.trim() || rolesLoading}
              sx={{ borderRadius: 2 }}
            >
              <MdAdd size={20} />
            </Button>
          </div>
          
          <div className="mb-2 flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
            <FormControlLabel
              control={<Switch checked={sortAlpha} onChange={(e) => setSortAlpha(e.target.checked)} color="primary" />}
              label={<span className="text-sm font-medium text-gray-700">{t('sortAlphabetically') || 'Sort Alphabetically'}</span>}
            />
          </div>

          {rolesLoading ? (
            <div className="flex justify-center p-4">
              <CircularProgress size={24} sx={{ color: '#D4AF37' }} />
            </div>
          ) : (
            <List sx={{ mt: 1 }}>
              {displayedRoles.map((role, idx) => (
                <ListItem key={role._id} sx={{ bgcolor: '#ffffff', mb: 1, borderRadius: 2, border: '1px solid #efefef', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <ListItemText primary={role.name} primaryTypographyProps={{ fontWeight: 'medium' }} />
                  <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {!sortAlpha && (
                      <>
                        <IconButton size="small" onClick={() => handleSwap(idx, 'up')} disabled={idx === 0} sx={{ color: '#888' }}>
                          <MdArrowUpward fontSize="1.1rem" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleSwap(idx, 'down')} disabled={idx === displayedRoles.length - 1} sx={{ color: '#888' }}>
                          <MdArrowDownward fontSize="1.1rem" />
                        </IconButton>
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                      </>
                    )}
                    <IconButton size="small" edge="end" onClick={() => handleDeleteRole(role._id)} color="error">
                      <MdDelete fontSize="1.2rem" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {displayedRoles.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">{t('noRolesFound') || 'No roles found.'}</p>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRolesModalOpen(false)} sx={{ color: '#666', fontWeight: 'bold' }}>
            {t('closeButton') || 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
