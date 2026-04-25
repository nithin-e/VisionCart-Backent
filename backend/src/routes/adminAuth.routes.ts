import express from 'express';
import { adminLogin } from '../controllers/adminAuth.controller';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';
import { adminChangePassword } from '../controllers/adminAuth.controller.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/change-password', adminAuthMiddleware, adminChangePassword);

export default router;