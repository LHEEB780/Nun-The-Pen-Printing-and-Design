import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductItem, PRODUCTS } from '../data/mockData';
import { OrderRecord } from './useCartStore';

export type AdminRole = 'super_admin' | 'sales_manager' | 'inventory_manager' | 'designer';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone: string;
  department: string;
  status: 'active' | 'suspended';
  lastActive: string;
}

export type CustomFieldType = 'text' | 'dropdown' | 'upload' | 'color_picker' | 'number';

export interface DynamicFormField {
  id: string;
  category: 'led' | 'boxes' | 'cards' | 'portraits' | 'weddings';
  labelAr: string;
  labelEn: string;
  fieldType: CustomFieldType;
  required: boolean;
  placeholderAr?: string;
  placeholderEn?: string;
  options?: Array<{ id: string; labelAr: string; labelEn: string; priceAdd: number }>;
}

export type OrderWorkflowStatus = 'pending' | 'in_design' | 'printing' | 'shipped' | 'delivered';

export interface AdminOrderRecord extends OrderRecord {
  workflowStatus: OrderWorkflowStatus;
  assignedDesignerId?: string;
  designerNotes?: string;
  urgentDispatch?: boolean;
}

export type CampaignPlatform = 'tiktok' | 'facebook' | 'instagram' | 'snapchat' | 'google' | 'direct';

export interface PlatformStatItem {
  views: number;
  orders: number;
  revenue: number;
}

export interface ABVariantData {
  id: 'var_a' | 'var_b';
  nameAr: string;
  nameEn: string;
  angleAr: string;
  angleEn: string;
  headlineAr: string;
  subheadlineAr: string;
  badgeTextAr: string;
  promoPriceIQD: number;
  originalPriceIQD: number;
  bulletPointsAr: string[];
  viewsCount: number;
  ordersCount: number;
  totalRevenueIQD: number;
}

export interface ABCampaignTest {
  enabled: boolean;
  trafficSplitPercentA: number; // e.g. 50 (50% A, 50% B)
  activeWinnerId?: 'var_a' | 'var_b' | null;
  variantA: ABVariantData;
  variantB: ABVariantData;
}

export interface LandingPageCampaign {
  id: string;
  isActive: boolean;
  slug: string;
  productId: string;
  headlineAr: string;
  headlineEn: string;
  subheadlineAr: string;
  subheadlineEn: string;
  badgeTextAr: string;
  badgeTextEn: string;
  promoPriceIQD: number;
  originalPriceIQD: number;
  urgencyStockLeft: number;
  countdownHours: number;
  bonusOfferTitleAr: string;
  bonusOfferTitleEn: string;
  bonusOfferPriceIQD: number;
  bonusOfferEnabled: boolean;
  bulletPointsAr: string[];
  bulletPointsEn: string[];
  viewsCount: number;
  ordersCount: number;
  totalRevenueIQD: number;
  targetCountry?: string;
  targetCity?: string;
  platformStats?: Record<string, PlatformStatItem>;
  abTest?: ABCampaignTest;
}

interface AdminStore {
  currentRole: AdminRole;
  setCurrentRole: (role: AdminRole) => void;

  // Dynamic Form Builder State
  customFormFields: DynamicFormField[];
  addField: (field: Omit<DynamicFormField, 'id'>) => void;
  updateField: (id: string, updated: Partial<DynamicFormField>) => void;
  deleteField: (id: string) => void;

  // Products CRUD State
  adminProducts: ProductItem[];
  deletedProductIds: string[];
  addProduct: (prod: ProductItem) => void;
  updateProduct: (id: string, updated: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefaults: () => void;

  // Orders Management State
  adminOrders: AdminOrderRecord[];
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: OrderWorkflowStatus) => void;
  updatePaymentStatus: (orderId: string, status: 'paid' | 'pending_cod') => void;
  updateDesignerNotes: (orderId: string, notes: string) => void;

  // Staff & User Management State
  staffMembers: StaffMember[];
  updateStaffRole: (staffId: string, role: AdminRole) => void;
  addStaffMember: (staff: Omit<StaffMember, 'id' | 'lastActive'>) => void;
  toggleStaffStatus: (staffId: string) => void;

  // Dynamic Campaign Landing Page State
  campaign: LandingPageCampaign;
  updateCampaign: (updated: Partial<LandingPageCampaign>) => void;
  recordCampaignVisit: (source?: string) => void;
  recordCampaignOrder: (revenue: number, source?: string) => void;
  resetCampaignStats: () => void;

  // A/B Testing Orchestrator State & Actions
  updateABTest: (updated: Partial<ABCampaignTest>) => void;
  updateABVariant: (variantId: 'var_a' | 'var_b', updated: Partial<ABVariantData>) => void;
  recordABVisit: (variantId: 'var_a' | 'var_b') => void;
  recordABOrder: (variantId: 'var_a' | 'var_b', revenue: number) => void;
  simulateABTraffic: (sampleSize?: number) => void;
  resetABTestStats: () => void;
  deployABWinner: (winnerId: 'var_a' | 'var_b') => void;

  // AI Campaign ROAS & Attribution Sub-Dashboard
  campaignRoasRecords: CampaignROASRecord[];
  updateCampaignAdSpend: (campaignId: string, adSpendIQD: number) => void;
  recordAttributedSale: (campaignId: string, orderId: string, revenue: number) => void;
  addCampaignRoasRecord: (record: CampaignROASRecord) => void;
  deleteCampaignRoasRecord: (id: string) => void;
  simulateAttributionOrder: (campaignId: string) => void;
}

