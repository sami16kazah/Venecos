import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId; // Original parent service
  subServiceId: string; // ID of the specific subservice chosen
  serviceName: string; // Snapshot of names so changes don't break history
  subServiceName: string;
  price: number;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    requirements: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  stripeCheckoutUrl?: string; // Generated upon 'accepted' state
  stripeSessionId?: string; // To verify payment status later if needed
  paymentStatus: 'unpaid' | 'paid';
  assignedId?: mongoose.Types.ObjectId; // User ID of the staff member
  assignedName?: string; // Snapshot of the staff name
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'ServiceContent', required: true },
  subServiceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  subServiceName: { type: String, required: true },
  price: { type: Number, required: true },
  customerDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    requirements: { type: String, required: true },
  },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  stripeCheckoutUrl: { type: String },
  stripeSessionId: { type: String },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  assignedId: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedName: { type: String }
}, {
  timestamps: true
});

export default (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
