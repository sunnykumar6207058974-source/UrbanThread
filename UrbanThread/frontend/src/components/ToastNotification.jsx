import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toastNotification, setToastNotification } = useEcommerce();

  if (!toastNotification) return null;

  const { message, type = 'success' } = toastNotification;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle size={20} className="toast-icon text-red" />;
      case 'warning':
        return <AlertCircle size={20} className="toast-icon text-gold" />;
      case 'info':
        return <Info size={20} className="toast-icon text-blue" />;
      case 'success':
      default:
        return <CheckCircle2 size={20} className="toast-icon text-green" />;
    }
  };

  return (
    <div className={`toast-notification-banner toast-${type} animate-slide-up`}>
      <div className="toast-content-group">
        {getIcon()}
        <span className="toast-message-text">{message}</span>
      </div>
      <button
        className="toast-close-btn"
        onClick={() => setToastNotification(null)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
