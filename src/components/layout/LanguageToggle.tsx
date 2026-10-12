import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

interface LanguageToggleProps {
  /**
   * 'segmented': Sleek dual-pill toggle showing both languages side-by-side
   * 'compact': Minimal button showing the alternative language to switch to
   * 'expanded': Full-width selector suitable for mobile drawers
   */
  variant?: 'segmented' | 'compact' | 'expanded';
  className?: string;
  showIcon?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'segmented',
  className = '',
  showIcon = true,
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'ar').startsWith('en') ? 'en' : 'ar';
  const isArabic = currentLang === 'ar';

  const switchLanguage = (newLang: 'ar' | 'en') => {
    if (newLang === currentLang) return;
    
    i18n.changeLanguage(newLang);
    // Explicitly guarantee DOM direction and language update immediately
    const nextDir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = nextDir;
    document.documentElement.lang = newLang;
    
    try {
      localStorage.setItem('i18nextLng', newLang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    switchLanguage(isArabic ? 'en' : 'ar');
  };

  // Compact Variant (Single button that flips language on click)
  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        type="button"
        className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white/90 hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-purple-700 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${className}`}
        title={isArabic ? 'Switch interface to English (LTR)' : 'تحويل الواجهة إلى العربية (RTL)'}
        aria-label={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
      >
        {showIcon && (
          <Globe className="w-3.5 h-3.5 text-purple-600 group-hover:rotate-45 transition-transform duration-300" />
        )}
        <span className="tracking-wide">
          {isArabic ? (
            <span className="flex items-center gap-1">
              <span className="text-purple-700 font-bold">EN</span>
              <span className="text-[10px] text-slate-400 font-normal">LTR</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="text-purple-700 font-bold">عربي</span>
              <span className="text-[10px] text-slate-400 font-normal">RTL</span>
            </span>
          )}
        </span>
      </button>
    );
  }

  // Expanded Variant (Mobile menu full-width switcher with active badges)
  if (variant === 'expanded') {
    return (
      <div className={`w-full bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 flex flex-col gap-1.5 ${className}`}>
        <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            <span>{isArabic ? 'لغة الواجهة والاتجاه' : 'Language & Layout Direction'}</span>
          </span>
          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
            {isArabic ? 'RTL راست' : 'LTR Left-to-Right'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Language selection">
          {/* Arabic Option */}
          <button
            type="button"
            onClick={() => switchLanguage('ar')}
            role="radio"
            aria-checked={isArabic}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isArabic
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center text-[11px] font-black">
                ع
              </span>
              <div className="text-start">
                <p className="font-bold text-slate-900 leading-tight">العربية</p>
                <p className="text-[10px] text-slate-400 font-normal">RTL (من اليمين لليسار)</p>
              </div>
            </div>
            {isArabic && <Check className="w-4 h-4 text-purple-600" />}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => switchLanguage('en')}
            role="radio"
            aria-checked={!isArabic}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              !isArabic
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-800 flex items-center justify-center text-[11px] font-black">
                EN
              </span>
              <div className="text-start">
                <p className="font-bold text-slate-900 leading-tight">English</p>
                <p className="text-[10px] text-slate-400 font-normal">LTR (Left-to-Right)</p>
              </div>
            </div>
            {!isArabic && <Check className="w-4 h-4 text-purple-600" />}
          </button>
        </div>
      </div>
    );
  }

  // Segmented Pill Variant (Default for Desktop Navbar)
  return (
    <div
      className={`relative inline-flex items-center bg-slate-100/90 hover:bg-slate-200/70 p-0.5 rounded-xl border border-slate-200/90 shadow-2xs transition-colors ${className}`}
      role="radiogroup"
      aria-label="Language and direction switch"
    >
      {/* Arabic Button */}
      <button
        type="button"
        onClick={() => switchLanguage('ar')}
        role="radio"
        aria-checked={isArabic}
        className={`relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
          isArabic
            ? 'bg-white text-purple-900 shadow-xs border border-purple-100 font-black'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="التحويل إلى اللغة العربية (اتجاه RTL)"
      >
        {showIcon && isArabic && (
          <Globe className="w-3 h-3 text-purple-600 animate-pulse" />
        )}
        <span>عربي</span>
      </button>

      {/* English Button */}
      <button
        type="button"
        onClick={() => switchLanguage('en')}
        role="radio"
        aria-checked={!isArabic}
        className={`relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
          !isArabic
            ? 'bg-white text-purple-900 shadow-xs border border-purple-100 font-black'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Switch to English (LTR layout)"
      >
        {showIcon && !isArabic && (
          <Globe className="w-3 h-3 text-purple-600 animate-pulse" />
        )}
        <span>EN</span>
      </button>
    </div>
  );
};
