import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PaymentGatewayId =
  | 'zaincash'
  | 'fib'
  | 'cod'
  | 'tap'
  | 'stripe'
  | 'paypal'
  | 'bank_transfer'
  | (string & {});

export type ShippingCarrierId =
  | 'local_express'
  | 'aramex'
  | 'dhl'
  | 'fedex'
  | 'gulf_ground'
  | (string & {});

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeAr: string;
  isEnabled: boolean;
  isTestMode: boolean;
  iconType: 'wallet' | 'bank' | 'card' | 'paypal' | 'truck' | 'building' | 'globe';
  // 'GLOBAL' matches any country; otherwise specific ISO codes like ['IQ'] or ['SA', 'AE', 'KW', 'QA', 'OM', 'BH']
  supportedCountryCodes: string[];
  supportedCurrencies: string[];
  processingFeePercent: number;
  providerLogo?: string;
  isCustom?: boolean;
  merchantId?: string;
  apiKey?: string;
  webhookSecret?: string;
  instructionsAr?: string;
}

export interface ShippingCarrierConfig {
  id: ShippingCarrierId;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeAr: string;
  isEnabled: boolean;
  iconType: 'truck' | 'plane' | 'package' | 'globe';
  supportedCountryCodes: string[]; // 'GLOBAL' or country codes
  deliveryDaysAr: string;
  deliveryDaysEn: string;
  basePriceIQD: number;
  basePriceUSD: number;
  freeShippingThresholdIQD?: number;
  freeShippingThresholdUSD?: number;
  trackingPrefix: string;
  isCustom?: boolean;
  trackingUrlTemplate?: string;
  contactPhone?: string;
}

interface PaymentShippingState {
  gateways: PaymentGatewayConfig[];
  carriers: ShippingCarrierConfig[];

  // Actions
  toggleGateway: (id: PaymentGatewayId) => void;
  toggleGatewayTestMode: (id: PaymentGatewayId) => void;
  updateGateway: (id: PaymentGatewayId, updates: Partial<PaymentGatewayConfig>) => void;
  addGateway: (gateway: PaymentGatewayConfig) => void;
  deleteGateway: (id: string) => void;

  toggleCarrier: (id: ShippingCarrierId) => void;
  updateCarrier: (id: ShippingCarrierId, updates: Partial<ShippingCarrierConfig>) => void;
  addCarrier: (carrier: ShippingCarrierConfig) => void;
  deleteCarrier: (id: string) => void;

  // Filter helpers
  getAvailableGateways: (countryCode: string) => PaymentGatewayConfig[];
  getAvailableCarriers: (countryCode: string) => ShippingCarrierConfig[];

  // Reset
  resetToDefaults: () => void;
}

