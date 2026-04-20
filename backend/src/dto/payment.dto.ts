import { PaymentStatus, PaymentMethod } from '../entities/payment.schema.js';

export interface PaymentQueryDto {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}