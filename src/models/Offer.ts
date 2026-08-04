import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOffer extends Document {
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
  originalPrice: number;
  discountedPrice: number;
  badge?: {
    ar: string;
    en: string;
    fr: string;
    de: string;
  } | string;
  features: Array<{
    ar: string;
    en: string;
    fr: string;
    de: string;
  }>;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema = new Schema({
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
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  badge: { type: Schema.Types.Mixed, default: '' },
  features: [{
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
  }],
  active: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default (mongoose.models.Offer as Model<IOffer>) || mongoose.model<IOffer>('Offer', OfferSchema);
