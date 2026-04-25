import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'adminsecret123';
    
    if (!JWT_SECRET) {
      res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
      return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded.role) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    (req as any).admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};