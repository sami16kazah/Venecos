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
import AboutContent from '@/models/AboutContent';

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
      AboutContent.deleteMany({}),
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
          { title: { ar: 'تطبيق ويب متكامل', en: 'Full Stack Web App', fr: 'Application Web Complète', de: 'Full Stack Web-App' }, description: { ar: 'تطبيق React و Next.js و Node.js و MongoDB', en: 'React, Next.js, Node.js & MongoDB', fr: 'React, Next.js, Node.js & MongoDB', de: 'React, Next.js, Node.js & MongoDB' }, price: 499 },
          { title: { ar: 'تطبيق مويل (iOS / Android)', en: 'Mobile App (iOS / Android)', fr: 'Application Mobile (iOS / Android)', de: 'Mobile App (iOS / Android)' }, description: { ar: 'تطبيق محمول متعدد المنصات عالية السرعة', en: 'Cross-platform mobile application', fr: 'Application mobile multiplateforme', de: 'Plattformübergreifende mobile Anwendung' }, price: 799 },
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
          { title: { ar: 'الباقة الأساسية', en: 'Starter Plan', fr: 'Plan Débutant', de: 'Starter-Paket' }, description: { ar: '10 جيجابايت SSD + موقع واحد', en: '10 GB SSD + 1 Website', fr: '10 Go SSD + 1 Site', de: '10 GB SSD + 1 Webseite' }, price: 49 },
          { title: { ar: 'باقة الأعمال', en: 'Business Plan', fr: 'Plan Business', de: 'Business-Paket' }, description: { ar: '50 جيجابايت NVMe + 5 مواقع', en: '50 GB NVMe + 5 Websites', fr: '50 Go NVMe + 5 Sites', de: '50 GB NVMe + 5 Webseiten' }, price: 99 },
          { title: { ar: 'الباقة الاحترافية', en: 'Pro Unlimited', fr: 'Plan Pro', de: 'Profi-Paket' }, description: { ar: '150 جيجابايت NVMe + 20 موقع', en: '150 GB NVMe + 20 Websites', fr: '150 Go NVMe + 20 Sites', de: '150 GB NVMe + 20 Webseiten' }, price: 199 },
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
          { title: { ar: 'سيرفر كور 2 vCPU', en: 'VPS Core 2 vCPU', fr: 'VPS Core 2 vCPU', de: 'VPS Core 2 vCPU' }, description: { ar: '4 جيجابايت رام + 80 جيجابايت NVMe', en: '4GB RAM + 80GB NVMe', fr: '4Go RAM + 80Go NVMe', de: '4GB RAM + 80GB NVMe' }, price: 299 },
          { title: { ar: 'سيرفر الأعمال 4 vCPU', en: 'VPS Business 4 vCPU', fr: 'VPS Business 4 vCPU', de: 'VPS Business 4 vCPU' }, description: { ar: '8 جيجابايت رام + 160 جيجابايت NVMe', en: '8GB RAM + 160GB NVMe', fr: '8Go RAM + 160Go NVMe', de: '8GB RAM + 160GB NVMe' }, price: 499 },
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
          { title: { ar: 'فيديو إعلاني (30 ثانية)', en: 'Promo Video (30s)', fr: 'Vidéo Promo (30s)', de: 'Werbevideo (30s)' }, description: { ar: 'موشن جرافيك بدقة Full HD / 4K', en: 'Full HD / 4K Motion Graphics', fr: 'Motion Graphics Full HD / 4K', de: 'Full HD / 4K Motion Graphics' }, price: 350 },
          { title: { ar: 'فيديو وثائقي سينمائي 4K', en: 'Documentary Video 4K', fr: 'Vidéo Documentaire 4K', de: 'Dokumentarfilm 4K' }, description: { ar: 'تصوير وإخراج سينمائي احترافي', en: 'Cinematic filming and editing', fr: 'Tournage et montage cinématographique', de: 'Kinomäßige Filmaufnahme und Schnitt' }, price: 850 },
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
          { title: { ar: 'رندر منتجات ثلاثي الأبعاد', en: '3D Product Rendering', fr: 'Rendu Produit 3D', de: '3D-Produkt-Rendering' }, description: { ar: 'زوايا 360 درجة ومعالجة إضاءة واقعية', en: '360° product angles & lighting', fr: 'Angles de produit 360° et éclairage', de: '360°-Produktwinkel & Beleuchtung' }, price: 450 },
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
          { title: { ar: '1000 كرت شخصي فاخر', en: '1000 Business Cards', fr: '1000 Cartes de Visite', de: '1000 Visitenkarten' }, description: { ar: 'ورق 350 جرام مع سلوفان مطفي', en: '350gsm premium paper matte lamination', fr: 'Papier premium 350g pelliculage mat', de: '350g Premium-Papier matte Kaschierung' }, price: 45 },
          { title: { ar: '500 بروشور A4 ملون', en: '500 A4 Flyers', fr: '500 Dépliants A4', de: '500 A4 Flyer' }, description: { ar: 'طباعة وجهين بأعلى جودة بالألوان', en: 'Full color double sided printing', fr: 'Impression couleur recto verso', de: 'Beidseitiger Vollfarbdruck' }, price: 85 },
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
          { title: { ar: 'ملصقات فينيل 10م²', en: 'Vinyl Stickers 10m²', fr: 'Autocollants Vinyle 10m²', de: 'Vinylsticker 10m²' }, description: { ar: 'ملصقات فينيل داي كت مقاومة للماء', en: 'Waterproof die-cut stickers', fr: 'Autocollants découpés étanches', de: 'Wasserdichte gestanzte Sticker' }, price: 120 },
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
          { title: { ar: 'باقة تصوير المنتجات', en: 'Product Photo Package', fr: 'Forfait Photo Produit', de: 'Produktfoto-Paket' }, description: { ar: '10 صور منتجات عالية الدقة مع معالجة احترافية', en: '10 high-res edited product photos', fr: '10 photos de produits haute résolution retouchées', de: '10 hochauflösende bearbeitete Produktfotos' }, price: 150 },
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
          { title: { ar: 'تعليق صوتي إعلاني (100 كلمة)', en: 'Commercial Voice Over (100 words)', fr: 'Voix Off Publicitaire (100 mots)', de: 'Werbesprachaufnahme (100 Wörter)' }, description: { ar: 'تسجيل استوديو احترافي مع الهندسة الصوتية', en: 'Studio recorded & mastered', fr: 'Enregistré et mixé en studio', de: 'Im Studio aufgenommen und gemastert' }, price: 80 },
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
          { title: { ar: 'باقة مقالات SEO المتوافقة', en: 'SEO Articles Package', fr: 'Forfait Articles SEO', de: 'SEO-Artikel-Paket' }, description: { ar: '5 مقالات حصرية بعمق 1000 كلمة', en: '5 exclusive 1000-word articles', fr: '5 articles exclusifs de 1000 mots', de: '5 exklusive Artikel mit je 1000 Wörtern' }, price: 150 },
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
          { title: { ar: 'باقة الهدايا والأكواب الإعلانية', en: 'Promotional Items Package', fr: 'Forfait Objets Promotionnels', de: 'Werbeartikel-Paket' }, description: { ar: 'طباعة اسم وشعار الشركة على الهدايا والأكواب', en: 'Custom branded gifts and mugs', fr: 'Cadeaux et tasses personnalisés', de: 'Individuell bedruckte Geschenke und Tassen' }, price: 95 },
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
          { title: { ar: 'مجسم 3D بخامة PLA / Resin', en: 'PLA / Resin Model Print', fr: 'Impression Modèle PLA / Résine', de: 'PLA / Harz Modell Druck' }, description: { ar: 'طباعة دقيقة للمجسمات 3D حسب الوزن بالشمع أو الرزين', en: 'Custom 3D model printing per gram', fr: 'Impression 3D sur mesure au gramme', de: 'Individueller 3D-Modelldruck pro Gramm' }, price: 65 },
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
          { title: { ar: 'حجز نطاق .com', en: 'Domain Registration (.com)', fr: 'Enregistrement de Domaine (.com)', de: 'Domain-Registrierung (.com)' }, description: { ar: 'حجز سنة مع حماية خصوصية WHOIS', en: '1 year registration with WHOIS privacy', fr: 'Enregistrement 1 an avec protection WHOIS', de: '1 Jahr Registrierung mit WHOIS-Schutz' }, price: 12.99 },
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
          { title: { ar: 'تذكرة صيانة وحل مشكلات', en: 'Server Maintenance Ticket', fr: 'Ticket de Maintenance Serveur', de: 'Server-Wartungsticket' }, description: { ar: 'دعم فني فوري وتصحيح أعطال السيرفرات والمواقع', en: 'Priority technical troubleshooting', fr: 'Dépannage technique prioritaire', de: 'Prioritäre technische Fehlerbehebung' }, price: 49 },
        ]
      },
    ];

    const docsToInsert = [];
    const locales = ['ar', 'en', 'fr', 'de'];
    for (const item of rawServices) {
      for (const loc of locales) {
        const localizedSubServices = (item.subServices || []).map((sub: any) => ({
          ...sub,
          title: typeof sub.title === 'object' ? (sub.title[loc] || sub.title.en || sub.title.ar) : sub.title,
          description: typeof sub.description === 'object' ? (sub.description[loc] || sub.description.en || sub.description.ar) : sub.description,
          badge: typeof sub.badge === 'object' ? (sub.badge[loc] || sub.badge.en || sub.badge.ar) : (sub.badge || '★ الأكثر طلباً'),
          priceFrom: sub.priceFrom || sub.price || 20,
          priceTo: sub.priceTo || sub.priceFrom || sub.price || 35,
          deliveryDuration: typeof sub.deliveryDuration === 'object' ? (sub.deliveryDuration[loc] || sub.deliveryDuration.en || sub.deliveryDuration.ar) : (sub.deliveryDuration || '24 — 48 ساعة'),
          deliveryAndRevisions: sub.deliveryAndRevisions || [
            'يشمل السعر ما يصل إلى 3 جولات مراجعة.',
            'يُحسب وقت التسليم من استلام جميع المواد.',
            'يُسلَّم بصيغ عالية الدقة جاهزة للطباعة أو الاستخدام.',
            'التعديلات الإضافية تُحتسب خارج الباقة.'
          ],
          ownershipAndRights: sub.ownershipAndRights || [
            'يُدفع 50% مقدماً عند تأكيد الطلب.',
            'لا يُسترد المبلغ المقدم بعد بدء العمل.',
            'يتغير السعر النهائي حسب تعقيد الخدمة.',
            'التأخر في تسليم المواد يؤجل موعد التسليم.'
          ]
        }));

        docsToInsert.push({
          serviceKey: item.serviceKey,
          locale: loc,
          title: item.title[loc as keyof typeof item.title] || item.title.en,
          description: item.description[loc as keyof typeof item.description] || item.description.en,
          iconName: item.iconName,
          iconType: 'react-icon',
          order: item.order,
          isSpecial: item.isSpecial,
          subServices: localizedSubServices,
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

  // 8. Seed About Us dynamic content across all 4 locales
  const aboutCount = await AboutContent.countDocuments();
  if (aboutCount === 0 || force) {
    await AboutContent.deleteMany({});
    await AboutContent.insertMany([
      {
        locale: 'en',
        badge: 'INNOVATION & CREATIVITY',
        title: 'Building World-Class Software & High-Impact Digital Experiences',
        subtitle: 'Venecos is a full-service technology platform delivering custom web & mobile engineering, photorealistic 3D visual design, cinema video editing, and printing solutions.',
        heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
        heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42890-large.mp4',
        storyTitle: 'Our Journey & Story',
        content: `Founded with a mission to bridge high-end engineering with artistic excellence, Venecos empowers brands globally.\n\nFrom web and mobile applications to 3D animations and commercial printing, our multidisciplinary team of engineers, designers, and media architects turn ambitious ideas into reality.`,
        missionTitle: 'Our Mission',
        missionDesc: 'To empower organizations and creators with cutting-edge tech, seamless UX, and standout media production.',
        visionTitle: 'Our Vision',
        visionDesc: 'To be the globally recognized benchmark for software craftsmanship, digital innovation, and creative branding.',
        stats: [
          { label: 'Projects Completed', value: '850+', icon: 'MdCheckCircle' },
          { label: 'Global Clients', value: '320+', icon: 'MdPeople' },
          { label: 'Countries Served', value: '18+', icon: 'MdPublic' },
          { label: 'Client Satisfaction', value: '99.4%', icon: 'MdStar' }
        ],
        features: [
          { title: 'Full-Stack Software Engineering', description: 'React, Next.js, Cloud APIs, and high-load backend architecture.', icon: 'MdCode' },
          { title: '3D Modeling & Product Design', description: 'Hyper-realistic 3D rendering, motion graphics, and UI/UX design.', icon: 'MdPalette' },
          { title: 'Video & Audio Studio Production', description: 'Commercial editing, multi-language voiceovers, and promotional films.', icon: 'MdMovie' },
          { title: 'Dedicated 24/7 Support', description: 'Proactive project management and ongoing infrastructure support.', icon: 'MdHeadset' }
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1542744094-3a3172720177?q=80&w=800&auto=format&fit=crop'
        ],
        showcaseVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-a-laptop-42888-large.mp4'
      },
      {
        locale: 'ar',
        badge: 'الابتكار والإبداع الرقمي',
        title: 'نبني برمجيات فائقة الأداء وتجارب إبداعية تصنع الفارق',
        subtitle: 'منصة Venecos رائدة في تطوير تطبيقات الويب والموبايل، تصميم الـ 3D والموشن جرافيك، وإنتاج الفيديو، وخدمات الطباعة والدعاية.',
        heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
        heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42890-large.mp4',
        storyTitle: 'مسيرتنا وقصتنا',
        content: `تأسست منصة Venecos لتقديم مفهوم جديد يجمع بين الدقة البرمجية والإبداع البصري الاستثنائي.\n\nنضم نخبة من الهندسيين، المصممين، وصناع المحتوى الذين يعملون بروح الفريق الواحد لتحويل الأفكار إلى منتجات رقمية قيادية تحقق أعلى العوائد.`,
        missionTitle: 'رسالتنا',
        missionDesc: 'تمكين الأعمال والمؤسسات عبر العالم بتقنيات متقدمة وهويات بصريّة مبتكرة تضمن التفوق والريادة في السوق.',
        visionTitle: 'رؤيتنا',
        visionDesc: 'أن نكون الخيار الأول عالمياً للحلول التقنية المتكاملة وصناعة المحتوى عالي الجودة والطباعة الرقمية.',
        stats: [
          { label: 'مشروع منجز', value: '+850', icon: 'MdCheckCircle' },
          { label: 'عميل سعيد', value: '+320', icon: 'MdPeople' },
          { label: 'دولة نخدمها', value: '+18', icon: 'MdPublic' },
          { label: 'نسبة الرضا', value: '99.4%', icon: 'MdStar' }
        ],
        features: [
          { title: 'البرمجة والتطوير المتكامل', description: 'مواقع وتطبيقات سريعة يعتمد عليها باستخدام أفضل وأحدث التقنيات.', icon: 'MdCode' },
          { title: 'تصميم 3D والموشن جرافيك', description: 'رندر واقعي ثلاثي الأبعاد وهويات بصرية مميزة تعزز علامتك التجاريّة.', icon: 'MdPalette' },
          { title: 'إنتاج الفيديو والصوتيات', description: 'مونتاج سينمائي وتسجيلات صوتية احترافية بمختلف اللهجات واللغات.', icon: 'MdMovie' },
          { title: 'دعم ومتابعة 24/7', description: 'إدارة مشاريع مخصصة لضمان سرعة التسليم وجودة التنفيذ.', icon: 'MdHeadset' }
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1542744094-3a3172720177?q=80&w=800&auto=format&fit=crop'
        ],
        showcaseVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-a-laptop-42888-large.mp4'
      },
      {
        locale: 'fr',
        badge: 'INNOVATION & CRÉATIVITÉ',
        title: 'Solutions Logiciel & Expériences Numériques Sur-Mesure',
        subtitle: 'Venecos est une plateforme technologique mondiale spécialisée dans le développement web, le design 3D, la vidéo et la communication.',
        heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
        heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42890-large.mp4',
        storyTitle: 'Notre Histoire',
        content: `Fondée avec l'ambition d'allier ingénierie de pointe et excellence artistique, Venecos accompagne les entreprises à l'international.\n\nNos ingénieurs et créatifs conçoivent des applications haute performance et des visuels captivants.`,
        missionTitle: 'Notre Mission',
        missionDesc: 'Propulser la croissance des entreprises grâce à des outils digitaux modernes et une identité visuelle percutante.',
        visionTitle: 'Notre Vision',
        visionDesc: 'Devenir le partenaire technologique et créatif de référence à l\'échelle internationale.',
        stats: [
          { label: 'Projets Réalisés', value: '850+', icon: 'MdCheckCircle' },
          { label: 'Clients Satisfaits', value: '320+', icon: 'MdPeople' },
          { label: 'Pays Desservis', value: '18+', icon: 'MdPublic' },
          { label: 'Taux de Satisfaction', value: '99.4%', icon: 'MdStar' }
        ],
        features: [
          { title: 'Ingénierie Logicielle', description: 'Applications web & mobiles Next.js, React et architectures cloud sécurisées.', icon: 'MdCode' },
          { title: 'Design 3D & Graphisme', description: 'Rendu 3D réaliste, motion design et création de marque.', icon: 'MdPalette' }
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'
        ],
        showcaseVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-a-laptop-42888-large.mp4'
      },
      {
        locale: 'de',
        badge: 'INNOVATION & KREATIVITÄT',
        title: 'Erstklassige Software & Digitale Markenerlebnisse',
        subtitle: 'Venecos ist Ihre globale Plattform für individuelle Webentwicklung, 3D-Design, Videoproduktion und Druckmedien.',
        heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
        heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42890-large.mp4',
        storyTitle: 'Unsere Geschichte',
        content: `Venecos verbindet technologische Expertise mit künstlerischer Exzellenz.\n\nUnser internationales Team entwickelt leistungsstarke Anwendungen und beeindruckendes Mediendesign für weltweiten Erfolg.`,
        missionTitle: 'Unsere Mission',
        missionDesc: 'Unternehmen durch hochmoderne Software und überzeugendes Design zu nachhaltigem Wachstum zu verhelfen.',
        visionTitle: 'Unsere Vision',
        visionDesc: 'Weltweit der führende Partner für digitale Transformation und maßgeschneiderte Medienproduktion zu sein.',
        stats: [
          { label: 'Projekte Abgeschlossen', value: '850+', icon: 'MdCheckCircle' },
          { label: 'Zufriedene Kunden', value: '320+', icon: 'MdPeople' },
          { label: 'Länder Weltweit', value: '18+', icon: 'MdPublic' },
          { label: 'Zufriedenheitsrate', value: '99.4%', icon: 'MdStar' }
        ],
        features: [
          { title: 'Software-Entwicklung', description: 'Hochmoderne Web- & Mobile-Anwendungen mit Next.js und Cloud-Technologien.', icon: 'MdCode' },
          { title: '3D-Visualisierung & Design', description: 'Fotorealistisches 3D-Rendering, Motion Graphics und Brand Identity.', icon: 'MdPalette' }
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'
        ],
        showcaseVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-a-laptop-42888-large.mp4'
      }
    ]);
  }
}
