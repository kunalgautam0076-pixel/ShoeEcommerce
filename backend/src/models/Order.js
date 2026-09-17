const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String
  },
  customerPhone: {
    type: String
  },
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String
  },
  items: [
    {
      productId: String,
      name: String,
      brand: String,
      category: String,
      price: Number,
      image: String,
      size: Number,
      quantity: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'Razorpay / Card / UPI'
  },
  paymentId: {
    type: String
  },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