const DEFAULT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    id: 'zaincash',
    nameAr: 'زين كاش (ZainCash)',
    nameEn: 'ZainCash Wallet',
    descriptionAr: 'الدفع الآمن الفوري عبر محفظة زين كاش العراقية برقم الهاتف والـ PIN',
    descriptionEn: 'Instant secure payment via ZainCash Iraq mobile wallet',
    badgeAr: 'الأكثر استخداماً في العراق',
    isEnabled: true,
    isTestMode: true,
    iconType: 'wallet',
    supportedCountryCodes: ['IQ'],
    supportedCurrencies: ['IQD', 'USD'],
    processingFeePercent: 0,
  },
  {
    id: 'fib',
    nameAr: 'المصرف العراقي الأول (FIB)',
    nameEn: 'First Iraqi Bank (FIB)',
    descriptionAr: 'دفع رقمي فوري عبر مسح كود QR أو إشعار تطبيق FIB في العراق',
    descriptionEn: 'Instant digital bank transfer via First Iraqi Bank App',
    badgeAr: 'دفع بنكي مباشر',
    isEnabled: true,
    isTestMode: true,
    iconType: 'bank',
    supportedCountryCodes: ['IQ'],
    supportedCurrencies: ['IQD', 'USD'],
    processingFeePercent: 0,
  },
  {
    id: 'cod',
    nameAr: 'الدفع عند الاستلام (COD)',
    nameEn: 'Cash on Delivery (COD)',
    descriptionAr: 'معاينة وفحص القطعة الفنية وتطابق المواصفات ثم تسليم المبلغ لمندوب التوصيل',
    descriptionEn: 'Pay cash upon delivery after inspecting quality and packaging',
    badgeAr: 'ثقة وضمان 100%',
    isEnabled: true,
    isTestMode: false,
    iconType: 'truck',
    supportedCountryCodes: ['IQ'],
    supportedCurrencies: ['IQD'],
    processingFeePercent: 0,
  },
  {
    id: 'tap',
    nameAr: 'مدفوعات تاب الخليجية (Tap Payments)',
    nameEn: 'Tap Payments (GCC)',
    descriptionAr: 'تدعم بطاقات مدى (Mada)، KNET الكويتية، بنفت البحرين، و Apple Pay',
    descriptionEn: 'Seamless GCC checkout with Mada, KNET, Benefit, and Apple Pay',
    badgeAr: 'مخصص لدول الخليج',
    isEnabled: true,
    isTestMode: true,
    iconType: 'card',
    supportedCountryCodes: ['SA', 'AE', 'KW', 'QA', 'OM', 'BH'],
    supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'OMR', 'BHD', 'USD'],
    processingFeePercent: 0,
  },
  {
    id: 'stripe',
    nameAr: 'بطاقة ائتمانية دولية (Stripe)',
    nameEn: 'Credit / Debit Card (Stripe)',
    descriptionAr: 'معالجة آمنة مشفرة بأعلى معايير الأمان العالمية (Visa, Mastercard, Amex, Apple Pay)',
    descriptionEn: 'Global encrypted checkout supporting Visa, Mastercard, Amex & Apple Pay',
    badgeAr: 'دولي - عالمي',
    isEnabled: true,
    isTestMode: true,
    iconType: 'card',
    supportedCountryCodes: ['GLOBAL'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SAR', 'AED', 'IQD'],
    processingFeePercent: 0,
  },
  {
    id: 'paypal',
    nameAr: 'باي بال (PayPal International)',
    nameEn: 'PayPal Express',
    descriptionAr: 'حماية المشتري الدولية والدفع بحساب PayPal من أي مكان حول العالم',
    descriptionEn: 'Worldwide buyer protection and one-click checkout via PayPal',
    badgeAr: 'حماية المشتري العالمية',
    isEnabled: true,
    isTestMode: true,
    iconType: 'paypal',
    supportedCountryCodes: ['GLOBAL'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    processingFeePercent: 0,
  },
  {
    id: 'bank_transfer',
    nameAr: 'تحويل بنكي رسمي (SWIFT / IBAN)',
    nameEn: 'Official Wire Transfer (SWIFT / IBAN)',
    descriptionAr: 'مخصص للشركات والطلبات الضخمة والمؤسسات مع إصدار فاتورة ضريبية رسمية معتمدة',
    descriptionEn: 'Direct corporate wire transfer with proforma invoice for enterprise orders',
    badgeAr: 'للشركات والكميات الكبيرة',
    isEnabled: true,
    isTestMode: false,
    iconType: 'building',
    supportedCountryCodes: ['GLOBAL'],
    supportedCurrencies: ['USD', 'IQD', 'EUR', 'SAR', 'AED'],
    processingFeePercent: 0,
  },
];

const DEFAULT_CARRIERS: ShippingCarrierConfig[] = [
  {
    id: 'local_express',
    nameAr: 'توصيل نون والقلم السريع (محلي)',
    nameEn: 'Noon & Pen Local Courier (Iraq)',
    descriptionAr: 'أسطول التوصيل الداخلي مع تغليف مقوى خاص لحماية الأكريليك والمطبوعات الفاخرة',
    descriptionEn: 'Direct internal courier network with reinforced fine art packaging',
    badgeAr: 'محلي داخل العراق',
    isEnabled: true,
    iconType: 'truck',
    supportedCountryCodes: ['IQ'],
    deliveryDaysAr: '24 - 48 ساعة (بغداد والمحافظات)',
    deliveryDaysEn: '24 - 48 hours within Iraq',
    basePriceIQD: 5000,
    basePriceUSD: 3.5,
    freeShippingThresholdIQD: 150000,
    freeShippingThresholdUSD: 100,
    trackingPrefix: 'NP-IQ',
  },
  {
    id: 'aramex',
    nameAr: 'أرامكس إكسبريس (Aramex Priority)',
    nameEn: 'Aramex International Priority',
    descriptionAr: 'الخيار الأفضل والأكثر موثوقية لدول الخليج العربي والأردن ومصر مع رقم تتبع مباشر',
    descriptionEn: 'Leading regional express courier for GCC, Levant, and Middle East',
    badgeAr: 'الأفضل للخليج والشرق الأوسط',
    isEnabled: true,
    iconType: 'package',
    supportedCountryCodes: ['SA', 'AE', 'KW', 'QA', 'OM', 'BH', 'JO', 'EG', 'GLOBAL'],
    deliveryDaysAr: '4 - 7 أيام عمل',
    deliveryDaysEn: '4 - 7 business days',
    basePriceIQD: 25000,
    basePriceUSD: 18,
    freeShippingThresholdIQD: 350000,
    freeShippingThresholdUSD: 250,
    trackingPrefix: 'ARMX',
  },
  {
    id: 'dhl',
    nameAr: 'دي إتش إل إكسبريس (DHL Express Worldwide)',
    nameEn: 'DHL Express Worldwide',
    descriptionAr: 'شحن جوي فائق السرعة مع تخليص جمركي معتمد وتوصيل فوري لكافة دول العالم',
    descriptionEn: 'Fastest door-to-door global air transit with priority customs clearance',
    badgeAr: 'الأسرع عالمياً ✈️',
    isEnabled: true,
    iconType: 'plane',
    supportedCountryCodes: ['GLOBAL'],
    deliveryDaysAr: '3 - 5 أيام عمل',
    deliveryDaysEn: '3 - 5 business days',
    basePriceIQD: 45000,
    basePriceUSD: 32,
    freeShippingThresholdIQD: 500000,
    freeShippingThresholdUSD: 350,
    trackingPrefix: 'DHL',
  },
  {
    id: 'fedex',
    nameAr: 'فيديكس الدولي (FedEx International Priority)',
    nameEn: 'FedEx International Priority',
    descriptionAr: 'شحن مباشر إلى أمريكا الشمالية، أوروبا، وآسيا مع ضمان سلامة الطرود الزجاجية والأكريليك',
    descriptionEn: 'Priority international freight to North America, Europe and East Asia',
    badgeAr: 'ممتاز لأمريكا وأوروبا',
    isEnabled: true,
    iconType: 'globe',
    supportedCountryCodes: ['US', 'GB', 'DE', 'GLOBAL'],
    deliveryDaysAr: '4 - 6 أيام عمل',
    deliveryDaysEn: '4 - 6 business days',
    basePriceIQD: 42000,
    basePriceUSD: 30,
    freeShippingThresholdIQD: 500000,
    freeShippingThresholdUSD: 350,
    trackingPrefix: 'FDX',
  },
  {
    id: 'gulf_ground',
    nameAr: 'الشحن البري الموحّد لدول الخليج (اقتصادي)',
    nameEn: 'GCC Overland Freight (Economy)',
    descriptionAr: 'خيار اقتصادي للطلبيات الكبيرة وعلب الهدايا والدروع بكميات تجارية لدول الخليج',
    descriptionEn: 'Budget-friendly overland freight for wholesale and bulk orders to GCC',
    badgeAr: 'اقتصادي للكميات الكبيرة',
    isEnabled: false, // Turned off by default to show toggle capability
    iconType: 'truck',
    supportedCountryCodes: ['SA', 'AE', 'KW', 'QA', 'OM', 'BH'],
    deliveryDaysAr: '8 - 12 يوم عمل',
    deliveryDaysEn: '8 - 12 business days',
    basePriceIQD: 18000,
    basePriceUSD: 13,
    freeShippingThresholdIQD: 300000,
    freeShippingThresholdUSD: 200,
    trackingPrefix: 'GCC-GRD',
  },
];

export const usePaymentShippingConfigStore = create<PaymentShippingState>()(
  persist(
    (set, get) => ({
      gateways: DEFAULT_GATEWAYS,
      carriers: DEFAULT_CARRIERS,

      toggleGateway: (id) =>
        set((state) => ({
          gateways: state.gateways.map((g) =>
            g.id === id ? { ...g, isEnabled: !g.isEnabled } : g
          ),
        })),

      toggleGatewayTestMode: (id) =>
        set((state) => ({
          gateways: state.gateways.map((g) =>
            g.id === id ? { ...g, isTestMode: !g.isTestMode } : g
          ),
        })),

      updateGateway: (id, updates) =>
        set((state) => ({
          gateways: state.gateways.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      addGateway: (newGateway) =>
        set((state) => {
          // If already exists, update it; otherwise append
          const exists = state.gateways.some((g) => g.id === newGateway.id);
          if (exists) {
            return {
              gateways: state.gateways.map((g) =>
                g.id === newGateway.id ? { ...g, ...newGateway } : g
              ),
            };
          }
          return {
            gateways: [...state.gateways, { ...newGateway, isCustom: true }],
          };
        }),

      deleteGateway: (id) =>
        set((state) => ({
          gateways: state.gateways.filter((g) => g.id !== id),
        })),

      toggleCarrier: (id) =>
        set((state) => ({
          carriers: state.carriers.map((c) =>
            c.id === id ? { ...c, isEnabled: !c.isEnabled } : c
          ),
        })),

      updateCarrier: (id, updates) =>
        set((state) => ({
          carriers: state.carriers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      addCarrier: (newCarrier) =>
        set((state) => {
          const exists = state.carriers.some((c) => c.id === newCarrier.id);
          if (exists) {
            return {
              carriers: state.carriers.map((c) =>
                c.id === newCarrier.id ? { ...c, ...newCarrier } : c
              ),
            };
          }
          return {
            carriers: [...state.carriers, { ...newCarrier, isCustom: true }],
          };
        }),

      deleteCarrier: (id) =>
        set((state) => ({
          carriers: state.carriers.filter((c) => c.id !== id),
        })),

      getAvailableGateways: (countryCode) => {
        const { gateways } = get();
        const upperCode = countryCode.toUpperCase();
        return gateways.filter((g) => {
          if (!g.isEnabled) return false;
          if (g.supportedCountryCodes.includes('GLOBAL')) return true;
          return g.supportedCountryCodes.includes(upperCode);
        });
      },

      getAvailableCarriers: (countryCode) => {
        const { carriers } = get();
        const upperCode = countryCode.toUpperCase();
        return carriers.filter((c) => {
          if (!c.isEnabled) return false;
          if (c.supportedCountryCodes.includes('GLOBAL')) return true;
          return c.supportedCountryCodes.includes(upperCode);
        });
      },

      resetToDefaults: () =>
        set({
          gateways: DEFAULT_GATEWAYS,
          carriers: DEFAULT_CARRIERS,
        }),
    }),
    {
      name: 'noon_payment_shipping_config_v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
