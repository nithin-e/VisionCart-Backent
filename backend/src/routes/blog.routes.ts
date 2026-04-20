import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller.js';
import { BlogService } from '../services/implementations/blog.service.js';
import { BlogRepository } from '../repositories/implementations/blog.repository.js';

const blogRepository = new BlogRepository();
const blogService = new BlogService(blogRepository);
const blogController = new BlogController(blogService);

const router = Router();

router.get('/admin/blogs', (req, res, next) => blogController.getAll(req, res, next));
router.get('/admin/blogs/:id', (req, res, next) => blogController.getById(req, res, next));
router.post('/admin/blogs', (req, res, next) => blogController.create(req, res, next));
router.put('/admin/blogs/:id', (req, res, next) => blogController.update(req, res, next));
router.delete('/admin/blogs/:id', (req, res, next) => blogController.delete(req, res, next));

export default router;