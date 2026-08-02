'use client';

import { useState, useEffect } from 'react';
import { MdDescription, MdAdd, MdEdit, MdDelete, MdCheckCircle, MdComment, MdSave } from 'react-icons/md';

interface IContract {
  _id?: string;
  serviceName: string;
  version: string;
  customClauses: { ar: string; en: string; fr: string; de: string };
  requireTypedName: boolean;
  autoChatSuspensionMessages: { ar: string; en: string; fr: string; de: string };
}

export default function ContractsPage() {
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
    if (!confirm('هل أنت تأكد من حذف هذا العقد؟')) return;
    try {
      const res = await fetch(`/api/contracts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchContracts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdDescription className="text-venecos-gold text-3xl" />
            إدارة العقود والتوقيع الإلكتروني — Contracts & E-Sign
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            عقد مخصص لكل خدمة يوقّع عليه العميل إلكترونياً قبل بدء العمل
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          إضافة عقد خدمة
        </button>
      </div>

      {/* Auto Clauses Banner */}
      <div className="bg-venecos-black/70 border border-white/10 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-venecos-gold flex items-center gap-2">
          <MdCheckCircle className="text-base" /> הבنود التلقائية الموحدة لكل العقود (مشتركة)
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/70 list-disc list-inside leading-relaxed">
          <li>لا تبدأ أي خدمة بدون دفعة مقدمة لا تقل عن 30% من قيمة الطلب.</li>
          <li>لا يُسلَّم أي عمل بدون سداد المبلغ كاملاً.</li>
          <li>لا تبدأ أي مرحلة جديدة بدون سداد المرحلة السابقة.</li>
          <li>يحق للعميل 3 مراجعات مجانية — ما بعدها بتكلفة إضافية يحددها المشرف.</li>
          <li>في حال الخلاف يُحال للمشرف أولاً، ثم للأدمن كمرحلة أخيرة داخل الموقع.</li>
          <li>بالضغط على &quot;أوافق&quot; وكتابة اسمه الكامل، يُقرّ العميل بموافقته القانونية.</li>
        </ul>
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : contracts.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdDescription className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">لا توجد عقود مضافة بعد</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <MdAdd /> إضافة أول عقد
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
                  <p className="font-bold text-white mb-1">البنود الخاصة (بالعربي):</p>
                  <p className="line-clamp-3 leading-relaxed">{contract.customClauses.ar || 'لا توجد بنود إضافية'}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold">✓ توقيع بالاسم الكامل مفعل</span>
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
                {editingContract ? 'تعديل العقد' : 'إضافة عقد جديد'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">الخدمة المرتبطة *</label>
                  <input
                    type="text"
                    required
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    placeholder="البرمجة، التصوير..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">الإصدار (Version)</label>
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
                <label className="block text-xs font-bold text-white/70 mb-2">البنود الخاصة بالعقد (4 لغات)</label>
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
                      البنود الإضافية للخدمة ({activeLangTab.toUpperCase()})
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
                      رسالة تعطيل الشات عند النزاع ({activeLangTab.toUpperCase()})
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
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-venecos-gold to-yellow-500"
                >
                  حفظ العقد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
