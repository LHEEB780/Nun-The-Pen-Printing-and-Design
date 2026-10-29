/**
 * Google Analytics & Visitor Behavior Tracking Engine
 * Noon & Pen Printing & Design (دار نون والقلم للطباعة والتصميم)
 *
 * Supports Google Analytics 4 (GA4 - gtag.js), custom portal tracking,
 * campaign referral tracking, and local visitor session logging.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    __GA_MEASUREMENT_ID__?: string;
  }
}

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  eventName: string;
  portal: string;
  labelAr: string;
  details?: Record<string, any>;
}

// Default GA4 Measurement ID (can be overridden via VITE_GA_MEASUREMENT_ID env var)
export const GA_MEASUREMENT_ID =
  (import.meta.env?.VITE_GA_MEASUREMENT_ID as string) || 'G-NQBAGHDAD1';

const STORAGE_KEY = 'noon_analytics_events_log';
const MAX_LOG_SIZE = 50;

/**
 * Initialize Google Analytics (gtag.js) programmatically
 */
export const initAnalytics = (): void => {
  try {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
    }

    // Configure GA
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // SPA views are tracked dynamically via trackPageView
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  } catch (err) {
    console.warn('Analytics initialization notice:', err);
  }
};

/**
 * Log event locally for Admin Analytics Dashboard & real-time funnel view
 */
const logLocalEvent = (eventName: string, portal: string, labelAr: string, details?: Record<string, any>) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    const newEntry: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      eventName,
      portal,
      labelAr,
      details,
    };

    const updated = [newEntry, ...existing].slice(0, MAX_LOG_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore local storage restrictions
  }
};

/**
 * Get recorded analytics events from local session
 */
export const getLocalAnalyticsLog = (): AnalyticsEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Clear local analytics log
 */
export const clearLocalAnalyticsLog = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

/**
 * Human-friendly portal names in Arabic and English
 */
export const PORTAL_METADATA: Record<string, { titleAr: string; titleEn: string; category: string }> = {
  home: { titleAr: 'الرئيسية - دار نون والقلم', titleEn: 'Home Storefront', category: 'store' },
  shop: { titleAr: 'المتجر والتخصيص الفاخر', titleEn: 'Shop & Customize', category: 'store' },
  product: { titleAr: 'تفاصيل واستعراض المنتج', titleEn: 'Product Details', category: 'store' },
  specialty: { titleAr: 'استوديوهات الإنتاج التخصصية', titleEn: 'Specialty Studios', category: 'production' },
  offers: { titleAr: 'عروض الموسم والتخفيضات', titleEn: 'Seasonal Offers Hub', category: 'marketing' },
  portfolio: { titleAr: 'معرض الأعمال المنفذة', titleEn: 'Executive Portfolio', category: 'gallery' },
  checkout: { titleAr: 'صفحة إتمام الطلب والدفع', titleEn: 'Checkout & Payment', category: 'conversion' },
  'order-confirmation': { titleAr: 'تأكيد الطلب والفاتورة', titleEn: 'Order Confirmation', category: 'conversion' },
  dashboard: { titleAr: 'بوابة حساب العميل والبروفات', titleEn: 'Customer Portal', category: 'portal' },
  partners: { titleAr: 'بوابة الشركاء وممثلي المبيعات', titleEn: 'Sales Partners Portal', category: 'portal' },
  admin: { titleAr: 'لوحة تحكم الإدارة (RBAC Studio)', titleEn: 'Admin Control Center', category: 'admin' },
  landing: { titleAr: 'صفحة الهبوط الإعلانية الديناميكية', titleEn: 'Campaign Landing Page', category: 'marketing' },
};

/**
 * Track virtual page views across SPA portals
 */
export const trackPageView = (viewName: string, additionalParams: Record<string, any> = {}): void => {
  try {
    const meta = PORTAL_METADATA[viewName] || {
      titleAr: `بوابة ${viewName}`,
      titleEn: `${viewName} View`,
      category: 'general',
    };

    const pagePath = `/${viewName === 'home' ? '' : viewName}`;
    const pageTitle = `${meta.titleAr} | Noon & Pen`;

    // 1. Google Analytics gtag event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath,
        portal_name: viewName,
        portal_category: meta.category,
        language: document.documentElement.lang || 'ar',
        ...additionalParams,
      });
    }

    // 2. Local Session Log
    logLocalEvent('page_view', viewName, `زيارة: ${meta.titleAr}`, {
      pagePath,
      ...additionalParams,
    });
  } catch (err) {
    console.warn('Analytics trackPageView error:', err);
  }
};

/**
 * Track custom user behavior events (e.g. QR scan, partner referral, cart, checkout)
 */
export const trackEvent = (
  eventName: string,
  labelAr: string,
  portal: string = 'general',
  params: Record<string, any> = {}
): void => {
  try {
    // 1. Google Analytics gtag event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: portal,
        event_label: labelAr,
        portal,
        timestamp: new Date().toISOString(),
        ...params,
      });
    }

    // 2. Local Session Log
    logLocalEvent(eventName, portal, labelAr, params);
  } catch (err) {
    console.warn('Analytics trackEvent error:', err);
  }
};
