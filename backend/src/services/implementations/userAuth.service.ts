import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../entities/user.schema.js';
import { redis, OTP_TTL, getSignupKey, getOtpRequestKey, MAX_OTP_REQUESTS, OTP_REQUEST_WINDOW } from '../../config/redis.js';
import { sendOTPEmail, sendWelcomeEmail } from '../../config/mailer.js';
import { IUserAuthService } from '../interfaces/IUserAuth.service.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

const JWT_SECRET = process.env.JWT_SECRET || 'usersecret123';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  otp: string;
}

const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export class UserAuthService implements IUserAuthService {
  async signup(firstName: string, lastName: string, email: string, mobile: string, password: string): Promise<{ message: string }> {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new HttpError(MESSAGES.AUTH.USER_EXISTS, StatusCode.CONFLICT);
    }

    const otpRequestKey = getOtpRequestKey(email.toLowerCase());
    const requestCount = await redis.get(otpRequestKey);
    if (requestCount && parseInt(requestCount) >= MAX_OTP_REQUESTS) {
      throw new HttpError(MESSAGES.AUTH.OTP_LIMIT_EXCEEDED, StatusCode.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();

    const signupData: SignupData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      otp,
    };

    const signupKey = getSignupKey(email.toLowerCase());
    await redis.setex(signupKey, OTP_TTL, JSON.stringify(signupData));

    await redis.incr(otpRequestKey);
    if (!requestCount) {
      await redis.setex(otpRequestKey, OTP_REQUEST_WINDOW, '1');
    }

    await sendOTPEmail(email.toLowerCase(), otp, firstName);

    return { message: MESSAGES.AUTH.OTP_SENT };
  }

  async verifyOTP(email: string, otp: string): Promise<{ token: string; user: { id: string; email: string; firstName: string; lastName: string } }> {
    const signupKey = getSignupKey(email.toLowerCase());
    const signupDataStr = await redis.get(signupKey);

    if (!signupDataStr) {
      throw new HttpError(MESSAGES.AUTH.OTP_EXPIRED, StatusCode.BAD_REQUEST);
    }

    const signupData: SignupData = JSON.parse(signupDataStr);

    if (signupData.otp !== otp) {
      throw new HttpError(MESSAGES.AUTH.OTP_INCORRECT, StatusCode.BAD_REQUEST);
    }

    const user = new User({
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      mobile: signupData.mobile,
      password: signupData.password,
      isVerified: true,
    });

    await user.save();
    await redis.del(signupKey);

    await sendWelcomeEmail(signupData.email, signupData.firstName);

    const token = jwt.sign(
      { userId: user._id.toString(), role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async resendOTP(email: string): Promise<{ message: string }> {
    const signupKey = getSignupKey(email.toLowerCase());
    const signupDataStr = await redis.get(signupKey);

    if (!signupDataStr) {
      throw new HttpError(MESSAGES.AUTH.NO_PENDING_SIGNUP, StatusCode.BAD_REQUEST);
    }

    const signupData: SignupData = JSON.parse(signupDataStr);

    const otpRequestKey = getOtpRequestKey(email.toLowerCase());
    const requestCount = await redis.get(otpRequestKey);
    if (requestCount && parseInt(requestCount) >= MAX_OTP_REQUESTS) {
      throw new HttpError(MESSAGES.AUTH.OTP_LIMIT_EXCEEDED, StatusCode.BAD_REQUEST);
    }

    const newOTP = generateOTP();
    signupData.otp = newOTP;

    await redis.setex(signupKey, OTP_TTL, JSON.stringify(signupData));
    await redis.incr(otpRequestKey);

    await sendOTPEmail(signupData.email, newOTP, signupData.firstName);

    return { message: MESSAGES.AUTH.OTP_RESENT };
  }
}