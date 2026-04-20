import { Request, Response, NextFunction } from 'express';
import { ICollectionService } from '../services/interfaces/ICollection.service.js';
import { ApiResponse } from '../types/index.js';
import { CollectionQueryDto, CreateCollectionDto, UpdateCollectionDto, AssignProductsDto } from '../dto/collection.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class CollectionController {
  constructor(private readonly collectionService: ICollectionService) {}

  async getAll(req: Request<unknown, unknown, unknown, CollectionQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await this.collectionService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          collections: result.items,
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
      const collection = await this.collectionService.getById(req.params.id);

      if (!collection) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.COLLECTION.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: collection });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<unknown, unknown, CreateCollectionDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const collection = await this.collectionService.create(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.COLLECTION.CREATED, data: { _id: collection._id } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, unknown, UpdateCollectionDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const collection = await this.collectionService.update(req.params.id, req.body);

      if (!collection) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.COLLECTION.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.COLLECTION.UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.collectionService.delete(req.params.id);

      if (!deleted) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.COLLECTION.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.COLLECTION.DELETED });
    } catch (error) {
      next(error);
    }
  }

  async assignProducts(req: Request<{ id: string }, unknown, AssignProductsDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.collectionService.assignProducts(req.params.id, req.body);
      res.json({ success: true, message: MESSAGES.COLLECTION.PRODUCTS_ASSIGNED });
    } catch (error) {
      next(error);
    }
  }
}