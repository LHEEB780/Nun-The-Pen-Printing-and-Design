import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  PRODUCTS,
  ProductItem,
  DimensionOption,
  MaterialOption,
  LedOption,
  COMPANY_CONTACT,
} from '../../data/mockData';
import { useCartStore } from '../../store/useCartStore';
import { useAdminStore, getUnifiedProducts } from '../../store/useAdminStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  X,
  Upload,
  Sparkles,
  ShieldCheck,
  Clock,
  Truck,
  CheckCircle2,
  Maximize2,
  MessageCircle,
  Bell,
  Check,
  ShoppingBag,
  Info,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
  onNavigateToDashboard?: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  initialProductId,
  onNavigateToDashboard,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { addItem, setIsOpen: setCartOpen } = useCartStore();
  const { addDigitalProof } = useAuthStore();
  const adminProducts = useAdminStore((state) => state.adminProducts);
  const productsList = React.useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  const resolveTargetProduct = (id?: string): ProductItem => {
    if (id) {
      const match = productsList.find((p) => p.id === id);
      if (match) return match;
    }
    return productsList[0];
  };

  const initialProd = resolveTargetProduct(initialProductId);

  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(initialProd);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Client Data & Inputs
  const [companyName, setCompanyName] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Logo / File Upload
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoFileSize, setLogoFileSize] = useState<string>('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Specifications
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption>(initialProd.dimensions[0]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(initialProd.materials[0]);
  const [selectedLed, setSelectedLed] = useState<LedOption | undefined>(initialProd.ledOptions?.[0]);
  const [quantity, setQuantity] = useState<number>(initialProd.minQuantity || 1);
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);

  // Sync whenever modal opens or initialProductId changes
  useEffect(() => {
    if (isOpen) {
      const target = resolveTargetProduct(initialProductId || selectedProduct.id);
      setSelectedProduct(target);
      setSelectedDimension(target.dimensions[0]);
      setSelectedMaterial(target.materials[0]);
      setSelectedLed(target.ledOptions?.[0]);
      setQuantity(target.minQuantity || 1);
      setActiveImageIndex(0);
    }
  }, [isOpen, initialProductId, productsList]);

  // Gallery Photos
  const galleryPhotos = React.useMemo(() => {
    const list = [selectedProduct.image];
    if (selectedProduct.galleryImages && selectedProduct.galleryImages.length > 0) {
      selectedProduct.galleryImages.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [selectedProduct]);

  // Switch product
  const handleProductChange = (prodId: string) => {
    const prod = productsList.find((p) => p.id === prodId);
    if (!prod) return;
    setSelectedProduct(prod);
    setSelectedDimension(prod.dimensions[0]);
    setSelectedMaterial(prod.materials[0]);
    setSelectedLed(prod.ledOptions?.[0]);
    setQuantity(prod.minQuantity || 1);
    setActiveImageIndex(0);
  };

  // Image Navigation Handlers (أزرار تحريك الصور في المودال)
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

  // Pricing & Tier calculation
  const currentTier = React.useMemo(() => {
    if (!selectedProduct.tierPricing || selectedProduct.tierPricing.length === 0) return null;
    return (
      selectedProduct.tierPricing.find((tier) => {
        if (tier.maxQty) {
          return quantity >= tier.minQty && quantity <= tier.maxQty;
        }
        return quantity >= tier.minQty;
      }) || selectedProduct.tierPricing[0]
    );
  }, [selectedProduct.tierPricing, quantity]);

  const discountPercent = currentTier?.discountPercent || 0;
  const dimensionMultiplier = selectedDimension.multiplier || 1;
  const materialAddPrice = selectedMaterial.priceAdd || 0;

  const baseCalculatedIQD = selectedProduct.basePrice * dimensionMultiplier + materialAddPrice;
  const unitPriceIQD = Math.round(baseCalculatedIQD * (1 - discountPercent / 100));
  const totalPriceIQD = unitPriceIQD * quantity;

  const baseCalculatedUSD = (selectedProduct.basePriceUSD || 25) * dimensionMultiplier;
  const unitPriceUSD = Math.round(baseCalculatedUSD * (1 - discountPercent / 100));
  const totalPriceUSD = unitPriceUSD * quantity;

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error(isAr ? 'حجم الملف يتجاوز الحد الأقصى (25MB)' : 'File size exceeds 25MB');
        return;
      }
      setLogoFileName(file.name);
      setLogoFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreviewUrl(event.target?.result as string);
        toast.success(isAr ? `تم رفع ملف: ${file.name}` : `Uploaded: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedFile = () => {
    setLogoPreviewUrl(null);
    setLogoFileName('');
    setLogoFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info(isAr ? 'تم حذف الملف المرفوع' : 'Removed uploaded file');
  };

  // Pre-filled WhatsApp message
  const whatsappInquiryUrl = `https://wa.me/9647800000000?text=${encodeURIComponent(
    `مرحباً استوديو نون والقلم، أود طلب وتجهيز تصميم خاص لمنتج: ${isAr ? selectedProduct.titleAr : selectedProduct.titleEn}\n` +
      (companyName ? `اسم الجهة/النص المطلوب: ${companyName}\n` : '') +
      (subtitle ? `الصفة/النشاط: ${subtitle}\n` : '') +
      (phone ? `رقم هاتف العميل: ${phone}\n` : '') +
      `المقاس: ${isAr ? selectedDimension.labelAr : selectedDimension.labelEn}\n` +
      `الخامة: ${isAr ? selectedMaterial.labelAr : selectedMaterial.labelEn}\n` +
      `الكمية المطلوبة: ${quantity} قطعة\n` +
      (logoFileName ? `تم إرفاق ملف الشعار: ${logoFileName}\n` : '') +
      (notes ? `ملاحظات العميل: ${notes}\n` : '') +
      `أرجو إرسال بروفة التصميم للاعتماد السريع.`
  )}`;

  // Add to Cart Handler
  const handleAddToCart = () => {
    if (!companyName.trim()) {
      toast.error(isAr ? 'يرجى كتابة اسم الشركة أو النص المطلوب لتجهيز التصميم' : 'Please provide company name or text');
      return;
    }

    const formattedNotes = [
      `بيانات العميل: ${companyName}`,
      subtitle ? `النشاط/الصفة: ${subtitle}` : '',
      phone ? `هاتف وواتساب: ${phone}` : '',
      logoFileName ? `الملف المرفوع: ${logoFileName}` : '',
      notes ? `ملاحظات العميل: ${notes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    addItem({
      productId: selectedProduct.id,
      titleAr: selectedProduct.titleAr,
      titleEn: selectedProduct.titleEn,
      image: galleryPhotos[activeImageIndex] || selectedProduct.image,
      category: selectedProduct.category,
      quantity,
      unitPrice: unitPriceUSD,
      originalUnitPrice: Math.round((selectedProduct.basePriceUSD || 25) * dimensionMultiplier),
      totalPrice: totalPriceUSD,
      customOptions: {
        customText: `${companyName}${subtitle ? ` · ${subtitle}` : ''}`,
        dimensionLabelAr: selectedDimension.labelAr,
        dimensionLabelEn: selectedDimension.labelEn,
        materialLabelAr: selectedMaterial.labelAr,
        materialLabelEn: selectedMaterial.labelEn,
        ledColorNameAr: selectedProduct.category === 'led' ? selectedLed?.nameAr : undefined,
        ledColorNameEn: selectedProduct.category === 'led' ? selectedLed?.nameEn : undefined,
        ledHex: selectedProduct.category === 'led' ? selectedLed?.hex : undefined,
        logoFileName: logoFileName || undefined,
        logoPreviewUrl: logoPreviewUrl || undefined,
        discountPercentage: discountPercent,
        notes: formattedNotes,
        customFormData: {
          companyName,
          subtitle,
          phone,
          designNotes: notes,
          uploadedFileName: logoFileName,
        },
      },
    });

    // Create and register Digital Proof in Customer Account with Notification
    const mockOrderId = `NP-${Date.now().toString().slice(-4)}`;
    addDigitalProof({
      orderId: mockOrderId,
      productTitleAr: selectedProduct.titleAr,
      productTitleEn: selectedProduct.titleEn,
      previewUrl: galleryPhotos[activeImageIndex] || selectedProduct.image,
      status: 'pending_approval',
      specsAr: `${companyName} | ${selectedDimension.labelAr} | ${selectedMaterial.labelAr}`,
      specsEn: `${companyName} | ${selectedDimension.labelEn} | ${selectedMaterial.labelEn}`,
      clientNotes: notes,
      whatsappMessage: `مرحباً نون والقلم، قمت بتثبيت طلب ${selectedProduct.titleAr} برقم مؤقت ${mockOrderId}. الاسم: ${companyName}. أرجو إرسال بروفة التصميم للاعتماد.`,
    });

    setIsAddedSuccess(true);
    toast.success(
      isAr
        ? `تم رفع بيانات طلب (${companyName}) بنجاح وإضافته إلى السلة!`
        : `Order data for (${companyName}) added to cart!`,
      {
        description: isAr
          ? 'سيقوم فريق التصميم بإعداد بروفة التصميم وإرسالها لحسابك وعلى واتساب للاعتماد السريع.'
          : 'Our design workshop will send a digital proof to your account and WhatsApp for approval.',
      }
    );

    setTimeout(() => {
      setIsAddedSuccess(false);
      onClose();
      setCartOpen(true);
    }, 1100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-white rounded-3xl w-full max-w-6xl max-h-[94vh] overflow-hidden shadow-2xl border border-slate-200/90 flex flex-col my-auto animate-scale">
        
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">
                  {isAr ? selectedProduct.titleAr : selectedProduct.titleEn}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                  {isAr ? selectedProduct.categoryLabelAr : selectedProduct.categoryLabelEn}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isAr
                  ? 'معرض صور المنتج ورفع بيانات العميل - التصميم الهندسي من اختصاص كادرنا'
                  : 'Product showcase & client data upload - professional design by our craft workshop'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch Product selector if desired */}
            <select
              value={selectedProduct.id}
              onChange={(e) => handleProductChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-white shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[200px] sm:max-w-[280px]"
            >
              <optgroup label={isAr ? '📦 علب كرتونية وتغليف' : '📦 Packaging & Boxes'}>
                {productsList
                  .filter((p) => p.category === 'boxes')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {isAr ? p.titleAr : p.titleEn}
                    </option>
                  ))}
              </optgroup>
              <optgroup label={isAr ? '💡 دروع وألواح إضاءة 3D LED' : '💡 3D LED & Acrylic Lamps'}>
                {productsList
                  .filter((p) => p.category === 'led')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {isAr ? p.titleAr : p.titleEn}
                    </option>
                  ))}
              </optgroup>
              <optgroup label={isAr ? '📇 بطاقات وهوية بصرية' : '📇 Cards & Identity'}>
                {productsList
                  .filter((p) => p.category === 'cards')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {isAr ? p.titleAr : p.titleEn}
                    </option>
                  ))}
              </optgroup>
              <optgroup label={isAr ? '🎉 مناسبات وبورتريه وزفاف' : '🎉 Occasions & Weddings'}>
                {productsList
                  .filter((p) => p.category === 'portraits' || p.category === 'weddings')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {isAr ? p.titleAr : p.titleEn}
                    </option>
                  ))}
              </optgroup>
            </select>

            <button
              onClick={onClose}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700 text-xs font-bold shadow-xs active:scale-95"
              aria-label="Close modal"
              title={isAr ? 'خروج / عودة للاستوديو' : 'Exit / Close'}
            >
              <X className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'خروج / عودة' : 'Exit / Close'}</span>
            </button>
          </div>
        </div>

        {/* Modal Content: Merged 2 Columns:
            1. Authentic Product Photo Showcase (معرض صور المنتج الحقيقي)
            2. Customer Data & Specifications Form (استمارة رفع البيانات والشعار والسلة والواتساب)
        */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start bg-slate-50/50">
          
          {/* ========================================================
              LEFT COLUMN (5 COLS):
              AUTHENTIC PRODUCT PHOTO GALLERY & WORKSHOP TRUST BADGES
             ======================================================== */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Photo Viewer */}
            <div className="bg-white p-3.5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="relative aspect-4/3 w-full rounded-2xl bg-slate-950 overflow-hidden shadow-inner group select-none">
                <img
                  src={galleryPhotos[activeImageIndex] || selectedProduct.image}
                  alt={isAr ? selectedProduct.titleAr : selectedProduct.titleEn}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-104 cursor-zoom-in"
                  onClick={() => setFullscreenImage(galleryPhotos[activeImageIndex] || selectedProduct.image)}
                />

                <div className="absolute top-3 start-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold z-10">
                  {isAr
                    ? `صورة ${activeImageIndex + 1} من ${galleryPhotos.length}`
                    : `${activeImageIndex + 1} of ${galleryPhotos.length}`}
                </div>

                <button
                  type="button"
                  onClick={() => setFullscreenImage(galleryPhotos[activeImageIndex] || selectedProduct.image)}
                  className="absolute top-3 end-3 p-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white hover:text-amber-300 transition-colors cursor-pointer border border-white/20 z-10"
                  title={isAr ? 'عرض ملء الشاشة' : 'Fullscreen'}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 end-3 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-950 text-xs font-black shadow-md border border-slate-200 z-10">
                  {selectedProduct.basePrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                </div>
              </div>

              {/* Thumbnails & Controls BELOW Photo */}
              {galleryPhotos.length > 1 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-[10px] font-bold text-slate-400">
                    <span>{isAr ? 'معرض صور المنتج:' : 'Photo Gallery:'}</span>
                    <span className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                      {isAr ? `${activeImageIndex + 1} / ${galleryPhotos.length}` : `${activeImageIndex + 1} / ${galleryPhotos.length}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {galleryPhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-amber-700 scale-102 shadow-sm ring-2 ring-amber-500/20'
                            : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="Thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Navigation Controls Bar BELOW Photo Strip (أزرار بدون نص بسهم وتدرج ظلي) */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-xl bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 hover:from-amber-800 hover:via-stone-850 hover:to-amber-900 active:scale-95 text-amber-200 border border-amber-700/50 transition-all cursor-pointer shadow-md shadow-amber-950/30 group"
                      title={isAr ? 'الصورة السابقة' : 'Previous Photo'}
                      aria-label={isAr ? 'الصورة السابقة' : 'Previous Photo'}
                    >
                      {isAr ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>

                    {/* Dots */}
                    <div className="flex items-center gap-1">
                      {galleryPhotos.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setActiveImageIndex(dotIdx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeImageIndex === dotIdx ? 'w-4 bg-amber-800 shadow-xs' : 'w-1.5 bg-amber-200 hover:bg-amber-300'
                          }`}
                          title={isAr ? `صورة ${dotIdx + 1}` : `Photo ${dotIdx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-xl bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 hover:from-amber-800 hover:via-stone-850 hover:to-amber-900 active:scale-95 text-amber-200 border border-amber-700/50 transition-all cursor-pointer shadow-md shadow-amber-950/30 group"
                      title={isAr ? 'الصورة التالية' : 'Next Photo'}
                      aria-label={isAr ? 'الصورة التالية' : 'Next Photo'}
                    >
                      {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Workshop Trust Points */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
                  <span className="font-bold text-slate-900 block">{isAr ? 'أصلي 100%' : '100% Virgin'}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <Clock className="w-3.5 h-3.5 text-amber-600 mx-auto mb-0.5" />
                  <span className="font-bold text-slate-900 block">{isAr ? 'تنفيذ 3-5 أيام' : '3-5 Days'}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <Truck className="w-3.5 h-3.5 text-sky-600 mx-auto mb-0.5" />
                  <span className="font-bold text-slate-900 block">{isAr ? 'شحن لكل العراق' : 'Iraq Shipping'}</span>
                </div>
              </div>
            </div>

            {/* Reassuring Design Guarantee Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isAr ? 'التصميم الفني من اختصاصنا:' : 'Craft Design by Our Team:'}</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                {isAr
                  ? 'بمجرد رفع بياناتك وشعارك، يقوم مهندسو وخطاطو نون والقلم بإعداد مسودة التصميم وإرسال نسخة لحسابك لدينا مع إشعار تنبيهي بارز بالأعلى، بالإضافة لإرسال نسخة على واتساب للاعتماد السريع قبل بدء التصنيع.'
                  : 'Our craft artisans create your proof and send a copy to your account with a top notification badge, plus a direct copy to WhatsApp for rapid approval.'}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[10px] font-bold text-amber-900">
                <span className="flex items-center gap-1">
                  <Bell className="w-3 h-3 text-amber-600" />
                  <span>{isAr ? 'إشعار فوري بالحساب' : 'Account Alert'}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>{isAr ? 'نسخة على واتساب' : 'WhatsApp Copy'}</span>
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN (7 COLS):
              CUSTOMER DATA INPUT, LOGO UPLOAD, OPTIONS & CART/WHATSAPP
             ======================================================== */}
          <div className="lg:col-span-7 space-y-5">
            
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {isAr ? 'أدخل بياناتك ومواصفات الطلب:' : 'Order Specs & Customer Info:'}
                  </h3>
                </div>
                <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  {isAr ? 'بروفة معتمدة قبل التنفيذ' : 'Proof Approval Guaranteed'}
                </span>
              </div>

              {/* 1. Client Company / Inscription Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{isAr ? 'اسم الشركة / النص الرئيسي المطلوب:*' : 'Company / Main Text:*'}</span>
                    <span className="text-[10px] text-amber-700 font-bold">{isAr ? '(مطلوب)' : '(Req)'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={isAr ? 'مثال: شركة الرواد للمقاولات العامة' : 'e.g. Al-Rowad Contracting'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    {isAr ? 'الصفة / النص الفرعي (اختياري):' : 'Subtitle / Tagline (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder={isAr ? 'مثال: المدير التنفيذي / بغداد' : 'e.g. CEO / Baghdad'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 2. Phone / WhatsApp Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  {isAr ? 'رقم الهاتف والواتساب للتواصل وإرسال البروفة:' : 'Phone & WhatsApp for Proof Delivery:'}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isAr ? '0780 000 0000 أو +964...' : '+964 780...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="absolute end-3 top-2.5 text-xs font-bold text-emerald-600 flex items-center gap-1 pointer-events-none">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* 3. Logo & Artwork Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>{isAr ? 'رفع ملف الشعار أو التصميم أو المخطط:' : 'Upload Logo / Vector / Artwork:'}</span>
                  <span className="text-[10px] text-slate-400">SVG, PDF, PNG, AI, CDR (Max 25MB)</span>
                </label>
                
                {logoFileName ? (
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {logoPreviewUrl ? (
                        <img src={logoPreviewUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-white border border-slate-200 p-0.5 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                          FILE
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{logoFileName}</p>
                        <p className="text-[10px] text-slate-500">{logoFileSize || '2.1 MB'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeUploadedFile}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={isAr ? 'حذف الملف' : 'Remove file'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-4 text-center bg-slate-50 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps,.cdr"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                      <Upload className="w-5 h-5 text-amber-600 mb-0.5" />
                      <p className="text-xs font-bold text-slate-800">
                        {isAr ? 'انقر لرفع الشعار من جهازك أو اسحبه هنا' : 'Click to upload or drag logo'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isAr ? 'إذا لم يتوفر ملف حالياً، يمكنك إرساله لاحقاً عبر واتساب' : 'Or send via WhatsApp later'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Dimension Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  {isAr ? 'اختر المقاس والأبعاد:' : 'Select Dimensions:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedProduct.dimensions.map((dim) => {
                    const isSel = selectedDimension.id === dim.id;
                    return (
                      <button
                        key={dim.id}
                        type="button"
                        onClick={() => setSelectedDimension(dim)}
                        className={`p-2.5 rounded-xl border text-start text-xs transition-all cursor-pointer ${
                          isSel
                            ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold ring-1 ring-amber-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="block truncate">{isAr ? dim.labelAr : dim.labelEn}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {dim.widthCm && dim.heightCm ? `${dim.widthCm} × ${dim.heightCm} سم` : 'قياسي'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Material & Finish Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  {isAr ? 'اختر الخامة والتشطيب الفاخر:' : 'Select Material & Finish:'}
                </label>
                <div className="space-y-1.5">
                  {selectedProduct.materials.map((mat) => {
                    const isSel = selectedMaterial.id === mat.id;
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => setSelectedMaterial(mat)}
                        className={`w-full p-2.5 rounded-xl border text-start text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSel
                            ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold ring-1 ring-amber-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="truncate">{isAr ? mat.labelAr : mat.labelEn}</span>
                        <span className="font-mono text-[11px] text-slate-500 shrink-0">
                          {mat.priceAdd > 0 ? `+${mat.priceAdd.toLocaleString()} د.ع` : (isAr ? 'مشمول' : 'Included')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. LED Option if available */}
              {selectedProduct.ledOptions && selectedProduct.ledOptions.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    {isAr ? 'لون الإضاءة LED (12V ألماني):' : 'LED Light Color:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedProduct.ledOptions.map((led) => {
                      const isSel = selectedLed?.id === led.id;
                      return (
                        <button
                          key={led.id}
                          type="button"
                          onClick={() => setSelectedLed(led)}
                          className={`p-2 rounded-xl border text-center text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSel
                              ? 'border-slate-900 bg-slate-900 text-white font-bold'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: led.hex }}
                          />
                          <span className="text-[11px] truncate">{isAr ? led.nameAr : led.nameEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 7. Quantity & Volume Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {isAr ? 'الكمية المطلوبة:' : 'Quantity:'}
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(selectedProduct.minQuantity || 1, quantity - 1))}
                      className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min={selectedProduct.minQuantity || 1}
                      onChange={(e) =>
                        setQuantity(Math.max(selectedProduct.minQuantity || 1, parseInt(e.target.value) || 1))
                      }
                      className="w-full text-center text-sm font-bold text-slate-900 border-none focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 block mt-1">
                      {isAr ? `✓ تم تطبيق خصم كمية ${discountPercent}%` : `✓ ${discountPercent}% discount applied`}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {isAr ? 'ملاحظات خاصة للورشة:' : 'Special Workshop Notes:'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: أرجو كتابة الاسم بخط ثلث، تسليم مستعجل' : 'e.g. Urgent delivery'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    {isAr ? 'السعر الإجمالي للكمية المطلوبة:' : 'Total Order Price:'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                      {totalPriceIQD.toLocaleString()} د.ع
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (~${totalPriceUSD})
                    </span>
                  </div>
                </div>

                <div className="text-end text-[11px] text-slate-300">
                  <span className="block font-medium">
                    {quantity} × {unitPriceIQD.toLocaleString()} د.ع
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {isAr ? 'شامل إعداد البروفة والتعديل' : 'Proof prep included'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: ADD TO CART & DIRECT WHATSAPP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* 1. Add to Cart for purchase */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAddedSuccess}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-900 hover:bg-amber-800 text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01]"
                >
                  {isAddedSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-300" />
                      <span>{isAr ? 'تمت الإضافة بنجاح!' : 'Added Successfully!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>{isAr ? 'إضافة للسلة وتأكيد الطلب 🛍️' : 'Add to Cart & Order'}</span>
                    </>
                  )}
                </button>

                {/* 2. Direct WhatsApp Send for fastest communication */}
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>{isAr ? 'إرسال نسخة الطلب لواتساب 💬' : 'Send Copy to WhatsApp'}</span>
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Fullscreen Photo Viewer Modal with Controls BELOW Photo & Small Return Button */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-3 sm:p-5 cursor-zoom-out select-none animate-fade"
          onClick={() => setFullscreenImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[activeImageIndex] || selectedProduct.image}
              alt="Fullscreen preview"
              className="max-w-full max-h-[72vh] sm:max-h-[76vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            {/* Controls Bar BELOW Image (أزرار أسفل الصورة بدون نص بسهم وتدرج ظلي، وزر رجوع يبقى على حاله) */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-900/40 shadow-xl">
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

              <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-700/40 font-mono">
                {isAr
                  ? `صورة ${activeImageIndex + 1} من ${galleryPhotos.length}`
                  : `${activeImageIndex + 1} of ${galleryPhotos.length}`}
              </span>

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

              {/* Small Return Button */}
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

            {/* Corner close fallback */}
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

    </div>
  );
};
