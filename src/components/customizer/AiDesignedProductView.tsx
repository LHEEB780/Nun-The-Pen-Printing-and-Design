import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  ShoppingBag,
  Sliders,
  Ruler,
  Layers,
  Wand2,
  Award,
  FileCheck,
  Phone,
  Globe,
  Maximize2,
  X,
  Sun,
  Moon,
  Flame,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { ProductItem, DimensionOption, LedOption } from '../../data/mockData';
import { AviationGlobeIcon } from './InteractiveAcrylicPlaque';
import {
  Scale,
  Stethoscope,
  Building2,
  Crown,
  Coffee,
  Cpu,
} from 'lucide-react';

export interface AiProductDesign {
  refinedTitle: string;
  refinedSubtitle: string;
  industry: string;
  recommendedEmblem: string;
  calligraphyStyle: string;
  sloganAr: string;
  specs: {
    dimensions: string;
    acrylicType: string;
    etchingType: string;
    illumination: string;
    base: string;
    appliedNotes: string;
  };
  designerCritique: string;
  designScore: number;
}

export interface AiDesignedProductViewProps {
  product: ProductItem;
  aiDesignData: AiProductDesign | null;
  companyName: string;
  subtitle: string;
  phone: string;
  website: string;
  designNotes: string;
  selectedLed: LedOption;
  selectedDimension: DimensionOption;
  selectedEmblem: string;
  calligraphyFont: string;
  isLit: boolean;
  onToggleLight: () => void;
  isGeneratingAi: boolean;
  onRegenerate: () => void;
  onSwitchToInteractive: () => void;
  onAddToCart: () => void;
}

