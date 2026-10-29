import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Gift,
  CheckCircle2,
  Lock,
  ChevronRight,
  Copy,
  Check,
  Coins,
  ShieldCheck,
  Zap,
  ShoppingBag,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  useAuthStore,
  calculateLoyaltyTier,
  LOYALTY_TIERS,
  LoyaltyTierInfo,
} from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { toast } from 'sonner';

interface LoyaltyPointsTrackerProps {
  variant?: 'compact' | 'full';
  onNavigateToShop?: () => void;
  onSelectTab?: (tab: string) => void;
}

interface RewardItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  pointsCost: number;
  discountCode: string;
  discountAmountIQD: number;
  icon: string;
  badgeAr: string;
  badgeEn: string;
}

const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'rew-10k-voucher',
    titleAr: 'قسيمة خصم 10,000 د.ع',
    titleEn: '10,000 IQD Discount Voucher',
    descriptionAr: 'خصم فوري صالح لجميع الطلبات والمطبوعات المخصصة بدون حد أدنى.',
    descriptionEn: 'Instant deduction applied at checkout for any bespoke print order.',
    pointsCost: 250,
    discountCode: 'LOYAL-10K',
    discountAmountIQD: 10000,
    icon: '🎟️',
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Popular',
  },
  {
    id: 'rew-foil-upgrade',
    titleAr: 'ترقية بصمة حرارية مذهبة مجانية',
    titleEn: 'Free Hot-Foil Gilding Upgrade',
    descriptionAr: 'إضافة تشطيب بصمة ذهبية أو فضية حرارية 3D لكروت الأعمال أو علب الهدايا.',
    descriptionEn: 'Add metallic luxury 3D foil stamping to business cards or rigid boxes.',
    pointsCost: 500,
    discountCode: 'GOLD-FOIL-FREE',
    discountAmountIQD: 25000,
    icon: '✨',
    badgeAr: 'قيمة مضافة',
    badgeEn: 'Best Value',
  },
  {
    id: 'rew-50k-voucher',
    titleAr: 'قسيمة خصم 50,000 د.ع',
    titleEn: '50,000 IQD VIP Voucher',
    descriptionAr: 'قسيمة نقدية كبرى تُخصم مباشرة من قيمة الطلبات الكبيرة والشركات.',
    descriptionEn: 'Substantial direct credit on corporate packages and bulk fabrication.',
    pointsCost: 1000,
    discountCode: 'VIP-50K-CREDIT',
    discountAmountIQD: 50000,
    icon: '👑',
    badgeAr: 'مكافأة مميزة',
    badgeEn: 'VIP Reward',
  },
  {
    id: 'rew-free-led-sign',
    titleAr: 'لوحة أكريليك مكتبية LED مخصصة مجاناً',
    titleEn: 'Free Bespoke Desktop LED Plaque',
    descriptionAr: 'تصنيع لوحة أكريليك 3D مكتبي مضيئة مخصصة بالكامل باسمك أو شعار شركتك.',
    descriptionEn: 'Free bespoke edge-lit acrylic award custom-crafted with your brand emblem.',
    pointsCost: 2000,
    discountCode: 'FREE-ACRYLIC-LED',
    discountAmountIQD: 115000,
    icon: '🏆',
    badgeAr: 'الجائزة الكبرى',
    badgeEn: 'Grand Perk',
  },
];

