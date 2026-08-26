import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { Heart, Eye, ShoppingCart, Star, ArrowUpDown, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductSkeleton } from './ProductSkeleton';

export const FeaturedProducts = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    addToCart,
    toggleWishlist,
    wishlist,
    setQuickViewProduct
  } = useEcommerce();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    setIsLoading(true);
    setCurrentPage(1); // Reset to page 1 whenever filters change
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, activeTab, selectedBrand, maxPrice, minRating, sortBy]);

  const categoriesList = [
    'All',
    'Watches',
    'Shoes',
    'Sarees',
    'Mobiles',
    'Track Pants',
    'Laptops',
    'Women',
    'Men',
    'Electronics',
    'Beauty',
    'Accessories',
    'Home'
  ];
  const tabsList = ['All', 'Trending', 'New Arrivals', 'Best Sellers'];
  
  // Dynamic brand list extract
  const brandList = ['All', ...new Set(products.map((p) => p.brand))];

  // Filter products using all criteria
  let filteredProducts = products.filter((product) => {
    // 1. Live Search matching (with singular/plural stemming)
    const q = searchQuery.trim().toLowerCase();
    const qStem = q.length > 3 ? (q.endsWith('es') ? q.slice(0, -2) : q.endsWith('s') ? q.slice(0, -1) : q) : q;
    const nameLower = (product.name || '').toLowerCase();
    const brandLower = (product.brand || '').toLowerCase();
    const prodCatLower = (product.category || '').toLowerCase();

    const matchesSearch = q === '' ||
      nameLower.includes(q) ||
      (qStem && nameLower.includes(qStem)) ||
      brandLower.includes(q) ||
      prodCatLower.includes(q) ||
      (qStem && prodCatLower.includes(qStem));

    // 2. Category matching
    const catLower = selectedCategory.toLowerCase();
    let matchesCategory = selectedCategory === 'All' || prodCatLower === catLower;
    if (!matchesCategory) {
      if ((catLower === 'shoes' || catLower === 'footwear') && (prodCatLower === 'shoes' || prodCatLower === 'footwear')) matchesCategory = true;
      if ((catLower === 'mobiles' || catLower === 'mobile') && (prodCatLower === 'mobiles' || prodCatLower === 'mobile')) matchesCategory = true;
      if ((catLower === 'watches' || catLower === 'watch') && (prodCatLower === 'watches' || prodCatLower === 'watch')) matchesCategory = true;
      if ((catLower === 'track pants' || catLower === 'trackpants' || catLower === 'track pant') && (prodCatLower === 'track pants' || prodCatLower === 'track pant')) matchesCategory = true;
      if ((catLower === 'sarees' || catLower === 'saree') && (prodCatLower === 'sarees' || prodCatLower === 'saree')) matchesCategory = true;
      if ((catLower === 'laptops' || catLower === 'laptop') && (prodCatLower === 'laptops' || prodCatLower === 'laptop')) matchesCategory = true;
    }

    // 3. Tab matching
    let matchesTab = true;
    if (activeTab === 'Trending') matchesTab = product.isTrending || product.rating >= 4.8;
    if (activeTab === 'New Arrivals') matchesTab = product.isNew || product.isNewProduct;
    if (activeTab === 'Best Sellers') matchesTab = product.isBestSeller;

    // 4. Brand matching
    const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;

    // 5. Price range matching
    const matchesPrice = product.price <= maxPrice;

    // 6. Rating matching
    const matchesRating = product.rating >= minRating;

    return matchesSearch && matchesCategory && matchesTab && matchesBrand && matchesPrice && matchesRating;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating' || sortBy === 'popularity') {
    filteredProducts.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => ((b.isNew || b.isNewProduct) ? 1 : 0) - ((a.isNew || a.isNewProduct) ? 1 : 0));
  }

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setActiveTab('All');
    setSelectedBrand('All');
    setMaxPrice(3000);
    setMinRating(0);
    setSortBy('default');
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section-container" id="products">
      <div className="section-header flex-header">
        <div>
          <div className="section-tag">SMART DISCOVERY</div>
          <h2 className="section-title">Featured Products & Trends</h2>
        </div>
        <p className="section-description">
          Filter through top designer apparel, flagship electronics & luxury kicks.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="product-filter-bar">
        <div className="category-pills">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Toolbar Controls */}
        <div className="filter-controls">
          <div className="tab-filters">
            {tabsList.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="toolbar-right">
            {/* Filter Toggle Button */}
            <button
              className={`btn btn-outline filter-toggle-btn ${showFilterDrawer ? 'active' : ''}`}
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            {/* Sort Selector */}
            <div className="sort-dropdown-wrap">
              <ArrowUpDown size={16} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Popularity & Reviews</option>
                <option value="newest">Newest Drops</option>
              </select>
            </div>
          </div>
        </div>

        {/* Smart Filters Expandable Bar */}
        {showFilterDrawer && (
          <div className="smart-filter-panel animate-slide-up">
            <div className="smart-filter-grid">
              {/* Brand Filter */}
              <div className="filter-group">
                <label className="filter-label">Brand:</label>
                <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  {brandList.map((b) => (
                    <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="filter-group price-slider-group">
                <label className="filter-label">
                  Max Price: <strong>${maxPrice}</strong>
                </label>
                <input
                  type="range"
                  min="30"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <label className="filter-label">Min Rating:</label>
                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                  <option value={0}>All Ratings</option>
                  <option value={4.5}>4.5+ Stars ⭐</option>
                  <option value={4.8}>4.8+ Stars ⭐</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="filter-group reset-group">
                <button className="btn btn-outline-light btn-sm reset-btn" onClick={resetAllFilters}>
                  <RotateCcw size={14} /> Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <ProductSkeleton count={8} />
      ) : filteredProducts.length === 0 ? (
        <div className="no-products-found">
          <h3>No products match your filter criteria</h3>
          <p>Try increasing your price slider or clearing brand & category filters.</p>
          <button className="btn btn-primary" onClick={resetAllFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {pagedProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isHovered = hoveredProduct === product.id;
            const secondImg = product.images && product.images.length > 1 ? product.images[1] : null;

            return (
              <div
                key={product.id}
                className="product-card"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="card-media">
                  {product.discount && <span className="card-discount-badge">{product.discount}</span>}
                  {product.isNew && <span className="card-new-badge">NEW</span>}

                  <button
                    className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                  >
                    <Heart size={18} fill={isWishlisted ? '#ff3f6c' : 'none'} color={isWishlisted ? '#ff3f6c' : '#555555'} />
                  </button>

                  <img
                    src={isHovered && secondImg ? secondImg : product.image}
                    alt={product.name}
                    className="card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.background = 'linear-gradient(135deg, #2c2c3a, #3a3a4e)';
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.brand)}&background=1e1e2e&color=ff3f6c&size=400&bold=true&format=png`;
                    }}
                  />

                  <button
                    className="card-quickview-btn"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <Eye size={16} /> Quick View
                  </button>
                </div>

                <div className="card-body">
                  <div className="card-brand">{product.brand}</div>
                  <h3 className="card-title" title={product.name}>
                    {product.name}
                  </h3>

                  {product.colors && (
                    <div className="color-swatches">
                      {product.colors.map((color, idx) => (
                        <span
                          key={idx}
                          className="swatch-circle"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="card-meta">
                    <div className="rating">
                      <Star size={14} fill="#ffb400" color="#ffb400" />
                      <span>{product.rating}</span>
                      <span className="reviews font-sm">({product.reviewsCount})</span>
                    </div>

                    <div className="price-tag-group">
                      <span className="price-current">${product.price}</span>
                      {product.originalPrice && (
                        <span className="price-old">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn btn-block btn-primary-light card-add-btn"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={16} /> Add To Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="pagination-bar">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={18} /> Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-num-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Results count */}
      {!isLoading && filteredProducts.length > 0 && (
        <p className="pagination-info">
          Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
        </p>
      )}
    </section>
  );
};
