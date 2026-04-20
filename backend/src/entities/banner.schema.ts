import mongoose, { Schema, Document } from 'mongoose';

export type BannerType = 'homepage' | 'category' | 'promotional';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;
  redirectUrl?: string;
  type: BannerType;
  position: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    redirectUrl: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: true,
      enum: ['homepage', 'category', 'promotional'],
    },
    position: {
      type: Number,
      default: 1,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
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

BannerSchema.index({ position: 1 });

export const Banner = mongoose.model<IBanner>('Banner', BannerSchema);
