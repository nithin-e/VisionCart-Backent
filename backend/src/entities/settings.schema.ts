import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  supportEmail: string;
  contactPhone: string;
  currency: string;
  taxPercentage: number;
  shippingCharge: number;
  freeShippingThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      default: 'Jachi Muchi',
    },
    supportEmail: {
      type: String,
      default: 'support@jachimuchi.com',
    },
    contactPhone: {
      type: String,
      default: '9876543210',
    },
    currency: {
      type: String,
      default: 'INR',
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
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);