import { INotification } from '../../entities/notification.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { NotificationQueryDto, NotificationData } from '../../dto/notification.dto.js';

export interface INotificationRepository {
  findAll(query: NotificationQueryDto): Promise<PaginatedResponse<INotification>>;
  createOne(data: NotificationData): Promise<INotification>;
  createMany(data: NotificationData[]): Promise<INotification[]>;
}