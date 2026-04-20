import { IProduct } from '../../entities/product.schema.js';
import { Product } from '../../entities/product.schema.js';
import { IProductRepository } from '../interfaces/IProduct.repository.js';
import { PaginationParams, PaginatedResponse } from '../../types/index.js';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../../dto/product.dto.js';

export class ProductRepository implements IProductRepository {
  async findAll(query: ProductQueryDto): Promise<PaginatedResponse<IProduct>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { brand: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).lean(),
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

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id).lean() as Promise<IProduct | null>;
  }

  async create(data: CreateProductDto): Promise<IProduct> {
    const product = new Product(data);
    return product.save() as Promise<IProduct>;
  }

  async update(id: string, data: UpdateProductDto): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true }).lean() as Promise<IProduct | null>;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return result !== null;
  }
}