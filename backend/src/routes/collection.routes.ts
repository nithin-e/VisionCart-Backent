import { Router } from 'express';
import { CollectionController } from '../controllers/collection.controller.js';
import { CollectionService } from '../services/implementations/collection.service.js';
import { CollectionRepository } from '../repositories/implementations/collection.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const collectionRepository = new CollectionRepository();
const collectionService = new CollectionService(collectionRepository);
const collectionController = new CollectionController(collectionService);

const router = Router();

router.get('/admin/collections', adminAuthMiddleware, (req, res, next) => collectionController.getAll(req, res, next));
router.get('/admin/collections/:id', adminAuthMiddleware, (req, res, next) => collectionController.getById(req, res, next));
router.post('/admin/collections', adminAuthMiddleware, (req, res, next) => collectionController.create(req, res, next));
router.put('/admin/collections/:id', adminAuthMiddleware, (req, res, next) => collectionController.update(req, res, next));
router.delete('/admin/collections/:id', adminAuthMiddleware, (req, res, next) => collectionController.delete(req, res, next));
router.post('/admin/collections/:id/products', adminAuthMiddleware, (req, res, next) => collectionController.assignProducts(req, res, next));

export default router;