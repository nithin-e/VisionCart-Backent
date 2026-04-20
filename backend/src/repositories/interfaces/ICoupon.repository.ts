import { ICoupon } from '../../entities/coupon.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CouponQueryDto, CreateCouponDto, UpdateCouponDto } from '../../dto/coupon.dto.js';

export interface ICouponRepository {
  findAll(query: CouponQueryDto): Promise<PaginatedResponse<ICoupon>>;
  findById(id: string): Promise<ICoupon | null>;
  findByCode(code: string): Promise<ICoupon | null>;
  create(data: CreateCouponDto): Promise<ICoupon>;
  update(id: string, data: UpdateCouponDto): Promise<ICoupon | null>;
  softDelete(id: string): Promise<boolean>;
}