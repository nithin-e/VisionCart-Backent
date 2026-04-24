import { Router } from 'express';
import { BrandController } from '../controllers/brand.controller.js';
import { BrandService } from '../services/implementations/brand.service.js';
import { BrandRepository } from '../repositories/implementations/brand.repository.js';

const brandRepository = new BrandRepository();
const brandService = new BrandService(brandRepository);
const brandController = new BrandController(brandService);

const router = Router();

router.get('/admin/brands', (req, res, next) => brandController.getAll(req, res, next));
router.get('/admin/brands/:id', (req, res, next) => brandController.getById(req, res, next));
router.post('/admin/brands', (req, res, next) => brandController.create(req, res, next));
router.put('/admin/brands/:id', (req, res, next) => brandController.update(req, res, next));
router.delete('/admin/brands/:id', (req, res, next) => brandController.delete(req, res, next));

export default router;