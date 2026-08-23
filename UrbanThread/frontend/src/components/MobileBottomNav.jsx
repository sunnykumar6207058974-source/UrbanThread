import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { Home, LayoutGrid, User, ShoppingBag, Heart, Sparkles } from 'lucide-react';

export const MobileBottomNav = ({ onOpenAuth }) => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAccountOpen,
    setSelectedCategory,
    isLoggedIn,
    selectedCategory
  } = useEcommerce();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedCategory('All');
  };

  const handleCategoriesClick = () => {
    const categoriesSection = document.getElementById('categories') || document.getElementById('products');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      setIsAccountOpen(true);
    } else if (onOpenAuth) {
      onOpenAuth();
    } else {
      setIsAccountOpen(true);
    }
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Home Button */}
      <button
        type="button"
        className={`mobile-nav-btn ${selectedCategory === 'All' ? 'active' : ''}`}
        onClick={handleHomeClick}
        aria-label="Home"
      >
        <div className="nav-icon-wrap">
          <Home size={21} />
        </div>
        <span className="nav-label">Home</span>
      </button>

      {/* 2. Categories Button */}
      <button
        type="button"
        className={`mobile-nav-btn ${selectedCategory !== 'All' ? 'active' : ''}`}
        onClick={handleCategoriesClick}
        aria-label="Categories"
      >
        <div className="nav-icon-wrap">
          <LayoutGrid size={21} />
        </div>
        <span className="nav-label">Categories</span>
      </button>

      {/* 3. Wishlist Button */}
      <button
        type="button"
        className="mobile-nav-btn"
        onClick={() => setIsWishlistOpen(true)}
        aria-label="Wishlist"
      >
        <div className="nav-icon-wrap">
          <Heart size={21} />
          {wishlistCount > 0 && (
            <span className="mobile-nav-badge wishlist-badge">{wishlistCount}</span>
          )}
        </div>
        <span className="nav-label">Wishlist</span>
      </button>

      {/* 4. Account Button */}
      <button
        type="button"
        className="mobile-nav-btn"
        onClick={handleAccountClick}
        aria-label="Account"
      >
        <div className="nav-icon-wrap">
          <User size={21} />
          {isLoggedIn && <span className="online-indicator-dot" />}
        </div>
        <span className="nav-label">{isLoggedIn ? 'Account' : 'Login'}</span>
      </button>

      {/* 5. Cart Button */}
      <button
        type="button"
        className="mobile-nav-btn cart-nav-btn"
        onClick={() => setIsCartOpen(true)}
        aria-label="Cart"
      >
        <div className="nav-icon-wrap">
          <ShoppingBag size={21} />
          {cartCount > 0 && (
            <span className="mobile-nav-badge cart-badge">{cartCount}</span>
          )}
        </div>
        <span className="nav-label">Cart</span>
      </button>
    </nav>
  );
};
