import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OfferCategory = 'all' | 'boxes' | 'acrylic' | 'cards' | 'awards' | 'bundles';

export interface OfferItem {
  id: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  discountBadgeAr: string;
  discountBadgeEn: string;
  discountPercentage: number;
  promoCode: string;
  category: OfferCategory;
  imageUrl: string;
  originalPrice?: number;
  discountedPrice?: number;
  currency: string;
  expiresAt: string;
  featuresAr: string[];
  featuresEn: string[];
  isFeatured: boolean;
  isActive: boolean;
  productId?: string;
  whatsappInquiryTextAr?: string;
  whatsappInquiryTextEn?: string;
  createdAt: string;
}

export const INITIAL_OFFERS: OfferItem[] = [
  {
    id: 'off-1',
    titleAr: 'عرض الموسم: خصم 25% على علب الكرتون المقوى الفاخرة (Rigid Boxes)',
    titleEn: 'Seasonal Deal: 25% OFF Luxury Custom Rigid Boxes',
    taglineAr: 'تصنيع محلي في بغداد بكرتون مقوى 1200-1800 غم مع بصمة حرارية',
    taglineEn: 'Crafted in Baghdad with 1200-1800gsm board & hot-foil stamping',
    descriptionAr: 'خصم استثنائي لفترة محدودة على علب الهدايا والعطور والتمور الفاخرة، يشمل قالب الكليشة المجاني للشعار وبصمة الذهب الحرارية وتغليف الإسفنج المخملي الداخلي.',
    descriptionEn: 'Limited-time special offer on custom gift, perfume & corporate rigid boxes. Includes complimentary logo embossing die, hot-foil stamping, and bespoke velvet foam inserts.',
    discountBadgeAr: 'خصم 25% ذهبي',
    discountBadgeEn: '25% OFF GOLD',
    discountPercentage: 25,
    promoCode: 'BOXES25',
    category: 'boxes',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    originalPrice: 180000,
    discountedPrice: 135000,
    currency: 'IQD',
    expiresAt: '2026-11-15',
    featuresAr: [
      'كرتون مقوى مستورد سماكة 2 ملم مقاوم للضغط',
      'بصمة ذهبية أو فضية حرارية عالية الدقة مجاناً',
      'بطانة داخلية مخصصة بحسب أبعاد منتجك',
      'شحن مجاني داخل بغداد للطلبات المؤهلة'
    ],
    featuresEn: [
      'Imported 2mm rigid board with anti-crush structure',
      'Complimentary hot-foil stamp in gold or silver',
      'Bespoke laser-cut internal foam lining',
      'Free Baghdad delivery on qualifying volumes'
    ],
    isFeatured: true,
    isActive: true,
    productId: 'prod-perfume-luxury-box',
    whatsappInquiryTextAr: 'مرحباً استوديو نُون والقَلَم، أود الاستفادة من كود الخصم (BOXES25) لعرض علب الكرتون المقوى.',
    whatsappInquiryTextEn: 'Hello Noon & Pen, I would like to claim promo code BOXES25 for custom rigid boxes.',
    createdAt: '2026-03-01',
  },
  {
    id: 'off-2',
    titleAr: 'باقة دروع ولوحات الأكريليك المضيئة 3D LED للشركات والمكاتب',
    titleEn: 'Corporate Edge-Lit 3D Acrylic & LED Sign Gala Offer',
    taglineAr: 'أكريليك كاست نقي 100% مع مسامير استيل ستاند أوف وإضاءة دافئة',
    taglineEn: '100% Pure cast acrylic with stainless standoffs & ambient LED',
    descriptionAr: 'احصل على لوحة جدارية أكريليك مضيئة مخصصة باسم وشعار شركتك أو عيادتك مع خط كوفي أو ثلث مجسم، مع خصم 20% ومسامير التثبيت ومحول الطاقة مجاناً.',
    descriptionEn: 'Transform your office entrance with precision edge-lit acrylic signs. Features deep laser engraving, crystal-polished edges, premium stainless standoff mounts, and 20% seasonal savings.',
    discountBadgeAr: 'وفر 20%',
    discountBadgeEn: 'SAVE 20%',
    discountPercentage: 20,
    promoCode: 'ACRYLIC20',
    category: 'acrylic',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    originalPrice: 120000,
    discountedPrice: 96000,
    currency: 'IQD',
    expiresAt: '2026-11-20',
    featuresAr: [
      'أكريليك كريستال كاست عالي الشفافية سماكة 6-10 ملم',
      'إضاءة LED موفرة للطاقة مع كفالة سنتين',
      'حفر وقص ليزري ميكروني بدقة 0.2 ملم',
      'إرسال بروفة رقمية 3D للاعتماد قبل التنفيذ'
    ],
    featuresEn: [
      '6-10mm optical grade crystal acrylic plaque',
      'Energy-efficient 12V LED with 2-year warranty',
      '0.2mm precision German laser CNC cutting',
      '3D digital proof dispatched before fabrication'
    ],
    isFeatured: true,
    isActive: true,
    productId: 'prod-travel-acrylic-sign',
    whatsappInquiryTextAr: 'مرحباً، أود الاستفسار عن عرض لوحات الأكريليك المضيئة مع كود (ACRYLIC20).',
    whatsappInquiryTextEn: 'Hello, inquiring about the LED Acrylic Sign seasonal deal (ACRYLIC20).',
    createdAt: '2026-03-05',
  },
  {
    id: 'off-3',
    titleAr: 'عرض كروت الأعمال القطنية الفاخرة 700 غم مع بصمة حرارية',
    titleEn: '700gsm Cotton Hot-Foil Business Cards Special Deal',
    taglineAr: 'اطلب 500 كرت واحصل على 250 كرت مجاناً + حواف مذهبة',
    taglineEn: 'Order 500 luxury cards, get 250 free + gilded foil edges',
    descriptionAr: 'كروت المحامين والأطباء ورجال الأعمال: ورق قطني أسود ملكي فاحم أو أبيض عاجي بوزن 700 غم مع حفر بارز (Letterpress) وبصمة حرارية لامعة تدوم طويلاً.',
    descriptionEn: 'Ultra-heavy 700gsm cotton cardstock with metallic foil press. Designed for executives, doctors, and legal counselors who demand tactile distinction.',
    discountBadgeAr: 'اشترِ 500 واحصل على 250 مجاناً',
    discountBadgeEn: 'BUY 500 GET 250 FREE',
    discountPercentage: 33,
    promoCode: 'CARDSGOLD',
    category: 'cards',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    originalPrice: 110000,
    discountedPrice: 79000,
    currency: 'IQD',
    expiresAt: '2026-11-10',
    featuresAr: [
      'ورق قطني سميك 700 غم مع لب أسود فاحم (Black Core)',
      'بصمة حرارية ذهبية أو برونزية أو فضية للوجهين',
      'تذهيب الحواف الخارجية (Gilded Edges) مجاناً',
      'علبة أكريليك شفافة فاخرة لحفظ الكروت'
    ],
    featuresEn: [
      '700gsm triple-layer cotton board with core sandwich',
      'Double-sided mirror hot-foil stamping',
      'Complimentary gilded edge leafing',
      'Free crystal acrylic desk card dispenser'
    ],
    isFeatured: false,
    isActive: true,
    productId: 'prod-foil-cards',
    whatsappInquiryTextAr: 'مرحباً، أود طلب عرض كروت الأعمال المذهبة كود (CARDSGOLD).',
    whatsappInquiryTextEn: 'Hello, I want to order the luxury business card deal (CARDSGOLD).',
    createdAt: '2026-03-10',
  },
  {
    id: 'off-4',
    titleAr: 'باقة دروع التكريم الكريستالية مع حفر المخطوطات الكوفية',
    titleEn: 'Crystal Recognition Awards with Bespoke Calligraphy',
    taglineAr: 'خصم 30% للجامعات والمؤسسات والشركات للطلبات من 5 قطع فأكثر',
    taglineEn: '30% Discount for institutions & corporates on 5+ award pieces',
    descriptionAr: 'دروع تكريم كريستالية فاخرة مع قواعد خشب الجوز المحفورة، متضمنة رسم المخطوطة التكريمية بخط الثلث أو الكوفي وإهداء العلبة المخملية الخاصة.',
    descriptionEn: 'High-end crystal tribute plaques with solid walnut wood bases. Hand-lettered Arabic calligraphy by Noon & Pen masters with complimentary satin presentation boxes.',
    discountBadgeAr: 'خصم 30% للمؤسسات',
    discountBadgeEn: '30% INSTITUTIONAL',
    discountPercentage: 30,
    promoCode: 'AWARD30',
    category: 'awards',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
    originalPrice: 65000,
    discountedPrice: 45500,
    currency: 'IQD',
    expiresAt: '2026-11-25',
    featuresAr: [
      'أكريليك كريستالي نقي عالي الثقل واللمعان',
      'قاعدة خشب جوز طبيعي مع لوحة معدنية ذهبية',
      'صندوق هدايا مبطن بالساتان الملكي مع كل درع',
      'تنفيذ عاجل خلال 48 ساعة للمناسبات والمؤتمرات'
    ],
    featuresEn: [
      'Heavy optical crystal acrylic with facet bevels',
      'Solid walnut base with engraved gold brass plate',
      'Royal satin-padded luxury gift case included',
      'Express 48h turnaround for ceremonies & summits'
    ],
    isFeatured: false,
    isActive: true,
    productId: 'prod-crystal-award-trophy',
    whatsappInquiryTextAr: 'أود الاستفسار عن عرض دروع التكريم الكريستالية كود (AWARD30).',
    whatsappInquiryTextEn: 'Inquiry regarding the Crystal Awards promotion (AWARD30).',
    createdAt: '2026-03-15',
  },
  {
    id: 'off-5',
    titleAr: 'الباقة الشاملة لهوية المشاريع والعلامات التجارية الجديدة (VIP Bundle)',
    titleEn: 'All-In-One Brand Identity & Packaging Launch Bundle',
    taglineAr: '100 علبة مقواة + لوحة أكريليك جدارية + 500 كرت بصمة + شحن مجاني',
    taglineEn: '100 Rigid Boxes + 1 Edge-Lit Sign + 500 Foil Cards + Free Delivery',
    descriptionAr: 'الباقة الأكثر طلباً لرواد الأعمال وأصحاب المشاريع والشركات الناشئة في العراق. كل ما تحتاجه لإطلاق علامتك التجارية بمظهر ملكي احترافي مع توفير يتجاوز 120,000 د.ع.',
    descriptionEn: 'The definitive executive package for luxury startups and retail brands in Iraq. Combines bespoke rigid packaging, entrance signage, and business stationery with over 120,000 IQD in total savings.',
    discountBadgeAr: 'وفر 120,000 د.ع',
    discountBadgeEn: 'SAVE 120K IQD',
    discountPercentage: 27,
    promoCode: 'VIPBUNDLE',
    category: 'bundles',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
    originalPrice: 450000,
    discountedPrice: 330000,
    currency: 'IQD',
    expiresAt: '2026-12-01',
    featuresAr: [
      '100 علبة كرتون مقوى فاخرة مطبوعة ومذهبة بشعارك',
      'لوحة جدارية أكريليك مضيئة LED مقاس 60×40 سم',
      '500 كرت أعمال قطني 700 غم مع بصمة ذهبية',
      'شحن مجاني وسريع لكافة محافظات العراق'
    ],
    featuresEn: [
      '100 custom branded luxury rigid boxes with foil logo',
      '1 Custom 60x40cm illuminated 3D LED acrylic plaque',
      '500 Heavy 700gsm gold-foil business cards',
      'Free VIP tracked shipping to all Iraq governorates'
    ],
    isFeatured: true,
    isActive: true,
    whatsappInquiryTextAr: 'مرحباً، أود حجز الباقة الشاملة VIP للمشاريع الجديدة بكود (VIPBUNDLE).',
    whatsappInquiryTextEn: 'Hello, I want to book the VIP Launch Bundle with promo code (VIPBUNDLE).',
    createdAt: '2026-03-20',
  }
];

