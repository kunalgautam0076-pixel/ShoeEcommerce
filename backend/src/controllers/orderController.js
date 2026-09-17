const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Private
const createOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      paymentId,
      userId
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderNumber: orderNumber || 'SHX-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      user: userId || undefined,
      customerName: customerName || 'Guest Customer',
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      paymentId,
      status: 'Processing'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Public / Private
const getUserOrders = async (req, res) => {
  try {
    const { email, phone } = req.query;
    const query = [];
    if (email) query.push({ customerEmail: email });
    if (phone) query.push({ customerPhone: phone });

    if (query.length === 0) {
      return res.json([]);
    }

    const orders = await Order.find({ $or: query }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders
};
