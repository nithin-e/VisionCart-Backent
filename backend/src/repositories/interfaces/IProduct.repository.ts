import { IProduct } from '../../entities/product.schema.js';
import { PaginationParams, PaginatedResponse } from '../../types/index.js';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../../dto/product.dto.js';

export interface IProductRepository {
  findAll(query: ProductQueryDto): Promise<PaginatedResponse<IProduct>>;
  findById(id: string): Promise<IProduct | null>;
  create(data: CreateProductDto): Promise<IProduct>;
  update(id: string, data: UpdateProductDto): Promise<IProduct | null>;
  delete(id: string): Promise<boolean>;
}