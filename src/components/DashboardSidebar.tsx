'use client';

import { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import { MdMenu, MdClose } from 'react-icons/md';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { 
  MdDashboard, MdGroup, MdDesignServices, MdAssignment, 
  MdRecentActors, MdSettings, MdAssignmentInd, MdReceipt,
  MdSlideshow, MdLocalOffer, MdPhotoLibrary, MdSupervisorAccount,
  MdBadge, MdAdminPanelSettings, MdPeople, MdAccountTree,
  MdCurrencyExchange, MdLocationOn, MdDescription, MdGavel, MdWork
} from 'react-icons/md';

interface DashboardSidebarProps {
  locale: string;
  role: string;
  userName: string | null | undefined;
}

export default function DashboardSidebar({ locale, role, userName }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('Dashboard');
  const pathname = usePathname();

  const isRtl = locale === 'ar';
  
  const baseLinkClass = "flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 font-semibold border-s-4 border-transparent text-sm tracking-wide text-white/80 hover:text-white";
  const activeLinkClass = "flex items-center gap-3 px-4 py-2.5 bg-venecos-gold/15 text-venecos-gold border-s-4 border-venecos-gold rounded-xl font-bold text-sm tracking-wide";

  const isLinkActive = (path: string) => {
    if (path === `/${locale}/dashboard`) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const renderLink = (href: string, label: string, icon: React.ReactNode) => {
    const active = isLinkActive(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen(false)}
        className={active ? activeLinkClass : baseLinkClass}
      >
        <span className="text-lg flex-shrink-0" style={{ marginInlineEnd: '10px' }}>{icon}</span>
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  const renderSectionHeader = (title: string) => (
    <div className="px-4 mt-5 mb-2 text-[10px] uppercase font-bold tracking-widest text-venecos-gold/70 border-b border-white/5 pb-1">
      {title}
    </div>
  );

  const sidebarContent = (
    <div
      className="flex flex-col h-full bg-venecos-black text-white p-5 overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div>
        <div className="mb-6 flex flex-col">
          <img src="/Venecos.png" alt="Venecos" className="h-12 w-auto object-contain self-start" />
          <span className="block text-[11px] font-light text-white/50 tracking-normal mt-1 border-t border-white/10 pt-1">
            {role.toUpperCase()} PANEL
          </span>
        </div>
        
        <nav className="flex flex-col gap-1">
          {/* General Section */}
          {renderSectionHeader(isRtl ? 'عام' : 'GENERAL')}
          {renderLink(`/${locale}/dashboard`, t('overview'), <MdDashboard />)}

          {role === 'admin' && (
            <>
              {/* Content Section */}
              {renderSectionHeader(isRtl ? 'المحتوى' : 'CONTENT')}
              {renderLink(`/${locale}/dashboard/slider`, t('slider'), <MdSlideshow />)}
              {renderLink(`/${locale}/dashboard/services`, t('manageServices'), <MdDesignServices />)}
              {renderLink(`/${locale}/dashboard/offers`, t('offers'), <MdLocalOffer />)}
              {renderLink(`/${locale}/dashboard/gallery`, t('gallery'), <MdPhotoLibrary />)}

              {/* Permissions Section */}
              {renderSectionHeader(isRtl ? 'الصلاحيات' : 'PERMISSIONS')}
              {renderLink(`/${locale}/dashboard/admins`, t('admins'), <MdAdminPanelSettings />)}
              {renderLink(`/${locale}/dashboard/supervisors`, t('supervisors'), <MdSupervisorAccount />)}
              {renderLink(`/${locale}/dashboard/users`, t('manageUsers'), <MdGroup />)}

              {/* Operations Section */}
              {renderSectionHeader(isRtl ? 'العمليات' : 'OPERATIONS')}
              {renderLink(`/${locale}/dashboard/orders`, t('manageOrders'), <MdAssignment />)}
              {renderLink(`/${locale}/dashboard/projects`, t('projects'), <MdAccountTree />)}
              {renderLink(`/${locale}/dashboard/invoices`, t('invoices'), <MdReceipt />)}
              {renderLink(`/${locale}/dashboard/applications`, t('recruitment'), <MdRecentActors />)}

              {/* Analytics & Finance */}
              {renderSectionHeader(isRtl ? 'المالية والإحصائيات' : 'FINANCE & ANALYTICS')}
              {renderLink(`/${locale}/dashboard/exchange-rates`, t('exchangeRates'), <MdCurrencyExchange />)}

              {/* Branches */}
              {renderSectionHeader(isRtl ? 'الفروع' : 'BRANCHES')}
              {renderLink(`/${locale}/dashboard/branches`, t('branches'), <MdLocationOn />)}

              {/* Contracts & Disputes */}
              {renderSectionHeader(isRtl ? 'العقود والنزاعات' : 'CONTRACTS & DISPUTES')}
              {renderLink(`/${locale}/dashboard/contracts`, t('contracts'), <MdDescription />)}
              {renderLink(`/${locale}/dashboard/disputes`, t('disputes'), <MdGavel />)}

              {/* System Settings */}
              {renderSectionHeader(isRtl ? 'النظام' : 'SYSTEM')}
              {renderLink(`/${locale}/dashboard/settings`, t('platformSettings'), <MdSettings />)}
              {renderLink(`/${locale}/dashboard/assigned-orders`, t('myAssignments'), <MdAssignmentInd />)}
            </>
          )}

          {role === 'employee' && (
            <>
              {renderSectionHeader(isRtl ? 'مهامي' : 'MY WORK')}
              {renderLink(`/${locale}/dashboard/assigned-orders`, t('myAssignments'), <MdAssignmentInd />)}
              {renderLink(`/${locale}/dashboard/projects`, t('projects'), <MdAccountTree />)}
            </>
          )}

          {role === 'client' && (
            <>
              {renderSectionHeader(isRtl ? 'مشاريعي' : 'MY PROJECTS')}
              {renderLink(`/${locale}/dashboard/orders`, t('myOrders'), <MdAssignment />)}
              {renderLink(`/${locale}/dashboard/invoices`, t('invoices'), <MdReceipt />)}
            </>
          )}
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-white/10">
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
