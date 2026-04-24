import { Admin } from '../../entities/admin.schema';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'adminsecret';

const validatePassword = (password: string): boolean => {
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasNumber && hasSpecial;
};

export class AdminAuthService {
  async login(email: string, password: string): Promise<{ token: string; admin: { id: string; email: string } }> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      token,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
      },
    };
  }

  async changePassword(adminId: string, oldPassword: string, newPassword: string) {
    if (!oldPassword || !newPassword) {
      throw new Error('Current password and new password are required');
    }

    if (!validatePassword(newPassword)) {
      throw new Error('Password must be at least 8 characters with 1 number and 1 special character');
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new Error('Admin not found');
    }

    const isMatch = await admin.comparePassword(oldPassword);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    admin.password = newPassword;
    await admin.save();

    return { message: 'Password updated successfully' };
  }
}



