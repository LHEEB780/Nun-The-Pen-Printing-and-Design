import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Sparkles,
  Wand2,
  Lightbulb,
  CheckCircle2,
  ShoppingBag,
  Upload,
  X,
  Palette,
  Ruler,
  Layers,
  Download,
  Check,
  ShieldCheck,
  RotateCw,
  Sun,
  Moon,
  Info,
  Scale,
  Stethoscope,
  Compass,
  Crown,
  Coffee,
  Building2,
  Smile,
  FileCheck,
  Plane,
} from 'lucide-react';
import { InteractiveAcrylicPlaque } from './InteractiveAcrylicPlaque';
import { ProductItem, DimensionOption, LedOption, FontOption } from '../../data/mockData';
import { usePricingCalculator } from '../../hooks/usePricingCalculator';
import { useCartStore } from '../../store/useCartStore';

export interface InteractiveAiDesignStudioProps {
  product: ProductItem;
  onAddToCartSuccess?: () => void;
  className?: string;
}

// Preset Badges / Emblems
interface EmblemOption {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: React.FC<{ className?: string }>;
}

const EMBLEMS: EmblemOption[] = [
  { id: 'aviation_travel', nameAr: 'سياحة وطيران (الأفق)', nameEn: 'Aviation & Travel', icon: Plane },
  { id: 'none', nameAr: 'بدون شعار', nameEn: 'None', icon: X },
  { id: 'medical', nameAr: 'طبي / صيدلة', nameEn: 'Medical', icon: Stethoscope },
  { id: 'legal', nameAr: 'عدالة ومحاماة', nameEn: 'Legal & Law', icon: Scale },
  { id: 'engineering', nameAr: 'هندسة وعمارة', nameEn: 'Engineering', icon: Compass },
  { id: 'royal', nameAr: 'تاج ملكي فاخر', nameEn: 'Royal Crown', icon: Crown },
  { id: 'corporate', nameAr: 'مؤسسي وشركات', nameEn: 'Corporate', icon: Building2 },
  { id: 'cafe', nameAr: 'كافيه وضيافة', nameEn: 'Cafe & Bistro', icon: Coffee },
  { id: 'dental', nameAr: 'طب أسنان', nameEn: 'Dental Care', icon: Smile },
];

// Realistic Wall Backgrounds
const WALL_BACKGROUNDS = [
  {
    id: 'marble',
    nameAr: 'رخام أسود ملكي',
    nameEn: 'Black Marble',
    bgClass: 'bg-gradient-to-br from-slate-950 via-zinc-900 to-black border-slate-800',
    texture: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 60%)',
  },
  {
    id: 'wood',
    nameAr: 'ألواح خشب جوز',
    nameEn: 'Walnut Slats',
    bgClass: 'bg-gradient-to-r from-amber-950 via-stone-900 to-yellow-950 border-amber-900/50',
    texture: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 24px)',
  },
  {
    id: 'concrete',
    nameAr: 'خرسانة إسمنتية عصرية',
    nameEn: 'Modern Concrete',
    bgClass: 'bg-gradient-to-br from-stone-800 via-neutral-800 to-stone-900 border-stone-700',
    texture: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0/16px 16px',
  },
  {
    id: 'minimal_white',
    nameAr: 'جدار استوديو ناصع',
    nameEn: 'Studio Light',
    bgClass: 'bg-gradient-to-br from-slate-100 via-slate-200 to-zinc-300 border-slate-300',
    texture: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 70%)',
  },
];

// Arabic Fonts with styling metadata
const ARABIC_FONTS = [
  {
    id: 'thuluth',
    nameAr: 'خط الثلث الكلاسيكي',
    nameEn: 'Royal Thuluth',
    cssFamily: "'Amiri', 'Traditional Arabic', serif",
    letterSpacing: 'tracking-normal',
  },
  {
    id: 'kufi',
    nameAr: 'الخط الكوفي المودرن',
    nameEn: 'Architectural Kufic',
    cssFamily: "'Cairo', sans-serif",
    letterSpacing: 'tracking-wider',
  },
  {
    id: 'diwani',
    nameAr: 'الخط الديواني الملكي',
    nameEn: 'Imperial Diwani',
    cssFamily: "'Amiri', cursive, serif",
    letterSpacing: 'tracking-wide',
  },
  {
    id: 'modern_geometric',
    nameAr: 'الخط المعاصر الهندسي',
    nameEn: 'Modern Geometric',
    cssFamily: "'Tajawal', 'Cairo', sans-serif",
    letterSpacing: 'tracking-normal',
  },
];

// Standoff Hardware Colors
const STANDOFF_FINISHES = [
  { id: 'gold', nameAr: 'ذهبي براق', nameEn: 'Polished Gold', hex: '#EAB308', border: '#CA8A04' },
  { id: 'chrome', nameAr: 'فضي كروم', nameEn: 'Brushed Chrome', hex: '#CBD5E1', border: '#94A3B8' },
  { id: 'black', nameAr: 'أسود مطفي', nameEn: 'Matte Black', hex: '#1E293B', border: '#0F172A' },
];

