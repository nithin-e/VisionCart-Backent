export interface NotificationQueryDto {
  page?: number;
  limit?: number;
  userId?: string;
  isRead?: boolean;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  userId?: string;
}

export interface NotificationData {
  title: string;
  message: string;
  userId?: string;
}