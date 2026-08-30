import React, { useState, useEffect, useRef } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import {
  X,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  RotateCcw,
  CheckCircle2,
  Gift,
  ChevronRight,
  Smartphone
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'United States' },
  { code: '+44', flag: '🇬🇧', country: 'United Kingdom' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+65', flag: '🇸🇬', country: 'Singapore' }
];

export const UserAuthModal = ({ isOpen, onClose }) => {
  const { loginWithPhone, login, signup, showToast } = useEcommerce();

  // Auth modes: 'phone' (default) | 'email'
  const [authMethod, setAuthMethod] = useState('phone');
  
  // Phone flow states: 'input' | 'otp'
  const [phoneStep, setPhoneStep] = useState('input');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email flow states
  const [emailMode, setEmailMode] = useState('login'); // 'login' | 'signup'
  const [emailForm, setEmailForm] = useState({ name: '', email: '', password: '' });

  const otpInputsRef = useRef([]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhoneStep('input');
      setOtpDigits(['', '', '', '']);
      setTimer(30);
      setCanResend(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval = null;
    if (phoneStep === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [phoneStep, timer]);

  if (!isOpen) return null;

  // Handle phone number submission to generate OTP
  const handleRequestOtp = (e) => {
    if (e) e.preventDefault();
    const cleanDigits = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      showToast('⚠️ Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    setIsLoading(true);
    // Generate simulated 4-digit OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);

    setTimeout(() => {
      setIsLoading(false);
      setPhoneStep('otp');
      setTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '']);
      showToast(`📲 OTP sent to ${countryCode} ${phoneNumber}! (Demo OTP: ${newOtp})`, 'info');
      
      // Auto-focus first OTP input
      setTimeout(() => {
        if (otpInputsRef.current[0]) {
          otpInputsRef.current[0].focus();
        }
      }, 100);
    }, 450);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (cleanVal && index < 3 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (pasted) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 4; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      if (pasted.length === 4) {
        otpInputsRef.current[3]?.focus();
      }
    }
  };

  const handleAutoFillDemoOtp = () => {
    const digits = generatedOtp.split('');
    setOtpDigits(digits);
    showToast('✨ Auto-filled Demo OTP!', 'success');
  };

  // Handle OTP verification and login
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 4) {
      showToast('⚠️ Please enter the complete 4-digit OTP', 'error');
      return;
    }

    // In demo mode accept generated OTP or any 4 digits
    setIsLoading(true);
    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const displayName = userName.trim() || `Member ${phoneNumber.slice(-4)}`;

    await loginWithPhone(fullPhone, displayName);
    setIsLoading(false);
    onClose();
  };

  // Quick 1-Tap Login for instant demo convenience
  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    const demoPhone = '+91 98765 43210';
    await loginWithPhone(demoPhone, 'Sunny Kumar');
    setIsLoading(false);
    onClose();
  };

  // Handle traditional email submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (emailMode === 'login') {
      await login(emailForm.email || 'alex.johnson@example.com', emailForm.password || 'password123');
    } else {
      await signup(emailForm.name || 'Alex Johnson', emailForm.email || 'alex.johnson@example.com', emailForm.password || 'password123');
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card modern-phone-auth animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Top Promo Banner */}
        <div className="auth-promo-strip">
          <div className="promo-badge">
            <Gift size={15} /> FLAT ₹500 OFF
          </div>
          <span>New User VIP Welcome Offer auto-applied on login!</span>
        </div>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-brand-badge pulse-glow">
            <Smartphone size={24} color="#ff3f6c" />
          </div>
          <h2 className="auth-title">
            {phoneStep === 'otp' ? 'Verify Mobile Number' : 'Login or Sign Up'}
          </h2>
          <p className="auth-sub">
            {phoneStep === 'otp'
              ? `Enter the 4-digit OTP sent to ${countryCode} ${phoneNumber}`
              : 'Enter your 10-digit mobile number to access orders, wishlist & VIP rewards.'}
          </p>
        </div>

        {/* Auth Method Selector Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${authMethod === 'phone' ? 'active' : ''}`}
            onClick={() => {
              setAuthMethod('phone');
              setPhoneStep('input');
            }}
          >
            <Phone size={15} /> Mobile OTP
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${authMethod === 'email' ? 'active' : ''}`}
            onClick={() => setAuthMethod('email')}
          >
            <Mail size={15} /> Email & Password
          </button>
        </div>

        {/* ── PHONE OTP LOGIN FLOW ─────────────────────────── */}
        {authMethod === 'phone' && (
          <div className="phone-auth-container">
            {phoneStep === 'input' ? (
              <form onSubmit={handleRequestOtp} className="auth-form">
                {/* Name field (optional for personalized greeting) */}
                <div className="input-group">
                  <label className="input-label">Your Name (Optional)</label>
                  <div className="input-with-icon modern-input">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. Sunny Kumar"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Mobile Number Input with Country Code */}
                <div className="input-group">
                  <label className="input-label">Mobile Number *</label>
                  <div className="phone-input-row">
                    <div className="country-select-wrapper">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="country-select-dropdown"
                        aria-label="Country Code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-with-icon phone-number-input modern-input">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                        autoFocus
                        required
                      />
                      {phoneNumber.length > 0 && (
                        <button
                          type="button"
                          className="clear-input-btn"
                          onClick={() => setPhoneNumber('')}
                          aria-label="Clear input"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms Agreement Note */}
                <div className="auth-agreement-note">
                  <ShieldCheck size={14} color="#10b981" />
                  <span>By continuing, you agree to UrbanThread's Terms of Use & Privacy Policy.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg auth-submit-btn"
                  disabled={isLoading || phoneNumber.length < 10}
                >
                  {isLoading ? 'Sending OTP...' : 'Get OTP & Continue'}{' '}
                  <ArrowRight size={18} />
                </button>

                {/* Quick 1-Tap Demo Login Button */}
                <div className="quick-demo-container">
                  <div className="or-divider">
                    <span>OR TEST QUICKLY</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-block quick-demo-btn"
                    onClick={handleQuickDemoLogin}
                    disabled={isLoading}
                  >
                    <Sparkles size={16} /> ⚡ 1-Tap Instant Demo Login (+91 98765 43210)
                  </button>
                </div>
              </form>
            ) : (
              /* OTP Verification Step */
              <form onSubmit={handleVerifyOtp} className="auth-form otp-step-form">
                {/* Demo OTP Helper Banner */}
                <div className="demo-otp-banner" onClick={handleAutoFillDemoOtp} role="button" tabIndex={0}>
                  <div className="demo-otp-header">
                    <Sparkles size={16} color="#ff3f6c" />
                    <strong>Instant Demo OTP Code:</strong>
                    <span className="demo-otp-code">{generatedOtp}</span>
                  </div>
                  <span className="demo-otp-hint">👉 Click here to Auto-Fill OTP instantly!</span>
                </div>

                {/* 4 Digit OTP Boxes */}
                <div className="otp-boxes-grid" onPaste={handlePasteOtp}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`otp-digit-box ${digit ? 'filled' : ''}`}
                      aria-label={`OTP Digit ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Resend OTP Timer & Edit Number */}
                <div className="otp-controls-row">
                  <button
                    type="button"
                    className="link-btn change-number-btn"
                    onClick={() => setPhoneStep('input')}
                  >
                    <RotateCcw size={13} /> Change Mobile No.
                  </button>

                  {canResend ? (
                    <button
                      type="button"
                      className="link-btn resend-btn"
                      onClick={() => handleRequestOtp(null)}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="resend-timer-text">
                      Resend OTP in <strong>{timer}s</strong>
                    </span>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg auth-submit-btn"
                  disabled={isLoading || otpDigits.join('').length < 4}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login to Account'}{' '}
                  <CheckCircle2 size={18} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── TRADITIONAL EMAIL / PASSWORD LOGIN FLOW ───────── */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            {emailMode === 'signup' && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-with-icon modern-input">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Sunny Kumar"
                    value={emailForm.name}
                    onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-with-icon modern-input">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-with-icon modern-input">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg auth-submit-btn" disabled={isLoading}>
              {emailMode === 'login' ? 'Sign In with Email' : 'Create Account'}{' '}
              <ArrowRight size={18} />
            </button>

            <div className="email-toggle-row">
              {emailMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button type="button" className="link-btn" onClick={() => setEmailMode('signup')}>
                    Register VIP Account
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button type="button" className="link-btn" onClick={() => setEmailMode('login')}>
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </form>
        )}

        {/* Footer: Continue as Guest / Skip */}
        <div className="auth-modal-footer">
          <div className="divider-line" />
          <button type="button" className="guest-skip-btn" onClick={onClose}>
            <span>Continue as Guest & Browse Store</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
