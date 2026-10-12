import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Sparkles,
  ShoppingBag,
  TrendingDown,
  Info,
  Ruler,
  Layers,
  Palette,
  Check,
} from 'lucide-react';
import { ProductItem, DimensionOption, LedOption, FontOption } from '../../data/mockData';
import { usePricingCalculator } from '../../hooks/usePricingCalculator';
import { useCartStore } from '../../store/useCartStore';

interface DynamicCustomizationFormProps {
  product: ProductItem;
  onPreviewUpdate?: (previewData: {
    customText: string;
    selectedLed?: LedOption;
    selectedFont?: FontOption;
    selectedDimension?: DimensionOption;
  }) => void;
  onAddToCartSuccess?: () => void;
}

export const DynamicCustomizationForm: React.FC<DynamicCustomizationFormProps> = ({
  product,
  onPreviewUpdate,
  onAddToCartSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { addItem, setIsOpen: setCartOpen } = useCartStore();

  // 1. Form States
  const [customText, setCustomText] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption>(
    product.dimensions[0]
  );
  const [selectedLed, setSelectedLed] = useState<LedOption | undefined>(
    product.ledOptions?.[0]
  );
  const [selectedFont, setSelectedFont] = useState<FontOption | undefined>(
    product.fontOptions?.[0]
  );
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Quantity State
  const [quantity, setQuantity] = useState<number>(product.minQuantity || 1);

  // Validation errors
  const [errors, setErrors] = useState<{ text?: string; file?: string }>({});
  const [touched, setTouched] = useState<{ text?: boolean; file?: boolean }>({});

  // 2. Real-Time Pricing Calculator Hook
  const pricing = usePricingCalculator({
    product,
    quantity,
    selectedDimension,
    selectedMaterial,
  });

  // Notify parent component for live visual mockup
  useEffect(() => {
    if (onPreviewUpdate) {
      onPreviewUpdate({
        customText,
        selectedLed,
        selectedFont,
        selectedDimension,
      });
    }
  }, [customText, selectedLed, selectedFont, selectedDimension, onPreviewUpdate]);

  // Handle File Upload Simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file extension (.jpg, .png, .pdf)
    const validExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (!fileExt || !validExtensions.includes(fileExt)) {
      setErrors((prev) => ({
        ...prev,
        file: isAr
          ? 'نوع الملف غير مدعوم. الصيغ المقبولة: .jpg, .png, .pdf'
          : 'Unsupported file format. Accepted: .jpg, .png, .pdf',
      }));
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      if (file.type.startsWith('image/')) {
        setUploadedFilePreview(URL.createObjectURL(file));
      } else {
        setUploadedFilePreview(null);
      }
      setIsUploading(false);
      setErrors((prev) => ({ ...prev, file: undefined }));
    }, 400);
  };

  const removeUploadedFile = () => {
    setUploadedFileName('');
    setUploadedFileSize('');
    setUploadedFilePreview(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { text?: string; file?: string } = {};

    if (product.requiresCustomText && !customText.trim()) {
      newErrors.text = isAr
        ? 'يرجى إدخال النص المطلوب حفره (حقل إجباري)'
        : 'Text to be engraved is required';
    } else if (customText.length > 50) {
      newErrors.text = isAr
        ? 'الحد الأقصى للنص هو 50 حرفاً'
        : 'Text exceeds maximum length of 50 characters';
    }

    if (product.requiresLogoUpload && !uploadedFileName) {
      newErrors.file = isAr
        ? 'يرجى رفع ملف الشعار أو التصميم (حقل إجباري)'
        : 'Please upload your Logo/Design file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Add to Cart Mechanism with Sonner Toast
  const handleAddToCart = () => {
    setTouched({ text: true, file: true });

    if (!validateForm()) {
      toast.error(
        isAr ? 'يرجى استكمال الحقول المطلوبة قبل الإضافة' : 'Please complete all required fields',
        {
          description: isAr
            ? 'تأكد من إدخال النص المطلوب ورفع ملف الشعار'
            : 'Check the engraved text and uploaded design file.',
        }
      );
      return;
    }

    // Construct JSON object of custom form data
    const customFormData: Record<string, any> = {
      text: customText.trim() || undefined,
      size: isAr ? selectedDimension.labelAr : selectedDimension.labelEn,
      dimensionId: selectedDimension.id,
      ledColor: selectedLed ? (isAr ? selectedLed.nameAr : selectedLed.nameEn) : undefined,
      ledHex: selectedLed?.hex,
      fontName: selectedFont ? (isAr ? selectedFont.nameAr : selectedFont.nameEn) : undefined,
      material: isAr ? selectedMaterial.labelAr : selectedMaterial.labelEn,
      uploadedFileName: uploadedFileName || undefined,
      fileSize: uploadedFileSize || undefined,
      unitPriceUSD: pricing.unitPriceUSD,
      totalPriceUSD: pricing.totalPriceUSD,
      appliedDiscount: `${pricing.discountPercent}%`,
    };

    // Save to Zustand cart store
    addItem({
      productId: product.id,
      titleAr: product.titleAr,
      titleEn: product.titleEn,
      image: product.image,
      category: product.category,
      quantity,
      unitPrice: pricing.unitPriceIQD,
      originalUnitPrice: pricing.originalUnitPriceIQD,
      totalPrice: pricing.totalPriceIQD,
      customOptions: {
        customText: customText.trim() || undefined,
        dimensionLabelAr: selectedDimension.labelAr,
        dimensionLabelEn: selectedDimension.labelEn,
        materialLabelAr: selectedMaterial.labelAr,
        materialLabelEn: selectedMaterial.labelEn,
        ledColorNameAr: selectedLed?.nameAr,
        ledColorNameEn: selectedLed?.nameEn,
        ledHex: selectedLed?.hex,
        logoFileName: uploadedFileName || undefined,
        logoPreviewUrl: uploadedFilePreview || undefined,
        fontName: selectedFont ? (isAr ? selectedFont.nameAr : selectedFont.nameEn) : undefined,
        discountPercentage: pricing.discountPercent,
        customFormData,
        uploadedFileUrl: uploadedFileName ? `mock://storage/uploads/${uploadedFileName}` : undefined,
      },
      customFormData,
      uploadedFileUrl: uploadedFileName ? `mock://storage/uploads/${uploadedFileName}` : undefined,
    });

    // Show Shadcn / Sonner Toast Notification
    toast.success(
      isAr ? 'تمت إضافة المنتج إلى سلة المشتريات بنجاح!' : 'Added to cart successfully!',
      {
        description: isAr
          ? `${product.titleAr} (${quantity} قطع) بمجموع $${pricing.totalPriceUSD} (${pricing.totalPriceIQD.toLocaleString()} د.ع)`
          : `${product.titleEn} (${quantity} units) for $${pricing.totalPriceUSD}`,
        action: {
          label: isAr ? 'عرض السلة' : 'View Cart',
          onClick: () => setCartOpen(true),
        },
        duration: 4000,
      }
    );

    if (onAddToCartSuccess) {
      onAddToCartSuccess();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-8">
      {/* Form Engine Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'محرك التخصيص التفاعلي' : 'Dynamic Customization Engine'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {isAr ? 'خيارات وتفاصيل الطلب المخصص' : 'Custom Options & Specifications'}
          </h2>
        </div>

        {/* Currency badge */}
        <div className="text-end">
          <span className="text-[11px] font-semibold text-slate-400 block">
            {isAr ? 'السعر الأساسي' : 'Base Price'}
          </span>
          <span className="text-lg font-black text-slate-900 font-mono">
            ${pricing.basePriceUSD}
            <span className="text-xs font-normal text-slate-500 ms-1">
              ({pricing.basePriceIQD.toLocaleString()} د.ع)
            </span>
          </span>
        </div>
      </div>

      {/* 1. REQUIRED FIELD: Text to be engraved (Max length 50) */}
      {product.requiresCustomText && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{isAr ? 'النص المراد حفره بالليزر' : 'Text to be engraved'}</span>
              <span className="text-red-500 text-xs font-semibold">*</span>
              <span className="text-[11px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {isAr ? 'إجباري' : 'Required'}
              </span>
            </label>
            <span
              className={`text-xs font-mono font-bold ${
                customText.length > 50
                  ? 'text-red-600'
                  : customText.length >= 40
                  ? 'text-amber-600'
                  : 'text-slate-500'
              }`}
            >
              {customText.length} / 50
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              maxLength={50}
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                if (touched.text) {
                  setErrors((prev) => ({
                    ...prev,
                    text: !e.target.value.trim()
                      ? isAr
                        ? 'النص مطلوب'
                        : 'Text is required'
                      : undefined,
                  }));
                }
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, text: true }))}
              placeholder={
                isAr
                  ? 'مثال: نون والقلم | Happy Birthday Noor | شركة الأفق'
                  : 'e.g., Happy Birthday, Brand Logo, Your Name'
              }
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.text && touched.text
                  ? 'border-red-300 bg-red-50/30 focus:ring-red-400 focus:border-red-400'
                  : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-purple-400 focus:border-purple-400'
              }`}
            />
          </div>

          {errors.text && touched.text && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.text}</span>
            </p>
          )}

          {/* Font Selection */}
          {product.fontOptions && product.fontOptions.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-600 block mb-2">
                {isAr ? 'نمط الخط العربي / الإنجليزي للحفر:' : 'Engraving Font Style:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.fontOptions.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setSelectedFont(font)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-start transition-all cursor-pointer ${
                      selectedFont?.id === font.id
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="block font-bold">{isAr ? font.nameAr : font.nameEn}</span>
                    <span
                      className="block text-slate-500 text-[11px] truncate mt-0.5"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {customText || (isAr ? font.previewTextAr : font.previewTextEn)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. REQUIRED FIELD: File Upload "Upload your Logo/Design" (Accepts .jpg, .png, .pdf) */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <span>{isAr ? 'ارفع شعارك أو تصميمك (Upload Logo/Design)' : 'Upload your Logo/Design'}</span>
          <span className="text-red-500 text-xs font-semibold">*</span>
          <span className="text-[11px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {isAr ? 'يقبل .jpg, .png, .pdf' : 'Accepts .jpg, .png, .pdf'}
          </span>
        </label>

        {!uploadedFileName ? (
          <label
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              errors.file && touched.file
                ? 'border-red-300 bg-red-50/20 hover:bg-red-50/40'
                : 'border-slate-300 hover:border-purple-500 bg-slate-50/50 hover:bg-purple-50/30'
            }`}
          >
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-purple-700 mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {isAr ? 'اضغط لاختيار ملف الشعار أو اسحبه هنا' : 'Click to browse or drag & drop'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isAr
                ? 'الصيغ المعتمدة: JPG, PNG, PDF بدقة وضوح 300DPI كحد أقصى 25MB'
                : 'Accepted: .jpg, .png, .pdf (Max size 25MB)'}
            </p>
          </label>
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200">
            <div className="flex items-center gap-3 overflow-hidden">
              {uploadedFilePreview ? (
                <img
                  src={uploadedFilePreview}
                  alt="Upload Preview"
                  className="w-12 h-12 rounded-xl object-cover border border-purple-200 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{uploadedFileName}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>
                    {isAr ? 'تم التحقق والرفع بنجاح' : 'Uploaded successfully'} ({uploadedFileSize})
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeUploadedFile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title={isAr ? 'حذف الملف' : 'Remove file'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errors.file && touched.file && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.file}</span>
          </p>
        )}
      </div>

      {/* 3. DROPDOWN / SELECT: "Select Size" (15x15cm, 20x20cm, 30x30cm) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-purple-600" />
            <span>{isAr ? 'اختر المقاس المطلوب (Select Size)' : 'Select Size'}</span>
            <span className="text-red-500 text-xs font-semibold">*</span>
          </label>
          <span className="text-xs text-slate-500 font-medium">
            {selectedDimension.id === 'dim-30x30'
              ? isAr
                ? '+$5 رسوم المقاس الكبير'
                : '+$5 extra for 30x30cm'
              : isAr
              ? 'مشمول بالسعر الأساسي'
              : 'Included in base price'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {product.dimensions.map((dim) => {
            const isSelected = selectedDimension.id === dim.id;
            const is30x30 = dim.id === 'dim-30x30' || dim.labelEn.includes('30x30');
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => setSelectedDimension(dim)}
                className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-600/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">
                    {isAr ? dim.labelAr : dim.labelEn}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                </div>

                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="text-slate-500">
                    {dim.widthCm} × {dim.heightCm} سم
                  </span>
                  <span
                    className={`font-bold ${
                      is30x30 ? 'text-purple-700' : 'text-emerald-700'
                    }`}
                  >
                    {is30x30 ? '+$5 (6,500 د.ع)' : isAr ? 'السعر الأساسي' : 'Base'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DROPDOWN / SELECT: "Select LED Color" (Sky Blue, Light Purple, Warm White) */}
      {product.ledOptions && product.ledOptions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-sky-500" />
              <span>{isAr ? 'اختر لون إضاءة LED (Select LED Color)' : 'Select LED Color'}</span>
              <span className="text-red-500 text-xs font-semibold">*</span>
            </label>
            {selectedLed && (
              <span className="text-xs font-semibold text-slate-600">
                {isAr ? selectedLed.nameAr : selectedLed.nameEn}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ledOptions.map((led) => {
              const isSelected = selectedLed?.id === led.id;
              return (
                <button
                  key={led.id}
                  type="button"
                  onClick={() => setSelectedLed(led)}
                  className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Color Glow Dot */}
                  <span
                    className="w-6 h-6 rounded-full border border-black/10 shadow-sm shrink-0"
                    style={{
                      backgroundColor: led.hex,
                      boxShadow: isSelected ? `0 0 12px ${led.hex}` : undefined,
                    }}
                  />

                  <div className="flex-1 truncate">
                    <span className="font-extrabold text-xs text-slate-900 block truncate">
                      {isAr ? led.nameAr : led.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {led.hex}
                    </span>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. DYNAMIC QUANTITY STEPPER & VOLUME TIER PRICING DISPLAY */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-sm font-bold text-slate-900 block">
              {isAr ? 'الكمية المطلوبة والتسعير المتدرج:' : 'Order Quantity & Tier Pricing:'}
            </label>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'ينخفض سعر القطعة تلقائياً كلما زادت الكمية'
                : 'Unit price drops automatically with bulk quantities'}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-2xs"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuantity(isNaN(val) || val < 1 ? 1 : val);
              }}
              className="w-16 h-10 rounded-xl bg-white border border-slate-200 font-mono font-extrabold text-center text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Real-time Tier Breakdown Pill Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {/* Tier 1: 1-10 ($20) */}
          <div
            className={`p-2.5 rounded-xl border text-center transition-all ${
              quantity >= 1 && quantity <= 10
                ? 'bg-purple-600 text-white font-bold shadow-xs border-purple-600'
                : 'bg-white text-slate-600 border-slate-200 opacity-75'
            }`}
          >
            <span className="text-[11px] block">{isAr ? '1 - 10 قطع' : '1 - 10 units'}</span>
            <span className="text-sm font-extrabold font-mono block">$20 / {isAr ? 'قطعة' : 'unit'}</span>
          </div>

          {/* Tier 2: 11-50 ($15) */}
          <div
            className={`p-2.5 rounded-xl border text-center transition-all ${
              quantity >= 11 && quantity <= 50
                ? 'bg-purple-600 text-white font-bold shadow-xs border-purple-600'
                : 'bg-white text-slate-600 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <span className="text-[11px] block">{isAr ? '11 - 50 قطعة' : '11 - 50 units'}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500 text-white font-bold">
                -25%
              </span>
            </div>
            <span className="text-sm font-extrabold font-mono block">$15 / {isAr ? 'قطعة' : 'unit'}</span>
          </div>

          {/* Tier 3: >50 ($10) */}
          <div
            className={`p-2.5 rounded-xl border text-center transition-all ${
              quantity > 50
                ? 'bg-purple-600 text-white font-bold shadow-xs border-purple-600'
                : 'bg-white text-slate-600 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <span className="text-[11px] block">{isAr ? 'أكثر من 50 قطعة' : '> 50 units'}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500 text-white font-bold">
                -50%
              </span>
            </div>
            <span className="text-sm font-extrabold font-mono block">$10 / {isAr ? 'قطعة' : 'unit'}</span>
          </div>
        </div>

        {/* Dynamic Next-Tier Hint */}
        {pricing.nextTierHintAr && (
          <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50/80 p-2.5 rounded-xl border border-purple-200/60">
            <TrendingDown className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              {isAr ? pricing.nextTierHintAr : pricing.nextTierHintEn}
            </span>
          </div>
        )}
      </div>

      {/* 6. REAL-TIME PRICE SUMMARY & ADD TO CART BAR */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-500 font-medium">
              {isAr ? 'سعر القطعة المحسوب:' : 'Calculated Unit Price:'}
            </span>
            <span className="font-bold text-slate-800 font-mono text-sm">
              ${pricing.unitPriceUSD}
            </span>
            {pricing.discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {isAr ? `وفرت ${pricing.discountPercent}%` : `Saved ${pricing.discountPercent}%`}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xs text-slate-500 font-bold">
              {isAr ? 'الإجمالي النهائي:' : 'Total Price:'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-purple-700 font-mono">
              ${pricing.totalPriceUSD}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ({pricing.totalPriceIQD.toLocaleString()} {isAr ? 'د.ع' : 'IQD'})
            </span>
          </div>
        </div>

        {/* Add to Cart CTA Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{isAr ? 'إضافة إلى سلة المشتريات' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
