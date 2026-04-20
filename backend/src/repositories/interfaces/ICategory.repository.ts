import { ICategory } from '../../entities/category.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from '../../dto/category.dto.js';

export interface ICategoryRepository {
  findAll(query: CategoryQueryDto): Promise<PaginatedResponse<ICategory>>;
  findById(id: string): Promise<ICategory | null>;
  findBySlug(slug: string): Promise<ICategory | null>;
  create(data: CreateCategoryDto, slug: string): Promise<ICategory>;
  update(id: string, data: UpdateCategoryDto, newSlug?: string): Promise<ICategory | null>;
  softDelete(id: string): Promise<boolean>;
}