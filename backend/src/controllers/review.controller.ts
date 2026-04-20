import { Request, Response, NextFunction } from 'express';
import { IReviewService } from '../services/interfaces/IReview.service.js';
import { ApiResponse } from '../types/index.js';
import { ReviewQueryDto } from '../dto/review.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class ReviewController {
  constructor(private readonly reviewService: IReviewService) {}

  async getAll(req: Request<unknown, unknown, unknown, ReviewQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        isApproved: (req.query as Record<string, unknown>).isApproved === 'true' ? true : (req.query as Record<string, unknown>).isApproved === 'false' ? false : undefined,
        productId: (req.query as Record<string, unknown>).productId as string | undefined,
      };

      const result = await this.reviewService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          reviews: result.items,
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
      const review = await this.reviewService.getById(req.params.id);

      if (!review) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.REVIEW.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  async hide(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const hidden = await this.reviewService.hide(req.params.id);

      if (!hidden) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.REVIEW.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.REVIEW.DELETED });
    } catch (error) {
      next(error);
    }
  }
}