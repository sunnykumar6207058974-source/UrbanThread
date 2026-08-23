const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountPercent: { type: Number, required: true, min: 1, max: 100 },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  minOrderAmount: { type: Number, default: 0 },
  usageCount: { type: Number, default: 0 },
  maxUsage: { type: Number, default: null } // null = unlimited
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
