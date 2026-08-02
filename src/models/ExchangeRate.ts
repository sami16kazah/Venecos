import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExchangeRate extends Document {
  currencyCode: string; // e.g. USD, SAR, AED, SYP, EUR, EGP, GBP, TRY
  symbol: string;
  rateAgainstEur: number; // 1 EUR = ? Currency
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeRateSchema: Schema = new Schema({
  currencyCode: { type: String, required: true, unique: true, uppercase: true },
  symbol: { type: String, required: true },
  rateAgainstEur: { type: Number, required: true, default: 1 },
  lastUpdated: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export default (mongoose.models.ExchangeRate as Model<IExchangeRate>) || mongoose.model<IExchangeRate>('ExchangeRate', ExchangeRateSchema);
