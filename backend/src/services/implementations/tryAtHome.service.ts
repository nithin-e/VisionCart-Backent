import { ITryAtHome, TryAtHomeStatus } from '../../entities/tryAtHome.schema.js';
import { ITryAtHomeService } from '../interfaces/ITryAtHome.service.js';
import { ITryAtHomeRepository } from '../../repositories/interfaces/ITryAtHome.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { TryAtHomeQueryDto, UpdateStatusDto } from '../../dto/tryAtHome.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

const VALID_STATUSES: TryAtHomeStatus[] = ['pending', 'approved', 'rejected', 'completed'];

const VALID_TRANSITIONS: Record<TryAtHomeStatus, TryAtHomeStatus[]> = {
  pending: ['approved', 'rejected'],
  approved: ['completed'],
  rejected: [],
  completed: [],
};

export class TryAtHomeService implements ITryAtHomeService {
  constructor(private readonly tryAtHomeRepository: ITryAtHomeRepository) {}

  async getAll(query: TryAtHomeQueryDto): Promise<PaginatedResponse<ITryAtHome>> {
    return this.tryAtHomeRepository.findAll(query);
  }

  async getById(id: string): Promise<ITryAtHome | null> {
    return this.tryAtHomeRepository.findById(id);
  }

  async updateStatus(id: string, data: UpdateStatusDto): Promise<ITryAtHome | null> {
    const booking = await this.tryAtHomeRepository.findById(id);
    if (!booking) {
      throw new HttpError(MESSAGES.TRY_AT_HOME.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const newStatus = data.status as TryAtHomeStatus;

    if (!VALID_STATUSES.includes(newStatus)) {
      throw new HttpError(MESSAGES.TRY_AT_HOME.INVALID_STATUS, StatusCode.BAD_REQUEST);
    }

    const currentStatus = booking.status as TryAtHomeStatus;
    const allowedTransitions = VALID_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new HttpError(
        MESSAGES.COMMON.INVALID_STATUS_TRANSITION(currentStatus, allowedTransitions.join(', ') || 'none'),
        StatusCode.BAD_REQUEST
      );
    }

    return this.tryAtHomeRepository.updateStatus(id, newStatus);
  }
}