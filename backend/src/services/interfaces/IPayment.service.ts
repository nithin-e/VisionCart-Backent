import { IPayment } from '../../entities/payment.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { PaymentQueryDto } from '../../dto/payment.dto.js';

export interface IPaymentService {
  getAll(query: PaymentQueryDto): Promise<PaginatedResponse<IPayment>>;
  getById(id: string): Promise<IPayment | null>;
}