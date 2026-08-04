import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeNavbar from '@/components/HomeNavbar';
import { routing } from '@/i18n/routing';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import ServicesPageClient from '@/components/ServicesPageClient';
import JoinUsSection from '@/components/JoinUsSection';
import CommonFooter from '@/components/CommonFooter';
import { seedDatabase } from '@/lib/seedDatabase';

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  try {
    await connectToDatabase();
    await seedDatabase();
  } catch (err) {
    console.error('Database connection / seed error:', err);
  }

  let servicesRaw = await ServiceContent.find({ locale }).sort({ order: 1 }).lean();
  if (!servicesRaw.length) {
    servicesRaw = await ServiceContent.find({ locale: 'ar' }).sort({ order: 1 }).lean();
  }
  if (!servicesRaw.length) {
    servicesRaw = await ServiceContent.find({}).sort({ order: 1 }).lean();
  }

  const services = JSON.parse(JSON.stringify(servicesRaw));

  return (
    <div className="min-h-screen flex flex-col font-sans bg-venecos-black text-white">
      <HomeNavbar 
        locale={locale} 
        locales={[...routing.locales]} 
        session={session} 
      />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ServicesPageClient 
          locale={locale} 
          services={services} 
        />
      </main>

      <JoinUsSection locale={locale} />
      <CommonFooter />
    </div>
  );
}
