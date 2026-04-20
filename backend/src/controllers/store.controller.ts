import { Request, Response, NextFunction } from 'express';
import { IStoreService } from '../services/interfaces/IStore.service.js';
import { ApiResponse } from '../types/index.js';
import { CreateStoreDto, UpdateStoreDto } from '../dto/store.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class StoreController {
  constructor(private readonly storeService: IStoreService) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stores = await this.storeService.getAll();

      const response: ApiResponse = {
        success: true,
        data: {
          stores,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const store = await this.storeService.getById(req.params.id);

      if (!store) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.STORE.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: store });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<unknown, unknown, CreateStoreDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const store = await this.storeService.create(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.STORE.CREATED, data: { _id: store._id } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, unknown, UpdateStoreDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const store = await this.storeService.update(req.params.id, req.body);

      if (!store) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.STORE.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.STORE.UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.storeService.delete(req.params.id);

      if (!deleted) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.STORE.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.STORE.DELETED });
    } catch (error) {
      next(error);
    }
  }
}