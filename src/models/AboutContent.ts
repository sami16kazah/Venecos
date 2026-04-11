import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAboutContent extends Document {
  locale: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutContentSchema: Schema = new Schema({
  locale: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

export default (mongoose.models.AboutContent as Model<IAboutContent>) || mongoose.model<IAboutContent>('AboutContent', AboutContentSchema);
