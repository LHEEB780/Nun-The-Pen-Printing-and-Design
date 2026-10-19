import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Sparkles, MessageCircle, BookOpen, ShieldAlert } from 'lucide-react';
import { COMPANY_CONTACT } from '../../data/mockData';
import { useContentStore, QuickLinkSectionKey } from '../../store/useContentStore';

interface FooterProps {
  onNavigate?: (view: 'home' | 'shop' | 'dashboard' | 'admin' | 'specialty' | 'offers' | 'portfolio', specialtyId?: any) => void;
  onOpenCustomizer?: (productId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCustomizer }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { getArticleBySection, setSelectedArticleId } = useContentStore();

  const quickLinksConfig: Array<{ key: QuickLinkSectionKey; defaultTitleAr: string; defaultTitleEn: string; href: string }> = [
    { key: 'home', defaultTitleAr: 'الرئيسية', defaultTitleEn: 'Home', href: '#home' },
    { key: 'services', defaultTitleAr: 'خدماتنا', defaultTitleEn: 'Our Services', href: '#services' },
    { key: 'portfolio', defaultTitleAr: 'معرض الأعمال المنفذة', defaultTitleEn: 'Executed Works Portfolio', href: '#portfolio' },
    { key: 'custom_products', defaultTitleAr: 'منتجات مخصصة', defaultTitleEn: 'Custom Products', href: '#shop' },
    { key: 'why_us', defaultTitleAr: 'لماذا نون والقلم؟', defaultTitleEn: 'Why Noon & Pen?', href: '#why-us' },
    { key: 'contact', defaultTitleAr: 'تواصل معنا', defaultTitleEn: 'Contact Us', href: '#contact' },
  ];

