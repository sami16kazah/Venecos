import connectToDatabase from '@/lib/mongodb';
import Slider from '@/models/Slider';
import Offer from '@/models/Offer';
import Gallery from '@/models/Gallery';
import Branch from '@/models/Branch';
import ExchangeRate from '@/models/ExchangeRate';
import ServiceContent from '@/models/ServiceContent';
import User from '@/models/User';
import Order from '@/models/Order';
import Project from '@/models/Project';
import Contract from '@/models/Contract';
import Dispute from '@/models/Dispute';
import Application from '@/models/Application';
import BanList from '@/models/BanList';

export async function seedDatabase(force = false) {
  await connectToDatabase();

  if (force) {
    await Promise.all([
      Slider.deleteMany({}),
      Offer.deleteMany({}),
      Gallery.deleteMany({}),
      Branch.deleteMany({}),
      ExchangeRate.deleteMany({}),
      ServiceContent.deleteMany({}),
      Order.deleteMany({}),
      Project.deleteMany({}),
      Contract.deleteMany({}),
      Dispute.deleteMany({}),
      Application.deleteMany({}),
      BanList.deleteMany({}),
    ]);
  }

  // 1. Seed Users (Super Admin, Supervisor, Employee, Clients)
  let adminUser = await User.findOne({ email: 'admin@venecos.net' });
  if (!adminUser) {
    adminUser = await User.create({
      firstName: 'المدير',
      lastName: 'العام',
      username: 'admin',
      email: 'admin@venecos.net',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      roles: ['admin'],
      country: 'DE',
      preferredCurrency: 'EUR',
      isEmailVerified: true,
    });
  }

  let supervisorUser = await User.findOne({ email: 'supervisor@venecos.net' });
  if (!supervisorUser) {
    supervisorUser = await User.create({
      firstName: 'أحمد',
      lastName: 'المشرف',
      username: 'supervisor',
      email: 'supervisor@venecos.net',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      roles: ['supervisor'],
      country: 'AE',
      preferredCurrency: 'AED',
      isEmailVerified: true,
    });
  }

  let employeeUser = await User.findOne({ email: 'employee@venecos.net' });
  if (!employeeUser) {
    employeeUser = await User.create({
      firstName: 'سارة',
      lastName: 'المصممة',
      username: 'employee',
      email: 'employee@venecos.net',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      roles: ['employee'],
      country: 'DE',
      preferredCurrency: 'EUR',
      isEmailVerified: true,
    });
  }

  let clientUser = await User.findOne({ email: 'client@venecos.net' });
  if (!clientUser) {
    clientUser = await User.create({
      firstName: 'محمد',
      lastName: 'العميل',
      username: 'client',
      email: 'client@venecos.net',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      roles: ['client'],
      country: 'SA',
      preferredCurrency: 'SAR',
      isEmailVerified: true,
    });
  }

  // 2. Seed Services (Excluding Programming as requested)
  const serviceCount = await ServiceContent.countDocuments();
  if (serviceCount === 0 || force) {
    await ServiceContent.insertMany([
      {
        title: 'الاستضافة المشتركة (Shared Hosting)',
        description: 'خطط استضافة فائقة السرعة مع لوحة cPanel وتراخيص SSL وذاكرة NVMe',
        locale: 'ar',
        iconName: 'FaServer',
        iconType: 'react-icon',
        isSpecial: true,
        order: 1,
        subServices: [
          { title: 'خطة Starter SSD', description: '10 GB SSD + 1 موقع', price: 49 },
          { title: 'خطة Business NVMe', description: '50 GB NVMe + 5 مواق', price: 99 },
          { title: 'خطة Pro Unlimited', description: '150 GB NVMe + 20 موقع', price: 199 },
        ]
      },
      {
        title: 'السيرفرات السحابية (VPS)',
        description: 'سيرفرات سحابية عالية الأداء في ألمانيا وفرنسا مع حماية DDoS كاملة',
        locale: 'ar',
        iconName: 'FaCloud',
        iconType: 'react-icon',
        isSpecial: true,
        order: 2,
        subServices: [
          { title: 'VPS Core 2 vCPU', description: '4GB RAM + 80GB NVMe', price: 299 },
          { title: 'VPS Business 4 vCPU', description: '8GB RAM + 160GB NVMe', price: 499 },
        ]
      },
      {
        title: 'إنتاج الفيديو والموشن جرافيك',
        description: 'مونتاج فيديو احترافي بدقة 4K وإخراج مقاطع موشن جرافيك إعلانية',
        locale: 'ar',
        iconName: 'FaVideo',
        iconType: 'react-icon',
        isSpecial: true,
        order: 3,
        subServices: [
          { title: 'فيديو إعلاني 30 ثانية', description: 'موشن جرافيك بدقة Full HD', price: 350 },
          { title: 'فيديو وثائقي 4K', description: 'تصوير ومونتاج سينمائي', price: 850 },
        ]
      },
      {
        title: 'التصميم ثلاثي الأبعاد (3D Rendering)',
        description: 'نمذجة مجسمات وعروض تفاعلية 360 درجة مع معالجة إضاءة واقعية',
        locale: 'ar',
        iconName: 'FaCube',
        iconType: 'react-icon',
        isSpecial: false,
        order: 4,
        subServices: [
          { title: 'رندر منتجات 3D', description: 'زوايا 360 مع فيديو ترويجي', price: 450 },
        ]
      },
      {
        title: 'الطباعة الورقية والإعلانية',
        description: 'طباعة كروت، بروشورات، ملصقات، وهدايا دعاية بأعلى جودة بالألوان',
        locale: 'ar',
        iconName: 'FaPrint',
        iconType: 'react-icon',
        isSpecial: false,
        order: 5,
        subServices: [
          { title: 'طباعة 1000 كرت شخصي', description: 'ورق 350g لامع أو سلفان', price: 45 },
          { title: 'طباعة ملصقات 10m²', description: 'فينيل مقاوم للماء', price: 120 },
        ]
      },
      {
        title: 'كتابة المحتوى والتعليق الصوتي',
        description: 'صياغة مقالات وتدقيق لغوي وتسجيلات صوتية بشتى اللهجات العربية',
        locale: 'ar',
        iconName: 'FaPen',
        iconType: 'react-icon',
        isSpecial: false,
        order: 6,
        subServices: [
          { title: 'تعليق صوتي إعلاني', description: 'تسجيل استوديو بالفصحى أو الخليجي', price: 80 },
          { title: 'كتابة مقالات SEO', description: '10 مقالات حصري متوافقة مع قوقل', price: 150 },
        ]
      }
    ]);
  }

  // 3. Seed Sliders if empty or forced
  const sliderCount = await Slider.countDocuments();
  if (sliderCount === 0 || force) {
    await Slider.insertMany([
      {
        title: {
          ar: 'حلول استضافة وسيرفرات سحابية فائقة الأداء',
          en: 'High Performance Cloud & Hosting Solutions',
          fr: 'Solutions d’hébergement et serveur cloud haute performance',
          de: 'Hochleistungs-Cloud- & Hosting-Lösungen',
        },
        subtitle: {
          ar: 'بنية تحتية متطورة في ألمانيا وفرنسا مع حماية شاملة وسرعة فائقة',
          en: 'Advanced infrastructure in Germany & France with DDoS protection',
          fr: 'Infrastructure avancée en Allemagne et en France avec protection DDoS',
          de: 'Fortschrittliche Infrastruktur in Deutschland & Frankreich mit DDoS-Schutz',
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        overlayOpacity: 45,
        btnText: { ar: 'تصفح خدمات الاستضافة', en: 'Explore Hosting', fr: 'Voir l’hébergement', de: 'Hosting entdecken' },
        btnUrl: '/dashboard/services/shared-hosting',
        btnStyle: 'ذهبي مملوء',
        vPosition: 'وسط',
        textAlign: 'وسط',
        duration: 5,
        order: 1,
        active: true,
        status: 'منشورة',
      },
      {
        title: {
          ar: 'إنتاج الفيديو والموشن جرافيك والتصميم 3D',
          en: 'Video Production & 3D Design',
          fr: 'Production vidéo et design 3D',
          de: 'Videoproduktion & 3D-Design',
        },
        subtitle: {
          ar: 'نصنع هويتك البصرية بأعلى درجات الاحترافية والإخراج السينمائي',
          en: 'Crafting your brand identity with cinematic perfection',
          fr: 'Création de votre identité de marque avec une perfection cinématographique',
          de: 'Erstellung Ihrer Markenidentität mit kinoreifer Perfektion',
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
        overlayOpacity: 50,
        btnText: { ar: 'معرض إنتاج الفيديو', en: 'Video Portfolio', fr: 'Galerie vidéo', de: 'Video-Portfolio' },
        btnUrl: '/dashboard/services/video',
        btnStyle: 'ذهبي شفاف',
        vPosition: 'وسط',
        textAlign: 'وسط',
        duration: 5,
        order: 2,
        active: true,
        status: 'منشورة',
      },
    ]);
  }

  // 4. Seed Offers if empty or forced
  const offerCount = await Offer.countDocuments();
  if (offerCount === 0 || force) {
    await Offer.insertMany([
      {
        title: {
          ar: 'باقة الانطلاقة الرقمية الشاملة',
          en: 'Complete Digital Launch Package',
          fr: 'Pack de lancement numérique complet',
          de: 'Komplettes digitales Startpaket',
        },
        description: {
          ar: 'استضافة سنة كاملة + دومين مجاني + تصميم هوية بصرية كاملة',
          en: '1 Year Hosting + Free Domain + Full Visual Identity Design',
          fr: '1 an d’hébergement + Domaine gratuit + Design d’identité',
          de: '1 Jahr Hosting + Kostenlose Domain + Vollständiges Design',
        },
        originalPrice: 499,
        discountedPrice: 299,
        badge: 'خصم 40% لفترة محدودة',
        features: [
          { ar: 'استضافة Business NVMe سنة كاملة', en: '1 Year Business NVMe Hosting', fr: '1 an d’hébergement Business NVMe', de: '1 Jahr Business NVMe Hosting' },
          { ar: 'دومين .com أو .de مجاناً', en: 'Free .com or .de Domain', fr: 'Domaine .com ou .de gratuit', de: 'Kostenlose .com oder .de Domain' },
          { ar: 'شهادة أمان SSL مجانية مدى الحياة', en: 'Free SSL Certificate', fr: 'Certificat SSL gratuit', de: 'Kostenloses SSL-Zertifikat' },
        ],
        active: true,
      },
    ]);
  }

  // 5. Seed Gallery if empty or forced
  const galleryCount = await Gallery.countDocuments();
  if (galleryCount === 0 || force) {
    await Gallery.insertMany([
      {
        title: { ar: 'مشروع هوية بصرية لشركة التقنية الفائقة', en: 'HighTech Brand Identity Project', fr: 'Identité visuelle HighTech', de: 'HighTech Markenidentität' },
        description: { ar: 'تصميم شعار، ألوان المؤسسة، وكروت الأعمال', en: 'Logo, color palette, and business cards', fr: 'Logo, charte graphique et cartes de visite', de: 'Logo, Farbpalette und Visitenkarten' },
        category: 'identity',
        client: 'شركة التقنية الفائقة',
        date: '2026-01-15',
        order: 1,
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
        mediaType: 'image',
        active: true,
        status: 'منشور',
      },
      {
        title: { ar: 'فيديو موشن جرافيك لمنصة تسوق', en: 'E-commerce Motion Graphics Video', fr: 'Vidéo motion design e-commerce', de: 'E-Commerce Motion-Graphics-Video' },
        description: { ar: 'فيديو ترويجي 4K مع تعليق صوتي احترافي', en: '4K promotional video with pro voiceover', fr: 'Vidéo promotionnelle 4K avec voix off', de: '4K-Werbevideo mit Profi-Voiceover' },
        category: 'video',
        client: 'متجر فاست شوب',
        date: '2026-02-10',
        order: 2,
        coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        images: [],
        mediaType: 'video',
        active: true,
        status: 'منشور',
      },
    ]);
  }

  // 6. Seed Branches if empty or forced
  const branchCount = await Branch.countDocuments();
  if (branchCount === 0 || force) {
    await Branch.insertMany([
      {
        country: 'DE',
        cityName: { ar: 'فررانكفورت، ألمانيا', en: 'Frankfurt, Germany', fr: 'Francfort, Allemagne', de: 'Frankfurt, Deutschland' },
        address: 'Mainzer Landstraße 180, 60327 Frankfurt am Main',
        phone: '+49 69 1234 5678',
        email: 'germany@venecos.net',
        googleMapsUrl: 'https://maps.google.com/?q=Frankfurt',
        active: true,
      },
      {
        country: 'AE',
        cityName: { ar: 'دبي، الإمارات العربية المتحدة', en: 'Dubai, United Arab Emirates', fr: 'Dubaï, Émirats Arabes Unis', de: 'Dubai, Vereinigte Arabische Emirate' },
        address: 'Business Bay, Iris Bay Tower, Office 1402, Dubai',
        phone: '+971 4 987 6543',
        email: 'dubai@venecos.net',
        googleMapsUrl: 'https://maps.google.com/?q=Dubai',
        active: true,
      },
      {
        country: 'SA',
        cityName: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia', fr: 'Riyad, Arabie Saoudite', de: 'Riad, Saudi-Arabien' },
        address: 'طريق الملك فهد، برج العليا، الرياض',
        phone: '+966 11 456 7890',
        email: 'riyadh@venecos.net',
        googleMapsUrl: 'https://maps.google.com/?q=Riyadh',
        active: true,
      },
    ]);
  }

  // 7. Seed Exchange Rates if empty or forced
  const rateCount = await ExchangeRate.countDocuments();
  if (rateCount === 0 || force) {
    await ExchangeRate.insertMany([
      { currency: 'USD', rateToEUR: 0.92, updatedAt: new Date() },
      { currency: 'AED', rateToEUR: 0.25, updatedAt: new Date() },
      { currency: 'SAR', rateToEUR: 0.245, updatedAt: new Date() },
      { currency: 'SYP', rateToEUR: 0.000065, updatedAt: new Date() },
    ]);
  }
}
