import { IBanner } from '../../entities/banner.schema.js';
import { Banner } from '../../entities/banner.schema.js';
import { IBannerRepository } from '../interfaces/IBanner.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateBannerDto, UpdateBannerDto, BannerQueryDto } from '../../dto/banner.dto.js';

export class BannerRepository implements IBannerRepository {
  async findAll(query: BannerQueryDto): Promise<PaginatedResponse<IBanner>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [banners, total] = await Promise.all([
      Banner.find().sort({ position: 1 }).skip(skip).limit(limit).lean(),
      Banner.countDocuments(),
    ]);

    return {
      items: banners as unknown as IBanner[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IBanner | null> {
    return Banner.findById(id).lean() as Promise<IBanner | null>;
  }

  async create(data: CreateBannerDto): Promise<IBanner> {
    const banner = new Banner(data);
    return banner.save() as Promise<IBanner>;
  }

  async update(id: string, data: UpdateBannerDto): Promise<IBanner | null> {
    return Banner.findByIdAndUpdate(id, data, { new: true }).lean() as Promise<IBanner | null>;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Banner.findByIdAndUpdate(id, { isActive: false }, { new: true });
    return result !== null;
  }

  async getMaxPosition(): Promise<number> {
    const maxBanner = await Banner.findOne().sort({ position: -1 }).select('position').lean();
    return maxBanner ? maxBanner.position : 0;
  }
}