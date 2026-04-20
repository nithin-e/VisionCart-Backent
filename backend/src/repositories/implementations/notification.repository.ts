import { INotification } from '../../entities/notification.schema.js';
import { Notification } from '../../entities/notification.schema.js';
import { INotificationRepository } from '../interfaces/INotification.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { NotificationQueryDto, NotificationData } from '../../dto/notification.dto.js';

export class NotificationRepository implements INotificationRepository {
  async findAll(query: NotificationQueryDto): Promise<PaginatedResponse<INotification>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.userId) {
      filter.userId = query.userId;
    }
    if (query.isRead !== undefined) {
      filter.isRead = query.isRead;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
    ]);

    return {
      items: notifications as unknown as INotification[],
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  async createOne(data: NotificationData): Promise<INotification> {
    const notification = new Notification(data);
    return notification.save() as Promise<INotification>;
  }

  async createMany(data: NotificationData[]): Promise<INotification[]> {
    return Notification.insertMany(data) as Promise<INotification[]>;
  }
}