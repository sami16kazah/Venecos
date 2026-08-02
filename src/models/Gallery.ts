import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
  title: {
    ar: string;
    en: string;
    fr: string;
    de: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
    de: string;
  };
  category: 'identity' | 'video' | 'software' | 'print' | 'other';
  client?: string;
  date?: string;
  order: number;
  coverImage?: string;
  images: string[];
  ytUrl?: string;
  videoUrl?: string;
  demoUrl?: string;
  screenshots: string[];
  mediaType: 'image' | 'video';
  mediaUrl?: string;
  active: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema({
  title: {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
  },
  description: {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
  },
  category: { 
    type: String, 
    enum: ['identity', 'video', 'software', 'print', 'other'], 
    default: 'other' 
  },
  client: { type: String, default: '' },
  date: { type: String, default: '' },
  order: { type: Number, default: 0 },
  coverImage: { type: String, default: '' },
  images: { type: [String], default: [] },
  ytUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  screenshots: { type: [String], default: [] },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  mediaUrl: { type: String, default: '' },
  active: { type: Boolean, default: true },
  status: { type: String, default: 'منشور' },
}, {
  timestamps: true
});

export default (mongoose.models.Gallery as Model<IGallery>) || mongoose.model<IGallery>('Gallery', GallerySchema);
