import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  countryCode: string; // DE, AE, SY, SA, etc.
  countryName: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  workingHours: Array<{
    days: string;
    from: string;
    to: string;
  }>;
  googleMapsUrl?: string;
  status: 'active' | 'temporarily_closed' | 'coming_soon';
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema: Schema = new Schema({
  name: { type: String, required: true },
  countryCode: { type: String, required: true },
  countryName: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  workingHours: [{
    days: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
  }],
  googleMapsUrl: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['active', 'temporarily_closed', 'coming_soon'], 
    default: 'active' 
  },
}, {
  timestamps: true
});

export default (mongoose.models.Branch as Model<IBranch>) || mongoose.model<IBranch>('Branch', BranchSchema);