export const LoyaltyPointsTracker: React.FC<LoyaltyPointsTrackerProps> = ({
  variant = 'full',
  onNavigateToShop,
  onSelectTab,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { loyaltyPoints, pointsHistory, redeemedRewards, redeemReward } = useAuthStore();
  const { formatPrice } = useCurrencyStore();

  const { currentTier, nextTier, pointsToNextTier, progressPercentage } =
    calculateLoyaltyTier(loyaltyPoints);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [calcAmountIQD, setCalcAmountIQD] = useState<number>(100000);
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'redeemed'>('all');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(isAr ? `تم نسخ كود الخصم: ${code}` : `Copied promo code: ${code}`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeem = (reward: RewardItem) => {
    if (loyaltyPoints < reward.pointsCost) {
      toast.error(
        isAr
          ? `رصيدك الحالي (${loyaltyPoints.toLocaleString()} نقطة) لا يكفي لاستبدال هذه المكافأة (${reward.pointsCost.toLocaleString()} نقطة).`
          : `Insufficient points balance (${loyaltyPoints} pts). Need ${reward.pointsCost} pts.`
      );
      return;
    }

    const result = redeemReward({
      id: reward.id,
      pointsCost: reward.pointsCost,
      titleAr: reward.titleAr,
      titleEn: reward.titleEn,
      discountCode: reward.discountCode,
      discountAmountIQD: reward.discountAmountIQD,
    });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  // Filtered transactions for ledger
  const filteredHistory = pointsHistory.filter((tx) => {
    if (filterType === 'earned') return tx.points > 0;
    if (filterType === 'redeemed') return tx.points < 0;
    return true;
  });

  // Calculation simulator: 1 pt per 1,000 IQD * multiplier
  const estimatedPointsForCalc = Math.floor((calcAmountIQD / 1000) * currentTier.multiplier);

  // -------------------------------------------------------------
  // COMPACT VARIANT: For embedding on Overview tab
  // -------------------------------------------------------------
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 end-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Left / Start: Current balance and Tier */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md shadow-amber-500/20 ring-4 ring-amber-100 shrink-0">
              <Award className="w-7 h-7 text-white" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200/90 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-600 inline" />
                  <span>{isAr ? currentTier.nameAr : currentTier.nameEn}</span>
                  <span className="text-[10px] text-amber-700">({currentTier.multiplier}x)</span>
                </span>
                <span className="text-xs text-slate-500">
                  {isAr ? 'نظام مكافآت ولاء العملاء' : 'Loyalty Rewards Program'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-950 font-mono tracking-tight tabular-nums">
                  {loyaltyPoints.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-amber-800">
                  {isAr ? 'نقطة ولاء' : 'Loyalty Points'}
                </span>
              </div>
            </div>
          </div>

          {/* Right / End: Visual Progress Bar */}
          <div className="flex-1 max-w-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {isAr ? 'التقدم نحو المستوى التالي:' : 'Progress to next tier:'}
              </span>
              {nextTier ? (
                <span className="font-black text-amber-900">
                  {isAr
                    ? `باقي ${pointsToNextTier.toLocaleString()} نقطة للترقية إلى ${nextTier.nameAr}`
                    : `${pointsToNextTier.toLocaleString()} pts to unlock ${nextTier.nameEn}`}
                </span>
              ) : (
                <span className="font-black text-emerald-700">
                  {isAr ? 'وصلت إلى أعلى المستويات الملكية (VIP)' : 'Highest Tier Achieved (VIP)'}
                </span>
              )}
            </div>

            {/* Visual Bar */}
            <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Milestones labels under the bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono pt-0.5">
              <span>{currentTier.minPoints.toLocaleString()} {isAr ? 'نقطة' : 'pts'}</span>
              <span className="font-bold text-amber-900">{progressPercentage}%</span>
              <span>
                {nextTier ? `${nextTier.minPoints.toLocaleString()} ${isAr ? 'نقطة' : 'pts'}` : 'MAX'}
              </span>
            </div>
          </div>

          {/* Action button to open full rewards */}
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('loyalty')}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <Gift className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'استبدال النقاط والمكافآت' : 'Redeem Rewards'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL VARIANT: Dedicated Loyalty Hub Tab
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Main Tier Spotlight & Progress Hero Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-9 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 end-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -start-10 w-72 h-72 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Balance & Tier details */}
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'نادي النخبة ووفاء عملاء نُون والقَلَم' : 'Noon & Pen VIP Loyalty Club'}</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-medium">
                {isAr ? 'رصيد نقاط الولاء الحالي:' : 'Current Loyalty Points Balance:'}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white tabular-nums">
                  {loyaltyPoints.toLocaleString()}
                </span>
                <span className="text-base sm:text-lg font-bold text-amber-400">
                  {isAr ? 'نقطة معتمدة' : 'Verified Points'}
                </span>
              </div>
            </div>

            {/* Current Tier Badge */}
            <div className="flex items-center gap-3 pt-1">
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-amber-200 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{isAr ? currentTier.nameAr : currentTier.nameEn}</span>
                <span className="text-[11px] text-amber-300/80">({currentTier.multiplier}x مضاعف)</span>
              </div>
              <span className="text-xs text-slate-300">
                {isAr ? currentTier.taglineAr : currentTier.taglineEn}
              </span>
            </div>
          </div>

          {/* Next Tier Progress Box */}
          <div className="w-full lg:max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                {isAr ? 'المسار نحو الترقية القادمة' : 'Next Tier Progression'}
              </span>
              {nextTier ? (
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <span>{isAr ? nextTier.nameAr : nextTier.nameEn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400">VIP MAX</span>
              )}
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="relative w-full h-4 bg-slate-950/60 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>{currentTier.minPoints.toLocaleString()} {isAr ? 'نقطة' : 'pts'}</span>
                <span className="text-amber-300 font-bold">{progressPercentage}%</span>
                <span>
                  {nextTier ? `${nextTier.minPoints.toLocaleString()} ${isAr ? 'نقطة' : 'pts'}` : 'MAX'}
                </span>
              </div>
            </div>

            {/* Clear Callout Text */}
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/25 text-xs text-amber-200 flex items-start gap-2 leading-relaxed">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              {nextTier ? (
                <span>
                  {isAr ? (
                    <>
                      تحتاج <strong className="text-amber-300 font-mono font-black">{pointsToNextTier.toLocaleString()}</strong> نقطة إضافية للترقية إلى{' '}
                      <strong className="text-amber-300">{nextTier.nameAr}</strong> والاستفادة من{' '}
                      <span className="text-amber-200 underline">{nextTier.perksAr[1]}</span> ومضاعف{' '}
                      <span className="text-amber-300 font-bold">{nextTier.multiplier}x</span>!
                    </>
                  ) : (
                    <>
                      You need <strong className="text-amber-300 font-mono">{pointsToNextTier.toLocaleString()}</strong> more points to unlock{' '}
                      <strong className="text-amber-300">{nextTier.nameEn}</strong> with{' '}
                      <span className="text-amber-200">{nextTier.perksEn[1]}</span> and {nextTier.multiplier}x multiplier!
                    </>
                  )}
                </span>
              ) : (
                <span>
                  {isAr
                    ? 'تهانينا! أنت تتمتع بأعلى مستوى امتيازات VIP الملكية في المطبعة.'
                    : 'Congratulations! You enjoy our highest Platinum VIP privileges.'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Milestone Steps Along the Way */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {LOYALTY_TIERS.map((tier, idx) => {
            const isAchieved = loyaltyPoints >= tier.minPoints;
            const isCurrent = currentTier.id === tier.id;

            return (
              <div
                key={tier.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400/60 ring-2 ring-amber-400/30'
                    : isAchieved
                    ? 'bg-white/5 border-white/10 text-slate-300'
                    : 'bg-black/20 border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {idx === 0 && <Award className="w-4 h-4 text-amber-500" />}
                    {idx === 1 && <ShieldCheck className="w-4 h-4 text-slate-300" />}
                    {idx === 2 && <Crown className="w-4 h-4 text-amber-400" />}
                    {idx === 3 && <GemIcon className="w-4 h-4 text-indigo-300" />}
                    <span className="text-xs font-black">{isAr ? tier.nameAr : tier.nameEn}</span>
                  </div>
                  {isAchieved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-300">
                  {tier.minPoints.toLocaleString()} {isAr ? 'نقطة' : 'pts'}
                </div>
                <div className="text-[10px] text-amber-300 font-semibold mt-0.5">
                  {tier.multiplier}x {isAr ? 'مضاعف نقاط' : 'multiplier'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. How Points Work & Interactive Earning Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <span>{isAr ? 'كيف يعمل نظام احتساب النقاط التلقائي؟' : 'How Are Loyalty Points Earned?'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'تكسب النقاط تلقائياً مع كل عملية شراء بناءً على قيمة الطلب ومستوى عضويتك'
                  : 'Points are automatically credited with every purchase according to your order value and tier'}
              </p>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
              {isAr ? 'تحديث فوري' : 'Automated'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="text-xs font-black text-slate-900">
                {isAr ? '1 نقطة لكل 1,000 د.ع' : '1 pt per 1,000 IQD'}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {isAr
                  ? 'المعدل الأساسي على كافة المشتريات، مضروباً في مضاعف مستواك (حالياً 1.25x للمستوى الفضي).'
                  : 'Standard base rate on all purchases multiplied by your current tier tier factor.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-xs font-black text-slate-900">
                {isAr ? '+50 نقطة عند اعتماد البروفة' : '+50 pts on Proof Approval'}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {isAr
                  ? 'مكافأة فورية تضاف لحسابك بمجرد مراجعة واعتماد مسودة التصميم الفنية.'
                  : 'Instant bonus credited whenever you approve your digital craft proof.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-xs font-black text-slate-900">
                {isAr ? '+100 نقطة ترحيبية' : '+100 Welcome Bonus'}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {isAr
                  ? 'هدية توثيق حساب العميل والبدء برحلة التخصيص مع نُون والقَلَم.'
                  : 'Granted immediately upon account creation and verified profile completion.'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Simulator Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              <span>{isAr ? 'حاسبة نقاط طلبك القادم' : 'Points Calculator Simulator'}</span>
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isAr
                ? 'جرّب إدخال قيمة طلبك المتوقع وشاهد عدد النقاط التي ستكسبها بمستواك الحالي:'
                : 'Simulate your next order total to calculate points earned:'}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>{isAr ? 'قيمة الطلب:' : 'Order Total:'}</span>
                <span className="font-mono text-amber-900 text-sm">{calcAmountIQD.toLocaleString()} د.ع</span>
              </div>
              <input
                type="range"
                min="20000"
                max="500000"
                step="10000"
                value={calcAmountIQD}
                onChange={(e) => setCalcAmountIQD(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>20,000 د.ع</span>
                <span>250,000 د.ع</span>
                <span>500,000 د.ع</span>
              </div>
            </div>

            {/* Calculated Points Result Box */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200/90 text-center shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">
                {isAr ? 'النقاط المتوقعة من هذا الطلب:' : 'Estimated Points Earned:'}
              </span>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-3xl font-black font-mono text-amber-900 tabular-nums">
                  +{estimatedPointsForCalc}
                </span>
                <span className="text-xs font-bold text-amber-700">{isAr ? 'نقطة' : 'pts'}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                ({currentTier.multiplier}x {isAr ? `مضاعف ${currentTier.nameAr}` : 'tier multiplier'})
              </span>
            </div>
          </div>

          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              type="button"
              className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسوق الآن واكسب النقاط' : 'Shop & Earn Points'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Rewards Redemption Catalog (استبدال النقاط بمكافآت حصرية) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-600" />
              <span>{isAr ? 'كتالوج استبدال النقاط بالمكافآت والخصومات' : 'Rewards & Perks Catalog'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'استبدل نقاطك المجمّعة بقسائم خصم فورية أو ترقيات مجانية لكافة طلباتك القادمة'
                : 'Redeem your accumulated points for instant cash deductions or free handicraft upgrades'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200/80 self-start sm:self-auto">
            <span>{isAr ? 'رصيدك المتاح للاستبدال:' : 'Available balance:'}</span>
            <span className="font-mono text-sm text-slate-950 font-black">{loyaltyPoints.toLocaleString()}</span>
            <span>{isAr ? 'نقطة' : 'pts'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REWARDS_CATALOG.map((reward) => {
            const canAfford = loyaltyPoints >= reward.pointsCost;
            const alreadyRedeemed = redeemedRewards.some((r) => r.rewardCode === reward.discountCode);

            return (
              <div
                key={reward.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  canAfford
                    ? 'border-amber-200 bg-gradient-to-b from-amber-50/40 to-white hover:border-amber-400 hover:shadow-md'
                    : 'border-slate-200 bg-slate-50/50 opacity-90'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{reward.icon}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {isAr ? reward.badgeAr : reward.badgeEn}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {isAr ? reward.titleAr : reward.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {isAr ? reward.descriptionAr : reward.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-semibold">{isAr ? 'التكلفة:' : 'Cost:'}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-black text-base text-amber-900">
                        {reward.pointsCost.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700">{isAr ? 'نقطة' : 'pts'}</span>
                    </div>
                  </div>

                  {alreadyRedeemed ? (
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 block">
                          {isAr ? 'تم استبدالها بالفعل! كود الخصم:' : 'Redeemed! Promo Code:'}
                        </span>
                        <div className="flex items-center justify-center gap-1.5 font-mono text-xs font-black text-emerald-950 mt-0.5">
                          <span>{reward.discountCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(reward.discountCode)}
                            className="p-1 rounded text-emerald-700 hover:text-emerald-950 cursor-pointer"
                            title={isAr ? 'نسخ الكود' : 'Copy'}
                          >
                            {copiedCode === reward.discountCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{canAfford ? (isAr ? 'استبدال الآن' : 'Redeem Now') : (isAr ? 'نقاط غير كافية' : 'Locked')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Points Activity Ledger (سجل حركات النقاط) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>{isAr ? 'سجل حركات ومعاملات النقاط المكتسبة' : 'Points Activity & Transaction Ledger'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'تفاصيل كل نقطة تم اكتسابها من المشتريات والاعتمادات أو استبدالها بالمكافآت'
                : 'Detailed ledger of points earned from purchases, approvals, or redeemed for rewards'}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setFilterType('all')}
              type="button"
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'الكل' : 'All'} ({pointsHistory.length})
            </button>
            <button
              onClick={() => setFilterType('earned')}
              type="button"
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'earned'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'المكتسبة +' : 'Earned +'}
            </button>
            <button
              onClick={() => setFilterType('redeemed')}
              type="button"
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'redeemed'
                  ? 'bg-white text-rose-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'المستبدلة -' : 'Redeemed -'}
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3 text-start">{isAr ? 'التاريخ والوقت' : 'Date & Time'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'نوع الحركة' : 'Type'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'البيان والتفاصيل' : 'Description'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'الطلب المرتبط' : 'Related Order'}</th>
                <th className="py-3 px-3 text-end">{isAr ? 'تأثير النقاط' : 'Points'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((tx) => {
                const isPositive = tx.points > 0;

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {tx.type === 'purchase' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                          {isAr ? 'شراء طلب' : 'Purchase'}
                        </span>
                      )}
                      {tx.type === 'proof_approval' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold text-[10px]">
                          {isAr ? 'اعتماد بروفة' : 'Proof'}
                        </span>
                      )}
                      {tx.type === 'welcome_bonus' && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 font-bold text-[10px]">
                          {isAr ? 'ترحيب' : 'Welcome'}
                        </span>
                      )}
                      {tx.type === 'redemption' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 font-bold text-[10px]">
                          {isAr ? 'استبدال مكافأة' : 'Redemption'}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      {isAr ? tx.descriptionAr : tx.descriptionEn}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {tx.orderId ? (
                        <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                          {tx.orderId}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-end font-mono font-black text-sm whitespace-nowrap">
                      <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                        {isPositive ? `+${tx.points}` : tx.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Mini Gem Icon component
function GemIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M11 3v18" />
      <path d="M2 9h20" />
    </svg>
  );
}
