import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronUp,
  ChevronDown,
  Search,
  X,
  Pin,
  Check,
  Coins,
} from 'lucide-react';
import {
  useCurrencyStore,
  SYSTEM_CURRENCIES,
  CurrencyCode,
  CurrencyItem,
  IQD_BASE_RATE_AGAINST_USD,
} from '../../store/useCurrencyStore';

interface CurrencyToggleProps {
  /**
   * 'single': Compact navbar trigger button with full popup modal (matching user screenshot)
   * 'expanded': Inline embedded selector for mobile drawer
   */
  variant?: 'single' | 'expanded';
  className?: string;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  variant = 'single',
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isAr = (i18n.language || 'ar').startsWith('ar');
  const { currency, setCurrency, getCurrencyInfo } = useCurrencyStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const activeCurrencyInfo = getCurrencyInfo();

  // Filter currencies by search query
  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SYSTEM_CURRENCIES;
    return SYSTEM_CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.countryAr.toLowerCase().includes(q) ||
        c.countryEn.toLowerCase().includes(q) ||
        c.symbolAr.toLowerCase().includes(q) ||
        c.symbolEn.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Handle clicking outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Helper to format rate note relative to USD exactly like the screenshot
  const formatRateString = (c: CurrencyItem) => {
    if (c.code === 'USD') return '1 USD ≈ 1.0 $';
    const symbol = isAr ? c.symbolAr : c.symbolEn;
    const formattedRate =
      c.code === 'IQD'
        ? c.rateAgainstUSD.toLocaleString()
        : c.rateAgainstUSD < 1
        ? c.rateAgainstUSD.toFixed(3)
        : c.rateAgainstUSD.toFixed(2);
    return `1 USD ≈ ${formattedRate} ${symbol}`;
  };

