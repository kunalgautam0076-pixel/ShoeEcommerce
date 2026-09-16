const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user directly
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !password) {
      return res.status(400).json({ message: 'First name, last name, and password are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Please provide either an email or a phone number' });
    }

    // Build conditions to check existing user
    const checkConditions = [];
    if (email) checkConditions.push({ email });
    if (phone) checkConditions.push({ phone });

    const userExists = await User.findOne({ $or: checkConditions });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    // Create user directly
    const user = await User.create({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      password,
    });

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

// @desc    Auth user & get token (supports Email or Phone login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide login credentials and password' });
    }

    // Allow login with either email or phone
    const user = await User.findOne({
      $or: [{ email }, { phone: email }]
    }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  res.json({ message: 'Profile route' });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
