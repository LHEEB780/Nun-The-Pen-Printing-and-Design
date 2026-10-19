import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Check,
  ShieldCheck,
  Layers,
  Package,
  CreditCard,
  HeartHandshake,
  Compass,
  Award,
  Flame,
} from 'lucide-react';
import { COMPANY_CONTACT } from '../../data/mockData';
import { SpecialtyId } from './SpecialtyGatewaysSection';

interface HeroSectionProps {
  onOpenCustomizer?: (productId?: string) => void;
  onSelectSpecialty?: (specialtyId: SpecialtyId) => void;
  onNavigateToOffers?: () => void;
  onNavigateToPortfolio?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCustomizer,
  onSelectSpecialty,
  onNavigateToOffers,
  onNavigateToPortfolio,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const handleSpecialtyClick = (id: SpecialtyId) => {
    if (onSelectSpecialty) {
      onSelectSpecialty(id);
    } else {
      const el = document.querySelector('#specialties');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const atelierDisciplines: Array<{
    id: SpecialtyId;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    icon: React.ElementType;
    badgeAr: string;
    badgeEn: string;
    color: string;
  }> = [
    {
      id: 'boxes',
      titleAr: 'العلب الكرتونية الفاخرة والتغليف',
      titleEn: 'Rigid Boxes & Luxury Packaging',
      descAr: 'كرتون مقوى 1200-1800 غم، ملمس مخملي، وبصمة ذهبية حرارية.',
      descEn: 'Heavy rigid greyboard, soft-touch matte & hot foil stamping.',
      icon: Package,
      badgeAr: 'علب صلبة وهدايا',
      badgeEn: 'Rigid Setup Boxes',
      color: 'hover:border-amber-400 group-hover:text-amber-800',
    },
    {
      id: 'led',
      titleAr: 'دروع ولوحات الأكريليك 3D LED',
      titleEn: '3D Optical Acrylic & LED Signs',
      descAr: 'أكريليك كاست نقي 100% مع حفر ليزري ميكروني وقواعد مضيئة.',
      descEn: 'Virgin cast optical acrylic with micro-laser scoring.',
      icon: Sparkles,
      badgeAr: 'إضاءة ودروع تكريم',
      badgeEn: 'Illuminated Trophies',
      color: 'hover:border-purple-400 group-hover:text-purple-800',
    },
    {
      id: 'cards',
      titleAr: 'كروت الأعمال والبصمة الحرارية',
      titleEn: 'Cotton Cards & Hot Foil Stamping',
      descAr: 'ورق قطني إيطالي 600-700 غم، حواف مذهبة، وضغط غائر.',
      descEn: '600gsm pure cotton, gilded edges & letterpress deboss.',
      icon: CreditCard,
      badgeAr: 'كروت قطنية ملكية',
      badgeEn: 'Fine Cotton Stationery',
      color: 'hover:border-sky-400 group-hover:text-sky-800',
    },
    {
      id: 'occasions',
      titleAr: 'الهدايا التذكارية وتوثيق المناسبات',
      titleEn: 'Keepsakes & Event Commemorations',
      descAr: 'دمج الخشب الطبيعي والأكريليك مع أرقى الخطوط العربية الأصيلة.',
      descEn: 'Harmonized natural hardwoods & classical Arabic script.',
      icon: HeartHandshake,
      badgeAr: 'زفاف وتخرج ومناسبات',
      badgeEn: 'Weddings & Milestones',
      color: 'hover:border-rose-400 group-hover:text-rose-800',
    },
  ];

  return (
    <section
      id="home"
      className="relative pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-white to-slate-50 border-b border-amber-100/60"
    >
      {/* Subtle luxury ambient lighting orbs */}
      <div
        className="absolute top-10 start-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-200/25 via-purple-100/20 to-sky-100/15 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-48 end-10 w-96 h-96 rounded-full bg-gradient-to-bl from-purple-200/20 via-amber-100/25 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left/Main Column: Brand Story & Studio Authority (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-start">
            
            {/* Atelier Kicker with Artisan Gold Badge & Seasonal Offers Direct Link */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs font-bold tracking-tight shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>
                  {isAr
                    ? 'دار نُون والقَلَم · ورشة الطباعة والتصميم الفاخر في بغداد'
                    : 'Noon & Pen Atelier · Luxury Printing & Craft Studio · Baghdad'}
                </span>
              </div>

              {onNavigateToOffers && (
                <button
                  type="button"
                  onClick={onNavigateToOffers}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400 text-amber-950 text-xs font-black shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title={isAr ? 'عرض كافة عروض وتخفيضات الموسم' : 'View Seasonal Offers & Discounts'}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>{isAr ? 'عروض الموسم والتخفيضات (خصم 33%) 🔥' : 'Seasonal Deals (33% OFF) 🔥'}</span>
                </button>
              )}
            </div>

            {/* Main Grand Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-slate-900 leading-[1.2] tracking-tight">
              {isAr ? (
                <>
                  فنون الطباعة الفاخرة،{' '}
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-purple-700 to-sky-700">
                    قص الليزر الميكروني،
                  </span>{' '}
                  والتغليف الملكي المتقن
                </>
              ) : (
                <>
                  Artisanal Printing,{' '}
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-purple-700 to-sky-700">
                    Precision Laser Optics,
                  </span>{' '}
                  & Bespoke Packaging
                </>
              )}
            </h1>

            {/* Subtitle / Value Statement */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {isAr
                ? 'وجهتك الأولى في بغداد لتصنيع علب الكرتون المقوى الفاخرة (Rigid Boxes)، دروع ولوحات الأكريليك ثلاثية الأبعاد 3D LED، كروت الأعمال القطنية المذهبة، والهدايا الملكية المخصصة بدقة متناهية.'
                : 'Baghdad’s premier atelier for bespoke rigid packaging boxes, 3D optical acrylic LED trophies, fine cotton stationery, and milestone heirloom keepsakes.'}
            </p>

            {/* Value Guarantees - Clean Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-700 font-semibold pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'قص ليزري ميكروني 0.2mm' : '0.2mm Laser Scoring'}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{isAr ? 'أكريليك كاست نقي 100%' : '100% Cast Acrylic'}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isAr ? 'كرتون مقوى 1200-1800 غم' : '1200-1800gsm Board'}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{isAr ? 'تصنيع محلي في بغداد' : 'Baghdad Handcrafted'}</span>
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2.5 max-w-xl">
              {/* Primary CTA: Explore the 4 Studios */}
              <button
                onClick={() => {
                  const el = document.querySelector('#specialties');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                type="button"
                className="w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 hover:from-amber-800 hover:to-slate-950 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Compass className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform shrink-0" />
                <span className="whitespace-nowrap">{isAr ? 'استكشف الاستوديوهات الـ 4' : 'Explore The 4 Studios'}</span>
                {isAr ? (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                )}
              </button>

              {/* Secondary Buttons Row: 2-column grid on mobile, inline on desktop */}
              <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto sm:flex sm:items-center">
                {/* Direct WhatsApp Consultation */}
                <a
                  href={`${COMPANY_CONTACT.whatsappUrl}?text=${encodeURIComponent(
                    'مرحباً استوديو نون والقلم، أود الاستفسار وطلب استشارة إنتاجية لمشروعي'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 text-white" />
                  <span className="whitespace-nowrap">{isAr ? 'استشارة واتساب' : 'WhatsApp'}</span>
                </a>

                {/* Explore Portfolio Link */}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToPortfolio) {
                      onNavigateToPortfolio();
                    } else {
                      const el = document.querySelector('#quick-links') || document.querySelector('footer');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 active:scale-[0.98] text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200/90 hover:border-slate-300 transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className="whitespace-nowrap">{isAr ? 'معرض الأعمال' : 'Portfolio'}</span>
                </button>
              </div>
            </div>

            {/* Trust Metrics Row */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-3 max-w-lg">
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">+1,500</p>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                  {isAr ? 'مشروع وقطعة منفذة في بغداد' : 'Pieces crafted in Baghdad'}
                </p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">4.9 / 5 ★</p>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                  {isAr ? 'تقييم الجودة ورضا العملاء' : 'Customer satisfaction'}
                </p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">100%</p>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                  {isAr ? 'بروفة واعتماد مجاني قبل التنفيذ' : 'Free pre-production proof'}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Prestigious Studio Disciplines Portal Card (5 Cols) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5 relative overflow-hidden">
              
              {/* Top Studio Brand Identity */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                    <img
                      src="/images/noon_walqalam_logo.png"
                      alt="شعار نُون والقَلَم"
                      className="w-full h-full object-contain filter drop-shadow-2xs"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 leading-tight">
                      {isAr ? 'استوديوهات الإنتاج المتخصصة' : 'Specialized Production Studios'}
                    </h3>
                    <p className="text-[11px] text-amber-900 font-bold mt-0.5">
                      {isAr ? 'اختر مجالك للدخول المباشر' : 'Select department to enter directly'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  {isAr ? '٤ استوديوهات' : '4 Studios'}
                </span>
              </div>

              {/* 4 Interactive Disciplines Mini-Portals (Zero products, purely department gateways) */}
              <div className="space-y-2.5">
                {atelierDisciplines.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSpecialtyClick(item.id)}
                      className="group p-3 rounded-2xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/40 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-amber-100 text-slate-700 group-hover:text-amber-900 flex items-center justify-center shrink-0 border border-slate-200 transition-colors">
                          <ItemIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-950 transition-colors truncate">
                              {isAr ? item.titleAr : item.titleEn}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {isAr ? item.descAr : item.descEn}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-900 opacity-80 group-hover:opacity-100">
                        <span className="hidden sm:inline">{isAr ? 'دخول' : 'Enter'}</span>
                        {isAr ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Atelier Commitment Notice */}
              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-[11px] text-slate-500 leading-tight">
                  {isAr
                    ? '✨ جميع النماذج والتنفيذات مصنعة داخل ورشتنا في بغداد مع ضمان الفحص والبروفة الرقمية'
                    : '✨ Manufactured in our Baghdad workshop with guaranteed digital proof approvals'}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
