const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/users/profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/addresses
router.get('/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/addresses
router.post('/addresses', async (req, res) => {
  try {
    const { name, street, city, phone, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) user.addresses.forEach(a => a.isDefault = false);

    user.addresses.push({ name, street, city, phone, isDefault: isDefault || user.addresses.length === 0 });
    await user.save({ validateBeforeSave: false });
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/users/addresses/:id
router.delete('/addresses/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => String(a._id) !== req.params.id);
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/addresses/:id/default
router.put('/addresses/:id/default', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach(a => a.isDefault = String(a._id) === req.params.id);
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/notifications
router.get('/notifications', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.json({ success: true, notifications: user.notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/notifications/:id/read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const notif = user.notifications.id(req.params.id);
    if (notif) { notif.unread = false; await user.save({ validateBeforeSave: false }); }
    res.json({ success: true, notifications: user.notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/notifications/read-all
router.put('/notifications/read-all', async (req, res) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $set: { 'notifications.$[].unread': false } });
    const user = await User.findById(req.user._id).select('notifications');
    res.json({ success: true, notifications: user.notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/wishlist/:productId — toggle
router.post('/wishlist/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    const idx = user.wishlist.indexOf(pid);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else user.wishlist.push(pid);
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
