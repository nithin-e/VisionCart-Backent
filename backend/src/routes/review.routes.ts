import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { ReviewService } from '../services/implementations/review.service.js';
import { ReviewRepository } from '../repositories/implementations/review.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

const router = Router();

router.get('/admin/reviews', adminAuthMiddleware, (req, res, next) => reviewController.getAll(req, res, next));
router.get('/admin/reviews/:id', adminAuthMiddleware, (req, res, next) => reviewController.getById(req, res, next));
router.delete('/admin/reviews/:id', adminAuthMiddleware, (req, res, next) => reviewController.hide(req, res, next));
router.patch('/admin/reviews/:id', adminAuthMiddleware, (req, res, next) => reviewController.show(req, res, next));

export default router;