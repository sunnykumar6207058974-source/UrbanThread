const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String, default: null },
  selectedColor: { type: String, default: null }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],

  // Pricing
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  taxAmount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },

  // Delivery
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    phone: String
  },
  paymentMethod: { type: String, enum: ['card', 'upi', 'wallet', 'cod'], default: 'card' },

  // Status & Tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'confirmed'
  },
  trackingNumber: { type: String, default: null },
  estimatedDelivery: { type: String, default: null },

  // Timeline
  timeline: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
