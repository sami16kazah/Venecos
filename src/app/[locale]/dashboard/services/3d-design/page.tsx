'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdViewInAr, MdArrowBack, MdSave, MdCheckCircle } from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';
import { combineMultiLangSubServices } from '@/lib/i18nUtils';

const db3dUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة خدمة التصميم ثلاثي الأبعاد (3D Design)',
    en: '3D Design & Rendering Management',
    fr: 'Gestion Modélisation et Rendu 3D',
    de: '3D-Design & Rendering Verwaltung',
  },
  pageSubtitle: {
    ar: 'مجسمات، رندر زوايا، وعرض تفاعلي عبر Sketchfab 1:1',
    en: 'Interactive 3D models, angle renders and Sketchfab viewer embed',
    fr: 'Modèles 3D interactifs et affichage Sketchfab',
    de: 'Interaktive 3D-Modelle und Sketchfab Viewer-Einbindung',
  },
  backBtn: {
    ar: 'الرجوع للخدمات',
    en: 'Back to Services',
    fr: 'Retour aux Services',
    de: 'Zurück zu den Diensten',
  },
  savedSuccess: {
    ar: 'تم الحفظ بنجاح',
    en: 'Saved successfully',
    fr: 'Enregistré avec succès',
    de: 'Erfolgreich gespeichert',
  },
};

export default function ThreeDDesignServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => db3dUi[key]?.[locale] || db3dUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');
  const [formData, setFormData] = useState({
    title: {
      ar: 'التصميم والرندر ثلاثي الأبعاد (3D Design)',
      en: '3D Design & Rendering',
      fr: 'Modélisation et rendu 3D',
      de: '3D-Design & Rendering',
    },
    shortDesc: {
      ar: 'تصوير ورندر مجسمات ومنتجات 3D عالية الدقة',
      en: 'High resolution 3D modeling and product rendering',
      fr: 'Modélisation 3D et rendu de produits haute résolution',
      de: 'Hochauflösende 3D-Modellierung und Produkt-Rendering',
    },
    fullContent: {
      ar: 'تصميم مجسمات 3D تفاعلية، إخراج ورندر إعلاني، وتضمين نماذج Sketchfab.',
      en: 'Interactive 3D model creation, photorealistic rendering & Sketchfab integration.',
      fr: 'Création de modèles 3D interactifs, rendu photoréaliste et intégration Sketchfab.',
      de: 'Erstellung interaktiver 3D-Modelle, fotorealistisches Rendering & Sketchfab-Einbindung.',
    },
    priceFrom: 250,
    priceTo: 1200,
    daysFrom: 4,
    daysTo: 10,
    sketchfabEmbed: 'https://sketchfab.com/models/baed39352e804fca920b13ba8110fb27/embed',
    coverImage: '',
  });

  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=3d-design');
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items) && items.length > 0) {
            setPackages(combineMultiLangSubServices(items));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const savePackagesToDb = async (newPackages: ISubService[]) => {
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: '3d-design',
          titles: formData.title,
          descriptions: formData.shortDesc,
          iconName: 'FaCube',
          iconType: 'react-icon',
          order: 4,
          isSpecial: false,
          subServices: newPackages
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePackagesToDb(packages);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <MdViewInAr />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{tUi('pageTitle')}</h1>
            <p className="text-xs text-white/60 mt-0.5">{tUi('pageSubtitle')}</p>
          </div>
        </div>
        <Link href={`/${locale}/dashboard/services`} className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backBtn')}
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cover Upload */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('coverUploadTitle')}</h3>
          <CloudinaryUploader
            label={tUi('dropCoverLabel')}
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Sketchfab Link */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('sketchfabTitle')}</h3>
          <input
            type="text"
            value={formData.sketchfabEmbed}
            onChange={(e) => setFormData({ ...formData, sketchfabEmbed: e.target.value })}
            placeholder="https://sketchfab.com/models/.../embed"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none font-mono text-xs"
          />
        </div>

        {/* Pricing & Timeframe */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-venecos-gold">{tUi('pricingTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('priceFrom')}</label>
              <input
                type="number"
                value={formData.priceFrom}
                onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('priceTo')}</label>
              <input
                type="number"
                value={formData.priceTo}
                onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-venecos-gold font-bold text-center text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('daysFrom')}</label>
              <input
                type="number"
                value={formData.daysFrom}
                onChange={(e) => setFormData({ ...formData, daysFrom: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">{tUi('daysTo')}</label>
              <input
                type="number"
                value={formData.daysTo}
                onChange={(e) => setFormData({ ...formData, daysTo: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-blue-400 font-bold text-center text-sm"
              />
            </div>
          </div>
        </div>

        {/* 4 Languages Section */}
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-venecos-gold">{tUi('multiLangTitle')}</h3>
            <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {(['ar', 'en', 'fr', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    activeLangTab === lang
                      ? 'bg-venecos-gold text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? '🇸🇦 عربي' : lang === 'en' ? '🇬🇧 EN' : lang === 'fr' ? '🇫🇷 FR' : '🇩🇪 DE'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">
                {tUi('titleLabel')} ({activeLangTab.toUpperCase()}) *
              </label>
              <input
                type="text"
                required
                value={formData.title[activeLangTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, [activeLangTab]: e.target.value },
                  })
                }
                placeholder="3D Design & Rendering..."
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">
                {tUi('shortDescLabel')} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData.shortDesc[activeLangTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDesc: { ...formData.shortDesc, [activeLangTab]: e.target.value },
                  })
                }
                placeholder="Short description..."
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">
                {tUi('fullContentLabel')} ({activeLangTab.toUpperCase()})
              </label>
              <textarea
                rows={5}
                value={formData.fullContent[activeLangTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullContent: { ...formData.fullContent, [activeLangTab]: e.target.value },
                  })
                }
                placeholder="Full description..."
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="3d-design"
            packages={packages}
            onChange={setPackages}
            onSave={savePackagesToDb}
          />
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {tUi('savedSuccess')}</span>}</div>
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/dashboard/services`} className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              {tUi('cancelBtn')}
            </Link>
            <button type="button" onClick={handleSave} className="px-5 py-2.5 rounded-xl border border-venecos-gold/40 text-venecos-gold text-xs font-bold hover:bg-venecos-gold/10">
              {tUi('draftBtn')}
            </button>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              {tUi('publishBtn')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

