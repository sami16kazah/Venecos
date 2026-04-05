'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, LinearProgress, Alert } from '@mui/material';
import { MdCheckCircle, MdUploadFile, MdArrowBack } from 'react-icons/md';
import { MuiTelInput } from 'mui-tel-input';
import Link from 'next/link';

const POSITIONS = ['Developer', 'UI/UX Designer', 'Video Editor', 'Project Manager'];

export default function ApplyPage() {
  const { data: session } = useSession();
  const t = useTranslations('Apply');
  const params = useParams() as { locale: string };
  const locale = params?.locale || 'en';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    message: '',
  });

  // Separate phone state for MuiTelInput (avoids nested object update issues)
  const [phone, setPhone] = useState('');

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState('');
  const [cvPublicId, setCvPublicId] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const user = session?.user as any;

  // Auto-fill from session
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
      // Set phone separately — only if it's a non-empty string from the session
      if (user.phoneNumber && typeof user.phoneNumber === 'string' && user.phoneNumber.trim()) {
        setPhone(user.phoneNumber.trim());
      }
    }
  }, [session]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }

    setCvFile(file);
    setError('');
    setUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress while waiting
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 85));
      }, 400);

      const res = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await res.json();
      if (res.ok && data.url) {
        setCvUrl(data.url);
        setCvPublicId(data.publicId);
        setUploaded(true);
      } else {
        setError(data.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      setError('Upload failed. Please check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvUrl) {
      setError('Please upload your CV first.');
      return;
    }
    if (!form.position) {
      setError('Please select a position.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone,
          cvUrl,
          cvPublicId,
          userId: user?.id || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-venecos-black via-[#111] to-venecos-dark px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 border-2 border-green-500/30">
            <MdCheckCircle className="text-green-400" size={48} />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4">{t('successTitle')}</h1>
          <p className="text-white/60 text-lg mb-8">{t('successMsg')}</p>
          <Link href={`/${locale}`}>
            <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 9999, px: 6, py: 1.5, fontWeight: 'bold' }}>
              {t('backHome')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-venecos-gold transition-colors text-sm font-medium mb-6">
          <MdArrowBack size={18} />
          {t('backHome')}
        </Link>
        <div className="bg-venecos-gold/10 border border-venecos-gold/20 rounded-2xl p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-venecos-black mb-2">{t('title')}</h1>
          <p className="text-gray-500 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
        {user && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }} icon={false}>
            {t('autoFillNote')}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label={t('firstNameLabel')}
              required
              fullWidth
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
            />
            <TextField
              label={t('lastNameLabel')}
              required
              fullWidth
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          {/* Email */}
          <TextField
            label={t('emailLabel')}
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          {/* Phone */}
          <MuiTelInput
            label={t('phoneLabel')}
            fullWidth
            value={phone}
            onChange={(newPhone) => setPhone(newPhone)}
            defaultCountry="AE"
            lang={locale}
            dir="ltr"
          />

          {/* Position */}
          <FormControl fullWidth required>
            <InputLabel>{t('positionLabel')}</InputLabel>
            <Select
              label={t('positionLabel')}
              value={form.position}
              onChange={e => setForm({ ...form, position: e.target.value })}
            >
              {POSITIONS.map(pos => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Cover Message */}
          <TextField
            label={t('messageLabel')}
            multiline
            rows={4}
            fullWidth
            placeholder={t('messagePlaceholder')}
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
          />

          {/* CV Upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-venecos-gold/50 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <MdUploadFile size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 font-medium mb-3">{t('cvLabel')}</p>

            {uploaded ? (
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                <MdCheckCircle size={20} />
                <span>{cvFile?.name} — {t('cvUploaded')}</span>
              </div>
            ) : uploading ? (
              <div className="w-full max-w-xs mx-auto">
                <p className="text-sm text-venecos-gold mb-2">{t('cvUploading')} {uploadProgress}%</p>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 99 }} />
              </div>
            ) : (
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                sx={{ borderRadius: 9999, borderColor: '#D4AF37', color: '#D4AF37', '&:hover': { borderColor: '#FFDF00', bgcolor: 'transparent' } }}
              >
                {t('cvButton')}
              </Button>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={submitting || uploading || !uploaded}
            sx={{ borderRadius: 9999, py: 1.8, fontWeight: 'bold', mt: 2 }}
          >
            {submitting ? t('submitting') : t('submitBtn')}
          </Button>
        </form>
      </div>
    </div>
  );
}
