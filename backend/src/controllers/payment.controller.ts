import { Request, Response, NextFunction } from 'express';
import { IPaymentService } from '../services/interfaces/IPayment.service.js';
import { ApiResponse } from '../types/index.js';
import { PaymentQueryDto } from '../dto/payment.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class PaymentController {
  constructor(private readonly paymentService: IPaymentService) {}

  async getAll(req: Request<unknown, unknown, unknown, PaymentQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        status: req.query.status as PaymentQueryDto['status'],
        paymentMethod: req.query.paymentMethod as PaymentQueryDto['paymentMethod'],
      };

      const result = await this.paymentService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          payments: result.items,
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
      const payment = await this.paymentService.getById(req.params.id);

      if (!payment) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.PAYMENT.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }
}