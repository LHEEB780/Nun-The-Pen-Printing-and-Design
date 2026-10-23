import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * International shipping courier management.
 * Admin can add / edit / activate / deactivate couriers from the dashboard;
 * the checkout page only shows ACTIVE couriers for international orders.
 * All fees are IQD-native (money correctness rule).
 */
export interface ShippingCompany {
  id: string;
  nameAr: string;
  nameEn: string;
  baseFeeIQD: number;
  minDays: number;
  maxDays: number;
  coverageAr: string;
  coverageEn: string;
  trackingUrl?: string;
  notesAr?: string;
  notesEn?: string;
  isActive: boolean;
}

export const INITIAL_SHIPPING_COMPANIES: ShippingCompany[] = [
  {
    id: 'ship-dhl',
    nameAr: 'دي إتش إل (DHL Express)',
    nameEn: 'DHL Express Worldwide',
    baseFeeIQD: 165000,
    minDays: 3,
    maxDays: 7,
    coverageAr: 'شحن دولي إلى أكثر من 220 دولة',
    coverageEn: 'Express shipping to 220+ countries',
    trackingUrl: 'https://www.dhl.com/global-en/home/tracking.html',
    notesAr: 'الأسرع للوثائق والعينات الخفيفة، مع تتبع لحظي لكل مرحلة.',
    notesEn: 'Fastest option for light parcels & documents with live tracking.',
    isActive: true,
  },
  {
    id: 'ship-aramex',
    nameAr: 'أرامكس (Aramex)',
    nameEn: 'Aramex International',
    baseFeeIQD: 125000,
    minDays: 4,
    maxDays: 9,
    coverageAr: 'تغطية قوية للخليج والشرق الأوسط وأوروبا',
    coverageEn: 'Strong GCC, Middle East & Europe coverage',
    trackingUrl: 'https://www.aramex.com/track/results',
    notesAr: 'خيار اقتصادي متوازن للشحنات المتوسطة إلى دول الجوار.',
    notesEn: 'Balanced economical option for mid-size parcels to neighboring markets.',
    isActive: true,
  },
  {
    id: 'ship-ems',
    nameAr: 'البريد الدولي السريع (EMS)',
    nameEn: 'EMS International Mail',
    baseFeeIQD: 85000,
    minDays: 7,
    maxDays: 14,
    coverageAr: 'شحن بري دولي اقتصادي عبر شبكة البريد العالمية',
    coverageEn: 'Economical postal network to worldwide destinations',
    notesAr: 'الخيار الأوفر للطلبات غير المستعجلة، مدة التسليم أطول.',
    notesEn: 'Cheapest option for non-urgent shipments; longer transit time.',
    isActive: true,
  },
  {
    id: 'ship-fedex',
    nameAr: 'فيديكس (FedEx)',
    nameEn: 'FedEx International',
    baseFeeIQD: 155000,
    minDays: 4,
    maxDays: 8,
    coverageAr: 'شحن دولي سريع مع تركيز على الأمريكتين',
    coverageEn: 'Fast international shipping, strong Americas lanes',
    trackingUrl: 'https://www.fedex.com/fedextrack/',
    notesAr: 'مثالي للشحنات الموجهة إلى أمريكا الشمالية والجنوبية.',
    notesEn: 'Ideal for shipments destined to North & South America.',
    isActive: false,
  },
  {
    id: 'ship-ups',
    nameAr: 'يو بي إس (UPS)',
    nameEn: 'UPS Worldwide',
    baseFeeIQD: 160000,
    minDays: 4,
    maxDays: 8,
    coverageAr: 'شبكة دولية شاملة مع تتبع تفصيلي للطرد',
    coverageEn: 'Comprehensive global network with parcel-level tracking',
    trackingUrl: 'https://www.ups.com/track',
    notesAr: 'مناسب للشحنات التجارية الثقيلة وخدمات التخليص الجمركي.',
    notesEn: 'Suits heavier commercial cargo and customs brokerage needs.',
    isActive: false,
  },
];

interface ShippingStore {
  companies: ShippingCompany[];
  addCompany: (data: Omit<ShippingCompany, 'id'>) => void;
  updateCompany: (id: string, updated: Partial<ShippingCompany>) => void;
  deleteCompany: (id: string) => void;
  toggleCompanyActive: (id: string) => void;
  resetCompaniesToDefaults: () => void;
  getActiveCompanies: () => ShippingCompany[];
}

export const useShippingStore = create<ShippingStore>()(
  persist(
    (set, get) => ({
      companies: INITIAL_SHIPPING_COMPANIES,

      addCompany: (data) => {
        const newCompany: ShippingCompany = {
          ...data,
          id: `ship-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        };
        set((state) => ({ companies: [...state.companies, newCompany] }));
      },

      updateCompany: (id, updated) => {
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        }));
      },

      deleteCompany: (id) => {
        set((state) => ({ companies: state.companies.filter((c) => c.id !== id) }));
      },

      toggleCompanyActive: (id) => {
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      resetCompaniesToDefaults: () => {
        set({ companies: INITIAL_SHIPPING_COMPANIES });
      },

      getActiveCompanies: () => get().companies.filter((c) => c.isActive),
    }),
    {
      name: 'noon_shipping_companies_storage_v1',
    }
  )
);
