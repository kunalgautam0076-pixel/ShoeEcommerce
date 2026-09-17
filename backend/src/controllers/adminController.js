const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get Admin Overview Statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [totalProducts, totalUsers, totalOrders, revenueSummary] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
      ])
    ]);

    const totalRevenue = revenueSummary[0]?.totalRevenue || 0;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders: recentOrders.map((order) => ({
        id: order.orderNumber,
        customerName: order.customerName,
        customerContact: order.email || order.phone || 'No contact provided',
        date: new Date(order.date || order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        total: order.total,
        status: order.status,
        itemsCount: Array.isArray(order.items) ? order.items.length : 0,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats
};
