import { IUser } from '../../entities/user.schema.js';
import { User } from '../../entities/user.schema.js';
import { IUserRepository } from '../interfaces/IUser.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { UserQueryDto } from '../../dto/user.dto.js';

export class UserRepository implements IUserRepository {
  async findAll(query: UserQueryDto): Promise<PaginatedResponse<IUser>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    return {
      items: users as unknown as IUser[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password').lean() as Promise<IUser | null>;
  }

  async block(id: string, reason: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, { isBlocked: true, blockReason: reason }, { new: true }).select('-password').lean() as Promise<IUser | null>;
  }

  async unblock(id: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, { isBlocked: false, blockReason: null }, { new: true }).select('-password').lean() as Promise<IUser | null>;
  }
}