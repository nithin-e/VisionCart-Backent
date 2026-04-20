import { Request, Response, NextFunction } from 'express';
import { IUserService } from '../services/interfaces/IUser.service.js';
import { ApiResponse } from '../types/index.js';
import { UserQueryDto, BlockUserDto } from '../dto/user.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class UserController {
  constructor(private readonly userService: IUserService) {}

  async getAll(req: Request<unknown, unknown, unknown, UserQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await this.userService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          users: result.items,
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
      const user = await this.userService.getById(req.params.id);

      if (!user) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.USER.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async block(req: Request<{ id: string }, unknown, BlockUserDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.block(req.params.id, req.body);

      if (!user) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.USER.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.USER.BLOCKED });
    } catch (error) {
      next(error);
    }
  }

  async unblock(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.unblock(req.params.id);

      if (!user) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.USER.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.USER.UNBLOCKED });
    } catch (error) {
      next(error);
    }
  }
}