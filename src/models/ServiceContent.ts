import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubServiceAddon {
  title: any;
  price: number;
}

export interface ISubService {
  _id?: string;
  title: any;
  description: any;
  price: number;
  originalPrice?: number;
  badge?: any;
  priceFrom?: number;
  priceTo?: number;
  deliveryDuration?: any;
  deliveryAndRevisions?: any;
  ownershipAndRights?: any;
  image?: string;
  images?: string[];
  rating?: number;
  ratingCount?: number;
  highlights?: any;
  addons?: ISubServiceAddon[];
  deliveryEstimate?: any;
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
    title: { type: Schema.Types.Mixed, required: true },
    description: { type: Schema.Types.Mixed, default: '' },
    price: { type: Number, default: 0 },
    originalPrice: { type: Number, default: 0 },
    badge: { type: Schema.Types.Mixed, default: '' },
    priceFrom: { type: Number, default: 0 },
    priceTo: { type: Number, default: 0 },
    deliveryDuration: { type: Schema.Types.Mixed, default: '' },
    deliveryAndRevisions: { type: Schema.Types.Mixed },
    ownershipAndRights: { type: Schema.Types.Mixed },
    image: { type: String, default: '' },
    images: [{ type: String }],
    rating: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 24 },
    highlights: { type: Schema.Types.Mixed },
    addons: [{
      title: { type: Schema.Types.Mixed },
      price: { type: Number, default: 0 }
    }],
    deliveryEstimate: { type: Schema.Types.Mixed, default: '' }
  }]
}, {
  timestamps: true
});

export default (mongoose.models.ServiceContent as Model<IServiceContent>) || mongoose.model<IServiceContent>('ServiceContent', ServiceContentSchema);
