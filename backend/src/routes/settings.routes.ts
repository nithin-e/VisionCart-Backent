import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller.js';
import { SettingsService } from '../services/implementations/settings.service.js';
import { SettingsRepository } from '../repositories/implementations/settings.repository.js';

const settingsRepository = new SettingsRepository();
const settingsService = new SettingsService(settingsRepository);
const settingsController = new SettingsController(settingsService);

const router = Router();

router.get('/admin/settings', (req, res, next) => settingsController.get(req, res, next));
router.put('/admin/settings', (req, res, next) => settingsController.update(req, res, next));

export default router;