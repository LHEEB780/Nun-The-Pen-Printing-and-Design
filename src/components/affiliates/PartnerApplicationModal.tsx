import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Award, Briefcase, Phone, MapPin, 
  Sparkles, ArrowLeft, Send
} from 'lucide-react';
import { useAffiliateStore } from '../../store/useAffiliateStore';

interface PartnerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAr?: boolean;
}

export const PartnerApplicationModal: React.FC<PartnerApplicationModalProps> = ({
  isOpen,
  onClose,
  isAr = true,
}) => {
  const submitApplication = useAffiliateStore((state) => state.submitApplication);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    city: 'بغداد',
    experience: '',
    reason: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdAppId, setCreatedAppId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setError(isAr ? 'يرجى إدخال الاسم الكامل ورقم الهاتف' : 'Please provide name and phone number');
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError(isAr ? 'يرجى إدخال رقم هاتف عراقي صالح' : 'Please provide a valid Iraqi phone number');
      return;
    }

    setError('');
    const newApp = submitApplication({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
      city: formData.city,
      experience: formData.experience.trim() || (isAr ? 'خبرة تسويقية وعلاقات عامة' : 'Sales experience'),
      reason: formData.reason.trim() || (isAr ? 'الرغبة في تمثيل نون والقلم وبناء دخل متكرر' : 'Represent Noon & Pen'),
    });

    setCreatedAppId(newApp.id);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      phone: '',
      whatsapp: '',
      city: 'بغداد',
      experience: '',
      reason: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300">
              <Briefcase className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
              {isAr ? 'فريق المبيعات وتطوير الأعمال' : 'Sales & Business Development Team'}
            </span>
          </div>

          <h2 className="text-2xl font-bold font-serif text-white">
            {isAr ? 'طلب الانضمام كشريك وممثل مبيعات' : 'Apply as Noon & Pen Sales Partner'}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            {isAr 
              ? 'كن ممثلاً معتمداً لدار نون والقلم في محافظتك مع عمولات متكررة مدى الحياة لكل عميل تقدمه.'
              : 'Become an official representative in your city with lifetime recurring commissions on every client.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                {isAr ? 'تم استلام طلب اعتمادك بنجاح!' : 'Application Submitted Successfully!'}
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                {isAr 
                  ? 'شكراً لرغبتك بالانضمام لفريق شركاء نون والقلم. سيقوم مسؤول علاقات الشركاء بمراجعة طلبك والتواصل معك عبر الواتساب لتزويدك ببطاقتك الوظيفية الرقمية ورمز الشريك ورمز المرور (PIN).'
                  : 'Thank you for applying. Our partner relations team will review your application and message you via WhatsApp with your Employee ID, Referral Code, and Portal PIN.'}
              </p>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl max-w-sm mx-auto text-xs text-amber-900 flex items-center justify-between">
                <span>{isAr ? 'رقم ملف الطلب:' : 'Application Ref:'}</span>
                <span className="font-mono font-bold text-amber-800">{createdAppId}</span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition shadow-sm"
                >
                  {isAr ? 'إغلاق ومتابعة التسوق' : 'Close and Continue'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Feature Highlights Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-center">
                  <Sparkles className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-stone-900">{isAr ? 'عمولة مدى الحياة' : 'Lifetime Recurring'}</div>
                  <div className="text-[11px] text-stone-500">{isAr ? 'على كل طلب لاحق لنفس العميل' : 'On every future order'}</div>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-stone-900">{isAr ? 'بطاقة وهوية رقمية' : 'Digital Employee ID'}</div>
                  <div className="text-[11px] text-stone-500">{isAr ? 'رقم وظيفي رسمي وبادج معتمد' : 'Official partner badge'}</div>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-center">
                  <Award className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-stone-900">{isAr ? 'سحب فوري للأرباح' : 'Instant Payouts'}</div>
                  <div className="text-[11px] text-stone-500">{isAr ? 'زين كاش / آسيا حوالة / نقدي' : 'Zain Cash / Asia Hawala'}</div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {isAr ? 'الاسم الثلاثي أو اللقب الرسمي' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={isAr ? 'مثال: كرار أحمد التميمي' : 'e.g. Karrar Ahmed'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {isAr ? 'المحافظة / المدينة الرئيسية' : 'City / Governorate'} *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none bg-white"
                  >
                    <option value="بغداد">بغداد</option>
                    <option value="البصرة">البصرة</option>
                    <option value="أربيل">أربيل</option>
                    <option value="النجف الأشرف">النجف الأشرف</option>
                    <option value="كربلاء المقدسة">كربلاء المقدسة</option>
                    <option value="السليمانية">السليمانية</option>
                    <option value="بابل">بابل (الحلة)</option>
                    <option value="نينوى">نينوى (الموصل)</option>
                    <option value="كركوك">كركوك</option>
                    <option value="ذي قار">ذي قار (الناصرية)</option>
                    <option value="ميسان">ميسان (العمارة)</option>
                    <option value="ديالى">ديالى</option>
                    <option value="الأنبار">الأنبار</option>
                    <option value="واسط">واسط (الكوت)</option>
                    <option value="صلاح الدين">صلاح الدين</option>
                    <option value="القادسية">القادسية (الديوانية)</option>
                    <option value="المثنى">المثنى (السماوة)</option>
                    <option value="دهوك">دهوك</option>
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{isAr ? 'رقم الهاتف الأساسي (العراق)' : 'Primary Iraqi Phone'} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0770XXXXXXX / 0780XXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {isAr ? 'رقم الواتساب للتواصل والاعتماد' : 'WhatsApp Number'}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder={isAr ? 'إذا كان مختلفاً عن رقم الهاتف' : 'If different'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-left"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {isAr ? 'طبيعة علاقاتك أو خبرتك التسويقية والتجارية' : 'Experience & Network'}
                </label>
                <textarea
                  rows={2}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder={isAr 
                    ? 'مثال: لدي شبكة علاقات مع مطاعم وكافيهات ومكاتب في بغداد، أو أسوق للمنتجات الفاخرة عبر صفحات التواصل...' 
                    : 'Describe your network with restaurants, cafes, corporate offices, or social media audience...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {isAr ? 'ما الذي يحفزك لتمثيل منتجات نون والقلم؟' : 'Why represent Noon & Pen?'}
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder={isAr ? 'مثال: جودة الخشب والجلد الطبيعي، أو الرغبة ببناء دخل متكرر مستدام' : 'High luxury craft quality, recurring earnings...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Footer CTA */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm transition shadow-sm hover:shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'إرسال طلب الاعتماد' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
