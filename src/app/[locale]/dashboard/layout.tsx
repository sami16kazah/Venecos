import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { getTranslations } from "next-intl/server";
import SignOutButton from "@/components/SignOutButton";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  if (!session) {
    redirect(`/${locale}/signin`);
  }

  const role = (session.user as any)?.role || "client";

  const isRtl = locale === 'ar';

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row" dir={isRtl ? 'rtl' : 'ltr'}>
      <DashboardSidebar 
        locale={locale} 
        role={role} 
        userName={session.user?.name} 
      />

      {/* Main Content */}
      <main className={`flex-1 ${isRtl ? 'md:mr-64' : 'md:ml-64'} p-4 md:p-10 overflow-y-auto relative w-full`}>
        {/* Header - Adaptive for mobile */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 border-b border-gray-200 pb-6 gap-4 mt-6 md:mt-0">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold text-venecos-black tracking-tight">{t('dashboard')}</h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium">{t('home')} / {t('overview')}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 w-full lg:w-auto">
            {/* Language Switcher - Responsive Grid */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-lg shadow-sm border border-gray-200">
              {['en', 'ar', 'fr', 'de'].map((l) => (
                <Link key={l} href={`/${l}/dashboard`} className={`p-1.5 w-7 md:w-8 h-7 md:h-8 flex items-center justify-center rounded-md font-bold text-[10px] md:text-xs transition-all ${locale === l ? 'bg-venecos-black text-venecos-gold shadow-md scale-105' : 'text-gray-400 hover:bg-gray-50'}`}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Profile & SignOut */}
            <div className="flex items-center gap-3 md:gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex flex-col text-right">
                <span className="font-bold text-venecos-black text-xs md:text-sm whitespace-nowrap">{session.user?.name}</span>
                <span className="text-[10px] text-venecos-gold uppercase font-bold tracking-tighter">{role}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <SignOutButton locale={locale} />
            </div>
          </div>
        </header>

        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
