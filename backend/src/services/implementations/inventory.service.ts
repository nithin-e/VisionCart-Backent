import { IProduct } from '../../entities/product.schema.js';
import { IInventoryService } from '../interfaces/IInventory.service.js';
import { IInventoryRepository, InventoryQueryParams } from '../../repositories/interfaces/IInventory.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class InventoryService implements IInventoryService {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  async getAll(query: InventoryQueryParams): Promise<PaginatedResponse<IProduct>> {
    return this.inventoryRepository.findAll(query);
  }

  async updateStock(productId: string, stock: number): Promise<IProduct | null> {
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
      throw new HttpError(MESSAGES.INVENTORY.STOCK_INVALID, StatusCode.BAD_REQUEST);
    }

    const product = await this.inventoryRepository.updateStock(productId, stock);
    if (!product) {
      throw new HttpError(MESSAGES.INVENTORY.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    return product;
  }
}