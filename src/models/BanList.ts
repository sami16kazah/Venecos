import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanItem extends Document {
  type: 'ip' | 'email';
  value: string;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BanItemSchema: Schema = new Schema({
  type: { type: String, enum: ['ip', 'email'], required: true },
  value: { type: String, required: true },
  reason: { type: String, default: 'Suspicious activity or ban request' },
}, {
  timestamps: true
});

export default (mongoose.models.BanItem as Model<IBanItem>) || mongoose.model<IBanItem>('BanItem', BanItemSchema);
