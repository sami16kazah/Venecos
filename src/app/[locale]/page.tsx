import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { routing } from '@/i18n/routing';
import connectToDatabase from '@/lib/mongodb';
import ServiceContent from '@/models/ServiceContent';
import Slider from '@/models/Slider';
import Offer from '@/models/Offer';
import Gallery from '@/models/Gallery';
import Branch from '@/models/Branch';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import HomeNavbar from '@/components/HomeNavbar';
import PublicHomepageClient from '@/components/PublicHomepageClient';
import { seedDatabase } from '@/lib/seedDatabase';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tFooter = await getTranslations({ locale, namespace: 'Footer' });
  const tJoinUs = await getTranslations({ locale, namespace: 'JoinUs' });
  const session = await getServerSession(authOptions);

  await connectToDatabase();
  await seedDatabase();

  // Fetch dynamic DB collections for homepage
  const slidersRaw = await Slider.find({ active: true }).sort({ order: 1 }).lean();
  const offersRaw = await Offer.find({ active: true }).lean();
  const galleryRaw = await Gallery.find({ active: true }).lean();
  const branchesRaw = await Branch.find({ status: 'active' }).lean();
  const servicesRaw = await ServiceContent.find({ locale, isSpecial: true }).sort({ order: 1 }).lean();

  const sliders = JSON.parse(JSON.stringify(slidersRaw));
  const offers = JSON.parse(JSON.stringify(offersRaw));
  const gallery = JSON.parse(JSON.stringify(galleryRaw));
  const branches = JSON.parse(JSON.stringify(branchesRaw));
  const services = JSON.parse(JSON.stringify(servicesRaw));

  return (
    <div className="min-h-screen flex flex-col bg-venecos-black text-white font-sans">
      <HomeNavbar locale={locale} locales={[...routing.locales]} session={session} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full">
        <PublicHomepageClient
          locale={locale}
          sliders={sliders}
          offers={offers}
          gallery={gallery}
          branches={branches}
          services={services}
        />
      </main>

      {/* Join Us Section */}
      <section id="join" className="py-20 px-6 bg-gradient-to-b from-venecos-black to-neutral-950 text-white relative overflow-hidden border-t border-white/10">
        <div className="max-w-4xl mx-auto relative text-center space-y-6">
          <span className="inline-block bg-venecos-gold/15 border border-venecos-gold/30 text-venecos-gold text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
            {tJoinUs('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            {tJoinUs('title')}
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            {tJoinUs('description')}
          </p>
          <div className="pt-4">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white/50 py-12 text-center border-t border-white/10 space-y-4">
        <div className="flex justify-center">
          <img src="/Venecos.png" alt="Venecos" className="h-16 md:h-20 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-xs">{tFooter('copyright')}</p>
      </footer>
    </div>
  );
}
