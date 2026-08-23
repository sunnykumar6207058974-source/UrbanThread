const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: String },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  stockLeft: { type: Number, default: 100 },
  totalStock: { type: Number, default: 100 },
  image: { type: String, required: true },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  description: { type: String },
  isFlash: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isFlash: 1 });

module.exports = mongoose.model('Product', productSchema);
