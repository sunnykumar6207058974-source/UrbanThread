const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const useragent = require('express-useragent');
const admin = require('../config/firebaseAdmin');
const { sendLoginAlert } = require('../services/emailService');

const getDeviceInfo = (req) => {
  const ua = req.useragent || ((useragent.default && useragent.default.parse) ? useragent.default.parse(req.headers['user-agent'] || '') : {});
  let deviceType = '💻 Laptop / Desktop';
  if (ua && (ua.isMobile || ua.isiPhone || ua.isAndroid)) deviceType = '📱 Mobile Phone';
  else if (ua && (ua.isTablet || ua.isiPad)) deviceType = '📱 Tablet';

  const os = ua ? (ua.os || ua.platform || 'Unknown OS') : 'Unknown OS';
  const browser = ua ? `${ua.browser || 'Web Browser'} ${ua.version || ''}`.trim() : 'Web Browser';
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '').split(',')[0].trim();

  return { deviceType, os, browser, ip };
};

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

      // Trigger Login Security Alert Email
      const deviceInfo = getDeviceInfo(req);
      sendLoginAlert({
        toEmail: user.email,
        userName: user.name,
        ...deviceInfo
      }).catch(err => console.error('Error sending login email alert:', err));

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
      const { phone, name, email } = req.body;
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      let user = await User.findOne({ phone: cleanPhone });

      if (!user) {
        // Register new user with this phone
        const defaultName = name || `User ${cleanPhone.slice(-4) || 'VIP'}`;
        const defaultEmail = (email && email.includes('@')) 
          ? email.trim().toLowerCase() 
          : `${cleanPhone.replace(/[^0-9]/g, '') || Date.now()}@urbanthread.in`;

        // Check if an existing user has that email
        const existingEmailUser = await User.findOne({ email: defaultEmail });
        if (existingEmailUser) {
          user = existingEmailUser;
          user.phone = cleanPhone;
          if (name) user.name = name;
          await user.save({ validateBeforeSave: false });
        } else {
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
        }
      } else {
        if (name && (!user.name || user.name.startsWith('User '))) {
          user.name = name;
        }
        if (email && email.includes('@') && (!user.email || user.email.endsWith('@urbanthread.in'))) {
          user.email = email.trim().toLowerCase();
        }
        user.notifications.unshift({
          title: `📱 Welcome back, ${user.name.split(' ')[0]}!`,
          message: 'Logged in via Mobile Number verification.',
          time: 'Just now',
          unread: true
        });
        await user.save({ validateBeforeSave: false });
      }

      // Trigger Login Security Alert Email if real email exists
      if (user.email && !user.email.endsWith('@urbanthread.in')) {
        const deviceInfo = getDeviceInfo(req);
        sendLoginAlert({
          toEmail: user.email,
          userName: user.name,
          ...deviceInfo
        }).catch(err => console.error('Error sending phone login email alert:', err));
      }

      sendTokenResponse(user, 200, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/auth/firebase-login (Google & Firebase Auth)
router.post('/firebase-login', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Firebase ID token is required.' });
    }

    if (!admin.isConfigured()) {
      return res.status(500).json({ success: false, message: 'Firebase Admin is not configured on the server.' });
    }

    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid, phone_number } = decodedToken;

    const resolvedEmail = email || (req.body.email && req.body.email.includes('@') ? req.body.email.trim().toLowerCase() : null) || (phone_number ? `${phone_number.replace(/[^0-9]/g, '')}@urbanthread.in` : null);

    if (!resolvedEmail && !phone_number) {
      return res.status(400).json({ success: false, message: 'Firebase account must have an email or phone number.' });
    }

    let user = null;
    if (uid) user = await User.findOne({ firebaseUid: uid });
    if (!user && phone_number) user = await User.findOne({ phone: phone_number });
    if (!user && resolvedEmail) user = await User.findOne({ email: resolvedEmail });

    if (!user) {
      const displayName = name || (phone_number ? `Member ${phone_number.slice(-4)}` : resolvedEmail.split('@')[0]) || 'VIP Member';
      user = await User.create({
        name: displayName,
        email: resolvedEmail,
        phone: phone_number || '',
        avatar: picture || '',
        firebaseUid: uid,
        password: 'fb-auth-' + Math.random().toString(36).slice(2, 12),
        memberTier: 'VIP Gold Member',
        rewardPoints: 500,
        appliedCoupon: { code: 'FASHION20', discountPercent: 20 },
        notifications: [{
          title: `🎉 Welcome to UrbanThread, ${displayName}!`,
          message: phone_number ? `Verified with mobile number ${phone_number}.` : 'Signed in via Google. Your VIP welcome rewards are unlocked!',
          time: 'Just now',
          unread: true
        }]
      });
    } else {
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      if (uid && !user.firebaseUid) {
        user.firebaseUid = uid;
      }
      if (phone_number && !user.phone) {
        user.phone = phone_number;
      }
      if (req.body.email && req.body.email.includes('@') && (!user.email || user.email.endsWith('@urbanthread.in'))) {
        user.email = req.body.email.trim().toLowerCase();
      }
      user.notifications.unshift({
        title: `🔑 Welcome back, ${user.name.split(' ')[0]}!`,
        message: phone_number ? `Logged in via Mobile OTP (${phone_number}).` : 'Signed in successfully via Google.',
        time: 'Just now',
        unread: true
      });
      await user.save({ validateBeforeSave: false });
    }

    // Trigger Login Security Alert Email
    if (user.email && !user.email.endsWith('@urbanthread.in')) {
      const deviceInfo = getDeviceInfo(req);
      sendLoginAlert({
        toEmail: user.email,
        userName: user.name,
        ...deviceInfo
      }).catch(err => console.error('Error sending login email alert:', err));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Firebase login error:', err);
    res.status(401).json({ success: false, message: 'Authentication failed: ' + (err.message || 'Invalid Firebase Token') });
  }
});

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
