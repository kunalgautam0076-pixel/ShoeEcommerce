const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTPAndRegister, loginUser, getUserProfile } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPAndRegister);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);

module.exports = router;
