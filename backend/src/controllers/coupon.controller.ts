import { Request, Response, NextFunction } from 'express';
import { ICouponService } from '../services/interfaces/ICoupon.service.js';
import { ApiResponse } from '../types/index.js';
import { CouponQueryDto, CreateCouponDto, UpdateCouponDto } from '../dto/coupon.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class CouponController {
  constructor(private readonly couponService: ICouponService) {}

  async getAll(req: Request<unknown, unknown, unknown, CouponQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        isActive: (req.query as Record<string, unknown>).isActive === 'true' ? true : (req.query as Record<string, unknown>).isActive === 'false' ? false : undefined,
        expired: (req.query as Record<string, unknown>).expired === 'true',
      };

      const result = await this.couponService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          coupons: result.items,
          pagination: result.pagination,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await this.couponService.getById(req.params.id);

      if (!coupon) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.COUPON.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<unknown, unknown, CreateCouponDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await this.couponService.create(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.COUPON.CREATED, data: { _id: coupon._id } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, unknown, UpdateCouponDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await this.couponService.update(req.params.id, req.body);

      if (!coupon) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.COUPON.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.COUPON.UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.couponService.delete(req.params.id);

      if (!deleted) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.COUPON.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.COUPON.DELETED });
    } catch (error) {
      next(error);
    }
  }
}