export interface CampaignROASRecord {
  id: string;
  campaignNameAr: string;
  campaignNameEn: string;
  productId: string;
  productTitleAr: string;
  platform: CampaignPlatform;
  aiAngleAr: string;
  targetRegionAr: string;
  adSpendIQD: number;
  adSpendUSD?: number;
  viewsCount: number;
  ordersCount: number;
  attributedRevenueIQD: number;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  cogsPercent: number; // percentage, e.g. 28%
  linkedOrderIds: string[];
  aiRecommendationAr: string;
  abTestSplit?: {
    variantA: { nameAr: string; spendIQD: number; ordersCount: number; revenueIQD: number; roas: number };
    variantB: { nameAr: string; spendIQD: number; ordersCount: number; revenueIQD: number; roas: number };
    winningVariant: 'var_a' | 'var_b';
  };
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'م. سنان العبيدي',
    email: 'sinan.admin@noonwalqalam.com',
    role: 'super_admin',
    phone: '+964 780 111 2222',
    department: 'الإدارة العامة والتصنيع',
    status: 'active',
    lastActive: 'الآن',
  },
  {
    id: 'st-2',
    name: 'سارة الكرخي',
    email: 'sara.sales@noonwalqalam.com',
    role: 'sales_manager',
    phone: '+964 780 333 4444',
    department: 'المبيعات وخدمة العملاء',
    status: 'active',
    lastActive: 'منذ 15 دقيقة',
  },
  {
    id: 'st-3',
    name: 'حيدر مهدي',
    email: 'hayder.inventory@noonwalqalam.com',
    role: 'inventory_manager',
    phone: '+964 780 555 6666',
    department: 'مخزن الأكريليك والخامات',
    status: 'active',
    lastActive: 'منذ ساعة',
  },
  {
    id: 'st-4',
    name: 'فاطمة الموسوي',
    email: 'fatima.design@noonwalqalam.com',
    role: 'designer',
    phone: '+964 780 777 8888',
    department: 'استوديو الرسم والبروفات 3D',
    status: 'active',
    lastActive: 'منذ 5 دقائق',
  },
];

const INITIAL_DYNAMIC_FIELDS: DynamicFormField[] = [
  {
    id: 'field-led-text',
    category: 'led',
    labelAr: 'النص أو الشعار المحفور بالليزر',
    labelEn: 'Laser Engraved Inscription',
    fieldType: 'text',
    required: true,
    placeholderAr: 'مثال: شركة الأفق للسفر والسياحة...',
    placeholderEn: 'e.g. Horizon Travel HQ...',
  },
  {
    id: 'field-led-font',
    category: 'led',
    labelAr: 'نمط الخط العربي المفضل',
    labelEn: 'Arabic Calligraphy Style',
    fieldType: 'dropdown',
    required: true,
    options: [
      { id: 'opt-cairo', labelAr: 'خط كلاسيكي عصري (Cairo)', labelEn: 'Modern Cairo', priceAdd: 0 },
      { id: 'opt-kufi', labelAr: 'الخط الكوفي الملكي (Kufi)', labelEn: 'Royal Kufi', priceAdd: 0 },
      { id: 'opt-diwani', labelAr: 'الخط الديواني الشاعري (Diwani)', labelEn: 'Romantic Diwani', priceAdd: 3000 },
      { id: 'opt-thuluth', labelAr: 'خط الثلث التراثي الفاخر', labelEn: 'Classical Thuluth', priceAdd: 5000 },
    ],
  },
  {
    id: 'field-led-color',
    category: 'led',
    labelAr: 'نغمة إضاءة LED المحيطية',
    labelEn: 'LED Illumination Tone',
    fieldType: 'color_picker',
    required: true,
    options: [
      { id: 'col-amber', labelAr: 'أصفر دافئ 3000K', labelEn: 'Warm Amber 3000K', priceAdd: 0 },
      { id: 'col-sky', labelAr: 'أزرق سماوي ناصع', labelEn: 'Sky Blue Crisp', priceAdd: 0 },
      { id: 'col-lavender', labelAr: 'بنفسجي لافندر ناعم', labelEn: 'Lavender Soft', priceAdd: 0 },
      { id: 'col-rgb', labelAr: 'ألوان متعددة RGB مع ريموت', labelEn: 'RGB Multi-color + Remote', priceAdd: 8000 },
    ],
  },
  {
    id: 'field-led-logo',
    category: 'led',
    labelAr: 'ملف الشعار الفيكتور بدقة عالية',
    labelEn: 'High-Res Vector Logo File',
    fieldType: 'upload',
    required: false,
    placeholderAr: 'صيغ مدعومة: SVG, AI, PDF, PNG',
    placeholderEn: 'Supported formats: SVG, AI, PDF, PNG',
  },
  {
    id: 'field-box-style',
    category: 'boxes',
    labelAr: 'نمط فتح العلبة الكرتونية',
    labelEn: 'Box Opening Style',
    fieldType: 'dropdown',
    required: true,
    options: [
      { id: 'box-mag', labelAr: 'علبة إغلاق مغناطيسي فاخرة (Book Style)', labelEn: 'Magnetic Book Fold', priceAdd: 1000 },
      { id: 'box-lid', labelAr: 'علبة قطعتين غطاء وقاعدة (Lid & Base)', labelEn: 'Two-Piece Lid & Base', priceAdd: 0 },
      { id: 'box-draw', labelAr: 'علبة درج منزلق مع شريط ستان', labelEn: 'Sliding Drawer Box', priceAdd: 1500 },
    ],
  },
  {
    id: 'field-cards-foil',
    category: 'cards',
    labelAr: 'نوع ولون البصمة الحرارية (Hot Foil)',
    labelEn: 'Hot Foil Metallic Color',
    fieldType: 'dropdown',
    required: true,
    options: [
      { id: 'foil-g', labelAr: 'بصمة ذهبية لامعة عاكسة', labelEn: 'Mirror Gold Foil', priceAdd: 0 },
      { id: 'foil-s', labelAr: 'بصمة فضية بلاتينية', labelEn: 'Silver Platinum Foil', priceAdd: 0 },
      { id: 'foil-rg', labelAr: 'بصمة روز قولد فاخرة', labelEn: 'Rose Gold Metallic', priceAdd: 40 },
      { id: 'foil-deb', labelAr: 'حفر غائر بدون حبر (Deboss)', labelEn: 'Blind Deboss', priceAdd: 0 },
    ],
  },
];

