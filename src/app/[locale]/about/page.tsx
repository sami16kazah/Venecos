import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeNavbar from '@/components/HomeNavbar';
import { routing } from '@/i18n/routing';
import connectToDatabase from '@/lib/mongodb';
import AboutContent from '@/models/AboutContent';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  
  // Directly pull from Database
  await connectToDatabase();
  const contentDoc = await AboutContent.findOne({ locale }).lean();
  
  const title = contentDoc?.title || "About Venecos";
  const content = contentDoc?.content || "Information about Venecos has not been populated yet by the Administrator.";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <HomeNavbar 
        locale={locale} 
        locales={[...routing.locales]} 
        session={session} 
      />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Banner area */}
        <div className="text-center mb-16">
          <span className="inline-block bg-venecos-gold/10 text-venecos-gold text-sm font-bold tracking-widest uppercase px-6 py-2 rounded-full mb-6">
            Venecos Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-venecos-black tracking-tight leading-tight mb-8">
            {title}
          </h1>
          <div className="w-24 h-1.5 bg-venecos-gold mx-auto rounded-full"></div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-venecos-gold/10 to-transparent rounded-bl-full pointer-events-none"></div>

          <div 
            className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed relative z-10"
            style={{ whiteSpace: 'pre-line' }}
          >
            {content}
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="bg-venecos-black text-white/50 py-10 text-center border-t border-white/10 mt-auto">
        <div className="text-xl font-extrabold text-white/20 tracking-widest">VENECOS</div>
      </footer>
    </div>
  );
}
