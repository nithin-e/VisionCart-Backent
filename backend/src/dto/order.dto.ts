import { OrderStatus } from '../entities/order.schema.js';

export interface OrderQueryDto {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export interface UpdateStatusDto {
  status: OrderStatus;
}

export interface RefundOrderDto {
  reason: string;
}
