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
  imageUrl: string;
  linkUrl?: string;
  order: number;
  active: boolean;
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
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default (mongoose.models.Slider as Model<ISlider>) || mongoose.model<ISlider>('Slider', SliderSchema);
