import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeNavbar from '@/components/HomeNavbar';
import { routing } from '@/i18n/routing';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import ServiceDetailClient from '@/components/ServiceDetailClient';
import JoinUsSection from '@/components/JoinUsSection';
import CommonFooter from '@/components/CommonFooter';

export default async function SubServicesPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations({locale, namespace: 'Services'});

  await connectToDatabase();
  let service: any = await ServiceContent.findById(id).lean().catch(() => null);

  if (!service) {
    service = await ServiceContent.findOne({ serviceKey: id, locale }).lean();
  }
  if (!service) {
    service = await ServiceContent.findOne({ serviceKey: id }).lean();
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-venecos-black text-white flex flex-col font-sans">
        <HomeNavbar locale={locale} locales={[...routing.locales]} session={session} />
        <main className="flex-grow flex items-center justify-center p-20">
          <div className="bg-venecos-black/80 border border-white/10 p-10 rounded-3xl text-center space-y-4 shadow-2xl max-w-md">
            <h2 className="text-2xl font-bold text-white">{t('serviceNotFound') || 'Service not found.'}</h2>
            <p className="text-xs text-white/60">The requested service could not be located in our directory.</p>
          </div>
        </main>
        <CommonFooter />
      </div>
    );
  }
  
  if (service.locale !== locale && service.serviceKey) {
    const localeMatched = await ServiceContent.findOne({ serviceKey: service.serviceKey, locale }).lean();
    if (localeMatched) {
      service = localeMatched;
    }
  }
  
  const serializedService = JSON.parse(JSON.stringify(service));

  return (
    <div className="min-h-screen flex flex-col font-sans bg-venecos-black text-white">
      <HomeNavbar locale={locale} locales={[...routing.locales]} session={session} />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <ServiceDetailClient 
          locale={locale} 
          service={serializedService} 
          serviceId={id} 
        />
      </main>

      <JoinUsSection locale={locale} />
      <CommonFooter />
    </div>
  );
}
