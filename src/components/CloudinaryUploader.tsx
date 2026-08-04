'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { MdCloudUpload, MdCheckCircle, MdError, MdDelete, MdInsertDriveFile, MdPlayCircle } from 'react-icons/md';

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  currentUrl?: string;
  acceptTypes?: string; // e.g. "image/*", "video/*", ".pdf,.stl,.obj,.doc,.docx"
  label?: string;
  sublabel?: string;
  mediaType?: 'image' | 'video' | 'raw' | 'auto';
  className?: string;
}

const defaultTexts: Record<string, { label: string; sublabel: string; uploading: string; success: string; remove: string; errorFallback: string }> = {
  ar: {
    label: 'اسحب الملف هنا أو انقر للرفع عبر Cloudinary',
    sublabel: 'صور (JPG, PNG, WEBP) · فيديو (MP4) · وثائق (PDF, STL, DOC)',
    uploading: 'جاري الرفع إلى Cloudinary...',
    success: 'مرفوع بنجاح على Cloudinary',
    remove: 'حذف الملف',
    errorFallback: 'حدث خطأ أثناء الرفع',
  },
  en: {
    label: 'Drag & drop file here or click to upload via Cloudinary',
    sublabel: 'Images (JPG, PNG, WEBP) · Videos (MP4) · Documents (PDF, STL, DOC)',
    uploading: 'Uploading to Cloudinary...',
    success: 'Successfully uploaded to Cloudinary',
    remove: 'Remove File',
    errorFallback: 'An error occurred during upload',
  },
  fr: {
    label: 'Glissez-déposez le fichier ici ou cliquez pour téléverser',
    sublabel: 'Images (JPG, PNG, WEBP) · Vidéos (MP4) · Documents (PDF, STL, DOC)',
    uploading: 'Téléversement vers Cloudinary...',
    success: 'Téléversé avec succès sur Cloudinary',
    remove: 'Supprimer le fichier',
    errorFallback: 'Une erreur est survenue lors du téléversement',
  },
  de: {
    label: 'Datei hierhin ziehen oder klicken zum Hochladen',
    sublabel: 'Bilder (JPG, PNG, WEBP) · Videos (MP4) · Dokumente (PDF, STL, DOC)',
    uploading: 'Wird zu Cloudinary hochgeladen...',
    success: 'Erfolgreich zu Cloudinary hochgeladen',
    remove: 'Datei entfernen',
    errorFallback: 'Beim Hochladen ist ein Fehler aufgetreten',
  },
};

export default function CloudinaryUploader({
  onUploadSuccess,
  onRemove,
  currentUrl = '',
  acceptTypes = 'image/*,video/*,.pdf,.doc,.docx,.stl,.obj',
  label,
  sublabel,
  mediaType = 'auto',
  className = '',
}: CloudinaryUploaderProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = defaultTexts[locale] || defaultTexts['en'];

  const displayLabel = label || t.label;
  const displaySublabel = sublabel || t.sublabel;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || t.errorFallback);
      }

      const data = await res.json();
      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errorFallback);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    if (onRemove) onRemove();
    else onUploadSuccess('');
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url) || url.includes('/image/upload/');
  const isVideo = (url: string) => /\.(mp4|webm|mov|mkv)$/i.test(url) || url.includes('/video/upload/');

  return (
    <div className={`space-y-3 ${className}`}>
      {displayLabel && <label className="block text-xs font-bold text-white/80 mb-1">{displayLabel}</label>}

      {previewUrl ? (
        <div className="relative group bg-white/5 border border-venecos-gold/30 rounded-2xl overflow-hidden p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {isImage(previewUrl) ? (
              <img src={previewUrl} alt="Uploaded preview" className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0" />
            ) : isVideo(previewUrl) ? (
              <div className="w-16 h-16 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <MdPlayCircle className="text-3xl" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                <MdInsertDriveFile className="text-3xl" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                <MdCheckCircle /> {t.success}
              </div>
              <p className="text-xs text-white/60 font-mono truncate max-w-xs">{previewUrl}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all flex-shrink-0"
            title={t.remove}
          >
            <MdDelete className="text-lg" />
          </button>
        </div>
      ) : (
        <label className={`border-2 border-dashed border-white/15 hover:border-venecos-gold/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white/5 hover:bg-venecos-gold/5 block relative ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <input
            type="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <div className="space-y-2">
            <MdCloudUpload className={`text-4xl mx-auto text-venecos-gold ${uploading ? 'animate-bounce' : ''}`} />
            <div className="text-sm font-bold text-white">
              {uploading ? t.uploading : displayLabel}
            </div>
            {displaySublabel && <p className="text-xs text-white/50">{displaySublabel}</p>}
          </div>
        </label>
      )}

      {error && (
        <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
          <MdError /> {error}
        </div>
      )}
    </div>
  );
}
