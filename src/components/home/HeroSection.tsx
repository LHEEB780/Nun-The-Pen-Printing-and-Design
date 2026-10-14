import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft, 
  SlidersHorizontal, 
  MessageCircle, 
  Check, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Layers
} from 'lucide-react';
import { PRODUCTS, COMPANY_CONTACT } from '../../data/mockData';
import { useContentStore } from '../../store/useContentStore';

interface HeroSectionProps {
  onOpenCustomizer: (productId?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCustomizer }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { setSelectedArticleId } = useContentStore();

  // Active showcase index
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isLit, setIsLit] = useState(true);
  const [glowColor, setGlowColor] = useState<'amber' | 'cyan' | 'purple'>('amber');
  const [simulatedText, setSimulatedText] = useState('نُون والقَلَم');

  // 4 Core Masterpiece Crafts of Noon Wal Qalam
  const craftSpotlights = [
    {
      id: 'prod-airplane-led',
      categoryKey: 'led',
      labelAr: 'لوحات 3D LED المضيئة',
      labelEn: '3D LED Optical Signs',
      icon: Zap,
      titleAr: 'درع أكريليك 3D LED مع حفر ليزري ميكروني',
      titleEn: '3D Optical LED Acrylic Lamp & Trophy',
      taglineAr: 'حفر ليزري على أكريليك ألماني فائق النقاء مع قاعدة خشب زان وإضاءة ساحرة',
      taglineEn: 'Sub-millimeter laser engraved optical acrylic on illuminated beech base',
      badgeAr: 'الأكثر طلباً كهدايا وتكريم',
      badgeEn: 'Best Seller Award & Gift',
      priceAr: '32,000 د.ع',
      priceEn: '32,000 IQD',
      image: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
      specsAr: ['أكريليك كاست 5 ملم', 'تحكم باللمس Touch', 'عمر LED +50,000 ساعة'],
      specsEn: ['5mm Cast Acrylic', 'Touch Sensor Base', '+50,000 hrs LED Lifespan'],
      supportsLiveGlow: true,
    },
    {
      id: 'prod-rigid-boxes',
      categoryKey: 'boxes',
      labelAr: 'علب كرتون فاخرة (Rigid)',
      labelEn: 'Luxury Rigid Boxes',
      icon: Layers,
      titleAr: 'علب كرتون مقوى صلبة مع بصمة ذهبية حرارية',
      titleEn: 'Luxury Custom Rigid Setup Packaging Boxes',
      taglineAr: 'كرتون رمادي 1200 غم مكسو بورق مخملي فاخر، إغلاق مغناطيسي، وقوالب إسفنج ليزرية',
      taglineEn: '1200gsm greyboard with metallic gold foil deboss, soft-touch matte & EVA foam',
      badgeAr: 'للمتاجر والعطور والمنتجات الفاخرة',
      badgeEn: 'Retail & Premium Packaging',
      priceAr: 'من 5,000 د.ع / علبة',
      priceEn: 'From 5,000 IQD / box',
      image: '/images/products/luxury_rigid_box.jpg',
      specsAr: ['كرتون 1200 غم مقاوم للثني', 'بصمة حرارية ألمانية كروز', 'إغلاق مغناطيسي مخفي'],
      specsEn: ['1200gsm Heavy Greyboard', 'German Kurz Hot Foil', 'Concealed Magnetic Snap'],
      supportsLiveGlow: false,
    },
    {
      id: 'prod-foil-cards',
      categoryKey: 'cards',
      labelAr: 'كروت أعمال وبصمة حرارية',
      labelEn: 'Hot-Foil Business Cards',
      icon: Sparkles,
      titleAr: 'كروت أعمال قطنية 600 غم مع حواف مذهبة وبصمة نافرة',
      titleEn: 'Ultra-Heavy 600gsm Cotton Foil Business Cards',
      taglineAr: 'ورق قطني طبيعي إيطالي مع تذهيب حواف يدوي وبصمة لتربرس غائرة تعكس فخامة علامتك',
      taglineEn: 'Italian natural cotton cardstock with hand-gilded edges and letterpress debossing',
      badgeAr: 'للشركات ورجال الأعمال',
      badgeEn: 'Executive & Corporate Identity',
      priceAr: 'من 250 د.ع / كارت',
      priceEn: 'From 250 IQD / pc',
      image: '/images/products/luxury_foil_cards.jpg',
      specsAr: ['ورق قطني ثقيل 600 غم', 'تذهيب حواف عاكس (Gilded)', 'طباعة لتربرس عالية الدقة'],
      specsEn: ['600gsm Heavy Cotton', 'Hand-Burnished Gilded Edge', 'High-Res Letterpress'],
      supportsLiveGlow: false,
    },
    {
      id: 'prod-wedding-timeline',
      categoryKey: 'weddings',
      labelAr: 'دروع توثيق الزفاف والمناسبات',
      labelEn: 'Wedding Keepsake Plaques',
      icon: ShieldCheck,
      titleAr: 'لوحة توثيق مواعيد الزفاف بالخط العربي الأصيل',
      titleEn: 'Bespoke Wedding Timeline Acrylic Keepsake',
      taglineAr: 'توثيق مواعيد العمر بأسماء العروسين وتواريخ الخطوبة والزفاف مع إضاءة دافئة ناعمة',
      taglineEn: 'Milestone wedding dates engraved in classical Arabic calligraphy on luminous wood base',
      badgeAr: 'تذكار العمر الخالد',
      badgeEn: 'Cherished Lifetime Keepsake',
      priceAr: '42,000 د.ع',
      priceEn: '42,000 IQD',
      image: '/images/products/acrylic_led_front_1791779703517.jpg',
      specsAr: ['خط عربي مخصص بدقة', 'قاعدة خشب طبيعي معالج', 'صندوق إهداء فاخر مجاناً'],
      specsEn: ['Bespoke Arabic Script', 'Natural Beech Wood Base', 'Free Luxury Gift Box'],
      supportsLiveGlow: true,
    },
  ];

  const currentCraft = craftSpotlights[activeCategoryIndex];

  // Glow classes & shadows
  const glowBorderClass = {
    amber: isLit ? 'shadow-[0_0_55px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/80' : 'ring-1 ring-slate-200',
    cyan: isLit ? 'shadow-[0_0_55px_rgba(56,189,248,0.4)] ring-2 ring-sky-400/80' : 'ring-1 ring-slate-200',
    purple: isLit ? 'shadow-[0_0_55px_rgba(168,85,247,0.4)] ring-2 ring-purple-400/80' : 'ring-1 ring-slate-200',
  };

  const glowOverlayClass = {
    amber: 'from-amber-400/25 via-amber-300/10 to-transparent',
    cyan: 'from-sky-400/25 via-sky-300/10 to-transparent',
    purple: 'from-purple-400/25 via-purple-300/10 to-transparent',
  };

  const glowTextColorClass = {
    amber: 'text-amber-200 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]',
    cyan: 'text-sky-200 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]',
    purple: 'text-purple-200 drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]',
  };

  const sampleTexts = [
    'نُون والقَلَم',
    'د. أحمد خليل',
    'مريم ومحمد',
    'شركة النخيل'
  ];

  return (
    <section 
      id="home" 
      className="relative pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-white to-slate-50 border-b border-amber-100/60"
    >
      {/* Subtle luxury ambient lighting orbs */}
      <div
        className="absolute top-10 start-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-200/30 via-purple-100/30 to-sky-100/20 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-48 end-10 w-96 h-96 rounded-full bg-gradient-to-bl from-purple-200/20 via-amber-100/30 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header: Typography, Quick Actions, and Live Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text & Pitch Column (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-start">
            
            {/* Atelier Kicker with Artisan Gold Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs font-bold tracking-tight shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{isAr ? 'استوديو نُون والقَلَم · حفر ليزري وطباعة وتصنيع فاخر · بغداد' : 'Noon & Pen Atelier · Laser Engraving & Luxury Print · Baghdad'}</span>
            </div>

            {/* Main Headline - Clear, imposing, prestige Arabic typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.2] tracking-tight">
              {t('hero.titlePart1')}{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-purple-700 to-sky-600">
                {t('hero.titleHighlight')}
              </span>{' '}
              {t('hero.titlePart2')}
            </h1>

            {/* Subtitle / Value Statement */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>

            {/* Interactive Craft Categories Selector (Pills allowing 1-tap switching) */}
            <div className="pt-1">
              <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAr ? 'اختر تخصصك لتراه مباشرة في الاستعراض الحي:' : 'Select craft to preview live:'}</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {craftSpotlights.map((craft, idx) => {
                  const Icon = craft.icon;
                  const isActive = activeCategoryIndex === idx;
                  return (
                    <button
                      key={craft.id}
                      onClick={() => setActiveCategoryIndex(idx)}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-start cursor-pointer border ${
                        isActive
                          ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-sm scale-102'
                          : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                      <span className="truncate">{isAr ? craft.labelAr : craft.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Engraving Simulator (For LED Plaques) */}
            {currentCraft.supportsLiveGlow && (
              <div className="bg-white/90 p-3 sm:p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isAr ? 'تجربة حية فورية: اكتب اسمك أو عبارتك لتراها مضيئة' : 'Live Preview: Type your text to see it glow'}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-purple-700 hidden sm:inline">
                    {isAr ? 'معاينة ليزرية فورية' : 'Live Laser Render'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={simulatedText}
                    onChange={(e) => setSimulatedText(e.target.value)}
                    maxLength={35}
                    placeholder={isAr ? 'اكتب اسمك أو عبارتك هنا...' : 'Type name or phrase here...'}
                    className="w-full sm:flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs font-bold text-slate-900 transition-all"
                  />
                  <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
                    {sampleTexts.map((txt) => (
                      <button
                        key={txt}
                        onClick={() => setSimulatedText(txt)}
                        type="button"
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200/60 transition-colors cursor-pointer"
                      >
                        {txt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Value Guarantees - Clean Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-600 font-semibold pt-1">
              <span className="inline-flex items-center gap-1 text-slate-800">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isAr ? 'قص ليزري ألماني 0.2mm' : 'German 0.2mm Laser'}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-slate-800">
                <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{isAr ? 'أكريليك كاست نقي 100%' : '100% Virgin Cast Acrylic'}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-slate-800">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{isAr ? 'خشب زان طبيعي معالج' : 'Solid Natural Beech Wood'}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-slate-800">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{isAr ? 'توصيل لبغداد وكافة المحافظات' : 'All-Iraq Fast Delivery'}</span>
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* Primary Customizer CTA */}
              <button
                onClick={() => onOpenCustomizer(currentCraft.id)}
                type="button"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-purple-700 to-sky-600 hover:from-amber-700 hover:to-sky-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>{t('hero.ctaPrimary')}</span>
                {isAr ? (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              {/* Direct WhatsApp Consultation */}
              <a
                href={`${COMPANY_CONTACT.whatsappUrl}&text=${encodeURIComponent(
                  `مرحباً استوديو نون والقلم، أود الاستفسار وتصميم قطعة تخص: ${currentCraft.titleAr}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'طلب واستشارة فورية عبر واتساب' : 'Inquire via WhatsApp'}</span>
              </a>

              {/* Explore Shop / Portfolio Link */}
              <a
                href="#shop"
                className="px-4 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 transition-colors shadow-2xs hover:border-slate-300 flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>{isAr ? 'الكتالوج والأسعار' : 'Shop Catalog'}</span>
              </a>
            </div>

            {/* Trust Metrics Row */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-3 max-w-lg">
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">+1,500</p>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                  {isAr ? 'قطعة فاخرة منفذة في بغداد' : 'Handcrafted in Baghdad'}
                </p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">4.9 / 5 ★</p>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                  {isAr ? 'تقييم رضا العملاء والشركات' : 'Client Satisfaction Rating'}
                </p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">100%</p>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                  {isAr ? 'بروفة واعتماد مجاني قبل التنفيذ' : 'Free Visual Proof Approval'}
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Masterpiece Spotlight Card (5 cols on Desktop) */}
          {/* Visible immediately on Mobile right under title & above the fold! */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Luxury Frame Container */}
              <div className={`relative bg-slate-950 rounded-3xl overflow-hidden transition-all duration-500 border border-slate-800 ${glowBorderClass[glowColor]}`}>
                
                {/* Visual Viewport with Simulated Illumination */}
                <div className="relative aspect-4/3 w-full overflow-hidden group select-none">
                  {/* Real Masterpiece Photography */}
                  <img
                    src={currentCraft.image}
                    alt={isAr ? currentCraft.titleAr : currentCraft.titleEn}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      currentCraft.supportsLiveGlow && !isLit 
                        ? 'opacity-65 brightness-60 contrast-90 filter grayscale-30' 
                        : 'opacity-100 brightness-105 contrast-105'
                    }`}
                  />

                  {/* Dynamic Simulated Ambient Illumination Glow */}
                  {currentCraft.supportsLiveGlow && isLit && (
                    <div
                      className={`absolute inset-0 bg-radial ${glowOverlayClass[glowColor]} mix-blend-screen pointer-events-none transition-all duration-500`}
                    />
                  )}

                  {/* Dynamic Simulated Live Laser Engraving Text Overlay */}
                  {currentCraft.supportsLiveGlow && isLit && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                      <div className="bg-slate-950/60 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/10 shadow-xl max-w-[85%]">
                        <p className={`text-base sm:text-lg md:text-xl font-black tracking-wide font-sans transition-all duration-300 ${glowTextColorClass[glowColor]}`}>
                          {simulatedText || 'نُون والقَلَم'}
                        </p>
                        <p className="text-[10px] text-white/70 font-medium mt-0.5 tracking-tight">
                          {isAr ? 'حفر ليزري مضيء 3D LED' : '3D Optical Laser Glow'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Corner Badge Tag */}
                  <div className="absolute top-3.5 start-3.5 px-3 py-1 bg-slate-900/90 backdrop-blur-md text-amber-200 text-xs font-bold rounded-xl border border-amber-500/30 shadow-md">
                    {isAr ? currentCraft.badgeAr : currentCraft.badgeEn}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3.5 end-3.5 px-3 py-1.5 bg-white/95 backdrop-blur-md text-slate-900 font-black text-xs rounded-xl shadow-md border border-slate-200">
                    {isAr ? currentCraft.priceAr : currentCraft.priceEn}
                  </div>

                  {/* Quick Indicator of current slide */}
                  <div className="absolute top-3.5 end-3.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[11px] font-bold">
                    <span>{activeCategoryIndex + 1}</span>
                    <span className="text-white/40">/</span>
                    <span>{craftSpotlights.length}</span>
                  </div>
                </div>

                {/* Interactive Controls Bar for Plaque Illumination & Craft Navigation */}
                <div className="p-3.5 sm:p-4 bg-slate-900 text-white border-t border-slate-800 space-y-3">
                  
                  {/* Top row: Light Switch + Tone Selector + Next/Prev */}
                  <div className="flex items-center justify-between gap-2">
                    
                    {/* Illumination toggle (if supports glow) */}
                    {currentCraft.supportsLiveGlow ? (
                      <button
                        onClick={() => setIsLit(!isLit)}
                        type="button"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isLit
                            ? 'bg-amber-400 text-amber-950 shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                        title={isAr ? 'تشغيل/إطفاء الإضاءة التفاعلية' : 'Toggle Illumination'}
                      >
                        <Lightbulb className={`w-3.5 h-3.5 ${isLit ? 'text-amber-950 fill-amber-950' : 'text-slate-400'}`} />
                        <span>{isLit ? (isAr ? 'الإضاءة: مشتعلة' : 'LED: ON') : (isAr ? 'الإضاءة: مطفأة' : 'LED: OFF')}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-amber-300/90 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'تشطيب يدوي فاخر' : 'Luxury Hand Finish'}</span>
                      </span>
                    )}

                    {/* LED Tone Selector (Amber / Cyan / Purple) */}
                    {currentCraft.supportsLiveGlow && isLit && (
                      <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setGlowColor('amber')}
                          type="button"
                          title={isAr ? 'عنبري دافئ' : 'Warm Amber'}
                          className={`w-5 h-5 rounded-full bg-amber-400 transition-transform cursor-pointer border-2 ${
                            glowColor === 'amber' ? 'border-white scale-115 ring-2 ring-amber-400/50' : 'border-transparent'
                          }`}
                        />
                        <button
                          onClick={() => setGlowColor('cyan')}
                          type="button"
                          title={isAr ? 'أزرق ثلجي' : 'Ice Cyan'}
                          className={`w-5 h-5 rounded-full bg-sky-400 transition-transform cursor-pointer border-2 ${
                            glowColor === 'cyan' ? 'border-white scale-115 ring-2 ring-sky-400/50' : 'border-transparent'
                          }`}
                        />
                        <button
                          onClick={() => setGlowColor('purple')}
                          type="button"
                          title={isAr ? 'بنفسجي ملكي' : 'Royal Violet'}
                          className={`w-5 h-5 rounded-full bg-purple-500 transition-transform cursor-pointer border-2 ${
                            glowColor === 'purple' ? 'border-white scale-115 ring-2 ring-purple-400/50' : 'border-transparent'
                          }`}
                        />
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveCategoryIndex((prev) => (prev - 1 + craftSpotlights.length) % craftSpotlights.length)}
                        type="button"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                        aria-label="Previous item"
                      >
                        {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setActiveCategoryIndex((prev) => (prev + 1) % craftSpotlights.length)}
                        type="button"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                        aria-label="Next item"
                      >
                        {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>

                  {/* Title & Specs */}
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 leading-snug line-clamp-1">
                      {isAr ? currentCraft.titleAr : currentCraft.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {isAr ? currentCraft.taglineAr : currentCraft.taglineEn}
                    </p>
                  </div>

                  {/* Craft Specifications Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {(isAr ? currentCraft.specsAr : currentCraft.specsEn).map((sp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>

                  {/* Direct Customize Action */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-800/80">
                    <button
                      onClick={() => onOpenCustomizer(currentCraft.id)}
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-sky-500 hover:from-amber-600 hover:to-sky-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تخصيص هذا التصميم الآن بالكامل' : 'Customize This Design Now'}</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom Craft Categories Gallery Banner */}
        <div className="mt-14 pt-8 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                {isAr ? 'تخصصات استوديو نُون والقَلَم' : 'Noon & Pen Masterpiece Crafts'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {craftSpotlights.map((craft, idx) => (
              <div
                key={craft.id}
                onClick={() => {
                  setActiveCategoryIndex(idx);
                  onOpenCustomizer(craft.id);
                }}
                className="group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-amber-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3 bg-slate-950">
                  <img
                    src={craft.image}
                    alt={isAr ? craft.titleAr : craft.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-amber-200 text-[10px] font-bold">
                    {isAr ? craft.labelAr : craft.labelEn}
                  </span>
                  <span className="absolute bottom-2.5 end-2.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[11px] font-black shadow-xs">
                    {isAr ? craft.priceAr : craft.priceEn}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {isAr ? craft.titleAr : craft.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {isAr ? craft.taglineAr : craft.taglineEn}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>{isAr ? 'صمّم قطعتك الآن' : 'Customize Now'}</span>
                    {isAr ? (
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
