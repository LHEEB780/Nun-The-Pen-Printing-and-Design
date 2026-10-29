import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'IQD'
  | 'SAR'
  | 'AED'
  | 'KWD'
  | 'QAR'
  | 'JOD'
  | 'BHD'
  | 'OMR'
  | 'EGP';

export interface CurrencyItem {
  code: CurrencyCode;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  symbolAr: string;
  symbolEn: string;
  flag: string;
  rateAgainstUSD: number; // 1 USD = X units of this currency
  decimals: number;
  symbolPosition: 'before' | 'after';
}

/**
 * Ordered strictly according to user requirements:
 * 1. Western Major Currencies: USD, EUR, GBP, CAD, AUD
 * 2. Arab Currencies: IQD (Native), SAR, AED, KWD, QAR, JOD, BHD, OMR, EGP
 */
export const SYSTEM_CURRENCIES: CurrencyItem[] = [
  // --- 1. Global Major Currencies ---
  {
    code: 'USD',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    countryAr: 'الولايات المتحدة',
    countryEn: 'United States',
    symbolAr: '$',
    symbolEn: '$',
    flag: '🇺🇸',
    rateAgainstUSD: 1.0,
    decimals: 2,
    symbolPosition: 'before',
  },
  {
    code: 'EUR',
    nameAr: 'يورو أوروبي',
    nameEn: 'Euro',
    countryAr: 'الاتحاد الأوروبي',
    countryEn: 'European Union',
    symbolAr: '€',
    symbolEn: '€',
    flag: '🇪🇺',
    rateAgainstUSD: 0.92,
    decimals: 2,
    symbolPosition: 'before',
  },
  {
    code: 'GBP',
    nameAr: 'جنيه إسترليني',
    nameEn: 'British Pound',
    countryAr: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    symbolAr: '£',
    symbolEn: '£',
    flag: '🇬🇧',
    rateAgainstUSD: 0.79,
    decimals: 2,
    symbolPosition: 'before',
  },
  {
    code: 'CAD',
    nameAr: 'دولار كندي',
    nameEn: 'Canadian Dollar',
    countryAr: 'كندا',
    countryEn: 'Canada',
    symbolAr: 'C$',
    symbolEn: 'C$',
    flag: '🇨🇦',
    rateAgainstUSD: 1.37,
    decimals: 2,
    symbolPosition: 'before',
  },
  {
    code: 'AUD',
    nameAr: 'دولار أسترالي',
    nameEn: 'Australian Dollar',
    countryAr: 'أستراليا',
    countryEn: 'Australia',
    symbolAr: 'A$',
    symbolEn: 'A$',
    flag: '🇦🇺',
    rateAgainstUSD: 1.53,
    decimals: 2,
    symbolPosition: 'before',
  },

  // --- 2. Arab & Regional Currencies ---
  {
    code: 'IQD',
    nameAr: 'دينار عراقي',
    nameEn: 'Iraqi Dinar',
    countryAr: 'العراق',
    countryEn: 'Iraq',
    symbolAr: 'د.ع',
    symbolEn: 'IQD',
    flag: '🇮🇶',
    rateAgainstUSD: 1310, // Matching 1 USD ≈ 1,310 IQD from screenshot
    decimals: 0,
    symbolPosition: 'after',
  },
  {
    code: 'SAR',
    nameAr: 'ريال سعودي',
    nameEn: 'Saudi Riyal',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    symbolAr: 'ر.س',
    symbolEn: 'SAR',
    flag: '🇸🇦',
    rateAgainstUSD: 3.75, // Matching 1 USD ≈ 3.75 SAR from screenshot
    decimals: 2,
    symbolPosition: 'after',
  },
  {
    code: 'AED',
    nameAr: 'درهم إماراتي',
    nameEn: 'UAE Dirham',
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'United Arab Emirates',
    symbolAr: 'د.إ',
    symbolEn: 'AED',
    flag: '🇦🇪',
    rateAgainstUSD: 3.67,
    decimals: 2,
    symbolPosition: 'after',
  },
  {
    code: 'KWD',
    nameAr: 'دينار كويتي',
    nameEn: 'Kuwaiti Dinar',
    countryAr: 'الكويت',
    countryEn: 'Kuwait',
    symbolAr: 'د.ك',
    symbolEn: 'KWD',
    flag: '🇰🇼',
    rateAgainstUSD: 0.308,
    decimals: 3,
    symbolPosition: 'after',
  },
  {
    code: 'QAR',
    nameAr: 'ريال قطري',
    nameEn: 'Qatari Riyal',
    countryAr: 'قطر',
    countryEn: 'Qatar',
    symbolAr: 'ر.ق',
    symbolEn: 'QAR',
    flag: '🇶🇦',
    rateAgainstUSD: 3.64,
    decimals: 2,
    symbolPosition: 'after',
  },
  {
    code: 'JOD',
    nameAr: 'دينار أردني',
    nameEn: 'Jordanian Dinar',
    countryAr: 'الأردن',
    countryEn: 'Jordan',
    symbolAr: 'د.أ',
    symbolEn: 'JOD',
    flag: '🇯🇴',
    rateAgainstUSD: 0.709, // Matching 1 USD ≈ 0.709 JOD from screenshot
    decimals: 3,
    symbolPosition: 'after',
  },
  {
    code: 'BHD',
    nameAr: 'دينار بحريني',
    nameEn: 'Bahraini Dinar',
    countryAr: 'البحرين',
    countryEn: 'Bahrain',
    symbolAr: 'د.ب',
    symbolEn: 'BHD',
    flag: '🇧🇭',
    rateAgainstUSD: 0.376,
    decimals: 3,
    symbolPosition: 'after',
  },
  {
    code: 'OMR',
    nameAr: 'ريال عماني',
    nameEn: 'Omani Rial',
    countryAr: 'سلطنة عمان',
    countryEn: 'Oman',
    symbolAr: 'ر.ع',
    symbolEn: 'OMR',
    flag: '🇴🇲',
    rateAgainstUSD: 0.385,
    decimals: 3,
    symbolPosition: 'after',
  },
  {
    code: 'EGP',
    nameAr: 'جنيه مصري',
    nameEn: 'Egyptian Pound',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    symbolAr: 'ج.م',
    symbolEn: 'EGP',
    flag: '🇪🇬',
    rateAgainstUSD: 48.5,
    decimals: 2,
    symbolPosition: 'after',
  },
];

