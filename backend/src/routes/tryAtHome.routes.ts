import { Router } from 'express';
import { TryAtHomeController } from '../controllers/tryAtHome.controller.js';
import { TryAtHomeService } from '../services/implementations/tryAtHome.service.js';
import { TryAtHomeRepository } from '../repositories/implementations/tryAtHome.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const tryAtHomeRepository = new TryAtHomeRepository();
const tryAtHomeService = new TryAtHomeService(tryAtHomeRepository);
const tryAtHomeController = new TryAtHomeController(tryAtHomeService);

const router = Router();

router.get('/admin/try-at-home', adminAuthMiddleware, (req, res, next) => tryAtHomeController.getAll(req, res, next));
router.get('/admin/try-at-home/:id', adminAuthMiddleware, (req, res, next) => tryAtHomeController.getById(req, res, next));
router.put('/admin/try-at-home/:id/status', adminAuthMiddleware, (req, res, next) => tryAtHomeController.updateStatus(req, res, next));

export default router;