import { ICategory } from '../../entities/category.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from '../../dto/category.dto.js';

export interface ICategoryService {
  getAll(query: CategoryQueryDto): Promise<PaginatedResponse<ICategory>>;
  getById(id: string): Promise<ICategory | null>;
  create(data: CreateCategoryDto): Promise<ICategory>;
  update(id: string, data: UpdateCategoryDto): Promise<ICategory | null>;
  delete(id: string): Promise<boolean>;
}