import { Request, Response, NextFunction } from 'express';
import { IContactService } from '../services/interfaces/IContact.service.js';
import { ApiResponse } from '../types/index.js';
import { ContactQueryDto, ReplyDto } from '../dto/contact.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class ContactController {
  constructor(private readonly contactService: IContactService) {}

  async getAll(req: Request<unknown, unknown, unknown, ContactQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        status: (req.query as Record<string, unknown>).status as ContactQueryDto['status'],
      };

      const result = await this.contactService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          messages: result.items,
          pagination: result.pagination,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async replyToMessage(req: Request<{ id: string }, unknown, ReplyDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await this.contactService.replyToMessage(req.params.id, req.body);

      if (!message) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.CONTACT.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.CONTACT.REPLY_SENT });
    } catch (error) {
      next(error);
    }
  }
}