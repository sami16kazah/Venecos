import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeNavbar from '@/components/HomeNavbar';
import { routing } from '@/i18n/routing';
import connectToDatabase from '@/lib/mongodb';
import AboutContent from '@/models/AboutContent';
import Link from 'next/link';
import { 
  MdCheckCircle, 
  MdPeople, 
  MdPublic, 
  MdStar, 
  MdCode, 
  MdPalette, 
  MdMovie, 
  MdHeadset, 
  MdPlayArrow, 
  MdArrowForward,
  MdRocketLaunch,
  MdAutoAwesome
} from 'react-icons/md';

const ICON_MAP: Record<string, any> = {
  MdCheckCircle,
  MdPeople,
  MdPublic,
  MdStar,
  MdCode,
  MdPalette,
  MdMovie,
  MdHeadset,
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  
  // Directly pull from Database with seed fallback trigger
  await connectToDatabase();
  let contentDoc: any = await AboutContent.findOne({ locale }).lean();

  if (!contentDoc) {
    // If not seeded yet, seed fallback object for immediate display
    const isAr = locale === 'ar';
    contentDoc = {
      locale,
      badge: isAr ? 'الابتكار والإبداع الرقمي' : 'INNOVATION & CREATIVITY',
      title: isAr ? 'نبني برمجيات فائقة الأداء وتجارب إبداعية تصنع الفارق' : 'Building World-Class Software & High-Impact Digital Experiences',
      subtitle: isAr ? 'منصة Venecos رائدة في تطوير تطبيقات الويب والموبايل، تصميم الـ 3D والموشن جرافيك، وإنتاج الفيديو، والطباعة.' : 'Venecos is a full-service technology platform delivering custom web & mobile engineering, photorealistic 3D design, cinema video editing, and print.',
      heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
      heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42890-large.mp4',
      storyTitle: isAr ? 'مسيرتنا وقصتنا' : 'Our Journey & Story',
      content: isAr ? 'تأسست منصة Venecos لتقديم مفهوم جديد يجمع بين الدقة البرمجية والإبداع البصري الاستثنائي.\n\nنضم نخبة من المهندسين والمصممين وصناع المحتوى الذين يعملون بروح الفريق الواحد لتحويل الأفكار إلى منتجات قيادية.' : 'Founded with a mission to bridge high-end engineering with artistic excellence, Venecos empowers brands globally.\n\nOur team of engineers, designers, and media architects turn ambitious ideas into reality.',
      missionTitle: isAr ? 'رسالتنا' : 'Our Mission',
      missionDesc: isAr ? 'تمكين الأعمال والمؤسسات عبر العالم بتقنيات متقدمة وهويات بصريّة مبتكرة تضمن التفوق والريادة.' : 'To empower organizations and creators with cutting-edge tech, seamless UX, and standout media production.',
      visionTitle: isAr ? 'رؤيتنا' : 'Our Vision',
      visionDesc: isAr ? 'أن نكون الخيار الأول عالمياً للحلول التقنية المتكاملة وصناعة المحتوى عالي الجودة.' : 'To be the globally recognized benchmark for software craftsmanship, digital innovation, and creative branding.',
      stats: [
        { label: isAr ? 'مشروع منجز' : 'Projects Completed', value: '850+', icon: 'MdCheckCircle' },
        { label: isAr ? 'عميل سعيد' : 'Global Clients', value: '320+', icon: 'MdPeople' },
        { label: isAr ? 'دولة نخدمها' : 'Countries Served', value: '18+', icon: 'MdPublic' },
        { label: isAr ? 'نسبة الرضا' : 'Client Satisfaction', value: '99.4%', icon: 'MdStar' }
      ],
      features: [
        { title: isAr ? 'البرمجة والتطوير' : 'Full-Stack Software Engineering', description: isAr ? 'مواقع وتطبيقات سريعة وموثوقة تعتمد أفضل الأنظمة.' : 'React, Next.js, Cloud APIs, and high-load backend architecture.', icon: 'MdCode' },
        { title: isAr ? 'تصميم 3D والجرَافيك' : '3D Modeling & Product Design', description: isAr ? 'رندر واقعي ثلاثي الأبعاد وهويات بصرية متكاملة.' : 'Hyper-realistic 3D rendering, motion graphics, and UI/UX design.', icon: 'MdPalette' }
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
      ],
        showcaseVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-a-laptop-42888-large.mp4'
    } as any;
  }

  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0A0A0C] text-white selection:bg-venecos-gold selection:text-black overflow-x-hidden">
      <HomeNavbar 
        locale={locale} 
        locales={[...routing.locales]} 
        session={session} 
      />

      <main className="flex-grow pb-24">
        {/* HERO SECTION WITH VIDEO / IMAGE BACKGROUND */}
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 px-6 overflow-hidden">
          {/* Ambient Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-venecos-gold/20 via-yellow-500/10 to-transparent blur-[140px] pointer-events-none rounded-full"></div>
          <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full"></div>

          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-venecos-gold/20 to-yellow-500/10 border border-venecos-gold/30 text-venecos-gold text-xs md:text-sm font-bold tracking-widest uppercase px-5 py-2 rounded-full shadow-lg backdrop-blur-md">
              <MdAutoAwesome className="text-venecos-gold animate-pulse text-base" />
              {contentDoc.badge || 'VENECOS PLATFORM'}
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto drop-shadow-md">
              {contentDoc.title}
            </h1>

            {contentDoc.subtitle && (
              <p className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                {contentDoc.subtitle}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                href={`/${locale}/services`}
                className="bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold px-8 py-4 rounded-full hover:brightness-110 transition-all transform hover:scale-105 shadow-xl shadow-venecos-gold/20 flex items-center gap-2 text-sm md:text-base"
              >
                {isRtl ? 'استكشف كافة الخدمات' : 'Explore All Services'}
                <MdArrowForward className={isRtl ? 'rotate-180' : ''} />
              </Link>
              <Link 
                href={`/${locale}#join`}
                className="bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-all backdrop-blur-md text-sm md:text-base"
              >
                {isRtl ? 'تواصل معنا' : 'Get In Touch'}
              </Link>
            </div>

            {/* HERO MEDIA CONTAINER (VIDEO OR HERO IMAGE) */}
            {(contentDoc.heroVideo || contentDoc.heroImage) && (
              <div className="mt-14 relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black/60 max-w-5xl mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent z-10 pointer-events-none"></div>
                
                {contentDoc.heroVideo ? (
                  contentDoc.heroVideo.includes('youtube.com') || contentDoc.heroVideo.includes('vimeo.com') ? (
                    <div className="aspect-video w-full">
                      <iframe 
                        src={contentDoc.heroVideo} 
                        className="w-full h-full border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        title="Hero Video"
                      ></iframe>
                    </div>
                  ) : (
                    <video 
                      src={contentDoc.heroVideo} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="w-full max-h-[550px] object-cover"
                    />
                  )
                ) : (
                  <img 
                    src={contentDoc.heroImage} 
                    alt={contentDoc.title}
                    className="w-full max-h-[550px] object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                )}
              </div>
            )}
          </div>
        </section>

        {/* STATS COUNTER GRID */}
        {contentDoc.stats && contentDoc.stats.length > 0 && (
          <section className="px-6 -mt-8 relative z-20 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white/5 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl">
              {contentDoc.stats.map((st: any, idx: number) => {
                const IconComponent = ICON_MAP[st.icon] || MdStar;
                return (
                  <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <IconComponent className="text-venecos-gold text-3xl md:text-4xl mb-2" />
                    <span className="text-3xl md:text-5xl font-black text-white tracking-tight">
                      {st.value}
                    </span>
                    <span className="text-gray-400 text-xs md:text-sm font-semibold uppercase mt-1">
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* STORY / NARRATIVE SECTION */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-3xl p-8 md:p-14 backdrop-blur-lg relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-venecos-gold/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-3xl space-y-6 relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
                <span className="w-3 h-8 bg-venecos-gold rounded-full inline-block"></span>
                {contentDoc.storyTitle || (isRtl ? 'قصتنا ومسيرتنا' : 'Our Story & Journey')}
              </h2>
              <div 
                className="text-gray-300 text-base md:text-xl leading-relaxed whitespace-pre-line font-light"
              >
                {contentDoc.content}
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION DUAL CARDS */}
        {(contentDoc.missionDesc || contentDoc.visionDesc) && (
          <section className="py-12 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {contentDoc.missionDesc && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 md:p-10 rounded-3xl space-y-4 hover:border-venecos-gold/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-venecos-gold/10 rounded-2xl flex items-center justify-center text-venecos-gold text-3xl group-hover:scale-110 transition-transform">
                  <MdRocketLaunch />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {contentDoc.missionTitle || (isRtl ? 'رسالتنا' : 'Our Mission')}
                </h3>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  {contentDoc.missionDesc}
                </p>
              </div>
            )}

            {contentDoc.visionDesc && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 md:p-10 rounded-3xl space-y-4 hover:border-venecos-gold/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-venecos-gold/10 rounded-2xl flex items-center justify-center text-venecos-gold text-3xl group-hover:scale-110 transition-transform">
                  <MdAutoAwesome />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {contentDoc.visionTitle || (isRtl ? 'رؤيتنا' : 'Our Vision')}
                </h3>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  {contentDoc.visionDesc}
                </p>
              </div>
            )}
          </section>
        )}

        {/* FEATURES HIGHLIGHTS GRID */}
        {contentDoc.features && contentDoc.features.length > 0 && (
          <section className="py-16 px-6 max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                {isRtl ? 'مجالات التميّز والخدمات' : 'Core Capabilities & Pillars'}
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
                {isRtl ? 'نجمع بين الخبرة العميقة والابتكار المستمر في أربعة محاور رئيسية' : 'End-to-end expertise engineered for high quality, performance, and impact.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentDoc.features.map((ft: any, idx: number) => {
                const FeatureIcon = ICON_MAP[ft.icon] || MdCode;
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-3 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-venecos-gold/10 text-venecos-gold rounded-xl text-2xl">
                        <FeatureIcon />
                      </div>
                      <h3 className="text-xl font-bold text-white">{ft.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-14">
                      {ft.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MEDIA SHOWCASE & GALLERY SECTION */}
        {((contentDoc.galleryImages && contentDoc.galleryImages.length > 0) || contentDoc.showcaseVideoUrl) && (
          <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-venecos-gold text-xs font-bold uppercase tracking-widest">
                {isRtl ? 'معرض الصور والفيديو' : 'VISUAL SHOWCASE'}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                {isRtl ? 'لمحات من أعمالنا واستوديو الإنتاج' : 'Inside Venecos Studio & Operations'}
              </h2>
            </div>

            {/* Showcase Video player if provided */}
            {contentDoc.showcaseVideoUrl && (
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black max-w-4xl mx-auto">
                {contentDoc.showcaseVideoUrl.includes('youtube.com') || contentDoc.showcaseVideoUrl.includes('vimeo.com') ? (
                  <div className="aspect-video w-full">
                    <iframe 
                      src={contentDoc.showcaseVideoUrl} 
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      title="Showcase Video"
                    ></iframe>
                  </div>
                ) : (
                  <video 
                    src={contentDoc.showcaseVideoUrl} 
                    controls 
                    className="w-full max-h-[500px] object-cover"
                  />
                )}
              </div>
            )}

            {/* Photo Gallery Grid */}
            {contentDoc.galleryImages && contentDoc.galleryImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {contentDoc.galleryImages.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                    <img 
                      src={imgUrl} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-xs text-white/80 font-bold">Venecos Showcase #{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* CALL TO ACTION BANNER */}
        <section className="pt-10 px-6 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-venecos-gold/20 via-yellow-600/10 to-transparent border border-venecos-gold/30 p-10 md:p-16 rounded-3xl text-center space-y-6 relative overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-venecos-gold/10 blur-3xl pointer-events-none rounded-full"></div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {isRtl ? 'جاهز للبدء بمشروعك القادم؟' : 'Ready to Elevate Your Brand with Venecos?'}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
              {isRtl ? 'تواصل مع فريق خبرائنا للبدء بتنفيذ فكرتك وإطلاقها بأعلى المعايير.' : 'Get in touch with our team to discuss your project requirements and get a personalized solution.'}
            </p>
            <div className="pt-2">
              <Link 
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 bg-venecos-gold text-black font-extrabold px-8 py-4 rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl text-base"
              >
                {isRtl ? 'اطلب خدمتك الآن' : 'Start Your Order Now'}
                <MdArrowForward className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#050507] text-white/50 py-12 border-t border-white/10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/Venecos.png" alt="Venecos" className="h-12 w-auto object-contain opacity-80" />
          </div>
          <p className="text-xs text-gray-500">
            © 2026 Venecos Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
