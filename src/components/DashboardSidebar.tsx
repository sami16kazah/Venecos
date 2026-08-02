'use client';

import { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import { 
  MdMenu, MdClose, MdDashboard, MdGroup, MdDesignServices, 
  MdAssignment, MdRecentActors, MdSettings, MdAssignmentInd, 
  MdReceipt, MdSlideshow, MdLocalOffer, MdPhotoLibrary, 
  MdSupervisorAccount, MdAdminPanelSettings, MdAccountTree, 
  MdCurrencyExchange, MdLocationOn, MdDescription, MdGavel, 
  MdExpandMore, MdChevronLeft, MdLaptop, MdPalette, MdPrint, MdStar, MdMic
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
                    {/* Overview Hub */}
                    <Link href={`/${locale}/dashboard/services`} onClick={() => setMobileOpen(false)} className="block px-3 py-1.5 rounded-lg text-venecos-gold font-bold hover:bg-white/5">
                      • دليل الخدمات الرئيسي
                    </Link>

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
                          <Link href={`/${locale}/dashboard/services/programming`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • البرمجة والمواقع
                          </Link>
                          <Link href={`/${locale}/dashboard/services/shared-hosting`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • Shared Hosting
                          </Link>
                          <Link href={`/${locale}/dashboard/services/vps`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • السيرفرات VPS
                          </Link>
                          <Link href={`/${locale}/dashboard/services/domains`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • الدومينات
                          </Link>
                          <Link href={`/${locale}/dashboard/services/support`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • الدعم الفني
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
                          <Link href={`/${locale}/dashboard/services/photography`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • التصميم الفوتوغرافي
                          </Link>
                          <Link href={`/${locale}/dashboard/services/video`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • إنتاج الفيديو 4K
                          </Link>
                          <Link href={`/${locale}/dashboard/services/3d-design`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • التصميم 3D
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
                          <Link href={`/${locale}/dashboard/services/paper-print`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • الطباعة الورقية
                          </Link>
                          <Link href={`/${locale}/dashboard/services/stickers`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • طباعة الملصقات
                          </Link>
                          <Link href={`/${locale}/dashboard/services/adv-print`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • الطباعة الإعلانية
                          </Link>
                          <Link href={`/${locale}/dashboard/services/3d-print`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • الطباعة 3D
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Other Services */}
                    <div>
                      <button
                        onClick={() => toggleCategory('other')}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-white/60 hover:text-white font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <MdMic className="text-venecos-gold" />
                          <span>خدمات أخرى</span>
                        </div>
                        <MdChevronLeft className={`transition-transform ${activeCategory === 'other' ? '-rotate-90' : ''}`} />
                      </button>
                      {activeCategory === 'other' && (
                        <div className="ps-6 py-1 space-y-1 text-[11px]">
                          <Link href={`/${locale}/dashboard/services/voiceover`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • التعليق الصوتي
                          </Link>
                          <Link href={`/${locale}/dashboard/services/content-writing`} onClick={() => setMobileOpen(false)} className="block py-1 text-white/70 hover:text-venecos-gold">
                            • كتابة المحتوى
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
              {renderLink(`/${locale}/dashboard/assigned-orders`, isRtl ? 'طلبات موكلة' : 'Assigned Orders', <MdAssignmentInd />)}
              {renderLink(`/${locale}/dashboard/projects`, t('projects'), <MdAccountTree />)}
              {renderLink(`/${locale}/dashboard/contracts`, isRtl ? 'العقود' : 'Contracts', <MdDescription />)}
              {renderLink(`/${locale}/dashboard/disputes`, isRtl ? 'النزاعات' : 'Disputes', <MdGavel />)}
              {renderLink(`/${locale}/dashboard/invoices`, t('invoices'), <MdReceipt />)}

              {/* System Section */}
              {renderSectionHeader(isRtl ? 'النظام' : 'SYSTEM')}
              {renderLink(`/${locale}/dashboard/applications`, isRtl ? 'طلبات التوظيف' : 'Applications', <MdRecentActors />)}
              {renderLink(`/${locale}/dashboard/branches`, isRtl ? 'الفروع' : 'Branches', <MdLocationOn />)}
              {renderLink(`/${locale}/dashboard/exchange-rates`, isRtl ? 'أسعار الصرف' : 'Exchange Rates', <MdCurrencyExchange />)}
              {renderLink(`/${locale}/dashboard/about`, isRtl ? 'عن الشركة' : 'About Company', <MdStar />)}
              {renderLink(`/${locale}/dashboard/settings`, t('settings'), <MdSettings />)}
            </>
          )}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-4 start-4 z-50">
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{
            backgroundColor: '#0E0C08',
            color: '#C9A84C',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            '&:hover': { backgroundColor: '#1A1813' },
          }}
        >
          {mobileOpen ? <MdClose /> : <MdMenu />}
        </IconButton>
      </div>

      <div className="hidden md:block w-72 h-screen sticky top-0 flex-shrink-0 border-e border-white/10">
        {sidebarContent}
      </div>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
