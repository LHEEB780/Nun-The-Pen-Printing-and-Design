import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Sparkles,
  CreditCard,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  Ruler,
  ShieldCheck,
  Clock,
  Eye,
  Tag,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  Check,
  Zap,
  ShoppingBag,
  ChevronDown,
} from 'lucide-react';
import { SpecialtyId, SPECIALTY_GATEWAYS } from '../home/SpecialtyGatewaysSection';
import { useAdminStore, getUnifiedProducts } from '../../store/useAdminStore';
import { PRODUCTS, ProductItem } from '../../data/mockData';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { toast } from 'sonner';
import {
  StudioSidebarFilters,
  STUDIO_CATEGORIES,
  AVAILABLE_MATERIALS,
  AVAILABLE_SIZES,
  MOQ_OPTIONS,
  LEAD_TIME_OPTIONS,
  CRAFT_FEATURES,
} from './StudioSidebarFilters';

interface SpecialtyHubPageProps {
  specialtyId: SpecialtyId;
  onSelectSpecialty: (specialtyId: SpecialtyId) => void;
  onBackToHome: () => void;
  onSelectProduct: (productId: string) => void;
  onOpenCustomizerModal: (productId?: string) => void;
}

type SortOption = 'featured' | 'bestseller' | 'price_asc' | 'price_desc' | 'fastest';
type ViewMode = 'grid' | 'list';

