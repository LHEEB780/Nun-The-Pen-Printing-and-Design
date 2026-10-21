import { create } from 'zustand';
import { OrderRecord, ManufacturingStatus } from './useCartStore';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SavedDesign {
  id: string;
  titleAr: string;
  titleEn: string;
  fileName: string;
  fileSize: string;
  fileType: 'svg' | 'png' | 'pdf' | 'jpg';
  previewUrl: string;
  uploadedAt: string;
  productCategory: string;
  productId?: string;
}

export interface DigitalProof {
  id: string;
  orderId: string;
  productTitleAr: string;
  productTitleEn: string;
  previewUrl: string;
  status: 'pending_approval' | 'approved' | 'revision_requested';
  createdAt: string;
  specsAr: string;
  specsEn: string;
  clientNotes?: string;
  whatsappMessage: string;
}

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  savedDesigns: SavedDesign[];
  pastOrders: OrderRecord[];
  digitalProofs: DigitalProof[];
  hasProofNotification: boolean;
  dismissProofNotification: () => void;
  approveDigitalProof: (id: string) => void;
  requestProofRevision: (id: string, notes: string) => void;
  addDigitalProof: (proof: Omit<DigitalProof, 'id' | 'createdAt'>) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (profileData: Omit<UserProfile, 'id' | 'createdAt'>, password?: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  addSavedDesign: (design: Omit<SavedDesign, 'id' | 'uploadedAt'>) => void;
  deleteSavedDesign: (id: string) => void;
  renameSavedDesign: (id: string, newTitle: string) => void;
  addOrderToHistory: (order: OrderRecord) => void;
  updateOrderManufacturingStatus: (orderId: string, status: ManufacturingStatus) => void;
}

// Initial dummy user for immediate demo evaluation
const DEMO_USER: UserProfile = {
  id: 'usr-noon-8821',
  email: 'laheeb@noonwalqalam.com',
  fullName: 'مصطفى حيدر الربيعي',
  phone: '+964 780 123 4567',
  governorate: 'بغداد - الكرخ',
  address: 'بغداد، حي المنصور، شارع 14 رمضان، عمارة الأفق، الطابق 2',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  createdAt: '2026-02-15',
};

