'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Button, TextField, Alert, CircularProgress } from '@mui/material';
import { MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { MuiTelInput } from 'mui-tel-input';
import Link from 'next/link';

export default function OrderPage() {
  const { data: session, status } = useSession();
  const t = useTranslations('Order');
  const params = useParams() as { locale: string; id: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const locale = params?.locale || 'en';
  const serviceId = params?.id;
  const subServiceId = searchParams?.get('subId');

  const [service, setService] = useState<any>(null);
  const [subService, setSubService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    requirements: '',
  });
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Protect Route
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/${locale}/signin?callbackUrl=/${locale}/services/${serviceId}/order?subId=${subServiceId}`);
    }
  }, [status, router, locale, serviceId, subServiceId]);

  // Pre-fill user data
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      setForm(prev => ({
        ...prev,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
      if (user.phoneNumber) setPhone(user.phoneNumber);
    }
  }, [session]);

  // Fetch Service Details
  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch(`/api/services?locale=${locale}`);
        const data = await res.json();
        const foundSvc = data.find((s: any) => s._id === serviceId);
        if (foundSvc) {
          setService(foundSvc);
          const foundSub = foundSvc.subServices?.find((s: any) => s._id === subServiceId);
          if (foundSub) {
            setSubService(foundSub);
          } else {
            setError(t('subNotFound') || "The specific sub-service could not be found.");
          }
        } else {
          setError(t('mainNotFound') || "The main service could not be found.");
        }
      } catch (err) {
        setError(t('errorLoading') || 'Failed to fetch pricing information.');
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, [serviceId, subServiceId, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subService) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          subServiceId: subService._id,
          serviceName: service.title,
          subServiceName: subService.title,
          price: subService.price,
          customerDetails: {
            ...form,
            phone
          }
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Something went wrong submitting your order.');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex justify-center items-center"><CircularProgress sx={{ color: '#D4AF37' }} /></div>;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-venecos-black via-[#111] to-venecos-dark px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <MdCheckCircle className="text-green-500" size={56} />
          </div>
          <h1 className="text-3xl font-extrabold text-venecos-black mb-4">{t('requestReceived')}</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            {t.rich('requestReceivedDesc', {
              package: () => <strong>{subService?.title}</strong>
            })}
          </p>
          <Link href={`/${locale}/dashboard`}>
            <Button variant="contained" color="primary" size="large" fullWidth sx={{ borderRadius: 9999, py: 2, fontWeight: 'bold' }}>
              {t('goToDashboard')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto mb-8">
        <Link href={`/${locale}/services/${serviceId}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-venecos-gold transition-colors text-sm font-bold mb-6 uppercase tracking-wider">
          <MdArrowBack size={18} />
          {t('backToPackages')}
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-12">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-8">
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{service?.title}</div>
            <h1 className="text-3xl font-extrabold text-venecos-black leading-tight">{subService?.title}</h1>
          </div>
          <div className="text-right pl-4">
             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('totalFee')}</div>
             <div className="text-3xl font-extrabold text-venecos-gold">${subService?.price}</div>
          </div>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label={t('firstName')} required fullWidth value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <TextField label={t('lastName')} required fullWidth value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label={t('email')} type="email" required fullWidth value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled />
            <MuiTelInput label={t('phone')} fullWidth value={phone} onChange={(newPhone) => setPhone(newPhone)} defaultCountry="AE" dir="ltr" />
          </div>

          <TextField 
            label={t('requirements')} 
            multiline 
            rows={5} 
            required
            fullWidth 
            placeholder={t('requirementsPlaceholder')} 
            value={form.requirements} 
            onChange={e => setForm({ ...form, requirements: e.target.value })} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting || !subService}
            sx={{ borderRadius: 9999, py: 2, fontWeight: 'bold', fontSize: '1.1rem', mt: 4 }}
          >
            {submitting ? t('submitting') : t('submitRequest')}
          </Button>
          <p className="text-center text-xs text-gray-400 mt-2">{t('noChargeWarning')}</p>
        </form>
      </div>
    </div>
  );
}
