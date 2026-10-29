import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Sparkles, BookOpen, ShieldCheck, CheckCircle2, Layers, Award } from 'lucide-react';
import { PortfolioSection } from '../home/PortfolioSection';
import { useContentStore } from '../../store/useContentStore';

interface PortfolioPageProps {
  onBackToHome: () => void;
  onOpenCustomizer: (productId?: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onBackToHome,
  onOpenCustomizer,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { setSelectedArticleId } = useContentStore();

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 sm:pt-28 pb-20">
      {/* Top Banner & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500">
            <button
              onClick={onBackToHome}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-amber-700 hover:border-amber-300 transition-all shadow-2xs font-bold cursor-pointer group"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> : <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />}
              <span>{isAr ? 'العودة للرئيسية' : 'Return Home'}</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'معرض الأعمال المنفذة' : 'Executed Works Portfolio'}</span>
            </span>
          </div>

          {/* Quick Case Study Article Button */}
          <button
            onClick={() => setSelectedArticleId('art-portfolio')}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-850 text-xs font-bold border border-amber-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'قراءة دراسات الحالة وقصص المشاريع' : 'Read Case Studies'}</span>
          </button>
        </div>

        {/* Page Hero Header */}
        <div className="pt-6 pb-2 text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'أعمال حقيقية تم تسليمها في بغداد ومحافظات العراق' : 'Real Bespoke Works Delivered Across Iraq'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? 'معرض الأعمال المنفذة' : 'Executed Works Portfolio'}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'استعرض نماذج حية لمشاريع حقيقية ودروع تكريم وعلب كرتونية فاخرة ولوحات أكريليك مضيئة صُنعت بحرفية عالية في ورشات نُون والقَلَم.'
              : 'Explore real-world case studies of illuminated trophies, luxury rigid boxes, edge-lit signage, and gilded stationery crafted by Noon & Pen.'}
          </p>

          {/* Fabrication Guarantees Badge Strip */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAr ? 'تصنيع محلي في ورشتنا' : 'In-House Fabrication'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'خامات كاست أصلية 100%' : '100% Cast Virgin Acrylic'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'قص وحفر ليزري فائق الدقة' : 'Sub-millimeter Laser Scoring'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Portfolio Section with Filter Tabs & Gallery */}
      <PortfolioSection onOpenCustomizer={onOpenCustomizer} />
    </div>
  );
};
