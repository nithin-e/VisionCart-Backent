import { TryAtHomeStatus } from '../entities/tryAtHome.schema.js';

export interface TryAtHomeQueryDto {
  page?: number;
  limit?: number;
  status?: TryAtHomeStatus;
}

export interface UpdateStatusDto {
  status: TryAtHomeStatus;
}