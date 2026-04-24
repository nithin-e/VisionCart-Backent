import { Request, Response, NextFunction } from 'express';
import { IBrandService } from '../services/interfaces/IBrand.service.js';
import { ApiResponse } from '../types/index.js';
import { BrandQueryDto, CreateBrandDto, UpdateBrandDto } from '../dto/brand.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class BrandController {
  constructor(private readonly brandService: IBrandService) {}

  async getAll(req: Request<unknown, unknown, unknown, BrandQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await this.brandService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          brands: result.items,
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
      const brand = await this.brandService.getById(req.params.id);

      if (!brand) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BRAND.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: brand });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<unknown, unknown, CreateBrandDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const brand = await this.brandService.create(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.BRAND.CREATED, data: { _id: brand._id } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, unknown, UpdateBrandDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const brand = await this.brandService.update(req.params.id, req.body);

      if (!brand) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BRAND.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.BRAND.UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.brandService.delete(req.params.id);

      if (!deleted) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BRAND.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.BRAND.DELETED });
    } catch (error) {
      next(error);
    }
  }
}