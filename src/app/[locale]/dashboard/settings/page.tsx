'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Button, 
  CircularProgress, 
  TextField, 
  Tabs, 
  Tab, 
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
  Typography,
  Box,
  Tooltip,
  Chip
} from '@mui/material';
import { MdSave, MdEdit, MdDelete, MdAdd, MdCloudUpload, MdImage, MdInsertEmoticon, MdSecurity } from 'react-icons/md';
import DashboardContentLocaleSelector from '@/components/DashboardContentLocaleSelector';

// Dynamic icon resolver
import * as Icons from 'react-icons/fa';

export default function PlatformSettingsPage() {
  const t = useTranslations('Settings');
  const params = useParams() as { locale: string };
  const { data: session } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState(0);

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
            {t('title')}
          </h2>
          <p className="text-gray-500 text-sm mt-3 font-medium">{t('desc')}</p>
        </div>
        <div className="flex items-center gap-2 bg-venecos-gold/5 px-4 py-2 rounded-2xl border border-venecos-gold/20">
          <MdSecurity className="text-venecos-gold" size={20} />
          <span className="text-xs font-bold text-venecos-gold uppercase tracking-widest">{t('adminMode')}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        <AboutContentManager />
      </div>
    </div>
  );
}

// ==========================================
// ABOUT CONTENT MANAGER
// ==========================================
function AboutContentManager() {
  const t = useTranslations('AboutAdmin');
  const tSettings = useTranslations('Settings');
  const [editingLocale, setEditingLocale] = useState('en');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const fetchContent = useCallback(async (lang: string) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/about?locale=${lang}`);
      const data = await res.json();
      if (res.ok) {
        setTitle(data.title || '');
        setContent(data.content || '');
      }
    } catch (err) {
      console.error('Failed to fetch', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent(editingLocale);
  }, [editingLocale, fetchContent]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: editingLocale, title, content }),
      });
      if (res.ok) {
        setFeedback({ type: 'success', msg: t('updateSuccess') || 'Success!' });
      } else {
        setFeedback({ type: 'error', msg: 'Error saving content' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Network error.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {feedback && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ borderRadius: 3 }}>{feedback.msg}</Alert>
      )}

      <DashboardContentLocaleSelector 
        selectedLocale={editingLocale} 
        onLocaleChange={setEditingLocale} 
      />

      {loading ? (
        <div className="flex justify-center p-20"><CircularProgress size={40} /></div>
      ) : (
        <div className="grid gap-6">
          <div className="space-y-2">
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'gray.700' }}>{t('pageTitle')}</Typography>
            <TextField 
              fullWidth 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fdfdfd' } }}
              placeholder="Enter title..."
            />
          </div>
          <div className="space-y-2">
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'gray.700' }}>{t('pageContent')}</Typography>
            <TextField 
              fullWidth 
              multiline 
              rows={12} 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fdfdfd' } }}
              placeholder="Write content here..."
            />
            <p className="text-xs text-gray-400 italic mt-2">{t('formattingHint')}</p>
          </div>
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <Button 
              variant="contained" 
              onClick={handleSave} 
              disabled={saving || !title.trim() || !content.trim()} 
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <MdSave />} 
              sx={{ borderRadius: 9999, px: 8, py: 1.5, fontWeight: 'bold', fontSize: '1rem', textTransform: 'none' }}
            >
              {t('saveChanges')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

