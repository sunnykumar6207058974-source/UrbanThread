import React, { useState, useEffect } from 'react';
import { FLASH_SALE_PRODUCTS } from '../data/ecommerceData';
import { useEcommerce } from '../context/EcommerceContext';
import { Zap, Eye, ShoppingCart, Heart, Star, Clock } from 'lucide-react';

export const FlashSale = () => {
  const { addToCart, toggleWishlist, wishlist, setQuickViewProduct } = useEcommerce();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Countdown Timer State (Target: end of current day)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <section className="flash-sale-section" id="flash-sale">
      <div className="flash-sale-container">
        {/* Banner Header with Live Countdown Timer */}
        <div className="flash-header">
          <div className="flash-title-box">
            <div className="flash-icon-wrap">
              <Zap size={24} className="flash-bolt" />
            </div>
            <div>
              <h2 className="flash-main-title">FLASH DEALS OF THE DAY</h2>
              <p className="flash-subtitle">Grab extra discounts before stock runs out!</p>
            </div>
          </div>

          <div className="countdown-box">
            <span className="countdown-label"><Clock size={16} /> ENDS IN:</span>
            <div className="timer-blocks">
              <div className="timer-unit">
                <span className="timer-val">{formatNumber(timeLeft.hours)}</span>
                <span className="timer-lbl">HRS</span>
              </div>
              <span className="colon">:</span>
              <div className="timer-unit">
                <span className="timer-val">{formatNumber(timeLeft.minutes)}</span>
                <span className="timer-lbl">MIN</span>
              </div>
              <span className="colon">:</span>
              <div className="timer-unit">
                <span className="timer-val">{formatNumber(timeLeft.seconds)}</span>
                <span className="timer-lbl">SEC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Cards */}
        <div className="flash-products-grid">
          {FLASH_SALE_PRODUCTS.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const stockPercent = Math.round((product.stockLeft / product.totalStock) * 100);
            const isHovered = hoveredProduct === product.id;
            const secondImg = product.images && product.images.length > 1 ? product.images[1] : null;

            return (
              <div
                key={product.id}
                className="flash-product-card"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="flash-card-media">
                  <span className="discount-tag">{product.discount}</span>
                  <button
                    className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                  >
                    <Heart size={18} fill={isWishlisted ? '#ff3f6c' : 'none'} color={isWishlisted ? '#ff3f6c' : '#ffffff'} />
                  </button>

                  <img
                    src={isHovered && secondImg ? secondImg : product.image}
                    alt={product.name}
                    className="product-media-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.brand)}&background=1e1e2e&color=ff3f6c&size=400&bold=true&format=png`;
                    }}
                  />

                  <button
                    className="quick-view-btn"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <Eye size={16} /> Quick View
                  </button>
                </div>

                <div className="flash-card-content">
                  <div className="product-brand">{product.brand}</div>
                  <h3 className="product-title" title={product.name}>
                    {product.name}
                  </h3>

                  <div className="rating-row">
                    <div className="stars">
                      <Star size={14} fill="#ffb400" color="#ffb400" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="reviews-count">({product.reviewsCount})</span>
                  </div>

                  <div className="price-row">
                    <span className="current-price">${product.price}</span>
                    <span className="original-price">${product.originalPrice}</span>
                    <span className="save-badge">{product.discount}</span>
                  </div>

                  {/* Urgency Progress Bar */}
                  <div className="stock-urgency">
                    <div className="stock-info">
                      <span className="stock-left-text">Almost Sold Out!</span>
                      <span className="stock-count-text">{product.stockLeft} items left</span>
                    </div>
                    <div className="stock-bar-track">
                      <div
                        className="stock-bar-fill"
                        style={{ width: `${Math.max(15, stockPercent)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={18} /> Add To Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
