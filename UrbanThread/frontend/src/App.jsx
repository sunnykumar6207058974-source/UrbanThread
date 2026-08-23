import React, { useState } from 'react';
import { EcommerceProvider, useEcommerce } from './context/EcommerceContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrendingCategories } from './components/TrendingCategories';
import { FlashSale } from './components/FlashSale';
import { FeaturedProducts } from './components/FeaturedProducts';
import { RecommendedForYou } from './components/RecommendedForYou';
import { BestSellers } from './components/BestSellers';
import { CustomerReviews } from './components/CustomerReviews';
import { NewsletterSignup } from './components/NewsletterSignup';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { UserAccountModal } from './components/UserAccountModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { UserAuthModal } from './components/UserAuthModal';
import { FloatingChat } from './components/FloatingChat';
import { ToastNotification } from './components/ToastNotification';
import { MobileBottomNav } from './components/MobileBottomNav';
// Fix #10: App.css (105KB) split into organized, maintainable CSS files
import './styles/layout.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/buttons.css';
import './styles/sections.css';
import './styles/modals.css';
import './styles/auth.css';
import './styles/animations.css';
import './styles/dark.css';
import './styles/responsive.css';

const MainContent = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    isAccountOpen,
    setIsAccountOpen,
    accountTab,
    isAdminOpen,
    setIsAdminOpen,
    isDarkMode
  } = useEcommerce();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className={`app-main-layout ${isDarkMode ? 'dark-theme' : ''}`}>
      <Header onOpenAuth={() => setIsAuthOpen(true)} />
      <main>
        <HeroBanner />
        <TrendingCategories />
        <FlashSale />
        <FeaturedProducts />
        <RecommendedForYou />
        <BestSellers />
        <CustomerReviews />
        <NewsletterSignup />
      </main>
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <UserAccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} initialTab={accountTab} />
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <UserAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <FloatingChat />
      <ToastNotification />
    </div>
  );
};

function App() {
  return (
    <EcommerceProvider>
      <MainContent />
    </EcommerceProvider>
  );
}

export default App;
