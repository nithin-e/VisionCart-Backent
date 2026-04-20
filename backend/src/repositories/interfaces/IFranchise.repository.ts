import { IFranchise } from '../../entities/franchise.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { FranchiseQueryDto } from '../../dto/franchise.dto.js';

export interface IFranchiseRepository {
  findAll(query: FranchiseQueryDto): Promise<PaginatedResponse<IFranchise>>;
  findById(id: string): Promise<IFranchise | null>;
  updateStatus(id: string, status: string): Promise<IFranchise | null>;
}