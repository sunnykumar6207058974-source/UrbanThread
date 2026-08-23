import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, Truck, Receipt } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    discountAmount,
    taxAmount,
    cartAfterDiscount,    // Fix #3: was cartTotal
    appliedCoupon,
    applyCoupon
  } = useEcommerce();

  const [couponCode, setCouponCode] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const deliveryCharge = remainingForFreeShipping === 0 ? 0 : 12;
  // Fix #3: use cartAfterDiscount (post-discount pre-tax) as base; grandTotal from context
  const grandTotal = cartAfterDiscount + deliveryCharge + taxAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  const handleStartCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <ShoppingBag size={20} />
            <h3>Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
          </div>
          <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-bar">
          {remainingForFreeShipping === 0 ? (
            <p className="unlocked-text"><Truck size={16} /> 🎉 Congratulations! You've unlocked <strong>FREE Express Shipping</strong>!</p>
          ) : (
            <p className="progress-text">
              Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for FREE Shipping!
            </p>
          )}
          <div className="shipping-progress-track">
            <div className="shipping-progress-fill" style={{ width: `${freeShippingPercent}%` }} />
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart-state">
            <ShoppingBag size={56} className="empty-icon" />
            <h3>Your Bag is Empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button className="btn btn-primary" onClick={() => setIsCartOpen(false)}>
              Explore Trends Now
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="drawer-items-list">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item-row">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.brand)}&background=1e1e2e&color=ff3f6c&size=200&bold=true&format=png`;
                    }}
                  />

                  <div className="cart-item-details">
                    <span className="brand">{item.product.brand}</span>
                    <h4 className="title">{item.product.name}</h4>

                    <div className="variant-tags">
                      {item.selectedSize && <span className="v-tag">Size: {item.selectedSize}</span>}
                      {item.selectedColor && (
                        <span className="v-tag color-v-tag">
                          Color: <span className="color-dot" style={{ backgroundColor: item.selectedColor }} />
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="qty-price-row">
                      <div className="qty-stepper">
                        <button onClick={() => updateQuantity(item.product.id, -1, item.selectedSize, item.selectedColor)} aria-label="Decrease quantity">
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1, item.selectedSize, item.selectedColor)} aria-label="Increase quantity">
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="item-price font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="coupon-section">
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <Tag size={16} className="coupon-icon" />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. LUXE60)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="submit" className="apply-coupon-btn">Apply</button>
              </form>
              {/* Fix #4: Show all valid coupon codes including FLASH50 */}
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <span>Applied: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)</span>
                </div>
              ) : (
                <div className="coupon-hints" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Try: <button className="popular-chip" style={{fontSize:'0.73rem',padding:'2px 7px'}} onMouseDown={() => setCouponCode('LUXE60')}>LUXE60</button>{' '}
                  <button className="popular-chip" style={{fontSize:'0.73rem',padding:'2px 7px'}} onMouseDown={() => setCouponCode('FLASH50')}>FLASH50</button>{' '}
                  <button className="popular-chip" style={{fontSize:'0.73rem',padding:'2px 7px'}} onMouseDown={() => setCouponCode('FASHION20')}>FASHION20</button>
                </div>
              )}
            </div>

            {/* Comprehensive Order Summary Breakdown */}
            <div className="drawer-footer">
              <div className="summary-title font-xs font-bold text-muted">
                <Receipt size={14} /> ORDER SUMMARY
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span>{deliveryCharge === 0 ? <strong className="text-green">FREE</strong> : `$${deliveryCharge.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Sales Tax (8%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary btn-block btn-lg checkout-btn" onClick={handleStartCheckout}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
