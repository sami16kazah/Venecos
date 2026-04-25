import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // Recipient
  title: string;
  message: string;
  link: string; // URL to redirect
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default (mongoose.models.Notification as Model<INotification>) || mongoose.model<INotification>('Notification', NotificationSchema);
