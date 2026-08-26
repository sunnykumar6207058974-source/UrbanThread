const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// All cart routes require auth
router.use(protect);

// Helper to find product by ObjectId or slug
const findProduct = async (idOrSlug) => {
  if (!idOrSlug) return null;
  const isObjectId = typeof idOrSlug === 'string' && /^[a-f\d]{24}$/i.test(idOrSlug);
  if (isObjectId) {
    const prod = await Product.findById(idOrSlug);
    if (prod) return prod;
  }
  return await Product.findOne({ slug: idOrSlug });
};

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cart — add item
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1, selectedSize = null, selectedColor = null } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'productId is required.' });

    const product = await findProduct(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const user = await User.findById(req.user._id);

    // Check if same variant exists
    const existingIdx = user.cart.findIndex(
      (item) => String(item.product) === String(product._id) &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
    );

    if (existingIdx > -1) {
      user.cart[existingIdx].quantity += Number(quantity);
    } else {
      user.cart.push({ product: product._id, quantity: Number(quantity), selectedSize, selectedColor });
    }

    await user.save({ validateBeforeSave: false });
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updatedUser.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cart/sync — sync entire cart
router.put('/sync', async (req, res) => {
  try {
    const { items = [] } = req.body;
    const user = await User.findById(req.user._id);
    const newCart = [];

    for (const item of items) {
      const productId = item.product?._id || item.product?.id || item.productId;
      if (!productId) continue;
      const product = await findProduct(productId);
      if (!product) continue;

      const qty = Number(item.quantity) || 1;
      const selectedSize = item.selectedSize || null;
      const selectedColor = item.selectedColor || null;

      const existingIdx = newCart.findIndex(
        (ci) => String(ci.product) === String(product._id) &&
                ci.selectedSize === selectedSize &&
                ci.selectedColor === selectedColor
      );

      if (existingIdx > -1) {
        newCart[existingIdx].quantity += qty;
      } else {
        newCart.push({
          product: product._id,
          quantity: qty,
          selectedSize,
          selectedColor
        });
      }
    }

    user.cart = newCart;
    await user.save({ validateBeforeSave: false });
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updatedUser.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cart/:itemId — update quantity
router.put('/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found.' });

    if (Number(quantity) <= 0) {
      user.cart.pull({ _id: req.params.itemId });
    } else {
      item.quantity = Number(quantity);
    }

    await user.save({ validateBeforeSave: false });
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updatedUser.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cart/:itemId — remove specific item
router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const item = user.cart.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found.' });
    
    user.cart.pull({ _id: req.params.itemId });
    await user.save({ validateBeforeSave: false });
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updatedUser.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cart — clear entire cart
router.delete('/', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ success: true, cart: [], message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
