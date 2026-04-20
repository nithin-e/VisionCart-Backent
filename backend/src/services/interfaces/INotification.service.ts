import { INotification } from '../../entities/notification.schema.js';
import { PaginatedResponse } from '../../types/index.js';
import { NotificationQueryDto, CreateNotificationDto } from '../../dto/notification.dto.js';

export interface INotificationService {
  getAll(query: NotificationQueryDto): Promise<PaginatedResponse<INotification>>;
  send(data: CreateNotificationDto): Promise<boolean>;
}