import { IFranchise, FranchiseStatus } from '../../entities/franchise.schema.js';
import { IFranchiseService } from '../interfaces/IFranchise.service.js';
import { IFranchiseRepository } from '../../repositories/interfaces/IFranchise.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { FranchiseQueryDto, UpdateStatusDto } from '../../dto/franchise.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

const VALID_STATUSES: FranchiseStatus[] = ['pending', 'approved', 'rejected'];

const VALID_TRANSITIONS: Record<FranchiseStatus, FranchiseStatus[]> = {
  pending: ['approved', 'rejected'],
  approved: [],
  rejected: [],
};

export class FranchiseService implements IFranchiseService {
  constructor(private readonly franchiseRepository: IFranchiseRepository) {}

  async getAll(query: FranchiseQueryDto): Promise<PaginatedResponse<IFranchise>> {
    return this.franchiseRepository.findAll(query);
  }

  async getById(id: string): Promise<IFranchise | null> {
    return this.franchiseRepository.findById(id);
  }

  async updateStatus(id: string, data: UpdateStatusDto): Promise<IFranchise | null> {
    const application = await this.franchiseRepository.findById(id);
    if (!application) {
      throw new HttpError(MESSAGES.FRANCHISE.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const newStatus = data.status as FranchiseStatus;

    if (!VALID_STATUSES.includes(newStatus)) {
      throw new HttpError(MESSAGES.FRANCHISE.INVALID_STATUS, StatusCode.BAD_REQUEST);
    }

    const currentStatus = application.status as FranchiseStatus;
    const allowedTransitions = VALID_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new HttpError(
        MESSAGES.COMMON.INVALID_STATUS_TRANSITION(currentStatus, allowedTransitions.join(', ') || 'none'),
        StatusCode.BAD_REQUEST
      );
    }

    return this.franchiseRepository.updateStatus(id, newStatus);
  }
}