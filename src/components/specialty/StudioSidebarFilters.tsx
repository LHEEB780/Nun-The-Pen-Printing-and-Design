import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SlidersHorizontal,
  Layers,
  Sparkles,
  Tag,
  Clock,
  Ruler,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  HeartHandshake,
  RotateCcw,
  Check,
  Zap,
  Flame,
  Award,
} from 'lucide-react';
import { SpecialtyId } from '../home/SpecialtyGatewaysSection';

export interface StudioCategoryItem {
  id: string;
  labelAr: string;
  labelEn: string;
  shortLabelAr?: string;
  shortLabelEn?: string;
  iconName?: string;
  badgeAr?: string;
  badgeEn?: string;
}

export const STUDIO_CATEGORIES: Record<SpecialtyId, StudioCategoryItem[]> = {
  boxes: [
    { id: 'all', labelAr: 'كافة نماذج العلب والتغليف', labelEn: 'All Packaging Models', shortLabelAr: 'الكل', shortLabelEn: 'All' },
    { id: 'rigid', labelAr: 'علب صلبة كرتون مقوى 1200-1800 غم', labelEn: 'Rigid Setup Boxes (1200-1800gsm)', shortLabelAr: 'علب صلبة', shortLabelEn: 'Rigid Boxes', badgeAr: 'الأكثر طلباً', badgeEn: 'Best Seller' },
    { id: 'perfume', labelAr: 'علب عطور ومجوهرات فاخرة', labelEn: 'Perfume & Jewelry Rigid Boxes', shortLabelAr: 'عطور ومجوهرات', shortLabelEn: 'Perfume & Jewelry', badgeAr: 'حشوة مخمل', badgeEn: 'Velvet Insert' },
    { id: 'drawer', labelAr: 'علب درجية وسحب ستان حريري', labelEn: 'Sliding Drawer Setup Boxes', shortLabelAr: 'علب درجية', shortLabelEn: 'Drawer' },
    { id: 'magnetic', labelAr: 'علب إغلاق مغناطيسي خفي', labelEn: 'Concealed Magnetic Boxes', shortLabelAr: 'علب مغناطيسية', shortLabelEn: 'Magnetic' },
    { id: 'mailer', labelAr: 'كراتين شحن بريدي مقواة للمتاجر', labelEn: 'E-Commerce Corrugated Mailers', shortLabelAr: 'كراتين شحن', shortLabelEn: 'Mailers', badgeAr: 'طباعة كاملة', badgeEn: 'Full Print' },
    { id: 'apparel', labelAr: 'علب أحذية وملابس بغطاء منفصل', labelEn: 'Shoe & Apparel Setup Boxes', shortLabelAr: 'أحذية وملابس', shortLabelEn: 'Apparel & Shoes' },
    { id: 'gable', labelAr: 'علب كرتون كرافت بمقبض يد', labelEn: 'Kraft Gable Boxes with Handle', shortLabelAr: 'علب بمقبض', shortLabelEn: 'Gable Boxes' },
    { id: 'pizza', labelAr: 'علب بيتزا ومأكولات كرتونية', labelEn: 'Custom Pizza & Food Boxes', shortLabelAr: 'علب بيتزا', shortLabelEn: 'Pizza Boxes', badgeAr: 'عازل حراري', badgeEn: 'Thermal Barrier' },
  ],
  led: [
    { id: 'all', labelAr: 'كافة أعمال الأكريليك والإضاءة', labelEn: 'All Acrylic & LED Works', shortLabelAr: 'الكل', shortLabelEn: 'All' },
    { id: 'trophy', labelAr: 'دروع تكريم وجوائز بطولية', labelEn: 'Prestige Awards & Trophies', shortLabelAr: 'دروع تكريم', shortLabelEn: 'Trophies', badgeAr: 'رسمي VIP', badgeEn: 'Corporate VIP' },
    { id: 'desk', labelAr: 'لوحات مكاتب واستقبال فخمة', labelEn: 'Executive Desk Nameplates', shortLabelAr: 'لوحات مكاتب', shortLabelEn: 'Desk Signs' },
    { id: 'optical3d', labelAr: 'مجسمات ودروع 3D بصرية', labelEn: '3D Optical Illusion Lamps', shortLabelAr: 'مجسمات 3D', shortLabelEn: '3D Illusion', badgeAr: 'إضاءة 3D', badgeEn: '3D Glow' },
    { id: 'wall', labelAr: 'شيلدات جدارية عائمة مضيئة', labelEn: 'Floating Illuminated Wall Signs', shortLabelAr: 'شيلدات جدارية', shortLabelEn: 'Wall Signs', badgeAr: 'للمعارض', badgeEn: 'Showrooms' },
  ],
  cards: [
    { id: 'all', labelAr: 'كافة كروت الأعمال الفاخرة', labelEn: 'All Luxury Cards', shortLabelAr: 'الكل', shortLabelEn: 'All' },
    { id: 'cotton', labelAr: 'كروت قطنية دوبلكس 600 - 700 غم', labelEn: '600-700gsm Duplex Cotton Cards', shortLabelAr: 'كروت قطنية', shortLabelEn: 'Cotton Cards', badgeAr: 'سمك 3 أضعاف', badgeEn: '3x Weight' },
    { id: 'foil', labelAr: 'بصمة حرارية ذهبية وفضية ناصعة', labelEn: 'Hot Foil Stamped (Gold/Silver)', shortLabelAr: 'بصمة حرارية', shortLabelEn: 'Foil Stamped', badgeAr: 'بصمة كروز', badgeEn: 'Kurz Foil' },
    { id: 'gilded', labelAr: 'حواف مذهبة 360° عاكسة كالمرآة', labelEn: '360° Hand Gilded Mirror Edges', shortLabelAr: 'حواف مذهبة', shortLabelEn: 'Gilded Edges', badgeAr: 'يدوي فاخر', badgeEn: 'Handmade' },
    { id: 'acrylic_card', labelAr: 'كروت أكريليك شفافة ومات 2 مم', labelEn: 'Crystal & Frosted Acrylic Cards', shortLabelAr: 'أكريليك شفاف', shortLabelEn: 'Acrylic Cards', badgeAr: 'مقاوم للماء', badgeEn: 'Waterproof' },
    { id: 'kraft', labelAr: 'كروت كرافت بيئية مع كبس لتربرس', labelEn: 'Heavy Eco Kraft Letterpress', shortLabelAr: 'كرافت بيئي', shortLabelEn: 'Eco Kraft' },
  ],
  occasions: [
    { id: 'all', labelAr: 'كافة هدايا المناسبات والتكريم', labelEn: 'All Keepsakes & Gifts', shortLabelAr: 'الكل', shortLabelEn: 'All' },
    { id: 'weddings', labelAr: 'لوحات توثيق زفاف وخطوبة مذهبة', labelEn: 'Mirror Gold Wedding Keepsakes', shortLabelAr: 'لوحات زفاف', shortLabelEn: 'Weddings', badgeAr: 'خط ديواني', badgeEn: 'Calligraphy' },
    { id: 'graduations', labelAr: 'هدايا ودروع تخرج للأطباء والمهندسين', labelEn: 'Graduation Milestone Trophies', shortLabelAr: 'دروع تخرج', shortLabelEn: 'Graduation' },
    { id: 'portraits', labelAr: 'لوحات بورتريه فيكتور ليزرية', labelEn: 'Vector Line Portrait Nightlights', shortLabelAr: 'بورتريه ليزري', shortLabelEn: 'Portraits', badgeAr: 'رسم يدوي', badgeEn: 'Hand Illustrated' },
  ],
};

