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
  Checkbox
} from '@mui/material';
import { MdEdit, MdDelete, MdAdd, MdCloudUpload, MdImage, MdInsertEmoticon, MdSecurity } from 'react-icons/md';
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
            {t('manageServices')}
          </h2>
          <p className="text-gray-500 text-sm mt-3 font-medium">{t('manageDesc') || 'Control the services offered on the home page and services catalog.'}</p>
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
  const [editingLocale, setEditingLocale] = useState(params?.locale || 'en');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

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
    isSpecial: false
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
      setFeedback({ type: 'error', msg: 'Failed to load services.' });
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
        title: sub.title || 'Untitled Package',
        description: sub.description || 'No description provided',
        price: Number(sub.price) || 0
      }));

      const body = { ...currentService, locale: editingLocale, subServices: cleanSubServices };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setFeedback({ type: 'success', msg: 'Service configuration synchronized!' });
        setModalOpen(false);
        fetchServices(editingLocale);
      } else {
        setFeedback({ type: 'error', msg: 'Failed to sync service.' });
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Network error.' });
    }
  };

  const handleDeleteService = async () => {
    if (!currentService._id) return;
    try {
      const res = await fetch(`/api/services?id=${currentService._id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', msg: 'Service purged from repository.' });
        setModalOpen(false);
        setIsDeleting(false);
        fetchServices(editingLocale);
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Action failed.' });
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
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      alert('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {feedback && <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ borderRadius: 3 }}>{feedback.msg}</Alert>}

      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <DashboardContentLocaleSelector 
          selectedLocale={editingLocale} 
          onLocaleChange={setEditingLocale} 
        />
        <Button 
          variant="contained" 
          startIcon={<MdAdd />} 
          onClick={() => { 
            setCurrentService({ title: '', description: '', iconType: 'react-icon', iconName: 'FaCode', iconUrl: '', order: services.length + 1, isSpecial: false }); 
            setIsDeleting(false); 
            setModalOpen(true); 
          }} 
          sx={{ borderRadius: 9999, fontWeight: 'bold', px: 4 }}
        >
          {t('newService')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><CircularProgress /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const GenericIcon = (Icons as any)[svc.iconName] || Icons.FaCode;
            return (
              <Card key={svc._id} sx={{ borderRadius: 4, position: 'relative', border: '1px solid #f0f0f0', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } }}>
                <CardContent className="p-6">
                  {svc.isSpecial && (
                    <div className="absolute top-0 left-0 bg-venecos-gold text-white text-[10px] font-bold px-3 py-1 rounded-br-xl uppercase tracking-widest">
                      Home Page
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
                    <p className="text-sm text-gray-400 mt-2 line-clamp-3 leading-relaxed">{svc.description}</p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-50 w-full flex justify-center gap-2">
                       <Chip label={`${t('sortOrder')}: ${svc.order}`} size="small" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
                       <Chip label={svc.iconType === 'image' ? t('customUpload') : svc.iconName} size="small" variant="outlined" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
                    </div>
                  </div>

                  <div className="absolute top-2 right-2">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => { setCurrentService(svc); setIsDeleting(false); setModalOpen(true); }}><MdEdit size={16} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => { setCurrentService(svc); setIsDeleting(true); setModalOpen(true); }}><MdDelete size={16} /></IconButton>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* SERVICE MODAL */}
      <Dialog 
        open={modalOpen} 
        onClose={() => !uploading && setModalOpen(false)} 
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: '800', fontSize: '1.5rem', pb: 0 }}>
          {isDeleting ? t('deleteService') : currentService._id ? t('editService') : t('onboardService')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {isDeleting ? (
            <p className="text-gray-500 font-medium leading-relaxed">
              {t('deleteServiceConfirm', { title: currentService.title })}
            </p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <TextField 
                    fullWidth 
                    label={t('displayTitle')} 
                    value={currentService.title} 
                    onChange={(e) => setCurrentService({...currentService, title: e.target.value})} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </div>
                <TextField 
                  type="number" 
                  label={t('sortOrder')} 
                  value={currentService.order} 
                  onChange={(e) => setCurrentService({...currentService, order: Number(e.target.value)})}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </div>

              <TextField 
                fullWidth 
                multiline 
                rows={4} 
                label={t('publicDesc')} 
                value={currentService.description} 
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={!!currentService.isSpecial} 
                    onChange={(e) => setCurrentService({...currentService, isSpecial: e.target.checked})} 
                    sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} 
                  />
                } 
                label={<span className="font-bold text-venecos-black">Special Service (Show on Home Page)</span>} 
                sx={{ bgcolor: '#fff', p: 1, pr: 3, border: '1px solid #eee', borderRadius: 3, ml: 0 }}
              />

              <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 border-dashed">
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 1 }}>{t('iconSource')}</FormLabel>
                  <RadioGroup 
                    row 
                    value={currentService.iconType} 
                    onChange={(e) => setCurrentService({...currentService, iconType: e.target.value})}
                  >
                    <FormControlLabel value="react-icon" control={<Radio />} label={<><MdInsertEmoticon className="inline mr-1" /> {t('vectorIcon')}</>} />
                    <FormControlLabel value="image" control={<Radio />} label={<><MdImage className="inline mr-1" /> {t('customUpload')}</>} />
                  </RadioGroup>
                </FormControl>

                <div className="mt-4">
                  {currentService.iconType === 'react-icon' ? (
                    <TextField 
                      fullWidth 
                      label="React Icon ID (e.g., FaCode, FaRocket)" 
                      value={currentService.iconName || ''} 
                      onChange={(e) => setCurrentService({...currentService, iconName: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                      helperText="Specify valid Font Awesome 6 IDs."
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      {currentService.iconUrl ? (
                         <div className="relative group w-32 h-32 rounded-3xl overflow-hidden border-2 border-venecos-gold/30">
                            <img src={currentService.iconUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <IconButton size="small" color="inherit" sx={{ color: 'white' }} onClick={() => setCurrentService({...currentService, iconUrl: ''})}><MdDelete /></IconButton>
                            </div>
                         </div>
                      ) : (
                        <div 
                           className="w-full h-32 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-venecos-gold transition-colors"
                           onClick={() => fileInputRef.current?.click()}
                        >
                           {uploading ? <CircularProgress size={24} /> : (
                             <>
                               <MdCloudUpload size={32} className="text-gray-400 mb-2" />
                               <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{t('uploadHint')}</span>
                             </>
                           )}
                           <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 border-dashed">
                <div className="flex justify-between items-center mb-4">
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#000' }}>{t('subServicesConfig') || 'Sub-Services'}</FormLabel>
                   <Button size="small" variant="outlined" sx={{ borderRadius: 8, borderColor: '#D4AF37', color: '#D4AF37' }} onClick={() => {
                     const newSub = { _id: Date.now().toString(), title: '', description: '', price: 0 };
                     setCurrentService({...currentService, subServices: [...(currentService.subServices || []), newSub]});
                   }}>{t('addSubService') || '+ Add Package'}</Button>
                </div>

                {(!currentService.subServices || currentService.subServices.length === 0) && (
                  <p className="text-sm text-gray-500 italic mb-2">{t('noSubServices') || 'No packages added yet.'}</p>
                )}

                {(currentService.subServices || []).map((sub: any, index: number) => (
                   <div key={sub._id || index} className="mb-4 bg-white p-4 rounded-xl border border-gray-200">
                     <div className="flex justify-between items-center mb-3">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Package #{index + 1}</span>
                       <IconButton size="small" color="error" onClick={() => {
                         const updated = currentService.subServices.filter((_: any, i: number) => i !== index);
                         setCurrentService({...currentService, subServices: updated});
                       }}><MdDelete fontSize="small" /></IconButton>
                     </div>
                     <div className="grid grid-cols-3 gap-3 mb-3">
                       <div className="col-span-2">
                         <TextField fullWidth size="small" label={t('subServiceTitle') || 'Title'} value={sub.title} onChange={(e) => {
                           const updated = [...currentService.subServices];
                           updated[index].title = e.target.value;
                           setCurrentService({...currentService, subServices: updated});
                         }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                       </div>
                       <TextField fullWidth size="small" type="number" label={t('subServicePrice') || 'Price ($)'} value={sub.price} onChange={(e) => {
                         const updated = [...currentService.subServices];
                         updated[index].price = Number(e.target.value);
                         setCurrentService({...currentService, subServices: updated});
                       }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                     </div>
                     <TextField fullWidth size="small" multiline rows={2} label={t('subServiceDesc') || 'Description'} value={sub.description} onChange={(e) => {
                         const updated = [...currentService.subServices];
                         updated[index].description = e.target.value;
                         setCurrentService({...currentService, subServices: updated});
                       }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                   </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ fontWeight: 'bold' }}>{t('return')}</Button>
          {isDeleting ? (
            <Button variant="contained" color="error" onClick={handleDeleteService} sx={{ borderRadius: 9999, px: 4 }}>Delete permanently</Button>
          ) : (
            <Button 
               variant="contained" 
               onClick={handleSaveService} 
               disabled={!currentService.title || uploading} 
               sx={{ borderRadius: 9999, px: 6, fontWeight: 'bold' }}
            >
              {t('syncChanges')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
