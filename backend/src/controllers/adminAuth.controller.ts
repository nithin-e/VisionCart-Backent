import { Request, Response } from 'express';
import { AdminAuthService } from '../services/implementations/adminAuth.service';
const adminAuthService = new AdminAuthService();

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await adminAuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const adminChangePassword = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin.id; // from JWT middleware
    const { oldPassword, newPassword } = req.body;

    const data = await adminAuthService.changePassword(
      adminId,
      oldPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: data.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};