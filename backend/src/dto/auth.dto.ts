export interface SignupDto {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ResendOtpDto {
  email: string;
}