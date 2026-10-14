import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Menu, X, Sparkles, User, LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { LanguageToggle } from './LanguageToggle';

interface NavbarProps {
  onOpenCustomizer: (productId?: string) => void;
  currentView: 'home' | 'shop' | 'product' | 'checkout' | 'order-confirmation' | 'dashboard' | 'admin';
  onNavigate: (view: 'home' | 'shop' | 'dashboard' | 'admin') => void;
  onOpenAuthModal: () => void;
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

  const { setIsOpen: setCartOpen, getTotalItemsCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const totalCartCount = getTotalItemsCount();

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
    { href: '#categories', label: isAr ? 'أقسام المنتجات' : 'Categories', isShop: false },
    { href: '#shop', label: isAr ? 'المتجر والتخصيص' : 'Shop & Customize', isShop: true },
    { href: '#services', label: t('nav.services'), isShop: false },
    { href: '#portfolio', label: t('nav.portfolio'), isShop: false },
    { href: '#why-us', label: t('nav.whyUs'), isShop: false },
    { href: '#testimonials', label: t('nav.testimonials'), isShop: false },
    { href: '#contact', label: t('nav.contact'), isShop: false },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 py-3'
          : 'bg-white/80 backdrop-blur-xs py-4 border-b border-transparent'
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

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              type="button"
              className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
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
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  type="button"
                  className="flex items-center gap-2 p-1.5 pe-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute end-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scale">
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
                      className="w-full text-start px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-purple-600" />
                      <span>{isAr ? 'لوحة التحكم والطلبات' : 'Customer Dashboard'}</span>
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            {/* Customizer CTA */}
            <button
              onClick={() => onOpenCustomizer()}
              type="button"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-sky-600 text-white shadow-xs hover:from-purple-700 hover:to-sky-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.ctaPrimary')}</span>
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
    </header>
  );
};
