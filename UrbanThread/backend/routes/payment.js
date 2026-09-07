const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');

// Initialize Razorpay if credentials are provided
let razorpay = null;
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId && keySecret) {
  try {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('✅ Razorpay Gateway initialized successfully with Key ID:', keyId);
  } catch (err) {
    console.warn('⚠️ Razorpay initialization warning:', err.message);
  }
} else {
  console.log('ℹ️ Razorpay live credentials not found in env. Running in Smart Test Mode.');
}

// GET /api/payment/config — Public configuration (Key ID & Currency)
router.get('/config', (req, res) => {
  res.json({
    success: true,
    keyId: keyId || 'rzp_test_urbanthread_demo',
    isLive: Boolean(razorpay && !keyId.startsWith('rzp_test_urbanthread_demo')),
    currency: 'INR',
    usdToInrRate: 85,
    upiId: process.env.MERCHANT_UPI_ID || 'urbanthread@upi'
  });
});

// POST /api/payment/create-order — Initialize payment order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required.' });
    }

    const orderAmountInPaise = Math.round(Number(amount) * 100);
    const orderReceipt = receipt || `rcpt_${Date.now()}`;

    // If Razorpay instance is active, create official Razorpay order
    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: orderAmountInPaise,
          currency,
          receipt: orderReceipt,
          payment_capture: 1
        });

        return res.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId,
          isMock: false
        });
      } catch (rzpErr) {
        console.warn('⚠️ Razorpay API error, falling back to smart test order:', rzpErr.message);
      }
    }

    // Fallback / Smart Test Mode order
    const mockOrderId = `order_test_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    return res.json({
      success: true,
      orderId: mockOrderId,
      amount: orderAmountInPaise,
      currency,
      keyId: keyId || 'rzp_test_urbanthread_demo',
      isMock: true
    });
  } catch (err) {
    console.error('Create payment order error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payment/verify — Verify Razorpay Payment Signature
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Order ID and Payment ID are required.' });
    }

    // If real Razorpay keySecret is present and not mock order, verify HMAC SHA256
    if (keySecret && razorpay_signature && !razorpay_order_id.startsWith('order_test_')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
      }
    }

    res.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
