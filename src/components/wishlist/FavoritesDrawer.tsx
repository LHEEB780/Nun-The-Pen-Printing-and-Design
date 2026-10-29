import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useAdminStore, getUnifiedProducts } from '../../store/useAdminStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import {
  Heart,
  X,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Layers,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface FavoritesDrawerProps {
  onSelectProduct?: (productId: string) => void;
  onOpenCustomizer?: (productId: string) => void;
  onNavigateToDashboard?: () => void;
  onNavigateToShop?: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  onSelectProduct,
  onOpenCustomizer,
  onNavigateToDashboard,
  onNavigateToShop,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { formatPrice } = useCurrencyStore();

  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    removeFromWishlist,
    clearWishlist,
    isAuthenticated,
  } = useAuthStore();

  const { addItem, setIsOpen: setCartOpen } = useCartStore();
  const adminProducts = useAdminStore((state) => state.adminProducts);
  const unifiedProducts = useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  // Resolve full product items for all wishlisted IDs
  const wishlistedItems = useMemo(() => {
    return wishlist
      .map((id) => unifiedProducts.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [wishlist, unifiedProducts]);

  if (!isWishlistOpen) return null;

  // Handle adding an individual item to cart
  const handleAddToCart = (prod: (typeof wishlistedItems)[0]) => {
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
        customText: isAr ? 'طلب مخصص من قائمة المفضلة' : 'Custom from Wishlist',
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
        description: isAr
          ? 'يمكنك متابعة الشراء وتعديل خيارات التخصيص في السلة.'
          : 'You can adjust customization options in the cart.',
      }
    );
  };

  // Handle adding all wishlisted items to cart
  const handleAddAllToCart = () => {
    if (wishlistedItems.length === 0) return;

    wishlistedItems.forEach((prod) => {
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
          customText: isAr ? 'طلب مخصص من المفضلة' : 'Custom from Wishlist',
          dimensionLabelAr: prod.dimensions?.[0]?.labelAr || 'قياسي',
          dimensionLabelEn: prod.dimensions?.[0]?.labelEn || 'Standard',
          materialLabelAr: prod.materials?.[0]?.labelAr || 'فاخر',
          materialLabelEn: prod.materials?.[0]?.labelEn || 'Luxury',
        },
      });
    });

    toast.success(
      isAr
        ? `تمت إضافة جميع المنتجات المفضلة (${wishlistedItems.length}) إلى السلة!`
        : `Added all ${wishlistedItems.length} favorites to your cart!`
    );
    setIsWishlistOpen(false);
    setCartOpen(true);
  };

  const handleOpenProduct = (productId: string) => {
    setIsWishlistOpen(false);
    if (onSelectProduct) {
      onSelectProduct(productId);
    }
  };

  const handleOpenCustomizerModal = (productId: string) => {
    setIsWishlistOpen(false);
    if (onOpenCustomizer) {
      onOpenCustomizer(productId);
    } else if (onSelectProduct) {
      onSelectProduct(productId);
    }
  };

  const handleClearAll = () => {
    if (wishlist.length === 0) return;
    if (window.confirm(isAr ? 'هل أنت متأكد من تفريغ قائمة المفضلة بالكامل؟' : 'Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
      toast.info(isAr ? 'تم تفريغ قائمة المفضلة' : 'Wishlist cleared');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/65 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
      onClick={() => setIsWishlistOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'قائمة المنتجات المفضلة' : 'Favorites Wishlist'}
    >
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Brand Warm Amber & Rose Accent */}
        <div className="p-4 sm:p-5 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-amber-50/40 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200/80 shadow-xs">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-slate-900 text-base">
                  {isAr ? 'قائمة المفضلة والرغبات' : 'Favorites & Wishlist'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono font-bold">
                  {wishlist.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {isAr
                  ? 'منتجاتك وتصاميمك المختارة المحفوظة'
                  : 'Your curated and saved products'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {wishlist.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold cursor-pointer"
                title={isAr ? 'إفراغ القائمة' : 'Clear all'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wishlist Items List / Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {wishlistedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 shadow-inner">
                <Heart className="w-8 h-8 fill-rose-100 text-rose-400 stroke-1" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {isAr ? 'قائمة المفضلة فارغة حالياً' : 'Your Wishlist is Empty'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isAr
                    ? 'اضغط على أيقونة القلب على أي منتج، لوحة، أو علبة فاخرة لحفظها هنا والرجوع إليها أو طلبها في أي وقت.'
                    : 'Click the heart icon on any acrylic plaque or bespoke box to save it here for easy reference.'}
                </p>
              </div>

              {onNavigateToShop && (
                <button
                  type="button"
                  onClick={() => {
                    setIsWishlistOpen(false);
                    onNavigateToShop();
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-black text-xs shadow-md shadow-amber-900/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>{isAr ? 'استكشف منتجات الاستوديو' : 'Browse Studio Products'}</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {wishlistedItems.map((prod) => (
                <div
                  key={prod.id}
                  className="group relative bg-white border border-slate-200/90 hover:border-amber-300 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-3 shadow-2xs hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail Image */}
                    <div
                      onClick={() => handleOpenProduct(prod.id)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 cursor-pointer relative group-hover:opacity-95"
                    >
                      <img
                        src={prod.image}
                        alt={isAr ? prod.titleAr : prod.titleEn}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-1 start-1 px-1.5 py-0.5 rounded bg-slate-900/75 backdrop-blur-xs text-white text-[9px] font-bold">
                        {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenProduct(prod.id)}
                          className="text-start font-bold text-xs sm:text-sm text-slate-900 hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
                        >
                          {isAr ? prod.titleAr : prod.titleEn}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeFromWishlist(prod.id);
                            toast.info(
                              isAr
                                ? `تمت إزالة «${prod.titleAr}» من المفضلة`
                                : `Removed "${prod.titleEn}" from wishlist`
                            );
                          }}
                          className="text-slate-600 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                          title={isAr ? 'إزالة من المفضلة' : 'Remove from wishlist'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {isAr ? prod.descriptionAr : prod.descriptionEn}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="font-black text-amber-800 text-xs sm:text-sm font-mono">
                          {formatPrice(prod.basePrice, { isAr })}
                        </span>
                        {prod.leadTimeAr && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 border border-slate-200/70 px-1.5 py-0.5 rounded-md">
                            <Clock className="w-2.5 h-2.5 text-amber-600" />
                            <span>{isAr ? prod.leadTimeAr : prod.leadTimeEn}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-95 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
                      <span>{isAr ? 'إضافة للسلة' : 'Add to Cart'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenCustomizerModal(prod.id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 hover:text-amber-800 active:scale-95 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isAr ? 'تخصيص وطلب' : 'Customize'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {wishlistedItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-amber-100/80 bg-gradient-to-b from-white to-amber-50/30 space-y-2.5">
            {/* Add All to Cart */}
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-extrabold text-xs shadow-md shadow-amber-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span>
                {isAr
                  ? `إضافة جميع المفضلة (${wishlistedItems.length}) إلى السلة`
                  : `Add All ${wishlistedItems.length} Favorites to Cart`}
              </span>
            </button>

            {/* Link to Full Customer Dashboard Wishlist */}
            {onNavigateToDashboard && (
              <button
                type="button"
                onClick={() => {
                  setIsWishlistOpen(false);
                  onNavigateToDashboard();
                }}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>
                  {isAr
                    ? 'عرض المفضلة الكاملة في لوحة العميل'
                    : 'View Full Wishlist in Dashboard'}
                </span>
                {isAr ? (
                  <ArrowLeft className="w-3 h-3 text-slate-600" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                )}
              </button>
            )}

            {/* Quick Continue Shopping */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="w-full text-center text-[11px] font-bold text-slate-600 hover:text-slate-800 transition-colors py-1 cursor-pointer"
            >
              {isAr ? 'متابعة التصفح والتسوق' : 'Continue Shopping'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
