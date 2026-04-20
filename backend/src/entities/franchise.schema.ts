import mongoose, { Schema, Document } from 'mongoose';

export type FranchiseStatus = 'pending' | 'approved' | 'rejected';

export interface IFranchise extends Document {
  name: string;
  email: string;
  phone: string;
  city: string;
  status: FranchiseStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FranchiseSchema = new Schema<IFranchise>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

FranchiseSchema.index({ status: 1 });
FranchiseSchema.index({ createdAt: -1 });

export const Franchise = mongoose.model<IFranchise>('Franchise', FranchiseSchema);