export const AVAILABLE_MATERIALS = [
  { id: 'acrylic_cast', labelAr: 'أكريليك كاست نقي 4 - 10 ملم', labelEn: 'Cast Optical Acrylic (4-10mm)' },
  { id: 'rigid_greyboard', labelAr: 'كرتون رمادي صلب 1200 - 1800 غم', labelEn: 'Solid Greyboard (1200-1800gsm)' },
  { id: 'cotton_stock', labelAr: 'ورق قطني طبيعي إيطالي 600 - 700 غم', labelEn: 'Italian Cotton Stock (600-700gsm)' },
  { id: 'solid_beech', labelAr: 'خشب زان طبيعي أوروبي مصمت', labelEn: 'Solid European Beech Wood' },
  { id: 'mirror_acrylic', labelAr: 'أكريليك مرآة ذهبي وفضي عاكس', labelEn: 'Mirror Gold / Silver Acrylic' },
  { id: 'corrugated_mailer', labelAr: 'كرتون مضلع E-Flute متين', labelEn: 'Corrugated E-Flute Board' },
  { id: 'velvet_eva', labelAr: 'حشوات إسفنج EVA ومخمل ليزري', labelEn: 'Laser Contoured Velvet EVA Foam' },
];

export const AVAILABLE_SIZES = [
  { id: 'compact', labelAr: 'مقاسات مدمجة (كروت / علب صغيرة / 15×15 سم)', labelEn: 'Compact (Cards / Small Boxes / 15x15cm)' },
  { id: 'medium', labelAr: 'مقاسات متوسطة قياسية (20×20 / 22×16 سم)', labelEn: 'Medium Standard (20x20 / 22x16cm)' },
  { id: 'large', labelAr: 'مقاسات فخمة كبيرة (30×30 / 35×26 / 50×35 سم)', labelEn: 'Executive Large (30x30 / 35x26 / 50x35cm)' },
];