interface OffersStore {
  offers: OfferItem[];
  addOffer: (offer: Omit<OfferItem, 'id' | 'createdAt'>) => void;
  updateOffer: (id: string, updated: Partial<OfferItem>) => void;
  deleteOffer: (id: string) => void;
  toggleOfferActive: (id: string) => void;
  toggleOfferFeatured: (id: string) => void;
  resetOffersToDefaults: () => void;
  getActiveOffers: () => OfferItem[];
  getFeaturedOffer: () => OfferItem | undefined;
}

export const useOffersStore = create<OffersStore>()(
  persist(
    (set, get) => ({
      offers: INITIAL_OFFERS,

      addOffer: (newOfferData) => {
        const newOffer: OfferItem = {
          ...newOfferData,
          id: `off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          offers: [newOffer, ...state.offers],
        }));
      },

      updateOffer: (id, updated) => {
        set((state) => ({
          offers: state.offers.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          ),
        }));
      },

      deleteOffer: (id) => {
        set((state) => ({
          offers: state.offers.filter((item) => item.id !== id),
        }));
      },

      toggleOfferActive: (id) => {
        set((state) => ({
          offers: state.offers.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          ),
        }));
      },

      toggleOfferFeatured: (id) => {
        set((state) => ({
          offers: state.offers.map((item) =>
            item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
          ),
        }));
      },

      resetOffersToDefaults: () => {
        set({ offers: INITIAL_OFFERS });
      },

      getActiveOffers: () => {
        const now = new Date();
        return get().offers.filter(
          (o) => o.isActive && (!o.expiresAt || new Date(`${o.expiresAt}T23:59:59`) >= now)
        );
      },

      getFeaturedOffer: () => {
        const active = get().getActiveOffers();
        return active.find((o) => o.isFeatured) || active[0];
      },
    }),
    {
      name: 'noon_seasonal_offers_storage_v1',
    }
  )
);
