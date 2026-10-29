import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

export type LoyaltyTierId = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyTierInfo {
  id: LoyaltyTierId;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  minPoints: number;
  maxPoints: number;
  multiplier: number;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  perksAr: string[];
  perksEn: string[];
}

export interface PointsTransaction {
  id: string;
  date: string;
  points: number;
  type: 'purchase' | 'welcome_bonus' | 'proof_approval' | 'review_reward' | 'redemption';
  descriptionAr: string;
  descriptionEn: string;
  orderId?: string;
}

export interface RedeemedReward {
  id: string;
  rewardCode: string;
  titleAr: string;
  titleEn: string;
  pointsCost: number;
  discountAmountIQD: number;
  redeemedAt: string;
}

export const LOYALTY_TIERS: LoyaltyTierInfo[] = [
  {
    id: 'bronze',
    nameAr: 'المستوى البرونزي',
    nameEn: 'Bronze Tier',
    taglineAr: 'حرفي مبتدئ',
    taglineEn: 'Craft Apprentice',
    minPoints: 0,
    maxPoints: 499,
    multiplier: 1.0,
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    accentColor: '#d97706',
    perksAr: [
      '1 نقطة لكل 1,000 د.ع مشتريات',
      'خصم 5% على طلبات التخصيص اليدوي',
      'شحن مجاني للطلبات فوق 75,000 د.ع',
    ],
    perksEn: [
      '1 point per 1,000 IQD spent',
      '5% off custom handicraft orders',
      'Free shipping on orders over 75,000 IQD',
    ],
  },
  {
    id: 'silver',
    nameAr: 'المستوى الفضي',
    nameEn: 'Silver Tier',
    taglineAr: 'شريك الإبداع',
    taglineEn: 'Creative Partner',
    minPoints: 500,
    maxPoints: 1499,
    multiplier: 1.25,
    badgeBg: 'bg-slate-200',
    badgeText: 'text-slate-800',
    accentColor: '#64748b',
    perksAr: [
      '1.25x مضاعف نقاط على جميع المشتريات',
      'خصم دائم 10% على كافة المنتجات',
      'أولوية مراجعة واعتماد البروفات خلال ساعتين',
      'عينات خامات ومطبوعات مجانية مع كل شحنة',
    ],
    perksEn: [
      '1.25x points multiplier on all orders',
      '10% permanent discount on all products',
      'Priority 2-hour digital proof review',
      'Free tactile material samples with every shipment',
    ],
  },
  {
    id: 'gold',
    nameAr: 'المستوى الذهبي',
    nameEn: 'Gold Tier',
    taglineAr: 'النخبة الملكية',
    taglineEn: 'Royal Elite',
    minPoints: 1500,
    maxPoints: 3499,
    multiplier: 1.5,
    badgeBg: 'bg-amber-400',
    badgeText: 'text-slate-950',
    accentColor: '#f59e0b',
    perksAr: [
      '1.5x مضاعف نقاط استثنائي',
      'خصم 15% على إجمالي الفاتورة',
      'ترقية خامات مجانية (بصمة حرارية مذهبة)',
      'شحن مجاني دائم لجميع محافظات العراق',
      'جلسة استشارة تصميم مباشرة مع كبير الخطاطين',
    ],
    perksEn: [
      '1.5x points multiplier on all purchases',
      '15% instant order discount',
      'Complimentary hot-foil / edge gilding upgrade',
      'Free shipping to all Iraqi governorates',
      'Direct bespoke consultation with Master Calligrapher',
    ],
  },
  {
    id: 'platinum',
    nameAr: 'المستوى البلاتيني VIP',
    nameEn: 'Platinum VIP',
    taglineAr: 'الشريك الاستراتيجي',
    taglineEn: 'Strategic VIP Partner',
    minPoints: 3500,
    maxPoints: Infinity,
    multiplier: 2.0,
    badgeBg: 'bg-gradient-to-r from-slate-900 to-amber-950',
    badgeText: 'text-amber-300',
    accentColor: '#1e1b4b',
    perksAr: [
      '2.0x مضاعفة النقاط بالكامل',
      'خصم VIP فوري بنسبة 20%',
      'تصنيع فوري مستعجل خلال 24 ساعة بمصنع بغداد',
      'درع أكريليك مكتبي مذهب مجاني سنوياً',
      'مدير حساب وخط مباشر مخصص 24/7',
    ],
    perksEn: [
      '2.0x double points on every single dinar',
      '20% permanent VIP discount',
      'Express 24-hour manufacturing turnaround',
      'Annual complimentary bespoke gilded acrylic plaque',
      'Dedicated 24/7 VIP personal account artisan',
    ],
  },
];

