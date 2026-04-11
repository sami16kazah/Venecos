import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJobRole extends Document {
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobRoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
}, {
  timestamps: true
});

export default (mongoose.models.JobRole as Model<IJobRole>) || 
  mongoose.model<IJobRole>('JobRole', JobRoleSchema);