  const handleLinkClick = (key: QuickLinkSectionKey, href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (key === 'portfolio') {
      if (onNavigate) {
        onNavigate('portfolio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    const article = getArticleBySection(key);
    if (article) {
      setSelectedArticleId(article.id);
    } else {
      if (href === '#shop' && onNavigate) {
        onNavigate('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (onNavigate) {
          onNavigate('home');
          setTimeout(() => {
            const elem = document.querySelector(href);
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-white to-slate-50/90 text-slate-700 pt-16 pb-12 border-t border-purple-100/80 relative overflow-hidden">
      {/* Subtle airy gradient ornaments */}
      <div
        className="absolute top-0 start-1/4 w-96 h-32 bg-gradient-to-r from-[#E6E6FA]/40 to-[#87CEEB]/20 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 end-10 w-80 h-32 bg-gradient-to-l from-[#87CEEB]/30 to-[#E6E6FA]/30 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 p-1 rounded-2xl bg-white/90 border border-amber-200/60 shadow-xs flex items-center justify-center shrink-0">
                <img
                  src="/images/noon_walqalam_logo.png"
                  alt="شعار نُون والقَلَم"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 block leading-tight">
                  {isAr ? 'نُون والقَلَم' : 'Noon & Pen'}
                </span>
                <span className="text-xs text-amber-900/90 font-bold block mt-0.5">
                  {isAr ? 'للطباعة والتصميم' : 'Printing & Design'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('brand.description')}
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-purple-700 font-semibold bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{t('brand.tagline')}</span>
            </div>
          </div>

          {/* Quick Links with CMS Articles Integration */}
          <div>
            <h4 className="text-slate-900 text-sm font-bold mb-4 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-purple-600 rounded-full" />
              <span>{t('footer.quickLinks')}</span>
            </h4>
            <ul className="space-y-2 text-sm">
              {quickLinksConfig.map((link) => {
                const article = getArticleBySection(link.key);
                const displayTitle = article
                  ? isAr
                    ? article.titleAr.split('–')[0].trim() || link.defaultTitleAr
                    : article.titleEn.split('–')[0].trim() || link.defaultTitleEn
                  : isAr
                  ? link.defaultTitleAr
                  : link.defaultTitleEn;

                return (
                  <li key={link.key}>
                    <button
                      onClick={(e) => handleLinkClick(link.key, link.href, e)}
                      className="group flex items-center justify-between w-full text-start py-1 text-slate-600 hover:text-purple-700 transition-colors"
                      title={isAr ? `قراءة مقال وتفاصيل: ${displayTitle}` : `Read article & details: ${displayTitle}`}
                    >
                      <span className={`font-medium group-hover:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform flex items-center gap-1.5 ${link.key === 'portfolio' ? 'text-purple-900 font-bold' : ''}`}>
                        {displayTitle}
                        {link.key === 'portfolio' && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-purple-100 text-purple-700 font-bold border border-purple-200">
                            {isAr ? 'معرض الصور' : 'Gallery'}
                          </span>
                        )}
                      </span>
                      <span className={`transition-opacity text-[11px] text-purple-600 flex items-center gap-0.5 ${link.key === 'portfolio' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {link.key === 'portfolio' ? (
                          <span className="text-[10px] text-purple-600 font-semibold">{isAr ? 'عرض' : 'View'}</span>
                        ) : (
                          <>
                            <BookOpen className="w-3 h-3" />
                            <span className="text-[10px]">{isAr ? 'مقال' : 'Article'}</span>
                          </>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-slate-900 text-sm font-bold mb-4 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-sky-500 rounded-full" />
              <span>{t('footer.categories')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {[
                { labelAr: '🏷️ عروض الموسم والتخفيضات الكبرى (خصم 33%)', labelEn: '🏷️ Grand Seasonal Offers (33% OFF)', isOffers: true },
                { labelAr: 'لوحات أكريليك مضيئة LED', labelEn: '3D LED Acrylic Signs', catId: 'led' },
                { labelAr: 'علب كرتون مقوى فاخرة (Rigid Boxes)', labelEn: 'Rigid Gift Box Packaging', catId: 'boxes' },
                { labelAr: 'كروت أعمال وبصمة حرارية', labelEn: 'Hot-Foil Business Cards', catId: 'cards' },
                { labelAr: 'لوحات بورتريه فيكتور مخصصة', labelEn: 'Custom Vector Portrait Lamps', catId: 'portraits' },
                { labelAr: 'دروع تذكارية وتوثيق الزفاف', labelEn: 'Commemorative Wedding Plaques', catId: 'weddings' },
                { labelAr: 'هدايا الشركات ودروع التكريم', labelEn: 'Executive Corporate Awards', catId: 'led' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.isOffers && onNavigate) {
                        onNavigate('offers');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (onNavigate) {
                        onNavigate('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        const el = document.querySelector('#categories') || document.querySelector('#shop');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`flex items-center gap-2 py-0.5 text-start cursor-pointer w-full group transition-colors ${
                      item.isOffers
                        ? 'text-amber-900 font-bold hover:text-amber-700'
                        : 'text-slate-600 hover:text-purple-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-transform ${
                      item.isOffers ? 'bg-amber-500 scale-125' : 'bg-purple-400 group-hover:scale-125'
                    }`} />
                    <span className="group-hover:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform">
                      {isAr ? item.labelAr : item.labelEn}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Light & Airy Card) */}
          <div className="space-y-3.5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h4 className="text-slate-900 text-sm font-bold mb-3 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
              <span>{t('contact.title')}</span>
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>{isAr ? COMPANY_CONTACT.addressAr : COMPANY_CONTACT.addressEn}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Phone className="w-4 h-4 text-sky-600 shrink-0" />
              <a href={`tel:${COMPANY_CONTACT.phone}`} className="hover:text-purple-700 transition-colors dir-ltr font-semibold">
                {COMPANY_CONTACT.phoneDisplay}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Mail className="w-4 h-4 text-purple-600 shrink-0" />
              <a href={`mailto:${COMPANY_CONTACT.email}`} className="hover:text-purple-700 transition-colors font-medium">
                {COMPANY_CONTACT.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{isAr ? COMPANY_CONTACT.workingHoursAr : COMPANY_CONTACT.workingHoursEn}</span>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-2">
              <a
                href={COMPANY_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'محادثة فورية عبر واتساب' : 'Chat via WhatsApp'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t('footer.rights')}</p>

          {/* Admin Dashboard Access (Moved to bottom of the website as requested) */}
          {onNavigate && (
            <button
              onClick={() => {
                onNavigate('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-purple-200/90 bg-white hover:bg-purple-50 text-purple-900 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              title={isAr ? 'لوحة تحكم الإدارة والموظفين (RBAC)' : 'Admin Dashboard (RBAC)'}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span>{isAr ? 'لوحة تحكم الإدارة (RBAC)' : 'Admin Dashboard (RBAC)'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span>{t('footer.locationNotice')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
