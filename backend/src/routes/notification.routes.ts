import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { NotificationService } from '../services/implementations/notification.service.js';
import { NotificationRepository } from '../repositories/implementations/notification.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

const router = Router();

router.post('/admin/notifications/send', adminAuthMiddleware, (req, res, next) => notificationController.send(req, res, next));

export default router;