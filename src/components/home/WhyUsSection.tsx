import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Zap, Eye, Truck, Sparkles } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const reasons = [
    {
      icon: ShieldCheck,
      iconBg: 'bg-purple-100 text-purple-700',
      title: t('whyUs.feature1Title'),
      desc: t('whyUs.feature1Desc'),
      metric: '0.2 mm',
      metricLabel: isAr ? 'دقة قص الليزر' : 'Tolerance Accuracy',
    },
    {
      icon: Zap,
      iconBg: 'bg-amber-100 text-amber-700',
      title: t('whyUs.feature2Title'),
      desc: t('whyUs.feature2Desc'),
      metric: '50,000 hrs',
      metricLabel: isAr ? 'عمر افتراضي لـ LED' : 'LED Lifespan',
    },
    {
      icon: Eye,
      iconBg: 'bg-sky-100 text-sky-700',
      title: t('whyUs.feature3Title'),
      desc: t('whyUs.feature3Desc'),
      metric: '100% Free',
      metricLabel: isAr ? 'بروفة ثلاثية الأبعاد' : 'Digital 3D Proof',
    },
    {
      icon: Truck,
      iconBg: 'bg-emerald-100 text-emerald-700',
      title: t('whyUs.feature4Title'),
      desc: t('whyUs.feature4Desc'),
      metric: '18 Governorates',
      metricLabel: isAr ? 'شحن لجميع المحافظات' : 'All Iraqi Cities',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-700 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'معايير الجودة والتصنيع' : 'Engineering & Craft Standards'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('whyUs.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('whyUs.subtitle')}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60">
                  <span className="block font-bold text-lg text-slate-900 font-mono">
                    {item.metric}
                  </span>
                  <span className="text-xs text-slate-600">
                    {item.metricLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
