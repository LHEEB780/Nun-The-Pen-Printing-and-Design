import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

interface LanguageToggleProps {
  /**
   * 'single': (Default) Single sleek button displaying the opposite language to switch to
   * 'compact': Minimal icon/pill format
   * 'expanded': Full-width selector for mobile drawer
   * 'segmented': Backward-compatible legacy option fallback
   */
  variant?: 'single' | 'compact' | 'segmented' | 'expanded';
  className?: string;
  showIcon?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'single',
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

  // Expanded Variant (Mobile menu drawer)
  if (variant === 'expanded') {
    return (
      <div className={`w-full bg-slate-100/90 p-2 rounded-2xl border border-slate-200/80 flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>{isArabic ? 'اللغة والاتجاه' : 'Language & Direction'}</span>
          </span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/60">
            {isArabic ? 'المفعلة: العربية (RTL)' : 'Active: English (LTR)'}
          </span>
        </div>

        {/* Quick 1-tap flip button showing opposite language */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-amber-50/50 border border-amber-300 text-xs font-bold text-slate-900 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-black">
              {isArabic ? 'EN' : 'ع'}
            </span>
            <div className="text-start">
              <p className="font-bold text-slate-900 leading-tight">
                {isArabic ? 'التحويل إلى English' : 'Switch to العربية'}
              </p>
              <p className="text-[10px] text-slate-400 font-normal">
                {isArabic ? 'Left-to-Right interface' : 'واجهة من اليمين إلى اليسار'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            {isArabic ? 'Switch to English' : 'تحويل للعربية'}
          </span>
        </button>
      </div>
    );
  }

  // Single Compact Opposite Language Button (Shrunk to ensure side menu and all navbar items appear cleanly):
  // When active language is Arabic -> Shows compact 'EN' with globe
  // When active language is English -> Shows compact 'عربي' with globe
  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className={`group relative inline-flex items-center justify-center gap-1 h-[34px] px-2 rounded-lg border border-slate-200/90 bg-white/95 hover:bg-slate-50 text-slate-700 hover:text-amber-950 hover:border-amber-400/80 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 shrink-0 ${className}`}
      title={isArabic ? 'Switch interface to English (LTR)' : 'تحويل الواجهة إلى العربية (RTL)'}
      aria-label={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
    >
      <Globe className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-45 transition-transform duration-300 shrink-0" />
      <span className="text-[11px] font-black tracking-tight text-slate-800 group-hover:text-amber-950">
        {isArabic ? 'EN' : 'عربي'}
      </span>
    </button>
  );
};

