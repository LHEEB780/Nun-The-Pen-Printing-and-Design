import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Percent,
  Target,
  Sparkles,
  ShoppingBag,
  Package,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  Filter,
  Eye,
  Edit3,
  Layers,
  ChevronDown,
  Info,
  Calendar,
  X,
  FileText,
  User,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  useAdminStore,
  CampaignROASRecord,
  AdminOrderRecord,
} from '../../store/useAdminStore';

interface AdminCampaignROASTabProps {
  onNavigateToOrchestrator?: () => void;
  isAr?: boolean;
}

export const AdminCampaignROASTab: React.FC<AdminCampaignROASTabProps> = ({
  onNavigateToOrchestrator,
  isAr = true,
}) => {
  const {
    campaignRoasRecords,
    adminOrders,
    updateCampaignAdSpend,
    simulateAttributionOrder,
  } = useAdminStore();

  // Filters
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'paused'>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  // Modals
  const [inspectOrdersCampaign, setInspectOrdersCampaign] = useState<CampaignROASRecord | null>(null);
  const [inspectABTestCampaign, setInspectABTestCampaign] = useState<CampaignROASRecord | null>(null);
  const [editingSpendCampaign, setEditingSpendCampaign] = useState<CampaignROASRecord | null>(null);
  const [editSpendInput, setEditSpendInput] = useState<string>('');

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaignRoasRecords.filter((c) => {
      if (selectedPlatform !== 'all' && c.platform !== selectedPlatform) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      return true;
    });
  }, [campaignRoasRecords, selectedPlatform, selectedStatus]);

  // Aggregate Metrics
  const summary = useMemo(() => {
    const totalSpend = filteredCampaigns.reduce((sum, c) => sum + c.adSpendIQD, 0);
    const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.attributedRevenueIQD, 0);
    const totalOrders = filteredCampaigns.reduce((sum, c) => sum + c.ordersCount, 0);
    const totalViews = filteredCampaigns.reduce((sum, c) => sum + c.viewsCount, 0);

    // Blended ROAS
    const blendedRoas = totalSpend > 0 ? Number((totalRevenue / totalSpend).toFixed(2)) : 0;

    // Estimated COGS & Net Profit
    const totalCogs = filteredCampaigns.reduce(
      (sum, c) => sum + c.attributedRevenueIQD * (c.cogsPercent / 100),
      0
    );
    const netProfit = totalRevenue - totalSpend - totalCogs;
    const netMarginPercent = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const avgCPA = totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0;

    return {
      totalSpend,
      totalRevenue,
      totalOrders,
      totalViews,
      blendedRoas,
      netProfit,
      netMarginPercent,
      avgOrderValue,
      avgCPA,
    };
  }, [filteredCampaigns]);

  // Platform comparison chart data
  const platformChartData = useMemo(() => {
    const map: Record<string, { platformKey: string; nameAr: string; spend: number; revenue: number; orders: number }> = {
      tiktok: { platformKey: 'tiktok', nameAr: 'تيك توك (TikTok)', spend: 0, revenue: 0, orders: 0 },
      facebook: { platformKey: 'facebook', nameAr: 'فيسبوك (Meta)', spend: 0, revenue: 0, orders: 0 },
      instagram: { platformKey: 'instagram', nameAr: 'انستغرام (IG)', spend: 0, revenue: 0, orders: 0 },
      snapchat: { platformKey: 'snapchat', nameAr: 'سناب شات', spend: 0, revenue: 0, orders: 0 },
      google: { platformKey: 'google', nameAr: 'إعلانات جوجل', spend: 0, revenue: 0, orders: 0 },
    };

    campaignRoasRecords.forEach((c) => {
      const p = map[c.platform];
      if (p) {
        p.spend += c.adSpendIQD;
        p.revenue += c.attributedRevenueIQD;
        p.orders += c.ordersCount;
      }
    });

    return Object.values(map).map((item) => ({
      ...item,
      spendThousand: Math.round(item.spend / 1000),
      revenueThousand: Math.round(item.revenue / 1000),
      roas: item.spend > 0 ? Number((item.revenue / item.spend).toFixed(2)) : 0,
    }));
  }, [campaignRoasRecords]);

  // Campaign ROAS rank chart data
  const campaignRoasChartData = useMemo(() => {
    return filteredCampaigns.map((c) => {
      const roas = c.adSpendIQD > 0 ? Number((c.attributedRevenueIQD / c.adSpendIQD).toFixed(2)) : 0;
      return {
        id: c.id,
        shortName: c.campaignNameAr.length > 25 ? c.campaignNameAr.substring(0, 24) + '...' : c.campaignNameAr,
        roas,
        revenueIQD: c.attributedRevenueIQD,
        orders: c.ordersCount,
        platform: c.platform,
      };
    });
  }, [filteredCampaigns]);

  // ROAS Badge Color Helper
  const getRoasBadge = (roas: number) => {
    if (roas >= 4.0) {
      return {
        label: isAr ? 'عائد استثنائي' : 'Exceptional',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        textColor: 'text-emerald-700',
        icon: Flame,
      };
    }
    if (roas >= 2.5) {
      return {
        label: isAr ? 'أداء صحي ومربح' : 'Healthy Profit',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
        textColor: 'text-sky-700',
        icon: TrendingUp,
      };
    }
    if (roas >= 1.5) {
      return {
        label: isAr ? 'نقطة التعادل' : 'Break-even',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        textColor: 'text-amber-700',
        icon: AlertTriangle,
      };
    }
    return {
      label: isAr ? 'تحت التوقعات' : 'Underperforming',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      textColor: 'text-rose-700',
      icon: AlertTriangle,
    };
  };

  // Platform Details Helper
  const getPlatformDetails = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return { name: 'TikTok Ads', icon: '🎵', badgeClass: 'bg-stone-900 text-amber-300' };
      case 'facebook':
        return { name: 'Facebook (Meta)', icon: '👤', badgeClass: 'bg-blue-600 text-white' };
      case 'instagram':
        return { name: 'Instagram Reels', icon: '📸', badgeClass: 'bg-pink-600 text-white' };
      case 'snapchat':
        return { name: 'Snapchat Ads', icon: '👻', badgeClass: 'bg-yellow-400 text-stone-950 font-bold' };
      case 'google':
        return { name: 'Google Ads', icon: '🔍', badgeClass: 'bg-red-600 text-white' };
      default:
        return { name: 'Direct Links', icon: '💬', badgeClass: 'bg-emerald-600 text-white' };
    }
  };

  // Handle Edit Spend Submit
  const handleSaveSpend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpendCampaign) return;
    const num = Number(editSpendInput);
    if (isNaN(num) || num < 0) {
      toast.error(isAr ? 'يرجى إدخال مبلغ صحيح' : 'Please enter a valid amount');
      return;
    }
    updateCampaignAdSpend(editingSpendCampaign.id, num);
    toast.success(isAr ? 'تم تحديث ميزانية الإنفاق الإعلاني بنجاح' : 'Ad spend updated successfully');
    setEditingSpendCampaign(null);
  };

  // Handle Simulate Attribution Order
  const handleSimulateOrder = (campaignId: string) => {
    simulateAttributionOrder(campaignId);
    toast.success(
      isAr
        ? 'تمت محاكاة طلب شراء إعلاني جديد وربطه بالحملة بنجاح!'
        : 'Simulated ad attribution order placed successfully!'
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-stone-900" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner / Breadcrumb & Controls */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'لوحة قياس العائد الإعلاني ومبيعات الحملات (ROAS Studio)' : 'Campaign ROAS & Attribution Sub-Dashboard'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {isAr ? 'العائد على الإنفاق الإعلاني ومبيعات الحملات' : 'Ad Spend Return (ROAS) & Sales Attribution'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'ربط مباشر ومؤتمت بين استراتيجيات ونسخ الـ AI Campaign Orchestrator ومبيعات متجر نون والقلم الحقيقية، لحساب العائد الإعلاني (ROAS)، وصافي الأرباح، وتكلفة الاستحواذ لكل حملة على حدة.'
                : 'Direct correlation engine connecting AI Campaign Orchestrator funnels with actual store orders to calculate individual campaign ROAS, CPA, and net profit.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSimulateOrder(filteredCampaigns[0]?.id || 'roas-camp-1')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-md flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-stone-950" />
              <span>{isAr ? 'محاكاة طلب شراء إعلاني ⚡' : 'Simulate Ad Order ⚡'}</span>
            </button>

            {onNavigateToOrchestrator && (
              <button
                onClick={onNavigateToOrchestrator}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isAr ? 'فتح موجه الحملات بالذكاء الاصطناعي' : 'Open AI Orchestrator'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Platforms Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', labelAr: 'كافة المنصات', icon: '🌐' },
              { id: 'tiktok', labelAr: 'تيك توك', icon: '🎵' },
              { id: 'facebook', labelAr: 'فيسبوك', icon: '👤' },
              { id: 'instagram', labelAr: 'انستغرام', icon: '📸' },
              { id: 'snapchat', labelAr: 'سناب شات', icon: '👻' },
              { id: 'google', labelAr: 'جوجل', icon: '🔍' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  selectedPlatform === p.id
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.labelAr}</span>
              </button>
            ))}
          </div>

          {/* Time range toggle */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded-lg transition ${timeRange === '7d' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'}`}
            >
              7 {isAr ? 'أيام' : 'days'}
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-lg transition ${timeRange === '30d' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'}`}
            >
              30 {isAr ? 'يوماً' : 'days'}
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1 rounded-lg transition ${timeRange === 'all' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'}`}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Ad Spend */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>{isAr ? 'إجمالي الإنفاق الإعلاني' : 'Total Ad Spend'}</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 font-mono block">
              {summary.totalSpend.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">{isAr ? 'د.ع' : 'IQD'}</span>
            </span>
            <span className="text-xs text-stone-500 mt-1 block">
              ≈ ${(summary.totalSpend / 1500).toFixed(0)} USD عبر {filteredCampaigns.length} حملات
            </span>
          </div>
        </div>

        {/* Attributed Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>{isAr ? 'مبيعات المتجر المحققة' : 'Attributed Revenue'}</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 font-mono block">
              {summary.totalRevenue.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">{isAr ? 'د.ع' : 'IQD'}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{summary.totalOrders} {isAr ? 'طلباً حقيقياً مسجلاً' : 'verified store orders'}</span>
            </div>
          </div>
        </div>

        {/* Blended ROAS */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>{isAr ? 'متوسط العائد الإعلاني العام' : 'Blended ROAS'}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700 font-mono">
                {summary.blendedRoas}x
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +{Math.round((summary.blendedRoas - 1) * 100)}% ROI
              </span>
            </div>
            <p className="text-xs text-emerald-800 font-semibold mt-1">
              {isAr ? 'كل 1,000 د.ع إعلانات حققت 4,820 د.ع مبيعات' : '4.82x gross sales for every 1.0 spend'}
            </p>
          </div>
        </div>

        {/* Net Profit post Ad Spend */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>{isAr ? 'صافي الربح بعد الإعلانات والتصنيع' : 'Net Profit (Post-Ads & COGS)'}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 font-mono block">
              {summary.netProfit.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">{isAr ? 'د.ع' : 'IQD'}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold mt-1">
              <span>{isAr ? 'هامش ربح صافي:' : 'Net margin:'}</span>
              <span className="font-mono">{summary.netMarginPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROAS Guide Benchmark Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-stone-800">
              {isAr ? 'معايير تقييم كفاءة العائد الإعلاني (ROAS Scale):' : 'ROAS Profitability Benchmarks:'}
            </span>
          </div>
          <span className="text-[11px] text-stone-500">
            {isAr ? 'نقطة التعادل المحسوبة لدار نون والقلم هي 1.6x بناءً على تكلفة خامات الأكريليك والكرتون' : 'Break-even target is 1.6x based on raw materials & workshop overhead'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <p className="font-bold text-emerald-950">&gt; 4.0x (استثنائي)</p>
              <p className="text-[10px] text-emerald-700">{isAr ? 'مضاعفة الميزانية فوراً' : 'Scale aggressive'}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <div>
              <p className="font-bold text-sky-950">2.5x - 3.9x (صحي ومربح)</p>
              <p className="text-[10px] text-sky-700">{isAr ? 'أداء ممتاز مع الاستمرار' : 'Strong performance'}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div>
              <p className="font-bold text-amber-950">1.5x - 2.4x (تعادل متواضع)</p>
              <p className="text-[10px] text-amber-700">{isAr ? 'تحسين الاستهداف والنسخ' : 'Optimize ad creatives'}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div>
              <p className="font-bold text-rose-950">&lt; 1.5x (خسارة إعلانية)</p>
              <p className="text-[10px] text-rose-700">{isAr ? 'إيقاف الحملة فوراً' : 'Pause & redesign'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts: Spend vs Revenue & Campaign ROAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Platform Spend vs Attributed Revenue */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-stone-900">
                {isAr ? 'مقارنة الإنفاق الإعلاني مقابل الإيرادات المحققة حسب المنصة' : 'Ad Spend vs Revenue by Platform'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {isAr ? 'بالآلاف د.ع (أداء كل قناة إعلانية على حدة)' : 'In thousands IQD across channels'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="nameAr" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${(Number(value) * 1000).toLocaleString()} د.ع`,
                    name === 'spendThousand' ? (isAr ? 'الإنفاق الإعلاني' : 'Spend') : (isAr ? 'المبيعات المحققة' : 'Revenue'),
                  ]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend
                  formatter={(val) => (val === 'spendThousand' ? (isAr ? 'الإنفاق الإعلاني' : 'Ad Spend') : (isAr ? 'الإيرادات المحققة' : 'Attributed Revenue'))}
                />
                <Bar dataKey="spendThousand" fill="#f43f5e" radius={[6, 6, 0, 0]} name="spendThousand" />
                <Bar dataKey="revenueThousand" fill="#10b981" radius={[6, 6, 0, 0]} name="revenueThousand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Campaign ROAS Rank against 3.0x Target */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-stone-900">
                {isAr ? 'مضاعف العائد (ROAS) لكل حملة' : 'Campaign ROAS Multiplier'}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {isAr ? 'الهدف: 3.0x' : 'Target: 3.0x'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {isAr ? 'مقارنة مضاعف العائد الفعلي مع خط الهدف الربحي 3.0x' : 'Actual ROAS vs 3.0x profitability line'}
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignRoasChartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} domain={[0, 8]} />
                <YAxis dataKey="shortName" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${val}x`, isAr ? 'مضاعف العائد ROAS' : 'ROAS Multiplier']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <ReferenceLine x={3.0} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '3.0x Target', fill: '#d97706', fontSize: 10 }} />
                <Bar dataKey="roas" radius={[0, 8, 8, 0]}>
                  {campaignRoasChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.roas >= 4.0 ? '#10b981' : entry.roas >= 2.5 ? '#0ea5e9' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Campaign-by-Campaign ROAS Table & Roster */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {isAr ? 'جدول العائد الإعلاني ومبيعات الحملات الحقيقية' : 'Campaigns ROAS & Attributed Sales Ledger'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {isAr
                ? 'تفاصيل كل حملة منسوخة من الـ AI Orchestrator، إنفاقها، طلباتها المؤكدة، والعائد المحسوب'
                : 'Detailed telemetry for each campaign: spend, verified store orders, CPA, and calculated ROAS.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">
              {filteredCampaigns.length} {isAr ? 'حملات نشطة' : 'campaigns'}
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4 text-start">{isAr ? 'الحملة والمنتج المستهدف' : 'Campaign & Product'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'المنصة والاستراتيجية' : 'Platform & Strategy'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'الإنفاق الإعلاني' : 'Ad Spend'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'الطلبات والمبيعات' : 'Orders & Revenue'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'تكلفة الطلب (CPA)' : 'CPA'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'العائد (ROAS)' : 'ROAS'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'صافي الربح التقديري' : 'Net Profit'}</th>
                <th className="py-3.5 px-4 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCampaigns.map((camp) => {
                const roas = camp.adSpendIQD > 0 ? Number((camp.attributedRevenueIQD / camp.adSpendIQD).toFixed(2)) : 0;
                const badge = getRoasBadge(roas);
                const platform = getPlatformDetails(camp.platform);
                const cpa = camp.ordersCount > 0 ? Math.round(camp.adSpendIQD / camp.ordersCount) : 0;
                const cogs = Math.round(camp.attributedRevenueIQD * (camp.cogsPercent / 100));
                const profit = camp.attributedRevenueIQD - camp.adSpendIQD - cogs;
                const conversionRate = camp.viewsCount > 0 ? ((camp.ordersCount / camp.viewsCount) * 100).toFixed(1) : '0';

                return (
                  <tr key={camp.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Campaign Title & Product */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{camp.campaignNameAr}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-stone-400" />
                          <span>{camp.productTitleAr}</span>
                        </div>
                        <div className="text-[10px] text-amber-700 mt-1 max-w-sm line-clamp-1">
                          💡 {camp.aiRecommendationAr}
                        </div>
                      </div>
                    </td>

                    {/* Platform & Angle */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${platform.badgeClass}`}>
                          <span>{platform.icon}</span>
                          <span>{platform.name}</span>
                        </span>
                        <p className="text-[10px] text-stone-500 max-w-[150px] truncate" title={camp.aiAngleAr}>
                          {camp.aiAngleAr}
                        </p>
                      </div>
                    </td>

                    {/* Ad Spend */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div>
                        <div className="font-bold font-mono text-stone-900 text-xs">
                          {camp.adSpendIQD.toLocaleString()} د.ع
                        </div>
                        <div className="text-[10px] text-stone-400">
                          ≈ ${(camp.adSpendIQD / 1500).toFixed(0)} USD
                        </div>
                        <button
                          onClick={() => {
                            setEditingSpendCampaign(camp);
                            setEditSpendInput(camp.adSpendIQD.toString());
                          }}
                          className="text-[10px] text-amber-700 hover:text-amber-900 underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isAr ? 'تعديل الصرف' : 'Edit spend'}</span>
                        </button>
                      </div>
                    </td>

                    {/* Orders & Revenue */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div>
                        <span className="font-mono font-bold text-purple-700 text-sm">
                          {camp.attributedRevenueIQD.toLocaleString()} د.ع
                        </span>
                        <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                          <span className="font-bold text-stone-800">{camp.ordersCount} {isAr ? 'طلب' : 'orders'}</span>
                          <span>•</span>
                          <span>{conversionRate}% {isAr ? 'تحويل' : 'CR'}</span>
                        </div>
                      </div>
                    </td>

                    {/* CPA */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div>
                        <span className="font-mono font-semibold text-stone-800">
                          {cpa.toLocaleString()} د.ع
                        </span>
                        <div className="text-[10px] text-stone-400">
                          {isAr ? 'لكل زبون' : 'per order'}
                        </div>
                      </div>
                    </td>

                    {/* ROAS Multiplier Badge */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-sm font-black border shadow-2xs">
                          <span className={badge.textColor}>{roas}x</span>
                        </div>
                        <div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badge.badgeClass}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Net Profit */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div>
                        <span className={`font-mono font-bold text-xs ${profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {profit > 0 ? '+' : ''}{profit.toLocaleString()} د.ع
                        </span>
                        <p className="text-[10px] text-stone-400">
                          {isAr ? 'بعد خصم التصنيع' : 'after COGS'}
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Orders */}
                        <button
                          onClick={() => setInspectOrdersCampaign(camp)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                          title={isAr ? 'عرض فواتير وطلبات الحملة الحقيقية' : 'View linked customer orders'}
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* A/B Split Test Modal if exists */}
                        {camp.abTestSplit && (
                          <button
                            onClick={() => setInspectABTestCampaign(camp)}
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                            title={isAr ? 'استعراض نتائج اختبار A/B' : 'View A/B split results'}
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                        )}

                        {/* Simulate Order */}
                        <button
                          onClick={() => handleSimulateOrder(camp.id)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                          title={isAr ? 'محاكاة طلب شراء إضافي من هذه الحملة' : 'Simulate additional attribution order'}
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Inspect Linked Customer Orders */}
      {inspectOrdersCampaign && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 animate-scale p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {isAr ? 'فواتير ومبيعات الحملة المؤكدة' : 'Attributed Store Orders'}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                  {inspectOrdersCampaign.campaignNameAr}
                </h3>
                <p className="text-xs text-stone-500">
                  {inspectOrdersCampaign.ordersCount} {isAr ? 'طلباً منسوباً • إجمالي المبيعات:' : 'orders • Gross revenue:'}{' '}
                  <strong className="text-purple-700 font-mono">{inspectOrdersCampaign.attributedRevenueIQD.toLocaleString()} د.ع</strong>
                </p>
              </div>
              <button
                onClick={() => setInspectOrdersCampaign(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {adminOrders
                .filter((o) =>
                  inspectOrdersCampaign.linkedOrderIds.includes(o.orderId) ||
                  o.items.some((itm) => itm.productId === inspectOrdersCampaign.productId)
                )
                .slice(0, 10)
                .map((order) => (
                  <div key={order.orderId} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 text-xs">#{order.orderId}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {order.paymentDetails?.status === 'paid' ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'دفع عند الاستلام' : 'COD')}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">{order.createdAt}</span>
                      </div>
                      <p className="text-xs font-bold text-stone-800">
                        {order.shipping?.fullName || 'عميل المتجر'} • {order.shipping?.governorate || 'العراق'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {order.items.map((i) => i.titleAr).join(' + ')}
                      </p>
                    </div>

                    <div className="text-end">
                      <span className="font-mono font-bold text-sm text-stone-900 block">
                        {order.grandTotal.toLocaleString()} د.ع
                      </span>
                      <span className="text-[10px] text-amber-700 font-medium">
                        {order.workflowStatus === 'delivered' ? 'تم التسليم' : order.workflowStatus === 'in_design' ? 'في التصميم' : 'قيد التجهيز'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setInspectOrdersCampaign(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: A/B Split Test Comparison */}
      {inspectABTestCampaign && inspectABTestCampaign.abTestSplit && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 animate-scale p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  {isAr ? 'مقارنة أداء نسختي اختبار A/B والعائد' : 'A/B Test ROAS Comparison'}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                  {inspectABTestCampaign.campaignNameAr}
                </h3>
              </div>
              <button
                onClick={() => setInspectABTestCampaign(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variant A */}
              <div className={`p-5 rounded-2xl border-2 space-y-3 ${inspectABTestCampaign.abTestSplit.winningVariant === 'var_a' ? 'border-emerald-500 bg-emerald-50/20' : 'border-stone-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">النسخة (أ)</span>
                  {inspectABTestCampaign.abTestSplit.winningVariant === 'var_a' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      🏆 الفائز بالـ ROAS
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600">{inspectABTestCampaign.abTestSplit.variantA.nameAr}</p>
                <div className="space-y-1 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">الإنفاق الإعلاني:</span>
                    <span className="font-mono font-bold">{inspectABTestCampaign.abTestSplit.variantA.spendIQD.toLocaleString()} د.ع</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">المبيعات المحققة:</span>
                    <span className="font-mono font-bold text-purple-700">{inspectABTestCampaign.abTestSplit.variantA.revenueIQD.toLocaleString()} د.ع</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">عدد الطلبات:</span>
                    <span className="font-mono font-bold">{inspectABTestCampaign.abTestSplit.variantA.ordersCount} طلب</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-stone-700 font-bold">مضاعف العائد ROAS:</span>
                    <span className="font-mono font-black text-emerald-700 text-base">{inspectABTestCampaign.abTestSplit.variantA.roas}x</span>
                  </div>
                </div>
              </div>

              {/* Variant B */}
              <div className={`p-5 rounded-2xl border-2 space-y-3 ${inspectABTestCampaign.abTestSplit.winningVariant === 'var_b' ? 'border-emerald-500 bg-emerald-50/20' : 'border-stone-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">النسخة (ب)</span>
                  {inspectABTestCampaign.abTestSplit.winningVariant === 'var_b' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      🏆 الفائز بالـ ROAS
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600">{inspectABTestCampaign.abTestSplit.variantB.nameAr}</p>
                <div className="space-y-1 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">الإنفاق الإعلاني:</span>
                    <span className="font-mono font-bold">{inspectABTestCampaign.abTestSplit.variantB.spendIQD.toLocaleString()} د.ع</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">المبيعات المحققة:</span>
                    <span className="font-mono font-bold text-purple-700">{inspectABTestCampaign.abTestSplit.variantB.revenueIQD.toLocaleString()} د.ع</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">عدد الطلبات:</span>
                    <span className="font-mono font-bold">{inspectABTestCampaign.abTestSplit.variantB.ordersCount} طلب</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-stone-700 font-bold">مضاعف العائد ROAS:</span>
                    <span className="font-mono font-black text-emerald-700 text-base">{inspectABTestCampaign.abTestSplit.variantB.roas}x</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              💡 <strong>توصية الذكاء الاصطناعي:</strong> النسخة (أ) تحقق عائداً أعلى بنسبة +58%. نوصي بإنهاء الاختبار وتوجيه 100% من ميزانية تيك توك نحو النسخة (أ) للاستفادة القصوى من الزاوية العاطفية الفاخرة.
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setInspectABTestCampaign(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                {isAr ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Spend Input */}
      {editingSpendCampaign && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 animate-scale p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {isAr ? 'تعديل ميزانية الإنفاق الإعلاني' : 'Edit Campaign Ad Spend'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {editingSpendCampaign.campaignNameAr}
                </p>
              </div>
              <button
                onClick={() => setEditingSpendCampaign(null)}
                className="p-1 rounded-lg bg-stone-100 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSpend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isAr ? 'الإنفاق الإعلاني الفعلي بالدينار العراقي (IQD):' : 'Actual Ad Spend in IQD:'}
                </label>
                <input
                  type="number"
                  value={editSpendInput}
                  onChange={(e) => setEditSpendInput(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-300 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="450000"
                  required
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  سيتم فورياً إعادة احتساب الـ ROAS ومعدل الاستحواذ (CPA) وصافي الربح.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSpendCampaign(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
                >
                  {isAr ? 'حفظ وإعادة الحساب' : 'Save & Recalculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
