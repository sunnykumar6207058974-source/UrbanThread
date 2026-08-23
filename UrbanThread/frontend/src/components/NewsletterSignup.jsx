import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { Mail, Gift, Check, Send } from 'lucide-react';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast, applyCoupon } = useEcommerce();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      applyCoupon('FASHION20');
      showToast('🎉 Subscription successful! Promo code FASHION20 auto-applied for 20% OFF!');
    } else {
      showToast('⚠️ Please enter a valid email address.');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <div className="newsletter-content">
          <div className="gift-badge">
            <Gift size={20} /> GET $20 DISCOUNT
          </div>
          <h2 className="newsletter-title">Subscribe to VIP Insiders Drop</h2>
          <p className="newsletter-text">
            Be the first to unlock secret flash sales, limited sneaker releases & member-only coupons.
          </p>

          {subscribed ? (
            <div className="success-box">
              <div className="success-icon"><Check size={24} /></div>
              <div>
                <h4>You're on the VIP list!</h4>
                <p>Use code <strong>FASHION20</strong> at checkout for 20% off your entire bag.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="email-input-group">
                <Mail size={20} className="mail-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary subscribe-btn">
                  Subscribe <Send size={16} />
                </button>
              </div>
              <span className="privacy-note">🔒 No spam ever. Unsubscribe anytime with 1-click.</span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
