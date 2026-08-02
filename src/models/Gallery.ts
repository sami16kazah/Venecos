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
  mediaType: 'image' | 'video';
  mediaUrl: string;
  active: boolean;
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
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  mediaUrl: { type: String, required: true },
  active: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default (mongoose.models.Gallery as Model<IGallery>) || mongoose.model<IGallery>('Gallery', GallerySchema);
