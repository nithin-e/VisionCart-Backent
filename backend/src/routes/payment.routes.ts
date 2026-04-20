import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { PaymentService } from '../services/implementations/payment.service.js';
import { PaymentRepository } from '../repositories/implementations/payment.repository.js';

const paymentRepository = new PaymentRepository();
const paymentService = new PaymentService(paymentRepository);
const paymentController = new PaymentController(paymentService);

const router = Router();

router.get('/admin/payments', (req, res, next) => paymentController.getAll(req, res, next));
router.get('/admin/payments/:id', (req, res, next) => paymentController.getById(req, res, next));

export default router;