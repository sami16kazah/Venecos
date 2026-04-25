import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage extends Document {
  orderId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  text: string;
  isPaymentLink: boolean;
  createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  isPaymentLink: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default (mongoose.models.ChatMessage as Model<IChatMessage>) || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
