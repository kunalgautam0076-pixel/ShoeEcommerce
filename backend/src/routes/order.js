const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/myorders', getUserOrders);

module.exports = router;
