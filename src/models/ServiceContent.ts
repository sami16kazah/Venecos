import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubService {
  _id?: string;
  title: string;
  description: string;
  price: number;
}

export interface IServiceContent extends Document {
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
    description: { type: String, required: true },
    price: { type: Number, required: true }
  }]
}, {
  timestamps: true
});

export default (mongoose.models.ServiceContent as Model<IServiceContent>) || mongoose.model<IServiceContent>('ServiceContent', ServiceContentSchema);
