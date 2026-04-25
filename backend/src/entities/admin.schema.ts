import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdmin extends Document {
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'admin',
      set: (v: string) => v || 'admin',
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (!this.role) {
      this.role = 'admin';
    }
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (!this.role) {
    this.role = 'admin';
  }
  next();
});

AdminSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);