import { IBrand } from '../../entities/brand.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateBrandDto, UpdateBrandDto, BrandQueryDto } from '../../dto/brand.dto.js';

export interface IBrandService {
  getAll(query: BrandQueryDto): Promise<PaginatedResponse<IBrand>>;
  getById(id: string): Promise<IBrand | null>;
  create(data: CreateBrandDto): Promise<IBrand>;
  update(id: string, data: UpdateBrandDto): Promise<IBrand | null>;
  delete(id: string): Promise<boolean>;
}