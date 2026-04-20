import { Request, Response, NextFunction } from 'express';
import { IReportService } from '../services/interfaces/IReport.service.js';

export class ReportController {
  constructor(private readonly reportService: IReportService) {}

  async getSalesReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await this.reportService.getSalesReport();
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async getUserReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await this.reportService.getUserReport();
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }
}