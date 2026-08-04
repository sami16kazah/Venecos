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

let hasSeeded = false;

export async function seedDatabase(force = false) {
  if (hasSeeded && !force) return;
  hasSeeded = true;

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

  // 2. Seed Services (All 14 services seeded across 4 locales)
  const serviceCount = await ServiceContent.countDocuments();
  if (serviceCount === 0 || force) {
    const rawServices = [
      {
        serviceKey: 'programming',
        title: { ar: 'البرمجة والتطوير', en: 'Custom Software Development', fr: 'Développement sur mesure', de: 'Softwareentwicklung' },
        description: { ar: 'تطوير مواقع وتطبيقات وأنظمة سحابية متكاملة', en: 'Custom web, mobile and cloud application engineering', fr: 'Développement web, mobile et cloud sur mesure', de: 'Erstellung von Web- und Mobilanwendungen' },
        iconName: 'FaCode',
        order: 0,
        isSpecial: true,
        subServices: [
          { title: 'Full Stack Web App', description: 'React, Next.js, Node.js & MongoDB', price: 499 },
          { title: 'Mobile App (iOS / Android)', description: 'Cross-platform mobile application', price: 799 },
        ]
      },
      {
        serviceKey: 'shared-hosting',
        title: { ar: 'الاستضافة المشتركة (Shared Hosting)', en: 'Shared Web Hosting', fr: 'Hébergement mutualisé', de: 'Shared Hosting' },
        description: { ar: 'خطط استضافة فائقة السرعة مع لوحة cPanel وتراخيص SSL وذاكرة NVMe', en: 'High speed cPanel NVMe web hosting plans', fr: 'Hébergement web cPanel ultra rapide', de: 'Schnelles cPanel NVMe Webhosting' },
        iconName: 'FaServer',
        order: 1,
        isSpecial: true,
        subServices: [
          { title: 'Starter Plan', description: '10 GB SSD + 1 Website', price: 49 },
          { title: 'Business Plan', description: '50 GB NVMe + 5 Websites', price: 99 },
          { title: 'Pro Unlimited', description: '150 GB NVMe + 20 Websites', price: 199 },
        ]
      },
      {
        serviceKey: 'vps',
        title: { ar: 'السيرفرات السحابية (VPS)', en: 'Cloud VPS Servers', fr: 'Serveurs VPS Cloud', de: 'Cloud VPS-Server' },
        description: { ar: 'سيرفرات سحابية عالية الأداء في ألمانيا وفرنسا مع حماية DDoS كاملة', en: 'High performance cloud VPS servers with DDoS protection', fr: 'Serveurs VPS cloud haute performance avec protection DDoS', de: 'Leistungsstarke VPS-Server mit DDoS-Schutz' },
        iconName: 'FaCloud',
        order: 2,
        isSpecial: true,
        subServices: [
          { title: 'VPS Core 2 vCPU', description: '4GB RAM + 80GB NVMe', price: 299 },
          { title: 'VPS Business 4 vCPU', description: '8GB RAM + 160GB NVMe', price: 499 },
        ]
      },
      {
        serviceKey: 'video',
        title: { ar: 'إنتاج الفيديو والموشن جرافيك', en: 'Video Production & Animation', fr: 'Production vidéo & Animation', de: 'Videoproduktion & Animation' },
        description: { ar: 'مونتاج فيديو احترافي بدقة 4K وإخراج مقاطع موشن جرافيك إعلانية', en: 'Professional 4K video editing & motion graphics', fr: 'Montage vidéo 4K et motion design publicitaire', de: 'Professioneller 4K-Videoschnitt & Motion Graphics' },
        iconName: 'FaVideo',
        order: 3,
        isSpecial: true,
        subServices: [
          { title: 'Promo Video (30s)', description: 'Full HD / 4K Motion Graphics', price: 350 },
          { title: 'Documentary Video 4K', description: 'Cinematic filming and editing', price: 850 },
        ]
      },
      {
        serviceKey: '3d-design',
        title: { ar: 'التصميم ثلاثي الأبعاد (3D Design)', en: '3D Design & Rendering', fr: 'Design & Rendu 3D', de: '3D-Design & Rendering' },
        description: { ar: 'نمذجة مجسمات وعروض تفاعلية 360 درجة مع معالجة إضاءة واقعية', en: '3D product modeling, rendering & interactive Sketchfab embeds', fr: 'Modélisation 3D et rendu photoréaliste', de: '3D-Modellierung und fotorealistisches Rendering' },
        iconName: 'FaCube',
        order: 4,
        isSpecial: false,
        subServices: [
          { title: '3D Product Rendering', description: '360° product angles & lighting', price: 450 },
        ]
      },
      {
        serviceKey: 'paper-print',
        title: { ar: 'الطباعة الورقية (Paper Print)', en: 'Paper Printing Services', fr: 'Impression papier', de: 'Papierdruckdienste' },
        description: { ar: 'طباعة كروت، بروشورات، ملصقات، وهدايا دعاية بأعلى جودة بالألوان', en: 'Custom business cards, brochures, flyers and paper products', fr: 'Cartes de visite, brochures et dépliants', de: 'Visitenkarten, Broschüren und Flyer' },
        iconName: 'FaPrint',
        order: 5,
        isSpecial: false,
        subServices: [
          { title: '1000 Business Cards', description: '350gsm premium paper matte lamination', price: 45 },
          { title: '500 A4 Flyers', description: 'Full color double sided printing', price: 85 },
        ]
      },
      {
        serviceKey: 'stickers',
        title: { ar: 'طباعة الملصقات (Stickers)', en: 'Sticker & Label Printing', fr: 'Impression d\'autocollants', de: 'Sticker- & Etikettendruck' },
        description: { ar: 'قص وتفصيل جميع أنواع الملصقات الفينيل والشفافة بحسب الطلب', en: 'Custom vinyl, transparent and die-cut sticker labels', fr: 'Autocollants en vinyle et étiquettes sur mesure', de: 'Individuelle Vinylsticker und Etiketten' },
        iconName: 'FaTag',
        order: 6,
        isSpecial: false,
        subServices: [
          { title: 'Vinyl Stickers 10m²', description: 'Waterproof die-cut stickers', price: 120 },
        ]
      },
      {
        serviceKey: 'photography',
        title: { ar: 'التصميم الفوتوغرافي (Photography)', en: 'Commercial Photography', fr: 'Photographie commerciale', de: 'Kommerzielle Fotografie' },
        description: { ar: 'جلسات تصوير استوديو وخارجي للمنتجات والأطعمة والعقارات', en: 'High resolution studio product & commercial photo shoot', fr: 'Prise de vue studio et retouche photo professionnelle', de: 'Studio- und Produktfotografie' },
        iconName: 'FaCamera',
        order: 7,
        isSpecial: false,
        subServices: [
          { title: 'Product Photo Package', description: '10 high-res edited product photos', price: 150 },
        ]
      },
      {
        serviceKey: 'voiceover',
        title: { ar: 'التعليق الصوتي (Voice Over)', en: 'Voice Over Services', fr: 'Voix off professionnelle', de: 'Professionelle Sprachaufnahmen' },
        description: { ar: 'تسجيلات صوتية بالفصحى واللهجات العربية واللغات الأجنبية', en: 'Professional studio voice over in multiple languages & accents', fr: 'Voix off studio en plusieurs langues', de: 'Professionelle Sprachaufnahmen in mehreren Sprachen' },
        iconName: 'FaMicrophone',
        order: 8,
        isSpecial: false,
        subServices: [
          { title: 'Commercial Voice Over (100 words)', description: 'Studio recorded & mastered', price: 80 },
        ]
      },
      {
        serviceKey: 'content-writing',
        title: { ar: 'كتابة المحتوى (Content Writing)', en: 'Content Writing & Copywriting', fr: 'Rédaction de contenu', de: 'Texterstellung & Copywriting' },
        description: { ar: 'صياغة مقالات وتدقيق لغوي ونصوص إعلانات متوافقة مع SEO', en: 'SEO friendly articles, copywriting & company profile writing', fr: 'Rédaction SEO et conception de textes publicitaires', de: 'SEO-Texte und Werbetexte' },
        iconName: 'FaPen',
        order: 9,
        isSpecial: false,
        subServices: [
          { title: 'SEO Articles Package', description: '5 exclusive 1000-word articles', price: 150 },
        ]
      },
      {
        serviceKey: 'adv-print',
        title: { ar: 'الطباعة الإعلانية (Advertising Print)', en: 'Advertising & Merchandise Print', fr: 'Impression publicitaire', de: 'Werbedruck' },
        description: { ar: 'طباعة حريرية وUV على الأكواب، الأقلام، والتيشيرتات والهدايا', en: 'Silk screen & UV printing on mugs, pens, t-shirts and corporate gifts', fr: 'Impression sérigraphique et UV sur objets publicitaires', de: 'Sieb- und UV-Druck auf Werbeartikeln' },
        iconName: 'FaGift',
        order: 10,
        isSpecial: false,
        subServices: [
          { title: 'Promotional Items Package', description: 'Custom branded gifts and mugs', price: 95 },
        ]
      },
      {
        serviceKey: '3d-print',
        title: { ar: 'الطباعة ثلاثية الأبعاد (3D Printing)', en: '3D Printing Services', fr: 'Impression 3D', de: '3D-Druckdienste' },
        description: { ar: 'طباعة مجسمات بدقة عالية بخامات PLA, PETG, Resin', en: 'High precision 3D printing in PLA, PETG, Resin and ABS', fr: 'Impression 3D haute précision en PLA/Resin', de: 'Hochpräziser 3D-Druck in PLA/Resin' },
        iconName: 'FaBoxes',
        order: 11,
        isSpecial: false,
        subServices: [
          { title: 'PLA / Resin Model Print', description: 'Custom 3D model printing per gram', price: 65 },
        ]
      },
      {
        serviceKey: 'domains',
        title: { ar: 'الدومينات (Domain Names)', en: 'Domain Name Registration', fr: 'Enregistrement de domaine', de: 'Domain-Registrierung' },
        description: { ar: 'حجز وإدارة أسماء النطاقات بجميع اللواحق العالمية والمحلية', en: 'Register and manage custom domain extensions (.com, .net, .org, .de)', fr: 'Enregistrement et gestion de noms de domaine', de: 'Registrierung und Verwaltung von Domainnamen' },
        iconName: 'FaGlobe',
        order: 12,
        isSpecial: false,
        subServices: [
          { title: 'Domain Registration (.com)', description: '1 year registration with WHOIS privacy', price: 12.99 },
        ]
      },
      {
        serviceKey: 'support',
        title: { ar: 'الدعم الفني (Tech Support)', en: 'Technical Support & Maintenance', fr: 'Support technique & maintenance', de: 'Technischer Support' },
        description: { ar: 'حل مشكلات السيرفرات والمواقع وصيانتها وحمايتها', en: 'Server & website troubleshooting, maintenance and security tuning', fr: 'Dépannage et maintenance serveur et web', de: 'Wartung und Fehlerbehebung für Server und Webseiten' },
        iconName: 'FaHeadset',
        order: 13,
        isSpecial: false,
        subServices: [
          { title: 'Server Maintenance Ticket', description: 'Priority technical troubleshooting', price: 49 },
        ]
      },
    ];

    const docsToInsert = [];
    const locales = ['ar', 'en', 'fr', 'de'];
    for (const item of rawServices) {
      for (const loc of locales) {
        docsToInsert.push({
          serviceKey: item.serviceKey,
          locale: loc,
          title: item.title[loc as keyof typeof item.title] || item.title.en,
          description: item.description[loc as keyof typeof item.description] || item.description.en,
          iconName: item.iconName,
          iconType: 'react-icon',
          order: item.order,
          isSpecial: item.isSpecial,
          subServices: item.subServices,
        });
      }
    }
    await ServiceContent.deleteMany({});
    await ServiceContent.insertMany(docsToInsert);
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
        badge: {
          ar: 'خصم 40% لفترة محدودة',
          en: '40% OFF Limited Time',
          fr: '40% de réduction - Durée limitée',
          de: '40% Rabatt - Begrenzte Zeit',
        },
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
  // Delete invalid branch documents that fail schema validation
  try {
    await Branch.deleteMany({ $or: [{ name: { $exists: false } }, { city: { $exists: false } }, { countryName: { $exists: false } }] });
  } catch (err) {
    // Ignore migration cleanup error
  }

  const branchCount = await Branch.countDocuments();
  if (branchCount === 0 || force) {
    await Branch.insertMany([
      {
        name: 'فرع ألمانيا الرئيسي — Frankfurt Head Office',
        countryCode: 'DE',
        countryName: 'ألمانيا — Germany',
        city: 'فرانكفورت — Frankfurt',
        address: 'Mainzer Landstraße 180, 60327 Frankfurt am Main',
        phone: '+49 69 1234 5678',
        email: 'germany@venecos.net',
        workingHours: [
          { days: 'الإثنين - الجمعة (Mon-Fri)', from: '09:00', to: '18:00' }
        ],
        googleMapsUrl: 'https://maps.google.com/?q=Frankfurt',
        status: 'active',
      },
      {
        name: 'فرع دبي — Dubai Regional Office',
        countryCode: 'AE',
        countryName: 'الإمارات العربية المتحدة — UAE',
        city: 'دبي — Dubai',
        address: 'Business Bay, Iris Bay Tower, Office 1402, Dubai',
        phone: '+971 4 987 6543',
        email: 'dubai@venecos.net',
        workingHours: [
          { days: 'الأحد - الخميس (Sun-Thu)', from: '09:00', to: '18:00' }
        ],
        googleMapsUrl: 'https://maps.google.com/?q=Dubai',
        status: 'active',
      },
      {
        name: 'فرع الرياض — Riyadh Hub',
        countryCode: 'SA',
        countryName: 'المملكة العربية السعودية — KSA',
        city: 'الرياض — Riyadh',
        address: 'طريق الملك فهد، برج العليا، الرياض',
        phone: '+966 11 456 7890',
        email: 'riyadh@venecos.net',
        workingHours: [
          { days: 'الأحد - الخميس (Sun-Thu)', from: '09:00', to: '18:00' }
        ],
        googleMapsUrl: 'https://maps.google.com/?q=Riyadh',
        status: 'active',
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
