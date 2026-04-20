import { ITryAtHome } from '../../entities/tryAtHome.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { TryAtHomeQueryDto } from '../../dto/tryAtHome.dto.js';

export interface ITryAtHomeRepository {
  findAll(query: TryAtHomeQueryDto): Promise<PaginatedResponse<ITryAtHome>>;
  findById(id: string): Promise<ITryAtHome | null>;
  updateStatus(id: string, status: string): Promise<ITryAtHome | null>;
}