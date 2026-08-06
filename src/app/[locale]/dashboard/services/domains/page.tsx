'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdLanguage, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';

// ... dbDomainsUi ...

const dbDomainsUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إضافة لاحقة نطاق',
    en: 'Add Domain Extension',
    fr: 'Ajouter une Extension de Domaine',
    de: 'Domain-Endung hinzufügen',
  },
  backBtn: {
    ar: 'رجوع',
    en: 'Back',
    fr: 'Retour',
    de: 'Zurück',
  },
  saveBtn: {
    ar: '✓ حفظ اللاحقة',
    en: '✓ Save Extension',
    fr: '✓ Enregistrer l\'extension',
    de: '✓ Endung speichern',
  },
  specificationsTitle: {
    ar: '🌐 بيانات اللاحقة والنطاقات',
    en: '🌐 Domain Extension Specifications',
    fr: '🌐 Spécifications de l\'extension',
    de: '🌐 Spezifikationen der Endung',
  },
  extensionLabel: {
    ar: 'اللاحقة *',
    en: 'Extension *',
    fr: 'Extension *',
    de: 'Endung *',
  },
  extensionPlaceholder: {
    ar: 'مثال: .com .net .store .shop',
    en: 'e.g. .com .net .store .shop',
    fr: 'ex. .com .net .store .shop',
    de: 'z.B. .com .net .store .shop',
  },
  regPriceLabel: {
    ar: 'سعر التسجيل (€/سنة) *',
    en: 'Registration Price (€/yr) *',
    fr: 'Prix d\'enregistrement (€/an) *',
    de: 'Registrierungspreis (€/Jahr) *',
  },
  renPriceLabel: {
    ar: 'سعر التجديد (€/سنة) *',
    en: 'Renewal Price (€/yr) *',
    fr: 'Prix de renouvellement (€/an) *',
    de: 'Verlängerungspreis (€/Jahr) *',
  },
  cancelBtn: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  savedSuccess: {
    ar: 'تم إضافة لاحقة النطاق بنجاح',
    en: 'Domain extension added successfully',
    fr: 'Extension de domaine ajoutée avec succès',
    de: 'Domain-Endung erfolgreich hinzugefügt',
  },
};

export default function DomainServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbDomainsUi[key]?.[locale] || dbDomainsUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);
  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=domains');
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items) && items.length > 0) {
            const arDoc = items.find((i: any) => i.locale === 'ar');
            if (arDoc && arDoc.subServices) {
              setPackages(arDoc.subServices);
            }
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
          serviceKey: 'domains',
          titles: {
            ar: 'حجز وتسجيل النطاقات (Domains)',
            en: 'Domain Names Registration',
            fr: 'Enregistrement de noms de domaine',
            de: 'Domain-Registrierung',
          },
          descriptions: {
            ar: 'حجز أسماء النطاقات وتجديدها بأفضل الأسعار',
            en: 'Register and renew your domain names with full DNS control',
            fr: 'Enregistrez vos noms de domaine avec contrôle DNS complet',
            de: 'Registrieren Sie Ihre Domains mit vollständiger DNS-Kontrolle',
          },
          iconName: 'FaGlobe',
          iconType: 'react-icon',
          order: 12,
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

  const [formData, setFormData] = useState({
    extension: '.com',
    regPrice: 12.99,
    renPrice: 14.99,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: 'domains',
          locale,
          title: locale === 'ar' ? 'حجز وإدارة الدومينات (Domain Names)' : 'Domain Name Registration & Transfer',
          description: locale === 'ar' ? 'حجز وإدارة أسماء النطاقات بجميع اللواحق العالمية والمحلية' : 'Register and manage your custom domain names',
          iconName: 'FaGlobe',
          iconType: 'react-icon',
          order: 12,
          isSpecial: true,
          subServices: [
            {
              title: `Domain Registration (${formData.extension})`,
              description: `Renewal: €${formData.renPrice}/yr`,
              price: formData.regPrice || 12.99
            }
          ]
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MdLanguage className="text-venecos-gold text-3xl" />
          {tUi('pageTitle')}
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/dashboard/services`} className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backBtn')}
          </Link>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            {tUi('saveBtn')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Domain Extension Specs */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            {tUi('specificationsTitle')}
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('extensionLabel')}</label>
            <input
              type="text"
              required
              value={formData.extension}
              onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
              placeholder={tUi('extensionPlaceholder')}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-venecos-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('regPriceLabel')}</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.regPrice}
              onChange={(e) => setFormData({ ...formData, regPrice: Number(e.target.value) })}
              className="w-full bg-black/40 border border-venecos-gold/40 text-venecos-gold font-bold text-center text-base rounded-xl px-4 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('renPriceLabel')}</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.renPrice}
              onChange={(e) => setFormData({ ...formData, renPrice: Number(e.target.value) })}
              className="w-full bg-black/40 border border-white/15 text-blue-400 font-bold text-center text-base rounded-xl px-4 py-2.5 outline-none"
            />
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="domains"
            packages={packages}
            onChange={setPackages}
            onSave={savePackagesToDb}
          />
        </div>

        {/* Sticky Bottom Bar */}
        <div className="sticky bottom-0 bg-venecos-black/95 border-t border-white/10 p-4 flex items-center justify-between rounded-t-2xl shadow-2xl backdrop-blur-md">
          <div>{saved && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><MdCheckCircle /> {tUi('savedSuccess')}</span>}</div>
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/dashboard/services`} className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10">
              {tUi('cancelBtn')}
            </Link>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90">
              {tUi('saveBtn')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
