import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PartnerRank = 'junior' | 'specialist' | 'manager' | 'ambassador';
export type PartnerStatus = 'active' | 'pending' | 'suspended';
export type CRMDealStage = 'new' | 'contacted' | 'quoted' | 'negotiating' | 'won' | 'lost';
export type WithdrawalMethod = 'zain_cash' | 'asia_hawala' | 'cash_office';
export type WithdrawalStatus = 'pending' | 'paid' | 'rejected';

export interface RankInfo {
  id: PartnerRank;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  bonusPercent: number;
  minClients: number;
  minSalesIQD: number;
  colorClass: string;
  badgeColorClass: string;
  descriptionAr: string;
}

export const PARTNER_RANKS_CONFIG: Record<PartnerRank, RankInfo> = {
  junior: {
    id: 'junior',
    titleAr: 'مندوب مبيعات مبتدئ',
    titleEn: 'Junior Sales Partner',
    badgeAr: 'رتبة البداية',
    badgeEn: 'Starter Rank',
    bonusPercent: 0,
    minClients: 0,
    minSalesIQD: 0,
    colorClass: 'text-stone-700 bg-stone-100 border-stone-300',
    badgeColorClass: 'bg-stone-100 text-stone-800 border-stone-300',
    descriptionAr: 'النسبة الأساسية المحددة للمنتجات (10%)',
  },
  specialist: {
    id: 'specialist',
    titleAr: 'أخصائي مبيعات معتمد',
    titleEn: 'Certified Sales Specialist',
    badgeAr: 'أخصائي معتمد',
    badgeEn: 'Certified Specialist',
    bonusPercent: 2,
    minClients: 3,
    minSalesIQD: 2_000_000,
    colorClass: 'text-sky-800 bg-sky-50 border-sky-300',
    badgeColorClass: 'bg-sky-100 text-sky-800 border-sky-300',
    descriptionAr: 'إنجاز 3 عملاء مرتبطين أو 2 مليون د.ع مبيعات (+2% عمولة إضافية)',
  },
  manager: {
    id: 'manager',
    titleAr: 'مدير حسابات وعلاقات عملاء',
    titleEn: 'Key Account Manager',
    badgeAr: 'مدير حسابات',
    badgeEn: 'Account Manager',
    bonusPercent: 4,
    minClients: 10,
    minSalesIQD: 10_000_000,
    colorClass: 'text-purple-800 bg-purple-50 border-purple-300',
    badgeColorClass: 'bg-purple-100 text-purple-800 border-purple-300',
    descriptionAr: 'إنجاز 10 عملاء مرتبطين أو 10 مليون د.ع مبيعات (+4% عمولة إضافية)',
  },
  ambassador: {
    id: 'ambassador',
    titleAr: 'سفير وشريك رئيسي لنون والقلم',
    titleEn: 'Noon & Pen Ambassador',
    badgeAr: 'سفير ذهبي 👑',
    badgeEn: 'Ambassador 👑',
    bonusPercent: 7,
    minClients: 25,
    minSalesIQD: 25_000_000,
    colorClass: 'text-amber-900 bg-amber-50 border-amber-400',
    badgeColorClass: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border-amber-400 shadow-2xs font-bold',
    descriptionAr: 'إنجاز 25 عميلاً مرتبطاً أو 25 مليون د.ع (+7% عمولة إضافية وشارة ذهبية)',
  },
};

export interface PartnerItem {
  id: string;
  employeeId: string; // e.g. NQ-EMP-0001
  fullName: string;
  phone: string; // unique phone
  whatsapp: string;
  city: string;
  status: PartnerStatus;
  joinedAt: string;
  referralCode: string; // e.g. NQ-9482
  rank: PartnerRank;
  pinCode: string; // 4-digit PIN for portal login
  notes?: string;
  certifications?: string[]; // array of certified product IDs
}

export interface PartnerApplication {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  city: string;
  experience: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
}

export interface LinkedClient {
  clientPhone: string; // Unique primary key
  clientName: string;
  partnerId: string;
  linkedAt: string;
  source: 'code' | 'manual';
  totalOrdersCount: number;
  totalSpentIQD: number;
  lastOrderDate?: string;
}

export interface CommissionItemBreakdown {
  productId: string;
  titleAr: string;
  quantity: number;
  lineTotal: number;
  ratePercent: number;
  commission: number;
}

export interface CommissionRecord {
  id: string;
  partnerId: string;
  orderId: string;
  clientName: string;
  clientPhone: string;
  orderTotalIQD: number;
  commissionAmountIQD: number;
  appliedRate: number; // e.g. 12 = 10% base + 2% bonus
  rankBonusApplied: number;
  createdAt: string;
  status: 'approved' | 'cancelled';
  itemsBreakdown?: CommissionItemBreakdown[];
}

export interface WithdrawalRequest {
  id: string;
  partnerId: string;
  amountIQD: number;
  method: WithdrawalMethod;
  accountDetails: string; // Phone number for Zain Cash or pickup note
  notes?: string;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface CRMDealNote {
  id: string;
  date: string;
  authorName: string;
  text: string;
}

export interface CRMDeal {
  id: string;
  partnerId: string;
  businessName: string;
  businessType: 'restaurant' | 'cafe' | 'office' | 'hotel' | 'clinic' | 'retail' | 'other';
  customBusinessType?: string; // Optional custom business/line of work when businessType is 'other'
  contactPerson: string;
  phone: string;
  city: string;
  stage: CRMDealStage;
  estimatedValueIQD: number;
  notes: CRMDealNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductAcademyGuide {
  productId: string;
  productTitleAr: string;
  category: string;
  targetAudienceAr: string;
  pitchPointsAr: string[];
  whatsappPitchAr: string;
  pricingTipsAr: string;
  commonMistakesAr: string;
}

export type QRCampaignFormat = 'table_tent' | 'sticker' | 'poster' | 'vip_card';
export type QRThemeColor = 'gold_black' | 'midnight_navy' | 'emerald_luxury' | 'ruby_royal';

export interface QRCampaign {
  id: string; // e.g. "QRC-9281"
  campaignCode: string; // e.g. "CAMP-BAGHDAD-01"
  titleAr: string;
  titleEn: string;
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  targetLocation?: string;
  destinationPath: string; // e.g. "/" or "/?offers=true" or "/?product=prod-pizza-box"
  campaignDiscountNoteAr: string;
  campaignDiscountNoteEn: string;
  format: QRCampaignFormat;
  themeColor: QRThemeColor;
  includeLogo: boolean;
  scanCount: number;
  totalOrdersCount: number;
  totalSalesIQD: number;
  createdAt: string;
  qrPayloadUrl: string;
}

interface AffiliateStore {
  // State
  partners: PartnerItem[];
  applications: PartnerApplication[];
  linkedClients: Record<string, LinkedClient>; // Key: normalized clientPhone
  commissionLedger: CommissionRecord[];
  withdrawals: WithdrawalRequest[];
  crmDeals: CRMDeal[];
  productCommissionRates: Record<string, number>; // Product ID -> percentage (e.g. 10)
  defaultBaseCommissionPercent: number;
  academyGuides: ProductAcademyGuide[];
  announcementAr: string;
  announcementUpdatedAt: string;
  currentPartnerSessionId: string | null;
  qrCampaigns: QRCampaign[];

