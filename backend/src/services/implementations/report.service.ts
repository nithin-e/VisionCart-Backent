import { IReportService } from '../interfaces/IReport.service.js';
import { IReportRepository } from '../../repositories/interfaces/IReport.repository.js';
import { SalesReportRaw, UserReportResponse } from '../../dto/report.dto.js';

export class ReportService implements IReportService {
  constructor(private readonly reportRepository: IReportRepository) {}

  async getSalesReport(): Promise<SalesReportRaw & { averageOrderValue: number }> {
    const report = await this.reportRepository.getSalesReport();
    const totalOrders = report.totalOrders;
    const averageOrderValue = totalOrders > 0
      ? Math.round((report.totalSales / totalOrders) * 100) / 100
      : 0;

    return {
      totalSales: report.totalSales,
      totalOrders: totalOrders,
      averageOrderValue,
      salesByDate: report.salesByDate,
    };
  }

  async getUserReport(): Promise<UserReportResponse> {
    return this.reportRepository.getUserReport();
  }
}