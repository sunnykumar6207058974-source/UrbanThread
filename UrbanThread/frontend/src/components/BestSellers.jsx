import React from 'react';
import { ALL_PRODUCTS } from '../data/ecommerceData';
import { useEcommerce } from '../context/EcommerceContext';
import { Award, Star, ShoppingBag, Eye, Heart } from 'lucide-react';

export const BestSellers = () => {
  const { addToCart, toggleWishlist, wishlist, setQuickViewProduct } = useEcommerce();
  const bestSellers = ALL_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="bestsellers-section">
      <div className="section-container">
        <div className="section-header text-center">
          <div className="section-tag center-tag">
            <Award size={16} color="#ff3f6c" /> TOP RANKED
          </div>
          <h2 className="section-title">Best Sellers of the Month</h2>
          <p className="section-description">
            Loved by over 100,000+ happy shoppers worldwide. Verified quality & top ratings.
          </p>
        </div>

        <div className="bestsellers-grid">
          {bestSellers.map((product, idx) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div key={product.id} className="bestseller-card">
                <div className="rank-badge">#{idx + 1} BESTSELLER</div>
                
                <div className="bestseller-media">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.brand)}&background=1e1e2e&color=ff3f6c&size=400&bold=true&format=png`;
                    }}
                  />
                  <button
                    className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart size={18} fill={isWishlisted ? '#ff3f6c' : 'none'} color={isWishlisted ? '#ff3f6c' : '#555'} />
                  </button>
                  <button
                    className="card-quickview-btn"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <Eye size={16} /> Quick View
                  </button>
                </div>

                <div className="bestseller-details">
                  <span className="brand">{product.brand}</span>
                  <h3 className="title">{product.name}</h3>

                  <div className="social-proof-tag">
                    🔥 <strong>10,000+</strong> bought in last 30 days
                  </div>

                  <div className="rating-row">
                    <Star size={16} fill="#ffb400" color="#ffb400" />
                    <strong className="score">{product.rating}</strong>
                    <span className="count">({product.reviewsCount} reviews)</span>
                  </div>

                  <div className="price-box">
                    <span className="price-now">${product.price}</span>
                    {product.originalPrice && (
                      <span className="price-was">${product.originalPrice}</span>
                    )}
                    <span className="save-badge">{product.discount}</span>
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingBag size={18} /> Buy Now
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
