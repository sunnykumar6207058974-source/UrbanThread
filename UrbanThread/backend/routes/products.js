const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

// GET /api/products  — public, supports ?category=&search=&isFlash=&isBestSeller=&sort=
router.get('/', async (req, res) => {
  try {
    const { category, search, isFlash, isBestSeller, isTrending, isNew, sort } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') filter.category = new RegExp(category, 'i');
    if (isFlash === 'true') filter.isFlash = true;
    if (isBestSeller === 'true') filter.isBestSeller = true;
    if (isTrending === 'true') filter.isTrending = true;
    if (isNew === 'true') filter.isNewProduct = true;
    if (search) filter.$text = { $search: search };

    let query = Product.find(filter);

    if (sort === 'price-low') query = query.sort({ price: 1 });
    else if (sort === 'price-high') query = query.sort({ price: -1 });
    else if (sort === 'rating') query = query.sort({ reviewsCount: -1 });
    else if (sort === 'newest') query = query.sort({ isNewProduct: -1, createdAt: -1 });
    else query = query.sort({ createdAt: 1 });

    const products = await query.lean();
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id  — public
router.get('/:id', async (req, res) => {
  try {
    const isObjectId = typeof req.params.id === 'string' && /^[a-f\d]{24}$/i.test(req.params.id);
    let product;
    if (isObjectId) {
      product = await Product.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
    } else {
      product = await Product.findOne({ slug: req.params.id });
    }

    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id — admin only (soft delete)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deactivated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
