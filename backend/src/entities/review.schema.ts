import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ isApproved: 1 });
ReviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);