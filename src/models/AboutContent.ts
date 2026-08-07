import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface IFeatureItem {
  title: string;
  description: string;
  image?: string;
  icon?: string;
}

export interface IAboutContent extends Document {
  locale: string;
  badge?: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroVideo?: string;
  content: string;
  storyTitle?: string;
  missionTitle?: string;
  missionDesc?: string;
  visionTitle?: string;
  visionDesc?: string;
  stats?: IStatItem[];
  features?: IFeatureItem[];
  galleryImages?: string[];
  showcaseVideoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StatItemSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: '' },
}, { _id: false });

const FeatureItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  icon: { type: String, default: '' },
}, { _id: false });

const AboutContentSchema: Schema = new Schema({
  locale: { type: String, required: true, unique: true },
  badge: { type: String, default: 'VENECOS PLATFORM' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  heroImage: { type: String, default: '' },
  heroVideo: { type: String, default: '' },
  content: { type: String, required: true },
  storyTitle: { type: String, default: '' },
  missionTitle: { type: String, default: '' },
  missionDesc: { type: String, default: '' },
  visionTitle: { type: String, default: '' },
  visionDesc: { type: String, default: '' },
  stats: { type: [StatItemSchema], default: [] },
  features: { type: [FeatureItemSchema], default: [] },
  galleryImages: { type: [String], default: [] },
  showcaseVideoUrl: { type: String, default: '' },
}, {
  timestamps: true
});

export default (mongoose.models.AboutContent as Model<IAboutContent>) || mongoose.model<IAboutContent>('AboutContent', AboutContentSchema);
