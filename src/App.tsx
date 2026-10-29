/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, lazy, Suspense } from 'react';
import './i18n/index.ts';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { ServicesSection } from './components/home/ServicesSection';
import { ShopSection } from './components/home/ShopSection';
import { CategoryShowcaseSection } from './components/home/CategoryShowcaseSection';
import { SpecialtyGatewaysSection, SpecialtyId } from './components/home/SpecialtyGatewaysSection';
import { WhyUsSection } from './components/home/WhyUsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { CustomizerModal } from './components/customizer/CustomizerModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { FavoritesDrawer } from './components/wishlist/FavoritesDrawer';
import { ArticleDetailModal } from './components/article/ArticleDetailModal';
import { MessageCircle } from 'lucide-react';
import { Toaster } from 'sonner';
import { OrderRecord, useCartStore } from './store/useCartStore';
import { useAuthStore } from './store/useAuthStore';
import { useAffiliateStore } from './store/useAffiliateStore';
import { COMPANY_CONTACT } from './data/mockData';
import { initAnalytics, trackPageView, trackEvent } from './utils/analytics';

// Heavy route-level views are lazy-loaded (React.lazy) so the initial bundle
// stays small — the admin dashboard (recharts) alone used to add ~700KB.
const PortfolioPage = lazy(() => import('./components/portfolio/PortfolioPage').then((m) => ({ default: m.PortfolioPage })));
const SpecialtyHubPage = lazy(() => import('./components/specialty/SpecialtyHubPage').then((m) => ({ default: m.SpecialtyHubPage })));
const ShopPage = lazy(() => import('./components/shop/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('./components/product/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./components/checkout/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('./components/checkout/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })));
const CustomerDashboard = lazy(() => import('./components/dashboard/CustomerDashboard').then((m) => ({ default: m.CustomerDashboard })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const SeasonalOffersPage = lazy(() => import('./components/offers/SeasonalOffersPage').then((m) => ({ default: m.SeasonalOffersPage })));
const DynamicLandingPage = lazy(() => import('./components/landing/DynamicLandingPage').then((m) => ({ default: m.DynamicLandingPage })));
const PartnerPortal = lazy(() => import('./components/affiliates/PartnerPortal').then((m) => ({ default: m.PartnerPortal })));

import type { AdminDashboardTab } from './components/admin/AdminDashboard';

// Shared loading fallback for lazy views
const ViewFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      <span className="text-xs font-bold text-slate-500">...</span>
    </div>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'checkout' | 'order-confirmation' | 'dashboard' | 'admin' | 'specialty' | 'offers' | 'portfolio' | 'landing' | 'partners'>('home');
  const [adminInitialTab, setAdminInitialTab] = useState<AdminDashboardTab>('analytics');
  const [dashboardInitialTab, setDashboardInitialTab] = useState<'overview' | 'proofs' | 'orders' | 'designs' | 'wishlist' | 'loyalty' | 'profile'>('overview');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<SpecialtyId>('boxes');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-pizza-box');
  const [landingPageProductId, setLandingPageProductId] = useState<string | undefined>(undefined);
  const [previousView, setPreviousView] = useState<'home' | 'shop' | 'specialty' | 'offers' | 'admin'>('specialty');
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [customizerInitialId, setCustomizerInitialId] = useState<string | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  const { lastOrder } = useCartStore();
  const { addOrderToHistory, isAuthenticated } = useAuthStore();

  // Initialize Analytics on mount
  React.useEffect(() => {
    initAnalytics();
  }, []);

  // Track page views and portal switches automatically
  React.useEffect(() => {
    trackPageView(currentView, {
      specialtyId: currentView === 'specialty' ? selectedSpecialtyId : undefined,
      productId: currentView === 'product' ? selectedProductId : undefined,
    });
  }, [currentView, selectedSpecialtyId, selectedProductId]);

  // React to authentication state changes: redirect if user logs out while in a protected portal
  React.useEffect(() => {
    if (!isAuthenticated && (currentView === 'dashboard' || currentView === 'admin')) {
      setCurrentView('home');
    }
  }, [isAuthenticated, currentView]);

  // Handle deep-linking from shared product URLs, partner referral links, or ad campaigns on mount
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      // Check for partner referral code in URL (?ref=NQ-XXXX or ?partner=NQ-XXXX)
      const refCode = params.get('ref') || params.get('partner');
      if (refCode) {
        try {
          localStorage.setItem('noon_applied_partner_code', refCode.trim());
          trackEvent('partner_referral_detected', `رصد كود إحالة شريك: ${refCode.trim()}`, 'referrals', {
            refCode: refCode.trim(),
          });
        } catch {
          // ignore
        }
      }

      // Track QR campaign scan
      const campaignCode = params.get('qr');
      if (campaignCode) {
        useAffiliateStore.getState().incrementQRCampaignScans(campaignCode);
        trackEvent('qr_scan_detected', `مسح باركود حملة تسويقية: ${campaignCode}`, 'qr_campaigns', {
          campaignCode,
          refCode: refCode || undefined,
        });
      }

      // Check for partner portal deep-link (?portal=partner or ?partners=true)
      if (params.get('portal') === 'partner' || params.get('partners') === 'true' || params.has('partner_portal')) {
        trackEvent('portal_switch', 'فتح بوابة الشركاء وممثلي المبيعات مباشرة عبر الرابط', 'partners');
        setCurrentView('partners');
        return;
      }

      // Check for offers view in QR link (?offers=true)
      if (params.get('offers') === 'true' || params.get('view') === 'offers') {
        trackEvent('portal_switch', 'فتح عروض الموسم الترويجية عبر رابط العرض', 'marketing');
        setCurrentView('offers');
        return;
      }

      // Check for multi-platform ad campaign landing parameter (TikTok, Facebook, Instagram, etc.)
      if (params.get('landing') === 'true' || params.has('campaign') || params.has('lp') || params.has('tiktok')) {
        const campaignProd = params.get('prod') || params.get('productId');
        if (campaignProd) {
          setLandingPageProductId(campaignProd);
          setSelectedProductId(campaignProd);
        }
        trackEvent('ad_campaign_landing', 'دخول صفحة هبوط إعلانية من حملة تواصل اجتماعي', 'marketing', {
          productId: campaignProd,
        });
        setCurrentView('landing');
        return;
      }

      const urlProduct = params.get('product') || params.get('id');
      if (urlProduct) {
        setSelectedProductId(urlProduct);
        setCurrentView('product');
      }
    } catch {
      // ignore
    }
  }, []);

  // Navigation Handlers
  const handleSelectProduct = (productId: string) => {
    setPreviousView(currentView === 'specialty' ? 'specialty' : currentView === 'shop' ? 'shop' : 'specialty');
    setSelectedProductId(productId);
    setCurrentView('product');
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('product', productId);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpecialty = (specialtyId: SpecialtyId) => {
    setSelectedSpecialtyId(specialtyId);
    setCurrentView('specialty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCustomizer = (productId?: string) => {
    let targetId = productId;
    if (!targetId) {
      if (currentView === 'specialty') {
        targetId =
          selectedSpecialtyId === 'boxes'
            ? 'prod-pizza-box'
            : selectedSpecialtyId === 'cards'
            ? 'prod-crystal-acrylic-card'
            : selectedSpecialtyId === 'occasions'
            ? 'prod-wedding-guestbook'
            : 'prod-airplane-led';
      } else if (currentView === 'product') {
        targetId = selectedProductId;
      } else {
        targetId = 'prod-pizza-box';
      }
    }
    setCustomizerInitialId(targetId);
    setCustomizerOpen(true);
    trackEvent('customizer_opened', `فتح استوديو التخصيص للمنتج: ${targetId}`, 'customizer', { productId: targetId });
  };

  const handleCloseCustomizer = () => {
    setCustomizerOpen(false);
    setCustomizerInitialId(undefined);
  };

  const handleNavigate = (view: 'home' | 'shop' | 'dashboard' | 'admin' | 'specialty' | 'offers' | 'portfolio' | 'partners', specialtyId?: SpecialtyId) => {
    // Dynamic live check to avoid any stale React closure issues
    const isAuthed = useAuthStore.getState().isAuthenticated;

    // Guard authenticated-only areas
    if ((view === 'dashboard' || view === 'admin') && !isAuthed) {
      setAuthModalOpen(true);
      return;
    }
    setAuthModalOpen(false);
    if (view === 'specialty' && specialtyId) {
      setSelectedSpecialtyId(specialtyId);
    }
    trackEvent('portal_navigation', `الانتقال إلى بوابة: ${view}`, 'portals', { view, specialtyId });
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    setCompletedOrder(order);
    addOrderToHistory(order);
    trackEvent('purchase_completed', `اكتمال طلب شراء بقيمة ${order.grandTotal.toLocaleString()} د.ع`, 'ecommerce', {
      orderId: order.orderId,
      grandTotal: order.grandTotal,
      partnerCode: order.shipping?.partnerCode || order.promoCode,
    });
    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation - Hidden on landing page, product detail, and partner portal for full dedicated focus */}
      {currentView !== 'landing' && currentView !== 'product' && currentView !== 'partners' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenCustomizer={handleOpenCustomizer}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          activeSpecialtyId={selectedSpecialtyId}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        <Suspense fallback={<ViewFallback />}>
        {currentView === 'landing' && (
          <DynamicLandingPage
            onBackToHome={() => handleNavigate(previousView === 'admin' ? 'admin' : 'home')}
            overrideProductId={landingPageProductId}
            isPreview={previousView === 'admin'}
          />
        )}

        {currentView === 'home' && (
          <>
            <HeroSection
              onOpenCustomizer={(pid) => (pid ? handleSelectProduct(pid) : handleOpenCustomizer())}
              onSelectSpecialty={handleSelectSpecialty}
              onNavigateToOffers={() => handleNavigate('offers')}
              onNavigateToPortfolio={() => handleNavigate('portfolio')}
            />
            {/* The 4 Grand Specialty Gateways (Pacdora-inspired primary landing architecture) */}
            <SpecialtyGatewaysSection
              onSelectSpecialty={handleSelectSpecialty}
              onSelectProduct={handleSelectProduct}
            />
            <ServicesSection
              onOpenCustomizer={(pid) => (pid ? handleSelectProduct(pid) : handleOpenCustomizer())}
            />
            {/* Note: PortfolioSection removed from Home page per user request, moved to Footer Quick Links */}
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
            key={selectedProductId}
            productId={selectedProductId}
            onBackToShop={() => handleNavigate(previousView === 'admin' ? 'admin' : previousView || 'specialty')}
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
            initialTab={dashboardInitialTab}
          />
        )}

        {currentView === 'offers' && (
          <SeasonalOffersPage
            onBackToHome={() => handleNavigate('home')}
            onBrowseShop={() => handleNavigate('shop')}
            onSelectProduct={handleSelectProduct}
            onOpenCustomizerModal={handleOpenCustomizer}
            onNavigateToAdmin={() => {
              setAdminInitialTab('offers');
              handleNavigate('admin');
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onBackToStore={() => handleNavigate('shop')}
            initialTab={adminInitialTab}
            onOpenLandingPreview={(prodId?: string) => {
              setPreviousView('admin');
              setLandingPageProductId(prodId);
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'portfolio' && (
          <PortfolioPage
            onBackToHome={() => handleNavigate('home')}
            onOpenCustomizer={handleOpenCustomizer}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'partners' && (
          <PartnerPortal
            onBackToStore={() => handleNavigate('shop')}
            isAr={true}
          />
        )}
        </Suspense>
      </main>

      {/* Footer - Hidden on landing page and partner portal */}
      {currentView !== 'landing' && currentView !== 'partners' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenCustomizer={handleOpenCustomizer}
        />
      )}

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

      {/* Slide-over Saved Favorites & Wishlist Drawer */}
      <FavoritesDrawer
        onSelectProduct={handleSelectProduct}
        onOpenCustomizer={handleOpenCustomizer}
        onNavigateToDashboard={() => {
          setDashboardInitialTab('wishlist');
          handleNavigate('dashboard');
        }}
        onNavigateToShop={() => handleNavigate('shop')}
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
        onLoginSuccess={() => {
          setAuthModalOpen(false);
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating WhatsApp Quick Action Button (Hidden on landing page and partner portal) */}
      {currentView !== 'landing' && currentView !== 'partners' && (
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
      )}

      {/* Shadcn UI Sonner Toast Notification Container */}
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
