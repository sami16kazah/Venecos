import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeNavbar from '@/components/HomeNavbar';
import { routing } from '@/i18n/routing';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import * as Icons from 'react-icons/fa';
import Link from 'next/link';

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  await connectToDatabase();
  const services = await ServiceContent.find({ locale }).sort({ order: 1 }).lean();
  
  const tServices = await getTranslations({locale, namespace: 'Services'});
  const tNav = await getTranslations({locale, namespace: 'Navigation'});

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <HomeNavbar 
        locale={locale} 
        locales={[...routing.locales]} 
        session={session} 
      />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="inline-block bg-venecos-gold/10 text-venecos-gold text-sm font-bold tracking-widest uppercase px-6 py-2 rounded-full mb-6">
            {tNav('services')}
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-venecos-black tracking-tight leading-tight mb-8">
            {tServices('title') || "All Services"}
          </h1>
          <div className="w-24 h-1.5 bg-venecos-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((svc: any) => {
            const GenericIcon = (Icons as any)[svc.iconName || 'FaCode'] || Icons.FaCode;
            return (
              <Link key={svc._id.toString()} href={`/${locale}/services/${svc._id.toString()}`} className="block h-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-venecos-gold/30 rounded-3xl">
                <div className="bg-white border rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-gray-100 group relative overflow-hidden flex flex-col h-full items-start text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-venecos-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-20 h-20 rounded-2xl bg-black/5 flex items-center justify-center text-venecos-black mb-8 group-hover:bg-venecos-gold group-hover:text-white transition-colors duration-300 overflow-hidden shrink-0">
                    {svc.iconType === 'image' && svc.iconUrl ? (
                      <img src={svc.iconUrl} alt={svc.title} className="w-full h-full object-cover" />
                    ) : (
                      <GenericIcon size={32} />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{svc.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {svc.description}
                  </p>
                  <div className="mt-auto w-full flex items-center justify-between">
                    {svc.isSpecial ? (
                      <span className="inline-block text-xs font-bold bg-venecos-gold/10 border border-venecos-gold/20 text-venecos-gold px-3 py-1 rounded-full uppercase tracking-wider">Featured</span>
                    ) : <span></span>}
                    <span className="text-venecos-gold font-bold text-sm tracking-widest uppercase flex items-center gap-1 group-hover:mr-2 transition-all">
                       View Packages →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {services.length === 0 && (
           <div className="text-center text-gray-500 mt-20">No services found for this locale yet.</div>
        )}
      </main>

      {/* Footer minimal */}
      <footer className="bg-venecos-black text-white/50 py-10 text-center border-t border-white/10 mt-auto">
        <div className="flex justify-center">
          <img src="/Venecos Logo.png" alt="Venecos" className="h-10 w-auto object-contain opacity-60" />
        </div>
      </footer>
    </div>
  );
}
