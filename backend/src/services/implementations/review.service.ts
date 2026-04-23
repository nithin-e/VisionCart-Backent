import { IReview } from '../../entities/review.schema.js';
import { IReviewService } from '../interfaces/IReview.service.js';
import { IReviewRepository } from '../../repositories/interfaces/IReview.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { ReviewQueryDto } from '../../dto/review.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

export class ReviewService implements IReviewService {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async getAll(query: ReviewQueryDto): Promise<PaginatedResponse<IReview>> {
    return this.reviewRepository.findAll(query);
  }

  async getById(id: string): Promise<IReview | null> {
    return this.reviewRepository.findById(id);
  }

  async hide(id: string): Promise<boolean> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new HttpError(MESSAGES.REVIEW.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (!review.isApproved) {
      throw new HttpError(MESSAGES.REVIEW.ALREADY_HIDDEN, StatusCode.BAD_REQUEST);
    }

    return this.reviewRepository.hide(id);
  }

  async show(id: string): Promise<boolean> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new HttpError(MESSAGES.REVIEW.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    return this.reviewRepository.show(id);
  }
}