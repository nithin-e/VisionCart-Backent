import { IBanner } from '../../entities/banner.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateBannerDto, UpdateBannerDto, BannerQueryDto } from '../../dto/banner.dto.js';

export interface IBannerService {
  getAll(query: BannerQueryDto): Promise<PaginatedResponse<IBanner>>;
  getById(id: string): Promise<IBanner | null>;
  create(data: CreateBannerDto): Promise<IBanner>;
  update(id: string, data: UpdateBannerDto): Promise<IBanner | null>;
  delete(id: string): Promise<boolean>;
}