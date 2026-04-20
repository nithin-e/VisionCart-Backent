import { IBanner } from '../../entities/banner.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateBannerDto, UpdateBannerDto, BannerQueryDto } from '../../dto/banner.dto.js';

export interface IBannerRepository {
  findAll(query: BannerQueryDto): Promise<PaginatedResponse<IBanner>>;
  findById(id: string): Promise<IBanner | null>;
  create(data: CreateBannerDto): Promise<IBanner>;
  update(id: string, data: UpdateBannerDto): Promise<IBanner | null>;
  softDelete(id: string): Promise<boolean>;
  getMaxPosition(): Promise<number>;
}