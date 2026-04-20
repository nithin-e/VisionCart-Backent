import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../constants/statusCode.js';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  const statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = StatusCode.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}