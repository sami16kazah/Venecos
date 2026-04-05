'use client';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const router = useRouter();
  const params = useParams() as { locale: string };
  const locale = params?.locale || "en";
  const tAuth = useTranslations('Auth');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!token) return <div className="p-10 text-center text-red-500 text-xl font-bold w-full mt-24">Invalid Missing Token</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMsg("Passwords do not match");
      return;
    }
    
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(() => window.location.href = `/${locale}/signin`, 2000);
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMsg(data.message || 'Failed to reset password');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-venecos-black">{tAuth('resetPasswordTitle')}</h1>
        
        {status === 'success' ? (
          <p className="text-green-600 bg-green-50 p-4 border border-green-200 rounded-md font-semibold text-center">Password successfully reset. Redirecting...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField label={tAuth('newPasswordLabel')} type="password" required fullWidth value={password} onChange={e => setPassword(e.target.value)} disabled={status === 'loading'}/>
            <TextField label={`Confirm Password`} type="password" required fullWidth value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={status === 'loading'}/>
            {status === 'error' && <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>}
            <Button type="submit" variant="contained" color="primary" disabled={status === 'loading'} sx={{ py: 1.5, fontWeight: 'bold', mt: 2 }}>
              {tAuth('resetPasswordTitle')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
