import { Request, Response } from 'express';
import { AdminAuthService } from '../services/implementations/adminAuth.service';

const adminAuthService = new AdminAuthService();

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const data = await adminAuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid credentials',
    });
  }
};

export const adminChangePassword = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin?.adminId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    const data = await adminAuthService.changePassword(adminId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: data.message,
    });
  } catch (error: any) {
    const status = error.message.includes('Invalid credentials') ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to update password',
    });
  }
};