import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Flame,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  Sparkles,
  RefreshCw,
  Gift,
  Eye,
  Sliders,
  CheckCircle2,
  Phone,
  MessageCircle,
  Share2,
  Filter,
  BarChart3,
  Globe,
  Bot,
  Zap,
  Target,
  Send,
  ArrowRight,
  X,
  MapPin,
  ChevronRight,
  Video,
} from 'lucide-react';
import { useAdminStore, getUnifiedProducts, LandingPageCampaign } from '../../store/useAdminStore';
import { SUPPORTED_COUNTRIES, getCountryByName, CountryInfo } from '../../data/geoData';

interface CampaignsManagementTabProps {
  onOpenPreview?: (productId?: string) => void;
  onNavigateToOrchestrator?: () => void;
  onNavigateToROAS?: () => void;
}

export type AdPlatformId = 'tiktok' | 'facebook' | 'instagram' | 'snapchat' | 'google' | 'direct';

interface AdPlatformConfig {
  id: AdPlatformId;
  nameAr: string;
  nameEn: string;
  badgeLabel: string;
  badgeClass: string;
  accentClass: string;
  iconName: string;
  defaultMedium: string;
  descriptionAr: string;
}

const SUPPORTED_PLATFORMS: AdPlatformConfig[] = [
  {
    id: 'tiktok',
    nameAr: 'تيك توك (TikTok Ads)',
    nameEn: 'TikTok Ads',
    badgeLabel: 'TikTok',
    badgeClass: 'bg-stone-900 border border-stone-700 text-amber-300',
    accentClass: 'hover:border-stone-800 bg-stone-900/5',
    iconName: '🎵',
    defaultMedium: 'paid_social',
    descriptionAr: 'الفيديوهات القصيرة، إعلانات Spark Ads، وإعلانات الحسابات الشخصية',
  },
  {
    id: 'facebook',
    nameAr: 'فيسبوك (Facebook / Meta)',
    nameEn: 'Facebook / Meta',
    badgeLabel: 'Facebook',
    badgeClass: 'bg-blue-600 text-white',
    accentClass: 'hover:border-blue-300 bg-blue-50/20',
    iconName: '👤',
    defaultMedium: 'paid_social',
    descriptionAr: 'منشورات ممولة، إعلانات خلاصة الأخبار، وحملات الرسائل والتحويلات',
  },
  {
    id: 'instagram',
    nameAr: 'انستغرام (Instagram Reels & Ads)',
    nameEn: 'Instagram Reels & Ads',
    badgeLabel: 'Instagram',
    badgeClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    accentClass: 'hover:border-pink-300 bg-pink-50/20',
    iconName: '📸',
    defaultMedium: 'social_story',
    descriptionAr: 'إعلانات الريلز (Reels)، الستوري، ورابط البايو والمؤثرين',
  },
  {
    id: 'snapchat',
    nameAr: 'سناب شات (Snapchat Ads)',
    nameEn: 'Snapchat Ads',
    badgeLabel: 'Snapchat',
    badgeClass: 'bg-yellow-400 text-stone-950 font-bold',
    accentClass: 'hover:border-yellow-300 bg-yellow-50/20',
    iconName: '👻',
    defaultMedium: 'paid_story',
    descriptionAr: 'إعلانات Story Ads و Single Image or Video Ads للجمهور المستهدف',
  },
  {
    id: 'google',
    nameAr: 'إعلانات جوجل (Google Search & Display)',
    nameEn: 'Google Search & Display',
    badgeLabel: 'Google',
    badgeClass: 'bg-red-600 text-white',
    accentClass: 'hover:border-red-300 bg-red-50/20',
    iconName: '🔍',
    defaultMedium: 'cpc',
    descriptionAr: 'بحث جوجل المباشر، شبكة Display الإعلانية، وحملات Performance Max',
  },
  {
    id: 'direct',
    nameAr: 'واتساب وتيليجرام ورابط البايو (Direct Links)',
    nameEn: 'Direct / WhatsApp / Bio',
    badgeLabel: 'Direct',
    badgeClass: 'bg-emerald-600 text-white',
    accentClass: 'hover:border-emerald-300 bg-emerald-50/20',
    iconName: '💬',
    defaultMedium: 'bio_link',
    descriptionAr: 'المراسلات المباشرة، قنوات تيليجرام، ورسائل الواتساب والبرودكاست',
  },
];

