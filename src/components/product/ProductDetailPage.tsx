import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  ProductItem,
  DimensionOption,
  LedOption,
  PRODUCTS,
} from '../../data/mockData';
import { useAdminStore } from '../../store/useAdminStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Clock,
  ChevronRight,
  ShoppingBag,
  Phone,
  Layers,
  Ruler,
  Palette,
  Eye,
  Check,
  Upload,
  FileText,
  X,
  MessageCircle,
  HelpCircle,
  Maximize2,
  Bell,
  Lock,
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
  const { addDigitalProof } = useAuthStore();
  const adminProducts = useAdminStore((state) => state.adminProducts);
  const productsList = adminProducts && adminProducts.length > 0 ? adminProducts : PRODUCTS;

  const product = useMemo(() => {
    return productsList.find((p) => p.id === productId) || productsList[0];
  }, [productsList, productId]);

  // Gallery state
  const galleryPhotos = useMemo(() => {
    const list = [product.image];
    if (product.galleryImages && product.galleryImages.length > 0) {
      product.galleryImages.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Client Order & Customization Data Inputs
  const [companyName, setCompanyName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [designNotes, setDesignNotes] = useState('');

  // Logo / File Upload
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options & Selections
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption>(
    product.dimensions?.[0] || { id: 'std', labelAr: 'قياسي', labelEn: 'Standard', multiplier: 1, widthCm: 20, heightCm: 15 }
  );
  const [selectedMaterial, setSelectedMaterial] = useState(
    product.materials?.[0] || { id: 'std', labelAr: 'تشطيب قياسي فاخر', labelEn: 'Standard Luxury Finish', priceAdd: 0 }
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

  // Quantity & Pricing
  const minOrderQty = product.minQuantity || 1;
  const [quantity, setQuantity] = useState<number>(minOrderQty);

  // Tier pricing calculation
  const currentTier = useMemo(() => {
    if (!product.tierPricing || product.tierPricing.length === 0) return null;
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
  const dimensionMultiplier = selectedDimension.multiplier || 1;
  const materialAddPrice = selectedMaterial.priceAdd || 0;

  const baseCalculated = (product.basePrice * dimensionMultiplier + materialAddPrice);
  const unitPriceIQD = Math.round(baseCalculated * (1 - discountPercent / 100));
  const totalPriceIQD = unitPriceIQD * quantity;
  const unitPriceUSD = Math.round((product.basePriceUSD || 24) * dimensionMultiplier * (1 - discountPercent / 100));
  const totalPriceUSD = unitPriceUSD * quantity;

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error(isAr ? 'حجم الملف يتجاوز الحد الأقصى (25MB)' : 'File size exceeds 25MB limit');
        return;
      }
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);

      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFileUrl(event.target?.result as string);
        toast.success(isAr ? `تم رفع ملف: ${file.name}` : `Uploaded file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFileUrl(null);
    setUploadedFileName('');
    setUploadedFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info(isAr ? 'تم حذف الملف المرفوع' : 'Uploaded file removed');
  };

  // Add Order to Cart
  const handleAddToCart = () => {
    if (!companyName.trim()) {
      toast.error(isAr ? 'يرجى كتابة اسم الشركة أو النص المطلوب لتجهيز التصميم' : 'Please provide the text / title for the design');
      return;
    }

    const formattedNotes = [
      `بيانات العميل: ${companyName}`,
      subtitle ? `النشاط/الصفة: ${subtitle}` : '',
      phone ? `هاتف وواتساب: ${phone}` : '',
      website ? `الموقع/الرابط: ${website}` : '',
      uploadedFileName ? `الملف المرفوع: ${uploadedFileName}` : '',
      designNotes ? `ملاحظات العميل: ${designNotes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    addItem({
      productId: product.id,
      titleAr: product.titleAr,
      titleEn: product.titleEn,
      category: product.category,
      image: galleryPhotos[activeImageIndex] || product.image,
      quantity,
      unitPrice: unitPriceUSD,
      originalUnitPrice: Math.round((product.basePriceUSD || 24) * dimensionMultiplier),
      totalPrice: totalPriceUSD,
      customOptions: {
        customText: `${companyName}${subtitle ? ` · ${subtitle}` : ''}`,
        dimensionLabelAr: selectedDimension.labelAr,
        dimensionLabelEn: selectedDimension.labelEn,
        materialLabelAr: selectedMaterial.labelAr,
        materialLabelEn: selectedMaterial.labelEn,
        ledColorNameAr: product.category === 'led' ? selectedLed.nameAr : undefined,
        ledColorNameEn: product.category === 'led' ? selectedLed.nameEn : undefined,
        ledHex: product.category === 'led' ? selectedLed.hex : undefined,
        logoFileName: uploadedFileName || undefined,
        logoPreviewUrl: uploadedFileUrl || undefined,
        discountPercentage: discountPercent,
        notes: formattedNotes,
        customFormData: {
          companyName,
          subtitle,
          phone,
          website,
          designNotes,
          uploadedFileName,
        },
      },
    });

    // Also register an active digital proof in the customer account so they get alerted!
    const mockOrderId = `NP-${Date.now().toString().slice(-4)}`;
    addDigitalProof({
      orderId: mockOrderId,
      productTitleAr: product.titleAr,
      productTitleEn: product.titleEn,
      previewUrl: galleryPhotos[activeImageIndex] || product.image,
      status: 'pending_approval',
      specsAr: `${companyName} | ${selectedDimension.labelAr} | ${selectedMaterial.labelAr}`,
      specsEn: `${companyName} | ${selectedDimension.labelEn} | ${selectedMaterial.labelEn}`,
      clientNotes: designNotes,
      whatsappMessage: `مرحباً استوديو نون والقلم، قمت بتثبيت طلب ${product.titleAr} برقم مؤقت ${mockOrderId}. الاسم: ${companyName}. أرجو إرسال بروفة التصميم للاعتماد.`,
    });

    toast.success(
      isAr
        ? `تم رفع بيانات طلب (${companyName}) بنجاح وإضافته إلى السلة!`
        : `Order data for (${companyName}) added to cart!`,
      {
        description: isAr
          ? 'سيقوم فريق التصميم بتجهيز البروفة الرقمية وإرسالها لحسابك وعلى واتساب للاعتماد.'
          : 'Our design engineers will send a digital proof to your account and WhatsApp.',
      }
    );

    setCartOpen(true);
  };

  // WhatsApp Pre-filled Consultation URL
  const whatsappInquiryUrl = `https://wa.me/9647800000000?text=${encodeURIComponent(
    `مرحباً نون والقلم، أود الاستفسار وطلب تصميم خاص لمنتج: ${isAr ? product.titleAr : product.titleEn}\n` +
      (companyName ? `اسم الجهة/النص: ${companyName}\n` : '') +
      (phone ? `رقم التواصل: ${phone}\n` : '') +
      `المقاس: ${isAr ? selectedDimension.labelAr : selectedDimension.labelEn}\n` +
      `الكمية المطلوبة: ${quantity} قطعة\n` +
      `أرجو تزويدي بالبروفة الرقمية والتفاصيل.`
  )}`;

  return (
    <div className="pt-24 pb-28 bg-slate-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToShop}
            type="button"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-amber-900 transition-colors cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة لكتالوج المنتجات' : 'Back to Catalog'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-400" />
            <span className="text-amber-900 font-bold">
              {isAr ? product.categoryLabelAr : product.categoryLabelEn}
            </span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-[200px]">
              {isAr ? product.titleAr : product.titleEn}
            </span>
          </div>
        </div>

        {/* ========================================================
            MAIN PRODUCT TWO-COLUMN INTERFACE:
            LEFT: AUTHENTIC PRODUCT PHOTO GALLERY & CLIENT DATA FORM
            RIGHT: PRICING, VOLUME DISCOUNTS & PURCHASE ACTIONS
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ========================================================
              LEFT COLUMN (7 COLS):
              1. PRODUCT PHOTO GALLERY
              2. STUDIO DESIGN PROOF NOTIFICATION
              3. CLIENT DATA & ARTWORK UPLOAD FORM
             ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. AUTHENTIC PRODUCT PHOTO GALLERY (No Interactive Simulator) */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              
              {/* Main Large Hero Photo Display */}
              <div className="relative aspect-4/3 w-full rounded-2xl bg-slate-950 overflow-hidden shadow-inner group select-none">
                <img
                  src={galleryPhotos[activeImageIndex] || product.image}
                  alt={isAr ? product.titleAr : product.titleEn}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-104 cursor-zoom-in"
                  onClick={() => setFullscreenImage(galleryPhotos[activeImageIndex] || product.image)}
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3.5 start-3.5 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30 shadow-md">
                    {isAr ? product.categoryLabelAr : product.categoryLabelEn}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                    {isAr
                      ? `صورة ${activeImageIndex + 1} من ${galleryPhotos.length}`
                      : `${activeImageIndex + 1} of ${galleryPhotos.length}`}
                  </span>
                </div>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => setFullscreenImage(galleryPhotos[activeImageIndex] || product.image)}
                  className="absolute top-3.5 end-3.5 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-white hover:text-amber-300 transition-colors cursor-pointer border border-white/20"
                  title={isAr ? 'عرض ملء الشاشة' : 'Fullscreen'}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Base Price Overlay Tag */}
                <div className="absolute bottom-3.5 end-3.5 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-950 text-xs font-black shadow-md border border-slate-200">
                  {product.basePrice.toLocaleString()} د.ع
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              {galleryPhotos.length > 1 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 block px-1">
                    {isAr ? 'معرض صور وتفاصيل المنتج (انقر للتبديل):' : 'Product Photo Gallery (click to view):'}
                  </span>
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                    {galleryPhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        type="button"
                        className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-amber-600 scale-105 shadow-md ring-2 ring-amber-500/30'
                            : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="Thumbnail" className="w-full h-full object-cover" />
                        {activeImageIndex === idx && (
                          <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Workshop Trust & Guarantee Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">{isAr ? 'خامات أصلية 100%' : '100% Virgin Cast'}</span>
                    <span className="text-[10px] text-slate-500">{isAr ? 'غير قابل للاصفرار' : 'Top durability'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">{isAr ? 'تنفيذ 3 - 5 أيام' : '3-5 Days'}</span>
                    <span className="text-[10px] text-slate-500">{isAr ? 'في ورشة بغداد' : 'Baghdad workshop'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">{isAr ? 'شحن لكافة المحافظات' : 'All Iraq Shipping'}</span>
                    <span className="text-[10px] text-slate-500">{isAr ? 'تغليف حماية صلب' : 'Protective packing'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 2. STUDIO DESIGN PROOF NOTIFICATION BANNER (Reassuring Workflow) */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-amber-100/40 to-purple-50 border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-amber-950 font-black text-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-2xs">
                  🎨
                </div>
                <span>
                  {isAr
                    ? 'تصميم قطعتك يتم باحترافية على يد مهندسي وفناني نُون والقَلَم'
                    : 'Your design is handcrafted by Noon & Pen production engineers'}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {isAr
                  ? 'أدخل بياناتك وارفع شعارك أو ملفاتك أدناه وأضف طلبك للسلة. سيقوم فريقنا الهندسي بتجهيز البروفة الرقمية المعتمدة (Digital Proof) وإرسال نسخة منها مباشرة إلى حسابك لدينا في الموقع مع إشعار تنبيهي بارز، كما سنرسل لك نسخة عبر واتساب للتواصل السريع والاعتماد الفوري قبل بدء القص والطباعة.'
                  : 'Submit your text and upload your logo/files below. Our team will prepare a high-resolution digital proof, sent directly to your customer account with an alert notification, and via WhatsApp for quick approval before manufacturing.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-bold text-amber-900">
                <span className="flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isAr ? 'إشعار فوري بحسابك' : 'Account Notification'}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isAr ? 'نسخة بروفة على واتساب' : 'WhatsApp Copy'}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-purple-700" />
                  <span>{isAr ? 'لا نبدأ التصنيع إلا بعد موافقتك' : 'No production without approval'}</span>
                </span>
              </div>
            </div>

            {/* 3. CLIENT DATA & ARTWORK UPLOAD FORM */}
            <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-sm font-black text-slate-900">
                    {isAr ? 'بيانات الطلب والملفات المطلوبة للتصميم:' : 'Order Data & Artwork Upload:'}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {isAr ? 'خطوة 1 من 2' : 'Step 1 of 2'}
                </span>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Main Text / Company Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{isAr ? 'اسم الشركة / النص الرئيسي المطلوب:*' : 'Company / Main Title:*'}</span>
                    <span className="text-[10px] text-amber-800 font-bold">{isAr ? '(مطلوب)' : '(Required)'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={isAr ? 'مثال: شركة الأفق الدولية' : 'e.g. Al-Ufuq International'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                {/* Subtitle / Activity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{isAr ? 'النشاط أو السطر الفرعي / صفة الإهداء:' : 'Subtitle / Business Activity:'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{isAr ? '(اختياري)' : '(Optional)'}</span>
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder={isAr ? 'مثال: للسياحة والسفر | أو مبروك التخرج' : 'e.g. Travel & Tourism'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? 'رقم الهاتف / واتساب للتواصل وإرسال البروفة:*' : 'Phone / WhatsApp for Proofs:*'}</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+964 780 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-slate-50 focus:bg-white transition-all text-start"
                  />
                </div>

                {/* Website or extra text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    <span>{isAr ? 'الموقع الإلكتروني أو نص إضافي:' : 'Website or Extra Line:'}</span>
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder={isAr ? 'www.company.com أو رقم الترخيص' : 'www.company.com'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

              </div>

              {/* Logo & Artwork File Upload Box */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-800" />
                    <span>{isAr ? 'رفع ملف الشعار أو التصميم (Logo & Artwork):' : 'Upload Logo / Artwork Files:'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isAr ? 'يدعم PNG, JPG, PDF, SVG, AI حتى 25MB' : 'PNG, JPG, PDF, SVG, AI up to 25MB'}
                  </span>
                </label>

                {uploadedFileName ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {uploadedFileUrl && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-amber-200 shrink-0">
                          <img src={uploadedFileUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{uploadedFileName}</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{uploadedFileSize}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeUploadedFile}
                      className="p-1.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title={isAr ? 'إزالة الملف' : 'Remove file'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl bg-slate-50 hover:bg-amber-50/30 transition-all cursor-pointer group">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-amber-800 mb-2 transition-colors" />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">
                      {isAr ? 'انقر لاختيار الشعار أو اسحبه هنا' : 'Click to select logo or drag here'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      {isAr ? 'إذا لم يتوفر شعار، سيقوم خطاطونا بتصميم اسمك بأرقى الخطوط العربية' : 'If no logo, our calligraphers will design your title'}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf,.ai,.svg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Dimensions Selector */}
              {product.dimensions && product.dimensions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-purple-700" />
                      <span>{isAr ? 'اختر المقاس والأبعاد التنفيذية:' : 'Select Dimensions:'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedDimension.widthCm} × {selectedDimension.heightCm} سم
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.dimensions.map((dim) => {
                      const isSelected = selectedDimension.id === dim.id;
                      return (
                        <button
                          key={dim.id}
                          type="button"
                          onClick={() => setSelectedDimension(dim)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-start transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="block truncate">{isAr ? dim.labelAr : dim.labelEn}</span>
                          <span className={`block text-[10px] mt-0.5 font-mono ${isSelected ? 'text-amber-200' : 'text-slate-400'}`}>
                            {dim.widthCm} × {dim.heightCm} سم
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Material & Finish Selector */}
              {product.materials && product.materials.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-800" />
                    <span>{isAr ? 'الخامة ونوع التشطيب:' : 'Material & Finish:'}</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.materials.map((mat) => {
                      const isSelected = selectedMaterial.id === mat.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setSelectedMaterial(mat)}
                          className={`p-3 rounded-xl border text-xs font-bold text-start transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="block">{isAr ? mat.labelAr : mat.labelEn}</span>
                          {mat.priceAdd > 0 && (
                            <span className={`block text-[10px] mt-0.5 font-mono ${isSelected ? 'text-amber-300' : 'text-amber-800'}`}>
                              +{mat.priceAdd.toLocaleString()} د.ع
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LED Lighting Color (If LED product) */}
              {product.category === 'led' && product.ledOptions && product.ledOptions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-purple-700" />
                      <span>{isAr ? 'لون إضاءة LED المفضل للقطعة:' : 'Preferred LED Illumination:'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-purple-700">
                      {isAr ? selectedLed.nameAr : selectedLed.nameEn}
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.ledOptions.map((led) => {
                      const isSelected = selectedLed.id === led.id;
                      return (
                        <button
                          key={led.id}
                          type="button"
                          onClick={() => setSelectedLed(led)}
                          className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                            isSelected ? 'scale-115 border-slate-900 ring-2 ring-purple-500/40' : 'border-slate-200'
                          }`}
                          style={{ backgroundColor: led.hex }}
                          title={isAr ? led.nameAr : led.nameEn}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Design Instructions */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-800">
                  <span>{isAr ? 'ملاحظات وتعليمات خاصة للمصمم وورشة التنفيذ:' : 'Special Design Instructions for Workshop:'}</span>
                </label>
                <textarea
                  rows={3}
                  value={designNotes}
                  onChange={(e) => setDesignNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? 'اكتب أي توجيهات إضافية (مثل: نوع الخط المفضل، موضع الشعار، تثبيت قاعدة معينة، أو موعد تسليم محدد)...'
                      : 'Add any specific notes on fonts, placement, or delivery deadlines...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-slate-50 focus:bg-white transition-all resize-none"
                />
              </div>

            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN (5 COLS):
              PRICING, VOLUME DISCOUNTS & PURCHASE ACTION
             ======================================================== */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Purchase & Pricing Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xl space-y-5">
              
              {/* Product Header */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  {isAr ? product.categoryLabelAr : product.categoryLabelEn}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {isAr ? product.titleAr : product.titleEn}
                </h1>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {isAr ? product.descriptionAr : product.descriptionEn}
                </p>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {quantity > 1 ? (isAr ? 'إجمالي الطلب:' : 'Total:') : (isAr ? 'السعر النهائي:' : 'Unit Price:')}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {isAr ? `خصم كميات ${discountPercent}%` : `${discountPercent}% OFF`}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-slate-950">
                      {totalPriceIQD.toLocaleString()} د.ع
                    </span>
                    <span className="text-xs text-slate-400 font-mono ms-2">
                      (${totalPriceUSD})
                    </span>
                  </div>
                  {quantity > 1 && (
                    <span className="text-xs text-slate-500">
                      ({unitPriceIQD.toLocaleString()} د.ع / قطعة)
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{isAr ? 'الكمية المطلوبة للطلب:' : 'Order Quantity:'}</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isAr ? `الحد الأدنى: ${minOrderQty} قطعة` : `Min order: ${minOrderQty}`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(minOrderQty, quantity - 1))}
                    disabled={quantity <= minOrderQty}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-800 font-black text-lg flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={minOrderQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(minOrderQty, parseInt(e.target.value) || minOrderQty))}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-center font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-black text-lg flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Volume Discount Tiers Display */}
              {product.tierPricing && product.tierPricing.length > 1 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    {isAr ? 'جدول خصومات الكميات التلقائية:' : 'Tiered Volume Discounts:'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {product.tierPricing.map((tier, idx) => {
                      const isApplied = currentTier?.discountPercent === tier.discountPercent;
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl text-center border text-[10px] font-bold transition-all ${
                            isApplied
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-1 ring-emerald-400/40'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          <span className="block">{tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} قطع</span>
                          <span className={`block font-black mt-0.5 ${isApplied ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {tier.discountPercent > 0 ? `خصم ${tier.discountPercent}%` : 'سعر أساسي'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Primary Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-900 to-slate-900 hover:from-amber-800 hover:to-slate-800 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>{isAr ? 'إضافة إلى السلة وتثبيت بيانات التصميم' : 'Add to Cart & Submit Order'}</span>
              </button>

              {/* Direct WhatsApp Consultation Button */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>{isAr ? 'إرسال نسخة الطلب لواتساب للتواصل الأسرع 💬' : 'Send Order Copy to WhatsApp (Fast Communication) 💬'}</span>
              </a>

              {/* Workflow Recap list */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-700 space-y-2">
                <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wide">
                  {isAr ? 'ماذا سيحدث بعد إتمام الطلب؟' : 'What happens after ordering?'}
                </span>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{isAr ? 'يقوم فريق التصميم بإعداد بروفة هندسية مخصصة' : 'Engineers craft a tailored digital proof'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{isAr ? 'إرسال نسخة لحسابك وإشعار تنبيهي فوري' : 'Sent to your account with alert badge'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{isAr ? 'إرسال نسخة على واتساب للتواصل السريع والاعتماد' : 'Sent on WhatsApp for quick confirmation'}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 end-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
