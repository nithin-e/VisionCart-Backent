import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { ReviewService } from '../services/implementations/review.service.js';
import { ReviewRepository } from '../repositories/implementations/review.repository.js';

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

const router = Router();

router.get('/admin/reviews', (req, res, next) => reviewController.getAll(req, res, next));
router.get('/admin/reviews/:id', (req, res, next) => reviewController.getById(req, res, next));
router.delete('/admin/reviews/:id', (req, res, next) => reviewController.hide(req, res, next));

export default router;