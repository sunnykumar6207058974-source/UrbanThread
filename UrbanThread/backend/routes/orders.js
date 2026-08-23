const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/orders — my orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id — single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders — place order
router.post('/', async (req, res) => {
  try {
    const { items, subtotal, discountAmount, couponCode, taxAmount, deliveryCharge,
            grandTotal, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    const orderId = `UT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `FX-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      orderId,
      user: req.user._id,
      items,
      subtotal,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      taxAmount: taxAmount || 0,
      deliveryCharge: deliveryCharge || 0,
      grandTotal,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      status: 'confirmed',
      trackingNumber,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      timeline: [
        { status: 'confirmed', message: '✅ Order confirmed and payment received.' },
        { status: 'processing', message: '📦 Items picked and packaging in progress.' }
      ]
    });

    // Clear cart & coupon on user
    await User.findByIdAndUpdate(req.user._id, {
      cart: [],
      appliedCoupon: null,
      $push: {
        notifications: {
          $each: [{
            title: `📦 Order #${orderId} Confirmed!`,
            message: `Your order was placed. Tracking: ${trackingNumber}. FedEx Express dispatch in progress.`,
            time: 'Just now',
            unread: true
          }],
          $position: 0
        }
      }
    });

    // Increment coupon usage
    if (couponCode) {
      await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { usageCount: 1 } });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
