import { IReview } from '../../entities/review.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { ReviewQueryDto } from '../../dto/review.dto.js';

export interface IReviewService {
  getAll(query: ReviewQueryDto): Promise<PaginatedResponse<IReview>>;
  getById(id: string): Promise<IReview | null>;
  hide(id: string): Promise<boolean>;
  show(id: string): Promise<boolean>;
}