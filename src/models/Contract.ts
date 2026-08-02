import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContract extends Document {
  serviceName: string;
  version: string;
  customClauses: {
    ar: string;
    en: string;
    fr: string;
    de: string;
  };
  requireTypedName: boolean;
  autoChatSuspensionMessages: {
    ar: string;
    en: string;
    fr: string;
    de: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema: Schema = new Schema({
  serviceName: { type: String, required: true },
  version: { type: String, default: 'v1.0' },
  customClauses: {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
  },
  requireTypedName: { type: Boolean, default: true },
  autoChatSuspensionMessages: {
    ar: { type: String, default: 'نأسف لهذا الموقف. تم تعليق المحادثة مؤقتاً ريثما تتم مراجعة النزاع من قِبل الإدارة.' },
    en: { type: String, default: 'We apologize for this situation. The chat has been temporarily suspended pending an administrative review.' },
    fr: { type: String, default: 'Nous nous excusons pour cette situation. La conversation a été suspendue temporairement.' },
    de: { type: String, default: 'Wir entschuldigen uns für diese Situation. Der Chat wurde vorübergehend gesperrt.' },
  },
}, {
  timestamps: true
});

export default (mongoose.models.Contract as Model<IContract>) || mongoose.model<IContract>('Contract', ContractSchema);
