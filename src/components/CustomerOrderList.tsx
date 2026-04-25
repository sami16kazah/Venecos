'use client';

import React, { useState } from 'react';
import { 
  IconButton, Tooltip, Dialog, Chip, Button, Box, 
  Card, CardContent, Typography, Grid, Divider, Avatar
} from '@mui/material';
import { MdChat, MdPayment, MdCheckCircle, MdAccessTime, MdCancel, MdPerson } from 'react-icons/md';
import OrderChat from '@/components/OrderChat';
import { useTranslations, useLocale } from 'next-intl';

export default function CustomerOrderList({ orders }: { orders: any[] }) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [chatOpen, setChatOpen] = useState<{ open: boolean, order: any | null }>({ open: false, order: null });

  if (!orders || orders.length === 0) {
    return (
      <Box sx={{ p: 8, textAlign: 'center', bgcolor: 'white', borderRadius: 6, border: '1px solid #f0f0f0' }}>
        <Typography variant="h6" color="textSecondary" fontWeight="bold">
            {t('noOrdersFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h5" fontWeight="900" sx={{ mb: 4, color: '#0A0A0A', display: 'flex', alignItems: 'center', gap: 1 }}>
        <span className="w-1.5 h-8 bg-venecos-gold rounded-full mr-2"></span>
        {t('myOrders') || 'My Active Projects'}
      </Typography>

      <Grid container spacing={3}>
        {orders.map(order => {
          const isAccepted = order.status === 'accepted';
          const isRejected = order.status === 'rejected';
          const isPaid = order.paymentStatus === 'paid';

          return (
            <Grid size={{ xs: 12, md: 6 }} key={order._id.toString()}>
              <Card 
                elevation={0}
                sx={{ 
                    borderRadius: 6, 
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', transform: 'translateY(-4px)' },
                    bgcolor: isAccepted ? 'rgba(212,175,55,0.02)' : 'white'
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Chip 
                            label={order.status.toUpperCase()} 
                            size="small" 
                            color={isAccepted ? 'success' : isRejected ? 'error' : 'warning'}
                            icon={isAccepted ? <MdCheckCircle /> : isRejected ? <MdCancel /> : <MdAccessTime />}
                            sx={{ fontWeight: 'bold', fontSize: '0.65rem', borderRadius: 2 }} 
                        />
                        <Typography variant="body2" sx={{ mt: 1, color: '#999', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            REF: #{order._id.slice(-8).toUpperCase()}
                        </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="900" className="text-venecos-black">
                        ${order.price}
                    </Typography>
                  </Box>

                  <Typography variant="h6" fontWeight="800" sx={{ mb: 0.5, lineHeight: 1.2 }}>
                    {order.subServiceName}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 3, opacity: 0.8 }}>
                    {order.serviceName}
                  </Typography>

                  <Box sx={{ bgcolor: 'white', border: '1px solid #f5f5f5', borderRadius: 4, p: 2, mb: 3 }}>
                    <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Assignment
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: isAccepted ? '#D4AF37' : '#eee', fontSize: '0.875rem' }}>
                            {isAccepted ? order.assignedName?.charAt(0) : <MdPerson size={20} />}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">
                                {isAccepted ? (order.assignedName || 'Project Manager') : 'Awaiting Assignment'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {isAccepted ? 'Lead Expert' : 'Review in progress'}
                            </Typography>
                        </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3, opacity: 0.5 }} />

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mt: 'auto' }}>
                    {isAccepted ? (
                      <>
                        <Button 
                          fullWidth
                          variant="contained" 
                          startIcon={!isRtl && <MdChat size={20} />} 
                          onClick={() => setChatOpen({ open: true, order })}
                          sx={{ 
                            bgcolor: '#D4AF37', 
                            color: 'white',
                            borderRadius: 99, 
                            py: 1.5, 
                            fontWeight: '900',
                            '&:hover': { bgcolor: '#B5952F' },
                            boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.39)'
                          }}
                        >
                          {t('chat') || 'Chat now'}
                        </Button>
                        
                        {!isPaid && order.stripeCheckoutUrl && (
                          <Button 
                            fullWidth
                            variant="outlined"
                            href={order.stripeCheckoutUrl}
                            target="_blank"
                            startIcon={!isRtl && <MdPayment />}
                            sx={{ 
                              borderRadius: 99, 
                              py: 1.2, 
                              fontWeight: '900', 
                              borderColor: '#D4AF37', 
                              color: '#D4AF37',
                              '&:hover': { borderColor: '#B5952F', bgcolor: 'rgba(212,175,55,0.05)' }
                            }}
                          >
                            {t('payNow') || 'Pay Now'}
                          </Button>
                        )}
                        {isPaid && (
                            <Chip 
                                icon={!isRtl ? <MdCheckCircle /> : undefined} 
                                label={t('paidStatus') || 'Paid'} 
                                color="success" 
                                sx={{ 
                                    height: 44, 
                                    borderRadius: 99, 
                                    fontWeight: 'bold', 
                                    width: '100%'
                                }} 
                            />
                        )}
                      </>
                    ) : (
                        <Box sx={{ textAlign: 'center', width: '100%', py: 1 }}>
                             <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                                {isRejected 
                                    ? 'Order could not be fulfilled at this time.' 
                                    : 'Awaiting internal technical approval...'}
                             </Typography>
                        </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {chatOpen.open && chatOpen.order && (
        <Dialog 
          open={chatOpen.open} 
          onClose={() => setChatOpen({ open: false, order: null })}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
        >
          <OrderChat 
            orderId={chatOpen.order._id} 
            onClose={() => setChatOpen({ open: false, order: null })}
            stripeUrl={chatOpen.order.stripeCheckoutUrl}
            customerName={`${chatOpen.order.customerDetails.firstName} ${chatOpen.order.customerDetails.lastName}`}
            projectName={chatOpen.order.subServiceName}
          />
        </Dialog>
      )}
    </Box>
  );
}
