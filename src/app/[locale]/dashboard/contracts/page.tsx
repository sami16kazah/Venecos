'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MdDescription, MdAdd, MdEdit, MdDelete, MdCheckCircle, MdComment, MdSave } from 'react-icons/md';

interface IContract {
  _id?: string;
  serviceName: string;
  version: string;
  customClauses: { ar: string; en: string; fr: string; de: string };
  requireTypedName: boolean;
  autoChatSuspensionMessages: { ar: string; en: string; fr: string; de: string };
}

const dbContractsUi: Record<string, Record<string, string>> = {
  pageTitle: {
    ar: 'إدارة العقود والتوقيع الإلكتروني',
    en: 'Contracts & E-Sign Management',
    fr: 'Gestion des Contrats & Signature',
    de: 'Vertragsverwaltung & E-Signatur',
  },
  pageSubtitle: {
    ar: 'عقد مخصص لكل خدمة يوقّع عليه العميل إلكترونياً قبل بدء العمل',
    en: 'Service contracts signed electronically by clients before starting work',
    fr: 'Contrats de service signés électroniquement par les clients avant de commencer',
    de: 'Dienstleistungsverträge, die vom Kunden vor Arbeitsbeginn elektronisch unterzeichnet werden',
  },
  addNewContract: {
    ar: 'إضافة عقد خدمة',
    en: 'Add Service Contract',
    fr: 'Ajouter un contrat',
    de: 'Vertrag hinzufügen',
  },
  editContract: {
    ar: 'تعديل العقد',
    en: 'Edit Contract',
    fr: 'Modifier le contrat',
    de: 'Vertrag bearbeiten',
  },
  standardClausesTitle: {
    ar: 'البنود التلقائية الموحدة لكل العقود (مشتركة)',
    en: 'Standard Default Clauses (All Contracts)',
    fr: 'Clauses standard par défaut (Tous contrats)',
    de: 'Standard-Klauseln (Alle Verträge)',
  },
  rule1: {
    ar: 'لا تبدأ أي خدمة بدون دفعة مقدمة لا تقل عن 30% من قيمة الطلب.',
    en: 'No service begins without an advance deposit of at least 30% of order value.',
    fr: 'Aucun service ne commence sans un acompte d\'au moins 30% de la valeur.',
    de: 'Kein Dienst beginnt ohne eine Anzahlung von mindestens 30 % des Bestellwerts.',
  },
  rule2: {
    ar: 'لا يُسلَّم أي عمل بدون سداد المبلغ كاملاً.',
    en: 'No final project work is delivered without full payment completion.',
    fr: 'Aucun travail final n\'est livré sans paiement intégral.',
    de: 'Keine finale Arbeit wird ohne vollständige Zahlung geliefert.',
  },
  rule3: {
    ar: 'لا تبدأ أي مرحلة جديدة بدون سداد المرحلة السابقة.',
    en: 'Subsequent project phases do not start until previous phases are settled.',
    fr: 'Les phases ultérieures ne commencent qu\'après le règlement des précédentes.',
    de: 'Nachfolgende Phasen beginnen erst nach Begleichung der vorherigen.',
  },
  rule4: {
    ar: 'يحق للعميل 3 مراجعات مجانية — ما بعدها بتكلفة إضافية يحددها المشرف.',
    en: 'Includes 3 free revision rounds. Further revisions are billed at supervisor rates.',
    fr: 'Comprend 3 révisions gratuites. Les révisions ultérieures sont facturées.',
    de: 'Enthält 3 kostenlose Überarbeitungsrunden. Weitere werden berechnet.',
  },
  rule5: {
    ar: 'في حال الخلاف يُحال للمشرف أولاً، ثم للأدمن كمرحلة أخيرة داخل الموقع.',
    en: 'Disputes are referred to supervisor first, then escalated to platform admin.',
    fr: 'Les litiges sont transmis d\'abord au superviseur, puis à l\'administrateur.',
    de: 'Streitigkeiten werden zuerst an den Supervisor und dann an den Admin weitergeleitet.',
  },
  rule6: {
    ar: 'بالضغط على "أوافق" وكتابة اسمه الكامل، يُقرّ العميل بموافقته القانونية.',
    en: 'By clicking "I Agree" and typing full name, client confirms legal agreement.',
    fr: 'En cliquant sur "J\'accepte" et en saisissant son nom, le client confirme l\'accord légal.',
    de: 'Durch Klicken auf "Ich stimme zu" bestätigt der Kunde die rechtliche Vereinbarung.',
  },
  loading: {
    ar: 'جاري التحميل...',
    en: 'Loading contracts...',
    fr: 'Chargement des contrats...',
    de: 'Verträge werden geladen...',
  },
  noContracts: {
    ar: 'لا توجد عقود مضافة بعد',
    en: 'No contracts added yet',
    fr: 'Aucun contrat ajouté pour le moment',
    de: 'Noch keine Verträge hinzugefügt',
  },
  addFirstContract: {
    ar: 'إضافة أول عقد',
    en: 'Add First Contract',
    fr: 'Ajouter le premier contrat',
    de: 'Ersten Vertrag hinzufügen',
  },
  customClausesLabel: {
    ar: 'البنود الخاصة:',
    en: 'Custom Clauses:',
    fr: 'Clauses spécifiques:',
    de: 'Spezifische Klauseln:',
  },
  noCustomClauses: {
    ar: 'لا توجد بنود إضافية',
    en: 'No custom clauses added',
    fr: 'Aucune clause spécifique',
    de: 'Keine zusätzlichen Klauseln',
  },
  fullNameSignEnabled: {
    ar: '✓ توقيع بالاسم الكامل مفعل',
    en: '✓ Full Name Signature Enabled',
    fr: '✓ Signature nom complet activée',
    de: '✓ Vollnamenssignatur aktiviert',
  },
  serviceNameLabel: {
    ar: 'الخدمة المرتبطة *',
    en: 'Associated Service *',
    fr: 'Service associé *',
    de: 'Zugehöriger Dienst *',
  },
  versionLabel: {
    ar: 'الإصدار (Version)',
    en: 'Version',
    fr: 'Version',
    de: 'Version',
  },
  multiLangClausesTitle: {
    ar: 'البنود الخاصة بالعقد (4 لغات)',
    en: 'Contract Custom Clauses (4 Languages)',
    fr: 'Clauses personnalisées du contrat (4 langues)',
    de: 'Vertragsklauseln (4 Sprachen)',
  },
  chatSuspensionLabel: {
    ar: 'رسالة تعطيل الشات عند النزاع',
    en: 'Chat Suspension Message on Dispute',
    fr: 'Message de suspension de chat en cas de litige',
    de: 'Chat-Sperrnachricht bei Streitfall',
  },
  cancel: {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    de: 'Abbrechen',
  },
  saveContract: {
    ar: 'حفظ العقد',
    en: 'Save Contract',
    fr: 'Enregistrer le contrat',
    de: 'Vertrag speichern',
  },
  deleteConfirm: {
    ar: 'هل أنت تأكد من حذف هذا العقد؟',
    en: 'Are you sure you want to delete this contract?',
    fr: 'Êtes-vous sûr de vouloir supprimer ce contrat ?',
    de: 'Sind Sie sicher, dass Sie diesen Vertrag löschen möchten?',
  },
};

