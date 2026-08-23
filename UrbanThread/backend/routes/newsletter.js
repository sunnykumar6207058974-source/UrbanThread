const express = require('express');
const router = express.Router();

const subscribers = new Set(); // In-memory for now; swap with DB collection

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required.' });
    }
    if (subscribers.has(email.toLowerCase())) {
      return res.json({ success: true, message: 'You are already subscribed!', alreadyExists: true });
    }
    subscribers.add(email.toLowerCase());
    res.status(201).json({ success: true, message: '🎉 You are subscribed! Welcome coupon FASHION20 is now active.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
