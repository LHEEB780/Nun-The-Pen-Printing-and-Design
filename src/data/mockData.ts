export interface DimensionOption {
  id: string;
  labelAr: string;
  labelEn: string;
  multiplier: number;
  widthCm: number;
  heightCm: number;
}

export interface MaterialOption {
  id: string;
  labelAr: string;
  labelEn: string;
  priceAdd: number;
  descriptionAr?: string;
  descriptionEn?: string;
}

export interface LedOption {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  glowClass: string;
}

export interface SpecificationItem {
  keyAr: string;
  keyEn: string;
  valAr: string;
  valEn: string;
}

export interface TierPricingItem {
  minQty: number;
  maxQty?: number;
  discountPercent: number;
  labelAr: string;
  labelEn: string;
}

export interface FontOption {
  id: string;
  nameAr: string;
  nameEn: string;
  fontFamily: string;
  previewTextAr: string;
  previewTextEn: string;
}

export interface PortfolioItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'led' | 'boxes' | 'cards' | 'portraits' | 'weddings';
  clientAr: string;
  clientEn: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  dimensions: string;
  materialsAr: string;
  materialsEn: string;
  featured: boolean;
  relatedProductId?: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  category: 'led' | 'boxes' | 'cards' | 'portraits' | 'weddings';
  categoryLabelAr: string;
  categoryLabelEn: string;
  basePrice: number; // in Iraqi Dinar (IQD)
  basePriceUSD?: number; // Base price in USD (e.g., $20)
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  galleryImages: string[];
  featuresAr: string[];
  featuresEn: string[];
  specifications: SpecificationItem[];
  dimensions: DimensionOption[];
  materials: MaterialOption[];
  ledOptions?: LedOption[];
  fontOptions?: FontOption[];
  tierPricing: TierPricingItem[];
  requiresCustomText: boolean;
  requiresLogoUpload: boolean;
  minQuantity: number;
  leadTimeAr: string;
  leadTimeEn: string;
  // specialized options
  paperTypes?: Array<{ id: string; labelAr: string; labelEn: string; priceAdd: number; gsm: number }>;
  foilFinishes?: Array<{ id: string; labelAr: string; labelEn: string; priceAdd: number; hex: string }>;
  boxStyles?: Array<{ id: string; labelAr: string; labelEn: string; priceAdd: number }>;
  boxInserts?: Array<{ id: string; labelAr: string; labelEn: string; priceAdd: number }>;
  standTypes?: Array<{ id: string; labelAr: string; labelEn: string; priceAdd: number }>;
  portraitStyles?: Array<{ id: string; labelAr: string; labelEn: string; priceAdd: number }>;
}

