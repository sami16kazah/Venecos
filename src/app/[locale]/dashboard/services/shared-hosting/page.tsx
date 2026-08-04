'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack, MdAdd, MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md';
import { FaServer } from 'react-icons/fa';

interface IHostingPlan {
  id: number;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  storage: string;
  sites: string;
  emails: string;
  databases: string;
  bandwidth: string;
  panel: string;
  backup: string;
  ssl: boolean;
  ddos: boolean;
  server: string;
  featured: boolean;
  status: string;
}

const dbHostingUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة Shared Hosting (الاستضافة المشتركة)',
    en: 'Shared Hosting Management',
    fr: 'Gestion de l\'Hébergement Partagé',
    de: 'Shared Hosting Verwaltung',
  },
  pageSubtitle: {
    ar: 'إدارة خطط الاستضافة ومواصفات السيرفرات والأمان 1:1',
    en: 'Manage hosting plans, server specs and security features',
    fr: 'Gérer les forfaits d\'hébergement et spécifications serveur',
    de: 'Verwalten Sie Hosting-Pakete und Server-Spezifikationen',
  },
  addHostingPlan: {
    ar: 'إضافة خطة استضافة',
    en: 'Add Hosting Plan',
    fr: 'Ajouter un forfait',
    de: 'Hosting-Paket hinzufügen',
  },
  backToServices: {
    ar: 'الرجوع للخدمات',
    en: 'Back to Services',
    fr: 'Retour aux Services',
    de: 'Zurück zu den Diensten',
  },
  featuredBadge: {
    ar: '⭐ مميزة',
    en: '⭐ Featured',
    fr: '⭐ En Vedette',
    de: '⭐ Empfohlen',
  },
  publishedStatus: {
    ar: 'منشورة',
    en: 'Published',
    fr: 'Publié',
    de: 'Veröffentlicht',
  },
  draftStatus: {
    ar: 'مسودة',
    en: 'Draft',
    fr: 'Brouillon',
    de: 'Entwurf',
  },
  perMonth: {
    ar: '/شهر',
    en: '/month',
    fr: '/mois',
    de: '/Monat',
  },
  orPerYear: {
    ar: 'أو €',
    en: 'or €',
    fr: 'ou €',
    de: 'oder €',
  },
  perYearSuffix: {
    ar: '/سنة',
    en: '/year',
    fr: '/an',
    de: '/Jahr',
  },
  storage: {
    ar: 'التخزين:',
    en: 'Storage:',
    fr: 'Stockage:',
    de: 'Speicher:',
  },
  sites: {
    ar: 'المواقع:',
    en: 'Websites:',
    fr: 'Sites web:',
    de: 'Webseiten:',
  },
  emails: {
    ar: 'الإيميلات:',
    en: 'Emails:',
    fr: 'E-mails:',
    de: 'E-Mails:',
  },
  databases: {
    ar: 'قواعد البيانات:',
    en: 'Databases:',
    fr: 'Bases de données:',
    de: 'Datenbanken:',
  },
  controlPanel: {
    ar: 'لوحة التحكم:',
    en: 'Control Panel:',
    fr: 'Panneau de contrôle:',
    de: 'Control Panel:',
  },
  serverLocation: {
    ar: 'السيرفر:',
    en: 'Server:',
    fr: 'Serveur:',
    de: 'Server:',
  },
  editBtn: {
    ar: 'تعديل',
    en: 'Edit',
    fr: 'Modifier',
    de: 'Bearbeiten',
  },
  deleteConfirm: {
    ar: 'هل أنت تأكد من حذف هذه الخطة؟',
    en: 'Are you sure you want to delete this plan?',
    fr: 'Êtes-vous sûr de vouloir supprimer ce forfait ?',
    de: 'Sind Sie sicher, dass Sie dieses Paket löschen möchten?',
  },
  modalTitleAdd: {
    ar: 'إضافة خطة استضافة جديد',
    en: 'Add New Hosting Plan',
    fr: 'Ajouter un nouveau forfait d\'hébergement',
    de: 'Neues Hosting-Paket hinzufügen',
  },
  modalTitleEdit: {
    ar: 'تعديل خطة الاستضافة',
    en: 'Edit Hosting Plan',
    fr: 'Modifier le forfait d\'hébergement',
    de: 'Hosting-Paket bearbeiten',
  },
  planNameLabel: {
    ar: 'اسم الخطة',
    en: 'Plan Name',
    fr: 'Nom du forfait',
    de: 'Paketname',
  },
  monthlyPriceLabel: {
    ar: 'السعر الشهري (€)',
    en: 'Monthly Price (€)',
    fr: 'Prix mensuel (€)',
    de: 'Monatlicher Preis (€)',
  },
  storageLabel: {
    ar: 'سعة التخزين',
    en: 'Storage Capacity',
    fr: 'Capacité de stockage',
    de: 'Speicherplatz',
  },
  sitesLabel: {
    ar: 'عدد المواقع',
    en: 'Number of Sites',
    fr: 'Nombre de sites',
    de: 'Anzahl der Webseiten',
  },
  cancelBtn: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  savePlanBtn: {
    ar: 'حفظ الخطة',
    en: 'Save Plan',
    fr: 'Enregistrer le forfait',
    de: 'Paket speichern',
  },
};

