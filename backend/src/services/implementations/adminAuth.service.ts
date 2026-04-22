import { Admin } from '../../entities/admin.schema';
import jwt from 'jsonwebtoken';

export class AdminAuthService {

  async login(email: string, password: string): Promise<{ token: string }> {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      'adminsecret',
      { expiresIn: '1d' }
    );

    return { token };
  }

  async changePassword(adminId: string, oldPassword: string, newPassword: string) {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new Error('Admin not found');
    }

    const isMatch = await admin.comparePassword(oldPassword);

    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    admin.password = newPassword;
    await admin.save();

    return { message: 'Password updated successfully' };
  }
};



