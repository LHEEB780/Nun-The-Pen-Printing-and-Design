import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Globe,
  Lightbulb,
  Building2,
  Scale,
  Stethoscope,
  Crown,
  Coffee,
  Cpu,
  RotateCcw,
} from 'lucide-react';

export interface InteractiveAcrylicPlaqueProps {
  mainTitle?: string;
  subtitle?: string;
  phone?: string;
  website?: string;
  emblemId?: string;
  logoUrl?: string | null;
  ledColorHex?: string;
  isLit?: boolean;
  fontFamily?: string;
  dimensionLabel?: string;
  standType?: 'white' | 'black' | 'wood';
  viewMode?: 'desk' | 'wall';
  onToggleLight?: () => void;
  onResetToTemplate?: () => void;
  isCustomized?: boolean;
  className?: string;
}

// Master-crafted Aviation & Globe travel logo with photorealistic laser-etched lines
export const AviationGlobeIcon: React.FC<{ className?: string; color?: string; isLit?: boolean }> = ({
  className = 'w-24 h-16 sm:w-28 sm:h-20',
  color = '#38bdf8',
  isLit = true,
}) => {
  const strokeColor = isLit ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
  const glowStyle = isLit
    ? {
        filter: `drop-shadow(0 0 1px #ffffff) drop-shadow(0 0 4px ${color}) drop-shadow(0 0 14px ${color}) drop-shadow(0 0 28px ${color}bb)`,
      }
    : {
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
      };

  return (
    <svg
      viewBox="0 0 180 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glowStyle}
    >
      {/* Globe wireframe */}
      <circle
        cx="115"
        cy="52"
        r="36"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeDasharray="4 2"
        className="opacity-95"
      />
      <ellipse cx="115" cy="52" rx="19" ry="36" stroke={strokeColor} strokeWidth="2.2" opacity="0.9" />
      <line x1="79" y1="52" x2="151" y2="52" stroke={strokeColor} strokeWidth="2.2" opacity="0.9" />
      <path
        d="M 83 36 Q 115 44 147 36"
        stroke={strokeColor}
        strokeWidth="1.9"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M 83 68 Q 115 60 147 68"
        stroke={strokeColor}
        strokeWidth="1.9"
        fill="none"
        opacity="0.8"
      />

      {/* Flight Trajectory Arc */}
      <path
        d="M 18 84 C 36 76, 68 54, 106 30 C 122 18, 142 14, 158 12"
        stroke={strokeColor}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="6 3"
        opacity="0.95"
      />

      {/* Supersonic Jet Airplane */}
      <g transform="translate(68, 20) rotate(-26) scale(0.95)">
        <path
          d="M 28 0 L 38 10 L 22 14 L 32 32 L 25 33 L 13 18 L 3 20 L 7 28 L 1 29 L -4 20 L -18 22 L -8 13 L -24 9 L -21 5 L -4 5 L 8 0 Z"
          fill={strokeColor}
          fillOpacity={isLit ? '0.95' : '0.7'}
          stroke={strokeColor}
          strokeWidth="1.6"
        />
      </g>
    </svg>
  );
};

