'use client';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const tAuth = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-venecos-black">{tAuth('forgotPasswordBtn')}</h1>
        
        {status === 'success' ? (
          <p className="text-green-600 bg-green-50 p-4 border border-green-200 font-semibold rounded-md text-center">If that email exists, we've sent a reset link to it.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField label={tAuth('emailLabel')} type="email" required fullWidth value={email} onChange={e => setEmail(e.target.value)} disabled={status === 'loading'}/>
            {status === 'error' && <p className="text-red-500 text-sm font-semibold">Failed to submit request.</p>}
            <Button type="submit" variant="contained" color="primary" disabled={status === 'loading'} sx={{ py: 1.5, fontWeight: 'bold' }}>
              {tAuth('resetBtn')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
