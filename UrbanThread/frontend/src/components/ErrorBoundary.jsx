import React from 'react';

/**
 * Fix #5 — ErrorBoundary
 * Catches any render-time error in the component tree and shows a graceful
 * fallback UI instead of a blank/crashed screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[UrbanThread] Render Error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #12141c 0%, #1e1e2e 100%)',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            textAlign: 'center',
            padding: '40px 20px',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '16px', filter: 'drop-shadow(0 4px 12px rgba(255,63,108,0.5))' }}>
            ⚡
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #ff3f6c, #ff8c42)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px',
            }}
          >
            Something Went Wrong
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '420px', marginBottom: '32px', lineHeight: 1.6 }}>
            An unexpected error occurred. Your cart &amp; wishlist are safe — just reload the page to continue shopping.
          </p>
          {this.state.error && (
            <pre
              style={{
                background: 'rgba(255,63,108,0.1)',
                border: '1px solid rgba(255,63,108,0.3)',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '0.78rem',
                color: '#ff8c8c',
                maxWidth: '560px',
                overflowX: 'auto',
                marginBottom: '32px',
                textAlign: 'left',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReload}
            style={{
              background: 'linear-gradient(135deg, #ff3f6c, #ff8c42)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 36px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.5px',
              boxShadow: '0 8px 24px rgba(255,63,108,0.35)',
            }}
          >
            🔄 Reload UrbanThread
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
