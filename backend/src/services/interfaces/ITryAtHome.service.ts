import { ITryAtHome } from '../../entities/tryAtHome.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { TryAtHomeQueryDto, UpdateStatusDto } from '../../dto/tryAtHome.dto.js';

export interface ITryAtHomeService {
  getAll(query: TryAtHomeQueryDto): Promise<PaginatedResponse<ITryAtHome>>;
  getById(id: string): Promise<ITryAtHome | null>;
  updateStatus(id: string, data: UpdateStatusDto): Promise<ITryAtHome | null>;
}