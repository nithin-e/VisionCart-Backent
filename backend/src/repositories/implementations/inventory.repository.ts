import { IProduct } from '../../entities/product.schema.js';
import { Product } from '../../entities/product.schema.js';
import { IInventoryRepository, InventoryQueryParams } from '../interfaces/IInventory.repository.js';
import { PaginatedResponse } from '../../types/index.js';

export class InventoryRepository implements IInventoryRepository {
  async findAll(query: InventoryQueryParams): Promise<PaginatedResponse<IProduct>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.lowStock) {
      filter.stock = { $lte: 10 };
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select('_id name stock isActive')
        .sort({ stock: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return {
      items: products as unknown as IProduct[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async updateStock(productId: string, stock: number): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true }
    )
      .select('_id name stock isActive')
      .lean() as Promise<IProduct | null>;
  }
}