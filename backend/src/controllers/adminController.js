const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Settings = require('../models/Settings');

const getCurrencySymbol = (currency) => {
  if (!currency) return '₹';
  if (currency.includes('₹') || currency.includes('INR')) return '₹';
  if (currency.includes('$') || currency.includes('USD')) return '$';
  if (currency.includes('€') || currency.includes('EUR')) return '€';
  if (currency.includes('£') || currency.includes('GBP')) return '£';
  return '₹';
};

const getCurrencyCode = (currency) => {
  if (!currency) return 'INR';
  if (currency.includes('₹') || currency.includes('INR')) return 'INR';
  if (currency.includes('$') || currency.includes('USD')) return 'USD';
  if (currency.includes('€') || currency.includes('EUR')) return 'EUR';
  if (currency.includes('£') || currency.includes('GBP')) return 'GBP';
  return 'INR';
};

// @desc    Get Admin Overview Statistics (Real Dynamic Metrics)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate real revenue from all orders
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Orders for Admin
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Order Status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Registered Users for Admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Store Settings (Currency, Branding, Preferences)
// @route   GET /api/admin/settings & GET /api/settings
// @access  Public / Admin
const getStoreSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        storeName: 'ShoeX E-Commerce Store',
        adminEmail: 'admin@shoex.com',
        currency: 'INR (₹)',
        currencySymbol: '₹',
        currencyCode: 'INR',
        emailNotifications: true,
        autoApproveOrders: false
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Store Settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateStoreSettings = async (req, res) => {
  try {
    const { storeName, adminEmail, currency, emailNotifications, autoApproveOrders } = req.body;
    let settings = await Settings.findOne();

    const symbol = getCurrencySymbol(currency);
    const code = getCurrencyCode(currency);

    if (!settings) {
      settings = new Settings({
        storeName: storeName || 'ShoeX E-Commerce Store',
        adminEmail: adminEmail || 'admin@shoex.com',
        currency: currency || 'INR (₹)',
        currencySymbol: symbol,
        currencyCode: code,
        emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
        autoApproveOrders: autoApproveOrders !== undefined ? autoApproveOrders : false
      });
    } else {
      if (storeName !== undefined) settings.storeName = storeName;
      if (adminEmail !== undefined) settings.adminEmail = adminEmail;
      if (currency !== undefined) {
        settings.currency = currency;
        settings.currencySymbol = symbol;
        settings.currencyCode = code;
      }
      if (emailNotifications !== undefined) settings.emailNotifications = emailNotifications;
      if (autoApproveOrders !== undefined) settings.autoApproveOrders = autoApproveOrders;
    }

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getStoreSettings,
  updateStoreSettings
};
