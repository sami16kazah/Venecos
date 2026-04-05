'use client';

import { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import { MdMenu, MdClose } from 'react-icons/md';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SignOutButton from './SignOutButton';

interface DashboardSidebarProps {
  locale: string;
  role: string;
  userName: string | null | undefined;
}

export default function DashboardSidebar({ locale, role, userName }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('Dashboard');

  // RTL for Arabic
  const isRtl = locale === 'ar';
  // Use logical border that flips with direction: border-s = left in LTR, right in RTL
  const navLinkClass = "px-4 py-3 hover:bg-white/10 rounded-md transition-colors font-medium border-s-4 border-transparent hover:border-venecos-gold";
  const navLinkActiveClass = `${navLinkClass} bg-white/5`;

  const sidebarContent = (
    <div
      className="flex flex-col h-full bg-venecos-black text-white p-6 justify-between"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div>
        <h2 className="text-2xl font-bold text-venecos-gold mb-10 tracking-widest flex flex-col">
          VENECOS
          <span className="block text-xs font-light text-white/50 tracking-normal mt-1 border-t border-white/10 pt-1">
            {role.toUpperCase()} PANEL
          </span>
        </h2>
        
        <nav className="flex flex-col gap-1">
          <Link 
            href={`/${locale}/dashboard`} 
            onClick={() => setMobileOpen(false)}
            className={navLinkActiveClass}
          >
            {t('overview')}
          </Link>

          {role === 'admin' && (
            <>
              <Link
                href={`/${locale}/dashboard/users`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                {t('manageUsers')}
              </Link>
              <Link
                href={`/${locale}/dashboard/applications`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                {t('applications')}
              </Link>
              <Link
                href={`/${locale}/dashboard/settings`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                {t('platformSettings')}
              </Link>
            </>
          )}

          {role === 'employee' && (
            <>
              <Link
                href={`/${locale}/dashboard/tasks`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                {t('assignedTasks')}
              </Link>
              <Link
                href={`/${locale}/dashboard/messages`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                {t('messages')}
              </Link>
            </>
          )}

          {role === 'client' && (
            <>
              <Link
                href={`/${locale}/dashboard/orders`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                {t('myOrders')}
              </Link>
              <Link
                href={`/${locale}/dashboard/invoices`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                {t('invoices')}
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="mt-10 pt-6 border-t border-white/10">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold group"
        >
          <span className={`transition-transform ${isRtl ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>
            {isRtl ? '→' : '←'}
          </span>
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );

  // Drawer anchor flips in RTL
  const drawerAnchor = isRtl ? 'right' : 'left';
  const sidebarPosition = isRtl ? 'right-0' : 'left-0';

  return (
    <>
      {/* Mobile Header / Toggle */}
      <div
        className="md:hidden flex items-center justify-between bg-venecos-black p-4 text-white sticky top-0 z-30 shadow-lg"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="text-xl font-bold text-venecos-gold tracking-widest">VENECOS</div>
        <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#D4AF37' }}>
          <MdMenu size={28} />
        </IconButton>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex w-64 fixed inset-y-0 ${sidebarPosition} z-20`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        anchor={drawerAnchor}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: '#0A0A0A', p: 0 } }}
      >
        {sidebarContent}
        <IconButton 
          onClick={() => setMobileOpen(false)} 
          sx={{ position: 'absolute', top: 16, [isRtl ? 'left' : 'right']: 16, color: 'white' }}
        >
          <MdClose size={24} />
        </IconButton>
      </Drawer>
    </>
  );
}
