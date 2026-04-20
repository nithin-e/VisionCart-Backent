import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  lat: number;
  lng: number;
  location: {
    type: string;
    coordinates: number[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
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

StoreSchema.index({ location: '2dsphere' });

export const Store = mongoose.model<IStore>('Store', StoreSchema);