  // -------------------------------------------------------------
  // Expanded Variant (for Mobile Menu Drawer)
  // -------------------------------------------------------------
  if (variant === 'expanded') {
    return (
      <div className={`w-full bg-slate-50 p-3 rounded-2xl border border-slate-200/90 space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'العملة المعتمدة' : 'Active Currency'}</span>
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 bg-amber-100/70 px-2 py-0.5 rounded-lg border border-amber-300/60"
          >
            <span>{activeCurrencyInfo.flag}</span>
            <span>{activeCurrencyInfo.code}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Quick popular currencies row */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {SYSTEM_CURRENCIES.slice(0, 4).map((c) => {
            const isSelected = c.code === currency;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setCurrency(c.code)}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{c.flag}</span>
                <span className="font-mono">{c.code}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-50/50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>{isAr ? 'عرض كافة العملات (14 عملة)...' : 'View all 14 currencies...'}</span>
          <span className="text-amber-700 text-xs font-mono">1 USD ≈ {IQD_BASE_RATE_AGAINST_USD} د.ع</span>
        </button>

        {/* Renders the full modal if opened from mobile as well */}
        {isOpen && renderModal()}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Single Compact Navbar Trigger (Matching user's screenshot exactly!)
  // Shrunk to be small: [ ⌃ USD 🇺🇸 ] with warm border and clean style
  // -------------------------------------------------------------
  function renderTrigger() {
    return (
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`group relative inline-flex items-center justify-center gap-1.5 h-[32px] sm:h-[34px] px-2 sm:px-2.5 rounded-xl border transition-all duration-200 cursor-pointer select-none shrink-0 ${
          isOpen
            ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs ring-2 ring-amber-400/30'
            : 'bg-white hover:bg-amber-50/40 border-slate-200/90 hover:border-amber-400/80 text-slate-800 shadow-2xs hover:shadow-xs'
        } ${className}`}
        title={
          isAr
            ? `العملة الحالية: ${activeCurrencyInfo.nameAr} (${activeCurrencyInfo.code}) - انقر لتغيير العملة`
            : `Active Currency: ${activeCurrencyInfo.nameEn} (${activeCurrencyInfo.code}) - Click to switch`
        }
        aria-label={isAr ? 'تبديل العملة' : 'Switch Currency'}
        aria-expanded={isOpen}
      >
        {/* Chevron icon (up when open, down when closed) */}
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-amber-700 transition-transform" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-700 transition-transform" />
        )}

        {/* Currency Code (e.g. USD) */}
        <span className="text-xs font-black tracking-tight font-mono text-slate-900 group-hover:text-amber-950">
          {activeCurrencyInfo.code}
        </span>

        {/* Country Flag (e.g. 🇺🇸) */}
        <span className="text-sm leading-none shrink-0 drop-shadow-2xs">
          {activeCurrencyInfo.flag}
        </span>
      </button>
    );
  }

  // -------------------------------------------------------------
  // The Complete Currency Selector Modal (Exact replica of user screenshot)
  // -------------------------------------------------------------
  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in pt-16 sm:pt-4 overflow-y-auto">
        <div
          ref={modalRef}
          className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-scale my-auto"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Top Header Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-amber-50/60 to-white border-b border-slate-100 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  {isAr ? 'العملات المعتمدة في النظام' : 'System Supported Currencies'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black font-mono border border-amber-300/60">
                  {SYSTEM_CURRENCIES.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                {isAr
                  ? 'انقر على أي عملة لتثبيتها في الأعلى وتطبيق أسعارها'
                  : 'Click any currency to pin it and apply real-time exchange rates'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-8 h-8 rounded-full bg-amber-100/90 text-amber-800 flex items-center justify-center border border-amber-300/70 shadow-2xs">
                <Pin className="w-4 h-4 fill-amber-700 text-amber-800" />
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4 max-h-[calc(85vh-90px)] overflow-y-auto">
            {/* Currently Pinned / Active Currency Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-300/80 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none shrink-0 drop-shadow-sm">
                  {activeCurrencyInfo.flag}
                </span>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-amber-700 text-amber-700" />
                    <span>{isAr ? 'العملة المثبتة حالياً' : 'Currently Pinned'}</span>
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                    {isAr ? activeCurrencyInfo.nameAr : activeCurrencyInfo.nameEn} ({activeCurrencyInfo.code})
                  </h4>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1 shrink-0 border border-emerald-300">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{isAr ? 'نشطة' : 'Active'}</span>
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن عملة أو بلد أو رمز...' : 'Search by currency, country, or code...'}
                className="w-full ps-10 pe-9 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
              />
              <Search className={`w-4 h-4 text-slate-400 absolute top-3 ${isAr ? 'start-3.5' : 'start-3.5'}`} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-2.5 end-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Currency List */}
            <div className="space-y-2">
              {filteredCurrencies.map((c) => {
                const isActive = c.code === currency;
                const symbol = isAr ? c.symbolAr : c.symbolEn;
                const rateText = formatRateString(c);

                return (
                  <div
                    key={c.code}
                    onClick={() => handleSelect(c.code)}
                    className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/50 shadow-xs'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Left in RTL: Symbol & Pin Action Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isActive ? (
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-black shadow-xs flex items-center gap-1 pointer-events-none"
                        >
                          <Pin className="w-3 h-3 fill-white" />
                          <span>{isAr ? 'مثبتة' : 'Pinned'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(c.code);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100/70 text-slate-600 hover:text-amber-950 text-xs font-bold border border-slate-200 hover:border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Pin className="w-3 h-3 text-slate-400" />
                          <span>{isAr ? 'تثبيت' : 'Pin'}</span>
                        </button>
                      )}

                      {/* Currency Symbol pill */}
                      <span className="min-w-8 text-center px-2 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black font-mono border border-slate-200/70">
                        {symbol}
                      </span>
                    </div>

                    {/* Right in RTL: Flag + Title + Code + Rate */}
                    <div className="flex items-center gap-3 text-end min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            {isAr ? c.nameAr : c.nameEn}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-black font-mono">
                            {c.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate font-mono">
                          {isAr ? c.countryAr : c.countryEn} • {rateText}
                        </p>
                      </div>

                      <span className="text-2xl sm:text-3xl leading-none shrink-0 drop-shadow-2xs">
                        {c.flag}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredCurrencies.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-xs font-semibold">
                    {isAr ? 'لم يتم العثور على أي عملة مطابقة' : 'No matching currencies found'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {renderTrigger()}
      {isOpen && renderModal()}
    </>
  );
};
