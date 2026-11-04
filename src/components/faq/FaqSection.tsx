import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Truck,
  ShieldCheck,
  Copy,
  Check,
  MessageCircle,
  AlertTriangle,
  Layers,
  ArrowUp,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import { FAQ_DATA, FaqCategory, FaqItem } from './FaqModal';
import { COMPANY_CONTACT } from '../../data/mockData';

interface FaqSectionProps {
  onOpenCustomizer?: (productId?: string) => void;
  className?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenCustomizer,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  // Set of open item IDs (allows opening multiple or one at a time)
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['faq-custom-1']));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: Array<{
    id: FaqCategory;
    labelAr: string;
    labelEn: string;
    icon: React.ReactNode;
    count: number;
  }> = [
    {
      id: 'all',
      labelAr: 'كافة الأسئلة',
      labelEn: 'All FAQs',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      count: FAQ_DATA.length,
    },
    {
      id: 'custom_orders',
      labelAr: 'الطلبات المخصصة والتنفيذ',
      labelEn: 'Custom Orders',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((item) => item.category === 'custom_orders').length,
    },
    {
      id: 'shipping',
      labelAr: 'مواعيد وأجور الشحن',
      labelEn: 'Shipping & Delivery',
      icon: <Truck className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((item) => item.category === 'shipping').length,
    },
    {
      id: 'material_care',
      labelAr: 'إرشادات العناية بالمواد',
      labelEn: 'Material Care',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((item) => item.category === 'material_care').length,
    },
  ];

  // Filter items based on activeCategory
  const filteredFaqs = useMemo(() => {
    if (activeCategory === 'all') {
      return FAQ_DATA;
    }
    return FAQ_DATA.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenIds(new Set(filteredFaqs.map((f) => f.id)));
    toast.info(isAr ? 'تم فتح جميع الأسئلة المعروضة' : 'Expanded all questions');
  };

  const handleCollapseAll = () => {
    setOpenIds(new Set());
    toast.info(isAr ? 'تم طي جميع الأسئلة' : 'Collapsed all questions');
  };

  const handleCopy = (item: FaqItem) => {
    const text = isAr
      ? `سؤال: ${item.questionAr}\n\nالإجابة: ${item.answerAr}\n\n– استوديو نُون والقَلَم`
      : `Q: ${item.questionEn}\n\nA: ${item.answerEn}\n\n– Noon & Pen Atelier`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    toast.success(isAr ? 'تم نسخ السؤال والإجابة بنجاح' : 'Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section
      id="faq-section"
      ref={sectionRef}
      className={`relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-50 scroll-mt-24 transition-colors ${className}`}
      aria-label={isAr ? 'قسم الأسئلة الشائعة والتعليمات' : 'Frequently Asked Questions'}
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Card Container styled like greenfoodpack.com reference */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-stone-200/90 relative overflow-hidden">
          {/* Subtle Top Decorative Ambient Accent */}
          <div
            className="absolute top-0 start-0 end-0 h-1.5 bg-gradient-to-r from-amber-600 via-emerald-600 to-amber-700 pointer-events-none"
            aria-hidden="true"
          />

          {/* Section Header with Elevated Typography & Quick Expand/Collapse Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-5 border-b border-stone-100">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{isAr ? 'مركز الإرشادات والأسئلة الشائعة' : 'Help & Guidance Center'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                {isAr ? 'التعليمات والأسئلة الشائعة' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
                {isAr
                  ? 'إجابات معتمدة حول مواعيد التجهيز، أجور الشحن لكافة المحافظات، وتفاصيل الطلبات المخصصة'
                  : 'Answers regarding production times, nationwide shipping, and bespoke custom orders'}
              </p>
            </div>

            {/* Quick Global Expand / Collapse All */}
            <div className="flex items-center gap-2 self-start sm:self-end shrink-0 text-xs">
              <button
                onClick={handleExpandAll}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors flex items-center gap-1.5 border border-stone-200/70 shadow-2xs"
                title={isAr ? 'توسيع كافة الأسئلة' : 'Expand all'}
              >
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                <span>{isAr ? 'توسيع الكل' : 'Expand All'}</span>
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors flex items-center gap-1.5 border border-stone-200/70 shadow-2xs"
                title={isAr ? 'طي كافة الأسئلة' : 'Collapse all'}
              >
                <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
                <span>{isAr ? 'طي الكل' : 'Collapse All'}</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-stone-100">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {cat.icon}
                  <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                  <span
                    className={`ms-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-amber-900/60 text-amber-100' : 'bg-stone-200/80 text-stone-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Questions Accordion List (Matching Reference Clean Lines) */}
          <div className="divide-y divide-stone-200/80">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 px-4">
                <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800 mb-1">
                  {isAr ? 'لا توجد أسئلة في هذا القسم حالياً' : 'No questions in this section currently'}
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  {isAr
                    ? 'يمكنك الاطلاع على كافة الأسئلة أو التواصل مباشرة مع فريق الدعم والإنتاج عبر واتساب.'
                    : 'You can browse all questions or reach out directly via WhatsApp.'}
                </p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold hover:bg-amber-700 transition"
                >
                  {isAr ? 'عرض كافة الأسئلة' : 'Show All FAQs'}
                </button>
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const isOpen = openIds.has(item.id);
                return (
                  <div key={item.id} className="transition-colors group">
                    {/* Question Row - Clean minimal trigger with green chevron on end */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full py-4 sm:py-5 flex items-center justify-between text-start gap-4 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                        {isAr ? item.questionAr : item.questionEn}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen
                            ? 'bg-emerald-100 text-emerald-700 rotate-180'
                            : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </button>

                    {/* Answer Accordion Body */}
                    {isOpen && (
                      <div className="pb-5 sm:pb-6 text-stone-600 text-sm sm:text-base leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Main Answer Paragraph */}
                        <p className="mb-4 text-stone-700 font-normal">
                          {isAr ? item.answerAr : item.answerEn}
                        </p>

                        {/* Critical Warning / Important Notice Callout */}
                        {(item.importantNoticeAr || item.importantNoticeEn) && (
                          <div className="p-3.5 mb-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div className="font-semibold leading-relaxed">
                              {isAr ? item.importantNoticeAr : item.importantNoticeEn}
                            </div>
                          </div>
                        )}

                        {/* Tags and Action Bar */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-stone-100">
                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {(isAr ? item.tagsAr : item.tagsEn).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 ms-auto">
                            <button
                              onClick={() => handleCopy(item)}
                              className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors flex items-center gap-1 text-xs"
                              title={isAr ? 'نسخ الإجابة' : 'Copy answer'}
                            >
                              {copiedId === item.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">
                                    {isAr ? 'تم النسخ' : 'Copied'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'نسخ' : 'Copy'}</span>
                                </>
                              )}
                            </button>

                            {item.category === 'custom_orders' && onOpenCustomizer && (
                              <button
                                onClick={() => onOpenCustomizer()}
                                className="px-3 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{isAr ? 'طلب تصميم الآن' : 'Order Custom'}</span>
                              </button>
                            )}

                            <a
                              href={COMPANY_CONTACT.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1"
                              title={isAr ? 'استفسار عبر واتساب' : 'Ask via WhatsApp'}
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{isAr ? 'استفسار واتساب' : 'WhatsApp'}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Direct Support Contact Bar */}
          <div className="mt-8 pt-5 border-t border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50/70 -mx-6 sm:-mx-10 md:-mx-12 -mb-6 sm:-mb-10 md:-mb-12 p-6 sm:p-7 rounded-b-3xl">
            <div className="text-start">
              <h4 className="text-sm font-bold text-stone-900 mb-0.5">
                {isAr ? 'هل لديك سؤال آخر لم تجد إجابته؟' : 'Have another question?'}
              </h4>
              <p className="text-xs text-stone-500">
                {isAr
                  ? 'فريق الدعم ومهندسو الورشة متاحون للرد على كافة استفساراتك وتخصيص طلبك فوراً.'
                  : 'Our support team and engineers are ready to assist you on WhatsApp.'}
              </p>
            </div>

            {/* Direct Help WhatsApp */}
            <a
              href={COMPANY_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
              title={isAr ? 'تواصل مع فريق الدعم عبر واتساب' : 'Contact Support via WhatsApp'}
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>{isAr ? 'تواصل معنا' : 'Contact Support'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
