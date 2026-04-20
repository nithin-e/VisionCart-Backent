import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productIds: Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    productIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
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

export const Collection = mongoose.model<ICollection>('Collection', CollectionSchema);