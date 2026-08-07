'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Button, TextField, Alert, CircularProgress } from '@mui/material';
import { MdCheckCircle, MdArrowBack, MdStar, MdLocalShipping, MdShield, MdCurrencyExchange } from 'react-icons/md';
import { MuiTelInput } from 'mui-tel-input';
import Link from 'next/link';
import { getLocString, getLocArray } from '@/lib/i18nUtils';

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
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);

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
  const [includeWarranty, setIncludeWarranty] = useState(true);

  // Exchange Rates State
  const [rates, setRates] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<{ currencyCode: string; symbol: string; rateAgainstEur: number }>({
    currencyCode: 'EUR',
    symbol: '€',
    rateAgainstEur: 1,
  });

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch('/api/exchange-rates');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRates(data);
            const defaultCode = locale === 'ar' ? 'AED' : locale === 'de' || locale === 'fr' ? 'EUR' : 'USD';
            const foundDefault = data.find((r: any) => r.currencyCode === defaultCode);
            if (foundDefault) setSelectedCurrency(foundDefault);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchRates();
  }, [locale]);

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
        let foundSvc = data.find((s: any) => s._id === serviceId);
        if (!foundSvc) {
          foundSvc = data.find((s: any) => s.serviceKey === serviceId);
        }
        if (foundSvc) {
          setService(foundSvc);
          const foundSub = foundSvc.subServices?.find((s: any) => s._id === subServiceId || s.title === subServiceId);
          if (foundSub) {
            setSubService(foundSub);
          } else if (foundSvc.subServices?.length > 0) {
            setSubService(foundSvc.subServices[0]);
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
      const targetServiceId = service?._id || serviceId;
      const targetSubServiceId = subService?._id ? subService._id.toString() : (subServiceId || '0');
      const targetPriceEur = Number(subService?.priceFrom || subService?.price || 0);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: targetServiceId,
          subServiceId: targetSubServiceId,
          serviceName: getLocString(service?.title, locale) || 'Service',
          subServiceName: getLocString(subService?.title, locale) || 'Sub Service',
          price: Number((targetPriceEur * (selectedCurrency.rateAgainstEur || 1)).toFixed(2)),
          currency: selectedCurrency.currencyCode,
          currencySymbol: selectedCurrency.symbol,
          exchangeRate: selectedCurrency.rateAgainstEur,
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

  const isRtl = locale === 'ar';
  const mainTitle = getLocString(service?.title, locale);
  const subTitle = getLocString(subService?.title, locale);
  const subDesc = getLocString(subService?.description, locale);
  const price = subService?.priceFrom || subService?.price || 0;
  const original = subService?.originalPrice || 0;
  const discountPct = original > price ? Math.round(((original - price) / original) * 100) : 0;

  const imagesList = Array.isArray(subService?.images) && subService.images.length > 0
    ? subService.images
    : (subService?.image ? [subService.image] : []);

  const highlightsList = getLocArray(subService?.highlights, locale);
  const deliveryRules = getLocArray(subService?.deliveryAndRevisions, locale);

  const homeLabel = locale === 'ar' ? 'الرئيسية' : locale === 'fr' ? 'Accueil' : locale === 'de' ? 'Startseite' : 'Home';
  const servicesLabel = locale === 'ar' ? 'الخدمات' : locale === 'fr' ? 'Services' : locale === 'de' ? 'Dienste' : 'Services';
  const vatLabel = locale === 'ar' ? 'شامل الرسوم والضريبة' : locale === 'fr' ? 'TVA incluse' : locale === 'de' ? 'inkl. MwSt.' : 'VAT included';

  // Dynamic Delivery Promise Resolution
  const customDeliveryEst = getLocString(subService?.deliveryEstimate, locale);
  const customDeliveryDuration = getLocString(subService?.deliveryDuration, locale);
  const defaultDelivery = locale === 'ar' ? 'جاهز للتسليم خلال 3-5 أيام عمل' : locale === 'fr' ? 'Livrable en 3 à 5 jours ouvrés' : locale === 'de' ? 'Lieferbar in 3-5 Werktagen' : 'Available for delivery in 3-5 business days';
  const deliveryPromise = customDeliveryEst || (customDeliveryDuration ? `${locale === 'ar' ? 'التسليم خلال' : locale === 'fr' ? 'Délai de livraison:' : locale === 'de' ? 'Lieferzeit:' : 'Delivery time:'} ${customDeliveryDuration}` : defaultDelivery);

  // Dynamic Warranty / Rights & Addons Resolution
  const addonItem = Array.isArray(subService?.addons) && subService.addons.length > 0 ? subService.addons[0] : null;
  const addonTitle = addonItem ? getLocString(addonItem.title, locale) : '';
  const addonPrice = addonItem?.price || 41.99;
  
  const ownershipRightsRules = getLocArray(subService?.ownershipAndRights, locale);
  const customWarrantyRule = ownershipRightsRules.length > 0 ? ownershipRightsRules[0] : '';
  
  const defaultWarranty = locale === 'ar' ? '24 شهر حماية وضمان ممتد للخدمة' : locale === 'fr' ? '24 Mois Garantie et protection étendue' : locale === 'de' ? '24 Monate Produktschutz & Garantie' : '24 Months Extended Warranty & Service Protection';
  
  const warrantyText = addonTitle || customWarrantyRule || defaultWarranty;
  const warrantyPrice = addonPrice;
  const finalTotal = price + (includeWarranty ? warrantyPrice : 0);
  const currRate = selectedCurrency.rateAgainstEur || 1;
  const currSymbol = selectedCurrency.symbol || '€';
  const currCode = selectedCurrency.currencyCode || 'EUR';

  const convertedBasePrice = (price * currRate).toFixed(2);
  const convertedOriginalPrice = (original * currRate).toFixed(2);
  const convertedWarrantyPrice = (warrantyPrice * currRate).toFixed(2);
  const convertedFinalTotal = (finalTotal * currRate).toFixed(2);
  const securityHeader = locale === 'ar' ? '🛡️ خيارات الخدمة والحماية الإضافية' : locale === 'fr' ? '🛡️ Options de service et garantie' : locale === 'de' ? '🛡️ Extra Service Optionen' : '🛡️ Extra Service & Protection';

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-venecos-black via-[#111] to-venecos-dark px-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-2xl space-y-4">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
            <MdCheckCircle className="text-green-500" size={56} />
          </div>
          <h1 className="text-3xl font-extrabold text-venecos-black">{t('requestReceived')}</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            {t('requestReceivedDesc', { package: subTitle })}
          </p>
          <Link href={`/${locale}/dashboard`} className="block pt-4">
            <Button variant="contained" color="primary" size="large" fullWidth sx={{ borderRadius: 9999, py: 2, fontWeight: 'bold', cursor: 'pointer !important' }}>
              {t('goToDashboard')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-900" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <Link href={`/${locale}/services/${serviceId}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-venecos-gold transition-colors text-xs font-bold uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <MdArrowBack size={16} className={isRtl ? 'rotate-180' : ''} />
          {t('backToPackages')}
        </Link>

        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
          <span>{homeLabel}</span> / <span>{servicesLabel}</span> / <span className="text-amber-600 font-bold">{mainTitle}</span>
        </div>
      </div>

      {/* Main Full Product Order Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden p-6 md:p-10 space-y-8">
        
        {/* Title Header Bar */}
        <div className="border-b border-gray-100 pb-6 space-y-2">
          <span className="inline-block text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
            {mainTitle}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              {subTitle}
            </h1>
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 self-start sm:self-auto">
              <MdStar className="text-lg" /> {subService?.rating || 4.8}
              <span className="text-gray-400 font-normal">({subService?.ratingCount || 24})</span>
            </div>
          </div>

          {/* Highlights Pills */}
          {highlightsList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {highlightsList.map((hl: string, idx: number) => (
                <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-lg">
                  ⚡ {hl}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Main Order & Product Details View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Gallery & Product Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Gallery + Main Image */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[380px] shrink-0">
                  {imagesList.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGalleryIdx(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeGalleryIdx === idx ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-md' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Preview Container */}
              <div className="relative flex-grow h-[300px] md:h-[380px] bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
                {imagesList[activeGalleryIdx] ? (
                  <img
                    src={imagesList[activeGalleryIdx]}
                    alt={subTitle}
                    className="w-full h-full object-contain p-4 transition-all duration-300"
                  />
                ) : (
                  <div className="text-6xl text-gray-300">🛍️</div>
                )}

                {discountPct > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-lg">
                    -{discountPct}% UVP
                  </div>
                )}
              </div>
            </div>

            {/* Description & Rules */}
            <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
                📋 {locale === 'ar' ? 'تفاصيل ومعايير الخدمة' : 'Service Specifications & Terms'}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {subDesc}
              </p>

              {deliveryRules.length > 0 && (
                <ul className="space-y-1.5 pt-2 border-t border-gray-200 text-xs text-gray-700 font-medium">
                  {deliveryRules.map((rule: string, rIdx: number) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Price, Options & Checkout Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 bg-white border border-gray-200 rounded-3xl p-6 shadow-md">
            
            {/* Exchange Rates Currency Selector */}
            {rates.length > 0 && (
              <div className="bg-gray-100/80 border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <MdCurrencyExchange className="text-amber-500 text-lg shrink-0" />
                  <span className="text-xs font-bold text-gray-800">
                    {locale === 'ar' ? 'عملة العرض والدفع:' : locale === 'fr' ? 'Devise d\'affichage :' : locale === 'de' ? 'Anzeigewährung:' : 'Display Currency:'}
                  </span>
                </div>
                <select
                  value={currCode}
                  onChange={(e) => {
                    const chosen = rates.find((r: any) => r.currencyCode === e.target.value);
                    if (chosen) setSelectedCurrency(chosen);
                  }}
                  className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-gray-900 outline-none focus:border-amber-500 shadow-xs cursor-pointer"
                >
                  {rates.map((r: any) => (
                    <option key={r.currencyCode} value={r.currencyCode}>
                      {r.currencyCode} ({r.symbol}) — {r.rateAgainstEur}x EUR
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Box */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">{t('totalFee')}</span>
                {discountPct > 0 && (
                  <span className="text-xs text-gray-400 line-through font-mono mr-2">
                    {currSymbol}{convertedOriginalPrice}
                  </span>
                )}
                <span className="text-3xl font-black text-amber-600 font-mono">{currSymbol}{convertedBasePrice}</span>
                {currCode !== 'EUR' && (
                  <span className="text-[11px] text-gray-400 block font-mono">({price} €)</span>
                )}
              </div>
              <span className="text-[11px] text-gray-500 font-medium">{vatLabel}</span>
            </div>

            {/* Delivery Promise Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900 font-bold">
              <MdLocalShipping className="text-xl text-emerald-600 shrink-0" />
              <span>{deliveryPromise}</span>
            </div>

            {/* Extra Protection Checkbox */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-900">
                {securityHeader}
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 hover:border-amber-400 cursor-pointer transition-colors text-xs font-semibold text-gray-800">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeWarranty}
                    onChange={(e) => setIncludeWarranty(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>{warrantyText}</span>
                </div>
                <span className="font-bold font-mono">+{currSymbol}{convertedWarrantyPrice}</span>
              </label>
            </div>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField label={t('firstName')} required fullWidth size="small" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                <TextField label={t('lastName')} required fullWidth size="small" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField label={t('email')} type="email" required fullWidth size="small" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled />
                <MuiTelInput label={t('phone')} fullWidth size="small" value={phone} onChange={(newPhone) => setPhone(newPhone)} defaultCountry="AE" dir="ltr" />
              </div>

              <TextField 
                label={t('requirements')} 
                multiline 
                rows={4} 
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
                sx={{
                  borderRadius: 9999,
                  py: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  mt: 2,
                  cursor: 'pointer !important',
                  '&:hover': {
                    cursor: 'pointer !important',
                    opacity: 0.9,
                  },
                }}
              >
                {submitting ? t('submitting') : `${t('submitRequest')} — ${currSymbol}${convertedFinalTotal}`}
              </Button>
              <p className="text-center text-xs text-gray-400">{t('noChargeWarning')}</p>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
