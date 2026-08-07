'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { FaServer } from 'react-icons/fa';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';
import { combineMultiLangSubServices } from '@/lib/i18nUtils';

const dbHostingUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة Shared Hosting (الاستضافة المشتركة)',
    en: 'Shared Hosting Management',
    fr: 'Gestion de l\'Hébergement Partagé',
    de: 'Shared Hosting Verwaltung',
  },
  pageSubtitle: {
    ar: 'إدارة خطط الاستضافة ومواصفات السيرفرات والأمان بالأربع لغات',
    en: 'Manage hosting plans, server specs and security features in 4 languages',
    fr: 'Gérer les forfaits d\'hébergement et spécifications serveur en 4 langues',
    de: 'Verwalten Sie Hosting-Pakete und Server-Spezifikationen in 4 Sprachen',
  },
  backToServices: {
    ar: 'الرجوع للخدمات',
    en: 'Back to Services',
    fr: 'Retour aux Services',
    de: 'Zurück zu den Diensten',
  },
  savedSuccess: {
    ar: 'تم حفظ خدمات الاستضافة بنجاح',
    en: 'Hosting packages saved successfully',
    fr: 'Forfaits d\'hébergement enregistrés avec succès',
    de: 'Hosting-Pakete erfolgreich gespeichert',
  },
};

export default function SharedHostingServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbHostingUi[key]?.[locale] || dbHostingUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=shared-hosting');
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
          serviceKey: 'shared-hosting',
          titles: {
            ar: 'الاستضافة المشتركة (Shared Hosting)',
            en: 'Shared Web Hosting',
            fr: 'Hébergement mutualisé',
            de: 'Shared Hosting',
          },
          descriptions: {
            ar: 'خطط استضافة فائقة السرعة مع لوحة cPanel وتراخيص SSL وذاكرة NVMe',
            en: 'High speed cPanel NVMe web hosting plans',
            fr: 'Hébergement web cPanel ultra rapide',
            de: 'Schnelles cPanel NVMe Webhosting',
          },
          iconName: 'FaServer',
          iconType: 'react-icon',
          order: 1,
          isSpecial: true,
          subServices: newPackages
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <FaServer />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{tUi('pageTitle')}</h1>
            <p className="text-xs text-white/60 mt-0.5">{tUi('pageSubtitle')}</p>
          </div>
        </div>
        <Link href={`/${locale}/dashboard/services`} className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
          <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backToServices')}
        </Link>
      </div>

      {/* Packages & Plans Manager */}
      <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
        <DashboardPackageManager
          serviceKey="shared-hosting"
          packages={packages}
          onChange={setPackages}
          onSave={savePackagesToDb}
        />
      </div>

      {/* Sticky Success Bar */}
      {saved && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <MdCheckCircle className="text-base" /> {tUi('savedSuccess')}
        </div>
      )}
    </div>
  );
}
