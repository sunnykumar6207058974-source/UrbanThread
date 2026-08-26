import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ALL_PRODUCTS } from '../data/ecommerceData';
import { authAPI, productsAPI, cartAPI, usersAPI, couponsAPI, ordersAPI } from '../services/api';


// ─── localStorage helpers ───────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — silently ignore
  }
};

// ─── Avatar helper (initials via DiceBear / ui-avatars fallback) ─────────────
const getAvatarUrl = (name) => {
  const initials = encodeURIComponent(name || 'U');
  return `https://ui-avatars.com/api/?name=${initials}&background=ff3f6c&color=fff&size=200&bold=true`;
};

// ─── Map server cart to frontend state shape ────────────────────────────────
const mapServerCart = (serverCart) => {
  if (!Array.isArray(serverCart)) return [];
  return serverCart
    .filter((ci) => ci && ci.product)
    .map((ci) => {
      const p = ci.product;
      const productObj =
        typeof p === 'object'
          ? {
              ...p,
              id: p.slug || p._id || p.id
            }
          : ALL_PRODUCTS.find((ap) => ap.id === p) || {
              id: p,
              name: 'Product',
              price: 0,
              image: ''
            };

      return {
        _id: ci._id,
        product: productObj,
        quantity: ci.quantity || 1,
        selectedSize: ci.selectedSize || null,
        selectedColor: ci.selectedColor || null
      };
    });
};

const EcommerceContext = createContext();

