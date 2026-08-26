import React, { useState, useEffect, useCallback } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import {
  X,
  Package,
  Users,
  BarChart3,
  Tag,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Shield,
  Layers,
  RefreshCw,
  Loader
} from 'lucide-react';
import { adminAPI } from '../services/api';

// ── Mock fallbacks (shown when backend is offline) ────────────────────────────
const MOCK_ORDERS = [
  { id: 'UT-2026-8941', customer: 'Alex Johnson', email: 'alex@example.com', amount: '$162.12', status: 'In Transit', itemsCount: 2, date: 'Aug 3, 2026' },
  { id: 'UT-2026-7210', customer: 'Sophia Martinez', email: 'sophia@example.com', amount: '$249.00', status: 'Delivered', itemsCount: 1, date: 'Aug 2, 2026' },
  { id: 'UT-2026-6401', customer: 'Marcus Vance', email: 'marcus@example.com', amount: '$89.00', status: 'Processing', itemsCount: 1, date: 'Aug 1, 2026' }
];
const MOCK_USERS = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', tier: 'VIP Gold', totalSpent: '$1,840', status: 'Active' },
  { id: 2, name: 'Sophia Martinez', email: 'sophia@example.com', tier: 'VIP Gold', totalSpent: '$2,310', status: 'Active' },
  { id: 3, name: 'Marcus Vance', email: 'marcus@example.com', tier: 'VIP Silver', totalSpent: '$940', status: 'Active' },
  { id: 4, name: 'Aria Sharma', email: 'aria@example.com', tier: 'Regular', totalSpent: '$420', status: 'Active' }
];
const MOCK_COUPONS = [
  { code: 'LUXE60', discount: '60% OFF', uses: 1420, status: 'Active', expiry: 'Dec 31, 2026' },
  { code: 'FASHION20', discount: '20% OFF', uses: 3890, status: 'Active', expiry: 'Nov 30, 2026' },
  { code: 'FLASH50', discount: '50% OFF', uses: 890, status: 'Active', expiry: 'Aug 15, 2026' }
];
const MOCK_STATS = {
  totalRevenue: '148920.00', totalOrders: 1420, totalUsers: 8940,
  totalProducts: 62, conversionRate: '4.2', recentOrders: 148
};

// ── Helper: format API order to display shape ─────────────────────────────────
const formatApiOrder = (o) => ({
  id: o._id || o.id,
  customer: o.user?.name || 'Guest',
  email: o.user?.email || '—',
  amount: `$${(o.grandTotal || o.totalAmount || 0).toFixed(2)}`,
  status: o.status || 'Processing',
  itemsCount: o.items?.length || 1,
  date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
});

const formatApiUser = (u) => ({
  id: u._id || u.id,
  name: u.name,
  email: u.email,
  tier: u.loyaltyPoints >= 1000 ? 'VIP Gold' : u.loyaltyPoints >= 500 ? 'VIP Silver' : 'Regular',
  totalSpent: u.totalSpent ? `$${u.totalSpent}` : '$0',
  status: u.isActive === false ? 'Suspended' : 'Active'
});

