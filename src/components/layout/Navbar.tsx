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
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { LanguageToggle } from './LanguageToggle';

import { SpecialtyId } from '../home/SpecialtyGatewaysSection';

interface NavbarProps {
  onOpenCustomizer: (productId?: string) => void;
  currentView: 'home' | 'shop' | 'product' | 'checkout' | 'order-confirmation' | 'dashboard' | 'admin' | 'specialty';
  onNavigate: (view: 'home' | 'shop' | 'dashboard' | 'admin' | 'specialty', specialtyId?: SpecialtyId) => void;
  onOpenAuthModal: () => void;
  activeSpecialtyId?: SpecialtyId;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCustomizer,
  currentView,
  onNavigate,
  onOpenAuthModal,
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
    if (href === '#shop') {
      onNavigate('shop');
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
    { href: '#home', label: t('nav.home'), isShop: false },
    { href: '#specialties', label: isAr ? 'استوديوهات الإنتاج' : 'Production Studios', isShop: false },
    { href: '#shop', label: isAr ? 'المتجر والتخصيص' : 'Shop & Customize', isShop: true },
    { href: '#services', label: t('nav.services'), isShop: false },
    { href: '#portfolio', label: t('nav.portfolio'), isShop: false },
    { href: '#why-us', label: t('nav.whyUs'), isShop: false },
    { href: '#testimonials', label: t('nav.testimonials'), isShop: false },
    { href: '#contact', label: t('nav.contact'), isShop: false },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 transition-all duration-300">
      {/* Slim, Dismissible Promotional Banner (Top of Navbar) */}
      {isPromoBannerVisible && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-amber-200 border-b border-amber-500/25 px-3 py-1.5 transition-all text-[11px] sm:text-xs shadow-xs select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Offer Highlight */}
            <div className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30 text-[10px] shrink-0">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>{isAr ? 'عروض الموسم' : 'Seasonal Sale'}</span>
              </span>

              <p className="truncate font-medium text-slate-200">
                {isAr ? (
                  <>
                    <strong className="text-amber-300 font-bold">خصم يصل إلى 25%</strong> على علب الكرتون الفاخرة وكروت البصمة +{' '}
                    <span className="text-emerald-300 font-semibold">شحن مجاني لكافة المحافظات</span> للطلبات فوق 150,000 د.ع
                  </>
                ) : (
                  <>
                    <strong className="text-amber-300 font-bold">Up to 25% off</strong> luxury rigid boxes & foil cards +{' '}
                    <span className="text-emerald-300 font-semibold">Free nationwide delivery</span> on orders over 150,000 IQD!
                  </>
                )}
              </p>

              <button
                type="button"
                onClick={() => {
                  if (currentView !== 'shop') {
                    onNavigate('shop');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden md:inline-flex items-center gap-1 text-amber-300 hover:text-white font-bold transition-colors underline underline-offset-2 shrink-0 cursor-pointer ms-1.5"
              >
                <span>{isAr ? 'استكشف الخصومات' : 'Explore Offers'}</span>
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

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                type="button"
                className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                  (link.isShop && currentView === 'shop') || (!link.isShop && currentView === 'home' && link.href === '#home')
                    ? 'text-purple-700 font-bold after:w-full after:h-0.5 after:bg-purple-600 after:absolute after:bottom-0 after:start-0'
                    : 'text-slate-600 hover:text-purple-700 hover:after:w-full after:w-0 after:h-0.5 after:bg-purple-600 after:absolute after:bottom-0 after:start-0 after:transition-all after:duration-200'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language & Direction Toggle (RTL / LTR) */}
            <LanguageToggle variant="segmented" />

            {/* Notification Bell Button (واشعار في أعلى حساب للتنبيه) */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationMenuOpen(!notificationMenuOpen);
                  if (userMenuOpen) setUserMenuOpen(false);
                }}
                type="button"
                className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                  pendingProofsCount > 0
                    ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                aria-label={isAr ? 'التنبيهات وبروفات التصاميم' : 'Design Proof Notifications'}
                title={isAr ? 'بروفات التصاميم والتنبيهات' : 'Notifications'}
              >
                <Bell className={`w-5 h-5 ${pendingProofsCount > 0 ? 'text-amber-700' : 'text-slate-700'}`} />
                {pendingProofsCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow-xs">
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

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              type="button"
              className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-purple-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-scale">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Auth / Customer Account Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    if (notificationMenuOpen) setNotificationMenuOpen(false);
                  }}
                  type="button"
                  className="flex items-center gap-2 p-1.5 pe-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-900 text-white flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                  {pendingProofsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            {/* Request Design CTA */}
            <button
              onClick={() => onOpenCustomizer()}
              type="button"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-900 hover:bg-amber-800 text-white shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'طلب وتجهيز تصميم 🎨' : 'Request Custom Design 🎨'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                  className="w-full text-start px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  {link.label}
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
