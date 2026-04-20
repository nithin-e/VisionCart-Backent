import { FranchiseStatus } from '../entities/franchise.schema.js';

export interface FranchiseQueryDto {
  page?: number;
  limit?: number;
  status?: FranchiseStatus;
}

export interface UpdateStatusDto {
  status: FranchiseStatus;
}