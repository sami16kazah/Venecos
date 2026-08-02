'use client';

import { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import { 
  MdMenu, MdClose, MdDashboard, MdGroup, MdDesignServices, 
  MdAssignment, MdRecentActors, MdSettings, MdAssignmentInd, 
  MdReceipt, MdSlideshow, MdLocalOffer, MdPhotoLibrary, 
  MdSupervisorAccount, MdAdminPanelSettings, MdAccountTree, 
  MdCurrencyExchange, MdLocationOn, MdDescription, MdGavel, 
  MdExpandMore, MdChevronLeft, MdLaptop, MdPalette, MdPrint, MdStar
} from 'react-icons/md';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface DashboardSidebarProps {
  locale: string;
  role: string;
  userName: string | null | undefined;
}

export default function DashboardSidebar({ locale, role, userName }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesDropOpen, setServicesDropOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>('tech');

  const t = useTranslations('Dashboard');
  const pathname = usePathname();
  const isRtl = locale === 'ar';
  
  const baseLinkClass = "flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 font-medium text-xs tracking-wide text-white/70 hover:text-white";
  const activeLinkClass = "flex items-center gap-3 px-4 py-2.5 bg-venecos-gold/20 text-venecos-gold border-s-4 border-venecos-gold rounded-xl font-bold text-xs tracking-wide shadow-md";

  const isLinkActive = (path: string) => {
    if (path === `/${locale}/dashboard`) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const renderLink = (href: string, label: string, icon: React.ReactNode, badge?: string) => {
    const active = isLinkActive(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen(false)}
        className={active ? activeLinkClass : baseLinkClass}
      >
        <span className="text-base flex-shrink-0">{icon}</span>
        <span className="truncate flex-1">{label}</span>
        {badge && (
          <span className="bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const renderSectionHeader = (title: string) => (
    <div className="px-4 mt-5 mb-2 text-[10px] uppercase font-bold tracking-widest text-venecos-gold/70 border-b border-white/5 pb-1">
      {title}
    </div>
  );

  const toggleCategory = (cat: string) => {
    setActiveCategory(activeCategory === cat ? null : cat);
  };

  const sidebarContent = (
    <div
      className="flex flex-col h-full bg-venecos-black text-white p-5 overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div>
        <div className="mb-6 flex flex-col">
          <img src="/Venecos.png" alt="Venecos" className="h-10 w-auto object-contain self-start" />
          <span className="block text-[10px] font-bold text-venecos-gold tracking-widest mt-2 border-t border-white/10 pt-1">
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

              {/* Nested Services Submenu matching Legacy */}
              <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
                <button
                  onClick={() => setServicesDropOpen(!servicesDropOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-white/80 hover:text-venecos-gold hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <MdDesignServices className="text-venecos-gold text-base" />
                    <span>{t('manageServices')}</span>
                  </div>
                  <MdExpandMore className={`transition-transform duration-200 ${servicesDropOpen ? 'rotate-180' : ''}`} />
                </button>

                {servicesDropOpen && (
                  <div className="p-2 space-y-1 bg-black/40 border-t border-white/5 text-xs">
                    {/* Tech Services */}
                    <div>
                      <button
                        onClick={() => toggleCategory('tech')}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-white/60 hover:text-white font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <MdLaptop className="text-venecos-gold" />
                          <span>الخدمات التقنية</span>
                        </div>
                        <MdChevronLeft className={`transition-transform ${activeCategory === 'tech' ? '-rotate-90' : ''}`} />
                      </button>
                      {activeCategory === 'tech' && (
                        <div className="ps-6 py-1 space-y-1 text-[11px]">
                          <Link href={`/${locale}/dashboard/services`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • البرمجة والمواقع
                          </Link>
                          <Link href={`/${locale}/dashboard/services`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • Shared Hosting & VPS
                          </Link>
                          <Link href={`/${locale}/dashboard/services`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • الدومينات والدعم الفني
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Design Services */}
                    <div>
                      <button
                        onClick={() => toggleCategory('design')}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-white/60 hover:text-white font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <MdPalette className="text-venecos-gold" />
                          <span>خدمات التصميم</span>
                        </div>
                        <MdChevronLeft className={`transition-transform ${activeCategory === 'design' ? '-rotate-90' : ''}`} />
                      </button>
                      {activeCategory === 'design' && (
                        <div className="ps-6 py-1 space-y-1 text-[11px]">
                          <Link href={`/${locale}/dashboard/services`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • التصميم الفوتوغرافي
                          </Link>
                          <Link href={`/${locale}/dashboard/services`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • إنتاج الفيديو 3D
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Print Services */}
                    <div>
                      <button
                        onClick={() => toggleCategory('print')}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-white/60 hover:text-white font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <MdPrint className="text-venecos-gold" />
                          <span>خدمات الطباعة</span>
                        </div>
                        <MdChevronLeft className={`transition-transform ${activeCategory === 'print' ? '-rotate-90' : ''}`} />
                      </button>
                      {activeCategory === 'print' && (
                        <div className="ps-6 py-1 space-y-1 text-[11px]">
                          <Link href={`/${locale}/dashboard/services`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • الطباعة الورقية والملصقات
                          </Link>
                          <Link href={`/${locale}/dashboard/services`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • الطباعة ثلاثية الأبعاد 3D
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {renderLink(`/${locale}/dashboard/offers`, t('offers'), <MdLocalOffer />)}
              {renderLink(`/${locale}/dashboard/gallery`, t('gallery'), <MdPhotoLibrary />)}

              {/* Permissions Section */}
              {renderSectionHeader(isRtl ? 'الصلاحيات' : 'PERMISSIONS')}
              {renderLink(`/${locale}/dashboard/admins`, t('admins'), <MdAdminPanelSettings />, 'Super')}
              {renderLink(`/${locale}/dashboard/supervisors`, t('supervisors'), <MdSupervisorAccount />)}
              {renderLink(`/${locale}/dashboard/users`, t('manageUsers'), <MdGroup />)}

              {/* Operations Section */}
              {renderSectionHeader(isRtl ? 'العمليات' : 'OPERATIONS')}
              {renderLink(`/${locale}/dashboard/orders`, t('manageOrders'), <MdAssignment />, 'جديد')}
              {renderLink(`/${locale}/dashboard/projects`, t('projects'), <MdAccountTree />)}
              {renderLink(`/${locale}/dashboard/invoices`, t('invoices'), <MdReceipt />)}
              {renderLink(`/${locale}/dashboard/applications`, t('recruitment'), <MdRecentActors />, '5')}

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
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-semibold group"
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
