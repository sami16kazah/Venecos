import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPaymentStage {
  name: string;
  pct: number;
  amount: number;
  status: 'pending' | 'paid';
}

export interface IProject extends Document {
  projectNumber: string;
  orderId?: mongoose.Types.ObjectId;
  clientId?: mongoose.Types.ObjectId;
  clientName: string;
  employeeId?: mongoose.Types.ObjectId;
  employeeName: string;
  supervisorId?: mongoose.Types.ObjectId;
  supervisorName?: string;
  title: string;
  completionPercentage: number;
  totalAmount: number;
  paidAmount: number;
  paymentStages: IPaymentStage[];
  status: 'active' | 'completed' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  projectNumber: { type: String, required: true, unique: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  clientName: { type: String, required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'User' },
  employeeName: { type: String, required: true },
  supervisorId: { type: Schema.Types.ObjectId, ref: 'User' },
  supervisorName: { type: String, default: '' },
  title: { type: String, required: true },
  completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  paymentStages: [{
    name: { type: String, required: true },
    pct: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  }],
  status: { type: String, enum: ['active', 'completed', 'suspended'], default: 'active' }
}, {
  timestamps: true
});

export default (mongoose.models.Project as Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema);
