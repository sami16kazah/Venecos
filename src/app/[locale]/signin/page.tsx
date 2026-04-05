'use client';
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const searchParams = useSearchParams();
  const tAuth = useTranslations('Auth');
  const params = useParams() as { locale: string };
  const locale = params?.locale || "en";
  const isRtl = locale === 'ar';
  
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = `/${locale}/dashboard`;
    }
    if (searchParams?.get("error") === "NotRegistered") {
      setError("This Google account is not registered. Please sign up first.");
    } else if (searchParams?.get("error")) {
      setError("An error occurred during authentication.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      window.location.href = `/${locale}/dashboard`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-4 right-4 flex gap-2 md:gap-3 text-[10px] md:text-sm bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm z-10">
        {['en', 'ar', 'fr', 'de'].map((l) => (
          <button
            key={l}
            onClick={() => {
              const currentPath = window.location.pathname;
              const newPath = currentPath.replace(`/${locale}`, `/${l}`);
              window.location.href = newPath + window.location.search;
            }}
            className={`uppercase font-bold hover:text-venecos-gold transition-colors ${locale === l ? 'text-venecos-gold' : 'text-gray-400'}`}
          >{l}</button>
        ))}
      </div>
      <div className="bg-white max-w-md w-full p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mt-16 sm:mt-0 relative z-0">
        <h1 className="text-3xl font-extrabold text-venecos-black mb-2 text-center">{tAuth('signInTitle')}</h1>
        <p className="text-center text-gray-500 mb-8">{tAuth('signInDesc')}</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm text-center font-medium border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextField 
            label={tAuth('emailLabel')} 
            variant="outlined" 
            type="email" 
            fullWidth 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField 
            dir="ltr"
            label={tAuth('passwordLabel')} 
            variant="outlined" 
            type={showPassword ? "text" : "password"} 
            fullWidth 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Link href={`/${locale}/forgot-password`} className="text-sm font-semibold text-venecos-gold self-end hover:underline">
            {tAuth('forgotPasswordBtn')}
          </Link>
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ py: 1.5, fontWeight: 'bold', mt: 1 }}>
            {tAuth('signInBtn')}
          </Button>
        </form>

        <div className="mt-6 flex items-center">
          <div className="border-t border-gray-200 flex-grow"></div>
          <span className="px-4 text-gray-400 text-sm font-semibold">OR</span>
          <div className="border-t border-gray-200 flex-grow"></div>
        </div>

        <Button 
          variant="outlined" 
          fullWidth 
          sx={{ mt: 6, py: 1.5, fontWeight: 'bold', color: '#4285F4', borderColor: '#e0e0e0', '&:hover': { borderColor: '#4285F4', backgroundColor: 'rgba(66, 133, 244, 0.04)' } }}
          onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard` }, { prompt: 'select_account' })}
        >
          {tAuth('signInGoogle')}
        </Button>

        <p className="text-center mt-8 text-gray-600 text-sm">
          {tAuth('noAccount')} <Link href={`/${locale}/signup`} className="text-venecos-gold font-bold hover:underline">{tAuth('signUpTitle')}</Link>
        </p>
      </div>
    </div>
  );
}
