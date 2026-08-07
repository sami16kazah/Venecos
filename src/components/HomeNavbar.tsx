'use client';
import { useState } from 'react';
import { Button, IconButton, Drawer, List, Box } from '@mui/material';
import { MdMenu, MdClose, MdLanguage } from 'react-icons/md';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

interface HomeNavbarProps {
  locale: string;
  locales: string[];
  session: any;
}

const LANGUAGE_LABELS: Record<string, string> = {
  ar: 'العربية (AR)',
  en: 'English (EN)',
  fr: 'Français (FR)',
  de: 'Deutsch (DE)',
};

export default function HomeNavbar({ locale, locales, session }: HomeNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const tNav = useTranslations('Navigation');
  const pathname = usePathname();
  const router = useRouter();

  const getPathForLocale = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && segments[0] === locale) {
      segments[0] = newLocale;
      return `/${segments.join('/')}`;
    }
    return `/${newLocale}`;
  };

  const navLinks = [
    { label: tNav('home'), href: `/${locale}` },
    { label: tNav('services'), href: `/${locale}/services` },
    { label: tNav('about') || 'About Us', href: `/${locale}/about` },
    { label: tNav('join'), href: `/${locale}#join` },
  ];

  return (
    <nav className="w-full flex items-center justify-between p-6 shadow-sm bg-venecos-black text-venecos-white sticky top-0 z-50">
      <Link href={`/${locale}`} className="flex items-center shrink-0">
        <img src="/Venecos Logo.png" alt="Venecos Icon" className="h-10 w-auto object-contain md:hidden" />
        <img src="/Venecos.png" alt="Venecos" className="hidden md:block h-16 md:h-20 w-auto object-contain" />
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 items-center text-base font-medium">
        {navLinks.map((link) => (
          <Link key={link.label} href={link.href} className="hover:text-venecos-gold transition-colors">
            {link.label}
          </Link>
        ))}
        
        {session ? (
          <Link href={`/${locale}/dashboard`} passHref>
            <Button variant="contained" color="primary" sx={{ borderRadius: 9999, px: 3, py: 0.5, fontWeight: 'bold' }}>
              {tNav('dashboard')}
            </Button>
          </Link>
        ) : (
          <Link href={`/${locale}/signin`} passHref>
            <Button variant="outlined" color="primary" sx={{ borderRadius: 9999, borderColor: '#D4AF37', color: '#D4AF37', '&:hover': { borderColor: '#FFDF00', color: '#FFDF00' }, minWidth: 'auto', px: 3, py: 0.5, fontWeight: 'bold' }}>
              {tNav('signIn')}
            </Button>
          </Link>
        )}
        
        {/* Language Dropdown Select */}
        <div className="relative border-gray-600 border-s-2 ps-4 ms-2 flex items-center gap-1.5">
          <MdLanguage className="text-venecos-gold text-xl shrink-0" />
          <select
            aria-label="Select Language"
            value={locale}
            onChange={(e) => router.push(getPathForLocale(e.target.value))}
            className="bg-venecos-black text-white border border-gray-700 hover:border-venecos-gold focus:border-venecos-gold rounded-lg px-2.5 py-1 text-xs font-bold uppercase cursor-pointer outline-none transition-colors"
          >
            {locales.map((l) => (
              <option key={l} value={l} className="bg-venecos-black text-white py-1">
                {LANGUAGE_LABELS[l] || l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <IconButton 
        className="md:hidden" 
        onClick={() => setMobileOpen(true)}
        sx={{ color: '#D4AF37' }}
      >
        <MdMenu size={32} />
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: '80%', maxWidth: 300, bgcolor: '#0A0A0A', color: 'white', p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
            <MdClose size={32} />
          </IconButton>
        </Box>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="text-xl font-bold hover:text-venecos-gold transition-colors py-2 border-b border-white/5">
              {link.label}
            </Link>
          ))}

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {session ? (
              <Link href={`/${locale}/dashboard`} onClick={() => setMobileOpen(false)}>
                <Button fullWidth variant="contained" color="primary" sx={{ borderRadius: 9999, py: 1.5, fontWeight: 'bold' }}>
                  {tNav('dashboard')}
                </Button>
              </Link>
            ) : (
              <Link href={`/${locale}/signin`} onClick={() => setMobileOpen(false)}>
                <Button fullWidth variant="outlined" color="primary" sx={{ borderRadius: 9999, py: 1.5, fontWeight: 'bold', borderColor: '#D4AF37', color: '#D4AF37' }}>
                  {tNav('signIn')}
                </Button>
              </Link>
            )}

            {/* Mobile Language Dropdown */}
            <div className="flex flex-col gap-2 border-t border-white/10 pt-6 mt-2">
              <label className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                <MdLanguage className="text-venecos-gold text-base" /> Select Language / اختر اللغة
              </label>
              <select
                aria-label="Select Language Mobile"
                value={locale}
                onChange={(e) => {
                  setMobileOpen(false);
                  router.push(getPathForLocale(e.target.value));
                }}
                className="w-full bg-[#1A1A1A] text-white border border-gray-700 focus:border-venecos-gold rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer outline-none"
              >
                {locales.map((l) => (
                  <option key={l} value={l} className="bg-[#1A1A1A] text-white">
                    {LANGUAGE_LABELS[l] || l.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </Box>
        </List>
      </Drawer>
    </nav>
  );
}

