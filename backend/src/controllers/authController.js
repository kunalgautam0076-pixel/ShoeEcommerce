const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_12345', {
    expiresIn: '30d',
  });
};

// In-memory store for OTPs (For production, use Redis)
const otpStore = new Map();

// @desc    Send OTP for registration
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store user data and OTP (expires in 10 minutes)
    const identifier = phone || email;
    otpStore.set(identifier, {
      otp,
      userData: { firstName, lastName, email, phone, password },
      expiresAt: Date.now() + 10 * 60 * 1000, 
    });

    console.log(`[Mock SMS/Email] OTP for ${identifier} is: ${otp}`);

    res.status(200).json({ 
      message: 'OTP sent successfully', 
      identifier,
      mockOtp: otp // Sending it back for testing purposes so we can auto-fill or show it
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and create user
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTPAndRegister = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const record = otpStore.get(identifier);

    if (!record) {
      return res.status(400).json({ message: 'OTP expired or not requested' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(identifier);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    // OTP is valid, create the user
    const { firstName, lastName, email, phone, password } = record.userData;
    
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    // Remove OTP from memory
    otpStore.delete(identifier);

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email - Need to select password explicitly since we set select: false in schema
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Needs token middleware later)
const getUserProfile = async (req, res) => {
  // To be implemented when we add authMiddleware
  res.json({ message: 'Profile route' });
};

module.exports = {
  sendOTP,
  verifyOTPAndRegister,
  loginUser,
  getUserProfile
};
