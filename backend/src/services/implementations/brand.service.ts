import { IBrand } from '../../entities/brand.schema.js';
import { IBrandService } from '../interfaces/IBrand.service.js';
import { IBrandRepository } from '../../repositories/interfaces/IBrand.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateBrandDto, UpdateBrandDto, BrandQueryDto } from '../../dto/brand.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class BrandService implements IBrandService {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async getAll(query: BrandQueryDto): Promise<PaginatedResponse<IBrand>> {
    return this.brandRepository.findAll(query);
  }

  async getById(id: string): Promise<IBrand | null> {
    return this.brandRepository.findById(id);
  }

  async create(data: CreateBrandDto): Promise<IBrand> {
    const existingBrand = await this.brandRepository.findByName(data.name);
    if (existingBrand) {
      throw new HttpError(MESSAGES.BRAND.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }
    return this.brandRepository.create(data);
  }

  async update(id: string, data: UpdateBrandDto): Promise<IBrand | null> {
    const existingBrand = await this.brandRepository.findById(id);
    if (!existingBrand) {
      throw new HttpError(MESSAGES.BRAND.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    if (data.name && data.name !== existingBrand.name) {
      const duplicate = await this.brandRepository.findByName(data.name);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new HttpError(MESSAGES.BRAND.ALREADY_EXISTS, StatusCode.BAD_REQUEST);
      }
    }
    return this.brandRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const existingBrand = await this.brandRepository.findById(id);
    if (!existingBrand) {
      throw new HttpError(MESSAGES.BRAND.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    return this.brandRepository.delete(id);
  }
}