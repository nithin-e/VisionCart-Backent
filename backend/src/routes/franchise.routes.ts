import { Router } from 'express';
import { FranchiseController } from '../controllers/franchise.controller.js';
import { FranchiseService } from '../services/implementations/franchise.service.js';
import { FranchiseRepository } from '../repositories/implementations/franchise.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const franchiseRepository = new FranchiseRepository();
const franchiseService = new FranchiseService(franchiseRepository);
const franchiseController = new FranchiseController(franchiseService);

const router = Router();

router.get('/admin/franchise', adminAuthMiddleware, (req, res, next) => franchiseController.getAll(req, res, next));
router.put('/admin/franchise/:id/status', adminAuthMiddleware, (req, res, next) => franchiseController.updateStatus(req as any, res, next));

export default router;