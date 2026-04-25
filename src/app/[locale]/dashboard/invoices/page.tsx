'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { 
  Box, Typography, CircularProgress, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import { MdReceipt, MdCheckCircle, MdDownload } from 'react-icons/md';

export default function InvoicesPage() {
  const t = useTranslations('Dashboard');
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('/api/orders/my-orders');
        if (res.ok) {
          const data = await res.json();
          // Filter only paid orders
          const paid = data.filter((o: any) => o.paymentStatus === 'paid');
          setInvoices(paid);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchInvoices();
  }, [session]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#D4AF37' }} /></Box>;
  }

  return (
    <Box sx={{ maxWidth: '6xl', mx: 'auto', p: 4 }}>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ bgcolor: '#D4AF37', p: 1.5, borderRadius: 3, color: 'white' }}>
            <MdReceipt size={32} />
        </Box>
        <Box>
            <Typography variant="h4" fontWeight="900" className="text-venecos-black">
                {t('invoices')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Manage and download your official purchase receipts.
            </Typography>
        </Box>
      </Box>

      {invoices.length === 0 ? (
        <Card sx={{ borderRadius: 6, border: '1px solid #f0f0f0', py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            {t('noInvoices')}
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 6, border: '1px solid #f0f0f0', boxShadow: 'none', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('invoiceNumber')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('service')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('paymentDate')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('amountPaid')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv._id} hover>
                  <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>
                    #{inv._id.slice(-10).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{inv.subServiceName}</Typography>
                    <Typography variant="caption" color="textSecondary">{inv.serviceName}</Typography>
                  </TableCell>
                  <TableCell>
                    {inv.updatedAt ? new Date(inv.updatedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="900" color="primary">${inv.price}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                        icon={<MdCheckCircle />} 
                        label="PAID" 
                        color="success" 
                        size="small" 
                        sx={{ fontWeight: 'bold', borderRadius: 2 }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Receipt">
                        <IconButton sx={{ bgcolor: '#f0f0f0', '&:hover': { bgcolor: '#e0e0e0' } }} disabled>
                            <MdDownload size={20} />
                        </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
