import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller.js';
import { ContactService } from '../services/implementations/contact.service.js';
import { ContactRepository } from '../repositories/implementations/contact.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const contactController = new ContactController(contactService);

const router = Router();

router.get('/admin/contact', adminAuthMiddleware, (req, res, next) => contactController.getAll(req, res, next));
router.put('/admin/contact/:id/reply', adminAuthMiddleware, (req, res, next) => contactController.replyToMessage(req, res, next));

export default router;