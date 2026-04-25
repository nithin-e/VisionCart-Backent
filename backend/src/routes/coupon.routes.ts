import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller.js';
import { CouponService } from '../services/implementations/coupon.service.js';
import { CouponRepository } from '../repositories/implementations/coupon.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const couponRepository = new CouponRepository();
const couponService = new CouponService(couponRepository);
const couponController = new CouponController(couponService);

const router = Router();

router.get('/admin/coupons', adminAuthMiddleware, (req, res, next) => couponController.getAll(req, res, next));
router.get('/admin/coupons/:id', adminAuthMiddleware, (req, res, next) => couponController.getById(req as any, res, next));
router.post('/admin/coupons', adminAuthMiddleware, (req, res, next) => couponController.create(req, res, next));
router.put('/admin/coupons/:id', adminAuthMiddleware, (req, res, next) => couponController.update(req as any, res, next));
router.delete('/admin/coupons/:id', adminAuthMiddleware, (req, res, next) => couponController.delete(req as any, res, next));

export default router;