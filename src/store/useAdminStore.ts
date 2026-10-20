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
  platformStats?: Record<string, PlatformStatItem>;
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
  addProduct: (prod: ProductItem) => void;
  updateProduct: (id: string, updated: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefaults: () => void;

  // Orders Management State
  adminOrders: AdminOrderRecord[];
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
  platformStats: {
    tiktok: { views: 76, orders: 11, revenue: 418000 },
    facebook: { views: 48, orders: 6, revenue: 228000 },
    instagram: { views: 32, orders: 4, revenue: 152000 },
    snapchat: { views: 12, orders: 2, revenue: 76000 },
  },
};

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
        }));
      },
      resetProductsToDefaults: () => {
        set({ adminProducts: PRODUCTS });
      },

      adminOrders: INITIAL_ADMIN_ORDERS,
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
              urgencyStockLeft: Math.max(1, (state.campaign.urgencyStockLeft || 7) - 1),
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
    }),
    {
      name: 'noon_walqalam_admin_store_v4',
      partialize: (state) => ({
        adminProducts: state.adminProducts,
        customFormFields: state.customFormFields,
        adminOrders: state.adminOrders,
        staffMembers: state.staffMembers,
        campaign: state.campaign,
      }),
    }
  )
);

/**
 * Robust helper to always return the full, up-to-date catalog of products,
 * seamlessly merging code-defined products (like new carton boxes & pizza boxes)
 * with any admin customizations.
 */
export function getUnifiedProducts(adminProducts?: ProductItem[]): ProductItem[] {
  if (!adminProducts || adminProducts.length === 0) return PRODUCTS;
  const adminMap = new Map(adminProducts.map((p) => [p.id, p]));
  const merged = PRODUCTS.map((defProd) => {
    const adminProd = adminMap.get(defProd.id);
    return adminProd ? { ...defProd, ...adminProd } : defProd;
  });
  const defaultIds = new Set(PRODUCTS.map((p) => p.id));
  const customOnly = adminProducts.filter((p) => !defaultIds.has(p.id));
  return [...merged, ...customOnly];
}

