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
  status: 'pending' | 'accepted' | 'rejected';
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
    required: true,
    enum: ['Developer', 'UI/UX Designer', 'Video Editor', 'Project Manager']
  },
  message: { type: String },
  cvUrl: { type: String, required: true },
  cvPublicId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
}, {
  timestamps: true
});

export default (mongoose.models.Application as Model<IApplication>) || 
  mongoose.model<IApplication>('Application', ApplicationSchema);
