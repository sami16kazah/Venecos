'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  CircularProgress, Card, CardContent, Chip, IconButton, Tooltip, Dialog, Typography, Box
} from '@mui/material';
import { MdChat, MdPayment, MdCheckCircle } from 'react-icons/md';
import OrderChat from '@/components/OrderChat';

export default function AssignedOrdersPage() {
  const t = useTranslations('Dashboard');
  const params = useParams() as { locale: string };
  const { data: session } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatDialog, setChatDialog] = useState<{ open: boolean, order: any | null }>({ open: false, order: null });

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (session && role !== 'admin' && role !== 'employee') {
      router.replace(`/${params?.locale || 'en'}/dashboard`);
    } else if (session) {
      fetchAssignedOrders();
    }
  }, [session, role, router, params?.locale]);

  const fetchAssignedOrders = async () => {
    try {
      const res = await fetch('/api/orders/my-assignments');
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box className="flex justify-center p-20"><CircularProgress sx={{ color: '#D4AF37' }} /></Box>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-extrabold text-venecos-black tracking-tight underline decoration-venecos-gold decoration-4 underline-offset-8">
          {t('myAssignments')}
        </h2>
        <p className="text-gray-500 text-sm mt-3 font-medium">Manage orders and communicate with your clients.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 text-gray-500 shadow-sm">
          {t('noOrdersFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order._id} sx={{ borderRadius: 4, border: '1px solid #f0f0f0' }}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Chip 
                    label={order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'} 
                    size="small" 
                    color={order.paymentStatus === 'paid' ? 'success' : 'default'}
                    sx={{ fontWeight: 'bold' }} 
                  />
                  <Typography variant="caption" className="text-gray-400 font-bold">
                    #{order._id.slice(-6).toUpperCase()}
                  </Typography>
                </div>

                <Typography variant="h6" className="font-extrabold text-gray-900 leading-tight mb-1">
                  {order.subServiceName}
                </Typography>
                <Typography variant="body2" className="text-venecos-gold font-bold mb-4">
                  {order.serviceName}
                </Typography>
                
                <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                  <Typography variant="caption" className="text-gray-400 block mb-1 uppercase font-bold tracking-widest">{t('customerDetails')}</Typography>
                  <Typography variant="subtitle2" className="font-bold">{order.customerDetails.firstName} {order.customerDetails.lastName}</Typography>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <Typography variant="h6" className="font-extrabold text-venecos-black">${order.price}</Typography>
                  
                  <div className="flex gap-2">
                    <Tooltip title="Open Chat">
                      <IconButton 
                        onClick={() => setChatDialog({ open: true, order })}
                        sx={{ bgcolor: '#D4AF37', color: 'white', '&:hover': { bgcolor: '#B5952F' }, boxShadow: '0 4px 10px rgba(212,175,55,0.3)' }}
                      >
                        <MdChat />
                      </IconButton>
                    </Tooltip>
                    {order.paymentStatus === 'paid' && (
                        <div className="p-2 rounded-full bg-green-50 text-green-500">
                            <MdCheckCircle size={24} />
                        </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
    </div>
  );
}
