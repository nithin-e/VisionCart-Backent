import { IBlog } from '../../entities/blog.schema.js';
import { IBlogService } from '../interfaces/IBlog.service.js';
import { IBlogRepository } from '../../repositories/interfaces/IBlog.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { BlogQueryDto, CreateBlogDto, UpdateBlogDto } from '../../dto/blog.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class BlogService implements IBlogService {
  constructor(private readonly blogRepository: IBlogRepository) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  async getAll(query: BlogQueryDto): Promise<PaginatedResponse<IBlog>> {
    return this.blogRepository.findAll(query);
  }

  async getById(id: string): Promise<IBlog | null> {
    return this.blogRepository.findById(id);
  }

  async create(data: CreateBlogDto): Promise<IBlog> {
    if (!data.title || data.title.trim().length === 0) {
      throw new HttpError(MESSAGES.BLOG.TITLE_REQUIRED, StatusCode.BAD_REQUEST);
    }
    if (!data.content || data.content.trim().length === 0) {
      throw new HttpError(MESSAGES.BLOG.CONTENT_REQUIRED, StatusCode.BAD_REQUEST);
    }

    const slug = this.generateSlug(data.title);
    const existingBlog = await this.blogRepository.findBySlug(slug);
    if (existingBlog) {
      throw new HttpError(MESSAGES.BLOG.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }

    return this.blogRepository.create(data, slug);
  }

  async update(id: string, data: UpdateBlogDto): Promise<IBlog | null> {
    const existingBlog = await this.blogRepository.findById(id);
    if (!existingBlog) {
      throw new HttpError(MESSAGES.BLOG.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (data.title) {
      const slug = this.generateSlug(data.title);
      const duplicate = await this.blogRepository.findBySlug(slug);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new HttpError(MESSAGES.BLOG.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
      }
      data.title = data.title.trim();
    }

    return this.blogRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const existingBlog = await this.blogRepository.findById(id);
    if (!existingBlog) {
      throw new HttpError(MESSAGES.BLOG.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (!existingBlog.isActive) {
      throw new HttpError(MESSAGES.BLOG.ALREADY_INACTIVE, StatusCode.BAD_REQUEST);
    }

    return this.blogRepository.softDelete(id);
  }
}