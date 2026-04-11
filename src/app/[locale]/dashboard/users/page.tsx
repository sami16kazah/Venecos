'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Button, 
  CircularProgress, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Select, 
  MenuItem, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Chip,
  Avatar,
  Tabs,
  Tab,
  TextField,
  InputAdornment
} from '@mui/material';
import { MdDelete, MdPerson, MdEmail, MdSecurity, MdFilterList, MdSearch } from 'react-icons/md';

export default function UsersPage() {
  const t = useTranslations('Dashboard');
  const tUsers = useTranslations('Users');
  const params = useParams() as { locale: string };
  const { data: session } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (session && role !== 'admin') {
      router.replace(`/${params?.locale || 'en'}/dashboard`);
    }
  }, [session, role, router, params?.locale]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setFeedback({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to fetch users.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', msg: tUsers('updateRoleSuccess') || 'Role updated successfully!' });
        setUsers(users.map(u => u._id === userId ? { ...u, roles: [newRole] } : u));
      } else {
        setFeedback({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Action failed.' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users?id=${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', msg: tUsers('deleteSuccess') || 'User deleted permanently.' });
        setUsers(users.filter(u => u._id !== deleteId));
        setDeleteId(null);
      } else {
        setFeedback({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Delete failed.' });
    } finally {
      setDeleting(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'employee': return 'primary';
      case 'client': return 'success';
      default: return 'default';
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.roles.includes(roleFilter);
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const email = u.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || email.includes(query);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-venecos-black">{t('manageUsers')}</h2>
          <p className="text-gray-500 text-sm mt-1">{tUsers('manageDesc') || 'View, update roles, and manage all registered platform users.'}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <TextField
            size="small"
            placeholder={tUsers('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              bgcolor: 'gray.50',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 3, fontSize: '0.875rem' },
              minWidth: { xs: '100%', sm: 260 }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch className="text-gray-400" size={20} />
                </InputAdornment>
              ),
            }}
          />
          <div className="bg-gray-50 p-1 rounded-xl border border-gray-200 flex items-center gap-2 px-3 w-full sm:w-auto overflow-x-auto">
            <MdFilterList className="text-gray-400" />
            <Tabs 
              value={roleFilter} 
              onChange={(e, val) => setRoleFilter(val)}
              sx={{ 
                minHeight: 32,
                '& .MuiTab-root': { 
                  minHeight: 32, 
                  py: 0.5, 
                  px: 2, 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  borderRadius: 1.5,
                  textTransform: 'none'
                },
                '& .MuiTabs-indicator': { display: 'none' },
                '& .Mui-selected': { bgcolor: 'white', color: 'primary.main', shadow: 1 }
              }}
            >
              <Tab label={tUsers('filterAll')} value="all" />
              <Tab label={tUsers('roleAdmin')} value="admin" />
              <Tab label={tUsers('roleEmployee')} value="employee" />
              <Tab label={tUsers('roleClient')} value="client" />
            </Tabs>
          </div>
        </div>
      </header>

      {feedback && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ borderRadius: 2 }}>
          {feedback.msg}
        </Alert>
      )}

      {loading ? (
        <Paper sx={{ p: 5, display: 'flex', justifyContent: 'center', borderRadius: 4 }}>
          <CircularProgress color="primary" />
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 'none', border: '1px solid #f3f4f6' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell className="font-bold text-gray-500">{tUsers('user') || 'User'}</TableCell>
                <TableCell className="font-bold text-gray-500">{tUsers('role') || 'Role'}</TableCell>
                <TableCell className="font-bold text-gray-500">{tUsers('joined') || 'Joined'}</TableCell>
                <TableCell className="font-bold text-gray-500 text-right">{tUsers('actions') || 'Actions'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8, color: 'gray.400' }}>
                    No users found matching this filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar sx={{ bgcolor: 'venecos-gold' }}><MdPerson /></Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{u.firstName} {u.lastName}</span>
                          <span className="text-xs text-gray-400">@{u.username}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MdEmail size={12} /> {u.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={u.roles[0] || 'client'}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        sx={{ borderRadius: 2, minWidth: 120, fontSize: '0.875rem', bgcolor: 'white' }}
                      >
                        <MenuItem value="admin">{tUsers('roleAdmin')}</MenuItem>
                        <MenuItem value="employee">{tUsers('roleEmployee')}</MenuItem>
                        <MenuItem value="client">{tUsers('roleClient')}</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString(params.locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="error" 
                        onClick={() => setDeleteId(u._id)}
                        disabled={(session?.user as any)?.id === u._id}
                        size="small"
                      >
                        <MdDelete size={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* DELETE CONFIRMATION */}
      <Dialog open={!!deleteId} onClose={() => !deleting && setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{tUsers('deleteConfirmTitle') || 'Delete User?'}</DialogTitle>
        <DialogContent>
          <p className="text-gray-600">
            {tUsers('deleteConfirmMsg') || 'Are you sure you want to permanently remove this user? This action cannot be undone.'}
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>{tUsers('cancel') || 'Cancel'}</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
            disabled={deleting}
            sx={{ borderRadius: 9999 }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : tUsers('deleteBtn') || 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
