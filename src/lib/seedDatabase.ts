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

export async function seedDatabase() {
  await connectToDatabase();

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

  // 2. Seed Services if empty
  const serviceCount = await ServiceContent.countDocuments();
  let defaultService = await ServiceContent.findOne();
  if (serviceCount === 0) {
    defaultService = await ServiceContent.create({
      title: 'تطوير البرمجيات والمواقع',
      description: 'حلول برمجة الويب والتطبيقات باستخدام أحدث تقنيات Next.js و React',
      locale: 'ar',
      iconName: 'FaCode',
      iconType: 'react-icon',
      isSpecial: true,
      order: 1,
      subServices: [
        {
          title: 'تطوير موقع إلكتروني فاخر',
          description: 'تصميم وبرمجة موقع متكامل وسريع',
          price: 999,
        },
        {
          title: 'تطبيق جوال (iOS & Android)',
          description: 'تطبيق هاتف مع لوحة تحكم سحابية',
          price: 1899,
        },
      ],
    });
  }

  // 3. Seed Sliders if empty
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
  }

  // 4. Seed Offers if empty
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
    ]);
  }

  // 5. Seed Gallery items if empty
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
    ]);
  }

  // 6. Seed Global Branches if empty
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
    ]);
  }

  // 7. Seed Exchange Rates if empty
  const rateCount = await ExchangeRate.countDocuments();
  if (rateCount === 0) {
    await ExchangeRate.insertMany([
      { currencyCode: 'EUR', currencyName: 'اليورو', rateToEur: 1.0, isBase: true },
      { currencyCode: 'USD', currencyName: 'الدولار الأمريكي', rateToEur: 1.08, isBase: false },
      { currencyCode: 'SAR', currencyName: 'الريال السعودي', rateToEur: 4.05, isBase: false },
      { currencyCode: 'AED', currencyName: 'الدرهم الإماراتي', rateToEur: 3.97, isBase: false },
    ]);
  }

  // 8. Seed Orders if empty
  const orderCount = await Order.countDocuments();
  if (orderCount === 0 && clientUser && defaultService) {
    await Order.create({
      userId: clientUser._id,
      serviceId: defaultService._id,
      subServiceId: 'sub-web-dev',
      serviceName: 'تطوير البرمجيات والمواقع',
      subServiceName: 'تطوير موقع إلكتروني فاخر',
      price: 999,
      customerDetails: {
        firstName: 'محمد',
        lastName: 'العميل',
        email: 'client@venecos.net',
        phone: '+966 50 123 4567',
        requirements: 'مطلوب بناء موقع تجاري متكامل بلغات متعددة ودعم الدفع السحابي.',
      },
      status: 'accepted',
      paymentStatus: 'paid',
      assignedId: employeeUser?._id,
      assignedName: 'سارة المصممة',
    });
  }

  // 9. Seed Projects if empty
  const projectCount = await Project.countDocuments();
  if (projectCount === 0 && clientUser && employeeUser) {
    await Project.create({
      projectNumber: 'PRJ-2026-001',
      clientId: clientUser._id,
      clientName: 'محمد العميل',
      employeeId: employeeUser._id,
      employeeName: 'سارة المصممة',
      supervisorId: supervisorUser?._id,
      supervisorName: 'أحمد المشرف',
      title: 'تطوير منصة التجارة الإلكترونية الفاخرة',
      completionPercentage: 65,
      totalAmount: 2500,
      paidAmount: 1500,
      status: 'active',
      paymentStages: [
        { name: 'الدفعة الأولى — البدء وتصميم الواجهات', pct: 40, amount: 1000, status: 'paid' },
        { name: 'الدفعة الثانية — البرمجة وربط بوابات الدفع', pct: 35, amount: 875, status: 'paid' },
        { name: 'الدفعة النهائية — التسليم والاختبار', pct: 25, amount: 625, status: 'pending' },
      ],
    });
  }

  // 10. Seed Contracts if empty
  const contractCount = await Contract.countDocuments();
  if (contractCount === 0) {
    await Contract.create({
      serviceName: 'عقد اتفاقية الخدمات البرمجية والإبداعية الشاملة',
      version: 'v1.0',
      customClauses: {
        ar: 'يتعهد الطرف الثاني بتنفيذ المشروع وفق المواصفات المحددة وتسليمه في الموعد المتفق عليه مع تقديم ضمان صيانة لمدة 12 شهراً.',
        en: 'The provider agrees to deliver the project according to specifications with a 12-month maintenance warranty.',
        fr: 'Le prestataire s’engage à fournir le projet selon les spécifications avec une garantie de maintenance de 12 mois.',
        de: 'Der Anbieter verpflichtet sich, das Projekt gemäß Spezifikationen mit 12 Monaten Wartungsgarantie zu liefern.',
      },
      requireTypedName: true,
    });
  }

  // 11. Seed Disputes if empty
  const disputeCount = await Dispute.countDocuments();
  if (disputeCount === 0 && clientUser && employeeUser) {
    await Dispute.create({
      disputeNumber: 'DSP-2026-09',
      orderNumber: 'ORD-9821',
      clientId: clientUser._id,
      clientName: 'محمد العميل',
      employeeId: employeeUser._id,
      employeeName: 'سارة المصممة',
      serviceName: 'تصميم الهوية البصرية',
      currentTier: 'admin',
      status: 'in_progress',
      timeline: [
        { step: 'supervisor', icon: 'fa-user-tie', color: 'var(--gold)', done: true, date: '2026-07-28', note: 'تم مراجعة الطلب بواسطة المشرف وتحويله للإدارة' },
        { step: 'admin', icon: 'fa-user-shield', color: 'var(--blue)', done: false, current: true, date: '2026-08-01', note: 'قيد مراجعة القرار النهائي للإدارة' },
        { step: 'legal', icon: 'fa-scale-balanced', color: 'var(--red)', done: false, date: '-', note: 'المرحلة القانونية النهائية' },
      ],
      adminDecision: 'جاري دراسة التسوية المالية وصرف 50% مستحقات مع إعادة صياغة الشروط.',
    });
  }

  // 12. Seed Applications if empty
  const appCount = await Application.countDocuments();
  if (appCount === 0) {
    await Application.create({
      firstName: 'علي',
      lastName: 'الحسن',
      email: 'ali.hassan@example.com',
      phone: '+49 176 999 8888',
      position: 'مطور فرونت إند — Senior Frontend Engineer',
      message: 'خبرة 6 سنوات في تكنولوجيا React, Next.js, و TypeScript مع شغف بتصميم الواجهات الفاخرة.',
      cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cvPublicId: 'cv-dummy-01',
      status: 'reviewing',
      ipAddress: '198.51.100.42',
      country: 'ألمانيا — Germany',
      languages: ['العربية', 'الإنجليزية', 'الألمانية'],
      portfolioLinks: [{ title: 'GitHub Profile', url: 'https://github.com', verified: true }],
      documents: [{ name: 'شهادة بكالوريوس هندسة الحاسوب.pdf', url: 'https://example.com/degree.pdf', verified: true }],
    });
  }

  // 13. Seed BanList if empty
  const banCount = await BanList.countDocuments();
  if (banCount === 0) {
    await BanList.create([
      { type: 'ip', value: '192.0.2.1', reason: 'محاولات دخول مشبوهة' },
      { type: 'email', value: 'spammer@malicious.org', reason: 'رسائل سبام متكررة' },
    ]);
  }
}
