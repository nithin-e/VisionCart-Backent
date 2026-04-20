import { Request, Response, NextFunction } from 'express';
import { IOrderService } from '../services/interfaces/IOrder.service.js';
import { ApiResponse } from '../types/index.js';
import { OrderQueryDto, UpdateStatusDto, RefundOrderDto } from '../dto/order.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class OrderController {
  constructor(private readonly orderService: IOrderService) {}

  async getAll(req: Request<unknown, unknown, unknown, OrderQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        status: req.query.status as OrderQueryDto['status'],
      };

      const result = await this.orderService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          orders: result.items,
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
      const order = await this.orderService.getById(req.params.id);

      if (!order) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.ORDER.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request<{ id: string }, unknown, UpdateStatusDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await this.orderService.updateStatus(req.params.id, req.body);

      if (!order) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.ORDER.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.ORDER.STATUS_UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async refund(req: Request<{ id: string }, unknown, RefundOrderDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await this.orderService.refund(req.params.id, req.body);

      if (!order) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.ORDER.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.ORDER.REFUND_PROCESSED });
    } catch (error) {
      next(error);
    }
  }

  async getTracking(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await this.orderService.getTracking(req.params.id);

      if (!order) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.ORDER.NOT_FOUND });
        return;
      }

      res.json({
        success: true,
        data: {
          status: order.status,
          timeline: order.statusTimeline,
          estimatedDelivery: order.estimatedDelivery,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}