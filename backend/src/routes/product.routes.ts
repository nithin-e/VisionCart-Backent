import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { ProductService } from '../services/implementations/product.service.js';
import { ProductRepository } from '../repositories/implementations/product.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

router.get('/admin/products', adminAuthMiddleware, (req, res, next) => productController.getAll(req, res, next));
router.get('/admin/products/:id', adminAuthMiddleware, (req, res, next) => productController.getById(req, res, next));
router.post('/admin/products', adminAuthMiddleware, (req, res, next) => productController.create(req, res, next));
router.put('/admin/products/:id', adminAuthMiddleware, (req, res, next) => productController.update(req, res, next));
router.delete('/admin/products/:id', adminAuthMiddleware, (req, res, next) => productController.delete(req, res, next));

export default router;