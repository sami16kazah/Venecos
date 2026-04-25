'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { Button, TextField, IconButton, InputAdornment, Alert, CircularProgress } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { MuiTelInput } from 'mui-tel-input';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';

const countryCodes = [
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+966', label: 'KSA (+966)' },
  { code: '+20', label: 'EG (+20)' },
  { code: '+33', label: 'FR (+33)' },
  { code: '+49', label: 'DE (+49)' },
  { code: '+974', label: 'QA (+974)' },
  { code: '+965', label: 'KW (+965)' },
  { code: '+973', label: 'BH (+973)' },
  { code: '+968', label: 'OM (+968)' },
  { code: '+212', label: 'MA (+212)' },
  { code: '+213', label: 'DZ (+213)' },
  { code: '+216', label: 'TN (+216)' }
];

export default function SignUpPage() {
  const { data: session, status } = useSession();
  const params = useParams() as { locale: string };
  const locale = params?.locale || "en";
  
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><CircularProgress sx={{ color: '#D4AF37' }} /></div>}>
      <SignUpForm status={status} locale={locale} />
    </Suspense>
  );
}

function SignUpForm({ status, locale }: { status: string, locale: string }) {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", username: "", email: "", password: "", confirmPassword: "", phone: "", 
    postCode: "", city: "", street: "", house: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const tAuth = useTranslations('Auth');
  const searchParams = useSearchParams();
  const isRtl = locale === 'ar';
  const [googlePrefilled, setGooglePrefilled] = useState(false);

  // Read Google pre-fill params from URL (when unregistered Google email redirects here)
  useEffect(() => {
    const googleEmail = searchParams.get('googleEmail');
    const googleName = searchParams.get('googleName');
    if (googleEmail || googleName) {
      const nameParts = decodeURIComponent(googleName || '').split(' ');
      setFormData(prev => ({
        ...prev,
        email: decodeURIComponent(googleEmail || ''),
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }));
      setGooglePrefilled(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = `/${locale}/dashboard`;
    }
  }, [status, locale]);

  const passwordsMatch = formData.confirmPassword === "" || formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError(tAuth('passwordMismatch'));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phone,
          address: {
            postCode: formData.postCode,
            cityName: formData.city,
            street: formData.street,
            house: formData.house
          }
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 p-4 py-12 relative">
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
      <div className="bg-white max-w-2xl w-full p-6 sm:p-12 rounded-2xl shadow-xl border border-gray-100 mt-16 sm:mt-0 relative z-0">
        <div className="flex justify-center mb-6">
          <img src="/Venecos Logo.png" alt="Venecos" className="h-10 w-auto object-contain" />
        </div>
        <h1 className="text-3xl font-extrabold text-venecos-black mb-2 text-center">{tAuth('signUpTitle')}</h1>
        <p className="text-center text-gray-500 mb-8">{tAuth('signUpDesc')}</p>
        
        {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6 font-semibold shadow-sm text-center">{tAuth('signupSuccess')}</div>}
        {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-md mb-6 font-medium text-center">{error}</div>}

        {googlePrefilled && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }} icon={false}>
            Your Google account is not registered yet. Your email and name have been pre-filled — just complete the form to create your account.
          </Alert>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField label={tAuth('firstNameLabel')} required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              <TextField label={tAuth('lastNameLabel')} required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
            
            <TextField label={tAuth('usernameLabel')} required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
            <TextField label={tAuth('emailLabel')} type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            
            <TextField 
              dir="ltr"
              label={tAuth('passwordLabel')} 
              type={showPassword ? "text" : "password"} 
              required 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField 
              dir="ltr"
              label={tAuth('confirmPasswordLabel')} 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              value={formData.confirmPassword} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              error={!passwordsMatch}
              helperText={!passwordsMatch ? tAuth('passwordMismatch') : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <MuiTelInput 
              label={tAuth('phoneLabel')} 
              value={formData.phone} 
              onChange={(newPhone) => setFormData({...formData, phone: newPhone})} 
              defaultCountry="AE"
              fullWidth
              lang={locale}
              dir="ltr"
            />
            
            <h3 className="text-lg font-bold mt-4 pt-4 border-t border-gray-100 text-venecos-black">{tAuth('addressTitle')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField label={tAuth('cityLabel')} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              <TextField label={tAuth('postCodeLabel')} value={formData.postCode} onChange={(e) => setFormData({...formData, postCode: e.target.value})} />
              <TextField label={tAuth('streetLabel')} value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} />
              <TextField label={tAuth('houseLabel')} value={formData.house} onChange={(e) => setFormData({...formData, house: e.target.value})} />
            </div>

            <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={{ py: 2, fontWeight: 'bold', mt: 4 }}>
              {loading ? "..." : tAuth('signUpBtn')}
            </Button>
          </form>
        )}

        <p className="text-center mt-8 text-gray-600 text-sm">
          {tAuth('hasAccount')} <Link href={`/${locale}/signin`} className="text-venecos-gold font-bold hover:underline">{tAuth('signInTitle')}</Link>
        </p>
      </div>
    </div>
  );
}
