import { IUser } from '../../entities/user.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { UserQueryDto } from '../../dto/user.dto.js';

export interface IUserRepository {
  findAll(query: UserQueryDto): Promise<PaginatedResponse<IUser>>;
  findById(id: string): Promise<IUser | null>;
  block(id: string, reason: string): Promise<IUser | null>;
  unblock(id: string): Promise<IUser | null>;
}