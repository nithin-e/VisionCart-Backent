import { Router } from 'express';
import { TryAtHomeController } from '../controllers/tryAtHome.controller.js';
import { TryAtHomeService } from '../services/implementations/tryAtHome.service.js';
import { TryAtHomeRepository } from '../repositories/implementations/tryAtHome.repository.js';

const tryAtHomeRepository = new TryAtHomeRepository();
const tryAtHomeService = new TryAtHomeService(tryAtHomeRepository);
const tryAtHomeController = new TryAtHomeController(tryAtHomeService);

const router = Router();

router.get('/admin/try-at-home', (req, res, next) => tryAtHomeController.getAll(req, res, next));
router.get('/admin/try-at-home/:id', (req, res, next) => tryAtHomeController.getById(req, res, next));
router.put('/admin/try-at-home/:id/status', (req, res, next) => tryAtHomeController.updateStatus(req, res, next));

export default router;