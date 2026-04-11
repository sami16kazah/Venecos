'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button, CircularProgress, TextField, Tabs, Tab, Alert } from '@mui/material';
import { MdSave } from 'react-icons/md';

export default function AboutContentPage() {
  const t = useTranslations('AboutAdmin');
  const params = useParams() as { locale: string };
  const { data: session } = useSession();
  const router = useRouter();

  const [editingLocale, setEditingLocale] = useState('en');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (session && role !== 'admin') {
      router.replace(`/${params?.locale || 'en'}/dashboard`);
    }
  }, [session, role, router, params?.locale]);

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
      console.error('Failed to fetch about content', err);
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
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', msg: t('updateSuccess') || 'Content updated successfully!' });
      } else {
        setFeedback({ type: 'error', msg: data.message || 'Error saving content' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'A network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-venecos-black">{t('manageAbout') || 'Manage About Page Content'}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('manageAboutDesc') || 'Update the texts presented on the public specific About Us page.'}</p>
        </div>
      </div>

      {feedback && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ borderRadius: 2 }}>
          {feedback.msg}
        </Alert>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <Tabs 
          value={editingLocale} 
          onChange={(e, val) => setEditingLocale(val)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}
        >
          <Tab label="English" value="en" />
          <Tab label="Arabic (العربية)" value="ar" />
          <Tab label="French (Français)" value="fr" />
          <Tab label="German (Deutsch)" value="de" />
        </Tabs>

        {loading ? (
          <div className="flex justify-center p-12">
            <CircularProgress sx={{ color: '#D4AF37' }} />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('pageTitle') || 'Page Title'}</label>
              <TextField
                fullWidth
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., About Venecos Platform"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('pageContent') || 'Main Content Body'}</label>
              <TextField
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story, mission, and vision here..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <p className="text-xs text-gray-400 mt-2">{t('formattingHint') || 'Line breaks will be preserved when displayed.'}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || !title.trim() || !content.trim()}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <MdSave />}
                sx={{ borderRadius: 9999, px: 6, py: 1.5, fontWeight: 'bold' }}
              >
                {t('saveChanges') || 'Save Content'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