export const InteractiveAcrylicPlaque: React.FC<InteractiveAcrylicPlaqueProps> = ({
  mainTitle = 'شركة الأفق الدولية',
  subtitle = 'للسياحة والسفر',
  phone = '+964 780 123 4567',
  website = 'www.alufuq.travel',
  emblemId = 'aviation_travel',
  logoUrl = null,
  ledColorHex = '#38bdf8',
  isLit = true,
  fontFamily = "'Aref Ruqaa', 'Amiri', 'Cairo', serif",
  dimensionLabel = '22 × 19 سم',
  standType = 'white',
  onToggleLight,
  onResetToTemplate,
  isCustomized = false,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const glowHex = ledColorHex;
  const isWhiteLed =
    glowHex.toLowerCase() === '#f8fafc' ||
    glowHex.toLowerCase() === '#ffffff' ||
    glowHex.toLowerCase() === '#fefcf9';

  // Multi-stop incandescent laser-etched neon glow shader
  const textGlowStyle: React.CSSProperties = isLit
    ? {
        color: '#ffffff',
        textShadow: isWhiteLed
          ? '0 0 2px #ffffff, 0 0 6px #ffffff, 0 0 15px #e2e8f0, 0 0 30px #cbd5e1, 0 0 60px #94a3b8'
          : `0 0 1px #ffffff, 0 0 3px #ffffff, 0 0 6px #ffffff, 0 0 12px ${glowHex}, 0 0 24px ${glowHex}, 0 0 45px ${glowHex}, 0 0 75px ${glowHex}`,
        filter: isWhiteLed
          ? 'drop-shadow(0 0 3px rgba(255,255,255,0.95))'
          : `drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 10px ${glowHex})`,
      }
    : {
        color: 'rgba(255, 255, 255, 0.7)',
        textShadow: '0 1px 3px rgba(0,0,0,0.85)',
        filter: 'none',
      };

  const subtitleGlowStyle: React.CSSProperties = isLit
    ? {
        color: isWhiteLed ? '#ffffff' : '#ffffff',
        textShadow: `0 0 2px #ffffff, 0 0 8px ${glowHex}, 0 0 20px ${glowHex}`,
      }
    : {
        color: 'rgba(255, 255, 255, 0.65)',
        textShadow: 'none',
      };

  const iconFilter = isLit
    ? isWhiteLed
      ? 'drop-shadow(0 0 3px #ffffff) drop-shadow(0 0 10px #e2e8f0)'
      : `drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 8px ${glowHex}) drop-shadow(0 0 20px ${glowHex})`
    : 'none';

  // Render emblem with high-intensity laser neon
  const renderEmblem = () => {
    if (logoUrl) {
      return (
        <div
          className="relative max-h-16 max-w-28 flex items-center justify-center p-1 rounded-xl transition-all"
          style={{
            filter: isLit
              ? `drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 14px ${glowHex}) drop-shadow(0 0 28px ${glowHex}90)`
              : 'none',
          }}
        >
          <img
            src={logoUrl}
            alt="Custom Client Logo"
            className="max-h-14 max-w-28 object-contain brightness-125 contrast-125"
          />
        </div>
      );
    }

    switch (emblemId) {
      case 'aviation_travel':
        return <AviationGlobeIcon isLit={isLit} color={glowHex} className="w-24 h-16 sm:w-28 sm:h-20" />;
      case 'legal':
        return (
          <div className="p-2 rounded-2xl flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Scale className="w-12 h-12 sm:w-14 sm:h-14 transition-all" style={{ color: isLit ? '#ffffff' : '#cbd5e1' }} />
          </div>
        );
      case 'medical':
        return (
          <div className="p-2 rounded-2xl flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Stethoscope className="w-12 h-12 sm:w-14 sm:h-14" style={{ color: isLit ? '#ffffff' : '#cbd5e1' }} />
          </div>
        );
      case 'corporate':
        return (
          <div className="p-2 rounded-2xl flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Building2 className="w-12 h-12 sm:w-14 sm:h-14" style={{ color: isLit ? '#ffffff' : '#cbd5e1' }} />
          </div>
        );
      case 'crown':
      case 'royal':
        return (
          <div className="p-2 rounded-2xl flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Crown className="w-12 h-12 sm:w-14 sm:h-14" style={{ color: isLit ? '#ffffff' : '#cbd5e1' }} />
          </div>
        );
      case 'cafe':
        return (
          <div className="p-2 rounded-2xl flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Coffee className="w-12 h-12 sm:w-14 sm:h-14" style={{ color: isLit ? '#ffffff' : '#cbd5e1' }} />
          </div>
        );
      case 'tech':
        return (
          <div className="p-2 rounded-2xl flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <Cpu className="w-12 h-12 sm:w-14 sm:h-14" style={{ color: isLit ? '#ffffff' : '#cbd5e1' }} />
          </div>
        );
      case 'water_drop':
      case 'water':
        return (
          <div className="p-2 rounded-2xl flex items-center justify-center transition-all" style={{ filter: iconFilter }}>
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 sm:w-16 sm:h-16"
            >
              {/* Laser water droplet outer contour */}
              <path
                d="M 50 14 C 44 26, 26 50, 26 64 C 26 78, 37 88, 50 88 C 63 88, 74 78, 74 64 C 74 50, 56 26, 50 14 Z"
                stroke={isLit ? '#ffffff' : '#cbd5e1'}
                strokeWidth="2.5"
                fill={isLit ? `${glowHex}25` : 'transparent'}
              />
              {/* Inner water reflection arc */}
              <path
                d="M 38 58 C 36 65, 41 76, 48 80"
                stroke={isLit ? '#ffffff' : '#cbd5e1'}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Concentric ripple rings */}
              <ellipse
                cx="50"
                cy="86"
                rx="30"
                ry="8"
                stroke={isLit ? '#ffffff' : '#cbd5e1'}
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.8"
              />
              <circle cx="50" cy="56" r="4" fill={isLit ? '#ffffff' : '#cbd5e1'} />
            </svg>
          </div>
        );
      case 'none':
        return null;
      default:
        return <AviationGlobeIcon isLit={isLit} color={glowHex} className="w-24 h-16 sm:w-28 sm:h-20" />;
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none transition-all duration-500 rounded-3xl ${className}`}
      style={{
        // Ultra-realistic executive desk with warm golden background bokeh lights
        backgroundColor: '#170f0b',
        backgroundImage: 'url(/images/products/desk_plaque_studio_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 45%',
      }}
    >
      {/* Darkened optical vignette overlay to accentuate the glowing plaque */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/60 pointer-events-none" />

      {/* Dynamic LED Glow bleeding into the room when lit */}
      {isLit && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500 mix-blend-screen opacity-90"
          style={{
            background: `radial-gradient(circle at 50% 64%, ${glowHex}66 0%, ${glowHex}25 35%, transparent 70%)`,
          }}
        />
      )}

      {/* Top Floating Controls Bar */}
      <div className="absolute top-3.5 inset-x-3.5 z-30 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Toggle Lighting Button */}
        {onToggleLight && (
          <button
            onClick={onToggleLight}
            type="button"
            className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-lg border border-white/15 hover:border-amber-400/50 hover:bg-slate-900 transition-all cursor-pointer"
          >
            <Lightbulb
              className={`w-3.5 h-3.5 transition-colors ${
                isLit ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-400'
              }`}
            />
            <span className="text-[11px] sm:text-xs">
              {isLit
                ? isAr
                  ? 'الإضاءة: مشتعلة'
                  : 'LED: ON'
                : isAr
                ? 'الإضاءة: مطفأة'
                : 'LED: OFF'}
            </span>
          </button>
        )}

        {/* Status / Reset Pill */}
        <div className="flex items-center gap-1.5 ms-auto">
          {isCustomized && onResetToTemplate && (
            <button
              onClick={onResetToTemplate}
              type="button"
              className="px-3 py-1.5 rounded-full bg-purple-950/85 hover:bg-purple-900 text-purple-200 text-[11px] font-bold flex items-center gap-1.5 border border-purple-400/40 backdrop-blur-md shadow-md transition-all cursor-pointer active:scale-95"
              title={isAr ? 'الرجوع إلى نموذج شركة الأفق الافتراضي' : 'Reset to Al-Ufuq template'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-300" />
              <span>{isAr ? 'نموذج الأفق الأصلي' : 'Al-Ufuq Model'}</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-slate-200 text-[11px] font-mono font-bold border border-white/15">
            {dimensionLabel}
          </div>
        </div>
      </div>

      {/* ========================================================
          THE MOCKUP SCENE: REAL DESK + OPTICAL ACRYLIC SIGN
         ======================================================== */}
      <div className="relative w-full aspect-4/3 sm:aspect-16/11 flex flex-col items-center justify-end pb-3 sm:pb-6 pt-12 px-4">
        {/* LED Reflection on polished wooden desk surface right under base */}
        {isLit && (
          <div
            className="absolute bottom-2 inset-x-1/4 h-24 pointer-events-none rounded-full blur-2xl transition-all duration-300 opacity-90"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${glowHex}99 0%, ${glowHex}33 50%, transparent 80%)`,
            }}
          />
        )}

        {/* --------------------------------------------------------
            THE VERTICAL ACRYLIC GLASS PLATE
           -------------------------------------------------------- */}
        <div className="relative z-10 w-full max-w-[340px] sm:max-w-[390px] flex flex-col items-center">
          {/* ACRYLIC SLAB */}
          <div
            className="relative w-full rounded-2xl sm:rounded-3xl pt-5 pb-6 px-4 sm:px-6 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center"
            style={{
              // Pure optical cast acrylic crystal look: crystal clear, no cloudy haze
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
            {/* Top polished beveled edge intense neon refraction line */}
            {isLit && (
              <div
                className="absolute inset-x-3 top-0 h-1 rounded-full blur-[0.5px] pointer-events-none"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: `0 0 6px #ffffff, 0 0 14px ${glowHex}`,
                }}
              />
            )}

            {/* Specular glass diagonal reflection sheen */}
            <div
              className="absolute -inset-full opacity-25 pointer-events-none"
              style={{
                background: 'linear-gradient(125deg, transparent 40%, rgba(255,255,255,0.6) 48%, transparent 56%)',
              }}
            />

            {/* Beveled edge internal optical reflection lines */}
            <div className="absolute inset-x-2 top-2 h-0.5 bg-white/40 rounded-full blur-[0.5px] pointer-events-none" />
            <div className="absolute inset-y-4 start-2 w-0.5 bg-white/30 rounded-full blur-[0.5px] pointer-events-none" />
            <div className="absolute inset-y-4 end-2 w-0.5 bg-white/30 rounded-full blur-[0.5px] pointer-events-none" />

            {/* Downward light guide gradient shining up from slot */}
            {isLit && (
              <div
                className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                style={{
                  background: `linear-gradient(0deg, ${glowHex}88 0%, ${glowHex}35 40%, transparent 100%)`,
                }}
              />
            )}

            {/* ========================================================
                LASER ENGRAVED CONTENT (GLOWS WITH VIBRANT NEON)
               ======================================================== */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-2 sm:space-y-2.5">
              {/* 1. EMBLEM / LOGO */}
              <div className="transition-all transform duration-300">
                {renderEmblem()}
              </div>

              {/* 2. MAIN TITLE (Calligraphic Royal Arabic or English) */}
              <div className="w-full px-2">
                <h3
                  className="text-2xl sm:text-3xl font-bold tracking-normal leading-tight transition-all duration-200"
                  style={{
                    fontFamily,
                    ...textGlowStyle,
                  }}
                >
                  {mainTitle || (isAr ? 'شركة الأفق الدولية' : 'Al-Ufuq International')}
                </h3>
              </div>

              {/* 3. SUBTITLE / BUSINESS LINE */}
              {subtitle && (
                <div className="w-full px-4">
                  <p
                    className="text-xs sm:text-sm font-bold tracking-wide transition-all duration-200"
                    style={{
                      fontFamily,
                      ...subtitleGlowStyle,
                    }}
                  >
                    {subtitle}
                  </p>
                </div>
              )}

              {/* Laser ornamental separator rule */}
              <div
                className="w-28 h-0.5 my-1 rounded-full transition-all"
                style={{
                  background: isLit
                    ? `linear-gradient(90deg, transparent 0%, #ffffff 30%, ${glowHex} 50%, #ffffff 70%, transparent 100%)`
                    : 'rgba(255,255,255,0.25)',
                  boxShadow: isLit ? `0 0 10px ${glowHex}` : 'none',
                }}
              />

              {/* 4. CONTACT DETAILS */}
              <div
                className="flex flex-col items-center justify-center gap-1 text-[11px] sm:text-xs font-mono font-bold tracking-normal transition-all"
                style={{
                  color: isLit ? '#ffffff' : 'rgba(255,255,255,0.75)',
                  textShadow: isLit
                    ? `0 0 3px #ffffff, 0 0 10px ${glowHex}`
                    : 'none',
                }}
              >
                {phone && (
                  <div className="flex items-center gap-1.5 direction-ltr">
                    <Phone
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                      style={{ color: isLit ? '#ffffff' : '#cbd5e1', filter: isLit ? `drop-shadow(0 0 4px ${glowHex})` : 'none' }}
                    />
                    <span>{phone}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center gap-1.5 direction-ltr">
                    <Globe
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                      style={{ color: isLit ? '#ffffff' : '#cbd5e1', filter: isLit ? `drop-shadow(0 0 4px ${glowHex})` : 'none' }}
                    />
                    <span>{website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom edge insertion refraction */}
            <div
              className="absolute inset-x-0 bottom-0 h-2 pointer-events-none transition-all"
              style={{
                backgroundColor: isLit ? '#ffffff' : 'rgba(255,255,255,0.5)',
                boxShadow: isLit
                  ? `0 -2px 14px ${glowHex}, 0 -6px 28px ${glowHex}`
                  : 'none',
              }}
            />
          </div>

          {/* --------------------------------------------------------
              THE WHITE SLEEK LED STAND BASE
             -------------------------------------------------------- */}
          <div className="relative w-[92%] sm:w-[94%] -mt-1 z-20 flex flex-col items-center">
            {/* Base Slot Collar (Where acrylic enters) */}
            <div
              className={`w-full h-3 rounded-t-xl transition-all ${
                standType === 'white'
                  ? 'bg-slate-100 border-t border-x border-slate-300'
                  : standType === 'black'
                  ? 'bg-zinc-900 border-t border-x border-zinc-700'
                  : 'bg-amber-900 border-t border-x border-amber-800'
              }`}
              style={{
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.9)',
              }}
            >
              {/* Internal glowing slot LED emitter */}
              {isLit && (
                <div
                  className="mx-auto w-3/4 h-1 rounded-full blur-[1px] transition-all"
                  style={{
                    backgroundColor: '#ffffff',
                    boxShadow: `0 0 8px #ffffff, 0 0 18px ${glowHex}, 0 0 32px ${glowHex}`,
                  }}
                />
              )}
            </div>

            {/* Main Base Body (Rounded Oval ABS Pedestal) */}
            <div
              className={`w-full h-9 sm:h-11 rounded-b-2xl sm:rounded-b-3xl flex items-center justify-center relative shadow-2xl transition-all ${
                standType === 'white'
                  ? 'bg-gradient-to-b from-white via-slate-100 to-slate-200 text-slate-700 border border-slate-200'
                  : standType === 'black'
                  ? 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black text-slate-300 border border-zinc-800'
                  : 'bg-gradient-to-b from-amber-800 via-yellow-950 to-stone-900 text-amber-200 border border-amber-900'
              }`}
              style={{
                boxShadow: isLit
                  ? `0 15px 35px -5px rgba(0,0,0,0.85), 0 0 28px -4px ${glowHex}55`
                  : '0 12px 30px -5px rgba(0,0,0,0.85)',
              }}
            >
              {/* Capacitive Touch Sensor icon on front of base */}
              <div className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                <div
                  className="w-2.5 h-2.5 rounded-full border border-current flex items-center justify-center"
                  style={{
                    boxShadow: isLit ? `0 0 6px ${glowHex}` : 'none',
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
                <span className="text-[9px] font-sans tracking-widest uppercase">TOUCH</span>
              </div>

              {/* Edge rim highlight on base */}
              <div className="absolute inset-x-4 bottom-1 h-0.5 bg-black/20 rounded-full blur-[0.5px]" />
            </div>

            {/* Base Drop Shadow on Wooden Table */}
            <div
              className="w-4/5 h-4 -mt-1 rounded-full blur-md pointer-events-none"
              style={{
                backgroundColor: 'rgba(0,0,0,0.95)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
