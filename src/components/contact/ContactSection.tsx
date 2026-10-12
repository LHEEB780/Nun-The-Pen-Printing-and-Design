import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { COMPANY_CONTACT } from '../../data/mockData';

export const ContactSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'acrylic-led',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const message = isAr
      ? `استفسار جديد من الموقع - نون والقلم 🖋️\nالاسم: ${formData.name}\nالهاتف: ${formData.phone}\nنوع الخدمة: ${formData.serviceType}\nالتفاصيل: ${formData.message}`
      : `New Website Inquiry - Noon & Pen 🖋️\nName: ${formData.name}\nPhone: ${formData.phone}\nService: ${formData.serviceType}\nDetails: ${formData.message}`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/9647800000000?text=${encoded}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('contact.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="font-bold text-lg text-slate-900">
              {isAr ? 'مكتب وورشة نون والقلم' : 'Studio & Workshop'}
            </h3>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    {t('contact.addressLabel')}
                  </span>
                  <span className="font-medium text-slate-800">
                    {isAr ? COMPANY_CONTACT.addressAr : COMPANY_CONTACT.addressEn}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    {t('contact.phoneLabel')}
                  </span>
                  <a href={`tel:${COMPANY_CONTACT.phone}`} className="font-bold text-slate-900 dir-ltr hover:text-purple-700 block">
                    {COMPANY_CONTACT.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    {t('contact.emailLabel')}
                  </span>
                  <a href={`mailto:${COMPANY_CONTACT.email}`} className="font-medium text-slate-800 hover:text-purple-700 block">
                    {COMPANY_CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    {t('contact.workingHoursLabel')}
                  </span>
                  <span className="font-medium text-slate-800">
                    {isAr ? COMPANY_CONTACT.workingHoursAr : COMPANY_CONTACT.workingHoursEn}
                  </span>
                </div>
              </div>
            </div>

            {/* Iraq Nationwide Delivery Note */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-sky-50 border border-purple-100 text-xs text-purple-900 leading-relaxed">
              <span className="font-bold block mb-1">
                {isAr ? '🚚 توصيل محكم لجميع محافظات العراق:' : '🚚 Nationwide Safe Delivery:'}
              </span>
              <span>
                {isAr
                  ? 'يتم تغليف اللوحات ومجسمات الأكريليك بطبقات فقاعية وصناديق مقواة ضد الصدمات لضمان وصولها سليمة 100%.'
                  : 'All acrylic fixtures and LED boxes are wrapped in high-density foam and shockproof cartons for safe delivery.'}
              </span>
            </div>
          </div>

          {/* Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  {isAr ? 'تم استلام طلبك بنجاح!' : 'Inquiry Sent Successfully!'}
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  {t('contact.formSuccess')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', serviceType: 'acrylic-led', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  {isAr ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                      {t('contact.formName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? 'مثال: مصطفى سالم' : 'e.g. John Doe'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                      {t('contact.formPhone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={isAr ? 'مثال: 07800000000' : '+964 780 ...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    {t('contact.formType')}
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="acrylic-led">
                      {isAr ? 'لوحات ومجسمات أكريليك LED' : 'Acrylic LED Signs & Lamps'}
                    </option>
                    <option value="rigid-boxes">
                      {isAr ? 'طباعة علب الكرتون الفاخرة' : 'Custom Rigid Box Packaging'}
                    </option>
                    <option value="business-cards">
                      {isAr ? 'كروت أعمال وبصمة حرارية' : 'Business Cards & Stationery'}
                    </option>
                    <option value="wedding-keepsakes">
                      {isAr ? 'لوحات الزفاف والمناسبات التذكارية' : 'Wedding Timeline & Keepsakes'}
                    </option>
                    <option value="custom-portrait">
                      {isAr ? 'لوحة بورتريه فيكتور مخصصة' : 'Custom Vector Portrait Light'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    {t('contact.formMessage')}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      isAr
                        ? 'اكتب المقاس التقريبي، تفاصيل الشعار، الموعد المطلوب، وأي ملاحظات...'
                        : 'Describe dimensions, preferred materials, target date, and ideas...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-700 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('contact.formSubmit')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
