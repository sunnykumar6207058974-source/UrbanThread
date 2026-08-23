const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

// POST /api/coupons/validate — public
router.post('/validate', async (req, res) => {
  try {
    const { code, cartSubtotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required.' });

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: `Invalid coupon "${code}". Try LUXE60, FLASH50 or FASHION20!` });
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      return res.status(410).json({ success: false, message: 'This coupon has reached its usage limit.' });
    }
    if (cartSubtotal && coupon.minOrderAmount && cartSubtotal < coupon.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon.` });
    }

    res.json({
      success: true,
      coupon: { code: coupon.code, discountPercent: coupon.discountPercent, description: coupon.description }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
