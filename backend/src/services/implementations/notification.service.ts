import { INotification } from '../../entities/notification.schema.js';
import { INotificationService } from '../interfaces/INotification.service.js';
import { INotificationRepository } from '../../repositories/interfaces/INotification.repository.js';
import { PaginatedResponse } from '../../types/index.js';
import { NotificationQueryDto, CreateNotificationDto } from '../../dto/notification.dto.js';
import { HttpError } from '../../middleware/error.middleware.js';
import { MESSAGES } from '../../constants/messages.constant.js';
import { StatusCode } from '../../constants/statusCode.js';
import { User } from '../../entities/user.schema.js';

export class NotificationService implements INotificationService {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async getAll(query: NotificationQueryDto): Promise<PaginatedResponse<INotification>> {
    return this.notificationRepository.findAll(query);
  }

  async send(data: CreateNotificationDto): Promise<boolean> {
    if (!data.title || data.title.trim().length === 0) {
      throw new HttpError(MESSAGES.NOTIFICATION.TITLE_REQUIRED, StatusCode.BAD_REQUEST);
    }
    if (!data.message || data.message.trim().length === 0) {
      throw new HttpError(MESSAGES.NOTIFICATION.MESSAGE_REQUIRED, StatusCode.BAD_REQUEST);
    }

    if (data.userId) {
      const user = await User.findById(data.userId).lean();
      if (!user) {
        throw new HttpError(MESSAGES.NOTIFICATION.USER_NOT_FOUND, StatusCode.NOT_FOUND);
      }
      await this.notificationRepository.createOne({
        title: data.title,
        message: data.message,
        userId: data.userId,
      });
    } else {
      const users = await User.find().select('_id').lean();
      if (users.length === 0) {
        throw new HttpError(MESSAGES.NOTIFICATION.NO_USERS, StatusCode.BAD_REQUEST);
      }
      const notifications = users.map((user) => ({
        title: data.title,
        message: data.message,
        userId: user._id.toString(),
      }));
      await this.notificationRepository.createMany(notifications);
    }

    return true;
  }
}