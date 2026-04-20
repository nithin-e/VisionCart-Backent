import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { OrderService } from '../services/implementations/order.service.js';
import { OrderRepository } from '../repositories/implementations/order.repository.js';

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

const router = Router();

router.get('/admin/orders', (req, res, next) => orderController.getAll(req, res, next));
router.get('/admin/orders/:id', (req, res, next) => orderController.getById(req, res, next));
router.get('/admin/orders/:id/tracking', (req, res, next) => orderController.getTracking(req, res, next));
router.put('/admin/orders/:id/status', (req, res, next) => orderController.updateStatus(req, res, next));
router.post('/admin/orders/:id/refund', (req, res, next) => orderController.refund(req, res, next));

export default router;