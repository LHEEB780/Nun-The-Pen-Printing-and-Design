import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Sparkles, MessageCircle } from 'lucide-react';
import { COMPANY_CONTACT } from '../../data/mockData';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#87CEEB]/40 via-[#E6E6FA] to-purple-200 border border-purple-200/60 flex items-center justify-center text-purple-700 font-bold text-xl shadow-xs">
                ن
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 block leading-tight">
                  {isAr ? 'نُون والقَلَم' : 'Noon & Pen'}
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {isAr ? 'للطباعة والتصميم الفاخر' : 'Printing & Bespoke Design'}
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

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 text-sm font-bold mb-4 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-purple-600 rounded-full" />
              <span>{t('footer.quickLinks')}</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="text-slate-600 hover:text-purple-700 transition-colors">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="#services" className="text-slate-600 hover:text-purple-700 transition-colors">
                  {t('nav.services')}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-slate-600 hover:text-purple-700 transition-colors">
                  {t('nav.portfolio')}
                </a>
              </li>
              <li>
                <a href="#shop" className="text-slate-600 hover:text-purple-700 transition-colors">
                  {t('nav.shop')}
                </a>
              </li>
              <li>
                <a href="#why-us" className="text-slate-600 hover:text-purple-700 transition-colors">
                  {t('nav.whyUs')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-600 hover:text-purple-700 transition-colors">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-slate-900 text-sm font-bold mb-4 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-sky-500 rounded-full" />
              <span>{t('footer.categories')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>{isAr ? 'لوحات أكريليك مضيئة LED' : '3D LED Acrylic Signs'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>{isAr ? 'علب كرتون مقوى فاخرة (Rigid Boxes)' : 'Rigid Gift Box Packaging'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>{isAr ? 'كروت أعمال وبصمة حرارية' : 'Hot-Foil Business Cards'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>{isAr ? 'لوحات بورتريه فيكتور مخصصة' : 'Custom Vector Portrait Lamps'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>{isAr ? 'دروع تذكارية وتوثيق الزفاف' : 'Commemorative Wedding Plaques'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>{isAr ? 'هدايا الشركات ودروع التكريم' : 'Executive Corporate Awards'}</span>
              </li>
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t('footer.rights')}</p>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span>{t('footer.locationNotice')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
