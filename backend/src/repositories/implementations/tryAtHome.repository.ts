import { ITryAtHome } from '../../entities/tryAtHome.schema.js';
import { TryAtHome } from '../../entities/tryAtHome.schema.js';
import { ITryAtHomeRepository } from '../interfaces/ITryAtHome.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { TryAtHomeQueryDto } from '../../dto/tryAtHome.dto.js';

export class TryAtHomeRepository implements ITryAtHomeRepository {
  async findAll(query: TryAtHomeQueryDto): Promise<PaginatedResponse<ITryAtHome>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    }

    const [bookings, total] = await Promise.all([
      TryAtHome.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      TryAtHome.countDocuments(filter),
    ]);

    return {
      items: bookings as unknown as ITryAtHome[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<ITryAtHome | null> {
    return TryAtHome.findById(id).lean() as Promise<ITryAtHome | null>;
  }

  async updateStatus(id: string, status: string): Promise<ITryAtHome | null> {
    return TryAtHome.findByIdAndUpdate(id, { status }, { new: true }).lean() as Promise<ITryAtHome | null>;
  }
}