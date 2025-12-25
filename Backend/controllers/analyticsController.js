const Bill = require('../models/Bill');

// Get comprehensive analytics
const getAnalytics = async (req, res) => {
  try {
    const { month, year, days } = req.query;
    
    let startDate, endDate;
    
    // If month and year are provided, use month-wise
    if (month && year) {
      const monthNum = parseInt(month) - 1; // JavaScript months are 0-indexed
      const yearNum = parseInt(year);
      startDate = new Date(yearNum, monthNum, 1);
      startDate.setHours(0, 0, 0, 0);
      
      // Get last day of the month
      endDate = new Date(yearNum, monthNum + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (days) {
      // Fallback to days if provided
      const daysCount = parseInt(days);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      startDate = new Date();
      startDate.setDate(startDate.getDate() - daysCount);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    // Today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Optimize: Run queries in parallel for better performance
    const [totalBills, totalOrders, todayStats, dailyRevenue, periodStats, paymentModeStats] = await Promise.all([
      // Total bills count (all time) - use estimated count for better performance
      Bill.countDocuments({ status: 'Paid' }),
      // Total orders count (all time - includes all statuses)
      Bill.countDocuments(),
      // Today's statistics
      Bill.aggregate([
        {
          $match: {
            createdAt: { $gte: todayStart, $lte: todayEnd },
            status: 'Paid'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            totalBills: { $sum: 1 },
            totalOrders: { $sum: 1 },
            averageBill: { $avg: '$total' }
          }
        }
      ]),
      // Daily revenue breakdown for the specified period
      Bill.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'Paid'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            revenue: { $sum: '$total' },
            bills: { $sum: 1 },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),
      // Overall statistics for the period
      Bill.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'Paid'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            totalBills: { $sum: 1 },
            totalOrders: { $sum: 1 },
            averageBill: { $avg: '$total' },
            totalDiscount: { $sum: '$discount' },
            totalTax: { $sum: '$tax' }
          }
        }
      ]),
      // Payment mode breakdown
      Bill.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'Paid'
          }
        },
        {
          $group: {
            _id: '$paymentMode',
            count: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        }
      ])
    ]);

    const today = todayStats[0] || {
      totalRevenue: 0,
      totalBills: 0,
      totalOrders: 0,
      averageBill: 0
    };

    const period = periodStats[0] || {
      totalRevenue: 0,
      totalBills: 0,
      totalOrders: 0,
      averageBill: 0,
      totalDiscount: 0,
      totalTax: 0
    };

    res.json({
      summary: {
        totalBills,
        totalOrders,
        today: {
          revenue: today.totalRevenue,
          bills: today.totalBills,
          orders: today.totalOrders,
          averageBill: Math.round(today.averageBill || 0)
        },
        period: {
          revenue: period.totalRevenue,
          bills: period.totalBills,
          orders: period.totalOrders,
          averageBill: Math.round(period.averageBill || 0),
          discount: period.totalDiscount,
          tax: period.totalTax
        }
      },
      dailyRevenue,
      paymentModeStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics
};

