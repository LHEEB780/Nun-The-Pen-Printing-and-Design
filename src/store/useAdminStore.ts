import { create } from 'zustand';
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

export const useAdminStore = create<AdminStore>((set) => ({
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
}));