const INITIAL_ADMIN_ORDERS: AdminOrderRecord[] = [
  {
    orderId: 'NP-2026-9042',
    createdAt: '2026-10-11 11:20',
    workflowStatus: 'in_design',
    urgentDispatch: true,
    items: [
      {
        id: 'ord-itm-901',
        productId: 'prod-travel-acrylic-sign',
        titleAr: 'لوحة أكريليك مضيئة للمكاتب والشركات',
        titleEn: 'Edge-Lit Corporate Acrylic Sign',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
        category: 'led',
        quantity: 1,
        unitPrice: 117000,
        totalPrice: 117000,
        customOptions: {
          customText: 'شركة الأفق الدولية للسياحة والطيران',
          fontName: 'الخط الكوفي الملكي (Kufi)',
          dimensionLabelAr: 'استقبال كبير فاخر (90 × 60 سم)',
          dimensionLabelEn: 'Large Reception (90 × 60 cm)',
          materialLabelAr: 'أكريليك مثلج فاخر (Frosted Matte)',
          materialLabelEn: 'Luxury Matte Frosted Acrylic',
          ledColorNameAr: 'أزرق سماوي للشركات',
          ledColorNameEn: 'Aviation Sky Blue',
          ledHex: '#0ea5e9',
          logoFileName: 'al-ufoq-aviation-logo.svg',
          standTypeAr: 'مسامير استيل فضية ستاند أوف',
          notes: 'تسليم مستعجل قبل افتتاح المقر يوم الخميس',
        },
      },
    ],
    shipping: {
      fullName: 'م. أحمد الخفاجي',
      phone: '+964 780 999 8877',
      governorate: 'بغداد - الكرخ',
      address: 'حي المنصور، تقاطع الرواد، عمارة الأفق للسياحة',
      deliveryType: 'express',
      shippingCost: 10000,
    },
    paymentMethod: 'zaincash',
    paymentDetails: {
      transactionId: 'ZC-9912048',
      status: 'paid',
      gatewayNameAr: 'زين كاش (ZainCash)',
      gatewayNameEn: 'ZainCash Wallet',
    },
    subtotal: 117000,
    shippingCost: 10000,
    grandTotal: 127000,
    assignedDesignerId: 'st-4',
    designerNotes: 'تم تجهيز مسار الفيكتور بانتظار اعتماد العميل للبروفة عبر واتساب.',
  },
  {
    orderId: 'NP-2026-8814',
    createdAt: '2026-10-10 16:45',
    workflowStatus: 'printing',
    urgentDispatch: false,
    items: [
      {
        id: 'ord-itm-881',
        productId: 'prod-rigid-boxes',
        titleAr: 'علب كرتون مقوى فاخرة بتصميم مخصص',
        titleEn: 'Luxury Custom Rigid Packaging Boxes',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
        category: 'boxes',
        quantity: 100,
        unitPrice: 6240,
        totalPrice: 624000,
        customOptions: {
          customText: 'Excellence Luxury Oud - عطر العود الملكي',
          dimensionLabelAr: 'علبة هدايا متوسطة (22 × 16 × 8 سم)',
          dimensionLabelEn: 'Medium Gift Box (22 × 16 × 8 cm)',
          materialLabelAr: 'ورق فني أبيض مع سلوفان مات مخملي',
          materialLabelEn: 'Art Paper with Velvet Soft-Touch Matte',
          boxStyleAr: 'علبة إغلاق مغناطيسي فاخرة (Book Style)',
          boxStyleEn: 'Magnetic Book-Fold Rigid Box',
          boxInsertAr: 'إسفنج EVA ليزري أسود مخصص لمنتجك',
          boxInsertEn: 'Laser-Cut High-Density Black EVA',
          logoFileName: 'excellence-oud-crest.ai',
          discountPercentage: 22,
        },
      },
    ],
    shipping: {
      fullName: 'علي الجابري',
      phone: '+964 770 445 1290',
      governorate: 'بغداد - الرصافة',
      address: 'شارع فلسطين، مقابل مول النخيل',
      deliveryType: 'standard',
      shippingCost: 0, // Free shipping for large order
    },
    paymentMethod: 'fib',
    paymentDetails: {
      transactionId: 'FIB-778210',
      status: 'paid',
      gatewayNameAr: 'المصرف العراقي الأول (FIB)',
      gatewayNameEn: 'First Iraqi Bank (FIB)',
    },
    subtotal: 624000,
    shippingCost: 0,
    grandTotal: 624000,
    designerNotes: 'تمت موافقة البروفة، العلب حالياً في ماكينة البصمة الحرارية وتثبيت المغناطيس.',
  },
  {
    orderId: 'NP-2026-8510',
    createdAt: '2026-10-09 14:10',
    workflowStatus: 'shipped',
    urgentDispatch: false,
    items: [
      {
        id: 'ord-itm-851',
        productId: 'prod-airplane-led',
        titleAr: 'مصباح طائرة ثلاثي الأبعاد 3D LED',
        titleEn: '3D LED Optical Airplane Lamp',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
        category: 'led',
        quantity: 2,
        unitPrice: 40500,
        totalPrice: 81000,
        customOptions: {
          customText: 'كابتن طيار عمر السامرائي · الخطوط الجوية العراقية',
          fontName: 'خط كلاسيكي عصري (Cairo)',
          dimensionLabelAr: 'متوسط قياسي (24 × 18 سم)',
          dimensionLabelEn: 'Medium Standard (24 × 18 cm)',
          materialLabelAr: 'قاعدة خشب زان طبيعي محفور',
          materialLabelEn: 'Natural Engraved Beech Wood Base',
          ledColorNameAr: 'أصفر دافئ رومانسي (3000K)',
          ledColorNameEn: 'Warm Amber Glow (3000K)',
          ledHex: '#fbbf24',
          discountPercentage: 10,
        },
      },
    ],
    shipping: {
      fullName: 'هديل السامرائي',
      phone: '+964 781 223 9988',
      governorate: 'البصرة',
      address: 'البصرة، حي الجزائر، مجاور جامع الموسوي الكبير',
      deliveryType: 'standard',
      shippingCost: 8000,
    },
    paymentMethod: 'cod',
    paymentDetails: {
      transactionId: 'COD-IRAQ-882190',
      status: 'pending_cod',
      gatewayNameAr: 'الدفع عند الاستلام (COD)',
      gatewayNameEn: 'Cash on Delivery',
    },
    subtotal: 81000,
    shippingCost: 8000,
    grandTotal: 89000,
    designerNotes: 'تم التسليم لشركة الشحن الوطني (واصل للمحافظات) مع رقم البوليصة IQ-7712.',
  },
];