export const MOQ_OPTIONS = [
  { id: 'moq_1', labelAr: 'قطعة واحدة (طلب فردي وعينات)', labelEn: '1 Piece (Solo & Samples)', minVal: 1, maxVal: 1 },
  { id: 'moq_batch', labelAr: 'كميات محدودة (25 - 50 قطعة)', labelEn: 'Small Batch (25-50 pcs)', minVal: 2, maxVal: 50 },
  { id: 'moq_bulk', labelAr: 'كميات إنتاج وجملة (100+ قطعة)', labelEn: 'Bulk Production (100+ pcs)', minVal: 51, maxVal: 9999 },
];

export const LEAD_TIME_OPTIONS = [
  { id: 'urgent', labelAr: 'تسليم سريع (24 - 48 ساعة)', labelEn: 'Fast Turnaround (24 - 48 Hours)' },
  { id: 'standard', labelAr: 'تنفيذ قياسي (3 - 5 أيام عمل)', labelEn: 'Standard Craft (3 - 5 Days)' },
  { id: 'custom_batch', labelAr: 'إنتاج متقن (4 - 7 أيام عمل)', labelEn: 'Elaborate Batch (4 - 7 Days)' },
];

export const CRAFT_FEATURES = [
  { id: 'foil_stamping', labelAr: 'بصمة حرارية ذهبية / فضية (Hot Foil)', labelEn: 'Hot Foil Stamping' },
  { id: 'led_lighting', labelAr: 'إضاءة LED ثلاثية الأبعاد 3D', labelEn: '3D Ambient LED Illumination' },
  { id: 'laser_engraving', labelAr: 'حفر ونحت ليزري ميكروني مخصص', labelEn: 'Precision Laser Engraving' },
  { id: 'magnetic_closure', labelAr: 'إغلاق مغناطيسي خفي نيوديميوم', labelEn: 'Concealed Magnetic Closure' },
  { id: 'volume_discount', labelAr: 'يتوفر خصم كميات متدرج', labelEn: 'Tiered Volume Discount Available' },
];

