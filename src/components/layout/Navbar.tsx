import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Bell,
  MessageCircle,
  CheckCircle2,
  Tag,
  ArrowRight,
  ArrowLeft,
  Flame,
  Briefcase,
  Heart,
  MoreVertical,
  Award,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOffersStore } from '../../store/useOffersStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { LanguageToggle } from './LanguageToggle';
import { CurrencyToggle } from './CurrencyToggle';

import { SpecialtyId } from '../home/SpecialtyGatewaysSection';

interface NavbarProps {
  onOpenCustomizer: (productId?: string) => void;
  currentView: 'home' | 'shop' | 'product' | 'checkout' | 'order-confirmation' | 'dashboard' | 'admin' | 'specialty' | 'offers' | 'portfolio' | 'partners';
  onNavigate: (view: 'home' | 'shop' | 'dashboard' | 'admin' | 'specialty' | 'offers' | 'portfolio' | 'partners', specialtyId?: SpecialtyId) => void;
  onOpenAuthModal: () => void;
  activeSpecialtyId?: SpecialtyId;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCustomizer,
  currentView,
  onNavigate,
  onOpenAuthModal,
  activeSpecialtyId,
}) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [isPromoBannerVisible, setIsPromoBannerVisible] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('noon_promo_banner_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const handleDismissPromoBanner = () => {
    setIsPromoBannerVisible(false);
    try {
      sessionStorage.setItem('noon_promo_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const { setIsOpen: setCartOpen, getTotalItemsCount } = useCartStore();
  const {
    user,
    isAuthenticated,
    logout,
    digitalProofs,
    hasProofNotification,
    dismissProofNotification,
    wishlist,
    setIsWishlistOpen,
    loyaltyPoints,
  } = useAuthStore();
  const { getFeaturedOffer, getActiveOffers } = useOffersStore();
  const { formatPrice } = useCurrencyStore();
  const featuredOffer = getFeaturedOffer();
  const activeOffersCount = getActiveOffers().length;

  const totalCartCount = getTotalItemsCount();
  const pendingProofsCount = digitalProofs.filter((p) => p.status === 'pending_approval').length;

  const isAr = i18n.language === 'ar';

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open to prevent scroll conflicts
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#offers') {
      onNavigate('offers');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#shop') {
      onNavigate('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#portfolio') {
      onNavigate('portfolio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (currentView !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { href: '#home', label: t('nav.home'), isShop: false, isOffers: false },
    { href: '#specialties', label: isAr ? 'استوديوهات الإنتاج' : 'Production Studios', isShop: false, isOffers: false },
    { href: '#offers', label: isAr ? 'عروض الموسم' : 'Seasonal Offers', isShop: false, isOffers: true },
    { href: '#shop', label: isAr ? 'المتجر والتخصيص' : 'Shop & Customize', isShop: true, isOffers: false },
    { href: '#services', label: t('nav.services'), isShop: false, isOffers: false },
    { href: '#portfolio', label: t('nav.portfolio'), isShop: false, isOffers: false },
    { href: '#why-us', label: t('nav.whyUs'), isShop: false, isOffers: false },
    { href: '#testimonials', label: t('nav.testimonials'), isShop: false, isOffers: false },
    { href: '#contact', label: t('nav.contact'), isShop: false, isOffers: false },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 transition-colors duration-200">
      {/* Slim, Dismissible Promotional Banner (Top of Navbar - Fully Interactive) */}
      {isPromoBannerVisible && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-amber-200 border-b border-amber-500/25 px-2.5 sm:px-3 py-1.5 transition-all text-[11px] sm:text-xs shadow-xs select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Offer Highlight - Clickable on both Mobile and Desktop */}
            <div
              onClick={() => {
                onNavigate('offers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0 flex-1 cursor-pointer group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onNavigate('offers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('offers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border border-amber-300 text-[10px] shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Tag className="w-3 h-3 text-slate-950" />
                <span>{isAr ? 'عروض الموسم' : 'Seasonal Sale'}</span>
              </button>

              <p className="truncate font-medium text-slate-200 group-hover:text-amber-200 transition-colors">
                {featuredOffer ? (
                  isAr ? (
                    <>
                      <strong className="text-amber-300 font-bold">{featuredOffer.discountBadgeAr}</strong>: {featuredOffer.titleAr} +{' '}
                      <span className="text-emerald-300 font-semibold">شحن مجاني لكافة المحافظات</span> للطلبات فوق {formatPrice(150000, { isAr: true })}
                    </>
                  ) : (
                    <>
                      <strong className="text-amber-300 font-bold">{featuredOffer.discountBadgeEn}</strong>: {featuredOffer.titleEn} +{' '}
                      <span className="text-emerald-300 font-semibold">Free nationwide delivery</span> on orders over {formatPrice(150000, { isAr: false })}!
                    </>
                  )
                ) : isAr ? (
                  <>
                    <strong className="text-amber-300 font-bold">خصم يصل إلى 33%</strong> على علب الكرتون الفاخرة وكروت البصمة +{' '}
                    <span className="text-emerald-300 font-semibold">شحن مجاني لكافة المحافظات</span> للطلبات فوق {formatPrice(150000, { isAr: true })}
                  </>
                ) : (
                  <>
                    <strong className="text-amber-300 font-bold">Up to 33% off</strong> luxury rigid boxes & foil cards +{' '}
                    <span className="text-emerald-300 font-semibold">Free nationwide delivery</span> on orders over {formatPrice(150000, { isAr: false })}!
                  </>
                )}
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('offers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 text-amber-300 group-hover:text-white font-bold transition-colors underline underline-offset-2 shrink-0 cursor-pointer ms-1 text-[10px] sm:text-xs"
              >
                <span>{isAr ? 'عرض الخصومات' : 'Explore'}</span>
                {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </button>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={handleDismissPromoBanner}
              className="p-1 rounded-lg text-amber-400/70 hover:text-amber-200 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              aria-label={isAr ? 'إغلاق الإعلان' : 'Dismiss promotional banner'}
              title={isAr ? 'إغلاق الإعلان' : 'Dismiss banner'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar Bar */}
      <div
        className={`transition-colors duration-200 ${
          isScrolled || mobileMenuOpen
            ? 'bg-white shadow-sm border-b border-slate-100 py-2 sm:py-3'
            : 'bg-white/95 py-2.5 sm:py-3.5 border-b border-slate-100/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Official Brand Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            type="button"
            className="flex flex-col items-center justify-center group text-slate-900 transition-transform hover:scale-105 cursor-pointer text-center py-0.5"
            title={isAr ? 'نُون والقَلَم للطباعة والتصميم' : 'Noon & Pen Printing & Design'}
          >
            <div className="h-14 sm:h-16 w-auto flex items-center justify-center shrink-0">
              <img
                src="/images/noon_walqalam_logo.png"
                alt="شعار نُون والقَلَم"
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-xs transition-transform group-hover:scale-105"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-amber-950 tracking-tight mt-0.5 leading-tight">
              {isAr ? 'للطباعة والتصميم' : 'Printing & Design'}
            </span>
          </button>

          {/* Desktop Nav Links (Responsive gap and typography to guarantee menu items never get pushed) */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-5.5">
            {navLinks.map((link) => {
              const isOffersActive = link.isOffers && currentView === 'offers';
              const isShopActive = link.isShop && currentView === 'shop';
              const isHomeActive = !link.isShop && !link.isOffers && currentView === 'home' && link.href === '#home';
              const isCurrent = isOffersActive || isShopActive || isHomeActive;

              return (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  type="button"
                  className={`text-xs xl:text-sm font-medium transition-colors relative py-1 cursor-pointer flex items-center gap-1 xl:gap-1.5 whitespace-nowrap ${
                    isCurrent
                      ? 'text-amber-800 font-black after:w-full after:h-0.5 after:bg-amber-600 after:absolute after:bottom-0 after:start-0'
                      : link.isOffers
                      ? 'text-amber-800 font-bold hover:text-amber-900'
                      : 'text-slate-600 hover:text-amber-800 hover:after:w-full after:w-0 after:h-0.5 after:bg-amber-600 after:absolute after:bottom-0 after:start-0 after:transition-all after:duration-200'
                  }`}
                >
                  {link.isOffers && <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />}
                  <span>{link.label}</span>
                  {link.isOffers && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase shrink-0">
                      {isAr ? 'خصم' : 'Sale'}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Smaller, refined buttons ordered logically */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 1. Request Custom Design CTA (Sleek, compact luxury button) */}
            <button
              onClick={() => {
                const defaultProdId =
                  activeSpecialtyId === 'boxes'
                    ? 'prod-pizza-box'
                    : activeSpecialtyId === 'cards'
                    ? 'prod-crystal-acrylic-card'
                    : activeSpecialtyId === 'occasions'
                    ? 'prod-wedding-guestbook'
                    : activeSpecialtyId === 'led'
                    ? 'prod-airplane-led'
                    : 'prod-pizza-box';
                onOpenCustomizer(defaultProdId);
              }}
              type="button"
              className="hidden md:inline-flex items-center gap-1 h-[30px] sm:h-[32px] px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-[11px] font-black bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 hover:from-amber-800 hover:to-amber-900 text-white shadow-2xs hover:shadow-xs hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              title={isAr ? 'طلب وتجهيز تصميم مخصص' : 'Request Custom Design'}
            >
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
              <span>{isAr ? 'طلب تصميم 🎨' : 'Custom Design 🎨'}</span>
            </button>

            {/* 2. Notification Bell (Icon-only: 30px-32px) */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationMenuOpen(!notificationMenuOpen);
                  if (userMenuOpen) setUserMenuOpen(false);
                }}
                type="button"
                className={`relative h-[30px] w-[30px] sm:h-[32px] sm:w-[32px] min-w-[30px] sm:min-w-[32px] rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                  pendingProofsCount > 0
                    ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-2xs'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-950 shadow-2xs hover:shadow-xs'
                }`}
                aria-label={isAr ? 'التنبيهات وبروفات التصاميم' : 'Design Proof Notifications'}
                title={isAr ? 'بروفات التصاميم والتنبيهات' : 'Notifications'}
              >
                <Bell className={`w-3.5 h-3.5 ${pendingProofsCount > 0 ? 'text-amber-700' : 'text-slate-700'}`} />
                {pendingProofsCount > 0 && (
                  <span className="absolute -top-1 -end-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-amber-500 text-slate-950 text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {pendingProofsCount}
                  </span>
                )}
              </button>

              {/* Backdrop to close notification on outside tap */}
              {notificationMenuOpen && (
                <div
                  className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[1px]"
                  onClick={() => setNotificationMenuOpen(false)}
                />
              )}

              {/* Notification Dropdown Panel */}
              {notificationMenuOpen && (
                <div className={`fixed inset-x-3 ${isPromoBannerVisible ? 'top-[98px]' : 'top-[72px]'} sm:absolute sm:inset-x-auto sm:top-full sm:end-0 sm:mt-2 w-auto sm:w-96 max-w-lg mx-auto sm:mx-0 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-scale overflow-hidden`}>
                  <div className="px-5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-black text-slate-900">
                        {isAr ? 'تنبيهات بروفات التصاميم' : 'Design Proof Notifications'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {pendingProofsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {pendingProofsCount} {isAr ? 'جديدة' : 'New'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {isAr ? 'لا توجد تنبيهات معلقة' : 'Up to date'}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setNotificationMenuOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                    {digitalProofs.length > 0 ? (
                      digitalProofs.map((proof) => {
                        const isPending = proof.status === 'pending_approval';
                        return (
                          <div
                            key={proof.id}
                            className={`p-3 rounded-2xl border transition-all ${
                              isPending
                                ? 'bg-amber-50/70 border-amber-200'
                                : 'bg-slate-50/50 border-slate-100'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={proof.previewUrl}
                                alt="Proof"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="text-xs font-bold text-slate-900 truncate">
                                    {isAr ? proof.productTitleAr : proof.productTitleEn}
                                  </h4>
                                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                    #{proof.orderId}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {isAr ? proof.specsAr : proof.specsEn}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNotificationMenuOpen(false);
                                      onNavigate('dashboard');
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                                  >
                                    {isAr ? 'معاينة واعتماد التصميم' : 'Review & Approve'}
                                  </button>
                                  <a
                                    href={`https://wa.me/9647800000000?text=${encodeURIComponent(
                                      isAr
                                        ? `مرحباً نون والقلم، بخصوص بروفة تصميم طلب رقم #${proof.orderId} أود متابعتها معكم.`
                                        : `Hello Noon & Pen, regarding proof #${proof.orderId}.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setNotificationMenuOpen(false)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer border border-emerald-200"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>واتساب</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400">
                        {isAr ? 'لا توجد تنبيهات جديدة حالياً' : 'No notifications'}
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50/70 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="text-xs font-bold text-amber-900 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      {isAr ? 'عرض كافة بروفات التصاميم في الحساب ←' : 'View all proofs in dashboard →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Wishlist Favorites (Icon-only: 30px-32px) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              type="button"
              className={`relative h-[30px] w-[30px] sm:h-[32px] sm:w-[32px] min-w-[30px] sm:min-w-[32px] rounded-lg border flex items-center justify-center transition-colors cursor-pointer shadow-2xs hover:shadow-xs ${
                wishlist.length > 0
                  ? 'border-rose-200 bg-rose-50/70 text-rose-600 hover:bg-rose-100'
                  : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600'
              }`}
              aria-label={isAr ? 'قائمة الرغبات والمفضلة' : 'Wishlist'}
              title={isAr ? `قائمة الرغبات والمفضلة (${wishlist.length})` : `Wishlist & Favorites (${wishlist.length})`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -end-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* 4. Shopping Cart (Icon-only: 30px-32px) */}
            <button
              onClick={() => setCartOpen(true)}
              type="button"
              className="relative h-[30px] w-[30px] sm:h-[32px] sm:w-[32px] min-w-[30px] sm:min-w-[32px] rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-800 shadow-2xs hover:shadow-xs transition-colors flex items-center justify-center cursor-pointer"
              aria-label={t('nav.cart')}
              title={isAr ? 'سلة المشتريات والطلبات' : 'Shopping Cart'}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-700 hover:text-amber-800 transition-colors" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -end-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-amber-600 text-white text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center animate-scale shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* 5. User Account / Sign In (Compact: 30px-32px) */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    if (notificationMenuOpen) setNotificationMenuOpen(false);
                  }}
                  type="button"
                  className="h-[30px] sm:h-[32px] px-1.5 sm:px-2 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
                  title={isAr ? 'حساب العميل والطلبات' : 'Customer Account'}
                >
                  <div className="w-4.5 h-4.5 rounded-md bg-amber-900 text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 hidden sm:inline max-w-[75px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                  {pendingProofsCount > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  )}
                </button>

                {/* Backdrop to close user menu on outside tap */}
                {userMenuOpen && (
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setUserMenuOpen(false)}
                  />
                )}

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute end-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scale">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      type="button"
                      className="w-full text-start px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-amber-700" />
                        <span>{isAr ? 'لوحة الحساب والبروفات' : 'Customer Dashboard'}</span>
                      </div>
                      {pendingProofsCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                          {pendingProofsCount}
                        </span>
                      )}
                    </button>

                    {/* Wishlist item in user menu */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setIsWishlistOpen(true);
                      }}
                      type="button"
                      className="w-full text-start px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span>{isAr ? 'قائمة الرغبات والمفضلة' : 'Wishlist & Favorites'}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">
                        {wishlist.length}
                      </span>
                    </button>

                    {/* Loyalty Points item in user menu */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      type="button"
                      className="w-full text-start px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>{isAr ? 'نقاط الولاء والمكافآت' : 'Loyalty Points'}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                        {loyaltyPoints.toLocaleString()}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('partners');
                      }}
                      type="button"
                      className="w-full text-start px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                    >
                      <Briefcase className="w-4 h-4 text-amber-700" />
                      <span>{isAr ? 'بوابة الشركاء وممثلي المبيعات' : 'Sales Partners Portal'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('admin');
                      }}
                      type="button"
                      className="w-full text-start px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>{isAr ? 'لوحة الإدارة (RBAC Studio)' : 'Admin Dashboard'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      type="button"
                      className="w-full text-start px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                type="button"
                className="h-[30px] sm:h-[32px] px-2 sm:px-2.5 rounded-lg border border-amber-300/80 bg-amber-50/80 hover:bg-amber-100 text-amber-950 text-[10px] sm:text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs shrink-0"
                title={isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In'}
              >
                <User className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span className="hidden sm:inline">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            {/* 6. Sidebar Dots Button (زر النقاط في جانب الموقع: تفضيلات العملة واللغة) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="h-[30px] w-[30px] sm:h-[32px] sm:w-[32px] min-w-[30px] sm:min-w-[32px] rounded-lg border border-amber-200/90 bg-amber-50/60 hover:bg-amber-100/80 text-amber-950 flex items-center justify-center cursor-pointer shadow-2xs shrink-0 transition-transform active:scale-95"
              aria-label={isAr ? 'القائمة الجانبية وتفضيلات اللغة والعملة' : 'Side Menu & Preferences'}
              title={isAr ? 'القائمة الجانبية (تغيير العملة واللغة)' : 'Side Menu (Currency & Language)'}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-amber-950" />
              ) : (
                <MoreVertical className="w-4 h-4 text-amber-950" />
              )}
            </button>
          </div>
        </div>

        {/* Slide-over Side Drawer ("الشريط الجانبي النقاط في جانب موقع") */}
        {mobileMenuOpen && (
          <>
            {/* Soft Backdrop to close when tapping outside */}
            <div
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Side Drawer Panel */}
            <div
              className="fixed inset-y-0 end-0 z-50 w-80 sm:w-88 max-w-[88vw] bg-white shadow-2xl flex flex-col justify-between overflow-y-auto overscroll-contain border-s border-amber-200/80"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div>
                {/* Drawer Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 to-amber-100/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-900 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                      نُ
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-amber-950">
                        {isAr ? 'خيارات وتفضيلات المتجر' : 'Store Options & Preferences'}
                      </h3>
                      <p className="text-[10px] text-amber-800">
                        {isAr ? 'اللغة والعملة والروابط السريعة' : 'Language, Currency & Links'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    type="button"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title={isAr ? 'إغلاق القائمة' : 'Close Menu'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Feature: Language & Currency Switchers in Sidebar */}
                <div className="p-4 bg-amber-50/40 border-b border-amber-100/90 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <span>🌐</span>
                      <span>{isAr ? 'تفضيلات العرض والعملة' : 'Display & Currency'}</span>
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-bold">
                      {isAr ? 'تحديث فوري' : 'Live rates'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Language Switcher */}
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 mb-1">
                        {isAr ? 'لغة الموقع:' : 'Language:'}
                      </p>
                      <LanguageToggle variant="expanded" />
                    </div>

                    {/* Currency Switcher */}
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 mb-1">
                        {isAr ? 'عملة المتجر والأسعار:' : 'Currency & Pricing:'}
                      </p>
                      <CurrencyToggle variant="expanded" />
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="p-4 flex flex-col gap-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    {isAr ? 'صفحات المتجر' : 'Navigation'}
                  </p>
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      type="button"
                      className={`w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                        link.isOffers
                          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-950 border border-amber-200'
                          : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {link.isOffers && <Flame className="w-4 h-4 text-amber-600 animate-pulse" />}
                        <span>{link.label}</span>
                      </span>
                      {link.isOffers && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                          {isAr ? 'عروض 33%' : '33% OFF'}
                        </span>
                      )}
                    </button>
                  ))}

                  {/* Dashboard / User Shortcuts */}
                  <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                      {isAr ? 'الحساب والخدمات' : 'Account & Portals'}
                    </p>

                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onNavigate('dashboard');
                          }}
                          type="button"
                          className="w-full text-start px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-amber-700" />
                            <span>{isAr ? 'لوحة الحساب والبروفات' : 'Customer Dashboard'}</span>
                          </div>
                          {pendingProofsCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black">
                              {pendingProofsCount}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setIsWishlistOpen(true);
                          }}
                          type="button"
                          className="w-full text-start px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-900 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                            <span>{isAr ? 'قائمة الرغبات والمفضلة' : 'Wishlist & Favorites'}</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">
                            {wishlist.length}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onNavigate('dashboard');
                          }}
                          type="button"
                          className="w-full text-start px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span>{isAr ? 'نقاط الولاء والمكافآت' : 'Loyalty Points'}</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                            {loyaltyPoints.toLocaleString()}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onNavigate('partners');
                          }}
                          type="button"
                          className="w-full text-start px-3.5 py-2 rounded-lg text-xs font-bold text-amber-950 bg-amber-50/70 hover:bg-amber-100 transition-colors flex items-center gap-2"
                        >
                          <Briefcase className="w-4 h-4 text-amber-700" />
                          <span>{isAr ? 'بوابة الشركاء وممثلي المبيعات' : 'Sales Partners Portal'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onNavigate('admin');
                          }}
                          type="button"
                          className="w-full text-start px-3.5 py-2 rounded-lg text-xs font-bold text-amber-900 hover:bg-amber-50 transition-colors flex items-center gap-2"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                          <span>{isAr ? 'لوحة تحكم الإدارة (RBAC)' : 'Admin Dashboard'}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenAuthModal();
                        }}
                        type="button"
                        className="w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-amber-50/80 hover:bg-amber-100 transition-colors flex items-center gap-2 border border-amber-200/80"
                      >
                        <User className="w-4 h-4 text-amber-800" />
                        <span>{isAr ? 'تسجيل الدخول / إنشاء حساب جديد' : 'Sign In / Register'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/60">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCustomizer();
                  }}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-900 to-amber-950 hover:from-amber-800 hover:to-amber-900 text-white shadow-xs cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isAr ? 'طلب وتجهيز تصميم مخصص 🎨' : 'Request Custom Design 🎨'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </header>
  );
};
