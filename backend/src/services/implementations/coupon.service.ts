import { ICoupon } from '../../entities/coupon.schema.js';
import { ICouponService } from '../interfaces/ICoupon.service.js';
import { ICouponRepository } from '../../repositories/interfaces/ICoupon.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CouponQueryDto, CreateCouponDto, UpdateCouponDto } from '../../dto/coupon.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class CouponService implements ICouponService {
  constructor(private readonly couponRepository: ICouponRepository) {}

  async getAll(query: CouponQueryDto): Promise<PaginatedResponse<ICoupon>> {
    return this.couponRepository.findAll(query);
  }

  async getById(id: string): Promise<ICoupon | null> {
    return this.couponRepository.findById(id);
  }

  async create(data: CreateCouponDto): Promise<ICoupon> {
    const code = data.code.toUpperCase();
    const existingCoupon = await this.couponRepository.findByCode(code);
    if (existingCoupon) {
      throw new HttpError(MESSAGES.COUPON.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }

    if (data.discount <= 0) {
      throw new HttpError(MESSAGES.COUPON.DISCOUNT_INVALID, StatusCode.BAD_REQUEST);
    }

    const discountType = data.discountType || 'percentage';
    if (discountType === 'percentage' && (data.discount < 1 || data.discount > 100)) {
      throw new HttpError(MESSAGES.COUPON.PERCENTAGE_INVALID, StatusCode.BAD_REQUEST);
    }

    const expiryDate = new Date(data.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiryDate <= today) {
      throw new HttpError(MESSAGES.COUPON.EXPIRY_INVALID, StatusCode.BAD_REQUEST);
    }

    return this.couponRepository.create({
      ...data,
      code,
    });
  }

  async update(id: string, data: UpdateCouponDto): Promise<ICoupon | null> {
    const existingCoupon = await this.couponRepository.findById(id);
    if (!existingCoupon) {
      throw new HttpError(MESSAGES.COUPON.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (data.discount !== undefined && data.discount <= 0) {
      throw new HttpError(MESSAGES.COUPON.DISCOUNT_INVALID, StatusCode.BAD_REQUEST);
    }

    if (data.expiryDate) {
      const expiryDate = new Date(data.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate <= today) {
        throw new HttpError(MESSAGES.COUPON.EXPIRY_INVALID, StatusCode.BAD_REQUEST);
      }
    }

    if (data.code) {
      const code = data.code.toUpperCase();
      const duplicate = await this.couponRepository.findByCode(code);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new HttpError(MESSAGES.COUPON.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
      }
      data.code = code;
    }

    return this.couponRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const existingCoupon = await this.couponRepository.findById(id);
    if (!existingCoupon) {
      throw new HttpError(MESSAGES.COUPON.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    return this.couponRepository.hardDelete(id);
  }

  async hardDelete(id: string): Promise<boolean> {
    const existingCoupon = await this.couponRepository.findById(id);
    if (!existingCoupon) {
      throw new HttpError(MESSAGES.COUPON.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    return this.couponRepository.hardDelete(id);
  }
}