import { UserReportResponse } from '../../dto/report.dto.js';
import { SalesReportRaw } from '../../dto/report.dto.js';

export interface IReportRepository {
  getSalesReport(): Promise<SalesReportRaw>;
  getUserReport(): Promise<UserReportResponse>;
}