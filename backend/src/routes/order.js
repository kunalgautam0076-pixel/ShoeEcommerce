const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getUserOrders,
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/user/:userId', getUserOrders);

module.exports = router;
