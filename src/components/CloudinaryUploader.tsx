'use client';

import { useState } from 'react';
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

export default function CloudinaryUploader({
  onUploadSuccess,
  onRemove,
  currentUrl = '',
  acceptTypes = 'image/*,video/*,.pdf,.doc,.docx,.stl,.obj',
  label = 'اسحب الملف هنا أو انقر للرفع عبر Cloudinary',
  sublabel = 'صور (JPG, PNG, WEBP) · فيديو (MP4) · وثائق (PDF, STL, DOC)',
  mediaType = 'auto',
  className = '',
}: CloudinaryUploaderProps) {
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
        throw new Error(errData.message || 'فشل رفع الملف إلى Cloudinary');
      }

      const data = await res.json();
      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء الرفع');
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
      {label && <label className="block text-xs font-bold text-white/80 mb-1">{label}</label>}

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
                <MdCheckCircle /> مرفوع بنجاح على Cloudinary
              </div>
              <p className="text-xs text-white/60 font-mono truncate max-w-xs">{previewUrl}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all flex-shrink-0"
            title="حذف الملف"
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
              {uploading ? 'جاري الرفع إلى Cloudinary...' : label}
            </div>
            {sublabel && <p className="text-xs text-white/50">{sublabel}</p>}
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
