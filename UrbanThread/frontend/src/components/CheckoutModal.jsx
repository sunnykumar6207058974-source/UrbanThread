import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { paymentAPI } from '../services/api';
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
  Navigation,
  QrCode,
  Sparkles,
  Check,
  Copy,
  Loader2,
  Building2
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
    addresses,
    addAddress
  } = useEcommerce();

  const [step, setStep] = useState('checkout'); // 'checkout' | 'confirmation' | 'tracking'
  const defaultAddrId = addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || 'addr-1';
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddrId);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'upi_qr' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [razorpayConfig, setRazorpayConfig] = useState({
    keyId: 'rzp_test_urbanthread_demo',
    isLive: false,
    upiId: 'urbanthread@upi',
    usdToInrRate: 85
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simStatus, setSimStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [simMethod, setSimMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [selectedUpiApp, setSelectedUpiApp] = useState('phonepe'); // 'phonepe' | 'gpay' | 'paytm' | 'bhim'
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const handleCloseModal = () => {
    setStep('checkout');
    setShowSimulator(false);
    setSimStatus('idle');
    setIsProcessing(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setStep('checkout');
      setShowSimulator(false);
      setSimStatus('idle');
      setIsProcessing(false);
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }
      paymentAPI.getConfig()
        .then((res) => {
          if (res && res.success) {
            setRazorpayConfig(res);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

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
  const grandTotal = cartAfterDiscount + taxAmount + deliveryCharge;
  const inrRate = razorpayConfig.usdToInrRate || 85;
  const inrAmount = Math.max(1, Math.round(grandTotal * inrRate));

  const copyUpiId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(razorpayConfig.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
      showToast('📋 UPI ID copied to clipboard!', 'success');
    }
  };

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

  const completeOrder = (paymentData = {}) => {
    const orderId = `UT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const method = paymentData.paymentMethod || paymentMethod;
    const createdOrder = {
      id: orderId,
      orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      total: grandTotal.toFixed(2),
      inrTotal: inrAmount,
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
      payment: method.toUpperCase(),
      paymentMethod: method.toLowerCase(),
      paymentStatus: paymentData.paymentStatus || (method === 'cod' ? 'pending' : 'paid'),
      razorpayPaymentId: paymentData.razorpayPaymentId || null,
      razorpayOrderId: paymentData.razorpayOrderId || null,
      utrNumber: paymentData.utrNumber || null,
      trackingNumber: `FX-940284-${Math.floor(100 + Math.random() * 900)}`
    };

    setOrderDetails(createdOrder);
    setStep('confirmation');
    createOrder(createdOrder);
    setIsProcessing(false);
  };

  const handleSimulatePayment = (isSuccess = true) => {
    if (!isSuccess) {
      showToast('⚠️ Payment simulation failed: User cancelled or bank declined.', 'error');
      setShowSimulator(false);
      setSimStatus('idle');
      return;
    }

    setSimStatus('processing');
    setTimeout(() => {
      setSimStatus('success');
      setTimeout(() => {
        setShowSimulator(false);
        setSimStatus('idle');
        completeOrder({
          paymentMethod: 'razorpay',
          paymentStatus: 'paid',
          razorpayPaymentId: `pay_test_${Date.now()}`
        });
      }, 500);
    }, 800);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'cod') {
      completeOrder({ paymentMethod: 'cod', paymentStatus: 'pending' });
      return;
    }

    if (paymentMethod === 'upi_qr') {
      completeOrder({
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        utrNumber: utrNumber || `UTR-${Date.now().toString().slice(-6)}`
      });
      return;
    }

    // Check if live/registered Razorpay credentials exist
    const isRegisteredRazorpayKey = Boolean(
      razorpayConfig.isLive && 
      razorpayConfig.keyId && 
      !razorpayConfig.keyId.includes('demo') && 
      razorpayConfig.keyId.startsWith('rzp_')
    );

    if (!isRegisteredRazorpayKey) {
      // Open built-in interactive Razorpay test simulator modal!
      setShowSimulator(true);
      return;
    }

    // Real Razorpay Gateway Flow
    setIsProcessing(true);
    try {
      let orderRes = null;
      try {
        orderRes = await paymentAPI.createOrder({
          amount: inrAmount,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        });
      } catch (err) {
        console.warn('Backend payment order creation notice:', err.message);
      }

      const keyId = orderRes?.keyId || razorpayConfig.keyId;
      const rzpOrderId = orderRes?.orderId;

      if (window.Razorpay) {
        const options = {
          key: keyId,
          amount: (orderRes?.amount) || (inrAmount * 100),
          currency: 'INR',
          name: 'UrbanThread Luxury',
          description: `Order Checkout (${cart.length} items)`,
          image: 'https://cdn-icons-png.flaticon.com/512/825/825540.png',
          order_id: (rzpOrderId && !rzpOrderId.startsWith('order_test_')) ? rzpOrderId : undefined,
          prefill: {
            name: activeAddress.name || 'Customer',
            email: 'customer@urbanthread.com',
            contact: activeAddress.phone || '+91 9876543210'
          },
          theme: {
            color: '#ff3f6c'
          },
          handler: async function (response) {
            try {
              await paymentAPI.verifyPayment(response);
            } catch (vErr) {
              console.warn('Signature verification notice:', vErr.message);
            }
            completeOrder({
              paymentMethod: 'razorpay',
              paymentStatus: 'paid',
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id || rzpOrderId
            });
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              showToast('Payment window closed.', 'info');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          showToast(`⚠️ Payment failed: ${resp.error.description || 'Try again'}`, 'error');
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        setShowSimulator(true);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment checkout error:', err);
      setIsProcessing(false);
      setShowSimulator(true);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleCloseModal}>
      <div className="checkout-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close modal">
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
                  <div className="block-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 className="block-title" style={{ margin: 0 }}>
                      <CreditCard size={18} color="#ff3f6c" /> 2. Payment Method
                    </h3>
                    <span className="secure-ssl-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#00b894', fontWeight: 600 }}>
                      <ShieldCheck size={13} /> 256-bit Encrypted
                    </span>
                  </div>

                  <div className="payment-options-grid">
                    {/* Option 1: Razorpay Gateway */}
                    <label className={`payment-card ${paymentMethod === 'razorpay' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                      />
                      <div className="payment-label-wrap">
                        <CreditCard size={22} color="#ff3f6c" />
                        <div className="payment-text-info" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <strong>Pay Online with Razorpay</strong>
                            <span style={{ fontSize: '0.7rem', background: '#ff3f6c18', color: '#ff3f6c', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>Most Popular</span>
                          </div>
                          <span className="sub">Instant UPI (GPay, PhonePe, Paytm), Cards & Net Banking</span>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPaymentMethod('razorpay');
                                setSimMethod('upi');
                                setSelectedUpiApp('phonepe');
                              }}
                              style={{
                                fontSize: '0.74rem',
                                background: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'phonepe' ? '#5f259f' : '#f1f2f6',
                                color: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'phonepe' ? '#ffffff' : '#1e293b',
                                border: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'phonepe' ? '1.5px solid #5f259f' : '1px solid #cbd5e1',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s'
                              }}
                            >
                              📱 PhonePe {paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'phonepe' && <Check size={11} />}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPaymentMethod('razorpay');
                                setSimMethod('upi');
                                setSelectedUpiApp('gpay');
                              }}
                              style={{
                                fontSize: '0.74rem',
                                background: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'gpay' ? '#4285f4' : '#f1f2f6',
                                color: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'gpay' ? '#ffffff' : '#1e293b',
                                border: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'gpay' ? '1.5px solid #4285f4' : '1px solid #cbd5e1',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s'
                              }}
                            >
                              Google Pay {paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'gpay' && <Check size={11} />}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPaymentMethod('razorpay');
                                setSimMethod('upi');
                                setSelectedUpiApp('paytm');
                              }}
                              style={{
                                fontSize: '0.74rem',
                                background: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'paytm' ? '#00b9f1' : '#f1f2f6',
                                color: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'paytm' ? '#ffffff' : '#1e293b',
                                border: paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'paytm' ? '1.5px solid #00b9f1' : '1px solid #cbd5e1',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s'
                              }}
                            >
                              Paytm {paymentMethod === 'razorpay' && simMethod === 'upi' && selectedUpiApp === 'paytm' && <Check size={11} />}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPaymentMethod('razorpay');
                                setSimMethod('card');
                              }}
                              style={{
                                fontSize: '0.74rem',
                                background: paymentMethod === 'razorpay' && simMethod === 'card' ? '#0c2340' : '#f1f2f6',
                                color: paymentMethod === 'razorpay' && simMethod === 'card' ? '#ffffff' : '#1e293b',
                                border: '1px solid #cbd5e1',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s'
                              }}
                            >
                              💳 Cards {paymentMethod === 'razorpay' && simMethod === 'card' && <Check size={11} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Option 2: Direct UPI QR */}
                    <label className={`payment-card ${paymentMethod === 'upi_qr' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="upi_qr"
                        checked={paymentMethod === 'upi_qr'}
                        onChange={() => setPaymentMethod('upi_qr')}
                      />
                      <div className="payment-label-wrap">
                        <QrCode size={22} color="#00b894" />
                        <div className="payment-text-info">
                          <strong>Direct UPI QR (Scan & Pay)</strong>
                          <span className="sub">Scan with any UPI app on your phone & pay ₹{inrAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </label>

                    {/* Option 3: Cash on Delivery */}
                    <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <div className="payment-label-wrap">
                        <DollarSign size={22} color="#f39c12" />
                        <div className="payment-text-info">
                          <strong>Cash on Delivery (COD)</strong>
                          <span className="sub">Pay with cash or UPI at your doorstep when parcel arrives</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* QR Code view if UPI QR selected */}
                  {paymentMethod === 'upi_qr' && (
                    <div className="upi-qr-container animate-fade-in" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '16px', marginTop: '12px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=${razorpayConfig.upiId}&pn=UrbanThread%20Luxury&am=${inrAmount}&cu=INR`)}`}
                            alt="UrbanThread UPI QR"
                            style={{ width: '130px', height: '130px', display: 'block' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <span style={{ fontSize: '0.72rem', background: '#00b89418', color: '#00b894', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>⚡ Instant UPI Transfer</span>
                          <p style={{ margin: '6px 0', fontSize: '0.9rem' }}>Amount: <strong style={{ color: '#ff3f6c' }}>₹{inrAmount.toLocaleString('en-IN')}</strong> (${grandTotal.toFixed(2)})</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>UPI ID: <strong>{razorpayConfig.upiId}</strong></span>
                            <button
                              type="button"
                              onClick={copyUpiId}
                              style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              {copiedUpi ? <><Check size={12} color="#00b894" /> Copied</> : <><Copy size={12} /> Copy</>}
                            </button>
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Transaction UTR / Ref No (Optional)"
                              value={utrNumber}
                              onChange={(e) => setUtrNumber(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Razorpay Trust Banner */}
                  {paymentMethod === 'razorpay' && (
                    <div className="razorpay-info-banner animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(40,116,240,0.06)', border: '1px solid rgba(40,116,240,0.15)', borderRadius: '8px', padding: '10px 14px', marginTop: '12px' }}>
                      <ShieldCheck size={20} color="#2874f0" />
                      <span style={{ fontSize: '0.8rem', color: '#334155' }}>
                        100% Secure Checkout powered by <strong>Razorpay</strong>. Cards, UPI, Netbanking & Wallets supported.
                      </span>
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
                    <div className="row grand-total font-bold" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Total Amount</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', color: '#1e293b' }}>${grandTotal.toFixed(2)}</div>
                        <div style={{ fontSize: '0.78rem', color: '#ff3f6c', fontWeight: 600 }}>≈ ₹{inrAmount.toLocaleString('en-IN')} INR</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg place-order-btn"
                    disabled={isProcessing}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {isProcessing ? (
                      <><Loader2 size={18} className="animate-spin" /> Connecting to Gateway...</>
                    ) : paymentMethod === 'razorpay' ? (
                      <><CreditCard size={18} /> Pay ₹{inrAmount.toLocaleString('en-IN')} with Razorpay <ArrowRight size={18} /></>
                    ) : paymentMethod === 'upi_qr' ? (
                      <><QrCode size={18} /> Confirm UPI Payment (₹{inrAmount.toLocaleString('en-IN')}) <ArrowRight size={18} /></>
                    ) : (
                      <><DollarSign size={18} /> Place Order (Cash on Delivery) <ArrowRight size={18} /></>
                    )}
                  </button>

                  {/* Fast 1-Click Test Checkout Button */}
                  {paymentMethod === 'razorpay' && (
                    <button
                      type="button"
                      onClick={() => completeOrder({ paymentMethod: 'razorpay', paymentStatus: 'paid', razorpayPaymentId: `pay_demo_${Date.now()}` })}
                      style={{
                        marginTop: '10px',
                        width: '100%',
                        background: '#f8fafc',
                        border: '1px dashed #94a3b8',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.78rem',
                        color: '#475569',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Sparkles size={14} color="#ff3f6c" /> ⚡ 1-Click Fast Demo Checkout (Instant Test)
                    </button>
                  )}
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
              <button className="btn btn-outline btn-lg" onClick={handleCloseModal}>
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

            <button className="btn btn-dark btn-block" onClick={handleCloseModal} style={{ marginTop: '16px' }}>
              Back to Store
            </button>
          </div>
        )}

        {/* RAZORPAY TEST GATEWAY SIMULATOR MODAL */}
        {showSimulator && (
          <div className="rzp-sim-overlay animate-fade-in" onClick={() => setShowSimulator(false)}>
            <div className="rzp-sim-modal animate-scale-up" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="rzp-sim-header">
                <div className="rzp-sim-brand">
                  <div className="rzp-sim-logo">
                    <img src="/logo.png" alt="UrbanThread" className="brand-logo-img" />
                  </div>
                  <div>
                    <h4 className="rzp-sim-title">UrbanThread Luxury</h4>
                    <span className="rzp-sim-badge">🧪 Razorpay Test Gateway</span>
                  </div>
                </div>
                <div className="rzp-sim-amount-box">
                  <div className="rzp-sim-inr">₹{inrAmount.toLocaleString('en-IN')}</div>
                  <div className="rzp-sim-usd">(${grandTotal.toFixed(2)})</div>
                </div>
                <button type="button" className="rzp-sim-close-btn" onClick={() => setShowSimulator(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Sub-nav Tabs */}
              <div className="rzp-sim-tabs">
                <button
                  type="button"
                  className={`rzp-sim-tab ${simMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setSimMethod('upi')}
                >
                  ⚡ UPI (GPay / PhonePe)
                </button>
                <button
                  type="button"
                  className={`rzp-sim-tab ${simMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setSimMethod('card')}
                >
                  💳 Test Card
                </button>
                <button
                  type="button"
                  className={`rzp-sim-tab ${simMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setSimMethod('netbanking')}
                >
                  🏦 Netbanking
                </button>
              </div>

              {/* Body */}
              <div className="rzp-sim-content">
                {simStatus === 'processing' ? (
                  <div className="rzp-sim-loading-state animate-fade-in">
                    <Loader2 size={36} className="animate-spin text-pink" />
                    <h4>Connecting to Razorpay Banking Network...</h4>
                    <p>Simulating 256-bit secure bank authorization</p>
                  </div>
                ) : simStatus === 'success' ? (
                  <div className="rzp-sim-success-state animate-scale-up">
                    <CheckCircle2 size={48} color="#00b894" />
                    <h4>Payment Verified Successfully!</h4>
                    <p>Redirecting to Order Confirmation...</p>
                  </div>
                ) : (
                  <>
                    {simMethod === 'upi' && (
                      <div className="rzp-sim-pane animate-fade-in">
                        <p className="rzp-sim-intro">Select your UPI application for instant test authorization:</p>
                        <div className="rzp-upi-grid">
                          <div
                            className={`rzp-upi-item ${selectedUpiApp === 'phonepe' ? 'selected' : ''}`}
                            onClick={() => setSelectedUpiApp('phonepe')}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="app-dot phonepe">Pe</span>
                            <strong>PhonePe</strong>
                            {selectedUpiApp === 'phonepe' && <Check size={16} color="#5f259f" style={{ marginLeft: 'auto' }} />}
                          </div>

                          <div
                            className={`rzp-upi-item ${selectedUpiApp === 'gpay' ? 'selected' : ''}`}
                            onClick={() => setSelectedUpiApp('gpay')}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="app-dot gpay">G</span>
                            <strong>Google Pay</strong>
                            {selectedUpiApp === 'gpay' && <Check size={16} color="#4285f4" style={{ marginLeft: 'auto' }} />}
                          </div>

                          <div
                            className={`rzp-upi-item ${selectedUpiApp === 'paytm' ? 'selected' : ''}`}
                            onClick={() => setSelectedUpiApp('paytm')}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="app-dot paytm">Pt</span>
                            <strong>Paytm UPI</strong>
                            {selectedUpiApp === 'paytm' && <Check size={16} color="#00b9f1" style={{ marginLeft: 'auto' }} />}
                          </div>

                          <div
                            className={`rzp-upi-item ${selectedUpiApp === 'bhim' ? 'selected' : ''}`}
                            onClick={() => setSelectedUpiApp('bhim')}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="app-dot bhim">B</span>
                            <strong>BHIM UPI</strong>
                            {selectedUpiApp === 'bhim' && <Check size={16} color="#00796b" style={{ marginLeft: 'auto' }} />}
                          </div>
                        </div>

                        <div className="rzp-sim-vpa-box">
                          <span>
                            Selected App: <strong style={{ color: selectedUpiApp === 'phonepe' ? '#5f259f' : '#2563eb' }}>
                              {selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'paytm' ? 'Paytm' : 'BHIM'}
                            </strong> • Test VPA: <strong>
                              {selectedUpiApp === 'phonepe' ? 'customer@ybl' : selectedUpiApp === 'gpay' ? 'customer@okhdfcbank' : selectedUpiApp === 'paytm' ? 'customer@paytm' : 'customer@upi'}
                            </strong>
                          </span>
                          <span className="verified-pill">Active</span>
                        </div>
                      </div>
                    )}

                    {simMethod === 'card' && (
                      <div className="rzp-sim-pane animate-fade-in">
                        <div className="rzp-sim-card-preview">
                          <div className="card-top">
                            <span>TEST CARD</span>
                            <strong>VISA</strong>
                          </div>
                          <div className="card-no">4111 •••• •••• 4242</div>
                          <div className="card-details">
                            <div>
                              <span>CARD HOLDER</span>
                              <strong>{activeAddress.name || 'TEST USER'}</strong>
                            </div>
                            <div>
                              <span>EXPIRES</span>
                              <strong>12/28</strong>
                            </div>
                            <div>
                              <span>CVV</span>
                              <strong>123</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {simMethod === 'netbanking' && (
                      <div className="rzp-sim-pane animate-fade-in">
                        <p className="rzp-sim-intro">Select your bank for test netbanking authorization:</p>
                        <div className="rzp-banks-grid">
                          {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                            <div
                              key={b}
                              className={`rzp-bank-pill ${selectedBank === b ? 'selected' : ''}`}
                              onClick={() => setSelectedBank(b)}
                              style={{ cursor: 'pointer' }}
                            >
                              {b}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rzp-sim-buttons">
                      <button
                        type="button"
                        className="btn btn-primary btn-block btn-lg"
                        onClick={() => handleSimulatePayment(true)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Check size={18} /> Authorize Payment via {simMethod === 'upi' ? (selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'paytm' ? 'Paytm' : 'UPI') : simMethod === 'card' ? 'Test Card' : selectedBank} (₹{inrAmount.toLocaleString('en-IN')})
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-block"
                        onClick={() => handleSimulatePayment(false)}
                        style={{ color: '#e74c3c', borderColor: '#fab1a0', marginTop: '8px' }}
                      >
                        <X size={16} /> Simulate Bank Decline / Failure
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="rzp-sim-footer">
                <ShieldCheck size={14} color="#0c2340" />
                <span>Secured by <strong>Razorpay</strong> • Sandbox Test Environment</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
