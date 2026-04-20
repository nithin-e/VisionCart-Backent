import { ICoupon } from '../../entities/coupon.schema.js';
import { Coupon } from '../../entities/coupon.schema.js';
import { ICouponRepository } from '../interfaces/ICoupon.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CouponQueryDto, CreateCouponDto, UpdateCouponDto } from '../../dto/coupon.dto.js';

export class CouponRepository implements ICouponRepository {
  async findAll(query: CouponQueryDto): Promise<PaginatedResponse<ICoupon>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }
    if (query.expired) {
      filter.expiryDate = { $lt: new Date() };
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(filter),
    ]);

    return {
      items: coupons as unknown as ICoupon[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<ICoupon | null> {
    return Coupon.findById(id).lean() as Promise<ICoupon | null>;
  }

  async findByCode(code: string): Promise<ICoupon | null> {
    return Coupon.findOne({ code: code.toUpperCase() }).lean() as Promise<ICoupon | null>;
  }

  async create(data: CreateCouponDto): Promise<ICoupon> {
    const coupon = new Coupon(data);
    return coupon.save() as Promise<ICoupon>;
  }

  async update(id: string, data: UpdateCouponDto): Promise<ICoupon | null> {
    return Coupon.findByIdAndUpdate(id, data, { new: true }).lean() as Promise<ICoupon | null>;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Coupon.findByIdAndUpdate(id, { isActive: false }, { new: true });
    return result !== null;
  }
}