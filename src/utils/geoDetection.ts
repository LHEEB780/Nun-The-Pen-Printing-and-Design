import { CurrencyCode } from '../store/useCurrencyStore';

export interface GeoDetectionResult {
  language: 'ar' | 'en';
  isArabCountry: boolean;
  countryNameAr: string;
  countryNameEn: string;
  countryCode: string;
  flag: string;
  suggestedCurrency: CurrencyCode;
}

/**
 * Arab Countries Timezone Map to Currency & Country details
 */
const ARAB_TIMEZONE_MAP: Record<
  string,
  {
    countryAr: string;
    countryEn: string;
    code: string;
    flag: string;
    currency: CurrencyCode;
  }
> = {
  // Iraq
  'Asia/Baghdad': {
    countryAr: 'العراق',
    countryEn: 'Iraq',
    code: 'IQ',
    flag: '🇮🇶',
    currency: 'IQD',
  },
  // Saudi Arabia
  'Asia/Riyadh': {
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    currency: 'SAR',
  },
  // UAE
  'Asia/Dubai': {
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    currency: 'AED',
  },
  // Kuwait
  'Asia/Kuwait': {
    countryAr: 'الكويت',
    countryEn: 'Kuwait',
    code: 'KW',
    flag: '🇰🇼',
    currency: 'KWD',
  },
  // Qatar
  'Asia/Qatar': {
    countryAr: 'قطر',
    countryEn: 'Qatar',
    code: 'QA',
    flag: '🇶🇦',
    currency: 'QAR',
  },
  // Jordan
  'Asia/Amman': {
    countryAr: 'الأردن',
    countryEn: 'Jordan',
    code: 'JO',
    flag: '🇯🇴',
    currency: 'JOD',
  },
  // Bahrain
  'Asia/Bahrain': {
    countryAr: 'البحرين',
    countryEn: 'Bahrain',
    code: 'BH',
    flag: '🇧🇭',
    currency: 'BHD',
  },
  // Oman
  'Asia/Muscat': {
    countryAr: 'سلطنة عمان',
    countryEn: 'Oman',
    code: 'OM',
    flag: '🇴🇲',
    currency: 'OMR',
  },
  // Egypt
  'Africa/Cairo': {
    countryAr: 'مصر',
    countryEn: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    currency: 'EGP',
  },
  // Lebanon
  'Asia/Beirut': {
    countryAr: 'لبنان',
    countryEn: 'Lebanon',
    code: 'LB',
    flag: '🇱🇧',
    currency: 'USD',
  },
  // Syria
  'Asia/Damascus': {
    countryAr: 'سوريا',
    countryEn: 'Syria',
    code: 'SY',
    flag: '🇸🇾',
    currency: 'USD',
  },
  // Palestine
  'Asia/Gaza': {
    countryAr: 'فلسطين',
    countryEn: 'Palestine',
    code: 'PS',
    flag: '🇵🇸',
    currency: 'JOD',
  },
  'Asia/Hebron': {
    countryAr: 'فلسطين',
    countryEn: 'Palestine',
    code: 'PS',
    flag: '🇵🇸',
    currency: 'JOD',
  },
  'Asia/Jerusalem': {
    countryAr: 'القدس الشريف',
    countryEn: 'Jerusalem',
    code: 'PS',
    flag: '🇵🇸',
    currency: 'JOD',
  },
  // Yemen
  'Asia/Aden': {
    countryAr: 'اليمن',
    countryEn: 'Yemen',
    code: 'YE',
    flag: '🇾🇪',
    currency: 'USD',
  },
  // Libya
  'Africa/Tripoli': {
    countryAr: 'ليبيا',
    countryEn: 'Libya',
    code: 'LY',
    flag: '🇱🇾',
    currency: 'USD',
  },
  // Tunisia
  'Africa/Tunis': {
    countryAr: 'تونس',
    countryEn: 'Tunisia',
    code: 'TN',
    flag: '🇹🇳',
    currency: 'USD',
  },
  // Algeria
  'Africa/Algiers': {
    countryAr: 'الجزائر',
    countryEn: 'Algeria',
    code: 'DZ',
    flag: '🇩🇿',
    currency: 'USD',
  },
  // Morocco
  'Africa/Casablanca': {
    countryAr: 'المغرب',
    countryEn: 'Morocco',
    code: 'MA',
    flag: '🇲🇦',
    currency: 'USD',
  },
  // Sudan
  'Africa/Khartoum': {
    countryAr: 'السودان',
    countryEn: 'Sudan',
    code: 'SD',
    flag: '🇸🇩',
    currency: 'USD',
  },
  'Africa/Nouakchott': {
    countryAr: 'موريتانيا',
    countryEn: 'Mauritania',
    code: 'MR',
    flag: '🇲🇷',
    currency: 'USD',
  },
  'Africa/Mogadishu': {
    countryAr: 'الصومال',
    countryEn: 'Somalia',
    code: 'SO',
    flag: '🇸🇴',
    currency: 'USD',
  },
  'Africa/Djibouti': {
    countryAr: 'جيبوتي',
    countryEn: 'Djibouti',
    code: 'DJ',
    flag: '🇩🇯',
    currency: 'USD',
  },
};

