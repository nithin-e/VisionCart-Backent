import { IOrder } from '../../entities/order.schema.js';
import { Order } from '../../entities/order.schema.js';
import { IOrderRepository } from '../interfaces/IOrder.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { OrderQueryDto } from '../../dto/order.dto.js';

export class OrderRepository implements IOrderRepository {
  async findAll(query: OrderQueryDto): Promise<PaginatedResponse<IOrder>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    return {
      items: orders as unknown as IOrder[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IOrder | null> {
    return Order.findById(id)
      .populate('userId', 'name email')
      .lean() as Promise<IOrder | null>;
  }

  async updateStatus(id: string, newStatus: string): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      id,
      {
        status: newStatus,
        $push: { statusTimeline: { status: newStatus, date: new Date() } },
      },
      { new: true }
    ).lean() as Promise<IOrder | null>;
  }

  async refund(id: string, reason: string): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      id,
      {
        status: 'refunded',
        paymentStatus: 'refunded',
        refundReason: reason,
        $push: { statusTimeline: { status: 'refunded', date: new Date() } },
      },
      { new: true }
    ).lean() as Promise<IOrder | null>;
  }
}