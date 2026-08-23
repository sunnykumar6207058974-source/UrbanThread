import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    products,
    toggleWishlist,
    addToCart,
    setIsCartOpen
  } = useEcommerce();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product.id);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Heart size={20} color="#ff3f6c" fill="#ff3f6c" />
            <h3>My Saved Wishlist ({wishlistedProducts.length})</h3>
          </div>
          <button className="close-drawer-btn" onClick={() => setIsWishlistOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="empty-cart-state">
            <Heart size={56} className="empty-icon" color="#ff3f6c" />
            <h3>Your Wishlist is Empty</h3>
            <p>Save items you love by tapping the heart icon on any product.</p>
            <button className="btn btn-primary" onClick={() => setIsWishlistOpen(false)}>
              Discover Trending Styles
            </button>
          </div>
        ) : (
          <div className="drawer-items-list">
            {wishlistedProducts.map((product) => (
              <div key={product.id} className="cart-item-row">
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.brand)}&background=1e1e2e&color=ff3f6c&size=200&bold=true&format=png`;
                  }}
                />

                <div className="cart-item-details">
                  <span className="brand">{product.brand}</span>
                  <h4 className="title">{product.name}</h4>
                  <div className="item-price font-bold">${product.price}</div>

                  <button
                    className="btn btn-sm btn-primary-light move-cart-btn"
                    onClick={() => handleMoveToCart(product)}
                  >
                    <ShoppingBag size={14} /> Move to Bag
                  </button>
                </div>

                <button
                  className="remove-item-btn"
                  onClick={() => toggleWishlist(product.id)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