  // Session
  loginPartner: (phone: string, pinCode: string) => { success: boolean; error?: string; partner?: PartnerItem };
  logoutPartner: () => void;
  setCurrentPartnerSession: (partnerId: string | null) => void;

  // Partner Management (Admin)
  addPartner: (partner: Omit<PartnerItem, 'id' | 'employeeId' | 'referralCode' | 'pinCode'>) => PartnerItem;
  updatePartner: (id: string, updated: Partial<PartnerItem>) => void;
  togglePartnerStatus: (id: string) => void;
  setPartnerRank: (id: string, rank: PartnerRank) => void;
  deletePartner: (id: string) => void;

  // QR Marketing Campaigns Engine
  addQRCampaign: (campaign: Omit<QRCampaign, 'id' | 'createdAt' | 'scanCount' | 'totalOrdersCount' | 'totalSalesIQD'>) => QRCampaign;
  updateQRCampaign: (id: string, updated: Partial<QRCampaign>) => void;
  deleteQRCampaign: (id: string) => void;
  incrementQRCampaignScans: (campaignCode: string) => void;

  // Applications
  submitApplication: (app: Omit<PartnerApplication, 'id' | 'status' | 'createdAt'>) => PartnerApplication;
  approveApplication: (appId: string, initialRank?: PartnerRank) => { partner: PartnerItem; pin: string } | null;
  rejectApplication: (appId: string) => void;

  // Client Linking Engine
  linkClientManually: (clientPhone: string, clientName: string, partnerId: string) => void;
  unlinkClient: (clientPhone: string) => void;
  getLinkedPartnerForClient: (clientPhone: string) => PartnerItem | null;
  validateReferralCode: (code: string) => { valid: boolean; partner?: PartnerItem; message?: string };

  // Core Lifetime Commission Engine
  processOrderCommission: (params: {
    orderId: string;
    clientName: string;
    clientPhone: string;
    subtotal: number;
    items: Array<{ productId: string; titleAr: string; quantity: number; totalPrice: number }>;
    enteredCode?: string;
  }) => {
    partnerAssigned: boolean;
    partner?: PartnerItem;
    commissionAmount: number;
    appliedRate: number;
    isFirstLink: boolean;
  };

  // Withdrawals
  requestWithdrawal: (partnerId: string, amountIQD: number, method: WithdrawalMethod, accountDetails: string, notes?: string) => { success: boolean; error?: string; withdrawal?: WithdrawalRequest };
  approveWithdrawal: (withdrawalId: string, adminNote?: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason: string) => void;

  // CRM
  addCRMDeal: (deal: Omit<CRMDeal, 'id' | 'createdAt' | 'updatedAt' | 'notes'>, firstNote?: string) => CRMDeal;
  updateCRMDealStage: (dealId: string, newStage: CRMDealStage) => void;
  addCRMDealNote: (dealId: string, text: string, authorName: string) => void;
  deleteCRMDeal: (dealId: string) => void;

  // Product Rates & Academy
  setProductCommissionRate: (productId: string, percent: number) => void;
  setDefaultBaseRate: (percent: number) => void;
  certifyPartnerForProduct: (partnerId: string, productId: string) => void;
  setAnnouncement: (text: string) => void;

  // Metrics & Computations
  getPartnerMetrics: (partnerId: string) => {
    availableBalanceIQD: number;
    totalEarnedIQD: number;
    thisMonthEarnedIQD: number;
    totalPaidOutIQD: number;
    pendingPayoutIQD: number;
    linkedClientsCount: number;
    totalGeneratedSalesIQD: number;
    currentRank: PartnerRank;
    rankInfo: RankInfo;
    nextRankInfo: RankInfo | null;
    progressPercentToNextRank: number;
  };
}

// Helpers
export const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s\-\(\)\.]/g, '').replace(/^\+964/, '0').replace(/^00964/, '0').trim();
};

