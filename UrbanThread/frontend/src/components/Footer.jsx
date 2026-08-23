import React from 'react';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Headphones, Smartphone, CreditCard } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="site-footer">
      {/* Value Proposition Highlights Banner */}
      <div className="footer-benefits-bar">
        <div className="footer-benefit-item">
          <div className="benefit-icon"><Truck size={24} /></div>
          <div>
            <h4>Express Worldwide Shipping</h4>
            <p>Free delivery on orders over $150</p>
          </div>
        </div>
        <div className="footer-benefit-item">
          <div className="benefit-icon"><RotateCcw size={24} /></div>
          <div>
            <h4>30-Day Hassle-Free Returns</h4>
            <p>100% money back guarantee</p>
          </div>
        </div>
        <div className="footer-benefit-item">
          <div className="benefit-icon"><ShieldCheck size={24} /></div>
          <div>
            <h4>100% Authentic Quality</h4>
            <p>Direct from top verified brands</p>
          </div>
        </div>
        <div className="footer-benefit-item">
          <div className="benefit-icon"><Headphones size={24} /></div>
          <div>
            <h4>24/7 VIP Customer Support</h4>
            <p>Instant phone & chat assistance</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <a href="#" className="brand-logo footer-logo">
              <div className="logo-icon">
                <Sparkles size={20} color="#ffffff" />
              </div>
              <span className="brand-name">URBAN<span className="accent-text">THREAD</span></span>
            </a>
            <p className="brand-desc">
              Your ultimate destination for high-street fashion trends, flagship tech audio & luxe lifestyle products.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="YouTube">YouTube</a>
              <a href="#" aria-label="Pinterest">Pinterest</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Online Shopping</h4>
            <ul>
              <li><a href="#categories">Women's Apparel</a></li>
              <li><a href="#categories">Men's Fashion</a></li>
              <li><a href="#categories">Sneakers & Kicks</a></li>
              <li><a href="#categories">Electronics & Audio</a></li>
              <li><a href="#categories">Beauty & Skincare</a></li>
              <li><a href="#flash-sale">Flash Sale Drops</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Customer Policies</h4>
            <ul>
              <li><a href="#">Contact Us & FAQ</a></li>
              <li><a href="#">Track Order Status</a></li>
              <li><a href="#">Shipping & Delivery Info</a></li>
              <li><a href="#">Return & Exchange Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Guarantee</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Experience Mobile App</h4>
            <p className="app-text">Download the UrbanThread app for exclusive app-only deals & 3D virtual try-ons.</p>
            <div className="app-download-buttons">
              <button className="app-store-btn">
                <Smartphone size={20} />
                <div className="btn-text">
                  <span className="sub font-xs">GET IT ON</span>
                  <span className="main font-sm font-bold">Google Play</span>
                </div>
              </button>
              <button className="app-store-btn">
                <Smartphone size={20} />
                <div className="btn-text">
                  <span className="sub font-xs">DOWNLOAD ON THE</span>
                  <span className="main font-sm font-bold">App Store</span>
                </div>
              </button>
            </div>

            <div className="payment-security-box">
              <span className="payment-title"><CreditCard size={14} /> 100% SECURE PAYMENTS</span>
              <div className="payment-badges">
                <span className="p-badge">VISA</span>
                <span className="p-badge">MC</span>
                <span className="p-badge">AMEX</span>
                <span className="p-badge">PAYPAL</span>
                <span className="p-badge">APPLE PAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© 2026 UrbanThread E-Commerce Inc. All Rights Reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
