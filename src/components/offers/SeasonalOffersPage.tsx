import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tag,
  Sparkles,
  Percent,
  Clock,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Truck,
  Award,
  Layers,
  Settings,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { useOffersStore, OfferItem, OfferCategory } from '../../store/useOffersStore';
import { COMPANY_CONTACT } from '../../data/mockData';
import { toast } from 'sonner';

interface SeasonalOffersPageProps {
  onBackToHome: () => void;
  onBrowseShop: () => void;
  onSelectProduct?: (productId: string) => void;
  onOpenCustomizerModal?: (productId?: string) => void;
  onNavigateToAdmin?: () => void;
}

export const SeasonalOffersPage: React.FC<SeasonalOffersPageProps> = ({
  onBackToHome,
  onBrowseShop,
  onSelectProduct,
  onOpenCustomizerModal,
  onNavigateToAdmin,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { offers } = useOffersStore();

  const [selectedCategory, setSelectedCategory] = useState<OfferCategory>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Real countdown: derived from the nearest upcoming expiry date among active offers
  const activeOffersRaw = offers.filter((o) => o.isActive);
  const countdownTarget = useMemo(() => {
    const futureDates = activeOffersRaw
      .map((o) => (o.expiresAt ? new Date(`${o.expiresAt}T23:59:59`).getTime() : NaN))
      .filter((ts) => !isNaN(ts) && ts > Date.now())
      .sort((a, b) => b - a);
    return futureDates[futureDates.length - 1] || null;
  }, [activeOffersRaw]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!countdownTarget) return;
    const compute = () => {
      const diff = Math.max(0, countdownTarget - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    compute();
    const timer = setInterval(compute, 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  const activeOffers = useMemo(
    () =>
      activeOffersRaw.filter(
        (o) => !o.expiresAt || new Date(`${o.expiresAt}T23:59:59`) >= new Date()
      ),
    [activeOffersRaw]
  );
  const filteredOffers =
    selectedCategory === 'all'
      ? activeOffers
      : activeOffers.filter((o) => o.category === selectedCategory);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    toast.success(
      isAr
        ? `تم نسخ كود الخصم (${code}) بنجاح! يمكنك لصقه عند إتمام الطلب.`
        : `Promo code (${code}) copied to clipboard!`
    );
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 3000);
  };

  const categories = [
    { id: 'all', labelAr: 'كافة عروض الموسم', labelEn: 'All Seasonal Offers', icon: Flame },
    { id: 'boxes', labelAr: 'علب الكرتون المقوى', labelEn: 'Luxury Rigid Boxes', icon: Layers },
    { id: 'acrylic', labelAr: 'الأكريليك و LED', labelEn: 'Acrylic & 3D LED', icon: Sparkles },
    { id: 'cards', labelAr: 'كروت الأعمال الفاخرة', labelEn: 'Hot-Foil Cards', icon: Award },
    { id: 'awards', labelAr: 'دروع التكريم', labelEn: 'Crystal Awards', icon: Award },
    { id: 'bundles', labelAr: 'باقات المشاريع VIP', labelEn: 'Launch Bundles', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 animate-fade-in">
      {/* Top Breadcrumb & Admin Switcher Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-purple-700 transition-colors font-medium flex items-center gap-1 cursor-pointer"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <span>/</span>
            <span className="text-amber-800 font-bold">
              {isAr ? 'مهرجان عروض الموسم والتخفيضات' : 'Seasonal Offers & Discounts'}
            </span>
          </div>

          {/* Admin Dashboard Management Shortcut */}
          {onNavigateToAdmin && (
            <button
              type="button"
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold border border-purple-200 transition-colors cursor-pointer shadow-2xs"
              title={isAr ? 'التحكم بالعروض (إضافة / تعديل / حذف)' : 'Manage Offers in Control Panel'}
            >
              <Settings className="w-3.5 h-3.5 text-purple-600" />
              <span>{isAr ? 'لوحة تحكم إدارة العروض' : 'Offers Admin Panel'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grand Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 text-white overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-12 border border-amber-500/20">
          {/* Subtle Background Glow Elements */}
          <div className="absolute -top-24 -end-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -start-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left/Start: Title, Subtitle, Guarantees */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-400/30">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{isAr ? 'مهرجان التخفيضات الكبرى لعام 2026' : 'Grand Seasonal Sale 2026'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                {isAr ? (
                  <>
                    عروض الموسم الذهبية:{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
                      تخفيضات تصل إلى 33%
                    </span>
                  </>
                ) : (
                  <>
                    Golden Seasonal Offers:{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
                      Up to 33% OFF
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {isAr
                  ? 'استفد من باقات الخصم الحصرية على علب الكرتون المقوى (Rigid Boxes)، دروع ولوحات الأكريليك المضيئة 3D LED، وكروت الأعمال المذهبة المصنوعة محلياً في ورشتنا ببغداد بأعلى معايير الحرفية.'
                  : 'Take advantage of limited-time promotional pricing on bespoke rigid boxes, corporate 3D LED acrylic signage, and hot-foil cotton cards hand-crafted in Baghdad.'}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{isAr ? 'شحن مجاني' : 'Free Delivery'}</span>
                    <span className="text-[10px] text-slate-300">{isAr ? 'للطلبات فوق 150 ألف د.ع' : 'On orders > 150K IQD'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{isAr ? 'ضمان سنتين' : '2-Year Warranty'}</span>
                    <span className="text-[10px] text-slate-300">{isAr ? 'كفالة جودة متكاملة' : '100% Quality Guaranteed'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{isAr ? 'بروفة 3D مجانية' : 'Free 3D Proof'}</span>
                    <span className="text-[10px] text-slate-300">{isAr ? 'اعتماد التصميم قبل القص' : 'Preview before production'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right/End: Flash Countdown Card */}
            <div className="lg:col-span-5 bg-black/40 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{isAr ? 'الوقت المتبقي لانتهاء عروض الموسم:' : 'Flash Deal Countdown:'}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-mono">
                  {isAr ? 'لفترة محدودة' : 'Limited Time'}
                </span>
              </div>

              {/* 4 Digit Boxes */}
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-300 block mt-1">{isAr ? 'يوم' : 'Days'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-300 block mt-1">{isAr ? 'ساعة' : 'Hours'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-300 block mt-1">{isAr ? 'دقيقة' : 'Mins'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-300 block mt-1">{isAr ? 'ثانية' : 'Secs'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200 text-center leading-relaxed font-medium">
                {isAr
                  ? '💡 استخدم الأكواد الترويجية الموضحة في كل بطاقة أدناه للحصول على الخصم الفوري عند الطلب والتنفيذ.'
                  : '💡 Use the promotional codes displayed on each card below for instant savings at checkout.'}
              </div>

              <button
                type="button"
                onClick={onBrowseShop}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAr ? 'تصفح كافة منتجات المتجر الآن' : 'Browse Full Catalog'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? activeOffers.length
                : activeOffers.filter((o) => o.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as OfferCategory)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredOffers.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <Tag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-800">
              {isAr ? 'لا توجد عروض في هذا القسم حالياً' : 'No offers in this category currently'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isAr
                ? 'يمكنك الاطلاع على كافة العروض أو مراسلتنا للحصول على عرض سعر مخصص لمشروعك.'
                : 'Browse all offers or contact us for a custom corporate quotation.'}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              {isAr ? 'عرض كافة عروض الموسم' : 'Show All Offers'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer) => {
              const isCopied = copiedCodeId === offer.id;
              const hasPricing = offer.originalPrice && offer.discountedPrice;
              const savingsAmount = hasPricing ? offer.originalPrice! - offer.discountedPrice! : null;

              const whatsappUrl = `${COMPANY_CONTACT.whatsappUrl}?text=${encodeURIComponent(
                isAr
                  ? `${offer.whatsappInquiryTextAr || 'مرحباً، أود طلب العرض التالي:'} *${offer.titleAr}* (كود: ${offer.promoCode})`
                  : `${offer.whatsappInquiryTextEn || 'Hello, inquiring about:'} ${offer.titleEn} (Code: ${offer.promoCode})`
              )}`;

              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
                    offer.isFeatured
                      ? 'border-amber-400 ring-2 ring-amber-400/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    {/* Image & Badges Container */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-900 select-none">
                      <img
                        src={offer.imageUrl}
                        alt={isAr ? offer.titleAr : offer.titleEn}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 start-3.5 flex flex-wrap gap-1.5 items-center">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5" />
                          <span>{isAr ? offer.discountBadgeAr : offer.discountBadgeEn}</span>
                        </span>

                        {offer.isFeatured && (
                          <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>{isAr ? 'عرض مميز' : 'Featured'}</span>
                          </span>
                        )}
                      </div>

                      {/* Expiry Pill */}
                      <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-mono font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isAr ? 'ينتهي في:' : 'Valid until:'} {offer.expiresAt}</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                          {isAr ? offer.taglineAr : offer.taglineEn}
                        </span>
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-amber-900 transition-colors">
                          {isAr ? offer.titleAr : offer.titleEn}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isAr ? offer.descriptionAr : offer.descriptionEn}
                      </p>

                      {/* Features Bullet List */}
                      {offer.featuresAr && offer.featuresAr.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-slate-100">
                          {(isAr ? offer.featuresAr : offer.featuresEn).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] font-medium leading-relaxed">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pricing Display */}
                      {hasPricing && (
                        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block line-through">
                              {offer.originalPrice?.toLocaleString()} {offer.currency}
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-amber-900 font-mono">
                                {offer.discountedPrice?.toLocaleString()}
                              </span>
                              <span className="text-xs font-bold text-amber-800">
                                {isAr ? 'د.ع' : 'IQD'}
                              </span>
                            </div>
                          </div>

                          {savingsAmount && (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-black">
                              {isAr ? `توفير ${savingsAmount.toLocaleString()} د.ع` : `Save ${savingsAmount.toLocaleString()}`}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Interactive Promo Coupon Box with Copy Button */}
                      <div className="p-3 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">
                            {isAr ? 'كود الخصم الترويجي:' : 'Promo Coupon Code:'}
                          </span>
                          <span className="text-sm font-black font-mono tracking-wider text-purple-700">
                            {offer.promoCode}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(offer.promoCode, offer.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{isAr ? 'نسخ الكود' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-6 pt-0 space-y-2">
                    {/* Primary Order Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (offer.productId && onSelectProduct) {
                          onSelectProduct(offer.productId);
                        } else if (onOpenCustomizerModal) {
                          onOpenCustomizerModal(offer.productId);
                        } else {
                          onBrowseShop();
                        }
                      }}
                      className="w-full py-3 rounded-2xl bg-amber-900 hover:bg-amber-800 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01]"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>{isAr ? 'طلب الآن والاستفادة من الخصم' : 'Order Now with Discount'}</span>
                    </button>

                    {/* Direct WhatsApp Contact Button */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>{isAr ? 'طلب أو استفسار عبر واتساب 💬' : 'Claim on WhatsApp 💬'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Consultation Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h4 className="text-xl sm:text-2xl font-black text-slate-900">
              {isAr ? 'هل تبحث عن عرض مخصص أو كميات ضخمة لمؤسستك؟' : 'Looking for Custom Bulk Orders or Corporate Quotations?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isAr
                ? 'فريق استشارات التصنيع في نُون والقَلَم جاهز لتقديم عروض أسعار متدرجة، تصنيع عينات تجريبية مجانية، وتنسيق مواعيد التسليم لشركتك في بغداد وكافة المحافظات.'
                : 'Our production engineering team provides tiered volume discounts, complimentary physical prototypes, and fast delivery timelines.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`${COMPANY_CONTACT.whatsappUrl}?text=${encodeURIComponent(
                isAr
                  ? 'مرحباً استوديو نُون والقَلَم، أود الاستفسار عن عروض الكميات والجملة للمؤسسات والشركات.'
                  : 'Hello Noon & Pen, inquiry regarding bulk and corporate orders.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>{isAr ? 'محادثة مسؤول المبيعات واتساب' : 'Chat with Sales Manager'}</span>
            </a>

            <button
              type="button"
              onClick={onBrowseShop}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              {isAr ? 'العودة للمتجر والتخصيص' : 'Browse Shop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
