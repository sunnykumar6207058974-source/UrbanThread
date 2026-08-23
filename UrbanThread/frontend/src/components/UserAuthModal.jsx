import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { X, Lock, Mail, User, ArrowRight, WifiOff } from 'lucide-react';

export const UserAuthModal = ({ isOpen, onClose }) => {
  const { login, signup, simulateNetworkError } = useEcommerce();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
    if (authMode === 'login') {
      login(formData.email || 'alex.johnson@example.com', formData.name);
    } else {
      signup(formData.name || 'Alex Johnson', formData.email || 'alex.johnson@example.com');
    }
  };

  const handleTriggerNetworkError = () => {
    onClose();
    simulateNetworkError();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-brand-badge">
            <Lock size={20} color="#ff3f6c" />
          </div>
          <h2>{authMode === 'login' ? 'Welcome Back to UrbanThread' : 'Create VIP Account'}</h2>
          <p className="sub font-sm">
            {authMode === 'login'
              ? 'Access saved wishlist, fast checkout & order status tracking.'
              : 'Unlock 20% OFF first order coupon + VIP reward points.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {authMode === 'signup' && (
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            {authMode === 'login' ? 'Sign In to Account' : 'Complete VIP Signup'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-toggle">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button className="link-btn" onClick={() => setAuthMode('signup')}>
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="link-btn" onClick={() => setAuthMode('login')}>
                Sign In
              </button>
            </p>
          )}

          <div className="divider-line" />

          <button className="btn btn-xs btn-outline-danger test-network-btn" onClick={handleTriggerNetworkError}>
            <WifiOff size={14} /> Test Network Error Toast
          </button>
        </div>
      </div>
    </div>
  );
};
