import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApplication extends Document {
  userId?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  message?: string;
  cvUrl: string;
  cvPublicId: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'banned';
  ipAddress?: string;
  userAgent?: string;
  banned?: boolean;
  country?: string;
  languages?: string[];
  portfolioLinks?: Array<{ title: string; url: string; verified?: boolean }>;
  documents?: Array<{ name: string; url: string; verified?: boolean }>;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  position: { 
    type: String, 
    required: true
  },
  message: { type: String },
  cvUrl: { type: String, required: true },
  cvPublicId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'accepted', 'rejected', 'banned'], 
    default: 'pending' 
  },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  banned: { type: Boolean, default: false },
  country: { type: String, default: '' },
  languages: { type: [String], default: [] },
  portfolioLinks: [{ title: String, url: String, verified: Boolean }],
  documents: [{ name: String, url: String, verified: Boolean }],
}, {
  timestamps: true
});

export default (mongoose.models.Application as Model<IApplication>) || 
  mongoose.model<IApplication>('Application', ApplicationSchema);
