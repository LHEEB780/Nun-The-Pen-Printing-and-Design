import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Sparkles,
  Bot,
  Zap,
  Target,
  MapPin,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  Clock,
  Globe,
  Languages,
  Video,
  Play,
  Flame,
  ShieldCheck,
  Eye,
  RefreshCw,
  Award,
  ChevronDown,
  Layers,
  ShoppingBag,
  Split,
  SlidersHorizontal,
  ArrowRightLeft,
  Trophy,
  Percent,
  BarChart3,
  Users,
  RotateCcw,
  Dices,
} from 'lucide-react';
import { useAdminStore, getUnifiedProducts, LandingPageCampaign } from '../../store/useAdminStore';
import { SUPPORTED_COUNTRIES, CountryInfo } from '../../data/geoData';

export interface OrchestratorResult {
  targetAudience: {
    demographicsAr: string;
    painPointsAr: string;
    buyingTriggersAr: string;
    geoStrategyAr: string;
  };
  platformRecommendations: Array<{
    platformId: 'tiktok' | 'instagram' | 'facebook' | 'snapchat' | 'google';
    nameAr: string;
    suitabilityScore: number;
    rank: number;
    rationaleAr: string;
    bestFormatAr: string;
  }>;
  copywriting: {
    fusha: {
      headline: string;
      hook: string;
      body: string;
      cta: string;
    };
    dialect: {
      dialectName: string;
      headline: string;
      hook: string;
      body: string;
      cta: string;
    };
    english: {
      headline: string;
      hook: string;
      body: string;
      cta: string;
    };
  };
  videoScript: {
    hook3s: string;
    showcase10s: string;
    cta7s: string;
  };
  landingPageSync: {
    headlineAr: string;
    subheadlineAr: string;
    badgeTextAr: string;
    promoPrice: number;
    originalPrice: number;
    bulletPointsAr: string[];
  };
  abTesting?: {
    variantA: {
      id: 'var_a';
      nameAr: string;
      angleAr: string;
      headlineAr: string;
      subheadlineAr: string;
      badgeTextAr: string;
      promoPrice: number;
      originalPrice: number;
      bulletPointsAr: string[];
    };
    variantB: {
      id: 'var_b';
      nameAr: string;
      angleAr: string;
      headlineAr: string;
      subheadlineAr: string;
      badgeTextAr: string;
      promoPrice: number;
      originalPrice: number;
      bulletPointsAr: string[];
    };
  };
}

interface AICampaignOrchestratorProps {
  onOpenPreview?: (productId?: string) => void;
  onNavigateToCampaigns?: () => void;
}

