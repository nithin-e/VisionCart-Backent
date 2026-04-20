import { IFranchise } from '../../entities/franchise.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { FranchiseQueryDto, UpdateStatusDto } from '../../dto/franchise.dto.js';

export interface IFranchiseService {
  getAll(query: FranchiseQueryDto): Promise<PaginatedResponse<IFranchise>>;
  getById(id: string): Promise<IFranchise | null>;
  updateStatus(id: string, data: UpdateStatusDto): Promise<IFranchise | null>;
}