import { IPayment } from '../../entities/payment.schema.js';
import { Payment } from '../../entities/payment.schema.js';
import { IPaymentRepository } from '../interfaces/IPayment.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { PaymentQueryDto } from '../../dto/payment.dto.js';

export class PaymentRepository implements IPaymentRepository {
  async findAll(query: PaymentQueryDto): Promise<PaginatedResponse<IPayment>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    }
    if (query.paymentMethod) {
      filter.paymentMethod = query.paymentMethod;
    }

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .select('-gatewayResponse')
        .populate('orderId', '_id totalAmount')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(filter),
    ]);

    return {
      items: payments as unknown as IPayment[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<IPayment | null> {
    return Payment.findById(id)
      .select('-gatewayResponse')
      .populate('orderId', '_id totalAmount status')
      .populate('userId', 'name email')
      .lean() as Promise<IPayment | null>;
  }
}