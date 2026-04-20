import { IFranchise } from '../../entities/franchise.schema.js';
import { Franchise } from '../../entities/franchise.schema.js';
import { IFranchiseRepository } from '../interfaces/IFranchise.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { FranchiseQueryDto } from '../../dto/franchise.dto.js';

export class FranchiseRepository implements IFranchiseRepository {
  async findAll(query: FranchiseQueryDto): Promise<PaginatedResponse<IFranchise>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    }

    const [applications, total] = await Promise.all([
      Franchise.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Franchise.countDocuments(filter),
    ]);

    return {
      items: applications as unknown as IFranchise[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IFranchise | null> {
    return Franchise.findById(id).lean() as Promise<IFranchise | null>;
  }

  async updateStatus(id: string, status: string): Promise<IFranchise | null> {
    return Franchise.findByIdAndUpdate(id, { status }, { new: true }).lean() as Promise<IFranchise | null>;
  }
}