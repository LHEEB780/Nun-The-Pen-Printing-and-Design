import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductItem, DimensionOption, LedOption, FontOption, PRODUCTS } from '../../data/mockData';
import { DynamicCustomizationForm } from '../customizer/DynamicCustomizationForm';
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

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  }, [productId]);

  // Gallery interactive states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLit, setIsLit] = useState(true);

  // States synchronized from DynamicCustomizationForm for live mockup
  const [customText, setCustomText] = useState('');
  const [selectedLed, setSelectedLed] = useState<LedOption | undefined>(product.ledOptions?.[0]);
  const [selectedFont, setSelectedFont] = useState<FontOption | undefined>(product.fontOptions?.[0]);
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption>(product.dimensions[0]);

  const basePriceUSD = product.basePriceUSD || 20;

  return (
    <div className="pt-24 pb-24 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

        {/* Top 2 Columns: Image Gallery (Left) & Product Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Interactive Viewer */}
            <div className="relative aspect-4/3 w-full rounded-3xl bg-slate-950 overflow-hidden shadow-xl border border-slate-200/80 group">
              <img
                src={product.galleryImages[activeImageIndex] || product.image}
                alt={isAr ? product.titleAr : product.titleEn}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isLit && selectedLed ? 'brightness-105 contrast-105' : 'brightness-90'
                }`}
              />

              {/* Dynamic Simulated Illumination Overlay based on chosen LED color */}
              {isLit && selectedLed && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-300"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${selectedLed.hex}45 0%, ${selectedLed.hex}20 45%, transparent 75%)`,
                  }}
                />
              )}

              {/* Live Laser Engraving Text Overlay Simulation */}
              {customText && (
                <div className="absolute inset-x-8 bottom-6 p-3.5 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 text-center shadow-lg transition-all">
                  <p
                    className="font-extrabold text-base sm:text-lg tracking-wide drop-shadow-md transition-all"
                    style={{
                      fontFamily: selectedFont?.fontFamily,
                      color: selectedLed?.hex || '#ffffff',
                    }}
                  >
                    {customText}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                    {isAr ? selectedDimension.labelAr : selectedDimension.labelEn} · {isAr ? 'معاينة حية للحفر الليزري' : 'Live Engraving Preview'}
                  </span>
                </div>
              )}

              {/* Gallery Lighting Toggle Button */}
              {product.ledOptions && (
                <button
                  onClick={() => setIsLit(!isLit)}
                  type="button"
                  className="absolute top-4 end-4 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <Lightbulb
                    className={`w-3.5 h-3.5 ${
                      isLit ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span>
                    {isLit
                      ? isAr
                        ? 'الإضاءة: مشتعلة'
                        : 'LED: ON'
                      : isAr
                      ? 'الإضاءة: مطفأة'
                      : 'LED: OFF'}
                  </span>
                </button>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
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

            {/* Quality and Guarantee Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{isAr ? 'ضمان نقاوة الأكريليك' : 'Cast Acrylic 100%'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{isAr ? 'توصيل لبغداد وكافة المحافظات' : 'Iraq Nationwide Shipping'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? product.leadTimeAr : product.leadTimeEn}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details (Title, Description, Specifications) (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? product.categoryLabelAr : product.categoryLabelEn}</span>
                <span aria-hidden="true">·</span>
                <span>{isAr ? 'تصنيع حسب الطلب' : 'Bespoke Fabrication'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {isAr ? product.titleAr : product.titleEn}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed mt-3">
                {isAr ? product.descriptionAr : product.descriptionEn}
              </p>
            </div>

            {/* Base Price & Tier Pricing Overview Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-purple-50/80 via-white to-sky-50/80 border border-purple-200/80 shadow-2xs space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">
                    {isAr ? 'السعر الأساسي للقطعة (قبل خصم الكميات):' : 'Starting Base Price:'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-purple-700 font-mono">
                      ${basePriceUSD}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      ({product.basePrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'})
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{isAr ? 'خصم حتى 50% للكميات' : 'Up to 50% off for bulk'}</span>
                </div>
              </div>

              {/* Volume Discount Tiers Grid */}
              <div className="border-t border-slate-200/60 pt-3">
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  {isAr ? 'جدول تسعير الكميات (Tiered Pricing):' : 'Tiered Pricing Table:'}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">{isAr ? '1 - 10 قطع' : '1 - 10 pcs'}</span>
                    <span className="font-extrabold text-slate-900 font-mono">$20 / {isAr ? 'قطعة' : 'pc'}</span>
                  </div>
                  <div className="bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 block font-bold">{isAr ? '11 - 50 قطعة' : '11 - 50 pcs'}</span>
                    <span className="font-extrabold text-emerald-800 font-mono">$15 / {isAr ? 'قطعة' : 'pc'}</span>
                  </div>
                  <div className="bg-purple-50/80 p-2 rounded-lg border border-purple-200">
                    <span className="text-[10px] text-purple-700 block font-bold">{isAr ? 'أكثر من 50 قطعة' : '> 50 pcs'}</span>
                    <span className="font-extrabold text-purple-900 font-mono">$10 / {isAr ? 'قطعة' : 'pc'}</span>
                  </div>
                </div>
              </div>
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
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white text-xs">
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

        {/* Below Specifications: DYNAMIC CUSTOMIZATION FORM ENGINE */}
        <div>
          <DynamicCustomizationForm
            product={product}
            onPreviewUpdate={(preview) => {
              setCustomText(preview.customText);
              if (preview.selectedLed) setSelectedLed(preview.selectedLed);
              if (preview.selectedFont) setSelectedFont(preview.selectedFont);
              if (preview.selectedDimension) setSelectedDimension(preview.selectedDimension);
            }}
          />
        </div>
      </div>
    </div>
  );
};
