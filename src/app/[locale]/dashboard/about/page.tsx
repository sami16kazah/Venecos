'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button, CircularProgress, TextField, Alert } from '@mui/material';
import { 
  MdSave, 
  MdAdd, 
  MdDelete, 
  MdLanguage, 
  MdOpenInNew, 
  MdImage, 
  MdMovie, 
  MdBarChart, 
  MdStar,
  MdAutoAwesome
} from 'react-icons/md';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import DashboardContentLocaleSelector from '@/components/DashboardContentLocaleSelector';

interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export default function AboutContentPage() {
  const t = useTranslations('AboutAdmin');
  const params = useParams() as { locale: string };
  const { data: session } = useSession();
  const router = useRouter();

  const [editingLocale, setEditingLocale] = useState(params?.locale || 'en');
  
  // Form state
  const [badge, setBadge] = useState('VENECOS PLATFORM');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroVideo, setHeroVideo] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [content, setContent] = useState('');
  const [missionTitle, setMissionTitle] = useState('');
  const [missionDesc, setMissionDesc] = useState('');
  const [visionTitle, setVisionTitle] = useState('');
  const [visionDesc, setVisionDesc] = useState('');
  const [stats, setStats] = useState<StatItem[]>([]);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [showcaseVideoUrl, setShowcaseVideoUrl] = useState('');

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
        setBadge(data.badge || 'VENECOS PLATFORM');
        setTitle(data.title || '');
        setSubtitle(data.subtitle || '');
        setHeroImage(data.heroImage || '');
        setHeroVideo(data.heroVideo || '');
        setStoryTitle(data.storyTitle || '');
        setContent(data.content || '');
        setMissionTitle(data.missionTitle || '');
        setMissionDesc(data.missionDesc || '');
        setVisionTitle(data.visionTitle || '');
        setVisionDesc(data.visionDesc || '');
        setStats(Array.isArray(data.stats) ? data.stats : []);
        setFeatures(Array.isArray(data.features) ? data.features : []);
        setGalleryImages(Array.isArray(data.galleryImages) ? data.galleryImages : []);
        setShowcaseVideoUrl(data.showcaseVideoUrl || '');
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
        body: JSON.stringify({ 
          locale: editingLocale, 
          badge, 
          title, 
          subtitle, 
          heroImage, 
          heroVideo, 
          storyTitle, 
          content, 
          missionTitle, 
          missionDesc, 
          visionTitle, 
          visionDesc, 
          stats, 
          features, 
          galleryImages, 
          showcaseVideoUrl 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', msg: t('updateSuccess') || 'About page updated successfully!' });
      } else {
        setFeedback({ type: 'error', msg: data.message || 'Error saving about content' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'A network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  // Stat handlers
  const addStat = () => {
    setStats([...stats, { label: 'New Stat', value: '100+', icon: 'MdCheckCircle' }]);
  };
  const updateStat = (index: number, field: keyof StatItem, val: string) => {
    const next = [...stats];
    next[index] = { ...next[index], [field]: val };
    setStats(next);
  };
  const removeStat = (index: number) => {
    setStats(stats.filter((_, idx) => idx !== index));
  };

  // Feature handlers
  const addFeature = () => {
    setFeatures([...features, { title: 'New Core Pillar', description: 'Description of capability...', icon: 'MdCode' }]);
  };
  const updateFeature = (index: number, field: keyof FeatureItem, val: string) => {
    const next = [...features];
    next[index] = { ...next[index], [field]: val };
    setFeatures(next);
  };
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

  // Gallery handlers
  const addGalleryImage = (url: string) => {
    if (url && !galleryImages.includes(url)) {
      setGalleryImages([...galleryImages, url]);
    }
  };
  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== index));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-venecos-black">{t('manageAbout') || 'Manage About Us Page'}</h2>
            <span className="bg-venecos-gold/10 text-venecos-gold text-xs font-bold px-3 py-1 rounded-full uppercase">Dynamic Content</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">{t('manageAboutDesc') || 'Customize text, media, videos, stats, mission, and showcase gallery for all languages.'}</p>
        </div>

        <div className="flex items-center gap-3">
          <DashboardContentLocaleSelector 
            selectedLocale={editingLocale} 
            onLocaleChange={setEditingLocale} 
          />
          <a 
            href={`/${editingLocale}/about`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-2xl transition-colors"
          >
            <MdOpenInNew /> Preview Page
          </a>
        </div>
      </div>

      {feedback && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)} sx={{ borderRadius: 3 }}>
          {feedback.msg}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center p-16 bg-white rounded-3xl border border-gray-100">
          <CircularProgress sx={{ color: '#D4AF37' }} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* SECTION 1: HERO & HEADLINE */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-venecos-black flex items-center gap-2 border-b border-gray-100 pb-3">
              <MdAutoAwesome className="text-venecos-gold text-xl" />
              1. Hero Header & Headline Media
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Top Badge Pill Text</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="E.g., INNOVATION & CREATIVITY"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Hero Headline Title</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Building World-Class Digital Solutions"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Hero Subtitle / Tagline</label>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Short inspiring tagline describing Venecos platform..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <MdImage className="text-venecos-gold text-base" /> Hero Cover Image (URL or Cloudinary Upload)
                </label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mb: 2 }}
                />
                <CloudinaryUploader
                  onUploadSuccess={(url) => setHeroImage(url)}
                  currentUrl={heroImage}
                  acceptTypes="image/*"
                  label="Upload Hero Cover Image"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <MdMovie className="text-venecos-gold text-base" /> Hero Header Video (URL or Cloudinary Upload)
                </label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={heroVideo}
                  onChange={(e) => setHeroVideo(e.target.value)}
                  placeholder="Direct .mp4 link or YouTube embed link..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mb: 2 }}
                />
                <CloudinaryUploader
                  onUploadSuccess={(url) => setHeroVideo(url)}
                  currentUrl={heroVideo}
                  acceptTypes="video/*"
                  label="Upload Hero Background Video"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: OUR STORY & NARRATIVE */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-venecos-black flex items-center gap-2 border-b border-gray-100 pb-3">
              2. Company Story & Main Narrative
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Section Title</label>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="E.g., Our Journey & Story"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Story Paragraphs</label>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write company history, vision, team background..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <p className="text-xs text-gray-400 mt-1">Line breaks will be preserved when displayed on the public page.</p>
            </div>
          </div>

          {/* SECTION 3: MISSION & VISION */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-venecos-black flex items-center gap-2 border-b border-gray-100 pb-3">
              3. Mission & Vision Statements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-sm text-venecos-black">Mission Statement</h4>
                <TextField
                  fullWidth
                  size="small"
                  label="Mission Title"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  placeholder="Our Mission"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mission Description"
                  value={missionDesc}
                  onChange={(e) => setMissionDesc(e.target.value)}
                  placeholder="Empowering businesses with cutting-edge tech..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </div>

              <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-sm text-venecos-black">Vision Statement</h4>
                <TextField
                  fullWidth
                  size="small"
                  label="Vision Title"
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                  placeholder="Our Vision"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Vision Description"
                  value={visionDesc}
                  onChange={(e) => setVisionDesc(e.target.value)}
                  placeholder="Becoming the world standard for software and media..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: STATS COUNTER MANAGER */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-venecos-black flex items-center gap-2">
                <MdBarChart className="text-venecos-gold text-xl" />
                4. Key Statistics Counter Cards
              </h3>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={addStat}
                startIcon={<MdAdd />}
                sx={{ borderRadius: 9999, fontWeight: 'bold' }}
              >
                Add Stat Counter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.map((st, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 relative group">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Stat #{idx + 1}</span>
                    <button 
                      type="button"
                      onClick={() => removeStat(idx)} 
                      className="text-red-500 hover:text-red-700 p-1 text-base"
                      title="Remove Stat"
                    >
                      <MdDelete />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      size="small"
                      label="Counter Value"
                      value={st.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      placeholder="E.g., 850+"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                      size="small"
                      label="Stat Label"
                      value={st.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                      placeholder="E.g., Projects Done"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: FEATURES & CORE PILLARS */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-venecos-black flex items-center gap-2">
                <MdStar className="text-venecos-gold text-xl" />
                5. Core Capability Highlights
              </h3>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={addFeature}
                startIcon={<MdAdd />}
                sx={{ borderRadius: 9999, fontWeight: 'bold' }}
              >
                Add Feature Card
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((ft, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Pillar #{idx + 1}</span>
                    <button 
                      type="button"
                      onClick={() => removeFeature(idx)} 
                      className="text-red-500 hover:text-red-700 p-1 text-base"
                      title="Remove Feature"
                    >
                      <MdDelete />
                    </button>
                  </div>
                  <TextField
                    fullWidth
                    size="small"
                    label="Pillar Title"
                    value={ft.title}
                    onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                    placeholder="Title..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    label="Description"
                    value={ft.description}
                    onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                    placeholder="Short description..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: SHOWCASE GALLERY & VIDEO */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-venecos-black flex items-center gap-2 border-b border-gray-100 pb-3">
              <MdImage className="text-venecos-gold text-xl" />
              6. Visual Showcase (Photos & Video)
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Showcase Video URL</label>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                value={showcaseVideoUrl}
                onChange={(e) => setShowcaseVideoUrl(e.target.value)}
                placeholder="Video URL (YouTube or MP4 link)..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </div>

            <div className="space-y-4 pt-2">
              <label className="block text-xs font-bold text-gray-700">Photo Showcase Gallery</label>
              
              <CloudinaryUploader
                onUploadSuccess={(url) => addGalleryImage(url)}
                acceptTypes="image/*"
                label="Upload Photo to Showcase Gallery"
              />

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                      <img src={imgUrl} alt={`Showcase ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-md"
                        title="Delete Image"
                      >
                        <MdDelete className="text-base" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SAVE ACTION BAR */}
          <div className="sticky bottom-6 bg-venecos-black/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/10 flex justify-between items-center text-white z-50">
            <span className="text-xs font-bold text-venecos-gold px-3 py-1 bg-white/10 rounded-full uppercase">
              Locale: {editingLocale.toUpperCase()}
            </span>
            
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !title.trim()}
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <MdSave />}
              sx={{ 
                borderRadius: 9999, 
                px: 5, 
                py: 1.5, 
                fontWeight: 'extrabold', 
                bgcolor: '#D4AF37', 
                color: '#000',
                '&:hover': { bgcolor: '#FFDF00' }
              }}
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
