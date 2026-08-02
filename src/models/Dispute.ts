import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDisputeTimeline {
  step: string; // 'supervisor' | 'admin' | 'legal'
  icon: string;
  color: string;
  done: boolean;
  current?: boolean;
  date: string;
  note?: string;
}

export interface IDispute extends Document {
  disputeNumber: string;
  orderId?: mongoose.Types.ObjectId;
  orderNumber?: string;
  clientId?: mongoose.Types.ObjectId;
  clientName: string;
  employeeId?: mongoose.Types.ObjectId;
  employeeName: string;
  serviceName: string;
  currentTier: 'supervisor' | 'admin' | 'legal';
  status: 'in_progress' | 'resolved_client' | 'resolved_company' | 'legal_action';
  timeline: IDisputeTimeline[];
  adminDecision?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema: Schema = new Schema({
  disputeNumber: { type: String, required: true, unique: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  orderNumber: { type: String, default: '' },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  clientName: { type: String, required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'User' },
  employeeName: { type: String, required: true },
  serviceName: { type: String, required: true },
  currentTier: { type: String, enum: ['supervisor', 'admin', 'legal'], default: 'supervisor' },
  status: { 
    type: String, 
    enum: ['in_progress', 'resolved_client', 'resolved_company', 'legal_action'], 
    default: 'in_progress' 
  },
  timeline: [{
    step: { type: String, required: true },
    icon: { type: String, default: 'fa-user-tie' },
    color: { type: String, default: 'var(--gold)' },
    done: { type: Boolean, default: false },
    current: { type: Boolean, default: false },
    date: { type: String, default: '' },
    note: { type: String, default: '' },
  }],
  adminDecision: { type: String, default: '' },
}, {
  timestamps: true
});

export default (mongoose.models.Dispute as Model<IDispute>) || mongoose.model<IDispute>('Dispute', DisputeSchema);
