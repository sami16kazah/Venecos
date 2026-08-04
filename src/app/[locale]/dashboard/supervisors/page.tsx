'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MdSupervisorAccount, MdCheckCircle, MdShield, MdEdit, MdBlock } from 'react-icons/md';

interface ISupervisor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  activeOrdersCount: number;
  activeProjectsCount: number;
}

const dbSupervisorsUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة المشرفين',
    en: 'Supervisors Panel',
    fr: 'Gestion des Supervisers',
    de: 'Supervisoren-Verwaltung',
  },
  pageSubtitle: {
    ar: 'عرض بيانات المشرفين ونشاطهم الكامل والمشاريع المسندة تحت إشرافهم',
    en: 'Manage supervisor profiles, active assignments, and team workload',
    fr: 'Gérer les profils des superviseurs et les projets assignés',
    de: 'Supervisorenprofile, aktive Zuweisungen und Arbeitsbelastung verwalten',
  },
  loading: {
    ar: 'جاري التحميل...',
    en: 'Loading supervisors...',
    fr: 'Chargement des superviseurs...',
    de: 'Supervisoren werden geladen...',
  },
  emptySupervisors: {
    ar: 'لا يوجد مشرفون محددون بعد',
    en: 'No supervisors assigned yet',
    fr: 'Aucun superviseur assigné pour le moment',
    de: 'Noch keine Supervisoren zugewiesen',
  },
  tableSupervisor: {
    ar: 'المشرف',
    en: 'Supervisor',
    fr: 'Superviseur',
    de: 'Supervisor',
  },
  tableEmail: {
    ar: 'البريد الإلكتروني',
    en: 'Email Address',
    fr: 'Adresse Email',
    de: 'E-Mail-Adresse',
  },
  tableActiveOrders: {
    ar: 'الطلبات النشطة',
    en: 'Active Orders',
    fr: 'Commandes Actives',
    de: 'Aktive Bestellungen',
  },
  tableProjectsUnderSupervision: {
    ar: 'المشاريع تحت الإشراف',
    en: 'Projects Supervised',
    fr: 'Projets Supervisés',
    de: 'Betreute Projekte',
  },
  tableStatus: {
    ar: 'الحالة',
    en: 'Status',
    fr: 'Statut',
    de: 'Status',
  },
  availableStatus: {
    ar: '● متاح',
    en: '● Available',
    fr: '● Disponible',
    de: '● Verfügbar',
  },
  generalAdminName: {
    ar: 'المدير العام',
    en: 'General Admin',
    fr: 'Administrateur Général',
    de: 'General-Administrator',
  },
};

export default function SupervisorsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbSupervisorsUi[key]?.[locale] || dbSupervisorsUi[key]?.['en'] || '';

  const [supervisors, setSupervisors] = useState<ISupervisor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/supervisors');
      if (res.ok) {
        const data = await res.json();
        setSupervisors(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdSupervisorAccount className="text-venecos-gold text-3xl" />
            {tUi('pageTitle')}
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            {tUi('pageSubtitle')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">{tUi('loading')}</div>
      ) : supervisors.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdSupervisorAccount className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">{tUi('emptySupervisors')}</p>
        </div>
      ) : (
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right text-sm text-white/80" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">{tUi('tableSupervisor')}</th>
                <th className="p-4">{tUi('tableEmail')}</th>
                <th className="p-4">{tUi('tableActiveOrders')}</th>
                <th className="p-4">{tUi('tableProjectsUnderSupervision')}</th>
                <th className="p-4 text-center">{tUi('tableStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {supervisors.map((sup) => {
                const isGeneralAdmin = sup.firstName === 'المدير' || sup.lastName === 'العام' || (sup.firstName + ' ' + sup.lastName).includes('المدير');
                const displayName = locale !== 'ar' && isGeneralAdmin ? tUi('generalAdminName') : `${sup.firstName} ${sup.lastName}`;

                return (
                  <tr key={sup._id} className="hover:bg-white/5 transition-all">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-venecos-gold/20 text-venecos-gold font-bold text-xs flex items-center justify-center border border-venecos-gold/40">
                        {sup.firstName[0]}
                        {sup.lastName[0]}
                      </span>
                      {displayName}
                    </td>
                    <td className="p-4 text-white/70">{sup.email}</td>
                    <td className="p-4 font-mono font-bold text-venecos-gold">{sup.activeOrdersCount}</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">{sup.activeProjectsCount}</td>
                    <td className="p-4 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
                        {tUi('availableStatus')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
