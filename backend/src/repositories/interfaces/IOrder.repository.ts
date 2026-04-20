import { IOrder } from '../../entities/order.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { OrderQueryDto, UpdateStatusDto, RefundOrderDto } from '../../dto/order.dto.js';

export interface IOrderRepository {
  findAll(query: OrderQueryDto): Promise<PaginatedResponse<IOrder>>;
  findById(id: string): Promise<IOrder | null>;
  updateStatus(id: string, status: string): Promise<IOrder | null>;
  refund(id: string, reason: string): Promise<IOrder | null>;
}