// Realistic mock past orders for customer history with live manufacturing tracking
const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderId: 'NP-2026-8419',
    createdAt: '2026-03-28 14:30',
    manufacturingStatus: 'printing', // في المطبعة
    manufacturingStepIndex: 2,
    estimatedDelivery: 'غداً، خلال ساعات المساء (بغداد)',
    workshopNotes: 'تم اعتماد البروفة بنجاح، وجاري قص الأكريليك الكريستالي 4 ملم بالليزر مع تلميع الحواف وتثبيت إضاءة LED المضيئة.',
    items: [
      {
        id: 'ord-item-1',
        productId: 'prod-travel-acrylic-sign',
        titleAr: 'لوحة أكريليك مضيئة للمكاتب والشركات',
        titleEn: 'Edge-Lit Corporate Acrylic Sign',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
        category: 'led',
        quantity: 1,
        unitPrice: 117000,
        totalPrice: 117000,
        customOptions: {
          customText: 'مكتب المحامي حيدر الربيعي للاستشارات',
          fontName: 'الخط الكوفي الملكي (Kufi)',
          dimensionLabelAr: 'جداري متوسط (60 × 40 سم)',
          dimensionLabelEn: 'Medium Wall (60 × 40 cm)',
          materialLabelAr: 'أكريليك مثلج فاخر (Frosted Matte)',
          materialLabelEn: 'Luxury Matte Frosted Acrylic',
          ledColorNameAr: 'أزرق سماوي للشركات',
          ledColorNameEn: 'Aviation Sky Blue',
          ledHex: '#0ea5e9',
          logoFileName: 'al-rubaie-law-firm-logo.svg',
          standTypeAr: 'مسامير استيل فضية ستاند أوف',
          notes: 'يرجى وضع الشعار أعلى الاسم بالوسط تماماً',
        },
      },
    ],
    shipping: {
      fullName: 'مصطفى حيدر الربيعي',
      phone: '+964 780 123 4567',
      governorate: 'بغداد - الكرخ',
      address: 'بغداد، المنصور، شارع 14 رمضان، عمارة الأفق',
      deliveryType: 'standard',
      shippingCost: 5000,
    },
    paymentMethod: 'zaincash',
    paymentDetails: {
      transactionId: 'ZC-8841920',
      status: 'paid',
      gatewayNameAr: 'زين كاش (ZainCash)',
      gatewayNameEn: 'ZainCash Wallet',
    },
    subtotal: 117000,
    shippingCost: 5000,
    grandTotal: 122000,
  },
  {
    orderId: 'NP-2026-9530',
    createdAt: '2026-04-02 09:15',
    manufacturingStatus: 'designing', // قيد التصميم
    manufacturingStepIndex: 1,
    estimatedDelivery: 'خلال 48 ساعة بعد اعتماد البروفة',
    workshopNotes: 'فريق الخط العربي يُجهز مسودة المخطوطة الكوفية والبروفة الرقمية 3D لإرسالها لحسابك وللواتساب للاعتماد النهائي.',
    items: [
      {
        id: 'ord-item-3',
        productId: 'prod-crystal-award-trophy',
        titleAr: 'درع تكريم أكريليك كريستالي فاخر مع قاعدة خشبية',
        titleEn: 'Luxury Crystal Acrylic Trophy with Walnut Base',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
        category: 'acrylic',
        quantity: 3,
        unitPrice: 45000,
        totalPrice: 135000,
        customOptions: {
          customText: 'درع التميز والإبداع السنوي لعام 2026',
          fontName: 'خط الثلث الجلي الاحترافي',
          dimensionLabelAr: 'ارتفاع 28 سم × عرض 16 سم',
          dimensionLabelEn: 'Height 28cm × Width 16cm',
          materialLabelAr: 'كريستال أكريليك فائق الشفافية سماكة 10 ملم',
          materialLabelEn: '10mm Ultra-Clear Cast Acrylic',
          logoFileName: 'award-crest-baghdad.svg',
          notes: 'حفر ليزري عميق مع تذهيب الحروف',
        },
      },
    ],
    shipping: {
      fullName: 'مصطفى حيدر الربيعي',
      phone: '+964 780 123 4567',
      governorate: 'بغداد - الكرخ',
      address: 'بغداد، المنصور، شارع 14 رمضان',
      deliveryType: 'standard',
      shippingCost: 5000,
    },
    paymentMethod: 'zaincash',
    paymentDetails: {
      transactionId: 'ZC-9930182',
      status: 'paid',
      gatewayNameAr: 'زين كاش (ZainCash)',
      gatewayNameEn: 'ZainCash Wallet',
    },
    subtotal: 135000,
    shippingCost: 5000,
    grandTotal: 140000,
  },
  {
    orderId: 'NP-2026-7201',
    createdAt: '2026-03-12 11:15',
    manufacturingStatus: 'ready_for_shipping', // جاهز للشحن
    manufacturingStepIndex: 3,
    estimatedDelivery: 'اليوم - قيد التسليم للمندوب',
    workshopNotes: 'تم فحص جودة البصمة الحرارية الذهبية وتغليف الكروت بصناديق فاخرة ضد الرطوبة والصدمات.',
    items: [
      {
        id: 'ord-item-2',
        productId: 'prod-foil-cards',
        titleAr: 'كروت أعمال قطنية مع بصمة حرارية وقص ليزري',
        titleEn: 'Letterpress & Hot-Foil Business Cards',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
        category: 'cards',
        quantity: 250,
        unitPrice: 340,
        totalPrice: 85000,
        customOptions: {
          customText: 'المحامي مصطفى الربيعي',
          fontName: 'خط كلاسيكي عصري (Cairo)',
          dimensionLabelAr: 'المقاس العالمي القياسي (9 × 5 سم)',
          dimensionLabelEn: 'Standard International (9 × 5 cm)',
          materialLabelAr: 'ورق أسود ملكي فاحم 700 غم مع بصمة ذهبية',
          materialLabelEn: '700gsm Royal Black Board + Gold Foil',
          paperTypeAr: 'أسود ملكي فاحم 700 غم (Black Core)',
          paperTypeEn: '700gsm Deep Black Core Stock',
          foilFinishAr: 'بصمة ذهبية لامعة كلاسيكية',
          foilFinishEn: 'Polished Mirror Gold Foil',
          logoFileName: 'law-scale-emblem.pdf',
          discountPercentage: 15,
        },
      },
    ],
    shipping: {
      fullName: 'مصطفى حيدر الربيعي',
      phone: '+964 780 123 4567',
      governorate: 'بغداد - الكرخ',
      address: 'بغداد، المنصور، شارع 14 رمضان',
      deliveryType: 'standard',
      shippingCost: 5000,
    },
    paymentMethod: 'fib',
    paymentDetails: {
      transactionId: 'FIB-992019',
      status: 'paid',
      gatewayNameAr: 'المصرف العراقي الأول (FIB)',
      gatewayNameEn: 'First Iraqi Bank (FIB)',
    },
    subtotal: 85000,
    shippingCost: 5000,
    grandTotal: 90000,
  },
];

const INITIAL_SAVED_DESIGNS: SavedDesign[] = [
  {
    id: 'des-1',
    titleAr: 'شعار مكتب المحاماة الفيكتور (أصلي)',
    titleEn: 'Law Firm Official Vector Logo',
    fileName: 'al-rubaie-law-firm-logo.svg',
    fileSize: '1.2 MB',
    fileType: 'svg',
    previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
    uploadedAt: '2026-03-28',
    productCategory: 'led',
    productId: 'prod-travel-acrylic-sign',
  },
  {
    id: 'des-2',
    titleAr: 'ميزان العدالة - بصمة مذهبة لكروت الأعمال',
    titleEn: 'Scales of Justice Emboss Stamp',
    fileName: 'law-scale-emblem.pdf',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    previewUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    uploadedAt: '2026-03-12',
    productCategory: 'cards',
    productId: 'prod-foil-cards',
  },
  {
    id: 'des-3',
    titleAr: 'صورة شخصية مرجعية لرسم البورتريه',
    titleEn: 'Portrait Reference Photo',
    fileName: 'personal-portrait-hd.png',
    fileSize: '4.8 MB',
    fileType: 'png',
    previewUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    uploadedAt: '2026-02-20',
    productCategory: 'portraits',
    productId: 'prod-vector-portrait',
  },
];

