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
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
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
      { id: 'led-skyblue', nameAr: 'أزرق سماوي (Sky Blue)', nameEn: 'Sky Blue', hex: '#87CEEB', glowClass: 'shadow-[0_0_30px_rgba(135,206,235,0.5)]' },
      { id: 'led-lightpurple', nameAr: 'بنفسجي لافندر (Light Purple)', nameEn: 'Light Purple', hex: '#E6E6FA', glowClass: 'shadow-[0_0_30px_rgba(230,230,250,0.5)]' },
      { id: 'led-warmwhite', nameAr: 'أبيض دافئ (Warm White)', nameEn: 'Warm White', hex: '#FEF3C7', glowClass: 'shadow-[0_0_30px_rgba(254,243,199,0.5)]' },
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
    titleAr: 'مصباح طائرة ثلاثي الأبعاد 3D LED',
    titleEn: '3D LED Optical Airplane Lamp',
    category: 'led',
    categoryLabelAr: 'إضاءة ومجسمات LED',
    categoryLabelEn: '3D LED Lamps',
    basePrice: 35000,
    descriptionAr: 'تحفة ضوئية مصنوعة من أكريليك فائق النقاوة مقصوص بالليزر ليعطي انطباعاً ثلاثي الأبعاد مع قاعدة خشبية فاخرة وإضاءة دافئة مريحة للعين.',
    descriptionEn: 'Precision laser-engraved optical illusion lamp crafted from crystal-clear acrylic on a solid wooden base with soft, ambient LED lighting.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: ['أكريليك كاست نقي 4 مم مقاوم للاصفرار', 'قاعدة خشب زان طبيعي محفورة مع مفتاح لمس', 'وصلة USB 5V متوافقة مع شواحن الهاتف والباوربانك', 'عمر افتراضي لشرائح LED يتجاوز 50,000 ساعة'],
    featuresEn: ['4mm virgin cast acrylic with anti-yellowing tech', 'Solid natural beech base with integrated touch switch', 'Universal 5V USB cord compatible with phone chargers', 'Rated LED ribbon lifespan exceeding 50,000 hours'],
    specifications: [
      { keyAr: 'نوع الخامة', keyEn: 'Material', valAr: 'أكريليك بصري نقي 100% (Cast Acrylic)', valEn: '100% Pure Optical Cast Acrylic' },
      { keyAr: 'سماكة اللوح', keyEn: 'Plate Thickness', valAr: '4 ملم', valEn: '4.0 mm' },
      { keyAr: 'القاعدة الحاملة', keyEn: 'Base Unit', valAr: 'خشب زان طبيعي معالج بالزيوت النباتية', valEn: 'Solid Beech Wood Oil Finished' },
      { keyAr: 'مصدر الطاقة', keyEn: 'Power Supply', valAr: 'USB 5V مع كابل قماشي بطول 1.5 م ومفتاح تحكم', valEn: '5V USB with 1.5m braided cord & inline switch' },
      { keyAr: 'دقة الحفر', keyEn: 'Engraving Tolerance', valAr: '0.15 ملم بالليزر الألماني الموجه', valEn: '0.15 mm Sub-millimeter CNC Laser' },
      { keyAr: 'الوزن التقريبي', keyEn: 'Net Weight', valAr: '380 - 650 غرام حسب المقاس', valEn: '380 - 650 grams based on size' },
      { keyAr: 'بلد التصنيع', keyEn: 'Origin', valAr: 'تصنيع يدوي ورقمي في بغداد، العراق', valEn: 'Handcrafted & Laser Etched in Baghdad, Iraq' },
    ],
    dimensions: [
      { id: 'dim-sm', labelAr: 'صغير للمكتب (18 × 14 سم)', labelEn: 'Desk Compact (18 × 14 cm)', multiplier: 1.0, widthCm: 14, heightCm: 18 },
      { id: 'dim-md', labelAr: 'متوسط قياسي (24 × 18 سم)', labelEn: 'Medium Standard (24 × 18 cm)', multiplier: 1.3, widthCm: 18, heightCm: 24 },
      { id: 'dim-lg', labelAr: 'كبير فاخر (30 × 24 سم)', labelEn: 'Large Deluxe (30 × 24 cm)', multiplier: 1.7, widthCm: 24, heightCm: 30 },
    ],
    materials: [
      { id: 'mat-wood', labelAr: 'قاعدة خشب زان طبيعي محفور', labelEn: 'Natural Engraved Beech Wood Base', priceAdd: 0 },
      { id: 'mat-walnut', labelAr: 'قاعدة خشب جوز داكن فاخر', labelEn: 'Dark Walnut Executive Base', priceAdd: 8000 },
      { id: 'mat-acrylic-base', labelAr: 'قاعدة أكريليك كريستالي مضيء', labelEn: 'Illuminated Crystal Acrylic Base', priceAdd: 5000 },
    ],
    ledOptions: [
      { id: 'led-warm', nameAr: 'أصفر دافئ رومانسي (3000K)', nameEn: 'Warm Amber Glow (3000K)', hex: '#fbbf24', glowClass: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]' },
      { id: 'led-ice', nameAr: 'أزرق سماوي ناصع', nameEn: 'Sky Cyan Blue', hex: '#38bdf8', glowClass: 'shadow-[0_0_30px_rgba(56,189,248,0.4)]' },
      { id: 'led-lavender', nameAr: 'بنفسجي لافندر ناعم', nameEn: 'Lavender Violet', hex: '#c084fc', glowClass: 'shadow-[0_0_30px_rgba(192,132,252,0.4)]' },
      { id: 'led-white', nameAr: 'أبيض نهاري معتدل (4500K)', nameEn: 'Pure Daylight (4500K)', hex: '#f8fafc', glowClass: 'shadow-[0_0_30px_rgba(248,250,252,0.4)]' },
    ],
    fontOptions: ARABIC_FONTS,
    tierPricing: [
      { minQty: 1, maxQty: 1, discountPercent: 0, labelAr: 'قطعة واحدة: السعر الأساسي', labelEn: '1 pc: Standard Base Price' },
      { minQty: 2, maxQty: 4, discountPercent: 10, labelAr: '2 - 4 قطع: خصم 10%', labelEn: '2 - 4 pcs: 10% Discount' },
      { minQty: 5, maxQty: 9, discountPercent: 18, labelAr: '5 - 9 قطع: خصم 18%', labelEn: '5 - 9 pcs: 18% Discount' },
      { minQty: 10, discountPercent: 25, labelAr: '10+ قطع: خصم هدايا 25%', labelEn: '10+ pcs: 25% Volume Discount' },
    ],
    requiresCustomText: true,
    requiresLogoUpload: false,
    minQuantity: 1,
    leadTimeAr: '24 - 48 ساعة للتجهيز',
    leadTimeEn: '24 - 48 Hours Turnaround',
  },
  {
    id: 'prod-travel-acrylic-sign',
    slug: 'travel-agency-acrylic-sign',
    titleAr: 'لوحة أكريليك مضيئة للمكاتب والشركات',
    titleEn: 'Edge-Lit Corporate Acrylic Sign',
    category: 'led',
    categoryLabelAr: 'لوحات مكاتب وشركات',
    categoryLabelEn: 'Commercial Signage',
    basePrice: 65000,
    descriptionAr: 'لوحة استقبال فاخرة مخصصة لشركات السفر، العيادات، والمكاتب الاستشارية بتفريغ شعار المؤسسة وقص دقيق مع إطار إضاءة محيطي أنيق.',
    descriptionEn: 'Executive reception plaque tailored for travel agencies, clinics, and modern offices. Laser cut with perimeter LED halo effect.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
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
    titleAr: 'كروت أعمال قطنية مع بصمة حرارية وقص ليزري',
    titleEn: 'Letterpress & Hot-Foil Business Cards',
    category: 'cards',
    categoryLabelAr: 'كروت وهويات',
    categoryLabelEn: 'Business Stationery',
    basePrice: 400, // per card in standard 100 batch (40,000 IQD)
    descriptionAr: 'بطاقات عمل مصنوعة من الورق القطني الفاخر 600 غم مع بصمة ذهبية حرارية، حواف مذهبة ملونة، وتفاصيل نافرة تعكس مكانتك المهنية.',
    descriptionEn: 'Ultra-thick 600gsm cotton business cards with metallic foil debossing, colored gilded edges, and raised tactile embellishments.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
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
    titleAr: 'علب كرتون مقوى فاخرة بتصميم مخصص',
    titleEn: 'Luxury Custom Rigid Packaging Boxes',
    category: 'boxes',
    categoryLabelAr: 'علب وتغليف',
    categoryLabelEn: 'Custom Packaging',
    basePrice: 5000, // per box base in batch
    descriptionAr: 'علب كرتون صلبة (Rigid Boxes) ومضلعة بتفصيل المقاس الدقيق لمنتجاتك، مع طباعة سلك سكرين، بصمة ذهبية/فضية، وقوالب إسفنج مخصصة.',
    descriptionEn: 'Hard setup rigid boxes and folding mailers custom sized to your exact product specs with foil hot-stamping, velvet finish, and custom EVA foam inserts.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
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
    titleAr: 'لوحة توثيق تاريخ الزواج والخطوبة التذكارية',
    titleEn: 'Engraved Wedding Timeline Keepsake Plaque',
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
    titleAr: 'لوحة بورتريه فيكتور مخصصة بالليزر',
    titleEn: 'Custom Vector Portrait Acrylic Light',
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
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    titleAr: 'مجسم طائرة بوينغ مضيء 3D LED',
    titleEn: 'Boeing 3D Optical Illusion LED Lamp',
    category: 'led',
    clientAr: 'هدية تذكارية لكابتن طيران عراقي',
    clientEn: 'Aviation Commemorative Gift - Baghdad',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'تم تصميم مسارات الطائرة وخطوطها بنقش ليزري 0.2 مم على لوح أكريليك كاست شفاف ليعطي تأثيراً ضوئياً ساحراً في الغرفة.',
    descriptionEn: 'Engineered with sub-millimeter laser line dispersion across cast optical acrylic, creating an ambient aeronautical centerpiece.',
    dimensions: '26 × 19 × 6 cm',
    materialsAr: 'أكريليك نقي 4 مم + قاعدة خشب زان طبيعي + LED دافئ',
    materialsEn: '4mm Cast Optical Acrylic + Solid Beech Base + Warm LED',
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
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
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
