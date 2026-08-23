import React, { useState } from 'react';
import { ALL_PRODUCTS } from '../data/ecommerceData';
import { useEcommerce } from '../context/EcommerceContext';
import { Sparkles, Star, ShoppingBag, Eye, Heart, Zap, ArrowRight } from 'lucide-react';

export const RecommendedForYou = () => {
  const { addToCart, toggleWishlist, wishlist, setQuickViewProduct, setSelectedCategory } = useEcommerce();
  const [selectedTag, setSelectedTag] = useState('All');

  // Curated list of recommended products
  const recommendedPicks = [
    {
      id: 'rec-1',
      matchScore: '99% Match',
      tag: '🔥 Customer Favorite',
      ...ALL_PRODUCTS.find((p) => p.id === 'watch-1') || ALL_PRODUCTS[0]
    },
    {
      id: 'rec-2',
      matchScore: '98% Match',
      tag: '✨ Trending Saree',
      ...ALL_PRODUCTS.find((p) => p.id === 'saree-1') || ALL_PRODUCTS[1]
    },
    {
      id: 'rec-3',
      matchScore: '96% Match',
      tag: '⚡ Best Sportswear',
      ...ALL_PRODUCTS.find((p) => p.id === 'trackpant-1') || ALL_PRODUCTS[2]
    },
    {
      id: 'rec-4',
      matchScore: '95% Match',
      tag: '👑 Swiss Luxury',
      ...ALL_PRODUCTS.find((p) => p.id === 'watch-4') || ALL_PRODUCTS[3]
    },
    {
      id: 'rec-5',
      matchScore: '97% Match',
      tag: '🌟 Royal Bridal',
      ...ALL_PRODUCTS.find((p) => p.id === 'saree-2') || ALL_PRODUCTS[4]
    },
    {
      id: 'rec-6',
      matchScore: '94% Match',
      tag: '🏃 Athletic Pick',
      ...ALL_PRODUCTS.find((p) => p.id === 'trackpant-2') || ALL_PRODUCTS[5]
    },
    {
      id: 'rec-7',
      matchScore: '96% Match',
      tag: '💻 Flagship OLED',
      ...ALL_PRODUCTS.find((p) => p.id === 'laptop-1') || ALL_PRODUCTS[6]
    },
    {
      id: 'rec-8',
      matchScore: '98% Match',
      tag: '👟 Iconic Sneaker',
      ...ALL_PRODUCTS.find((p) => p.id === 'shoe-1') || ALL_PRODUCTS[7]
    }
  ];

  const filterTabs = [
    { label: 'All Recommended', value: 'All' },
    { label: '⌚ Watches', value: 'Watches' },
    { label: '🥻 Sarees', value: 'Sarees' },
    { label: '👖 Track Pants', value: 'Track Pants' },
    { label: '👟 Shoes', value: 'Shoes' },
    { label: '💻 Laptops & Tech', value: 'Laptops' }
  ];

  const displayedProducts = selectedTag === 'All'
    ? recommendedPicks
    : recommendedPicks.filter((p) => (p.category || '').toLowerCase() === selectedTag.toLowerCase());

  const handleCategoryNav = (cat) => {
    setSelectedCategory(cat);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="recommended-section" id="recommended">
      <div className="section-container">
        <div className="recommended-header-row">
          <div>
            <div className="section-tag">
              <Sparkles size={16} color="#ff3f6c" /> PERSONALIZED FOR YOU
            </div>
            <h2 className="section-title">Recommended & Suggested Picks</h2>
            <p className="section-description">
              Curated especially for you based on trending styles, premium quality ratings, and recent shopper choices.
            </p>
          </div>

          <div className="recommended-filter-pills">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                className={`rec-pill-btn ${selectedTag === tab.value ? 'active' : ''}`}
                onClick={() => setSelectedTag(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="recommended-grid">
          {displayedProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div key={product.id} className="recommended-card">
                <div className="rec-badge-row">
                  <span className="match-badge">
                    <Sparkles size={12} /> {product.matchScore || '96% Match'}
                  </span>
                  {product.tag && (
                    <span className="rec-highlight-tag">{product.tag}</span>
                  )}
                </div>

                <div className="rec-media-box">
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
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
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

                <div className="rec-content">
                  <div className="rec-meta">
                    <span className="brand">{product.brand}</span>
                    <span className="category-tag">{product.category}</span>
                  </div>

                  <h3 className="rec-title" title={product.name}>
                    {product.name}
                  </h3>

                  <div className="rec-rating-row">
                    <Star size={15} fill="#ffb400" color="#ffb400" />
                    <strong>{product.rating || 4.9}</strong>
                    <span className="reviews">({product.reviewsCount || 850}+ reviews)</span>
                  </div>

                  <div className="rec-price-row">
                    <div className="prices">
                      <span className="current-price">${product.price}</span>
                      {product.originalPrice && (
                        <span className="old-price">${product.originalPrice}</span>
                      )}
                    </div>
                    {product.discount && (
                      <span className="discount-pill">{product.discount}</span>
                    )}
                  </div>

                  <div className="rec-actions">
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingBag size={16} /> Add To Bag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="recommended-footer-banner">
          <div className="banner-text">
            <Zap size={22} color="#ff3f6c" />
            <span>Looking for more tailored recommendations across all categories?</span>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => handleCategoryNav('All')}
          >
            Explore Complete Catalog <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
