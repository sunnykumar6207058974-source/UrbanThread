const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
});

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  unread: { type: Boolean, default: true }
}, { timestamps: true });

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  selectedSize: { type: String, default: null },
  selectedColor: { type: String, default: null }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  memberTier: { type: String, default: 'VIP Gold Member' },
  rewardPoints: { type: Number, default: 500 },
  isAdmin: { type: Boolean, default: false },
  addresses: [addressSchema],
  wishlist: [{ type: String }], // product IDs (strings from static data)
  cart: [cartItemSchema],
  notifications: [notificationSchema],
  appliedCoupon: {
    code: String,
    discountPercent: Number
  }
}, { timestamps: true });

// Pre-save hook for password hashing and dynamic avatar
userSchema.pre('save', async function () {
  if (!this.avatar && this.name) {
    const initials = encodeURIComponent(this.name);
    this.avatar = `https://ui-avatars.com/api/?name=${initials}&background=ff3f6c&color=fff&size=200&bold=true`;
  }
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