/**
 * Detect client country, language, and suggested currency
 * without intrusive permission prompts or latency.
 */
export function detectClientLocaleAndCountry(): GeoDetectionResult {
  if (typeof window === 'undefined') {
    return {
      language: 'ar',
      isArabCountry: true,
      countryNameAr: 'العراق',
      countryNameEn: 'Iraq',
      countryCode: 'IQ',
      flag: '🇮🇶',
      suggestedCurrency: 'IQD',
    };
  }

  try {
    // 1. Get browser timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    // Check if timezone matches an Arab Country
    const arabMatch = ARAB_TIMEZONE_MAP[timeZone];
    if (arabMatch) {
      return {
        language: 'ar',
        isArabCountry: true,
        countryNameAr: arabMatch.countryAr,
        countryNameEn: arabMatch.countryEn,
        countryCode: arabMatch.code,
        flag: arabMatch.flag,
        suggestedCurrency: arabMatch.currency,
      };
    }

    // 2. Check browser locale languages (e.g. ['ar-SA', 'ar', 'en-US'])
    const browserLanguages = navigator.languages || [navigator.language || ''];
    const hasArabicInLanguages = browserLanguages.some(
      (lng) => typeof lng === 'string' && lng.toLowerCase().startsWith('ar')
    );

    if (hasArabicInLanguages) {
      // User has Arabic preferred in system settings
      return {
        language: 'ar',
        isArabCountry: true,
        countryNameAr: 'المنطقة العربية',
        countryNameEn: 'Arab Region',
        countryCode: 'AR',
        flag: '🌍',
        suggestedCurrency: 'IQD',
      };
    }

    // 3. Western / International Timezones
    if (timeZone.startsWith('Europe/London')) {
      return {
        language: 'en',
        isArabCountry: false,
        countryNameAr: 'المملكة المتحدة',
        countryNameEn: 'United Kingdom',
        countryCode: 'GB',
        flag: '🇬🇧',
        suggestedCurrency: 'GBP',
      };
    }

    if (timeZone.startsWith('Europe/')) {
      return {
        language: 'en',
        isArabCountry: false,
        countryNameAr: 'الاتحاد الأوروبي',
        countryNameEn: 'European Union',
        countryCode: 'EU',
        flag: '🇪🇺',
        suggestedCurrency: 'EUR',
      };
    }

    if (timeZone.startsWith('America/Toronto') || timeZone.startsWith('America/Vancouver') || timeZone.startsWith('America/Montreal')) {
      return {
        language: 'en',
        isArabCountry: false,
        countryNameAr: 'كندا',
        countryNameEn: 'Canada',
        countryCode: 'CA',
        flag: '🇨🇦',
        suggestedCurrency: 'CAD',
      };
    }

    if (timeZone.startsWith('Australia/')) {
      return {
        language: 'en',
        isArabCountry: false,
        countryNameAr: 'أستراليا',
        countryNameEn: 'Australia',
        countryCode: 'AU',
        flag: '🇦🇺',
        suggestedCurrency: 'AUD',
      };
    }

    // Default international (United States / Global)
    return {
      language: 'en',
      isArabCountry: false,
      countryNameAr: 'الولايات المتحدة / دولي',
      countryNameEn: 'Global / United States',
      countryCode: 'US',
      flag: '🇺🇸',
      suggestedCurrency: 'USD',
    };
  } catch {
    // Fallback to Arabic as primary identity
    return {
      language: 'ar',
      isArabCountry: true,
      countryNameAr: 'العراق',
      countryNameEn: 'Iraq',
      countryCode: 'IQ',
      flag: '🇮🇶',
      suggestedCurrency: 'IQD',
    };
  }
}