const generateReferralCode = (fullName: string): string => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NQ-${rand}`;
};

const generateEmployeeId = (count: number): string => {
  const num = (count + 1).toString().padStart(4, '0');
  return `NQ-EMP-${num}`;
};

const generatePinCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Seed Data
const INITIAL_PARTNERS: PartnerItem[] = [
  {
    id: 'partner-1',
    employeeId: 'NQ-EMP-0001',
    fullName: 'أحمد الموسوي',
    phone: '07801234567',
    whatsapp: '07801234567',
    city: 'بغداد - الكرادة',
    status: 'active',
    joinedAt: '2025-11-10',
    referralCode: 'NQ-AMB-01',
    rank: 'ambassador',
    pinCode: '1122',
    notes: 'شريك رئيسي معتمد للشركات والمطاعم الفاخرة في بغداد',
    certifications: ['prod-pizza-box', 'prod-luxury-rigid-box', 'prod-acrylic-3d-led'],
  },
  {
    id: 'partner-2',
    employeeId: 'NQ-EMP-0002',
    fullName: 'زينب الخفاجي',
    phone: '07709876543',
    whatsapp: '07709876543',
    city: 'البصرة - العشار',
    status: 'active',
    joinedAt: '2026-01-15',
    referralCode: 'NQ-SPC-02',
    rank: 'specialist',
    pinCode: '3344',
    notes: 'متخصصة بتجهيز المكاتب الهندسية وبطاقات الأعمال الإيطالية',
    certifications: ['prod-cotton-business-card'],
  },
  {
    id: 'partner-3',
    employeeId: 'NQ-EMP-0003',
    fullName: 'مصطفى رائد',
    phone: '07505556677',
    whatsapp: '07505556677',
    city: 'أربيل - عينكاوة',
    status: 'active',
    joinedAt: '2026-03-01',
    referralCode: 'NQ-NEW-03',
    rank: 'junior',
    pinCode: '5566',
    notes: 'مندوب تطوير أعمال جديد في إقليم كردستان',
    certifications: [],
  },
];

const INITIAL_LINKED_CLIENTS: Record<string, LinkedClient> = {
  '07809998877': {
    clientPhone: '07809998877',
    clientName: 'مطعم ومقهى النارنج الملكي',
    partnerId: 'partner-1',
    linkedAt: '2025-12-05',
    source: 'code',
    totalOrdersCount: 6,
    totalSpentIQD: 8_400_000,
    lastOrderDate: '2026-04-10',
  },
  '07712223344': {
    clientPhone: '07712223344',
    clientName: 'شركة الإعمار والحلول الهندسية',
    partnerId: 'partner-1',
    linkedAt: '2026-01-12',
    source: 'manual',
    totalOrdersCount: 4,
    totalSpentIQD: 12_800_000,
    lastOrderDate: '2026-04-18',
  },
  '07501112233': {
    clientPhone: '07501112233',
    clientName: 'مكتب د. سرمد الجراح',
    partnerId: 'partner-2',
    linkedAt: '2026-02-20',
    source: 'code',
    totalOrdersCount: 3,
    totalSpentIQD: 2_600_000,
    lastOrderDate: '2026-04-02',
  },
};

const INITIAL_COMMISSIONS: CommissionRecord[] = [
  {
    id: 'comm-101',
    partnerId: 'partner-1',
    orderId: 'NQ-ORD-9021',
    clientName: 'مطعم ومقهى النارنج الملكي',
    clientPhone: '07809998877',
    orderTotalIQD: 2_200_000,
    commissionAmountIQD: 374_000, // 17% (10% + 7% ambassador)
    appliedRate: 17,
    rankBonusApplied: 7,
    createdAt: '2026-04-10 14:30',
    status: 'approved',
    itemsBreakdown: [
      {
        productId: 'prod-pizza-box',
        titleAr: 'علب بيتزا كرتون كرافت مضلع فاخر',
        quantity: 1000,
        lineTotal: 2_200_000,
        ratePercent: 17,
        commission: 374_000,
      },
    ],
  },
  {
    id: 'comm-102',
    partnerId: 'partner-1',
    orderId: 'NQ-ORD-8840',
    clientName: 'شركة الإعمار والحلول الهندسية',
    clientPhone: '07712223344',
    orderTotalIQD: 4_500_000,
    commissionAmountIQD: 765_000,
    appliedRate: 17,
    rankBonusApplied: 7,
    createdAt: '2026-04-18 11:15',
    status: 'approved',
    itemsBreakdown: [
      {
        productId: 'prod-acrylic-3d-led',
        titleAr: 'دروع أكريليك مضيئة 3D LED للشخصيات',
        quantity: 15,
        lineTotal: 4_500_000,
        ratePercent: 17,
        commission: 765_000,
      },
    ],
  },
  {
    id: 'comm-103',
    partnerId: 'partner-2',
    orderId: 'NQ-ORD-8712',
    clientName: 'مكتب د. سرمد الجراح',
    clientPhone: '07501112233',
    orderTotalIQD: 850_000,
    commissionAmountIQD: 102_000, // 12% (10% + 2% specialist)
    appliedRate: 12,
    rankBonusApplied: 2,
    createdAt: '2026-04-02 16:45',
    status: 'approved',
    itemsBreakdown: [
      {
        productId: 'prod-cotton-business-card',
        titleAr: 'كروت أعمال قطنية إيطالية فاخرة 600 غم',
        quantity: 500,
        lineTotal: 850_000,
        ratePercent: 12,
        commission: 102_000,
      },
    ],
  },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd-001',
    partnerId: 'partner-1',
    amountIQD: 500_000,
    method: 'zain_cash',
    accountDetails: 'محفظة زين كاش: 07801234567',
    notes: 'أرباح شهر آذار',
    status: 'paid',
    requestedAt: '2026-03-28 10:00',
    processedAt: '2026-03-29 15:30',
    adminNote: 'تم التحويل بنجاح، رقم الإشعار ZC-991823',
  },
  {
    id: 'wd-002',
    partnerId: 'partner-1',
    amountIQD: 350_000,
    method: 'zain_cash',
    accountDetails: 'محفظة زين كاش: 07801234567',
    notes: 'سحب جزء من مستحقات نيسان',
    status: 'pending',
    requestedAt: '2026-04-20 18:20',
  },
];

const INITIAL_CRM_DEALS: CRMDeal[] = [
  {
    id: 'deal-1',
    partnerId: 'partner-1',
    businessName: 'سلسلة مطاعم زرزور',
    businessType: 'restaurant',
    contactPerson: 'أبو فهد - مدير المشتريات',
    phone: '07815554433',
    city: 'بغداد - المنصور',
    stage: 'negotiating',
    estimatedValueIQD: 6_500_000,
    createdAt: '2026-04-05',
    updatedAt: '2026-04-19',
    notes: [
      { id: 'n1', date: '2026-04-05', authorName: 'أحمد الموسوي', text: 'زيارة ميدانية للمطعم وعرض نماذج علب البيتزا والورق المشمع.' },
      { id: 'n2', date: '2026-04-19', authorName: 'أحمد الموسوي', text: 'تم إرسال بروفة رقمية بشعارهم، العميل أبدى إعجابه ويناقش كمية الـ 5000 علبة.' },
    ],
  },
  {
    id: 'deal-2',
    partnerId: 'partner-1',
    businessName: 'فندق بابل الدولي',
    businessType: 'hotel',
    contactPerson: 'الأستاذ نمير - العلاقات العامة',
    phone: '07703332211',
    city: 'بغداد - الكرادة',
    stage: 'quoted',
    estimatedValueIQD: 4_200_000,
    createdAt: '2026-04-12',
    updatedAt: '2026-04-15',
    notes: [
      { id: 'n3', date: '2026-04-12', authorName: 'أحمد الموسوي', text: 'طلب عرض سعر لدروع تكريم ضيوف VIP من الأكريليك الأسود والذهبي.' },
    ],
  },
  {
    id: 'deal-3',
    partnerId: 'partner-2',
    businessName: 'كافيه هافانا',
    businessType: 'cafe',
    contactPerson: 'علي شاكر',
    phone: '07708889900',
    city: 'البصرة - الجزائر',
    stage: 'new',
    estimatedValueIQD: 1_200_000,
    createdAt: '2026-04-21',
    updatedAt: '2026-04-21',
    notes: [
      { id: 'n4', date: '2026-04-21', authorName: 'زينب الخفاجي', text: 'اتصال هاتفي أولي، يحتاجون كروت أعمال فاخرة بحواف مذهبة.' },
    ],
  },
];

const INITIAL_ACADEMY_GUIDES: ProductAcademyGuide[] = [
  {
    productId: 'prod-pizza-box',
    productTitleAr: 'علب البيتزا والتغليف الكرتوني المضلع',
    category: 'boxes',
    targetAudienceAr: 'المطاعم، الكافيهات، محلات المعجنات، وسلاسل الوجبات السريعة في بغداد والمحافظات.',
    pitchPointsAr: [
      'كرتون رمادي مقوى ثلاثي الطبقات E-Flute يتحمل الحرارة ولا يتشوه أثناء التوصيل.',
      'طباعة أوفست حادة تحول العلبة إلى لوحة إعلانية متنقلة في أيدي كل زبون.',
      'توفير بروفة مجانية معتمدة خلال 24 ساعة دون أي التزام.',
      'خصومات متدرجة تصل إلى 35% للكميات التجارية من 1,000 إلى 10,000 علبة.',
    ],
    whatsappPitchAr: `السلام عليكم أستاذنا العزيز 🌹،
