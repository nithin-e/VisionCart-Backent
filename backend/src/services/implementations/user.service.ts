import { IUser } from '../../entities/user.schema.js';
import { IUserService } from '../interfaces/IUser.service.js';
import { IUserRepository } from '../../repositories/interfaces/IUser.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { UserQueryDto, BlockUserDto } from '../../dto/user.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAll(query: UserQueryDto): Promise<PaginatedResponse<IUser>> {
    return this.userRepository.findAll(query);
  }

  async getById(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async block(id: string, data: BlockUserDto): Promise<IUser | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new HttpError(MESSAGES.USER.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    if (existingUser.isBlocked) {
      throw new HttpError(MESSAGES.USER.ALREADY_BLOCKED, StatusCode.BAD_REQUEST);
    }
    return this.userRepository.block(id, data.reason);
  }

  async unblock(id: string): Promise<IUser | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new HttpError(MESSAGES.USER.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    if (!existingUser.isBlocked) {
      throw new HttpError(MESSAGES.USER.ALREADY_UNBLOCKED, StatusCode.BAD_REQUEST);
    }
    return this.userRepository.unblock(id);
  }
}