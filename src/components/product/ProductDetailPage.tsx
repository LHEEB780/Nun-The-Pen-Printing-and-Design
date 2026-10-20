import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  ProductItem,
  DimensionOption,
  LedOption,
  PRODUCTS,
} from '../../data/mockData';
import { useAdminStore, getUnifiedProducts } from '../../store/useAdminStore';
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
  ChevronLeft,
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
  Share2,
  Copy,
  ExternalLink,
  Send,
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
  const productsList = useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  const product = useMemo(() => {
    // 1. Direct match in productsList
    const match = productsList.find((p) => p.id === productId);
    if (match) return match;
    // 2. Direct match in PRODUCTS (mockData source of truth)
    const directMatch = PRODUCTS.find((p) => p.id === productId);
    if (directMatch) return directMatch;
    // 3. Fallback
    return productsList[0] || PRODUCTS[0];
  }, [productsList, productId]);

  // Gallery state
  const galleryPhotos = useMemo(() => {
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.galleryImages && product.galleryImages.length > 0) {
      product.galleryImages.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : [product.image];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Image Navigation Handlers (أزرار تحريك صور المنتج)
  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (galleryPhotos.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (galleryPhotos.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  // Keyboard arrow keys navigation for photos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        if (isAr) {
          handlePrevImage();
        } else {
          handleNextImage();
        }
      } else if (e.key === 'ArrowLeft') {
        if (isAr) {
          handleNextImage();
        } else {
          handlePrevImage();
        }
      } else if (e.key === 'Escape') {
        if (fullscreenImage) {
          setFullscreenImage(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryPhotos.length, isAr, fullscreenImage]);

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

  // Reset selections and active photo whenever product changes
  useEffect(() => {
    setActiveImageIndex(0);
    if (product.dimensions && product.dimensions.length > 0) {
      setSelectedDimension(product.dimensions[0]);
    }
    if (product.materials && product.materials.length > 0) {
      setSelectedMaterial(product.materials[0]);
    }
    if (product.ledOptions && product.ledOptions.length > 0) {
      setSelectedLed(product.ledOptions[0]);
    }
  }, [product.id]);

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

  // Web Share API & Social Sharing State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Get share URL and pre-formatted text for Web Share API
  const getSharePayload = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const shareUrl = `${origin}${pathname}?product=${encodeURIComponent(product.id)}`;
    const shareTitle = isAr ? `${product.titleAr} | نون والقلم` : `${product.titleEn} | Noon & Al-Qalam`;
    const categoryLabel = isAr ? product.categoryLabelAr : product.categoryLabelEn;
    const formattedPrice = `${product.basePrice.toLocaleString()} د.ع`;
    const shareText = isAr
      ? `✨ شاهد هذا المنتج الحصري من نون والقلم للطباعة والتصميم:\n💎 ${product.titleAr} (${categoryLabel})\n💰 السعر: ${formattedPrice}\n\nتفضل بالاطلاع على التفاصيل والخيارات:`
      : `✨ Check out this custom product from Noon & Al-Qalam:\n💎 ${product.titleEn} (${categoryLabel})\n💰 Price: ${formattedPrice}\n\nView details & specs:`;

    return { shareUrl, shareTitle, shareText, categoryLabel, formattedPrice };
  };

  // Copy Link Handler
  const handleCopyProductLink = async () => {
    const { shareUrl } = getSharePayload();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setLinkCopied(true);
      toast.success(isAr ? 'تم نسخ رابط وتفاصيل المنتج للحافظة بنجاح!' : 'Product link copied to clipboard!');
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      toast.error(isAr ? 'تعذر نسخ الرابط تلقائياً' : 'Could not copy link');
    }
  };

  // Web Share API Execution Handler
  const handleShareProduct = async () => {
    const { shareUrl, shareTitle, shareText } = getSharePayload();

    // Check if navigator.share (Web Share API) is supported
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success(isAr ? 'تمت مشاركة المنتج بنجاح!' : 'Product shared successfully!');
        return;
      } catch (err: any) {
        // If user actively cancelled the share sheet, do not show error
        if (err && (err.name === 'AbortError' || err.code === 20)) {
          return;
        }
        // Fallback to share modal on other errors
        setShareModalOpen(true);
      }
    } else {
      // If Web Share API is not supported in current environment (e.g. desktop), open interactive share modal
      setShareModalOpen(true);
    }
  };

  return (
    <div className="pt-24 pb-28 bg-slate-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Compact Return Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToShop}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 active:scale-95 text-amber-200 hover:text-amber-100 border border-amber-800/40 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
              title={isAr ? 'العودة للاستوديو' : 'Back to Studio'}
            >
              {isAr ? (
                <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              ) : (
                <ArrowLeft className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              )}
              <span>{isAr ? 'عودة للاستوديو' : 'Back to Studio'}</span>
            </button>

            {/* Share Product Button in Navigation Bar */}
            <button
              onClick={handleShareProduct}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-950 border border-amber-300/80 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
              title={isAr ? 'مشاركة رابط وتفاصيل المنتج (Web Share API)' : 'Share Product (Web Share API)'}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-800 group-hover:scale-110 transition-transform" />
              <span>{isAr ? 'مشاركة المنتج' : 'Share'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              type="button"
              onClick={onBackToShop}
              className="hover:text-amber-900 transition-colors cursor-pointer"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-400 shrink-0" />
            <button
              type="button"
              onClick={onBackToShop}
              className="text-amber-900 font-bold hover:underline cursor-pointer"
            >
              {isAr ? product.categoryLabelAr : product.categoryLabelEn}
            </button>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-400 shrink-0" />
            <span className="text-slate-800 font-bold truncate max-w-[160px] sm:max-w-[260px]">
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
              
              {/* Main Large Hero Photo Display (Unobstructed View) */}
              <div className="relative aspect-4/3 w-full rounded-2xl bg-slate-950 overflow-hidden shadow-inner group select-none">
                <img
                  src={galleryPhotos[activeImageIndex] || product.image}
                  alt={isAr ? product.titleAr : product.titleEn}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-104 cursor-zoom-in"
                  onClick={() => setFullscreenImage(galleryPhotos[activeImageIndex] || product.image)}
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 start-3 flex items-center gap-2 z-10">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-500/30 shadow-md">
                    {isAr ? product.categoryLabelAr : product.categoryLabelEn}
                  </span>
                  <span className="px-2 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                    {isAr
                      ? `صورة ${activeImageIndex + 1} من ${galleryPhotos.length}`
                      : `${activeImageIndex + 1} of ${galleryPhotos.length}`}
                  </span>
                </div>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => setFullscreenImage(galleryPhotos[activeImageIndex] || product.image)}
                  className="absolute top-3 end-3 p-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white hover:text-amber-300 transition-colors cursor-pointer border border-white/20 z-10"
                  title={isAr ? 'عرض ملء الشاشة' : 'Fullscreen'}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Base Price Overlay Tag */}
                <div className="absolute bottom-3 end-3 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-950 text-xs font-black shadow-md border border-slate-200 z-10">
                  {product.basePrice.toLocaleString()} د.ع
                </div>
              </div>

              {/* Gallery Thumbnails Strip & Controls Below Photo */}
              {galleryPhotos.length > 1 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500">
                    <span>{isAr ? 'معرض صور وتفاصيل المنتج:' : 'Product Photo Gallery:'}</span>
                    <span className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                      {isAr ? `صورة ${activeImageIndex + 1} من ${galleryPhotos.length}` : `${activeImageIndex + 1} / ${galleryPhotos.length}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                    {galleryPhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        type="button"
                        className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-amber-700 scale-102 shadow-md ring-2 ring-amber-500/25'
                            : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="Thumbnail" className="w-full h-full object-cover" />
                        {activeImageIndex === idx && (
                          <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Image Navigation Controls Bar BELOW Photo Strip (أسفل شريط الصور - أزرار بدون نص بسهم وتدرج ظلي) */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 hover:from-amber-800 hover:via-stone-850 hover:to-amber-900 active:scale-95 text-amber-200 border border-amber-700/50 transition-all cursor-pointer shadow-md shadow-amber-950/30 group"
                      title={isAr ? 'الصورة السابقة' : 'Previous Photo'}
                      aria-label={isAr ? 'الصورة السابقة' : 'Previous Photo'}
                    >
                      {isAr ? (
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      ) : (
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      )}
                    </button>

                    {/* Compact Dots */}
                    <div className="flex items-center gap-1.5">
                      {galleryPhotos.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setActiveImageIndex(dotIdx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeImageIndex === dotIdx
                              ? 'w-5 bg-amber-800 shadow-xs'
                              : 'w-1.5 bg-amber-200 hover:bg-amber-300'
                          }`}
                          title={isAr ? `صورة ${dotIdx + 1}` : `Photo ${dotIdx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 hover:from-amber-800 hover:via-stone-850 hover:to-amber-900 active:scale-95 text-amber-200 border border-amber-700/50 transition-all cursor-pointer shadow-md shadow-amber-950/30 group"
                      title={isAr ? 'الصورة التالية' : 'Next Photo'}
                      aria-label={isAr ? 'الصورة التالية' : 'Next Photo'}
                    >
                      {isAr ? (
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      ) : (
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </button>
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
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                      {isAr ? product.categoryLabelAr : product.categoryLabelEn}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">
                      {isAr ? 'كود: ' : 'SKU: '}{product.slug}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleShareProduct}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100/80 text-slate-700 hover:text-amber-950 border border-slate-200 text-xs font-bold transition-all cursor-pointer group"
                    title={isAr ? 'مشاركة المنتج' : 'Share'}
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-800 group-hover:scale-110 transition-transform" />
                    <span>{isAr ? 'مشاركة' : 'Share'}</span>
                  </button>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {isAr ? product.titleAr : product.titleEn}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
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

              {/* Share Product Button using Web Share API */}
              <button
                type="button"
                onClick={handleShareProduct}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 hover:from-amber-100/90 hover:via-amber-50 hover:to-amber-100 active:scale-[0.99] text-amber-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-amber-300/80 shadow-xs hover:shadow-md group"
                title={isAr ? 'مشاركة رابط وتفاصيل المنتج عبر Web Share API' : 'Share Product via Web Share API'}
              >
                <div className="w-7 h-7 rounded-xl bg-amber-900/10 flex items-center justify-center group-hover:bg-amber-900/20 transition-colors">
                  <Share2 className="w-4 h-4 text-amber-900 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-start">
                  <span className="block leading-tight">{isAr ? 'مشاركة رابط ومواصفات المنتج' : 'Share Product Link & Specs'}</span>
                  <span className="block text-[10px] text-amber-800/80 font-normal">
                    {isAr ? 'مشاركة سريعة عبر واتساب، تيليجرام وشبكات التواصل' : 'Instant via WhatsApp, Telegram, or Social Media'}
                  </span>
                </div>
              </button>

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

        {/* ========================================================
            3. COMPREHENSIVE PRODUCT DETAILS & TECHNICAL SPECIFICATIONS
            (تفاصيل المنتج الكاملة والمواصفات الفنية المعتمدة)
           ======================================================== */}
        <div className="pt-8 border-t border-slate-200/80 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-amber-900 text-xs font-bold mb-1">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>{isAr ? 'دليل المنتج والمواصفات الفنية المعتمدة' : 'Certified Technical Spec Sheet'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950">
                {isAr ? `المواصفات الفنية والتفاصيل الهندسية لـ (${product.titleAr})` : `Full Specifications & Engineering Details for (${product.titleEn})`}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-2xl border border-emerald-200 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'خامات نخب أول ومطابقة للجودة' : 'Premium Certified Materials'}</span>
            </div>
          </div>

          {/* Detailed Specs & Features Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Column 1 (7 Cols): Specifications Table & Detailed Parameters */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-950 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4 text-amber-800" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    {isAr ? 'جدول المواصفات الفنية التفصيلية:' : 'Detailed Technical Specifications:'}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {isAr ? `${(product.specifications?.length || 0) + 2} مواصفات مسجلة` : `${(product.specifications?.length || 0) + 2} parameters`}
                </span>
              </div>

              {/* Table of Specifications */}
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs transition-colors ${
                        idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                      }`}
                    >
                      <span className="font-bold text-slate-700 sm:col-span-1">
                        {isAr ? spec.keyAr : spec.keyEn}
                      </span>
                      <span className="font-semibold text-slate-900 sm:col-span-2 mt-0.5 sm:mt-0">
                        {isAr ? spec.valAr : spec.valEn}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    {isAr ? 'المواصفات الفنية مطابقة للمواصفات القياسية للاستوديو' : 'Standard specifications apply'}
                  </div>
                )}
                
                {/* Additional Standard Rows */}
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs bg-white">
                  <span className="font-bold text-slate-700 sm:col-span-1">
                    {isAr ? 'مدة التنفيذ والتسليم' : 'Lead & Delivery Time'}
                  </span>
                  <span className="font-semibold text-emerald-800 sm:col-span-2 mt-0.5 sm:mt-0">
                    {isAr ? product.leadTimeAr : product.leadTimeEn}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs bg-slate-50/70">
                  <span className="font-bold text-slate-700 sm:col-span-1">
                    {isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order'}
                  </span>
                  <span className="font-semibold text-slate-900 sm:col-span-2 mt-0.5 sm:mt-0">
                    {isAr ? `${product.minQuantity} قطعة مع إمكانية التخصيص الكامل` : `${product.minQuantity} units with full branding`}
                  </span>
                </div>
              </div>

              {/* Extended Overview Paragraph */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs text-slate-700 space-y-1.5">
                <span className="font-black text-amber-950 block text-[11px] uppercase tracking-wide">
                  {isAr ? 'نبذة هندسية عن المنتج وجودة التصنيع:' : 'Engineering & Production Brief:'}
                </span>
                <p className="leading-relaxed">
                  {isAr ? product.descriptionAr : product.descriptionEn}
                </p>
              </div>
            </div>

            {/* Column 2 (5 Cols): Features & Production Guarantees */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Features List Card */}
              {product.featuresAr && product.featuresAr.length > 0 && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">
                      {isAr ? 'أهم المميزات ونقاط القوة:' : 'Key Engineering Features:'}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {(isAr ? product.featuresAr : product.featuresEn).map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensions Breakdown Card */}
              {product.dimensions && product.dimensions.length > 0 && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3.5">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-bold">
                      <Ruler className="w-4 h-4 text-purple-800" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">
                      {isAr ? 'الأحجام والمقاسات المتوفرة للتصنيع:' : 'Available Size Matrix:'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.dimensions.map((dim) => (
                      <div
                        key={dim.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between"
                      >
                        <span className="font-bold text-slate-900">
                          {isAr ? dim.labelAr : dim.labelEn}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-amber-900 mt-1">
                          {dim.widthCm} × {dim.heightCm} سم
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Noon & Pen Quality Guarantees */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAr ? 'ضمانات استوديو نُون والقَلَم' : 'Noon & Pen Studio Guarantees'}</span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{isAr ? 'بروفة رقمية معتمدة عبر واتساب وحسابك قبل بدء القص والطباعة' : 'Digital proof sent to account & WhatsApp before cutting'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{isAr ? 'معايرة الألوان طبقا لأعلى معايير Pantone & CMYK الدولية' : 'Precision Pantone & CMYK color calibration'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{isAr ? 'إعادة طباعة أو استبدال فوري مجاني في حال وجود أي خطأ مصنعي' : 'Free instant reprint guarantee against manufacturing defects'}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Exit & Return to Catalog Banner (بانر الخروج والعودة للمتجر في نهاية الصفحة) */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-start">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
              📦
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {isAr ? 'استكشاف نماذج وخيارات أخرى من الورشة' : 'Explore Other Workshop Models'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'يمكنك العودة إلى الاستوديو واختيار تصاميم أو أحجام أخرى في أي وقت.'
                  : 'Return to the specialized studio catalog to explore more bespoke models.'}
              </p>
            </div>
          </div>

          <button
            onClick={onBackToShop}
            type="button"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-amber-950 text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md active:scale-98 cursor-pointer shrink-0"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'خروج والعودة لكتالوج الاستوديو' : 'Exit & Return to Catalog'}</span>
          </button>
        </div>

      </div>

      {/* Floating Quick Return Button (أصغر وبالهوية التجارية نُون والقَلَم) */}
      <button
        onClick={onBackToShop}
        type="button"
        className="fixed bottom-6 start-6 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/90 hover:bg-amber-900 active:scale-95 text-amber-200 border border-amber-700/50 shadow-lg backdrop-blur-md text-[11px] font-bold transition-all hover:scale-105 cursor-pointer group"
        title={isAr ? 'عودة للاستوديو' : 'Back to Studio'}
        aria-label={isAr ? 'عودة' : 'Back'}
      >
        {isAr ? (
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
        ) : (
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        )}
        <span>{isAr ? 'عودة' : 'Back'}</span>
      </button>

      {/* Fullscreen Image Lightbox Modal with Controls BELOW Photo & Small Return Button */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-5 cursor-zoom-out animate-fade select-none"
        >
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The Photo itself */}
            <img
              src={galleryPhotos[activeImageIndex] || product.image}
              alt={isAr ? product.titleAr : product.titleEn}
              className="max-w-full max-h-[72vh] sm:max-h-[76vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            {/* Controls Bar BELOW Image (أزرار أسفل الصورة بدون نص بسهم وتدرج ظلي، وزر رجوع يبقى على حاله) */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-900/40 shadow-xl">
              
              {/* Prev Button */}
              {galleryPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-xl bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 hover:from-amber-800 hover:via-stone-850 hover:to-amber-900 active:scale-95 text-amber-200 border border-amber-700/50 transition-all cursor-pointer shadow-md shadow-black/40"
                  title={isAr ? 'الصورة السابقة' : 'Previous Image'}
                  aria-label={isAr ? 'الصورة السابقة' : 'Previous Image'}
                >
                  {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              )}

              {/* Photo Counter */}
              <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-700/40 font-mono">
                {isAr
                  ? `صورة ${activeImageIndex + 1} من ${galleryPhotos.length}`
                  : `${activeImageIndex + 1} of ${galleryPhotos.length}`}
              </span>

              {/* Next Button */}
              {galleryPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-xl bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 hover:from-amber-800 hover:via-stone-850 hover:to-amber-900 active:scale-95 text-amber-200 border border-amber-700/50 transition-all cursor-pointer shadow-md shadow-black/40"
                  title={isAr ? 'الصورة التالية' : 'Next Image'}
                  aria-label={isAr ? 'الصورة التالية' : 'Next Image'}
                >
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}

              <div className="w-px h-3.5 bg-amber-800/40 mx-0.5" />

              {/* Small Return Button (زر صغير للرجوع بالهوية التجارية) */}
              <button
                type="button"
                onClick={() => setFullscreenImage(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-900/60 hover:bg-amber-950 active:scale-95 text-amber-100 hover:text-white border border-amber-700/50 text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                title={isAr ? 'رجوع وإغلاق' : 'Close / Return'}
              >
                <X className="w-3 h-3 text-amber-300" />
                <span>{isAr ? 'رجوع' : 'Return'}</span>
              </button>

            </div>

            {/* Small corner close fallback */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-3 -end-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-amber-950 text-amber-200 hover:text-white transition-colors cursor-pointer border border-amber-700/40"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Product Share Modal (نافذة مشاركة تفاصيل ورابط المنتج) */}
      {shareModalOpen && (
        <div
          onClick={() => setShareModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 space-y-4 animate-scale-up"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {isAr ? 'مشاركة رابط وتفاصيل المنتج' : 'Share Product Details & Link'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isAr ? 'شارك المنتج مع عملائك أو زملائك بسهولة' : 'Share easily with clients or team'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Summary Mini Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <img
                src={galleryPhotos[activeImageIndex] || product.image}
                alt={isAr ? product.titleAr : product.titleEn}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  {isAr ? product.categoryLabelAr : product.categoryLabelEn}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                  {isAr ? product.titleAr : product.titleEn}
                </h4>
                <p className="text-xs font-black text-amber-950 mt-0.5 font-mono">
                  {product.basePrice.toLocaleString()} د.ع
                </p>
              </div>
            </div>

            {/* Quick Social Share Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                {isAr ? 'المشاركة المباشرة عبر المنصات:' : 'Share directly on:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    getSharePayload().shareText + '\n' + getSharePayload().shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>واتساب WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    getSharePayload().shareUrl
                  )}&text=${encodeURIComponent(getSharePayload().shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>تيليجرام Telegram</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    getSharePayload().shareTitle
                  )}&url=${encodeURIComponent(getSharePayload().shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm"
                >
                  <span className="font-mono text-sm leading-none font-black">𝕏</span>
                  <span>منصة X</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    getSharePayload().shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فيسبوك Facebook</span>
                </a>
              </div>
            </div>

            {/* Direct Link Copy Field */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? 'أو نسخ رابط المنتج المباشر:' : 'Or copy direct product link:'}
              </label>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={getSharePayload().shareUrl}
                  className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-600 font-mono outline-none truncate select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyProductLink}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    linkCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-950 hover:bg-amber-900 text-amber-200 active:scale-95'
                  }`}
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isAr ? 'نسخ الرابط' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Web Share API Fallback Trigger if available */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                type="button"
                onClick={async () => {
                  setShareModalOpen(false);
                  const { shareUrl, shareTitle, shareText } = getSharePayload();
                  try {
                    await navigator.share({
                      title: shareTitle,
                      text: shareText,
                      url: shareUrl,
                    });
                    toast.success(isAr ? 'تمت مشاركة المنتج بنجاح!' : 'Shared successfully!');
                  } catch {}
                }}
                className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-800" />
                <span>{isAr ? 'فتح قائمة المشاركة الأصلية في جهازك' : 'Open Native Device Share Sheet'}</span>
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