function getLocValue(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val[lang] || val['en'] || val['ar'] || val['fr'] || val['de'] || Object.values(val)[0] || '';
  }
  return String(val);
}

export default function ContractsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const tUi = (key: string) => dbContractsUi[key]?.[locale] || dbContractsUi[key]?.['en'] || '';

  const [contracts, setContracts] = useState<IContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<IContract | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en' | 'fr' | 'de'>('ar');

  const [formData, setFormData] = useState<IContract>({
    serviceName: 'البرمجة',
    version: 'v1.0',
    customClauses: { ar: '', en: '', fr: '', de: '' },
    requireTypedName: true,
    autoChatSuspensionMessages: {
      ar: 'نأسف لهذا الموقف. تم تعليق المحادثة مؤقتاً ريثما تتم مراجعة النزاع من قِبل الإدارة.',
      en: 'We apologize for this situation. The chat has been temporarily suspended pending administrative review.',
      fr: 'Nous nous excusons pour cette situation. La conversation a été suspendue temporairement.',
      de: 'Wir entschuldigen uns für diese Situation. Der Chat wurde vorübergehend gesperrt.',
    },
  });

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contracts');
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleOpenModal = (contract?: IContract) => {
    if (contract) {
      setEditingContract(contract);
      setFormData(contract);
    } else {
      setEditingContract(null);
      setFormData({
        serviceName: 'البرمجة',
        version: 'v1.0',
        customClauses: { ar: '', en: '', fr: '', de: '' },
        requireTypedName: true,
        autoChatSuspensionMessages: {
          ar: 'نأسف لهذا الموقف. تم تعليق المحادثة مؤقتاً ريثما تتم مراجعة النزاع من قِبل الإدارة.',
          en: 'We apologize for this situation. The chat has been temporarily suspended pending administrative review.',
          fr: 'Nous nous excusons pour cette situation. La conversation a été suspendue temporairement.',
          de: 'Wir entschuldigen uns für diese Situation. Der Chat wurde vorübergehend gesperrt.',
        },
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingContract ? `/api/contracts/${editingContract._id}` : '/api/contracts';
      const method = editingContract ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchContracts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tUi('deleteConfirm'))) return;
    try {
      const res = await fetch(`/api/contracts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchContracts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdDescription className="text-venecos-gold text-3xl" />
            {tUi('pageTitle')}
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            {tUi('pageSubtitle')}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          {tUi('addNewContract')}
        </button>
      </div>

      {/* Auto Clauses Banner */}
      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
          <MdCheckCircle className="text-base" /> {tUi('standardClausesTitle')}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/70 list-disc list-inside leading-relaxed">
          <li>{tUi('rule1')}</li>
          <li>{tUi('rule2')}</li>
          <li>{tUi('rule3')}</li>
          <li>{tUi('rule4')}</li>
          <li>{tUi('rule5')}</li>
          <li>{tUi('rule6')}</li>
        </ul>
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">{tUi('loading')}</div>
      ) : contracts.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdDescription className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">{tUi('noContracts')}</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <MdAdd /> {tUi('addFirstContract')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((contract) => (
            <div
              key={contract._id}
              className="bg-venecos-black/70 border border-white/10 hover:border-venecos-gold/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{contract.serviceName}</h3>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-venecos-gold/20 text-venecos-gold">
                    {contract.version}
                  </span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-white/70 space-y-1">
                  <p className="font-bold text-white mb-1">{tUi('customClausesLabel')}</p>
                  <p className="line-clamp-3 leading-relaxed">{getLocValue(contract.customClauses, locale) || tUi('noCustomClauses')}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold">{tUi('fullNameSignEnabled')}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(contract)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => contract._id && handleDelete(contract._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-venecos-black border border-venecos-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdDescription className="text-venecos-gold" />
                {editingContract ? tUi('editContract') : tUi('addNewContract')}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">{tUi('serviceNameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    placeholder="Programming..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">{tUi('versionLabel')}</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="v1.0"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
              </div>

              {/* Languages tabs */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2">{tUi('multiLangClausesTitle')}</label>
                <div className="flex gap-2 border-b border-white/10 pb-2 mb-4">
                  {(['ar', 'en', 'fr', 'de'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLangTab(lang)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                        activeLangTab === lang ? 'bg-venecos-gold text-black' : 'bg-white/5 text-white/60'
                      }`}
                    >
                      {lang === 'ar' ? '🇸🇦 عربي' : lang === 'en' ? '🇬🇧 EN' : lang === 'fr' ? '🇫🇷 FR' : '🇩🇪 DE'}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">
                      {tUi('customClausesLabel')} ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={formData.customClauses[activeLangTab]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customClauses: { ...formData.customClauses, [activeLangTab]: e.target.value },
                        })
                      }
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">
                      {tUi('chatSuspensionLabel')} ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={formData.autoChatSuspensionMessages[activeLangTab]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          autoChatSuspensionMessages: {
                            ...formData.autoChatSuspensionMessages,
                            [activeLangTab]: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-venecos-gold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/10"
                >
                  {tUi('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-venecos-gold to-yellow-500"
                >
                  {tUi('saveContract')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
