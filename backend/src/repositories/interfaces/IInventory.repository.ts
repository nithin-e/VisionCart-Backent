import { IProduct } from '../../entities/product.schema.js';
import { PaginatedResponse } from '../../types/index.js';

export interface InventoryQueryParams {
  page?: number;
  limit?: number;
  lowStock?: boolean;
  isActive?: boolean;
}

export interface UpdateStockDto {
  stock: number;
}

export interface IInventoryRepository {
  findAll(query: InventoryQueryParams): Promise<PaginatedResponse<IProduct>>;
  updateStock(productId: string, stock: number): Promise<IProduct | null>;
}