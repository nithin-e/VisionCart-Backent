import { BannerType } from '../entities/banner.schema.js';

export interface CreateBannerDto {
  title: string;
  subtitle?: string;
  image: string;
  redirectUrl?: string;
  type: BannerType;
  position?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateBannerDto {
  title?: string;
  subtitle?: string;
  image?: string;
  redirectUrl?: string;
  type?: BannerType;
  position?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface BannerQueryDto {
  page?: number;
  limit?: number;
}
