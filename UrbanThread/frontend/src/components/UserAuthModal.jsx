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
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'United States' },
  { code: '+44', flag: '🇬🇧', country: 'United Kingdom' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+65', flag: '🇸🇬', country: 'Singapore' }
];

export const UserAuthModal = ({ isOpen, onClose }) => {
  const { loginWithPhone, login, signup, loginWithGoogle, loginWithFirebaseToken, showToast } = useEcommerce();

  // Auth modes: 'phone' (default) | 'email'
  const [authMethod, setAuthMethod] = useState('phone');
  
  // Phone flow states: 'input' | 'otp'
  const [phoneStep, setPhoneStep] = useState('input');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Firebase SMS States
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isFirebaseSms, setIsFirebaseSms] = useState(false);

  // Email flow states
  const [emailMode, setEmailMode] = useState('login'); // 'login' | 'signup'
  const [emailForm, setEmailForm] = useState({ name: '', email: '', password: '' });

  const otpInputsRef = useRef([]);

  // Google Firebase Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res?.success) {
      onClose();
    }
  };

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhoneStep('input');
      setOtpDigits(['', '', '', '']);
      setTimer(30);
      setCanResend(false);
      setIsLoading(false);
      setIsFirebaseSms(false);
      setConfirmationResult(null);
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

  // Setup Invisible Recaptcha for Firebase Phone Auth
  const setupRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (_) {}
        window.recaptchaVerifier = null;
      }
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        console.error('recaptcha-container element missing in DOM');
        return null;
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired');
        }
      });
      return window.recaptchaVerifier;
    } catch (e) {
      console.error('reCAPTCHA init error:', e);
      throw e;
    }
  };

  // Handle phone number submission to generate OTP (Real Firebase SMS with simulated fallback)
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanDigits = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      showToast('⚠️ Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    // Standardize to 10 digits (strip leading 0 if entered)
    const phoneTenDigits = cleanDigits.slice(-10);
    const fullPhone = `${countryCode}${phoneTenDigits}`;

    setIsLoading(true);

    try {
      const appVerifier = setupRecaptcha();
      if (!appVerifier) throw new Error('Verification element not ready');

      // Attempt real SMS via Firebase
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(confirmation);
      setIsFirebaseSms(true);
      setOtpDigits(['', '', '', '', '', '']); // 6 digit Firebase OTP
      setPhoneStep('otp');
      setTimer(60);
      setCanResend(false);
      showToast(`📲 Real SMS sent to ${countryCode} ${phoneTenDigits}! Enter 6-digit OTP.`, 'success');
    } catch (err) {
      console.error('Firebase SMS Full Error:', err);
      const errDetail = err.code ? `${err.code}` : (err.message || 'SMS send failed');
      
      // Fallback with clear explanation
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      setIsFirebaseSms(false);
      setOtpDigits(['', '', '', '']);
      setPhoneStep('otp');
      setTimer(30);
      setCanResend(false);
      showToast(`⚠️ Firebase: ${errDetail} (Used Demo OTP: ${newOtp})`, 'error');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (otpInputsRef.current[0]) {
          otpInputsRef.current[0].focus();
        }
      }, 180);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (cleanVal && index < otpDigits.length - 1 && otpInputsRef.current[index + 1]) {
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
    const maxLen = isFirebaseSms ? 6 : 4;
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, maxLen);
    if (pasted) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < maxLen; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      if (pasted.length === maxLen) {
        otpInputsRef.current[maxLen - 1]?.focus();
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
    const requiredLength = isFirebaseSms ? 6 : 4;
    if (enteredOtp.length < requiredLength) {
      showToast(`⚠️ Please enter the complete ${requiredLength}-digit OTP`, 'error');
      return;
    }

    setIsLoading(true);
    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const displayName = userName.trim() || `Member ${phoneNumber.slice(-4)}`;

    try {
      if (isFirebaseSms && confirmationResult) {
        // Verify real SMS OTP via Firebase
        const result = await confirmationResult.confirm(enteredOtp);
        const idToken = await result.user.getIdToken();
        const res = await loginWithFirebaseToken(idToken, userEmail.trim());
        if (res?.success) {
          setIsLoading(false);
          onClose();
          return;
        }
      }

      await loginWithPhone(fullPhone, displayName, userEmail.trim());
      setIsLoading(false);
      onClose();
    } catch (err) {
      console.error('OTP Verification Error:', err);
      showToast(err.message || 'Invalid or expired OTP code', 'error');
      setIsLoading(false);
    }
  };

  // Quick 1-Tap Login for instant demo convenience
  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    const demoPhone = '+91 98765 43210';
    await loginWithPhone(demoPhone, 'Sunny Kumar', userEmail.trim() || 'sunnykumar6207058974@gmail.com');
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

        {phoneStep !== 'otp' && (
          <>
            {/* Google Firebase One-Tap Sign In */}
            <div className="google-auth-container">
              <button
                type="button"
                className="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="security-email-pill">
                <ShieldCheck size={13} color="#10b981" />
                <span>🔒 Security login alert with device info sent to email</span>
              </div>
            </div>

            <div className="auth-separator">
              <span>or sign in with</span>
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
          </>
        )}

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

                {/* Optional Email for Security Login Alert */}
                <div className="input-group">
                  <label className="input-label">Email for Security Alert (Optional)</label>
                  <div className="input-with-icon modern-input">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      placeholder="e.g. sunnykumar6207058974@gmail.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
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
                {/* Firebase Real SMS banner or Demo OTP Helper Banner */}
                {isFirebaseSms ? (
                  <div className="firebase-sms-banner">
                    <ShieldCheck size={20} color="#10b981" />
                    <div>
                      <strong>Real SMS OTP Sent!</strong>
                      <p>Check messages on {countryCode} {phoneNumber} for your 6-digit code.</p>
                    </div>
                  </div>
                ) : (
                  <div className="demo-otp-banner" onClick={handleAutoFillDemoOtp} role="button" tabIndex={0}>
                    <div className="demo-otp-header">
                      <Sparkles size={16} color="#ff3f6c" />
                      <strong>Instant Demo OTP Code:</strong>
                      <span className="demo-otp-code">{generatedOtp}</span>
                    </div>
                    <span className="demo-otp-hint">👉 Click here to Auto-Fill OTP instantly!</span>
                  </div>
                )}

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
                  disabled={isLoading || otpDigits.join('').length < (isFirebaseSms ? 6 : 4)}
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

        {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
        <div id="recaptcha-container"></div>

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
