const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ isAdmin: false }),
      Product.countDocuments({ isActive: true }),
      Order.find().select('grandTotal status createdAt')
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const confirmedOrders = orders.filter(o => o.status !== 'cancelled').length;
    const conversionRate = totalUsers > 0 ? ((confirmedOrders / totalUsers) * 100).toFixed(1) : 0;

    // Revenue by status
    const pendingRevenue = orders.filter(o => o.status === 'pending').reduce((s, o) => s + (o.grandTotal || 0), 0);
    const completedRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.grandTotal || 0), 0);

    // Recent 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(o => new Date(o.createdAt) > thirtyDaysAgo).length;
    const recentRevenue = orders.filter(o => new Date(o.createdAt) > thirtyDaysAgo)
      .reduce((s, o) => s + (o.grandTotal || 0), 0);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders,
        totalUsers,
        totalProducts,
        conversionRate,
        pendingRevenue: pendingRevenue.toFixed(2),
        completedRevenue: completedRevenue.toFixed(2),
        recentOrders,
        recentRevenue: recentRevenue.toFixed(2)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Order.countDocuments();
    res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    order.status = status;
    if (message) order.timeline.push({ status, message });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/coupons
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
