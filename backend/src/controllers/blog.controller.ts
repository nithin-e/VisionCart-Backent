import { Request, Response, NextFunction } from 'express';
import { IBlogService } from '../services/interfaces/IBlog.service.js';
import { ApiResponse } from '../types/index.js';
import { BlogQueryDto, CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto.js';
import { MESSAGES } from '../constants/messages.constant.js';
import { StatusCode } from '../constants/statusCode.js';

export class BlogController {
  constructor(private readonly blogService: IBlogService) {}

  async getAll(req: Request<unknown, unknown, unknown, BlogQueryDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        isActive: (req.query as Record<string, unknown>).isActive === 'true' ? true : (req.query as Record<string, unknown>).isActive === 'false' ? false : undefined,
      };

      const result = await this.blogService.getAll(query);

      const response: ApiResponse = {
        success: true,
        data: {
          blogs: result.items,
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
      const blog = await this.blogService.getById(req.params.id);

      if (!blog) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BLOG.NOT_FOUND });
        return;
      }

      res.json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<unknown, unknown, CreateBlogDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await this.blogService.create(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.BLOG.CREATED, data: { _id: blog._id, slug: blog.slug } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, unknown, UpdateBlogDto>, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await this.blogService.update(req.params.id, req.body);

      if (!blog) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BLOG.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.BLOG.UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.blogService.delete(req.params.id);

      if (!deleted) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.BLOG.NOT_FOUND });
        return;
      }

      res.json({ success: true, message: MESSAGES.BLOG.DELETED });
    } catch (error) {
      next(error);
    }
  }
}