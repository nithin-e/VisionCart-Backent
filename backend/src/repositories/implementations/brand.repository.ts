import { IBrand, Brand } from '../../entities/brand.schema.js';
import { IBrandRepository } from '../interfaces/IBrand.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateBrandDto, UpdateBrandDto, BrandQueryDto } from '../../dto/brand.dto.js';

export class BrandRepository implements IBrandRepository {
  async findAll(query: BrandQueryDto): Promise<PaginatedResponse<IBrand>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
      Brand.find({ isActive: true }).skip(skip).limit(limit).lean(),
      Brand.countDocuments({ isActive: true }),
    ]);

    return {
      items: brands as unknown as IBrand[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IBrand | null> {
    return Brand.findById(id).lean() as Promise<IBrand | null>;
  }

  async findByName(name: string): Promise<IBrand | null> {
    return Brand.findOne({ name }).lean() as Promise<IBrand | null>;
  }

  async create(data: CreateBrandDto): Promise<IBrand> {
    const brand = new Brand({
      name: data.name,
      description: data.description || '',
      logo: data.logo || '',
    });
    return brand.save() as Promise<IBrand>;
  }

  async update(id: string, data: UpdateBrandDto): Promise<IBrand | null> {
    return Brand.findByIdAndUpdate(id, data, { new: true }).lean() as Promise<IBrand | null>;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Brand.findByIdAndDelete(id);
    return result !== null;
  }
}