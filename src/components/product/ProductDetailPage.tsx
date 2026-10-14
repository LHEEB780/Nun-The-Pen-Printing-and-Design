import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  ProductItem,
  DimensionOption,
  LedOption,
  FontOption,
  PRODUCTS,
} from '../../data/mockData';
import { InteractiveAcrylicPlaque } from '../customizer/InteractiveAcrylicPlaque';
import { useCartStore } from '../../store/useCartStore';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
  Truck,
  Clock,
  ChevronRight,
  TrendingDown,
  ShoppingBag,
  RotateCcw,
  Phone,
  Globe,
  Building2,
  Scale,
  Stethoscope,
  Crown,
  Coffee,
  Cpu,
  Plane,
  Layers,
  Ruler,
  Palette,
  Eye,
  Check,
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onBackToShop: () => void;
  onOpenCustomizerModal?: (productId?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBackToShop,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { addItem, setIsOpen: setCartOpen } = useCartStore();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  }, [productId]);

  const isAirplaneProduct = product.id === 'prod-airplane-led';

  // 1. Viewer Mode: 'interactive_mockup' (default) vs 'photo_gallery'
  const [viewerTab, setViewerTab] = useState<'mockup' | 'gallery'>('mockup');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 2. Interactive Plaque State (Defaults to Al-Ufuq as requested)
  const defaultCompanyName = isAirplaneProduct
    ? (isAr ? 'شركة الأفق الدولية' : 'Al-Ufuq International')
    : (isAr ? 'شركة الأفق الدولية' : 'Al-Ufuq International');
  const defaultSubtitle = isAirplaneProduct
    ? (isAr ? 'للسياحة والسفر' : 'Tours & Travel Services')
    : (isAr ? 'للسياحة والسفر' : 'Tours & Travel Services');
  const defaultPhone = '+964 780 123 4567';
  const defaultWebsite = 'www.alufuq.travel';

  const [companyName, setCompanyName] = useState(defaultCompanyName);
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [phone, setPhone] = useState(defaultPhone);
  const [website, setWebsite] = useState(defaultWebsite);
  const [selectedEmblem, setSelectedEmblem] = useState<string>('aviation_travel');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>('');

  // 3. Hardware & LED Options
  const [selectedLed, setSelectedLed] = useState<LedOption>(
    product.ledOptions?.[0] || {
      id: 'led-sky',
      nameAr: 'أزرق سماوي ناصع',
      nameEn: 'Sky Cyan Blue',
      hex: '#38bdf8',
      glowClass: 'shadow-sky-500/50',
    }
  );
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption>(product.dimensions[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);
  const [isLit, setIsLit] = useState(true);

  // 4. Quantity & Pricing
  const [quantity, setQuantity] = useState<number>(product.minQuantity || 1);
  const basePriceUSD = product.basePriceUSD || 24;

  // Calculate tier discount
  const currentTier = useMemo(() => {
    return (
      product.tierPricing.find((tier) => {
        if (tier.maxQty) {
          return quantity >= tier.minQty && quantity <= tier.maxQty;
        }
        return quantity >= tier.minQty;
      }) || product.tierPricing[0]
    );
  }, [product.tierPricing, quantity]);

  const discountPercent = currentTier?.discountPercent || 0;
  const unitPriceUSD = Math.round(basePriceUSD * (1 - discountPercent / 100));
  const totalPriceUSD = unitPriceUSD * quantity;
  const unitPriceIQD = Math.round(product.basePrice * (1 - discountPercent / 100));
  const totalPriceIQD = unitPriceIQD * quantity;

  // 5. Additional Notes (Field below website)
  const [designNotes, setDesignNotes] = useState('');

  // Has the user changed from Al-Ufuq default?
  const isCustomized =
    companyName !== defaultCompanyName ||
    subtitle !== defaultSubtitle ||
    phone !== defaultPhone ||
    website !== defaultWebsite ||
    designNotes.trim() !== '';

  // Reset to original Al-Ufuq template
  const handleResetToAlUfuq = () => {
    setCompanyName(defaultCompanyName);
    setSubtitle(defaultSubtitle);
    setPhone(defaultPhone);
    setWebsite(defaultWebsite);
    setDesignNotes('');
    if (product.ledOptions?.[0]) setSelectedLed(product.ledOptions[0]);
    setIsLit(true);
    toast.info(isAr ? 'تمت استعادة تصميم شركة الأفق الافتراضي' : 'Restored Al-Ufuq template');
  };

  // Add Approved Design to Cart
  const handleAddToCart = () => {
    const formattedNotes = [
      `تصميم معتمد: ${companyName}`,
      subtitle ? `النشاط: ${subtitle}` : '',
      phone ? `الهاتف: ${phone}` : '',
      website ? `الموقع: ${website}` : '',
      designNotes ? `ملاحظات: ${designNotes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    addItem({
      productId: product.id,
      titleAr: product.titleAr,
      titleEn: product.titleEn,
      category: product.category,
      image: product.image,
      quantity,
      unitPrice: unitPriceUSD,
      originalUnitPrice: basePriceUSD,
      totalPrice: totalPriceUSD,
      customOptions: {
        customText: `${companyName} · ${subtitle}`,
        dimensionLabelAr: selectedDimension.labelAr,
        dimensionLabelEn: selectedDimension.labelEn,
        materialLabelAr: selectedMaterial.labelAr,
        materialLabelEn: selectedMaterial.labelEn,
        ledColorNameAr: selectedLed.nameAr,
        ledColorNameEn: selectedLed.nameEn,
        ledHex: selectedLed.hex,
        logoFileName: logoFileName || (selectedEmblem !== 'none' ? selectedEmblem : undefined),
        logoPreviewUrl: logoPreviewUrl || undefined,
        discountPercentage: discountPercent,
        notes: formattedNotes,
        customFormData: {
          companyName,
          subtitle,
          phone,
          website,
          emblem: selectedEmblem,
          isLit,
          designNotes,
        },
      },
    });

    toast.success(
      isAr
        ? `تم اعتماد وتثبيت تصميم (${companyName}) بنجاح وإضافته إلى السلة!`
        : `Approved design (${companyName}) added to cart!`,
      {
        description: isAr
          ? `الكمية: ${quantity} قطع | الإجمالي: $${totalPriceUSD} (${totalPriceIQD.toLocaleString()} د.ع)`
          : `Qty: ${quantity} | Total: $${totalPriceUSD}`,
      }
    );

    setCartOpen(true);
  };

  return (
    <div className="pt-24 pb-28 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToShop}
            type="button"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة لكتالوج المنتجات' : 'Back to Catalog'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>{isAr ? 'المتجر' : 'Shop'}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-400" />
            <span className="text-purple-700 font-bold">
              {isAr ? product.categoryLabelAr : product.categoryLabelEn}
            </span>
          </div>
        </div>

        {/* ========================================================
            TOP 2 COLUMNS:
            LEFT: THE LIVE TRANSFORMING ACRYLIC PLAQUE & QUICK INPUTS
            RIGHT: PRODUCT DETAILS, PRICING & ORDER ACTION
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================
              LEFT COLUMN (6 COLS): THE LIVE INTERACTIVE MOCKUP
             ======================================================== */}
          <div className="lg:col-span-7 space-y-5">
            {/* Viewer Mode Selector Tabs - Perfectly Equal Sized Buttons */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-200/80 backdrop-blur-xs w-full sm:max-w-md">
              <button
                onClick={() => setViewerTab('mockup')}
                type="button"
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                  viewerTab === 'mockup'
                    ? 'bg-purple-700 text-white shadow-sm font-extrabold'
                    : 'text-slate-700 hover:text-purple-900 hover:bg-slate-300/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">{isAr ? 'اللوحة التفاعلية (معاينة حية)' : 'Interactive Plaque'}</span>
              </button>

              <button
                onClick={() => setViewerTab('gallery')}
                type="button"
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                  viewerTab === 'gallery'
                    ? 'bg-purple-700 text-white shadow-sm font-extrabold'
                    : 'text-slate-700 hover:text-purple-900 hover:bg-slate-300/50'
                }`}
              >
                <Eye className="w-4 h-4 text-purple-300 shrink-0" />
                <span className="truncate">{isAr ? `صور المعرض (${product.galleryImages.length})` : `Photo Gallery (${product.galleryImages.length})`}</span>
              </button>
            </div>

            {/* TAB 1: THE PHOTOREALISTIC LIVE PLAQUE VIEW (MATCHES SCREENSHOT) */}
            {viewerTab === 'mockup' ? (
              <div className="space-y-4">
                {/* The glowing acrylic plaque viewport */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 relative">
                  {!isCustomized && selectedLed.id === 'led-sky' ? (
                    /* The authentic master photograph matching Photo 2 */
                    <div className="relative w-full aspect-4/3 sm:aspect-16/11 overflow-hidden select-none">
                      <img
                        src="/images/products/travel_agency_desk_front_1791817396012.jpg"
                        alt={isAr ? 'لوحة شركة الأفق الدولية الأكريليك LED' : 'Al-Ufuq Acrylic LED Plaque'}
                        className="w-full h-full object-cover transition-all duration-300"
                      />

                      {/* Top Floating Controls Bar */}
                      <div className="absolute top-3.5 inset-x-3.5 z-30 flex items-center justify-between gap-2 pointer-events-auto">
                        <button
                          onClick={() => setIsLit(!isLit)}
                          type="button"
                          className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-lg border border-white/15 hover:border-amber-400/50 hover:bg-slate-900 transition-all cursor-pointer"
                        >
                          <Lightbulb
                            className={`w-3.5 h-3.5 transition-colors ${
                              isLit ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-400'
                            }`}
                          />
                          <span className="text-[11px] sm:text-xs">
                            {isLit
                              ? isAr
                                ? 'الإضاءة: مشتعلة'
                                : 'LED: ON'
                              : isAr
                              ? 'الإضاءة: مطفأة'
                              : 'LED: OFF'}
                          </span>
                        </button>

                        <div className="flex items-center gap-1.5 ms-auto">
                          <span className="px-3 py-1.5 rounded-full bg-purple-900/85 text-purple-200 text-[11px] font-bold border border-purple-400/40 backdrop-blur-md shadow-md">
                            {isAr ? 'نموذج الأفق المعتمد' : 'Official Al-Ufuq'}
                          </span>
                          <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-slate-200 text-[11px] font-mono font-bold border border-white/15">
                            {isAr ? selectedDimension.labelAr : selectedDimension.labelEn}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <InteractiveAcrylicPlaque
                      mainTitle={companyName}
                      subtitle={subtitle}
                      phone={phone}
                      website={website}
                      emblemId={selectedEmblem}
                      logoUrl={logoPreviewUrl}
                      ledColorHex={selectedLed.hex}
                      isLit={isLit}
                      dimensionLabel={isAr ? selectedDimension.labelAr : selectedDimension.labelEn}
                      standType="white"
                      viewMode="desk"
                      onToggleLight={() => setIsLit(!isLit)}
                      onResetToTemplate={handleResetToAlUfuq}
                      isCustomized={isCustomized}
                    />
                  )}
                </div>

                {/* Trust, Quality & Delivery Badges - Enhanced Luxury Presentation Directly Below Product Image */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-purple-50/90 via-white to-sky-50/90 border border-purple-200/80 shadow-xs">
                  {/* Badge 1: Quality */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/90 border border-purple-100/70 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                    </div>
                    <div className="leading-tight text-start">
                      <span className="text-xs font-black text-slate-900 block">
                        {isAr ? 'ضمان نقاوة 100%' : '100% Cast Acrylic'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                        {isAr ? 'أكريليك نقي غير قابل للاصفرار' : 'Non-yellowing optical clarity'}
                      </span>
                    </div>
                  </div>

                  {/* Badge 2: Nationwide Delivery */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/90 border border-sky-100/70 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-sky-700" />
                    </div>
                    <div className="leading-tight text-start">
                      <span className="text-xs font-black text-slate-900 block">
                        {isAr ? 'توصيل لبغداد والمحافظات' : 'Nationwide Shipping'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                        {isAr ? 'شحن سريع لكافة محافظات العراق' : 'Fast delivery to all Iraq'}
                      </span>
                    </div>
                  </div>

                  {/* Badge 3: Fast Fabrication */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/90 border border-emerald-100/70 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="leading-tight text-start">
                      <span className="text-xs font-black text-slate-900 block">
                        {isAr ? '24 - 48 ساعة' : 'Fast Lead Time'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                        {isAr ? 'جاهزية التصنيع والشحن' : 'Ready in 24 - 48 hours'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Real-time Dynamic Editing Form right under the plaque */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-purple-100 shadow-xl space-y-6">
                  {/* Header with live transformation indicator and reset */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {isAr
                          ? 'ابدأ بكتابة معلوماتك لتتحول لوحة الأفق مباشرة لتصميمك الخاص:'
                          : 'Type your information to watch the plaque transform live:'}
                      </h3>
                    </div>

                    {isCustomized && (
                      <button
                        onClick={handleResetToAlUfuq}
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isAr ? 'نموذج الأفق' : 'Reset'}</span>
                      </button>
                    )}
                  </div>

                  {/* 1. Core Plaque Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Main Title / Company Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                        <span>{isAr ? 'اسم الشركة أو النص الرئيسي:' : 'Company / Main Title:'}</span>
                        <span className="text-[10px] text-purple-600 font-semibold">
                          {isAr ? '(يتغير فوراً على اللوحة)' : '(Updates live)'}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={isAr ? 'مثال: شركة الأفق الدولية' : 'e.g., Al-Ufuq International'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-slate-50 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>

                    {/* Subtitle / Activity */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                        <span>{isAr ? 'النشاط أو السطر الفرعي:' : 'Subtitle / Business Activity:'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{isAr ? '(اختياري)' : '(Optional)'}</span>
                      </label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder={isAr ? 'مثال: للسياحة والسفر' : 'e.g., Tours & Travel'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-slate-50 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>


                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{isAr ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+964 780 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-slate-50 focus:bg-white transition-all text-start shadow-2xs"
                      />
                    </div>

                    {/* Website / Social Handle */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{isAr ? 'الموقع الإلكتروني أو الحساب:' : 'Website / Social:'}</span>
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="www.alufuq.travel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-slate-50 focus:bg-white transition-all text-start shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 2. Field directly below website: normal field like the rest without colors */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                      <span>{isAr ? 'ملاحظات إضافية أو تفاصيل التصميم:' : 'Additional Notes / Design Details:'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{isAr ? '(اختياري)' : '(Optional)'}</span>
                    </label>
                    <input
                      type="text"
                      value={designNotes}
                      onChange={(e) => setDesignNotes(e.target.value)}
                      placeholder={
                        isAr
                          ? 'أي ملاحظات أو تفاصيل إضافية ترغب بتنفيذها على طلبك...'
                          : 'Any additional notes or custom details for your order...'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-slate-50 focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  {/* 3. Color options: WITHOUT fields, ONLY colored circles according to available colors */}
                  {product.ledOptions && product.ledOptions.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-800">
                          {isAr ? 'الألوان المتوفرة:' : 'Available Colors:'}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {isAr ? selectedLed.nameAr : selectedLed.nameEn}
                        </span>
                      </div>

                      {/* Only colored circles according to available colors */}
                      <div className="flex items-center gap-2.5">
                        {product.ledOptions.map((led) => {
                          const isSelected = selectedLed.id === led.id;
                          const displayName = isAr ? led.nameAr : led.nameEn;
                          const isLight =
                            led.hex.toLowerCase() === '#f8fafc' ||
                            led.hex.toLowerCase() === '#ffffff' ||
                            led.hex.toLowerCase() === '#fefcf9';

                          return (
                            <button
                              key={led.id}
                              type="button"
                              onClick={() => setSelectedLed(led)}
                              title={displayName}
                              aria-label={displayName}
                              className={`relative w-8 h-8 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                                isSelected
                                  ? 'scale-115 ring-2 ring-purple-600 ring-offset-2 border-transparent shadow-md'
                                  : 'hover:scale-105 border-slate-300 opacity-85 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: led.hex,
                                boxShadow: isSelected ? `0 0 12px ${led.hex}` : undefined,
                              }}
                            >
                              {isSelected && (
                                <Check
                                  className={`w-4 h-4 ${isLight ? 'text-slate-900' : 'text-white'} drop-shadow-sm`}
                                  strokeWidth={3}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: REAL PHOTO GALLERY */
              <div className="space-y-4">
                <div className="relative aspect-4/3 w-full rounded-3xl bg-slate-950 overflow-hidden shadow-xl border border-slate-200/80 group">
                  <img
                    src={product.galleryImages[activeImageIndex] || product.image}
                    alt={isAr ? product.titleAr : product.titleEn}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      type="button"
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-purple-600 scale-105 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ========================================================
              RIGHT COLUMN (5 COLS):
              PRODUCT DETAILS, VOLUME PRICING & ORDER ACTION
             ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price & Quantity Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-purple-100 shadow-xl shadow-purple-900/5 space-y-4 relative">
              {/* Top Row: Price on one side, Quantity on the other */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {quantity > 1
                        ? (isAr ? 'الإجمالي للطلب:' : 'Total Order:')
                        : (isAr ? 'السعر النهائي:' : 'Unit Price:')}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                        {isAr ? `خصم ${discountPercent}%` : `${discountPercent}% OFF`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black text-purple-700 font-mono tracking-tight">
                      ${quantity > 1 ? totalPriceUSD : unitPriceUSD}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-500 font-mono">
                      ({(quantity > 1 ? totalPriceIQD : unitPriceIQD).toLocaleString()} {isAr ? 'د.ع' : 'IQD'})
                    </span>
                  </div>
                  {quantity > 1 && (
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {isAr
                        ? `(سعر القطعة: $${unitPriceUSD} شامل الخصم)`
                        : `($${unitPriceUSD}/pc with discount)`}
                    </span>
                  )}
                </div>

                {/* Tactile Quantity Selector */}
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-black text-base flex items-center justify-center cursor-pointer transition-colors shadow-2xs active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <div className="px-2 text-center min-w-8">
                    <span className="font-mono font-black text-base text-slate-900 block leading-none">
                      {quantity}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 block -mt-0.5">
                      {isAr ? 'قطع' : 'pcs'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-base flex items-center justify-center cursor-pointer transition-colors shadow-2xs active:scale-95"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order Specifications Summary Badge - Refined Luxury Light Style */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/50 border border-slate-200/90 space-y-2.5 text-xs shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isAr ? 'مواصفات التصميم المعتمد فورياً:' : 'Instant Approved Specs:'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/60">
                    {isAr ? 'جاهز للتنفيذ' : 'Ready'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-slate-700">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block">{isAr ? 'الاسم:' : 'Name:'}</span>
                    <span className="font-extrabold text-slate-900 truncate block max-w-full">
                      {companyName}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block">{isAr ? 'لون الإضاءة:' : 'LED Glow:'}</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: selectedLed.hex, boxShadow: `0 0 6px ${selectedLed.hex}` }}
                      />
                      <span className="font-bold text-slate-800 truncate">
                        {isAr ? selectedLed.nameAr : selectedLed.nameEn}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block">{isAr ? 'المقاس المعتمد:' : 'Size:'}</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {isAr ? selectedDimension.labelAr : selectedDimension.labelEn}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block">{isAr ? 'معلومات إضافية:' : 'Extra Details:'}</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {designNotes ? designNotes : (isAr ? 'تصميم قياسي' : 'Standard')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Volume Discount Tiers Grid - Moved Above Action Button */}
              <div className="border-t border-slate-100 pt-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    {isAr ? 'جدول خصومات الكميات (Tiered Pricing):' : 'Tiered Pricing Table:'}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {isAr ? `مفعل: خصم ${discountPercent}%` : `Active: ${discountPercent}% off`}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {/* Tier 1: 1 - 5 */}
                  <button
                    type="button"
                    onClick={() => setQuantity(1)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      quantity >= 1 && quantity <= 5
                        ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 block">
                      {isAr ? '1 - 5 قطع' : '1 - 5 pcs'}
                    </span>
                    <span className="text-sm font-black text-slate-900 font-mono block mt-0.5">
                      $24
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block">
                      {isAr ? 'سعر قياسي' : 'Standard'}
                    </span>
                  </button>

                  {/* Tier 2: 6 - 20 */}
                  <button
                    type="button"
                    onClick={() => setQuantity(6)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      quantity >= 6 && quantity <= 20
                        ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 block">
                      {isAr ? '6 - 20 قطعة' : '6 - 20 pcs'}
                    </span>
                    <span className="text-sm font-black text-emerald-700 font-mono block mt-0.5">
                      $20.40
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 block">
                      {isAr ? 'خصم 15%' : '15% Off'}
                    </span>
                  </button>

                  {/* Tier 3: 21+ */}
                  <button
                    type="button"
                    onClick={() => setQuantity(21)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      quantity >= 21
                        ? 'bg-purple-100/90 border-purple-500 ring-2 ring-purple-600/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 block">
                      {isAr ? '21+ قطعة' : '21+ pcs'}
                    </span>
                    <span className="text-sm font-black text-purple-700 font-mono block mt-0.5">
                      $16.80
                    </span>
                    <span className="text-[9px] font-bold text-purple-600 block">
                      {isAr ? 'خصم 30%' : '30% Off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* PRIMARY ACTION BUTTON: ADD TO CART WITH DESIGN */}
              <button
                onClick={handleAddToCart}
                type="button"
                className="w-full py-3.5 sm:py-4 px-5 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-purple-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform shrink-0" />
                <span>{isAr ? 'اعتماد التصميم وإضافة للسلة' : 'Approve Design & Add to Cart'}</span>
              </button>
            </div>

            {/* Key Features Bullet List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                {isAr ? 'مميزات التصنيع الدقيق:' : 'Fabrication Features:'}
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {(isAr ? product.featuresAr : product.featuresEn).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specifications Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2.5">
                {isAr ? 'المواصفات الفنية المعتمدة:' : 'Technical Specifications:'}
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white text-xs shadow-2xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <span className="font-semibold text-slate-600">
                      {isAr ? spec.keyAr : spec.keyEn}
                    </span>
                    <span className="text-slate-900 text-end font-medium">
                      {isAr ? spec.valAr : spec.valEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
