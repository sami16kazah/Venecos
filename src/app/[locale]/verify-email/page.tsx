'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const tAuth = useTranslations('Auth');
  const params = useParams() as { locale: string };
  const locale = params?.locale || "en";
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        
        if (res.ok) {
          setStatus('success');
          setMessage(tAuth('emailVerified'));
        } else {
          const data = await res.json();
          setStatus('error');
          setMessage(data.message || 'Failed to verify email');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error occurred.');
      }
    };

    verifyToken();
  }, [token, tAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
        <h1 className="text-2xl font-bold mb-6 text-venecos-black">
          {status === 'loading' ? tAuth('verifyingEmailTitle') : (status === 'success' ? 'Success' : 'Error')}
        </h1>
        
        <p className={`mb-8 ${status === 'error' ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
          {status === 'loading' ? 'Please wait while we verify your email...' : message}
        </p>

        {status === 'success' && (
          <Link href={`/${locale}/signin`} passHref>
            <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontWeight: 'bold' }}>
              {tAuth('signInBtn')}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
