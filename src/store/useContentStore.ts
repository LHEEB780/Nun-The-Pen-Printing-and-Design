import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuickLinkSectionKey = 'home' | 'services' | 'portfolio' | 'custom_products' | 'why_us' | 'contact';

export interface ArticleMetric {
  labelAr: string;
  labelEn: string;
  value: string;
  iconName?: string;
}

export interface CMSArticle {
  id: string;
  sectionKey: QuickLinkSectionKey;
  slug: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  categoryAr: string;
  categoryEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string; // Rich detailed article body
  contentEn: string;
  coverImage: string;
  galleryImages: string[];
  authorAr: string;
  authorEn: string;
  publishedDate: string;
  readTime: string;
  highlightsAr: string[];
  highlightsEn: string[];
  metrics: ArticleMetric[];
  isActive: boolean;
  actionTextAr?: string;
  actionTextEn?: string;
  actionLink?: string;
}

interface ContentStore {
  articles: CMSArticle[];
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  getArticleBySection: (sectionKey: QuickLinkSectionKey) => CMSArticle | undefined;
  getArticleById: (id: string) => CMSArticle | undefined;
  addArticle: (article: Omit<CMSArticle, 'id'>) => void;
  updateArticle: (id: string, updated: Partial<CMSArticle>) => void;
  deleteArticle: (id: string) => void;
  toggleArticleActive: (id: string) => void;
  resetToDefaults: () => void;
}

