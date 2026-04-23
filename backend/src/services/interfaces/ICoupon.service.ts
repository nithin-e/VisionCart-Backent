import { ICoupon } from '../../entities/coupon.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CouponQueryDto, CreateCouponDto, UpdateCouponDto } from '../../dto/coupon.dto.js';

export interface ICouponService {
  getAll(query: CouponQueryDto): Promise<PaginatedResponse<ICoupon>>;
  getById(id: string): Promise<ICoupon | null>;
  create(data: CreateCouponDto): Promise<ICoupon>;
  update(id: string, data: UpdateCouponDto): Promise<ICoupon | null>;
  delete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
}