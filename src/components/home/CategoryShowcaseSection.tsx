import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PRODUCT_CATEGORIES,
  ProductCategoryMeta,
} from '../../data/categoriesData';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Ruler,
  Layers,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Eye,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';
import { PRODUCTS } from '../../data/mockData';
import { useAdminStore } from '../../store/useAdminStore';

interface CategoryShowcaseSectionProps {
  onSelectCategory?: (categoryId: string) => void;
  onSelectProduct?: (productId: string) => void;
  onOpenCustomizer?: (productId?: string) => void;
  onViewAllProducts?: () => void;
}

export const CategoryShowcaseSection: React.FC<CategoryShowcaseSectionProps> = ({
  onSelectCategory,
  onSelectProduct,
  onOpenCustomizer,
  onViewAllProducts,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { setSelectedArticleId } = useContentStore();
  const adminProducts = useAdminStore((state) => state.adminProducts);
  const productsList = adminProducts && adminProducts.length > 0 ? adminProducts : PRODUCTS;

  const [activeTabId, setActiveTabId] = useState<string>('led');
  const [activeSubImageIdx, setActiveSubImageIdx] = useState<number>(0);

  const activeCategory =
    PRODUCT_CATEGORIES.find((cat) => cat.id === activeTabId) ||
    PRODUCT_CATEGORIES[0];

  // Associated products for current category
  const categoryProducts = productsList.filter((p) => {
    if (activeCategory.id === 'portraits') {
      return p.category === 'portraits' || p.category === 'weddings';
    }
    return p.category === activeCategory.id;
  });

  const allImages = [
    activeCategory.image,
    ...(activeCategory.secondaryImages || []),
  ];
  const currentImage = allImages[activeSubImageIdx] || activeCategory.image;

  return (
    <section
      id="categories"
      className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden"
    >
      {/* Subtle atmospheric ambient glows */}
      <div
        className="absolute top-10 start-1/3 w-96 h-96 bg-purple-200/25 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 end-1/4 w-96 h-96 bg-sky-200/20 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200/70 text-purple-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>{isAr ? 'أقسام المنتجات والتصنيع المتخصص' : 'Bespoke Production Categories'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? (
              <>
                عالم من <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-sky-600 to-indigo-700">الفخامة والإبداع</span> المصنوع خصيصاً لك
              </>
            ) : (
              <>
                A Spectrum of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-sky-600 to-indigo-700">Masterful Craftsmanship</span>
              </>
            )}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            {isAr
              ? 'تصفح أقسامنا الرئيسية المصممة بأعلى معايير الدقة الهندسية والجمالية. خطوط طباعة متقدمة، خامات مستوردة نقية، وحفر ليزري ميكروني يلبي طموحات شركتك ومناسباتك.'
              : 'Explore our specialized production lines crafted with extreme precision. German laser etching, imported optical substrates, and bespoke finishes.'}
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-3.5 py-1 rounded-xl bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold shadow-2xs">
              ⚡ {isAr ? 'حفر ليزري ميكروني 0.2 مم' : '0.2mm Sub-millimeter Laser'}
            </span>
            <span className="px-3.5 py-1 rounded-xl bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold shadow-2xs">
              💎 {isAr ? 'أكريليك كاست نقي 100%' : '100% Optical Virgin Acrylic'}
            </span>
            <span className="px-3.5 py-1 rounded-xl bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold shadow-2xs">
              🎨 {isAr ? 'بروفة تصميم مجانية عبر واتساب' : 'Free WhatsApp Digital Proof'}
            </span>
          </div>
        </div>

        {/* Category Navigation Pills (Horizontal Tabs) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isActive = cat.id === activeTabId;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTabId(cat.id);
                  setActiveSubImageIdx(0);
                }}
                type="button"
                className={`group flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-102 ring-2 ring-purple-500/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125 ${
                    isActive ? 'bg-purple-400 animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <span className="tracking-wide">
                  {isAr ? cat.nameAr.split('(')[0] : cat.nameEn.split('&')[0]}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-purple-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.id === 'portraits'
                    ? productsList.filter(
                        (p) =>
                          p.category === 'portraits' ||
                          p.category === 'weddings'
                      ).length
                    : productsList.filter((p) => p.category === cat.id).length}{' '}
                  {isAr ? 'منتج' : 'items'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Showcase Card for Active Category */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden mb-16 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Media Column (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-950 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Subtle visual ambient glow */}
              <div
                className="absolute inset-0 bg-radial from-purple-900/30 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Top Bar inside image */}
              <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
                <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>{isAr ? activeCategory.badgeAr : activeCategory.badgeEn}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setActiveSubImageIdx((prev) =>
                        prev === 0 ? allImages.length - 1 : prev - 1
                      )
                    }
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous view"
                  >
                    {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>
                  <span className="text-xs text-white/70 font-mono">
                    {activeSubImageIdx + 1} / {allImages.length}
                  </span>
                  <button
                    onClick={() =>
                      setActiveSubImageIdx((prev) =>
                        prev === allImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next view"
                  >
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Main Category Stage Image */}
              <div className="relative z-10 aspect-16/11 sm:aspect-16/10 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl group">
                <img
                  src={currentImage}
                  alt={isAr ? activeCategory.nameAr : activeCategory.nameEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient bottom overlay with callout */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <p className="text-white text-xs sm:text-sm font-medium leading-relaxed drop-shadow-md">
                    💡 {isAr ? activeCategory.calloutAr : activeCategory.calloutEn}
                  </p>
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="relative z-10 flex items-center gap-3 mt-4 overflow-x-auto pb-1 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSubImageIdx(idx)}
                    type="button"
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeSubImageIdx === idx
                        ? 'border-purple-400 scale-105 ring-2 ring-purple-400/30'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Information & Specifications (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Badge & Subtitle */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200/60 inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isAr ? 'قسم تصنيع رئيسي' : 'Primary Division'}</span>
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ID: {activeCategory.slug}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {isAr ? activeCategory.nameAr : activeCategory.nameEn}
                  </h3>

                  <p className="text-sm font-semibold text-purple-700">
                    {isAr ? activeCategory.subtitleAr : activeCategory.subtitleEn}
                  </p>
                </div>

                {/* Paragraph Description */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {isAr ? activeCategory.descriptionAr : activeCategory.descriptionEn}
                </p>

                {/* Key Features Bullet Points */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {isAr ? 'أبرز مميزات هذا القسم:' : 'Division Highlights:'}
                  </h4>
                  <ul className="space-y-2">
                    {(isAr ? activeCategory.featuresAr : activeCategory.featuresEn).map(
                      (feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Materials & Typical Uses Tags */}
                <div className="pt-2 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                      {isAr ? 'الخامات المستخدمة:' : 'Core Materials:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(isAr ? activeCategory.materialsAr : activeCategory.materialsEn).map(
                        (mat, mIdx) => (
                          <span
                            key={mIdx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                          >
                            {mat}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                      {isAr ? 'الاستخدامات الشائعة:' : 'Typical Applications:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(isAr ? activeCategory.typicalUsesAr : activeCategory.typicalUsesEn).map(
                        (use, uIdx) => (
                          <span
                            key={uIdx}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs font-medium border border-purple-200/60"
                          >
                            {use}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-6 border-t border-slate-200/80 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      {isAr ? 'يبدأ السعر التقديري من' : 'Starting From'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        {activeCategory.startingPriceIQD.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-600">
                          {isAr ? 'د.ع' : 'IQD'}
                        </span>
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        (~${activeCategory.startingPriceUSD})
                      </span>
                    </div>
                  </div>

                  {activeCategory.articleId && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedArticleId(activeCategory.articleId!)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المقال الكامل' : 'Read Article'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory(activeCategory.id);
                      } else if (onViewAllProducts) {
                        onViewAllProducts();
                      }
                    }}
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isAr ? 'استعراض منتجات القسم' : 'Browse Division'}</span>
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const firstProduct = categoryProducts[0];
                      if (onOpenCustomizer) {
                        onOpenCustomizer(firstProduct ? firstProduct.id : undefined);
                      }
                    }}
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-700 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>{isAr ? 'بدء التخصيص الآن' : 'Configure Quote'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Category Products Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-700" />
                <span>
                  {isAr
                    ? `نماذج حقيقية من قسم ${activeCategory.nameAr.split('(')[0]}`
                    : `Products in ${activeCategory.nameEn.split('&')[0]}`}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {isAr
                  ? 'انقر على أي منتج لمعاينة زوايا التصوير الـ 5، المواصفات الفنية، وجدول خصم الكميات.'
                  : 'Click any product to inspect 5-angle views, tech specifications, and tiered pricing.'}
              </p>
            </div>

            {onViewAllProducts && (
              <button
                type="button"
                onClick={onViewAllProducts}
                className="self-start sm:self-auto text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{isAr ? 'عرض الكتالوج الشامل لجميع الأقسام' : 'View Full Catalog'}</span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map((prod) => (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Product Image Stage */}
                  <div
                    onClick={() => onSelectProduct?.(prod.id)}
                    className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={isAr ? prod.titleAr : prod.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 start-3 px-3 py-1 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold rounded-lg shadow-sm">
                      {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                    </div>

                    {prod.galleryImages && prod.galleryImages.length > 1 && (
                      <div className="absolute bottom-3 end-3 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono rounded-md">
                        {prod.galleryImages.length} {isAr ? 'صور' : 'views'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div
                      onClick={() => onSelectProduct?.(prod.id)}
                      className="cursor-pointer"
                    >
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-purple-700 transition-colors leading-snug line-clamp-2">
                        {isAr ? prod.titleAr : prod.titleEn}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {isAr ? prod.descriptionAr : prod.descriptionEn}
                      </p>
                    </div>

                    {/* Features Snippet */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>
                        📏 {isAr ? `${prod.dimensions.length} مقاسات` : `${prod.dimensions.length} sizes`}
                      </span>
                      <span>
                        🧱 {isAr ? `${prod.materials.length} خامات` : `${prod.materials.length} finishes`}
                      </span>
                      {prod.ledOptions && (
                        <span>
                          💡 {isAr ? `${prod.ledOptions.length} ألوان LED` : `${prod.ledOptions.length} LEDs`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block">
                        {isAr ? 'السعر التقديري' : 'Starting from'}
                      </span>
                      <span className="font-extrabold text-base text-slate-900 font-mono">
                        {prod.basePrice.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-600">
                          {isAr ? 'د.ع' : 'IQD'}
                        </span>
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium">
                      {isAr ? `أقل كمية: ${prod.minQuantity}` : `Min: ${prod.minQuantity}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct?.(prod.id)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المواصفات' : 'Details'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenCustomizer?.(prod.id)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تخصيص' : 'Customize'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
