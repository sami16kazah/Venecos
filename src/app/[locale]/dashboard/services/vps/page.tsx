'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdDns, MdArrowBack, MdCheckCircle, MdSave } from 'react-icons/md';
import DashboardPackageManager from '@/components/DashboardPackageManager';
import { ISubService } from '@/models/ServiceContent';
import { combineMultiLangSubServices } from '@/lib/i18nUtils';

const dbVpsUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إضافة / إدارة باقة VPS',
    en: 'Add / Manage VPS Package',
    fr: 'Ajouter / Gérer Forfait VPS',
    de: 'VPS-Paket hinzufügen / verwalten',
  },
  backBtn: {
    ar: 'رجوع',
    en: 'Back',
    fr: 'Retour',
    de: 'Zurück',
  },
  savePackageBtn: {
    ar: '✓ حفظ الباقة',
    en: '✓ Save Package',
    fr: '✓ Enregistrer le forfait',
    de: '✓ Paket speichern',
  },
  specificationsTitle: {
    ar: '⚙️ مواصفات الباقة',
    en: '⚙️ Package Specifications',
    fr: '⚙️ Spécifications du forfait',
    de: '⚙️ Paketspezifikationen',
  },
  packageNameLabel: {
    ar: 'اسم الباقة *',
    en: 'Package Name *',
    fr: 'Nom du forfait *',
    de: 'Paketname *',
  },
  packageNamePlaceholder: {
    ar: 'مثال: VPS-1, VPS-2 Pro...',
    en: 'e.g. VPS-1, VPS-2 Pro...',
    fr: 'ex. VPS-1, VPS-2 Pro...',
    de: 'z.B. VPS-1, VPS-2 Pro...',
  },
  monthlyPriceLabel: {
    ar: 'السعر الشهري (€) *',
    en: 'Monthly Price (€) *',
    fr: 'Prix mensuel (€) *',
    de: 'Monatlicher Preis (€) *',
  },
  vcpuLabel: {
    ar: 'عدد المعالجات (vCPU)',
    en: 'Processors (vCPU)',
    fr: 'Processeurs (vCPU)',
    de: 'Prozessoren (vCPU)',
  },
  ramLabel: {
    ar: 'الذاكرة (GB) RAM',
    en: 'RAM Memory (GB)',
    fr: 'Mémoire RAM (GB)',
    de: 'Arbeitsspeicher (GB)',
  },
  storageLabel: {
    ar: 'التخزين (GB) NVMe',
    en: 'Storage (GB) NVMe',
    fr: 'Stockage (GB) NVMe',
    de: 'Speicher (GB) NVMe',
  },
  bandwidthLabel: {
    ar: 'الباندويث (TB)',
    en: 'Bandwidth (TB)',
    fr: 'Bande passante (TB)',
    de: 'Bandbreite (TB)',
  },
  locationLabel: {
    ar: 'موقع السيرفر',
    en: 'Server Location',
    fr: 'Emplacement du serveur',
    de: 'Serverstandort',
  },
  locGermany: {
    ar: 'ألمانيا (Frankfurt 🇩🇪)',
    en: 'Germany (Frankfurt 🇩🇪)',
    fr: 'Allemagne (Francfort 🇩🇪)',
    de: 'Deutschland (Frankfurt 🇩🇪)',
  },
  locFrance: {
    ar: 'فرنسا (Paris 🇫🇷)',
    en: 'France (Paris 🇫🇷)',
    fr: 'France (Paris 🇫🇷)',
    de: 'Frankreich (Paris 🇫🇷)',
  },
  locFinland: {
    ar: 'فنلندا (Helsinki 🇫🇮)',
    en: 'Finland (Helsinki 🇫🇮)',
    fr: 'Finlande (Helsinki 🇫🇮)',
    de: 'Finnland (Helsinki 🇫🇮)',
  },
  osListLabel: {
    ar: 'أنظمة التشغيل المتاحة',
    en: 'Available Operating Systems',
    fr: 'Systèmes d\'exploitation disponibles',
    de: 'Verfügbare Betriebssysteme',
  },
  controlPanelLabel: {
    ar: 'لوحة التحكم (كإضافة مدفوعة)',
    en: 'Control Panel (Add-on)',
    fr: 'Panneau de contrôle (Option)',
    de: 'Control Panel (Zusatzoption)',
  },
  cancelBtn: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  savedSuccess: {
    ar: 'تم حفظ باقة VPS بنجاح',
    en: 'VPS Package saved successfully',
    fr: 'Forfait VPS enregistré avec succès',
    de: 'VPS-Paket erfolgreich gespeichert',
  },
};

