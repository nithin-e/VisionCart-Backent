import { Request, Response, NextFunction } from 'express';
import { ITryAtHomeService } from '../services/interfaces/ITryAtHome.service.js';
import { ApiResponse } from '../types/index.js';
import { TryAtHomeQueryDto, UpdateStatusDto } from '../dto/tryAtHome.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class TryAtHomeController {
  constructor(private readonly tryAtHomeService: ITryAtHomeService) {}

  async getAll(req: Request<unknown, unknown, unknown, TryAtHomeQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        status: (req.query as Record<string, unknown>).status as TryAtHomeQueryDto['status'],
      };

      const result = await this.tryAtHomeService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          bookings: result.items,
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
      const booking = await this.tryAtHomeService.getById(req.params.id);

      if (!booking) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.TRY_AT_HOME.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request<{ id: string }, unknown, UpdateStatusDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await this.tryAtHomeService.updateStatus(req.params.id, req.body);

      if (!booking) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.TRY_AT_HOME.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.TRY_AT_HOME.UPDATED });
    } catch (error) {
      next(error);
    }
  }
}