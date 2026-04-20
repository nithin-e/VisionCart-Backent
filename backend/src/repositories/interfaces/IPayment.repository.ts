import { IPayment } from '../../entities/payment.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { PaymentQueryDto } from '../../dto/payment.dto.js';

export interface IPaymentRepository {
  findAll(query: PaymentQueryDto): Promise<PaginatedResponse<IPayment>>;
  findById(id: string): Promise<IPayment | null>;
}