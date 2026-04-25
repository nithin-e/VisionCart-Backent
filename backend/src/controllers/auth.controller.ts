import { Request, Response, NextFunction } from 'express';
import { IUserAuthService } from '../services/interfaces/IUserAuth.service.js';
import { ApiResponse } from '../types/index.js';
import { SignupDto, VerifyOtpDto, ResendOtpDto } from '../dto/auth.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class AuthController {
  constructor(private readonly authService: IUserAuthService) {}

  async signup(req: Request<unknown, unknown, SignupDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, mobile, password } = req.body;

      if (!firstName || !lastName || !email || !mobile || !password) {
        throw new Error(MESSAGES.AUTH.ALL_FIELDS_REQUIRED);
      }

      if (password.length < 6) {
        throw new Error(MESSAGES.AUTH.PASSWORD_MIN_LENGTH);
      }

      const result = await this.authService.signup(firstName, lastName, email, mobile, password);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: { email },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async verifyOTP(req: Request<unknown, unknown, VerifyOtpDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;

      const result = await this.authService.verifyOTP(email, otp);

      const response: ApiResponse = {
        success: true,
        message: MESSAGES.AUTH.ACCOUNT_CREATED,
        data: result,
      };

      res.status(StatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async resendOTP(req: Request<unknown, unknown, ResendOtpDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const result = await this.authService.resendOTP(email);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: { email },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}