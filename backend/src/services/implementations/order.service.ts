import { IOrder, OrderStatus } from '../../entities/order.schema.js';
import { IOrderService } from '../interfaces/IOrder.service.js';
import { IOrderRepository } from '../../repositories/interfaces/IOrder.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { OrderQueryDto, UpdateStatusDto, RefundOrderDto } from '../../dto/order.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
  refunded: [],
};

export class OrderService implements IOrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async getAll(query: OrderQueryDto): Promise<PaginatedResponse<IOrder>> {
    return this.orderRepository.findAll(query);
  }

  async getById(id: string): Promise<IOrder | null> {
    return this.orderRepository.findById(id);
  }

  async updateStatus(id: string, data: UpdateStatusDto): Promise<IOrder | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new HttpError(MESSAGES.ORDER.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const currentStatus = order.status as OrderStatus;
    const newStatus = data.status as OrderStatus;

    const allowedTransitions = VALID_TRANSITIONS[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new HttpError(
        MESSAGES.COMMON.INVALID_STATUS_TRANSITION(currentStatus, allowedTransitions.join(', ') || 'none'),
        StatusCode.BAD_REQUEST
      );
    }

    return this.orderRepository.updateStatus(id, newStatus);
  }

  async refund(id: string, data: RefundOrderDto): Promise<IOrder | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new HttpError(MESSAGES.ORDER.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (order.status === 'refunded') {
      throw new HttpError(MESSAGES.ORDER.ALREADY_REFUNDED, StatusCode.BAD_REQUEST);
    }

    if (order.status !== 'delivered' && order.status !== 'cancelled') {
      throw new HttpError(MESSAGES.ORDER.REFUND_INVALID, StatusCode.BAD_REQUEST);
    }

    // TODO: trigger payment gateway refund here
    return this.orderRepository.refund(id, data.reason);
  }

  async getTracking(id: string): Promise<IOrder | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new HttpError(MESSAGES.ORDER.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    return order;
  }
}