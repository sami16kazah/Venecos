'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Button, 
  CircularProgress, 
  TextField, 
  Alert, 
  Card, 
  CardContent, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  Chip,
  Checkbox,
  Tabs,
  Tab
} from '@mui/material';
import { 
  MdEdit, MdDelete, MdAdd, MdCloudUpload, MdImage, 
  MdInsertEmoticon, MdSecurity, MdLaptop, MdPalette, 
  MdPrint, MdRecordVoiceOver, MdTune, MdCheckCircle
} from 'react-icons/md';
import DashboardContentLocaleSelector from '@/components/DashboardContentLocaleSelector';

// Dynamic icon resolver
import * as Icons from 'react-icons/fa';

export default function ServicesDashboardPage() {
  const t = useTranslations('Settings');
  const params = useParams() as { locale: string };
  const { data: session } = useSession();
  const router = useRouter();

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (session && role !== 'admin') {
      router.replace(`/${params?.locale || 'en'}/dashboard`);
    }
  }, [session, role, router, params?.locale]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-venecos-black tracking-tight underline decoration-venecos-gold decoration-4 underline-offset-8">
            إدارة الخدمات والخدمات الفرعية — Service & Sub-service Config
          </h2>
          <p className="text-gray-500 text-sm mt-3 font-medium">
            تخصيص نماذج وإعدادات كل خدمة فرعية (البرمجة، الاستضافة، الطباعة، الفيديو، التصميم، والتعليق الصوتي)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-venecos-gold/5 px-4 py-2 rounded-2xl border border-venecos-gold/20">
          <MdSecurity className="text-venecos-gold" size={20} />
          <span className="text-xs font-bold text-venecos-gold uppercase tracking-widest">{t('adminMode')}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        <ServicesManager />
      </div>
    </div>
  );
}

