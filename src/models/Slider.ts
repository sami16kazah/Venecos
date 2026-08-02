import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlider extends Document {
  title: {
    ar: string;
    en: string;
    fr: string;
    de: string;
  };
  subtitle: {
    ar: string;
    en: string;
    fr: string;
    de: string;
  };
  mediaType: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
  ytUrl?: string;
  overlayOpacity: number;
  btnText: {
    ar: string;
    en: string;
    fr: string;
    de: string;
  };
  btnUrl?: string;
  btnStyle: string;
  vPosition: string;
  textAlign: string;
  duration: number;
  order: number;
  active: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const SliderSchema: Schema = new Schema({
  title: {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
  },
  subtitle: {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
  },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  ytUrl: { type: String, default: '' },
  overlayOpacity: { type: Number, default: 50 },
  btnText: {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
  },
  btnUrl: { type: String, default: '' },
  btnStyle: { type: String, default: 'ذهبي مملوء' },
  vPosition: { type: String, default: 'وسط' },
  textAlign: { type: String, default: 'وسط' },
  duration: { type: Number, default: 5 },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  status: { type: String, default: 'منشورة' },
}, {
  timestamps: true
});

export default (mongoose.models.Slider as Model<ISlider>) || mongoose.model<ISlider>('Slider', SliderSchema);
