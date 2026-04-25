import { PaginatedResponse } from '../../types/index.js';
import { FranchiseStatus } from '../../entities/franchise.schema.js';

export interface IFranchiseRepository {
  findAll(query: { page?: number; limit?: number; status?: FranchiseStatus }): Promise<PaginatedResponse<any>>;
  findById(id: string): Promise<any | null>;
  updateStatus(id: string, status: FranchiseStatus): Promise<any | null>;
}