interface AICampaignResult {
  marketAnalysis: {
    targetAudienceAr: string;
    painPointAr: string;
    buyingTriggerAr: string;
    localAngleAr: string;
  };
  pricingStrategy: {
    recommendedPromoPrice: number;
    recommendedOriginalPrice: number;
    urgencyStockLeft: number;
    countdownHours: number;
  };
  landingPageCopy: {
    headlineAr: string;
    subheadlineAr: string;
    badgeTextAr: string;
    bulletPointsAr: string[];
  };
  orderBump: {
    titleAr: string;
    price: number;
    rationaleAr: string;
  };
  adScripts: {
    tiktok: { hookAr: string; bodyAr: string; ctaAr: string };
    facebook: { primaryTextAr: string; headlineAr: string; descriptionAr: string };
    instagram: { captionAr: string; hashtagsAr: string; storyIdeaAr: string };
    snapchat: { headlineAr: string; callToActionAr: string };
    google: { headlines: string[]; descriptions: string[]; keywords: string[] };
  };
}

export const CampaignsManagementTab: React.FC<CampaignsManagementTabProps> = ({
  onOpenPreview,
  onNavigateToOrchestrator,
  onNavigateToROAS,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const {
    campaign,
    updateCampaign,
    adminProducts,
    adminOrders,
    resetCampaignStats,
  } = useAdminStore();

  const allProducts = useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  // Selected Product for URL generator
  const [selectedAdProductId, setSelectedAdProductId] = useState<string>(campaign.productId);

  // Active Platform filter for orders
  const [activePlatformFilter, setActivePlatformFilter] = useState<'all' | AdPlatformId>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form local state initialized with current campaign
  const [formData, setFormData] = useState<LandingPageCampaign>(campaign);

  // AI Campaign Strategy Generator Modal & State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTargetProductId, setAiTargetProductId] = useState<string>(campaign.productId);
  const [aiCountryCode, setAiCountryCode] = useState<string>(
    SUPPORTED_COUNTRIES.find((c) => c.nameAr === (campaign.targetCountry || 'العراق'))?.code || 'IQ'
  );

  const selectedAiCountry = useMemo(() => {
    return SUPPORTED_COUNTRIES.find((c) => c.code === aiCountryCode) || SUPPORTED_COUNTRIES[0];
  }, [aiCountryCode]);

  const [aiCity, setAiCity] = useState<string>('كافة المحافظات والمدن');
  const [aiMarketingGoal, setAiMarketingGoal] = useState<string>('مبيعات فورية سريعة وتحويل عالي (High Conversion)');
  const [aiAdPlatform, setAiAdPlatform] = useState<string>('all');
  const [aiResult, setAiResult] = useState<AICampaignResult | null>(null);
  const [aiActiveTab, setAiActiveTab] = useState<'funnel' | 'strategy' | 'ads'>('funnel');

  // Synchronize when store campaign updates
  React.useEffect(() => {
    setFormData(campaign);
  }, [campaign]);

  // Base origin
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Generate URL for any given platform and optional product
  const generatePlatformUrl = (platformId: AdPlatformId, productId?: string) => {
    const slug = formData.slug || 'special-offer';
    const prodParam = productId && productId !== campaign.productId ? `&prod=${encodeURIComponent(productId)}` : '';
    const config = SUPPORTED_PLATFORMS.find((p) => p.id === platformId);
    const medium = config?.defaultMedium || 'paid_social';
    return `${origin}${pathname}?landing=true&utm_source=${platformId}&utm_medium=${medium}&utm_campaign=${encodeURIComponent(slug)}${prodParam}`;
  };

  const handleCopyLink = (key: string, url: string, platformName: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedKey(key);
      toast.success(
        isAr ? `تم نسخ رابط إعلان (${platformName}) بنجاح! جاهز للإطلاق.` : `${platformName} ad link copied!`
      );
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    updateCampaign(formData);
    toast.success(isAr ? 'تم حفظ وتحديث إعدادات صفحة الهبوط بنجاح!' : 'Landing page settings updated successfully!');
  };

  // Trigger AI Campaign Generation
  const handleGenerateAICampaign = async () => {
    const targetProd = allProducts.find((p) => p.id === aiTargetProductId) || allProducts[0];
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/campaign-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: targetProd.id,
          productTitle: targetProd.titleAr,
          category: targetProd.category,
          basePrice: targetProd.basePrice,
          targetCountry: selectedAiCountry.nameAr,
          targetCity: aiCity,
          marketingGoal: aiMarketingGoal,
          adPlatform: aiAdPlatform,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAiResult(data.data);
        toast.success(
          isAr
            ? `تم تحليل المنتج وصياغة الحملة بنجاح لدولة (${selectedAiCountry.nameAr})!`
            : `AI Campaign successfully crafted for ${selectedAiCountry.nameEn}!`
        );
      } else {
        throw new Error(data.error || 'Failed to generate campaign');
      }
    } catch (err: any) {
      console.error('AI Campaign Generation Error:', err);
      toast.error(isAr ? 'حدث خطأ أثناء التوليد، جاري تطبيق النموذج الذكي المدمج' : 'Generation notice');
    } finally {
      setIsGenerating(false);
    }
  };

  // 1-Click Apply AI Strategy to Live Landing Page
  const handleApplyAIToLandingPage = () => {
    if (!aiResult) return;

    const targetProd = allProducts.find((p) => p.id === aiTargetProductId) || allProducts[0];

    const updatedCampaign: Partial<LandingPageCampaign> = {
      productId: targetProd.id,
      targetCountry: selectedAiCountry.nameAr,
      targetCity: aiCity,
      headlineAr: aiResult.landingPageCopy.headlineAr,
      subheadlineAr: aiResult.landingPageCopy.subheadlineAr,
      badgeTextAr: aiResult.landingPageCopy.badgeTextAr,
      promoPriceIQD: aiResult.pricingStrategy.recommendedPromoPrice,
      originalPriceIQD: aiResult.pricingStrategy.recommendedOriginalPrice,
      urgencyStockLeft: aiResult.pricingStrategy.urgencyStockLeft,
      countdownHours: aiResult.pricingStrategy.countdownHours,
      bonusOfferTitleAr: aiResult.orderBump.titleAr,
      bonusOfferPriceIQD: aiResult.orderBump.price,
      bonusOfferEnabled: true,
      bulletPointsAr: aiResult.landingPageCopy.bulletPointsAr,
      isActive: true,
    };

    updateCampaign(updatedCampaign);
    setFormData((prev) => ({ ...prev, ...updatedCampaign }));
    setAiModalOpen(false);

    toast.success(
      isAr
        ? `🚀 تم اعتماد استراتيجية الذكاء الاصطناعي وتطبيقها على صفحة الهبوط الحية لدولة (${selectedAiCountry.nameAr})!`
        : `AI Strategy applied to live landing page!`
    );
  };

  // Filter campaign orders
  const campaignOrders = useMemo(() => {
    return adminOrders.filter((o) => {
      const isCampaign =
        o.source?.includes('campaign') ||
        (o.workshopNotes && (o.workshopNotes.includes('إعلان') || o.workshopNotes.includes('تيك توك') || o.workshopNotes.includes('فيسبوك')));
      if (!isCampaign) return false;

      if (activePlatformFilter === 'all') return true;
      if (activePlatformFilter === 'tiktok') return o.source?.includes('tiktok') || o.workshopNotes?.includes('تيك توك');
      if (activePlatformFilter === 'facebook') return o.source?.includes('facebook') || o.workshopNotes?.includes('فيسبوك');
      if (activePlatformFilter === 'instagram') return o.source?.includes('instagram') || o.workshopNotes?.includes('انستغرام');
      if (activePlatformFilter === 'snapchat') return o.source?.includes('snapchat') || o.workshopNotes?.includes('سناب');
      if (activePlatformFilter === 'google') return o.source?.includes('google') || o.workshopNotes?.includes('جوجل');
      if (activePlatformFilter === 'direct') return o.source?.includes('direct') || o.workshopNotes?.includes('مباشر');
      return true;
    });
  }, [adminOrders, activePlatformFilter]);

  // Calculate Overall Conversion Rate
  const overallConversionRate = useMemo(() => {
    if (!campaign.viewsCount || campaign.viewsCount === 0) return '0.0%';
    return `${((campaign.ordersCount / campaign.viewsCount) * 100).toFixed(1)}%`;
  }, [campaign.viewsCount, campaign.ordersCount]);

  // Aggregate stats per platform
  const statsPerPlatform = useMemo(() => {
    const defaultStats = campaign.platformStats || {};
    return SUPPORTED_PLATFORMS.map((p) => {
      const data = defaultStats[p.id] || { views: 0, orders: 0, revenue: 0 };
      const cr = data.views > 0 ? ((data.orders / data.views) * 100).toFixed(1) : '0.0';
      return {
        ...p,
        views: data.views,
        orders: data.orders,
        revenue: data.revenue,
        conversionRate: `${cr}%`,
      };
    });
  }, [campaign.platformStats]);

  // Identify Best Performing Platform
  const topPlatform = useMemo(() => {
    const sorted = [...statsPerPlatform].sort((a, b) => b.revenue - a.revenue);
    return sorted[0]?.revenue > 0 ? sorted[0] : null;
  }, [statsPerPlatform]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Live Campaign Status Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md">
              <Flame className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isAr ? 'مركز صفحات الهبوط والحملات الإعلانية المتعددة' : 'Multi-Channel Campaign Funnels Hub'}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    campaign.isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {campaign.isActive ? (isAr ? 'الحملات نشطة ✅' : 'Active') : (isAr ? 'متوقفة ⏸️' : 'Paused')}
                </span>
                {campaign.targetCountry && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    🌍 {campaign.targetCountry}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'صفحة هبوط ديناميكية معزولة ومربوطة بكافة منصات الإعلانات: تيك توك، فيسبوك، انستغرام، سناب شات، وجوجل مع تخصيص الدولة والمدينة'
                  : 'Distraction-free dynamic landing page for TikTok, Meta/Facebook, Instagram, Snapchat & Google Ads with Country/City targeting'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateCampaign({ isActive: !campaign.isActive })}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                campaign.isActive
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {campaign.isActive ? (isAr ? 'إيقاف الحملات مؤقتاً' : 'Pause Campaigns') : (isAr ? 'تفعيل الحملات' : 'Activate Campaigns')}
            </button>

            {onOpenPreview && (
              <button
                type="button"
                onClick={() => onOpenPreview(selectedAdProductId)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{isAr ? 'معاينة صفحة الهبوط الحية' : 'Preview Live Funnel'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Performance Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium">{isAr ? 'إجمالي النقرات والزيارات' : 'Total Ad Clicks'}</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              {campaign.viewsCount.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <div className="text-[11px] text-emerald-800 font-medium">{isAr ? 'الطلبات المحققة' : 'Converted Orders'}</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-0.5">
              {campaign.ordersCount.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200">
            <div className="text-[11px] text-purple-800 font-medium">{isAr ? 'معدل التحويل العام (CR)' : 'Overall CR%'}</div>
            <div className="text-xl sm:text-2xl font-black text-purple-700 font-mono mt-0.5">
              {overallConversionRate}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="text-[11px] text-amber-900 font-medium">{isAr ? 'إجمالي مبيعات الحملات' : 'Campaign Revenue'}</div>
            <div className="text-lg sm:text-xl font-black text-amber-950 font-mono mt-0.5">
              {campaign.totalRevenueIQD.toLocaleString()} د.ع
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI CAMPAIGN DIRECTOR BANNER (مدير التسويق الذكي بضغطة زر) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 p-5 sm:p-7 border-2 border-purple-500/50 shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/90 text-purple-200 text-xs font-bold border border-purple-400/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{isAr ? 'نظام الذكاء الاصطناعي لإنشاء وتخصيص الحملات (AI Campaign Engine)' : 'AI Campaign Strategy & Funnel Generator'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? 'اختر أي منتج، حدد الدولة والمدينة، ودع الذكاء يصنع الحملة فوراً!' : 'Select Product & Geo-Targeting, Let AI Craft the Funnel Instantly!'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {isAr
                ? 'يحلل الذكاء الاصطناعي خامة ومواصفات القطعة وسيكولوجية الشراء في الدولة والمدينة المختارة، ويولد استراتيجية التسعير، نصوص صفحة الهبوط، وصفقة زيادة السلة، وسكربتات الفيديو لتيك توك وفيسبوك.'
                : 'AI analyzes materials, target country/city buying psychology, generates pricing, copy, order bump & ad video scripts with 1-click deployment.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onNavigateToOrchestrator && (
              <button
                type="button"
                onClick={onNavigateToOrchestrator}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-stone-950" />
                <span>{isAr ? '⚡ وحدة التحكم الذكية (AI Orchestrator)' : 'AI Orchestrator Console'}</span>
              </button>
            )}

            {onNavigateToROAS && (
              <button
                type="button"
                onClick={onNavigateToROAS}
                className="px-5 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'العائد الإعلاني ROAS ومبيعات الحملات 📊' : 'Campaigns ROAS 📊'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setAiTargetProductId(selectedAdProductId || campaign.productId);
                setAiModalOpen(true);
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'النافذة السريعة' : 'Quick Generator'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MULTI-PLATFORM LINK GENERATOR & ATTRIBUTION (مولّد روابط المنصات وتتبع الإعلانات) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-black text-slate-900">
                {isAr ? 'مولّد روابط الإعلانات المخصصة حسب المنصة' : 'Multi-Platform Ad Destination Links'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'انسخ الرابط الخاص بكل منصة وضعه في إعلانك ليتعرف النظام تلقائياً على مصدر العميل ويخصص التجربة'
                : 'Copy the unique link for each ad network to track conversions and auto-tailor the customer funnel'}
            </p>
          </div>

          {/* Dynamic Product Switcher for the Link Generator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
              {isAr ? 'المنتج المستهدف:' : 'Target Product:'}
            </span>
            <select
              value={selectedAdProductId}
              onChange={(e) => setSelectedAdProductId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-900 cursor-pointer focus:outline-none focus:border-purple-500 max-w-xs"
            >
              {allProducts.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.titleAr} ({prod.basePrice.toLocaleString()} د.ع)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SUPPORTED_PLATFORMS.map((platform) => {
            const url = generatePlatformUrl(platform.id, selectedAdProductId);
            const isCopied = copiedKey === platform.id;
            const stat = statsPerPlatform.find((s) => s.id === platform.id);

            return (
              <div
                key={platform.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 bg-white ${platform.accentClass} border-slate-200 hover:shadow-md`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{platform.iconName}</span>
                      <span className="text-xs font-black text-slate-900">{platform.nameAr}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${platform.badgeClass}`}>
                      {platform.badgeLabel}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    {platform.descriptionAr}
                  </p>

                  {/* Micro KPI Badge */}
                  {stat && (
                    <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                      <span className="text-slate-600">زيارات: <strong className="text-slate-900">{stat.views}</strong></span>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700">طلبات: <strong className="font-bold">{stat.orders}</strong></span>
                      <span className="text-slate-300">|</span>
                      <span className="text-purple-700">تحويل: <strong>{stat.conversionRate}</strong></span>
                    </div>
                  )}

                  {/* Generated URL Box */}
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={url}
                      className="w-full bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-600 outline-none select-all pe-16"
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(platform.id, url, platform.nameAr)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ رابط الإعلان</span>
                      </>
                    )}
                  </button>

                  {onOpenPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          const previewUrl = new URL(url);
                          window.history.replaceState({}, '', previewUrl.toString());
                        } catch {
                          // ignore
                        }
                        onOpenPreview(selectedAdProductId);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                      title={`معاينة صفحة الهبوط كزائر من ${platform.nameAr}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Platform Announcement */}
        {topPlatform && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">{topPlatform.iconName}</span>
              <div>
                <span className="font-black text-emerald-950">
                  أعلى منصة تحقيقاً للأرباح والعائد (Top ROI):
                </span>
                <span className="font-bold text-emerald-800 ms-1">
                  {topPlatform.nameAr} بإجمالي مبيعات {topPlatform.revenue.toLocaleString()} د.ع ومعدل تحويل {topPlatform.conversionRate}!
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
              موصى بزيادة ميزانية الإعلان 🚀
            </span>
          </div>
        )}
      </div>

      {/* 4. Campaign & Product Configurator Form */}
      <form onSubmit={handleSaveCampaign} className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-black text-slate-900">
              {isAr ? 'تخصيص نصوص العرض والأسعار والبلد المستهدف' : 'Customize Landing Page Copy & Geo-Targeting'}
            </h3>
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            {isAr ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
        </div>

        {/* Product Selection & Geo-Targeting */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'المنتج الافتراضي للحملة (Default Funnel Product):' : 'Default Funnel Product:'}</span>
            </label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titleAr} ({p.categoryLabelAr}) - {p.basePrice.toLocaleString()} د.ع
                </option>
              ))}
            </select>
          </div>

          {/* Country Setting */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'الدولة المستهدفة:' : 'Target Country:'}</span>
            </label>
            <select
              value={formData.targetCountry || 'العراق'}
              onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.nameAr}>
                  {c.flag} {c.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {isAr ? 'معرف الحملة (Slug):' : 'Campaign Slug:'}
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. tiktok-exclusive"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Pricing & Stock Scarcity */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-800">
              {isAr ? 'سعر العرض الترويجي (د.ع):' : 'Promo Price (IQD):'}
            </label>
            <input
              type="number"
              value={formData.promoPriceIQD}
              onChange={(e) => setFormData({ ...formData, promoPriceIQD: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-emerald-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">
              {isAr ? 'السعر الأصلي المشطوب (د.ع):' : 'Original Price (IQD):'}
            </label>
            <input
              type="number"
              value={formData.originalPriceIQD}
              onChange={(e) => setFormData({ ...formData, originalPriceIQD: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-800">
              {isAr ? 'مؤقت العداد التنازلي (ساعات):' : 'Countdown (Hours):'}
            </label>
            <input
              type="number"
              value={formData.countdownHours}
              onChange={(e) => setFormData({ ...formData, countdownHours: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-amber-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-red-800">
              {isAr ? 'الكمية المتبقية (مؤشر الندرة):' : 'Stock Scarcity Counter:'}
            </label>
            <input
              type="number"
              value={formData.urgencyStockLeft}
              onChange={(e) => setFormData({ ...formData, urgencyStockLeft: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-red-700"
            />
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {isAr ? 'العنوان التسويقي الرئيسي (Headline):' : 'Main Campaign Headline:'}
            </label>
            <input
              type="text"
              value={formData.headlineAr}
              onChange={(e) => setFormData({ ...formData, headlineAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {isAr ? 'العنوان الفرعي الإقناعي (Subheadline):' : 'Subheadline:'}
            </label>
            <textarea
              rows={2}
              value={formData.subheadlineAr}
              onChange={(e) => setFormData({ ...formData, subheadlineAr: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {isAr ? 'نص شارة الخصم (Discount Badge):' : 'Badge Pill Text:'}
            </label>
            <input
              type="text"
              value={formData.badgeTextAr}
              onChange={(e) => setFormData({ ...formData, badgeTextAr: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold"
            />
          </div>
        </div>

        {/* Order Bump Settings */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-black text-amber-950">
                {isAr ? 'صفقة التوفير الإضافية (Order Bump - لزيادة قيمة السلة):' : 'Order Bump Cross-Sell Deal:'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bonusOfferEnabled}
                onChange={(e) => setFormData({ ...formData, bonusOfferEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {formData.bonusOfferEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-700">عنوان العرض الإضافي:</label>
                <input
                  type="text"
                  value={formData.bonusOfferTitleAr}
                  onChange={(e) => setFormData({ ...formData, bonusOfferTitleAr: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">سعر العرض الإضافي (د.ع):</label>
                <input
                  type="number"
                  value={formData.bonusOfferPriceIQD}
                  onChange={(e) => setFormData({ ...formData, bonusOfferPriceIQD: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-mono font-bold text-amber-900"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm(isAr ? 'هل تريد تصفير عدادات وإحصائيات الحملات لبدء دورة إعلانية جديدة؟' : 'Reset campaign statistics?')) {
                resetCampaignStats();
                toast.success(isAr ? 'تم تصفير الإحصائيات' : 'Stats reset');
              }
            }}
            className="text-xs text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isAr ? 'تصفير إحصائيات الحملات' : 'Reset Funnel Stats'}</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {isAr ? 'حفظ إعدادات صفحة الهبوط والحملة' : 'Save Campaign Settings'}
          </button>
        </div>
      </form>

      {/* 5. Recent Campaign Orders Table with Platform Filter */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900">
              {isAr ? 'طلبات الحملات الإعلانية الواردة' : 'Incoming Campaign Orders'}
            </h3>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
              {campaignOrders.length}
            </span>
          </div>

          {/* Platform Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActivePlatformFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePlatformFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({adminOrders.filter((o) => o.source?.includes('campaign') || o.workshopNotes?.includes('إعلان')).length})
            </button>
            {SUPPORTED_PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePlatformFilter(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  activePlatformFilter === p.id
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{p.iconName}</span>
                <span>{p.badgeLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {campaignOrders.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            {isAr
              ? 'لم ترد أي طلبات حتى الآن من هذا المصدر الإعلاني. شارك روابط الحملات لتوليد أول مبيعة!'
              : 'No campaign orders recorded yet. Share the generated links to start converting!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold">
                  <th className="py-2.5 px-3 text-start">رقم الطلب</th>
                  <th className="py-2.5 px-3 text-start">منصة الإعلان</th>
                  <th className="py-2.5 px-3 text-start">العميل</th>
                  <th className="py-2.5 px-3 text-start">الدولة والمدينة</th>
                  <th className="py-2.5 px-3 text-start">المبلغ</th>
                  <th className="py-2.5 px-3 text-start">الحالة</th>
                  <th className="py-2.5 px-3 text-start">تواصل سريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaignOrders.map((order) => {
                  const source = (order.source || '').toLowerCase();
                  let platformMatch = SUPPORTED_PLATFORMS.find((p) => source.includes(p.id));
                  if (!platformMatch && order.workshopNotes) {
                    if (order.workshopNotes.includes('فيسبوك')) platformMatch = SUPPORTED_PLATFORMS[1];
                    else if (order.workshopNotes.includes('انستغرام')) platformMatch = SUPPORTED_PLATFORMS[2];
                    else if (order.workshopNotes.includes('سناب')) platformMatch = SUPPORTED_PLATFORMS[3];
                    else if (order.workshopNotes.includes('جوجل')) platformMatch = SUPPORTED_PLATFORMS[4];
                    else platformMatch = SUPPORTED_PLATFORMS[0];
                  }

                  const platformName = platformMatch ? platformMatch.nameAr : 'حملة إعلانية';

                  const whatsappLink = `https://wa.me/${order.shipping.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `مرحباً ${order.shipping.fullName}، نحن ورشة نون والقلم بخصوص طلبك (${order.orderId}) من عرض (${platformName}). نود تزويدك بالبروفة الهندسية لاعتمادها.`
                  )}`;

                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-950">
                        {order.orderId}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${platformMatch ? platformMatch.badgeClass : 'bg-slate-800 text-white'}`}>
                          {platformMatch ? `${platformMatch.iconName} ${platformMatch.badgeLabel}` : 'إعلان'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        <div>{order.shipping.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{order.shipping.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {order.shipping.governorate}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {order.grandTotal.toLocaleString()} د.ع
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          قيد التجهيز
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==============================================================
          AI CAMPAIGN STRATEGY & FUNNEL GENERATOR MODAL
         ============================================================== */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 text-white p-5 flex items-center justify-between border-b border-purple-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      استوديو الذكاء الاصطناعي لتوليد الحملات وصفحات الهبوط
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black">
                      AI CMO
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200">
                    توليد متكامل: استراتيجية، تسعير نفسي، صفحة هبوط، صفقة زيادة سلة، وسكربتات إعلانات فيديو
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              
              {/* Parameters Grid: Country, City, Product, Goal */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>1. تحديد المنتج وتخصيص الدولة والمدينة والهدف التسويقي:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Product */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">المنتج المراد تسويقه:</label>
                    <select
                      value={aiTargetProductId}
                      onChange={(e) => setAiTargetProductId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                    >
                      {allProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.titleAr} ({p.basePrice.toLocaleString()} د.ع)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country (تخصيص الدولة) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-purple-600" />
                      <span>الدولة المستهدفة:</span>
                    </label>
                    <select
                      value={aiCountryCode}
                      onChange={(e) => {
                        setAiCountryCode(e.target.value);
                        setAiCity('كافة المحافظات والمدن');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {SUPPORTED_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City (تخصيص المدينة) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" />
                      <span>المدينة / المنطقة في ({selectedAiCountry.nameAr}):</span>
                    </label>
                    <select
                      value={aiCity}
                      onChange={(e) => setAiCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="كافة المحافظات والمدن">🌍 كافة المدن والمحافظات (توصيل شامل)</option>
                      {selectedAiCountry.cities.map((ct) => (
                        <option key={ct} value={ct}>
                          {ct}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Marketing Goal */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">الهدف الإعلاني:</label>
                    <select
                      value={aiMarketingGoal}
                      onChange={(e) => setAiMarketingGoal(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="مبيعات فورية وتحويل عالي (High Conversion Flash Sale)">🔥 مبيعات سريعة فورية وعرض خاطف</option>
                      <option value="تعزيز الفخامة والبراند (Luxury Gifting & Prestige)">💎 بريستيج وفخامة وهدايا استثنائية</option>
                      <option value="موسم أعراس وحفلات وتخرج (Occasions & Weddings)">💍 موسم أعراس، تخرج، ومناسبات خاصة</option>
                      <option value="شركات ومطاعم ومكاتب B2B (Corporate & Packaging)">🏢 شركات ومطاعم وهويات بصرية B2B</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleGenerateAICampaign}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري التحليل وصياغة الحملة بالذكاء الاصطناعي...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>بدء التحليل وصياغة الحملة لـ {selectedAiCountry.nameAr} ⚡</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Generation Results Display */}
              {aiResult ? (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Results Navigation Tabs */}
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                      type="button"
                      onClick={() => setAiActiveTab('funnel')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        aiActiveTab === 'funnel'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ⚡ نصوص صفحة الهبوط والتسعير
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiActiveTab('strategy')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        aiActiveTab === 'strategy'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🎯 تحليل السوق وسيكولوجية العميل ({selectedAiCountry.nameAr})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiActiveTab('ads')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        aiActiveTab === 'ads'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🎬 سكربتات الفيديو لإعلانات المنصات
                    </button>
                  </div>

                  {/* Tab 1: Funnel & Pricing */}
                  {aiActiveTab === 'funnel' && (
                    <div className="space-y-4">
                      {/* Pricing Strategy Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <span className="text-[10px] text-amber-800 font-bold block">السعر الترويجي المقترح:</span>
                          <span className="text-xl font-black text-amber-950 font-mono">
                            {aiResult.pricingStrategy.recommendedPromoPrice.toLocaleString()} د.ع
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">السعر المشطوب (Anchor):</span>
                          <span className="text-base font-black text-slate-400 line-through font-mono">
                            {aiResult.pricingStrategy.recommendedOriginalPrice.toLocaleString()} د.ع
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-red-800 font-bold block">مؤشر الندرة المتبقي:</span>
                          <span className="text-base font-black text-red-700 font-mono">
                            {aiResult.pricingStrategy.urgencyStockLeft} قطع فقط
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-purple-800 font-bold block">العداد التنازلي:</span>
                          <span className="text-base font-black text-purple-700 font-mono">
                            {aiResult.pricingStrategy.countdownHours} ساعات
                          </span>
                        </div>
                      </div>

                      {/* Headline & Copy */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500">العنوان التسويقي الرئيسي (Headline):</span>
                          <div className="p-3 rounded-xl bg-slate-50 font-black text-sm text-slate-900 border border-slate-200">
                            {aiResult.landingPageCopy.headlineAr}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500">العنوان الفرعي المقنع:</span>
                          <div className="p-2.5 rounded-xl bg-slate-50 font-medium text-slate-700 border border-slate-200 leading-relaxed">
                            {aiResult.landingPageCopy.subheadlineAr}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500">شارة الخصم والندرة:</span>
                          <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                            {aiResult.landingPageCopy.badgeTextAr}
                          </div>
                        </div>

                        {/* Bullet Points */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-500">نقاط الحرفية وضمان الثقة (تقتل التردد):</span>
                          <div className="space-y-1.5">
                            {aiResult.landingPageCopy.bulletPointsAr.map((bp, i) => (
                              <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="text-slate-800">{bp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Order Bump Idea */}
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-amber-700" />
                            <span className="font-black text-amber-950">فكرة صفقة زيادة السلة (Order Bump):</span>
                          </div>
                          <span className="font-mono font-bold text-amber-900">
                            +{aiResult.orderBump.price.toLocaleString()} د.ع
                          </span>
                        </div>
                        <p className="font-bold text-slate-900">{aiResult.orderBump.titleAr}</p>
                        <p className="text-[11px] text-slate-600">{aiResult.orderBump.rationaleAr}</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Strategy & Buyer Psychology */}
                  {aiActiveTab === 'strategy' && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-purple-700">فئة المشترين المستهدفة في {selectedAiCountry.nameAr}:</span>
                        <p className="text-slate-900 font-medium leading-relaxed">{aiResult.marketAnalysis.targetAudienceAr}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-red-800">نقطة الألم الحقيقية (Pain Point):</span>
                        <p className="text-red-950 font-medium leading-relaxed">{aiResult.marketAnalysis.painPointAr}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-800">المحفز النفسي الحقيقي لسرعة الشراء (Buying Trigger):</span>
                        <p className="text-emerald-950 font-medium leading-relaxed">{aiResult.marketAnalysis.buyingTriggerAr}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-purple-900">الزاوية المحلية الخاصة بدولة {selectedAiCountry.nameAr} ومدينة {aiCity}:</span>
                        <p className="text-purple-950 font-medium leading-relaxed">{aiResult.marketAnalysis.localAngleAr}</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Platform Ad Scripts */}
                  {aiActiveTab === 'ads' && (
                    <div className="space-y-3">
                      {/* TikTok & Snapchat Video Script */}
                      <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2.5 border border-stone-800">
                        <div className="flex items-center gap-2 text-amber-300 font-bold">
                          <Video className="w-4 h-4" />
                          <span>سكريبت فيديو تيك توك وسناب شات (20 ثانية مقسمة بالثواني):</span>
                        </div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                            <strong className="text-amber-400 block mb-0.5">الثواني (0 - 3) [الخطاف Hook]:</strong>
                            <p className="text-stone-300">{aiResult.adScripts.tiktok.hookAr}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                            <strong className="text-amber-400 block mb-0.5">الثواني (3 - 14) [استعراض القطعة Body]:</strong>
                            <p className="text-stone-300">{aiResult.adScripts.tiktok.bodyAr}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                            <strong className="text-amber-400 block mb-0.5">الثواني (14 - 20) [الدعوة للطلب CTA]:</strong>
                            <p className="text-stone-300">{aiResult.adScripts.tiktok.ctaAr}</p>
                          </div>
                        </div>
                      </div>

                      {/* Facebook Copy */}
                      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                          <span>👤 نص إعلان فيسبوك المقترح (Problem-Solution-Proof):</span>
                        </div>
                        <p className="p-3 rounded-xl bg-white border border-blue-200 text-slate-800 whitespace-pre-line leading-relaxed">
                          {aiResult.adScripts.facebook.primaryTextAr}
                        </p>
                      </div>

                      {/* Instagram Caption */}
                      <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-pink-900 font-bold">
                          <span>📸 كابشن انستغرام ووسوم الهاشتاغ:</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-pink-200 text-slate-800 whitespace-pre-line leading-relaxed">
                          {aiResult.adScripts.instagram.captionAr}
                          <div className="text-purple-600 font-mono mt-2 text-[10px]">
                            {aiResult.adScripts.instagram.hashtagsAr}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1-CLICK DEPLOY BUTTON */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500">
                      سيتم تحديث صفحة الهبوط الحية بالأسعار، العناوين، الدولة ({selectedAiCountry.nameAr})، والمدينة ({aiCity}).
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyAIToLandingPage}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 active:scale-95 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>🚀 تطبيق الحملة على صفحة الهبوط الحية وتحديث العروض فوراً</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <Bot className="w-10 h-10 text-purple-600 mx-auto animate-bounce" />
                  <h5 className="font-bold text-slate-800 text-sm">جاهز لتحليل المنتج وسوق {selectedAiCountry.nameAr}</h5>
                  <p className="text-slate-500 text-xs max-w-md mx-auto">
                    اضغط زر «بدء التحليل وصياغة الحملة» أعلاه ليقوم الذكاء الاصطناعي ببناء استراتيجية كاملة تناسب الدولة والمدينة المختارة.
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
