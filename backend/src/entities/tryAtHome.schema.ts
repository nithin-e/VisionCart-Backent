import mongoose, { Schema, Document } from 'mongoose';

export type TryAtHomeStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface ITryAtHome extends Document {
  userId: string;
  productIds: string[];
  addressId: string;
  date: Date;
  status: TryAtHomeStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TryAtHomeSchema = new Schema<ITryAtHome>(
  {
    userId: {
      type: String,
      required: true,
    },
    productIds: {
      type: [String],
      required: true,
      default: [],
    },
    addressId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

TryAtHomeSchema.index({ status: 1 });
TryAtHomeSchema.index({ createdAt: -1 });

export const TryAtHome = mongoose.model<ITryAtHome>('TryAtHome', TryAtHomeSchema);