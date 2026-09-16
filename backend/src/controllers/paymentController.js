const Razorpay = require('razorpay');
const crypto = require('crypto');

// @desc    Create a Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private (Requires authentication ideally, but Public for now)
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Mock order for demo purposes if keys aren't set yet
      console.log('No Razorpay keys found. Creating mock order.');
      return res.status(200).json({
        id: 'order_mock_' + Date.now(),
        amount: amount * 100,
        currency: 'INR',
        mock: true
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Razorpay amount is in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    if (!order) {
      return res.status(500).send('Failed to create Razorpay order');
    }

    res.status(200).json({
      ...order.toJSON ? order.toJSON() : order,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock } = req.body;

    // If it was a mock order, auto-verify it
    if (mock) {
      return res.status(200).json({ message: 'Payment verified successfully (Mock)' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