export function calculateLoyaltyTier(points: number) {
  const currentTier =
    LOYALTY_TIERS.find((t) => points >= t.minPoints && points <= t.maxPoints) || LOYALTY_TIERS[0];

  const currentTierIndex = LOYALTY_TIERS.findIndex((t) => t.id === currentTier.id);
  const nextTier = currentTierIndex < LOYALTY_TIERS.length - 1 ? LOYALTY_TIERS[currentTierIndex + 1] : null;

  let pointsToNextTier = 0;
  let progressPercentage = 100;

  if (nextTier) {
    pointsToNextTier = Math.max(0, nextTier.minPoints - points);
    const range = nextTier.minPoints - currentTier.minPoints;
    const progressIntoCurrentTier = Math.max(0, points - currentTier.minPoints);
    progressPercentage = Math.min(100, Math.max(0, Math.round((progressIntoCurrentTier / range) * 100)));
  }

  return {
    currentTier,
    nextTier,
    pointsToNextTier,
    progressPercentage,
    currentTierIndex,
  };
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
  wishlist: string[];
  isWishlistOpen: boolean;
  setIsWishlistOpen: (isOpen: boolean) => void;
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  loyaltyPoints: number;
  pointsHistory: PointsTransaction[];
  redeemedRewards: RedeemedReward[];
  earnPoints: (
    points: number,
    descriptionAr: string,
    descriptionEn: string,
    type?: PointsTransaction['type'],
    orderId?: string
  ) => void;
  redeemReward: (reward: {
    id: string;
    pointsCost: number;
    titleAr: string;
    titleEn: string;
    discountCode: string;
    discountAmountIQD: number;
  }) => { success: boolean; message: string; discountCode?: string };
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

const INITIAL_WISHLIST: string[] = ['prod-travel-acrylic-sign', 'prod-foil-cards'];

export const INITIAL_POINTS_HISTORY: PointsTransaction[] = [
  {
    id: 'tx-101',
    date: '2026-03-28 14:30',
    points: 152,
    type: 'purchase',
    descriptionAr: 'نقاط شراء طلب #NP-2026-8419 (لوحة أكريليك إضاءة LED)',
    descriptionEn: 'Purchase points for order #NP-2026-8419',
    orderId: 'NP-2026-8419',
  },
  {
    id: 'tx-102',
    date: '2026-03-20 18:00',
    points: -100,
    type: 'redemption',
    descriptionAr: 'استبدال قسيمة خصم ترويجي 10,000 د.ع (كود LOYAL-10K)',
    descriptionEn: 'Redeemed 10,000 IQD discount voucher (code LOYAL-10K)',
  },
  {
    id: 'tx-103',
    date: '2026-03-15 11:20',
    points: 228,
    type: 'purchase',
    descriptionAr: 'نقاط شراء طلب #NP-2026-7910 (كروت أعمال فاخرة بصمة ذهبية)',
    descriptionEn: 'Purchase points for order #NP-2026-7910',
    orderId: 'NP-2026-7910',
  },
  {
    id: 'tx-104',
    date: '2026-03-01 09:15',
    points: 850,
    type: 'purchase',
    descriptionAr: 'نقاط شراء طلب #NP-2026-6540 (علب كرتون مقوى ريجيد بوكس فاخرة)',
    descriptionEn: 'Purchase points for order #NP-2026-6540',
    orderId: 'NP-2026-6540',
  },
  {
    id: 'tx-105',
    date: '2026-02-20 16:45',
    points: 50,
    type: 'proof_approval',
    descriptionAr: 'مكافأة اعتماد بروفة تصميم رقمية فورية',
    descriptionEn: 'Digital design proof approval reward',
  },
  {
    id: 'tx-106',
    date: '2026-02-15 10:00',
    points: 100,
    type: 'welcome_bonus',
    descriptionAr: 'مكافأة الانضمام وتوثيق الحساب في نُون والقَلَم',
    descriptionEn: 'Welcome bonus on verified account creation',
  },
];

export const INITIAL_REDEEMED_REWARDS: RedeemedReward[] = [
  {
    id: 'rew-101',
    rewardCode: 'LOYAL-10K',
    titleAr: 'قسيمة خصم 10,000 د.ع',
    titleEn: '10,000 IQD Discount Voucher',
    pointsCost: 100,
    discountAmountIQD: 10000,
    redeemedAt: '2026-03-20',
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Start logged-out in production: every visitor gets a clean session.
      // (Demo account remains available through the login modal for evaluation.)
      user: null,
      isAuthenticated: false,
      savedDesigns: INITIAL_SAVED_DESIGNS,
      pastOrders: INITIAL_ORDERS,
      digitalProofs: INITIAL_PROOFS,
      wishlist: INITIAL_WISHLIST,
      isWishlistOpen: false,
      setIsWishlistOpen: (isOpen: boolean) => set({ isWishlistOpen: isOpen }),
      loyaltyPoints: 1280,
      pointsHistory: INITIAL_POINTS_HISTORY,
      redeemedRewards: INITIAL_REDEEMED_REWARDS,
      hasProofNotification: true,

      toggleWishlist: (productId: string) => {
        const exists = get().wishlist.includes(productId);
        if (exists) {
          set((state) => ({ wishlist: state.wishlist.filter((id) => id !== productId) }));
          return false;
        } else {
          set((state) => ({ wishlist: [productId, ...state.wishlist] }));
          return true;
        }
      },

      isInWishlist: (productId: string) => {
        return get().wishlist.includes(productId);
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({ wishlist: state.wishlist.filter((id) => id !== productId) }));
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },

      earnPoints: (points, descriptionAr, descriptionEn, type = 'purchase', orderId) => {
        const newTx: PointsTransaction = {
          id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          points,
          type,
          descriptionAr,
          descriptionEn,
          orderId,
        };
        set((state) => ({
          loyaltyPoints: Math.max(0, state.loyaltyPoints + points),
          pointsHistory: [newTx, ...state.pointsHistory],
        }));
      },

      redeemReward: (reward) => {
        const currentPoints = get().loyaltyPoints;
        if (currentPoints < reward.pointsCost) {
          return {
            success: false,
            message: 'رصيدك الحالي لا يكفي لاستبدال هذه المكافأة',
          };
        }

        const newTx: PointsTransaction = {
          id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          points: -reward.pointsCost,
          type: 'redemption',
          descriptionAr: `استبدال ${reward.titleAr} (كود: ${reward.discountCode})`,
          descriptionEn: `Redeemed ${reward.titleEn} (Code: ${reward.discountCode})`,
        };

        const newRedeemed: RedeemedReward = {
          id: `rew-${Date.now()}`,
          rewardCode: reward.discountCode,
          titleAr: reward.titleAr,
          titleEn: reward.titleEn,
          pointsCost: reward.pointsCost,
          discountAmountIQD: reward.discountAmountIQD,
          redeemedAt: new Date().toISOString().split('T')[0],
        };

        set((state) => ({
          loyaltyPoints: state.loyaltyPoints - reward.pointsCost,
          pointsHistory: [newTx, ...state.pointsHistory],
          redeemedRewards: [newRedeemed, ...state.redeemedRewards],
        }));

        return {
          success: true,
          message: `تم استبدال ${reward.titleAr} بنجاح! كود الخصم: ${reward.discountCode}`,
          discountCode: reward.discountCode,
        };
      },

      dismissProofNotification: () => {
        set({ hasProofNotification: false });
      },

      approveDigitalProof: (id) => {
        const bonusPoints = 50;
        const newTx: PointsTransaction = {
          id: `pt-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          points: bonusPoints,
          type: 'proof_approval',
          descriptionAr: 'مكافأة اعتماد بروفة تصميم رقمية فورية',
          descriptionEn: 'Digital design proof approval reward',
        };

        set((state) => ({
          digitalProofs: state.digitalProofs.map((p) =>
            p.id === id ? { ...p, status: 'approved' as const } : p
          ),
          hasProofNotification: false,
          loyaltyPoints: state.loyaltyPoints + bonusPoints,
          pointsHistory: [newTx, ...state.pointsHistory],
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
        // Fast response for seamless UX
        await new Promise((res) => setTimeout(res, 250));
        const normalized = (email || '').trim().toLowerCase();
        const isDemo = !normalized || normalized.includes('laheeb');
        const user: UserProfile = isDemo
          ? DEMO_USER
          : {
              id: `usr-${Date.now()}`,
              email: normalized || 'user@noonwalqalam.com',
              fullName: normalized.split('@')[0],
              phone: '+964 780 000 0000',
              governorate: 'بغداد - الكرخ',
              address: 'بغداد، العراق',
              createdAt: new Date().toISOString().split('T')[0],
            };
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      register: async (profileData, password) => {
        await new Promise((res) => setTimeout(res, 300));
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
    const currentPoints = get().loyaltyPoints;
    const tier = calculateLoyaltyTier(currentPoints).currentTier;
    const calculatedPoints = Math.max(10, Math.floor((order.grandTotal / 1000) * tier.multiplier));
    const orderWithPoints: OrderRecord = {
      ...order,
      pointsEarned: order.pointsEarned ?? calculatedPoints,
      manufacturingStatus: order.manufacturingStatus || 'under_review',
      manufacturingStepIndex: order.manufacturingStepIndex ?? 0,
    };

    const newTx: PointsTransaction = {
      id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      points: calculatedPoints,
      type: 'purchase',
      descriptionAr: `نقاط شراء طلب #${order.orderId}`,
      descriptionEn: `Purchase points for order #${order.orderId}`,
      orderId: order.orderId,
    };

    set((state) => ({
      loyaltyPoints: state.loyaltyPoints + calculatedPoints,
      pointsHistory: [newTx, ...state.pointsHistory],
      pastOrders: [orderWithPoints, ...state.pastOrders],
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
    }),
    {
      name: 'noon-auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, _version: number) => {
        return persistedState || {};
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        savedDesigns: state.savedDesigns,
        pastOrders: state.pastOrders,
        digitalProofs: state.digitalProofs,
        wishlist: state.wishlist,
        loyaltyPoints: state.loyaltyPoints,
        pointsHistory: state.pointsHistory,
        redeemedRewards: state.redeemedRewards,
      }),
    }
  )
);


