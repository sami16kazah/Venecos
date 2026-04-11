import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  cv?: string;
  isEmailVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  roles: ('admin' | 'employee' | 'client')[];
  address?: {
    postCode: string;
    cityName: string;
    street: string;
    house: string;
  };
  provider?: string;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, 
  phoneNumber: { type: String },
  cv: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  roles: { 
    type: [String], 
    enum: ['admin', 'employee', 'client'], 
    default: ['client'] 
  },
  address: {
    postCode: { type: String },
    cityName: { type: String },
    street: { type: String },
    house: { type: String },
  },
  provider: { type: String, default: 'credentials' }
}, {
  timestamps: true
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
