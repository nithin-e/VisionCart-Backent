import { Request, Response, NextFunction } from 'express';
import { INotificationService } from '../services/interfaces/INotification.service.js';
import { ApiResponse } from '../types/index.js';
import { NotificationQueryDto, CreateNotificationDto } from '../dto/notification.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class NotificationController {
  constructor(private readonly notificationService: INotificationService) {}

  async getAll(req: Request<unknown, unknown, unknown, NotificationQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        userId: (req.query as Record<string, unknown>).userId as string | undefined,
        isRead: (req.query as Record<string, unknown>).isRead === 'true' ? true : (req.query as Record<string, unknown>).isRead === 'false' ? false : undefined,
      };

      const result = await this.notificationService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          notifications: result.items,
          pagination: result.pagination,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async send(req: Request<unknown, unknown, CreateNotificationDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.notificationService.send(req.body);
      res.json({ success: true, message: MESSAGES.NOTIFICATION.SENT });
    } catch (error) {
      next(error);
    }
  }
}