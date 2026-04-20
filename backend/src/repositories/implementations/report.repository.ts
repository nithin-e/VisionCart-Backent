import { IReportRepository } from '../interfaces/IReport.repository.js';
import { SalesReportRaw, UserReportResponse } from '../../dto/report.dto.js';
import { Order } from '../../entities/order.schema.js';
import { User } from '../../entities/user.schema.js';

export class ReportRepository implements IReportRepository {
  async getSalesReport(): Promise<SalesReportRaw> {
    const [totalSalesResult, totalOrdersResult, salesByDateResult] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ status: { $ne: 'cancelled' } }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            total: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totalSales = totalSalesResult[0]?.total || 0;
    const totalOrders = totalOrdersResult;
    const salesByDate = salesByDateResult.map((item) => ({
      date: item._id,
      total: item.total,
    }));

    return {
      totalSales,
      totalOrders,
      salesByDate,
    } as SalesReportRaw;
  }

  async getUserReport(): Promise<UserReportResponse> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsersResult, newUsersResult, usersByDateResult] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totalUsers = totalUsersResult;
    const newUsers = newUsersResult;
    const usersByDate = usersByDateResult.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    return {
      totalUsers,
      newUsers,
      usersByDate,
    };
  }
}