export const IQD_BASE_RATE_AGAINST_USD = 1310;

export interface CurrencyStore {
  currency: CurrencyCode;
  exchangeRate: number; // Backward-compatibility IQD per 1 USD
  currencies: CurrencyItem[];
  setCurrency: (currency: CurrencyCode) => void;
  toggleCurrency: () => void;
  getCurrencyInfo: (code?: CurrencyCode) => CurrencyItem;
  convertFromIQD: (amountInIQD: number, targetCurrency?: CurrencyCode) => number;
  convertToIQD: (amountInTarget: number, sourceCurrency?: CurrencyCode) => number;
  formatPrice: (
    amountInIQD: number,
    options?: {
      showCode?: boolean;
      showSymbol?: boolean;
      decimals?: number;
      isAr?: boolean;
      targetCurrency?: CurrencyCode;
    }
  ) => string;
  getCurrencySymbol: (isAr?: boolean) => string;
  getCurrencyCodeLabel: (isAr?: boolean) => string;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'USD', // Defaulting to USD or IQD as shown in screenshot
      exchangeRate: IQD_BASE_RATE_AGAINST_USD,
      currencies: SYSTEM_CURRENCIES,

      setCurrency: (currency: CurrencyCode) => {
        const found = SYSTEM_CURRENCIES.some((c) => c.code === currency);
        if (found) {
          set({ currency });
        }
      },

      toggleCurrency: () => {
        const current = get().currency;
        // Fast flip between USD and IQD
        const next: CurrencyCode = current === 'USD' ? 'IQD' : 'USD';
        set({ currency: next });
      },

      getCurrencyInfo: (code?: CurrencyCode) => {
        const targetCode = code || get().currency;
        return (
          SYSTEM_CURRENCIES.find((c) => c.code === targetCode) ||
          SYSTEM_CURRENCIES[0]
        );
      },

      convertFromIQD: (amountInIQD: number, targetCurrency?: CurrencyCode) => {
        const info = get().getCurrencyInfo(targetCurrency);
        if (info.code === 'IQD') return amountInIQD;
        // Convert IQD -> USD -> Target Currency
        const inUSD = amountInIQD / IQD_BASE_RATE_AGAINST_USD;
        return inUSD * info.rateAgainstUSD;
      },

      convertToIQD: (amountInTarget: number, sourceCurrency?: CurrencyCode) => {
        const info = get().getCurrencyInfo(sourceCurrency);
        if (info.code === 'IQD') return amountInTarget;
        const inUSD = amountInTarget / info.rateAgainstUSD;
        return inUSD * IQD_BASE_RATE_AGAINST_USD;
      },

      getCurrencySymbol: (isAr = true) => {
        const info = get().getCurrencyInfo();
        return isAr ? info.symbolAr : info.symbolEn;
      },

      getCurrencyCodeLabel: (isAr = true) => {
        const info = get().getCurrencyInfo();
        return isAr
          ? `${info.nameAr} (${info.code})`
          : `${info.nameEn} (${info.code})`;
      },

      formatPrice: (amountInIQD: number, options = {}) => {
        const { targetCurrency, isAr = true, showCode = false, showSymbol = true } = options;
        const info = get().getCurrencyInfo(targetCurrency);

        let convertedValue = amountInIQD;
        if (info.code !== 'IQD') {
          convertedValue = (amountInIQD / IQD_BASE_RATE_AGAINST_USD) * info.rateAgainstUSD;
        }

        const decCount =
          options.decimals !== undefined
            ? options.decimals
            : info.decimals;

        const formattedNumber =
          info.code === 'IQD'
            ? Math.round(convertedValue).toLocaleString('en-US')
            : convertedValue.toLocaleString('en-US', {
                minimumFractionDigits: decCount,
                maximumFractionDigits: decCount,
              });

        const symbol = isAr ? info.symbolAr : info.symbolEn;

        if (!showSymbol && !showCode) return formattedNumber;

        if (showCode && !showSymbol) return `${formattedNumber} ${info.code}`;

        if (showSymbol && showCode) {
          return `${symbol}${formattedNumber} ${info.code}`;
        }

        // Natural symbol position
        if (info.symbolPosition === 'before') {
          return `${symbol}${formattedNumber}`;
        }
        return `${formattedNumber} ${symbol}`;
      },
    }),
    {
      name: 'noon-currency-storage-v2',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: any) => persistedState || {},
      partialize: (state) => ({
        currency: state.currency,
      }),
    }
  )
);
