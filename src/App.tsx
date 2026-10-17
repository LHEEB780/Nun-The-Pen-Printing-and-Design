/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import './i18n/index.ts';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { ServicesSection } from './components/home/ServicesSection';
import { PortfolioSection } from './components/home/PortfolioSection';
import { ShopSection } from './components/home/ShopSection';
import { CategoryShowcaseSection } from './components/home/CategoryShowcaseSection';
import { SpecialtyGatewaysSection, SpecialtyId } from './components/home/SpecialtyGatewaysSection';
import { SpecialtyHubPage } from './components/specialty/SpecialtyHubPage';
import { WhyUsSection } from './components/home/WhyUsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationPage } from './components/checkout/OrderConfirmationPage';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { CustomizerModal } from './components/customizer/CustomizerModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { ArticleDetailModal } from './components/article/ArticleDetailModal';
import { MessageCircle } from 'lucide-react';
import { Toaster } from 'sonner';
import { COMPANY_CONTACT } from './data/mockData';
import { OrderRecord, useCartStore } from './store/useCartStore';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'checkout' | 'order-confirmation' | 'dashboard' | 'admin' | 'specialty'>('home');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<SpecialtyId>('boxes');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-acrylic-led-sign');
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [customizerInitialId, setCustomizerInitialId] = useState<string | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  const { lastOrder } = useCartStore();
  const { addOrderToHistory, isAuthenticated } = useAuthStore();

  // Navigation Handlers
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpecialty = (specialtyId: SpecialtyId) => {
    setSelectedSpecialtyId(specialtyId);
    setCurrentView('specialty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCustomizer = (productId?: string) => {
    setCustomizerInitialId(productId);
    setCustomizerOpen(true);
  };

  const handleCloseCustomizer = () => {
    setCustomizerOpen(false);
    setCustomizerInitialId(undefined);
  };

  const handleNavigate = (view: 'home' | 'shop' | 'dashboard' | 'admin' | 'specialty', specialtyId?: SpecialtyId) => {
    if (view === 'dashboard' && !isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (view === 'specialty' && specialtyId) {
      setSelectedSpecialtyId(specialtyId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    setCompletedOrder(order);
    addOrderToHistory(order);
    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCustomizer={handleOpenCustomizer}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        activeSpecialtyId={selectedSpecialtyId}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              onOpenCustomizer={(pid) => (pid ? handleSelectProduct(pid) : handleOpenCustomizer())}
              onSelectSpecialty={handleSelectSpecialty}
            />
            {/* The 4 Grand Specialty Gateways (Pacdora-inspired primary landing architecture) */}
            <SpecialtyGatewaysSection
              onSelectSpecialty={handleSelectSpecialty}
              onSelectProduct={handleSelectProduct}
            />
            <ServicesSection
              onOpenCustomizer={(pid) => (pid ? handleSelectProduct(pid) : handleOpenCustomizer())}
            />
            <PortfolioSection
              onOpenCustomizer={(pid) => (pid ? handleSelectProduct(pid) : handleOpenCustomizer())}
            />
            <WhyUsSection />
            <TestimonialsSection />
            <ContactSection />
          </>
        )}

        {currentView === 'specialty' && (
          <SpecialtyHubPage
            specialtyId={selectedSpecialtyId}
            onSelectSpecialty={(sid) => {
              setSelectedSpecialtyId(sid);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToHome={() => handleNavigate('home')}
            onSelectProduct={handleSelectProduct}
            onOpenCustomizerModal={handleOpenCustomizer}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            onSelectProduct={handleSelectProduct}
            onOpenCustomizerModal={handleOpenCustomizer}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailPage
            productId={selectedProductId}
            onBackToShop={() => handleNavigate('shop')}
            onOpenCustomizerModal={handleOpenCustomizer}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => handleNavigate('shop')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'order-confirmation' && (completedOrder || lastOrder) && (
          <OrderConfirmationPage
            order={(completedOrder || lastOrder)!}
            onReturnHome={() => handleNavigate('home')}
            onBrowseShop={() => handleNavigate('shop')}
          />
        )}

        {currentView === 'dashboard' && (
          <CustomerDashboard
            onBackToShop={() => handleNavigate('shop')}
            onOpenCustomizerWithProduct={handleSelectProduct}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onBackToStore={() => handleNavigate('shop')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCustomizer={handleOpenCustomizer}
      />

      {/* Product Showcase & Client Data Upload Modal */}
      <CustomizerModal
        isOpen={customizerOpen}
        onClose={handleCloseCustomizer}
        initialProductId={customizerInitialId || selectedProductId}
        onNavigateToDashboard={() => handleNavigate('dashboard')}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onNavigateToCheckout={() => {
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Full In-Depth Article Reader Modal for Quick Links & Knowledge Base */}
      <ArticleDetailModal
        onOpenCustomizer={handleOpenCustomizer}
        onNavigateToShop={() => handleNavigate('shop')}
        onNavigateToContact={() => handleNavigate('home')}
      />

      {/* User Authentication Modal (Login / Sign Up / Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={() => handleNavigate('dashboard')}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={COMPANY_CONTACT.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 end-6 z-30 p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
        aria-label="Direct WhatsApp Consultation"
        title="تواصل مباشر عبر واتساب | Direct WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white/20" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ms-2 text-xs font-bold transition-all duration-300 ease-in-out">
          +964 780 000 0000
        </span>
      </a>

      {/* Shadcn UI Sonner Toast Notification Container */}
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
