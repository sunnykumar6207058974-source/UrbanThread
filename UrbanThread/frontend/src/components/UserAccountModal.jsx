import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import {
  X,
  User,
  Package,
  Heart,
  MapPin,
  RotateCcw,
  Bell,
  CheckCircle2,
  ShoppingBag,
  Trash2,
  Plus,
  LogOut
} from 'lucide-react';

export const UserAccountModal = ({ isOpen, onClose, initialTab = 'profile' }) => {
  const {
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setIsCartOpen,
    showToast,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    user,
    isLoggedIn,
    logout,
    updateUserProfile,
    orders = [],
    cancelOrder,
    returns = [],
    initiateReturn
  } = useEcommerce();

  const [activeTab, setActiveTab] = useState(initialTab || 'profile');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.johnson@example.com',
    phone: user?.phone || '+1 (555) 019-2834'
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  const [newAccountAddr, setNewAccountAddr] = useState({
    name: '',
    street: '',
    city: '',
    zip: '',
    phone: ''
  });

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product.id);
    onClose();
    setIsCartOpen(true);
  };

  const handleInitiateReturn = (orderId, item = null) => {
    if (initiateReturn) {
      initiateReturn(orderId, item);
    } else {
      showToast(`📦 Return pickup requested for Order #${orderId}. Courier scheduled.`, 'info');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="account-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="account-layout-grid">
          {/* Left Sidebar Navigation */}
          <div className="account-sidebar">
            <div className="user-mini-card">
              <div className="account-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <User size={28} color="#ffffff" />
                )}
              </div>
              <div>
                <h3 className="name">{isLoggedIn ? (user?.name || 'Alex Johnson') : 'Guest User'}</h3>
                <span className="badge-vip font-xs">{isLoggedIn ? (user?.memberTier || 'VIP Member') : 'Not Logged In'}</span>
              </div>
            </div>

            <nav className="account-nav-list">
              <button
                className={`account-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} /> My Profile
              </button>
              <button
                className={`account-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={18} /> Order History
              </button>
              <button
                className={`account-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart size={18} /> Saved Wishlist ({wishlist.length})
              </button>
              <button
                className={`account-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <MapPin size={18} /> Saved Addresses
              </button>
              <button
                className={`account-nav-btn ${activeTab === 'returns' ? 'active' : ''}`}
                onClick={() => setActiveTab('returns')}
              >
                <RotateCcw size={18} /> Returns & Refunds
              </button>
              <button
                className={`account-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} /> Notifications {unreadNotificationCount > 0 && <span className="unread-dot">{unreadNotificationCount}</span>}
              </button>
              {isLoggedIn && (
                <button
                  className="account-nav-btn logout-nav-btn"
                  onClick={logout}
                  style={{ marginTop: '20px', color: '#ff4757' }}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              )}
            </nav>
          </div>

          {/* Right Tab Content View */}
          <div className="account-content-pane">
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header-flex">
                  <h2 className="pane-title">Personal Profile Details</h2>
                  {isLoggedIn && (
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                      {isEditingProfile ? 'Cancel Editing' : 'Edit Profile Info'}
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form
                    className="new-address-form animate-fade-in"
                    style={{ marginBottom: '24px', padding: '20px', borderRadius: '12px', border: '1.5px solid var(--border-light)' }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateUserProfile(profileForm);
                      setIsEditingProfile(false);
                    }}
                  >
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Phone Number</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                      <button type="submit" className="btn btn-sm btn-primary">
                        <CheckCircle2 size={14} /> Save Profile Changes
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-cancel" onClick={() => setIsEditingProfile(false)}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info-grid">
                    <div className="info-card">
                      <span className="lbl">Full Name</span>
                      <strong className="val">{isLoggedIn ? user?.name : 'Guest User'}</strong>
                    </div>
                    <div className="info-card">
                      <span className="lbl">Email Address</span>
                      <strong className="val">{isLoggedIn ? user?.email : 'Not signed in'}</strong>
                    </div>
                    <div className="info-card">
                      <span className="lbl">Phone Number</span>
                      <strong className="val">{isLoggedIn ? user?.phone || '+1 (555) 019-2834' : 'N/A'}</strong>
                    </div>
                    <div className="info-card">
                      <span className="lbl">Membership Tier</span>
                      <strong className="val text-pink">{isLoggedIn ? user?.memberTier || 'VIP Platinum' : 'Guest'}</strong>
                    </div>
                  </div>
                )}

                <div className="profile-stats-row">
                  <div className="stat-box">
                    <span className="stat-val">{orders.length}</span>
                    <span className="stat-lbl">Total Orders</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-val">$1,840</span>
                    <span className="stat-lbl">Total Saved</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-val">{isLoggedIn ? (user?.rewardPoints || 1250) : 0}</span>
                    <span className="stat-lbl">VIP Reward Points</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ORDER HISTORY TAB */}
            {activeTab === 'orders' && (
              <div className="tab-pane animate-fade-in">
                <h2 className="pane-title">My Orders ({orders.length})</h2>

                {orders.length === 0 ? (
                  <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <Package size={52} color="#ff3f6c" style={{ marginBottom: '14px' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>No Orders Found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                      You haven't placed any orders yet. Explore our luxury collection today!
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        onClose();
                        const prodSection = document.getElementById('products');
                        if (prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <ShoppingBag size={16} /> Start Shopping Now
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => {
                      const orderStatus = order.status || 'Confirmed';
                      const statusClass = orderStatus.toLowerCase().includes('transit')
                        ? 'in-transit'
                        : orderStatus.toLowerCase().includes('deliver')
                        ? 'delivered'
                        : orderStatus.toLowerCase().includes('cancel')
                        ? 'cancelled'
                        : 'confirmed';

                      return (
                        <div key={order.id || order.orderId} className="order-history-card">
                          <div className="order-card-header">
                            <div>
                              <strong className="order-id">#{order.orderId || order.id}</strong>
                              <span className="order-date">• Placed on {order.date}</span>
                            </div>
                            <span className={`status-pill ${statusClass}`}>
                              {orderStatus}
                            </span>
                          </div>

                          {/* Items Strip */}
                          <div className="order-items-strip" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(order.items || []).map((item, idx) => (
                              <div
                                key={item.id || item.productId || idx}
                                className="order-item-thumb"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '10px 14px',
                                  background: 'var(--bg-main)',
                                  borderRadius: '8px',
                                  border: '1px solid var(--border-light)',
                                  flexWrap: 'wrap',
                                  gap: '10px'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '200px' }}>
                                  <img
                                    src={item.image || (products.find((p) => p.id === item.productId)?.image) || '/watches/rolex.jpg'}
                                    alt={item.name}
                                    style={{ width: '52px', height: '52px', borderRadius: '6px', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Product')}&background=1e1e2e&color=ff3f6c&size=200&bold=true`;
                                    }}
                                  />
                                  <div>
                                    <strong className="item-name" style={{ fontSize: '0.9rem', display: 'block' }}>{item.name}</strong>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                      <span className="item-price" style={{ fontWeight: 700, color: 'var(--text-main)' }}>${item.price}</span>
                                      {item.quantity && <span>Qty: {item.quantity}</span>}
                                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                    </div>
                                  </div>
                                </div>

                                {/* Per-Product Action Buttons */}
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                  {orderStatus !== 'Cancelled' && (
                                    <>
                                      <button
                                        type="button"
                                        className="btn btn-xs btn-outline"
                                        onClick={() => handleInitiateReturn(order.orderId || order.id, item)}
                                        title="Initiate return pickup for this product"
                                      >
                                        <RotateCcw size={12} /> Return Item
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-xs btn-outline-cancel"
                                        onClick={() => cancelOrder(order.orderId || order.id, item)}
                                        title="Cancel this item"
                                      >
                                        <X size={12} /> Cancel Item
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-primary-light"
                                    onClick={() => {
                                      addToCart(item);
                                      setIsCartOpen(true);
                                      onClose();
                                    }}
                                    title="Add this item to cart again"
                                  >
                                    <ShoppingBag size={12} /> Buy Again
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Delivery and Tracking Details */}
                          {(order.trackingNumber || order.estimatedDelivery) && (
                            <div style={{ padding: '8px 14px', background: 'var(--bg-subtle)', borderRadius: '8px', margin: '12px 0 8px 0', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                              {order.trackingNumber && <span>🚚 Tracking: <strong>{order.trackingNumber}</strong></span>}
                              {order.estimatedDelivery && <span>📅 Est. Delivery: <strong>{order.estimatedDelivery}</strong></span>}
                            </div>
                          )}

                          <div className="order-card-footer" style={{ marginTop: '12px' }}>
                            <span className="total-text">
                              Total: <strong>${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</strong>
                            </span>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {orderStatus !== 'Cancelled' ? (
                                <>
                                  <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => handleInitiateReturn(order.orderId || order.id)}
                                  >
                                    <RotateCcw size={14} /> Return Entire Order
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-cancel"
                                    onClick={() => cancelOrder(order.orderId || order.id)}
                                  >
                                    <X size={14} /> Cancel Entire Order
                                  </button>
                                </>
                              ) : (
                                <span className="status-pill cancelled" style={{ background: 'rgba(255,71,87,0.12)', color: '#ff4757', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem' }}>
                                  Order Cancelled (100% Refunded)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="tab-pane animate-fade-in">
                <h2 className="pane-title">Saved Wishlist ({wishlistedProducts.length})</h2>

                {wishlistedProducts.length === 0 ? (
                  <div className="empty-state">
                    <Heart size={48} color="#ff3f6c" />
                    <p>Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="wishlist-grid-list">
                    {wishlistedProducts.map((p) => (
                      <div key={p.id} className="wishlist-row-card">
                        <img src={p.image} alt={p.name} />
                        <div className="details">
                          <span className="brand">{p.brand}</span>
                          <h4 className="title">{p.name}</h4>
                          <span className="price">${p.price}</span>
                        </div>
                        <div className="actions">
                          <button className="btn btn-sm btn-primary-light" onClick={() => handleMoveToCart(p)}>
                            <ShoppingBag size={14} /> Move to Bag
                          </button>
                          <button className="btn btn-sm btn-outline" onClick={() => toggleWishlist(p.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header-flex">
                  <h2 className="pane-title">Saved Delivery Addresses ({addresses.length})</h2>
                  <button
                    className={`btn btn-sm ${showAddressForm ? 'btn-outline-danger' : 'btn-outline'}`}
                    onClick={() => setShowAddressForm(!showAddressForm)}
                  >
                    {showAddressForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add New Address</>}
                  </button>
                </div>

                {showAddressForm && (
                  <form
                    className="new-address-form animate-fade-in"
                    style={{ marginBottom: '24px', padding: '20px', borderRadius: '12px', border: '1.5px solid var(--border-light)' }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAccountAddr.street || !newAccountAddr.city) {
                        showToast('⚠️ Please enter street address and city/state.', 'error');
                        return;
                      }
                      addAddress({
                        name: newAccountAddr.name || 'Saved Address',
                        street: newAccountAddr.street,
                        city: newAccountAddr.zip ? `${newAccountAddr.city}, ${newAccountAddr.zip}` : newAccountAddr.city,
                        phone: newAccountAddr.phone || '+1 (555) 019-2834'
                      });
                      setShowAddressForm(false);
                      setNewAccountAddr({ name: '', street: '', city: '', zip: '', phone: '' });
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Full Name / Label (e.g. Alex Johnson - Home)"
                      value={newAccountAddr.name}
                      onChange={(e) => setNewAccountAddr({ ...newAccountAddr, name: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Address (e.g. 742 Evergreen Terrace)"
                      value={newAccountAddr.street}
                      onChange={(e) => setNewAccountAddr({ ...newAccountAddr, street: e.target.value })}
                      required
                    />
                    <div className="input-row-2">
                      <input
                        type="text"
                        placeholder="City & State (e.g. Springfield, OR)"
                        value={newAccountAddr.city}
                        onChange={(e) => setNewAccountAddr({ ...newAccountAddr, city: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Zip Code"
                        value={newAccountAddr.zip}
                        onChange={(e) => setNewAccountAddr({ ...newAccountAddr, zip: e.target.value })}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Phone Number (e.g. +1 555-019-2834)"
                      value={newAccountAddr.phone}
                      onChange={(e) => setNewAccountAddr({ ...newAccountAddr, phone: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button type="submit" className="btn btn-sm btn-primary">
                        <CheckCircle2 size={14} /> Save Address
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-cancel" onClick={() => setShowAddressForm(false)}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="addresses-list-grid">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`address-box ${addr.isDefault ? 'default' : ''}`}>
                      {addr.isDefault && <span className="default-badge">DEFAULT ADDRESS</span>}
                      <h4>{addr.name}</h4>
                      <p>{addr.street}, {addr.city}</p>
                      <span className="phone">Phone: {addr.phone}</span>

                      <div className="address-box-actions" style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed var(--border-light)' }}>
                        {!addr.isDefault && (
                          <button type="button" className="btn btn-xs btn-outline" onClick={() => setDefaultAddress(addr.id)}>
                            Set as Default
                          </button>
                        )}
                        {addresses.length > 1 && (
                          <button type="button" className="btn btn-xs btn-outline" style={{ color: '#ff4757', borderColor: 'rgba(255,71,87,0.3)' }} onClick={() => deleteAddress(addr.id)}>
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. RETURNS & REFUNDS TAB */}
            {activeTab === 'returns' && (
              <div className="tab-pane animate-fade-in">
                <h2 className="pane-title">Returns & Refunds Manager ({returns.length})</h2>

                {returns.length === 0 ? (
                  <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <RotateCcw size={48} color="#ff3f6c" style={{ marginBottom: '14px' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>No Active Returns</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                      You have no return or refund requests in progress.
                    </p>
                  </div>
                ) : (
                  <div className="returns-list">
                    {returns.map((ret) => (
                      <div key={ret.id} className="return-card">
                        <div className="return-header">
                          <strong>Return ID: #{ret.id}</strong>
                          <span className="status-green"><CheckCircle2 size={14} /> {ret.status}</span>
                        </div>
                        <p className="item" style={{ fontWeight: 700, margin: '6px 0' }}>{ret.productName}</p>
                        <div className="return-footer">
                          <span>Refund Amount: <strong>{ret.amount}</strong></span>
                          <span className="date">{ret.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header-flex">
                  <h2 className="pane-title">Activity Notifications ({notifications.length})</h2>
                  {unreadNotificationCount > 0 && (
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={markAllNotificationsAsRead}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <CheckCircle2 size={14} /> Mark All as Read
                    </button>
                  )}
                </div>

                <div className="notifications-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-card ${n.unread ? 'unread' : 'read'}`}
                      onClick={() => markNotificationAsRead(n.id)}
                      style={{ cursor: 'pointer' }}
                      title={n.unread ? 'Click to mark as read' : 'Notification read'}
                    >
                      <div className="n-icon">
                        <Bell size={16} />
                      </div>
                      <div className="n-content" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h4 style={{ fontWeight: n.unread ? 800 : 600 }}>{n.title}</h4>
                          {n.unread && <span className="unread-badge-pill">NEW</span>}
                        </div>
                        <p>{n.message}</p>
                        <span className="n-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
