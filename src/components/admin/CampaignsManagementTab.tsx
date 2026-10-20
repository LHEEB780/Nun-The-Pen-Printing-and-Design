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
} from 'lucide-react';
import { useAdminStore, getUnifiedProducts, LandingPageCampaign } from '../../store/useAdminStore';

interface CampaignsManagementTabProps {
  onOpenPreview?: () => void;
}

export const CampaignsManagementTab: React.FC<CampaignsManagementTabProps> = ({
  onOpenPreview,
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
  const [copiedLink, setCopiedLink] = useState(false);

  // Form local state initialized with current campaign
  const [formData, setFormData] = useState<LandingPageCampaign>(campaign);

  // Synchronize when store campaign updates
  React.useEffect(() => {
    setFormData(campaign);
  }, [campaign]);

  // Campaign URL
  const campaignUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    return `${origin}${path}?landing=true&utm_source=tiktok&utm_campaign=${encodeURIComponent(formData.slug || 'exclusive')}`;
  }, [formData.slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopiedLink(true);
    toast.success(isAr ? 'تم نسخ رابط إعلان تيك توك بنجاح!' : 'TikTok campaign link copied!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    updateCampaign(formData);
    toast.success(isAr ? 'تم حفظ وتحديث إعدادات صفحة الهبوط بنجاح!' : 'Landing page settings updated successfully!');
  };

  // Filter campaign orders
  const campaignOrders = useMemo(() => {
    return adminOrders.filter(
      (o) => o.source === 'tiktok_campaign' || (o.workshopNotes && o.workshopNotes.includes('تيك توك'))
    );
  }, [adminOrders]);

  // Calculate Conversion Rate
  const conversionRate = useMemo(() => {
    if (!campaign.viewsCount || campaign.viewsCount === 0) return '0.0%';
    return `${((campaign.ordersCount / campaign.viewsCount) * 100).toFixed(1)}%`;
  }, [campaign.viewsCount, campaign.ordersCount]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Live Campaign Status Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md">
              <Flame className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isAr ? 'إدارة صفحة الهبوط وحملات تيك توك (TikTok Funnel)' : 'Campaign Landing Page & TikTok Funnel'}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    campaign.isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {campaign.isActive ? (isAr ? 'حملة نشطة ✅' : 'Active') : (isAr ? 'متوقفة ⏸️' : 'Paused')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'صفحة هبوط معزولة ومخصصة لتحقيق أعلى نسبة تحويل من إعلانات تيك توك وسناب شات'
                  : 'Distraction-free high-converting funnel for TikTok & Social Media Ads'}
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
              {campaign.isActive ? (isAr ? 'إيقاف الحملة مؤقتاً' : 'Pause Campaign') : (isAr ? 'تفعيل الحملة' : 'Activate Campaign')}
            </button>

            {onOpenPreview && (
              <button
                type="button"
                onClick={onOpenPreview}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{isAr ? 'معاينة الصفحة الحية' : 'Preview Live'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Campaign URL Link Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">
              {isAr ? 'الرابط الترويجي المباشر لوضعه في إعلان تيك توك (TikTok Destination URL):' : 'TikTok Ads Destination Link:'}
            </span>
            <input
              type="text"
              readOnly
              value={campaignUrl}
              className="w-full bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 outline-none select-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                copiedLink ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-amber-950 text-amber-300'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{isAr ? 'نسخ الرابط للإعلان' : 'Copy Ad Link'}</span>
                </>
              )}
            </button>

            {onOpenPreview && (
              <button
                type="button"
                onClick={onOpenPreview}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
                title="فتح المعاينة"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Marketing Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Visits */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isAr ? 'زيارات إعلان تيك توك' : 'Campaign Visits'}</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {campaign.viewsCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block">نقرة مباشرة من الحملة</span>
        </div>

        {/* Orders Converted */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isAr ? 'الطلبات المكتملة' : 'Converted Orders'}</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
            {campaign.ordersCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block">طلب تم تثبيته بالدفع عند الاستلام</span>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isAr ? 'معدل التحويل (CR %)' : 'Conversion Rate'}</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 font-mono">
            {conversionRate}
          </div>
          <span className="text-[10px] text-purple-600 block">متوسط رائع مقارنة بالمتاجر العامة (1.8%)</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isAr ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono">
            {campaign.totalRevenueIQD.toLocaleString()} د.ع
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">العائد من الإعلان</span>
            <button
              type="button"
              onClick={() => {
                if (confirm(isAr ? 'هل تريد تصفير عدادات وإحصائيات الحملة لبدء إعلان جديد؟' : 'Reset campaign statistics?')) {
                  resetCampaignStats();
                  toast.success(isAr ? 'تم تصفير الإحصائيات' : 'Stats reset');
                }
              }}
              className="text-[10px] text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>تصفير</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Campaign & Product Configurator Form */}
      <form onSubmit={handleSaveCampaign} className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-black text-slate-900">
              {isAr ? 'إعدادات المنتج والعرض الترويجي الديناميكي' : 'Dynamic Product & Offer Settings'}
            </h3>
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            {isAr ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
        </div>

        {/* Product Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'المنتج المروج له في صفحة الهبوط:' : 'Featured Product in Funnel:'}</span>
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

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {isAr ? 'حفظ إعدادات صفحة الهبوط والحملة' : 'Save Campaign Settings'}
          </button>
        </div>
      </form>

      {/* 4. Recent Campaign Orders Table */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900">
              {isAr ? 'طلبات الحملة الواردة من تيك توك' : 'Incoming TikTok Campaign Orders'}
            </h3>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
              {campaignOrders.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {isAr ? 'مفلترة تلقائياً بوسم حملة تيك توك' : 'Filtered by TikTok source'}
          </span>
        </div>

        {campaignOrders.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            {isAr
              ? 'لم ترد أي طلبات حتى الآن من الحملة. شارك الرابط أعلاه على تيك توك لتوليد أول مبيعة!'
              : 'No campaign orders yet. Share the TikTok link to start getting orders!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold">
                  <th className="py-2.5 px-3 text-start">رقم الطلب</th>
                  <th className="py-2.5 px-3 text-start">العميل</th>
                  <th className="py-2.5 px-3 text-start">المحافظة</th>
                  <th className="py-2.5 px-3 text-start">المبلغ</th>
                  <th className="py-2.5 px-3 text-start">الحالة</th>
                  <th className="py-2.5 px-3 text-start">تواصل سريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaignOrders.map((order) => {
                  const whatsappLink = `https://wa.me/${order.shipping.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `مرحباً ${order.shipping.fullName}، نحن ورشة نون والقلم بخصوص طلبك (${order.orderId}) من عرض تيك توك. نود تزويدك بالبروفة.`
                  )}`;

                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-950">
                        {order.orderId}
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

    </div>
  );
};
