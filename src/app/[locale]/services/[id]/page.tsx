import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeNavbar from '@/components/HomeNavbar';
import { routing } from '@/i18n/routing';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import * as Icons from 'react-icons/fa';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import JoinUsSection from '@/components/JoinUsSection';
import CommonFooter from '@/components/CommonFooter';

export default async function SubServicesPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations({locale, namespace: 'Services'});

  await connectToDatabase();
  const service = await ServiceContent.findById(id).lean();

  if (!service) {
    return <div className="p-20 text-center">{t('serviceNotFound') || 'Service not found.'}</div>;
  }
  
  if (service.locale !== locale) {
    redirect(`/${locale}/services`);
  }
  
  const GenericIcon = (Icons as any)[service.iconName || 'FaCode'] || Icons.FaCode;
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <HomeNavbar locale={locale} locales={[...routing.locales]} session={session} />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Parent Service Header */}
        <div className="flex flex-col items-center text-center mb-16 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
           <div className="w-24 h-24 rounded-3xl bg-venecos-gold/10 flex items-center justify-center text-venecos-gold mb-6 border-2 border-venecos-gold/20 overflow-hidden">
             {service.iconType === 'image' && service.iconUrl ? (
               <img src={service.iconUrl} alt={service.title} className="w-full h-full object-cover" />
             ) : (
               <GenericIcon size={40} />
             )}
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-venecos-black tracking-tight mb-4">{service.title}</h1>
           <p className="text-gray-500 text-lg max-w-2xl">{service.description}</p>
        </div>

        <h2 className="text-2xl font-extrabold text-venecos-black mb-8 border-b-2 border-gray-100 pb-4">{t('availablePackages') || 'Available Packages'}</h2>

        {/* Sub-Services Listing */}
        <div className="flex flex-col gap-6">
          {(!service.subServices || service.subServices.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm text-gray-500 italic">
              {t('noPackages') || 'No specific packages have been listed for this service yet. Stay tuned!'}
            </div>
          ) : (
            service.subServices.map((sub: any, i: number) => (
              <div key={sub._id?.toString() || i} className="bg-white border-2 border-transparent hover:border-venecos-gold rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-venecos-gold transition-colors">{sub.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-3xl">{sub.description}</p>
                </div>
                
                <div className="shrink-0 flex flex-col md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-t-0">
                  <div className="text-3xl font-extrabold text-venecos-black">${sub.price}</div>
                  <Link href={`/${locale}/services/${id}/order?subId=${sub._id}`}>
                    <button className="w-full md:w-auto bg-venecos-gold hover:bg-[#b5952f] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 uppercase tracking-wider text-sm">
                      {t('orderNow') || 'Order Now'}
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <JoinUsSection locale={locale} />
      <CommonFooter />
    </div>
  );
}