export default function VpsServicePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbVpsUi[key]?.[locale] || dbVpsUi[key]?.['en'] || '';

  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    packageName: 'VPS-2 Pro',
    monthlyPrice: 29.99,
    vcpu: 2,
    ram: 4,
    storage: 80,
    bandwidth: 1,
    location: 'Germany 🇩🇪',
    osList: 'Ubuntu 22.04 LTS, Debian 12, CentOS Stream 9, AlmaLinux 9',
    controlPanel: 'cPanel (€15/mo), Plesk (€12/mo), CyberPanel (Free)',
  });

  const [packages, setPackages] = useState<ISubService[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/services?serviceKey=vps');
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
          serviceKey: 'vps',
          titles: {
            ar: 'السيرفرات السحابية (VPS)',
            en: 'Cloud VPS Servers',
            fr: 'Serveurs VPS Cloud',
            de: 'Cloud VPS-Server',
          },
          descriptions: {
            ar: 'سيرفرات سحابية عالية الأداء في ألمانيا وفرنسا مع حماية DDoS كاملة',
            en: 'High performance cloud VPS servers with DDoS protection',
            fr: 'Serveurs VPS cloud haute performance avec protection DDoS',
            de: 'Leistungsstarke VPS-Server mit DDoS-Schutz',
          },
          iconName: 'FaCloud',
          iconType: 'react-icon',
          order: 2,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePackagesToDb(packages);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MdDns className="text-venecos-gold text-3xl" />
          {tUi('pageTitle')}
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/dashboard/services`} className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 flex items-center gap-1">
            <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backBtn')}
          </Link>
          <button type="button" onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:opacity-90">
            {tUi('savePackageBtn')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Package Specifications */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-venecos-gold border-b border-white/10 pb-3 flex items-center gap-2">
            {tUi('specificationsTitle')}
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('packageNameLabel')}</label>
            <input
              type="text"
              required
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              placeholder={tUi('packageNamePlaceholder')}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('monthlyPriceLabel')}</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.monthlyPrice}
              onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
              className="w-full bg-black/40 border border-venecos-gold/40 text-venecos-gold font-bold text-center text-base rounded-xl px-4 py-2.5 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('vcpuLabel')}</label>
              <input
                type="number"
                value={formData.vcpu}
                onChange={(e) => setFormData({ ...formData, vcpu: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('ramLabel')}</label>
              <input
                type="number"
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('storageLabel')}</label>
              <input
                type="number"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('bandwidthLabel')}</label>
              <input
                type="number"
                value={formData.bandwidth}
                onChange={(e) => setFormData({ ...formData, bandwidth: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-center text-white text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('locationLabel')}</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-venecos-black border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-venecos-gold outline-none"
            >
              <option value="Germany 🇩🇪">{tUi('locGermany')}</option>
              <option value="France 🇫🇷">{tUi('locFrance')}</option>
              <option value="Finland 🇫🇮">{tUi('locFinland')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('osListLabel')}</label>
            <input
              type="text"
              value={formData.osList}
              onChange={(e) => setFormData({ ...formData, osList: e.target.value })}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs focus:border-venecos-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">{tUi('controlPanelLabel')}</label>
            <input
              type="text"
              value={formData.controlPanel}
              onChange={(e) => setFormData({ ...formData, controlPanel: e.target.value })}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs focus:border-venecos-gold outline-none"
            />
          </div>
        </div>

        {/* Packages & Plans Manager */}
        <div className="bg-venecos-black/80 border border-white/10 rounded-2xl p-6 shadow-xl">
          <DashboardPackageManager
            serviceKey="vps"
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
              {tUi('savePackageBtn')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
