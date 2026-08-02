import connectToDatabase from '@/lib/mongodb';
import Slider from '@/models/Slider';
import Offer from '@/models/Offer';
import Gallery from '@/models/Gallery';
import Branch from '@/models/Branch';
import ExchangeRate from '@/models/ExchangeRate';

export async function seedDatabase() {
  await connectToDatabase();

  // 1. Seed Sliders if empty
  const sliderCount = await Slider.countDocuments();
  if (sliderCount === 0) {
    await Slider.insertMany([
      {
        title: {
          ar: 'حلول برمجية وإبداعية متكاملة',
          en: 'Complete Software & Creative Solutions',
          fr: 'Solutions logicielles et créatives complètes',
          de: 'Komplette Software- und Kreativlösungen',
        },
        subtitle: {
          ar: 'نبتكر المستقبل ونطور الأعمال بأحدث التقنيات وأعلى معايير الإبداع',
          en: 'Innovating the future and building businesses with cutting-edge tech',
          fr: 'Innover l’avenir et développer les entreprises avec les dernières technologies',
          de: 'Zukunft neu erfinden und Unternehmen mit modernster Technologie ausbauen',
        },
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        linkUrl: '#services',
        order: 1,
        active: true,
      },
      {
        title: {
          ar: 'تصميم الهوية البصرية وإنتاج الفيديو',
          en: 'Brand Identity & Video Production',
          fr: 'Identité visuelle et production vidéo',
          de: 'Markenidentität & Videoproduktion',
        },
        subtitle: {
          ar: 'نبني لعلامتك التجارية حضوراً استثنائياً يلفت الأنظار ويحقق نتائج ملموسة',
          en: 'Crafting an exceptional presence for your brand that gets noticed',
          fr: 'Créer une présence exceptionnelle pour votre marque qui se fait remarquer',
          de: 'Wir schaffen eine außergewöhnliche Präsenz für Ihre Marke',
        },
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        linkUrl: '#gallery',
        order: 2,
        active: true,
      },
    ]);
    console.log('✅ Sliders seeded');
  }

  // 2. Seed Offers if empty
  const offerCount = await Offer.countDocuments();
  if (offerCount === 0) {
    await Offer.insertMany([
      {
        title: {
          ar: 'باقة الانطلاقة الرقمية الشاملة',
          en: 'Complete Digital Kickstart Package',
          fr: 'Pack complet de démarrage numérique',
          de: 'Komplettes Digital-Startpaket',
        },
        description: {
          ar: 'تصميم موقع إلكتروني احترافي + هوية بصرية كاملة + استضافة مجانية لمدة سنة',
          en: 'Professional website design + full brand identity + 1-year free hosting',
          fr: 'Conception de site Web professionnel + identité visuelle + hébergement gratuit 1 an',
          de: 'Professionelles Website-Design + Markenidentität + 1 Jahr kostenloses Hosting',
        },
        badge: { ar: 'خصم 35%', en: '35% OFF', fr: '35% DE RÉDUCTION', de: '35% RABATT' },
        originalPrice: 1499,
        discountedPrice: 969,
        currency: 'EUR',
        features: {
          ar: ['موقع إلكتروني متجاوب بالكامل', 'لوحة تحكم خاصة للربط', 'دعم فني 24/7 لمدة عام'],
          en: ['Fully Responsive Website', 'Custom Admin Dashboard', '24/7 Technical Support for 1 Year'],
          fr: ['Site Web entièrement adaptatif', 'Tableau de bord personnalisé', 'Support technique 24/7 pendant 1 an'],
          de: ['Vollständig responsive Website', 'Individuelles Admin-Dashboard', '24/7 Technischer Support für 1 Jahr'],
        },
        active: true,
      },
      {
        title: {
          ar: 'باقة المتاجر الإلكترونية المتطورة',
          en: 'Advanced E-Commerce Store Package',
          fr: 'Pack e-commerce avancé',
          de: 'Fortgeschrittenes E-Commerce-Paket',
        },
        description: {
          ar: 'متجر متكامل بجميع وسائل الدفع الربط مع شركات الشحن وتطبيق جوال',
          en: 'Full e-commerce store with payment gateways, shipping integration & mobile app',
          fr: 'Boutique en ligne complète avec passerelles de paiement, expédition et application mobile',
          de: 'Vollständiger E-Commerce-Shop mit Zahlungs-Gateways, Versand-Integration & App',
        },
        badge: { ar: 'عرض خاص', en: 'SPECIAL OFFER', fr: 'OFFRE SPÉCIALE', de: 'SONDERANGEBOT' },
        originalPrice: 2499,
        discountedPrice: 1799,
        currency: 'EUR',
        features: {
          ar: ['بوابات دفع Stripe & PayPal', 'تطبيق Android & iOS', 'إدارة المخزون التلقائية'],
          en: ['Stripe & PayPal Payment Gateways', 'Android & iOS Mobile App', 'Automated Inventory Control'],
          fr: ['Passerelles Stripe et PayPal', 'Application Android et iOS', 'Gestion automatique des stocks'],
          de: ['Stripe & PayPal Payment-Gateways', 'Android & iOS Mobile App', 'Automatische Lagerverwaltung'],
        },
        active: true,
      },
      {
        title: {
          ar: 'باقة الهوية والتسويق المرئي',
          en: 'Branding & Visual Marketing Package',
          fr: 'Pack d’identité et de marketing visuel',
          de: 'Markenidentität & Visuelles Marketing',
        },
        description: {
          ar: 'تصميم شعار + فيديو موشن جرافيك 60 ثانية + تصاميم سوشيال ميديا شهرية',
          en: 'Logo design + 60s motion graphics video + monthly social media designs',
          fr: 'Conception de logo + vidéo motion design 60s + visuels réseaux sociaux mensuels',
          de: 'Logo-Design + 60s Motion-Graphics-Video + monatliche Social-Media-Designs',
        },
        badge: { ar: 'الأكثر طلباً', en: 'MOST POPULAR', fr: 'LE PLUS POPULAIRE', de: 'BELIEBTESTE' },
        originalPrice: 999,
        discountedPrice: 699,
        currency: 'EUR',
        features: {
          ar: ['شعار ودليل استخدام الهوية', 'فيديو إعلاني احترافي', '15 تصميم منصات التواصل'],
          en: ['Logo & Brand Guidelines', 'Professional Promo Video', '15 Social Media Posts'],
          fr: ['Logo et charte graphique', 'Vidéo promotionnelle professionnelle', '15 publications réseaux sociaux'],
          de: ['Logo & Brand Guidelines', 'Professionelles Werbevideo', '15 Social-Media-Beiträge'],
        },
        active: true,
      },
    ]);
    console.log('✅ Offers seeded');
  }

  // 3. Seed Gallery items if empty
  const galleryCount = await Gallery.countDocuments();
  if (galleryCount === 0) {
    await Gallery.insertMany([
      {
        title: {
          ar: 'تصميم منصة VENECOS الرقمية',
          en: 'VENECOS Digital Platform Design',
          fr: 'Conception de la plateforme VENECOS',
          de: 'Design der VENECOS Digital-Plattform',
        },
        description: {
          ar: 'تصميم واجهة مستخدم فاخرة بنظام ألوان أسود وذهبي وتجربة مستخدم سلسة',
          en: 'Luxury UI/UX design with dark gold aesthetic and seamless interactions',
          fr: 'Design UI/UX de luxe avec une esthétique noir et or et des interactions fluides',
          de: 'Luxuriöses UI/UX-Design mit Schwarz-Gold-Ästhetik und nahtlosen Interaktionen',
        },
        category: 'software',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        active: true,
      },
      {
        title: {
          ar: 'فيديو ترويجي ثلاثي الأبعاد',
          en: '3D Product Promo Video',
          fr: 'Vidéo promotionnelle de produit 3D',
          de: '3D-Produkt-Werbevideo',
        },
        description: {
          ar: 'إنتاج إعلان سينمائي 3D لمنتج فاخر بأسلوب إبداعي عالي الجودة',
          en: 'High-end 3D cinematic promo for a luxury brand product',
          fr: 'Promotion cinématographique 3D haut de gamme pour une marque de luxe',
          de: 'High-End 3D-Kinowerbung für ein Luxusmarkenprodukt',
        },
        category: 'video',
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        active: true,
      },
      {
        title: {
          ar: 'هوية بصرية لشركة استشارات عالمية',
          en: 'Global Consulting Brand Identity',
          fr: 'Identité de marque pour cabinet de conseil',
          de: 'Markenidentität für internationale Beratung',
        },
        description: {
          ar: 'دليل هوية متكامل يشمل الشعار والمطبوعات والأوراق الرسمية',
          en: 'Comprehensive brand guide including logo, print assets & stationery',
          fr: 'Guide de marque complet incluant logo, imprimés et papeterie',
          de: 'Umfassendes Brand Guide inklusive Logo, Druckmedien & Papierwaren',
        },
        category: 'identity',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&w=800&q=80',
        active: true,
      },
      {
        title: {
          ar: 'طباعة فاخرة بلمسات ذهبية',
          en: 'Luxury Foil Stamping & Print',
          fr: 'Impression de luxe avec dorure',
          de: 'Luxusdruck mit Goldfolienprägung',
        },
        description: {
          ar: 'طباعة كروت شخصية وكتالوجات ورقية فاخرة بورق مخملي وضغط ذهبي',
          en: 'Velvet business cards & catalogs with metallic gold hot stamping',
          fr: 'Cartes de visite en velours et catalogues avec dorure à chaud',
          de: 'Samt-Visitenkarten & Kataloge mit Heißfolienprägung',
        },
        category: 'print',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
        active: true,
      },
    ]);
    console.log('✅ Gallery seeded');
  }

  // 4. Seed Global Branches if empty
  const branchCount = await Branch.countDocuments();
  if (branchCount === 0) {
    await Branch.insertMany([
      {
        countryCode: 'DE',
        countryName: 'ألمانيا — Germany',
        city: 'برلين — Berlin',
        address: 'Friedrichstraße 123, 10117 Berlin',
        phone: '+49 30 1234 5678',
        email: 'berlin@venecos.net',
        workingHours: 'Mon-Fri: 09:00 - 18:00 (CET)',
        isHeadquarters: true,
        status: 'active',
        googleMapsUrl: 'https://maps.google.com/?q=Friedrichstraße+123+Berlin',
      },
      {
        countryCode: 'AE',
        countryName: 'الإمارات — UAE',
        city: 'دبي — Dubai',
        address: 'Business Bay, Silicon Tower 1402, Dubai',
        phone: '+971 4 987 6543',
        email: 'dubai@venecos.net',
        workingHours: 'Mon-Fri: 09:00 - 18:00 (GST)',
        isHeadquarters: false,
        status: 'active',
        googleMapsUrl: 'https://maps.google.com/?q=Business+Bay+Dubai',
      },
      {
        countryCode: 'SA',
        countryName: 'السعودية — Saudi Arabia',
        city: 'الرياض — Riyadh',
        address: 'King Fahd Road, Olaya District, Riyadh',
        phone: '+966 11 234 5678',
        email: 'riyadh@venecos.net',
        workingHours: 'Sun-Thu: 09:00 - 17:00 (AST)',
        isHeadquarters: false,
        status: 'active',
        googleMapsUrl: 'https://maps.google.com/?q=Olaya+Riyadh',
      },
    ]);
    console.log('✅ Branches seeded');
  }

  // 5. Seed Exchange Rates if empty
  const rateCount = await ExchangeRate.countDocuments();
  if (rateCount === 0) {
    await ExchangeRate.insertMany([
      { currencyCode: 'EUR', currencyName: 'اليورو', rateToEur: 1.0, isBase: true },
      { currencyCode: 'USD', currencyName: 'الدولار الأمريكي', rateToEur: 1.08, isBase: false },
      { currencyCode: 'SAR', currencyName: 'الريال السعودي', rateToEur: 4.05, isBase: false },
      { currencyCode: 'AED', currencyName: 'الدرهم الإماراتي', rateToEur: 3.97, isBase: false },
      { currencyCode: 'SYP', currencyName: 'الليرة السورية', rateToEur: 14500.0, isBase: false },
      { currencyCode: 'EGP', currencyName: 'الجنيه المصري', rateToEur: 52.3, isBase: false },
      { currencyCode: 'GBP', currencyName: 'الجنيه الإسترليني', rateToEur: 0.84, isBase: false },
      { currencyCode: 'TRY', currencyName: 'الليرة التركية', rateToEur: 36.5, isBase: false },
    ]);
    console.log('✅ Exchange Rates seeded');
  }
}