معك [اسمك] من فريق تطوير الأعمال والشراكات في "استوديو ومطبعة نون والقلم" ببغداد.
نحن نجهز حالياً أرقى المطاعم بعلب بيتزا وتغليف فاخر مقاوم للزيوت والحرارة، بطباعة احترافية ترفع قيمة علامتكم.
يسعدني أن أرسل لك بروفة رقمية مجانية لشعاركم على نماذج العلب مع عينات تسليم مجانية. هل تحب نجهز لك عينة باسمكم؟`,
    pricingTipsAr: 'أكد دائماً أن السعر شامل للتصميم والبروفة والتشذيب، وأن الطلب الدائم يمنحه أولوية التسليم السريع.',
    commonMistakesAr: 'لا تقدم سعراً للقطعة الفردية دون توضيح أن سعر الجملة ينخفض بنسبة كبيرة مع الكمية (1,000+).',
  },
  {
    productId: 'prod-acrylic-3d-led',
    productTitleAr: 'دروع ولوحات الأكريليك المضيئة 3D LED',
    category: 'led',
    targetAudienceAr: 'الشركات، العيادات والمشافي، مكاتب المحامين والاستشاريين، وحفلات التكريم والوفود الرسمية.',
    pitchPointsAr: [
      'أكريليك كاست نقي 100% غير قابل للاصفرار بسماكة تصل إلى 10 ملم مع حفر ليزري ميكروني فائق النعومة.',
      'قواعد خشب زان طبيعي أوروبي مصمت مع إضاءة محيطية ذكية تدوم أكثر من 50 ألف ساعة.',
      'الدفع نقداً عند الاستلام بعد المعاينة الشاملة، مع ضمان ذهبي 100% ضد عيوب التصنيع.',
    ],
    whatsappPitchAr: `أهلاً بك أستاذنا الفاضل ✨،
معك [اسمك] من استوديو نون والقلم في بغداد.
نصمم دروع ولوحات أكريليك مضيئة 3D بالليزر للمكاتب والشخصيات الـ VIP بتشطيب ملكي.
بإمكاننا تجهيز تصميم مجسم ثلاثي الأبعاد لشعار مكتبكم مجاناً قبل التنفيذ. يسعدنا مشاركة نماذج حديثة تم تسليمها مؤخراً.`,
    pricingTipsAr: 'ركز على البريستيج واللمسة الملكية التي يتركها الدرع في مكتب المدير أكثر من التركيز على السعر.',
    commonMistakesAr: 'عدم توضيح أن الشحن آمن ومغلف بصندوق خاص ضد الكسر يقلل من ثقة العميل في المحافظات.',
  },
  {
    productId: 'prod-cotton-business-card',
    productTitleAr: 'كروت الأعمال القطنية الإيطالية 600-700 غم',
    category: 'cards',
    targetAudienceAr: 'المدراء التنفيذيون، الأطباء، المهندسون، المحامون، ورجال الأعمال الباحثون عن انطباع أول لا ينسى.',
    pitchPointsAr: [
      'ورق قطني طبيعي 100% مستورد من إيطاليا بسماكة 3 أضعاف الكروت التقليدية (وزن 600 - 700 غم).',
      'بصمة حرارية ذهبية وفضية كروز الألمانية لا تبهت ولا تتقشر مع حواف مذهبة يدرياً 360 درجة.',
      'ضغط غائر (Letterpress Debossing) يمنح البطاقة عمقاً لمسياً راقياً وفخامة استثنائية.',
    ],
    whatsappPitchAr: `مرحباً دكتور/أستاذ 🌟،
