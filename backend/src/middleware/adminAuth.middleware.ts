import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'adminsecret123';
    
    if (!JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    (req as any).admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};