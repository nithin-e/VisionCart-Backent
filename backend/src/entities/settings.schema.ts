import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  supportEmail: string;
  contactPhone: string;
  currency: string;
  currencySymbol: string;
  taxPercentage: number;
  shippingCharge: number;
  freeShippingThreshold: number;
  minOrderAmount: number;
  maxOrderAmount: number;
  refundDays: number;
  storeAddress: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      default: 'Vision Cart',
    },
    supportEmail: {
      type: String,
      default: 'support@visioncart.com',
    },
    contactPhone: {
      type: String,
      default: '9876543210',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },
    taxPercentage: {
      type: Number,
      default: 5,
    },
    shippingCharge: {
      type: Number,
      default: 50,
    },
    freeShippingThreshold: {
      type: Number,
      default: 1000,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxOrderAmount: {
      type: Number,
      default: 50000,
    },
    refundDays: {
      type: Number,
      default: 7,
    },
    storeAddress: {
      type: String,
      default: '',
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);