'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Button, TextField, Alert, CircularProgress } from '@mui/material';
import { MdCheckCircle, MdArrowBack, MdOutlineLocalOffer, MdFlashOn, MdStar } from 'react-icons/md';
import { MuiTelInput } from 'mui-tel-input';
import Link from 'next/link';

function getLocString(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val[lang] || val['en'] || val['ar'] || val['fr'] || val['de'] || Object.values(val)[0] || '';
  }
  return String(val);
}

export default function OfferOrderPage() {
  const { data: session, status } = useSession();
  const tOrder = useTranslations('Order');
  const params = useParams() as { locale: string; id: string };
  const router = useRouter();

  const locale = params?.locale || 'en';
  const offerId = params?.id;

  const [offer, setOffer] = useState<any>(null);
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

  // Protect Route - Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/${locale}/signin?callbackUrl=/${locale}/offers/${offerId}/order`);
    }
  }, [status, router, locale, offerId]);

  // Pre-fill user data
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
      if (user.phoneNumber) setPhone(user.phoneNumber);
    }
  }, [session]);

  // Fetch Offer Details
  useEffect(() => {
    async function fetchOfferDetails() {
      try {
        const res = await fetch('/api/offers');
        if (res.ok) {
          const data = await res.json();
          const found = data.find((o: any) => o._id === offerId);
          if (found) {
            setOffer(found);
          } else {
            setError('Offer not found.');
          }
        } else {
          setError('Failed to fetch offer details.');
        }
      } catch (err) {
        setError('Failed to load offer data.');
      } finally {
        setLoading(false);
      }
    }
    if (offerId) {
      fetchOfferDetails();
    }
  }, [offerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer) return;

    setSubmitting(true);
    setError('');

    const title = getLocString(offer.title, locale) || 'Exclusive Offer';
    const badge = getLocString(offer.badge, locale) || 'Offer Package';

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: offer._id,
          subServiceId: 'offer-package',
          serviceName: title,
          subServiceName: badge,
          price: offer.discountedPrice,
          customerDetails: {
            ...form,
            phone,
          },
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
    return (
      <div className="min-h-screen flex justify-center items-center bg-venecos-black text-white">
        <CircularProgress sx={{ color: '#D4AF37' }} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-venecos-black via-[#111] to-venecos-dark px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <MdCheckCircle className="text-green-500" size={56} />
          </div>
          <h1 className="text-3xl font-extrabold text-venecos-black mb-4">{tOrder('requestReceived')}</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            {tOrder('requestReceivedDesc', {
              package: getLocString(offer?.title, locale) || 'Offer Package',
            })}
          </p>
          <Link href={`/${locale}/dashboard`}>
            <Button variant="contained" color="primary" size="large" fullWidth sx={{ borderRadius: 9999, py: 2, fontWeight: 'bold' }}>
              {tOrder('goToDashboard')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const offerTitle = getLocString(offer?.title, locale);
  const offerBadge = getLocString(offer?.badge, locale);
  const offerDesc = getLocString(offer?.description, locale);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto mb-6">
        <Link href={`/${locale}#offers`} className="inline-flex items-center gap-2 text-gray-500 hover:text-venecos-gold transition-colors text-sm font-bold uppercase tracking-wider">
          <MdArrowBack size={18} />
          {locale === 'ar' ? 'العودة للعروض' : locale === 'fr' ? 'Retour aux offres' : locale === 'de' ? 'Zurück zu Angeboten' : 'Back to Offers'}
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-12 space-y-8">
        {/* Header Summary */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-venecos-gold/10 text-venecos-gold border border-venecos-gold/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <MdOutlineLocalOffer /> {offerBadge || 'EXCLUSIVE OFFER'}
            </span>
            <h1 className="text-3xl font-extrabold text-venecos-black leading-tight">
              {offerTitle}
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
              {offerDesc}
            </p>
          </div>

          <div className="text-left md:text-right shrink-0 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tOrder('totalFee')}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-venecos-gold">€{offer?.discountedPrice}</span>
              {offer?.originalPrice && (
                <span className="text-xs text-gray-400 line-through">€{offer.originalPrice}</span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label={tOrder('firstName')} required fullWidth value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <TextField label={tOrder('lastName')} required fullWidth value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label={tOrder('email')} type="email" required fullWidth value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled />
            <MuiTelInput label={tOrder('phone')} fullWidth value={phone} onChange={(newPhone) => setPhone(newPhone)} defaultCountry="AE" dir="ltr" />
          </div>

          <TextField 
            label={tOrder('requirements')} 
            multiline 
            rows={4} 
            required
            fullWidth 
            placeholder={tOrder('requirementsPlaceholder')} 
            value={form.requirements} 
            onChange={e => setForm({ ...form, requirements: e.target.value })} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting || !offer}
            sx={{ borderRadius: 9999, py: 2, fontWeight: 'bold', fontSize: '1.1rem', mt: 2 }}
          >
            {submitting ? tOrder('submitting') : (locale === 'ar' ? 'إرسال طلب العرض' : locale === 'fr' ? 'Soumettre la demande d\'offre' : locale === 'de' ? 'Angebot anfragen' : 'Submit Offer Order')}
          </Button>
          <p className="text-center text-xs text-gray-400">{tOrder('noChargeWarning')}</p>
        </form>
      </div>
    </div>
  );
}
