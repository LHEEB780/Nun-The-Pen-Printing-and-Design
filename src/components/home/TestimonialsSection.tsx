import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote, Building2, User } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const reviews = [
    {
      text: t('testimonials.t1Text'),
      author: t('testimonials.t1Author'),
      role: t('testimonials.t1Role'),
      rating: 5,
      type: 'corporate',
    },
    {
      text: t('testimonials.t2Text'),
      author: t('testimonials.t2Author'),
      role: t('testimonials.t2Role'),
      rating: 5,
      type: 'individual',
    },
    {
      text: t('testimonials.t3Text'),
      author: t('testimonials.t3Author'),
      role: t('testimonials.t3Role'),
      rating: 5,
      type: 'corporate',
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('testimonials.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars and Quote mark */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-purple-200" />
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "{rev.text}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center font-bold text-sm shrink-0">
                  {rev.type === 'corporate' ? (
                    <Building2 className="w-4 h-4 text-purple-600" />
                  ) : (
                    <User className="w-4 h-4 text-sky-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {rev.author}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
