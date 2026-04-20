import { IPayment } from '../../entities/payment.schema.js';
import { IPaymentService } from '../interfaces/IPayment.service.js';
import { IPaymentRepository } from '../../repositories/interfaces/IPayment.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { PaymentQueryDto } from '../../dto/payment.dto.js';

export class PaymentService implements IPaymentService {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async getAll(query: PaymentQueryDto): Promise<PaginatedResponse<IPayment>> {
    return this.paymentRepository.findAll(query);
  }

  async getById(id: string): Promise<IPayment | null> {
    return this.paymentRepository.findById(id);
  }
}