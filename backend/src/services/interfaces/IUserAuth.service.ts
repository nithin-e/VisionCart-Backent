export interface IUserAuthService {
  signup(firstName: string, lastName: string, email: string, mobile: string, password: string): Promise<{ message: string }>;
  verifyOTP(email: string, otp: string): Promise<{ token: string; user: { id: string; email: string; firstName: string; lastName: string } }>;
  resendOTP(email: string): Promise<{ message: string }>;
}