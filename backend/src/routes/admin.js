const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getAllOrders, 
  updateOrderStatus, 
  getAllUsers,
  getStoreSettings,
  updateStoreSettings
} = require('../controllers/adminController');

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);
router.get('/settings', getStoreSettings);
router.put('/settings', updateStoreSettings);

module.exports = router;