export const AiDesignedProductView: React.FC<AiDesignedProductViewProps> = ({
  product,
  aiDesignData,
  companyName,
  subtitle,
  phone,
  website,
  designNotes,
  selectedLed,
  selectedDimension,
  selectedEmblem,
  calligraphyFont,
  isLit,
  onToggleLight,
  isGeneratingAi,
  onRegenerate,
  onSwitchToInteractive,
  onAddToCart,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // Environment mode: 'studio' (rich daylight showroom desk) vs 'night' (intense dark room neon glow)
  const [ambientMode, setAmbientMode] = useState<'studio' | 'night'>('studio');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const glowHex = selectedLed.hex;
  const isWhiteLed =
    glowHex.toLowerCase() === '#f8fafc' ||
    glowHex.toLowerCase() === '#ffffff' ||
    glowHex.toLowerCase() === '#fefcf9';

  // Laser incandescent glow shader: Ultra-sharp white-hot laser core + vivid saturated chromatic perimeter
  const textGlowStyle: React.CSSProperties = isLit
    ? {
        color: '#ffffff',
        textShadow: isWhiteLed
          ? '0 0 1px #ffffff, 0 0 3px #ffffff, 0 0 8px #ffffff, 0 0 18px #e2e8f0, 0 0 36px #cbd5e1'
          : `0 0 1px #ffffff, 0 0 2px #ffffff, 0 0 5px #ffffff, 0 0 12px ${glowHex}, 0 0 24px ${glowHex}, 0 0 45px ${glowHex}, 0 0 70px ${glowHex}`,
        filter: isWhiteLed
          ? 'drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 6px rgba(255,255,255,0.9))'
          : `drop-shadow(0 0 1.5px #ffffff) drop-shadow(0 0 8px ${glowHex})`,
      }
    : {
        color: 'rgba(255, 255, 255, 0.78)',
        textShadow: '0 1px 3px rgba(0,0,0,0.85)',
        filter: 'none',
      };

  const subtitleGlowStyle: React.CSSProperties = isLit
    ? {
        color: '#ffffff',
        textShadow: `0 0 1px #ffffff, 0 0 4px #ffffff, 0 0 10px ${glowHex}, 0 0 24px ${glowHex}`,
        filter: `drop-shadow(0 0 4px ${glowHex})`,
      }
    : {
        color: 'rgba(255, 255, 255, 0.7)',
        textShadow: 'none',
      };

  const iconFilter = isLit
    ? isWhiteLed
      ? 'drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 18px #e2e8f0)'
      : `drop-shadow(0 0 1.5px #ffffff) drop-shadow(0 0 6px ${glowHex}) drop-shadow(0 0 18px ${glowHex}) drop-shadow(0 0 32px ${glowHex}90)`
    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))';

  // Determine active emblem based on AI recommendation or current emblem
  const activeEmblem = aiDesignData?.recommendedEmblem || selectedEmblem;

  const renderEmblem = (isLarge: boolean = false) => {
    const sizeClasses = isLarge
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : 'w-14 h-14 sm:w-16 sm:h-16';

    switch (activeEmblem) {
      case 'water_drop':
      case 'water':
      case 'water_beverage':
        return (
          <div className="flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={sizeClasses}
            >
              {/* Outer laser ornamental circular crest */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke={isLit ? '#ffffff' : '#cbd5e1'}
                strokeWidth="2"
                strokeDasharray="6 3"
                opacity="0.95"
              />
              <circle
                cx="60"
                cy="60"
                r="48"
                stroke={isLit ? '#ffffff' : '#cbd5e1'}
                strokeWidth="1.2"
                opacity="0.75"
              />

              {/* Water Droplet Core */}
              <path
                d="M 60 22 C 53 36, 34 60, 34 76 C 34 90, 46 100, 60 100 C 74 100, 86 90, 86 76 C 86 60, 67 36, 60 22 Z"
                stroke={isLit ? '#ffffff' : '#cbd5e1'}
                strokeWidth="2.8"
                fill={isLit ? `${glowHex}28` : 'transparent'}
              />

              {/* Internal Optical Highlight Arc */}
              <path
                d="M 46 68 C 44 76, 49 88, 58 92"
                stroke={isLit ? '#ffffff' : '#ffffff'}
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Sparkling light refraction star */}
              <path
                d="M 60 50 L 62 55 L 67 56 L 62 58 L 60 63 L 58 58 L 53 56 L 58 55 Z"
                fill={isLit ? '#ffffff' : '#cbd5e1'}
              />

              {/* Concentric ripple rings */}
              <ellipse
                cx="60"
                cy="98"
                rx="34"
                ry="9"
                stroke={isLit ? '#ffffff' : '#cbd5e1'}
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.85"
              />
            </svg>
          </div>
        );

      case 'medical':
        return (
          <div className="flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <div className="relative p-2 rounded-2xl border border-white/40">
              <Stethoscope className={`${sizeClasses} text-white`} style={{ strokeWidth: 2.2 }} />
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <div className="relative p-2 rounded-2xl border border-white/40">
              <Scale className={`${sizeClasses} text-white`} style={{ strokeWidth: 2.2 }} />
            </div>
          </div>
        );

      case 'corporate':
        return (
          <div className="flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <div className="relative p-2 rounded-2xl border border-white/40">
              <Building2 className={`${sizeClasses} text-white`} style={{ strokeWidth: 2.2 }} />
            </div>
          </div>
        );

      case 'crown':
      case 'luxury':
        return (
          <div className="flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Crown className={`${sizeClasses} text-white`} style={{ strokeWidth: 2.2 }} />
          </div>
        );

      case 'cafe':
        return (
          <div className="flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Coffee className={`${sizeClasses} text-white`} style={{ strokeWidth: 2.2 }} />
          </div>
        );

      case 'tech':
        return (
          <div className="flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Cpu className={`${sizeClasses} text-white`} style={{ strokeWidth: 2.2 }} />
          </div>
        );

      default:
        return (
          <AviationGlobeIcon
            isLit={isLit}
            color={glowHex}
            className={isLarge ? 'w-28 h-20 sm:w-36 sm:h-24' : 'w-24 h-16 sm:w-28 sm:h-20'}
          />
        );
    }
  };

  const displayTitle = aiDesignData?.refinedTitle || companyName || (isAr ? 'شركة الأفق الدولية' : 'Al-Ufuq International');
  const displaySubtitle = aiDesignData?.refinedSubtitle || subtitle || (isAr ? 'للسياحة والسفر' : 'Travel & Tourism');

  return (
    <div className="space-y-4">
      {/* ========================================================
          1. HIGH-DEFINITION REALISTIC DISPLAY PANEL
         ======================================================== */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-950 relative">
        <div
          className={`relative w-full aspect-4/3 sm:aspect-16/11 overflow-hidden select-none transition-all duration-700 ${
            ambientMode === 'night' ? 'bg-[#090b10]' : 'bg-[#18120e]'
          }`}
          style={{
            backgroundImage:
              ambientMode === 'night'
                ? 'radial-gradient(circle at 50% 65%, #151a24 0%, #07090d 100%)'
                : "url('/images/products/desk_plaque_studio_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 48%',
          }}
        >
          {/* Studio ambient natural lighting (No murky black curtain, crystal clarity preserved) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
              ambientMode === 'night'
                ? 'bg-radial from-transparent via-black/40 to-black/80'
                : 'bg-radial from-transparent via-black/10 to-black/45'
            }`}
          />

          {/* Optical floor radiance reflection on polished desk wood */}
          {isLit && (
            <div
              className="absolute bottom-[11%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[460px] h-36 pointer-events-none transition-all duration-500"
              style={{
                background: `radial-gradient(ellipse at 50% 90%, ${glowHex}cc 0%, ${glowHex}55 35%, transparent 75%)`,
                filter: 'blur(18px)',
                mixBlendMode: 'screen',
              }}
            />
          )}

          {/* Top Floating Controls Bar */}
          <div className="absolute top-3.5 inset-x-3.5 z-30 flex items-center justify-between gap-2 pointer-events-auto">
            {/* Toggle LED Light */}
            <button
              onClick={onToggleLight}
              type="button"
              className="px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-xl border border-white/20 hover:border-amber-400 hover:bg-slate-900 transition-all cursor-pointer active:scale-95"
            >
              <Lightbulb
                className={`w-3.5 h-3.5 transition-colors ${
                  isLit ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-400'
                }`}
              />
              <span className="text-[11px] sm:text-xs">
                {isLit ? (isAr ? 'الإضاءة: مشتعلة' : 'LED: ON') : (isAr ? 'الإضاءة: مطفأة' : 'LED: OFF')}
              </span>
            </button>

            {/* Middle: Day / Night Environment Toggle */}
            <div className="hidden sm:flex items-center rounded-full bg-black/75 backdrop-blur-md p-1 border border-white/15">
              <button
                type="button"
                onClick={() => setAmbientMode('studio')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  ambientMode === 'studio'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>{isAr ? 'استوديو نهاري' : 'Day Studio'}</span>
              </button>
              <button
                type="button"
                onClick={() => setAmbientMode('night')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  ambientMode === 'night'
                    ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Moon className="w-3 h-3 text-purple-300" />
                <span>{isAr ? 'إضاءة ليلية' : 'Night Glow'}</span>
              </button>
            </div>

            {/* Right: Dimension & 4K Zoom */}
            <div className="flex items-center gap-2 ms-auto">
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="px-2.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-400/30 flex items-center gap-1.5 transition-all cursor-pointer"
                title={isAr ? 'تكبير وفحص تفاصيل الحفر بدقة عالية' : 'Zoom 4K Detail'}
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">{isAr ? 'تكبير 4K' : '4K Zoom'}</span>
              </button>

              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-900/90 to-indigo-900/90 text-purple-200 text-[11px] font-extrabold border border-purple-400/60 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isAr ? 'تصميم ذكاء اصطناعي معتمد' : 'AI Verified'}</span>
              </span>
            </div>
          </div>

          {/* LOADING OVERLAY: While AI is generating */}
          {isGeneratingAi && (
            <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in fade-in duration-300">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                  <Wand2 className="w-8 h-8 text-amber-300 animate-bounce" />
                </div>
                <div
                  className="absolute -inset-2 rounded-3xl border border-purple-400/40 animate-ping pointer-events-none"
                  style={{ animationDuration: '2s' }}
                />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-base font-extrabold text-white">
                  {isAr ? 'جارٍ هندسة وبناء التصميم بالذكاء الاصطناعي...' : 'Engineering Custom AI Design...'}
                </h4>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  {isAr
                    ? 'مطابقة بيانات نشاطك، هندسة مسارات خطوط الحفر الليزرية، وتوزيع طيف إضاءة النيون بدقة فائقة...'
                    : 'Calibrating typography, vector etching paths, and LED luminous spectrum...'}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              THE BESPOKE CRYSTAL CAST ACRYLIC SLAB + WOOD BASE
             ======================================================== */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 sm:pb-6 pt-10 px-4">
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] flex flex-col items-center">
              {/* Top Specular Glint */}
              {isLit && (
                <div
                  className="absolute -top-1 w-3/4 h-1 rounded-full blur-[0.5px] pointer-events-none z-20"
                  style={{
                    backgroundColor: '#ffffff',
                    boxShadow: `0 0 8px #ffffff, 0 0 16px ${glowHex}`,
                  }}
                />
              )}

              {/* CRYSTAL ACRYLIC SLAB (100% Pure Optical Cast Clarity) */}
              <div
                className="relative w-full rounded-2xl sm:rounded-3xl pt-5 pb-6 px-4 sm:px-6 transition-all duration-500 overflow-hidden flex flex-col items-center justify-center text-center"
                style={{
                  // Ultra-clear optical acrylic: No cloudy fog blur, high specular sheen
                  background: isLit
                    ? 'linear-gradient(165deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.14) 100%)'
                    : 'linear-gradient(165deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%)',
                  borderTop: isLit ? '2.5px solid #ffffff' : '1.5px solid rgba(255,255,255,0.6)',
                  borderLeft: '1.5px solid rgba(255,255,255,0.45)',
                  borderRight: '1.5px solid rgba(255,255,255,0.45)',
                  borderBottom: 'none',
                  boxShadow: isLit
                    ? `0 -12px 35px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -6px 20px ${glowHex}80, 0 0 32px ${glowHex}80`
                    : '0 -8px 25px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.5)',
                  minHeight: '225px',
                }}
              >
                {/* 45-Degree Diamond Cut Beveled Edge White Glints */}
                <div className="absolute inset-x-2 top-2 h-0.5 bg-white/60 rounded-full blur-[0.3px] pointer-events-none" />
                <div className="absolute inset-y-4 start-2 w-0.5 bg-white/40 rounded-full blur-[0.3px] pointer-events-none" />
                <div className="absolute inset-y-4 end-2 w-0.5 bg-white/40 rounded-full blur-[0.3px] pointer-events-none" />

                {/* Diagonal Specular Sunlight Sheen */}
                <div
                  className="absolute -inset-full opacity-35 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(120deg, transparent 42%, rgba(255,255,255,0.8) 48%, transparent 54%)',
                  }}
                />

                {/* Upward LED Light Guide Spectrum from bottom slot */}
                {isLit && (
                  <div
                    className="absolute inset-x-0 bottom-0 h-32 pointer-events-none transition-all duration-500"
                    style={{
                      background: `linear-gradient(0deg, ${glowHex}95 0%, ${glowHex}40 45%, transparent 100%)`,
                    }}
                  />
                )}

                {/* ========================================================
                    PRECISION LASER ENGRAVED BRANDING CONTENT
                   ======================================================== */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-2 sm:space-y-2.5">
                  {/* 1. EMBLEM / LOGO WITH LASER INCANDESCENCE */}
                  <div className="transition-all transform duration-300">
                    {renderEmblem(false)}
                  </div>

                  {/* 2. BESPOKE MAIN TITLE */}
                  <div className="w-full px-2">
                    <h2
                      className="text-2xl sm:text-3xl md:text-[32px] font-bold tracking-normal leading-tight transition-all duration-300 select-none drop-shadow-sm"
                      style={{
                        fontFamily: calligraphyFont,
                        ...textGlowStyle,
                      }}
                      dir="rtl"
                    >
                      {displayTitle}
                    </h2>
                  </div>

                  {/* 3. SUBTITLE / BUSINESS ACTIVITY */}
                  {displaySubtitle && (
                    <div className="w-full px-3">
                      <p
                        className="text-xs sm:text-sm md:text-base font-bold tracking-wide transition-all duration-300 select-none"
                        style={{
                          fontFamily: calligraphyFont,
                          ...subtitleGlowStyle,
                        }}
                        dir="rtl"
                      >
                        {displaySubtitle}
                      </p>
                    </div>
                  )}

                  {/* Laser Ornamental Separator Bar */}
                  <div
                    className="w-32 h-0.5 my-1 rounded-full transition-all"
                    style={{
                      background: isLit
                        ? `linear-gradient(90deg, transparent 0%, #ffffff 30%, ${glowHex} 50%, #ffffff 70%, transparent 100%)`
                        : 'rgba(255,255,255,0.4)',
                      boxShadow: isLit ? `0 0 10px ${glowHex}` : 'none',
                    }}
                  />

                  {/* 4. OPTIONAL SLOGAN */}
                  {aiDesignData?.sloganAr && (
                    <p
                      className="text-[10px] sm:text-xs font-semibold text-slate-100 tracking-wider italic select-none"
                      style={subtitleGlowStyle}
                      dir="rtl"
                    >
                      "{aiDesignData.sloganAr}"
                    </p>
                  )}

                  {/* 5. CONTACT BADGES */}
                  {(phone || website) && (
                    <div
                      className="flex items-center justify-center gap-3 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider transition-all select-none flex-wrap pt-0.5"
                      style={subtitleGlowStyle}
                      dir="ltr"
                    >
                      {phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 opacity-90" />
                          <span>{phone}</span>
                        </span>
                      )}
                      {phone && website && <span className="opacity-40">|</span>}
                      {website && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5 opacity-90" />
                          <span>{website}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Laser Edge Injection Radiance Bar */}
                <div
                  className="absolute inset-x-0 bottom-0 h-2 pointer-events-none transition-all duration-500"
                  style={{
                    backgroundColor: isLit ? '#ffffff' : 'rgba(255,255,255,0.6)',
                    boxShadow: isLit
                      ? `0 -2px 14px ${glowHex}, 0 -6px 28px ${glowHex}`
                      : 'none',
                  }}
                />
              </div>

              {/* ========================================================
                  SOLID WOOD / ACRYLIC EXECUTIVE STAND BASE
                 ======================================================== */}
              <div className="relative w-[92%] sm:w-[94%] -mt-1 z-20 flex flex-col items-center">
                {/* CNC Slot Collar where acrylic is inserted */}
                <div
                  className="w-full h-3 rounded-t-xl transition-all bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-t border-x border-amber-700/60"
                  style={{
                    boxShadow: isLit
                      ? `inset 0 -2px 8px ${glowHex}90, 0 0 16px ${glowHex}60`
                      : 'inset 0 1px 3px rgba(0,0,0,0.8)',
                  }}
                >
                  {/* Internal illuminated LED strip slit */}
                  <div
                    className="mx-auto w-3/4 h-1 rounded-full transition-all"
                    style={{
                      background: isLit ? '#ffffff' : 'rgba(0,0,0,0.9)',
                      boxShadow: isLit ? `0 0 10px #ffffff, 0 0 20px ${glowHex}` : 'none',
                    }}
                  />
                </div>

                {/* Main Base Body: Solid Beech / Walnut Wood with chamfers */}
                <div
                  className="w-full h-7 sm:h-8 rounded-b-2xl bg-gradient-to-b from-[#2b170c] via-[#1d0e06] to-[#120803] border-b-2 border-x border-amber-950/80 shadow-2xl flex items-center justify-between px-4 transition-all"
                  style={{
                    boxShadow: isLit
                      ? `0 18px 30px -5px rgba(0,0,0,0.9), 0 0 20px -2px ${glowHex}40`
                      : '0 15px 25px -5px rgba(0,0,0,0.95)',
                  }}
                >
                  {/* Subtle wood texture & metallic logo plaque */}
                  <div className="flex items-center gap-1.5 opacity-75">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-xs" />
                    <span className="text-[9px] font-mono tracking-widest text-amber-200/90 uppercase font-semibold">
                      NOON & PEN
                    </span>
                  </div>

                  {/* Dimension pill */}
                  <span className="text-[9px] font-mono text-amber-300/70 font-bold">
                    {isAr ? selectedDimension.labelAr : selectedDimension.labelEn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. PRODUCT SPECIFICATIONS PANEL (مواصفات منتج الذكاء الاصطناعي)
         ======================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-purple-200/80 shadow-xl space-y-5">
        {/* Header with Title & Quality Score */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                {isAr ? 'مواصفات منتج الذكاء الاصطناعي المعتمدة' : 'AI Product Design Specifications'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'تمت هندسة وتوليد هذا المنتج خصيصاً وفقاً لبياناتك وملاحظاتك بمطبعة نون والقلم'
                  : 'Engineered specifically based on your inputs and notes'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {isAr
                ? `مطابقة التصنيع: ${aiDesignData?.designScore || 98}%`
                : `Score: ${aiDesignData?.designScore || 98}%`}
            </span>
          </div>
        </div>

        {/* 4-Card Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Dimensions */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-purple-800 text-xs font-bold">
              <Ruler className="w-3.5 h-3.5" />
              <span>{isAr ? 'المقاس الفعلي والتنفيذي:' : 'Actual Dimensions:'}</span>
            </div>
            <p className="text-xs font-bold text-slate-900">
              {aiDesignData?.specs.dimensions || (isAr ? selectedDimension.labelAr : selectedDimension.labelEn)}
            </p>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'قص ليزري بؤري بأبعاد متناسقة للسطح والمكتب' : 'Calibrated for desk presence'}
            </p>
          </div>

          {/* Card 2: Acrylic Material */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-purple-800 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'خامة الأكريليك المعتمدة:' : 'Acrylic Grade:'}</span>
            </div>
            <p className="text-xs font-bold text-slate-900">
              {aiDesignData?.specs.acrylicType ||
                (isAr ? 'أكريليك كاست كريستالي نقي 100% سماكة 5 ملم' : 'Cast Optical Acrylic 5mm')}
            </p>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'نفاذية بصرية 93% بحواف مصقولة بالألماس الميكروي' : '93% optical clarity with diamond polish'}
            </p>
          </div>

          {/* Card 3: Laser Etching */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-purple-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'تقنية الحفر الليزري:' : 'Laser Etching Technique:'}</span>
            </div>
            <p className="text-xs font-bold text-slate-900">
              {aiDesignData?.specs.etchingType ||
                (isAr ? 'حفر ليزري بؤري فائق الدقة CO2 بدقة 0.05 ملم' : 'High-precision CO2 laser 0.05mm')}
            </p>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'مقاوم للخدش والبهتان ويدوم لسنوات طويلة' : 'Fade and scratch resistant'}
            </p>
          </div>

          {/* Card 4: Illumination & Base */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-purple-800 text-xs font-bold">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{isAr ? 'نظام الإضاءة والقاعدة:' : 'Illumination & Base:'}</span>
            </div>
            <p className="text-xs font-bold text-slate-900">
              {aiDesignData?.specs.illumination ||
                (isAr ? `نيون LED بلون ${selectedLed.nameAr}` : `LED matching ${selectedLed.nameEn}`)}
            </p>
            <p className="text-[11px] text-slate-500">
              {aiDesignData?.specs.base ||
                (isAr
                  ? 'قاعدة خشب زان صلب مع مجرى CNC ومنفذ Type-C'
                  : 'Solid wood base with CNC channel & Type-C')}
            </p>
          </div>
        </div>

        {/* Applied Notes Callout */}
        <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/90 space-y-1">
          <div className="flex items-center gap-1.5 text-purple-900 text-xs font-extrabold">
            <FileCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>{isAr ? 'الملاحظات المنفذة في هذا التصميم:' : 'Notes Applied to Design:'}</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            {aiDesignData?.specs.appliedNotes ||
              (designNotes.trim()
                ? isAr
                  ? `تم تطبيق رغبتك: "${designNotes.trim()}" في التصميم بدقة هندسية متكاملة.`
                  : `Applied note: "${designNotes.trim()}" into product specs.`
                : isAr
                ? 'تمت معايرة تباعد الحروف وأبعاد الشعار لتناسب مساحة اللوحة والمقاس التنفيذي المختار بدقة فائقة.'
                : 'All layout elements calibrated to selected specifications.')}
          </p>
        </div>

        {/* AI Engineering Critique */}
        {aiDesignData?.designerCritique && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[11px] font-bold text-slate-700 block">
              {isAr ? '💬 رأي واستشارة خبير التصميم الذكي:' : '💬 AI Design Appraisal:'}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{aiDesignData.designerCritique}"
            </p>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isGeneratingAi}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة بناء التصميم برؤية جديدة' : 'Regenerate Design'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSwitchToInteractive}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-purple-200 active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isAr ? 'تعديل في اللوحة التفاعلية' : 'Edit in Interactive Plaque'}</span>
            </button>

            <button
              type="button"
              onClick={onAddToCart}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-lg active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAr ? 'اعتماد التصميم وإضافته للسلة' : 'Approve & Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. 4K ZOOM DETAIL INSPECTOR MODAL
         ======================================================== */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 text-center text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 start-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40 inline-block">
                {isAr ? '🔍 فحص دقة الحفر الليزري (4K Ultra-HD)' : '🔍 4K Laser Etch Inspector'}
              </span>
              <h3 className="text-xl font-bold">{displayTitle}</h3>
              <p className="text-xs text-slate-400">{displaySubtitle}</p>
            </div>

            {/* Close-up Macro View of the Laser Engraving */}
            <div className="relative w-full aspect-16/10 rounded-2xl bg-black border border-white/20 p-6 flex flex-col items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${glowHex}40 0%, transparent 70%)`,
                }}
              />
              <div className="relative z-10 flex flex-col items-center space-y-4">
                {renderEmblem(true)}
                <h2
                  className="text-3xl sm:text-4xl font-extrabold select-none"
                  style={{
                    fontFamily: calligraphyFont,
                    ...textGlowStyle,
                  }}
                  dir="rtl"
                >
                  {displayTitle}
                </h2>
                {displaySubtitle && (
                  <p
                    className="text-base sm:text-lg font-bold select-none"
                    style={{
                      fontFamily: calligraphyFont,
                      ...subtitleGlowStyle,
                    }}
                    dir="rtl"
                  >
                    {displaySubtitle}
                  </p>
                )}
                {(phone || website) && (
                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-white/90">
                    {phone && <span>{phone}</span>}
                    {website && <span>{website}</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{isAr ? 'دقة الليزر' : 'Precision'}</span>
                <span className="font-bold text-amber-300">0.05 mm CO2</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{isAr ? 'نقاء الأكريليك' : 'Clarity'}</span>
                <span className="font-bold text-emerald-400">99.2% Cast</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{isAr ? 'شريط الليد' : 'LED System'}</span>
                <span className="font-bold text-cyan-300">{selectedLed.nameAr}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer transition-all"
            >
              {isAr ? 'إغلاق نافذة المعاينة والعودة' : 'Close & Return'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
