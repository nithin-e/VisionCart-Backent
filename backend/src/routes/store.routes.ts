import { Router } from 'express';
import { StoreController } from '../controllers/store.controller.js';
import { StoreService } from '../services/implementations/store.service.js';
import { StoreRepository } from '../repositories/implementations/store.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const storeRepository = new StoreRepository();
const storeService = new StoreService(storeRepository);
const storeController = new StoreController(storeService);

const router = Router();

router.get('/admin/stores', adminAuthMiddleware, (req, res, next) => storeController.getAll(req, res, next));
router.get('/admin/stores/:id', adminAuthMiddleware, (req, res, next) => storeController.getById(req, res, next));
router.post('/admin/stores', adminAuthMiddleware, (req, res, next) => storeController.create(req, res, next));
router.put('/admin/stores/:id', adminAuthMiddleware, (req, res, next) => storeController.update(req, res, next));
router.delete('/admin/stores/:id', adminAuthMiddleware, (req, res, next) => storeController.delete(req, res, next));

export default router;