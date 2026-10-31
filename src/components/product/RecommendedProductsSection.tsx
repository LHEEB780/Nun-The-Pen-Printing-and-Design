import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductItem } from '../../data/mockData';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  Clock,
  ArrowRight,
  ArrowLeft,
  Eye,
  Layers,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';

interface RecommendedProductsSectionProps {
  currentProduct: ProductItem;
  allProducts: ProductItem[];
  onSelectProduct?: (productId: string) => void;
  onOpenCustomizerModal?: (productId?: string) => void;
  onNavigateToShop?: () => void;
}

export const RecommendedProductsSection: React.FC<RecommendedProductsSectionProps> = ({
  currentProduct,
  allProducts,
  onSelectProduct,
  onOpenCustomizerModal,
  onNavigateToShop,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { formatPrice } = useCurrencyStore();
  const { addItem, setIsOpen: setCartOpen } = useCartStore();
  const { wishlist, toggleWishlist, setIsWishlistOpen } = useAuthStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'category' | 'bestsellers' | 'complementary'>('all');

  // Compute similarity score and filter candidates
  const { sameCategoryProducts, complementaryProducts, allRecommendedProducts } = useMemo(() => {
    // 1. Exclude the current active product
    const otherProducts = allProducts.filter((p) => p.id !== currentProduct.id);

    // 2. Strict same category
    const sameCat = otherProducts.filter((p) => p.category === currentProduct.category);

    // 3. Complementary categories (e.g. if current is LED, complement with boxes/cards; if boxes, complement with led/cards)
    let compCats: string[] = [];
    if (currentProduct.category === 'led') compCats = ['boxes', 'weddings', 'cards'];
    else if (currentProduct.category === 'boxes') compCats = ['cards', 'led', 'weddings'];
    else if (currentProduct.category === 'cards') compCats = ['boxes', 'led'];
    else if (currentProduct.category === 'weddings') compCats = ['led', 'boxes', 'portraits'];
    else compCats = ['led', 'boxes'];

    const comp = otherProducts.filter((p) => compCats.includes(p.category));

    // 4. Combined recommended pool prioritized:
    // First: Same category products
    // Second: Complementary luxury products
    // Third: Any remaining products to ensure rich selection (at least 4-8 items)
    const combined = [...sameCat, ...comp, ...otherProducts];
    const uniqueCombined: ProductItem[] = [];
    const seenIds = new Set<string>();

    for (const item of combined) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueCombined.push(item);
      }
    }

    return {
      sameCategoryProducts: sameCat,
      complementaryProducts: comp,
      allRecommendedProducts: uniqueCombined,
    };
  }, [allProducts, currentProduct]);

  // Active products to display based on selected filter
  const displayedProducts = useMemo(() => {
    if (activeFilter === 'category') {
      return sameCategoryProducts.length > 0 ? sameCategoryProducts.slice(0, 8) : allRecommendedProducts.slice(0, 8);
    }
    if (activeFilter === 'complementary') {
      return complementaryProducts.length > 0 ? complementaryProducts.slice(0, 8) : allRecommendedProducts.slice(0, 8);
    }
    if (activeFilter === 'bestsellers') {
      // Pick products with highest tier discounts or minQuantity as proxy for popularity
      return [...allRecommendedProducts]
        .sort((a, b) => (b.tierPricing?.length || 0) - (a.tierPricing?.length || 0))
        .slice(0, 8);
    }
    // Default 'all'
    return allRecommendedProducts.slice(0, 8);
  }, [activeFilter, sameCategoryProducts, complementaryProducts, allRecommendedProducts]);

  // Handler for opening a recommended product
  const handleSelectProduct = (productId: string) => {
    if (onSelectProduct) {
      onSelectProduct(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Add to Cart
  const handleQuickAdd = (prod: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();

    addItem({
      productId: prod.id,
      titleAr: prod.titleAr,
      titleEn: prod.titleEn,
      image: prod.image,
      category: prod.category,
      quantity: 1,
      unitPrice: prod.basePrice,
      totalPrice: prod.basePrice,
      customOptions: {
        customText: isAr ? 'طلب مخصص من المنتجات المرشحة' : 'Custom from Recommended',
        dimensionLabelAr: prod.dimensions?.[0]?.labelAr || 'قياسي',
        dimensionLabelEn: prod.dimensions?.[0]?.labelEn || 'Standard',
        materialLabelAr: prod.materials?.[0]?.labelAr || 'أكريليك فاخر',
        materialLabelEn: prod.materials?.[0]?.labelEn || 'Luxury Acrylic',
      },
    });

    toast.success(
      isAr
        ? `تمت إضافة «${prod.titleAr}» إلى سلة المشتريات!`
        : `Added "${prod.titleEn}" to your cart!`,
      {
        action: {
          label: isAr ? 'عرض السلة' : 'View Cart',
          onClick: () => setCartOpen(true),
        },
      }
    );
  };

  // Toggle Wishlist
  const handleToggleWishlist = (prod: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const isAdded = toggleWishlist(prod.id);
    if (isAdded) {
      toast.success(
        isAr
          ? `تمت إضافة «${prod.titleAr}» إلى قائمة رغباتك ❤️`
          : `Added "${prod.titleEn}" to your wishlist ❤️`,
        {
          action: {
            label: isAr ? 'فتح المفضلة' : 'View Favorites',
            onClick: () => setIsWishlistOpen(true),
          },
        }
      );
    } else {
      toast.info(
        isAr
          ? `تمت إزالة «${prod.titleAr}» من قائمة رغباتك`
          : `Removed "${prod.titleEn}" from your wishlist`
      );
    }
  };

  if (allRecommendedProducts.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={isAr ? 'منتجات مرشحة ومقاربة' : 'Recommended & Similar Products'}
      className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-7 shadow-xs space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>{isAr ? 'مختارات مرشحة ومقاربة' : 'Curated Similar Recommendations'}</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? 'منتجات مرشحة قد تنال إعجابك' : 'Recommended Products You May Also Like'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {isAr
              ? `نماذج وتصاميم مختارة بعناية تتطابق مع مواصفات «${currentProduct.titleAr}» وتتبع نفس معايير الخط العربي الفاخر والتصنيع الحرفي.`
              : `Handcrafted bespoke designs closely related to "${currentProduct.titleEn}", matching the same luxury craftsmanship standards.`}
          </p>
        </div>

        {onNavigateToShop && (
          <button
            type="button"
            onClick={onNavigateToShop}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-800 transition-colors self-start md:self-end group cursor-pointer"
          >
            <span>{isAr ? 'عرض جميع منتجات المتجر' : 'Explore All Store Products'}</span>
            {isAr ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        )}
      </div>

      {/* Filter Tabs / Quick Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-amber-950 text-amber-200 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
          }`}
        >
          {isAr ? `كل المرشحات (${allRecommendedProducts.length})` : `All Similar (${allRecommendedProducts.length})`}
        </button>

        {sameCategoryProducts.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter('category')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'category'
                ? 'bg-amber-950 text-amber-200 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {isAr
                ? `نفس التصنيف (${sameCategoryProducts.length})`
                : `Same Category (${sameCategoryProducts.length})`}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveFilter('bestsellers')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'bestsellers'
              ? 'bg-amber-950 text-amber-200 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{isAr ? 'الأكثر طلباً وتفضيلاً' : 'Best Sellers'}</span>
        </button>

        {complementaryProducts.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter('complementary')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'complementary'
                ? 'bg-amber-950 text-amber-200 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>{isAr ? 'مجموعات مكملة للمشروع' : 'Complementary Sets'}</span>
          </button>
        )}
      </div>

      {/* Recommended Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {displayedProducts.map((prod) => {
          const isFavorited = wishlist.includes(prod.id);

          return (
            <div
              key={prod.id}
              onClick={() => handleSelectProduct(prod.id)}
              className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-amber-300 p-2.5 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Product Card Top Image Container */}
              <div className="relative aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-2.5 sm:mb-3">
                <img
                  src={prod.image}
                  alt={isAr ? prod.titleAr : prod.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Category Pill */}
                <div className="absolute top-2 start-2 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold shadow-xs">
                  {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                </div>

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(prod, e)}
                  className={`absolute top-2 end-2 w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md z-10 active:scale-90 ${
                    isFavorited
                      ? 'bg-rose-500 text-white shadow-rose-500/30'
                      : 'bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500'
                  }`}
                  title={
                    isFavorited
                      ? isAr
                        ? 'إزالة من المفضلة'
                        : 'Remove from wishlist'
                      : isAr
                      ? 'حفظ في المفضلة'
                      : 'Save to wishlist'
                  }
                  aria-label={isAr ? 'المفضلة' : 'Wishlist'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-transform ${
                      isFavorited ? 'fill-current scale-110' : 'hover:scale-110'
                    }`}
                  />
                </button>

                {/* Lead Time Badge */}
                {prod.leadTimeAr && (
                  <div className="absolute bottom-2 end-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-slate-800 text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                    <Clock className="w-2.5 h-2.5 text-amber-700" />
                    <span>{isAr ? prod.leadTimeAr : prod.leadTimeEn}</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating / Review count snippet */}
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 mb-0.5">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    </div>
                    <span>4.9</span>
                    <span className="text-slate-600 font-normal">
                      ({isAr ? 'معتمد' : 'Verified'})
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1 leading-snug">
                    {isAr ? prod.titleAr : prod.titleEn}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                    {isAr ? prod.descriptionAr : prod.descriptionEn}
                  </p>
                </div>

                {/* Price & Action Row */}
                <div className="pt-2 sm:pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5 mt-2">
                  <div>
                    <span className="text-[9px] text-slate-600 block">
                      {isAr ? 'يبدأ من' : 'Starts at'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-amber-800 font-mono">
                      {formatPrice(prod.basePrice, { isAr })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(prod, e)}
                      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-95 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                      title={isAr ? 'إضافة سريعة للسلة' : 'Quick Add to Cart'}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
                      <span className="hidden sm:inline">{isAr ? 'إضافة' : 'Add'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectProduct(prod.id)}
                      className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 hover:text-amber-800 active:scale-95 transition-all cursor-pointer"
                      title={isAr ? 'فتح التفاصيل' : 'View Details'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
