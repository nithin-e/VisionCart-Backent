import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { ReportService } from '../services/implementations/report.service.js';
import { ReportRepository } from '../repositories/implementations/report.repository.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware.js';

const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);
const reportController = new ReportController(reportService);

const router = Router();

router.get('/admin/reports/sales', adminAuthMiddleware, (req, res, next) => reportController.getSalesReport(req, res, next));
router.get('/admin/reports/users', adminAuthMiddleware, (req, res, next) => reportController.getUserReport(req, res, next));

export default router;