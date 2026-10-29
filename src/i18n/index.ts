import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectClientLocaleAndCountry } from '../utils/geoDetection';

export const resources = {
  ar: {
    translation: {
      brand: {
        name: 'نون والقلم للطباعة والتصميم',
        shortName: 'نون والقلم',
        tagline: 'حيث تلتقي دقة الحرف بوهج الإبداع',
        description: 'استوديو عراقي متخصص في تصنيع لوحات الأكريليك المضيئة LED، علب الكرتون الفاخرة، الهويات البصرية، والهدايا التذكارية المصنوعة حسب الطلب في بغداد.'
      },
      nav: {
        home: 'الرئيسية',
        services: 'خدماتنا',
        portfolio: 'معرض الأعمال المنفذة',
        shop: 'منتجات مخصصة',
        whyUs: 'لماذا نون والقلم؟',
        testimonials: 'آراء عملائنا',
        contact: 'تواصل معنا',
        quote: 'طلب عرض سعر',
        cart: 'سلة الطلبات'
      },
      hero: {
        kicker: 'استوديو الطباعة والتصنيع الحصري · بغداد، العراق',
        titlePart1: 'نصنع أفكاركم',
        titleHighlight: 'تحفاً مضيئة ومطبوعات فاخرة',
        titlePart2: 'بأعلى مقاييس الإتقان',
        subtitle: 'من لوحات الأكريليك ثلاثية الأبعاد المضيئة بإضاءة LED إلى علب التغليف الكرتونية والكروت الفاخرة. كل قطعة نصنعها مصممة خصيصاً وفق مقاساتك وهويتك.',
        ctaPrimary: 'صمّم طلبك الآن',
        ctaSecondary: 'استكشف معرض الأعمال',
        badges: {
          laser: 'قص ليزري فائق الدقة',
          uv: 'طباعة UV ألمانية ثابتة',
          local: 'صناعة يدوية في بغداد',
          custom: 'تخصيص 100% حسب الطلب'
        }
      },
      services: {
        title: 'خدماتنا التخصصية',
        subtitle: 'حلول طباعة وتصنيع مصممة للشركات والمناسبات الخاصة والمنازل العصرية',
        boxPrinting: {
          title: 'طباعة علب الكرتون الفاخرة',
          desc: 'علب كرتون مضلع ومقوى (Rigid Boxes) بأحجام مخصصة، تشطيب فخم (سلوفان، بصمة ذهبية، نقش نافذ) مناسبة للمنتجات والمتاجر.',
          action: 'تخصيص العلبة'
        },
        businessCards: {
          title: 'كروت الأعمال الفاخرة والمطبوعات',
          desc: 'بطاقات عمل بأوراق قطنية وفاخرة 350-700 غم، مع قص ليزري وبصمة حرارية، بروشورات، وفولدرات شركات.',
          action: 'طلب كروت عمل'
        },
        personalGifts: {
          title: 'هدايا شخصية وتذكارية',
          desc: 'مجسمات إكريليك 3D LED، لوحات تاريخ الزواج والمواليد، أطقم تذكارية منقوشة بالاسم حسب رغبتك.',
          action: 'تخصيص هدية'
        },
        corporateGifts: {
          title: 'دروع وهدايا الشركات والهويات',
          desc: 'لوحات مكاتب مضيئة للمؤسسات، دروع تكريم كريستال وأكريليك، وأطقم مكتبية مخصصة للعلامات التجارية.',
          action: 'طلب للشركات'
        }
      },
      portfolio: {
        title: 'معرض الأعمال المنفذة',
        subtitle: 'نظرة واقعية على مشاريعنا المنفذة لعملائنا في بغداد والمحافظات',
        filterAll: 'جميع الأعمال',
        filterLed: 'لوحات وإضاءة LED',
        filterBoxes: 'علب وتغليف',
        filterPortraits: 'رسومات وبورتريه',
        filterCards: 'كروت وهويات',
        filterWeddings: 'مناسبات وزفاف',
        viewDetails: 'عرض التفاصيل والطلب بمثله',
        closeModal: 'إغلاق',
        materialsUsed: 'المواد المستخدمة',
        dimensions: 'الأبعاد التقريبية',
        orderSimilar: 'اطلب قطعة مماثلة بمقاساتك'
      },
      customizer: {
        title: 'تخصيص المنتج وحساب السعر',
        subtitle: 'حدد خياراتك بدقة وسنقوم بتجهيز العمل وتزويدك بالسعر الفوري',
        productLabel: 'المنتج المختار',
        customTextLabel: 'النص المطلوب كتابته / الاسم أو العبارة',
        customTextPlaceholder: 'مثال: شركة الأفق للسفر والسياحة أو اسم العروسين...',
        dimensionsLabel: 'المقاس / الأبعاد',
        materialLabel: 'نوع الخامة / القاعدة',
        ledColorLabel: 'لون إضاءة LED',
        logoUploadLabel: 'رفع الشعار أو الصورة المرجعية',
        uploadHint: 'اسحب الشعار هنا أو انقر للاختيار (PNG, JPG, PDF, SVG)',
        fileSelected: 'تم اختيار الملف:',
        quantityLabel: 'الكمية المطلوبة',
        notesLabel: 'ملاحظات إضافية للتنفيذ',
        notesPlaceholder: 'أي تفاصيل عن الخط، نوع الإضاءة، أو طلب عينة تجريبية...',
        livePreview: 'المعاينة التقديرية الحية',
        unitPrice: 'سعر القطعة التقديري',
        totalPrice: 'الإجمالي التقديري',
        addToCart: 'إضافة إلى سلة الطلبات',
        addedSuccess: 'تمت الإضافة للسلة بنجاح!',
        currency: 'د.ع'
      },
      whyUs: {
        title: 'لماذا تختار "نون والقلم"؟',
        subtitle: 'لأننا لا نطبع مجرد حبر، بل ننحت تفاصيل هويتكم بعناية تامة',
        feature1Title: 'دقة الليزر وخامات مستوردة',
        feature1Desc: 'نعتمد على أكريليك عالي النقاء 100% لا يصفر مع الوقت، وماكينات ليزر ومكابس حرارية حديثة.',
        feature2Title: 'إضاءات LED موفرة وآمنة',
        feature2Desc: 'شرائح LED أصلية تعمل بجهد 12V أو USB مع مفاتيح لمس ومحولات آمنة للاستخدام المنزلي والمكتبي.',
        feature3Title: 'بروفة رقمية قبل التنفيذ',
        feature3Desc: 'لا نبدأ بالقص أو الطباعة إلا بعد إرسال بروفة ثلاثية الأبعاد أو محاكاة واقعية واعتمادكم لها.',
        feature4Title: 'توصيل سريع لكافة المحافظات',
        feature4Desc: 'مقرنا في بغداد مع شحن آمن وتغليف محكم مضاد للصدمات إلى جميع أنحاء العراق.'
      },
      testimonials: {
        title: 'ثقة شركائنا وعملائنا',
        subtitle: 'شهادات حقيقية من شركات وأفراد اختاروا نون والقلم لأهم مناسباتهم',
        t1Text: 'اللوحة المضيئة للأكريليك لمكتبي الجديد فاقت التوقعات! الإضاءة موزعة بنعومة ودقة القص للشعار مذهلة.',
        t1Author: 'م. أحمد الخفاجي',
        t1Role: 'المدير التنفيذي - شركة الأفق',
        t2Text: 'طلبت درع تاريخ زفاف مع إضاءة دافئة كهدية لزوجتي، كانت اللمسة والتشطيب أفخم مما تخيلت. سرعة في التجهيز.',
        t2Author: 'سارة الراوي',
        t2Role: 'عميلة - بغداد',
        t3Text: 'طباعة علب التغليف الكرتونية لعلامتنا التجارية رفعت من قيمة المنتج بشكل كبير. السلوفان المات والبصمة متقنة جداً.',
        t3Author: 'علي الجابري',
        t3Role: 'مؤسس براند إكسلنس للعطور',
        t4Text: 'كروت الأعمال القطنية بوزن 600 غم مع البصمة الحرارية الذهبية عكست فخامة العيادة بشكل مبهر. جودة الورق والتشطيب استثنائية.',
        t4Author: 'د. نور الهاشمي',
        t4Role: 'طبيبة استشارية - مجمع الهاشمي الطبي'
      },
      cart: {
        title: 'سلة طلباتك المخصصة',
        empty: 'سلة طلباتك فارغة حالياً.',
        emptyCta: 'استعرض المنتجات وابدأ التخصيص',
        itemCustomizations: 'تفاصيل التخصيص:',
        text: 'النص:',
        dimension: 'المقاس:',
        material: 'الخامة:',
        led: 'لون الإضاءة:',
        logoFile: 'ملف الشعار:',
        remove: 'حذف',
        quantity: 'الكمية',
        subtotal: 'المجموع الفرعي',
        shippingNote: 'أجور التوصيل تحتسب عند تأكيد العنوان (بغداد: 5,000 د.ع / المحافظات: 8,000 د.ع)',
        checkoutWhatsApp: 'إرسال الطلب والتفاصيل عبر واتساب',
        checkoutDirect: 'تأكيد طلب الشراء',
        clearCart: 'تفريغ السلة'
      },
      contact: {
        title: 'تواصل معنا وابدأ مشروعك',
        subtitle: 'فريقنا جاهز لمناقشة أفكارك، تقديم الاستشارات، وتحديد الموعد والمواصفات',
        phoneLabel: 'الهاتف / واتساب',
        phoneValue: '+964 780 000 0000',
        emailLabel: 'البريد الإلكتروني',
        emailValue: 'info@noonwalqalam.com',
        addressLabel: 'الموقع والورشة',
        addressValue: 'بغداد - المنصور / الكرادة، العراق',
        workingHoursLabel: 'أوقات العمل',
        workingHoursValue: 'السبت - الخميس: 9:00 ص - 9:00 م',
        formName: 'الاسم الكامل',
        formPhone: 'رقم الهاتف / الواتساب',
        formType: 'نوع الخدمة المطلوبة',
        formMessage: 'تفاصيل الفكرة أو الاستفسار',
        formSubmit: 'إرسال الاستفسار عبر واتساب',
        formSuccess: 'شكراً لتواصلك! سيقوم فريقنا بالرد عليك خلال دقائق.'
      },
      footer: {
        rights: 'جميع الحقوق محفوظة © 2026 نون والقلم للطباعة والتصميم.',
        locationNotice: 'صنع بكل فخر وإتقان في بغداد، العراق 🇮🇶',
        quickLinks: 'روابط سريعة',
        categories: 'أقسام المنتجات'
      }
    }
  },
  en: {
    translation: {
      brand: {
        name: 'Noon & Pen Printing & Design',
        shortName: 'Noon & Pen',
        tagline: 'Where Craftsmanship Meets Luminous Creativity',
        description: 'Iraqi creative studio specializing in bespoke LED illuminated acrylic signs, luxury packaging boxes, corporate branding, and personalized gifts in Baghdad.'
      },
      nav: {
        home: 'Home',
        services: 'Services',
        portfolio: 'Executed Works Portfolio',
        shop: 'Custom Products',
        whyUs: 'Why Choose Us',
        testimonials: 'Testimonials',
        contact: 'Contact',
        quote: 'Request Quote',
        cart: 'Order Cart'
      },
      hero: {
        kicker: 'Bespoke Fabrication & Printing Studio · Baghdad, Iraq',
        titlePart1: 'Transforming Ideas Into',
        titleHighlight: 'Luminous Art & Premium Prints',
        titlePart2: 'With Meticulous Precision',
        subtitle: 'From custom 3D LED acrylic lamps and corporate signage to bespoke rigid boxes and luxury embossed cards. Every piece is fabricated to your exact dimensions and brand identity.',
        ctaPrimary: 'Customize Your Order',
        ctaSecondary: 'Explore Portfolio',
        badges: {
          laser: 'Sub-millimeter Laser Cutting',
          uv: 'High-Density German UV Print',
          local: 'Handcrafted in Baghdad',
          custom: '100% Bespoke to Spec'
        }
      },
      services: {
        title: 'Specialized Capabilities',
        subtitle: 'Precision printing and bespoke manufacturing solutions for brands, events, and modern spaces',
        boxPrinting: {
          title: 'Luxury Cardboard Box Printing',
          desc: 'Rigid setup boxes, corrugated mailing boxes with hot-foil stamping, matte soft-touch lamination, and custom laser-cut EVA foam inserts.',
          action: 'Customize Boxes'
        },
        businessCards: {
          title: 'Premium Business Cards & Stationery',
          desc: 'High-gsm cotton cards (350-700gsm), edge-gilded foil, raised spot UV, letterpress, and bespoke corporate presentation folders.',
          action: 'Order Business Cards'
        },
        personalGifts: {
          title: 'Personalized & Keepsake Gifts',
          desc: '3D edge-lit LED desktop lamps, engraved wedding timeline acrylic plaques, custom vector portrait nightlights, and milestone gifts.',
          action: 'Customize Gift'
        },
        corporateGifts: {
          title: 'Corporate Trophies & Signage',
          desc: 'Backlit acrylic company logos, crystal achievement awards, reception signage, and bespoke corporate executive desk sets.',
          action: 'Corporate Order'
        }
      },
      portfolio: {
        title: 'Featured Works & Gallery',
        subtitle: 'A close look at recent bespoke creations delivered to clients in Baghdad and across Iraq',
        filterAll: 'All Creations',
        filterLed: 'LED & Acrylic',
        filterBoxes: 'Packaging & Boxes',
        filterPortraits: 'Portraits & Vector',
        filterCards: 'Cards & Stationery',
        filterWeddings: 'Events & Plaques',
        viewDetails: 'View Details & Order Similar',
        closeModal: 'Close',
        materialsUsed: 'Materials Used',
        dimensions: 'Approx. Dimensions',
        orderSimilar: 'Order a Similar Piece'
      },
      customizer: {
        title: 'Product Customization & Live Estimator',
        subtitle: 'Configure your dimensions, materials, and custom elements for real-time calculation',
        productLabel: 'Selected Product',
        customTextLabel: 'Engraved / Printed Text or Name',
        customTextPlaceholder: 'e.g. Horizon Travel Agency or Ahmad & Noor 2026...',
        dimensionsLabel: 'Size / Dimensions',
        materialLabel: 'Base Material / Finish',
        ledColorLabel: 'LED Illumination Color',
        logoUploadLabel: 'Upload Your Logo or Reference Artwork',
        uploadHint: 'Drop your logo here or click to browse (PNG, JPG, PDF, SVG)',
        fileSelected: 'Selected File:',
        quantityLabel: 'Quantity',
        notesLabel: 'Additional Instructions or Notes',
        notesPlaceholder: 'Specify preferred Arabic calligraphy style, power adapter type, or rush delivery...',
        livePreview: 'Live Interactive Preview',
        unitPrice: 'Est. Unit Price',
        totalPrice: 'Estimated Total',
        addToCart: 'Add to Order Cart',
        addedSuccess: 'Added to cart successfully!',
        currency: 'IQD'
      },
      whyUs: {
        title: 'Why Choose Noon & Pen?',
        subtitle: 'We do not merely print ink; we engineer your brand presence with meticulous attention',
        feature1Title: 'High-Precision Laser & Imported Acrylic',
        feature1Desc: 'We exclusively use 100% virgin cast acrylic that resists yellowing, driven by micron-calibrated laser cutters.',
        feature2Title: 'Safe, Efficient LED Illumination',
        feature2Desc: 'Certified 12V / 5V USB LED ribbon chips with warm, cool, or RGB ambient controllers safe for children and executive desks.',
        feature3Title: 'Digital 3D Proofing Before Production',
        feature3Desc: 'Nothing goes to the cutter or printer until you review and approve a digital proof and dimensions mockup.',
        feature4Title: 'Nationwide Delivery in Iraq',
        feature4Desc: 'Based in Baghdad with shock-resistant multi-layered bubble packaging and reliable express dispatch across all provinces.'
      },
      testimonials: {
        title: 'Trusted by Leaders & Creators',
        subtitle: 'Authentic reviews from corporate partners and private collectors across Iraq',
        t1Text: 'The edge-lit acrylic sign for our headquarters exceeded every expectation. The logo precision and smooth illumination are top-tier.',
        t1Author: 'Eng. Ahmed Al-Khafaji',
        t1Role: 'CEO - Al-Ufoq International',
        t2Text: 'Ordered a wedding timeline plaque with warm LED lighting as a commemorative gift. The wood base finish and clarity were sublime.',
        t2Author: 'Sara Al-Rawi',
        t2Role: 'Private Collector - Baghdad',
        t3Text: 'Our luxury perfume packaging boxes gained so much prestige after partnering with Noon & Pen. The foil stamping is razor-sharp.',
        t3Author: 'Ali Al-Jabiri',
        t3Role: 'Founder - Excellence Parfums',
        t4Text: 'The 600gsm cotton business cards with hot gold foil stamping captured the exact luxury aesthetic our medical practice demands. Flawless craft.',
        t4Author: 'Dr. Noor Al-Hashemi',
        t4Role: 'Consultant - Al-Hashemi Medical Complex'
      },
      cart: {
        title: 'Your Custom Order Cart',
        empty: 'Your cart is currently empty.',
        emptyCta: 'Explore products and start customizing',
        itemCustomizations: 'Custom specifications:',
        text: 'Text:',
        dimension: 'Dimensions:',
        material: 'Material:',
        led: 'LED Color:',
        logoFile: 'Logo File:',
        remove: 'Remove',
        quantity: 'Quantity',
        subtotal: 'Estimated Subtotal',
        shippingNote: 'Delivery calculated on dispatch confirmation (Baghdad: 5,000 IQD / Other governorates: 8,000 IQD)',
        checkoutWhatsApp: 'Submit Order & Proof via WhatsApp',
        checkoutDirect: 'Confirm Order Details',
        clearCart: 'Clear Cart'
      },
      contact: {
        title: 'Let’s Create Something Exceptional',
        subtitle: 'Our technical and design consultants are ready to answer your inquiries and provide proofs',
        phoneLabel: 'Phone & WhatsApp',
        phoneValue: '+964 780 000 0000',
        emailLabel: 'Email Address',
        emailValue: 'info@noonwalqalam.com',
        addressLabel: 'Studio & Workshop',
        addressValue: 'Baghdad - Al-Mansour / Karrada, Iraq',
        workingHoursLabel: 'Working Hours',
        workingHoursValue: 'Sat - Thu: 9:00 AM - 9:00 PM',
        formName: 'Full Name',
        formPhone: 'Phone / WhatsApp Number',
        formType: 'Requested Service / Product',
        formMessage: 'Details, Dimensions & Ideas',
        formSubmit: 'Send Inquiry via WhatsApp',
        formSuccess: 'Thank you! Our design team will respond to you within minutes.'
      },
      footer: {
        rights: 'All rights reserved © 2026 Noon & Pen for Printing & Design.',
        locationNotice: 'Proudly engineered and handcrafted in Baghdad, Iraq 🇮🇶',
        quickLinks: 'Quick Links',
        categories: 'Product Categories'
      }
    }
  }
};

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('i18nextLng');
      if (saved && (saved === 'ar' || saved === 'en')) {
        return saved;
      }
    } catch {
      // localStorage may fail in private mode
    }

    // Automatic country-based detection:
    // All Arab countries (Iraq, Saudi Arabia, UAE, Kuwait, Egypt, Jordan, etc.) -> 'ar'
    // International / Western countries -> 'en'
    try {
      const geo = detectClientLocaleAndCountry();
      return geo.language;
    } catch {
      // ignore fallback
    }
  }
  return 'ar';
};

const initialLang = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang, // Default to Arabic as primary identity or saved preference
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Automatically synchronize html dir and lang attribute
if (typeof document !== 'undefined') {
  const syncDocumentDirection = (lng: string) => {
    const isArabic = lng.startsWith('ar');
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  };

  syncDocumentDirection(initialLang);

  i18n.on('languageChanged', (lng) => {
    syncDocumentDirection(lng);
    try {
      localStorage.setItem('i18nextLng', lng);
    } catch {
      // ignore
    }
  });
}

export default i18n;
