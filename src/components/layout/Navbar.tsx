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
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOffersStore } from '../../store/useOffersStore';
import { LanguageToggle } from './LanguageToggle';

import { SpecialtyId } from '../home/SpecialtyGatewaysSection';

interface NavbarProps {
  onOpenCustomizer: (productId?: string) => void;
  currentView: 'home' | 'shop' | 'product' | 'checkout' | 'order-confirmation' | 'dashboard' | 'admin' | 'specialty' | 'offers' | 'portfolio';
  onNavigate: (view: 'home' | 'shop' | 'dashboard' | 'admin' | 'specialty' | 'offers' | 'portfolio', specialtyId?: SpecialtyId) => void;
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
  } = useAuthStore();
  const { getFeaturedOffer, getActiveOffers } = useOffersStore();
  const featuredOffer = getFeaturedOffer();
  const activeOffersCount = getActiveOffers().length;

  const totalCartCount = getTotalItemsCount();
  const pendingProofsCount = digitalProofs.filter((p) => p.status === 'pending_approval').length;

  const isAr = i18n.language === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className="fixed top-0 inset-x-0 z-40 transition-all duration-300">
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
                      <span className="text-emerald-300 font-semibold">شحن مجاني لكافة المحافظات</span> للطلبات فوق 150,000 د.ع
                    </>
                  ) : (
                    <>
                      <strong className="text-amber-300 font-bold">{featuredOffer.discountBadgeEn}</strong>: {featuredOffer.titleEn} +{' '}
                      <span className="text-emerald-300 font-semibold">Free nationwide delivery</span> on orders over 150K IQD!
                    </>
                  )
                ) : isAr ? (
                  <>
                    <strong className="text-amber-300 font-bold">خصم يصل إلى 33%</strong> على علب الكرتون الفاخرة وكروت البصمة +{' '}
                    <span className="text-emerald-300 font-semibold">شحن مجاني لكافة المحافظات</span> للطلبات فوق 150,000 د.ع
                  </>
                ) : (
                  <>
                    <strong className="text-amber-300 font-bold">Up to 33% off</strong> luxury rigid boxes & foil cards +{' '}
                    <span className="text-emerald-300 font-semibold">Free nationwide delivery</span> on orders over 150,000 IQD!
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
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 py-2.5 sm:py-3'
            : 'bg-white/85 backdrop-blur-xs py-3.5 sm:py-4 border-b border-transparent'
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
                      ? 'text-purple-700 font-bold after:w-full after:h-0.5 after:bg-purple-600 after:absolute after:bottom-0 after:start-0'
                      : link.isOffers
                      ? 'text-amber-800 font-bold hover:text-amber-900'
                      : 'text-slate-600 hover:text-purple-700 hover:after:w-full after:w-0 after:h-0.5 after:bg-purple-600 after:absolute after:bottom-0 after:start-0 after:transition-all after:duration-200'
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

          {/* Action Tools: Smaller, refined buttons ordered by size */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 1. Single Opposite-Language Button: compact 34px height */}
            <LanguageToggle variant="single" />

            {/* 2. Notification Bell (Icon-only: 34px x 34px) */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationMenuOpen(!notificationMenuOpen);
                  if (userMenuOpen) setUserMenuOpen(false);
                }}
                type="button"
                className={`relative h-[34px] w-[34px] min-w-[34px] rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                  pendingProofsCount > 0
                    ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-2xs'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-950 shadow-2xs hover:shadow-xs'
                }`}
                aria-label={isAr ? 'التنبيهات وبروفات التصاميم' : 'Design Proof Notifications'}
                title={isAr ? 'بروفات التصاميم والتنبيهات' : 'Notifications'}
              >
                <Bell className={`w-4 h-4 ${pendingProofsCount > 0 ? 'text-amber-700' : 'text-slate-700'}`} />
                {pendingProofsCount > 0 && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center animate-bounce shadow-xs">
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

            {/* 3. Shopping Cart (Icon-only: 34px x 34px) */}
            <button
              onClick={() => setCartOpen(true)}
              type="button"
              className="relative h-[34px] w-[34px] min-w-[34px] rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-purple-700 shadow-2xs hover:shadow-xs transition-colors flex items-center justify-center cursor-pointer"
              aria-label={t('nav.cart')}
              title={isAr ? 'سلة المشتريات والطلبات' : 'Shopping Cart'}
            >
              <ShoppingBag className="w-4 h-4 text-slate-700 hover:text-purple-700 transition-colors" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -end-1 w-4 h-4 bg-purple-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-scale shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* 4. User Account / Sign In (Medium Button: 34px height) */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    if (notificationMenuOpen) setNotificationMenuOpen(false);
                  }}
                  type="button"
                  className="h-[34px] px-2 sm:px-2.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
                  title={isAr ? 'حساب العميل والطلبات' : 'Customer Account'}
                >
                  <div className="w-5 h-5 rounded-md bg-amber-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 hidden sm:inline max-w-[80px] truncate">
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

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('admin');
                      }}
                      type="button"
                      className="w-full text-start px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                    >
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
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
                className="h-[34px] px-2 sm:px-2.5 rounded-lg border border-purple-200/90 bg-purple-50/80 hover:bg-purple-100 text-purple-900 text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs shrink-0"
                title={isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In'}
              >
                <User className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span className="hidden sm:inline">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            {/* 5. Request Custom Design CTA (Largest Button: 34px height, sleek luxury CTA) */}
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
              className="hidden sm:inline-flex items-center gap-1.5 h-[34px] px-3 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-black bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 hover:from-amber-800 hover:to-amber-900 text-white shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              title={isAr ? 'طلب وتجهيز تصميم مخصص' : 'Request Custom Design'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{isAr ? 'طلب وتجهيز تصميم 🎨' : 'Request Custom Design 🎨'}</span>
            </button>

            {/* 6. Mobile Hamburger Toggle (Side Menu Trigger - 34px x 34px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden h-[34px] w-[34px] min-w-[34px] rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-center cursor-pointer shadow-2xs shrink-0 transition-transform active:scale-95"
              aria-label={isAr ? 'فتح القائمة الجانبية' : 'Toggle navigation menu'}
              title={isAr ? 'القائمة الجانبية' : 'Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-amber-950" /> : <Menu className="w-4 h-4 text-amber-950" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-slate-100 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
            {/* Mobile Language & Direction Switcher */}
            <div className="mb-3">
              <LanguageToggle variant="expanded" />
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  type="button"
                  className={`w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    link.isOffers
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-950 font-bold border border-amber-200'
                      : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isOffers && <Flame className="w-4 h-4 text-amber-600 animate-pulse" />}
                    <span>{link.label}</span>
                  </span>
                  {link.isOffers && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                      {isAr ? 'تخفيضات 33%' : '33% OFF'}
                    </span>
                  )}
                </button>
              ))}

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('dashboard');
                    }}
                    type="button"
                    className="w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{isAr ? 'لوحة التحكم والطلبات' : 'Customer Dashboard'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    type="button"
                    className="w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                    <span>{isAr ? 'لوحة تحكم الإدارة (RBAC)' : 'Admin Dashboard'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    type="button"
                    className="w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                    <span>{isAr ? 'لوحة تحكم الإدارة (RBAC)' : 'Admin Dashboard'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    type="button"
                    className="w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{isAr ? 'تسجيل الدخول / حساب جديد' : 'Sign In / Sign Up'}</span>
                  </button>
                </>
              )}

              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCustomizer();
                  }}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-sky-600 text-white shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('hero.ctaPrimary')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};
