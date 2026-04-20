import { IUser } from '../../entities/user.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { UserQueryDto, BlockUserDto } from '../../dto/user.dto.js';

export interface IUserService {
  getAll(query: UserQueryDto): Promise<PaginatedResponse<IUser>>;
  getById(id: string): Promise<IUser | null>;
  block(id: string, data: BlockUserDto): Promise<IUser | null>;
  unblock(id: string): Promise<IUser | null>;
}