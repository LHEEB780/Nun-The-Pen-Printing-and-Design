export interface ProductCategoryMeta {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  calloutAr: string;
  calloutEn: string;
  badgeAr: string;
  badgeEn: string;
  image: string;
  secondaryImages: string[];
  featuresAr: string[];
  featuresEn: string[];
  materialsAr: string[];
  materialsEn: string[];
  typicalUsesAr: string[];
  typicalUsesEn: string[];
  startingPriceIQD: number;
  startingPriceUSD: number;
  accentColor: {
    from: string;
    to: string;
    lightBg: string;
    border: string;
    text: string;
    badgeBg: string;
    glow: string;
  };
  iconName: 'Sparkles' | 'Box' | 'CreditCard' | 'Award' | 'Heart' | 'Layers';
  articleId?: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryMeta[] = [
  {
    id: 'led',
    slug: 'led-acrylic',
    nameAr: 'لوحات ومجسمات الأكريليك المضيئة 3D LED',
    nameEn: '3D LED Optical Acrylic Signs & Trophies',
    subtitleAr: 'حفر ليزري ميكروني، شفافية بلورية فائقة، وإضاءة ساحرة',
    subtitleEn: 'Sub-millimeter laser scoring, crystal clarity & ambient glow',
    descriptionAr:
      'نخبة أعمال الأكريليك المصنعة يدوياً وآلياً بأدق ماكينات الليزر الألمانية. نستخدم ألواح أكريليك كاست نقي 100% غير قابل للاصفرار بسماكات 4 - 6 مم مع قواعد مضيئة باللمس أو قواعد خشبية فاخرة أو مسامير استيل جدارية بارزة.',
    descriptionEn:
      'Engineered from 100% optical virgin cast acrylic (4-6mm) with diamond-polished edges. Featuring capacitive touch circular bases, ambient multi-color LEDs, and executive corporate mounting hardware.',
    calloutAr: 'تقنية الإضاءة المحيطية التي تجعل الشعار أو المجسم عائماً في الهواء ثلاثي الأبعاد',
    calloutEn: 'Edge-lit refraction creating an optical 3D floating visual effect',
    badgeAr: 'الأكثر مبيعاً للشركات والمكاتب',
    badgeEn: 'Best Seller for Offices',
    image: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
    secondaryImages: [
      '/images/products/travel_agency_wall_front_1791817427540.jpg',
      '/images/products/acrylic_led_front_1791779703517.jpg',
      '/images/products/led_acrylic_3d_angle_1791816316544.jpg',
    ],
    featuresAr: [
      'حفر ليزري ميكروني بدقة متناهية للشعارات وتفاصيل الفيكتور',
      'إضاءة LED موفرة للطاقة تدوم أكثر من 50,000 ساعة عمل',
      'خيارات ألوان متعددة: بنفسجي ملكي، أزرق سماوي، وأبيض دافئ',
      'قواعد لمس ذكية وتوصيل مباشر عبر USB أو محول 12V معتمد',
    ],
    featuresEn: [
      'Sub-millimeter laser vector engraving for intricate corporate logos',
      'Long-life high-efficiency LEDs exceeding 50,000 operating hours',
      'Multi-tone lighting: Royal Violet, Aviation Cyan, Warm Amber',
      'Smart capacitive touch base with dual USB/battery or 12V power',
    ],
    materialsAr: ['أكريليك كاست نقي 4-6 مم', 'قواعد ABS مقاومة للصدمات', 'مسامير ستاند أوف استيل', 'خشب طبيعي معالج'],
    materialsEn: ['4-6mm Virgin Cast Acrylic', 'High-impact ABS Touch Bases', 'Stainless Steel Standoffs', 'Natural Hardwood'],
    typicalUsesAr: ['دروع التكريم السنوية', 'لوحات استقبال المكاتب والشركات', 'هدايا لكبار الشخصيات', 'ديكورات المكاتب الإدارية'],
    typicalUsesEn: ['Corporate Awards & Trophies', 'Reception Desk & Wall Signage', 'VIP Executive Gifts', 'Modern Desk Décor'],
    startingPriceIQD: 26000,
    startingPriceUSD: 20,
    accentColor: {
      from: 'from-purple-600',
      to: 'to-indigo-700',
      lightBg: 'bg-purple-50/70',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badgeBg: 'bg-purple-100 text-purple-800',
      glow: 'shadow-purple-500/20',
    },
    iconName: 'Sparkles',
    articleId: 'art-services',
  },
  {
    id: 'boxes',
    slug: 'rigid-boxes',
    nameAr: 'علب الكرتون المقوى الفاخرة (Rigid Packaging)',
    nameEn: 'Luxury Custom Rigid Boxes & Packaging',
    subtitleAr: 'كرتون رمادي صلب 1200 غم، ملمس مخملي ناعم، وبصمة حرارية مذهبة',
    subtitleEn: '1200gsm heavy greyboard, soft-touch matte & hot-foil stamping',
    descriptionAr:
      'حلول التغليف الفاخرة المصممة خصيصاً لحماية وإبراز قيمة منتجك. علب صلبة بمغناطيس إغلاق خفي، علب بدرج منزلق، أو غطاء وقاعدة، مع قوالب إسفنج داخلي مقصوصة بالليزر بمقاس المنتج تماماً مع كسوة مخملية وساتان حريري.',
    descriptionEn:
      'Structural packaging engineered from heavy 1200gsm dense greyboard wrapped with luxury Italian soft-touch matte papers. Complete with precision laser-cut EVA foam inserts and magnetic closures.',
    calloutAr: 'تغليف يرفع القيمة المدركة لمنتجك ويبهر عميلك من لحظة فتح الصندوق (Unboxing Experience)',
    calloutEn: 'Unboxing experience that elevates perceived brand value exponentially',
    badgeAr: 'للعطور والمجوهرات والهدايا',
    badgeEn: 'Perfumes, Jewelry & Gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: [
      'كرتون رمادي صلب سماكة 2 ملم يتحمل الصدمات دون انثناء',
      'بصمة حرارية ألمانية كروز (Kurz Foil) باللون الذهبي أو الفضي أو البرونزي',
      'حشوة إسفنج EVA ليزرية مخصصة لشكل المنتج بدقة الملليمتر',
      'خيارات أقمشة داخلية: ستان حريري لامع أو مخمل سويدي ناعم',
    ],
    featuresEn: [
      '2.0mm heavy greyboard resisting crushing and bending under pressure',
      'Genuine German Kurz hot-stamping foil in gold, silver, rose-gold',
      'Laser-contoured EVA foam engineered to your exact bottle/product CAD',
      'Lining choices: shimmering silk satin or plush velvet suede',
    ],
    materialsAr: ['كرتون رمادي 1200-1600 غم', 'ورق فني مخملي Soft-Touch', 'إسفنج EVA عالي الكثافة', 'مغناطيس نيوديميوم'],
    materialsEn: ['1200-1600gsm Greyboard', 'Soft-Touch Matte Papers', 'High-Density EVA Foam', 'Neodymium Magnets'],
    typicalUsesAr: ['علب قوارير العطور الفاخرة', 'صناديق أطقم المجوهرات والساعات', 'هدايا الشركات والملفات الترويجية', 'علب الشوكولاتة الراقية'],
    typicalUsesEn: ['Luxury Perfume & Oud Bottles', 'Jewelry & Watch Sets', 'Corporate VIP PR Boxes', 'Gourmet Confections'],
    startingPriceIQD: 5000,
    startingPriceUSD: 3.8,
    accentColor: {
      from: 'from-amber-600',
      to: 'to-orange-700',
      lightBg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-800',
      badgeBg: 'bg-amber-100 text-amber-900',
      glow: 'shadow-amber-500/20',
    },
    iconName: 'Box',
    articleId: 'art-services',
  },
  {
    id: 'cards',
    slug: 'business-cards',
    nameAr: 'كروت الأعمال القطنية والبصمة الحرارية (Stationery)',
    nameEn: 'Fine Cotton Business Cards & Letterpress Foil',
    subtitleAr: 'ورق قطني 600 غم، حواف مذهبة، وحفر غائر للمس فخم',
    subtitleEn: '600gsm duplex cotton, gilded edges & tactile letterpress',
    descriptionAr:
      'بطاقات عمل استثنائية تصنع انطباعاً أولاً لا يُنسى. مصنوعة من الورق القطني الإيطالي السميك 600 - 700 غم بتقنية الضغط الغائر والبارز، مع تذهيب الحواف يدوياً باللون الذهبي العاكس أو الروز قولد أو الأزرق الملكي.',
    descriptionEn:
      'Executive stationery crafted from pure double-weight 600-700gsm cotton boards. Elevated with tactile letterpress blind deboss, metallic foil stamping, and mirror-polished hand-burnished edge gilding.',
    calloutAr: 'سماكة تفوق الكروت العادية بـ 3 أضعاف مع ملمس قطني طبيعي يعكس ثقلك المهني',
    calloutEn: '3x thicker than mass-produced cards with authentic tactile presence',
    badgeAr: 'للمدراء والمحامين والأطباء',
    badgeEn: 'Executives & Professionals',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: [
      'ورق قطني طبيعي 600 غم خالٍ من الأحماض ومقاوم للرطوبة والاصفرار',
      'بصمة حرارية معدنية عاكسة (ذهبي، فضي، بلاتين، وهولوغرام)',
      'تذهيب الحواف يدوياً بحرفية إيطالية عاكسة للضوء',
      'حفر غائر (Letterpress Deboss) يمنح البطاقة عمقاً ملموساً',
    ],
    featuresEn: [
      'Acid-free 600gsm pure cotton card stock with unmatched rigidity',
      'Reflective foil stamping in mirror gold, silver, platinum, holographic',
      'Hand-burnished metallic edge gilding for full 360-degree shimmer',
      'Deep tactile letterpress debossing for sculpted elegance',
    ],
    materialsAr: ['ورق قطني إيطالي 600-700 غم', 'ورق أسود ملكي فاحم Black Core', 'رقائق بصمة Kurz الألمانية', 'أحبار UV ثابتة'],
    materialsEn: ['600-700gsm Italian Cotton', 'Deep Black Core Stock', 'German Kurz Foils', 'Pigmented UV Inks'],
    typicalUsesAr: ['كروت الرؤساء التنفيذيين ومجالس الإدارة', 'المحامون والمستشارون القانونيون', 'الأطباء والعيادات التخصصية', 'المصممون والمهندسون المعماريون'],
    typicalUsesEn: ['CEOs & Board Executives', 'Law Firms & Senior Partners', 'Specialist Surgeons & Clinics', 'Architects & Luxury Studios'],
    startingPriceIQD: 400,
    startingPriceUSD: 0.3,
    accentColor: {
      from: 'from-sky-600',
      to: 'to-blue-700',
      lightBg: 'bg-sky-50/70',
      border: 'border-sky-200',
      text: 'text-sky-800',
      badgeBg: 'bg-sky-100 text-sky-900',
      glow: 'shadow-sky-500/20',
    },
    iconName: 'CreditCard',
    articleId: 'art-services',
  },
  {
    id: 'weddings',
    slug: 'wedding-keepsakes',
    nameAr: 'لوحات الزفاف والمناسبات التذكارية (Milestone Keepsakes)',
    nameEn: 'Commemorative Wedding & Event Keepsake Plaques',
    subtitleAr: 'توثيق مواعيد العمر بالخطوط العربية الكلاسيكية مع إضاءة دافئة',
    subtitleEn: 'Preserving lifelong milestones with calligraphy & ambient warmth',
    descriptionAr:
      'قطع فنية خالدة توثق أجمل لحظات الحياة: تاريخ أول لقاء، يوم الخطوبة، عقد القران، وليلة الزفاف. ندمج الأكريليك الكريستالي مع خشب البلوط والزان المعالج، مع كتابة الأسماء والتواريخ بأرقى المخطوطات الكوفية والديوانية.',
    descriptionEn:
      'Timeless artistic centerpieces commemorating life milestones (Engagement, Civil Contract, Wedding). Pairing crystal optical acrylic with hand-finished hardwood bases and warm romantic ambient lighting.',
    calloutAr: 'هدية زفاف شخصية تبقى مضيئة في منزل الزوجية لعشرات السنين',
    calloutEn: 'A personalized marriage keepsake glowing gracefully for decades',
    badgeAr: 'هدايا العرسان والأعراس الفاخرة',
    badgeEn: 'Bridal & Anniversary Luxury',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: [
      'مخطوطات عربية أصلية بالخط الديواني أو الكوفي للأسماء والتاريخ',
      'قاعدة خشبية طبيعية محفورة بعبارة إهداء خاصة أو آيات من القرآن',
      'إضاءة رومانسية هادئة بلون أبيض دافئ 3000K أو لافندر ناعم',
      'تغليف هدية ملكي مع بطاقة تهنئة وشريط ستان فاخر جاهز للتقديم',
    ],
    featuresEn: [
      'Custom bespoke Arabic typography in graceful Diwani or Kufi script',
      'Natural treated wood base engraved with dedications or poetry',
      'Subtle romantic lighting in 3000K warm amber or pastel lavender',
      'Luxury gift presentation packaging complete with satin bow & card',
    ],
    materialsAr: ['أكريليك كريستالي نقي 4 مم', 'خشب بلوط وزان طبيعي', 'شريط LED دافئ 3000K', 'حواف مرايا ذهبية'],
    materialsEn: ['4mm Crystal Cast Acrylic', 'Natural Oak & Beech Wood', '3000K Warm LED Array', 'Mirror Gold Accent Borders'],
    typicalUsesAr: ['هدايا حفلات الزفاف والخطوبة', 'ذكرى سنوية للزواج (Anniversary)', 'مقدمات استقبال قاعات الأعراس', 'ديكورات غرف النوم والصالونات'],
    typicalUsesEn: ['Wedding & Engagement Gifts', 'Marriage Anniversary Celebrations', 'Bridal Reception Welcome Tables', 'Master Bedroom Lighting Décor'],
    startingPriceIQD: 42000,
    startingPriceUSD: 32,
    accentColor: {
      from: 'from-rose-500',
      to: 'to-pink-600',
      lightBg: 'bg-rose-50/70',
      border: 'border-rose-200',
      text: 'text-rose-800',
      badgeBg: 'bg-rose-100 text-rose-900',
      glow: 'shadow-rose-500/20',
    },
    iconName: 'Heart',
    articleId: 'art-portfolio',
  },
  {
    id: 'portraits',
    slug: 'vector-portraits',
    nameAr: 'بورتريه الفيكتور ورسومات الليزر الشخصية (Custom Vector Art)',
    nameEn: 'Hand-Drawn Vector Line Portrait Nightlights',
    subtitleAr: 'فنانونا يرسمون صورتك يدوياً ثم تُنقش بالليزر لتشع بالنور',
    subtitleEn: 'Digital hand illustration transformed into laser scored illumination',
    descriptionAr:
      'نحول صورك المفضلة وصور أحبائك إلى عمل فني مضيء. يقوم فريق من الرسامين المحترفين بتحويل الصورة إلى خطوط فيكتور رقمية يدوياً بدقة فائقة، ثم ننقشها على الأكريليك لتبعث خطوطها نوراً ساحراً في الظلام.',
    descriptionEn:
      'Transform personal photographs into glowing bespoke works of art. Our illustrators hand-render portraits into contour line vectors, laser-etched onto optical acrylic with variable dimming.',
    calloutAr: 'نرسل لك بروفة الرسم الرقمي عبر واتساب للاعتماد والموافقة قبل الحفر بالليزر',
    calloutEn: 'Digital proof sketch sent via WhatsApp for preview before final laser cut',
    badgeAr: 'أفضل هدية شخصية وتذكارية',
    badgeEn: 'Top Personal Keepsake',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    ],
    featuresAr: [
      'رسم رقمي يدوي متقن يبرز ملامح الوجه والشخصية بدون تشويه',
      'إمكانية إضافة أبيات شعر، توقيع شخصي، أو تاريخ مميز أسفل الرسم',
      'قاعدة خشبية بيضاوية مع زر لمس ذكي للتحكم بمستوى الإضاءة',
      'مستويات إضاءة متعددة تجعله مثالياً كمصباح ليلي مهدئ للأعصاب',
    ],
    featuresEn: [
      'Carefully crafted manual digital illustration preserving true facial likeness',
      'Add custom poetry verses, personal signatures, or milestone dates',
      'Solid wooden oval base with touch sensor dimmer control',
      'Multiple illumination intensities suitable for soothing nightlight ambient glow',
    ],
    materialsAr: ['أكريليك شفاف نقي 4 مم', 'قاعدة خشبية بمفتاح لمس', 'وصلة USB 5V عالمية', 'علبة هدايا فاخرة'],
    materialsEn: ['4mm Optical Virgin Acrylic', 'Touch Sensor Wood Base', 'Universal 5V USB Cord', 'Presentation Gift Box'],
    typicalUsesAr: ['هدايا التخرج للأطباء والمهندسين', 'هدايا أعياد الميلاد الخاصة', 'تخليد ذكرى الشخصيات والأجداد', 'هدايا الأطفال والمواليد الجدد'],
    typicalUsesEn: ['Graduation Gifts (Doctors, Engineers)', 'Milestone Birthday Surprises', 'Memorial Portraits & Heritage Tributes', 'Newborn & Nursery Custom Nightlights'],
    startingPriceIQD: 48000,
    startingPriceUSD: 36,
    accentColor: {
      from: 'from-teal-600',
      to: 'to-emerald-700',
      lightBg: 'bg-teal-50/70',
      border: 'border-teal-200',
      text: 'text-teal-800',
      badgeBg: 'bg-teal-100 text-teal-900',
      glow: 'shadow-teal-500/20',
    },
    iconName: 'Award',
    articleId: 'art-portfolio',
  },
];
