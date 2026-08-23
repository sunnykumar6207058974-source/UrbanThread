import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Zap,
  Sparkles,
  ChevronDown,
  X,
  Menu,
  ShieldCheck,
  Truck,
  Package,
  LogOut,
  MapPin,
  Moon,
  Sun
} from 'lucide-react';

export const Header = ({ onOpenAuth }) => {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setSelectedCategory,
    products,
    setQuickViewProduct,
    openAccountTab,
    setIsAdminOpen,
    isDarkMode,
    toggleDarkMode,
    unreadNotificationCount,
    user,
    isLoggedIn,
    logout
  } = useEcommerce();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const popularSearches = ['Watches', 'Shoes', 'Sarees', 'Mobiles', 'Track Pants', 'Laptops', 'Sneakers', 'Headphones'];

  // Filter autocomplete suggestions based on input
  const suggestions = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectSuggestion = (product) => {
    setQuickViewProduct(product);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handlePopularSearchClick = (term) => {
    const termLower = term.toLowerCase().trim();
    if (['watches', 'shoes', 'sarees', 'mobiles', 'track pants', 'laptops', 'women', 'men', 'electronics', 'beauty', 'accessories'].includes(termLower)) {
      setSelectedCategory(term);
      setSearchQuery('');
    } else {
      setSearchQuery(term);
    }
    setIsSearchFocused(false);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      {/* Top Announcement Bar (Flipkart/Myntra Flash Deals Ticker) */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-badge">
            <Zap size={14} className="icon-pulse" /> FLASH DEAL
          </span>
          <p className="announcement-text">
            Extra <strong>20% OFF</strong> on First Order | Use Code: <span className="highlight-code">FASHION20</span>
          </p>
        </div>
        <div className="announcement-links">
          <span><Truck size={14} /> Express 2-Hour Delivery Available</span>
          <span className="divider">|</span>
          <button className="admin-console-pill" onClick={() => setIsAdminOpen(true)}>
            <ShieldCheck size={14} /> Admin Dashboard
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="main-header">
        <div className="header-container">
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <a href="#" className="brand-logo" onClick={() => setSelectedCategory('All')}>
            <div className="logo-icon">
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div className="logo-text">
              <span className="brand-name">URBAN<span className="accent-text">THREAD</span></span>
              <span className="brand-tagline">LUXE & TRENDS</span>
            </div>
          </a>

          {/* Navigation Links with Category Mega Menu */}
          <nav className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <a
              href="#categories"
              className="nav-link"
              onClick={() => {
                setSelectedCategory('All');
                setIsMobileMenuOpen(false);
              }}
            >
              All Drops
            </a>

            {/* Mega Menu Trigger: Women */}
            <div
              className={`mega-menu-wrapper ${activeMegaMenu === 'women' ? 'active' : ''}`}
              onMouseEnter={() => setActiveMegaMenu('women')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <a
                href="#categories"
                className="nav-link mega-link"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory('Women');
                  setActiveMegaMenu(activeMegaMenu === 'women' ? null : 'women');
                  setIsMobileMenuOpen(false);
                }}
              >
                Women <ChevronDown size={14} className={`chevron-icon ${activeMegaMenu === 'women' ? 'open' : ''}`} />
              </a>

              {/* Mega Dropdown Panel */}
              {activeMegaMenu === 'women' && (
                <div className="mega-dropdown-panel animate-fade-in">
                  <div className="mega-grid">
                    <div className="mega-col">
                      <h4>Western & Ethnic</h4>
                      <ul>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Sarees'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Silk & Banarasi Sarees 🥻</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Women'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Dresses & Jumpsuits</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Women'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Tops & Shirts</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Women'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Jackets & Sweaters</a></li>
                      </ul>
                    </div>

                    <div className="mega-col">
                      <h4>Footwear & Bags</h4>
                      <ul>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Shoes'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Sneakers & Shoes 👟</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Watches'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Luxury Watches ⌚</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Accessories'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Leather Handbags</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Accessories'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Clutches & Totes</a></li>
                      </ul>
                    </div>

                    <div className="mega-col mega-banner-col">
                      <div className="mega-card">
                        <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop" alt="Saree Promo" />
                        <div className="mega-card-overlay">
                          <span className="card-badge">FESTIVE SAREES</span>
                          <span className="card-title">Flat 50% OFF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu Trigger: Men */}
            <div
              className={`mega-menu-wrapper ${activeMegaMenu === 'men' ? 'active' : ''}`}
              onMouseEnter={() => setActiveMegaMenu('men')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <a
                href="#categories"
                className="nav-link mega-link"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory('Men');
                  setActiveMegaMenu(activeMegaMenu === 'men' ? null : 'men');
                  setIsMobileMenuOpen(false);
                }}
              >
                Men <ChevronDown size={14} className={`chevron-icon ${activeMegaMenu === 'men' ? 'open' : ''}`} />
              </a>

              {activeMegaMenu === 'men' && (
                <div className="mega-dropdown-panel animate-fade-in">
                  <div className="mega-grid">
                    <div className="mega-col">
                      <h4>Apparel & Streetwear</h4>
                      <ul>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Track Pants'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Track Pants & Joggers 👖</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Men'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Tailored Blazers</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Men'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Oversized Jackets</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Men'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Graphic Tees</a></li>
                      </ul>
                    </div>

                    <div className="mega-col">
                      <h4>Footwear & Watches</h4>
                      <ul>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Shoes'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Running & OG Shoes 👟</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Watches'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Automatic Watches ⌚</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Accessories'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Chronograph Watches</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Accessories'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Sunglasses</a></li>
                      </ul>
                    </div>

                    <div className="mega-col mega-banner-col">
                      <div className="mega-card">
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" alt="Men Promo" />
                        <div className="mega-card-overlay">
                          <span className="card-badge">HOT KICKS</span>
                          <span className="card-title">Min 50% OFF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Electronics Mega Menu */}
            <div
              className={`mega-menu-wrapper ${activeMegaMenu === 'electronics' ? 'active' : ''}`}
              onMouseEnter={() => setActiveMegaMenu('electronics')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <a
                href="#categories"
                className="nav-link mega-link"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory('Electronics');
                  setActiveMegaMenu(activeMegaMenu === 'electronics' ? null : 'electronics');
                  setIsMobileMenuOpen(false);
                }}
              >
                Tech & Gadgets <span className="hot-tag">HOT</span> <ChevronDown size={14} className={`chevron-icon ${activeMegaMenu === 'electronics' ? 'open' : ''}`} />
              </a>

              {activeMegaMenu === 'electronics' && (
                <div className="mega-dropdown-panel animate-fade-in">
                  <div className="mega-grid">
                    <div className="mega-col">
                      <h4>Smart Devices</h4>
                      <ul>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Mobiles'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Flagship Mobiles 📱</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Laptops'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Laptops & MacBooks 💻</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Watches'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Smart & Luxe Watches ⌚</a></li>
                      </ul>
                    </div>

                    <div className="mega-col">
                      <h4>Audio & Sound</h4>
                      <ul>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Electronics'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Wireless Headphones</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Electronics'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Noise Cancellation Earbuds</a></li>
                        <li><a href="#products" onClick={() => { setSelectedCategory('Electronics'); setActiveMegaMenu(null); setIsMobileMenuOpen(false); }}>Bluetooth Speakers</a></li>
                      </ul>
                    </div>

                    <div className="mega-col mega-banner-col">
                      <div className="mega-card">
                        <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop" alt="Tech Promo" />
                        <div className="mega-card-overlay">
                          <span className="card-badge">M3 MAX & 5G</span>
                          <span className="card-title">Up to 45% OFF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#flash-sale"
              className="nav-link flash-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Zap size={14} /> Flash Sale
            </a>
          </nav>

          {/* Instant Search Bar with Visual Autocomplete Suggestions */}
          <div className="search-wrapper">
            <div className={`search-input-box ${isSearchFocused ? 'active' : ''}`}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search for brands, sneakers, dresses, gadgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="search-dropdown">
                {suggestions.length > 0 ? (
                  <>
                    <div className="search-dropdown-header">
                      <span>Suggested Products</span>
                      <span className="count-tag">{suggestions.length} Found</span>
                    </div>
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        className="search-suggestion-item"
                        onMouseDown={() => handleSelectSuggestion(item)}
                      >
                        <img src={item.image} alt={item.name} />
                        <div className="suggestion-info">
                          <span className="suggestion-title">{item.name}</span>
                          <span className="suggestion-meta">
                            {item.brand} • <strong className="suggestion-price">${item.price}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="popular-searches-box">
                    <span className="popular-title">🔥 Popular Searches:</span>
                    <div className="popular-tags font-xs">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          className="popular-chip"
                          onMouseDown={() => handlePopularSearchClick(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="header-actions">
            {/* Dark Mode Toggle Button */}
            <button
              className="action-btn theme-toggle-btn"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={22} color="#ffb400" /> : <Moon size={22} />}
              <span className="action-label">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Wishlist Button */}
            <button
              className="action-btn wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              title="View Wishlist"
            >
              <Heart size={22} />
              <span className="action-label">Wishlist</span>
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              className="action-btn cart-btn"
              onClick={() => setIsCartOpen(true)}
              title="View Cart"
            >
              <div className="cart-icon-container">
                <ShoppingBag size={22} />
                {cartCount > 0 && <span className="badge-count cart-badge">{cartCount}</span>}
              </div>
              <span className="action-label">Bag</span>
            </button>

            {/* User Profile Dropdown Menu */}
            <div
              className="user-profile-trigger"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <button className="action-btn profile-btn" onClick={() => (isLoggedIn ? openAccountTab('profile') : onOpenAuth && onOpenAuth())}>
                {isLoggedIn && user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <User size={22} />
                )}
                <span className="action-label">{isLoggedIn ? (user?.name ? user.name.split(' ')[0] : 'Profile') : 'Sign In'}</span>
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown-menu animate-fade-in">
                  {isLoggedIn && user ? (
                    <>
                      <div className="profile-header" onClick={() => openAccountTab('profile')}>
                        <div className="profile-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <User size={20} color="#ffffff" />
                          )}
                        </div>
                        <div>
                          <h4 className="user-name">{user.name}</h4>
                          <span className="user-status font-xs">{user.memberTier || 'VIP Member'}</span>
                        </div>
                      </div>

                      <div className="profile-links">
                        <button className="profile-item" onClick={() => openAccountTab('profile')}>
                          <User size={16} /> My Account Profile
                        </button>
                        <button className="profile-item" onClick={() => openAccountTab('orders')}>
                          <Package size={16} /> Order History
                        </button>
                        <button className="profile-item" onClick={() => openAccountTab('wishlist')}>
                          <Heart size={16} /> Saved Wishlist ({wishlistCount})
                        </button>
                        <button className="profile-item" onClick={() => openAccountTab('addresses')}>
                          <MapPin size={16} /> Saved Addresses
                        </button>
                        <button className="profile-item" onClick={() => openAccountTab('returns')}>
                          <ShieldCheck size={16} /> Returns & Refunds
                        </button>
                        <button className="profile-item" onClick={() => openAccountTab('notifications')}>
                          <Zap size={16} /> Notifications {unreadNotificationCount > 0 && <span className="unread-dot">{unreadNotificationCount}</span>}
                        </button>
                        <div className="dropdown-divider" />
                        <button className="profile-item logout-item" onClick={logout}>
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <User size={32} color="#ff3f6c" style={{ margin: '0 auto 8px', display: 'block' }} />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '4px' }}>Welcome Guest!</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sign in to access saved wishlist, addresses & VIP rewards.</p>
                      </div>
                      <button
                        className="btn btn-primary btn-block btn-sm"
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (onOpenAuth) onOpenAuth();
                        }}
                      >
                        <User size={14} /> Sign In / Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