const INITIAL_PROOFS: DigitalProof[] = [
  {
    id: 'proof-9021',
    orderId: 'NP-2026-8419',
    productTitleAr: 'درع أكريليك مكتبي 3D LED مع حفر ليزري ميكروني',
    productTitleEn: '3D Optical LED Acrylic Executive Sign',
    previewUrl: '/images/products/travel_agency_desk_front_1791817396012.jpg',
    status: 'pending_approval',
    createdAt: '2026-04-12 11:20',
    specsAr: 'أكريليك كاست 5 ملم ألماني، إضاءة سماوية 12V، قاعدة لمسية بيضاء، نقش الشعار ورقم الهاتف',
    specsEn: '5mm German Cast Acrylic, Cyan LED 12V, Touch White Base, Laser Engraved Logo',
    whatsappMessage: 'مرحباً استوديو نون والقلم، بخصوص بروفة تصميم طلب رقم NP-2026-8419 أود مناقشة تفاصيل التنفيذ والتعديل.',
  },
];

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Start logged-out in production: every visitor gets a clean session.
  // (Demo account remains available through the login modal for evaluation.)
  user: null,
  isAuthenticated: false,
  savedDesigns: INITIAL_SAVED_DESIGNS,
  pastOrders: INITIAL_ORDERS,
  digitalProofs: INITIAL_PROOFS,
  hasProofNotification: true,

  dismissProofNotification: () => {
    set({ hasProofNotification: false });
  },

  approveDigitalProof: (id) => {
    set((state) => ({
      digitalProofs: state.digitalProofs.map((p) =>
        p.id === id ? { ...p, status: 'approved' as const } : p
      ),
      hasProofNotification: false,
    }));
  },

  requestProofRevision: (id, notes) => {
    set((state) => ({
      digitalProofs: state.digitalProofs.map((p) =>
        p.id === id ? { ...p, status: 'revision_requested' as const, clientNotes: notes } : p
      ),
    }));
  },

  addDigitalProof: (proofData) => {
    const newProof: DigitalProof = {
      ...proofData,
      id: `proof-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    set((state) => ({
      digitalProofs: [newProof, ...state.digitalProofs],
      hasProofNotification: true,
    }));
  },

  login: async (email, password) => {
    // Simulated authentication API latency
    await new Promise((res) => setTimeout(res, 800));
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email || 'user@noonwalqalam.com',
      fullName: email.split('@')[0] === 'laheeb' ? 'مصطفى حيدر الربيعي' : email.split('@')[0],
      phone: '+964 780 000 0000',
      governorate: 'بغداد - الكرخ',
      address: 'بغداد، العراق',
      createdAt: new Date().toISOString().split('T')[0],
    };
    set({ user, isAuthenticated: true });
    return { success: true };
  },

  register: async (profileData, password) => {
    await new Promise((res) => setTimeout(res, 900));
    const newUser: UserProfile = {
      ...profileData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set({ user: newUser, isAuthenticated: true });
    return { success: true };
  },

  forgotPassword: async (email) => {
    await new Promise((res) => setTimeout(res, 800));
    return {
      success: true,
      message: `تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني: ${email}`,
    };
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updatedData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedData } : null,
    }));
  },

  addSavedDesign: (designData) => {
    const newDesign: SavedDesign = {
      ...designData,
      id: `des-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      savedDesigns: [newDesign, ...state.savedDesigns],
    }));
  },

  deleteSavedDesign: (id) => {
    set((state) => ({
      savedDesigns: state.savedDesigns.filter((d) => d.id !== id),
    }));
  },

  renameSavedDesign: (id, newTitle) => {
    set((state) => ({
      savedDesigns: state.savedDesigns.map((d) =>
        d.id === id ? { ...d, titleAr: newTitle, titleEn: newTitle } : d
      ),
    }));
  },

  addOrderToHistory: (order) => {
    set((state) => ({
      pastOrders: [
        {
          ...order,
          manufacturingStatus: order.manufacturingStatus || 'under_review',
          manufacturingStepIndex: order.manufacturingStepIndex ?? 0,
        },
        ...state.pastOrders,
      ],
    }));
  },

  updateOrderManufacturingStatus: (orderId, status) => {
    const statusToIndex: Record<ManufacturingStatus, number> = {
      under_review: 0,
      designing: 1,
      printing: 2,
      ready_for_shipping: 3,
      delivered: 4,
    };

    set((state) => ({
      pastOrders: state.pastOrders.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        return {
          ...ord,
          manufacturingStatus: status,
          manufacturingStepIndex: statusToIndex[status] ?? 0,
        };
      }),
    }));
  },
}));