معك [اسمك] من فريق "نون والقلم" في بغداد.
نقدم لصفوة الأعمال بطاقات شخصية من الورق القطني الإيطالي الملكي وبصمة الذهب الحرارية.
بطاقتك هي أول ما يلمسه عملاؤك.. يسعدنا تصميم بروفة رقمية أنيقة باسمكم واختيار أنسب خط عربي فاخر لها.`,
    pricingTipsAr: 'أوضح أن كرت الأعمال الفاخر هو استثمار دائم؛ بطاقة واحدة فاخرة قد تجلب لك صفقة بملايين الدنانير.',
    commonMistakesAr: 'مقارنتها بكروت السلوفان التجارية العادية، فالجمهور المستهدف هنا يبحث عن التفرد وليس السعر الأرخص.',
  },
];

const INITIAL_QR_CAMPAIGNS: QRCampaign[] = [
  {
    id: 'qrc-1',
    campaignCode: 'CAMP-DG-01',
    titleAr: 'ستاند طاولة - كافيه دجلة لاونج',
    titleEn: 'Table Tent - Tigris Lounge Cafe',
    partnerId: 'partner-1',
    partnerCode: 'NQ-AMB-01',
    partnerName: 'أحمد الموسوي',
    targetLocation: 'بغداد - المنصور (شارع 14 رمضان)',
    destinationPath: '/?ref=NQ-AMB-01&qr=CAMP-DG-01&utm_source=qr_table_tent',
    campaignDiscountNoteAr: 'امسح للطلب الفوري مع حفر ليزر مخصص مجاناً',
    campaignDiscountNoteEn: 'Scan to order with complimentary custom laser engraving',
    format: 'table_tent',
    themeColor: 'gold_black',
    includeLogo: true,
    scanCount: 142,
    totalOrdersCount: 8,
    totalSalesIQD: 1_950_000,
    createdAt: '2026-04-12 10:00',
    qrPayloadUrl: 'https://noon-atelier.iq/?ref=NQ-AMB-01&qr=CAMP-DG-01&utm_source=qr_table_tent',
  },
  {
    id: 'qrc-2',
    campaignCode: 'CAMP-EXPO-02',
    titleAr: 'بوستر معرض بغداد الدولي - جناح الشركات',
    titleEn: 'Baghdad Expo Poster - Corporate Pavilion',
    partnerId: 'partner-2',
    partnerCode: 'NQ-SPC-02',
    partnerName: 'زينب الخفاجي',
    targetLocation: 'فندق بابل الدولي - الكرادة',
    destinationPath: '/?ref=NQ-SPC-02&qr=CAMP-EXPO-02&offers=true&utm_source=qr_poster',
    campaignDiscountNoteAr: 'خصم خاص 10% لكبرى صفقات الشركات والمؤسسات',
    campaignDiscountNoteEn: '10% corporate order discount',
    format: 'poster',
    themeColor: 'midnight_navy',
    includeLogo: true,
    scanCount: 89,
    totalOrdersCount: 5,
    totalSalesIQD: 3_400_000,
    createdAt: '2026-04-15 12:30',
    qrPayloadUrl: 'https://noon-atelier.iq/?ref=NQ-SPC-02&qr=CAMP-EXPO-02&offers=true&utm_source=qr_poster',
  },
  {
    id: 'qrc-3',
    campaignCode: 'CAMP-STICK-03',
    titleAr: 'ملصق علب وبوكسات التغليف الفاخرة',
    titleEn: 'Luxury Gift Box Packaging Stickers',
    partnerId: 'partner-3',
    partnerCode: 'NQ-NEW-03',
    partnerName: 'مصطفى رائد',
    targetLocation: 'أربيل - مبيعات ميدانية',
    destinationPath: '/?ref=NQ-NEW-03&qr=CAMP-STICK-03&utm_source=qr_sticker',
    campaignDiscountNoteAr: 'امسح لإعادة طلب نفس البوكس مع الكود المعتمد',
    campaignDiscountNoteEn: 'Scan to re-order packaging with certified code',
    format: 'sticker',
    themeColor: 'emerald_luxury',
    includeLogo: true,
    scanCount: 54,
    totalOrdersCount: 3,
    totalSalesIQD: 780_000,
    createdAt: '2026-04-18 16:45',
    qrPayloadUrl: 'https://noon-atelier.iq/?ref=NQ-NEW-03&qr=CAMP-STICK-03&utm_source=qr_sticker',
  },
];

export const useAffiliateStore = create<AffiliateStore>()(
  persist(
    (set, get) => ({
      partners: INITIAL_PARTNERS,
      applications: [
        {
          id: 'app-001',
          fullName: 'حسن البياتي',
          phone: '07823334455',
          whatsapp: '07823334455',
          city: 'النجف الأشرف',
          experience: 'سنتان في تسويق المطبوعات والتجهيزات الميدانية للمطاعم',
          reason: 'لدي شبكة علاقات قوية مع كبرى المطاعم والكافيهات في النجف وبابل وأرغب بتمثيل استوديو نون والقلم رسمياً.',
          status: 'pending',
          createdAt: '2026-04-22 09:15',
        },
      ],
      linkedClients: INITIAL_LINKED_CLIENTS,
      commissionLedger: INITIAL_COMMISSIONS,
      withdrawals: INITIAL_WITHDRAWALS,
      crmDeals: INITIAL_CRM_DEALS,
      productCommissionRates: {
        'prod-pizza-box': 10,
        'prod-luxury-rigid-box': 12,
        'prod-acrylic-3d-led': 10,
        'prod-cotton-business-card': 12,
      },
      defaultBaseCommissionPercent: 10,
      academyGuides: INITIAL_ACADEMY_GUIDES,
      announcementAr: '🔥 حملة الربيع مستمرة: زيادة 2% إضافية على كافة عمولات علب التغليف والدروع حتى نهاية الشهر لجميع الشركاء النشطين!',
      announcementUpdatedAt: '2026-04-20',
      currentPartnerSessionId: 'partner-1', // Default active session for instant testing (Ahmed Al-Moussawi)
      qrCampaigns: INITIAL_QR_CAMPAIGNS,

      // Session
      loginPartner: (phone, pinCode) => {
        const norm = normalizePhone(phone);
        const partner = get().partners.find((p) => normalizePhone(p.phone) === norm);
        if (!partner) {
          return { success: false, error: 'رقم الهاتف غير مسجل في شبكة شركاء نون والقلم' };
        }
        if (partner.status === 'suspended') {
          return { success: false, error: 'تم تعليق هذا الحساب مؤقتاً، يرجى مراجعة إدارة نون والقلم' };
        }
        if (partner.status === 'pending') {
          return { success: false, error: 'طلبك قيد المراجعة والموافقة من الإدارة' };
        }
        if (partner.pinCode.trim() !== pinCode.trim()) {
          return { success: false, error: 'رمز الدخول (PIN) غير صحيح' };
        }
        set({ currentPartnerSessionId: partner.id });
        return { success: true, partner };
      },

      logoutPartner: () => {
        set({ currentPartnerSessionId: null });
      },

      setCurrentPartnerSession: (partnerId) => {
        set({ currentPartnerSessionId: partnerId });
      },

      // Partner CRUD
      addPartner: (partnerData) => {
        const newPartner: PartnerItem = {
          ...partnerData,
          id: `partner-${Date.now()}`,
          employeeId: generateEmployeeId(get().partners.length),
          referralCode: generateReferralCode(partnerData.fullName),
          pinCode: generatePinCode(),
        };
        set((state) => ({ partners: [newPartner, ...state.partners] }));
        return newPartner;
      },

      updatePartner: (id, updated) => {
        set((state) => ({
          partners: state.partners.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
      },

      togglePartnerStatus: (id) => {
        set((state) => ({
          partners: state.partners.map((p) => {
            if (p.id !== id) return p;
            const newStatus: PartnerStatus = p.status === 'active' ? 'suspended' : 'active';
            return { ...p, status: newStatus };
          }),
        }));
      },

      setPartnerRank: (id, rank) => {
        set((state) => ({
          partners: state.partners.map((p) => (p.id === id ? { ...p, rank } : p)),
        }));
      },

      deletePartner: (id) => {
        set((state) => ({
          partners: state.partners.filter((p) => p.id !== id),
        }));
      },

      // QR Marketing Campaigns Engine
      addQRCampaign: (campaignData) => {
        const newCamp: QRCampaign = {
          ...campaignData,
          id: `qrc-${Date.now()}`,
          scanCount: 0,
          totalOrdersCount: 0,
          totalSalesIQD: 0,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        set((state) => ({ qrCampaigns: [newCamp, ...state.qrCampaigns] }));
        return newCamp;
      },

      updateQRCampaign: (id, updated) => {
        set((state) => ({
          qrCampaigns: state.qrCampaigns.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        }));
      },

      deleteQRCampaign: (id) => {
        set((state) => ({
          qrCampaigns: state.qrCampaigns.filter((c) => c.id !== id),
        }));
      },

      incrementQRCampaignScans: (campaignCode) => {
        set((state) => ({
          qrCampaigns: state.qrCampaigns.map((c) =>
            c.campaignCode.toLowerCase() === campaignCode.toLowerCase()
              ? { ...c, scanCount: c.scanCount + 1 }
              : c
          ),
        }));
      },

      // Applications
      submitApplication: (appData) => {
        const newApp: PartnerApplication = {
          ...appData,
          id: `app-${Date.now()}`,
          status: 'pending',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        set((state) => ({ applications: [newApp, ...state.applications] }));
        return newApp;
      },

      approveApplication: (appId, initialRank = 'junior') => {
        const app = get().applications.find((a) => a.id === appId);
        if (!app) return null;

        const pin = generatePinCode();
        const newPartner: PartnerItem = {
          id: `partner-${Date.now()}`,
          employeeId: generateEmployeeId(get().partners.length),
          fullName: app.fullName,
          phone: app.phone,
          whatsapp: app.whatsapp || app.phone,
          city: app.city,
          status: 'active',
          joinedAt: new Date().toISOString().substring(0, 10),
          referralCode: generateReferralCode(app.fullName),
          rank: initialRank,
          pinCode: pin,
          notes: `تمت الموافقة من طلب الانضمام: ${app.reason}`,
          certifications: [],
        };

        set((state) => ({
          partners: [newPartner, ...state.partners],
          applications: state.applications.map((a) =>
            a.id === appId
              ? { ...a, status: 'approved', reviewedAt: new Date().toISOString().substring(0, 16) }
              : a
          ),
        }));

        return { partner: newPartner, pin };
      },

      rejectApplication: (appId) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === appId
              ? { ...a, status: 'rejected', reviewedAt: new Date().toISOString().substring(0, 16) }
              : a
          ),
        }));
      },

      // Client Linking
      linkClientManually: (clientPhone, clientName, partnerId) => {
        const norm = normalizePhone(clientPhone);
        if (!norm) return;
        set((state) => ({
          linkedClients: {
            ...state.linkedClients,
            [norm]: {
              clientPhone: norm,
              clientName: clientName || 'عميل نون والقلم',
              partnerId,
              linkedAt: new Date().toISOString().substring(0, 10),
              source: 'manual',
              totalOrdersCount: state.linkedClients[norm]?.totalOrdersCount || 0,
              totalSpentIQD: state.linkedClients[norm]?.totalSpentIQD || 0,
            },
          },
        }));
      },

      unlinkClient: (clientPhone) => {
        const norm = normalizePhone(clientPhone);
        set((state) => {
          const next = { ...state.linkedClients };
          delete next[norm];
          return { linkedClients: next };
        });
      },

      getLinkedPartnerForClient: (clientPhone) => {
        const norm = normalizePhone(clientPhone);
        if (!norm) return null;
        const link = get().linkedClients[norm];
        if (!link) return null;
        const partner = get().partners.find((p) => p.id === link.partnerId);
        return partner && partner.status === 'active' ? partner : null;
      },

      validateReferralCode: (code) => {
        const clean = code.trim().toUpperCase();
        if (!clean) return { valid: false, message: 'يرجى إدخال كود الشريك' };
        const partner = get().partners.find((p) => p.referralCode.toUpperCase() === clean);
        if (!partner) {
          return { valid: false, message: 'كود الشريك المدخل غير صحيح أو غير مسجل' };
        }
        if (partner.status !== 'active') {
          return { valid: false, message: 'كود الشريك غير نشط حالياً' };
        }
        return { valid: true, partner };
      },

      // Core Lifetime Commission Engine
      processOrderCommission: ({ orderId, clientName, clientPhone, subtotal, items, enteredCode }) => {
        const normPhone = normalizePhone(clientPhone);
        const { linkedClients, partners, productCommissionRates, defaultBaseCommissionPercent } = get();

        let targetPartner: PartnerItem | null = null;
        let isFirstLink = false;

        // 1. Check if client is ALREADY linked (The Core Lifetime Recurring Rule!)
        if (normPhone && linkedClients[normPhone]) {
          const link = linkedClients[normPhone];
          const matched = partners.find((p) => p.id === link.partnerId);
          if (matched && matched.status === 'active') {
            targetPartner = matched;
          }
        }

        // 2. If not linked, check if a valid referral code was entered
        if (!targetPartner && enteredCode) {
          const cleanCode = enteredCode.trim().toUpperCase();
          const matched = partners.find((p) => p.referralCode.toUpperCase() === cleanCode && p.status === 'active');
          if (matched) {
            targetPartner = matched;
            isFirstLink = true;
            // Permanently bind this client to this partner!
            if (normPhone) {
              set((state) => ({
                linkedClients: {
                  ...state.linkedClients,
                  [normPhone]: {
                    clientPhone: normPhone,
                    clientName: clientName || 'عميل جديد',
                    partnerId: matched.id,
                    linkedAt: new Date().toISOString().substring(0, 10),
                    source: 'code',
                    totalOrdersCount: 0,
                    totalSpentIQD: 0,
                  },
                },
              }));

              // If partner had a CRM deal for this phone, automatically mark it as 'won'
              set((state) => ({
                crmDeals: state.crmDeals.map((d) => {
                  if (d.partnerId === matched.id && normalizePhone(d.phone) === normPhone && d.stage !== 'won') {
                    return {
                      ...d,
                      stage: 'won',
                      updatedAt: new Date().toISOString().substring(0, 10),
                      notes: [
                        ...d.notes,
                        {
                          id: `n-${Date.now()}`,
                          date: new Date().toISOString().substring(0, 10),
                          authorName: 'نظام نون والقلم الآلي',
                          text: `🎉 تم إتمام أول طلب شراء بقيمة ${subtotal.toLocaleString()} د.ع عبر المتجر، وربط العميل تلقائياً!`,
                        },
                      ],
                    };
                  }
                  return d;
                }),
              }));
            }
          }
        }

        if (!targetPartner) {
          return {
            partnerAssigned: false,
            commissionAmount: 0,
            appliedRate: 0,
            isFirstLink: false,
          };
        }

        // 3. Compute Commission Per Product + Rank Bonus
        const rankBonus = PARTNER_RANKS_CONFIG[targetPartner.rank]?.bonusPercent || 0;
        let totalCommission = 0;
        const itemsBreakdown: CommissionItemBreakdown[] = [];

        items.forEach((item) => {
          const baseRate = productCommissionRates[item.productId] ?? defaultBaseCommissionPercent;
          const effectiveRate = baseRate + rankBonus;
          const itemCommission = Math.round(item.totalPrice * (effectiveRate / 100));
          totalCommission += itemCommission;

          itemsBreakdown.push({
            productId: item.productId,
            titleAr: item.titleAr,
            quantity: item.quantity,
            lineTotal: item.totalPrice,
            ratePercent: effectiveRate,
            commission: itemCommission,
          });
        });

        const effectiveAverageRate = subtotal > 0 ? Math.round((totalCommission / subtotal) * 100) : defaultBaseCommissionPercent + rankBonus;

        // 4. Record entry in Commission Ledger
        const newRecord: CommissionRecord = {
          id: `comm-${Date.now()}-${Math.floor(Math.random() * 900)}`,
          partnerId: targetPartner.id,
          orderId,
          clientName: clientName || 'عميل نون والقلم',
          clientPhone: normPhone,
          orderTotalIQD: subtotal,
          commissionAmountIQD: totalCommission,
          appliedRate: effectiveAverageRate,
          rankBonusApplied: rankBonus,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'approved',
          itemsBreakdown,
        };

        // 5. Update linked client lifetime spent and count
        set((state) => {
          const prevLink = normPhone ? state.linkedClients[normPhone] : null;
          return {
            commissionLedger: [newRecord, ...state.commissionLedger],
            linkedClients: normPhone && prevLink
              ? {
                  ...state.linkedClients,
                  [normPhone]: {
                    ...prevLink,
                    totalOrdersCount: prevLink.totalOrdersCount + 1,
                    totalSpentIQD: prevLink.totalSpentIQD + subtotal,
                    lastOrderDate: new Date().toISOString().substring(0, 10),
                  },
                }
              : state.linkedClients,
          };
        });

        // 6. Check for automatic rank promotion
        const partnerMetrics = get().getPartnerMetrics(targetPartner.id);
        const currentSales = partnerMetrics.totalGeneratedSalesIQD;
        const currentClients = partnerMetrics.linkedClientsCount;

        let promotedRank: PartnerRank = targetPartner.rank;
        if (currentClients >= 25 || currentSales >= 25_000_000) {
          promotedRank = 'ambassador';
        } else if (currentClients >= 10 || currentSales >= 10_000_000) {
          if (promotedRank !== 'ambassador') promotedRank = 'manager';
        } else if (currentClients >= 3 || currentSales >= 2_000_000) {
          if (promotedRank === 'junior') promotedRank = 'specialist';
        }

        if (promotedRank !== targetPartner.rank) {
          get().setPartnerRank(targetPartner.id, promotedRank);
        }

        return {
          partnerAssigned: true,
          partner: targetPartner,
          commissionAmount: totalCommission,
          appliedRate: effectiveAverageRate,
          isFirstLink,
        };
      },

      // Withdrawals
      requestWithdrawal: (partnerId, amountIQD, method, accountDetails, notes) => {
        const metrics = get().getPartnerMetrics(partnerId);
        if (amountIQD < 50_000) {
          return { success: false, error: 'الحد الأدنى لطلب السحب هو 50,000 د.ع' };
        }
        if (amountIQD > metrics.availableBalanceIQD) {
          return { success: false, error: `الرصيد المتاح غير كافٍ. رصيدك المتاح هو: ${metrics.availableBalanceIQD.toLocaleString()} د.ع` };
        }

        const newWd: WithdrawalRequest = {
          id: `wd-${Date.now()}`,
          partnerId,
          amountIQD,
          method,
          accountDetails,
          notes,
          status: 'pending',
          requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        set((state) => ({
          withdrawals: [newWd, ...state.withdrawals],
        }));

        return { success: true, withdrawal: newWd };
      },

      approveWithdrawal: (withdrawalId, adminNote) => {
        set((state) => ({
          withdrawals: state.withdrawals.map((w) =>
            w.id === withdrawalId
              ? {
                  ...w,
                  status: 'paid',
                  processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  adminNote: adminNote || 'تم الصرف والتحويل بنجاح',
                }
              : w
          ),
        }));
      },

      rejectWithdrawal: (withdrawalId, reason) => {
        set((state) => ({
          withdrawals: state.withdrawals.map((w) =>
            w.id === withdrawalId
              ? {
                  ...w,
                  status: 'rejected',
                  processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  adminNote: reason,
                }
              : w
          ),
        }));
      },

      // CRM
      addCRMDeal: (dealData, firstNote) => {
        const now = new Date().toISOString().substring(0, 10);
        const initialNotes: CRMDealNote[] = [];
        if (firstNote) {
          const partner = get().partners.find((p) => p.id === dealData.partnerId);
          initialNotes.push({
            id: `n-${Date.now()}`,
            date: now,
            authorName: partner?.fullName || 'مندوب المبيعات',
            text: firstNote,
          });
        }

        const newDeal: CRMDeal = {
          ...dealData,
          id: `deal-${Date.now()}`,
          notes: initialNotes,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          crmDeals: [newDeal, ...state.crmDeals],
        }));

        return newDeal;
      },

      updateCRMDealStage: (dealId, newStage) => {
        const now = new Date().toISOString().substring(0, 10);
        set((state) => ({
          crmDeals: state.crmDeals.map((d) =>
            d.id === dealId ? { ...d, stage: newStage, updatedAt: now } : d
          ),
        }));
      },

      addCRMDealNote: (dealId, text, authorName) => {
        const newNote: CRMDealNote = {
          id: `n-${Date.now()}`,
          date: new Date().toISOString().substring(0, 10),
          authorName,
          text,
        };
        set((state) => ({
          crmDeals: state.crmDeals.map((d) =>
            d.id === dealId
              ? { ...d, notes: [newNote, ...d.notes], updatedAt: new Date().toISOString().substring(0, 10) }
              : d
          ),
        }));
      },

      deleteCRMDeal: (dealId) => {
        set((state) => ({
          crmDeals: state.crmDeals.filter((d) => d.id !== dealId),
        }));
      },

      // Product Rates & Academy
      setProductCommissionRate: (productId, percent) => {
        set((state) => ({
          productCommissionRates: {
            ...state.productCommissionRates,
            [productId]: percent,
          },
        }));
      },

      setDefaultBaseRate: (percent) => {
        set({ defaultBaseCommissionPercent: percent });
      },

      certifyPartnerForProduct: (partnerId, productId) => {
        set((state) => ({
          partners: state.partners.map((p) => {
            if (p.id !== partnerId) return p;
            const certs = p.certifications || [];
            if (certs.includes(productId)) return p;
            return { ...p, certifications: [...certs, productId] };
          }),
        }));
      },

      setAnnouncement: (text) => {
        set({
          announcementAr: text,
          announcementUpdatedAt: new Date().toISOString().substring(0, 10),
        });
      },

      // Metrics & Analytics
      getPartnerMetrics: (partnerId) => {
        const { commissionLedger, withdrawals, linkedClients, partners } = get();
        const partner = partners.find((p) => p.id === partnerId);
        const partnerRank: PartnerRank = partner?.rank || 'junior';
        const rankInfo = PARTNER_RANKS_CONFIG[partnerRank];

        // Total Earned from approved commissions
        const partnerCommissions = commissionLedger.filter(
          (c) => c.partnerId === partnerId && c.status === 'approved'
        );
        const totalEarnedIQD = partnerCommissions.reduce((sum, c) => sum + c.commissionAmountIQD, 0);

        // This Month Earned
        const currentMonthPrefix = new Date().toISOString().substring(0, 7); // e.g. "2026-04"
        const thisMonthEarnedIQD = partnerCommissions
          .filter((c) => c.createdAt.startsWith(currentMonthPrefix))
          .reduce((sum, c) => sum + c.commissionAmountIQD, 0);

        // Total Paid Out
        const partnerWithdrawals = withdrawals.filter((w) => w.partnerId === partnerId);
        const totalPaidOutIQD = partnerWithdrawals
          .filter((w) => w.status === 'paid')
          .reduce((sum, w) => sum + w.amountIQD, 0);

        // Pending Payout
        const pendingPayoutIQD = partnerWithdrawals
          .filter((w) => w.status === 'pending')
          .reduce((sum, w) => sum + w.amountIQD, 0);

        // Available Balance = Total Earned - Paid Out - Pending
        const availableBalanceIQD = Math.max(0, totalEarnedIQD - totalPaidOutIQD - pendingPayoutIQD);

        // Linked Clients & Total Sales
        const partnerClients = Object.values(linkedClients).filter((c) => c.partnerId === partnerId);
        const linkedClientsCount = partnerClients.length;
        const totalGeneratedSalesIQD = partnerCommissions.reduce((sum, c) => sum + c.orderTotalIQD, 0);

        // Progress to next rank
        let nextRankInfo: RankInfo | null = null;
        let progressPercentToNextRank = 100;

        if (partnerRank === 'junior') {
          nextRankInfo = PARTNER_RANKS_CONFIG.specialist;
        } else if (partnerRank === 'specialist') {
          nextRankInfo = PARTNER_RANKS_CONFIG.manager;
        } else if (partnerRank === 'manager') {
          nextRankInfo = PARTNER_RANKS_CONFIG.ambassador;
        }

        if (nextRankInfo) {
          const clientProgress = (linkedClientsCount / nextRankInfo.minClients) * 100;
          const salesProgress = (totalGeneratedSalesIQD / nextRankInfo.minSalesIQD) * 100;
          progressPercentToNextRank = Math.min(100, Math.round(Math.max(clientProgress, salesProgress)));
        }

        return {
          availableBalanceIQD,
          totalEarnedIQD,
          thisMonthEarnedIQD,
          totalPaidOutIQD,
          pendingPayoutIQD,
          linkedClientsCount,
          totalGeneratedSalesIQD,
          currentRank: partnerRank,
          rankInfo,
          nextRankInfo,
          progressPercentToNextRank,
        };
      },
    }),
    {
      name: 'noon_affiliate_v1',
    }
  )
);
