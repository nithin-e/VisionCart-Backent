import { IBanner, BannerType } from '../../entities/banner.schema.js';
import { IBannerService } from '../interfaces/IBanner.service.js';
import { IBannerRepository } from '../../repositories/interfaces/IBanner.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { CreateBannerDto, UpdateBannerDto, BannerQueryDto } from '../../dto/banner.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

const VALID_BANNER_TYPES: BannerType[] = ['homepage', 'category', 'promotional'];

export class BannerService implements IBannerService {
  constructor(private readonly bannerRepository: IBannerRepository) {}

  async getAll(query: BannerQueryDto): Promise<PaginatedResponse<IBanner>> {
    return this.bannerRepository.findAll(query);
  }

  async getById(id: string): Promise<IBanner | null> {
    return this.bannerRepository.findById(id);
  }

  async create(data: CreateBannerDto): Promise<IBanner> {
    if (!VALID_BANNER_TYPES.includes(data.type)) {
      throw new HttpError(MESSAGES.BANNER.INVALID_TYPE(VALID_BANNER_TYPES.join(', ')), StatusCode.BAD_REQUEST);
    }

    let position = data.position;
    if (!position) {
      const maxPosition = await this.bannerRepository.getMaxPosition();
      position = maxPosition + 1;
    }

    return this.bannerRepository.create({ ...data, position });
  }

  async update(id: string, data: UpdateBannerDto): Promise<IBanner | null> {
    const existingBanner = await this.bannerRepository.findById(id);
    if (!existingBanner) {
      throw new HttpError(MESSAGES.BANNER.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (data.type && !VALID_BANNER_TYPES.includes(data.type)) {
      throw new HttpError(MESSAGES.BANNER.INVALID_TYPE(VALID_BANNER_TYPES.join(', ')), StatusCode.BAD_REQUEST);
    }

    return this.bannerRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const existingBanner = await this.bannerRepository.findById(id);
    if (!existingBanner) {
      throw new HttpError(MESSAGES.BANNER.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    return this.bannerRepository.softDelete(id);
  }
}