export interface SalesReportResponse {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDate: { date: string; total: number }[];
}

export interface UserReportResponse {
  totalUsers: number;
  newUsers: number;
  usersByDate: { date: string; count: number }[];
}

export interface SalesReportRaw {
  totalSales: number;
  totalOrders: number;
  salesByDate: { date: string; total: number }[];
}