export const AICampaignOrchestrator: React.FC<AICampaignOrchestratorProps> = ({
  onOpenPreview,
  onNavigateToCampaigns,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const {
    adminProducts,
    campaign,
    updateCampaign,
    updateABTest,
    updateABVariant,
    simulateABTraffic,
    resetABTestStats,
    deployABWinner,
  } = useAdminStore();
  const allProducts = useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(
    campaign.productId || (allProducts[0] ? allProducts[0].id : '')
  );
  const activeProduct = useMemo(() => {
    return allProducts.find((p) => p.id === selectedProductId) || allProducts[0];
  }, [allProducts, selectedProductId]);

  const [customTitle, setCustomTitle] = useState<string>('');
  const [basePrice, setBasePrice] = useState<number>(activeProduct?.basePrice || 45000);
  const [category, setCategory] = useState<string>(activeProduct?.category || 'led');

  // Country & City Selection (Geographical Hierarchy)
  const [countryCode, setCountryCode] = useState<string>(() => {
    const existing = SUPPORTED_COUNTRIES.find((c) => c.nameAr === campaign.targetCountry);
    return existing ? existing.code : 'IQ';
  });

  const selectedCountry = useMemo(() => {
    return SUPPORTED_COUNTRIES.find((c) => c.code === countryCode) || SUPPORTED_COUNTRIES[0];
  }, [countryCode]);

  const [selectedCity, setSelectedCity] = useState<string>(
    campaign.targetCity || selectedCountry.cities[0] || 'كافة المدن'
  );

  // Dialect selection (defaults to selected country's native dialect)
  const [selectedDialectCode, setSelectedDialectCode] = useState<string>(selectedCountry.dialectCode);

  // Campaign Objective
  const [campaignGoal, setCampaignGoal] = useState<string>('مبيعات فورية سريعة وتحويل عالي (High Conversion)');

  // Orchestrator Execution State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orchestratorData, setOrchestratorData] = useState<OrchestratorResult | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [activeCopyTab, setActiveCopyTab] = useState<'fusha' | 'dialect' | 'english'>('dialect');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // A/B Testing Orchestrator State
  const [selectedABVariantTab, setSelectedABVariantTab] = useState<'var_a' | 'var_b'>('var_a');
  const [isSideBySideView, setIsSideBySideView] = useState<boolean>(true);
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState<boolean>(false);

  // When country changes, auto-update the default dialect and first city
  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    const countryObj = SUPPORTED_COUNTRIES.find((c) => c.code === newCode);
    if (countryObj) {
      setSelectedDialectCode(countryObj.dialectCode);
      setSelectedCity(countryObj.cities[0] || 'كافة المدن');
    }
  };

  // When product changes, update price and category
  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = allProducts.find((p) => p.id === prodId);
    if (prod) {
      setBasePrice(prod.basePrice);
      setCategory(prod.category);
      setCustomTitle(prod.titleAr);
    }
  };

  // Clipboard copy helper
  const handleCopy = (key: string, text: string, label: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(isAr ? `تم نسخ ${label} بنجاح!` : `${label} copied to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  // Run the Orchestrator
  const handleRunOrchestrator = async () => {
    setIsLoading(true);
    const titleToUse = customTitle.trim() || activeProduct?.titleAr || 'درع أكريليك مضيء 3D LED';

    try {
      const response = await fetch('/api/ai/campaign-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: titleToUse,
          category,
          basePrice,
          targetCountry: selectedCountry.nameAr,
          targetCity: selectedCity,
          targetDialect: selectedDialectCode,
          campaignGoal,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setOrchestratorData(json.data);
        setIsAiGenerated(Boolean(json.aiGenerated));

        // Sync AI generated A/B testing variants into store
        if (json.data.abTesting) {
          const { variantA, variantB } = json.data.abTesting;
          const currentAB = campaign.abTest;
          updateABTest({
            enabled: true,
            variantA: {
              ...(currentAB?.variantA || {
                id: 'var_a',
                nameAr: 'النسخة أ (الفخامة والتأثير العاطفي والإهداء)',
                nameEn: 'Variant A (Prestige & Emotion)',
                angleAr: 'التركيز على البريستيج والمكانة الاجتماعية وتخليد الذكرى والهدايا الملكية',
                angleEn: 'Luxury & Emotional Gifting',
                headlineAr: '',
                subheadlineAr: '',
                badgeTextAr: '',
                promoPriceIQD: 38000,
                originalPriceIQD: 58000,
                bulletPointsAr: [],
                viewsCount: 0,
                ordersCount: 0,
                totalRevenueIQD: 0,
              }),
              id: 'var_a',
              nameAr: variantA.nameAr || 'النسخة أ (الفخامة والتأثير العاطفي)',
              angleAr: variantA.angleAr || 'التركيز على الفخامة والمكانة والهدية الملكية',
              headlineAr: variantA.headlineAr,
              subheadlineAr: variantA.subheadlineAr,
              badgeTextAr: variantA.badgeTextAr,
              promoPriceIQD: variantA.promoPrice || 38000,
              originalPriceIQD: variantA.originalPrice || 58000,
              bulletPointsAr: variantA.bulletPointsAr || [],
            },
            variantB: {
              ...(currentAB?.variantB || {
                id: 'var_b',
                nameAr: 'النسخة ب (الدقة الهندسية والضمان الفولاذي)',
                nameEn: 'Variant B (Engineering & Risk Reversal)',
                angleAr: 'التركيز على المواصفات والبروفة المجانية والدفع بعد المعاينة',
                angleEn: 'Engineering Precision & Risk Reversal',
                headlineAr: '',
                subheadlineAr: '',
                badgeTextAr: '',
                promoPriceIQD: 38000,
                originalPriceIQD: 58000,
                bulletPointsAr: [],
                viewsCount: 0,
                ordersCount: 0,
                totalRevenueIQD: 0,
              }),
              id: 'var_b',
              nameAr: variantB.nameAr || 'النسخة ب (الدقة الهندسية والضمان الموثوق)',
              angleAr: variantB.angleAr || 'التركيز على المواصفات والبروفة المجانية والدفع بعد المعاينة',
              headlineAr: variantB.headlineAr,
              subheadlineAr: variantB.subheadlineAr,
              badgeTextAr: variantB.badgeTextAr,
              promoPriceIQD: variantB.promoPrice || 38000,
              originalPriceIQD: variantB.originalPrice || 58000,
              bulletPointsAr: variantB.bulletPointsAr || [],
            },
          });
        }

        toast.success(
          isAr
            ? `⚡ تم تشغيل وحدة التحكم بنجاح! اكتمل تحليل الجمهور وتوليد نسختي الاختبار A/B واقتراح المنصات لدولة (${selectedCountry.nameAr}).`
            : `AI Campaign Orchestration & A/B variants completed for ${selectedCountry.nameEn}!`
        );
      } else {
        throw new Error(json.error || 'Failed to execute orchestrator');
      }
    } catch (err: any) {
      console.error('Orchestrator Execution Error:', err);
      toast.error(isAr ? 'تعذر الاتصال بالمخدم الذكي، يرجى المحاولة لاحقاً' : 'Orchestrator request failed');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Apply to Live Landing Page
  const handleApplyToLiveLandingPage = () => {
    if (!orchestratorData) return;

    const sync = orchestratorData.landingPageSync;
    const updatePayload: Partial<LandingPageCampaign> = {
      productId: activeProduct?.id || campaign.productId,
      targetCountry: selectedCountry.nameAr,
      targetCity: selectedCity,
      headlineAr: sync.headlineAr,
      subheadlineAr: sync.subheadlineAr,
      badgeTextAr: sync.badgeTextAr,
      promoPriceIQD: sync.promoPrice,
      originalPriceIQD: sync.originalPrice,
      bulletPointsAr: sync.bulletPointsAr,
      isActive: true,
    };

    updateCampaign(updatePayload);
    toast.success(
      isAr
        ? `🚀 تم تطبيق الحملة فوراً على صفحة الهبوط الحية لدولة (${selectedCountry.nameAr} - ${selectedCity})!`
        : `Applied to live landing page successfully!`
    );
  };

  // Generate Platform URL for direct launch
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const getPlatformTrackingUrl = (platformId: string) => {
    const slug = campaign.slug || 'special-offer';
    const prodParam = activeProduct?.id ? `&prod=${encodeURIComponent(activeProduct.id)}` : '';
    return `${origin}${pathname}?landing=true&utm_source=${platformId}&utm_medium=paid_social&utm_campaign=${encodeURIComponent(slug)}${prodParam}`;
  };

  // A/B Testing Metrics & Derived Statistics
  const abTest = campaign.abTest;
  const varA = abTest?.variantA;
  const varB = abTest?.variantB;

  const viewsA = varA?.viewsCount || 0;
  const ordersA = varA?.ordersCount || 0;
  const revenueA = varA?.totalRevenueIQD || 0;
  const crA = viewsA > 0 ? (ordersA / viewsA) * 100 : 0;
  const aovA = ordersA > 0 ? Math.round(revenueA / ordersA) : 0;

  const viewsB = varB?.viewsCount || 0;
  const ordersB = varB?.ordersCount || 0;
  const revenueB = varB?.totalRevenueIQD || 0;
  const crB = viewsB > 0 ? (ordersB / viewsB) * 100 : 0;
  const aovB = ordersB > 0 ? Math.round(revenueB / ordersB) : 0;

  const totalABViews = viewsA + viewsB;
  const totalABOrders = ordersA + ordersB;
  const totalABRevenue = revenueA + revenueB;

  // Winner determination
  const { calculatedWinner, crUplift } = useMemo(() => {
    if (viewsA >= 8 && viewsB >= 8) {
      if (crB > crA) {
        const uplift = crA > 0 ? ((crB - crA) / crA) * 100 : 100;
        return { calculatedWinner: 'var_b' as const, crUplift: uplift };
      }
      if (crA > crB) {
        const uplift = crB > 0 ? ((crA - crB) / crB) * 100 : 100;
        return { calculatedWinner: 'var_a' as const, crUplift: uplift };
      }
    }
    return { calculatedWinner: null, crUplift: 0 };
  }, [viewsA, viewsB, crA, crB]);

  // Statistical Confidence Score heuristic
  const statisticalConfidence = useMemo(() => {
    if (totalABViews < 20) return 45;
    const diff = Math.abs(crA - crB);
    if (totalABViews > 250 && diff >= 1.5) return 98.6;
    if (totalABViews > 150 && diff >= 1.0) return 95.2;
    if (totalABViews > 80 && diff >= 0.8) return 91.4;
    return Math.min(99, Math.round(55 + diff * 12 + Math.min(30, totalABViews / 10)));
  }, [totalABViews, crA, crB]);

  // Generate direct landing URL for specific variant
  const getVariantTrackingUrl = (variantId: 'var_a' | 'var_b') => {
    const slug = campaign.slug || 'special-offer';
    const prodParam = activeProduct?.id ? `&prod=${encodeURIComponent(activeProduct.id)}` : '';
    return `${origin}${pathname}?landing=true&utm_campaign=${encodeURIComponent(slug)}&utm_content=${variantId}${prodParam}`;
  };

  // Simulate realistic traffic interaction
  const handleRunTrafficSimulation = () => {
    setIsSimulatingTraffic(true);
    simulateABTraffic(250);
    setTimeout(() => {
      setIsSimulatingTraffic(false);
      toast.success(
        isAr
          ? '🎲 تمت محاكاة +250 زيارة وتحويلات شرائية واقعية، وتحديث مقارنة معدلات التحويل للنسختين!'
          : 'Traffic simulation completed (+250 visits and conversions recorded)!'
      );
    }, 600);
  };

  // Deploy Winner to Live Landing Page
  const handleDeployWinner = (winnerId: 'var_a' | 'var_b') => {
    deployABWinner(winnerId);
    const winnerLabel = winnerId === 'var_a' ? 'النسخة أ (Variant A)' : 'النسخة ب (Variant B)';
    toast.success(
      isAr
        ? `👑 تم اعتماد ${winnerLabel} رسمياً ونشرها بنسبة 100% لكافة زوار صفحة الهبوط الحية!`
        : `${winnerLabel} deployed to 100% of live traffic!`
    );
  };

  return (
    <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Campaign Orchestrator • وحدة التحكم الذكية بالحملات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight leading-snug">
              توجيه وإطلاق الحملات الإعلانية متعددة المنصات والدول بذكاء اصطناعي
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed">
              اختر المنتج وحدد الدولة والمدينة، ليقوم النموذج الذكي بتحليل سلوك الشراء، واقتراح المنصات الإعلانية الأنسب، وصياغة نصوص بثلاث لغات ولهجات محلية، مع إمكانية التثبيت الفوري على صفحة الهبوط الحية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {orchestratorData && (
              <button
                type="button"
                onClick={handleApplyToLiveLandingPage}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-current text-amber-300" />
                <span>تطبيق على صفحة الهبوط الحية</span>
              </button>
            )}
            {onOpenPreview && (
              <button
                type="button"
                onClick={() => onOpenPreview(activeProduct?.id)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-sm font-semibold border border-stone-700 transition"
              >
                <Eye className="w-4 h-4" />
                <span>معاينة صفحة الهبوط</span>
              </button>
            )}
            {onNavigateToCampaigns && (
              <button
                type="button"
                onClick={onNavigateToCampaigns}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-sm font-semibold border border-stone-700 transition"
              >
                <Layers className="w-4 h-4" />
                <span>إدارة الروابط والإحصائيات</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Control Console: Inputs & Target Selectors */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">1. ضبط مدخلات المنتج والاستهداف الجغرافي</h2>
              <p className="text-xs text-stone-500">اختر المنتج ثم خصص الدولة والمدينة لتوليد استراتيجية مطابقة</p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
            خطوة 1 من 2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Product Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              اختيار المنتج من الكتالوج
            </label>
            <div className="relative">
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 pr-9 text-sm text-stone-800 font-medium focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titleAr} ({p.basePrice.toLocaleString()} {selectedCountry.currencyAr})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Target Country Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>الدولة المستهدفة</span>
              <span className="text-[10px] text-amber-600 font-normal">(تخصيص الخوارزمية)</span>
            </label>
            <div className="relative">
              <select
                value={countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 pr-9 text-sm text-stone-800 font-semibold focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {SUPPORTED_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.nameAr} ({country.currencyAr})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Target City Selector (Cascaded from Country) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>المدينة / المحافظة</span>
              <span className="text-[10px] text-stone-400 font-normal">(تخصيص محلي)</span>
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 pr-9 text-sm text-stone-800 font-medium focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="كافة المدن والمحافظات">كافة المدن والمحافظات ({selectedCountry.nameAr})</option>
                {selectedCountry.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Dialect Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>اللهجة التسويقية المعتمدة</span>
            </label>
            <div className="relative">
              <select
                value={selectedDialectCode}
                onChange={(e) => setSelectedDialectCode(e.target.value)}
                className="w-full appearance-none rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 pr-9 text-sm text-stone-800 font-medium focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.dialectCode}>
                    {c.flag} {c.dialectNameAr}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-stone-500 truncate">
              مثال: "{selectedCountry.dialectSample}"
            </p>
          </div>

          {/* Campaign Objective */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              الهدف التسويقي الرئيسي
            </label>
            <select
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              className="w-full appearance-none rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm text-stone-800 font-medium focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="مبيعات فورية سريعة وتحويل عالي (High Conversion)">مبيعات فورية سريعة وتحويل عالي (High Conversion)</option>
              <option value="هدايا ومناسبات خاصة وتكريم VIP">هدايا ومناسبات خاصة وتكريم VIP</option>
              <option value="استهداف أصحاب الشركات والمكاتب الفخمة B2B">استهداف أصحاب الشركات والمكاتب الفخمة B2B</option>
              <option value="إطلاق عرض ترويجي موسمي بتخفيض قوي">إطلاق عرض ترويجي موسمي بتخفيض قوي</option>
            </select>
          </div>

          {/* Base Price */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              السعر الأساسي المرجعي ({selectedCountry.currencyAr})
            </label>
            <div className="relative">
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm text-stone-800 font-semibold focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-bold">
                {selectedCountry.currencyCode}
              </span>
            </div>
          </div>
        </div>

        {/* Trigger Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>مدعوم بنموذج Gemini 3.8 Flash مع خوارزميات الاستهداف الجغرافي الذكي</span>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleRunOrchestrator}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-3 ${
              isLoading
                ? 'bg-amber-400 cursor-not-allowed opacity-90'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 hover:shadow-amber-500/25 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري استدعاء الذكاء الاصطناعي وتحليل السوق...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>⚡ تشغيل وحدة التحكم وتوليد الحملة الذكية</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Orchestrator Outputs Display */}
      {orchestratorData ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Execution Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  تم تحليل المنتج بنجاح لدولة: {selectedCountry.flag} {selectedCountry.nameAr} - {selectedCity}
                </h4>
                <p className="text-xs text-emerald-700">
                  {isAiGenerated
                    ? 'تم التوليد الحي المباشر عبر Google Gemini 3.8 Flash'
                    : 'تم توليد النموذج الذكي المدمج المخصص وفق أحدث قواعد التحويل'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyToLiveLandingPage}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>تطبيق فوري على صفحة الهبوط الحية</span>
            </button>
          </div>

          {/* Section 1: Target Audience & Geo Insights */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  1. تحليل الجمهور المستهدف والاستراتيجية الجغرافية
                </h3>
                <p className="text-xs text-stone-500">
                  خصوصية المشتري في {selectedCountry.nameAr} ودوافع اتخاذ قرار الشراء
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Demographics */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                  <span>الفئة المستهدفة والديموغرافيا</span>
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {orchestratorData.targetAudience.demographicsAr}
                </p>
              </div>

              {/* Buying Triggers */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1.5">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>المحفزات النفسية للطلب الفوري</span>
                </span>
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  {orchestratorData.targetAudience.buyingTriggersAr}
                </p>
              </div>

              {/* Pain Points */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 space-y-1.5">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>نقاط التردد والشك وكيفية تفكيكها</span>
                </span>
                <p className="text-xs text-rose-950/80 leading-relaxed">
                  {orchestratorData.targetAudience.painPointsAr}
                </p>
              </div>

              {/* Geo Strategy */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/60 space-y-1.5">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>الاستهداف الجغرافي ({selectedCountry.nameAr} - {selectedCity})</span>
                </span>
                <p className="text-xs text-sky-950/80 leading-relaxed">
                  {orchestratorData.targetAudience.geoStrategyAr}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Best Platform Recommendations (TikTok, Instagram, Facebook, Snapchat) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    2. المنصات الإعلانية المقترحة مرتبة حسب الفعالية
                  </h3>
                  <p className="text-xs text-stone-500">
                    بناءً على طبيعة المنتج المرئية (أكريليك/إضاءة LED/طباعة) وسلوك المستخدمين في {selectedCountry.nameAr}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full w-fit">
                توصيات مخصصة لطبيعة المنتج
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {orchestratorData.platformRecommendations.map((plat) => {
                const isFirst = plat.rank === 1;
                const trackingUrl = getPlatformTrackingUrl(plat.platformId);

                return (
                  <div
                    key={plat.platformId}
                    className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      isFirst
                        ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-300 shadow-md ring-2 ring-amber-400/20'
                        : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {isFirst && (
                      <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Award className="w-3 h-3" />
                        <span>الخيار الأول الأفضل (#1)</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-stone-900 text-sm">
                          {plat.nameAr}
                        </h4>
                        <span
                          className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                            plat.suitabilityScore >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : plat.suitabilityScore >= 80
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {plat.suitabilityScore}% ملائمة
                        </span>
                      </div>

                      {/* Suitability Meter */}
                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isFirst ? 'bg-amber-500' : 'bg-stone-600'
                          }`}
                          style={{ width: `${plat.suitabilityScore}%` }}
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <p className="text-stone-600 leading-relaxed font-normal">
                          {plat.rationaleAr}
                        </p>
                        <div className="p-2 rounded-xl bg-white border border-stone-200/70 text-[11px] text-stone-700">
                          <strong className="text-stone-900 block mb-0.5 font-bold">أفضل صيغة إعلانية:</strong>
                          <span>{plat.bestFormatAr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/60">
                      <button
                        type="button"
                        onClick={() => handleCopy(`plat-${plat.platformId}`, trackingUrl, `رابط تتبع إعلانات ${plat.nameAr}`)}
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        {copiedKey === `plat-${plat.platformId}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">تم نسخ الرابط!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ رابط الإعلان للحملة</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Tri-lingual & Dialect Copywriting Hub */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    3. مركز النصوص الإعلانية (عربي فصيح • لهجة محلية • إنجليزي فاخر)
                  </h3>
                  <p className="text-xs text-stone-500">
                    نصوص احترافية تكسر حاجز التمرير وجاهزة للنسخ بنقرة واحدة
                  </p>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="flex items-center bg-stone-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveCopyTab('dialect')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeCopyTab === 'dialect'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{selectedCountry.flag}</span>
                  <span>{orchestratorData.copywriting.dialect.dialectName || 'اللهجة المحلية'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCopyTab('fusha')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeCopyTab === 'fusha'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  العربية الفصحى
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCopyTab('english')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeCopyTab === 'english'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  English (Luxury)
                </button>
              </div>
            </div>

            {/* Active Tab Content */}
            {activeCopyTab === 'dialect' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">
                    اللهجة المعتمدة: {orchestratorData.copywriting.dialect.dialectName} ({selectedCountry.nameAr})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const d = orchestratorData.copywriting.dialect;
                      handleCopy(
                        'dialect-all',
                        `${d.headline}\n\n${d.hook}\n\n${d.body}\n\n${d.cta}`,
                        'النص الإعلاني باللهجة المحلية كاملاً'
                      );
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ النص الإعلاني كاملاً</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      العنوان الرئيسي (Headline):
                    </span>
                    <p className="text-base font-extrabold text-stone-900">
                      {orchestratorData.copywriting.dialect.headline}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                    <span className="text-[11px] font-bold text-amber-800 block mb-1">
                      الخطاف الافتتاحي لأول 3 ثوانٍ (Scroll Stopper Hook):
                    </span>
                    <p className="text-sm font-semibold text-amber-950">
                      "{orchestratorData.copywriting.dialect.hook}"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      النص الإعلاني الأساسي (Body Copy):
                    </span>
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                      {orchestratorData.copywriting.dialect.body}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                      الدعوة لاتخاذ إجراء باللغة المحكية (CTA):
                    </span>
                    <p className="text-sm font-bold text-emerald-950">
                      👉 {orchestratorData.copywriting.dialect.cta}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeCopyTab === 'fusha' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">
                    اللغة العربية الفصحى المعاصرة (مناسبة للإعلانات الرسمية وفيسبوك)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const f = orchestratorData.copywriting.fusha;
                      handleCopy(
                        'fusha-all',
                        `${f.headline}\n\n${f.hook}\n\n${f.body}\n\n${f.cta}`,
                        'النص الفصيح كاملاً'
                      );
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ النص الفصيح كاملاً</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      العنوان الفصيح (Headline):
                    </span>
                    <p className="text-base font-extrabold text-stone-900">
                      {orchestratorData.copywriting.fusha.headline}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                    <span className="text-[11px] font-bold text-amber-800 block mb-1">
                      الافتتاحية الجذابة (Hook):
                    </span>
                    <p className="text-sm font-semibold text-amber-950">
                      "{orchestratorData.copywriting.fusha.hook}"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      النص الإعلاني (Body Copy):
                    </span>
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                      {orchestratorData.copywriting.fusha.body}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                      الدعوة للطلب المباشر (CTA):
                    </span>
                    <p className="text-sm font-bold text-emerald-950">
                      👉 {orchestratorData.copywriting.fusha.cta}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeCopyTab === 'english' && (
              <div className="space-y-4" dir="ltr">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">
                    English Luxury & Corporate Copy
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const e = orchestratorData.copywriting.english;
                      handleCopy(
                        'english-all',
                        `${e.headline}\n\n${e.hook}\n\n${e.body}\n\n${e.cta}`,
                        'English Copy'
                      );
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All English Copy</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      Headline:
                    </span>
                    <p className="text-base font-extrabold text-stone-900 font-sans">
                      {orchestratorData.copywriting.english.headline}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                    <span className="text-[11px] font-bold text-amber-800 block mb-1">
                      Opening Hook:
                    </span>
                    <p className="text-sm font-semibold text-amber-950 font-sans">
                      "{orchestratorData.copywriting.english.hook}"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      Body Copy:
                    </span>
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-sans">
                      {orchestratorData.copywriting.english.body}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                      Call to Action (CTA):
                    </span>
                    <p className="text-sm font-bold text-emerald-950 font-sans">
                      👉 {orchestratorData.copywriting.english.cta}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: AI A/B Testing Suite & Live Conversion Rate Comparison */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-stone-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                  <Split className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      4. اختبار النسخ الإعلانية الذكي (A/B Testing) ومقارنة معدلات التحويل
                    </h3>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                      CR Optimizer
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    مقارنة زاوية الفخامة والإهداء (النسخة أ) مع زاوية الدقة الهندسية والضمان (النسخة ب) وتحديد الفائز بالبيانات
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Traffic Split Presets */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
                  <span className="text-[11px] text-stone-500 px-2 font-medium">توزيع الزوار:</span>
                  <button
                    type="button"
                    onClick={() => updateABTest({ trafficSplitPercentA: 50 })}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      (abTest?.trafficSplitPercentA || 50) === 50
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    50% / 50%
                  </button>
                  <button
                    type="button"
                    onClick={() => updateABTest({ trafficSplitPercentA: 70 })}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      (abTest?.trafficSplitPercentA || 50) === 70
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    70% أ / 30% ب
                  </button>
                  <button
                    type="button"
                    onClick={() => updateABTest({ trafficSplitPercentA: 30 })}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      (abTest?.trafficSplitPercentA || 50) === 30
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    30% أ / 70% ب
                  </button>
                </div>

                {/* View Switcher */}
                <button
                  type="button"
                  onClick={() => setIsSideBySideView(!isSideBySideView)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    isSideBySideView
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                  title="تبديل طريقة العرض"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>{isSideBySideView ? 'عرض جنباً إلى جنب' : 'عرض تبويبي'}</span>
                </button>

                {/* Traffic Simulator Button */}
                <button
                  type="button"
                  disabled={isSimulatingTraffic}
                  onClick={handleRunTrafficSimulation}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-75"
                >
                  <Dices className={`w-3.5 h-3.5 ${isSimulatingTraffic ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingTraffic ? 'جاري المحاكاة...' : '🎲 محاكاة تفاعل واقعي (+250)'}</span>
                </button>

                {/* Reset Stats */}
                <button
                  type="button"
                  onClick={() => {
                    resetABTestStats();
                    toast.info(isAr ? 'تم تصفير عدادات الزيارات ومعدلات التحويل للاختبار' : 'Stats reset');
                  }}
                  className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-medium transition"
                  title="تصفير الإحصائيات"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Performance Summary & Statistical Significance Banner */}
            <div className="rounded-2xl p-4 md:p-5 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    calculatedWinner ? 'bg-amber-500 text-stone-950' : 'bg-stone-700 text-stone-300'
                  }`}>
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      {calculatedWinner === 'var_b' ? (
                        <>
                          <span className="text-amber-400">👑 النسخة الرابحة الموصى بها: النسخة ب (الدقة الهندسية والضمان)</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            +{crUplift.toFixed(1)}% نمو التحويل
                          </span>
                        </>
                      ) : calculatedWinner === 'var_a' ? (
                        <>
                          <span className="text-amber-400">👑 النسخة الرابحة الموصى بها: النسخة أ (الفخامة والإهداء العاطفي)</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            +{crUplift.toFixed(1)}% نمو التحويل
                          </span>
                        </>
                      ) : (
                        <span>⚖️ نتائج متقاربة - الاختبار جاري لجمع عينة إحصائية حاسمة</span>
                      )}
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      إجمالي الزوار الخاضعين للاختبار: {totalABViews.toLocaleString()} زائر • إجمالي المبيعات: {totalABRevenue.toLocaleString()} {selectedCountry.currencyAr} ({totalABOrders} طلب)
                    </p>
                  </div>
                </div>

                {calculatedWinner && (
                  <button
                    type="button"
                    onClick={() => handleDeployWinner(calculatedWinner)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>اعتماد الفائز ونشره بنسبة 100% للعامة</span>
                  </button>
                )}
              </div>

              {/* Statistical Confidence Meter */}
              <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span>
                    مستوى الدقة والثقة الإحصائية: <strong className="text-white">{statisticalConfidence}%</strong>
                    {statisticalConfidence >= 90 ? ' (عينة معتمدة وكافية لاتخاذ القرار التسويقي)' : ' (ينصح بالمزيد من الزيارات)'}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-64">
                  <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        statisticalConfidence >= 90 ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${statisticalConfidence}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-stone-400">{statisticalConfidence}%</span>
                </div>
              </div>
            </div>

            {/* Tab switch if not in side-by-side mode */}
            {!isSideBySideView && (
              <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
                <button
                  type="button"
                  onClick={() => setSelectedABVariantTab('var_a')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedABVariantTab === 'var_a'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>النسخة أ (زاوية الفخامة والمشاعر)</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px] font-mono">
                    {crA.toFixed(1)}% CR
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedABVariantTab('var_b')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedABVariantTab === 'var_b'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>النسخة ب (زاوية الدقة الهندسية والضمان)</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px] font-mono">
                    {crB.toFixed(1)}% CR
                  </span>
                </button>
              </div>
            )}

            {/* Comparison Cards Grid */}
            <div className={`grid gap-6 ${isSideBySideView ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Variant A Card */}
              {(!isSideBySideView && selectedABVariantTab !== 'var_a') ? null : (
                <div
                  className={`relative rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                    calculatedWinner === 'var_a'
                      ? 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                      : 'bg-stone-50/50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {calculatedWinner === 'var_a' && (
                    <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[11px] font-extrabold flex items-center gap-1.5 shadow-md">
                      <Trophy className="w-3.5 h-3.5 fill-current" />
                      <span>النسخة الفائزة (Top Converting)</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Header Info */}
                    <div className="flex items-start justify-between gap-3 border-b border-stone-200/70 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-600 text-white text-xs font-black flex items-center justify-center">
                            أ
                          </span>
                          <h4 className="font-extrabold text-stone-900 text-base">
                            {varA?.nameAr || 'النسخة أ (الفخامة والتأثير العاطفي)'}
                          </h4>
                        </div>
                        <p className="text-xs text-amber-900/80 mt-1 font-medium">
                          {varA?.angleAr || 'التركيز على البريستيج والمكانة الاجتماعية وتخليد الذكرى والهدايا الملكية'}
                        </p>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="text-[10px] text-stone-500 block">معدل التحويل (CR):</span>
                        <span className="text-xl font-black text-amber-700 font-mono">
                          {crA.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Performance Metrics Row */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                        <span className="text-[10px] text-stone-500 block">الزيارات</span>
                        <strong className="text-sm font-bold text-stone-900 font-mono">{viewsA.toLocaleString()}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                        <span className="text-[10px] text-stone-500 block">الطلبات</span>
                        <strong className="text-sm font-bold text-emerald-700 font-mono">{ordersA.toLocaleString()}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                        <span className="text-[10px] text-stone-500 block">المبيعات</span>
                        <strong className="text-xs font-bold text-stone-900 font-mono">{revenueA.toLocaleString()}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                        <span className="text-[10px] text-stone-500 block">متوسط السلة</span>
                        <strong className="text-xs font-bold text-stone-800 font-mono">{aovA.toLocaleString()}</strong>
                      </div>
                    </div>

                    {/* Copywriting Elements Preview */}
                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 block">العنوان التسويقي المقترح:</span>
                        <p className="text-sm font-extrabold text-stone-900 leading-snug">
                          {varA?.headlineAr || orchestratorData.landingPageSync.headlineAr}
                        </p>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {varA?.subheadlineAr || orchestratorData.landingPageSync.subheadlineAr}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
                        <span className="font-bold text-amber-900">
                          {varA?.badgeTextAr || 'عرض الفخامة الحصري ⚡'}
                        </span>
                        <span className="font-extrabold text-stone-900 font-mono">
                          {(varA?.promoPriceIQD || orchestratorData.landingPageSync.promoPrice).toLocaleString()} {selectedCountry.currencyAr}
                        </span>
                      </div>

                      {/* Bullets */}
                      <div className="p-3 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-stone-500 block">محاور الإقناع المعتمدة في النسخة أ:</span>
                        {(varA?.bulletPointsAr || orchestratorData.landingPageSync.bulletPointsAr || []).slice(0, 3).map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-stone-700 text-[11px]">
                            <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar for Variant A */}
                  <div className="mt-5 pt-4 border-t border-stone-200/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy('utm-var-a', getVariantTrackingUrl('var_a'), 'رابط تتبع النسخة أ')}
                        className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        {copiedKey === 'utm-var-a' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">تم نسخ الرابط!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ رابط الإعلان (?utm_content=var_a)</span>
                          </>
                        )}
                      </button>

                      <a
                        href={getVariantTrackingUrl('var_a')}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-600 text-xs transition"
                        title="معاينة حية للنسخة أ في نافذة جديدة"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeployWinner('var_a')}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>اعتماد النسخة أ كنسخة حية رئيسية</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Variant B Card */}
              {(!isSideBySideView && selectedABVariantTab !== 'var_b') ? null : (
                <div
                  className={`relative rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                    calculatedWinner === 'var_b'
                      ? 'bg-gradient-to-b from-teal-50/80 via-white to-teal-50/30 border-teal-500 ring-2 ring-teal-400/30 shadow-lg'
                      : 'bg-stone-50/50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {calculatedWinner === 'var_b' && (
                    <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-[11px] font-extrabold flex items-center gap-1.5 shadow-md">
                      <Trophy className="w-3.5 h-3.5 fill-current" />
                      <span>النسخة الفائزة (Top Converting)</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Header Info */}
                    <div className="flex items-start justify-between gap-3 border-b border-stone-200/70 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-teal-700 text-white text-xs font-black flex items-center justify-center">
                            ب
                          </span>
                          <h4 className="font-extrabold text-stone-900 text-base">
                            {varB?.nameAr || 'النسخة ب (الدقة الهندسية والضمان الفولاذي)'}
                          </h4>
                        </div>
                        <p className="text-xs text-teal-900/80 mt-1 font-medium">
                          {varB?.angleAr || 'التركيز على المواصفات والبروفة المجانية والدفع بعد المعاينة وتفادي التردد'}
                        </p>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="text-[10px] text-stone-500 block">معدل التحويل (CR):</span>
                        <span className="text-xl font-black text-teal-800 font-mono">
                          {crB.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Performance Metrics Row */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                        <span className="text-[10px] text-stone-500 block">الزيارات</span>
                        <strong className="text-sm font-bold text-stone-900 font-mono">{viewsB.toLocaleString()}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                        <span className="text-[10px] text-stone-500 block">الطلبات</span>
                        <strong className="text-sm font-bold text-emerald-700 font-mono">{ordersB.toLocaleString()}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                        <span className="text-[10px] text-stone-500 block">المبيعات</span>
                        <strong className="text-xs font-bold text-stone-900 font-mono">{revenueB.toLocaleString()}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                        <span className="text-[10px] text-stone-500 block">متوسط السلة</span>
                        <strong className="text-xs font-bold text-stone-800 font-mono">{aovB.toLocaleString()}</strong>
                      </div>
                    </div>

                    {/* Copywriting Elements Preview */}
                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-teal-800 block">العنوان التسويقي المقترح:</span>
                        <p className="text-sm font-extrabold text-stone-900 leading-snug">
                          {varB?.headlineAr || 'دقة ليزرية 0.2 ملم وضمان معاينة قبل الدفع: استلم تحفتك بدون أي مخاطرة! 🛡️'}
                        </p>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {varB?.subheadlineAr || 'شاهد مجسمك ثلاثي الأبعاد واعتمد البروفة الهندسية بنفسك عبر واتساب قبل القص، والدفع عند الاستلام.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/70">
                        <span className="font-bold text-teal-900">
                          {varB?.badgeTextAr || 'ضمان ذهبي 100% بدون مخاطرة 🛡️'}
                        </span>
                        <span className="font-extrabold text-stone-900 font-mono">
                          {(varB?.promoPriceIQD || orchestratorData.landingPageSync.promoPrice).toLocaleString()} {selectedCountry.currencyAr}
                        </span>
                      </div>

                      {/* Bullets */}
                      <div className="p-3 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-stone-500 block">محاور الإقناع المعتمدة في النسخة ب:</span>
                        {(varB?.bulletPointsAr || [
                          'حق المعاينة الكاملة للمجسم والتجربة قبل دفع دينار واحد للمندوب',
                          'بروفة هندسية رقمية مجانية يجهزها المصمم وتعتمدها بنفسك قبل التنفيذ',
                          'أكريليك كاست نقي 100% شفاف معالج ضد الخدش والاصفرار ويدوم لسنوات',
                        ]).slice(0, 3).map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-stone-700 text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar for Variant B */}
                  <div className="mt-5 pt-4 border-t border-stone-200/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy('utm-var-b', getVariantTrackingUrl('var_b'), 'رابط تتبع النسخة ب')}
                        className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        {copiedKey === 'utm-var-b' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">تم نسخ الرابط!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ رابط الإعلان (?utm_content=var_b)</span>
                          </>
                        )}
                      </button>

                      <a
                        href={getVariantTrackingUrl('var_b')}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-600 text-xs transition"
                        title="معاينة حية للنسخة ب في نافذة جديدة"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeployWinner('var_b')}
                      className="w-full py-2.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-300" />
                      <span>اعتماد النسخة ب كنسخة حية رئيسية</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Strategy Insights & Next Steps */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-stone-500" />
                <span>
                  <strong>نصيحة التسويق:</strong> يتم توجيه الزوار تلقائياً وفق نسبة التقسيم المحددة ({abTest?.trafficSplitPercentA || 50}% للنسخة أ و {100 - (abTest?.trafficSplitPercentA || 50)}% للنسخة ب). عند استخدام روابط UTM، يتم إجبار عرض النسخة المحددة لضمان دقة قياس الحملات الإعلانية.
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: 20-Second Video Script */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    5. سيناريو تصوير الفيديو الإعلاني السريع (20 ثانية لتيك توك وريلز)
                  </h3>
                  <p className="text-xs text-stone-500">
                    مقسم بدقة حسب الثواني لتعظيم معدل إكمال المشاهدة (Watch Time)
                  </p>
                </div>
              </div>

              <span className="text-xs px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-bold">
                20 Seconds Framework
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Hook (0-3s) */}
              <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">
                    المرحلة 1: الخطاف (0 - 3 ثوانٍ)
                  </span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {orchestratorData.videoScript.hook3s}
                </p>
                <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-800">
                  💡 الهدف: كسر التمرير ومنع تخطي الفيديو.
                </div>
              </div>

              {/* Showcase (3-13s) */}
              <div className="p-5 rounded-2xl bg-stone-800 text-white space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400">
                    المرحلة 2: الاستعراض (3 - 13 ثانية)
                  </span>
                  <Play className="w-4 h-4 text-sky-400" />
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {orchestratorData.videoScript.showcase10s}
                </p>
                <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-700">
                  💡 الهدف: إبراز دقة الليزر وإضاءة الـ LED الفاخرة عن قرب.
                </div>
              </div>

              {/* CTA (13-20s) */}
              <div className="p-5 rounded-2xl bg-emerald-950 text-white space-y-3 relative overflow-hidden border border-emerald-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">
                    المرحلة 3: العرض والطلب (13 - 20 ثانية)
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {orchestratorData.videoScript.cta7s}
                </p>
                <div className="text-[10px] text-stone-400 pt-2 border-t border-emerald-900">
                  💡 الهدف: طمأنة الزبون بالدفع عند الاستلام والحث على الطلب.
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Live Landing Page Synchronization */}
          <div className="bg-gradient-to-r from-amber-500/10 via-white to-amber-500/10 rounded-3xl border-2 border-amber-500/40 p-6 md:p-8 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    6. المزامنة المباشرة مع صفحة الهبوط الحية (1-Click Sync)
                  </h3>
                  <p className="text-xs text-stone-600">
                    تطبيق فوري لنتائج التحليل والعناوين والأسعار على صفحة الهبوط العامة
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyToLiveLandingPage}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>اعتماد وتطبيق الحملة على صفحة الهبوط الآن</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-stone-500 block">العنوان المعتمد لصفحة الهبوط:</span>
                <p className="text-sm font-bold text-stone-900">
                  {orchestratorData.landingPageSync.headlineAr}
                </p>
                <p className="text-xs text-stone-600">
                  {orchestratorData.landingPageSync.subheadlineAr}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-stone-500 block">تسعير الحملة المقترح:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-emerald-600">
                    {orchestratorData.landingPageSync.promoPrice.toLocaleString()} {selectedCountry.currencyAr}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    {orchestratorData.landingPageSync.originalPrice.toLocaleString()} {selectedCountry.currencyAr}
                  </span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                  {orchestratorData.landingPageSync.badgeTextAr}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-stone-500 block">الاستهداف الجغرافي النشط:</span>
                <p className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{selectedCountry.flag} {selectedCountry.nameAr} - {selectedCity}</span>
                </p>
                <p className="text-[11px] text-stone-500">
                  سيتم توجيه خوارزمية الاستلام وحساب الشحن تلقائياً لعملائك في هذه المنطقة.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