export const EcommerceProvider = ({ children }) => {
  // ── Products: load from API, fall back to static data ──────────────────────
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await productsAPI.getAll();
        if (data.success && data.products.length > 0) {
          // Map API products to match the shape the frontend expects (slug as id)
          const mapped = data.products.map(p => ({ ...p, id: p.slug || p._id }));
          setProducts(mapped);
          setIsApiConnected(true);
        }
      } catch {
        // Backend offline — keep static data silently
        setIsApiConnected(false);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Persisted state ── hydrate from localStorage on first render
  const [cart, setCart] = useState(() =>
    load('ut_cart', [
      {
        product: ALL_PRODUCTS[0],
        quantity: 1,
        selectedSize: null,
        selectedColor: '#111111'
      }
    ])
  );
  const [wishlist, setWishlist] = useState(() => load('ut_wishlist', ['flash-3', 'prod-7']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      name: 'Alex Johnson (Home)',
      street: '452 Fifth Ave, Apt 14B',
      city: 'New York, NY 10018',
      phone: '+1 (555) 019-2834',
      isDefault: true
    },
    {
      id: 'addr-2',
      name: 'Alex Johnson (Work / Office)',
      street: '100 Broadway, Floor 8',
      city: 'New York, NY 10005',
      phone: '+1 (555) 019-9944',
      isDefault: false
    }
  ]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '⚡ Flash Sale Live Now!',
      message: 'Up to 60% OFF on Noise-Cancelling Headphones & Sneakers.',
      time: '10 mins ago',
      unread: true
    },
    {
      id: 2,
      title: '📦 Order #UT-2026-8941 Dispatched',
      message: 'Your parcel is in transit via FedEx Express Air.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      title: '🎉 20% OFF Coupon Credited',
      message: 'Use code FASHION20 at checkout for instant savings.',
      time: '1 day ago',
      unread: false
    }
  ]);
  const defaultUser = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 019-2834',
    avatar: getAvatarUrl('Alex Johnson'),
    memberTier: 'VIP Platinum Member',
    rewardPoints: 1250
  };
  const [user, setUser] = useState(() => load('ut_user', defaultUser));
  const [isLoggedIn, setIsLoggedIn] = useState(() => load('ut_logged_in', true));
  const [accountTab, setAccountTab] = useState('orders');
  const [appliedCoupon, setAppliedCoupon] = useState(() => load('ut_coupon', null));
  const [toastNotification, setToastNotification] = useState(null);

  // ── Order History State ──────────────────────────────────────────────────
  const defaultOrders = [
    {
      id: 'UT-2026-8941',
      orderId: 'UT-2026-8941',
      date: 'Aug 20, 2026',
      status: 'In Transit',
      total: '349.00',
      items: [
        {
          id: 'watch-1',
          productId: 'watch-1',
          name: 'Rolex Submariner Oystersteel Automatic Chronometer',
          image: '/watches/rolex.jpg',
          brand: 'ROLEX',
          price: 349,
          quantity: 1
        }
      ],
      trackingNumber: 'FX-940284-881',
      estimatedDelivery: 'Wednesday, Aug 26, 2026',
      paymentMethod: 'CARD',
      shippingAddress: 'Alex Johnson - 452 Fifth Ave, Apt 14B, New York, NY 10018'
    },
    {
      id: 'UT-2026-7210',
      orderId: 'UT-2026-7210',
      date: 'Aug 14, 2026',
      status: 'Delivered',
      total: '185.00',
      items: [
        {
          id: 'saree-1',
          productId: 'saree-1',
          name: 'Kanjivaram Pure Silk Zari Weave Wedding Saree',
          image: '/sarees/kanjivaram.jpg',
          brand: 'RANGOLI ETHNICS',
          price: 185,
          quantity: 1
        }
      ],
      trackingNumber: 'FX-881029-332',
      estimatedDelivery: 'Delivered on Aug 18, 2026',
      shippingAddress: 'Alex Johnson - 452 Fifth Ave, Apt 14B, New York, NY 10018'
    }
  ];
  const [orders, setOrders] = useState(() => load('ut_orders', defaultOrders));

  // ── Returns & Refunds State ──────────────────────────────────────────────
  const defaultReturns = [
    {
      id: 'RET-9921',
      orderId: 'UT-2026-7210',
      productName: 'Rolex Submariner Oystersteel Automatic',
      amount: '$349.00',
      status: 'Refund Processed to Original Card',
      date: 'Aug 15, 2026'
    }
  ];
  const [returns, setReturns] = useState(() => load('ut_returns', defaultReturns));

  // ── Sync cart from backend when authenticated / mounted ───────────────────
  useEffect(() => {
    const syncCartWithServer = async () => {
      const token = authAPI.getToken();
      if (!token || !isLoggedIn) return;

      try {
        const data = await cartAPI.get();
        if (data.success) {
          if (data.cart && data.cart.length > 0) {
            setCart(mapServerCart(data.cart));
          } else if (cart.length > 0) {
            // Local cart has items, sync them up to the server database
            const syncRes = await cartAPI.sync(cart);
            if (syncRes.success && syncRes.cart) {
              setCart(mapServerCart(syncRes.cart));
            }
          }
        }
      } catch {
        // Backend offline — keep local cart gracefully
      }
    };

    syncCartWithServer();
  }, [isLoggedIn]);

  // ── Persist key slices to localStorage whenever they change ─────────────
  useEffect(() => { save('ut_cart', cart); }, [cart]);
  useEffect(() => { save('ut_wishlist', wishlist); }, [wishlist]);
  useEffect(() => { save('ut_user', user); }, [user]);
  useEffect(() => { save('ut_logged_in', isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { save('ut_coupon', appliedCoupon); }, [appliedCoupon]);
  useEffect(() => { save('ut_orders', orders); }, [orders]);
  useEffect(() => { save('ut_returns', returns); }, [returns]);

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('🔔 All notifications marked as read.');
  };

  const addAddress = (newAddr) => {
    const addressItem = {
      id: `addr-${Date.now()}`,
      name: newAddr.name || newAddr.fullName || 'Saved Address',
      street: newAddr.street || '',
      city: newAddr.city || '',
      phone: newAddr.phone || '+1 (555) 019-0000',
      isDefault: addresses.length === 0 ? true : Boolean(newAddr.isDefault)
    };

    setAddresses((prev) => {
      if (addressItem.isDefault) {
        return prev.map((a) => ({ ...a, isDefault: false })).concat(addressItem);
      }
      return [...prev, addressItem];
    });

    showToast('📍 New delivery address saved successfully!');
    return addressItem;
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('🗑️ Address removed.', 'info');
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id
      }))
    );
    showToast('⭐ Set as default delivery address.');
  };

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3600);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? '🌙 Switched to Dark Obsidian Mode' : '☀️ Switched to Light Luxe Mode', 'info');
      return next;
    });
  };

  const openAccountTab = (tab = 'profile') => {
    setAccountTab(tab);
    setIsAccountOpen(true);
  };

  // Fix #1: composite key = productId + size + color
  const makeVariantKey = (productId, size, color) => `${productId}||${size ?? ''}||${color ?? ''}`;

  const addToCart = (product, size = null, color = null, quantity = 1) => {
    const resolvedSize = size || (product.sizes ? product.sizes[0] : null);
    const resolvedColor = color || (product.colors ? product.colors[0] : null);
    const key = makeVariantKey(product.id, resolvedSize, resolvedColor);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => makeVariantKey(item.product.id, item.selectedSize, item.selectedColor) === key
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
        return updated;
      }
      return [
        ...prevCart,
        { product, quantity, selectedSize: resolvedSize, selectedColor: resolvedColor }
      ];
    });

    showToast(`🛒 Added "${product.name.slice(0, 24)}..." to your bag!`, 'success');

    // Sync to backend database if user is authenticated
    const token = authAPI.getToken();
    if (token && isLoggedIn) {
      cartAPI
        .add({
          productId: product.slug || product.id || product._id,
          quantity,
          selectedSize: resolvedSize,
          selectedColor: resolvedColor
        })
        .then((res) => {
          if (res.success && res.cart) {
            setCart(mapServerCart(res.cart));
          }
        })
        .catch(() => {});
    }
  };

  // Fix #1: remove by composite key (productId + size + color)
  const removeFromCart = (productId, selectedSize, selectedColor) => {
    const key = makeVariantKey(productId, selectedSize, selectedColor);
    const itemToRemove = cart.find(
      (item) => makeVariantKey(item.product.id, item.selectedSize, item.selectedColor) === key
    );
    const updatedCart = cart.filter(
      (item) => makeVariantKey(item.product.id, item.selectedSize, item.selectedColor) !== key
    );
    setCart(updatedCart);
    showToast(`🗑️ Removed "${itemToRemove?.product.name.slice(0, 20) || 'item'}" from cart.`, 'info');

    // Sync removal to backend database
    const token = authAPI.getToken();
    if (token && isLoggedIn) {
      if (itemToRemove?._id) {
        cartAPI.remove(itemToRemove._id).catch(() => {});
      } else {
        cartAPI.sync(updatedCart).catch(() => {});
      }
    }
  };

  // Fix #1: update by composite key (productId + size + color)
  const updateQuantity = (productId, delta, selectedSize, selectedColor) => {
    const key = makeVariantKey(productId, selectedSize, selectedColor);
    const targetItem = cart.find(
      (item) => makeVariantKey(item.product.id, item.selectedSize, item.selectedColor) === key
    );
    const newQty = targetItem ? targetItem.quantity + delta : 1;

    const updatedCart = cart
      .map((item) => {
        if (makeVariantKey(item.product.id, item.selectedSize, item.selectedColor) === key) {
          if (newQty <= 0) {
            showToast(`🗑️ Removed item from cart.`, 'info');
            return null;
          }
          showToast(`Updated item quantity to ${newQty}.`, 'info');
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(Boolean);

    setCart(updatedCart);

    // Sync quantity change to backend database
    const token = authAPI.getToken();
    if (token && isLoggedIn && targetItem) {
      if (targetItem._id) {
        if (newQty <= 0) {
          cartAPI.remove(targetItem._id).catch(() => {});
        } else {
          cartAPI.update(targetItem._id, { quantity: newQty }).catch(() => {});
        }
      } else {
        cartAPI.sync(updatedCart).catch(() => {});
      }
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const isSaved = prev.includes(productId);
      const prod = ALL_PRODUCTS.find((p) => p.id === productId);
      if (isSaved) {
        showToast(`Removed "${prod?.name.slice(0, 20) || 'item'}" from your wishlist.`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`❤️ Saved "${prod?.name.slice(0, 20) || 'item'}" to your wishlist!`, 'success');
        return [...prev, productId];
      }
    });
  };

  // API-backed coupon validation with local fallback
  const applyCoupon = async (code) => {
    const cleanCode = code.trim().toUpperCase();
    try {
      const data = await couponsAPI.validate(cleanCode, cartSubtotal);
      if (data.success) {
        setAppliedCoupon({ code: data.coupon.code, discountPercent: data.coupon.discountPercent });
        showToast(`🎉 Coupon "${data.coupon.code}" applied! ${data.coupon.discountPercent}% OFF activated.`, 'success');
        return true;
      }
    } catch (err) {
      // Fallback: local validation if API is offline
      const discountMap = { LUXE60: 60, FLASH50: 50, FASHION20: 20 };
      if (discountMap[cleanCode]) {
        setAppliedCoupon({ code: cleanCode, discountPercent: discountMap[cleanCode] });
        showToast(`🎉 Coupon "${cleanCode}" applied! ${discountMap[cleanCode]}% OFF savings activated.`, 'success');
        return true;
      }
      showToast(err.message || `❌ Invalid coupon code "${cleanCode}". Try LUXE60, FLASH50 or FASHION20!`, 'error');
    }
    return false;
  };

  // API-backed login with local fallback
  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      if (data.success) {
        authAPI.saveToken(data.token);
        const u = data.user;
        setIsLoggedIn(true);
        setUser(u);
        setWishlist(u.wishlist || []);
        setAddresses(u.addresses || []);
        setNotifications(u.notifications || []);
        if (u.appliedCoupon?.code) setAppliedCoupon(u.appliedCoupon);
        // Sync cart: prefer server cart if it has items, otherwise sync local cart
        if (u.cart && u.cart.length > 0) {
          setCart(mapServerCart(u.cart));
        } else if (cart && cart.length > 0) {
          cartAPI.sync(cart).then((res) => {
            if (res.success && res.cart) setCart(mapServerCart(res.cart));
          }).catch(() => {});
        }
        showToast(`🔑 Welcome back, ${u.name.split(' ')[0]}! Wishlist & bag loaded from your account.`, 'success');
        return true;
      }
    } catch (err) {
      // Fallback: local mock login if API is offline
      const userName = email ? email.split('@')[0] : 'Alex Johnson';
      setIsLoggedIn(true);
      setUser({ name: userName, email, phone: '', avatar: getAvatarUrl(userName), memberTier: 'VIP Platinum Member', rewardPoints: 1250 });
      setWishlist(['flash-3', 'prod-7']);
      showToast(`🔑 Welcome back, ${userName}! (Offline mode)`, 'success');
      return true;
    }
    return false;
  };

  // API-backed signup with local fallback
  const signup = async (name, email, password) => {
    try {
      const data = await authAPI.register({ name, email, password });
      if (data.success) {
        authAPI.saveToken(data.token);
        const u = data.user;
        setIsLoggedIn(true);
        setUser(u);
        setWishlist(u.wishlist || []);
        setAddresses(u.addresses || []);
        setNotifications(u.notifications || []);
        setAppliedCoupon({ code: 'FASHION20', discountPercent: 20 });
        if (cart && cart.length > 0) {
          cartAPI.sync(cart).then((res) => {
            if (res.success && res.cart) setCart(mapServerCart(res.cart));
          }).catch(() => {});
        }
        showToast(`🎉 Welcome to UrbanThread, ${u.name}! 20% OFF welcome coupon applied.`, 'success');
        return true;
      }
    } catch (err) {
      // Fallback: local mock signup if API is offline
      const userName = name || 'New VIP Member';
      setIsLoggedIn(true);
      setUser({ name: userName, email, phone: '', avatar: getAvatarUrl(userName), memberTier: 'VIP Gold Member', rewardPoints: 500 });
      setAppliedCoupon({ code: 'FASHION20', discountPercent: 20 });
      showToast(`🎉 Welcome, ${userName}! (Offline mode)`, 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    authAPI.clearToken();
    setIsLoggedIn(false);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setAddresses([]);
    setNotifications([]);
    setAppliedCoupon(null);
    setIsAccountOpen(false);
    showToast('👋 Logged out. Session cleared.', 'info');
  };

  const updateUserProfile = async (updatedFields) => {
    try {
      const data = await usersAPI.updateProfile(updatedFields);
      if (data.success) setUser(data.user);
    } catch {
      // Offline fallback
      setUser((prev) => (prev ? { ...prev, ...updatedFields } : updatedFields));
    }
    showToast('✅ Profile information updated successfully!', 'success');
  };

  const createOrder = (orderData) => {
    const orderId = orderData.orderId || `UT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedOrder = {
      id: orderId,
      orderId,
      date: orderData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: orderData.status || 'Confirmed',
      total: orderData.total || (typeof grandTotal === 'number' ? grandTotal.toFixed(2) : grandTotal),
      items: orderData.items && orderData.items.length > 0
        ? orderData.items
        : cart.map(item => ({
            id: item.product.id || item.product._id,
            productId: item.product.id || item.product._id,
            name: item.product.name,
            image: item.product.image,
            brand: item.product.brand,
            price: item.product.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor
          })),
      trackingNumber: orderData.trackingNumber || `FX-940284-${Math.floor(100 + Math.random() * 900)}`,
      estimatedDelivery: orderData.estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      paymentMethod: orderData.payment || orderData.paymentMethod || 'CARD',
      shippingAddress: orderData.address || orderData.shippingAddress || 'Alex Johnson - 452 Fifth Ave, Apt 14B, New York, NY 10018'
    };

    setOrders((prev) => [formattedOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    setIsCartOpen(false);

    // Clear cart in backend database
    const token = authAPI.getToken();
    if (token && isLoggedIn) {
      cartAPI.clear().catch(() => {});
    }

    // Call backend API if running
    try {
      ordersAPI.place({
        items: formattedOrder.items,
        subtotal: cartSubtotal,
        discountAmount,
        couponCode: appliedCoupon?.code,
        taxAmount,
        grandTotal,
        shippingAddress: {
          name: user?.name || 'Customer',
          street: formattedOrder.shippingAddress
        },
        paymentMethod: (formattedOrder.paymentMethod || 'card').toLowerCase()
      }).catch(() => {});
    } catch {}

    showToast(`💳 Payment Successful! Order #${orderId} confirmed. Bag cleared & express dispatch initiated.`, 'success');
    const newNotif = {
      id: Date.now(),
      title: `📦 Order #${orderId} Confirmed!`,
      message: `Your order was placed successfully. Tracking: ${formattedOrder.trackingNumber}. Items are preparing for FedEx Express dispatch.`,
      time: 'Just now',
      unread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return formattedOrder;
  };

  const cancelOrder = (orderId, item = null) => {
    const itemName = item ? item.name : 'Full Order';
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, status: 'Cancelled' } : o))
    );
    showToast(`❌ Order #${orderId} ${item ? `(${item.name})` : ''} cancelled. 100% refund initiated.`, 'info');
    const newNotif = {
      id: Date.now(),
      title: `❌ Order #${orderId} Cancelled`,
      message: `Your cancellation request for #${orderId} (${itemName}) was processed. Full refund has been initiated.`,
      time: 'Just now',
      unread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const initiateReturn = (orderId, item = null) => {
    const retId = `RET-${Math.floor(1000 + Math.random() * 9000)}`;
    const returnItemName = item ? item.name : 'Full Order Items';
    const returnAmount = item ? `$${item.price}` : 'Full Amount';

    const newReturn = {
      id: retId,
      orderId: orderId,
      productName: returnItemName,
      amount: returnAmount,
      status: 'Return Pickup Scheduled (Courier Assigned)',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setReturns((prev) => [newReturn, ...prev]);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, status: 'Return Requested' } : o))
    );

    showToast(`📦 Return initiated for #${orderId}. Courier pickup scheduled!`, 'info');
    const newNotif = {
      id: Date.now(),
      title: `🔄 Return Pickup Scheduled (#${orderId})`,
      message: `Return request for ${returnItemName} received. FedEx courier will pick up within 24-48 hours.`,
      time: 'Just now',
      unread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const simulatePaymentSuccess = (orderId) => {
    createOrder({ orderId });
  };

  const simulateNetworkError = () => {
    showToast(`⚠️ Network error! Please check your internet connection and try again.`, 'error');
  };

  // Price & Tax Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const taxAmount = taxableAmount * 0.08; // 8% Sales Tax
  // Fix #3: renamed cartTotal → cartAfterDiscount (pre-tax subtotal after coupon)
  const cartAfterDiscount = taxableAmount;
  const grandTotal = cartAfterDiscount + taxAmount; // full amount incl. tax (excl. shipping)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const unreadNotificationCount = notifications.filter((n) => n.unread).length;

  return (
    <EcommerceContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        isLoggedIn,
        login,
        signup,
        logout,
        updateUserProfile,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        isAdminOpen,
        setIsAdminOpen,
        isDarkMode,
        toggleDarkMode,
        accountTab,
        openAccountTab,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        appliedCoupon,
        applyCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        orders,
        createOrder,
        cancelOrder,
        returns,
        initiateReturn,
        toastNotification,
        setToastNotification,
        showToast,
        simulatePaymentSuccess,
        simulateNetworkError,
        cartSubtotal,
        discountAmount,
        taxAmount,
        cartAfterDiscount,
        grandTotal,
        cartCount,
        wishlistCount,
        // Backend API status
        isApiConnected,
        isLoadingProducts
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = () => useContext(EcommerceContext);
