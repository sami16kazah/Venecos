'use client';

import { useState, useEffect } from 'react';
import { MdCurrencyExchange, MdSave, MdInfo, MdAccessTime } from 'react-icons/md';

interface IRate {
  _id?: string;
  currencyCode: string;
  symbol: string;
  rateAgainstEur: number;
  lastUpdated?: string;
}

export default function ExchangeRatesPage() {
  const [rates, setRates] = useState<IRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/exchange-rates');
      if (res.ok) {
        const data = await res.json();
        setRates(data);
        if (data.length > 0 && data[0].lastUpdated) {
          setLastUpdate(new Date(data[0].lastUpdated).toLocaleString());
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleRateChange = (code: string, newRate: number) => {
    setRates((prev) =>
      prev.map((r) => (r.currencyCode === code ? { ...r, rateAgainstEur: newRate } : r))
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/exchange-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rates),
      });

      if (res.ok) {
        alert('تم حفظ أسعار الصرف بنجاح!');
        fetchRates();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-venecos-black/90 p-6 rounded-2xl border border-venecos-gold/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MdCurrencyExchange className="text-venecos-gold text-3xl" />
            أسعار الصرف — Exchange Rates
          </h1>
          <p className="text-white/60 text-xs md:text-sm mt-1">
            اليورو (€) هو العملة الأساسية — حدّد سعر الصرف لكل عملة يدوياً
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          {lastUpdate && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/60 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              <MdAccessTime className="text-venecos-gold text-base" />
              آخر تحديث: {lastUpdate}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            <MdSave className="text-lg" />
            {saving ? 'جاري الحفظ...' : 'حفظ الأسعار'}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-venecos-gold/10 border border-venecos-gold/30 rounded-2xl p-4 flex items-start gap-3 text-venecos-gold text-xs leading-relaxed">
        <MdInfo className="text-xl flex-shrink-0 mt-0.5" />
        <div>
          الأسعار المدخلة هنا تُطبَّق تلقائياً على جميع أسعار الخدمات لكل عضو حسب عملته المفضلة. مثال: إذا كان سعر الخدمة <strong className="underline">€100</strong> وسعر صرف الدولار <strong className="underline">1.08</strong> فسيرى العضو <strong className="underline">$108</strong>.
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-white/50 animate-pulse">جاري التحميل...</div>
      ) : (
        <div className="bg-venecos-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-right text-sm text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">العملة</th>
                <th className="p-4">الرمز</th>
                <th className="p-4">1 يورو (€) = ؟</th>
                <th className="p-4">مثال: €100 =</th>
                <th className="p-4">الوضع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {rates.map((rate) => (
                <tr key={rate.currencyCode} className="hover:bg-white/5 transition-all">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-venecos-gold/10 border border-venecos-gold/30 text-venecos-gold font-mono font-black text-xs flex items-center justify-center">
                      {rate.currencyCode}
                    </span>
                    {rate.currencyCode === 'EUR' ? 'اليورو (الأساس)' : rate.currencyCode}
                  </td>
                  <td className="p-4 text-venecos-gold font-bold">{rate.symbol}</td>
                  <td className="p-4">
                    {rate.currencyCode === 'EUR' ? (
                      <span className="text-white/40 font-mono">1.00 (ثابت)</span>
                    ) : (
                      <input
                        type="number"
                        step="0.0001"
                        value={rate.rateAgainstEur}
                        onChange={(e) => handleRateChange(rate.currencyCode, parseFloat(e.target.value) || 0)}
                        className="w-36 bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-sm outline-none focus:border-venecos-gold"
                      />
                    )}
                  </td>
                  <td className="p-4 font-bold text-emerald-400 font-mono">
                    {rate.symbol} {(100 * rate.rateAgainstEur).toLocaleString()}
                  </td>
                  <td className="p-4 text-xs font-bold text-white/60">
                    {rate.currencyCode === 'EUR' ? 'العملة الأم' : 'مباشر'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