function ServicesManager() {
  const t = useTranslations('Settings');
  const params = useParams() as { locale?: string };
  const [editingLocale, setEditingLocale] = useState(params?.locale || 'ar');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Subservice Category Filter
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentService, setCurrentService] = useState<any>({ 
    title: '', 
    description: '', 
    iconType: 'react-icon', 
    iconName: 'FaCode', 
    iconUrl: '', 
    order: 0,
    isSpecial: false,
    categoryType: 'tech',
    specs: {
      paperType: 'ورق مخملي 350g',
      paperSize: 'A4',
      lamination: 'سلوفان مطفي + سلفنة ذهبية',
      videoResolution: '4K Cinema',
      videoDuration: '60 ثانية',
      hasVoiceover: true,
      has3DAnim: true,
      ramGb: '16GB DDR5',
      cpuCores: '8 Cores',
      storageGb: '500GB NVMe',
    }
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchServices = useCallback(async (lang: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/services?locale=${lang}`);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setFeedback({ type: 'error', msg: 'فشل تحميل الخدمات.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(editingLocale); }, [editingLocale, fetchServices]);

  const handleSaveService = async () => {
    try {
      const url = '/api/services';
      const method = currentService._id ? 'PUT' : 'POST';
      
      const cleanSubServices = (currentService.subServices || []).map((sub: any) => ({
        title: sub.title || 'باقة بدون عنوان',
        description: sub.description || '',
        price: Number(sub.price) || 0
      }));

      const body = { ...currentService, locale: editingLocale, subServices: cleanSubServices };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setFeedback({ type: 'success', msg: 'تم حفظ إعدادات الخدمة والخدمات الفرعية بنجاح!' });
        setModalOpen(false);
        fetchServices(editingLocale);
      } else {
        setFeedback({ type: 'error', msg: 'فشل حفظ الخدمة.' });
      }
    } catch {
      setFeedback({ type: 'error', msg: 'خطأ في الاتصال بالشبكة.' });
    }
  };

  const handleDeleteService = async () => {
    if (!currentService._id) return;
    try {
      const res = await fetch(`/api/services?id=${currentService._id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', msg: 'تم حذف الخدمة.' });
        setModalOpen(false);
        setIsDeleting(false);
        fetchServices(editingLocale);
      }
    } catch {
      setFeedback({ type: 'error', msg: 'فشل إجراء الحذف.' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentService({ ...currentService, iconUrl: data.url, iconType: 'image' });
      } else {
        alert(data.message || 'فشل رفع الملف');
      }
    } catch (err) {
      alert('خطأ أثناء رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const filteredServices = services.filter(svc => {
    if (categoryFilter === 'all') return true;
    return (svc.categoryType || 'tech') === categoryFilter;
  });

  return (
    <div className="space-y-8">
      {feedback && <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ borderRadius: 3 }}>{feedback.msg}</Alert>}

      {/* Locale & Category Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <DashboardContentLocaleSelector 
          selectedLocale={editingLocale} 
          onLocaleChange={setEditingLocale} 
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setCategoryFilter('all')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${categoryFilter === 'all' ? 'bg-venecos-black text-venecos-gold shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            الكل ({services.length})
          </button>
          <button 
            onClick={() => setCategoryFilter('tech')} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${categoryFilter === 'tech' ? 'bg-venecos-black text-venecos-gold shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <MdLaptop /> تقنية
          </button>
          <button 
            onClick={() => setCategoryFilter('design')} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${categoryFilter === 'design' ? 'bg-venecos-black text-venecos-gold shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <MdPalette /> تصميم وفيديو
          </button>
          <button 
            onClick={() => setCategoryFilter('print')} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${categoryFilter === 'print' ? 'bg-venecos-black text-venecos-gold shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <MdPrint /> طباعة
          </button>
          <button 
            onClick={() => setCategoryFilter('other')} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${categoryFilter === 'other' ? 'bg-venecos-black text-venecos-gold shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <MdRecordVoiceOver /> أخرى
          </button>
        </div>

        <Button 
          variant="contained" 
          startIcon={<MdAdd />} 
          onClick={() => { 
            setCurrentService({ 
              title: '', 
              description: '', 
              iconType: 'react-icon', 
              iconName: 'FaCode', 
              iconUrl: '', 
              order: services.length + 1, 
              isSpecial: false,
              categoryType: 'tech',
              subServices: [
                { title: 'باقة المبتدئين Basic', description: 'مناسبة للمشاريع الصغيرة', price: 299 },
                { title: 'باقة المحترفين Pro', description: 'شاملة مع الدعم الفني', price: 699 }
              ]
            }); 
            setIsDeleting(false); 
            setModalOpen(true); 
          }} 
          sx={{ borderRadius: 9999, fontWeight: 'bold', px: 4, bgcolor: '#000', color: '#D4AF37', '&:hover': { bgcolor: '#1a1a1a' } }}
        >
          خدمة جديدة
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><CircularProgress /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((svc) => {
            const GenericIcon = (Icons as any)[svc.iconName] || Icons.FaCode;
            const subCount = (svc.subServices || []).length;

            return (
              <Card key={svc._id} sx={{ borderRadius: 4, position: 'relative', border: '1px solid #f0f0f0', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } }}>
                <CardContent className="p-6">
                  {svc.isSpecial && (
                    <div className="absolute top-0 left-0 bg-venecos-gold text-white text-[10px] font-bold px-3 py-1 rounded-br-xl uppercase tracking-widest">
                      الرئيسية
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-16 h-16 bg-venecos-gold/5 rounded-2xl mb-4 flex items-center justify-center border border-venecos-gold/10 overflow-hidden">
                      {svc.iconType === 'image' && svc.iconUrl ? (
                        <img src={svc.iconUrl} alt={svc.title} className="w-full h-full object-cover" />
                      ) : (
                        <GenericIcon size={32} className="text-venecos-gold" />
                      )}
                    </div>
                    <h4 className="font-extrabold text-lg text-gray-900 leading-tight">{svc.title}</h4>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">{svc.description}</p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 w-full flex flex-wrap justify-center gap-2">
                      <Chip label={`الباقات الفرعية: ${subCount}`} color="primary" size="small" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
                      <Chip label={`الترتيب: ${svc.order}`} size="small" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
                    </div>

                    {/* Quick view of subservices */}
                    {subCount > 0 && (
                      <div className="mt-3 w-full bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-right text-xs space-y-1">
                        <span className="block font-bold text-gray-500 text-[10px]">الباقات الفرعية المتاحة:</span>
                        {svc.subServices.slice(0, 2).map((sub: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-gray-700">
                            <span>• {sub.title}</span>
                            <span className="font-bold text-venecos-gold">€{sub.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="absolute top-2 right-2">
                    <Tooltip title="تعديل الإعدادات والخدمات الفرعية">
                      <IconButton size="small" onClick={() => { setCurrentService(svc); setIsDeleting(false); setModalOpen(true); }}><MdEdit size={18} /></IconButton>
                    </Tooltip>
                    <Tooltip title="حذف الخدمة">
                      <IconButton size="small" color="error" onClick={() => { setCurrentService(svc); setIsDeleting(true); setModalOpen(true); }}><MdDelete size={18} /></IconButton>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* DETAILED SERVICE & SUBSERVICES SETTINGS MODAL */}
      <Dialog 
        open={modalOpen} 
        onClose={() => !uploading && setModalOpen(false)} 
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: '800', fontSize: '1.4rem', pb: 0, borderBottom: '1px solid #eee' }}>
          {isDeleting ? 'حذف الخدمة' : currentService._id ? `تعديل خدمة: ${currentService.title}` : 'إضافة خدمة جديدة'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {isDeleting ? (
            <p className="text-gray-500 font-medium leading-relaxed">
              هل أنت تأكد من رغبتك في حذف خدمة "{currentService.title}" نهائياً من النظام؟
            </p>
          ) : (
            <div className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <TextField 
                    fullWidth 
                    label="عنوان الخدمة الرئيسي" 
                    value={currentService.title} 
                    onChange={(e) => setCurrentService({...currentService, title: e.target.value})} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </div>
                <TextField 
                  type="number" 
                  label="ترتيب العرض" 
                  value={currentService.order} 
                  onChange={(e) => setCurrentService({...currentService, order: Number(e.target.value)})}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </div>

              <TextField 
                fullWidth 
                multiline 
                rows={3} 
                label="الوصف التعريفي للخدمة" 
                value={currentService.description} 
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <div className="flex flex-wrap gap-4 items-center">
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={!!currentService.isSpecial} 
                      onChange={(e) => setCurrentService({...currentService, isSpecial: e.target.checked})} 
                      sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} 
                    />
                  } 
                  label={<span className="font-bold text-venecos-black text-sm">عرض الخدمة في الصفحة الرئيسية</span>} 
                  sx={{ bgcolor: '#fff', p: 1, pr: 3, border: '1px solid #eee', borderRadius: 3, ml: 0 }}
                />

                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                  <span className="text-xs font-bold text-gray-600">تصنيف الخدمة:</span>
                  <select 
                    value={currentService.categoryType || 'tech'} 
                    onChange={(e) => setCurrentService({...currentService, categoryType: e.target.value})}
                    className="text-xs font-bold bg-white border border-gray-300 rounded-lg px-3 py-1.5"
                  >
                    <option value="tech">الخدمات التقنية (برمجة، استضافة، دومينات)</option>
                    <option value="design">خدمات التصميم وإنتاج الفيديو 3D</option>
                    <option value="print">خدمات الطباعة (ورقية، ملصقات، إعلانية)</option>
                    <option value="other">خدمات أخرى (تعليق صوتي، كتابة محتوى)</option>
                  </select>
                </div>
              </div>

              {/* Subservices Specific Custom Specifications Section */}
              <div className="bg-gradient-to-r from-neutral-900 to-venecos-black p-5 rounded-3xl text-white space-y-4 shadow-lg border border-venecos-gold/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <MdTune className="text-venecos-gold text-xl" />
                    <span className="font-bold text-sm text-venecos-gold">خصائص خيارات النماذج الفنية (Subservice Dynamic Specs)</span>
                  </div>
                  <span className="text-[10px] bg-venecos-gold/20 text-venecos-gold px-3 py-1 rounded-full font-bold">
                    حسب نوع الخدمة المختارة
                  </span>
                </div>

                {/* Print Specs */}
                {(currentService.categoryType === 'print') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-white/70 mb-1 font-semibold">نوع الورق / الخامة:</label>
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white" 
                        value={currentService.specs?.paperType || 'ورق مخملي 350g'} 
                        onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, paperType: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1 font-semibold">المقاس القياسي:</label>
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white" 
                        value={currentService.specs?.paperSize || 'A4 / A5 / مخصص'} 
                        onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, paperSize: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1 font-semibold">التغليف والطباعة الذهبية:</label>
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white" 
                        value={currentService.specs?.lamination || 'سلوفان مطفي + سلفنة ذهبية'} 
                        onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, lamination: e.target.value}})}
                      />
                    </div>
                  </div>
                )}

                {/* Video & Design Specs */}
                {(currentService.categoryType === 'design') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-white/70 mb-1 font-semibold">دقة إنتاج الفيديو:</label>
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white" 
                        value={currentService.specs?.videoResolution || '4K Ultra HD / 1080p'} 
                        onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, videoResolution: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1 font-semibold">مدة الفيديو الافتراضية:</label>
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white" 
                        value={currentService.specs?.videoDuration || '60 ثانية'} 
                        onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, videoDuration: e.target.value}})}
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={currentService.specs?.hasVoiceover ?? true} 
                          onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, hasVoiceover: e.target.checked}})} 
                        />
                        <span>يتضمن تعليق صوتي</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Tech & VPS Specs */}
                {(currentService.categoryType === 'tech') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-white/70 mb-1 font-semibold">الذاكرة العشوائية RAM:</label>
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white" 
                        value={currentService.specs?.ramGb || '16GB DDR5 High Speed'} 
                        onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, ramGb: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1 font-semibold">المعالج CPU:</label>
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white" 
                        value={currentService.specs?.cpuCores || '8 Cores Dedicated'} 
                        onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, cpuCores: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1 font-semibold">التخزين السحابي SSD:</label>
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white" 
                        value={currentService.specs?.storageGb || '500GB NVMe M.2'} 
                        onChange={(e) => setCurrentService({...currentService, specs: {...currentService.specs, storageGb: e.target.value}})}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subservices / Packages Manager */}
              <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">الباقات والخدمات الفرعية المتضمنة (Sub-service Packages)</h5>
                    <p className="text-xs text-gray-500">إضافة وأسعار الباقات التابعة لهذه الخدمة التي يستطيع العميل الاختيار منها</p>
                  </div>
                  <Button 
                    size="small" 
                    variant="contained" 
                    sx={{ borderRadius: 8, bgcolor: '#000', color: '#D4AF37' }} 
                    onClick={() => {
                      const newSub = { title: '', description: '', price: 0 };
                      setCurrentService({...currentService, subServices: [...(currentService.subServices || []), newSub]});
                    }}
                  >
                    + إضافة باقة فرعية
                  </Button>
                </div>

                {(!currentService.subServices || currentService.subServices.length === 0) && (
                  <p className="text-xs text-gray-500 italic mb-2">لا توجد باقات فرعية مضافة بعد لهذه الخدمة.</p>
                )}

                {(currentService.subServices || []).map((sub: any, index: number) => (
                  <div key={index} className="mb-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-xs font-bold text-venecos-gold">باقة فرعية #{index + 1}</span>
                      <IconButton size="small" color="error" onClick={() => {
                        const updated = currentService.subServices.filter((_: any, i: number) => i !== index);
                        setCurrentService({...currentService, subServices: updated});
                      }}><MdDelete fontSize="small" /></IconButton>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <TextField 
                          fullWidth 
                          size="small" 
                          label="عنوان الباقة الفرعية" 
                          value={sub.title} 
                          onChange={(e) => {
                            const updated = [...currentService.subServices];
                            updated[index].title = e.target.value;
                            setCurrentService({...currentService, subServices: updated});
                          }} 
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} 
                        />
                      </div>
                      <TextField 
                        fullWidth 
                        size="small" 
                        type="number" 
                        label="السعر (€)" 
                        value={sub.price} 
                        onChange={(e) => {
                          const updated = [...currentService.subServices];
                          updated[index].price = Number(e.target.value);
                          setCurrentService({...currentService, subServices: updated});
                        }} 
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} 
                      />
                    </div>
                    <TextField 
                      fullWidth 
                      size="small" 
                      multiline 
                      rows={2} 
                      label="تفاصيل الباقة والميزات" 
                      value={sub.description} 
                      onChange={(e) => {
                        const updated = [...currentService.subServices];
                        updated[index].description = e.target.value;
                        setCurrentService({...currentService, subServices: updated});
                      }} 
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ fontWeight: 'bold' }}>إلغاء</Button>
          {isDeleting ? (
            <Button variant="contained" color="error" onClick={handleDeleteService} sx={{ borderRadius: 9999, px: 4 }}>تأكيد الحذف النهائي</Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleSaveService} 
              disabled={!currentService.title || uploading} 
              sx={{ borderRadius: 9999, px: 6, fontWeight: 'bold', bgcolor: '#000', color: '#D4AF37', '&:hover': { bgcolor: '#1a1a1a' } }}
            >
              حفظ وتزامن التغييرات
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
