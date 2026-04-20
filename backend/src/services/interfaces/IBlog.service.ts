import { IBlog } from '../../entities/blog.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { BlogQueryDto, CreateBlogDto, UpdateBlogDto } from '../../dto/blog.dto.js';

export interface IBlogService {
  getAll(query: BlogQueryDto): Promise<PaginatedResponse<IBlog>>;
  getById(id: string): Promise<IBlog | null>;
  create(data: CreateBlogDto): Promise<IBlog>;
  update(id: string, data: UpdateBlogDto): Promise<IBlog | null>;
  delete(id: string): Promise<boolean>;
}