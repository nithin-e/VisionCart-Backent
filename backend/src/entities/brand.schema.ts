import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

BrandSchema.index({ name: 1 });
BrandSchema.index({ isActive: 1 });

export const Brand = mongoose.model<IBrand>('Brand', BrandSchema);