const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'ShoeX E-Commerce Store' },
  adminEmail: { type: String, default: 'admin@shoex.com' },
  currency: { type: String, default: 'INR (₹)' },
  currencySymbol: { type: String, default: '₹' },
  currencyCode: { type: String, default: 'INR' },
  emailNotifications: { type: Boolean, default: true },
  autoApproveOrders: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
