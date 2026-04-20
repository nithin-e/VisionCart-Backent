import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { UserService } from '../services/implementations/user.service.js';
import { UserRepository } from '../repositories/implementations/user.repository.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.get('/admin/users', (req, res, next) => userController.getAll(req, res, next));
router.get('/admin/users/:id', (req, res, next) => userController.getById(req, res, next));
router.put('/admin/users/:id/block', (req, res, next) => userController.block(req, res, next));
router.put('/admin/users/:id/unblock', (req, res, next) => userController.unblock(req, res, next));

export default router;