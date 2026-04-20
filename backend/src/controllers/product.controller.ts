import { Request, Response, NextFunction } from 'express';
import { IProductService } from '../services/interfaces/IProduct.service.js';
import { ApiResponse } from '../types/index.js';
import { ProductQueryDto, CreateProductDto, UpdateProductDto } from '../dto/product.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class ProductController {
  constructor(private readonly productService: IProductService) {}

  async getAll(req: Request<unknown, unknown, unknown, ProductQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        search: req.query.search,
      };

      const result = await this.productService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          products: result.items,
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
      const product = await this.productService.getById(req.params.id);

      if (!product) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.PRODUCT.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<unknown, unknown, CreateProductDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.create(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.PRODUCT.CREATED, data: { _id: product._id } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, unknown, UpdateProductDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.update(req.params.id, req.body);

      if (!product) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.PRODUCT.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.PRODUCT.UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.productService.delete(req.params.id);

      if (!deleted) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.PRODUCT.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.PRODUCT.DELETED });
    } catch (error) {
      next(error);
    }
  }
}