export const INITIAL_CMS_ARTICLES: CMSArticle[] = [
  {
    id: 'art-home',
    sectionKey: 'home',
    slug: 'home-overview',
    titleAr: 'الرئيسية – نُون والقَلَم: أفق جديد في الطباعة الفاخرة والتصنيع الرقمي المضيء',
    titleEn: 'Home – Noon & Pen: The Benchmark of Bespoke Printing & Illuminated Craft',
    subtitleAr: 'حيث تلتقي أصالة الخط العربي بدقة الحفر الليزري ووهج الإضاءة الحديثة',
    subtitleEn: 'Where timeless Arabic calligraphy meets European laser precision and optical LED artistry',
    categoryAr: 'نظرة عامة والهوية المؤسسية',
    categoryEn: 'Brand Philosophy & Vision',
    summaryAr: 'انطلقت نُون والقَلَم لتحدث ثورة حقيقية في مفهوم الهدايا التذكارية، التغليف الفاخر، ودروع التكريم في العراق، من خلال دمج الهندسة الرقمية المتقدمة مع التراث الجمالي الرفيع.',
    summaryEn: 'Noon & Pen was founded to redefine bespoke awards, rigid luxury packaging, and optical signage in Iraq by bridging precision digital fabrication with heritage Arabic aesthetics.',
    coverImage: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
    galleryImages: [
      '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
      '/images/products/led_acrylic_3d_angle_1791816316544.jpg',
      '/images/products/led_acrylic_3d_lifestyle_1791816373444.jpg',
      '/images/products/travel_agency_wall_front_1791817427540.jpg',
    ],
    authorAr: 'فريق الإدارة والابتكار – نُون والقَلَم',
    authorEn: 'Innovation Team – Noon & Pen',
    publishedDate: '2026-10-12',
    readTime: '4 دقائق قراءة',
    highlightsAr: [
      'أول منصة عراقية تتيح معاينة وتخصيص ثلاثي الأبعاد تفاعلي للعميل قبل بدء التصنيع.',
      'اعتماد خامات أصلية 100% مثل أكريليك كاست البكر والورق القطني الإيطالي 600 غم.',
      'ورشة تصنيع مجهزة بأحدث آلات الليزر وماكينات البصمة الحرارية الألمانية (Kurz).',
      'فريق متخصص في معايرة الخطوط العربية الأصيلة وضبط توازن الإضاءة الموفرة للعين.',
    ],
    highlightsEn: [
      'First Iraqi fabrication studio with live 3D web preview before production kicks off.',
      '100% virgin cast acrylic, German hot foil, and Italian 600gsm cotton board.',
      'Equipped with advanced European laser routers and precision debossing presses.',
      'Dedicated Arabic calligraphers fine-tuning every curvature and optical reflection.',
    ],
    metrics: [
      { labelAr: 'طلب مكتمل بدقة 100%', labelEn: 'Flawless Orders Delivered', value: '12,500+' },
      { labelAr: 'دقة القص الليزري', labelEn: 'Laser Precision Tolerance', value: '0.2 mm' },
      { labelAr: 'محافظة نغطيها بالشحن', labelEn: 'Governorates Covered', value: '18 / 18' },
      { labelAr: 'معدل رضا العملاء والشركات', labelEn: 'Client Satisfaction Rate', value: '99.4%' },
    ],
    contentAr: `
### 🏛️ فلسفة التأسيس: حين يتحول الحرف إلى تحفة فنية مضيئة

تأسست علامة **نُون والقَلَم** في بغداد استلهاماً من عراقة الحرف العربي وسحر التكوين البصري، لتكون رائدة في تقديم حلول الطباعة الرقمية الفاخرة، الدروع التذكارية، وأنظمة الإضاءة الذكية. نحن لا نصنع مجرد لوحات أو علب هدايا، بل نصمم مقتنيات تدوم طويلاً، وتحكي قصة تميز كل عميل ومؤسسة.

تجمع ورشاتنا بين الفن الحرفي اليدوي والتكنولوجيا الصناعية الحديثة؛ حيث نستخدم أحدث ماكينات القطع والنقش الليزري فائقة الدقة بقدرة تحكّم تصل إلى 0.2 ملم، مما يضمن خروج كل خط عربي وزاوية هندسية بأقصى درجات النقاء والحدة.

---

### 💡 منظومة متكاملة من الابتكار والتنفيذ المباشر

1. **محرك المعاينة الحية:** وفرنا لعملائنا في هذه المنصة إمكانية كتابة نصوصهم، اختيار نوع الخط العربي (كوفي، ديواني، رقعة، تجوال)، وتحديد لون الإضاءة ومقاس الدرع مع حساب الأسعار الفوري، لتجربة تسوق شفافة وعصرية.
2. **سلاسل توريد معتمدة عالمياً:** نرفض استخدام الخامات المقلدة أو الأكريليك التجاري المعاد تدويره؛ بل نعتمد ألواح الأكريليك الكاست البكر (Virgin Cast Acrylic) التي تحافظ على صفائها الكريستالي لسنوات دون أي اصفرار أو بهتان.
3. **التصميم الموجه للشركات والأفراد:** سواء كنت تبحث عن درع تكريم شخصي لذكرى زواج أو تخرج، أو تحتاج لتجهيز مئات علب الهدايا الفاخرة والدروع الرسمية لمؤتمر دولي، فإن طاقتنا الإنتاجية تلبي طلبك في فترات قياسية تتراوح بين 24 إلى 48 ساعة.

> "نؤمن في نُون والقَلَم بأن التفاصيل الدقيقة هي التي تصنع الفارق بين المنتج العادي والتحفة الملكية التي تبقى خالدة على مكاتب القادة وجدران الإنجاز."
    `,
    contentEn: `
### 🏛️ Brand Heritage: Transforming Inscriptions into Radiant Masterpieces

Noon & Pen was conceived in Baghdad at the intersection of classical Arabic calligraphy and modern optical fabrication. We specialize in bespoke illuminated awards, executive gift boxes, and precision-crafted stationery that reflect true prestige.

Our state-of-the-art workshop integrates fine artisan craftsmanship with computerized CNC laser technology calibrated to sub-millimeter tolerances (0.2 mm).

---

### 💡 An Integrated Ecosystem of Innovation

1. **Interactive 3D Customizer:** Direct digital proofing where clients input bespoke copy, select font scripts, and preview illumination hues with live tiered pricing.
2. **Pure Optical-Grade Materials:** Only virgin cast acrylic and heavy cotton boards guaranteed against fading, warping, or yellowing.
3. **Versatility for Individuals & Conglomerates:** From single personal milestone wedding plaques to corporate conference trophy batches delivered across all 18 Iraqi governorates in 24-48 hours.
    `,
    isActive: true,
    actionTextAr: 'استكشف منتجات المتجر الآن',
    actionTextEn: 'Explore Custom Catalog',
    actionLink: 'shop',
  },
  {
    id: 'art-services',
    sectionKey: 'services',
    slug: 'our-services',
    titleAr: 'خدماتنا المتكاملة – حلول التصنيع الرقمي والعلب الفاخرة والكروت القطنية',
    titleEn: 'Our Services – Digital Fabrication, Luxury Rigid Packaging & Letterpress',
    subtitleAr: 'أربعة مسارات إنتاجية متخصصة تلبي أعلى معايير الشركات والمناسبات الخاصة',
    subtitleEn: 'Four dedicated production divisions crafted for discerning corporations and private clientele',
    categoryAr: 'الخدمات الصناعية والتصميم',
    categoryEn: 'Fabrication & Production Divisions',
    summaryAr: 'نقدم حلولاً تصنيعية شاملة تشمل علب الهدايا الكرتونية المقواة (Rigid Boxes)، لوحات الأكريليك المضيئة 3D LED، كروت الأعمال بالبصمة الحرارية، ودروع التكريم المصممة حسب الطلب.',
    summaryEn: 'Complete bespoke manufacturing solutions spanning luxury rigid gift boxes, edge-lit optical acrylic lamps, metallic hot-foil cotton business cards, and personalized corporate awards.',
    coverImage: '/images/products/acrylic_led_front_1791779703517.jpg',
    galleryImages: [
      '/images/products/acrylic_led_front_1791779703517.jpg',
      '/images/products/acrylic_led_angle_1791779718594.jpg',
      '/images/products/travel_agency_desk_front_1791817396012.jpg',
      '/images/products/acrylic_led_lifestyle_1791779775892.jpg',
    ],
    authorAr: 'قسم هندسة الإنتاج والتصميم – نُون والقَلَم',
    authorEn: 'Production Engineering Division – Noon & Pen',
    publishedDate: '2026-10-12',
    readTime: '6 دقائق قراءة',
    highlightsAr: [
      'تفصيل علب كرتون مقوى (Rigid Boxes) بوزن 1200 - 1800 غم مع تلبيس فاخر وقفل مغناطيسي.',
      'حفر ونقش ليزري لألواح الأكريليك بسماكات تبدأ من 3 مم حتى 12 مم مع إضاءة Edge-Lit خافتة وراقية.',
      'كروت أعمال قطنية إيطالية 600 غم مع بصمة حرارية ألمانية وتذهيب يدوي عاكس للحواف.',
      'تصنيع دروع تذكارية ولوحات استقبال بمسامير استيل ستاند أوف (Standoff) مقاومة للصدأ.',
    ],
    highlightsEn: [
      'Rigid luxury box production (1200 - 1800gsm greyboard) with magnetic closures and custom foam inserts.',
      'Laser etched 3mm to 12mm optical cast acrylic plaques powered by low-voltage ambient LED systems.',
      'Heavy 600gsm Italian cotton stationery debossed with German hot-foil and mirror gilded edge plating.',
      'Corporate architectural reception plaques with brushed stainless steel standoff wall spacers.',
    ],
    metrics: [
      { labelAr: 'طاقة إنتاج العلب يومياً', labelEn: 'Daily Box Production', value: '2,500 علبة' },
      { labelAr: 'متوسط وقت التجهيز للطلب', labelEn: 'Average Turnaround', value: '24 - 48 ساعة' },
      { labelAr: 'خيارات الخطوط العربية', labelEn: 'Calligraphy Font Styles', value: '5 خطوط ملكية' },
      { labelAr: 'ضمان جودة الخامات', labelEn: 'Material Warranty', value: '100% أصلي' },
    ],
    contentAr: `
### 📦 المسار الأول: طباعة وتفصيل علب الكرتون المقوى (Luxury Rigid Boxes)

تعتبر العبوة الفاخرة خط التماس الأول بين منتجك وعميلك. في نُون والقَلَم، نصمم العلب الصلبة (Rigid Boxes) باستخدام كرتون صناعي مضغوط (Greyboard) عالي الكثافة بأوزان تتراوح بين 1200 و 1800 غم/م²، مما يمنح الصندوق صلابة استثنائية وشعوراً فورياً بالهيبة.

- **خيارات الإغلاق:** إغلاق بكتاب مغناطيسي مخفي (Magnetic Book Style)، أو علبة قاعدة وغطاء منفصلين (Lid & Base).
- **الحشوات الداخلية:** تفصيل إسفنج EVA عالي الكثافة مقصوص بالليزر ليطابق تماماً مجسم منتجك (زجاجات عطور، ساعات، دروع، أو هدايا تقنية).
- **اللمسات الجمالية:** سلفان ناعم مطفي مخملي (Soft-Touch Velvet)، مع بصمة حرارية ذهبية، فضية، أو هولوغرامية تعكس الضوء ببراعة.

---

### 💡 المسار الثاني: لوحات ومجسمات الأكريليك المضيئة ثلاثية الأبعاد (3D LED)

نقوم بتصميم وتصنيع الدروع المضيئة التي تحول الخطوط الهندسية وشعارات المؤسسات إلى تجربة بصرية ساحرة. بفضل تقنية الإضاءة المحيطية وتوجيه أشعة LED عبر الحواف المصقولة، يضيء الحفر الليزري فقط في الظلام ليعطي إيحاءً ثلاثي الأبعاد مجسماً.

- قواعد خشبية أو بلاستيكية بيضاء وسوداء أنيقة تعمل بلمسة زر (Capacitive Touch).
- نظام طاقة مزدوج (USB أو بطاريات AA) لسهولة وضع الدرع على المكاتب أو في منصات الاستقبال.
- ألوان إضاءة متعددة: بنفسجي لافندر ملكي، أزرق سماوي طيراني، وأبيض دافئ مريح للأعين.

---

### 🏷️ المسار الثالث: كروت الأعمال القطنية الفاخرة والبصمة الحرارية

كارت العمل هو سفيرك الشخصي؛ لذلك نقدم كروت أعمال على ورق قطني طبيعي 100% بسماكة تبدأ من 600 غم/م²:
- حفر غائر ملموس (Letterpress & Blind Deboss).
- تذهيب الحواف يدوياً (Edge Gilding) بدرجات الذهب الملكي، الروز قولد، أو الأزرق السماوي.

---

### 🏆 المسار الرابع: دروع التكريم وهدايا المؤسسات

نبتكر حلول هدايا دعائية ومكتبية للشركات والوزارات، تشمل دروع الاستحقاق الكريستالية، مجموعات المكاتب الجلدية المحفورة، ولوحات الاستقبال الجدارية الكبيرة المزودة بمسامير ستاند أوف.
    `,
    contentEn: `
### 📦 Division 1: Luxury Rigid Packaging & Presentation Boxes

Your packaging creates the first tactile connection. We craft heavy-duty rigid boxes built with 1200-1800gsm high-density greyboard that exude structural weight and supreme elegance.
- Concealed magnetic book closures or classic lid-and-base setups.
- Custom CNC laser-cut high-density EVA foam inserts cradling perfumes, jewelry, or electronics.
- Soft-touch velvet lamination accentuated with Kurz German metallic foil debossing.

---

### 💡 Division 2: 3D Optical Illusion LED Acrylic Trophies & Lamps

Engineered using edge-lit physics, high-purity cast acrylic guides focused LED beams strictly through laser-etched facets, generating stunning floating 3D visuals.
- Touch-sensor base with rechargeable USB / AA dual power architecture.
- Curated color tones: Royal Violet Lavender, Sky Cyan Blue, and Warm 3000K Amber White.

---

### 🏷️ Division 3: Heavyweight Cotton Stationery & Hot Foil Letterpress

Tactile business cards crafted on 600gsm pure cotton card stock featuring deep letterpress impressions, tactile deboss, and hand-burnished mirror gilded edge finishes.

---

### 🏆 Division 4: Corporate Milestone Trophies & Reception Signage

Executive awards and architectural wall signs fabricated with brushed stainless steel hardware tailored for corporate headquarters, ministries, and landmark exhibitions.
    `,
    isActive: true,
    actionTextAr: 'طلب تسعير أو تصميم مخصص',
    actionTextEn: 'Request Custom Quotation',
    actionLink: 'contact',
  },
  {
    id: 'art-portfolio',
    sectionKey: 'portfolio',
    slug: 'our-portfolio',
    titleAr: 'معرض الأعمال المنفذة – إبداعات تم تنفيذها لنخبة الشركات والعملاء',
    titleEn: 'Executed Works Portfolio – Masterpieces Crafted for Leading Brands',
    subtitleAr: 'شاهد نماذج حقيقية لمشاريع حية ودروع استقبال وعلب فاخرة صُنعت بكل حب في ورشاتنا',
    subtitleEn: 'Explore real-world case studies of illuminated trophies, luxury boxes, and bespoke signage',
    categoryAr: 'سجل الإنجازات ودراسات الحالة',
    categoryEn: 'Case Studies & Production Archive',
    summaryAr: 'نفخر بكوننا الشريك المعتمد لأكثر من 500 شركة عراقية وعربية في تجهيز دروع تكريم المدراء، علب المنتجات الفاخرة، ولوحات الاستقبال المضيئة.',
    summaryEn: 'Trusted partner to over 500 regional corporations, luxury perfume houses, and airlines providing illuminated desk trophies, wall signage, and bespoke packaging.',
    coverImage: '/images/products/travel_agency_wall_front_1791817427540.jpg',
    galleryImages: [
      '/images/products/travel_agency_wall_front_1791817427540.jpg',
      '/images/products/travel_agency_desk_angle_1791817458937.jpg',
      '/images/products/led_acrylic_3d_angle_1791816316544.jpg',
      '/images/products/acrylic_led_persp_1791779739622.jpg',
    ],
    authorAr: 'فريق التوثيق ومعرض الأعمال – نُون والقَلَم',
    authorEn: 'Portfolio Curation Team – Noon & Pen',
    publishedDate: '2026-10-12',
    readTime: '5 دقائق قراءة',
    highlightsAr: [
      'دراسة حالة 1: تصنيع 150 درع طائرة ثلاثي الأبعاد مضيء لشركة الأفق الدولية للسياحة والطيران.',
      'دراسة حالة 2: تصميم 5,000 علبة عطور صلبة فاخرة لدار المسك الملكي مع حشوات مخملية وبصمة ذهبية.',
      'دراسة حالة 3: لوحات استقبال مضيئة لـ 12 فرعاً مصرفياً في بغداد وأربيل بمسامير استيل ضد الصدأ.',
      'دراسة حالة 4: كروت أعمال قطنية 700 غم مذهبة الحواف لمكاتب محاماة واستشارات كبرى.',
    ],
    highlightsEn: [
      'Case Study 1: 150 customized 3D Boeing airplane optical LED shields for Al-Ufoq International Travel.',
      'Case Study 2: 5,000 luxury rigid perfume boxes for Royal Musk House with velvet inserts and gold debossing.',
      'Case Study 3: Large architectural edge-lit acrylic signs for 12 bank branches across Baghdad and Erbil.',
      'Case Study 4: 700gsm duplex gilded cotton business cards for premier legal and architectural consultancies.',
    ],
    metrics: [
      { labelAr: 'مشروع مؤسسي منجز', labelEn: 'Completed Enterprise Projects', value: '450+' },
      { labelAr: 'شركات ووكالات معتمدة', labelEn: 'Corporate Partners', value: '520+' },
      { labelAr: 'معدل إعادة الطلب', labelEn: 'Re-order Rate', value: '88%' },
      { labelAr: 'صور ومشاريع موثقة', labelEn: 'Archived Case Studies', value: '1,200+' },
    ],
    contentAr: `
### ✈️ دراسة الحالة الأولى: درع طائرة الأفق ثلاثي الأبعاد المضيء (شركة سياحة وخطوط جوية)

**العميل:** شركة الأفق الدولية لخدمات السياحة والطيران – الكرادة، بغداد.  
**المتطلبات:** درع تذكاري استثنائي يُهدى لكبار الشخصيات والمسافرين الدائمين، يحمل شعار الشركة ورسمة هندسية ثلاثية الأبعاد لطائرة تجارية محاطة بأشهر معالم العالم.  
**الحل المقدم من نُون والقَلَم:**
- استخدام أكريليك كاست شفاف 5 مم نقي 100%.
- حفر ليزري متعدد الأعماق ليعطي تدرجاً ضوئياً للطائرة والمعالم السياحية.
- قاعدة دائرية بيضاء مزودة بزر لمس ذكي وإضاءة بنفسجية لافندر ناعمة، مع كابل USB وحجرة بطاريات.
- النتيجة: تم تسليم 150 قطعة خلال 48 ساعة مع تغليف هدايا مخملي فاخر حاز على إشادة الإدارة العامة.

---

### 🏨 دراسة الحالة الثانية: لوحات الاستقبال الجدارية المضيئة بمسامير الاستيل

**العميل:** سلسلة مراكز واستشارات طبية في بغداد والبصرة.  
**المتطلبات:** لوحة استقبال رئيسية كبيرة وواضحة نهاراً وتتوهج بوقار ليلاً مع حماية ضد الخدوش.  
**الحل المقدم:**
- ألواح أكريليك كاست صلب بسماكة 6 مم مع حواف مشطوفة بالألماس.
- إضاءة Edge-Lit محيطية بدرجة حرارة لون 4000K مريحة للعين.
- تثبيت بـ 4 مسامير استيل نافرة ستاند أوف (Standoff) مقاومة للصدأ والتآكل.

---

### 💼 دراسة الحالة الثالثة: علب عطور وهدايا VIP مقواة لدار المسك

**العميل:** دار المسك الملكي للعطور الشرقية.  
**المتطلبات:** علبة صلبة متينة تسع قنينة عطر كريستالية مع رول دهن عود وقفل مغناطيسي قوي.  
**الحل المقدم:**
- كرتون مقوى 1500 غم ملبس بورق ألماني مطفي بلمسة مخملية (Soft Touch).
- إسفنج ليزري EVA عالي الكثافة مفصل على شكل القنينة بالضبط مع تلبيس مخملي أسود.
- بصمة حرارية ذهبية عاكسة للشعار على الغلاف الخارجي والداخلي.
    `,
    contentEn: `
### ✈️ Case Study 1: The 3D Aviation Optical Shield (Al-Ufoq International)

**Client:** Al-Ufoq International Travel & Tourism – Karrada, Baghdad.  
**Objective:** A landmark corporate executive trophy commemorating VIP clients featuring a wireframe 3D aircraft floating above global architectural landmarks.  
**Execution:**
- 5mm virgin cast acrylic precision etched at varying depths for optical gradient depth.
- Touch sensor white circular base delivering ambient royal violet hue.
- 150 units fabricated and delivered in custom gift boxes within 48 hours.

---

### 🏨 Case Study 2: Architectural Edge-Lit Wall Plaque

**Client:** Elite Medical Consulting Network (Baghdad & Basra).  
**Objective:** High-visibility corporate reception entrance plaque that illuminates effortlessly.  
**Execution:**
- 6mm cast acrylic sheet diamond-edge beveled with perimeter 4000K clean white LEDs.
- 4x brushed heavy stainless steel standoff wall spacers for durable floating wall clearance.

---

### 💼 Case Study 3: Rigid Presentation Box Packaging (Royal Musk House)

**Client:** Royal Musk Perfume Atelier.  
**Objective:** Magnetic book-style gift boxes to securely cradle 100ml crystal flacons and pure oud oil.  
**Execution:**
- 1500gsm compressed greyboard wrapped in midnight velvet touch stock.
- Laser-milled EVA inner foam cut to exact bottle silhouette.
- Deep gold hot-foil deboss on exterior lid and inner silk ribbon pull.
    `,
    isActive: true,
    actionTextAr: 'تصفح جميع أعمالنا في المعرض',
    actionTextEn: 'View Full Project Gallery',
    actionLink: 'portfolio',
  },
  {
    id: 'art-custom-products',
    sectionKey: 'custom_products',
    slug: 'custom-products-engine',
    titleAr: 'منتجات مخصصة – تصاميم فريدة تروي قصتك بلمسة شخصية وحرفية مطلقة',
    titleEn: 'Custom Products – Bespoke Creations Tailored to Your Exact Vision',
    subtitleAr: 'محرك تخصيص رقمي متطور يمنحك كامل الحرية في اختيار النص، الخط، الحجم، والإضاءة',
    subtitleEn: 'Advanced live configurator giving you complete control over text, typography, size, and glow',
    categoryAr: 'محرك التخصيص والمواصفات',
    categoryEn: 'Customizer Engine & Specifications',
    summaryAr: 'كل منتج في نُون والقَلَم هو قطعة فريدة تصنع خصيصاً لأجلك؛ مع محرك التخصيص المباشر يمكنك تجربة خطوط عربية متعددة، معاينة الإضاءة، ورفع شعارك بدقة فائقة مع تسعير متدرج شفاف.',
    summaryEn: 'Every item at Noon & Pen is crafted to order. Our dynamic web engine allows real-time Arabic typography switching, illumination testing, vector logo uploads, and instant tiered volume pricing.',
    coverImage: '/images/products/led_acrylic_3d_angle_1791816316544.jpg',
    galleryImages: [
      '/images/products/led_acrylic_3d_angle_1791816316544.jpg',
      '/images/products/led_acrylic_3d_macro_1791816336153.jpg',
      '/images/products/led_acrylic_3d_side_1791816354524.jpg',
      '/images/products/acrylic_led_macro_1791779747734.jpg',
    ],
    authorAr: 'فريق تجربة المستخدم والتصنيع – نُون والقَلَم',
    authorEn: 'UX & Fabrication Engineering – Noon & Pen',
    publishedDate: '2026-10-12',
    readTime: '4 دقائق قراءة',
    highlightsAr: [
      'معاينة حية للنص العربي بالخطوط: الكوفي الملكي، الديواني، الرقعة، تجوال، والقاهرة.',
      'محاكاة واقعية لألوان الإضاءة (بنفسجي لافندر، أزرق سماوي، أبيض دافئ) مع توهج رقمي تفاعلي.',
      'نظام تسعير ديناميكي متدرج يخفض سعر القطعة بنسبة تصل إلى 50% للكميات والشركات.',
      'إمكانية رفع ملفات الشعارات بصيغ PNG, JPG, PDF مع تدقيق تلقائي لجاهزية الليزر.',
    ],
    highlightsEn: [
      'Live Arabic typography rendering across Kufi, Diwani, Ruq’ah, Tajawal, and Cairo fonts.',
      'Realistic illumination simulation for Royal Violet, Sky Blue, and Warm White tones.',
      'Tiered dynamic volume discounting dropping unit cost by up to 50% for bulk orders.',
      'Instant upload support for high-res PNG, JPG, and vector PDFs with laser prep checks.',
    ],
    metrics: [
      { labelAr: 'خيارات خطوط عربية مدعومة', labelEn: 'Supported Arabic Font Types', value: '5 خطوط حصرية' },
      { labelAr: 'أقصى نسبة خصم للكميات', labelEn: 'Maximum Bulk Discount', value: 'تصل إلى 50%' },
      { labelAr: 'وقت إنشاء البروفة الرقمية', labelEn: 'Proof Generation Time', value: 'فوري (أقل من ثانية)' },
      { labelAr: 'خيارات أحجام الألواح', labelEn: 'Available Panel Sizes', value: 'من 15 إلى 120 سم' },
    ],
    contentAr: `
### 🎨 كيف يعمل محرك التخصيص التفاعلي في نُون والقَلَم؟

لقد أعدنا ابتكار تجربة طلب الهدايا والدروع في العراق والمنطقة، مستبدلين المراسلات الطويلة بنظام برمجي فوري يسمح للعميل بتصميم ومطالعة طلبه لحظة بلحظة:

1. **إدخال النص المخصص:** اكتب اسم الشخص، العبارة التذكارية، أو اسم الشركة باللغة العربية أو الإنجليزية.
2. **اختيار الخط العربي:** يدعم نظامنا خطوطاً صممت لتبدو مذهلة تحت أشعة الليزر:
   - **الخط الكوفي الهندسي:** مثالي للشركات والشعارات الرسمية.
   - **الخط الديواني الشاعري:** الخيار الأفضل لإهداءات الزفاف، الخطوبة، والمناسبات الرومانسية.
   - **خط الرقعة التراثي:** أصيل وقوي ومثالي للتهاني والتكريم الأكاديمي.
   - **خط تجوال والقاهرة العصريين:** لمن يفضل البساطة الحديثة.
3. **اختيار المقاس والقاعدة:** اختر المقاس المناسب لمكتبك (من 15×15 سم حتى المقاسات الجدارية الكبرى 120×80 سم)، ونوع القاعدة (بيضاء تاتش، سوداء، أو خشبية فاخرة).
4. **رفع الشعار أو الرسم التوضيحي:** يمكنك سحب وإفلات ملف الشعار وسيقوم استوديو التصميم بمعايرته وتحويله إلى مسارات ليزرية متناسقة مجاناً قبل القص الفعلي.

---

### 💰 نظام الخصومات التراكمية للشركات والكميات

ندرك احتياج المؤسسات والمؤتمرات لطلب كميات كبيرة بأسعار تفضيلية؛ لذلك قمنا ببرمجة نظام تسعير متدرج:
- من 1 إلى 5 قطع: السعر القياسي الفردي.
- من 6 إلى 20 قطعة: خصم فوري 15%.
- أكثر من 21 قطعة: خصم هدايا ومؤتمرات يصل إلى 30% - 50%.
    `,
    contentEn: `
### 🎨 How Our Live Customization Engine Works

We replaced cumbersome back-and-forth messaging with a zero-friction interactive interface where you shape and preview your trophy in real time:

1. **Custom Text Input:** Enter names, milestone dates, or corporate mantras in Arabic or English.
2. **Arabic Font Curation:**
   - **Architectural Kufi:** Authoritative & structured for corporate titles.
   - **Romantic Diwani:** Flowing cursive elegance for weddings & romantic milestones.
   - **Heritage Ruq'ah:** Expressive traditional script for academic graduations.
   - **Geometric Tajawal & Cairo:** Clean modern aesthetics.
3. **Dimensions & Base Hardware:** Scale from compact desk sizes (15x15cm) up to flagship architectural signs (120x80cm).
4. **Instant Logo Vectors:** Upload corporate insignia in PNG, SVG, or PDF format with automated vector laser optimization.
    `,
    isActive: true,
    actionTextAr: 'ابدأ تجربة التخصيص المباشر',
    actionTextEn: 'Launch Live Customizer',
    actionLink: 'customizer',
  },
  {
    id: 'art-why-us',
    sectionKey: 'why_us',
    slug: 'why-noon-wal-qalam',
    titleAr: 'لماذا نون والقلم؟ – معايير الحرفية الذهبية والضمانات الملكية',
    titleEn: 'Why Noon & Pen? – Golden Craft Standards & Uncompromising Guarantees',
    subtitleAr: 'خمس ركائز هندسية جعلتنا الوجهة الأولى للطباعة الفاخرة والدروع في العراق',
    subtitleEn: 'Five engineering and service pillars that place us at the pinnacle of luxury production',
    categoryAr: 'معايير الجودة والضمانات',
    categoryEn: 'Quality Benchmarks & Guarantees',
    summaryAr: 'لا نتهاون أبداً في أدق التفاصيل؛ من دقة الليزر التي تصل إلى 0.2 ملم، إلى ألواح الأكريليك البكر 100%، والإضاءة التي تدوم 50,000 ساعة، مع بروفة ثلاثية الأبعاد مجانية وضمان استبدال ذهبي.',
    summaryEn: 'Zero compromises on craftsmanship: sub-millimeter 0.2mm laser cut tolerance, 100% virgin cast acrylic, 50,000-hour LED lifespan, free digital 3D proofing, and comprehensive replacement warranty.',
    coverImage: '/images/products/led_acrylic_3d_lifestyle_1791816373444.jpg',
    galleryImages: [
      '/images/products/led_acrylic_3d_lifestyle_1791816373444.jpg',
      '/images/products/led_acrylic_3d_macro_1791816336153.jpg',
      '/images/products/acrylic_led_side_1791779766214.jpg',
      '/images/products/travel_agency_desk_macro_1791817532418.jpg',
    ],
    authorAr: 'قسم ضمان الجودة والمعايرة – نُون والقَلَم',
    authorEn: 'Quality Assurance & Standards – Noon & Pen',
    publishedDate: '2026-10-12',
    readTime: '5 دقائق قراءة',
    highlightsAr: [
      'دقة قطع وحفر ليزري متناهية الصغر تصل إلى 0.2 مم، مما يمنع أي تشوه في الخطوط الدقيقة.',
      'أكريليك كاست نقي 100% مقاوم للخدش والأشعة فوق البنفسجية لا يصفر بمرور السنين.',
      'أنظمة إضاءة LED ذات كفاءة عالية A++ بعمر تشغيلي يفوق 50,000 ساعة متواصلة.',
      'ضمان الاستبدال الفوري الذهبي: في حال وجود أي خطأ مصنعي نستبدل القطعة مجاناً دون نقاش.',
    ],
    highlightsEn: [
      'Sub-millimeter 0.2mm laser CNC cutting ensuring razor-sharp serif and calligraphy edges.',
      '100% virgin optical cast acrylic, UV-stabilized to prevent yellowing or embrittlement over time.',
      'Grade A++ LED optical chips engineered for in excess of 50,000 continuous operating hours.',
      'Golden Replacement Guarantee: Instant no-hassle remake if any manufacturing flaw is detected.',
    ],
    metrics: [
      { labelAr: 'دقة التفاوت الليزري', labelEn: 'Laser Tolerance', value: '± 0.2 ملم' },
      { labelAr: 'عمر مصابيح LED', labelEn: 'LED Lifetime', value: '50,000 ساعة' },
      { labelAr: 'نسبة نقاء الأكريليك', labelEn: 'Acrylic Purity Grade', value: '100% كاست بكر' },
      { labelAr: 'معدل شكاوى الجودة', labelEn: 'Defect Return Rate', value: 'أقل من 0.1%' },
    ],
    contentAr: `
### 🔍 الركيزة الأولى: دقة تصنيع ميكرونية (0.2 mm)

تعتمد ورشاتنا أحدث وحدات الليزر الليفي وغاز ثاني أكسيد الكربون (CO2) المزودة بعدسات بصرية ألمانية فائقة التركيز. تتيح لنا هذه التكنولوجيا حفر أدق تفاصيل الشعارات والخرائط والمعالم السياحية دون ترك أي حواف محترقة أو ذوبان عشوائي، بل تكون الحواف ناصعة كالبلور المصقول.

---

### 💎 الركيزة الثانية: أكريليك كاست نقي 100% غير قابل للاصفرار

العديد من الورش التجارية تستخدم الأكريليك المبثوق (Extruded) أو المعاد تدويره لخفض التكاليف، مما يؤدي إلى بهتان المنتج واصفراره بعد بضعة أشهر. في **نُون والقَلَم** نلتزم حصرياً بالأكريليك الصب البكر (Virgin Cast Acrylic):
- نقاء ضوئي بنسبة 93% يتفوق على الزجاج العادي.
- صلابة سطحية عالية تقاوم الخدوش الطفيفة أثناء التنظيف.
- مقاومة كاملة لتغير اللون تحت إضاءة المكاتب والشمس غير المباشرة.

---

### ⚡ الركيزة الثالثة: إضاءة LED آمنة وباردة بعمر 50,000 ساعة

نستخدم شرائح LED دقيقة تم ضبط درجة حرارتها اللونية بعناية لتوفر إضاءة ناعمة ودافئة (Eye-Friendly) لا تزعج العين أثناء العمل المكتبي، وتستهلك أقل من 2 واط فقط مع حرارة معدومة تماماً، مما يجعلها آمنة للاستخدام المستمر في غرف النوم والمكاتب ومنازل الأطفال.

---

### 🛡️ الركيزة الرابعة: بروفة ثلاثية الأبعاد تفاعلية وضمان ذهبي

- **بروفة مجانية 100%:** لا نبدأ بقص أي لوح قبل أن يرى العميل بروفة واضحة ويوافق عليها.
- **الضمان الذهبي:** إن حدث أي عيب في النقل أو خطأ في النص خلافاً للبروفة المعتمدة، نتحمل تكلفة التصنيع الجديد والشحن بالكامل فوراً.
    `,
    contentEn: `
### 🔍 Pillar 1: Sub-Millimeter 0.2mm Precision Engineering

Our workshop operates industrial high-frequency laser cutting systems with precision optical collimators. This allows micro-scale vector lines, intricate coat-of-arms insignias, and sharp typographic terminals without burn marks or melted ridges.

---

### 💎 Pillar 2: 100% Virgin Cast Optical Acrylic

We reject cheap extruded or recycled plastics. Our plaques exclusively use virgin cell-cast acrylic offering 93% optical clarity surpassing standard window glass, coupled with high scratch resistance and decades of UV resistance.

---

### ⚡ Pillar 3: Safe, Energy-Efficient 50,000-Hour Ambient Illumination

Engineered with A++ rated LED chips drawing under 2 Watts with zero heat generation, providing pleasant diffused lighting suitable for 24/7 executive office ambiance.

---

### 🛡️ Pillar 4: Interactive Proofing & The Golden Warranty

Every order comes with a free digital review proof. If any fabrication defect occurs in transit, we guarantee a no-quibble instant replacement shipped to your doorstep.
    `,
    isActive: true,
    actionTextAr: 'تواصل لمعرفة المزيد عن ضماناتنا',
    actionTextEn: 'Learn More About Quality',
    actionLink: 'contact',
  },
  {
    id: 'art-contact',
    sectionKey: 'contact',
    slug: 'contact-and-consultation',
    titleAr: 'تواصل معنا – استشارات مجانية وفريق متخصص بخدمتك على مدار الساعة',
    titleEn: 'Contact Us – Free Design Consultations & 24/7 Dedicated Support',
    subtitleAr: 'يسعدنا استقبال استفساراتكم وزيارتكم في ورشتنا في بغداد، أو التواصل المباشر عبر واتساب',
    subtitleEn: 'We welcome your visits to our Baghdad atelier, or get in touch instantly via WhatsApp & phone',
    categoryAr: 'خدمة العملاء والاستشارات',
    categoryEn: 'Customer Concierge & Studio Visit',
    summaryAr: 'فريقنا من مهندسي التصميم وخبراء الخط العربي مستعدون لمساعدتك في اختيار أنسب خامة ودرع لمنتجك، مع خدمة طلب عينات للشركات وعروض أسعار رسمية فورية.',
    summaryEn: 'Our design engineers and calligraphy artisans are on hand to guide your project specifications, provide corporate prototype samples, and issue formal quotations.',
    coverImage: '/images/products/travel_agency_desk_front_1791817396012.jpg',
    galleryImages: [
      '/images/products/travel_agency_desk_front_1791817396012.jpg',
      '/images/products/travel_agency_wall_front_1791817427540.jpg',
      '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
      '/images/products/acrylic_led_front_1791779703517.jpg',
    ],
    authorAr: 'فريق خدمة العملاء والمبيعات – نُون والقَلَم',
    authorEn: 'Customer Success & Sales Desk – Noon & Pen',
    publishedDate: '2026-10-12',
    readTime: '3 دقائق قراءة',
    highlightsAr: [
      'استجابة سريعة عبر واتساب في أقل من 5 دقائق للطلبات والاستفسارات المستعجلة.',
      'إمكانية زيارة ورشة العمل في بغداد – المنصور لمشاهدة عينات حية من الأكريليك والعلب.',
      'تجهيز عروض أسعار وفواتير ضريبية رسمية للشركات والجهات الحكومية والمنظمات.',
      'شحن موثوق وسريع لجميع المحافظات العراقية الـ 18 عبر شبكة مناديب معتمدة.',
    ],
    highlightsEn: [
      'Sub-5 minute response time on our dedicated corporate WhatsApp concierge desk.',
      'Studio & workshop visits welcome in Baghdad (Al-Mansour) to touch and test live samples.',
      'Official company invoices and tax-compliant quotations prepared for corporate procurement.',
      'Secure, shockproof courier shipping across all 18 Iraqi governorates.',
    ],
    metrics: [
      { labelAr: 'متوسط وقت الرد على الرسائل', labelEn: 'Average Response Time', value: '< 5 دقائق' },
      { labelAr: 'ساعات العمل اليومية', labelEn: 'Operating Hours', value: '9:00 ص - 10:00 م' },
      { labelAr: 'أيام الخدمة أسبوعياً', labelEn: 'Weekly Availability', value: '7 أيام بالأسبوع' },
      { labelAr: 'سرعة إرسال البروفة', labelEn: 'Proof Delivery Speed', value: 'نفس اليوم' },
    ],
    contentAr: `
### 📍 كيف يمكنك التواصل معنا؟

في نُون والقَلَم نضع تجربة العميل وراحته على رأس أولوياتنا؛ لذا وفرنا قنوات اتصال متعددة ومباشرة تمكنك من الحصول على الإجابة أو عرض السعر في دقائق معدودة:

1. الدردشة الفورية عبر واتساب:
القناة الأكثر تفضيلاً وسرعة؛ يمكنك إرسال شعارك، فكرتك، أو استفسارك وسيتولى أحد مهندسي التصميم الرد عليك ومشاركتك بروفة مبدئية فوراً.
الرقم المباشر: +964 780 123 4567

2. الاتصال الهاتفي المباشر:
خدمة عملاء ودودة تجيب على كافة تساؤلاتكم حول الأسعار، مواعيد التجهيز، أو متابعة مسار الشحنات.
خطوط الهاتف: 0780 123 4567 / 0770 987 6543

3. زيارة ورشة العمل والاستوديو:
نرحب بمدراء المشتريات وممثلي الشركات والمؤسسات لزيارة مقرنا في بغداد، للاطلاع على كتالوج العينات الطبيعية من علب الكرتون الصلب، وألوان الأكريليك، وتأثيرات الإضاءة قبل توقيع عقود التوريد.
العنوان: بغداد، المنصور، تقاطع الرواد، مجمع نُون والقَلَم للطباعة الفاخرة.

---

### ⏱️ أوقات العمل والشحن

- أوقات الورشة والمكتب: يومياً من السبت إلى الخميس، من الساعة 9:00 صباحاً حتى 10:00 مساءً. (الجمعة: استجابة عبر واتساب فقط من 2:00 ظهراً إلى 10:00 مساءً).
- التوصيل داخل بغداد: خلال 24 ساعة من اعتماد البروفة.
- الشحن للمحافظات: خلال 48 ساعة لباب منزلك أو مقر شركتك في أربيل، البصرة، النجف، كربلاء، السليمانية، والموصل وكافة المدن.
    `,
    contentEn: `
### 📍 Direct Channels of Communication

At Noon & Pen, seamless communication is paramount. We provide several responsive channels to help bring your ideas to life:

1. Direct WhatsApp Concierge:
Our quickest channel. Share your vector logos, custom ideas, or queries to receive immediate digital simulations and quotes.
Direct WhatsApp: +964 780 123 4567

2. Direct Telephone Inquiries:
Speak directly to our project managers for corporate consultations.
Phone Lines: +964 780 123 4567 / +964 770 987 6543

3. Studio & Workshop Visits:
We welcome corporate procurement officers and private clients to inspect our physical material archive in Baghdad.
Address: Al-Mansour, Al-Rowad Intersection, Baghdad, Iraq.

---

### ⏱️ Operating Hours & Delivery Logistics

- Workshop Hours: Saturday through Thursday, 9:00 AM – 10:00 PM. (Friday: WhatsApp digital concierge from 2:00 PM – 10:00 PM).
- Baghdad Express Delivery: Within 24 hours from digital proof approval.
- Governorate Shipping: 48-hour delivery across all 18 Iraqi cities.
    `,
    isActive: true,
    actionTextAr: 'بدء محادثة واتساب الآن',
    actionTextEn: 'Chat on WhatsApp',
    actionLink: 'whatsapp',
  },
];

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      articles: INITIAL_CMS_ARTICLES,
      selectedArticleId: null,

      setSelectedArticleId: (id) => set({ selectedArticleId: id }),

      getArticleBySection: (sectionKey) => {
        return get().articles.find((a) => a.sectionKey === sectionKey && a.isActive);
      },

      getArticleById: (id) => {
        return get().articles.find((a) => a.id === id);
      },

      addArticle: (articleData) => {
        const newArticle: CMSArticle = {
          ...articleData,
          id: `art-${Date.now()}`,
        };
        set((state) => ({
          articles: [newArticle, ...state.articles],
        }));
      },

      updateArticle: (id, updated) => {
        set((state) => ({
          articles: state.articles.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          ),
        }));
      },

      deleteArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((item) => item.id !== id),
        }));
      },

      toggleArticleActive: (id) => {
        set((state) => ({
          articles: state.articles.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          ),
        }));
      },

      resetToDefaults: () => {
        set({ articles: INITIAL_CMS_ARTICLES });
      },
    }),
    {
      name: 'noon-walqalam-cms-content-v3',
    }
  )
);
