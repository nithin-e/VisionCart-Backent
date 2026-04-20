import { UserReportResponse } from '../../dto/report.dto.js';
import { SalesReportRaw } from '../../dto/report.dto.js';

export interface IReportService {
  getSalesReport(): Promise<SalesReportRaw & { averageOrderValue: number }>;
  getUserReport(): Promise<UserReportResponse>;
}