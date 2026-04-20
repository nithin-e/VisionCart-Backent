import { IBlog } from '../../entities/blog.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { BlogQueryDto, CreateBlogDto, UpdateBlogDto } from '../../dto/blog.dto.js';

export interface IBlogRepository {
  findAll(query: BlogQueryDto): Promise<PaginatedResponse<IBlog>>;
  findById(id: string): Promise<IBlog | null>;
  findBySlug(slug: string): Promise<IBlog | null>;
  create(data: CreateBlogDto, slug: string): Promise<IBlog>;
  update(id: string, data: UpdateBlogDto): Promise<IBlog | null>;
  softDelete(id: string): Promise<boolean>;
}