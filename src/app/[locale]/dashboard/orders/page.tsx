'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Button, CircularProgress, Card, CardContent, Chip, Alert, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, ListItemText, Avatar, DialogActions,
  Box, ListItemButton, Typography
} from '@mui/material';
import { MdCheckCircle, MdCancel, MdSecurity, MdPayment, MdPerson, MdChat } from 'react-icons/md';
import OrderChat from '@/components/OrderChat';
import CustomerOrderList from '@/components/CustomerOrderList';

export default function AdminOrdersPage() {
  const t = useTranslations('Dashboard');
  const tSettings = useTranslations('Settings');
  const params = useParams() as { locale: string };
  const { data: session } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [assignDialog, setAssignDialog] = useState<{ open: boolean, orderId: string | null }>({ open: false, orderId: null });
  const [chatDialog, setChatDialog] = useState<{ open: boolean, order: any | null }>({ open: false, order: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean, orderId: string | null }>({ open: false, orderId: null });
  const [staff, setStaff] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (session) {
      if (role === 'admin') {
        fetchOrders();
        fetchStaff();
      } else if (role === 'client') {
        fetchCustomerOrders();
      }
    }
  }, [session, role, router, params?.locale]);

  const fetchCustomerOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/my-orders'); // I'll check if this exists
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    setStaffLoading(true);
    try {
      const res = await fetch('/api/users/staff');
      if (res.ok) setStaff(await res.json());
    } catch (err) {
      console.error('Staff fetch error', err);
    } finally {
      setStaffLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', msg: 'Order deleted successfully.' });
        setDeleteConfirm({ open: false, orderId: null });
        fetchOrders();
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Network error.' });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, assignedId?: string, assignedName?: string) => {
    try {
      setFeedback(null);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, assignedId, assignedName })
      });
      
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', msg: `Order has been marked as ${status} and assigned.` });
        setAssignDialog({ open: false, orderId: null });
        fetchOrders();
      } else {
        setFeedback({ type: 'error', msg: data.message || 'Error updating order.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Network error.' });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><CircularProgress sx={{ color: '#D4AF37' }} /></div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-venecos-black tracking-tight underline decoration-venecos-gold decoration-4 underline-offset-8">
            {t('manageOrders') || 'Manage Service Orders'}
          </h2>
          <p className="text-gray-500 text-sm mt-3 font-medium">{t('manageOrdersDesc') || 'Accept, reject, and monitor customer service requests.'}</p>
        </div>
        <div className="flex items-center gap-2 bg-venecos-gold/5 px-4 py-2 rounded-2xl border border-venecos-gold/20">
          <MdSecurity className="text-venecos-gold" size={20} />
          <span className="text-xs font-bold text-venecos-gold uppercase tracking-widest">{t('adminMode')}</span>
        </div>
      </div>

      {feedback && <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ borderRadius: 3 }}>{feedback.msg}</Alert>}

      {role === 'client' ? (
        <CustomerOrderList orders={orders} />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 text-gray-500 shadow-sm">
          {t('noOrdersFound') || 'No orders have been placed yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order._id} sx={{ borderRadius: 4, position: 'relative', border: '1px solid #f0f0f0', overflow: 'visible' }}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Chip 
                    label={order.status.toUpperCase()} 
                    size="small" 
                    color={order.status === 'accepted' ? 'success' : order.status === 'rejected' ? 'error' : 'warning'}
                    sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} 
                  />
                  <div className="text-xs font-bold text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h4 className="font-extrabold text-lg text-gray-900 leading-tight">{order.serviceName}</h4>
                <p className="text-sm font-bold text-venecos-gold mb-4">{order.subServiceName}</p>
                
                <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">{t('customerDetails') || 'Customer Details'}</div>
                  <div className="font-semibold text-sm">{order.customerDetails.firstName} {order.customerDetails.lastName}</div>
                  <div className="text-sm text-gray-600 truncate">{order.customerDetails.email}</div>
                  <div className="text-sm text-gray-600">{order.customerDetails.phone}</div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl mb-6 border border-blue-100/50 relative group/req">
                  <div className="text-xs text-gray-500 mb-1">Requirements</div>
                  <p className="text-sm text-gray-700 italic line-clamp-3">"{order.customerDetails.requirements}"</p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <Tooltip title="Delete Order">
                        <IconButton size="small" color="error" onClick={() => setDeleteConfirm({ open: true, orderId: order._id })} sx={{ opacity: 0.3, '&:hover': { opacity: 1 } }}>
                            <MdCancel />
                        </IconButton>
                    </Tooltip>
                    {order.assignedName && (
                        <div className="flex-grow flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                             <MdPerson className="text-gray-400" size={14} />
                             <span className="text-[10px] font-bold text-gray-600 truncate">{order.assignedName}</span>
                             {order.status === 'accepted' && (
                                <IconButton size="small" onClick={() => setAssignDialog({ open: true, orderId: order._id })} sx={{ p: 0.5, ml: 'auto' }}>
                                    <MdSecurity size={14} className="text-venecos-gold" />
                                </IconButton>
                             )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="font-extrabold text-xl text-venecos-black">${order.price}</span>
                  
                  {order.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Tooltip title={t('acceptOrder') || "Accept & Assign"}>
                        <IconButton size="small" color="success" onClick={() => setAssignDialog({ open: true, orderId: order._id })} sx={{ bgcolor: '#EDF7ED', '&:hover': { bgcolor: '#d4edd4' } }}>
                          <MdCheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('rejectOrder') || "Reject Order"}>
                        <IconButton size="small" color="error" onClick={() => updateOrderStatus(order._id, 'rejected')} sx={{ bgcolor: '#FDEDED', '&:hover': { bgcolor: '#fcd2d2' } }}>
                          <MdCancel />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ) : order.status === 'accepted' ? (
                    <div className="flex items-center gap-3">
                       <Tooltip title="Open Chat">
                        <IconButton size="small" onClick={() => setChatDialog({ open: true, order })} sx={{ bgcolor: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                          <MdChat />
                        </IconButton>
                      </Tooltip>
                      <Chip 
                        icon={<MdPayment />} 
                        label={order.paymentStatus === 'paid' ? (t('paidStatus') || 'Paid') : (order.stripeCheckoutUrl ? (t('unpaidStatus') || 'Unpaid') : 'Link Pending')} 
                        size="small" 
                        color={order.paymentStatus === 'paid' ? 'success' : 'default'} 
                        variant="outlined" 
                        sx={{ fontWeight: 'bold' }} 
                      />
                    </div>
                  ) : (
                     <Chip label={t('rejectedStatus') || "Rejected"} size="small" color="error" variant="outlined" sx={{ fontWeight: 'bold' }} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* ASSIGNMENT DIALOG */}
      <Dialog open={assignDialog.open} onClose={() => setAssignDialog({ open: false, orderId: null })} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Assign Staff Member</DialogTitle>
        <DialogContent>
          <p className="text-gray-500 text-sm mb-4">Select the employee or administrator who will manage this order and communicate with the customer.</p>
          {staffLoading ? (
            <Box className="flex justify-center p-4"><CircularProgress size={24} /></Box>
          ) : (
            <List>
              {staff.map((s) => (
                <ListItem 
                  disablePadding
                  key={s._id} 
                  sx={{ borderRadius: 3, mb: 1, border: '1px solid #f0f0f0', overflow: 'hidden' }}
                >
                  <ListItemButton 
                    onClick={() => updateOrderStatus(assignDialog.orderId!, 'accepted', s._id, `${s.firstName} ${s.lastName}`)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#D4AF37' }}><MdPerson /></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${s.firstName} ${s.lastName}`} secondary={s.roles.join(', ')} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAssignDialog({ open: false, orderId: null })}>{tSettings('return') || 'Cancel'}</Button>
        </DialogActions>
      </Dialog>

      {/* CHAT DIALOG */}
      {chatDialog.open && chatDialog.order && (
        <Dialog 
          open={chatDialog.open} 
          onClose={() => setChatDialog({ open: false, order: null })}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
        >
          <OrderChat 
            orderId={chatDialog.order._id} 
            onClose={() => setChatDialog({ open: false, order: null })}
            stripeUrl={chatDialog.order.stripeCheckoutUrl}
            isStaff={true}
            customerName={`${chatDialog.order.customerDetails.firstName} ${chatDialog.order.customerDetails.lastName}`}
            projectName={chatDialog.order.subServiceName}
          />
        </Dialog>
      )}
      {/* DELETE CONFIRM DIALOG */}
      <Dialog 
        open={deleteConfirm.open} 
        onClose={() => setDeleteConfirm({ open: false, orderId: null })}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>Delete Order permanently?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            This action cannot be undone. All data related to this order and its chat history will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteConfirm({ open: false, orderId: null })}>Cancel</Button>
          <Button 
            onClick={() => deleteOrder(deleteConfirm.orderId!)} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 99, fontWeight: 'bold' }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