export const ARABIC_FONTS: FontOption[] = [
  { id: 'cairo', nameAr: 'خط كلاسيكي عصري (Cairo)', nameEn: 'Modern Cairo Sans', fontFamily: "'Cairo', sans-serif", previewTextAr: 'نُون والقَلَم للطباعة', previewTextEn: 'Noon & Pen Design' },
  { id: 'tajawal', nameAr: 'خط تجوال هندسي (Tajawal)', nameEn: 'Geometric Tajawal', fontFamily: "'Tajawal', sans-serif", previewTextAr: 'إبداع بلا حدود', previewTextEn: 'Limitless Creativity' },
  { id: 'thuluth', nameAr: 'الخط الكوفي الملكي (Kufi)', nameEn: 'Architectural Kufi', fontFamily: "'Cairo', sans-serif", previewTextAr: 'شركة الأفق الدولية', previewTextEn: 'Al-Ufoq International' },
  { id: 'diwani', nameAr: 'الخط الديواني الشاعري (Diwani)', nameEn: 'Romantic Diwani Script', fontFamily: "'Tajawal', cursive", previewTextAr: 'أحمد ونور · ٢٠٢٦', previewTextEn: 'Ahmad & Noor 2026' },
  { id: 'ruqah', nameAr: 'خط الرقعة التراثي (Ruq’ah)', nameEn: 'Heritage Ruq’ah', fontFamily: "'Cairo', serif", previewTextAr: 'مبروك التخرج دكتور', previewTextEn: 'Dr. Congratulations' },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'prod-acrylic-led-sign',
    slug: 'acrylic-led-sign',
    titleAr: 'لوحة أكريليك مضيئة LED',
    titleEn: 'Acrylic LED Sign',
    category: 'led',
    categoryLabelAr: 'لوحات ومجسمات LED',
    categoryLabelEn: 'LED Signs',
    basePrice: 26000,
    basePriceUSD: 20,
    descriptionAr: 'لوحة أكريليك مخصصة بنظام إضاءة LED متطور وحفر ليزري دقيق عالي الوضوح. خيار مثالي للمكاتب، غرف النوم، الهدايا، وشعارات المشاريع.',
    descriptionEn: 'Custom engraved acrylic LED sign featuring high-grade optical clarity, vibrant illumination tones, and premium laser contouring.',
    image: '/images/products/acrylic_led_front_1791779703517.jpg',
    galleryImages: [
      '/images/products/acrylic_led_front_1791779703517.jpg',
      '/images/products/acrylic_led_angle_1791779718594.jpg',
      '/images/products/acrylic_led_persp_1791779739622.jpg',
      '/images/products/acrylic_led_macro_1791779747734.jpg',
      '/images/products/acrylic_led_side_1791779766214.jpg',
      '/images/products/acrylic_led_lifestyle_1791779775892.jpg',
    ],
    featuresAr: [
      'أكريليك كاست نقي 100% سماكة 4 مم غير قابل للاصفرار',
      'خيارات ألوان إضاءة متعددة: أزرق سماوي، بنفسجي لافندر، وأبيض دافئ',
      'تسعير ديناميكي متدرج حسب الكمية يبدأ من 20$ ويصل إلى 10$',
      'كابل طاقة USB متوافق مع كافة الشواحن والباوربانك',
    ],
    featuresEn: [
      '100% virgin optical-grade cast acrylic (4mm)',
      'Multiple LED glow choices: Sky Blue, Light Purple, Warm White',
      'Tiered quantity discounting dropping down to $10/unit',
      'Standard 5V USB connection compatible with phone adapters',
    ],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'أكريليك كاست ليزري نقي 4 ملم', valEn: '4mm High-Clarity Optical Cast Acrylic' },
      { keyAr: 'المقاسات المتاحة', keyEn: 'Available Sizes', valAr: '15×15 سم، 20×20 سم، 30×30 سم', valEn: '15x15cm, 20x20cm, 30x30cm' },
      { keyAr: 'ألوان الإضاءة', keyEn: 'LED Colors', valAr: 'أزرق سماوي، بنفسجي لافندر، أبيض دافئ', valEn: 'Sky Blue, Light Purple, Warm White' },
      { keyAr: 'نظام الطاقة', keyEn: 'Power System', valAr: 'USB 5V مع كابل مدمج بطول 1.2 متر', valEn: '5V USB with 1.2m Cable' },
      { keyAr: 'ملفات الشعار المقبولة', keyEn: 'Accepted Files', valAr: 'JPG, PNG, PDF بدقة عالية', valEn: '.jpg, .png, .pdf format' },
      { keyAr: 'الحد الأقصى للنص', keyEn: 'Max Text Length', valAr: '50 حرفاً كحد أقصى', valEn: 'Max 50 characters' },
    ],
    dimensions: [
      { id: 'dim-15x15', labelAr: '15 × 15 سم (15x15cm)', labelEn: '15x15cm', multiplier: 1.0, widthCm: 15, heightCm: 15 },
      { id: 'dim-20x20', labelAr: '20 × 20 سم (20x20cm)', labelEn: '20x20cm', multiplier: 1.0, widthCm: 20, heightCm: 20 },
      { id: 'dim-30x30', labelAr: '30 × 30 سم (30x30cm - إضافة 5$)', labelEn: '30x30cm (+$5 extra)', multiplier: 1.25, widthCm: 30, heightCm: 30 },
    ],
    materials: [
      { id: 'mat-acrylic-standard', labelAr: 'أكريليك كاست شفاف نقي', labelEn: 'Optical Clear Cast Acrylic', priceAdd: 0 },
      { id: 'mat-acrylic-frosted', labelAr: 'أكريليك مثلج فاخر (Frosted)', labelEn: 'Premium Frosted Finish', priceAdd: 3000 },
    ],
    ledOptions: [
      { id: 'led-sky', nameAr: 'أزرق سماوي', nameEn: 'Sky Blue', hex: '#38bdf8', glowClass: 'shadow-[0_0_30px_rgba(56,189,248,0.5)]' },
      { id: 'led-snow', nameAr: 'أبيض ثلجي', nameEn: 'Snow White', hex: '#f8fafc', glowClass: 'shadow-[0_0_30px_rgba(248,250,252,0.6)]' },
      { id: 'led-warm', nameAr: 'أبيض دافئ', nameEn: 'Warm White', hex: '#fef08a', glowClass: 'shadow-[0_0_30px_rgba(254,240,138,0.5)]' },
      { id: 'led-purple', nameAr: 'بنفسجي ملكي', nameEn: 'Royal Violet', hex: '#c084fc', glowClass: 'shadow-[0_0_30px_rgba(192,132,252,0.5)]' },
      { id: 'led-emerald', nameAr: 'أخضر زمردي', nameEn: 'Emerald Green', hex: '#34d399', glowClass: 'shadow-[0_0_30px_rgba(52,211,153,0.5)]' },
    ],
    fontOptions: ARABIC_FONTS,
    tierPricing: [
      { minQty: 1, maxQty: 10, discountPercent: 0, labelAr: '1 - 10 قطع: 20$ للقطعة', labelEn: '1 - 10 pcs: $20 / pc' },
      { minQty: 11, maxQty: 50, discountPercent: 25, labelAr: '11 - 50 قطعة: 15$ للقطعة (توفير 25%)', labelEn: '11 - 50 pcs: $15 / pc (25% off)' },
      { minQty: 51, discountPercent: 50, labelAr: 'أكثر من 50 قطعة: 10$ للقطعة (توفير 50%)', labelEn: '> 50 pcs: $10 / pc (50% off)' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 1,
    leadTimeAr: '24 - 48 ساعة للتجهيز',
    leadTimeEn: '24 - 48 Hours Turnaround',
  },
  {
    id: 'prod-airplane-led',
    slug: '3d-led-airplane-lamp',
    titleAr: 'درع 3D LED مكتبي',
    titleEn: 'Executive 3D LED Desk Lamp',
    category: 'led',
    categoryLabelAr: 'دروع وإضاءة 3D LED',
    categoryLabelEn: '3D LED Lamps & Trophies',
    basePrice: 32000,
    basePriceUSD: 24.62,
    descriptionAr: 'أضف لمسة من الفخامة والاحترافية لمكتبك أو شركتك مع درع الأكريليك المضيء بتقنية 3D LED. تصميم عصري وجذاب يعكس هويتك التجارية بأرقى صورة، وينير مساحتك بإضاءة هادئة ومميزة.',
    descriptionEn: 'Add a touch of prestige and distinction to your executive desk or corporate headquarters with this bespoke 3D LED optical acrylic plaque. Crisp laser etching illuminated with ambient violet glow.',
    image: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
    galleryImages: [
      '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
      '/images/products/led_acrylic_3d_angle_1791816316544.jpg',
      '/images/products/led_acrylic_3d_macro_1791816336153.jpg',
      '/images/products/led_acrylic_3d_side_1791816354524.jpg',
      '/images/products/led_acrylic_3d_lifestyle_1791816373444.jpg',
    ],
    featuresAr: [
      'حفر ليزري عالي الدقة: حفر دقيق وواضح للشعارات، النصوص، والتفاصيل المجهزة بخطوط وتصاميم ثلاثية الأبعاد (مثل الطائرة والمعالم السياحية) لضمان مظهراً احترافياً وأنيقاً.',
      'إضاءة LED ساحرة: إضاءة بنفسجية ناعمة وموفرة للطاقة تبرز النقوش ثلاثية الأبعاد وتضفي جوًا راقيًا في الظلام أو الإضاءة الخافتة.',
      'قاعدة أنيقة وعملية: قاعدة دائرية متينة باللون الأبيض مزودة بزر لمس (Touch) لسهولة التشغيل والإطفاء.',
      'مصنوع من أكريليك نقي: أكريليك شفاف عالي الجودة ومقاوم للخدش والكسر مع حواف مصقولة بدقة.',
      'متعدد الاستخدامات: مثالي للوضع على مكاتب الاستقبال، المكاتب الإدارية، كهدية دعائية فاخرة للعملاء والشركاء، أو كديكور مضيء في المعارض والمؤتمرات.',
      'تخصيص كامل: إمكانية حفر أي شعار، بيانات اتصال، أو تفاصيل خاصة بشركتك وفقًا لطلبك.',
    ],
    featuresEn: [
      'High-Precision Laser Etching: Ultra-sharp engraving for custom logos, typography, and optical wireframes.',
      'Mesmerizing Ambient LED: Soft purple/violet energy-efficient lighting that accentuates 3D contours in low light.',
      'Modern Circular Touch Base: High-durability circular ABS base with intuitive capacitive touch sensor.',
      'Pure Optical-Grade Acrylic: High clarity scratch-resistant virgin cast acrylic with diamond-polished bevels.',
      'Versatile Applications: Perfect for executive desks, luxury promotional corporate gifts, and exhibition awards.',
      'Full Customization: Engrave your company logo, contact information, dedication, and custom serial numbering.',
    ],
    specifications: [
      { keyAr: 'المادة المصنعة', keyEn: 'Material', valAr: 'أكريليك ممتاز شفاف 5 ملم + قاعدة بلاستيكية بيضاء مقاومة للصدمات', valEn: '5mm Optical Virgin Cast Acrylic + High-Durability ABS Touch Base' },
      { keyAr: 'نوع الإضاءة', keyEn: 'Lighting Type', valAr: 'LED اقتصادية وطويلة العمر (أكثر من 50,000 ساعة عمل)', valEn: 'Energy-Efficient Long-Life Edge LED (>50,000 hrs)' },
      { keyAr: 'طريقة التشغيل', keyEn: 'Control Method', valAr: 'زر لمس ذكي سريع الاستجابة (Capacitive Touch) على القاعدة', valEn: 'Instant Responsive Capacitive Touch Sensor' },
      { keyAr: 'مصدر الطاقة', keyEn: 'Power Source', valAr: 'يعمل عبر كابل USB أو بطاريات AA مدمجة', valEn: 'Dual Powered: USB 5V Cable or AA Battery Compartment' },
      { keyAr: 'محتويات العبوة', keyEn: 'Package Contents', valAr: 'لوح الأكريليك المحفور + القاعدة المضيئة التاتش + كابل توصيل USB أصلي + علبة هدايا فاخرة', valEn: 'Custom Engraved Acrylic Plate + Touch Base + USB Cable + Gift Box' },
      { keyAr: 'الأبعاد التقريبية', keyEn: 'Approx. Dimensions', valAr: 'الارتفاع: 22 سم | العرض: 19 سم | قطر القاعدة: 10 سم | سماكة اللوح: 5 مم', valEn: 'Height: 22cm | Width: 19cm | Base Dia: 10cm | Thickness: 5mm' },
      { keyAr: 'ألوان الإضاءة المتوفرة', keyEn: 'Illumination Colors', valAr: 'بنفسجي لافندر ملكي، أزرق سماوي ناصع، أبيض دافئ هادئ', valEn: 'Royal Violet Lavender, Sky Cyan Blue, Warm Ambient White' },
    ],
    dimensions: [
      { id: 'dim-std-desk', labelAr: 'المقاس المكتبي القياسي (22 × 19 سم)', labelEn: 'Executive Desk Standard (22 × 19 cm)', multiplier: 1.0, widthCm: 19, heightCm: 22 },
      { id: 'dim-compact', labelAr: 'مقاس مكتبي مدمج (18 × 15 سم)', labelEn: 'Compact Desk Edition (18 × 15 cm)', multiplier: 0.85, widthCm: 15, heightCm: 18 },
      { id: 'dim-deluxe', labelAr: 'مقاس درع تذكاري كبير فاخر (28 × 24 سم)', labelEn: 'Deluxe Corporate Trophy (28 × 24 cm)', multiplier: 1.4, widthCm: 24, heightCm: 28 },
    ],
    materials: [
      { id: 'mat-white-touch', labelAr: 'قاعدة بيضاء دائرية مع زر لمس (Touch) ومنفذ USB', labelEn: 'Circular White Base with Touch Sensor & USB', priceAdd: 0 },
      { id: 'mat-black-touch', labelAr: 'قاعدة سوداء مطفية مع زر لمس (Touch) ومنفذ USB', labelEn: 'Matte Black Base with Touch Sensor & USB', priceAdd: 2000 },
      { id: 'mat-wood-grain', labelAr: 'قاعدة خشبية بيضاوية فاخرة مع إضاءة محيطية', labelEn: 'Luxury Wood-Grain Base with Ambient Glow', priceAdd: 5000 },
    ],
    ledOptions: [
      { id: 'led-sky', nameAr: 'أزرق سماوي', nameEn: 'Sky Blue', hex: '#38bdf8', glowClass: 'shadow-[0_0_35px_rgba(56,189,248,0.5)]' },
      { id: 'led-snow', nameAr: 'أبيض ثلجي', nameEn: 'Snow White', hex: '#f8fafc', glowClass: 'shadow-[0_0_35px_rgba(248,250,252,0.6)]' },
      { id: 'led-warm', nameAr: 'أبيض دافئ', nameEn: 'Warm White', hex: '#fef08a', glowClass: 'shadow-[0_0_35px_rgba(254,240,138,0.5)]' },
      { id: 'led-purple', nameAr: 'بنفسجي ملكي', nameEn: 'Royal Violet', hex: '#c084fc', glowClass: 'shadow-[0_0_35px_rgba(192,132,252,0.6)]' },
      { id: 'led-emerald', nameAr: 'أخضر زمردي', nameEn: 'Emerald Green', hex: '#34d399', glowClass: 'shadow-[0_0_35px_rgba(52,211,153,0.5)]' },
    ],
    fontOptions: ARABIC_FONTS,
    tierPricing: [
      { minQty: 1, maxQty: 5, discountPercent: 0, labelAr: '1 - 5 قطع: 24$ (32,000 د.ع)', labelEn: '1 - 5 pcs: $24 / pc' },
      { minQty: 6, maxQty: 20, discountPercent: 15, labelAr: '6 - 20 قطعة: خصم شركات 15%', labelEn: '6 - 20 pcs: 15% Corporate Discount' },
      { minQty: 21, discountPercent: 30, labelAr: '21+ قطعة: خصم هدايا ومؤتمرات 30%', labelEn: '21+ pcs: 30% Volume Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 1,
    leadTimeAr: '24 - 48 ساعة للتجهيز مع بروفة تصميم مجانية',
    leadTimeEn: '24 - 48 Hours Turnaround with Free Digital Proof',
  },
  {
    id: 'prod-3d-led-acrylic-shield',
    slug: '3d-led-acrylic-shield',
    titleAr: 'درع 3D LED هدايا',
    titleEn: '3D LED Acrylic Shield',
    category: 'led',
    categoryLabelAr: 'دروع وإضاءة 3D LED',
    categoryLabelEn: '3D LED Acrylic Shields',
    basePrice: 32000,
    basePriceUSD: 24.62,
    descriptionAr: 'أضف لمسة من الفخامة والاحترافية لمكتبك أو شركتك مع درع الأكريليك المضيء بتقنية 3D LED. تصميم عصري وجذاب يعكس هويتك التجارية بأرقى صورة، وينير مساحتك بإضاءة هادئة ومميزة.',
    descriptionEn: 'Custom 3D LED Acrylic Shield designed for corporate desks, luxury awards, and executive offices. Featuring crystal-clear laser engraving with multi-angle illumination.',
    image: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
    galleryImages: [
      '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
      '/images/products/led_acrylic_3d_angle_1791816316544.jpg',
      '/images/products/led_acrylic_3d_macro_1791816336153.jpg',
      '/images/products/led_acrylic_3d_side_1791816354524.jpg',
      '/images/products/led_acrylic_3d_lifestyle_1791816373444.jpg',
    ],
    featuresAr: [
      'حفر ليزري عالي الدقة: حفر دقيق وواضح للشعارات والنصوص والتفاصيل ثلاثية الأبعاد لضمان مظهر احترافي وأنيق.',
      'إضاءة LED ساحرة: إضاءة بنفسجية ناعمة وموفرة للطاقة تبرز النقوش ثلاثية الأبعاد وتضفي جوًا راقيًا في الظلام.',
      'قاعدة أنيقة وعملية: قاعدة دائرية متينة باللون الأبيض مزودة بزر لمس (Touch) لسهولة التشغيل والإطفاء.',
      'مصنوع من أكريليك نقي: أكريليك شفاف عالي الجودة ومقاوم للخدش والكسر مع حواف مصقولة بدقة.',
      'متعدد الاستخدامات: مثالي لمكاتب الاستقبال، المكاتب الإدارية، كهدية دعائية فاخرة للعملاء والشركاء.',
      'تخصيص كامل: إمكانية حفر أي شعار أو بيانات اتصال أو تفاصيل خاصة بشركتك وفقًا لطلبك.',
    ],
    featuresEn: [
      'High-Precision Laser Etching: Crisp lines and bespoke typography on 5mm optical cast acrylic.',
      'Enchanting 3D LED Glow: Ambient purple/violet, cyan, or warm illumination highlighting depth perception.',
      'Smart Touch Base: Circular ABS base featuring a responsive capacitive touch switch and USB/battery dual power.',
      'Optical Grade Scratch-Resistant Acrylic: Diamond-polished edges with ultra-high transparency.',
      'Corporate & Executive Versatility: Ideal for corporate branding, executive trophies, and client appreciation awards.',
      'Fully Customizable: Personalize with company logos, names, dates, or bespoke illustrations.',
    ],
    specifications: [
      { keyAr: 'المادة المصنعة', keyEn: 'Material', valAr: 'أكريليك ممتاز شفاف 5 ملم + قاعدة بلاستيكية بيضاء متينة', valEn: '5mm Optical Virgin Cast Acrylic + White ABS Touch Base' },
      { keyAr: 'نوع الإضاءة', keyEn: 'Lighting Type', valAr: 'LED اقتصادية وطويلة العمر (أكثر من 50,000 ساعة عمل)', valEn: 'Long-life Energy-Efficient LED (>50,000 Hours)' },
      { keyAr: 'طريقة التشغيل', keyEn: 'Control Method', valAr: 'زر لمس ذكي سريع الاستجابة (Touch) على القاعدة', valEn: 'Capacitive Quick-Touch Button on Base' },
      { keyAr: 'مصدر الطاقة', keyEn: 'Power Source', valAr: 'يعمل عبر كابل USB أو بطاريات AA', valEn: 'Dual Mode: 5V USB Cable or AA Batteries' },
      { keyAr: 'محتويات العبوة', keyEn: 'Package Contents', valAr: 'لوح الأكريليك المحفور + القاعدة المضيئة + كابل USB أصلي + علبة هدايا فاخرة', valEn: 'Custom Acrylic Shield Plate + LED Touch Base + USB Cable + Gift Box' },
      { keyAr: 'الأبعاد التقريبية', keyEn: 'Approx. Dimensions', valAr: 'الارتفاع: 22 سم | العرض: 19 سم | قطر القاعدة: 10 سم | سماكة اللوح: 5 مم', valEn: 'Height: 22cm | Width: 19cm | Base Dia: 10cm | Thickness: 5mm' },
    ],
    dimensions: [
      { id: 'dim-std-desk', labelAr: 'المقاس المكتبي القياسي (22 × 19 سم)', labelEn: 'Executive Desk Standard (22 × 19 cm)', multiplier: 1.0, widthCm: 19, heightCm: 22 },
      { id: 'dim-compact', labelAr: 'مقاس مكتبي مدمج (18 × 15 سم)', labelEn: 'Compact Edition (18 × 15 cm)', multiplier: 0.85, widthCm: 15, heightCm: 18 },
      { id: 'dim-deluxe', labelAr: 'مقاس درع تذكاري كبير فاخر (28 × 24 سم)', labelEn: 'Deluxe Trophy (28 × 24 cm)', multiplier: 1.4, widthCm: 24, heightCm: 28 },
    ],
    materials: [
      { id: 'mat-white-touch', labelAr: 'قاعدة بيضاء دائرية مع زر لمس (Touch) ومنفذ USB', labelEn: 'Circular White Base with Touch Sensor & USB', priceAdd: 0 },
      { id: 'mat-black-touch', labelAr: 'قاعدة سوداء مطفية مع زر لمس (Touch) ومنفذ USB', labelEn: 'Matte Black Base with Touch Sensor & USB', priceAdd: 2000 },
      { id: 'mat-wood-grain', labelAr: 'قاعدة خشبية بيضاوية فاخرة مع إضاءة محيطية', labelEn: 'Luxury Wood-Grain Base with Ambient Glow', priceAdd: 5000 },
    ],
    ledOptions: [
      { id: 'led-sky', nameAr: 'أزرق سماوي', nameEn: 'Sky Blue', hex: '#38bdf8', glowClass: 'shadow-[0_0_35px_rgba(56,189,248,0.5)]' },
      { id: 'led-snow', nameAr: 'أبيض ثلجي', nameEn: 'Snow White', hex: '#f8fafc', glowClass: 'shadow-[0_0_35px_rgba(248,250,252,0.6)]' },
      { id: 'led-warm', nameAr: 'أبيض دافئ', nameEn: 'Warm White', hex: '#fef08a', glowClass: 'shadow-[0_0_35px_rgba(254,240,138,0.5)]' },
      { id: 'led-purple', nameAr: 'بنفسجي ملكي', nameEn: 'Royal Violet', hex: '#c084fc', glowClass: 'shadow-[0_0_35px_rgba(192,132,252,0.6)]' },
      { id: 'led-emerald', nameAr: 'أخضر زمردي', nameEn: 'Emerald Green', hex: '#34d399', glowClass: 'shadow-[0_0_35px_rgba(52,211,153,0.5)]' },
    ],
    fontOptions: ARABIC_FONTS,
    tierPricing: [
      { minQty: 1, maxQty: 5, discountPercent: 0, labelAr: '1 - 5 قطع: 24$ (32,000 د.ع)', labelEn: '1 - 5 pcs: $24 / pc' },
      { minQty: 6, maxQty: 20, discountPercent: 15, labelAr: '6 - 20 قطعة: خصم شركات 15%', labelEn: '6 - 20 pcs: 15% Corporate Discount' },
      { minQty: 21, discountPercent: 30, labelAr: '21+ قطعة: خصم هدايا ومؤتمرات 30%', labelEn: '21+ pcs: 30% Volume Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 1,
    leadTimeAr: '24 - 48 ساعة للتجهيز مع بروفة تصميم مجانية',
    leadTimeEn: '24 - 48 Hours Turnaround with Free Digital Proof',
  },
  {
    id: 'prod-travel-acrylic-sign',
    slug: 'travel-agency-acrylic-sign',
    titleAr: 'لوحة أكريليك للمكاتب',
    titleEn: 'Edge-Lit Office Sign',
    category: 'led',
    categoryLabelAr: 'لوحات مكاتب وشركات',
    categoryLabelEn: 'Commercial Signage',
    basePrice: 65000,
    descriptionAr: 'لوحة استقبال فاخرة مخصصة لشركات السفر، العيادات، والمكاتب الاستشارية بتفريغ شعار المؤسسة وقص دقيق مع إطار إضاءة محيطي أنيق.',
    descriptionEn: 'Executive reception plaque tailored for travel agencies, clinics, and modern offices. Laser cut with perimeter LED halo effect.',
    image: '/images/products/travel_agency_desk_front_1791817396012.jpg',
    galleryImages: [
      '/images/products/travel_agency_desk_front_1791817396012.jpg',
      '/images/products/travel_agency_desk_angle_1791817458937.jpg',
      '/images/products/travel_agency_wall_front_1791817427540.jpg',
      '/images/products/travel_agency_wall_angle_1791817499977.jpg',
      '/images/products/travel_agency_desk_macro_1791817532418.jpg',
    ],
    featuresAr: ['تثبيت جداري فخم بمسامير استيل نحاسية أو فضية نافرة', 'شعار الشركة بألوان UV بارزة أو حفر بالليزر عالي الدقة', 'محول كهربائي 12V مع عزل كامل ومفتاح تحكم', 'أكريليك سميك 6 ملم مقاوم للكسر'],
    featuresEn: ['Brushed stainless steel standoff wall spacers', 'Multi-layer high-density UV ink or precision laser etching', 'Heavy-duty certified 12V adapter with thermal protection', 'Heavy-duty 6mm impact-resistant acrylic plate'],
    specifications: [
      { keyAr: 'الخامة الأساسية', keyEn: 'Primary Substrate', valAr: 'أكريليك كاست صلب 6 ملم فائق النقاء', valEn: '6.0 mm Heavy Virgin Cast Acrylic' },
      { keyAr: 'طريقة الطباعة / النقش', keyEn: 'Printing / Engraving', valAr: 'طباعة UV ألمانية متعددة الطبقات مع حفر ليزري', valEn: 'Multi-pass German UV Curable Ink + Etch' },
      { keyAr: 'نظام التثبيت', keyEn: 'Mounting Hardware', valAr: '4 مسامير استيل ستاند أوف (Standoff) مقاومة للصدأ', valEn: '4x Brushed Stainless Standoff Wall Spacers' },
      { keyAr: 'جهد التشغيل', keyEn: 'Voltage', valAr: '12 فولت DC مع محول أصلي 2A وضمان سنة', valEn: '12V DC with 2A Low-Heat Certified Adapter' },
      { keyAr: 'العزل ومقاومة الرطوبة', keyEn: 'Ingress Protection', valAr: 'IP54 مناسب للاستخدام الداخلي ومداخل المكاتب', valEn: 'IP54 Rated for indoor and sheltered receptions' },
    ],
    dimensions: [
      { id: 'dim-sign-sm', labelAr: 'مكتبي صغير (40 × 25 سم)', labelEn: 'Desk / Small (40 × 25 cm)', multiplier: 1.0, widthCm: 40, heightCm: 25 },
      { id: 'dim-sign-md', labelAr: 'جداري متوسط (60 × 40 سم)', labelEn: 'Medium Wall (60 × 40 cm)', multiplier: 1.8, widthCm: 60, heightCm: 40 },
      { id: 'dim-sign-lg', labelAr: 'استقبال كبير فاخر (90 × 60 سم)', labelEn: 'Large Reception (90 × 60 cm)', multiplier: 2.8, widthCm: 90, heightCm: 60 },
      { id: 'dim-sign-xl', labelAr: 'جداري رئيسي عملاق (120 × 80 سم)', labelEn: 'Flagship Corporate (120 × 80 cm)', multiplier: 4.2, widthCm: 120, heightCm: 80 },
    ],
    materials: [
      { id: 'mat-acrylic-clear', labelAr: 'أكريليك شفاف عالي الكثافة 6 مم', labelEn: '6mm Pure Transparent Cast Acrylic', priceAdd: 0 },
      { id: 'mat-acrylic-frosted', labelAr: 'أكريليك مثلج فاخر (Frosted Matte)', labelEn: 'Luxury Matte Frosted Acrylic', priceAdd: 12000 },
      { id: 'mat-acrylic-black', labelAr: 'أكريليك أسود ملكي مدمج مع ذهبي مرايا', labelEn: 'Royal Black Acrylic with Gold Mirror', priceAdd: 18000 },
    ],
    ledOptions: [
      { id: 'led-sky', nameAr: 'أزرق سماوي للشركات', nameEn: 'Aviation Sky Blue', hex: '#0ea5e9', glowClass: 'shadow-[0_0_35px_rgba(14,165,233,0.4)]' },
      { id: 'led-warm', nameAr: 'ذهبي ودافئ معماري راقٍ', nameEn: 'Warm Architectural Amber', hex: '#f59e0b', glowClass: 'shadow-[0_0_35px_rgba(245,158,11,0.4)]' },
      { id: 'led-white', nameAr: 'أبيض ثلجي ناصع', nameEn: 'Pure Arctic White', hex: '#ffffff', glowClass: 'shadow-[0_0_35px_rgba(255,255,255,0.4)]' },
      { id: 'led-rgb', nameAr: 'ألوان متعددة RGB مع ريموت تحكم', nameEn: 'RGB Multi-color with Remote Control', hex: '#ec4899', glowClass: 'shadow-[0_0_35px_rgba(236,72,153,0.4)]' },
    ],
    fontOptions: ARABIC_FONTS,
    standTypes: [
      { id: 'stand-steel', labelAr: 'مسامير استيل فضية ستاند أوف', labelEn: 'Brushed Silver Stainless Standoffs', priceAdd: 0 },
      { id: 'stand-gold', labelAr: 'مسامير ستاند أوف ذهبية عاكسة', labelEn: 'Polished Mirror Gold Standoffs', priceAdd: 5000 },
      { id: 'stand-desk', labelAr: 'قاعدة أكريليك للمكتب دون تخريم جدار', labelEn: 'Freestanding Desktop Acrylic Base', priceAdd: 4000 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 1, discountPercent: 0, labelAr: 'لوحة واحدة: السعر الفردي', labelEn: '1 pc: Standard Price' },
      { minQty: 2, maxQty: 3, discountPercent: 12, labelAr: '2 - 3 لوحات: خصم فروع 12%', labelEn: '2 - 3 pcs: 12% Branch Discount' },
      { minQty: 4, discountPercent: 20, labelAr: '4+ لوحات: خصم شركات 20%', labelEn: '4+ pcs: 20% Corporate Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 1,
    leadTimeAr: '3 - 5 أيام عمل مع بروفة واعتماد',
    leadTimeEn: '3 - 5 Business Days Proofing & Fabrication',
  },
  {
    id: 'prod-foil-cards',
    slug: 'hot-foil-business-cards',
    titleAr: 'كروت أعمال قطنية',
    titleEn: 'Letterpress Cotton Cards',
    category: 'cards',
    categoryLabelAr: 'كروت وهويات',
    categoryLabelEn: 'Business Stationery',
    basePrice: 400, // per card in standard 100 batch (40,000 IQD)
    descriptionAr: 'بطاقات عمل مصنوعة من الورق القطني الفاخر 600 غم مع بصمة ذهبية حرارية، حواف مذهبة ملونة، وتفاصيل نافرة تعكس مكانتك المهنية.',
    descriptionEn: 'Ultra-thick 600gsm cotton business cards with metallic foil debossing, colored gilded edges, and raised tactile embellishments.',
    image: '/images/products/luxury_foil_cards.jpg',
    galleryImages: [
      '/images/products/luxury_foil_cards.jpg',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['ورق قطني سميك 600 غم مزدوج الطبقات', 'بصمة حرارية بارزة أو غائرة عالية الدقة', 'تذهيب الحواف بلون ذهبي أو روز قولد أو أزرق سماوي', 'علبة أكريليك فاخرة لحفظ الكروت مجاناً مع الطلب'],
    featuresEn: ['Duplex 600gsm ultra-weight fine cotton stock', 'Precision metallic foil deboss / letterpress', 'Hand-gilded edges in gold, rose-gold, or cyan', 'Free premium acrylic card desk dispenser included'],
    specifications: [
      { keyAr: 'وزن وسماكة الورق', keyEn: 'Paper Weight', valAr: '600 غم/م² قطن طبيعي عالي الكثافة (سماكة 0.9 ملم)', valEn: '600 gsm Pure Cotton (0.9mm Caliper)' },
      { keyAr: 'المقاس القياسي', keyEn: 'Standard Dimensions', valAr: '9.0 × 5.0 سم أو مربع 6.0 × 6.0 سم', valEn: '9.0 × 5.0 cm or Square 6.0 × 6.0 cm' },
      { keyAr: 'نوع البصمة', keyEn: 'Foil Stamping', valAr: 'بصمة حرارية ألمانية كروز (Kurz Foil)', valEn: 'German Kurz Precision Hot Stamping' },
      { keyAr: 'تذهيب الحواف', keyEn: 'Edge Gilding', valAr: 'تذهيب يدوي عاكس عالي الجودة', valEn: 'Hand-burnished metallic foil edge gilding' },
      { keyAr: 'طريقة الطباعة', keyEn: 'Printing Process', valAr: 'طباعة لتربرس غائرة مع أوفست رقمي بدقة 2400dpi', valEn: 'Letterpress Deboss + 2400dpi Digital Offset' },
    ],
    dimensions: [
      { id: 'card-std', labelAr: 'المقاس العالمي القياسي (9 × 5 سم)', labelEn: 'Standard International (9 × 5 cm)', multiplier: 1.0, widthCm: 9, heightCm: 5 },
      { id: 'card-sq', labelAr: 'مربع عصري فاخر (6 × 6 سم)', labelEn: 'Modern Square (6 × 6 cm)', multiplier: 1.15, widthCm: 6, heightCm: 6 },
      { id: 'card-slim', labelAr: 'مستطيل نحيف أوروبي (8.5 × 4.5 سم)', labelEn: 'European Slim (8.5 × 4.5 cm)', multiplier: 1.05, widthCm: 8.5, heightCm: 4.5 },
    ],
    materials: [
      { id: 'mat-card-cotton', labelAr: 'ورق قطني طبيعي عاجي فاخر 600 غم', labelEn: '600gsm Premium Natural Cotton Card', priceAdd: 0 },
      { id: 'mat-card-black', labelAr: 'ورق أسود ملكي فاحم 700 غم مع بصمة ذهبية', labelEn: '700gsm Royal Black Board + Gold Foil', priceAdd: 100 },
      { id: 'mat-card-linen', labelAr: 'ورق كتاني إيطالي بنسيج ملموس 500 غم', labelEn: '500gsm Italian Textured Linen', priceAdd: 50 },
    ],
    paperTypes: [
      { id: 'paper-cotton', labelAr: 'قطن إيطالي 600 غم (أبيض ناصع / عاجي)', labelEn: '600gsm Italian Cotton (White / Off-White)', priceAdd: 0, gsm: 600 },
      { id: 'paper-black', labelAr: 'أسود ملكي فاحم 700 غم (Black Core)', labelEn: '700gsm Deep Black Core Stock', priceAdd: 80, gsm: 700 },
      { id: 'paper-kraft', labelAr: 'كرافت بيئي سميك 500 غم', labelEn: '500gsm Premium Heavy Kraft', priceAdd: 20, gsm: 500 },
    ],
    foilFinishes: [
      { id: 'foil-gold', labelAr: 'بصمة ذهبية لامعة كلاسيكية', labelEn: 'Polished Mirror Gold Foil', priceAdd: 0, hex: '#eab308' },
      { id: 'foil-silver', labelAr: 'بصمة فضية بلاتينية ناصعة', labelEn: 'Platinum Mirror Silver Foil', priceAdd: 0, hex: '#94a3b8' },
      { id: 'foil-rosegold', labelAr: 'بصمة روز قولد (Rose Gold) راقية', labelEn: 'Luxury Rose Gold Metallic', priceAdd: 40, hex: '#fb7185' },
      { id: 'foil-hologram', labelAr: 'بصمة هولوغرام ليزرية متغيرة الألوان', labelEn: 'Laser Holographic Prismatic Foil', priceAdd: 60, hex: '#38bdf8' },
      { id: 'foil-deboss', labelAr: 'حفر غائر بدون لون (Blind Deboss)', labelEn: 'Blind Deboss (Tactile No-Ink)', priceAdd: 0, hex: '#cbd5e1' },
    ],
    fontOptions: ARABIC_FONTS,
    tierPricing: [
      { minQty: 100, maxQty: 249, discountPercent: 0, labelAr: '100 كارت: 400 د.ع / كارت (40,000 د.ع)', labelEn: '100 cards: 400 IQD/ea' },
      { minQty: 250, maxQty: 499, discountPercent: 15, labelAr: '250 كارت: 340 د.ع / كارت (خصم 15%)', labelEn: '250 cards: 340 IQD/ea (15% off)' },
      { minQty: 500, maxQty: 999, discountPercent: 25, labelAr: '500 كارت: 300 د.ع / كارت (خصم 25%)', labelEn: '500 cards: 300 IQD/ea (25% off)' },
      { minQty: 1000, discountPercent: 37, labelAr: '1000 كارت: 250 د.ع / كارت (خصم كميات 37%)', labelEn: '1000 cards: 250 IQD/ea (37% off)' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 100,
    leadTimeAr: '2 - 4 أيام عمل',
    leadTimeEn: '2 - 4 Business Days',
  },
  {
    id: 'prod-rigid-boxes',
    slug: 'luxury-cardboard-boxes',
    titleAr: 'علب كرتون صلبة',
    titleEn: 'Luxury Rigid Boxes',
    category: 'boxes',
    categoryLabelAr: 'علب وتغليف',
    categoryLabelEn: 'Custom Packaging',
    basePrice: 5000, // per box base in batch
    descriptionAr: 'علب كرتون صلبة (Rigid Boxes) ومضلعة بتفصيل المقاس الدقيق لمنتجاتك، مع طباعة سلك سكرين، بصمة ذهبية/فضية، وقوالب إسفنج مخصصة.',
    descriptionEn: 'Hard setup rigid boxes and folding mailers custom sized to your exact product specs with foil hot-stamping, velvet finish, and custom EVA foam inserts.',
    image: '/images/products/luxury_rigid_box.jpg',
    galleryImages: [
      '/images/products/luxury_rigid_box.jpg',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['كرتون رمادي مقوى سماكة 2 مم (1200 غم) مقاوم للثني', 'بصمة حرارية ذهبية أو فضية للشعار مجاناً للكميات', 'قص قوالب إسفنج داخلي بالليزر لحماية المنتج بدقة', 'مغناطيس إغلاق مخفي مخملي سلس'],
    featuresEn: ['Heavy-gauge 1200gsm greyboard wrapped in specialty stock', 'Metallic gold/silver foil stamping included', 'Laser-cut custom EVA foam interior inserts', 'Concealed magnetic snap closure with soft touch'],
    specifications: [
      { keyAr: 'الكرتون الداخلي', keyEn: 'Internal Board', valAr: 'كرتون رمادي صلب سماكة 2.0 ملم (1200 غم)', valEn: 'Solid 2.0mm Greyboard (1200 gsm)' },
      { keyAr: 'الكسوة الخارجية', keyEn: 'Outer Wrapping', valAr: 'ورق فني مخملي الملمس (Soft-Touch Matte) 157 غم', valEn: 'Soft-Touch Matte Art Paper 157 gsm' },
      { keyAr: 'نظام الإغلاق', keyEn: 'Closure System', valAr: 'مغناطيس نيوديميوم قوي مدمج داخل الإطار', valEn: 'Concealed Heavy Neodymium Magnets' },
      { keyAr: 'الحشوة الداخلية', keyEn: 'Internal Padding', valAr: 'إسفنج EVA عالي الكثافة مقصوص بالليزر بمقاس منتجك', valEn: 'High-Density EVA Foam Custom Laser Cut' },
      { keyAr: 'الطباعة والبصمة', keyEn: 'Stamping', valAr: 'بصمة حرارية للشعار بألوان متعددة على الغطاء', valEn: 'Precision Hot Foil Logo Stamping on Lid' },
    ],
    dimensions: [
      { id: 'box-sm', labelAr: 'علبة عطور أو مجوهرات (12 × 12 × 5 سم)', labelEn: 'Perfume / Jewelry (12 × 12 × 5 cm)', multiplier: 1.0, widthCm: 12, heightCm: 12 },
      { id: 'box-md', labelAr: 'علبة هدايا متوسطة (22 × 16 × 8 سم)', labelEn: 'Medium Gift Box (22 × 16 × 8 cm)', multiplier: 1.6, widthCm: 22, heightCm: 16 },
      { id: 'box-lg', labelAr: 'صندوق فخم كبير (32 × 24 × 10 سم)', labelEn: 'Large Hamper Box (32 × 24 × 10 cm)', multiplier: 2.4, widthCm: 32, heightCm: 24 },
    ],
    materials: [
      { id: 'mat-box-matte', labelAr: 'ورق فني أبيض مع سلوفان مات مخملي', labelEn: 'Art Paper with Velvet Soft-Touch Matte', priceAdd: 0 },
      { id: 'mat-box-linen', labelAr: 'ورق كتاني مستورد بملمس نافر', labelEn: 'Imported Textured Linen Stock', priceAdd: 1500 },
      { id: 'mat-box-craft', labelAr: 'كرافت بيئي بني فاخر عالي الكثافة', labelEn: 'Eco Premium Brown Virgin Kraft', priceAdd: 500 },
    ],
    boxStyles: [
      { id: 'style-magnetic', labelAr: 'علبة إغلاق مغناطيسي فاخرة (Book Style)', labelEn: 'Magnetic Book-Fold Rigid Box', priceAdd: 1000 },
      { id: 'style-twopiece', labelAr: 'علبة قطعتين غطاء وقاعدة (Lid & Base)', labelEn: 'Classic Two-Piece Lid & Base', priceAdd: 0 },
      { id: 'style-drawer', labelAr: 'علبة درج منزلق مع شريط سحب ستان', labelEn: 'Sliding Drawer Box with Ribbon Pull', priceAdd: 1500 },
    ],
    boxInserts: [
      { id: 'ins-eva', labelAr: 'إسفنج EVA ليزري أسود مخصص لمنتجك', labelEn: 'Laser-Cut High-Density Black EVA', priceAdd: 1000 },
      { id: 'ins-satin', labelAr: 'قماش ستان حريري فاخر مكسو فوق الإسفنج', labelEn: 'Silk Satin Cloth Lining over Foam', priceAdd: 1500 },
      { id: 'ins-card', labelAr: 'فواصل كرتونية مقسمة للمنتجات', labelEn: 'Die-Cut Cardboard Compartments', priceAdd: 500 },
      { id: 'ins-none', labelAr: 'بدون حشوة داخلية (فارغة)', labelEn: 'Empty Interior (No Insert)', priceAdd: 0 },
    ],
    fontOptions: ARABIC_FONTS,
    tierPricing: [
      { minQty: 25, maxQty: 49, discountPercent: 0, labelAr: '25 - 49 علبة: السعر الأساسي للدفعة', labelEn: '25 - 49 boxes: Standard Batch' },
      { minQty: 50, maxQty: 99, discountPercent: 12, labelAr: '50 - 99 علبة: خصم 12%', labelEn: '50 - 99 boxes: 12% Volume Discount' },
      { minQty: 100, maxQty: 249, discountPercent: 22, labelAr: '100 - 249 علبة: خصم 22%', labelEn: '100 - 249 boxes: 22% Volume Discount' },
      { minQty: 250, discountPercent: 35, labelAr: '250+ علبة: خصم إنتاج ضخم 35%', labelEn: '250+ boxes: 35% Bulk Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 25,
    leadTimeAr: '4 - 7 أيام عمل',
    leadTimeEn: '4 - 7 Business Days',
  },
  {
    id: 'prod-wedding-timeline',
    slug: 'wedding-timeline-plaque',
    titleAr: 'لوحة تواريخ زفاف',
    titleEn: 'Wedding Timeline Plaque',
    category: 'weddings',
    categoryLabelAr: 'مناسبات وزفاف',
    categoryLabelEn: 'Wedding & Events',
    basePrice: 42000,
    descriptionAr: 'لوحة فنية توثق أهم تواريخ العمر (يوم اللقاء، الخطوبة، عقد القران، ويوم الزفاف) مع خطوط عربية كلاسيكية وتفاصيل دقيقة وإضاءة ليلية دافئة.',
    descriptionEn: 'Commemorative acrylic timeline plaque preserving key milestone dates (First Met, Engagement, Wedding Day) with graceful calligraphy and warm glow.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['خطوط كوفية وديوانية مخصصة للأسماء', 'قاعدة خشبية محفورة بعبارة إهداء خاصة', 'تغليف هدية مخملي جاهز للتقديم مع شريط ستان'],
    featuresEn: ['Custom Arabic calligraphy styling for names', 'Engraved wooden base with custom personal dedication', 'Velvet gift ready presentation packaging included'],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'أكريليك نقي كريستالي 4 ملم + خشب طبيعي', valEn: '4mm Pure Crystal Acrylic + Natural Oak' },
      { keyAr: 'التخطيط والخطوط', keyEn: 'Calligraphy', valAr: 'مخطوطة عربية مرسومة يدوياً ديواني أو ثلث', valEn: 'Hand-styled Arabic Diwani or Thuluth' },
      { keyAr: 'الإضاءة', keyEn: 'Lighting', valAr: 'شريط LED دافئ 3000K مدمج داخل تجويف القاعدة', valEn: 'Warm Amber 3000K LED ribbon concealed in base' },
      { keyAr: 'التغليف', keyEn: 'Gift Packaging', valAr: 'صندوق فاخر جاهز للإهداء مع بطاقة تهنئة', valEn: 'Luxury presentation gift box included' },
    ],
    dimensions: [
      { id: 'dim-wed-1', labelAr: 'طاولة صغيرة (20 × 15 سم)', labelEn: 'Table Display (20 × 15 cm)', multiplier: 1.0, widthCm: 15, heightCm: 20 },
      { id: 'dim-wed-2', labelAr: 'حجم مميز (28 × 20 سم)', labelEn: 'Display Deluxe (28 × 20 cm)', multiplier: 1.35, widthCm: 20, heightCm: 28 },
      { id: 'dim-wed-3', labelAr: 'لوحة تذكار جدارية (40 × 30 سم)', labelEn: 'Wall Keepsake (40 × 30 cm)', multiplier: 1.9, widthCm: 30, heightCm: 40 },
    ],
    materials: [
      { id: 'mat-wed-wood', labelAr: 'أكريليك مع قاعدة خشب طبيعي معالج', labelEn: 'Clear Acrylic + Natural Treated Oak', priceAdd: 0 },
      { id: 'mat-wed-gold', labelAr: 'أكريليك بحواف مرآة ذهبية وفضية', labelEn: 'Mirror Gold Edge Detail Accent', priceAdd: 9000 },
    ],
    ledOptions: [
      { id: 'led-warm', nameAr: 'إضاءة رومانسية دافئة (3000K)', nameEn: 'Romantic Warm Glow (3000K)', hex: '#fde047', glowClass: 'shadow-[0_0_25px_rgba(253,224,71,0.4)]' },
      { id: 'led-lavender', nameAr: 'لافندر ناعم رقيق', nameEn: 'Soft Pastel Lavender', hex: '#d8b4fe', glowClass: 'shadow-[0_0_25px_rgba(216,180,254,0.4)]' },
    ],
    fontOptions: ARABIC_FONTS,
    tierPricing: [
      { minQty: 1, maxQty: 1, discountPercent: 0, labelAr: 'قطعة واحدة: السعر الأساسي', labelEn: '1 pc: Standard Price' },
      { minQty: 2, maxQty: 4, discountPercent: 10, labelAr: '2 - 4 قطع: خصم 10%', labelEn: '2 - 4 pcs: 10% Discount' },
      { minQty: 5, discountPercent: 20, labelAr: '5+ قطع: خصم 20%', labelEn: '5+ pcs: 20% Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: false,
    minQuantity: 1,
    leadTimeAr: '24 - 48 ساعة',
    leadTimeEn: '24 - 48 Hours',
  },
  {
    id: 'prod-vector-portrait',
    slug: 'custom-vector-portrait-lamp',
    titleAr: 'بورتريه فيكتور ليزري',
    titleEn: 'Laser Vector Portrait',
    category: 'portraits',
    categoryLabelAr: 'بورتريه ورسومات',
    categoryLabelEn: 'Portraits & Art',
    basePrice: 48000,
    descriptionAr: 'فنانونا يرسمون صورتك الشخصية أو العائلية بأسلوب الفيكتور اليدوي الدقيق، ثم تُنقش خطوطها بالليزر على لوح أكريليك ليشع بالنور ليلاً.',
    descriptionEn: 'Our in-house artists manually illustrate your portrait into line vector art, then sub-millimeter laser etch it onto illuminated optical acrylic.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['رسم فيكتور احترافي للشخصيات قبل التنفيذ', 'إمكانية إضافة أسماء أو تاريخ أو أبيات شعر', 'إضاءة متعددة المستويات للغرف والمكاتب'],
    featuresEn: ['Professional digital vector line art rendering', 'Optional inscribed poem, names or memorable date', 'Multi-level dimmable ambient glow'],
    specifications: [
      { keyAr: 'أسلوب الرسم', keyEn: 'Art Style', valAr: 'رسم رقمي يدوي بنظام الفيكتور (Vector Line Art)', valEn: 'Custom Hand-Drawn Digital Line Vector Art' },
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'أكريليك نقي 4 ملم مع قاعدة خشبية بمفتاح لمس', valEn: '4mm Pure Cast Acrylic + Touch Sensor Wood Base' },
      { keyAr: 'التوصيل والكهرباء', keyEn: 'Power', valAr: 'وصلة USB 5V تعمل مع أي شاحن هاتف', valEn: 'Standard 5V USB cord included' },
      { keyAr: 'البروفة والموافقة', keyEn: 'Proof & Review', valAr: 'نرسل لك الرسم الرقمي عبر واتساب قبل الحفر على الأكريليك', valEn: 'Digital sketch WhatsApp approval before laser etch' },
    ],
    dimensions: [
      { id: 'dim-port-1', labelAr: 'فردي (20 × 16 سم)', labelEn: 'Solo Portrait (20 × 16 cm)', multiplier: 1.0, widthCm: 16, heightCm: 20 },
      { id: 'dim-port-2', labelAr: 'ثنائي / عائلي (26 × 20 سم)', labelEn: 'Couple / Duo (26 × 20 cm)', multiplier: 1.4, widthCm: 20, heightCm: 26 },
      { id: 'dim-port-3', labelAr: 'كبير فاخر (32 × 24 سم)', labelEn: 'Large Family (32 × 24 cm)', multiplier: 1.8, widthCm: 24, heightCm: 32 },
    ],
    materials: [
      { id: 'mat-port-oak', labelAr: 'قاعدة زان مصمت مع شريط LED مخفي', labelEn: 'Solid Beech Wood with Concealed LED', priceAdd: 0 },
      { id: 'mat-port-black', labelAr: 'قاعدة خشبية سوداء فاخرة', labelEn: 'Matte Black Executive Base', priceAdd: 5000 },
    ],
    ledOptions: [
      { id: 'led-warm', nameAr: 'أصفر شاعري دافئ (3000K)', nameEn: 'Warm Poetic Amber (3000K)', hex: '#f59e0b', glowClass: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]' },
      { id: 'led-ice', nameAr: 'أزرق سماوي منعش', nameEn: 'Sky Blue Crisp', hex: '#38bdf8', glowClass: 'shadow-[0_0_25px_rgba(56,189,248,0.4)]' },
      { id: 'led-lavender', nameAr: 'بنفسجي لافندر ناعم', nameEn: 'Lavender Violet Soft', hex: '#c084fc', glowClass: 'shadow-[0_0_25px_rgba(192,132,252,0.4)]' },
    ],
    portraitStyles: [
      { id: 'style-minimal', labelAr: 'خطوط فيكتور بسيطة ناعمة (Minimalist Line)', labelEn: 'Minimalist Line Art', priceAdd: 0 },
      { id: 'style-detailed', labelAr: 'فيكتور مظلل بتفاصيل الوجه الكاملة', labelEn: 'Shaded Detailed Vector', priceAdd: 8000 },
      { id: 'style-pop', labelAr: 'بوب آرت عصري مع لمسات هندسية', labelEn: 'Modern Geometric Pop Art', priceAdd: 5000 },
    ],
    fontOptions: ARABIC_FONTS,
    tierPricing: [
      { minQty: 1, maxQty: 1, discountPercent: 0, labelAr: 'قطعة واحدة: السعر الأساسي', labelEn: '1 pc: Standard Base Price' },
      { minQty: 2, maxQty: 3, discountPercent: 12, labelAr: '2 - 3 قطع: خصم هدايا 12%', labelEn: '2 - 3 pcs: 12% Gift Discount' },
      { minQty: 4, discountPercent: 20, labelAr: '4+ قطع: خصم 20%', labelEn: '4+ pcs: 20% Volume Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true, // photo to draw
    minQuantity: 1,
    leadTimeAr: '48 - 72 ساعة (تشمل وقت الرسم الرقمي)',
    leadTimeEn: '48 - 72 Hours (Includes Digital Sketching)',
  },
  {
    id: 'prod-perfume-luxury-box',
    slug: 'magnetic-perfume-rigid-box',
    titleAr: 'علب عطور صلبة',
    titleEn: 'Luxury Rigid Perfume Box',
    category: 'boxes',
    categoryLabelAr: 'علب وتغليف',
    categoryLabelEn: 'Custom Packaging',
    basePrice: 7500,
    descriptionAr: 'علبة كرتون صلبة 1500 غم مكسوة بورق فني إيطالي مخملي، مع إغلاق مغناطيسي خفي نيوديميوم وقالب داخلي محفور ليزرياً بدقة زجاجة العطر.',
    descriptionEn: 'Ultra-dense 1500gsm rigid greyboard wrapped in Italian soft-touch velvet stock with concealed neodymium magnets and custom laser-sculpted EVA insert.',
    image: '/images/products/luxury_rigid_box.jpg',
    galleryImages: [
      '/images/products/luxury_rigid_box.jpg',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['كرتون مقوى 1500 غم مقاوم للضغط والصدمات', 'بصمة حرارية ذهبية عاكسة للشعار', 'حشوة إسفنجية مخملية سوداء مقصوصة بمقاس القنينة', 'إغلاق مغناطيسي سلس'],
    featuresEn: ['1500gsm heavy gauge greyboard structure', 'Mirror gold hot foil logo debossing', 'Custom laser contoured velvet EVA interior', 'Smooth concealed magnetic snap closure'],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'كرتون رمادي صلب 1500 غم + ورق مخملي ناعم', valEn: '1500gsm Greyboard + Soft-touch Art Paper' },
      { keyAr: 'المقاس المتاح', keyEn: 'Dimensions', valAr: '14 × 10 × 6 سم (لقناني 50-100 مل)', valEn: '14 × 10 × 6 cm (For 50-100ml bottles)' },
      { keyAr: 'البصمة', keyEn: 'Foil', valAr: 'بصمة حرارية ذهبية أو فضية بارزة', valEn: 'Gold or Silver Metallic Foil' },
    ],
    dimensions: [
      { id: 'dim-perf-std', labelAr: 'قياسي 50-100 مل (14 × 10 × 6 سم)', labelEn: 'Standard 50-100ml (14 × 10 × 6 cm)', multiplier: 1.0, widthCm: 14, heightCm: 10 },
      { id: 'dim-perf-lg', labelAr: 'طقم عطرين / لارج (20 × 15 × 7 سم)', labelEn: 'Duo Gift Set (20 × 15 × 7 cm)', multiplier: 1.5, widthCm: 20, heightCm: 15 },
    ],
    materials: [
      { id: 'mat-perf-velvet', labelAr: 'ورق فني مخملي إيطالي أسود فاحم', labelEn: 'Italian Velvet Soft-Touch Black', priceAdd: 0 },
      { id: 'mat-perf-linen', labelAr: 'ورق كتاني ملكي أوف وايت عاجي', labelEn: 'Off-White Royal Textured Linen', priceAdd: 1000 },
    ],
    tierPricing: [
      { minQty: 25, maxQty: 49, discountPercent: 0, labelAr: '25 - 49 علبة: السعر الأساسي', labelEn: '25 - 49 pcs: Standard' },
      { minQty: 50, maxQty: 99, discountPercent: 15, labelAr: '50 - 99 علبة: خصم 15%', labelEn: '50 - 99 pcs: 15% off' },
      { minQty: 100, discountPercent: 28, labelAr: '100+ علبة: خصم جملة 28%', labelEn: '100+ pcs: 28% off' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 25,
    leadTimeAr: '3 - 5 أيام عمل',
    leadTimeEn: '3 - 5 Business Days',
  },
  {
    id: 'prod-mailer-box',
    slug: 'custom-printed-mailer-shipping-boxes',
    titleAr: 'علب شحن مطبوعة',
    titleEn: 'Custom Printed Mailer Box',
    category: 'boxes',
    categoryLabelAr: 'علب وتغليف',
    categoryLabelEn: 'Custom Packaging',
    basePrice: 2200,
    descriptionAr: 'كرتون شحن مضلع E-Flute متين وخفيف الوزن، يحمي شحنات متجرك ويمنح عميلك تجربة Unboxing استثنائية مع طباعة الهوية بالألوان الكاملة.',
    descriptionEn: 'Durable E-flute corrugated cardboard mailer boxes engineered for safe e-commerce shipping with full interior and exterior branding.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
      '/images/products/luxury_rigid_box.jpg',
    ],
    featuresAr: ['كرتون مقوى E-Flute ثلاثي الطبقات', 'طباعة عالية الدقة بالألوان الكاملة', 'إقفال محكم ذاتي لا يتطلب شريط لاصق', 'مقاوم للرطوبة والضغط أثناء الشحن'],
    featuresEn: ['Heavy-duty 3-ply E-flute corrugated board', 'Full-color high-resolution offset printing', 'Self-locking tuck-top design', 'Crush-resistant during transit'],
    specifications: [
      { keyAr: 'نوع الكرتون', keyEn: 'Board Type', valAr: 'كرتون مضلع E-Flute نخب أول 350 غم', valEn: 'Premium E-Flute Corrugated 350gsm' },
      { keyAr: 'الطباعة', keyEn: 'Printing', valAr: 'طباعة خارجية وداخلية بدقة 1200 DPI', valEn: 'Interior + Exterior 1200 DPI' },
    ],
    dimensions: [
      { id: 'dim-mail-sm', labelAr: 'صغير 20 × 15 × 5 سم', labelEn: 'Small (20 × 15 × 5 cm)', multiplier: 1.0, widthCm: 20, heightCm: 15 },
      { id: 'dim-mail-md', labelAr: 'متوسط 28 × 20 × 8 سم', labelEn: 'Medium (28 × 20 × 8 cm)', multiplier: 1.35, widthCm: 28, heightCm: 20 },
      { id: 'dim-mail-lg', labelAr: 'كبير 35 × 26 × 10 سم', labelEn: 'Large (35 × 26 × 10 cm)', multiplier: 1.7, widthCm: 35, heightCm: 26 },
    ],
    materials: [
      { id: 'mat-mail-white', labelAr: 'كرتون أبيض ناصع مع طباعة كاملة', labelEn: 'Bright White Corrugated with Full Print', priceAdd: 0 },
      { id: 'mat-mail-kraft', labelAr: 'كرتون كرافت بيئي بني كلاسيكي', labelEn: 'Eco Natural Brown Kraft Board', priceAdd: -200 },
    ],
    tierPricing: [
      { minQty: 50, maxQty: 99, discountPercent: 0, labelAr: '50 - 99 علبة: 2,200 د.ع / علبة', labelEn: '50 - 99 pcs: 2,200 IQD/ea' },
      { minQty: 100, maxQty: 249, discountPercent: 18, labelAr: '100 - 249 علبة: 1,800 د.ع / علبة', labelEn: '100 - 249 pcs: 1,800 IQD/ea' },
      { minQty: 250, discountPercent: 32, labelAr: '250+ علبة: 1,500 د.ع / علبة', labelEn: '250+ pcs: 1,500 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 50,
    leadTimeAr: '3 - 6 أيام عمل',
    leadTimeEn: '3 - 6 Business Days',
  },
  {
    id: 'prod-drawer-box',
    slug: 'sliding-drawer-setup-box',
    titleAr: 'علب درج سحاب',
    titleEn: 'Sliding Drawer Box',
    category: 'boxes',
    categoryLabelAr: 'علب وتغليف',
    categoryLabelEn: 'Custom Packaging',
    basePrice: 6500,
    descriptionAr: 'علبة درجية كرتونية صلبة تنزلق بسلاسة متناهية مع شريط سحب ستان حريري، وبصمة رقائق ذهبية للشعار، مناسبة للشوكولاتة والهدايا الراقية.',
    descriptionEn: 'Rigid sliding matchbox-style setup box featuring satin grosgrain pull ribbon, metallic foil debossing, and rigid structural finish.',
    image: '/images/products/luxury_rigid_box.jpg',
    galleryImages: [
      '/images/products/luxury_rigid_box.jpg',
    ],
    featuresAr: ['هيكل درجي منزلق صلب 1200 غم', 'شريط ستان حريري ملون للسحب', 'بصمة حرارية بارزة للشعار', 'حشوة إسفنجية مقسمة اختيارية'],
    featuresEn: ['Smooth 1200gsm sliding drawer design', 'Custom color grosgrain satin ribbon pull', 'Metallic hot foil stamped branding', 'Optional die-cut foam partitions'],
    specifications: [
      { keyAr: 'الكرتون', keyEn: 'Greyboard', valAr: 'كرتون صلب سماكة 2 ملم (1200 غم)', valEn: '2mm Dense Rigid Greyboard' },
      { keyAr: 'شريط السحب', keyEn: 'Ribbon', valAr: 'شريط ستان حريري 15 ملم', valEn: '15mm Silk Satin Ribbon' },
    ],
    dimensions: [
      { id: 'dim-draw-sm', labelAr: 'مربع (15 × 15 × 5 سم)', labelEn: 'Square (15 × 15 × 5 cm)', multiplier: 1.0, widthCm: 15, heightCm: 15 },
      { id: 'dim-draw-lg', labelAr: 'مستطيل (24 × 16 × 6 سم)', labelEn: 'Rectangular (24 × 16 × 6 cm)', multiplier: 1.45, widthCm: 24, heightCm: 16 },
    ],
    materials: [
      { id: 'mat-draw-slate', labelAr: 'ورق أسود فحمي ملكي مات', labelEn: 'Onyx Charcoal Matte Board', priceAdd: 0 },
      { id: 'mat-draw-pearl', labelAr: 'ورق لؤلؤي لامع فاخر', labelEn: 'Lustre Pearl Fine Stock', priceAdd: 800 },
    ],
    tierPricing: [
      { minQty: 25, maxQty: 49, discountPercent: 0, labelAr: '25 - 49 علبة: السعر الأساسي', labelEn: '25 - 49 pcs: Standard' },
      { minQty: 50, maxQty: 99, discountPercent: 14, labelAr: '50 - 99 علبة: خصم 14%', labelEn: '50 - 99 pcs: 14% off' },
      { minQty: 100, discountPercent: 25, labelAr: '100+ علبة: خصم 25%', labelEn: '100+ pcs: 25% off' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 25,
    leadTimeAr: '4 - 7 أيام عمل',
    leadTimeEn: '4 - 7 Business Days',
  },
  {
    id: 'prod-pizza-box',
    slug: 'custom-corrugated-pizza-boxes',
    titleAr: 'علب بيتزا كرتونية',
    titleEn: 'Custom Pizza Boxes',
    category: 'boxes',
    categoryLabelAr: 'علب كرتونية',
    categoryLabelEn: 'Carton Packaging',
    basePrice: 650,
    descriptionAr: 'علب بيتزا كرتونية مضلعة مصنعة من كرتون غذائي صحي عازل للحرارة والزيوت مع فتحات تهوية ليزرية لطرد البخار والحفاظ على قرمشة البيتزا وسخونتها، تدعم الطباعة الكاملة لشعار واسم مطعمك.',
    descriptionEn: 'Food-grade heat-insulating corrugated kraft pizza box with steam vents and grease barrier. Custom flexo or full-color branding for pizzerias.',
    image: '/images/products/pizza_box_front_1792414603663.jpg',
    galleryImages: [
      '/images/products/pizza_box_front_1792414603663.jpg',
      '/images/products/pizza_box_open_1792414636783.jpg',
      '/images/products/pizza_box_top_1792414653990.jpg',
      '/images/products/pizza_box_side_1792414669443.jpg',
      '/images/products/pizza_box_detail_1792414683015.jpg',
    ],
    featuresAr: [
      'كرتون غذائي معتمد عازل للحرارة يحفظ سخونة البيتزا',
      'فتحات تهوية جانبية لتبخير الرطوبة ومنع تبلل العجين',
      'طبقة داخلية بيضاء مقاومة للزيوت والدهون',
      'طباعة عالية الدقة لشعار المطعم وأرقام التوصيل والمواقع',
    ],
    featuresEn: [
      'Food-contact certified thermal insulating flute board',
      'Precision steam vent holes to prevent moisture condensation',
      'Greaseproof white food-safe interior lining',
      'High-contrast exterior branding for pizzerias & delivery',
    ],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'كرتون كرافت غذائي مضلع E-Flute عازل للحرارة', valEn: 'Food-Grade Thermal E-Flute Corrugated' },
      { keyAr: 'المقاومة', keyEn: 'Barrier', valAr: 'عازل دهون وزيوت معتمد صحياً (FDA/ISO)', valEn: 'Grease-Resistant Certified Food Barrier' },
      { keyAr: 'التهوية', keyEn: 'Ventilation', valAr: 'فتحات تهوية دائرية لطرد البخار الزائد', valEn: 'Dual Steam Release Vent Holes' },
      { keyAr: 'الطباعة', keyEn: 'Printing', valAr: 'طباعة فلكسوغرافية مائية آمنة للأغذية 1-4 ألوان', valEn: 'Food-Safe Water-Based Inks 1-4 Colors' },
    ],
    dimensions: [
      { id: 'dim-pz-sm', labelAr: 'صغير 10 إنش (26 × 26 × 4.5 سم)', labelEn: 'Small 10" (26 × 26 × 4.5 cm)', multiplier: 1.0, widthCm: 26, heightCm: 26 },
      { id: 'dim-pz-md', labelAr: 'وسط 12 إنش (31 × 31 × 4.5 سم)', labelEn: 'Medium 12" (31 × 31 × 4.5 cm)', multiplier: 1.25, widthCm: 31, heightCm: 31 },
      { id: 'dim-pz-lg', labelAr: 'كبير 14 إنش (36 × 36 × 4.8 سم)', labelEn: 'Large 14" (36 × 36 × 4.8 cm)', multiplier: 1.5, widthCm: 36, heightCm: 36 },
    ],
    materials: [
      { id: 'mat-pz-kraft', labelAr: 'كرتون كرافت بني كلاسيكي بيئي', labelEn: 'Classic Eco Brown Kraft', priceAdd: 0 },
      { id: 'mat-pz-white', labelAr: 'كرتون أبيض ناصع مطلي بالألوان', labelEn: 'Pure White Coated Board', priceAdd: 100 },
    ],
    tierPricing: [
      { minQty: 100, maxQty: 249, discountPercent: 0, labelAr: '100 - 249 علبة: 650 د.ع / علبة', labelEn: '100 - 249 pcs: 650 IQD/ea' },
      { minQty: 250, maxQty: 499, discountPercent: 15, labelAr: '250 - 499 علبة: 550 د.ع / علبة', labelEn: '250 - 499 pcs: 550 IQD/ea' },
      { minQty: 500, discountPercent: 27, labelAr: '500+ علبة: 475 د.ع / علبة', labelEn: '500+ pcs: 475 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 100,
    leadTimeAr: '3 - 5 أيام عمل',
    leadTimeEn: '3 - 5 Business Days',
  },
  {
    id: 'prod-kraft-mailer-box',
    slug: 'kraft-corrugated-mailer-box',
    titleAr: 'علب كرافت بريدية',
    titleEn: 'Kraft Corrugated Mailer Box',
    category: 'boxes',
    categoryLabelAr: 'علب كرتونية',
    categoryLabelEn: 'Carton Packaging',
    basePrice: 1800,
    descriptionAr: 'صندوق كرتون بريدي مضلع من ورق الكرافت الطبيعي عالي المتانة، مزود بأجنحة إقفال ذاتية محكمة دون الحاجة لشريط لاصق، مخصص لشحن وتغليف منتجات التجارة الإلكترونية بمظهر بيئي احترافي.',
    descriptionEn: 'Eco-friendly corrugated natural kraft mailer box engineered with precision locking tabs. Ideal for sustainable e-commerce fulfillment and clean unboxing.',
    image: '/images/products/kraft_mailer_front_1792355150523.jpg',
    galleryImages: [
      '/images/products/kraft_mailer_front_1792355150523.jpg',
      '/images/products/kraft_mailer_open_1792355167292.jpg',
      '/images/products/kraft_mailer_side_1792355182690.jpg',
      '/images/products/kraft_mailer_top_1792355197150.jpg',
      '/images/products/kraft_mailer_detail_1792355211798.jpg',
    ],
    featuresAr: ['كرتون كرافت ثلاثي الطبقات متين ومقاوم للثني', 'قفل أمان جانبي ذاتي يغني عن التيب واللواصق', 'ألياف كرتونية طبيعية صديقة للبيئة قابلة لإعادة التدوير', 'مساحة مثالية للطباعة وطوابع البريد والشعار'],
    featuresEn: ['Durable 3-ply corrugated kraft board', 'Self-locking tuck flap closure', '100% recyclable biodegradable natural paper fibers', 'Optimized surface for branding and shipping labels'],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'كرتون كرافت مضلع E-Flute نخب أول (320 غم)', valEn: 'Premium E-Flute Corrugated Kraft (320gsm)' },
      { keyAr: 'نوع الإغلاق', keyEn: 'Closure', valAr: 'إقفال كرتوني ميكانيكي ثلاثي الأجنحة', valEn: 'Triple-Tab Self-Locking Fold' },
      { keyAr: 'الطباعة المتاحة', keyEn: 'Printing', valAr: 'طباعة فلكسوغرافية أو ديجيتال باللون الأسود أو الملون', valEn: 'Flexographic or High-Res Digital 1-4 Colors' },
    ],
    dimensions: [
      { id: 'dim-km-sm', labelAr: 'صغير 20 × 14 × 6 سم', labelEn: 'Small (20 × 14 × 6 cm)', multiplier: 1.0, widthCm: 20, heightCm: 14 },
      { id: 'dim-km-md', labelAr: 'متوسط 26 × 18 × 8 سم', labelEn: 'Medium (26 × 18 × 8 cm)', multiplier: 1.3, widthCm: 26, heightCm: 18 },
      { id: 'dim-km-lg', labelAr: 'كبير 34 × 24 × 10 سم', labelEn: 'Large (34 × 24 × 10 cm)', multiplier: 1.65, widthCm: 34, heightCm: 24 },
    ],
    materials: [
      { id: 'mat-km-natural', labelAr: 'ورق كرافت طبيعي بيئي خام', labelEn: 'Natural Eco Kraft Stock', priceAdd: 0 },
      { id: 'mat-km-recycled', labelAr: 'كرتون كرافت معاد تدويره معتمد', labelEn: 'FSC Certified Recycled Kraft', priceAdd: 150 },
    ],
    tierPricing: [
      { minQty: 50, maxQty: 99, discountPercent: 0, labelAr: '50 - 99 علبة: 1,800 د.ع / علبة', labelEn: '50 - 99 pcs: 1,800 IQD/ea' },
      { minQty: 100, maxQty: 249, discountPercent: 15, labelAr: '100 - 249 علبة: 1,530 د.ع / علبة', labelEn: '100 - 249 pcs: 1,530 IQD/ea' },
      { minQty: 250, discountPercent: 30, labelAr: '250+ علبة: 1,260 د.ع / علبة', labelEn: '250+ pcs: 1,260 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 50,
    leadTimeAr: '3 - 5 أيام عمل',
    leadTimeEn: '3 - 5 Business Days',
  },
  {
    id: 'prod-black-matte-mailer-box',
    slug: 'black-matte-corrugated-mailer-box',
    titleAr: 'علب بريدية سوداء',
    titleEn: 'Matte Black Mailer Box',
    category: 'boxes',
    categoryLabelAr: 'علب كرتونية',
    categoryLabelEn: 'Carton Packaging',
    basePrice: 2400,
    descriptionAr: 'علب كرتون شحن بلون أسود فحمي مطفي فائق الفخامة مع بطانة داخلية قابلة للطباعة بهوية علامتك التجارية، مصنوعة من كرتون مضلع E-Flute متين لحماية العطور والمقتنيات الثمينة وتجربة فتح فاخرة.',
    descriptionEn: 'High-end matte black corrugated mailing box with crisp fold lines and custom brandable interior. Perfect for luxury cosmetics, apparel, and premium electronics.',
    image: '/images/products/black_mailer_front_1792355226844.jpg',
    galleryImages: [
      '/images/products/black_mailer_front_1792355226844.jpg',
      '/images/products/black_mailer_open_1792355240028.jpg',
      '/images/products/black_mailer_top_1792355255165.jpg',
      '/images/products/black_mailer_side_1792355268326.jpg',
      '/images/products/black_mailer_detail_1792355283657.jpg',
    ],
    featuresAr: ['طلاء أسود مطفي فاخر مانع لآثار البصمات', 'إمكانية الطباعة بنمط جرافيكي أبيض أو ملون داخل الصندوق', 'حواف ليزرية حادة وقفل طي أوتوماتيكي محكم', 'مناسب للشحنات الراقية والهدايا الفخمة'],
    featuresEn: ['Deep velvet matte black anti-fingerprint coating', 'High-contrast interior custom pattern printing', 'Laser-creased fold lines for instant snap-fit assembly', 'Engineered for luxury goods and corporate gifting'],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'كرتون مضلع صلب مع طبقة تغليف سلوفان مطفي ناعم', valEn: 'Corrugated Flute + Soft-Touch Matte Black Film' },
      { keyAr: 'الطباعة الداخلية', keyEn: 'Inside Print', valAr: 'أوفست عالي الدقة (أبيض / ذهبي / ألوان)', valEn: 'High-Contrast White / Gold / Full Color Offset' },
      { keyAr: 'سماكة الجدار', keyEn: 'Caliper', valAr: '1.8 ملم معزز التحمل', valEn: '1.8mm Reinforced Caliper' },
    ],
    dimensions: [
      { id: 'dim-bm-sm', labelAr: 'صغير 22 × 15 × 6 سم', labelEn: 'Small (22 × 15 × 6 cm)', multiplier: 1.0, widthCm: 22, heightCm: 15 },
      { id: 'dim-bm-md', labelAr: 'متوسط 28 × 20 × 9 سم', labelEn: 'Medium (28 × 20 × 9 cm)', multiplier: 1.35, widthCm: 28, heightCm: 20 },
      { id: 'dim-bm-lg', labelAr: 'كبير 36 × 26 × 10 سم', labelEn: 'Large (36 × 26 × 10 cm)', multiplier: 1.75, widthCm: 36, heightCm: 26 },
    ],
    materials: [
      { id: 'mat-bm-velvet', labelAr: 'أسود مطفي سوفت تتش ناعم', labelEn: 'Velvet Soft-Touch Black', priceAdd: 0 },
      { id: 'mat-bm-foil', labelAr: 'أسود مطفي مع بصمة ذهبية للشعار', labelEn: 'Matte Black with Gold Foil Logo', priceAdd: 500 },
    ],
    tierPricing: [
      { minQty: 50, maxQty: 99, discountPercent: 0, labelAr: '50 - 99 علبة: 2,400 د.ع / علبة', labelEn: '50 - 99 pcs: 2,400 IQD/ea' },
      { minQty: 100, maxQty: 249, discountPercent: 17, labelAr: '100 - 249 علبة: 1,990 د.ع / علبة', labelEn: '100 - 249 pcs: 1,990 IQD/ea' },
      { minQty: 250, discountPercent: 29, labelAr: '250+ علبة: 1,700 د.ع / علبة', labelEn: '250+ pcs: 1,700 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 50,
    leadTimeAr: '3 - 6 أيام عمل',
    leadTimeEn: '3 - 6 Business Days',
  },
  {
    id: 'prod-white-mailer-box',
    slug: 'pure-white-corrugated-mailer-box',
    titleAr: 'علب شحن بيضاء',
    titleEn: 'White Mailer Box',
    category: 'boxes',
    categoryLabelAr: 'علب كرتونية',
    categoryLabelEn: 'Carton Packaging',
    basePrice: 2100,
    descriptionAr: 'صندوق كرتون أبيض ناصع ذو سطح مطلي مخصص لطباعة الألوان والشعارات بدقة متناهية، يمنح تجربة استلام أنيقة للملابس ومستحضرات التجميل والأجهزة الذكية.',
    descriptionEn: 'Pristine coated bright white corrugated mailer box designed for vivid full-color graphic reproduction and clean modern brand presentation.',
    image: '/images/products/white_mailer_front_1792355298664.jpg',
    galleryImages: [
      '/images/products/white_mailer_front_1792355298664.jpg',
      '/images/products/white_mailer_open_1792355312293.jpg',
      '/images/products/white_mailer_top_1792355326764.jpg',
      '/images/products/white_mailer_side_1792355340523.jpg',
      '/images/products/white_mailer_detail_1792355359414.jpg',
    ],
    featuresAr: ['كرتون أبيض ناصع نخب ممتاز للطباعة بالألوان الكاملة', 'قفل جانبي محكم يمنع الفتح العرضي أثناء النقل', 'سطح خارجي مصقول نصف لامع يحمي من البقع', 'داخل أبيض نظيف يعزز جمالية المنتج داخله'],
    featuresEn: ['Bleached pure white outer & inner liner', 'Full-color CMYK high fidelity color reproduction', 'Interlocking side flaps for structural rigidity', 'Pristine clean presentation for cosmetics & apparel'],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'كرتون مضلع أبيض وجهين 360 غم', valEn: 'Double-White E-Flute Board (360gsm)' },
      { keyAr: 'نوع السطح', keyEn: 'Surface Finish', valAr: 'طلاء مائي شبه لامع يحمي الأحبار', valEn: 'Semi-Gloss Protective Aqueous Coating' },
      { keyAr: 'دقة الطباعة', keyEn: 'Print Resolution', valAr: '1200 DPI بألوان نقية ومطابقة للـ Pantone', valEn: '1200 DPI Full Color Pantone Matched' },
    ],
    dimensions: [
      { id: 'dim-wm-sm', labelAr: 'صغير 20 × 15 × 5 سم', labelEn: 'Small (20 × 15 × 5 cm)', multiplier: 1.0, widthCm: 20, heightCm: 15 },
      { id: 'dim-wm-md', labelAr: 'متوسط 28 × 20 × 8 سم', labelEn: 'Medium (28 × 20 × 8 cm)', multiplier: 1.35, widthCm: 28, heightCm: 20 },
      { id: 'dim-wm-lg', labelAr: 'كبير 35 × 26 × 10 سم', labelEn: 'Large (35 × 26 × 10 cm)', multiplier: 1.7, widthCm: 35, heightCm: 26 },
    ],
    materials: [
      { id: 'mat-wm-standard', labelAr: 'كرتون أبيض قياسي مع سلفنة مطفية', labelEn: 'Coated White with Matte Lamination', priceAdd: 0 },
      { id: 'mat-wm-gloss', labelAr: 'كرتون أبيض لامع عاكس للضوء', labelEn: 'High-Gloss Coated White', priceAdd: 200 },
    ],
    tierPricing: [
      { minQty: 50, maxQty: 99, discountPercent: 0, labelAr: '50 - 99 علبة: 2,100 د.ع / علبة', labelEn: '50 - 99 pcs: 2,100 IQD/ea' },
      { minQty: 100, maxQty: 249, discountPercent: 16, labelAr: '100 - 249 علبة: 1,760 د.ع / علبة', labelEn: '100 - 249 pcs: 1,760 IQD/ea' },
      { minQty: 250, discountPercent: 30, labelAr: '250+ علبة: 1,470 د.ع / علبة', labelEn: '250+ pcs: 1,470 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 50,
    leadTimeAr: '3 - 5 أيام عمل',
    leadTimeEn: '3 - 5 Business Days',
  },
  {
    id: 'prod-heavy-shipping-carton',
    slug: 'heavy-duty-master-shipping-carton',
    titleAr: 'كرتون شحن رئيسي',
    titleEn: 'Master Shipping Carton',
    category: 'boxes',
    categoryLabelAr: 'علب كرتونية',
    categoryLabelEn: 'Carton Packaging',
    basePrice: 3200,
    descriptionAr: 'صناديق كرتون شحن صناعية مضاعفة التضليع (Double Wall B/C Flute) لتحمل الصدمات والأوزان الثقيلة والتخزين الطويل، مع إمكانية طباعة علامات التحذير ورموز الشحن التجاري.',
    descriptionEn: 'Double-wall heavy duty corrugated transit carton engineered for export freight, warehouse stacking, and high shock resistance.',
    image: '/images/products/shipping_carton_front_1792355375428.jpg',
    galleryImages: [
      '/images/products/shipping_carton_front_1792355375428.jpg',
      '/images/products/shipping_carton_open_1792355391827.jpg',
      '/images/products/shipping_carton_top_1792355406347.jpg',
      '/images/products/shipping_carton_side_1792355421835.jpg',
      '/images/products/shipping_carton_detail_1792355438297.jpg',
    ],
    featuresAr: ['جدار كرتوني مزدوج 5 طبقات فائق المتانة', 'تحمل أحمال ضغط عمودي تتجاوز 40 كغم', 'طباعة علامات المناولة القابلة للكسر (Fragile) وسهم التوجيه', 'مثالي لتخزين المستودعات والشحن الجوي والبري'],
    featuresEn: ['5-ply double wall heavy corrugated board (B+C flute)', 'Stacking load capacity exceeding 40kg', 'Standard international handling & fragile icon prints', 'Designed for freight logistics and wholesale storage'],
    specifications: [
      { keyAr: 'التركيب', keyEn: 'Board Structure', valAr: 'كرتون مضلع مزدوج 5 طبقات (B/C Flute) 450 غم', valEn: '5-Ply Double Wall Heavy Corrugated (450gsm)' },
      { keyAr: 'تحمل الوزن', keyEn: 'Weight Rating', valAr: 'حتى 35 كغم شحنات داخلية / 40 كغم تخزين', valEn: 'Up to 35kg transit / 40kg static stacking' },
      { keyAr: 'نوع الصندوق', keyEn: 'Style', valAr: 'صندوق شحن قياسي بأربع طيات علوية وسفلية (RSC)', valEn: 'Regular Slotted Container (RSC)' },
    ],
    dimensions: [
      { id: 'dim-hc-sm', labelAr: 'متوسط 35 × 25 × 20 سم', labelEn: 'Medium (35 × 25 × 20 cm)', multiplier: 1.0, widthCm: 35, heightCm: 25 },
      { id: 'dim-hc-md', labelAr: 'كبير 45 × 35 × 28 سم', labelEn: 'Large (45 × 35 × 28 cm)', multiplier: 1.4, widthCm: 45, heightCm: 35 },
      { id: 'dim-hc-xl', labelAr: 'جامبو 60 × 40 × 40 سم', labelEn: 'Jumbo (60 × 40 × 40 cm)', multiplier: 1.9, widthCm: 60, heightCm: 40 },
    ],
    materials: [
      { id: 'mat-hc-brown', labelAr: 'كرتون كرافت بني صناعي معزز', labelEn: 'Reinforced Industrial Brown Kraft', priceAdd: 0 },
      { id: 'mat-hc-waterproof', labelAr: 'كرتون معالج بطبقة مقاومة للرطوبة', labelEn: 'Moisture-Resistant Treated Board', priceAdd: 600 },
    ],
    tierPricing: [
      { minQty: 25, maxQty: 49, discountPercent: 0, labelAr: '25 - 49 كرتون: 3,200 د.ع / كرتون', labelEn: '25 - 49 pcs: 3,200 IQD/ea' },
      { minQty: 50, maxQty: 99, discountPercent: 15, labelAr: '50 - 99 كرتون: 2,720 د.ع / كرتون', labelEn: '50 - 99 pcs: 2,720 IQD/ea' },
      { minQty: 100, discountPercent: 28, labelAr: '100+ كرتون: 2,300 د.ع / كرتون', labelEn: '100+ pcs: 2,300 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: false,
    minQuantity: 25,
    leadTimeAr: '2 - 4 أيام عمل',
    leadTimeEn: '2 - 4 Business Days',
  },
  {
    id: 'prod-shoe-apparel-kraft-box',
    slug: 'shoe-apparel-kraft-carton-box',
    titleAr: 'علب أحذية وملابس',
    titleEn: 'Two-Piece Apparel Box',
    category: 'boxes',
    categoryLabelAr: 'علب كرتونية',
    categoryLabelEn: 'Carton Packaging',
    basePrice: 2800,
    descriptionAr: 'صندوق كرتون كرافت مكون من قطعتين (قاعدة وغطاء منفصل) مع فتحة تهوية دائرية مخصصة لحفظ الأحذية الرياضية والملابس الجلدية والمنسوجات مع طباعة مخصصة للشعار.',
    descriptionEn: 'Rigid-fold two-piece kraft cardboard shoe and apparel box featuring die-cut ventilation finger hole and clean telescope lid design.',
    image: '/images/products/shoe_box_front_1792355454547.jpg',
    galleryImages: [
      '/images/products/shoe_box_front_1792355454547.jpg',
      '/images/products/shoe_box_open_1792412337008.jpg',
      '/images/products/shoe_box_top_1792412349874.jpg',
      '/images/products/shoe_box_side_1792412362959.jpg',
      '/images/products/shoe_box_detail_1792412377959.jpg',
    ],
    featuresAr: ['تصميم قطعتين تلسكوبي غطاء وقاعدة منفصلة', 'فتحة تهوية ليزرية دائرية لحماية الجلود والأقمشة', 'كرتون كرافت سميك يحافظ على استقامة وشكل الحذاء والملبوسات', 'طباعة فخمة بالألوان أو بصمة حرارية على الغطاء'],
    featuresEn: ['Two-piece telescope lid and tray construction', 'Laser die-cut ventilation finger hole', 'Rigid heavy kraft board maintains structural shape', 'High precision lid printing or hot foil stamping'],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'كرتون كرافت صلب 400 غم قابل للطي الذاتي', valEn: 'Heavyweight Foldable Kraft Board (400gsm)' },
      { keyAr: 'نوع الغطاء', keyEn: 'Lid Style', valAr: 'غطاء تلسكوبي علوي كامل التغطية', valEn: 'Full Telescope Removable Lid' },
      { keyAr: 'فتحة التهوية', keyEn: 'Ventilation', valAr: 'فتحة دائرية مقصوصة بقطر 22 ملم', valEn: '22mm Circular Die-Cut Vent Hole' },
    ],
    dimensions: [
      { id: 'dim-sb-standard', labelAr: 'أحذية قياسي 32 × 20 × 12 سم', labelEn: 'Standard Footwear (32 × 20 × 12 cm)', multiplier: 1.0, widthCm: 32, heightCm: 20 },
      { id: 'dim-sb-boots', labelAr: 'أحذية بوت طويل / شتوي 35 × 28 × 14 سم', labelEn: 'Boots & Winter (35 × 28 × 14 cm)', multiplier: 1.3, widthCm: 35, heightCm: 28 },
      { id: 'dim-sb-apparel', labelAr: 'ملابس وعبايات مسطح 38 × 28 × 8 سم', labelEn: 'Apparel & Knitwear (38 × 28 × 8 cm)', multiplier: 1.25, widthCm: 38, heightCm: 28 },
    ],
    materials: [
      { id: 'mat-sb-kraft', labelAr: 'كرتون كرافت طبيعي بني سميك', labelEn: 'Heavy Natural Brown Kraft', priceAdd: 0 },
      { id: 'mat-sb-black', labelAr: 'كرتون أسود ملكي مطفي أنيق', labelEn: 'Royal Black Matte Stock', priceAdd: 400 },
    ],
    tierPricing: [
      { minQty: 30, maxQty: 59, discountPercent: 0, labelAr: '30 - 59 علبة: 2,800 د.ع / علبة', labelEn: '30 - 59 pcs: 2,800 IQD/ea' },
      { minQty: 60, maxQty: 119, discountPercent: 15, labelAr: '60 - 119 علبة: 2,380 د.ع / علبة', labelEn: '60 - 119 pcs: 2,380 IQD/ea' },
      { minQty: 120, discountPercent: 26, labelAr: '120+ علبة: 2,070 د.ع / علبة', labelEn: '120+ pcs: 2,070 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 30,
    leadTimeAr: '3 - 5 أيام عمل',
    leadTimeEn: '3 - 5 Business Days',
  },
  {
    id: 'prod-gable-handle-kraft-box',
    slug: 'gable-handle-kraft-gift-box',
    titleAr: 'علب كرافت بمقبض',
    titleEn: 'Gable Handle Kraft Box',
    category: 'boxes',
    categoryLabelAr: 'علب كرتونية',
    categoryLabelEn: 'Carton Packaging',
    basePrice: 1600,
    descriptionAr: 'علبة كرتون كرافت مبتكرة ذات سقف مائل ومقبض حمل مدمج يقفل ذاتياً دون صمغ، مثالية للمطاعم والمقاهي ومحلات الحلويات وتوزيعات الهدايا والمعارض.',
    descriptionEn: 'Self-assembling kraft gable carton box with integrated die-cut carrying handle and interlocking roof tabs. Perfect for gifts, bakeries, and food takeaway.',
    image: '/images/products/gable_box_front_1792412394812.jpg',
    galleryImages: [
      '/images/products/gable_box_front_1792412394812.jpg',
      '/images/products/gable_box_open_1792412409607.jpg',
      '/images/products/gable_box_top_1792412423705.jpg',
      '/images/products/gable_box_side_1792412437793.jpg',
      '/images/products/gable_box_detail_1792412451851.jpg',
    ],
    featuresAr: ['مقبض يد مدمج مريح في الحمل والتنقل', 'تركيب أوتوماتيكي سريع بقفل ميكانيكي آمن', 'مناسب للأطعمة الجافة والحلويات وتوزيعات المناسبات', 'ورق كرافت صحي وآمن ملامس للأغذية'],
    featuresEn: ['Integrated ergonomic die-cut carry handle', 'Fast tool-free self-locking assembly', 'Food-safe certified virgin kraft paperboard', 'Great visibility and flat panels for branding'],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'كرتون كرافت غذائي معتمد 350 غم', valEn: 'Food-Grade Certified Kraft Board (350gsm)' },
      { keyAr: 'آلية القفل', keyEn: 'Locking System', valAr: 'قفل علوي ثنائي مع لسان جانبي مانع للفتح', valEn: 'Interlocking Top Roof with Dual Side Tabs' },
      { keyAr: 'تحمل الوزن', keyEn: 'Load Capacity', valAr: 'يحمل حتى 2.5 كغم بكل أمان', valEn: 'Safe payload up to 2.5kg' },
    ],
    dimensions: [
      { id: 'dim-gb-sm', labelAr: 'صغير 16 × 9 × 15 سم', labelEn: 'Small (16 × 9 × 15 cm)', multiplier: 1.0, widthCm: 16, heightCm: 9 },
      { id: 'dim-gb-md', labelAr: 'متوسط 22 × 12 × 20 سم', labelEn: 'Medium (22 × 12 × 20 cm)', multiplier: 1.35, widthCm: 22, heightCm: 12 },
      { id: 'dim-gb-lg', labelAr: 'كبير 28 × 16 × 24 سم', labelEn: 'Large (28 × 16 × 24 cm)', multiplier: 1.7, widthCm: 28, heightCm: 16 },
    ],
    materials: [
      { id: 'mat-gb-natural', labelAr: 'كرتون كرافت طبيعي بيئي ذهبي', labelEn: 'Natural Golden Kraft Paperboard', priceAdd: 0 },
      { id: 'mat-gb-white', labelAr: 'كرتون أبيض مع سلفنة مضادة للدهون', labelEn: 'White Greaseproof Barrier Board', priceAdd: 250 },
    ],
    tierPricing: [
      { minQty: 50, maxQty: 99, discountPercent: 0, labelAr: '50 - 99 علبة: 1,600 د.ع / علبة', labelEn: '50 - 99 pcs: 1,600 IQD/ea' },
      { minQty: 100, maxQty: 249, discountPercent: 18, labelAr: '100 - 249 علبة: 1,310 د.ع / علبة', labelEn: '100 - 249 pcs: 1,310 IQD/ea' },
      { minQty: 250, discountPercent: 30, labelAr: '250+ علبة: 1,120 د.ع / علبة', labelEn: '250+ pcs: 1,120 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 50,
    leadTimeAr: '3 - 5 أيام عمل',
    leadTimeEn: '3 - 5 Business Days',
  },
  {
    id: 'prod-crystal-acrylic-card',
    slug: 'crystal-acrylic-business-cards',
    titleAr: 'كروت أكريليك شفافة',
    titleEn: 'Crystal Acrylic Business Cards',
    category: 'cards',
    categoryLabelAr: 'كروت وهويات',
    categoryLabelEn: 'Business Stationery',
    basePrice: 1200,
    descriptionAr: 'بطاقات عمل مصنوعة من الأكريليك الكريستالي النقي غير القابل للخدش بسماكة 2 ملم، مع طباعة UV متطورة أو حفر ليزري أبيض يعطي هيبة لا تضاهى.',
    descriptionEn: 'Precision laser cut 2mm crystal-clear optical acrylic business cards with raised UV printing or frosted white laser etching for unforgettable impressions.',
    image: '/images/products/luxury_foil_cards.jpg',
    galleryImages: [
      '/images/products/luxury_foil_cards.jpg',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['أكريليك كاست نقي 2 ملم مصقول الحواف بالماس', 'طباعة UV ملونة مع حبر أبيض كثيف', 'مقاوم للماء والتمزق ويدوم للأبد', 'علبة أكريليك فاخرة مجاناً'],
    featuresEn: ['2mm optical acrylic with diamond-burnished borders', 'Vibrant UV printing with solid white underbase', 'Waterproof, tearproof and indestructible', 'Includes complimentary acrylic presentation tray'],
    specifications: [
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'أكريليك كاست نقي 100% سماكة 2 ملم', valEn: '100% Optical Cast Acrylic 2mm' },
      { keyAr: 'المقاس', keyEn: 'Dimensions', valAr: '8.5 × 5.4 سم مع حواف دائرية ناعمة', valEn: '8.5 × 5.4 cm with Rounded Corners' },
    ],
    dimensions: [
      { id: 'dim-acr-std', labelAr: 'قياسي بطاقة بنكية (8.5 × 5.4 سم)', labelEn: 'Credit Card Std (8.5 × 5.4 cm)', multiplier: 1.0, widthCm: 8.5, heightCm: 5.4 },
      { id: 'dim-acr-sq', labelAr: 'مربع عصري (6 × 6 سم)', labelEn: 'Modern Square (6 × 6 cm)', multiplier: 1.1, widthCm: 6, heightCm: 6 },
    ],
    materials: [
      { id: 'mat-acr-clear', labelAr: 'أكريليك شفاف كريستالي 100%', labelEn: '100% Crystal Clear Acrylic', priceAdd: 0 },
      { id: 'mat-acr-frosted', labelAr: 'أكريليك مثلج ضبابي راقي (Frosted)', labelEn: 'Frosted Matte Translucent', priceAdd: 150 },
      { id: 'mat-acr-black', labelAr: 'أكريليك أسود بيانو لمّاع فاخر', labelEn: 'Piano Gloss Black Acrylic', priceAdd: 200 },
    ],
    tierPricing: [
      { minQty: 50, maxQty: 99, discountPercent: 0, labelAr: '50 - 99 كارت: 1,200 د.ع / كارت', labelEn: '50 - 99 cards: 1,200 IQD/ea' },
      { minQty: 100, maxQty: 249, discountPercent: 20, labelAr: '100 - 249 كارت: 960 د.ع / كارت', labelEn: '100 - 249 cards: 960 IQD/ea' },
      { minQty: 250, discountPercent: 35, labelAr: '250+ كارت: 780 د.ع / كارت', labelEn: '250+ cards: 780 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 50,
    leadTimeAr: '2 - 4 أيام عمل',
    leadTimeEn: '2 - 4 Business Days',
  },
  {
    id: 'prod-duplex-gilded-cards',
    slug: 'duplex-cotton-gilded-edge-cards',
    titleAr: 'كروت بحواف مذهبة',
    titleEn: '360° Gilded Edge Cards',
    category: 'cards',
    categoryLabelAr: 'كروت وهويات',
    categoryLabelEn: 'Business Stationery',
    basePrice: 650,
    descriptionAr: 'كروت قطنية فائقة السماكة 700 غم مصنوعة من طبقتين مكبوسة مع تذهيب حواف معدني عاكس يحيط بالكرت 360 درجة، وبصمة حرارية ألمانية ناصعة.',
    descriptionEn: 'Ultra-heavy 700gsm duplex bonded cotton board with 360-degree mirror gold edge gilding and precision German hot foil stamping.',
    image: '/images/products/luxury_foil_cards.jpg',
    galleryImages: [
      '/images/products/luxury_foil_cards.jpg',
    ],
    featuresAr: ['ورق قطني سميك 700 غم مزدوج الطبقات', 'تذهيب حواف يدوي عاكس كالمرآة', 'كبس لتربرس غائر ملموس بالأصابع', 'مقاوم للانحناء تماماً'],
    featuresEn: ['700gsm duplex bonded pure cotton stock', 'Hand-burnished mirror metallic edge gilding', 'Tactile deep letterpress deboss', 'Rigid unbendable thickness'],
    specifications: [
      { keyAr: 'الوزن', keyEn: 'Weight', valAr: '700 غم/م² قطن طبيعي عالي الكثافة (سماكة 1.1 ملم)', valEn: '700gsm Cotton (1.1mm Caliper)' },
      { keyAr: 'التذهيب', keyEn: 'Gilding', valAr: 'تذهيب حواف 360° ذهبي أو فضي لامع', valEn: '360° Mirror Gold or Silver Gilding' },
    ],
    dimensions: [
      { id: 'dim-dup-std', labelAr: 'المقاس القياسي العالمي (9 × 5 سم)', labelEn: 'Standard 9 × 5 cm', multiplier: 1.0, widthCm: 9, heightCm: 5 },
      { id: 'dim-dup-sq', labelAr: 'مربع نخبوي (6 × 6 سم)', labelEn: 'Square 6 × 6 cm', multiplier: 1.15, widthCm: 6, heightCm: 6 },
    ],
    materials: [
      { id: 'mat-dup-gold', labelAr: 'قطن عاجي 700 غم + حواف ذهبية مذهبة', labelEn: 'Ivory Cotton + Gold Gilded Edges', priceAdd: 0 },
      { id: 'mat-dup-black', labelAr: 'أسود ملكي + حواف فضية بلاتينية', labelEn: 'Royal Black Core + Silver Gilded', priceAdd: 50 },
    ],
    tierPricing: [
      { minQty: 100, maxQty: 249, discountPercent: 0, labelAr: '100 كارت: 650 د.ع / كارت', labelEn: '100 cards: 650 IQD/ea' },
      { minQty: 250, maxQty: 499, discountPercent: 15, labelAr: '250 كارت: 550 د.ع / كارت', labelEn: '250 cards: 550 IQD/ea' },
      { minQty: 500, discountPercent: 28, labelAr: '500+ كارت: 468 د.ع / كارت', labelEn: '500+ cards: 468 IQD/ea' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 100,
    leadTimeAr: '3 - 5 أيام عمل',
    leadTimeEn: '3 - 5 Business Days',
  },
  {
    id: 'prod-crystal-award-trophy',
    slug: 'prestige-acrylic-crystal-award-trophy',
    titleAr: 'درع تكريم أكريليك وزان',
    titleEn: 'Prestige Acrylic Award Trophy',
    category: 'led',
    categoryLabelAr: 'دروع وإضاءة 3D LED',
    categoryLabelEn: 'Awards & Trophies',
    basePrice: 38000,
    descriptionAr: 'درع تكريم نخبوي من الأكريليك الشفاف بسماكة 10 ملم مع حواف مصقولة بالماس، حفر ليزري ميكروني معبأ بطلاء الذهب، وقاعدة من خشب الزان الطبيعي مع إضاءة محيطية.',
    descriptionEn: 'High-prestige 10mm cast acrylic corporate award with diamond-polished bevels, micron laser engraving with gold leaf infill, and solid beech wood LED base.',
    image: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
    galleryImages: [
      '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
      '/images/products/desk_plaque_studio_bg.jpg',
    ],
    featuresAr: ['أكريليك كاست فائق النقاء سماكة 10 ملم', 'حفر ليزري للشعار والاسم والنص التقديري', 'قاعدة زان طبيعي مع لمبة LED دافئة خفية', 'علبة هدايا مبطنة بالساتان مجاناً مع الدرع'],
    featuresEn: ['10mm ultra-clarity cast acrylic trophy slab', 'Sub-millimeter laser vector crest & name engraving', 'Solid beech wood base with ambient warm LED', 'Complimentary satin-lined velvet gift box included'],
    specifications: [
      { keyAr: 'سماكة الأكريليك', keyEn: 'Acrylic Thickness', valAr: '10 ملم مع شطف زوايا ميكروني بالماس', valEn: '10mm Beveled Diamond Polish' },
      { keyAr: 'القاعدة', keyEn: 'Base', valAr: 'خشب زان طبيعي أوروبي مصمت مع مفتاح لمس', valEn: 'European Solid Beech Wood with Touch Switch' },
    ],
    dimensions: [
      { id: 'dim-trophy-std', labelAr: 'قياسي (22 × 16 سم)', labelEn: 'Standard (22 × 16 cm)', multiplier: 1.0, widthCm: 16, heightCm: 22 },
      { id: 'dim-trophy-lg', labelAr: 'كبير رسمي (28 × 20 سم)', labelEn: 'Executive (28 × 20 cm)', multiplier: 1.4, widthCm: 20, heightCm: 28 },
    ],
    materials: [
      { id: 'mat-trophy-wood', labelAr: 'قاعدة زان طبيعي + إضاءة LED دافئة', labelEn: 'Natural Beech Wood + Warm LED', priceAdd: 0 },
      { id: 'mat-trophy-black', labelAr: 'قاعدة رخامية سوداء ملكية', labelEn: 'Royal Black Marble Style Base', priceAdd: 6000 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 2, discountPercent: 0, labelAr: '1 - 2 درع: السعر الفردي', labelEn: '1 - 2 pcs: Standard' },
      { minQty: 3, maxQty: 9, discountPercent: 12, labelAr: '3 - 9 دروع: خصم مؤتمرات 12%', labelEn: '3 - 9 pcs: 12% Conference Discount' },
      { minQty: 10, discountPercent: 25, labelAr: '10+ دروع: خصم مؤسسات 25%', labelEn: '10+ pcs: 25% Enterprise Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 1,
    leadTimeAr: '24 - 48 ساعة',
    leadTimeEn: '24 - 48 Hours',
  },
  {
    id: 'prod-wall-floating-shield',
    slug: 'floating-illuminated-wall-acrylic-sign',
    titleAr: 'شيلد جداري مضيء',
    titleEn: 'Floating Illuminated Wall Sign',
    category: 'led',
    categoryLabelAr: 'لوحات مكاتب وشركات',
    categoryLabelEn: 'Commercial Signage',
    basePrice: 65000,
    descriptionAr: 'لوحة جدارية فاخرة للشعار والاسم التجاري مصنعة من طبقات الأكريليك المزدوج، مثبتة بمسامير استانلس عائمة مع إضاءة خلفية هيدن LED تمنح الجدار طابعاً مستقبلياً مبهراً.',
    descriptionEn: 'Architectural layered acrylic wall crest with concealed halo backlighting and brushed stainless steel standoffs for corporate lobbies.',
    image: '/images/products/travel_agency_wall_front_1791817427540.jpg',
    galleryImages: [
      '/images/products/travel_agency_wall_front_1791817427540.jpg',
      '/images/products/travel_agency_wall_angle_1791817499977.jpg',
    ],
    featuresAr: ['طبقات أكريليك مزدوجة مع بروز ثلاثي الأبعاد', 'إضاءة خلفية هيلو (Halo Glow) تدوم +50,000 ساعة', 'مسامير تباعد استانلس ستيل عائمة مجاناً', 'توصيل مباشر مع محول 12V معتمد'],
    featuresEn: ['Layered 3D dimensional acrylic structure', 'Halo backlighting rated for 50,000+ hours', 'Includes heavy-duty stainless steel standoff bolts', 'Supplied with certified 12V power supply'],
    specifications: [
      { keyAr: 'المقاس الأساسي', keyEn: 'Dimensions', valAr: '50 × 35 سم أو 70 × 50 سم', valEn: '50 × 35 cm or 70 × 50 cm' },
      { keyAr: 'المواد', keyEn: 'Materials', valAr: 'أكريليك كاست 5 ملم + خلفية مضيئة + استانلس', valEn: '5mm Cast Acrylic + LED Halo + Standoffs' },
    ],
    dimensions: [
      { id: 'dim-wall-50', labelAr: '50 × 35 سم (للمكاتب الفردية)', labelEn: '50 × 35 cm (Solo Office)', multiplier: 1.0, widthCm: 50, heightCm: 35 },
      { id: 'dim-wall-70', labelAr: '70 × 50 سم (للاستقبال والمعارض)', labelEn: '70 × 50 cm (Reception Area)', multiplier: 1.6, widthCm: 70, heightCm: 50 },
    ],
    materials: [
      { id: 'mat-wall-ice', labelAr: 'أكريليك ثلجي مات مع إضاءة دافئة', labelEn: 'Frosted Acrylic with Warm Halo', priceAdd: 0 },
      { id: 'mat-wall-gold', labelAr: 'أكريليك مرآة ذهبي مع إضاءة بيضاء ناصعة', labelEn: 'Gold Mirror Acrylic with Crisp White Halo', priceAdd: 12000 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 1, discountPercent: 0, labelAr: 'قطعة واحدة: السعر الأساسي', labelEn: '1 pc: Standard' },
      { minQty: 2, maxQty: 4, discountPercent: 15, labelAr: '2 - 4 قطع: خصم فروع 15%', labelEn: '2 - 4 pcs: 15% Branch Discount' },
      { minQty: 5, discountPercent: 25, labelAr: '5+ قطع: خصم شركات 25%', labelEn: '5+ pcs: 25% Corporate Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 1,
    leadTimeAr: '3 - 5 أيام عمل',
    leadTimeEn: '3 - 5 Business Days',
  },
  {
    id: 'prod-graduation-trophy',
    slug: 'graduation-milestone-trophy-portrait',
    titleAr: 'درع تخرج وبورتريه',
    titleEn: 'Graduation Milestone Trophy',
    category: 'portraits',
    categoryLabelAr: 'بورتريه ورسومات',
    categoryLabelEn: 'Portraits & Milestones',
    basePrice: 35000,
    descriptionAr: 'درع تخرج فخم يجمع بين صورة الخريج المحفورة ليزرياً بأسلوب الفيكتور، مع قسم المهنة أو التهنئة بالخط الديواني وقاعدة خشبية مع إضاءة دافئة.',
    descriptionEn: 'Custom engraved laser graduation commemorative plaque featuring student portrait vector engraving, professional oath or university insignia, and solid wood LED base.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['حفر صورة التخرج بالفيكتور الليزري بدقة ميكرونية', 'كتابة اسم الدكتور/المهندس وسنة التخرج والجامعة', 'قاعدة خشبية مع زر لمس وإضاءة دافئة', 'تغليف هدايا فاخر جاهز للتقديم'],
    featuresEn: ['Precision vector laser portrait engraving', 'Custom graduate title, oath and university crest', 'Solid beech wood base with ambient illumination', 'Gift ready packaging with satin lining'],
    specifications: [
      { keyAr: 'المقاس', keyEn: 'Dimensions', valAr: '20 × 16 سم مع قاعدة خشبية', valEn: '20 × 16 cm with Wooden Stand' },
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'أكريليك كاست 4 ملم + خشب زان طبيعي', valEn: '4mm Cast Acrylic + Solid Natural Beech' },
    ],
    dimensions: [
      { id: 'dim-grad-std', labelAr: 'قياسي (20 × 16 سم)', labelEn: 'Standard (20 × 16 cm)', multiplier: 1.0, widthCm: 16, heightCm: 20 },
      { id: 'dim-grad-lg', labelAr: 'كبير رسمي (26 × 20 سم)', labelEn: 'Large (26 × 20 cm)', multiplier: 1.35, widthCm: 20, heightCm: 26 },
    ],
    materials: [
      { id: 'mat-grad-wood', labelAr: 'قاعدة زان طبيعي مع مفتاح لمس', labelEn: 'Natural Beech with Touch Sensor', priceAdd: 0 },
      { id: 'mat-grad-black', labelAr: 'قاعدة خشبية سوداء فاحمة', labelEn: 'Executive Piano Black Base', priceAdd: 4000 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 1, discountPercent: 0, labelAr: 'قطعة واحدة: السعر الفردي', labelEn: '1 pc: Standard' },
      { minQty: 2, maxQty: 5, discountPercent: 12, labelAr: '2 - 5 قطع: خصم زملاء التخرج 12%', labelEn: '2 - 5 pcs: 12% Peer Discount' },
      { minQty: 6, discountPercent: 22, labelAr: '6+ قطع: خصم دفعات 22%', labelEn: '6+ pcs: 22% Bulk Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: true,
    minQuantity: 1,
    leadTimeAr: '24 - 48 ساعة',
    leadTimeEn: '24 - 48 Hours',
  },
  {
    id: 'prod-wedding-guestbook',
    slug: 'gold-mirror-acrylic-wedding-keepsake',
    titleAr: 'لوحة زفاف ملكية',
    titleEn: 'Royal Mirror Wedding Plaque',
    category: 'weddings',
    categoryLabelAr: 'مناسبات وزفاف',
    categoryLabelEn: 'Wedding & Keepsakes',
    basePrice: 45000,
    descriptionAr: 'لوحة استقبال وتوثيق مناسبات الزفاف والخطوبة مصنعة من أكريليك المرآة الذهبي أو الفضي العاكس مع خطوط عربية ديوانية ساحرة وحامل خشبي لعرضها بصالة الفرح.',
    descriptionEn: 'Luxury reflective gold or silver mirror acrylic wedding entrance plaque inscribed with romantic Arabic calligraphy, floral wreath motif, and easel stand.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['أكريليك مرآة ذهبي عاكس نقي كالمعدن المصقول', 'كتابة أسماء العروسين وتاريخ المناسبة بالخط العربي', 'يتضمن استاند عرض خشبي مخصص للاستقبال', 'مقاوم للخدش وسهل التنظيف'],
    featuresEn: ['High-reflection mirror gold acrylic surface', 'Custom couple names and date in calligraphy', 'Includes matching solid wood display easel', 'Scratch-resistant protective coating'],
    specifications: [
      { keyAr: 'المقاس', keyEn: 'Dimensions', valAr: '30 × 20 سم أو 40 × 30 سم', valEn: '30 × 20 cm or 40 × 30 cm' },
      { keyAr: 'الخامة', keyEn: 'Material', valAr: 'أكريليك مرآة ذهبي أو فضي 3 ملم', valEn: '3mm Mirror Gold / Silver Acrylic' },
    ],
    dimensions: [
      { id: 'dim-wed-30', labelAr: '30 × 20 سم (لطاولة الاستقبال والبيت)', labelEn: '30 × 20 cm (Tabletop Display)', multiplier: 1.0, widthCm: 20, heightCm: 30 },
      { id: 'dim-wed-40', labelAr: '40 × 30 سم (مدخل القاعة الرسمي)', labelEn: '40 × 30 cm (Grand Hall Entrance)', multiplier: 1.45, widthCm: 30, heightCm: 40 },
    ],
    materials: [
      { id: 'mat-wed-gold', labelAr: 'أكريليك مرآة ذهبي لامع كلاسيكي', labelEn: 'Mirror Gold Reflective Acrylic', priceAdd: 0 },
      { id: 'mat-wed-silver', labelAr: 'أكريليك مرآة فضي بلاتيني ساحر', labelEn: 'Mirror Silver Platinum Acrylic', priceAdd: 0 },
      { id: 'mat-wed-rose', labelAr: 'أكريليك مرآة روز قولد ملكي', labelEn: 'Mirror Rose Gold Luxury', priceAdd: 3000 },
    ],
    tierPricing: [
      { minQty: 1, maxQty: 1, discountPercent: 0, labelAr: 'قطعة واحدة: السعر الأساسي', labelEn: '1 pc: Standard' },
      { minQty: 2, discountPercent: 15, labelAr: '2+ قطع: خصم 15%', labelEn: '2+ pcs: 15% off' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: false,
    minQuantity: 1,
    leadTimeAr: '48 - 72 ساعة',
    leadTimeEn: '48 - 72 Hours',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    titleAr: 'درع طائرة ثلاثي الأبعاد مضيء 3D LED',
    titleEn: 'Boeing 3D Optical Illusion LED Trophy',
    category: 'led',
    clientAr: 'شركة سياحة وخطوط جوية - بغداد',
    clientEn: 'Aviation & Travel Enterprise - Baghdad',
    image: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
    descriptionAr: 'درع أكريليك مخصص ومحفور بتقنية 3D LED بقاعدة لمس بيضاء وإضاءة بنفسجية ساحرة مع خطوط مسارات الطائرة ومعالم سياحية عالمية.',
    descriptionEn: 'Engineered with sub-millimeter laser line dispersion across optical acrylic, featuring purple ambient lighting and touch base.',
    dimensions: '22 × 19 cm',
    materialsAr: 'أكريليك نقي 5 مم + قاعدة بيضاء بمفتاح لمس + LED بنفسجي',
    materialsEn: '5mm Cast Optical Acrylic + White Touch Base + Violet LED',
    featured: true,
    relatedProductId: 'prod-airplane-led',
  },
  {
    id: 'port-2',
    titleAr: 'لوحة استقبال مضيئة لشركة الأفق للسفر والسياحة',
    titleEn: 'Illuminated Reception Sign - Al-Ufoq Travel',
    category: 'led',
    clientAr: 'شركة الأفق الدولية للسياحة - المنصور، بغداد',
    clientEn: 'Al-Ufoq Travel & Tourism HQ - Mansour, Baghdad',
    image: '/images/products/travel_agency_wall_front_1791817427540.jpg',
    descriptionAr: 'لوحة مكاتب جدارية بارتفاع 80 سم مع شعار مفرغ بالليزر وإضاءة بلون أزرق سماوي وأبيض ثلجي مخصصة لمدخل الشركة.',
    descriptionEn: '80cm custom wall sign featuring floating standoff spacers, backlit cyan LED logo halo, and frosted acrylic depth plates.',
    dimensions: '80 × 50 cm',
    materialsAr: 'أكريليك مثلج 6 مم + مسامير استيل مقاومة + LED سمارت 12V',
    materialsEn: '6mm Frosted Cast Acrylic + Standoff Stainless Steel + 12V LED',
    featured: true,
    relatedProductId: 'prod-travel-acrylic-sign',
  },
  {
    id: 'port-3',
    titleAr: 'لوحة توثيق تاريخ الزواج والخطوبة بالخط الديواني',
    titleEn: 'Engraved Wedding Timeline Keepsake Plaque',
    category: 'weddings',
    clientAr: 'عائلة الجميلي - بغداد',
    clientEn: 'Al-Jumaily Family - Baghdad',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'توثيق لمواعيد الزفاف والخطوبة بتخطيط عربي أصيل مع قاعدة محفورة بالليزر وإضاءة خافتة مناسبة لغرف النوم والمجالس.',
    descriptionEn: 'Bespoke milestone timeline commemorating the first meeting, civil contract, and wedding night with delicate Diwani calligraphy.',
    dimensions: '28 × 22 cm',
    materialsAr: 'أكريليك كريستالي نقي + خشب زان محفور + شريط إضاءة دافئ',
    materialsEn: 'Crystal Pure Acrylic + Engraved Oak + Warm Amber Lighting',
    featured: true,
    relatedProductId: 'prod-wedding-timeline',
  },
  {
    id: 'port-4',
    titleAr: 'بورتريه فيكتور مخصص لشخصية تذكارية',
    titleEn: 'Hand-Illustrated Vector Line Portrait Nightlight',
    category: 'portraits',
    clientAr: 'طلب خاص - هدية تخرج لطبيب',
    clientEn: 'Private Commission - Medical Graduate Gift',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'تم تحويل صورة شخصية إلى لوحة فيكتور دقيقة بالكامل ونقشها بدقة متناهية على لوح أكريليك مع كتابة بيت شعر مهدى.',
    descriptionEn: 'Custom illustrated vector line art converted into sub-millimeter laser scoring with personalized engraved dedication.',
    dimensions: '22 × 17 cm',
    materialsAr: 'أكريليك عالي الشفافية + قاعدة خشبية بمفتاح لمس',
    materialsEn: 'Virgin Cast Acrylic + Wooden Touch Sensor Base',
    featured: true,
    relatedProductId: 'prod-vector-portrait',
  },
  {
    id: 'port-5',
    titleAr: 'علب تغليف كرتونية فاخرة لعلامة عطور عراقية',
    titleEn: 'Rigid Fragrance Box Packaging - Excellence Brand',
    category: 'boxes',
    clientAr: 'براند إكسلنس للعطور الفاخرة - بغداد',
    clientEn: 'Excellence Luxury Perfumes - Baghdad',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'صناديق مقواة 1200 غم مكسوة بورق فني ذو ملمس مخملي ناعم، مع بصمة حرارية ذهبية وقالب إسفنج ليزري مخصص لزجاجة العطر.',
    descriptionEn: '1200gsm rigid setup box with soft-touch matte lamination, hot-stamped gold foil logo, and custom laser-cut EVA insert.',
    dimensions: '18 × 12 × 7 cm',
    materialsAr: 'كرتون رمادي 1200 غم + ورق مخملي + بصمة ذهبية + إسفنج EVA',
    materialsEn: '1200gsm Rigid Greyboard + Soft Velvet Paper + Gold Foil + EVA',
    featured: true,
    relatedProductId: 'prod-rigid-boxes',
  },
  {
    id: 'port-6',
    titleAr: 'بطاقات عمل فاخرة مع حواف مذهبة وبصمة حرارية',
    titleEn: 'Gilded-Edge Cotton Cards - Law Consultancy',
    category: 'cards',
    clientAr: 'مكتب المحامي حيدر الربيعي - الكرادة',
    clientEn: 'Al-Rubaie Law Consultants - Karrada, Baghdad',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'كروت أعمال مصنوعة من القطن الإيطالي الخالص 600 غم بلون أسود ملكي وبصمة حرارية برونزية مع حواف مطلية بالذهب اللامع.',
    descriptionEn: 'Italian double-weight 600gsm deep black cotton card stock with bronze foil debossing and hand-mirrored gold edge gilding.',
    dimensions: '9 × 5 cm',
    materialsAr: 'ورق قطني 600 غم + بصمة حرارية + تذهيب حواف',
    materialsEn: '600gsm Cotton Stock + Foil Deboss + Mirror Gold Edging',
    featured: true,
    relatedProductId: 'prod-foil-cards',
  },
];

export const COMPANY_CONTACT = {
  phone: '+964 780 000 0000',
  phoneDisplay: '+964 780 000 0000',
  whatsappUrl: 'https://wa.me/9647800000000',
  email: 'info@noonwalqalam.com',
  addressAr: 'العراق، بغداد - المنصور / الكرادة',
  addressEn: 'Al-Mansour / Karrada, Baghdad, Iraq',
  workingHoursAr: 'السبت - الخميس: 9:00 ص - 9:00 م',
  workingHoursEn: 'Sat - Thu: 9:00 AM - 9:00 PM',
};
