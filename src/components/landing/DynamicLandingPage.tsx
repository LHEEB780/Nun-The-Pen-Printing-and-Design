import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Flame,
  Star,
  ShoppingBag,
  MessageCircle,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  ArrowRight,
  Upload,
  Palette,
  Phone,
  User,
  MapPin,
  ExternalLink,
  Gift,
  Globe,
} from 'lucide-react';
import { useAdminStore, getUnifiedProducts } from '../../store/useAdminStore';
import { useCartStore, OrderRecord } from '../../store/useCartStore';
import { ProductItem, DimensionOption, LedOption } from '../../data/mockData';

import { SUPPORTED_COUNTRIES, getCountryByName, CountryInfo } from '../../data/geoData';

interface DynamicLandingPageProps {
  onBackToHome?: () => void;
  overrideProductId?: string;
  isPreview?: boolean;
}

export const DynamicLandingPage: React.FC<DynamicLandingPageProps> = ({
  onBackToHome,
  overrideProductId,
  isPreview = false,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const { campaign, adminProducts, recordCampaignVisit, recordCampaignOrder, recordABVisit, recordABOrder } = useAdminStore();
  const { setLastOrder } = useCartStore();

  // Unified Product Resolution
  const allProducts = useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);
  const targetProductId = overrideProductId || campaign.productId;
  const product: ProductItem = useMemo(() => {
    return allProducts.find((p) => p.id === targetProductId) || allProducts[0];
  }, [allProducts, targetProductId]);

  // Dynamic A/B Variant Resolution (Supports utm_content=var_a / var_b, activeWinnerId, and traffic split)
  const activeVariant = useMemo(() => {
    if (!campaign.abTest || !campaign.abTest.enabled) return null;
    if (typeof window === 'undefined') return campaign.abTest.variantA;
    const params = new URLSearchParams(window.location.search);
    const content = (params.get('utm_content') || params.get('variant') || params.get('ab') || '').toLowerCase();
    if (content.includes('var_b') || content.includes('b')) {
      return campaign.abTest.variantB;
    }
    if (content.includes('var_a') || content.includes('a')) {
      return campaign.abTest.variantA;
    }
    if (campaign.abTest.activeWinnerId === 'var_b') return campaign.abTest.variantB;
    if (campaign.abTest.activeWinnerId === 'var_a') return campaign.abTest.variantA;
    const splitA = campaign.abTest.trafficSplitPercentA || 50;
    const rand = Math.random() * 100;
    return rand <= splitA ? campaign.abTest.variantA : campaign.abTest.variantB;
  }, [campaign.abTest]);

  // Gallery Photos
  const galleryPhotos = useMemo(() => {
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.galleryImages && product.galleryImages.length > 0) {
      product.galleryImages.forEach((img: string) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : [product.image];
  }, [product]);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Dynamic Platform Detection from URL (Facebook, Instagram, TikTok, Snapchat, Google, etc.)
  const platformInfo = useMemo(() => {
    if (typeof window === 'undefined') {
      return { id: 'social', nameAr: 'شبكات التواصل', nameEn: 'Social Media', tag: 'SOC', badgeBg: 'bg-amber-600 text-stone-950' };
    }
    const params = new URLSearchParams(window.location.search);
    const src = (params.get('utm_source') || params.get('source') || params.get('platform') || '').toLowerCase();

    if (src.includes('facebook') || src.includes('fb')) {
      return { id: 'facebook', nameAr: 'فيسبوك (Facebook)', nameEn: 'Facebook', tag: 'FB', badgeBg: 'bg-blue-600 text-white' };
    }
    if (src.includes('instagram') || src.includes('insta') || src.includes('ig')) {
      return { id: 'instagram', nameAr: 'انستغرام (Instagram)', nameEn: 'Instagram', tag: 'IG', badgeBg: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' };
    }
    if (src.includes('tiktok') || src.includes('tk')) {
      return { id: 'tiktok', nameAr: 'تيك توك (TikTok)', nameEn: 'TikTok', tag: 'TK', badgeBg: 'bg-stone-900 border border-stone-600 text-amber-300' };
    }
    if (src.includes('snapchat') || src.includes('snap')) {
      return { id: 'snapchat', nameAr: 'سناب شات (Snapchat)', nameEn: 'Snapchat', tag: 'SNAP', badgeBg: 'bg-yellow-400 text-stone-950 font-bold' };
    }
    if (src.includes('google')) {
      return { id: 'google', nameAr: 'إعلانات جوجل (Google)', nameEn: 'Google', tag: 'GGL', badgeBg: 'bg-red-600 text-white' };
    }
    if (src.includes('direct') || src.includes('whatsapp') || src.includes('wa') || src.includes('telegram')) {
      return { id: 'direct', nameAr: 'واتساب وتيليجرام (Direct)', nameEn: 'Direct / WhatsApp', tag: 'DIR', badgeBg: 'bg-emerald-600 text-white' };
    }
    return { id: 'social', nameAr: 'شبكات التواصل', nameEn: 'Social Media', tag: 'PROMO', badgeBg: 'bg-amber-600 text-stone-950' };
  }, []);

  // Record visit with platform and A/B variant attribution once on mount
  useEffect(() => {
    if (!isPreview) {
      recordCampaignVisit(platformInfo.id);
      if (activeVariant) {
        recordABVisit(activeVariant.id);
      }
    }
  }, [isPreview, recordCampaignVisit, platformInfo.id, activeVariant, recordABVisit]);

  // Live Countdown Timer (Simulated to end in campaign.countdownHours)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: campaign.countdownHours || 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Form State with Country & City Cascading Selection (تخصيص الدولة ثم المدينة)
  const defaultCountry = useMemo(() => {
    return getCountryByName(campaign.targetCountry || 'العراق');
  }, [campaign.targetCountry]);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(defaultCountry.code);
  const currentCountry: CountryInfo = useMemo(() => {
    return SUPPORTED_COUNTRIES.find((c) => c.code === selectedCountryCode) || defaultCountry;
  }, [selectedCountryCode, defaultCountry]);

  const [city, setCity] = useState<string>(
    campaign.targetCity && currentCountry.cities.includes(campaign.targetCity)
      ? campaign.targetCity
      : currentCountry.cities[0]
  );

  // Automatically sync city when country changes
  useEffect(() => {
    setCity(currentCountry.cities[0]);
  }, [selectedCountryCode, currentCountry]);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [customText, setCustomText] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption>(
    product.dimensions?.[0] || { id: 'd-def', labelAr: 'المقاس القياسي', labelEn: 'Standard Size', widthCm: 20, heightCm: 25, multiplier: 1 }
  );
  const [selectedLed, setSelectedLed] = useState<LedOption>(
    product.ledOptions?.[0] || { id: 'l-warm', nameAr: 'أصفر دافئ (Warm Gold)', nameEn: 'Warm Gold', hex: '#FFB800', glowClass: 'shadow-amber-500/50' }
  );
  const [includeBonusOffer, setIncludeBonusOffer] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  // Submission & Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<OrderRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const orderFormRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    orderFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(isAr ? 'حجم الملف يتجاوز الحد المسموح (20MB)' : 'File size exceeds 20MB');
        return;
      }
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFileUrl(event.target?.result as string);
        toast.success(isAr ? `تم إرفاق: ${file.name}` : `Attached: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Pricing Calculation (Dynamic for any product in catalog or default campaign product, respecting active A/B variant)
  const isDefaultCampaignProduct = product.id === campaign.productId;
  const basePromoPrice = isDefaultCampaignProduct
    ? (activeVariant ? activeVariant.promoPriceIQD : campaign.promoPriceIQD)
    : Math.round(product.basePrice * (1 - (product.tierPricing?.[0]?.discountPercent || 25) / 100));
  const effectiveOriginalPrice = isDefaultCampaignProduct
    ? (activeVariant ? activeVariant.originalPriceIQD : campaign.originalPriceIQD)
    : product.basePrice;
  const dimensionMultiplier = selectedDimension.multiplier || 1;
  const calculatedProductPrice = Math.round(basePromoPrice * dimensionMultiplier);
  const bonusAddPrice = includeBonusOffer && campaign.bonusOfferEnabled ? campaign.bonusOfferPriceIQD : 0;
  const shippingFee = 0; // Free delivery for campaign offer
  const grandTotalIQD = calculatedProductPrice + bonusAddPrice + shippingFee;

  // Handle Quick Order Submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error(isAr ? 'يرجى كتابة اسم المستلم' : 'Please enter receiver full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      toast.error(isAr ? 'يرجى كتابة رقم هاتف صالح للتوصيل والتواصل' : 'Please provide a valid delivery phone number');
      return;
    }
    if (!addressDetails.trim()) {
      toast.error(isAr ? 'يرجى كتابة العنوان أو أقرب نقطة دالة' : 'Please enter delivery address or landmark');
      return;
    }

    setIsSubmitting(true);

    const generatedOrderId = `ORD-${platformInfo.tag}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: OrderRecord = {
      orderId: generatedOrderId,
      createdAt: new Date().toISOString(),
      source: `${platformInfo.id}_campaign`,
      campaignSlug: campaign.slug,
      items: [
        {
          id: `item-${Date.now()}`,
          productId: product.id,
          titleAr: isAr ? product.titleAr : product.titleEn,
          titleEn: product.titleEn,
          category: product.category,
          image: galleryPhotos[activePhotoIndex] || product.image,
          quantity: 1,
          unitPrice: calculatedProductPrice,
          totalPrice: calculatedProductPrice,
          customOptions: {
            customText: customText || undefined,
            dimensionLabelAr: selectedDimension.labelAr,
            dimensionLabelEn: selectedDimension.labelEn,
            materialLabelAr: 'أكريليك كاست ممتاز',
            materialLabelEn: 'Cast Acrylic',
            ledColorNameAr: product.category === 'led' ? selectedLed.nameAr : undefined,
            ledColorNameEn: product.category === 'led' ? selectedLed.nameEn : undefined,
            ledHex: product.category === 'led' ? selectedLed.hex : undefined,
            logoFileName: uploadedFileName || undefined,
            notes: customerNotes ? `ملاحظات: ${customerNotes}` : undefined,
          },
        },
        ...(includeBonusOffer
          ? [
              {
                id: `bonus-${Date.now()}`,
                productId: 'bonus-offer-addon',
                titleAr: campaign.bonusOfferTitleAr,
                titleEn: campaign.bonusOfferTitleEn,
                category: 'bonus',
                image: product.image,
                quantity: 1,
                unitPrice: campaign.bonusOfferPriceIQD,
                totalPrice: campaign.bonusOfferPriceIQD,
                customOptions: {
                  dimensionLabelAr: 'عرض إضافي',
                  dimensionLabelEn: 'Bonus Offer',
                  materialLabelAr: `باقة توفير ${platformInfo.nameAr}`,
                  materialLabelEn: `${platformInfo.nameEn} Bundle Addon`,
                },
              },
            ]
          : []),
      ],
      shipping: {
        fullName: customerName,
        phone: customerPhone,
        country: currentCountry.nameAr,
        governorate: `${currentCountry.nameAr} - ${city}`,
        address: addressDetails,
        notes: customerNotes || undefined,
        deliveryType: 'standard',
        shippingCost: 0,
      },
      paymentMethod: 'cod',
      paymentDetails: {
        transactionId: `COD-${platformInfo.tag}-${Date.now()}`,
        status: 'pending_cod',
        gatewayNameAr: 'الدفع نقداً عند الاستلام (COD)',
        gatewayNameEn: 'Cash on Delivery',
      },
      subtotal: calculatedProductPrice + bonusAddPrice,
      shippingCost: 0,
      grandTotal: grandTotalIQD,
      manufacturingStatus: 'under_review',
      workshopNotes: `طلب مباشر من إعلان (${platformInfo.nameAr} - ${campaign.slug}) - ${currentCountry.nameAr} / ${city}. العميل طلب معاينة التصميم قبل التنفيذ.`,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderCompleted(newOrder);
      setLastOrder(newOrder);
      recordCampaignOrder(grandTotalIQD, platformInfo.id);
      if (activeVariant) {
        recordABOrder(activeVariant.id, grandTotalIQD);
      }
      toast.success(isAr ? 'تم استلام طلبك بنجاح! شكراً لثقتكم بنون والقلم' : 'Order received successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // WhatsApp Pre-filled Confirmation Message
  const whatsappInquiryUrl = useMemo(() => {
    if (!orderCompleted) return '';
    const text = isAr
      ? `مرحباً نون والقلم، لقد أكملت طلبي عبر العرض الخاص في (${platformInfo.nameAr}):\n` +
        `📦 رقم الطلب: ${orderCompleted.orderId}\n` +
        `👤 الاسم: ${customerName}\n` +
        `📞 الهاتف: ${customerPhone}\n` +
        `📍 الدولة والمدينة: ${currentCountry.flag} ${currentCountry.nameAr} - ${city} (${addressDetails})\n` +
        `💎 المنتج: ${product.titleAr}\n` +
        (customText ? `✍️ النص المطلوب: ${customText}\n` : '') +
        `💰 المبلغ المطلوب عند الاستلام: ${grandTotalIQD.toLocaleString()} د.ع (شحن مجاني)\n` +
        `أرجو تزويدي بالبروفة الرقمية لاعتمادها. شكراً لكم!`
      : `Hello Noon & Al-Qalam, I placed an order via ${platformInfo.nameEn} special offer:\nOrder: ${orderCompleted.orderId}\nName: ${customerName}\nCountry/City: ${currentCountry.nameEn} - ${city}\nProduct: ${product.titleEn}\nTotal COD: ${grandTotalIQD.toLocaleString()} IQD`;

    return `https://wa.me/9647800000000?text=${encodeURIComponent(text)}`;
  }, [orderCompleted, customerName, customerPhone, currentCountry, city, addressDetails, product, customText, grandTotalIQD, isAr, platformInfo]);

  return (
    <div className="min-h-screen bg-stone-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Admin Preview Top Bar Indicator */}
      {isPreview && (
        <div className="bg-purple-900/90 text-purple-200 border-b border-purple-700/60 py-2 px-4 text-xs font-bold flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>معاينة صفحة الهبوط الترويجية (وضع الإدارة النشط - حملة {platformInfo.nameAr})</span>
          </div>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-black text-purple-200 border border-purple-600 text-[11px] cursor-pointer"
            >
              العودة للوحة الإدارة
            </button>
          )}
        </div>
      )}

      {/* 1. TOP URGENCY COUNTDOWN NOTICE BAR (شريط العد التنازلي الترويجي) */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-slate-950 py-2 px-3 sm:px-4 text-xs font-black shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold">
            <Flame className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>
              {isAr
                ? `عرض خاص لعملاء ${platformInfo.nameAr} في ${currentCountry.nameAr} ${currentCountry.flag} لفترة محدودة | شحن مجاني لكافة المدن والمحافظات ⚡`
                : `Special Deal for ${platformInfo.nameEn} Users in ${currentCountry.nameEn} ${currentCountry.flag} | Free Delivery`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-950 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/40 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'ينتهي خلال:' : 'Ends in:'}</span>
            <span className="font-black">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MINIMAL DISTRACTION-FREE BRAND HEADER (شعار نون والقلم مع شارات الأمان) */}
      <header className="border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black text-xl shadow-lg shadow-amber-900/30">
              ن
            </div>
            <div>
              <div className="text-base font-black tracking-wide text-white flex items-center gap-1.5">
                <span>نُـون وَالقَـلَم</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/60">
                  ورشة معتمدة
                </span>
              </div>
              <p className="text-[10px] text-stone-400">استوديو الطباعة والقص الليزري والدروع الفاخرة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="px-3 py-1.5 rounded-xl border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-amber-300 text-xs font-bold transition-all cursor-pointer hidden sm:inline-flex items-center gap-1.5"
              >
                <span>{isAr ? 'تصفح المتجر الكامل' : 'Browse Storefront'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs transition-all shadow-md cursor-pointer hover:shadow-amber-500/20"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAr ? 'اطلب الآن ⚡' : 'Order Now ⚡'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        
        {/* ==========================================================
            SUCCESS STATE VIEW (عند إتمام الطلب بنجاح)
           ========================================================== */}
        {orderCompleted ? (
          <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
                {isAr ? 'تم تسجيل وتثبيت طلبك بنجاح في ورشة نون والقلم' : 'Order Successfully Registered'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isAr ? `شكراً لك، ${customerName}!` : `Thank you, ${customerName}!`}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
                {isAr
                  ? 'يقوم الآن فريق التصميم بتجهيز البروفة الرقمية لطلبك، وسيتم التواصل معك لاعتماد التصميم النهائي قبل بدء القص والطباعة.'
                  : 'Our design workshop is preparing your digital blueprint. We will contact you before crafting.'}
              </p>
            </div>

            {/* Order Receipt Box */}
            <div className="max-w-md mx-auto bg-stone-950/90 rounded-2xl p-4 border border-stone-800 text-start space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-stone-400 font-mono">
                <span>رقم الطلب (Order ID):</span>
                <span className="font-bold text-amber-300">{orderCompleted.orderId}</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>المنتج المطلوب:</span>
                <span className="font-bold text-white">{product.titleAr}</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>الدولة والمدينة والتوصيل:</span>
                <span className="font-medium text-stone-200">{currentCountry.flag} {currentCountry.nameAr} - {city} ({addressDetails})</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>طريقة الدفع:</span>
                <span className="font-bold text-emerald-400">الدفع نقداً عند الاستلام (COD)</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-800 font-black text-sm">
                <span className="text-white">المبلغ المطلوب عند الاستلام:</span>
                <span className="text-amber-400 font-mono">{grandTotalIQD.toLocaleString()} د.ع</span>
              </div>
            </div>

            {/* WhatsApp Fast-Track Button */}
            <div className="pt-2 max-w-md mx-auto space-y-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>{isAr ? 'إرسال نسخة الطلب للمصمم على واتساب 💬' : 'Send Order Copy to WhatsApp 💬'}</span>
              </a>
              <p className="text-[11px] text-stone-400">
                {isAr ? 'نوصي بفتح واتساب فوراً لتزويد المصمم بأي شعارات أو تعديلات إضافية سريعة.' : 'Open WhatsApp to share extra logos or adjustments.'}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-800 flex justify-center">
              <button
                type="button"
                onClick={() => setOrderCompleted(null)}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                {isAr ? 'العودة لصفحة العرض' : 'Back to Offer'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ==========================================================
                3. HERO HOOK & PRODUCT PRESENTATION (الواجهة الرئيسية للعرض)
               ========================================================== */}
            <div className="space-y-6">
              
              {/* Product Headline & Urgency Badges */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>
                    {isAr
                      ? `${activeVariant?.badgeTextAr || campaign.badgeTextAr} · خاص لعملاء ${platformInfo.nameAr}`
                      : `${activeVariant?.badgeTextAr || campaign.badgeTextEn} · Exclusive for ${platformInfo.nameEn}`}
                  </span>
                  {activeVariant && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded font-mono border border-amber-500/30">
                      {activeVariant.id === 'var_a' ? 'A' : 'B'}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  {activeVariant?.headlineAr || (isAr ? campaign.headlineAr : campaign.headlineEn)}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
                  {activeVariant?.subheadlineAr || (isAr ? campaign.subheadlineAr : campaign.subheadlineEn)}
                </p>

                {/* Social Proof Star Ratings & Live Viewers */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold bg-stone-900 px-3 py-1 rounded-full border border-stone-800">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="ms-1 text-white">4.9 / 5</span>
                    <span className="text-stone-400 text-[11px]">(380+ تقييم معتمد)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-400 bg-stone-900 px-3 py-1 rounded-full border border-stone-800 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>34 زائر يتصفحون هذا العرض الآن</span>
                  </div>
                </div>
              </div>

              {/* Big Visual Gallery Card */}
              <div className="bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-800/90 shadow-2xl space-y-3">
                <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-2xl bg-black overflow-hidden shadow-inner group">
                  <img
                    src={galleryPhotos[activePhotoIndex] || product.image}
                    alt={product.titleAr}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                  />
                  
                  {/* Floating Price Badge on Image */}
                  <div className="absolute top-3 start-3 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-amber-300 text-xs font-black border border-amber-500/30 shadow-lg">
                    <span>{isAr ? 'سعر العرض الخاص: ' : 'Flash Price: '}</span>
                    <span className="text-white font-mono text-sm">{calculatedProductPrice.toLocaleString()} د.ع</span>
                  </div>

                  {/* Stock Left Badge */}
                  <div className="absolute bottom-3 start-3 px-3 py-1.5 rounded-xl bg-red-950/90 backdrop-blur-md text-red-200 text-[11px] font-bold border border-red-700/50 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>{isAr ? `متبقي ${campaign.urgencyStockLeft} قطع فقط بسعر العرض` : `Only ${campaign.urgencyStockLeft} left at this price`}</span>
                  </div>
                </div>

                {/* Thumbnails row if more than 1 photo */}
                {galleryPhotos.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {galleryPhotos.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activePhotoIndex === idx
                            ? 'border-amber-500 scale-102 ring-2 ring-amber-500/30'
                            : 'border-stone-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Savings Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                      {calculatedProductPrice.toLocaleString()} د.ع
                    </span>
                    <span className="text-sm sm:text-base text-stone-500 line-through font-mono">
                      {effectiveOriginalPrice.toLocaleString()} د.ع
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                    ✨ وفّرت اليوم {(effectiveOriginalPrice - calculatedProductPrice).toLocaleString()} د.ع مع توصيل مجاني!
                  </span>
                </div>

                <button
                  type="button"
                  onClick={scrollToForm}
                  className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAr ? 'تأكيد الحجز قبل نفاد الكمية' : 'Claim Offer Before Sold Out'}</span>
                </button>
              </div>

              {/* 4. KEY CRAFTSMANSHIP POINTS (مميزات الجودة والفخامة) */}
              <div className="bg-stone-900/90 rounded-3xl p-5 sm:p-6 border border-stone-800 space-y-4">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'لماذا تختار منتجات نون والقلم؟' : 'Why Choose Noon & Al-Qalam?'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activeVariant ? activeVariant.bulletPointsAr : (isAr ? campaign.bulletPointsAr : campaign.bulletPointsEn)).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-950/70 border border-stone-800/80 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-stone-200 font-medium leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. ONE-PAGE EXPRESS ORDER FORM (استمارة الشراء الفوري بنقرة واحدة) */}
              <div ref={orderFormRef} className="bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl p-5 sm:p-7 border-2 border-amber-500/50 shadow-2xl space-y-6">
                
                {/* Form Header */}
                <div className="border-b border-stone-800 pb-4 text-center sm:text-start space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[11px] font-bold border border-amber-800">
                    <Package className="w-3 h-3 text-amber-400" />
                    <span>{isAr ? 'استمارة الحجز الفوري - الدفع عند الاستلام' : 'Express Booking Form - Cash on Delivery'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isAr ? 'أدخل معلوماتك واستلم طلبك عند باب منزلك' : 'Fill Your Details & Pay on Delivery'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {isAr
                      ? 'لا يتطلب الأمر أي بطاقة مصرفية! يتم الدفع نقداً لمندوب التوصيل بعد المعاينة.'
                      : 'No credit card needed! Pay in cash after inspecting package.'}
                  </p>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  
                  {/* Part 1: Product Customization Details */}
                  <div className="space-y-4 bg-stone-950/70 p-4 rounded-2xl border border-stone-800/80">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>{isAr ? '1. تخصيص التصميم والقطعة:' : '1. Product Customization:'}</span>
                    </h4>

                    {/* Custom Text / Inscription */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-300">
                        {isAr ? 'الاسم أو العبارة المطلوبة على التصميم (اختياري الآن):' : 'Custom Name or Inscription:'}
                      </label>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder={isAr ? 'مثال: شركة الأفق للهندسة - أو إهداء للدكتور أحمد...' : 'e.g. Horizon Co. or For Dr. Ahmed...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Size Selector (If product has dimensions) */}
                    {product.dimensions && product.dimensions.length > 1 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-300">
                          {isAr ? 'اختر المقاس المطلوب:' : 'Select Dimension:'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {product.dimensions.map((dim) => {
                            const isSelected = selectedDimension.id === dim.id;
                            return (
                              <button
                                key={dim.id}
                                type="button"
                                onClick={() => setSelectedDimension(dim)}
                                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-start cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-950 text-amber-200 border-amber-500 ring-1 ring-amber-500/40'
                                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                                }`}
                              >
                                <span className="block truncate">{isAr ? dim.labelAr : dim.labelEn}</span>
                                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                                  {dim.widthCm}×{dim.heightCm} سم
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* LED Color selector (If LED product) */}
                    {product.category === 'led' && product.ledOptions && product.ledOptions.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-300">
                          {isAr ? 'لون إضاءة LED المفضل للقطعة:' : 'Preferred LED Color:'}
                        </label>
                        <div className="flex items-center gap-2.5">
                          {product.ledOptions.map((led) => {
                            const isSelected = selectedLed.id === led.id;
                            return (
                              <button
                                key={led.id}
                                type="button"
                                onClick={() => setSelectedLed(led)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                                  isSelected ? 'scale-115 border-white ring-2 ring-amber-500/40' : 'border-stone-700'
                                }`}
                                style={{ backgroundColor: led.hex }}
                                title={isAr ? led.nameAr : led.nameEn}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                              </button>
                            );
                          })}
                          <span className="text-[11px] font-bold text-amber-300 ms-1">
                            {isAr ? selectedLed.nameAr : selectedLed.nameEn}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Optional Logo File Upload */}
                    <div className="pt-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,.pdf,.ai,.eps,.psd"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3 rounded-xl border border-dashed border-stone-700 hover:border-amber-500 text-stone-400 hover:text-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadedFileName ? `تم إرفاق: ${uploadedFileName}` : (isAr ? 'إرفاق شعار أو ملف تصميم (اختياري - يمكنك إرساله لاحقاً عبر واتساب)' : 'Attach logo (Optional)')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Part 2: Customer Delivery Details */}
                  <div className="space-y-4 bg-stone-950/70 p-4 rounded-2xl border border-stone-800/80">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isAr ? '2. بيانات التوصيل والتواصل في العراق:' : '2. Delivery Information in Iraq:'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
                          <User className="w-3 h-3 text-amber-400" />
                          <span>{isAr ? 'اسم المستلم الثلاثي:' : 'Receiver Full Name:'}</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder={isAr ? 'اكتب اسمك الكامل...' : 'Full name...'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>{isAr ? 'رقم الهاتف والواتساب للتوصيل:' : 'Phone & WhatsApp:'}</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute start-3 text-xs font-mono font-bold text-amber-400 select-none">
                            {currentCountry.phoneCode}
                          </span>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder={currentCountry.phonePlaceholder}
                            className="w-full ps-16 pe-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Country THEN City Cascading Selector (تخصيص الدولة ثم المدينة) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Country Selector */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-amber-400" />
                          <span>{isAr ? 'الدولة المستهدفة:' : 'Target Country:'}</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={selectedCountryCode}
                          onChange={(e) => setSelectedCountryCode(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          {SUPPORTED_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-stone-900 text-white">
                              {c.flag} {c.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* City Selector */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{isAr ? `المدينة / المحافظة في (${currentCountry.nameAr}):` : 'City / Governorate:'}</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          {currentCountry.cities.map((ct) => (
                            <option key={ct} value={ct} className="bg-stone-900 text-white">
                              {ct}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Detailed Address */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
                        <span>{isAr ? 'العنوان وأقرب نقطة دالة:' : 'Detailed Address & Landmark:'}</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={addressDetails}
                        onChange={(e) => setAddressDetails(e.target.value)}
                        placeholder={isAr ? 'الحي، الشارع، قرب مركز صحي، مدرسة، أو معلم بارز...' : 'District, street, landmark...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Part 3: Order Bump Bonus Offer (عرض زيادة السلة الترويجي) */}
                  {campaign.bonusOfferEnabled && (
                    <div
                      onClick={() => setIncludeBonusOffer(!includeBonusOffer)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        includeBonusOffer
                          ? 'bg-amber-950/70 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            includeBonusOffer ? 'bg-amber-500 border-amber-500 text-stone-950' : 'border-stone-600 bg-stone-950'
                          }`}
                        >
                          {includeBonusOffer && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                            <Gift className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isAr ? campaign.bonusOfferTitleAr : campaign.bonusOfferTitleEn}</span>
                          </div>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {isAr ? 'وفّر حتى 45% عند إضافة هذه القطعة التكميلية لطلبك الآن' : 'Save up to 45% when adding this piece now'}
                          </span>
                        </div>
                      </div>
                      <div className="text-end font-mono shrink-0">
                        <span className="text-xs font-black text-amber-400 block">
                          +{campaign.bonusOfferPriceIQD.toLocaleString()} د.ع
                        </span>
                        <span className="text-[10px] text-stone-500 line-through">
                          {Math.round(campaign.bonusOfferPriceIQD * 1.8).toLocaleString()} د.ع
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Part 4: Final Summary & High-Impact CTA Button */}
                  <div className="pt-2 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-stone-300">
                        <span>سعر المنتج بالعرض الترويجي:</span>
                        <span className="font-mono text-white">{calculatedProductPrice.toLocaleString()} د.ع</span>
                      </div>
                      {includeBonusOffer && (
                        <div className="flex items-center justify-between text-amber-300">
                          <span>عرض الباقة الإضافي:</span>
                          <span className="font-mono">+{campaign.bonusOfferPriceIQD.toLocaleString()} د.ع</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>أجور التوصيل لكافة المحافظات:</span>
                        <span className="font-bold">مجاني 0 د.ع (هدية الحملة)</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-stone-800 font-black text-sm">
                        <span className="text-white">المجموع الإجمالي عند الاستلام (COD):</span>
                        <span className="text-amber-400 text-lg font-mono">{grandTotalIQD.toLocaleString()} د.ع</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 active:scale-[0.99] text-stone-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">جاري تسجيل طلبك...</span>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>{isAr ? 'تأكيد الحجز الفوري - الدفع عند الاستلام 📦' : 'Confirm Instant Booking - Pay on Delivery'}</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-stone-400 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ضمان نون والقلم: المعاينة الكاملة لحزمتك قبل دفع أي دينار لمندوب التوصيل.</span>
                    </p>
                  </div>

                </form>
              </div>

              {/* 6. FAQ & TRUST GUARANTEE (الأسئلة الشائعة والضمان) */}
              <div className="bg-stone-900/60 rounded-3xl p-5 border border-stone-800 space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm mb-2">
                  {isAr ? `أسئلة شائعة يطرحها عملاء إعلانات ${platformInfo.nameAr}:` : `Frequently Asked Questions by ${platformInfo.nameEn} Customers:`}
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80">
                    <span className="font-bold text-amber-300 block mb-1">س: كيف أضمن صحة الاسم والشعار قبل التنفيذ؟</span>
                    <p className="text-stone-400 leading-relaxed">
                      ج: بمجرد إرسال طلبك، يتواصل معك مصمم الورشة ويرسل لك بروفة هندسية رقمية واضحة على واتساب للموافقة عليها قبل أي عملية قص أو طباعة.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80">
                    <span className="font-bold text-amber-300 block mb-1">س: كم يستغرق وصول الطلب؟</span>
                    <p className="text-stone-400 leading-relaxed">
                      ج: يتم تجهيز القطعة وشحنها خلال 24 إلى 48 ساعة فقط، وتصلك عبر شركات التوصيل المعتمدة لجميع محافظات العراق وأقضيتها.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} ورشة نون والقلم للطباعة والتصميم الليزري - جميع الحقوق محفوظة.</p>
        <p className="text-[11px] text-stone-600 mt-1">بغداد، العراق | هاتف وواتساب: 07800000000</p>
      </footer>
    </div>
  );
};
