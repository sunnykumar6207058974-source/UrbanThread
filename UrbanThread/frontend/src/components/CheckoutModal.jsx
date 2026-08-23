import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  MapPin,
  Plus,
  ShieldCheck,
  Package,
  DollarSign,
  Smartphone,
  ArrowRight,
  Clock,
  Navigation
} from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    taxAmount,
    cartAfterDiscount, // Fix #3: was cartTotal
    appliedCoupon,
    showToast,
    createOrder,
    simulatePaymentSuccess,
    addresses,
    addAddress
  } = useEcommerce();

  const [step, setStep] = useState('checkout'); // 'checkout' | 'confirmation' | 'tracking'
  const defaultAddrId = addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || 'addr-1';
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddrId);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderDetails, setOrderDetails] = useState(null);

  // Address State
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    zip: '',
    phone: ''
  });

  if (!isOpen) return null;

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0] || {
    id: 'addr-default',
    name: 'Alex Johnson',
    street: '452 Fifth Ave, Apt 14B',
    city: 'New York, NY 10018',
    phone: '+1 (555) 019-2834'
  };

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const deliveryCharge = remainingForFreeShipping === 0 ? 0 : 12;
  // Fix #3: use cartAfterDiscount (post-discount pre-tax) + tax + delivery
  const grandTotal = cartAfterDiscount + taxAmount + deliveryCharge;

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.street || !newAddress.city) {
      showToast('⚠️ Please fill out all required address fields.', 'error');
      return;
    }

    const created = addAddress({
      name: newAddress.fullName,
      street: newAddress.street,
      city: `${newAddress.city}, ${newAddress.zip}`,
      phone: newAddress.phone,
      isDefault: false
    });

    setSelectedAddressId(created.id);
    setShowNewAddressForm(false);
    setNewAddress({ fullName: '', street: '', city: '', zip: '', phone: '' });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const orderId = `UT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdOrder = {
      id: orderId,
      orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      total: grandTotal.toFixed(2),
      items: cart.map((item) => ({
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
      itemsCount: cart.reduce((a, b) => a + b.quantity, 0),
      address: `${activeAddress.name} - ${activeAddress.street}, ${activeAddress.city}`,
      payment: paymentMethod.toUpperCase(),
      trackingNumber: `FX-940284-${Math.floor(100 + Math.random() * 900)}`
    };

    setOrderDetails(createdOrder);
    setStep('confirmation');
    createOrder(createdOrder);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* STEP 1: CHECKOUT FORM (Address + Payment + Summary) */}
        {step === 'checkout' && (
          <div className="checkout-step-container">
            <h2 className="checkout-main-title">
              <ShieldCheck size={24} color="#2874f0" /> Secure Checkout
            </h2>

            <form onSubmit={handlePlaceOrder} className="checkout-form-grid">
              {/* Left Column: Address & Payment */}
              <div className="checkout-left-col">
                {/* 1. Address Management */}
                <div className="checkout-block">
                  <h3 className="block-title">
                    <MapPin size={18} color="#ff3f6c" /> 1. Shipping Address
                  </h3>

                  <div className="address-options-list">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <label
                          key={addr.id}
                          className={`address-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          <input
                            type="radio"
                            name="checkout-address"
                            value={addr.id}
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addr.id)}
                          />
                          <div>
                            <strong>
                              {addr.name} {addr.isDefault && <span className="font-xs text-muted">(DEFAULT)</span>}
                            </strong>
                            <p>{addr.street}, {addr.city}</p>
                            <span className="phone-tag">Phone: {addr.phone}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className={`add-address-btn ${showNewAddressForm ? 'cancel-mode' : ''}`}
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  >
                    {showNewAddressForm ? <><X size={16} /> Cancel New Address</> : <><Plus size={16} /> Add New Address</>}
                  </button>

                  {showNewAddressForm && (
                    <div className="new-address-form animate-fade-in">
                      <input
                        type="text"
                        placeholder="Full Name / Label (e.g. Alex Johnson - Home)"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Street Address (e.g. 742 Evergreen Terrace)"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        required
                      />
                      <div className="input-row-2">
                        <input
                          type="text"
                          placeholder="City & State (e.g. Springfield, OR)"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Phone Number (e.g. +1 555-019-2834)"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={handleSaveNewAddress}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <CheckCircle2 size={14} /> Save & Select This Address
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-cancel"
                          onClick={() => setShowNewAddressForm(false)}
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Multiple Payment Methods */}
                <div className="checkout-block">
                  <h3 className="block-title">
                    <CreditCard size={18} color="#2874f0" /> 2. Payment Method
                  </h3>

                  <div className="payment-options-grid">
                    <label className={`payment-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <div className="payment-label-wrap">
                        <CreditCard size={20} />
                        <div>
                          <strong>Credit / Debit Card</strong>
                          <span className="sub">Visa, Mastercard, Amex</span>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-card ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                      />
                      <div className="payment-label-wrap">
                        <Smartphone size={20} />
                        <div>
                          <strong>UPI / Apple Pay</strong>
                          <span className="sub">Instant 1-Tap Checkout</span>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <div className="payment-label-wrap">
                        <DollarSign size={20} />
                        <div>
                          <strong>Cash on Delivery (COD)</strong>
                          <span className="sub">Pay when parcel arrives</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="card-input-box animate-fade-in">
                      <input type="text" placeholder="Card Number (4532 •••• •••• 8941)" defaultValue="4532 8941 2049 8812" required />
                      <div className="input-row-2">
                        <input type="text" placeholder="MM/YY" defaultValue="08/28" required />
                        <input type="password" placeholder="CVV" defaultValue="742" required />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary & Place Order */}
              <div className="checkout-right-col">
                <div className="checkout-summary-box">
                  <h3 className="summary-heading">Order Summary</h3>

                  <div className="summary-items-preview">
                    {cart.map((item) => (
                      <div key={item.product.id} className="preview-item">
                        <img src={item.product.image} alt={item.product.name} />
                        <div className="item-info">
                          <span className="name">{item.product.name}</span>
                          <span className="qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="price">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-breakdown">
                    <div className="row">
                      <span>Subtotal</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="row discount">
                        <span>Coupon ({appliedCoupon?.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="row">
                      <span>Shipping Fee</span>
                      <span>{deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}</span>
                    </div>
                    <div className="row">
                      <span>Estimated Tax (8%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="row grand-total font-bold">
                      <span>Total Amount</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block btn-lg place-order-btn">
                    Place Order & Pay ${grandTotal.toFixed(2)} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: ORDER CONFIRMATION */}
        {step === 'confirmation' && orderDetails && (
          <div className="confirmation-step-container animate-scale-up text-center">
            <div className="success-badge-icon">
              <CheckCircle2 size={64} color="#00b894" />
            </div>

            <h2 className="confirmation-title">Order Confirmed!</h2>
            <p className="order-id-label">Order Number: <strong>#{orderDetails.orderId}</strong></p>
            <p className="delivery-est-text">
              Estimated Delivery: <strong>{orderDetails.estimatedDelivery}</strong>
            </p>

            <div className="order-receipt-card">
              <div className="receipt-row">
                <span>Shipping Address:</span>
                <strong>{orderDetails.address}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment Method:</span>
                <strong>{orderDetails.payment}</strong>
              </div>
              <div className="receipt-row">
                <span>Total Paid:</span>
                <strong className="text-pink">${orderDetails.total}</strong>
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setStep('tracking')}
              >
                <Navigation size={18} /> Live Order Tracking
              </button>
              <button className="btn btn-outline btn-lg" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LIVE ORDER TRACKING */}
        {step === 'tracking' && orderDetails && (
          <div className="tracking-step-container animate-fade-in">
            <div className="tracking-header">
              <div>
                <h2>Live Package Tracking</h2>
                <p>Tracking #: <strong>{orderDetails.trackingNumber}</strong> • FedEx Express Air</p>
              </div>
              <span className="est-tag"><Clock size={14} /> Arriving Thu, Aug 6</span>
            </div>

            {/* Tracking Progress Timeline */}
            <div className="tracking-timeline">
              <div className="timeline-step completed">
                <div className="step-icon"><CheckCircle2 size={18} /></div>
                <div className="step-content">
                  <h4>Order Placed</h4>
                  <span className="step-time">{orderDetails.date} • 7:34 PM</span>
                </div>
              </div>

              <div className="timeline-step active">
                <div className="step-icon"><Package size={18} /></div>
                <div className="step-content">
                  <h4>Packed & Dispatched</h4>
                  <span className="step-time">FC Warehouse New York • In Transit</span>
                </div>
              </div>

              <div className="timeline-step">
                <div className="step-icon"><Truck size={18} /></div>
                <div className="step-content">
                  <h4>Out for Delivery</h4>
                  <span className="step-time">Scheduled for Thursday</span>
                </div>
              </div>

              <div className="timeline-step">
                <div className="step-icon"><CheckCircle2 size={18} /></div>
                <div className="step-content">
                  <h4>Delivered</h4>
                  <span className="step-time">Pending Delivery</span>
                </div>
              </div>
            </div>

            {/* Live Map Preview Box */}
            <div className="tracking-map-box">
              <div className="map-placeholder">
                <Navigation size={32} className="pulsing-pin" color="#ff3f6c" />
                <p>Courier vehicle is currently in <strong>Manhattan Transit Hub</strong></p>
              </div>
            </div>

            <button className="btn btn-dark btn-block" onClick={onClose}>
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
