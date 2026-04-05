'use client';
import { useState } from 'react';
import { Button, IconButton, Drawer, List, Box } from '@mui/material';
import { MdMenu, MdClose } from 'react-icons/md';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface HomeNavbarProps {
  locale: string;
  locales: string[];
  session: any;
}

export default function HomeNavbar({ locale, locales, session }: HomeNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const tNav = useTranslations('Navigation');

  const navLinks = [
    { label: tNav('home'), href: `/${locale}` },
    { label: tNav('services'), href: '#services' },
    { label: tNav('contact'), href: '#contact' },
  ];

  return (
    <nav className="w-full flex items-center justify-between p-6 shadow-sm bg-venecos-black text-venecos-white sticky top-0 z-50">
      <div className="text-3xl font-extrabold text-venecos-gold tracking-wider">VENECOS</div>
      
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
        
        <div className="flex gap-3 text-base border-gray-600 border-s-2 ps-4 ms-2">
          {locales.map((l) => (
            <Link key={l} href={`/${l}`} className={`transition-colors hover:text-venecos-yellow ${locale === l ? 'text-venecos-gold border-b-2 border-venecos-gold pb-1' : 'text-gray-400'}`}>
              {l.toUpperCase()}
            </Link>
          ))}
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

            <div className="flex justify-center gap-4 border-t border-white/10 pt-6 mt-2">
              {locales.map((l) => (
                <Link key={l} href={`/${l}`} onClick={() => setMobileOpen(false)} className={`text-lg font-bold ${locale === l ? 'text-venecos-gold' : 'text-gray-500'}`}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </Box>
        </List>
      </Drawer>
    </nav>
  );
}
