import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubService {
  _id?: string;
  title: string;
  description: string;
  price: number;
  badge?: string;
  priceFrom?: number;
  priceTo?: number;
  deliveryDuration?: string;
  deliveryAndRevisions?: string[];
  ownershipAndRights?: string[];
  image?: string;
}

export interface IServiceContent extends Document {
  serviceKey?: string;
  locale: string;
  title: string;
  description: string;
  iconType: 'react-icon' | 'image';
  iconName?: string;
  iconUrl?: string;
  order: number;
  isSpecial: boolean;
  subServices: ISubService[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceContentSchema: Schema = new Schema({
  serviceKey: { type: String },
  locale: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconType: { type: String, enum: ['react-icon', 'image'], default: 'react-icon' },
  iconName: { type: String },
  iconUrl: { type: String },
  order: { type: Number, default: 0 },
  isSpecial: { type: Boolean, default: false },
  subServices: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    badge: { type: String, default: '' },
    priceFrom: { type: Number, default: 0 },
    priceTo: { type: Number, default: 0 },
    deliveryDuration: { type: String, default: '' },
    deliveryAndRevisions: [{ type: String }],
    ownershipAndRights: [{ type: String }],
    image: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

export default (mongoose.models.ServiceContent as Model<IServiceContent>) || mongoose.model<IServiceContent>('ServiceContent', ServiceContentSchema);
