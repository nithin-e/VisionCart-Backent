import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { UserService } from '../services/implementations/user.service.js';
import { UserRepository } from '../repositories/implementations/user.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.get('/admin/users', adminAuthMiddleware, (req, res, next) => userController.getAll(req, res, next));
router.get('/admin/users/:id', adminAuthMiddleware, (req, res, next) => userController.getById(req, res, next));
router.put('/admin/users/:id/block', adminAuthMiddleware, (req, res, next) => userController.block(req, res, next));
router.put('/admin/users/:id/unblock', adminAuthMiddleware, (req, res, next) => userController.unblock(req, res, next));

export default router;