import { IProduct } from '../../entities/product.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { InventoryQueryParams } from '../../repositories/interfaces/IInventory.repository.js';

export interface IInventoryService {
  getAll(query: InventoryQueryParams): Promise<PaginatedResponse<IProduct>>;
  updateStock(productId: string, stock: number): Promise<IProduct | null>;
}