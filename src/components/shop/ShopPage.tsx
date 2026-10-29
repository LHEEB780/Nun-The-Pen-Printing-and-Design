import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PRODUCTS, ProductItem } from '../../data/mockData';
import { useAdminStore, getUnifiedProducts } from '../../store/useAdminStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import {
  Search,
  Sparkles,
  Ruler,
  Layers,
  Clock,
  SlidersHorizontal,
  Tag,
  Filter,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Heart,
} from 'lucide-react';

interface ShopPageProps {
  onSelectProduct: (productId: string) => void;
  onOpenCustomizerModal: (productId?: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  onOpenCustomizerModal,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { formatPrice, currency, exchangeRate } = useCurrencyStore();
  const { wishlist, toggleWishlist, setIsWishlistOpen } = useAuthStore();
  const adminProducts = useAdminStore((state) => state.adminProducts);
  const productsList = useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  const handleToggleWishlist = (prod: ProductItem) => {
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

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const categories = [
    { id: 'all', labelAr: 'جميع المنتجات', labelEn: 'All Products', count: productsList.length },
    {
      id: 'led',
      labelAr: 'لوحات ومجسمات LED',
      labelEn: 'LED Signs',
      count: productsList.filter((p) => p.category === 'led').length,
    },
    {
      id: 'boxes',
      labelAr: 'علب وتغليف كارتوني',
      labelEn: 'Cardboard Boxes',
      count: productsList.filter((p) => p.category === 'boxes').length,
    },
    {
      id: 'cards',
      labelAr: 'كروت أعمال وبصمة حرارية',
      labelEn: 'Business Cards',
      count: productsList.filter((p) => p.category === 'cards').length,
    },
    {
      id: 'portraits',
      labelAr: 'هدايا وبورتريه شخصي',
      labelEn: 'Personal Gifts',
      count: productsList.filter((p) => p.category === 'portraits' || p.category === 'weddings').length,
    },
  ];

  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      let matchesCategory = false;
      if (selectedCategory === 'all') {
        matchesCategory = true;
      } else if (selectedCategory === 'portraits') {
        matchesCategory = item.category === 'portraits' || item.category === 'weddings';
      } else {
        matchesCategory = item.category === selectedCategory;
      }

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.titleAr.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.descriptionAr.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      // Always compare in IQD — mixing USD & IQD magnitudes breaks sorting
      const priceA = a.basePrice;
      const priceB = b.basePrice;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-20 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'كتالوج المنتجات المصنعة حسب الطلب' : 'Bespoke Custom Printing Catalog'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isAr ? 'متجر نون والقلم للمنتجات المخصصة' : 'Noon & Pen Bespoke Shop'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'اختر أي منتج لبدء التخصيص الدقيق: حدد الأبعاد، الخامات، الألوان، والنصوص مع تسعير فوري وخصومات كميات متدرجة.'
              : 'Choose any product to configure size, illumination tone, and engraved text with live tiered pricing.'}
          </p>
        </div>

        {/* Search, Filter & Category Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث عن لوحة أكريليك، علب كارتونية، كروت أعمال...'
                    : 'Search LED signs, boxes, business cards...'
                }
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">
                {filteredProducts.length} {isAr ? 'منتج متاح' : 'products found'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{isAr ? 'الترتيب:' : 'Sort:'}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="default">{isAr ? 'المقترح / الأحدث' : 'Featured'}</option>
                  <option value="price-asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                  <option value="price-desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Top Bar Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100 pt-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid Layout */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <p className="font-bold text-slate-800 text-base">
              {isAr ? 'لم يتم العثور على منتجات مطابقة للبحث' : 'No products found matching your search'}
            </p>
            <p className="text-xs text-slate-500">
              {isAr ? 'جرب البحث بكلمات أخرى أو اختر فئة مختلفة' : 'Try another keyword or category'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-4 py-2 text-xs font-bold bg-amber-100 text-amber-900 rounded-xl hover:bg-amber-200 transition-colors cursor-pointer"
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => {
              // USD badge derived from IQD to keep currencies consistent
              const baseUSD = Math.round(prod.basePrice / 1300);

              return (
                <div
                  key={prod.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Image with clickable link to Detail Page */}
                    <div
                      onClick={() => onSelectProduct(prod.id)}
                      className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={prod.image}
                        alt={isAr ? prod.titleAr : prod.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 start-3 px-3 py-1 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold rounded-lg shadow-2xs">
                        {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(prod);
                        }}
                        className={`absolute top-3 end-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md z-10 active:scale-90 ${
                          wishlist.includes(prod.id)
                            ? 'bg-rose-500 text-white shadow-rose-500/30'
                            : 'bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500'
                        }`}
                        title={
                          wishlist.includes(prod.id)
                            ? (isAr ? 'إزالة من قائمة الرغبات' : 'Remove from wishlist')
                            : (isAr ? 'إضافة إلى قائمة الرغبات' : 'Add to wishlist')
                        }
                        aria-label={isAr ? 'قائمة الرغبات' : 'Wishlist'}
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform ${
                            wishlist.includes(prod.id) ? 'fill-current scale-110' : 'hover:scale-110'
                          }`}
                        />
                      </button>

                      <div className="absolute bottom-3 end-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#87CEEB]" />
                        <span>{isAr ? prod.leadTimeAr : prod.leadTimeEn}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <div onClick={() => onSelectProduct(prod.id)} className="cursor-pointer">
                        <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                          {isAr ? prod.titleAr : prod.titleEn}
                        </h3>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {isAr ? prod.descriptionAr : prod.descriptionEn}
                        </p>
                      </div>

                      {/* Quick Specs preview */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Ruler className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            {isAr ? 'المقاسات:' : 'Sizes:'}{' '}
                            {prod.dimensions
                              .map((d) => (isAr ? d.labelAr.split(' ')[0] : d.labelEn.split(' ')[0]))
                              .join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            {isAr ? 'الخامات:' : 'Finishes:'} {prod.materials.length}{' '}
                            {isAr ? 'خيارات متاحة' : 'options available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons with "Customize & Buy" */}
                  <div className="p-6 pt-0 space-y-3">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 block">
                          {isAr ? 'السعر الأساسي يبدأ من' : 'Starting Base Price'}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-black text-lg text-slate-900 font-mono">
                            {formatPrice(prod.basePrice, { isAr })}
                          </span>
                          <span className="text-xs font-normal text-slate-500 font-mono">
                            {currency === 'USD'
                              ? `(${prod.basePrice.toLocaleString()} ${isAr ? 'د.ع' : 'IQD'})`
                              : `($${(prod.basePrice / exchangeRate).toFixed(2)})`}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs text-amber-800 font-bold bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-md">
                        {isAr ? 'خصم حتى 50% للكميات' : 'Up to 50% off'}
                      </span>
                    </div>

                    {/* Prominent "Customize & Buy" Button */}
                    <button
                      onClick={() => onSelectProduct(prod.id)}
                      type="button"
                      className="w-full py-3 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-950" />
                      <span>{isAr ? 'تخصيص وشراء (Customize & Buy)' : 'Customize & Buy'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
