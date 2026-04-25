import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { CategoryService } from '../services/implementations/category.service.js';
import { CategoryRepository } from '../repositories/implementations/category.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

router.get('/admin/categories', adminAuthMiddleware, (req, res, next) => categoryController.getAll(req, res, next));
router.get('/admin/categories/:id', adminAuthMiddleware, (req, res, next) => categoryController.getById(req, res, next));
router.post('/admin/categories', adminAuthMiddleware, (req, res, next) => categoryController.create(req, res, next));
router.put('/admin/categories/:id', adminAuthMiddleware, (req, res, next) => categoryController.update(req, res, next));
router.delete('/admin/categories/:id', adminAuthMiddleware, (req, res, next) => categoryController.delete(req, res, next));

export default router;