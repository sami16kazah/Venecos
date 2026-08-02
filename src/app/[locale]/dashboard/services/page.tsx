'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MdCode, MdCloud, MdHeadset, 
  MdCameraAlt, MdVideocam, MdViewInAr, MdPrint, MdLabel, 
  MdCampaign, Md3dRotation, MdMic, MdEditDocument, MdArrowForward
} from 'react-icons/md';
import { FaServer, FaGlobe } from 'react-icons/fa';

const SERVICE_PAGES = [
  // ── الخدمات التقنية ──
  { id: 'programming', title: 'البرمجة (Custom Web/App)', category: 'الخدمات التقنية', icon: MdCode, color: 'from-blue-600 to-indigo-600', href: '/dashboard/services/programming', count: 'خدمة مخصصة' },
  { id: 'shared-hosting', title: 'Shared Hosting (الاستضافة)', category: 'الخدمات التقنية', icon: FaServer, color: 'from-blue-500 to-cyan-500', href: '/dashboard/services/shared-hosting', count: '4 خطط' },
  { id: 'vps', title: 'VPS (السيرفرات السحابية)', category: 'الخدمات التقنية', icon: MdCloud, color: 'from-cyan-600 to-teal-600', href: '/dashboard/services/vps', count: 'باقات + Custom' },
  { id: 'domains', title: 'الدومينات (Domain Names)', category: 'الخدمات التقنية', icon: FaGlobe, color: 'from-teal-500 to-emerald-500', href: '/dashboard/services/domains', count: '5 لواحق' },
  { id: 'support', title: 'الدعم الفني (Tech Support)', category: 'الخدمات التقنية', icon: MdHeadset, color: 'from-emerald-600 to-green-600', href: '/dashboard/services/support', count: 'اشتراكات' },

  // ── خدمات التصميم ──
  { id: 'photography', title: 'التصميم الفوتوغرافي (Photography)', category: 'خدمات التصميم', icon: MdCameraAlt, color: 'from-emerald-500 to-teal-500', href: '/dashboard/services/photography', count: 'عروض + جلسات' },
  { id: 'video', title: 'إنتاج الفيديو (Video Production)', category: 'خدمات التصميم', icon: MdVideocam, color: 'from-purple-600 to-indigo-600', href: '/dashboard/services/video', count: 'موشن + 4K' },
  { id: '3d-design', title: 'التصميم ثلاثي الأبعاد (3D Design)', category: 'خدمات التصميم', icon: MdViewInAr, color: 'from-purple-500 to-pink-500', href: '/dashboard/services/3d-design', count: 'Sketchfab + 3D' },

  // ── خدمات الطباعة ──
  { id: 'paper-print', title: 'الطباعة الورقية (Paper Print)', category: 'خدمات الطباعة', icon: MdPrint, color: 'from-amber-500 to-yellow-500', href: '/dashboard/services/paper-print', count: 'كتيبات + GSM' },
  { id: 'stickers', title: 'طباعة الملصقات (Sticker Labels)', category: 'خدمات الطباعة', icon: MdLabel, color: 'from-yellow-600 to-amber-600', href: '/dashboard/services/stickers', count: 'قص مخصص + m²' },
  { id: 'adv-print', title: 'الطباعة الإعلانية (Advertising)', category: 'خدمات الطباعة', icon: MdCampaign, color: 'from-amber-600 to-orange-600', href: '/dashboard/services/adv-print', count: 'أكواب + تيشيرتات' },
  { id: '3d-print', title: 'الطباعة ثلاثية الأبعاد (3D Printing)', category: 'خدمات الطباعة', icon: Md3dRotation, color: 'from-orange-600 to-red-600', href: '/dashboard/services/3d-print', count: 'PLA, PETG, Resin' },

  // ── خدمات أخرى ──
  { id: 'voiceover', title: 'التعليق الصوتي (Voice Over)', category: 'خدمات أخرى', icon: MdMic, color: 'from-red-500 to-pink-600', href: '/dashboard/services/voiceover', count: 'لهجات + عينات' },
  { id: 'content-writing', title: 'كتابة المحتوى (Content Writing)', category: 'خدمات أخرى', icon: MdEditDocument, color: 'from-pink-600 to-rose-600', href: '/dashboard/services/content-writing', count: 'كتّاب + كلمات' },
];

export default function ServicesPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ar';

  const categories = ['الكل', 'الخدمات التقنية', 'خدمات التصميم', 'خدمات الطباعة', 'خدمات أخرى'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FaServer className="text-venecos-gold text-3xl" />
          إدارة الخدمات الفردية (Services Hub)
        </h1>
        <p className="text-white/60 text-xs md:text-sm mt-1">
          لكل خدمة صفحة خاصة واستمارة إعدادات مستقلة 1:1 مطابقة للنسخة المعتمدة
        </p>
      </div>

      {/* Categories Grid */}
      {categories.filter(c => c !== 'الكل').map((cat) => (
        <div key={cat} className="space-y-4">
          <h2 className="text-lg font-bold text-venecos-gold border-r-4 border-venecos-gold pr-3 flex items-center justify-between">
            <span>{cat}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_PAGES.filter(s => s.category === cat).map((srv) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={srv.id}
                  href={`/${locale}${srv.href}`}
                  className="bg-venecos-black/70 hover:bg-venecos-black border border-white/10 hover:border-venecos-gold/50 rounded-2xl p-5 shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${srv.color} flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition-all`}>
                        <Icon />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                        {srv.count}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-venecos-gold transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-white/50 mt-1">
                        صفحة مستقلة وحقول نموذج مخصصة 100%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-venecos-gold font-bold">
                    <span>فتح صفحة الخدمة</span>
                    <MdArrowForward className="text-lg group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
