import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  MapPin,
  Check,
  ZoomIn,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const ProductModal = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    wishlist,
    setIsCartOpen,
    products
  } = useEcommerce();

  const [selectedImg, setSelectedImg] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pincode, setPincode] = useState('10001');
  const [pincodeStatus, setPincodeStatus] = useState('⚡ Delivery by Thursday, Aug 6 | Free Shipping');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImg(quickViewProduct.image);
      setSelectedSize(quickViewProduct.sizes ? quickViewProduct.sizes[0] : '');
      setSelectedColor(quickViewProduct.colors ? quickViewProduct.colors[0] : '');
      setIsZoomed(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = wishlist.includes(product.id);
  const images = product.images && product.images.length ? product.images : [product.image];

  // Related Products filter
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 4) {
      setPincodeStatus(`⚡ Express Delivery Available for Pincode ${pincode} by Thursday, Aug 6.`);
    } else {
      setPincodeStatus('Please enter a valid 5-digit Zip/Pincode.');
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div className="product-modal-card detail-page-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="modal-grid">
          {/* Gallery Media with Zoom Lens */}
          <div className="modal-gallery">
            <div
              className={`main-media-box ${isZoomed ? 'zoomed' : ''}`}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={selectedImg || product.image}
                alt={product.name}
                className="modal-main-img"
                loading="lazy"
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: 'scale(2.2)'
                      }
                    : {}
                }
              />
              {product.discount && <span className="modal-discount-tag">{product.discount}</span>}
              <div className="zoom-hint-badge">
                <ZoomIn size={14} /> Hover Image to Zoom
              </div>
            </div>

            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${selectedImg === img ? 'active' : ''}`}
                    onClick={() => setSelectedImg(img)}
                  >
                    <img src={img} alt={`Thumb ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Form */}
          <div className="modal-details">
            <div className="modal-brand">{product.brand}</div>
            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-rating-row">
              <div className="stars">
                <Star size={16} fill="#ffb400" color="#ffb400" />
                <strong>{product.rating}</strong>
              </div>
              <span className="count">({product.reviewsCount} customer reviews)</span>
              
              {/* Stock Status Badge */}
              <span className="in-stock-tag">
                <Check size={14} /> {product.stockLeft ? `In Stock (${product.stockLeft} left)` : 'In Stock'}
              </span>
            </div>

            {/* Price + Original Price + Discount */}
            <div className="modal-price-box">
              <span className="price-now">${product.price}</span>
              {product.originalPrice && (
                <span className="price-was">${product.originalPrice}</span>
              )}
              {product.discount && <span className="save-badge">{product.discount}</span>}
            </div>

            {/* Product Description */}
            <div className="product-description-section">
              <h4 className="desc-heading">Product Details</h4>
              <p className="modal-description">{product.description}</p>
              <ul className="spec-list">
                <li>• 100% Authentic Quality Guaranteed</li>
                <li>• Certified Organic Materials & Thermal Lining</li>
                <li>• 1-Year Official Manufacturer Warranty</li>
              </ul>
            </div>

            {/* Size Selection */}
            {product.sizes && (
              <div className="option-group">
                <label className="option-label">Select Size:</label>
                <div className="size-selector">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      className={`size-btn ${selectedSize === sz ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && (
              <div className="option-group">
                <label className="option-label">Select Color:</label>
                <div className="color-selector">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`color-btn ${selectedColor === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setSelectedColor(c)}
                      title={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Estimate Checker */}
            <div className="delivery-checker">
              <form onSubmit={handleCheckPincode} className="pincode-form">
                <MapPin size={16} className="pin-icon" />
                <input
                  type="text"
                  placeholder="Enter Pincode for Delivery"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <button type="submit" className="pincode-btn">Check</button>
              </form>
              {pincodeStatus && <p className="pincode-result">{pincodeStatus}</p>}
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button
                className="btn btn-primary btn-lg flex-1"
                onClick={() => addToCart(product, selectedSize, selectedColor, 1)}
              >
                <ShoppingBag size={18} /> Add To Bag
              </button>
              <button className="btn btn-dark btn-lg flex-1" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button
                className={`btn btn-outline modal-wishlist-icon ${isWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart size={20} fill={isWishlisted ? '#ff3f6c' : 'none'} color={isWishlisted ? '#ff3f6c' : '#333'} />
              </button>
            </div>

            {/* Customer Reviews Snippet */}
            <div className="modal-reviews-section">
              <h4 className="reviews-title"><MessageSquare size={16} /> Verified Buyer Feedback</h4>
              <div className="mini-review-box">
                <div className="mini-review-head">
                  <Star size={14} fill="#ffb400" color="#ffb400" />
                  <strong>5.0</strong> - <span>"Incredible craftsmanship! Highly recommend."</span>
                </div>
                <span className="mini-author">- Sarah M., Verified Purchase</span>
              </div>
            </div>

            {/* Related Products Recommendation */}
            {relatedProducts.length > 0 && (
              <div className="related-products-section">
                <h4 className="related-heading"><Sparkles size={16} color="#ff3f6c" /> You Might Also Like</h4>
                <div className="related-grid">
                  {relatedProducts.map((rel) => (
                    <div
                      key={rel.id}
                      className="related-item-card"
                      onClick={() => setQuickViewProduct(rel)}
                    >
                      <img src={rel.image} alt={rel.name} />
                      <div>
                        <span className="rel-title">{rel.name}</span>
                        <span className="rel-price">${rel.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Assurances */}
            <div className="trust-features-row">
              <div><Truck size={16} /> Free Express Shipping</div>
              <div><RotateCcw size={16} /> 30-Day Easy Returns</div>
              <div><ShieldCheck size={16} /> Authentic Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
