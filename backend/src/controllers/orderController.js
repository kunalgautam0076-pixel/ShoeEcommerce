const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      orderNumber,
      customerName,
      email,
      phone,
      items,
      total,
      shippingAddress,
      status,
      paymentId,
    } = req.body;

    if (!orderNumber || !customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order details are incomplete.' });
    }

    const normalizedOrder = {
      user: userId || null,
      orderNumber,
      customerName,
      email: email || '',
      phone: phone || '',
      items: items.map((item) => ({
        productId: item.productId || item._id || '',
        name: item.name,
        image: item.image || '',
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        size: item.size || 8,
      })),
      total: Number(total || 0),
      shippingAddress: shippingAddress || {},
      paymentId: paymentId || '',
      status: status || 'Processing',
      date: new Date(),
    };

    const order = await Order.create(normalizedOrder);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
};
