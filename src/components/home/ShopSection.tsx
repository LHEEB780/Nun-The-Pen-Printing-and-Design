import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRODUCTS, ProductItem } from '../../data/mockData';
import { SlidersHorizontal, Sparkles, Layers, Ruler, Palette, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';

interface ShopSectionProps {
  onOpenCustomizer: (productId: string) => void;
  onSelectProduct?: (productId: string) => void;
  onViewAllProducts?: () => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  onOpenCustomizer,
  onSelectProduct,
  onViewAllProducts,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { setSelectedArticleId } = useContentStore();

  return (
    <section id="shop" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'تصنيع حسب الطلب والمواصفات' : '100% Made-to-Order Fabrication'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'منتجاتنا القابلة للتخصيص الكامل' : 'Customizable Product Catalog'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isAr
                ? 'كل قطعة نصنعها تخضع لخياراتك الخاصة. اختر المنتج، حدد الأبعاد والخامة والنصوص والملفات، واعرف السعر فورياً.'
                : 'Products are not off-the-shelf. Configure your dimensions, materials, custom text, and branding for live quote estimation.'}
            </p>
            <div className="pt-1">
              <button
                onClick={() => setSelectedArticleId('art-custom-products')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 shadow-2xs transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'اقرأ المقال الكامل: كيف يعمل محرك التخصيص والمواصفات المتاحة' : 'Read Full Editorial: Customizer Engine & Options'}</span>
              </button>
            </div>
          </div>

          {onViewAllProducts && (
            <button
              onClick={onViewAllProducts}
              type="button"
              className="self-start md:self-auto px-5 py-2.5 rounded-xl border border-purple-200 text-xs font-bold text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>{isAr ? 'استعراض المتجر الكامل والفلترة' : 'Browse Full Shop & Filters'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="group bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image */}
                <div
                  onClick={() => onSelectProduct ? onSelectProduct(prod.id) : onOpenCustomizer(prod.id)}
                  className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={prod.image}
                    alt={isAr ? prod.titleAr : prod.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category chip */}
                  <div className="absolute top-3 start-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-semibold rounded-md shadow-xs">
                    {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div
                    onClick={() => onSelectProduct ? onSelectProduct(prod.id) : onOpenCustomizer(prod.id)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                      {isAr ? prod.titleAr : prod.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {isAr ? prod.descriptionAr : prod.descriptionEn}
                    </p>
                  </div>

                  {/* Customizable capability indicators */}
                  <div className="pt-2 border-t border-slate-200/60 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>
                        {isAr ? 'المقاسات:' : 'Sizes:'} {prod.dimensions.length} {isAr ? 'خيارات مخصصة' : 'options'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>
                        {isAr ? 'الخامات:' : 'Materials:'} {prod.materials.length} {isAr ? 'أنواع تشطيب' : 'finishes'}
                      </span>
                    </div>
                    {prod.ledOptions && (
                      <div className="flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          {isAr ? 'الإضاءة:' : 'LED:'} {prod.ledOptions.length} {isAr ? 'ألوان ونغمات' : 'tones'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] text-slate-600 block">
                      {isAr ? 'يبدأ السعر التقديري من' : 'Starting from'}
                    </span>
                    <span className="font-extrabold text-base text-slate-900 font-mono">
                      {prod.basePrice.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-600">
                        {isAr ? 'د.ع' : 'IQD'}
                      </span>
                    </span>
                  </div>

                  <span className="text-xs text-slate-600 font-medium">
                    {isAr ? `أقل كمية: ${prod.minQuantity}` : `Min qty: ${prod.minQuantity}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct ? onSelectProduct(prod.id) : onOpenCustomizer(prod.id)}
                    type="button"
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>{isAr ? 'المواصفات' : 'Details'}</span>
                  </button>

                  <button
                    onClick={() => onOpenCustomizer(prod.id)}
                    type="button"
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تخصيص وسعر' : 'Customize'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
