const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    items: [
      {
        productId: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        size: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      firstName: String,
      lastName: String,
    },
    paymentId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered'],
      default: 'Processing',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
