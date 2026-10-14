import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PORTFOLIO_ITEMS, PortfolioItem } from '../../data/mockData';
import { Maximize2, Sparkles, X, Check, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';

interface PortfolioSectionProps {
  onOpenCustomizer: (productId?: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenCustomizer }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { setSelectedArticleId } = useContentStore();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filterTabs = [
    { id: 'all', label: t('portfolio.filterAll') },
    { id: 'led', label: t('portfolio.filterLed') },
    { id: 'boxes', label: t('portfolio.filterBoxes') },
    { id: 'portraits', label: t('portfolio.filterPortraits') },
    { id: 'weddings', label: t('portfolio.filterWeddings') },
    { id: 'cards', label: t('portfolio.filterCards') },
  ];

  const filteredItems = activeFilter === 'all'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-slate-50/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'أعمال تم تسليمها في بغداد' : 'Fabricated & Delivered in Baghdad'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('portfolio.title')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              {t('portfolio.subtitle')}
            </p>
            <div className="pt-1">
              <button
                onClick={() => setSelectedArticleId('art-portfolio')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 shadow-2xs transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'اقرأ دراسات الحالة وقصص نجاح المشاريع المنجزة' : 'Read Project Case Studies & Client Stories'}</span>
              </button>
            </div>
          </div>

          {/* Filter Segmented Control Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs self-start md:self-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                type="button"
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container with hover reveal */}
              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                <img
                  src={item.image}
                  alt={isAr ? item.titleAr : item.titleEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Inspect Overlay Button */}
                <button
                  onClick={() => setSelectedItem(item)}
                  type="button"
                  className="absolute bottom-3 end-3 p-2 rounded-lg bg-white/90 backdrop-blur-xs text-slate-800 hover:bg-white hover:text-purple-700 transition-colors shadow-sm cursor-pointer"
                  title={t('portfolio.viewDetails')}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Text & Specs */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Unboxed metadata with typographic separator */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                    <span>{isAr ? item.clientAr : item.clientEn}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-600">{item.dimensions}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug group-hover:text-purple-700 transition-colors">
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {isAr ? item.descriptionAr : item.descriptionEn}
                  </p>
                </div>

                {/* Quick Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 truncate max-w-[180px]">
                    {isAr ? item.materialsAr : item.materialsEn}
                  </span>
                  <button
                    onClick={() => {
                      if (item.relatedProductId) {
                        onOpenCustomizer(item.relatedProductId);
                      } else {
                        onOpenCustomizer();
                      }
                    }}
                    type="button"
                    className="text-xs font-bold text-purple-700 hover:text-purple-800 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? 'طلب مماثل' : 'Order Similar'}</span>
                    {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              type="button"
              className="absolute top-4 end-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
              aria-label={t('portfolio.closeModal')}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-16/10 w-full bg-slate-900">
              <img
                src={selectedItem.image}
                alt={isAr ? selectedItem.titleAr : selectedItem.titleEn}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold">
                <span>{isAr ? selectedItem.clientAr : selectedItem.clientEn}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedItem.dimensions}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {isAr ? selectedItem.titleAr : selectedItem.titleEn}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {isAr ? selectedItem.descriptionAr : selectedItem.descriptionEn}
              </p>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{t('portfolio.materialsUsed')}:</span>
                  <span>{isAr ? selectedItem.materialsAr : selectedItem.materialsEn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{t('portfolio.dimensions')}:</span>
                  <span className="font-mono">{selectedItem.dimensions}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  {t('portfolio.closeModal')}
                </button>
                <button
                  onClick={() => {
                    const pid = selectedItem.relatedProductId;
                    setSelectedItem(null);
                    onOpenCustomizer(pid);
                  }}
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-700 to-sky-600 text-white shadow-sm hover:from-purple-800 hover:to-sky-700 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('portfolio.orderSimilar')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
