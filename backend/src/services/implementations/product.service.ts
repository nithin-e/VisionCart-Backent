import { IProduct } from '../../entities/product.schema.js';
import { IProductService } from '../interfaces/IProduct.service.js';
import { IProductRepository } from '../../repositories/interfaces/IProduct.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../../dto/product.dto.js';

export class ProductService implements IProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async getAll(query: ProductQueryDto): Promise<PaginatedResponse<IProduct>> {
    return this.productRepository.findAll(query);
  }

  async getById(id: string): Promise<IProduct | null> {
    return this.productRepository.findById(id);
  }

  async create(data: CreateProductDto): Promise<IProduct> {
    return this.productRepository.create(data);
  }

  async update(id: string, data: UpdateProductDto): Promise<IProduct | null> {
    return this.productRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}