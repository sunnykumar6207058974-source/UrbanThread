const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      memberTier: user.memberTier,
      rewardPoints: user.rewardPoints,
      isAdmin: user.isAdmin,
      wishlist: user.wishlist,
      addresses: user.addresses,
      notifications: user.notifications,
      appliedCoupon: user.appliedCoupon
    }
  });
};

// POST /api/auth/register
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

      const user = await User.create({
        name,
        email,
        password,
        memberTier: 'VIP Gold Member',
        rewardPoints: 500,
        appliedCoupon: { code: 'FASHION20', discountPercent: 20 },
        notifications: [{
          title: `🎉 Welcome to UrbanThread, ${name}!`,
          message: 'Your account is created. 20% OFF welcome coupon auto-applied.',
          time: 'Just now',
          unread: true
        }]
      });

      sendTokenResponse(user, 201, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Add login notification
      user.notifications.unshift({
        title: `🔑 Welcome back, ${user.name.split(' ')[0]}!`,
        message: 'Your wishlist, addresses & VIP rewards have been loaded.',
        time: 'Just now',
        unread: true
      });
      await user.save({ validateBeforeSave: false });

      sendTokenResponse(user, 200, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/auth/login-phone
router.post('/login-phone',
  [
    body('phone').trim().notEmpty().withMessage('Valid phone number is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { phone, name } = req.body;
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      let user = await User.findOne({ phone: cleanPhone });

      if (!user) {
        // Register new user with this phone
        const defaultName = name || `User ${cleanPhone.slice(-4) || 'VIP'}`;
        const defaultEmail = `${cleanPhone.replace(/[^0-9]/g, '') || Date.now()}@urbanthread.in`;
        user = await User.create({
          name: defaultName,
          email: defaultEmail,
          phone: cleanPhone,
          password: 'phone-auth-' + Math.random().toString(36).slice(2, 10),
          memberTier: 'VIP Gold Member',
          rewardPoints: 500,
          appliedCoupon: { code: 'FASHION20', discountPercent: 20 },
          notifications: [{
            title: `🎉 Welcome to UrbanThread, ${defaultName}!`,
            message: `Account created with phone ${cleanPhone}. 20% OFF welcome coupon activated!`,
            time: 'Just now',
            unread: true
          }]
        });
      } else {
        if (name && (!user.name || user.name.startsWith('User '))) {
          user.name = name;
        }
        user.notifications.unshift({
          title: `📱 Welcome back, ${user.name.split(' ')[0]}!`,
          message: 'Logged in via Mobile Number verification.',
          time: 'Just now',
          unread: true
        });
        await user.save({ validateBeforeSave: false });
      }

      sendTokenResponse(user, 200, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/auth/me (protected)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/password (protected)
router.put('/password', protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const user = await User.findById(req.user._id).select('+password');
      if (!(await user.comparePassword(req.body.currentPassword))) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      }
      user.password = req.body.newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;