const INITIAL_CAMPAIGN: LandingPageCampaign = {
  id: 'camp-tiktok-1',
  isActive: true,
  slug: 'tiktok-exclusive',
  productId: 'prod-3d-led-acrylic-shield',
  headlineAr: 'عرض حصري لمتابعي تيك توك: درع 3D LED بإضاءة سحرية وتصميم مخصص باسمك 🔥',
  headlineEn: 'TikTok Exclusive: Custom 3D LED Acrylic Plaque with Your Brand & Name',
  subheadlineAr: 'احصل على تحفة هندسية مخصصة تليق بمكتبك أو هديتك مع بروفة رقمية مجانية وتوصيل سريع لكافة المحافظات!',
  subheadlineEn: 'Get a custom artistic piece for your desk or gift with free digital proofing and fast delivery across Iraq!',
  badgeTextAr: 'خصم خاص 35% لفترة محدودة ⚡',
  badgeTextEn: 'Special 35% Off Flash Deal ⚡',
  promoPriceIQD: 38000,
  originalPriceIQD: 58000,
  urgencyStockLeft: 7,
  countdownHours: 6,
  bonusOfferTitleAr: 'إضافة قاعدة خشبية طبيعية فاخرة أو قطعة ثانية بخصم 45%',
  bonusOfferTitleEn: 'Add luxury natural wooden base at 45% OFF',
  bonusOfferPriceIQD: 14000,
  bonusOfferEnabled: true,
  bulletPointsAr: [
    'أكريليك كاست نقي 100% شفاف معالج ضد الخدش والاصفرار',
    'إضاءة LED تدوم أكثر من 50,000 ساعة مع قاعدة أنيقة وزر تحكم',
    'بروفة هندسية رقمية مجانية يجهزها المصمم وتعتمدها بنفسك قبل التنفيذ',
    'الدفع نقدياً عند الاستلام مع إمكانية المعاينة الكاملة قبل الدفع',
    'شحن آمن ومغلف بعناية فائقة لجميع محافظات العراق خلال 24 - 48 ساعة',
  ],
  bulletPointsEn: [
    '100% Optical Grade Pure Cast Acrylic (Scratch Resistant)',
    '50,000+ Hours LED Life with Elegant Base & Controller',
    'Free Digital Blueprint Proof Approved by You Before Crafting',
    'Cash on Delivery with Right to Inspect Package Before Paying',
    'Fast and Safe Shipping to All Iraqi Governorates within 24-48 Hours',
  ],
  viewsCount: 168,
  ordersCount: 23,
  totalRevenueIQD: 874000,
  targetCountry: 'العراق',
  targetCity: 'كافة المحافظات',
  platformStats: {
    tiktok: { views: 76, orders: 11, revenue: 418000 },
    facebook: { views: 48, orders: 6, revenue: 228000 },
    instagram: { views: 32, orders: 4, revenue: 152000 },
    snapchat: { views: 12, orders: 2, revenue: 76000 },
  },
  abTest: {
    enabled: true,
    trafficSplitPercentA: 50,
    activeWinnerId: null,
    variantA: {
      id: 'var_a',
      nameAr: 'النسخة أ (الفخامة والتأثير العاطفي والإهداء)',
      nameEn: 'Variant A (Prestige & Emotional Gift Appeal)',
      angleAr: 'التركيز على الفخامة الملكية، البريستيج، تخليد الذكرى، والهدايا الاستثنائية للأشخاص المميزين.',
      angleEn: 'Emotional prestige, executive gifting, and memorable moments.',
      headlineAr: 'عرض حصري لمتابعي تيك توك: تحفة 3D LED ملكية محفورة باسمك وشعارك تدوم للأبد 🔥',
      subheadlineAr: 'خلّد اسمك ومكانتك أو قدّم أرقى هدية تليق بأعز الناس مع بروفة رقمية مجانية وضمان معاينة عند الاستلام!',
      badgeTextAr: 'خصم خاص 35% لنسخة النخبة ⚡',
      promoPriceIQD: 38000,
      originalPriceIQD: 58000,
      bulletPointsAr: [
        'أكريليك كاست نقي 100% شفاف معالج ضد الخدش والاصفرار',
        'إضاءة LED تدوم أكثر من 50,000 ساعة مع قاعدة خشب طبيعي فاخرة',
        'بروفة هندسية رقمية مجانية يجهزها المصمم وتعتمدها بنفسك قبل التنفيذ',
        'الدفع نقدياً عند الاستلام مع إمكانية المعاينة الكاملة قبل الدفع',
        'تغليف هدايا فاخر وشحن آمن لكافة المحافظات خلال 24 - 48 ساعة',
      ],
      viewsCount: 142,
      ordersCount: 21,
      totalRevenueIQD: 798000,
    },
    variantB: {
      id: 'var_b',
      nameAr: 'النسخة ب (الجودة الهندسية، الضمان الصارم، وتوفير التكلفة)',
      nameEn: 'Variant B (Precision Engineering & Risk-Free Quality)',
      angleAr: 'التركيز على الدقة الهندسية للقص الليزري (0.2 ملم)، وضوح القراءة، ضمان المعاينة قبل الدفع، وتوفير السعر.',
      angleEn: 'Laser precision engineering, zero-risk inspection, and direct factory value.',
      headlineAr: 'تصنيع هندسي فائق الدقة: لوحة أكريليك 3D LED بضمان استبدال مباشر ومعاينة مجانية 🛡️',
      subheadlineAr: 'قص ليزري بؤري فائق الدقة (0.2 ملم) وتشطيب يدوي مقاوم للخدش - ادفع فقط بعد فحص المنتج بيدك!',
      badgeTextAr: 'ضمان ذهبي 100% + شحن مجاني ⚡',
      promoPriceIQD: 35000,
      originalPriceIQD: 55000,
      bulletPointsAr: [
        'قص ليزري دقيق بدرجة 0.2 ملم يضمن حواف ناعمة كالحرير وتفاصيل حادة',
        'ضمان ذهبي لاستبدال فوري مجاني في حال وجود أي ملاحظة تصنيعية',
        'بروفة رقمية مباشرة عبر واتساب تعتمدها بنفسك بنسبة 100%',
        'حق فحص ومعاينة الطرد بالكامل قبل تسليم المبلغ لمندوب التوصيل',
        'سعر مصنع مباشر مع شحن سريع وتوصيل لباب بيتك أو مكتبك',
      ],
      viewsCount: 138,
      ordersCount: 26,
      totalRevenueIQD: 910000,
    },
  },
};

