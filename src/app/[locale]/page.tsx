import {getTranslations, setRequestLocale} from 'next-intl/server';
import Button from '@mui/material/Button';
import * as Icons from 'react-icons/fa';
import Link from 'next/link';
import { routing } from '@/i18n/routing';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeNavbar from '@/components/HomeNavbar';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations({locale, namespace: 'Index'});
  const tNav = await getTranslations({locale, namespace: 'Navigation'});
  const tServices = await getTranslations({locale, namespace: 'Services'});
  const tFooter = await getTranslations({locale, namespace: 'Footer'});
  const tJoinUs = await getTranslations({locale, namespace: 'JoinUs'});
  const session = await getServerSession(authOptions);

  await connectToDatabase();
  const services = await ServiceContent.find({ locale, isSpecial: true }).sort({ order: 1 }).lean();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <HomeNavbar 
        locale={locale} 
        locales={[...routing.locales]} 
        session={session} 
      />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-gradient-to-b from-venecos-black via-[#111] to-venecos-dark text-venecos-white relative overflow-hidden">
        {/* Abstract shapes and watermark in background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-venecos-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] md:w-[800px] opacity-[0.02] pointer-events-none mix-blend-overlay flex justify-center items-center">
          <img src="/Venecos Logo.png" alt="Watermark" className="w-full h-auto object-contain grayscale" />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 relative z-10 leading-tight tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12 leading-relaxed font-light relative z-10">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          <Link href="#services" passHref>
            <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                sx={{ borderRadius: 9999, px: 6, py: 1.5, fontWeight: 'bold' }}
            >
                {t('getStarted')}
            </Button>
          </Link>
          <Link href={`/${locale}/about`} passHref>
            <Button variant="outlined" color="inherit" size="large" sx={{ borderRadius: 9999, px: 6, py: 1.5, fontWeight: 'bold', borderColor: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
              {t('learnMore')}
            </Button>
          </Link>
        </div>
      </main>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-28 px-6 bg-venecos-white text-venecos-black flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-venecos-black inline-block">{tServices('title')}</h2>
          <div className="h-1.5 w-24 bg-venecos-gold mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto w-full">
          {services.map((svc: any) => {
            const GenericIcon = (Icons as any)[svc.iconName] || Icons.FaCode;
            return (
              <Link 
                key={svc._id.toString()} 
                href={`/${locale}/services/${svc._id}`}
                className="bg-white border rounded-2xl p-6 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-gray-100 group relative overflow-hidden block"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-venecos-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center text-venecos-black mb-8 group-hover:bg-venecos-gold group-hover:text-white transition-colors duration-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] overflow-hidden">
                  {svc.iconType === 'image' && svc.iconUrl ? (
                    <img src={svc.iconUrl} alt={svc.title} className="w-full h-full object-cover" />
                  ) : (
                    <GenericIcon size={28} />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4">{svc.title}</h3>
                <p className="text-gray-600 mb-8 pb-6 border-b border-gray-100 leading-relaxed min-h-[80px]">
                  {svc.description}
                </p>
                <div className="text-[#0A0A0A] font-bold group-hover:text-venecos-gold transition-colors inline-flex items-center gap-2">
                  {t('learnMore')} <Icons.FaChevronRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Join Us Section */}
      <section id="join" className="py-20 md:py-28 px-6 bg-venecos-black text-white relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-venecos-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-venecos-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative text-center">
          <span className="inline-block bg-venecos-gold/10 border border-venecos-gold/30 text-venecos-gold text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            {tJoinUs('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {tJoinUs('title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {tJoinUs('description')}
          </p>
          <Link href={`/${locale}/apply`} passHref>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 9999, px: 8, py: 2, fontWeight: 'bold', fontSize: '1rem' }}
            >
              {tJoinUs('button')} →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-venecos-black text-white/50 py-12 text-center border-t border-white/10">
        <div className="flex justify-center mb-6">
          <img src="/Venecos.png" alt="Venecos" className="h-16 md:h-20 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" />
        </div>
        <p>{tFooter('copyright')}</p>
      </footer>
    </div>
  );
}
