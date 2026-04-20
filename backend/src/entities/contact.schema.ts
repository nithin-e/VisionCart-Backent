import mongoose, { Schema, Document } from 'mongoose';

export type ContactStatus = 'pending' | 'replied';

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  reply?: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
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
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'replied'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);