export const INITIAL_CAMPAIGNS_ROAS: CampaignROASRecord[] = [
  {
    id: 'roas-camp-1',
    campaignNameAr: 'حملة درع 3D LED البصري الملكي - تيك توك حصري',
    campaignNameEn: 'TikTok Exclusive 3D LED Plaque Campaign',
    productId: 'prod-3d-led-acrylic-shield',
    productTitleAr: 'لوحة أكريليك ثلاثية الأبعاد 3D LED بإضاءة سحرية',
    platform: 'tiktok',
    aiAngleAr: 'زاوية الإبهار البصري والفخامة والهدية الاستثنائية التي تدوم',
    targetRegionAr: 'العراق - بغداد والوسط',
    adSpendIQD: 450000,
    adSpendUSD: 300,
    viewsCount: 4210,
    ordersCount: 31,
    attributedRevenueIQD: 2480000,
    status: 'active',
    startDate: '2026-10-12',
    cogsPercent: 28,
    linkedOrderIds: ['NP-2026-9042', 'NP-2026-8510'],
    aiRecommendationAr: 'عائد استثنائي فائق (5.51x)! زاوية فيديو تيك توك التفاعلي مع إضاءة الـ LED تزيد معدل التحويل إلى 4.8%. نوصي بزيادة الميزانية بنسبة 35% لتعزيز الوصول.',
    abTestSplit: {
      variantA: {
        nameAr: 'النسخة أ (الفخامة الملكية والتأثير العاطفي)',
        spendIQD: 225000,
        ordersCount: 19,
        revenueIQD: 1520000,
        roas: 6.75,
      },
      variantB: {
        nameAr: 'النسخة ب (الدقة الهندسية وضمان الاستبدال)',
        spendIQD: 225000,
        ordersCount: 12,
        revenueIQD: 960000,
        roas: 4.27,
      },
      winningVariant: 'var_a',
    },
  },
  {
    id: 'roas-camp-2',
    campaignNameAr: 'حملة علب الكرتون الصلبة للمطاعم والبراندات الفاخرة',
    campaignNameEn: 'Rigid Boxes for Restaurants & Cafes Campaign',
    productId: 'prod-pizza-box',
    productTitleAr: 'علب كرتون مقوى فاخرة بطباعة مخصصة وهوت فويل',
    platform: 'facebook',
    aiAngleAr: 'زاوية الانطباع التجاري الفاخر ومضاعفة ولاء زبائن المطاعم والكافيهات',
    targetRegionAr: 'العراق - كافة المحافظات (قطاع الشركات B2B)',
    adSpendIQD: 650000,
    adSpendUSD: 433,
    viewsCount: 2840,
    ordersCount: 18,
    attributedRevenueIQD: 3690000,
    status: 'active',
    startDate: '2026-10-08',
    cogsPercent: 32,
    linkedOrderIds: ['NP-2026-8912'],
    aiRecommendationAr: 'عائد مرتفع جداً (5.68x) مع متوسط سلة طلبات ضخم (205,000 د.ع). الاستهداف المباشر لمدراء التسويق وأصحاب الكافيهات في فيسبوك حقق أعلى عائد ربحي صافي.',
  },
  {
    id: 'roas-camp-3',
    campaignNameAr: 'حملة كروت البصمة الحرارية الذهبية للصالونات والمكاتب التنفيذية',
    campaignNameEn: 'Luxury Hot Foil Business Cards Instagram Campaign',
    productId: 'prod-foil-business-cards',
    productTitleAr: 'كروت أعمال ورقية فاخرة قطنية 600 جم مع بصمة حرارية',
    platform: 'instagram',
    aiAngleAr: 'زاوية اللمسة المخملية والانطباع الأول الذي لا يُنسى في الاجتماعات',
    targetRegionAr: 'بغداد، أربيل، البصرة',
    adSpendIQD: 380000,
    adSpendUSD: 253,
    viewsCount: 2450,
    ordersCount: 22,
    attributedRevenueIQD: 1760000,
    status: 'active',
    startDate: '2026-10-14',
    cogsPercent: 25,
    linkedOrderIds: ['NP-2026-9042'],
    aiRecommendationAr: 'عائد قوي (4.63x). صور الماكرو التي تبرز انعكاس البصمة الذهبية والمعدنية على انستغرام ريلز تجلب زبائن مستعدين للدفع الفوري.',
  },
  {
    id: 'roas-camp-4',
    campaignNameAr: 'حملة مصباح الطائرة 3D LED لهدايا التخرج والطيارين',
    campaignNameEn: 'Aviation 3D LED Lamp Snapchat Campaign',
    productId: 'prod-airplane-led',
    productTitleAr: 'مصباح طائرة ثلاثي الأبعاد 3D LED بقاعدة خشب زان',
    platform: 'snapchat',
    aiAngleAr: 'زاوية الهدية التذكارية المخصصة بحفر الاسم ورقم الرحلة',
    targetRegionAr: 'بغداد والمنطقة الجنوبية',
    adSpendIQD: 290000,
    adSpendUSD: 193,
    viewsCount: 1920,
    ordersCount: 13,
    attributedRevenueIQD: 1045000,
    status: 'active',
    startDate: '2026-10-15',
    cogsPercent: 30,
    linkedOrderIds: ['NP-2026-8510'],
    aiRecommendationAr: 'عائد صحي (3.60x) في سناب شات. الجمهور الشاب يتفاعل بقوة مع زر سحب الشاشة للطلب والدفع عند الاستلام.',
  },
  {
    id: 'roas-camp-5',
    campaignNameAr: 'حملة لوحات الاستقبال والعيادات عبر بحث جوجل',
    campaignNameEn: 'Google Search Ads for Corporate & Clinic Signs',
    productId: 'prod-travel-acrylic-sign',
    productTitleAr: 'لوحة أكريليك مثلج مضيئة للمكاتب والشركات',
    platform: 'google',
    aiAngleAr: 'زاوية البحث عن لوحات مكاتب فخمة وضمان الاستبدال الفوري',
    targetRegionAr: 'العراق - بغداد والمراكز التجارية',
    adSpendIQD: 490000,
    adSpendUSD: 326,
    viewsCount: 1180,
    ordersCount: 15,
    attributedRevenueIQD: 2325000,
    status: 'active',
    startDate: '2026-10-10',
    cogsPercent: 30,
    linkedOrderIds: ['NP-2026-9042'],
    aiRecommendationAr: 'عائد استثنائي (4.74x) بأعلى نية شراء مباشرة (High Intent). الزوار القادمون من كلمات لوحات شركات بغداد يشترون بمعدل تحويل يتجاوز 12%.',
  },
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      currentRole: 'super_admin',
      setCurrentRole: (role) => set({ currentRole: role }),

      customFormFields: INITIAL_DYNAMIC_FIELDS,
      addField: (fieldData) => {
        const newField: DynamicFormField = {
          ...fieldData,
          id: `field-${Date.now()}`,
        };
        set((state) => ({
          customFormFields: [...state.customFormFields, newField],
        }));
      },
      updateField: (id, updated) => {
        set((state) => ({
          customFormFields: state.customFormFields.map((f) => (f.id === id ? { ...f, ...updated } : f)),
        }));
      },
      deleteField: (id) => {
        set((state) => ({
          customFormFields: state.customFormFields.filter((f) => f.id !== id),
        }));
      },

      adminProducts: PRODUCTS,
      deletedProductIds: [],
      addProduct: (prod) => {
        set((state) => ({
          adminProducts: [prod, ...state.adminProducts],
        }));
      },
      updateProduct: (id, updated) => {
        set((state) => ({
          adminProducts: state.adminProducts.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          adminProducts: state.adminProducts.filter((p) => p.id !== id),
          // Tombstone the ID so getUnifiedProducts() keeps it hidden even for code-defined defaults
          deletedProductIds: state.deletedProductIds.includes(id)
            ? state.deletedProductIds
            : [...state.deletedProductIds, id],
        }));
      },
      resetProductsToDefaults: () => {
        set({ adminProducts: PRODUCTS, deletedProductIds: [] });
      },

      adminOrders: INITIAL_ADMIN_ORDERS,
      addOrder: (order) => {
        const adminOrder: AdminOrderRecord = {
          ...order,
          workflowStatus: 'pending',
        };
        set((state) => ({
          adminOrders: [adminOrder, ...state.adminOrders],
        }));
      },
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          adminOrders: state.adminOrders.map((o) => (o.orderId === orderId ? { ...o, workflowStatus: status } : o)),
        }));
      },
      updatePaymentStatus: (orderId, status) => {
        set((state) => ({
          adminOrders: state.adminOrders.map((o) =>
            o.orderId === orderId
              ? { ...o, paymentDetails: { ...o.paymentDetails, status } }
              : o
          ),
        }));
      },
      updateDesignerNotes: (orderId, notes) => {
        set((state) => ({
          adminOrders: state.adminOrders.map((o) => (o.orderId === orderId ? { ...o, designerNotes: notes } : o)),
        }));
      },

      staffMembers: INITIAL_STAFF,
      updateStaffRole: (staffId, role) => {
        set((state) => ({
          staffMembers: state.staffMembers.map((s) => (s.id === staffId ? { ...s, role } : s)),
        }));
      },
      addStaffMember: (staffData) => {
        const newStaff: StaffMember = {
          ...staffData,
          id: `st-${Date.now()}`,
          lastActive: 'الآن',
        };
        set((state) => ({
          staffMembers: [...state.staffMembers, newStaff],
        }));
      },
      toggleStaffStatus: (staffId) => {
        set((state) => ({
          staffMembers: state.staffMembers.map((s) =>
            s.id === staffId ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s
          ),
        }));
      },

      // Dynamic Multi-Platform Campaign Landing Page State & Actions
      campaign: INITIAL_CAMPAIGN,
      updateCampaign: (updated) => {
        set((state) => ({
          campaign: { ...state.campaign, ...updated },
        }));
      },
      recordCampaignVisit: (source) => {
        const normalized = (source || 'direct').toLowerCase();
        set((state) => {
          const currentStats = state.campaign.platformStats || {};
          const prev = currentStats[normalized] || { views: 0, orders: 0, revenue: 0 };
          return {
            campaign: {
              ...state.campaign,
              viewsCount: (state.campaign.viewsCount || 0) + 1,
              platformStats: {
                ...currentStats,
                [normalized]: {
                  ...prev,
                  views: prev.views + 1,
                },
              },
            },
          };
        });
      },
      recordCampaignOrder: (revenue, source) => {
        const normalized = (source || 'direct').toLowerCase();
        set((state) => {
          const currentStats = state.campaign.platformStats || {};
          const prev = currentStats[normalized] || { views: 0, orders: 0, revenue: 0 };
          return {
            campaign: {
              ...state.campaign,
              ordersCount: (state.campaign.ordersCount || 0) + 1,
              totalRevenueIQD: (state.campaign.totalRevenueIQD || 0) + revenue,
              urgencyStockLeft: Math.max(0, (state.campaign.urgencyStockLeft || 7) - 1),
              platformStats: {
                ...currentStats,
                [normalized]: {
                  ...prev,
                  orders: prev.orders + 1,
                  revenue: prev.revenue + revenue,
                },
              },
            },
          };
        });
      },
      resetCampaignStats: () => {
        set((state) => ({
          campaign: {
            ...state.campaign,
            viewsCount: 0,
            ordersCount: 0,
            totalRevenueIQD: 0,
            platformStats: {
              tiktok: { views: 0, orders: 0, revenue: 0 },
              facebook: { views: 0, orders: 0, revenue: 0 },
              instagram: { views: 0, orders: 0, revenue: 0 },
              snapchat: { views: 0, orders: 0, revenue: 0 },
            },
          },
        }));
      },

      updateABTest: (updated) => {
        set((state) => {
          const current = state.campaign.abTest || INITIAL_CAMPAIGN.abTest!;
          return {
            campaign: {
              ...state.campaign,
              abTest: {
                ...current,
                ...updated,
              },
            },
          };
        });
      },

      updateABVariant: (variantId, updated) => {
        set((state) => {
          const current = state.campaign.abTest || INITIAL_CAMPAIGN.abTest!;
          return {
            campaign: {
              ...state.campaign,
              abTest: {
                ...current,
                variantA: variantId === 'var_a' ? { ...current.variantA, ...updated } : current.variantA,
                variantB: variantId === 'var_b' ? { ...current.variantB, ...updated } : current.variantB,
              },
            },
          };
        });
      },

      recordABVisit: (variantId) => {
        set((state) => {
          const current = state.campaign.abTest || INITIAL_CAMPAIGN.abTest!;
          const isA = variantId === 'var_a';
          return {
            campaign: {
              ...state.campaign,
              abTest: {
                ...current,
                variantA: isA ? { ...current.variantA, viewsCount: current.variantA.viewsCount + 1 } : current.variantA,
                variantB: !isA ? { ...current.variantB, viewsCount: current.variantB.viewsCount + 1 } : current.variantB,
              },
            },
          };
        });
      },

      recordABOrder: (variantId, revenue) => {
        set((state) => {
          const current = state.campaign.abTest || INITIAL_CAMPAIGN.abTest!;
          const isA = variantId === 'var_a';
          return {
            campaign: {
              ...state.campaign,
              abTest: {
                ...current,
                variantA: isA
                  ? {
                      ...current.variantA,
                      ordersCount: current.variantA.ordersCount + 1,
                      totalRevenueIQD: current.variantA.totalRevenueIQD + revenue,
                    }
                  : current.variantA,
                variantB: !isA
                  ? {
                      ...current.variantB,
                      ordersCount: current.variantB.ordersCount + 1,
                      totalRevenueIQD: current.variantB.totalRevenueIQD + revenue,
                    }
                  : current.variantB,
              },
            },
          };
        });
      },

      simulateABTraffic: (sampleSize = 250) => {
        set((state) => {
          const current = state.campaign.abTest || INITIAL_CAMPAIGN.abTest!;
          const splitA = (current.trafficSplitPercentA || 50) / 100;
          const visitsA = Math.round(sampleSize * splitA);
          const visitsB = sampleSize - visitsA;

          // Realistic conversion simulation: ~14.5% for A and ~19.2% for B (+32% uplift)
          const newOrdersA = Math.round(visitsA * (0.13 + Math.random() * 0.03));
          const newOrdersB = Math.round(visitsB * (0.18 + Math.random() * 0.03));
          const revA = newOrdersA * current.variantA.promoPriceIQD;
          const revB = newOrdersB * current.variantB.promoPriceIQD;

          return {
            campaign: {
              ...state.campaign,
              abTest: {
                ...current,
                variantA: {
                  ...current.variantA,
                  viewsCount: current.variantA.viewsCount + visitsA,
                  ordersCount: current.variantA.ordersCount + newOrdersA,
                  totalRevenueIQD: current.variantA.totalRevenueIQD + revA,
                },
                variantB: {
                  ...current.variantB,
                  viewsCount: current.variantB.viewsCount + visitsB,
                  ordersCount: current.variantB.ordersCount + newOrdersB,
                  totalRevenueIQD: current.variantB.totalRevenueIQD + revB,
                },
              },
            },
          };
        });
      },

      resetABTestStats: () => {
        set((state) => {
          const current = state.campaign.abTest || INITIAL_CAMPAIGN.abTest!;
          return {
            campaign: {
              ...state.campaign,
              abTest: {
                ...current,
                activeWinnerId: null,
                variantA: {
                  ...current.variantA,
                  viewsCount: 0,
                  ordersCount: 0,
                  totalRevenueIQD: 0,
                },
                variantB: {
                  ...current.variantB,
                  viewsCount: 0,
                  ordersCount: 0,
                  totalRevenueIQD: 0,
                },
              },
            },
          };
        });
      },

      deployABWinner: (winnerId) => {
        set((state) => {
          const current = state.campaign.abTest || INITIAL_CAMPAIGN.abTest!;
          const targetVariant = winnerId === 'var_a' ? current.variantA : current.variantB;

          return {
            campaign: {
              ...state.campaign,
              headlineAr: targetVariant.headlineAr,
              subheadlineAr: targetVariant.subheadlineAr,
              badgeTextAr: targetVariant.badgeTextAr,
              promoPriceIQD: targetVariant.promoPriceIQD,
              originalPriceIQD: targetVariant.originalPriceIQD,
              bulletPointsAr: targetVariant.bulletPointsAr,
              abTest: {
                ...current,
                activeWinnerId: winnerId,
              },
            },
          };
        });
      },

      // AI Campaign ROAS Sub-Dashboard State & Actions
      campaignRoasRecords: INITIAL_CAMPAIGNS_ROAS,

      updateCampaignAdSpend: (campaignId, adSpendIQD) => {
        set((state) => ({
          campaignRoasRecords: state.campaignRoasRecords.map((c) =>
            c.id === campaignId
              ? { ...c, adSpendIQD, adSpendUSD: Math.round(adSpendIQD / 1500) }
              : c
          ),
        }));
      },

      recordAttributedSale: (campaignId, orderId, revenue) => {
        set((state) => ({
          campaignRoasRecords: state.campaignRoasRecords.map((c) => {
            if (c.id !== campaignId) return c;
            return {
              ...c,
              ordersCount: c.ordersCount + 1,
              attributedRevenueIQD: c.attributedRevenueIQD + revenue,
              linkedOrderIds: c.linkedOrderIds.includes(orderId) ? c.linkedOrderIds : [orderId, ...c.linkedOrderIds],
            };
          }),
        }));
      },

      addCampaignRoasRecord: (record) => {
        set((state) => ({
          campaignRoasRecords: [record, ...state.campaignRoasRecords],
        }));
      },

      deleteCampaignRoasRecord: (id) => {
        set((state) => ({
          campaignRoasRecords: state.campaignRoasRecords.filter((c) => c.id !== id),
        }));
      },

      simulateAttributionOrder: (campaignId) => {
        set((state) => {
          const target = state.campaignRoasRecords.find((c) => c.id === campaignId) || state.campaignRoasRecords[0];
          if (!target) return state;

          const baseAvg = Math.round(target.attributedRevenueIQD / Math.max(1, target.ordersCount));
          const simulatedRevenue = Math.max(35000, baseAvg || 75000);
          const simOrderId = `NP-ORD-${Date.now().toString().slice(-4)}`;

          const newSimOrder: AdminOrderRecord = {
            orderId: simOrderId,
            createdAt: 'الآن (مباشر)',
            workflowStatus: 'in_design',
            urgentDispatch: true,
            items: [
              {
                id: `itm-sim-${Date.now()}`,
                productId: target.productId,
                titleAr: target.productTitleAr,
                titleEn: target.campaignNameEn,
                image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
                category: 'led',
                quantity: 1,
                unitPrice: simulatedRevenue,
                totalPrice: simulatedRevenue,
                customOptions: {
                  customText: `طلب منسوب من إعلان: ${target.campaignNameAr}`,
                  dimensionLabelAr: 'قياس مخصص',
                  dimensionLabelEn: 'Custom Standard',
                  materialLabelAr: 'أكريليك كاست فاخر',
                  materialLabelEn: 'Luxury Cast Acrylic',
                },
              },
            ],
            shipping: {
              fullName: 'زبون حملة إعلانية (محاكى)',
              phone: '+964 780 444 7711',
              governorate: 'بغداد - الكرخ',
              address: 'المنصور - تقاطع الرواد',
              deliveryType: 'express',
              shippingCost: 5000,
            },
            paymentMethod: 'zaincash',
            paymentDetails: {
              status: 'paid',
              gatewayNameAr: 'زين كاش (تحويل مباشر)',
              gatewayNameEn: 'ZainCash',
            },
            subtotal: simulatedRevenue,
            shippingCost: 5000,
            grandTotal: simulatedRevenue + 5000,
            designerNotes: `طلب منسوب لحملة: ${target.campaignNameAr} على ${target.platform}`,
          };

          return {
            adminOrders: [newSimOrder, ...state.adminOrders],
            campaignRoasRecords: state.campaignRoasRecords.map((c) => {
              if (c.id !== target.id) return c;
              return {
                ...c,
                ordersCount: c.ordersCount + 1,
                attributedRevenueIQD: c.attributedRevenueIQD + simulatedRevenue,
                linkedOrderIds: [simOrderId, ...c.linkedOrderIds],
              };
            }),
          };
        });
      },
    }),
    {
      name: 'noon_walqalam_admin_store_v4',
      partialize: (state) => ({
        adminProducts: state.adminProducts,
        deletedProductIds: state.deletedProductIds,
        customFormFields: state.customFormFields,
        adminOrders: state.adminOrders,
        staffMembers: state.staffMembers,
        campaign: state.campaign,
        campaignRoasRecords: state.campaignRoasRecords,
      }),
    }
  )
);

/**
 * Robust helper to always return the full, up-to-date catalog of products,
 * seamlessly merging code-defined products (like new carton boxes & pizza boxes)
 * with any admin customizations — while keeping admin-deleted products hidden.
 */
export function getUnifiedProducts(adminProducts?: ProductItem[]): ProductItem[] {
  const deletedIds = new Set(useAdminStore.getState().deletedProductIds || []);
  if (!adminProducts || adminProducts.length === 0)
    return PRODUCTS.filter((p) => !deletedIds.has(p.id));
  const adminMap = new Map(adminProducts.map((p) => [p.id, p]));
  const merged = PRODUCTS.filter((p) => !deletedIds.has(p.id)).map((defProd) => {
    const adminProd = adminMap.get(defProd.id);
    return adminProd ? { ...defProd, ...adminProd } : defProd;
  });
  const defaultIds = new Set(PRODUCTS.map((p) => p.id));
  const customOnly = adminProducts.filter((p) => !defaultIds.has(p.id));
  return [...merged, ...customOnly];
}

