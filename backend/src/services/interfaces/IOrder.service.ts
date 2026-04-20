import { IOrder } from '../../entities/order.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { OrderQueryDto, UpdateStatusDto, RefundOrderDto } from '../../dto/order.dto.js';

export interface IOrderService {
  getAll(query: OrderQueryDto): Promise<PaginatedResponse<IOrder>>;
  getById(id: string): Promise<IOrder | null>;
  updateStatus(id: string, data: UpdateStatusDto): Promise<IOrder | null>;
  refund(id: string, data: RefundOrderDto): Promise<IOrder | null>;
  getTracking(id: string): Promise<IOrder | null>;
}