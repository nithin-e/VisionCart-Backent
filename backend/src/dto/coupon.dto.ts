import { DiscountType } from '../entities/coupon.schema.js';

export interface CouponQueryDto {
  page?: number;
  limit?: number;
  isActive?: boolean;
  expired?: boolean;
}

export interface CreateCouponDto {
  code: string;
  discount: number;
  discountType?: DiscountType;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: Date;
  usageLimit?: number;
}

export interface UpdateCouponDto {
  code?: string;
  discount?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: Date;
  isActive?: boolean;
  usageLimit?: number;
}