export default function SharedHostingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbHostingUi[key]?.[locale] || dbHostingUi[key]?.['en'] || '';

  const [plans, setPlans] = useState<IHostingPlan[]>([
    { id: 1, name: 'Starter', priceMonthly: 4.99, priceYearly: 49, storage: '10 GB SSD', sites: '1', emails: '5', databases: '1', bandwidth: '100 GB', panel: 'cPanel', backup: 'أسبوعي', ssl: true, ddos: true, server: 'Germany', featured: false, status: 'منشورة' },
    { id: 2, name: 'Business', priceMonthly: 9.99, priceYearly: 99, storage: '50 GB NVMe SSD', sites: '5', emails: '20', databases: '10', bandwidth: '500 GB', panel: 'cPanel', backup: 'يومي', ssl: true, ddos: true, server: 'Germany', featured: true, status: 'منشورة' },
    { id: 3, name: 'Pro', priceMonthly: 19.99, priceYearly: 199, storage: '150 GB NVMe SSD', sites: '20', emails: '100', databases: '50', bandwidth: 'Unlimited', panel: 'cPanel', backup: 'يومي', ssl: true, ddos: true, server: 'Germany', featured: false, status: 'منشورة' },
    { id: 4, name: 'Ultimate', priceMonthly: 39.99, priceYearly: 399, storage: '500 GB NVMe SSD', sites: 'Unlimited', emails: 'Unlimited', databases: 'Unlimited', bandwidth: 'Unlimited', panel: 'cPanel', backup: 'يومي', ssl: true, ddos: true, server: 'Germany', featured: false, status: 'مسودة' },
  ]);

  const [editingPlan, setEditingPlan] = useState<IHostingPlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (plan?: IHostingPlan) => {
    if (plan) setEditingPlan(plan);
    else setEditingPlan({
      id: Date.now(),
      name: '',
      priceMonthly: 9.99,
      priceYearly: 99,
      storage: '50 GB SSD',
      sites: '5',
      emails: '10',
      databases: '5',
      bandwidth: '500 GB',
      panel: 'cPanel',
      backup: 'Daily',
      ssl: true,
      ddos: true,
      server: 'Germany',
      featured: false,
      status: 'منشورة'
    });
    setModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    const exists = plans.some(p => p.id === editingPlan.id);
    const updatedPlans = exists ? plans.map(p => p.id === editingPlan.id ? editingPlan : p) : [...plans, editingPlan];
    setPlans(updatedPlans);
    setModalOpen(false);

    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: 'shared-hosting',
          locale,
          title: locale === 'ar' ? 'الاستضافة المشتركة (Shared Hosting)' : locale === 'fr' ? 'Hébergement mutualisé' : locale === 'de' ? 'Shared Hosting' : 'Shared Web Hosting',
          description: locale === 'ar' ? 'خطط استضافة فائقة السرعة مع لوحة cPanel وتراخيص SSL وذاكرة NVMe' : 'High speed cPanel NVMe web hosting plans',
          iconName: 'FaServer',
          iconType: 'react-icon',
          order: 1,
          isSpecial: true,
          subServices: updatedPlans.map(p => ({
            title: p.name,
            description: `${p.storage} NVMe / ${p.sites} Sites / ${p.bandwidth} Bandwidth`,
            price: p.priceYearly || p.priceMonthly
          }))
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(tUi('deleteConfirm'))) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
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
        <div className="flex gap-2">
          <button onClick={() => handleOpenModal()} className="flex items-center gap-1.5 text-xs bg-venecos-gold text-black px-4 py-2 rounded-xl font-bold hover:opacity-90">
            <MdAdd /> {tUi('addHostingPlan')}
          </button>
          <Link href={`/${locale}/dashboard/services`} className="flex items-center gap-1.5 text-xs text-venecos-gold border border-venecos-gold/30 px-4 py-2 rounded-xl hover:bg-venecos-gold/10 font-bold">
            <MdArrowBack className={isRtl ? '' : 'rotate-180'} /> {tUi('backToServices')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <div key={p.id} className={`bg-venecos-black/80 border ${p.featured ? 'border-venecos-gold shadow-gold-glow' : 'border-white/10'} rounded-2xl p-5 relative flex flex-col justify-between`}>
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-venecos-gold text-black text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow">
                {tUi('featuredBadge')}
              </span>
            )}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'منشورة' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/50'}`}>
                  {p.status === 'منشورة' ? tUi('publishedStatus') : tUi('draftStatus')}
                </span>
              </div>
              <div className="text-2xl font-black text-venecos-gold">
                €{p.priceMonthly}<span className="text-xs text-white/50 font-normal">{tUi('perMonth')}</span>
              </div>
              <div className="text-xs text-white/40">{tUi('orPerYear')}{p.priceYearly}{tUi('perYearSuffix')}</div>

              <div className="space-y-2 pt-2 text-xs border-t border-white/10">
                <div className="flex justify-between"><span className="text-white/60">{tUi('storage')}</span><span className="font-bold text-white">{p.storage}</span></div>
                <div className="flex justify-between"><span className="text-white/60">{tUi('sites')}</span><span className="font-bold text-white">{p.sites}</span></div>
                <div className="flex justify-between"><span className="text-white/60">{tUi('emails')}</span><span className="font-bold text-white">{p.emails}</span></div>
                <div className="flex justify-between"><span className="text-white/60">{tUi('databases')}</span><span className="font-bold text-white">{p.databases}</span></div>
                <div className="flex justify-between"><span className="text-white/60">{tUi('controlPanel')}</span><span className="font-bold text-white">{p.panel}</span></div>
                <div className="flex justify-between"><span className="text-white/60">{tUi('serverLocation')}</span><span className="font-bold text-white">{p.server}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/10 mt-4">
              <button onClick={() => handleOpenModal(p)} className="p-2 rounded-xl bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold transition-all text-xs font-bold flex-1 flex items-center justify-center gap-1">
                <MdEdit /> {tUi('editBtn')}
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-xs">
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">
              {editingPlan.id ? tUi('modalTitleEdit') : tUi('modalTitleAdd')}
            </h3>
            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">{tUi('planNameLabel')}</label>
                  <input type="text" required value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:border-venecos-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">{tUi('monthlyPriceLabel')}</label>
                  <input type="number" step="0.01" value={editingPlan.priceMonthly} onChange={(e) => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:border-venecos-gold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">{tUi('storageLabel')}</label>
                  <input type="text" value={editingPlan.storage} onChange={(e) => setEditingPlan({ ...editingPlan, storage: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:border-venecos-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">{tUi('sitesLabel')}</label>
                  <input type="text" value={editingPlan.sites} onChange={(e) => setEditingPlan({ ...editingPlan, sites: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:border-venecos-gold outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold">{tUi('cancelBtn')}</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-venecos-gold to-yellow-500 text-black text-xs font-bold">{tUi('savePlanBtn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