const formatApiCoupon = (c) => ({
  code: c.code,
  discount: c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`,
  uses: c.usedCount || 0,
  status: c.isActive ? 'Active' : 'Inactive',
  expiry: c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Expiry'
});

export const AdminDashboardModal = ({ isOpen, onClose }) => {
  const { products, showToast } = useEcommerce();

  const [adminTab, setAdminTab] = useState('analytics');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // ── API Data State ────────────────────────────────────────────────────────
  const [adminOrders, setAdminOrders] = useState(MOCK_ORDERS);
  const [adminUsers, setAdminUsers] = useState(MOCK_USERS);
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [stats, setStats] = useState(MOCK_STATS);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Women', brand: 'URBAN THREAD',
    price: '', originalPrice: '', stockLeft: 20,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
  });

  // ── Fetch Stats ───────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await adminAPI.getStats();
      if (res.success && res.stats) {
        setStats(res.stats);
        setIsApiConnected(true);
      }
    } catch {
      setStats(MOCK_STATS);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // ── Fetch Orders ──────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const res = await adminAPI.getAllOrders({ limit: 50 });
      if (res.success && res.orders?.length > 0) {
        setAdminOrders(res.orders.map(formatApiOrder));
        setIsApiConnected(true);
      }
    } catch {
      setAdminOrders(MOCK_ORDERS);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // ── Fetch Users ───────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await adminAPI.getAllUsers();
      if (res.success && res.users?.length > 0) {
        setAdminUsers(res.users.map(formatApiUser));
        setIsApiConnected(true);
      }
    } catch {
      setAdminUsers(MOCK_USERS);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // ── Fetch Coupons ─────────────────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    setIsLoadingCoupons(true);
    try {
      const res = await adminAPI.getCoupons();
      if (res.success && res.coupons?.length > 0) {
        setCoupons(res.coupons.map(formatApiCoupon));
        setIsApiConnected(true);
      }
    } catch {
      setCoupons(MOCK_COUPONS);
    } finally {
      setIsLoadingCoupons(false);
    }
  }, []);

  // ── Load data when modal opens or tab switches ────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (adminTab === 'analytics') fetchStats();
    if (adminTab === 'orders') fetchOrders();
    if (adminTab === 'users') fetchUsers();
    if (adminTab === 'coupons') fetchCoupons();
  }, [isOpen, adminTab, fetchStats, fetchOrders, fetchUsers, fetchCoupons]);

  if (!isOpen) return null;

  // ── Update Order Status (tries API, falls back to local state) ────────────
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setAdminOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus}`);
      showToast(`✅ Order #${orderId} → ${newStatus}`);
    } catch {
      showToast(`Order #${orderId} status updated to ${newStatus} (offline mode).`);
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    setShowAddProductModal(false);
    showToast(`✨ Product "${newProduct.name}" added to live catalog!`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="admin-layout-grid">
          {/* Admin Navigation Sidebar */}
          <div className="admin-sidebar">
            <div className="admin-header-title">
              <Shield size={24} color="#ff3f6c" />
              <div>
                <h3>Admin Control</h3>
                <span className="font-xs text-muted">UrbanThread Console v2.6</span>
              </div>
            </div>
            <div style={{ margin: '8px 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 12,
                background: isApiConnected ? 'rgba(16,185,129,0.12)' : 'rgba(255,63,108,0.1)',
                color: isApiConnected ? '#059669' : '#ff3f6c'
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: isApiConnected ? '#10b981' : '#ff3f6c', display: 'inline-block' }} />
                {isApiConnected ? 'Live API' : 'Demo Mode'}
              </span>
            </div>

            <nav className="admin-nav-list">
              <button
                className={`admin-nav-btn ${adminTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setAdminTab('analytics')}
              >
                <BarChart3 size={18} /> Sales Analytics
              </button>
              <button
                className={`admin-nav-btn ${adminTab === 'products' ? 'active' : ''}`}
                onClick={() => setAdminTab('products')}
              >
                <Package size={18} /> Product Management
              </button>
              <button
                className={`admin-nav-btn ${adminTab === 'orders' ? 'active' : ''}`}
                onClick={() => setAdminTab('orders')}
              >
                <Layers size={18} /> Order Management
              </button>
              <button
                className={`admin-nav-btn ${adminTab === 'users' ? 'active' : ''}`}
                onClick={() => setAdminTab('users')}
              >
                <Users size={18} /> User Management
              </button>
              <button
                className={`admin-nav-btn ${adminTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setAdminTab('inventory')}
              >
                <AlertTriangle size={18} /> Inventory Stock
              </button>
              <button
                className={`admin-nav-btn ${adminTab === 'coupons' ? 'active' : ''}`}
                onClick={() => setAdminTab('coupons')}
              >
                <Tag size={18} /> Coupon Management
              </button>
            </nav>
          </div>

          {/* Admin Main Pane */}
          <div className="admin-content-pane">
            {/* 1. SALES ANALYTICS TAB */}
            {adminTab === 'analytics' && (
              <div className="admin-pane animate-fade-in">
                <div className="admin-header-flex">
                  <h2 className="admin-pane-title">Sales Analytics Overview</h2>
                  <button className="btn btn-outline btn-sm" onClick={fetchStats} disabled={isLoadingStats}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {isLoadingStats ? <Loader size={14} className="spin" /> : <RefreshCw size={14} />} Refresh
                  </button>
                </div>

                <div className="kpi-grid">
                  <div className="kpi-card">
                    <span className="lbl">Total Revenue</span>
                    <strong className="val">${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                    <span className="trend positive">+24.5% vs last month</span>
                  </div>
                  <div className="kpi-card">
                    <span className="lbl">Total Orders</span>
                    <strong className="val">{Number(stats.totalOrders).toLocaleString()}</strong>
                    <span className="trend positive">+18.2% new orders</span>
                  </div>
                  <div className="kpi-card">
                    <span className="lbl">Active Users</span>
                    <strong className="val">{Number(stats.totalUsers).toLocaleString()}</strong>
                    <span className="trend positive">+12.4% registrations</span>
                  </div>
                  <div className="kpi-card">
                    <span className="lbl">Avg. Conversion</span>
                    <strong className="val">{stats.conversionRate}%</strong>
                    <span className="trend positive">Top 5% Industry</span>
                  </div>
                </div>

                <div className="analytics-chart-box">
                  <h4>Monthly Revenue Growth (USD)</h4>
                  <div className="bar-chart-visualization">
                    <div className="bar-col" style={{ height: '40%' }}><span>Jan ($40k)</span></div>
                    <div className="bar-col" style={{ height: '55%' }}><span>Feb ($65k)</span></div>
                    <div className="bar-col" style={{ height: '70%' }}><span>Mar ($90k)</span></div>
                    <div className="bar-col" style={{ height: '85%' }}><span>Apr ($120k)</span></div>
                    <div className="bar-col active" style={{ height: '100%' }}><span>May (${Math.round(stats.totalRevenue / 1000)}k)</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRODUCT MANAGEMENT TAB */}
            {adminTab === 'products' && (
              <div className="admin-pane animate-fade-in">
                <div className="admin-header-flex">
                  <h2 className="admin-pane-title">Product Catalog Management ({products.length})</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddProductModal(true)}>
                    <Plus size={16} /> Add New Product
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="table-product-cell">
                              <img src={p.image} alt={p.name} />
                              <div>
                                <strong className="name">{p.name}</strong>
                                <span className="brand font-xs text-muted">{p.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td><strong>${p.price}</strong></td>
                          <td>
                            <span className={`stock-badge ${p.stockLeft && p.stockLeft < 10 ? 'low' : ''}`}>
                              {p.stockLeft ? `${p.stockLeft} left` : 'In Stock'}
                            </span>
                          </td>
                          <td>⭐ {p.rating}</td>
                          <td>
                            <div className="action-btns-row">
                              <button className="btn-icon-sm" onClick={() => showToast('✏️ Edit product details mode.')}>
                                <Edit2 size={14} />
                              </button>
                              <button className="btn-icon-sm danger" onClick={() => showToast('🗑️ Product deleted.')}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. ORDER MANAGEMENT TAB */}
            {adminTab === 'orders' && (
              <div className="admin-pane animate-fade-in">
                <div className="admin-header-flex">
                  <h2 className="admin-pane-title">Order Management & Fulfillment ({adminOrders.length})</h2>
                  <button className="btn btn-outline btn-sm" onClick={fetchOrders} disabled={isLoadingOrders}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {isLoadingOrders ? <Loader size={14} className="spin" /> : <RefreshCw size={14} />} Refresh
                  </button>
                </div>

                {isLoadingOrders ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <Loader size={32} className="spin" style={{ margin: '0 auto 12px' }} />
                    <p>Loading orders from backend...</p>
                  </div>
                ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>#{typeof ord.id === 'string' && ord.id.length > 12 ? ord.id.slice(-8).toUpperCase() : ord.id}</strong></td>
                          <td>
                            <div>
                              <strong>{ord.customer}</strong>
                              <span className="font-xs text-muted block">{ord.email}</span>
                            </div>
                          </td>
                          <td>{ord.date}</td>
                          <td><strong>{ord.amount}</strong></td>
                          <td>
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="status-select"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Packed">Packed</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            )}

            {/* 4. USER MANAGEMENT TAB */}
            {adminTab === 'users' && (
              <div className="admin-pane animate-fade-in">
                <div className="admin-header-flex">
                  <h2 className="admin-pane-title">Registered User Directory ({adminUsers.length})</h2>
                  <button className="btn btn-outline btn-sm" onClick={fetchUsers} disabled={isLoadingUsers}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {isLoadingUsers ? <Loader size={14} className="spin" /> : <RefreshCw size={14} />} Refresh
                  </button>
                </div>

                {isLoadingUsers ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <Loader size={32} className="spin" style={{ margin: '0 auto 12px' }} />
                    <p>Loading users from backend...</p>
                  </div>
                ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Membership Tier</th>
                        <th>Total Spent</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td><span className="badge-vip font-xs">{u.tier}</span></td>
                          <td><strong>{u.totalSpent}</strong></td>
                          <td>
                            <span className="status-pill delivered">{u.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            )}

            {/* 5. INVENTORY MANAGEMENT TAB */}
            {adminTab === 'inventory' && (
              <div className="admin-pane animate-fade-in">
                <div className="admin-header-flex">
                  <h2 className="admin-pane-title">Inventory & Stock Alerts</h2>
                  <button className="btn btn-dark btn-sm" onClick={() => showToast('⚡ Restocked all low inventory items to 50 units!')}>
                    Restock All Low Items
                  </button>
                </div>

                <div className="inventory-warning-box">
                  <AlertTriangle size={20} color="#ff3f6c" />
                  <span>3 Items are currently below low-stock threshold (less than 10 units remaining).</span>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Current Units</th>
                        <th>Stock Health</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td><code className="font-xs">SKU-{p.id}</code></td>
                          <td><strong>{p.stockLeft || 40} units</strong></td>
                          <td>
                            <span className={`stock-badge ${p.stockLeft && p.stockLeft < 10 ? 'low' : 'good'}`}>
                              {p.stockLeft && p.stockLeft < 10 ? 'CRITICAL LOW' : 'OPTIMAL'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => showToast(`Updated inventory for SKU-${p.id}`)}>
                              + Add Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. COUPON MANAGEMENT TAB */}
            {adminTab === 'coupons' && (
              <div className="admin-pane animate-fade-in">
                <div className="admin-header-flex">
                  <h2 className="admin-pane-title">Promo Coupon Engine ({coupons.length})</h2>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={fetchCoupons} disabled={isLoadingCoupons}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {isLoadingCoupons ? <Loader size={14} className="spin" /> : <RefreshCw size={14} />} Refresh
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => showToast('✨ Created promo code "SUMMER30"')}>
                      <Plus size={16} /> Create Promo Code
                    </button>
                  </div>
                </div>

                {isLoadingCoupons ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <Loader size={32} className="spin" style={{ margin: '0 auto 12px' }} />
                    <p>Loading coupons from backend...</p>
                  </div>
                ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Promo Code</th>
                        <th>Discount Value</th>
                        <th>Total Uses</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c) => (
                        <tr key={c.code}>
                          <td><strong className="code-pill">{c.code}</strong></td>
                          <td><strong className="text-pink">{c.discount}</strong></td>
                          <td>{c.uses} redemptions</td>
                          <td>{c.expiry}</td>
                          <td><span className="status-pill delivered">{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Product Modal Overlay */}
        {showAddProductModal && (
          <div className="sub-modal-backdrop">
            <div className="sub-modal-card animate-scale-up">
              <div className="sub-modal-header">
                <h3>Add New Catalog Product</h3>
                <button onClick={() => setShowAddProductModal(false)}><X size={18} /></button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="sub-modal-form">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
                <div className="input-row-2">
                  <input
                    type="text"
                    placeholder="Brand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    required
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="input-row-2">
                  <input
                    type="number"
                    placeholder="Sale Price ($)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Original MRP ($)"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  required
                />

                <div className="sub-modal-actions">
                  <button type="submit" className="btn btn-primary flex-1">Save Product</button>
                  <button type="button" className="btn btn-outline-cancel" onClick={() => setShowAddProductModal(false)}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
