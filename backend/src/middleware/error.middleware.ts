import { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public error?: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const errorMiddleware = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.error,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};