export const InteractiveAiDesignStudio: React.FC<InteractiveAiDesignStudioProps> = ({
  product,
  onAddToCartSuccess,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { addItem, setIsOpen: setCartOpen } = useCartStore();
  const previewCanvasRef = useRef<HTMLDivElement>(null);

  const isAirplaneProduct = product.id === 'prod-airplane-led';

  // 1. Text Fields
  const [mainTitle, setMainTitle] = useState(
    isAirplaneProduct
      ? (isAr ? 'شركة الأفق الدولية' : 'Al-Ufuq International')
      : (isAr ? 'مجموعة الرافدين الطبية' : 'Al-Rafidain Medical Group')
  );
  const [subtitle, setSubtitle] = useState(
    isAirplaneProduct
      ? (isAr ? 'للسياحة والسفر' : 'Tours & Travel Services')
      : (isAr ? 'استشاري جراحة الفم وزراعة الأسنان' : 'Consultant Oral & Dental Implant Surgeon')
  );
  const [contactLine, setContactLine] = useState(
    isAirplaneProduct
      ? '+964 780 123 4567 · www.alufuq.travel'
      : '0770 123 4567 · بغداد - المنصور'
  );

  // 2. Styling Options
  const [selectedFont, setSelectedFont] = useState(ARABIC_FONTS[1]);
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption>(
    product.dimensions[0]
  );
  const [selectedLed, setSelectedLed] = useState<LedOption>(
    product.ledOptions?.[0] || {
      id: 'led-sky',
      nameAr: 'أزرق سماوي ناصع',
      nameEn: 'Sky Cyan Blue',
      hex: '#38bdf8',
      glowClass: 'shadow-sky-500/50',
    }
  );
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);
  const [isLedOn, setIsLedOn] = useState(true);
  const [ledIntensity, setLedIntensity] = useState<number>(85); // 0-100%
  const [selectedWall, setSelectedWall] = useState(WALL_BACKGROUNDS[0]);
  const [selectedEmblem, setSelectedEmblem] = useState<string>(
    isAirplaneProduct ? 'aviation_travel' : 'medical'
  );
  const [selectedStandoff, setSelectedStandoff] = useState(STANDOFF_FINISHES[0]);
  const [plaqueShape, setPlaqueShape] = useState<'rounded' | 'sharp' | 'pill'>('rounded');
  const [displayEnvironment, setDisplayEnvironment] = useState<'desk' | 'wall'>(
    isAirplaneProduct ? 'desk' : 'wall'
  );

  // 3. File Upload (Client Logo)
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState('');

  // 4. Quantity
  const [quantity, setQuantity] = useState<number>(product.minQuantity || 1);

  // 5. AI Assistant State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    refinedTitleAr?: string;
    suggestedSubtitleAr?: string;
    recommendedFont?: string;
    recommendedLedColor?: string;
    recommendedMaterial?: string;
    sloganAr?: string;
    productionCritiqueAr?: string;
    designScore?: number;
  } | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  // 6. Pricing Calculator
  const pricing = usePricingCalculator({
    product,
    quantity,
    selectedDimension,
    selectedMaterial,
  });

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(isAr ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, SVG)' : 'Please choose a valid image file');
        return;
      }
      setLogoFileName(file.name);
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setSelectedEmblem('none'); // deactivate preset emblem
      toast.success(isAr ? 'تم تحميل الشعار بنجاح وإدراجه على اللوحة!' : 'Logo uploaded and integrated!');
    }
  };

  // Call Gemini AI Assistant via Server Endpoint
  const handleRequestAiOptimization = async () => {
    setIsAiLoading(true);
    setShowAiPanel(true);
    try {
      const response = await fetch('/api/ai/design-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: isAr ? product.titleAr : product.titleEn,
          category: isAr ? product.categoryLabelAr : product.categoryLabelEn,
          userText: mainTitle,
          subtitle,
          material: isAr ? selectedMaterial.labelAr : selectedMaterial.labelEn,
          ledColor: isAr ? selectedLed.nameAr : selectedLed.nameEn,
          dimensions: isAr ? selectedDimension.labelAr : selectedDimension.labelEn,
          businessType: mainTitle,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setAiAnalysis(result.data);
        toast.success(
          isAr
            ? 'تم تحليل التصميم وتوليد مقترحات الذكاء الاصطناعي بنجاح!'
            : 'AI suggestions generated successfully!',
          {
            description: isAr
              ? `تقييم فخامة التصميم: ${result.data.designScore || 96}/100`
              : 'Design review completed.',
          }
        );
      } else {
        throw new Error(result.error || 'Failed to fetch suggestions');
      }
    } catch (err: any) {
      console.warn('AI call exception, applying smart preset:', err?.message);
      // Fallback
      setAiAnalysis({
        refinedTitleAr: mainTitle.trim() || 'نون والقلم للفنون الإعلانية',
        suggestedSubtitleAr: isAr ? 'استشارات وتنفيذ الدعاية والتصاميم الفاخرة' : 'Bespoke Signage & Advertising',
        recommendedFont: 'الخط الكوفي المودرن',
        recommendedLedColor: 'ذهبي دافئ 3000K',
        recommendedMaterial: 'أكريليك أسود ملكي مسبوك مع حفر ليزري عميق',
        sloganAr: 'دقة فائقة في التفاصيل تدوم طويلاً',
        productionCritiqueAr: 'المقاس وتوزيع النصوص مثالي للرؤية بوضوح تام، والتثبيت ببراغي الستيل يعطي عمقاً 25 ملم عن الجدار.',
        designScore: 98,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Apply AI suggestions with one click
  const handleApplyAiSuggestions = () => {
    if (!aiAnalysis) return;
    if (aiAnalysis.refinedTitleAr) setMainTitle(aiAnalysis.refinedTitleAr);
    if (aiAnalysis.suggestedSubtitleAr) setSubtitle(aiAnalysis.suggestedSubtitleAr);
    if (aiAnalysis.sloganAr && !contactLine) setContactLine(aiAnalysis.sloganAr);

    // match font
    if (aiAnalysis.recommendedFont?.includes('كوفي')) {
      setSelectedFont(ARABIC_FONTS[1]);
    } else if (aiAnalysis.recommendedFont?.includes('ثلث')) {
      setSelectedFont(ARABIC_FONTS[0]);
    } else if (aiAnalysis.recommendedFont?.includes('ديواني')) {
      setSelectedFont(ARABIC_FONTS[2]);
    }

    toast.success(isAr ? 'تم تطبيق تعديلات الذكاء الاصطناعي على التصميم!' : 'AI recommendations applied!');
  };

  // Finalize Design & Add to Cart
  const handleFinalizeAndOrder = () => {
    if (!mainTitle.trim()) {
      toast.error(isAr ? 'يرجى كتابة الاسم أو النص المطلوب على الأقل' : 'Please provide a title or name');
      return;
    }

    const customFormData = {
      title: mainTitle.trim(),
      subtitle: subtitle.trim(),
      contactLine: contactLine.trim(),
      fontName: isAr ? selectedFont.nameAr : selectedFont.nameEn,
      dimension: isAr ? selectedDimension.labelAr : selectedDimension.labelEn,
      material: isAr ? selectedMaterial.labelAr : selectedMaterial.labelEn,
      ledColor: isAr ? selectedLed.nameAr : selectedLed.nameEn,
      ledHex: selectedLed.hex,
      standoff: isAr ? selectedStandoff.nameAr : selectedStandoff.nameEn,
      emblem: selectedEmblem,
      logoFileName: logoFileName || undefined,
      wallPreview: selectedWall.id,
      designStatus: 'finalized_ready_for_laser_cnc',
      aiScore: aiAnalysis?.designScore || 95,
      unitPriceUSD: pricing.unitPriceUSD,
      totalPriceUSD: pricing.totalPriceUSD,
    };

    addItem({
      productId: product.id,
      titleAr: `${product.titleAr} - [تصميم مخصص معتمد: ${mainTitle}]`,
      titleEn: `${product.titleEn} - [Custom Design: ${mainTitle}]`,
      image: logoPreview || product.image,
      category: product.category,
      quantity,
      unitPrice: pricing.unitPriceIQD,
      originalUnitPrice: pricing.originalUnitPriceIQD,
      totalPrice: pricing.totalPriceIQD,
      customOptions: {
        customText: `${mainTitle} | ${subtitle}`,
        dimensionLabelAr: selectedDimension.labelAr,
        dimensionLabelEn: selectedDimension.labelEn,
        materialLabelAr: selectedMaterial.labelAr,
        materialLabelEn: selectedMaterial.labelEn,
        ledColorNameAr: selectedLed.nameAr,
        ledColorNameEn: selectedLed.nameEn,
        ledHex: selectedLed.hex,
        fontName: isAr ? selectedFont.nameAr : selectedFont.nameEn,
        logoFileName: logoFileName || undefined,
        logoPreviewUrl: logoPreview || undefined,
        discountPercentage: pricing.discountPercent,
        customFormData,
      },
      customFormData,
      uploadedFileUrl: logoPreview || undefined,
    });

    toast.success(
      isAr
        ? 'تم اعتماد التصميم ورفع الطلب بنجاح! جاهز للتصنيع الفوري.'
        : 'Design approved & added to cart! Ready for production.',
      {
        description: isAr
          ? `المجموع: $${pricing.totalPriceUSD} (${pricing.totalPriceIQD.toLocaleString()} د.ع) - شامل التخصيص الكامل.`
          : `Total: $${pricing.totalPriceUSD}`,
        action: {
          label: isAr ? 'إتمام الطلب في السلة' : 'Open Cart',
          onClick: () => setCartOpen(true),
        },
        duration: 5000,
      }
    );

    if (onAddToCartSuccess) {
      onAddToCartSuccess();
    }
  };

  // Emblem Component Icon
  const ActiveEmblemIcon = EMBLEMS.find((e) => e.id === selectedEmblem)?.icon || null;

  // Material Finish styles for the sign plaque
  const getPlaqueMaterialStyles = () => {
    const matId = selectedMaterial.id;
    if (matId.includes('metal') || matId.includes('gold')) {
      return {
        background: 'linear-gradient(135deg, #1e1b18 0%, #2a241b 50%, #151310 100%)',
        border: '1.5px solid rgba(234, 179, 8, 0.4)',
        textColor: '#FEF08A',
        subtitleColor: '#FDE047',
        glowDefault: '#EAB308',
      };
    } else if (matId.includes('clear')) {
      return {
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255, 255, 255, 0.25)',
        textColor: '#FFFFFF',
        subtitleColor: '#E2E8F0',
        glowDefault: '#38BDF8',
      };
    } else if (matId.includes('wood')) {
      return {
        background: 'linear-gradient(135deg, #2A1810 0%, #3D2314 50%, #1F110B 100%)',
        border: '1.5px solid rgba(180, 83, 9, 0.4)',
        textColor: '#FEF3C7',
        subtitleColor: '#FDE68A',
        glowDefault: '#F59E0B',
      };
    } else {
      // Black Glossy Acrylic (Default Luxury)
      return {
        background: 'linear-gradient(145deg, #0f172a 0%, #090d16 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        textColor: '#FFFFFF',
        subtitleColor: '#94A3B8',
        glowDefault: selectedLed.hex,
      };
    }
  };

  const plaqueStyle = getPlaqueMaterialStyles();
  const activeGlowColor = isLedOn ? selectedLed.hex : 'transparent';
  const glowAlpha = (ledIntensity / 100) * 0.55;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Top Banner: AI Interactive Studio Welcome & Concept */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-purple-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{isAr ? 'استوديو التخصيص التفاعلي بالذكاء الاصطناعي' : 'AI-Powered Interactive Design Studio'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
              {isAr
                ? 'شاهد تصميمك يتشكل فورياً مع كل معلومة تكتبها!'
                : 'Watch your design transform live as you type!'}
            </h2>
            <p className="text-purple-200/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {isAr
                ? 'قم بكتابة اسمك أو نشاطك، واختر الإضاءة والخط والخامة، ليقوم الاستوديو بمحاكاة اللوحة مباشرة على الجدار بدقة هندسية، وعند رضاك ارفع طلبك جاهزاً للقص والتنفيذ دون انتظار!'
                : 'Enter your business or name, choose lighting, fonts, and materials. See photorealistic live simulation and submit directly for CNC & laser manufacturing.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRequestAiOptimization}
              disabled={isAiLoading}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-amber-500/25 hover:scale-102 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>
                {isAiLoading
                  ? isAr
                    ? 'الذكاء الاصطناعي يحلل...'
                    : 'AI Analyzing...'
                  : isAr
                  ? 'اقتراح وتنسيق بالذكاء الاصطناعي ✨'
                  : 'AI Smart Suggestions ✨'}
              </span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -end-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute start-1/3 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Studio Split Layout: Left Preview Canvas (Sticky), Right Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: THE LIVE INTERACTIVE MOCKUP CANVAS (6 COLS)
           ======================================================== */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-2xl space-y-4">
            {/* Top Canvas Bar: Environment Controls & Night/Day toggle */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Environment Mode: Desk Lamp vs Wall Mount */}
                <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDisplayEnvironment('desk')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      displayEnvironment === 'desk'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isAr ? 'مصباح مكتبي 3D 💡' : '3D Desk Lamp'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayEnvironment('wall')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      displayEnvironment === 'wall'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isAr ? 'لوحة جدارية 🏛️' : 'Wall Plaque'}
                  </button>
                </div>

                {displayEnvironment === 'wall' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {WALL_BACKGROUNDS.map((wall) => (
                      <button
                        key={wall.id}
                        onClick={() => setSelectedWall(wall)}
                        type="button"
                        title={isAr ? wall.nameAr : wall.nameEn}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer border ${
                          selectedWall.id === wall.id
                            ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isAr ? wall.nameAr.split(' ')[0] : wall.nameEn.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Day / Night LED Light switch */}
              <button
                onClick={() => setIsLedOn(!isLedOn)}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isLedOn
                    ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {isLedOn ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>
                  {isLedOn
                    ? isAr
                      ? 'الإضاءة: مشتعلة'
                      : 'LED: ON'
                    : isAr
                    ? 'الإضاءة: مطفأة'
                    : 'LED: OFF'}
                </span>
              </button>
            </div>

            {/* THE REAL-TIME PHOTOREALISTIC CANVAS VIEWPORT */}
            {displayEnvironment === 'desk' ? (
              <div ref={previewCanvasRef} className="w-full">
                <InteractiveAcrylicPlaque
                  mainTitle={mainTitle}
                  subtitle={subtitle}
                  phone={contactLine.includes('·') ? contactLine.split('·')[0].trim() : contactLine}
                  website={contactLine.includes('·') ? contactLine.split('·')[1].trim() : ''}
                  emblemId={selectedEmblem}
                  logoUrl={logoPreview}
                  ledColorHex={selectedLed.hex}
                  isLit={isLedOn}
                  fontFamily={selectedFont.cssFamily}
                  dimensionLabel={isAr ? selectedDimension.labelAr : selectedDimension.labelEn}
                  standType={selectedStandoff.id === 'black' ? 'black' : selectedStandoff.id === 'gold' ? 'wood' : 'white'}
                  onToggleLight={() => setIsLedOn(!isLedOn)}
                  onResetToTemplate={() => {
                    setMainTitle(isAirplaneProduct ? 'شركة الأفق الدولية' : 'مجموعة الرافدين الطبية');
                    setSubtitle(isAirplaneProduct ? 'للسياحة والسفر' : 'استشاري جراحة الفم وزراعة الأسنان');
                    setContactLine(
                      isAirplaneProduct
                        ? '+964 780 123 4567 · www.alufuq.travel'
                        : '0770 123 4567 · بغداد - المنصور'
                    );
                    setSelectedEmblem(isAirplaneProduct ? 'aviation_travel' : 'medical');
                    setLogoPreview(null);
                  }}
                  isCustomized={
                    mainTitle !== (isAirplaneProduct ? 'شركة الأفق الدولية' : 'مجموعة الرافدين الطبية') ||
                    subtitle !== (isAirplaneProduct ? 'للسياحة والسفر' : 'استشاري جراحة الفم وزراعة الأسنان')
                  }
                />
              </div>
            ) : (
            <div
              ref={previewCanvasRef}
              className={`relative w-full aspect-4/3 rounded-2xl overflow-hidden flex items-center justify-center p-6 sm:p-8 transition-all duration-500 border ${selectedWall.bgClass}`}
              style={{
                backgroundImage: selectedWall.texture,
              }}
            >
              {/* Dynamic Wall Ambient Glow from the LED sign */}
              {isLedOn && (
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-500 mix-blend-screen"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${activeGlowColor}${Math.round(
                      glowAlpha * 255
                    ).toString(16).padStart(2, '0')} 0%, ${activeGlowColor}15 45%, transparent 75%)`,
                  }}
                />
              )}

              {/* Dimension scale indicators at top and left of the sign */}
              <div className="absolute top-2 start-4 text-[10px] text-slate-400 font-mono flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                <Ruler className="w-3 h-3 text-purple-400" />
                <span>
                  {isAr ? selectedDimension.labelAr : selectedDimension.labelEn}
                </span>
              </div>

              {/* THE SIGN BOARD (PLAQUE) CONTAINER */}
              <div
                className={`relative w-11/12 max-w-md p-6 sm:p-8 transition-all duration-300 shadow-2xl ${
                  plaqueShape === 'pill'
                    ? 'rounded-full'
                    : plaqueShape === 'rounded'
                    ? 'rounded-3xl'
                    : 'rounded-lg'
                }`}
                style={{
                  background: plaqueStyle.background,
                  border: plaqueStyle.border,
                  backdropFilter: plaqueStyle.backdropFilter,
                  boxShadow: isLedOn
                    ? `0 20px 45px -10px rgba(0,0,0,0.8), 0 0 35px -5px ${activeGlowColor}80`
                    : '0 20px 40px -10px rgba(0,0,0,0.8)',
                }}
              >
                {/* 4 STAINLESS STEEL STANDOFF SCREWS IN CORNERS */}
                <div
                  className="absolute top-3.5 start-3.5 w-3.5 h-3.5 rounded-full shadow-md border"
                  style={{
                    backgroundColor: selectedStandoff.hex,
                    borderColor: selectedStandoff.border,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                />
                <div
                  className="absolute top-3.5 end-3.5 w-3.5 h-3.5 rounded-full shadow-md border"
                  style={{
                    backgroundColor: selectedStandoff.hex,
                    borderColor: selectedStandoff.border,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                />
                <div
                  className="absolute bottom-3.5 start-3.5 w-3.5 h-3.5 rounded-full shadow-md border"
                  style={{
                    backgroundColor: selectedStandoff.hex,
                    borderColor: selectedStandoff.border,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                />
                <div
                  className="absolute bottom-3.5 end-3.5 w-3.5 h-3.5 rounded-full shadow-md border"
                  style={{
                    backgroundColor: selectedStandoff.hex,
                    borderColor: selectedStandoff.border,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                />

                {/* SIGN CONTENT: LOGO/EMBLEM + MAIN TITLE + SUBTITLE + CONTACT */}
                <div className="flex flex-col items-center justify-center text-center space-y-3 z-10 relative">
                  {/* Logo or Active Emblem */}
                  {logoPreview ? (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-white/20 shadow-md p-1 bg-black/30 backdrop-blur-xs flex items-center justify-center">
                      <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : ActiveEmblemIcon && selectedEmblem !== 'none' ? (
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-md border transition-all"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderColor: isLedOn ? `${activeGlowColor}60` : 'rgba(255,255,255,0.1)',
                        color: isLedOn ? activeGlowColor : plaqueStyle.textColor,
                        boxShadow: isLedOn ? `0 0 15px ${activeGlowColor}60` : 'none',
                      }}
                    >
                      <ActiveEmblemIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                  ) : null}

                  {/* Main Title with Laser Depth or Neon Lighting */}
                  <h3
                    className={`font-black text-lg sm:text-2xl tracking-wide transition-all ${selectedFont.letterSpacing}`}
                    style={{
                      fontFamily: selectedFont.cssFamily,
                      color: isLedOn ? plaqueStyle.textColor : '#94A3B8',
                      textShadow: isLedOn
                        ? `0 0 15px ${activeGlowColor}AA, 0 2px 4px rgba(0,0,0,0.9)`
                        : '0 2px 4px rgba(0,0,0,0.9)',
                    }}
                  >
                    {mainTitle || (isAr ? 'اكتب اسمك هنا' : 'Your Title Here')}
                  </h3>

                  {/* Subtitle / Profession */}
                  {subtitle && (
                    <p
                      className="text-xs sm:text-sm font-semibold tracking-normal max-w-xs transition-all"
                      style={{
                        color: isLedOn ? activeGlowColor : '#64748B',
                        textShadow: isLedOn ? `0 0 10px ${activeGlowColor}80` : 'none',
                      }}
                    >
                      {subtitle}
                    </p>
                  )}

                  {/* Divider line in metallic or glow */}
                  <div
                    className="w-24 h-0.5 rounded-full my-1 transition-all"
                    style={{
                      backgroundColor: isLedOn ? activeGlowColor : 'rgba(255,255,255,0.2)',
                      boxShadow: isLedOn ? `0 0 8px ${activeGlowColor}` : 'none',
                    }}
                  />

                  {/* Contact / Slogan line */}
                  {contactLine && (
                    <p className="text-[10px] sm:text-xs text-slate-300 font-mono tracking-tight opacity-90">
                      {contactLine}
                    </p>
                  )}
                </div>

                {/* Laser Polish Reflection Streak */}
                <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay" />
              </div>

              {/* Live Status Tag */}
              <div className="absolute bottom-3 end-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs border border-white/10 text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isAr ? 'معاينة حية ومباشرة 100%' : '100% Live Mockup'}</span>
              </div>
            </div>
            )}

            {/* LED Glow Intensity Slider & Plaque Shape Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              {/* Glow Intensity */}
              <div className="flex items-center justify-between gap-3 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'سطوع الإضاءة:' : 'Brightness:'}</span>
                </span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={ledIntensity}
                  onChange={(e) => setLedIntensity(Number(e.target.value))}
                  disabled={!isLedOn}
                  className="w-24 accent-amber-400 cursor-pointer disabled:opacity-30"
                />
                <span className="font-mono text-[11px] text-amber-400 font-bold">{ledIntensity}%</span>
              </div>

              {/* Plaque Shape */}
              <div className="flex items-center justify-between gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[11px] font-semibold text-slate-400">
                  {isAr ? 'حواف اللوحة:' : 'Corners:'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPlaqueShape('rounded')}
                    type="button"
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      plaqueShape === 'rounded' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isAr ? 'مقوسة' : 'Curved'}
                  </button>
                  <button
                    onClick={() => setPlaqueShape('sharp')}
                    type="button"
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      plaqueShape === 'sharp' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isAr ? 'حادة' : 'Sharp'}
                  </button>
                  <button
                    onClick={() => setPlaqueShape('pill')}
                    type="button"
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      plaqueShape === 'pill' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isAr ? 'بيضاوية' : 'Pill'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Feedback Panel (If generated) */}
          {showAiPanel && (
            <div className="rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-5 border border-purple-500/40 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-extrabold text-sm text-purple-200">
                    {isAr ? 'تحليل ومقترحات الذكاء الاصطناعي (Gemini AI)' : 'AI Smart Recommendations'}
                  </h4>
                </div>
                {aiAnalysis?.designScore && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-black border border-emerald-500/30">
                    {isAr ? `درجة التناسق: ${aiAnalysis.designScore}/100` : `Score: ${aiAnalysis.designScore}/100`}
                  </span>
                )}
              </div>

              {isAiLoading ? (
                <div className="py-6 flex flex-col items-center justify-center gap-3 text-slate-300">
                  <div className="w-8 h-8 border-3 border-purple-500 border-t-amber-400 rounded-full animate-spin" />
                  <p className="text-xs text-purple-200">
                    {isAr ? 'يتم الآن فحص تباعد الحروف والتناسق اللوني...' : 'Analyzing layout & color harmony...'}
                  </p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-3 text-xs">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold block">
                      {isAr ? 'التنسيق المقترح للعنوان والمهنة:' : 'Recommended Title & Subtitle:'}
                    </span>
                    <p className="font-bold text-white text-sm">{aiAnalysis.refinedTitleAr}</p>
                    <p className="text-purple-200">{aiAnalysis.suggestedSubtitleAr}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 block">{isAr ? 'الخط الموصى به:' : 'Font:'}</span>
                      <span className="font-bold text-emerald-300">{aiAnalysis.recommendedFont}</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 block">{isAr ? 'الإضاءة الموصى بها:' : 'LED Glow:'}</span>
                      <span className="font-bold text-amber-300">{aiAnalysis.recommendedLedColor}</span>
                    </div>
                  </div>

                  {aiAnalysis.productionCritiqueAr && (
                    <div className="bg-indigo-900/40 p-2.5 rounded-xl border border-indigo-500/30 text-indigo-200 text-[11px] leading-relaxed">
                      <span className="font-bold block text-indigo-300 mb-0.5">
                        {isAr ? 'ملاحظة التصنيع الميداني:' : 'Manufacturing Critique:'}
                      </span>
                      {aiAnalysis.productionCritiqueAr}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleApplyAiSuggestions}
                      type="button"
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تطبيق المقترحات فوراً على اللوحة' : 'Apply AI Suggestions'}</span>
                    </button>
                    <button
                      onClick={() => setShowAiPanel(false)}
                      type="button"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT COLUMN: THE REAL-TIME CUSTOMIZATION FORM (6 COLS)
           ======================================================== */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-7">
          {/* Section 1: Customer Text Inputs (Watch them morph live!) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>{isAr ? 'النصوص والبيانات الشخصية' : 'Custom Text & Details'}</span>
              </h3>
              <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2.5 py-0.5 rounded-full">
                {isAr ? 'يتغير مباشرة أثناء الكتابة' : 'Updates live on canvas'}
              </span>
            </div>

            {/* Main Title Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {isAr ? 'الاسم الرئيسي أو العنوان (Main Title):' : 'Main Title or Full Name:'}
                <span className="text-red-500 ms-1">*</span>
              </label>
              <input
                type="text"
                value={mainTitle}
                onChange={(e) => setMainTitle(e.target.value)}
                placeholder={isAr ? 'مثال: عيادة د. سارة العبيدي' : 'e.g., Dr. Sarah Clinic'}
                maxLength={45}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-sm font-semibold text-slate-900 transition-all outline-hidden bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Subtitle / Profession */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {isAr ? 'الصفة المهنية أو الاختصاص (Subtitle):' : 'Specialization / Profession:'}
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder={isAr ? 'مثال: اختصاصي جراحة العظام والمفاصل' : 'e.g., Orthopedic Surgery Specialist'}
                maxLength={60}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-xs sm:text-sm text-slate-900 transition-all outline-hidden bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Contact / Slogan line */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {isAr ? 'رقم الهاتف أو الشعار أو العنوان الفرعي:' : 'Phone, Slogan or Address:'}
              </label>
              <input
                type="text"
                value={contactLine}
                onChange={(e) => setContactLine(e.target.value)}
                placeholder={isAr ? 'مثال: 0770 123 4567 · بغداد - الكرادة' : 'e.g., Baghdad, Iraq'}
                maxLength={50}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-xs sm:text-sm text-slate-900 transition-all outline-hidden bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Arabic Font Typography Selection */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>{isAr ? 'نوع ونمط الخط العربي' : 'Arabic Calligraphy Style'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {ARABIC_FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font)}
                  type="button"
                  className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                    selectedFont.id === font.id
                      ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-2 ring-purple-600/15'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">
                    {isAr ? font.nameAr : font.nameEn}
                  </span>
                  <span
                    className="text-base text-purple-800 font-bold block mt-1 line-clamp-1"
                    style={{ fontFamily: font.cssFamily }}
                  >
                    {isAr ? 'نون والقلم' : 'Noon & Pen'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Material & LED Lighting Glow Selection */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                3
              </span>
              <span>{isAr ? 'الخامة ولون إضاءة الـ LED' : 'Material Finish & LED Glow'}</span>
            </h3>

            {/* Material Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {isAr ? 'خامة الأكريليك والسطح:' : 'Acrylic Surface & Finish:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    type="button"
                    className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                      selectedMaterial.id === mat.id
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/15'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">
                      {isAr ? mat.labelAr : mat.labelEn}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {mat.priceAdd > 0 ? `+$${mat.priceAdd}` : isAr ? 'السعر الأساسي' : 'Included'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* LED Glow Options (If available for this product) */}
            {product.ledOptions && product.ledOptions.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  {isAr ? 'لون إضاءة الـ LED النيون:' : 'LED Lighting Glow Color:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.ledOptions.map((led) => (
                    <button
                      key={led.id}
                      onClick={() => setSelectedLed(led)}
                      type="button"
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        selectedLed.id === led.id
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: led.hex }}
                      />
                      <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                        {isAr ? led.nameAr : led.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standoff Hardware Choice */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                {isAr ? 'مسامير التثبيت الجدارية الديكورية (Standoffs):' : 'Mounting Standoff Screws:'}
              </label>
              <div className="flex items-center gap-2">
                {STANDOFF_FINISHES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStandoff(st)}
                    type="button"
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedStandoff.id === st.id
                        ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600/15'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: st.hex }}
                    />
                    <span>{isAr ? st.nameAr : st.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4: Logo / Emblem Integration */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                4
              </span>
              <span>{isAr ? 'إدراج الشعار أو الأيقونة' : 'Logo or Emblem Badge'}</span>
            </h3>

            {/* Upload or Choose emblem */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Upload Custom Logo Button */}
              <label className="p-4 rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/30 hover:bg-purple-50/70 transition-all flex flex-col items-center justify-center text-center cursor-pointer group">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Upload className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-bold text-slate-900">
                  {logoFileName || (isAr ? 'رفع شعارك الخاص' : 'Upload Your Logo')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, SVG</span>
              </label>

              {/* Remove logo if active */}
              {logoPreview && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <img src={logoPreview} alt="Uploaded logo" className="w-10 h-10 object-contain rounded-lg border bg-white p-1" />
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{logoFileName}</span>
                  </div>
                  <button
                    onClick={() => {
                      setLogoPreview(null);
                      setLogoFileName('');
                    }}
                    type="button"
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Preset Emblems Pills */}
            {!logoPreview && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 block">
                  {isAr ? 'أو اختر أيقونة اختصاصك الجاهزة للوح:' : 'Or choose a profession badge:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {EMBLEMS.map((emb) => {
                    const Icon = emb.icon;
                    return (
                      <button
                        key={emb.id}
                        onClick={() => setSelectedEmblem(emb.id)}
                        type="button"
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          selectedEmblem === emb.id
                            ? 'border-purple-600 bg-purple-600 text-white shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{isAr ? emb.nameAr : emb.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Section 5: Dimension & Pricing & Quantity */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                5
              </span>
              <span>{isAr ? 'المقاس والكمية والتسعير' : 'Dimensions & Quantity'}</span>
            </h3>

            {/* Dimension Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {product.dimensions.map((dim) => (
                <button
                  key={dim.id}
                  onClick={() => setSelectedDimension(dim)}
                  type="button"
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedDimension.id === dim.id
                      ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/15'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-extrabold text-slate-900 block">
                    {isAr ? dim.labelAr : dim.labelEn}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    {dim.widthCm}×{dim.heightCm} {isAr ? 'سم' : 'cm'}
                  </span>
                </button>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {isAr ? 'الكمية المطلوبة:' : 'Quantity:'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  {pricing.discountPercent > 0
                    ? isAr
                      ? `خصم كميات مفعّل: ${pricing.discountPercent}%!`
                      : `Tier discount applied: ${pricing.discountPercent}%!`
                    : isAr
                    ? 'اطلب أكثر من 10 قطع للحصول على خصم خاص'
                    : 'Order > 10 pcs for volume discount'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(product.minQuantity || 1, quantity - 1))}
                  type="button"
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  -
                </button>
                <span className="font-mono font-black text-slate-900 text-base w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  type="button"
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-purple-50 via-white to-indigo-50 border border-purple-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  {isAr ? 'المجموع النهائي للطلب المخصص:' : 'Total Custom Order Price:'}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-purple-700 font-mono">
                    ${pricing.totalPriceUSD}
                  </span>
                  <span className="text-xs text-slate-600 font-bold">
                    ({pricing.totalPriceIQD.toLocaleString()} {isAr ? 'د.ع' : 'IQD'})
                  </span>
                </div>
              </div>

              <div className="text-end">
                <span className="text-[10px] text-slate-400 block font-mono">
                  ${pricing.unitPriceUSD} / {isAr ? 'قطعة' : 'pc'}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'جاهز للتنفيذ' : 'Ready to Craft'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* THE MASTER CTA: APPROVE DESIGN & SUBMIT ORDER */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleFinalizeAndOrder}
              type="button"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-purple-600/30 hover:scale-101 active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <FileCheck className="w-5 h-5 text-amber-300" />
              <span>
                {isAr
                  ? 'اعتماد التصميم ورفع الطلب الآن (جاهز للقص الليزري)'
                  : 'Approve Design & Submit Order (Ready for CNC)'}
              </span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>{isAr ? 'ضمان جودة الأكريليك 100%' : '100% Cast Acrylic'}</span>
              </span>
              <span>{isAr ? 'توصيل لبغداد وكافة المحافظات العراقية' : 'Iraq Nationwide Delivery'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
