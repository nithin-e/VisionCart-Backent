import { Request, Response, NextFunction } from 'express';
import { IBannerService } from '../services/interfaces/IBanner.service.js';
import { ApiResponse } from '../types/index.js';
import { BannerQueryDto, CreateBannerDto, UpdateBannerDto } from '../dto/banner.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class BannerController {
  constructor(private readonly bannerService: IBannerService) {}

  async getAll(req: Request<unknown, unknown, unknown, BannerQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await this.bannerService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          banners: result.items,
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
      const banner = await this.bannerService.getById(req.params.id);

      if (!banner) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BANNER.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: banner });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<unknown, unknown, CreateBannerDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const banner = await this.bannerService.create(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.BANNER.CREATED, data: { _id: banner._id } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, unknown, UpdateBannerDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const banner = await this.bannerService.update(req.params.id, req.body);

      if (!banner) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BANNER.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.BANNER.UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.bannerService.delete(req.params.id);

      if (!deleted) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BANNER.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.BANNER.DELETED });
    } catch (error) {
      next(error);
    }
  }
}