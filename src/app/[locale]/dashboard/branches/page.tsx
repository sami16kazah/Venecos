'use client';

import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdCheckCircle } from 'react-icons/md';

interface IWorkingHour {
  days: string;
  from: string;
  to: string;
}

interface IBranch {
  _id?: string;
  name: string;
  countryCode: string;
  countryName: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  workingHours: IWorkingHour[];
  googleMapsUrl?: string;
  status: 'active' | 'temporarily_closed' | 'coming_soon';
}

const COUNTRIES = [
  { code: 'DE', name: '🇩🇪 ألمانيا' },
  { code: 'AE', name: '🇦🇪 الإمارات العربية المتحدة' },
  { code: 'SY', name: '🇸🇾 سوريا' },
  { code: 'SA', name: '🇸🇦 المملكة العربية السعودية' },
  { code: 'LB', name: '🇱🇧 لبنان' },
  { code: 'JO', name: '🇯🇴 الأردن' },
  { code: 'IQ', name: '🇮🇶 العراق' },
  { code: 'EG', name: '🇪🇬 مصر' },
  { code: 'MA', name: '🇲🇦 المغرب' },
  { code: 'TN', name: '🇹🇳 تونس' },
  { code: 'FR', name: '🇫🇷 فرنسا' },
  { code: 'GB', name: '🇬🇧 المملكة المتحدة' },
  { code: 'US', name: '🇺🇸 الولايات المتحدة' },
  { code: 'TR', name: '🇹🇷 تركيا' },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<IBranch | null>(null);

  const [formData, setFormData] = useState<IBranch>({
    name: '',
    countryCode: 'DE',
    countryName: '🇩🇪 ألمانيا',
    city: '',
    address: '',
    phone: '',
    email: '',
    workingHours: [{ days: 'الإثنين — الجمعة', from: '09:00', to: '18:00' }],
    googleMapsUrl: '',
    status: 'active',
  });

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpenModal = (branch?: IBranch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData(branch);
    } else {
      setEditingBranch(null);
      setFormData({
        name: '',
        countryCode: 'DE',
        countryName: '🇩🇪 ألمانيا',
        city: '',
        address: '',
        phone: '',
        email: '',
        workingHours: [{ days: 'الإثنين — الجمعة', from: '09:00', to: '18:00' }],
        googleMapsUrl: '',
        status: 'active',
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBranch ? `/api/branches/${editingBranch._id}` : '/api/branches';
      const method = editingBranch ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchBranches();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت تأكد من حذف هذا الفرع؟')) return;
    try {
      const res = await fetch(`/api/branches/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBranches();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCountryChange = (code: string) => {
    const matched = COUNTRIES.find((c) => c.code === code);
    setFormData({
      ...formData,
      countryCode: code,
      countryName: matched ? matched.name : code,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdLocationOn className="text-venecos-gold text-3xl" />
            إدارة الفروع — Global Branches
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            إدارة فروع VENECOS حول العالم مع الخرائط وساعات العمل
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all self-start md:self-auto"
        >
          <MdAdd className="text-lg" />
          إضافة فرع جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : branches.length === 0 ? (
        <div className="bg-venecos-black/50 border border-white/10 rounded-2xl p-12 text-center text-white/60 space-y-4">
          <MdLocationOn className="text-5xl text-venecos-gold/40 mx-auto" />
          <p className="text-lg font-medium">لا توجد فروع مضافة بعد</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <MdAdd /> إضافة أول فرع
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className="bg-venecos-black/70 border border-white/10 hover:border-venecos-gold/40 rounded-2xl p-6 shadow-xl relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{branch.name}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40">
                    {branch.countryName}
                  </span>
                </div>

                <div className="text-xs text-white/70 space-y-1.5 pt-2">
                  <p className="flex items-center gap-2">
                    <MdLocationOn className="text-venecos-gold text-base" /> {branch.city} — {branch.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <MdPhone className="text-venecos-gold text-base" /> {branch.phone}
                  </p>
                  {branch.email && (
                    <p className="flex items-center gap-2">
                      <MdEmail className="text-venecos-gold text-base" /> {branch.email}
                    </p>
                  )}
                </div>

                {branch.googleMapsUrl && (
                  <a
                    href={branch.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs font-bold text-venecos-gold hover:underline pt-1"
                  >
                    📍 فتح على Google Maps
                  </a>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    branch.status === 'active' ? 'text-emerald-400' : 'text-yellow-400'
                  }`}
                >
                  {branch.status === 'active' ? '● نشط' : branch.status === 'coming_soon' ? '⏳ قريباً' : '🔒 مغلق مؤقتاً'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(branch)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-venecos-gold/20 text-white hover:text-venecos-gold"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => branch._id && handleDelete(branch._id)}
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
                <MdLocationOn className="text-venecos-gold" />
                {editingBranch ? 'تعديل الفرع' : 'إضافة فرع جديد'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">اسم الفرع *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="فرع برلين الرئيسي"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">الدولة *</label>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">المدينة *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="برلين"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">العنوان الكامل *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Friedrichstraße 123"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 30 12345678"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="berlin@venecos.net"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">رابط Google Maps (Embed or Link)</label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">حالة الفرع</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-venecos-gold"
                >
                  <option value="active">نشط (Active)</option>
                  <option value="temporarily_closed">مغلق مؤقتاً (Temporarily Closed)</option>
                  <option value="coming_soon">قادماً قريباً (Coming Soon)</option>
                </select>
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
                  حفظ الفرع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
