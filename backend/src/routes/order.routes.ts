import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { OrderService } from '../services/implementations/order.service.js';
import { OrderRepository } from '../repositories/implementations/order.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

const router = Router();

router.get('/admin/orders', adminAuthMiddleware, (req, res, next) => orderController.getAll(req, res, next));
router.get('/admin/orders/:id', adminAuthMiddleware, (req, res, next) => orderController.getById(req as any, res, next));
router.get('/admin/orders/:id/tracking', adminAuthMiddleware, (req, res, next) => orderController.getTracking(req as any, res, next));
router.put('/admin/orders/:id/status', adminAuthMiddleware, (req, res, next) => orderController.updateStatus(req as any, res, next));
router.post('/admin/orders/:id/refund', adminAuthMiddleware, (req, res, next) => orderController.refund(req as any, res, next));

export default router;