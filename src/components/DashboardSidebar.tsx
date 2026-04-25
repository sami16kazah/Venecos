'use client';

import { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import { MdMenu, MdClose } from 'react-icons/md';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SignOutButton from './SignOutButton';

import { 
  MdDashboard, MdGroup, MdDesignServices, MdAssignment, 
  MdRecentActors, MdSettings, MdAssignmentInd, MdReceipt 
} from 'react-icons/md';

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
  const navLinkClass = "flex items-center gap-4 px-6 py-4 hover:bg-white/10 rounded-xl transition-all duration-300 font-bold border-s-4 border-transparent hover:border-venecos-gold text-sm tracking-wide";
  const navLinkActiveClass = `${navLinkClass} bg-venecos-gold/10 text-venecos-gold border-venecos-gold`;

  const sidebarContent = (
    <div
      className="flex flex-col h-full bg-venecos-black text-white p-6 justify-between"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div>
        <div className="mb-10 flex flex-col">
          <img src="/Venecos.png" alt="Venecos" className="h-14 md:h-16 w-auto object-contain self-start" />
          <span className="block text-xs font-light text-white/50 tracking-normal mt-2 border-t border-white/10 pt-1">
            {role.toUpperCase()} PANEL
          </span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link 
            href={`/${locale}/dashboard`} 
            onClick={() => setMobileOpen(false)}
            className={navLinkActiveClass}
          >
            <MdDashboard size={20} style={{ marginInlineEnd: '16px' }} />
            {t('overview')}
          </Link>

          {role === 'admin' && (
            <>
              <Link
                href={`/${locale}/dashboard/users`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <MdGroup size={20} style={{ marginInlineEnd: '16px' }} />
                {t('manageUsers')}
              </Link>
              <Link
                href={`/${locale}/dashboard/services`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <MdDesignServices size={20} style={{ marginInlineEnd: '16px' }} />
                {t('manageServices')}
              </Link>
              <Link
                href={`/${locale}/dashboard/orders`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <MdAssignment size={20} style={{ marginInlineEnd: '16px' }} />
                {t('manageOrders')}
              </Link>
              <Link
                href={`/${locale}/dashboard/applications`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <MdRecentActors size={20} style={{ marginInlineEnd: '16px' }} />
                {t('applications')}
              </Link>
              <Link
                href={`/${locale}/dashboard/settings`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <MdSettings size={20} style={{ marginInlineEnd: '16px' }} />
                {t('platformSettings')}
              </Link>
              <Link
                href={`/${locale}/dashboard/assigned-orders`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <MdAssignmentInd size={20} style={{ marginInlineEnd: '16px' }} />
                {t('myAssignments') || 'My Assignments'}
              </Link>
            </>
          )}

          {role === 'employee' && (
            <>
              <Link
                href={`/${locale}/dashboard/assigned-orders`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <MdAssignmentInd size={20} style={{ marginInlineEnd: '24px' }} />
                {t('myAssignments') || 'My Assignments'}
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
                <MdAssignment size={20} style={{ marginInlineEnd: '24px' }} />
                {t('myOrders')}
              </Link>
              <Link
                href={`/${locale}/dashboard/invoices`}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <MdReceipt size={20} style={{ marginInlineEnd: '24px' }} />
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
        <div className="flex items-center">
          <img src="/Venecos Logo.png" alt="Venecos" className="h-10 w-auto object-contain" />
        </div>
        <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#D4AF37' }}>
          <MdMenu size={28} />
        </IconButton>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex w-72 min-w-[288px] fixed inset-y-0 ${sidebarPosition} z-20 shadow-2xl`}>
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
