import { Request, Response, NextFunction } from 'express';
import { ICategoryService } from '../services/interfaces/ICategory.service.js';
import { ApiResponse } from '../types/index.js';
import { CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class CategoryController {
  constructor(private readonly categoryService: ICategoryService) {}

  async getAll(req: Request<unknown, unknown, unknown, CategoryQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await this.categoryService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          categories: result.items,
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
      const category = await this.categoryService.getById(req.params.id);

      if (!category) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.CATEGORY.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<unknown, unknown, CreateCategoryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await this.categoryService.create(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.CATEGORY.CREATED, data: { _id: category._id, slug: category.slug } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, unknown, UpdateCategoryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await this.categoryService.update(req.params.id, req.body);

      if (!category) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.CATEGORY.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.CATEGORY.UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.categoryService.delete(req.params.id);

      if (!deleted) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.CATEGORY.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.CATEGORY.DELETED });
    } catch (error) {
      next(error);
    }
  }
}