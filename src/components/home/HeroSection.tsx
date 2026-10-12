import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, ChevronRight, ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';

interface HeroSectionProps {
  onOpenCustomizer: (productId?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCustomizer }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // Interactive carousel index
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLit, setIsLit] = useState(true);
  const [glowColor, setGlowColor] = useState<'amber' | 'cyan' | 'purple'>('cyan');

  // Featured items for hero spotlight
  const heroItems = [
    {
      id: PRODUCTS[0].id,
      titleAr: 'مجسم طائرة بوينغ ثلاثي الأبعاد 3D LED',
      titleEn: '3D Optical Boeing Airplane LED Lamp',
      taglineAr: 'حفر ليزري ميكروني على أكريليك شفاف نقي مع إضاءة ساحرة',
      taglineEn: 'Sub-millimeter laser engraved optical acrylic on solid beech',
      badgeAr: 'الأكثر طلباً كهدايا',
      badgeEn: 'Best Seller Gift',
      price: '35,000 د.ع',
      priceEn: '35,000 IQD',
      image: PRODUCTS[0].image,
    },
    {
      id: PRODUCTS[1].id,
      titleAr: 'لوحة استقبال مضيئة لشركات السفر والمكاتب',
      titleEn: 'Edge-Lit Executive Reception Acrylic Plaque',
      taglineAr: 'تفريغ شعار المؤسسة بدقة متناهية مع هالة إضاءة محيطية فاخرة',
      taglineEn: 'Perimeter LED glow halo with stainless standoff mounting',
      badgeAr: 'للمقرات والمكاتب',
      badgeEn: 'Corporate Identity',
      price: '65,000 د.ع',
      priceEn: '65,000 IQD',
      image: PRODUCTS[1].image,
    },
    {
      id: PRODUCTS[2].id,
      titleAr: 'لوحة توثيق مواعيد الزفاف بالخط العربي الأصيل',
      titleEn: 'Bespoke Wedding Timeline Acrylic Keepsake',
      taglineAr: 'توثيق مواعيد العمر بتذهيب ناعم وخشب زان معالج وإضاءة ليلية',
      taglineEn: 'Milestone dates engraved in delicate classical Arabic calligraphy',
      badgeAr: 'تذكار العمر',
      badgeEn: 'Cherished Keepsake',
      price: '42,000 د.ع',
      priceEn: '42,000 IQD',
      image: PRODUCTS[2].image,
    },
  ];

  const currentItem = heroItems[activeIndex];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % heroItems.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  // Color glow settings
  const glowStyles = {
    cyan: isLit ? 'shadow-[0_0_50px_rgba(56,189,248,0.35)] ring-2 ring-sky-300/60' : 'ring-1 ring-slate-200',
    amber: isLit ? 'shadow-[0_0_50px_rgba(245,158,11,0.35)] ring-2 ring-amber-300/60' : 'ring-1 ring-slate-200',
    purple: isLit ? 'shadow-[0_0_50px_rgba(168,85,247,0.35)] ring-2 ring-purple-300/60' : 'ring-1 ring-slate-200',
  };

  const glowBackdrop = {
    cyan: 'from-sky-400/20 via-sky-300/10 to-transparent',
    amber: 'from-amber-400/20 via-amber-300/10 to-transparent',
    purple: 'from-purple-400/20 via-purple-300/10 to-transparent',
  };

  return (
    <section id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-radial from-[#E6E6FA]/40 via-white to-slate-50">
      {/* Ambient background soft gradients */}
      <div
        className="absolute top-12 start-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#87CEEB]/25 to-[#E6E6FA]/40 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-48 end-10 w-80 h-80 rounded-full bg-gradient-to-bl from-purple-200/30 via-sky-100/30 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text & Content Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Kicker - clean unboxed metadata with typographic separator */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span>{t('hero.kicker')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 leading-[1.25] tracking-tight">
              {t('hero.titlePart1')}{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-sky-600">
                {t('hero.titleHighlight')}
              </span>{' '}
              {t('hero.titlePart2')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>

            {/* Value props - unboxed with clean separators */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{t('hero.badges.laser')}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t('hero.badges.uv')}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('hero.badges.local')}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{t('hero.badges.custom')}</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenCustomizer(currentItem.id)}
                type="button"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-700 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('hero.ctaPrimary')}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <a
                href="#portfolio"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-colors shadow-2xs hover:border-slate-300 flex items-center gap-2"
              >
                <span>{t('hero.ctaSecondary')}</span>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">+1,500</p>
                <p className="text-xs text-slate-500">{isAr ? 'قطعة منفذة في بغداد' : 'Pieces Fabricated'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">0.2 mm</p>
                <p className="text-xs text-slate-500">{isAr ? 'دقة الليزر الألمانية' : 'Laser Cutting Precision'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500">{isAr ? 'ضمان بروفة ورضا' : 'Customer Proof Approval'}</p>
              </div>
            </div>
          </div>

          {/* Interactive Visual Spotlight Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Product Card Container */}
              <div
                className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ${glowStyles[glowColor]}`}
              >
                {/* Image & Glow Frame */}
                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden group">
                  <img
                    src={currentItem.image}
                    alt={isAr ? currentItem.titleAr : currentItem.titleEn}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isLit ? 'opacity-95 brightness-105 contrast-105' : 'opacity-60 brightness-75'
                    }`}
                  />

                  {/* Dynamic simulated illumination overlay */}
                  {isLit && (
                    <div
                      className={`absolute inset-0 bg-radial ${glowBackdrop[glowColor]} mix-blend-screen pointer-events-none transition-all duration-500`}
                    />
                  )}

                  {/* Corner tag - unboxed styled tag */}
                  <div className="absolute top-3 start-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium rounded-md">
                    {isAr ? currentItem.badgeAr : currentItem.badgeEn}
                  </div>

                  {/* Price overlay */}
                  <div className="absolute bottom-3 end-3 px-3 py-1.5 bg-white/95 backdrop-blur-md text-slate-900 font-bold text-xs rounded-md shadow-sm">
                    {isAr ? currentItem.price : currentItem.priceEn}
                  </div>
                </div>

                {/* Interactive Lamp Controls Bar */}
                <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Light ON/OFF toggle */}
                  <button
                    onClick={() => setIsLit(!isLit)}
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isLit
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                    title={isAr ? 'تشغيل/إطفاء الإضاءة التفاعلية' : 'Toggle Lamp Illumination'}
                  >
                    <Lightbulb className={`w-3.5 h-3.5 ${isLit ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
                    <span>{isLit ? (isAr ? 'الإضاءة: مشتعلة' : 'LED: ON') : (isAr ? 'الإضاءة: مطفأة' : 'LED: OFF')}</span>
                  </button>

                  {/* LED Color selector */}
                  {isLit && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        {isAr ? 'لون النور:' : 'Tone:'}
                      </span>
                      <button
                        onClick={() => setGlowColor('cyan')}
                        type="button"
                        aria-label="Cyan LED tone"
                        className={`w-6 h-6 rounded-full bg-sky-400 border-2 transition-transform cursor-pointer ${
                          glowColor === 'cyan' ? 'border-slate-800 scale-110 shadow-sm' : 'border-white'
                        }`}
                      />
                      <button
                        onClick={() => setGlowColor('amber')}
                        type="button"
                        aria-label="Amber LED tone"
                        className={`w-6 h-6 rounded-full bg-amber-400 border-2 transition-transform cursor-pointer ${
                          glowColor === 'amber' ? 'border-slate-800 scale-110 shadow-sm' : 'border-white'
                        }`}
                      />
                      <button
                        onClick={() => setGlowColor('purple')}
                        type="button"
                        aria-label="Purple LED tone"
                        className={`w-6 h-6 rounded-full bg-purple-400 border-2 transition-transform cursor-pointer ${
                          glowColor === 'purple' ? 'border-slate-800 scale-110 shadow-sm' : 'border-white'
                        }`}
                      />
                    </div>
                  )}

                  {/* Carousel navigation controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevSlide}
                      type="button"
                      className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Previous item"
                    >
                      {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={nextSlide}
                      type="button"
                      className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Next item"
                    >
                      {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Card Info & Customizer Direct Action */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {isAr ? currentItem.titleAr : currentItem.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isAr ? currentItem.taglineAr : currentItem.taglineEn}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    {/* Slide indicator dots */}
                    <div className="flex items-center gap-1.5">
                      {heroItems.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeIndex === i ? 'w-5 bg-purple-600' : 'w-1.5 bg-slate-300'
                          }`}
                          aria-label={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => onOpenCustomizer(currentItem.id)}
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تخصيص هذا التصميم' : 'Customize This Piece'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Featured Grid: LED Acrylic Signs, Custom Gifts, Packaging & Cards */}
        <div className="mt-16 pt-10 border-t border-slate-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
                {isAr ? 'تشكيلة المنتجات الأكثر طلباً' : 'Featured Custom Craft Categories'}
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {isAr ? 'لوحات الأكريليك، الهدايا المخصصة، والعلب الفاخرة' : 'LED Acrylic Signs, Custom Keepsakes & Packaging'}
              </h2>
            </div>
            <a
              href="#shop"
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 hover:underline"
            >
              <span>{isAr ? 'عرض كافة منتجات المتجر والتخصيص' : 'Browse All Custom Shop Products'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. LED Acrylic Signs */}
            <div
              onClick={() => onOpenCustomizer('prod-airplane-led')}
              className="group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3 bg-slate-950">
                <img
                  src={PRODUCTS[0].image}
                  alt={isAr ? 'لوحات أكريليك LED' : 'LED Acrylic Signs'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-md bg-purple-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {isAr ? 'إضاءة LED ثلاثية الأبعاد' : '3D LED Lamp'}
                </span>
                <span className="absolute bottom-2.5 end-2.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[11px] font-extrabold shadow-xs">
                  {isAr ? 'من 35,000 د.ع' : 'From 35,000 IQD'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                  {isAr ? 'لوحات أكريليك مضيئة LED' : 'LED Acrylic Signs & Plaques'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {isAr ? 'حفر ليزري ميكروني على أكريليك شفاف نقي وقواعد خشب زان مضاءة.' : 'Sub-millimeter laser engraved optical acrylic on illuminated beech wood.'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
                  <span>{isAr ? 'صمّم لوحتك الآن' : 'Customize Now'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            </div>

            {/* 2. Custom Gifts & Keepsakes */}
            <div
              onClick={() => onOpenCustomizer('prod-wedding-timeline')}
              className="group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-sky-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3 bg-slate-950">
                <img
                  src={PRODUCTS[2].image}
                  alt={isAr ? 'هدايا شخصية وتوثيق' : 'Personal Gifts & Keepsakes'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-md bg-sky-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {isAr ? 'توثيق مناسبات وزفاف' : 'Custom Keepsake'}
                </span>
                <span className="absolute bottom-2.5 end-2.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[11px] font-extrabold shadow-xs">
                  {isAr ? 'من 42,000 د.ع' : 'From 42,000 IQD'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                  {isAr ? 'هدايا شخصية وتذكارية' : 'Bespoke Custom Gifts'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {isAr ? 'توثيق مواعيد وتواريخ الزفاف والمواليد بالخط العربي الأصيل.' : 'Customized wedding milestones and dates with classical Arabic script.'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
                  <span>{isAr ? 'تخصيص الهدية' : 'Personalize Gift'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            </div>

            {/* 3. Luxury Packaging & Rigid Boxes */}
            <div
              onClick={() => onOpenCustomizer('prod-rigid-boxes')}
              className="group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3 bg-slate-950">
                <img
                  src={PRODUCTS[3].image}
                  alt={isAr ? 'علب كرتون مقوى فاخرة' : 'Rigid Gift Boxes'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-md bg-purple-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {isAr ? 'كرتون 1200 غم وبصمة' : 'Rigid Box'}
                </span>
                <span className="absolute bottom-2.5 end-2.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[11px] font-extrabold shadow-xs">
                  {isAr ? 'من 8,500 د.ع' : 'From 8,500 IQD'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                  {isAr ? 'طباعة علب الكرتون الفاخرة' : 'Luxury Packaging Boxes'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {isAr ? 'علب مقواة مع بصمة ذهبية وحشوات إسفنج ليزري مخصصة لمنتجاتك.' : 'Rigid setup boxes with metallic deboss and tailored foam inserts.'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
                  <span>{isAr ? 'تخصيص العلبة' : 'Customize Box'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            </div>

            {/* 4. Business Cards & Stationery */}
            <div
              onClick={() => onOpenCustomizer('prod-foil-cards')}
              className="group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-sky-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3 bg-slate-950">
                <img
                  src={PRODUCTS[4].image}
                  alt={isAr ? 'كروت عمل ومطبوعات' : 'Foil Business Cards'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-md bg-sky-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {isAr ? 'ورق قطني وتذهيب حواف' : 'Gilded Cards'}
                </span>
                <span className="absolute bottom-2.5 end-2.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[11px] font-extrabold shadow-xs">
                  {isAr ? 'من 350 د.ع / كارت' : 'From 350 IQD / pc'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                  {isAr ? 'كروت الأعمال الفاخرة' : 'Luxury Business Cards'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {isAr ? 'أوراق قطنية إيطالية 600 غم وبصمة حرارية وحواف مذهبة.' : 'Ultra-heavy cotton stock with metallic hot foil and mirror edge gilding.'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
                  <span>{isAr ? 'طلب كروت عمل' : 'Order Cards'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
