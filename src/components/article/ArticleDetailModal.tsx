import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useContentStore, CMSArticle } from '../../store/useContentStore';
import {
  X,
  Clock,
  Calendar,
  User,
  Sparkles,
  CheckCircle,
  Share2,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
  Sliders,
  Send,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface ArticleDetailModalProps {
  onOpenCustomizer?: (productId?: string) => void;
  onNavigateToShop?: () => void;
  onNavigateToContact?: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  onOpenCustomizer,
  onNavigateToShop,
  onNavigateToContact,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { selectedArticleId, setSelectedArticleId, getArticleById } = useContentStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Reset scroll and lock background scroll
  useEffect(() => {
    if (selectedArticleId) {
      setActiveImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArticleId]);

  if (!selectedArticleId) return null;

  const article = getArticleById(selectedArticleId);
  if (!article) return null;

  const images = [article.coverImage, ...(article.galleryImages || [])].filter(
    (img, index, self) => img && self.indexOf(img) === index
  );

  const handleActionClick = () => {
    setSelectedArticleId(null);
    if (article.actionLink === 'customizer') {
      onOpenCustomizer?.();
    } else if (article.actionLink === 'shop' || article.sectionKey === 'custom_products') {
      onNavigateToShop?.();
    } else if (article.actionLink === 'contact' || article.sectionKey === 'contact') {
      onNavigateToContact?.();
    } else if (article.actionLink === 'whatsapp') {
      window.open('https://wa.me/9647800000000', '_blank');
    } else {
      onOpenCustomizer?.();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isAr ? article.titleAr : article.titleEn,
        text: isAr ? article.summaryAr : article.summaryEn,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(isAr ? 'تم نسخ رابط المقال للمشاركة' : 'Link copied to clipboard');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success(isAr ? `تم نسخ ${label}: ${text}` : `Copied ${label}: ${text}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Robust inline markdown & phone parser
  const renderInline = (text: string): React.ReactNode => {
    if (!text) return null;

    // Tokenize bold (**text**), code/mono (`text`), phone numbers, and emails
    const parts = text.split(
      /(\*\*.*?\*\*|`.*?`|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+?964\s?\d{3}\s?\d{3}\s?\d{4}|07[789]\d\s?\d{3}\s?\d{4})/g
    );

    return parts.map((part, i) => {
      if (!part) return null;

      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={i} className="font-extrabold text-slate-900">
            {renderInline(inner)}
          </strong>
        );
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        const inner = part.slice(1, -1);
        return (
          <code
            key={i}
            className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 inline-block"
            dir="ltr"
          >
            {inner}
          </code>
        );
      }

      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
        return (
          <a
            key={i}
            href={`mailto:${part}`}
            className="font-semibold text-amber-700 hover:text-amber-900 underline dir-ltr inline-block"
          >
            {part}
          </a>
        );
      }

      if (/^(\+?964\s?\d{3}\s?\d{3}\s?\d{4}|07[789]\d\s?\d{3}\s?\d{4})$/.test(part.trim())) {
        const cleanNumber = part.replace(/\s+/g, '');
        return (
          <a
            key={i}
            href={`tel:${cleanNumber}`}
            className="font-mono font-bold text-amber-800 hover:text-amber-950 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/80 inline-flex items-center gap-1.5 dir-ltr transition-colors"
          >
            <Phone className="w-3 h-3 text-amber-600 inline shrink-0" />
            <span>{part.trim()}</span>
          </a>
        );
      }

      return part;
    });
  };

  // Helper to format markdown-like sections into spacious, eye-friendly typography
  const formatArticleContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-4 sm:h-6" />;
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-10 mb-5 flex items-center gap-3 border-s-4 border-amber-600 ps-3 sm:ps-4"
          >
            <span>{renderInline(trimmed.replace('### ', ''))}</span>
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-12 mb-6 tracking-tight"
          >
            {renderInline(trimmed.replace('## ', ''))}
          </h2>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="p-6 sm:p-8 my-8 rounded-3xl bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-amber-100/50 border-s-4 border-amber-600 text-slate-900 font-semibold italic text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-loose shadow-xs"
          >
            {renderInline(trimmed.replace('> ', ''))}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li
            key={idx}
            className="text-base sm:text-lg lg:text-xl text-slate-700 leading-loose sm:leading-loose ps-2 list-disc ms-6 sm:ms-8 my-2 font-normal"
          >
            {renderInline(trimmed.replace(/^[-*]\s+/, ''))}
          </li>
        );
      }
      if (/^\d+\.\s+/.test(trimmed)) {
        return (
          <li
            key={idx}
            className="text-base sm:text-lg lg:text-xl text-slate-800 leading-loose sm:leading-loose ps-2 list-decimal ms-6 sm:ms-8 my-2.5 font-medium"
          >
            {renderInline(trimmed.replace(/^\d+\.\s+/, ''))}
          </li>
        );
      }
      if (trimmed === '---') {
        return <hr key={idx} className="my-10 border-slate-200" />;
      }
      return (
        <p
          key={idx}
          className="text-base sm:text-lg lg:text-xl text-slate-700 leading-loose sm:leading-loose my-4 font-normal"
        >
          {renderInline(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col animate-in fade-in duration-200 selection:bg-amber-200 selection:text-amber-950">
      {/* Sticky Top Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md text-white px-4 sm:px-8 py-3.5 border-b border-slate-800 flex items-center justify-between shadow-md">
        {/* Back / Close button */}
        <button
          onClick={() => setSelectedArticleId(null)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isAr ? 'العودة للمتجر' : 'Back to Store'}</span>
        </button>

        {/* Section Badge & Category */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            {isAr ? article.categoryAr : article.categoryEn}
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{article.readTime}</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            title={isAr ? 'مشاركة المقال' : 'Share Article'}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? 'مشاركة' : 'Share'}</span>
          </button>
          <button
            onClick={() => setSelectedArticleId(null)}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
            title={isAr ? 'إغلاق (Esc)' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Spacious Reading Container with ample bottom padding */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-8 sm:py-14 pb-48 sm:pb-56 space-y-10 sm:space-y-12">
        {/* Article Titles & Meta */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-amber-800">
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
              {isAr ? article.categoryAr : article.categoryEn}
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{article.publishedDate}</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight sm:leading-tight">
            {isAr ? article.titleAr : article.titleEn}
          </h1>

          <p className="text-lg sm:text-2xl font-semibold text-amber-900/90 leading-relaxed sm:leading-relaxed">
            {isAr ? article.subtitleAr : article.subtitleEn}
          </p>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md ring-2 ring-amber-100">
              ن
            </div>
            <div>
              <span className="font-bold text-slate-800 block">
                {isAr ? article.authorAr : article.authorEn}
              </span>
              <span className="text-[11px] text-slate-500">
                {isAr ? 'نُون والقَلَم – الطباعة والتصميم الفاخر في العراق' : 'Noon & Pen Design & Fabrication Atelier'}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Panoramic Image with Interactive Multi-Angle Gallery */}
        <div className="space-y-4">
          <div className="relative w-full h-80 sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden bg-slate-950 shadow-xl border border-slate-200/80 group">
            <img
              src={images[activeImageIndex] || article.coverImage}
              alt={isAr ? article.titleAr : article.titleEn}
              className="w-full h-full object-cover transition-all duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/led_acrylic_3d_plane_1791816292618.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Prev / Next buttons if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute start-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute end-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image counter indicator */}
            <div className="absolute bottom-4 end-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Large Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-20 sm:w-28 sm:h-22 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-amber-600 scale-105 shadow-md ring-2 ring-amber-300'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Key Metrics Grid - Spacious & Prominent */}
        {article.metrics && article.metrics.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs">
            {article.metrics.map((m, idx) => (
              <div key={idx} className="text-center p-3 sm:p-4 rounded-2xl bg-white/80 border border-amber-100 shadow-2xs">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-amber-800 tracking-tight">
                  {m.value}
                </span>
                <span className="block text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
                  {isAr ? m.labelAr : m.labelEn}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Highlights Checklist Cards */}
        {((isAr ? article.highlightsAr : article.highlightsEn) || []).length > 0 && (
          <div className="bg-slate-50/90 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{isAr ? 'أبرز مميزات ونقاط القوة في هذا المسار:' : 'Core Advantages & Highlights:'}</span>
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(isAr ? article.highlightsAr : article.highlightsEn).map((hl, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  <span>{renderInline(hl)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Full In-Depth Editorial Content with Comfortable Leading */}
        <article className="prose prose-slate max-w-none space-y-2">
          {formatArticleContent(isAr ? article.contentAr : article.contentEn)}
        </article>

        {/* ========================================================================= */}
        {/* DEDICATED INTERACTIVE CONTACT & COMMUNICATION SUITE (When Contact Section) */}
        {/* ========================================================================= */}
        {article.sectionKey === 'contact' && (
          <section className="pt-8 space-y-8 border-t-2 border-amber-200">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAr ? 'قنوات الاتصال المباشرة والموثوقة' : 'Direct Verified Contact Channels'}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isAr ? 'تواصل معنا مباشرة عبر القناة الأنسب لك' : 'Reach Out via Your Preferred Channel'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                {isAr
                  ? 'مهندسو التصميم وفريق خدمة العملاء جاهزون للرد الفوري على طلبات الأسعار والبروفات والعينات.'
                  : 'Design engineers and account managers standing by for immediate quotes and digital proofs.'}
              </p>
            </div>

            {/* Grid of Interactive Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Direct WhatsApp Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-6 rounded-3xl border-2 border-emerald-200/80 shadow-md flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <MessageCircle className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{isAr ? 'متصل الآن (رد فوري)' : 'Online Now'}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {isAr ? 'الدردشة الفورية عبر واتساب' : 'Instant WhatsApp Concierge'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {isAr
                        ? 'أسرع طريقة للتواصل! أرسل فكرتك أو شعارك واستلم بروفة ثلاثية الأبعاد وعرض سعر في دقائق.'
                        : 'Fastest channel! Send logos, design requirements, and receive digital proofs in minutes.'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-sm sm:text-base dir-ltr">
                      +964 780 123 4567
                    </span>
                    <button
                      onClick={() => handleCopy('+964 780 000 0000', isAr ? 'رقم واتساب' : 'WhatsApp Number')}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                      title={isAr ? 'نسخ الرقم' : 'Copy'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <a
                  href="https://wa.me/9647800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isAr ? 'بدء محادثة واتساب الآن' : 'Chat on WhatsApp Now'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* 2. Direct Phone Numbers Card */}
              <div className="bg-gradient-to-br from-sky-50 via-white to-sky-50/40 p-6 rounded-3xl border-2 border-sky-200/80 shadow-md flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                      <Phone className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                      {isAr ? 'خطوط مباشرة' : 'Direct Lines'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {isAr ? 'الاتصال الهاتفي المباشر' : 'Direct Phone Calls'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {isAr
                        ? 'تحدث مباشرة مع فريق المبيعات والاستشارات لمناقشة مواصفات الطلبات والكميات.'
                        : 'Speak with our technical consultants regarding corporate volumes and specs.'}
                    </p>
                  </div>

                  {/* Phone Lines List */}
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-2xl border border-sky-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 block">{isAr ? 'خط المبيعات والإدارة:' : 'Sales Desk:'}</span>
                        <a href="tel:+964 780 000 0000" className="font-mono font-bold text-slate-900 text-sm dir-ltr hover:text-sky-700">
                          +964 780 123 4567
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy('+964 780 000 0000', isAr ? 'رقم الهاتف' : 'Phone')}
                          className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href="tel:+964 780 000 0000"
                          className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors"
                        >
                          {isAr ? 'اتصال' : 'Call'}
                        </a>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-sky-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 block">{isAr ? 'خط الاستشارات والتصميم:' : 'Design Desk:'}</span>
                        <a href="tel:+9647709876543" className="font-mono font-bold text-slate-900 text-sm dir-ltr hover:text-sky-700">
                          +964 770 987 6543
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy('+9647709876543', isAr ? 'رقم الهاتف' : 'Phone')}
                          className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href="tel:+9647709876543"
                          className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors"
                        >
                          {isAr ? 'اتصال' : 'Call'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Official Email Card */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/80 p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl flex flex-col justify-between space-y-5 text-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-md">
                      <Mail className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                      {isAr ? 'البريد الرسمي' : 'Official Email'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {isAr ? 'البريد الإلكتروني للشركات والمناقصات' : 'Corporate Email Inquiries'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {isAr
                        ? 'لإرسال كراسات الشروط، عروض الأسعار الرسمية، والمراسلات المؤسسية المعتمدة.'
                        : 'For corporate procurement tenders, formal RFQs, and enterprise contracts.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-xs sm:text-sm dir-ltr">
                        info@noonwalqalam.com
                      </span>
                      <button
                        onClick={() => handleCopy('info@noonwalqalam.com', isAr ? 'البريد الإلكتروني' : 'Email')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-xs sm:text-sm dir-ltr">
                        sales@noonwalqalam.com
                      </span>
                      <button
                        onClick={() => handleCopy('sales@noonwalqalam.com', isAr ? 'البريد الإلكتروني' : 'Email')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <a
                  href="mailto:info@noonwalqalam.com?subject=Inquiry%20from%20Noon%20and%20Pen%20Website"
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-5 h-5" />
                  <span>{isAr ? 'إرسال رسالة بريد إلكتروني' : 'Send Email Inquiry'}</span>
                </a>
              </div>

              {/* 4. Studio & Workshop Baghdad Location Card */}
              <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-6 rounded-3xl border-2 border-amber-200/80 shadow-md flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      {isAr ? 'مقر الورشة والاستوديو' : 'Atelier & Workshop'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {isAr ? 'مقرنا في بغداد – المنصور' : 'Baghdad Atelier & Showroom'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {isAr
                        ? 'نرحب بزيارتكم لمعاينة خامات الأكريليك، دروع الليزر، والعلب الفاخرة شخصياً قبل الطلب.'
                        : 'Visit us in person to feel material finishes, acrylic clarity, and luxury boxes.'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-amber-200 space-y-2 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="font-semibold">
                        {isAr
                          ? 'بغداد، المنصور، تقاطع الرواد، مجمع نُون والقَلَم للطباعة والتصميم'
                          : 'Al-Mansour, Al-Rowad Intersection, Baghdad, Iraq'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isAr ? 'السبت - الخميس: 9:00 ص - 10:00 م' : 'Sat - Thu: 9:00 AM - 10:00 PM'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy('بغداد، المنصور، تقاطع الرواد، مجمع نُون والقَلَم للطباعة الفاخرة', isAr ? 'العنوان' : 'Address')}
                  className="w-full py-3.5 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isAr ? 'نسخ العنوان لمشاركته أو خرائط جوجل' : 'Copy Full Address'}</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Sticky Bottom Action Bar with High-Impact CTAs - Sleeker & More Compact */}
      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 sm:py-3 px-3 sm:px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="font-bold text-slate-900 text-xs block">
              {isAr ? 'نُون والقَلَم – الطباعة والتصميم الفاخر' : 'Noon & Pen Atelier'}
            </span>
            <span className="text-[11px] text-slate-500">
              {isAr ? 'صُنعت بحرفية وعناية في ورشاتنا في بغداد' : 'Handcrafted with precision in Baghdad'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSelectedArticleId(null)}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              {isAr ? 'إغلاق المقال' : 'Close Article'}
            </button>

            {article.sectionKey === 'contact' ? (
              <a
                href="https://wa.me/9647800000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11px] sm:text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'بدء محادثة واتساب الآن' : 'Chat on WhatsApp'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={handleActionClick}
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 text-[11px] sm:text-xs font-black shadow-sm shadow-amber-500/20 hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isAr ? article.actionTextAr || 'طلب تسعير أو تصميم مخصص' : article.actionTextEn || 'Get Started'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
