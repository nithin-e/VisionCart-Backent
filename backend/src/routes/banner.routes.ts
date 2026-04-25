import { Router } from 'express';
import { BannerController } from '../controllers/banner.controller.js';
import { BannerService } from '../services/implementations/banner.service.js';
import { BannerRepository } from '../repositories/implementations/banner.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const bannerRepository = new BannerRepository();
const bannerService = new BannerService(bannerRepository);
const bannerController = new BannerController(bannerService);

const router = Router();

router.get('/admin/banners', adminAuthMiddleware, (req, res, next) => bannerController.getAll(req, res, next));
router.get('/admin/banners/:id', adminAuthMiddleware, (req, res, next) => bannerController.getById(req, res, next));
router.post('/admin/banners', adminAuthMiddleware, (req, res, next) => bannerController.create(req, res, next));
router.put('/admin/banners/:id', adminAuthMiddleware, (req, res, next) => bannerController.update(req, res, next));
router.delete('/admin/banners/:id', adminAuthMiddleware, (req, res, next) => bannerController.delete(req, res, next));

export default router;