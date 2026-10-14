import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, CreditCard, Gift, Award, ArrowRight, ArrowLeft, Check, Sparkles, BookOpen } from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';

interface ServicesSectionProps {
  onOpenCustomizer: (productId?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenCustomizer }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { setSelectedArticleId } = useContentStore();

  const services = [
    {
      id: 'boxes',
      productId: 'prod-rigid-boxes',
      icon: Package,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 border-purple-100',
      title: t('services.boxPrinting.title'),
      desc: t('services.boxPrinting.desc'),
      actionText: t('services.boxPrinting.action'),
      highlights: isAr
        ? ['كرتون رمادي مقوى 1200 غم (Rigid Boxes)', 'بصمة حرارية ذهبية وفضية ناصعة', 'حشوات إسفنج ليزري مخصصة لمنتجك']
        : ['1200gsm Heavy-duty Greyboard (Rigid Boxes)', 'Sharp metallic hot-foil debossing', 'Custom laser-cut EVA foam product inserts'],
      leadTime: isAr ? 'مدة التجهيز: 3 - 6 أيام عمل' : 'Turnaround: 3 - 6 Business Days',
    },
    {
      id: 'cards',
      productId: 'prod-foil-cards',
      icon: CreditCard,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50 border-sky-100',
      title: t('services.businessCards.title'),
      desc: t('services.businessCards.desc'),
      actionText: t('services.businessCards.action'),
      highlights: isAr
        ? ['ورق قطني سميك 350 - 700 غم مزدوج', 'تذهيب الحواف الملونة (Gilded Edges)', 'قص ليزري وزوايا دائرية مخصصة']
        : ['350 - 700gsm Ultra-heavy Cotton Stock', 'Mirror gilded foil edge plating', 'Sub-millimeter laser contour cutting'],
      leadTime: isAr ? 'مدة التجهيز: 2 - 4 أيام عمل' : 'Turnaround: 2 - 4 Business Days',
    },
    {
      id: 'personal',
      productId: 'prod-wedding-timeline',
      icon: Gift,
      iconColor: 'text-pink-600',
      iconBg: 'bg-pink-50 border-pink-100',
      title: t('services.personalGifts.title'),
      desc: t('services.personalGifts.desc'),
      actionText: t('services.personalGifts.action'),
      highlights: isAr
        ? ['تواريخ زفاف وخطوبة بالخط العربي الأصيل', 'مجسمات إضاءة LED مخصصة بالاسم', 'تغليف هدية فخم جاهز للمفاجأة']
        : ['Wedding & milestone dates in Arabic script', 'Personalized custom name 3D edge-lit lamps', 'Luxury velvet presentation packaging'],
      leadTime: isAr ? 'مدة التجهيز: 24 - 48 ساعة' : 'Turnaround: 24 - 48 Hours',
    },
    {
      id: 'corporate',
      productId: 'prod-travel-acrylic-sign',
      icon: Award,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100',
      title: t('services.corporateGifts.title'),
      desc: t('services.corporateGifts.desc'),
      actionText: t('services.corporateGifts.action'),
      highlights: isAr
        ? ['لوحات مكاتب مضيئة بمسامير استيل جدارية', 'دروع تكريم كريستال وأكريليك فاخر', 'هويات مكتبية متكاملة لمدراء الشركات']
        : ['Illuminated reception signs with stainless spacers', 'Bespoke crystal & optical acrylic trophies', 'Executive branded stationery & desk sets'],
      leadTime: isAr ? 'مدة التجهيز: 3 - 5 أيام عمل' : 'Turnaround: 3 - 5 Business Days',
    },
  ];

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-700 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'حرفية وتصنيع رقمي' : 'Craft & Digital Fabrication'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('services.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('services.subtitle')}
          </p>
          <div className="pt-1">
            <button
              onClick={() => setSelectedArticleId('art-services')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 shadow-2xs transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isAr ? 'اقرأ المقال الكامل: تفاصيل مسارات التصنيع والتقنيات المستخدمة' : 'Read Full Editorial: Production Methods & Machinery'}</span>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="group relative bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-purple-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Category */}
                  <div className={`w-12 h-12 rounded-xl ${srv.iconBg} border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-6 h-6 ${srv.iconColor}`} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 leading-snug group-hover:text-purple-700 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {srv.desc}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-6 border-t border-slate-200/60 pt-4">
                    {srv.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer with Lead time and Button */}
                <div className="pt-4 border-t border-slate-200/60 flex flex-col gap-3">
                  <span className="text-[11px] text-slate-600 font-medium">
                    {srv.leadTime}
                  </span>
                  <button
                    onClick={() => onOpenCustomizer(srv.productId)}
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white group-hover:bg-purple-600 text-slate-800 group-hover:text-white border border-slate-200 group-hover:border-purple-600 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <span>{srv.actionText}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