interface StudioSidebarFiltersProps {
  specialtyId: SpecialtyId;
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedMaterials: string[];
  onToggleMaterial: (matId: string) => void;
  selectedSizes: string[];
  onToggleSize: (sizeId: string) => void;
  selectedMoq: string | null;
  onSelectMoq: (moqId: string | null) => void;
  selectedLeadTime: string | null;
  onSelectLeadTime: (ltId: string | null) => void;
  selectedFeatures: string[];
  onToggleFeature: (featId: string) => void;
  onResetAll: () => void;
  totalResults: number;
  activeFiltersCount: number;
  categoryCounts?: Record<string, number>;
  className?: string;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const StudioSidebarFilters: React.FC<StudioSidebarFiltersProps> = ({
  specialtyId,
  activeCategory,
  onSelectCategory,
  priceRange,
  onPriceRangeChange,
  selectedMaterials,
  onToggleMaterial,
  selectedSizes,
  onToggleSize,
  selectedMoq,
  onSelectMoq,
  selectedLeadTime,
  onSelectLeadTime,
  selectedFeatures,
  onToggleFeature,
  onResetAll,
  totalResults,
  activeFiltersCount,
  categoryCounts = {},
  className = '',
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // Collapsible accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    materials: true,
    sizes: false,
    moq: false,
    leadTime: false,
    features: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = STUDIO_CATEGORIES[specialtyId] || STUDIO_CATEGORIES.boxes;

  const content = (
    <div className="space-y-5 text-start">
      
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-800">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              {isAr ? 'التصنيفات والفلاتر المتقدمة' : 'Categories & Filters'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {isAr ? `${totalResults} نموذج متاح` : `${totalResults} items found`}
            </p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onResetAll}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-200 transition-colors cursor-pointer"
            title={isAr ? 'إعادة ضبط كافة الفلاتر' : 'Reset all filters'}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isAr ? 'مسح الكل' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* 1. STUDIO CATEGORIES & PRODUCT LISTS (تصنيفات وقوائم منتجات الاستوديو) */}
      <div className="space-y-2.5">
        <button
          onClick={() => toggleSection('categories')}
          type="button"
          className="w-full flex items-center justify-between py-1 text-xs font-black text-slate-900 hover:text-amber-900 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'قوائم وتصنيفات الاستوديو' : 'Studio Departments & Lists'}</span>
          </span>
          {openSections.categories ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.categories && (
          <div className="space-y-1.5 pt-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-start cursor-pointer border ${
                    isActive
                      ? 'bg-amber-950 text-amber-50 border-amber-900 shadow-sm'
                      : 'bg-white hover:bg-amber-50/50 text-slate-700 border-slate-200/80 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isActive ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                    <span className="truncate">{isAr ? cat.labelAr : cat.labelEn}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ms-2">
                    {cat.badgeAr && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {isAr ? cat.badgeAr : cat.badgeEn}
                      </span>
                    )}
                    {typeof count === 'number' && (
                      <span
                        className={`text-[11px] font-black px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-amber-900 text-amber-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. PRICE RANGE FILTER (نطاق السعر بالدينار العراقي) */}
      <div className="space-y-3 pt-3 border-t border-slate-200/70">
        <button
          onClick={() => toggleSection('price')}
          type="button"
          className="w-full flex items-center justify-between py-1 text-xs font-black text-slate-900 hover:text-amber-900 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'نطاق السعر (د.ع)' : 'Price Range (IQD)'}</span>
          </span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.price && (
          <div className="space-y-3 pt-1">
            {/* Quick Price Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onPriceRangeChange([0, 15000])}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center border cursor-pointer transition-colors ${
                  priceRange[0] === 0 && priceRange[1] === 15000
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isAr ? 'أقل من 15,000 د.ع' : '< 15,000 IQD'}
              </button>
              <button
                type="button"
                onClick={() => onPriceRangeChange([15000, 35000])}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center border cursor-pointer transition-colors ${
                  priceRange[0] === 15000 && priceRange[1] === 35000
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                15K - 35K د.ع
              </button>
              <button
                type="button"
                onClick={() => onPriceRangeChange([35000, 60000])}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center border cursor-pointer transition-colors ${
                  priceRange[0] === 35000 && priceRange[1] === 60000
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                35K - 60K د.ع
              </button>
              <button
                type="button"
                onClick={() => onPriceRangeChange([60000, 150000])}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center border cursor-pointer transition-colors ${
                  priceRange[0] === 60000 && priceRange[1] === 150000
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isAr ? 'أكثر من 60,000 د.ع' : '> 60,000 IQD'}
              </button>
            </div>

            {/* Slider Range */}
            <div className="space-y-1.5">
              <input
                type="range"
                min="0"
                max="100000"
                step="2000"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span>{priceRange[0].toLocaleString()} د.ع</span>
                <span className="text-amber-900 font-black">{priceRange[1].toLocaleString()} د.ع كحد أقصى</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MATERIALS & STOCKS FILTER (الخامات ومواد التصنيع) */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200/70">
        <button
          onClick={() => toggleSection('materials')}
          type="button"
          className="w-full flex items-center justify-between py-1 text-xs font-black text-slate-900 hover:text-amber-900 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'خامات ومواد التصنيع' : 'Materials & Stocks'}</span>
          </span>
          {openSections.materials ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.materials && (
          <div className="space-y-1.5 pt-1">
            {AVAILABLE_MATERIALS.map((mat) => {
              const isSelected = selectedMaterials.includes(mat.id);
              return (
                <label
                  key={mat.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                    isSelected
                      ? 'bg-amber-50 text-amber-950 border-amber-300 font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleMaterial(mat.id)}
                    className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 accent-amber-700"
                  />
                  <span className="flex-1 truncate">{isAr ? mat.labelAr : mat.labelEn}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. SIZES & DIMENSIONS FILTER (المقاسات والأبعاد) */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200/70">
        <button
          onClick={() => toggleSection('sizes')}
          type="button"
          className="w-full flex items-center justify-between py-1 text-xs font-black text-slate-900 hover:text-amber-900 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'الأبعاد ونطاق المقاسات' : 'Dimensions & Sizes'}</span>
          </span>
          {openSections.sizes ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.sizes && (
          <div className="space-y-1.5 pt-1">
            {AVAILABLE_SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size.id);
              return (
                <label
                  key={size.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                    isSelected
                      ? 'bg-amber-50 text-amber-950 border-amber-300 font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSize(size.id)}
                    className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 accent-amber-700"
                  />
                  <span className="flex-1 text-[11px]">{isAr ? size.labelAr : size.labelEn}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. MINIMUM ORDER QUANTITY (الحد الأدنى للطلب MOQ) */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200/70">
        <button
          onClick={() => toggleSection('moq')}
          type="button"
          className="w-full flex items-center justify-between py-1 text-xs font-black text-slate-900 hover:text-amber-900 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'الحد الأدنى للكمية (MOQ)' : 'Minimum Order Qty'}</span>
          </span>
          {openSections.moq ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.moq && (
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={() => onSelectMoq(null)}
              className={`w-full text-start px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                selectedMoq === null
                  ? 'bg-amber-100/70 text-amber-950 border-amber-300 font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
              }`}
            >
              {isAr ? 'كافة الكميات المتاحة' : 'All Quantities'}
            </button>
            {MOQ_OPTIONS.map((opt) => {
              const isSelected = selectedMoq === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectMoq(isSelected ? null : opt.id)}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100/70 text-amber-950 border-amber-300 font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                  }`}
                >
                  {isAr ? opt.labelAr : opt.labelEn}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. LEAD TIME & SPEED (مدة التنفيذ والتجهيز) */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200/70">
        <button
          onClick={() => toggleSection('leadTime')}
          type="button"
          className="w-full flex items-center justify-between py-1 text-xs font-black text-slate-900 hover:text-amber-900 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'مدة التنفيذ والتجهيز' : 'Lead Time & Delivery'}</span>
          </span>
          {openSections.leadTime ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.leadTime && (
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={() => onSelectLeadTime(null)}
              className={`w-full text-start px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                selectedLeadTime === null
                  ? 'bg-amber-100/70 text-amber-950 border-amber-300 font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
              }`}
            >
              {isAr ? 'كافة مدد التنفيذ' : 'Any Lead Time'}
            </button>
            {LEAD_TIME_OPTIONS.map((lt) => {
              const isSelected = selectedLeadTime === lt.id;
              return (
                <button
                  key={lt.id}
                  type="button"
                  onClick={() => onSelectLeadTime(isSelected ? null : lt.id)}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100/70 text-amber-950 border-amber-300 font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                  }`}
                >
                  {isAr ? lt.labelAr : lt.labelEn}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. CRAFTSMANSHIP & CUSTOMIZATION FEATURES (ميزات الحرفية والتخصيص) */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200/70">
        <button
          onClick={() => toggleSection('features')}
          type="button"
          className="w-full flex items-center justify-between py-1 text-xs font-black text-slate-900 hover:text-amber-900 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'ميزات وتقنيات الحرفية' : 'Craft Features & Finishes'}</span>
          </span>
          {openSections.features ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.features && (
          <div className="space-y-1.5 pt-1">
            {CRAFT_FEATURES.map((feat) => {
              const isSelected = selectedFeatures.includes(feat.id);
              return (
                <label
                  key={feat.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                    isSelected
                      ? 'bg-amber-50 text-amber-950 border-amber-300 font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleFeature(feat.id)}
                    className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500 accent-amber-700"
                  />
                  <span className="flex-1 text-[11px]">{isAr ? feat.labelAr : feat.labelEn}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Workshop Seal (Authority Note, STRICTLY NO SUPPLIERS) */}
      <div className="pt-3 border-t border-amber-200/50">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 space-y-1 text-center">
          <p className="text-[11px] font-black text-amber-950">
            {isAr ? 'تصنيع محلي في ورشة نون والقلم' : 'Handcrafted in Baghdad Atelier'}
          </p>
          <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
            {isAr
              ? 'كافة الموديلات يتم قصها، حفرها وتغليفها بأيدي مهندسينا وحرفيينا في بغداد بدون وسيط.'
              : 'Direct from our specialized craftsman workshop with zero intermediaries.'}
          </p>
        </div>
      </div>

    </div>
  );

  // If Mobile Drawer
  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobileDrawer}
        />

        {/* Drawer Body */}
        <div className="relative ms-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-800" />
              <span className="font-black text-sm text-slate-900">
                {isAr ? 'فلاتر وتصنيفات الاستوديو' : 'Filters & Categories'}
              </span>
            </div>
            <button
              onClick={onCloseMobileDrawer}
              type="button"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {content}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-2">
            <button
              onClick={onResetAll}
              type="button"
              className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer text-center"
            >
              {isAr ? 'مسح الفلاتر' : 'Reset'}
            </button>
            <button
              onClick={onCloseMobileDrawer}
              type="button"
              className="py-2 px-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer text-center shadow-xs"
            >
              {isAr ? `عرض النتائج (${totalResults})` : `Show Results (${totalResults})`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Static Sidebar
  return (
    <aside className={`w-72 xl:w-80 shrink-0 ${className}`}>
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs sticky top-32">
        {content}
      </div>
    </aside>
  );
};
