import { Request, Response, NextFunction } from 'express';
import { IFranchiseService } from '../services/interfaces/IFranchise.service.js';
import { ApiResponse } from '../types/index.js';
import { FranchiseQueryDto, UpdateStatusDto } from '../dto/franchise.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class FranchiseController {
  constructor(private readonly franchiseService: IFranchiseService) {}

  async getAll(req: Request<unknown, unknown, unknown, FranchiseQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        status: (req.query as Record<string, unknown>).status as FranchiseQueryDto['status'],
      };

      const result = await this.franchiseService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          applications: result.items,
          pagination: result.pagination,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request<{ id: string }, unknown, UpdateStatusDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const application = await this.franchiseService.updateStatus(req.params.id, req.body);

      if (!application) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.FRANCHISE.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.FRANCHISE.UPDATED });
    } catch (error) {
      next(error);
    }
  }
}