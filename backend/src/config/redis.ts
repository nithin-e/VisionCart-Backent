import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL);

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export const OTP_TTL = 300;
export const SIGNUP_PREFIX = 'signup:';
export const OTP_REQUEST_PREFIX = 'otp_requests:';
export const MAX_OTP_REQUESTS = 3;
export const OTP_REQUEST_WINDOW = 300;

export const getSignupKey = (email: string) => `${SIGNUP_PREFIX}${email}`;
export const getOtpRequestKey = (email: string) => `${OTP_REQUEST_PREFIX}${email}`;