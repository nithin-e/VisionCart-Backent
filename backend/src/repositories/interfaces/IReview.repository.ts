import { IReview } from '../../entities/review.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { ReviewQueryDto } from '../../dto/review.dto.js';

export interface IReviewRepository {
  findAll(query: ReviewQueryDto): Promise<PaginatedResponse<IReview>>;
  findById(id: string): Promise<IReview | null>;
  hide(id: string): Promise<boolean>;
}