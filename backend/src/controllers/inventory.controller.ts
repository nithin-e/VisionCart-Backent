import { Request, Response, NextFunction } from 'express';
import { IInventoryService } from '../services/interfaces/IInventory.service.js';
import { ApiResponse } from '../types/index.js';
import { InventoryQueryParams } from '../repositories/interfaces/IInventory.repository.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

interface UpdateStockBody {
  stock: number;
}

export class InventoryController {
  constructor(private readonly inventoryService: IInventoryService) {}

  async getAll(req: Request<unknown, unknown, unknown, InventoryQueryParams>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        lowStock: (req.query as Record<string, unknown>).lowStock === 'true',
        isActive: (req.query as Record<string, unknown>).isActive === 'true' ? true : (req.query as Record<string, unknown>).isActive === 'false' ? false : undefined,
      };

      const result = await this.inventoryService.getAll(query);

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

  async updateStock(req: Request<{ productId: string }, unknown, UpdateStockBody>, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.inventoryService.updateStock(req.params.productId, req.body.stock);
      res.json({ success: true, message: MESSAGES.INVENTORY.UPDATED });
    } catch (error) {
      next(error);
    }
  }
}