export const SpecialtyHubPage: React.FC<SpecialtyHubPageProps> = ({
  specialtyId,
  onSelectSpecialty,
  onBackToHome,
  onSelectProduct,
  onOpenCustomizerModal,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { formatPrice } = useCurrencyStore();

  // Filters State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMoq, setSelectedMoq] = useState<string | null>(null);
  const [selectedLeadTime, setSelectedLeadTime] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // View & Sort State
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Products from Admin Store or MockData with unified catalog
  const adminProducts = useAdminStore((state) => state.adminProducts);
  const productsList = useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  const { addItem, setIsOpen: setCartOpen } = useCartStore();

  // Current gateway data
  const currentGateway =
    SPECIALTY_GATEWAYS.find((g) => g.id === specialtyId) || SPECIALTY_GATEWAYS[0];
  const Icon = currentGateway.icon;

  // Toggle Handlers
  const toggleMaterial = (matId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(matId) ? prev.filter((m) => m !== matId) : [...prev, matId]
    );
  };

  const toggleSize = (sizeId: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeId) ? prev.filter((s) => s !== sizeId) : [...prev, sizeId]
    );
  };

  const toggleFeature = (featId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featId) ? prev.filter((f) => f !== featId) : [...prev, featId]
    );
  };

  const resetAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPriceRange([0, 100000]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setSelectedMoq(null);
    setSelectedLeadTime(null);
    setSelectedFeatures([]);
  };

  // Base products belonging to this studio
  const baseStudioProducts = useMemo(() => {
    return productsList.filter((prod) => {
      if (specialtyId === 'boxes') return prod.category === 'boxes';
      if (specialtyId === 'led') return prod.category === 'led';
      if (specialtyId === 'cards') return prod.category === 'cards';
      if (specialtyId === 'occasions') {
        return prod.category === 'portraits' || prod.category === 'weddings';
      }
      return false;
    });
  }, [productsList, specialtyId]);

  // Compute category item counts within this studio
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: baseStudioProducts.length };
    const categories = STUDIO_CATEGORIES[specialtyId] || [];

    categories.forEach((cat) => {
      if (cat.id === 'all') return;
      const count = baseStudioProducts.filter((prod) => {
        const text = `${prod.titleAr} ${prod.titleEn} ${prod.descriptionAr} ${prod.descriptionEn} ${prod.slug}`.toLowerCase();
        if (cat.id === 'rigid') return text.includes('صلب') || text.includes('rigid');
        if (cat.id === 'perfume') return text.includes('عطر') || text.includes('مجوهر') || text.includes('perfume');
        if (cat.id === 'drawer') return text.includes('درج') || text.includes('drawer');
        if (cat.id === 'magnetic') return text.includes('مغناطيس') || text.includes('magnetic');
        if (cat.id === 'mailer') return text.includes('شحن') || text.includes('mailer') || text.includes('مضلع');
        if (cat.id === 'apparel') return text.includes('أحذية') || text.includes('ملابس') || text.includes('shoe') || text.includes('apparel');
        if (cat.id === 'gable') return text.includes('مقبض') || text.includes('gable') || text.includes('حلويات');
        if (cat.id === 'pizza') return text.includes('بيتزا') || text.includes('pizza') || text.includes('مأكولات');
        if (cat.id === 'trophy') return text.includes('درع') || text.includes('تكريم') || text.includes('trophy') || text.includes('جائز');
        if (cat.id === 'desk') return text.includes('مكتب') || text.includes('desk') || text.includes('استقبال');
        if (cat.id === 'optical3d') return text.includes('3d') || text.includes('مجسم') || text.includes('مضيء');
        if (cat.id === 'wall') return text.includes('جدار') || text.includes('wall') || text.includes('شيلد');
        if (cat.id === 'cotton') return text.includes('قطن') || text.includes('cotton') || text.includes('دوبلكس');
        if (cat.id === 'foil') return text.includes('بصم') || text.includes('foil');
        if (cat.id === 'gilded') return text.includes('مذهب') || text.includes('gilded') || text.includes('حواف');
        if (cat.id === 'acrylic_card') return text.includes('أكريليك') && (text.includes('شفاف') || text.includes('acrylic'));
        if (cat.id === 'kraft') return text.includes('كرافت') || text.includes('kraft');
        if (cat.id === 'weddings') return prod.category === 'weddings' || text.includes('زواج') || text.includes('wedding');
        if (cat.id === 'graduations') return text.includes('تخرج') || text.includes('graduation');
        if (cat.id === 'portraits') return prod.category === 'portraits' || text.includes('بورتريه') || text.includes('portrait');
        return true;
      }).length;
      counts[cat.id] = count;
    });

    return counts;
  }, [baseStudioProducts, specialtyId]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return baseStudioProducts
      .filter((prod) => {
        const fullText = `${prod.titleAr} ${prod.titleEn} ${prod.descriptionAr} ${prod.descriptionEn} ${prod.slug}`.toLowerCase();

        // 1. Category / Sub-list Filter
        if (activeCategory !== 'all') {
          if (activeCategory === 'rigid' && !fullText.includes('صلب') && !fullText.includes('rigid')) return false;
          if (activeCategory === 'perfume' && !fullText.includes('عطر') && !fullText.includes('مجوهر') && !fullText.includes('perfume')) return false;
          if (activeCategory === 'drawer' && !fullText.includes('درج') && !fullText.includes('drawer')) return false;
          if (activeCategory === 'magnetic' && !fullText.includes('مغناطيس') && !fullText.includes('magnetic')) return false;
          if (activeCategory === 'mailer' && !fullText.includes('شحن') && !fullText.includes('mailer') && !fullText.includes('مضلع')) return false;
          if (activeCategory === 'apparel' && !fullText.includes('أحذية') && !fullText.includes('ملابس') && !fullText.includes('shoe') && !fullText.includes('apparel')) return false;
          if (activeCategory === 'gable' && !fullText.includes('مقبض') && !fullText.includes('gable') && !fullText.includes('حلويات')) return false;
          if (activeCategory === 'pizza' && !fullText.includes('بيتزا') && !fullText.includes('pizza')) return false;
          if (activeCategory === 'trophy' && !fullText.includes('درع') && !fullText.includes('تكريم') && !fullText.includes('trophy')) return false;
          if (activeCategory === 'desk' && !fullText.includes('مكتب') && !fullText.includes('desk') && !fullText.includes('استقبال')) return false;
          if (activeCategory === 'optical3d' && !fullText.includes('3d') && !fullText.includes('مضيء') && !fullText.includes('مجسم')) return false;
          if (activeCategory === 'wall' && !fullText.includes('جدار') && !fullText.includes('wall') && !fullText.includes('شيلد')) return false;
          if (activeCategory === 'cotton' && !fullText.includes('قطن') && !fullText.includes('cotton') && !fullText.includes('دوبلكس')) return false;
          if (activeCategory === 'foil' && !fullText.includes('بصم') && !fullText.includes('foil')) return false;
          if (activeCategory === 'gilded' && !fullText.includes('مذهب') && !fullText.includes('gilded') && !fullText.includes('حواف')) return false;
          if (activeCategory === 'acrylic_card' && !fullText.includes('أكريليك') && !fullText.includes('acrylic')) return false;
          if (activeCategory === 'kraft' && !fullText.includes('كرافت') && !fullText.includes('kraft')) return false;
          if (activeCategory === 'weddings' && prod.category !== 'weddings' && !fullText.includes('زواج')) return false;
          if (activeCategory === 'graduations' && !fullText.includes('تخرج') && !fullText.includes('graduation')) return false;
          if (activeCategory === 'portraits' && prod.category !== 'portraits' && !fullText.includes('بورتريه')) return false;
        }

        // 2. Price Range Filter
        if (prod.basePrice < priceRange[0] || prod.basePrice > priceRange[1]) {
          return false;
        }

        // 3. Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            prod.titleAr.toLowerCase().includes(q) ||
            prod.titleEn.toLowerCase().includes(q) ||
            prod.descriptionAr.toLowerCase().includes(q) ||
            prod.descriptionEn.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // 4. Materials Filter
        if (selectedMaterials.length > 0) {
          const specsText = (prod.specifications || [])
            .map((s) => `${s.keyAr} ${s.keyEn} ${s.valAr} ${s.valEn}`)
            .join(' ')
            .toLowerCase();
          const matsText = (prod.materials || [])
            .map((m) => `${m.labelAr} ${m.labelEn}`)
            .join(' ')
            .toLowerCase();
          const combinedMatText = `${specsText} ${matsText} ${fullText}`;

          const matchesMaterial = selectedMaterials.some((matId) => {
            if (matId === 'acrylic_cast') return combinedMatText.includes('أكريليك') || combinedMatText.includes('acrylic');
            if (matId === 'rigid_greyboard') return combinedMatText.includes('صلب') || combinedMatText.includes('رمادي') || combinedMatText.includes('greyboard');
            if (matId === 'cotton_stock') return combinedMatText.includes('قطن') || combinedMatText.includes('cotton');
            if (matId === 'solid_beech') return combinedMatText.includes('زان') || combinedMatText.includes('beech') || combinedMatText.includes('خشب');
            if (matId === 'mirror_acrylic') return combinedMatText.includes('مرآة') || combinedMatText.includes('mirror');
            if (matId === 'corrugated_mailer') return combinedMatText.includes('مضلع') || combinedMatText.includes('corrugated') || combinedMatText.includes('flute');
            if (matId === 'velvet_eva') return combinedMatText.includes('مخمل') || combinedMatText.includes('eva') || combinedMatText.includes('إسفنج');
            return true;
          });
          if (!matchesMaterial) return false;
        }

        // 5. Sizes Filter
        if (selectedSizes.length > 0) {
          const dimText = (prod.dimensions || [])
            .map((d) => `${d.labelAr} ${d.labelEn}`)
            .join(' ')
            .toLowerCase();
          const matchesSize = selectedSizes.some((sizeId) => {
            if (sizeId === 'compact') return dimText.includes('9 × 5') || dimText.includes('15 × 15') || dimText.includes('14 × 10') || dimText.includes('12 × 12') || dimText.includes('صغير');
            if (sizeId === 'medium') return dimText.includes('20 × 20') || dimText.includes('22 × 16') || dimText.includes('24 × 16') || dimText.includes('28 × 20') || dimText.includes('متوسط');
            if (sizeId === 'large') return dimText.includes('30 × 30') || dimText.includes('35 × 26') || dimText.includes('50 × 35') || dimText.includes('40 × 30') || dimText.includes('كبير');
            return true;
          });
          if (!matchesSize) return false;
        }

        // 6. MOQ Filter
        if (selectedMoq) {
          const option = MOQ_OPTIONS.find((o) => o.id === selectedMoq);
          if (option) {
            const minQ = prod.minQuantity || 1;
            if (minQ < option.minVal || minQ > option.maxVal) return false;
          }
        }

        // 7. Lead Time Filter
        if (selectedLeadTime) {
          const ltText = `${prod.leadTimeAr} ${prod.leadTimeEn}`.toLowerCase();
          if (selectedLeadTime === 'urgent' && !ltText.includes('24') && !ltText.includes('48')) return false;
          if (selectedLeadTime === 'standard' && !ltText.includes('3') && !ltText.includes('5')) return false;
          if (selectedLeadTime === 'custom_batch' && !ltText.includes('4') && !ltText.includes('7') && !ltText.includes('6')) return false;
        }

        // 8. Features Filter
        if (selectedFeatures.length > 0) {
          const featsText = [
            ...(prod.featuresAr || []),
            ...(prod.featuresEn || []),
            fullText,
          ].join(' ').toLowerCase();

          const matchesAllFeatures = selectedFeatures.every((featId) => {
            if (featId === 'foil_stamping') return featsText.includes('بصم') || featsText.includes('foil') || Boolean(prod.foilFinishes?.length);
            if (featId === 'led_lighting') return featsText.includes('led') || featsText.includes('إضاء') || Boolean(prod.ledOptions?.length);
            if (featId === 'laser_engraving') return featsText.includes('ليزر') || featsText.includes('حفر') || featsText.includes('laser');
            if (featId === 'magnetic_closure') return featsText.includes('مغناطيس') || featsText.includes('magnetic');
            if (featId === 'volume_discount') return Boolean(prod.tierPricing && prod.tierPricing.length > 1);
            return true;
          });
          if (!matchesAllFeatures) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price_desc') return b.basePrice - a.basePrice;
        if (sortBy === 'fastest') {
          const aFast = a.leadTimeAr.includes('24') || a.leadTimeAr.includes('48') ? 1 : 2;
          const bFast = b.leadTimeAr.includes('24') || b.leadTimeAr.includes('48') ? 1 : 2;
          return aFast - bFast;
        }
        if (sortBy === 'bestseller') {
          return (b.minQuantity || 1) - (a.minQuantity || 1);
        }
        return 0; // featured default
      });
  }, [
    baseStudioProducts,
    activeCategory,
    priceRange,
    searchQuery,
    selectedMaterials,
    selectedSizes,
    selectedMoq,
    selectedLeadTime,
    selectedFeatures,
    sortBy,
  ]);

  // Active Filters Count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'all') count++;
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
    if (searchQuery.trim()) count++;
    count += selectedMaterials.length;
    count += selectedSizes.length;
    if (selectedMoq) count++;
    if (selectedLeadTime) count++;
    count += selectedFeatures.length;
    return count;
  }, [
    activeCategory,
    priceRange,
    searchQuery,
    selectedMaterials,
    selectedSizes,
    selectedMoq,
    selectedLeadTime,
    selectedFeatures,
  ]);

  // Quick Add to Cart
  const handleQuickAdd = (prod: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const qty = prod.minQuantity || 1;
    const dim = prod.dimensions?.[0] || { labelAr: 'قياسي', labelEn: 'Standard' };
    const mat = prod.materials?.[0] || { labelAr: 'قياسي فاخر', labelEn: 'Standard' };
    // Apply quantity-tier discount natively in IQD so quick-add matches product-page pricing
    const tierDiscount =
      [...(prod.tierPricing || [])].reverse().find((tier) => qty >= tier.minQty)?.discountPercent || 0;
    const quickUnitPrice = Math.round(prod.basePrice * (1 - tierDiscount / 100));
    addItem({
      productId: prod.id,
      titleAr: prod.titleAr,
      titleEn: prod.titleEn,
      image: prod.image,
      category: prod.category,
      quantity: qty,
      unitPrice: quickUnitPrice,
      totalPrice: quickUnitPrice * qty,
      customOptions: {
        dimensionLabelAr: dim.labelAr,
        dimensionLabelEn: dim.labelEn,
        materialLabelAr: mat.labelAr,
        materialLabelEn: mat.labelEn,
        discountPercentage: tierDiscount,
      },
    });
    setCartOpen(true);
    toast.success(
      isAr
        ? `تمت إضافة "${prod.titleAr}" إلى سلة الطلبات`
        : `Added "${prod.titleEn}" to cart`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      
      {/* 1. Top Studio Navigation & Breadcrumbs Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Back Button to Master Overview */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onBackToHome}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 text-xs font-bold transition-colors cursor-pointer border border-slate-200 shrink-0"
              >
                {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{isAr ? 'العودة للاستوديوهات الرئيسية' : 'All Studios'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>/</span>
                <span className="font-bold text-slate-800">{isAr ? currentGateway.titleAr : currentGateway.titleEn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cinematic Studio Hero Showcase Banner */}
      <div className="bg-gradient-to-b from-white via-amber-50/20 to-slate-100/90 border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Start Column: Studio Presentation */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold">
                <Icon className="w-3.5 h-3.5 text-amber-800" />
                <span>{isAr ? currentGateway.titleAr : currentGateway.titleEn}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {isAr ? currentGateway.headlineAr : currentGateway.headlineEn}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {isAr ? currentGateway.taglineAr : currentGateway.taglineEn}
              </p>

              {/* Craftsmanship Highlights */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {(isAr ? currentGateway.craftSpecsAr : currentGateway.craftSpecsEn).map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{spec}</span>
                  </div>
                ))}
              </div>

              {/* Baghdad Workshop Guarantee (STRICTLY NO SUPPLIERS) */}
              <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-bold border-t border-slate-200/80">
                <span className="flex items-center gap-1.5 text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'تصنيع ورشة نون والقلم - بغداد' : 'Handcrafted in Baghdad Workshop'}</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'تنفيذ 24 ساعة إلى 5 أيام' : 'Fast 24h - 5d Turnaround'}</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-purple-900">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <span>{isAr ? currentGateway.startingPriceAr : currentGateway.startingPriceEn}</span>
                </span>
              </div>
            </div>

            {/* Right/End Column: Live Workshop Media Photo Card */}
            <div className="lg:col-span-5">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-2 border-white ring-1 ring-slate-200 bg-slate-950">
                <img
                  src={currentGateway.image}
                  alt={isAr ? currentGateway.titleAr : currentGateway.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white text-xs font-bold">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                    {isAr ? 'تصوير حي من ورشتنا 📸' : 'Workshop Live Capture'}
                  </span>
                  <button
                    onClick={() => onOpenCustomizerModal(baseStudioProducts[0]?.id || 'prod-pizza-box')}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-colors cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'طلب نموذج مخصص' : 'Custom Request'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Main Studio Workspace: Side Filters + Product Catalog Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Left/Right Sidebar: Studio Categories & Multifaceted Filters */}
          <StudioSidebarFilters
            specialtyId={specialtyId}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedMaterials={selectedMaterials}
            onToggleMaterial={toggleMaterial}
            selectedSizes={selectedSizes}
            onToggleSize={toggleSize}
            selectedMoq={selectedMoq}
            onSelectMoq={setSelectedMoq}
            selectedLeadTime={selectedLeadTime}
            onSelectLeadTime={setSelectedLeadTime}
            selectedFeatures={selectedFeatures}
            onToggleFeature={toggleFeature}
            onResetAll={resetAllFilters}
            totalResults={filteredProducts.length}
            activeFiltersCount={activeFiltersCount}
            categoryCounts={categoryCounts}
            className="hidden lg:block"
          />

          {/* Main Products Display Column */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Top Filter Control Bar: Unified Compact Pill Design */}
            <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
              
              {/* Controls Row: Filters and Sort aligned side by side, View mode toggle on the opposite end */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                
                {/* Left/Start: Filters Button & Sort Selector side-by-side */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Filters Trigger Button - Same compact pill size as category buttons */}
                  <button
                    onClick={() => setIsMobileDrawerOpen(true)}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 text-[11px] font-bold border border-amber-200 transition-colors cursor-pointer shrink-0"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
                    <span>{isAr ? 'الفلاتر' : 'Filters'}</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-amber-900 text-white text-[9px] font-black flex items-center justify-center leading-none">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Sort Selector Pill - Aligned directly beside Filters */}
                  <div className="relative inline-flex items-center shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="h-7 ps-2.5 pe-6 rounded-full border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500/30 cursor-pointer appearance-none transition-colors"
                    >
                      <option value="featured">{isAr ? 'الترتيب: المقترح' : 'Sort: Featured'}</option>
                      <option value="bestseller">{isAr ? 'الأكثر طلباً' : 'Best Selling'}</option>
                      <option value="price_asc">{isAr ? 'السعر: الأقل' : 'Price: Low'}</option>
                      <option value="price_desc">{isAr ? 'السعر: الأعلى' : 'Price: High'}</option>
                      <option value="fastest">{isAr ? 'أسرع تسليم' : 'Fast Delivery'}</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute end-2 pointer-events-none" />
                  </div>
                </div>

                {/* Right/End: View Mode Toggle (Grid vs List) */}
                <div className="inline-flex items-center gap-0.5 p-0.5 rounded-full bg-slate-100 border border-slate-200 shrink-0 ms-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title={isAr ? 'عرض شبكي' : 'Grid View'}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title={isAr ? 'عرض قائمة مفصلة' : 'List View'}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Quick Horizontal Categories Carousel (Matching Compact Pill Bar) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 border-t border-slate-100 pt-2.5">
                {(STUDIO_CATEGORIES[specialtyId] || []).map((cat) => {
                  const isCatActive = activeCategory === cat.id;
                  const count = categoryCounts[cat.id] ?? 0;
                  const displayLabel = isAr
                    ? (cat.shortLabelAr || cat.labelAr)
                    : (cat.shortLabelEn || cat.labelEn);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      type="button"
                      className={`inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                        isCatActive
                          ? 'bg-amber-950 text-amber-100 border-amber-900 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{displayLabel}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-black min-w-4 text-center leading-none ${
                          isCatActive ? 'bg-amber-800 text-amber-200' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Filters Chips Bar */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-bold text-[11px] me-1">
                    {isAr ? 'الفلاتر النشطة:' : 'Active Filters:'}
                  </span>

                  {/* Active Category Chip */}
                  {activeCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold text-[11px] border border-amber-300">
                      <span>
                        {isAr
                          ? (STUDIO_CATEGORIES[specialtyId]?.find((c) => c.id === activeCategory)?.shortLabelAr || STUDIO_CATEGORIES[specialtyId]?.find((c) => c.id === activeCategory)?.labelAr)
                          : (STUDIO_CATEGORIES[specialtyId]?.find((c) => c.id === activeCategory)?.shortLabelEn || STUDIO_CATEGORIES[specialtyId]?.find((c) => c.id === activeCategory)?.labelEn)}
                      </span>
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="hover:text-amber-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Price Range Chip */}
                  {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold text-[11px] border border-amber-300">
                      <span>
                        {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} د.ع
                      </span>
                      <button
                        onClick={() => setPriceRange([0, 100000])}
                        className="hover:text-amber-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Selected Materials Chips */}
                  {selectedMaterials.map((matId) => {
                    const matObj = AVAILABLE_MATERIALS.find((m) => m.id === matId);
                    return (
                      <span
                        key={matId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200"
                      >
                        <span>{isAr ? matObj?.labelAr : matObj?.labelEn}</span>
                        <button
                          onClick={() => toggleMaterial(matId)}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Selected Sizes Chips */}
                  {selectedSizes.map((sizeId) => {
                    const sizeObj = AVAILABLE_SIZES.find((s) => s.id === sizeId);
                    return (
                      <span
                        key={sizeId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200"
                      >
                        <span>{isAr ? sizeObj?.labelAr : sizeObj?.labelEn}</span>
                        <button
                          onClick={() => toggleSize(sizeId)}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  {/* MOQ Chip */}
                  {selectedMoq && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-bold text-[11px] border border-purple-200">
                      <span>
                        {isAr
                          ? MOQ_OPTIONS.find((m) => m.id === selectedMoq)?.labelAr
                          : MOQ_OPTIONS.find((m) => m.id === selectedMoq)?.labelEn}
                      </span>
                      <button
                        onClick={() => setSelectedMoq(null)}
                        className="hover:text-purple-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Lead Time Chip */}
                  {selectedLeadTime && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-bold text-[11px] border border-emerald-200">
                      <span>
                        {isAr
                          ? LEAD_TIME_OPTIONS.find((l) => l.id === selectedLeadTime)?.labelAr
                          : LEAD_TIME_OPTIONS.find((l) => l.id === selectedLeadTime)?.labelEn}
                      </span>
                      <button
                        onClick={() => setSelectedLeadTime(null)}
                        className="hover:text-emerald-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Features Chips */}
                  {selectedFeatures.map((featId) => {
                    const featObj = CRAFT_FEATURES.find((f) => f.id === featId);
                    return (
                      <span
                        key={featId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-bold text-[11px] border border-amber-200"
                      >
                        <span>{isAr ? featObj?.labelAr : featObj?.labelEn}</span>
                        <button
                          onClick={() => toggleFeature(featId)}
                          className="hover:text-amber-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Reset Button */}
                  <button
                    onClick={resetAllFilters}
                    className="ms-auto text-amber-900 hover:text-amber-800 font-black text-[11px] hover:underline cursor-pointer"
                  >
                    {isAr ? 'مسح الفلاتر' : 'Clear all'}
                  </button>
                </div>
              )}

            </div>

            {/* Products Display Area */}
            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                /* GRID VIEW (Compact 2-Column Mobile & Responsive Proportions Matching Reference Screenshot) */
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct(prod.id)}
                      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
                    >
                      {/* Square Product Image (1:1 Ratio as in Reference Image) */}
                      <div className="relative aspect-square bg-slate-900 overflow-hidden">
                        <img
                          src={prod.image}
                          alt={isAr ? prod.titleAr : prod.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Top Discrete Badges */}
                        <div className="absolute top-1.5 sm:top-2 start-1.5 sm:start-2 flex flex-col gap-1 items-start">
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold">
                            {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                          </span>
                          {prod.tierPricing && prod.tierPricing.length > 1 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-purple-900/90 text-purple-200 text-[8px] sm:text-[9px] font-black">
                              {isAr ? 'خصم كميات' : 'Bulk'}
                            </span>
                          )}
                        </div>

                        {/* Bottom Discrete Workshop Badge */}
                        <div className="absolute bottom-1.5 sm:bottom-2 start-1.5 sm:start-2">
                          <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-amber-200 text-[8px] sm:text-[9px] font-semibold">
                            {isAr ? 'تصميم مخصص' : 'Custom'}
                          </span>
                        </div>
                      </div>

                      {/* Card Body: Compact typography & proportions */}
                      <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
                        <div>
                          {/* Title - 2 lines max */}
                          <h3 className="font-bold text-[11px] sm:text-xs text-slate-900 group-hover:text-amber-900 transition-colors line-clamp-2 leading-tight h-7 sm:h-8">
                            {isAr ? prod.titleAr : prod.titleEn}
                          </h3>

                          {/* Price & MOQ Section */}
                          <div className="mt-1">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs sm:text-sm md:text-base font-black text-amber-950 font-mono">
                                {formatPrice(prod.basePrice, { isAr })}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-slate-400">
                                {isAr ? '/ قطعة' : '/ pc'}
                              </span>
                            </div>

                            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 flex items-center justify-between">
                              <span>
                                {isAr ? `الحد الأدنى: ${prod.minQuantity} قطعة` : `Min: ${prod.minQuantity} pcs`}
                              </span>
                              {prod.leadTimeAr && (
                                <span className="text-[8px] sm:text-[9px] text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded font-bold hidden xs:inline">
                                  {isAr ? 'تنفيذ سريع' : 'Fast'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Compact Action Bar */}
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProduct(prod.id);
                            }}
                            className="flex-1 py-1 px-1.5 sm:py-1.5 sm:px-2 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-100 text-[10px] sm:text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <span>{isAr ? 'عرض وتخصيص' : 'View & Customize'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(prod, e)}
                            title={isAr ? 'طلب سريع' : 'Order'}
                            className="p-1 sm:p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-700 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* DETAILED LIST VIEW (قائمة منتجات أفقية مفصلة) */
                <div className="space-y-4">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct(prod.id)}
                      className="group bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-lg transition-all p-4 sm:p-5 cursor-pointer flex flex-col md:flex-row gap-5 items-center"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative w-full md:w-52 h-44 rounded-2xl bg-slate-900 overflow-hidden shrink-0">
                        <img
                          src={prod.image}
                          alt={isAr ? prod.titleAr : prod.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold">
                          {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                        </div>
                      </div>

                      {/* Middle Details */}
                      <div className="flex-1 space-y-2.5 text-start w-full">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-black text-base text-slate-900 group-hover:text-amber-900 transition-colors">
                            {isAr ? prod.titleAr : prod.titleEn}
                          </h3>
                          <div className="text-base font-black text-amber-950 bg-amber-100/70 px-3 py-1 rounded-xl font-mono">
                            {formatPrice(prod.basePrice, { isAr })}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {isAr ? prod.descriptionAr : prod.descriptionEn}
                        </p>

                        {/* Specs Pills */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                            {isAr ? 'الحد الأدنى:' : 'MOQ:'} <strong className="text-slate-900">{prod.minQuantity} قطعة</strong>
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold">
                            {isAr ? 'مدة التجهيز:' : 'Lead Time:'} <strong>{isAr ? prod.leadTimeAr : prod.leadTimeEn}</strong>
                          </span>
                          {prod.tierPricing && prod.tierPricing.length > 1 && (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold">
                              {isAr ? `خصم كميات حتى ${prod.tierPricing[prod.tierPricing.length - 1].discountPercent}%` : `Up to ${prod.tierPricing[prod.tierPricing.length - 1].discountPercent}% Bulk Off`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2 w-full md:w-36 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-s border-slate-100 md:ps-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(prod.id);
                          }}
                          className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isAr ? 'عرض التفاصيل' : 'View Details'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(prod, e)}
                          className="flex-1 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-50 text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isAr ? 'طلب سريع' : 'Order'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* EMPTY STATE */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-2xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mx-auto">
                  <Icon className="w-8 h-8 text-amber-800" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {isAr ? 'لا توجد منتجات مطابقة للفلاتر المحددة' : 'No products matched these criteria'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'جرب توسيع نطاق السعر أو إزالة بعض الخامات والمقاسات المحددة، أو يمكنك طلب نموذج تصنيع مخصص مباشرة من ورشة نون والقلم.'
                    : 'Try broadening your price range or removing selected materials to see more available production models.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetAllFilters}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إعادة ضبط كافة الفلاتر' : 'Reset All Filters'}</span>
                  </button>
                  <button
                    onClick={() => onOpenCustomizerModal(baseStudioProducts[0]?.id || 'prod-pizza-box')}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isAr ? 'طلب نموذج مخصص 🎨' : 'Request Custom Order'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* 4. Mobile Filters Drawer Sheet */}
      {isMobileDrawerOpen && (
        <StudioSidebarFilters
          specialtyId={specialtyId}
          activeCategory={activeCategory}
          onSelectCategory={(catId) => {
            setActiveCategory(catId);
            setIsMobileDrawerOpen(false);
          }}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          selectedMaterials={selectedMaterials}
          onToggleMaterial={toggleMaterial}
          selectedSizes={selectedSizes}
          onToggleSize={toggleSize}
          selectedMoq={selectedMoq}
          onSelectMoq={setSelectedMoq}
          selectedLeadTime={selectedLeadTime}
          onSelectLeadTime={setSelectedLeadTime}
          selectedFeatures={selectedFeatures}
          onToggleFeature={toggleFeature}
          onResetAll={resetAllFilters}
          totalResults={filteredProducts.length}
          activeFiltersCount={activeFiltersCount}
          categoryCounts={categoryCounts}
          isMobileDrawer={true}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />
      )}

    </div>
  );
};
