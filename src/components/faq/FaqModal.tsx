import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Search,
  HelpCircle,
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Copy,
  Check,
  MessageCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Phone,
  AlertTriangle,
  Layers,
  Clock,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { COMPANY_CONTACT } from '../../data/mockData';

export type FaqCategory = 'all' | 'custom_orders' | 'shipping' | 'material_care';

export interface FaqItem {
  id: string;
  category: 'custom_orders' | 'shipping' | 'material_care';
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  tagsAr: string[];
  tagsEn: string[];
  importantNoticeAr?: string;
  importantNoticeEn?: string;
}

export const FAQ_DATA: FaqItem[] = [
  // 1. الطلبات المخصصة والتنفيذ (Custom Orders & Fabrication)
  {
    id: 'faq-custom-1',
    category: 'custom_orders',
    questionAr: 'كيف أطلب تصميماً مخصصاً بالكامل (شعار شركة، درع تكريم، أو لوحة باسم العائلة)؟',
    questionEn: 'How do I place a fully bespoke order (corporate logo, plaque, or custom family lamp)?',
    answerAr:
      'يمكنك البدء فوراً عبر استوديو التخصيص ثلاثي الأبعاد التفاعلي في موقعنا أو النقر على زر «طلب تصميم». تختار المنتج المطلوب وخاماته، ثم ترفع ملف الشعار (بصيغ AI, PDF, SVG, أو PNG عالي الدقة) وتكتب النصوص والأسماء. بعد إرسال الطلب يتواصل معك مهندس الإنتاج لإعداد ومطابقة التصميم قبل التصنيع.',
    answerEn:
      'You can start immediately via our interactive 3D studio or by clicking "Custom Design". Select your product and material, upload your logo (AI, PDF, SVG, or high-res PNG), and input your custom text. Our fabrication engineer will review and align your artwork before manufacturing.',
    tagsAr: ['تخصيص', 'شعار', 'استوديو 3D', 'تصميم جديد'],
    tagsEn: ['Custom', 'Logo', '3D Studio', 'New Design'],
  },
  {
    id: 'faq-custom-2',
    category: 'custom_orders',
    questionAr: 'هل سأحصل على بروفة رقمية معتمدة قبل بدء القص والطباعة الفعلية؟',
    questionEn: 'Do I get an approved digital proof before actual cutting and printing begins?',
    answerAr:
      'نعم بالتأكيد! نلتزم في استوديو نُون والقَلَم بعدم قص أي لوح أكريليك أو بدء طباعة أي علبة كرتونية إلا بعد إرسال بروفة رقمية معتمدة (Digital Proof) توضح الأبعاد، نوع الخط العربي، توزع الإضاءة، وتناسق الألوان بدقة 100% عبر حسابك في المنصة والواتساب واعتمادها من قبلك.',
    answerEn:
      'Yes, absolutely! At Noon & Pen, no acrylic sheet is cut or packaging printed without your 100% sign-off on a detailed digital proof showing exact dimensions, calligraphy curves, LED glow diffusion, and pantone balance via your dashboard and WhatsApp.',
    tagsAr: ['بروفة رقمية', 'ضمان المطابقة', 'اعتماد التصميم'],
    tagsEn: ['Digital Proof', 'Accuracy Guarantee', 'Sign-off'],
  },
  {
    id: 'faq-custom-3',
    category: 'custom_orders',
    questionAr: 'ما هي الخطوط العربية والتشطيبات الفاخرة المتاحة للطلبات المخصصة؟',
    questionEn: 'What Arabic calligraphy styles and luxury finishes are available for custom orders?',
    answerAr:
      'نوفر تصاميم بخطوط عربية تراثية وأصيلة (الثلث الجلي، الكوفي الهندسي، الديواني، والرقعة) بإشراف خطاطين محترفين. وتشمل تشطيباتنا: البصمة الحرارية الألمانية (Hot Foil Kurz باللون الذهبي والفضي والمات)، الحفر الليزري الميكرومتري، الأكريليك المرآة الفاخر (Gold/Silver Mirror)، وتنعيم الحواف بالماس للحصول على لمعان كريستالي ناصع.',
    answerEn:
      'We offer authentic Arabic calligraphy styles (Thuluth, Geometric Kufic, Diwani, and Ruq’ah) supervised by master calligraphers. Finishes include German Kurz hot foil (gloss/matte gold and silver), sub-millimeter laser scoring, luxury mirror cast acrylic, and diamond-polished crystal edges.',
    tagsAr: ['خط عربي', 'بصمة ذهبية', 'أكريليك كاست', 'حفر ليزري'],
    tagsEn: ['Calligraphy', 'Gold Foil', 'Cast Acrylic', 'Laser Engraving'],
  },
  {
    id: 'faq-custom-4',
    category: 'custom_orders',
    questionAr: 'ما هو الحد الأدنى للطلب (MOQ)؟ وهل تنفذون قطعاً فردية؟',
    questionEn: 'What is the Minimum Order Quantity (MOQ)? Do you fabricate single pieces?',
    answerAr:
      'نعم، ننفذ القطع الفردية (قطعة واحدة فقط) للوحات الـ LED المضيئة، الدروع التذكارية الشخصية، ولوحات توثيق عقود الزواج. أما بالنسبة لعلب الكرتون الصلبة المطبوعة بالكامل وكروت الأعمال الفاخرة، فإن الحد الأدنى للتصنيع التجاري يبدأ من 50 إلى 100 قطعة حسب المقاس ونوع الكرتون.',
    answerEn:
      'Yes, we fabricate single bespoke pieces (MOQ: 1 unit) for LED illuminated lamps, wedding plaques, and executive trophies. For fully custom printed rigid cardboard boxes and hot-foil business cards, minimum commercial runs start at 50–100 units depending on specs.',
    tagsAr: ['الحد الأدنى', 'قطعة واحدة', 'طلبات الشركات'],
    tagsEn: ['MOQ', 'Single Piece', 'Corporate Runs'],
  },

  // 2. مواعيد الشحن والتوصيل (Shipping & Delivery Logistics)
  {
    id: 'faq-shipping-1',
    category: 'shipping',
    questionAr: 'كم تستغرق مدة تنفيذ وتصنيع الطلبات المخصصة داخل الورشة؟',
    questionEn: 'How long does production and manufacturing take in the workshop?',
    answerAr:
      'تستغرق دورة التصنيع المعتادة بين 24 إلى 48 ساعة فقط من لحظة موافقتك النهائية على البروفة الرقمية. في حال الطلبات الكبيرة للشركات أو المؤتمرات (أكثر من 200 قطعة) يتم تحديد جدول زمني واضح مع مسؤول الإنتاج.',
    answerEn:
      'Standard fabrication takes 24 to 48 hours from your final approval of the digital proof. For volume corporate orders or conference supplies (200+ units), an explicit production timetable is agreed upon with the production manager.',
    tagsAr: ['مدة التصنيع', 'سرعة التنفيذ', 'ورشة بغداد'],
    tagsEn: ['Lead Time', 'Fast Turnaround', 'Baghdad Workshop'],
  },
  {
    id: 'faq-shipping-2',
    category: 'shipping',
    questionAr: 'ما هي مواعيد وأجور التوصيل إلى مناطق بغداد (الرصافة والكرخ)؟',
    questionEn: 'What are the delivery times and shipping rates across Baghdad districts?',
    answerAr:
      'يتم التوصيل داخل بغداد خلال 24 ساعة بمجرد اكتمال التصنيع واختبار الجودة. مندوب التوصيل يتواصل معك مسبقاً لتحديد الموعد والموقع الدقيق. تكلفة التوصيل ثابتة (5,000 د.ع)، وتكون مجانية تماماً لأي طلب تتجاوز قيمته 150,000 د.ع.',
    answerEn:
      'Delivery within Baghdad occurs within 24 hours of quality inspection completion. Our courier contacts you to confirm the exact delivery window. Shipping rate is a flat 5,000 IQD, and 100% free for orders exceeding 150,000 IQD.',
    tagsAr: ['توصيل بغداد', '5000 د.ع', 'شحن مجاني'],
    tagsEn: ['Baghdad Delivery', '5,000 IQD', 'Free Shipping'],
  },
  {
    id: 'faq-shipping-3',
    category: 'shipping',
    questionAr: 'كيف يتم الشحن إلى باقي المحافظات العراقية وكم يستغرق من الوقت؟',
    questionEn: 'How does shipping to other Iraqi governorates work and how long does it take?',
    answerAr:
      'نغطي جميع محافظات العراق الـ 18 (أربيل، السليمانية، دهوك، البصرة، النجف، كربلاء، بابل، الموصل، كركوك، ميسان، ذي قار، وغيرها) عبر شبكة شحن بري سريع ومؤمّن ضد الصدمات. يستغرق التوصيل بين 48 إلى 72 ساعة، بتكلفة موحدة قدرها 8,000 د.ع مع كود تتبع مباشر لمسار الشحنة.',
    answerEn:
      'We ship across all 18 Iraqi governorates (Erbil, Sulaymaniyah, Basra, Najaf, Karbala, Babylon, Mosul, Kirkuk, etc.) via shock-proof express road freight. Delivery takes 48–72 hours with a flat fee of 8,000 IQD and live package tracking.',
    tagsAr: ['شحن المحافظات', '8000 د.ع', 'كافة المحافظات', 'تتبع الشحنة'],
    tagsEn: ['Governorates', '8,000 IQD', 'All Iraq', 'Tracking Code'],
  },
  {
    id: 'faq-shipping-4',
    category: 'shipping',
    questionAr: 'هل يتوفر شحن فوري ومستعجل للفعاليات والمناسبات الطارئة (Rush Orders)؟',
    questionEn: 'Do you offer rush emergency turnaround for last-minute events?',
    answerAr:
      'نعم! نوفر خدمة المسار السريع (VIP Rush Execution) للتسليم في نفس اليوم أو خلال 12 ساعة داخل بغداد للمناسبات الرسمية والتكريمات العاجلة. يرجى التواصل مباشرة عبر زر الواتساب وتحديد كلمة «طلب مستعجل» لفرز الطلب في خط الإنتاج الأولوية.',
    answerEn:
      'Yes! We provide a VIP Rush Execution service for same-day or 12-hour delivery in Baghdad for urgent ceremonies and corporate events. Contact us via WhatsApp stating "Rush Order" to prioritize your item on the production line.',
    tagsAr: ['طلب مستعجل', 'تسليم سريع', 'نفس اليوم'],
    tagsEn: ['Rush Order', 'Same Day', 'Urgent Event'],
  },

  // 3. إرشادات العناية بالمواد والصيانة (Material Care & Maintenance)
  {
    id: 'faq-care-1',
    category: 'material_care',
    questionAr: 'كيف أنظف لوحات ومجسمات الأكريليك المضيئة LED دون إحداث خدوش؟',
    questionEn: 'How should I clean 3D LED acrylic lamps and plaques without scratching?',
    answerAr:
      'استخدم دائماً قطعة قماش مايكروفايبر ناعمة ونظيفة (مثل المخصصة لعدسات النظارات أو شاشات الهواتف). امسح السطح الأكريليكي برفق وبحركات دائرية خفيفة لإزالة الغبار. تجنب نهائياً استخدام المناديل الورقية الخشنة أو الأقمشة الجافة الخشنة لأنها قد تترك خدوشاً دقيقة على السطح اللامع.',
    answerEn:
      'Always use a clean microfiber cloth (like those for eyewear lenses or phone screens). Gently wipe the acrylic surface in light circular motions to remove dust. Never use coarse paper towels, sponges, or rough fabrics that cause micro-scratches.',
    importantNoticeAr:
      'تحذير: تجنب تماماً استخدام الكحول الطبي، الأسيتون، ملمعات الزجاج المحتوية على الأمونيا، أو المذيبات الكيميائية؛ لأنها تسبب تضبب الأكريليك وتشققه (Crazing). للتنظيف العميق استخدم فقط قطرة من صابون أطباق سائل خفيف مخفف بماء فاتر.',
    importantNoticeEn:
      'Warning: Never use medical alcohol, acetone, ammonia-based glass cleaners, or solvents, as they cause acrylic hazing and crazing. For deep cleaning, use only a drop of mild dish soap diluted in lukewarm water.',
    tagsAr: ['تنظيف الأكريليك', 'مايكروفايبر', 'تجنب الكحول'],
    tagsEn: ['Acrylic Care', 'Microfiber', 'No Alcohol'],
  },
  {
    id: 'faq-care-2',
    category: 'material_care',
    questionAr: 'كيف أحافظ على علب الكرتون الصلبة والورق الفاخر ذو البصمة الذهبية؟',
    questionEn: 'How should I store and protect luxury rigid boxes and hot-foil stationery?',
    answerAr:
      'احفظ علب الهدايا والمطبوعات الفاخرة في مكان معتدل وجاف بعيداً عن مصادر الرطوبة المباشرة أو أشعة الشمس الحارقة الممتدة. الرطوبة المرتفعة تؤثر على استقامة الورق القطني، بينما الحرارة الشديدة قد تقلل من بريق رقائق البصمة الذهبية. يُنصح بحفظها في أكياس الحماية القماشية المرفقة عند التخزين الطويل.',
    answerEn:
      'Store luxury rigid boxes and foiled cards in a dry, climate-controlled space away from direct moisture and prolonged scorching sunlight. High humidity impacts cotton board rigidity, while extreme heat dulls metallic foil luster. Keep in the provided protective dust bags for long-term storage.',
    tagsAr: ['علب كرتون', 'بصمة ذهبية', 'حماية من الرطوبة'],
    tagsEn: ['Rigid Boxes', 'Gold Foil Care', 'Moisture Defense'],
  },
  {
    id: 'faq-care-3',
    category: 'material_care',
    questionAr: 'ما هي معايير تشغيل وصيانة شرائط إضاءة LED والمحولات ومنافذ Type-C؟',
    questionEn: 'What are the operating standards and warranty for the LED circuits and Type-C adapters?',
    answerAr:
      'تعمل جميع لوحاتنا بإضاءة LED منخفضة الجهد وآمنة كلياً (12V DC أو منفذ Type-C 5V) مع عمر تشغيلي يتجاوز 50,000 ساعة عمل واستهلاك كهربائي ضئيل جداً. يرجى استخدام المحول أو الكابل الأصلي المرفق مع المنتج، وفصل التيار الكهربائي قبل تنظيف اللوحة أو نقلها من مكانها.',
    answerEn:
      'All our LED fixtures operate on safe low-voltage circuits (12V DC or 5V Type-C) with a lifespan exceeding 50,000 operational hours and minimal energy consumption. Always use the original bundled adapter and cable, and disconnect power before dusting or relocating.',
    tagsAr: ['إضاءة LED', 'محول 12V', 'منفذ Type-C', 'أمان كهربائي'],
    tagsEn: ['LED Circuit', '12V Adapter', 'Type-C Port', 'Electrical Safety'],
  },
  {
    id: 'faq-care-4',
    category: 'material_care',
    questionAr: 'ما هو الضمان المقدم على القطع المصنعة في استوديو نُون والقَلَم؟',
    questionEn: 'What warranty is provided on items fabricated at Noon & Pen atelier?',
    answerAr:
      'نقدم ضماناً حقيقياً لمدة عام كامل (12 شهراً) على كافة المكونات الإلكترونية والمحولات وقواعد الإضاءة. كما نضمن استبدال أو إعادة تصنيع فورية مجانية في حال وجود أي عيب مصنعي في القص أو الطباعة أو التغليف عند الاستلام.',
    answerEn:
      'We provide an authentic 1-year (12-month) warranty on all electronic circuits, LED strips, adapters, and wooden bases. We also guarantee free instant remake or replacement for any manufacturing defect in cutting, printing, or packaging upon delivery.',
    tagsAr: ['ضمان عام كامل', 'استبدال فوري', 'ضمان الجودة'],
    tagsEn: ['1-Year Warranty', 'Instant Replacement', 'Quality Pledge'],
  },
];

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomizer?: (productId?: string) => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomizer,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-custom-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories: Array<{ id: FaqCategory; labelAr: string; labelEn: string; icon: React.ReactNode; count: number }> = [
    {
      id: 'all',
      labelAr: 'كافة الاستفسارات',
      labelEn: 'All Questions',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      count: FAQ_DATA.length,
    },
    {
      id: 'custom_orders',
      labelAr: 'الطلبات المخصصة',
      labelEn: 'Custom Orders',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((item) => item.category === 'custom_orders').length,
    },
    {
      id: 'shipping',
      labelAr: 'مواعيد الشحن والتوصيل',
      labelEn: 'Shipping & Delivery',
      icon: <Truck className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((item) => item.category === 'shipping').length,
    },
    {
      id: 'material_care',
      labelAr: 'إرشادات العناية بالمواد',
      labelEn: 'Material Care & Maintenance',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((item) => item.category === 'material_care').length,
    },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const question = (isAr ? item.questionAr : item.questionEn).toLowerCase();
      const answer = (isAr ? item.answerAr : item.answerEn).toLowerCase();
      const tags = (isAr ? item.tagsAr : item.tagsEn).join(' ').toLowerCase();

      return question.includes(q) || answer.includes(q) || tags.includes(q);
    });
  }, [activeCategory, searchQuery, isAr]);

  const handleCopyAnswer = (item: FaqItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `سؤال: ${isAr ? item.questionAr : item.questionEn}\n\nالإجابة: ${
      isAr ? item.answerAr : item.answerEn
    }\n\n— مركز المعرفة والأسئلة الشائعة | نُون والقَلَم للطباعة والتصميم`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    toast.success(isAr ? 'تم نسخ السؤال والإجابة بنجاح' : 'FAQ item copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-modal-title"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white p-5 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label={isAr ? 'إغلاق نافذة الأسئلة الشائعة' : 'Close FAQ modal'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'قاعدة المعرفة ومركز المساعدة' : 'Knowledge Base & Help Center'}</span>
          </div>

          <h2 id="faq-modal-title" className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            {isAr ? 'الأسئلة الشائعة والدليل الإرشادي' : 'Frequently Asked Questions (FAQ)'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            {isAr
              ? 'إجابات شاملة ومباشرة حول كيفية تنفيذ الطلبات المخصصة، مواعيد الشحن في بغداد والمحافظات، وأفضل إرشادات العناية بالمواد والأكريليك.'
              : 'Detailed answers on custom fabrication orders, shipping across Baghdad & governorates, and professional material care.'}
          </p>

          {/* Quick Real-Time Search Bar */}
          <div className="mt-4 relative max-w-xl">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث عن استفسار (مثال: شحن، أكريليك، تنظيف، بروفة، موعد)...'
                  : 'Search queries (e.g., shipping, acrylic, cleaning, proof, MOQ)...'
              }
              className="w-full ps-10 pe-10 py-2.5 bg-white/15 hover:bg-white/20 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-300 focus:placeholder:text-slate-400 text-xs sm:text-sm rounded-2xl border border-white/20 focus:border-amber-400 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                type="button"
                className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="px-5 sm:px-7 pt-4 pb-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setExpandedId(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-900 text-white shadow-xs shadow-amber-950/20'
                    : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200/80'
                }`}
              >
                {cat.icon}
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-amber-950 text-amber-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Questions List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-3.5 bg-slate-50/40">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {isAr ? 'لم يتم العثور على نتائج مطابقة لبحثك' : 'No matching questions found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isAr
                  ? 'جرب البحث بكلمات أخرى أو تواصل مباشرة مع فريقنا الفني على واتساب للإجابة الفورية.'
                  : 'Try searching with different keywords or contact our workshop team on WhatsApp for instant assistance.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-amber-900 hover:bg-amber-50 transition-all cursor-pointer"
              >
                <span>{isAr ? 'إعادة ضبط البحث' : 'Reset Search'}</span>
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              const isCopied = copiedId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-200/50'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                  }`}
                >
                  {/* Accordion Question Trigger Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-start flex items-start justify-between gap-3 cursor-pointer select-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-black transition-colors ${
                          isExpanded
                            ? 'bg-amber-900 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {faq.category === 'custom_orders' ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : faq.category === 'shipping' ? (
                          <Truck className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug">
                          {isAr ? faq.questionAr : faq.questionEn}
                        </span>

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            {faq.category === 'custom_orders'
                              ? isAr ? 'الطلبات المخصصة' : 'Custom Orders'
                              : faq.category === 'shipping'
                              ? isAr ? 'مواعيد الشحن' : 'Shipping Logistics'
                              : isAr ? 'العناية بالمواد' : 'Material Care'}
                          </span>

                          {(isAr ? faq.tagsAr : faq.tagsEn).slice(0, 2).map((tag, tIdx) => (
                            <span key={tIdx} className="text-[10px] text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 mt-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-amber-900 bg-amber-50' : 'text-slate-400'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Accordion Answer Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-slate-100 mt-1 space-y-3 animate-fadeIn">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-3">
                        {isAr ? faq.answerAr : faq.answerEn}
                      </p>

                      {/* Important Material Warning / Alert Notice */}
                      {(faq.importantNoticeAr || faq.importantNoticeEn) && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span className="font-semibold leading-relaxed">
                            {isAr ? faq.importantNoticeAr : faq.importantNoticeEn}
                          </span>
                        </div>
                      )}

                      {/* Bottom Answer Action Bar */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleCopyAnswer(faq, e)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-amber-900 hover:bg-amber-50 border border-slate-200/80 transition-all cursor-pointer"
                            title={isAr ? 'نسخ الإجابة' : 'Copy answer'}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-400" />
                                <span>{isAr ? 'نسخ الإجابة' : 'Copy Answer'}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {faq.category === 'custom_orders' && onOpenCustomizer && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenCustomizer();
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 hover:underline cursor-pointer"
                          >
                            <span>{isAr ? 'بدء تخصيص طلبك الآن' : 'Start Customizing Now'}</span>
                            <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Footer with Direct Assistance CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 text-center sm:text-start">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isAr
                ? 'لم تجد الإجابة التي تبحث عنها؟ مهندسو ورشتنا في بغداد متاحون للرد المباشر.'
                : 'Need more clarification? Our fabrication team in Baghdad is ready to help.'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={COMPANY_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'محادثة فورية على واتساب' : 'Chat on WhatsApp'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
