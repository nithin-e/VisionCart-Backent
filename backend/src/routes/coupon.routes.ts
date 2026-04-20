import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller.js';
import { CouponService } from '../services/implementations/coupon.service.js';
import { CouponRepository } from '../repositories/implementations/coupon.repository.js';

const couponRepository = new CouponRepository();
const couponService = new CouponService(couponRepository);
const couponController = new CouponController(couponService);

const router = Router();

router.get('/admin/coupons', (req, res, next) => couponController.getAll(req, res, next));
router.get('/admin/coupons/:id', (req, res, next) => couponController.getById(req, res, next));
router.post('/admin/coupons', (req, res, next) => couponController.create(req, res, next));
router.put('/admin/coupons/:id', (req, res, next) => couponController.update(req, res, next));
router.delete('/admin/coupons/:id', (req, res, next) => couponController.delete(req, res, next));

export default router;