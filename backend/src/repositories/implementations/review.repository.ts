import { IReview } from '../../entities/review.schema.js';
import { Review } from '../../entities/review.schema.js';
import { IReviewRepository } from '../interfaces/IReview.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { ReviewQueryDto } from '../../dto/review.dto.js';

export class ReviewRepository implements IReviewRepository {
  async findAll(query: ReviewQueryDto): Promise<PaginatedResponse<IReview>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.isApproved !== undefined) {
      filter.isApproved = query.isApproved;
    }
    if (query.productId) {
      filter.productId = query.productId;
    }

    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter),
    ]);

    return {
      items: reviews as unknown as IReview[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IReview | null> {
    return Review.findById(id).lean() as Promise<IReview | null>;
  }

  async hide(id: string): Promise<boolean> {
    const result = await Review.findByIdAndUpdate(id, { isApproved: false }, { new: true });
    return result !== null;
  }

  async show(id: string): Promise<boolean> {
    const result = await Review.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    return result !== null;
  }
}