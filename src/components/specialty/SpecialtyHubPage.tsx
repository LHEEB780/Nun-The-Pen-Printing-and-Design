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
  MessageCircle,
  Eye,
  Tag,
  Search,
} from 'lucide-react';
import { SpecialtyId, SPECIALTY_GATEWAYS } from '../home/SpecialtyGatewaysSection';
import { useAdminStore } from '../../store/useAdminStore';
import { PRODUCTS, ProductItem } from '../../data/mockData';
import { useCartStore } from '../../store/useCartStore';
import { toast } from 'sonner';

interface SpecialtyHubPageProps {
  specialtyId: SpecialtyId;
  onSelectSpecialty: (specialtyId: SpecialtyId) => void;
  onBackToHome: () => void;
  onSelectProduct: (productId: string) => void;
  onOpenCustomizerModal: (productId?: string) => void;
}

// Specialized sub-filters for each studio
const SPECIALTY_SUBFILTERS: Record<SpecialtyId, Array<{ id: string; labelAr: string; labelEn: string }>> = {
  boxes: [
    { id: 'all', labelAr: 'كافة نماذج العلب والتغليف', labelEn: 'All Packaging Models' },
    { id: 'rigid', labelAr: 'علب صلبة فاخرة (Rigid)', labelEn: 'Rigid Setup Boxes' },
    { id: 'perfume', labelAr: 'علب عطور ومجوهرات', labelEn: 'Perfume & Jewelry' },
    { id: 'drawer', labelAr: 'علب درجية ومغناطيس', labelEn: 'Magnetic & Drawer' },
    { id: 'mailer', labelAr: 'علب شحن مقواة', labelEn: 'Mailer & Shipping' },
  ],
  led: [
    { id: 'all', labelAr: 'كافة أعمال الأكريليك والإضاءة', labelEn: 'All Acrylic & LED' },
    { id: 'trophy', labelAr: 'دروع تكريم وجوائز', labelEn: 'Awards & Trophies' },
    { id: 'desk', labelAr: 'لوحات مكاتب واستقبال', labelEn: 'Desk & Reception' },
    { id: 'optical3d', labelAr: 'مجسمات 3D بصرية', labelEn: '3D Optical Lamps' },
    { id: 'wall', labelAr: 'شيلدات جدارية مضيئة', labelEn: 'Illuminated Wall Signs' },
  ],
  cards: [
    { id: 'all', labelAr: 'كافة كروت الأعمال الفاخرة', labelEn: 'All Luxury Cards' },
    { id: 'cotton', labelAr: 'كروت قطنية دوبلكس 600 غم', labelEn: '600gsm Cotton Cards' },
    { id: 'foil', labelAr: 'بصمة حرارية ذهبية وفضية', labelEn: 'Hot Foil Stamped' },
    { id: 'gilded', labelAr: 'حواف مذهبة وملونة 360°', labelEn: 'Gilded & Edge Foil' },
    { id: 'acrylic_card', labelAr: 'كروت أكريليك شفافة', labelEn: 'Crystal Acrylic Cards' },
  ],
  occasions: [
    { id: 'all', labelAr: 'كافة هدايا المناسبات والتكريم', labelEn: 'All Keepsakes' },
    { id: 'weddings', labelAr: 'لوحات زفاف وخطوبة', labelEn: 'Wedding & Engagement' },
    { id: 'graduations', labelAr: 'هدايا تخرج وأطباء', labelEn: 'Graduation & Medical' },
    { id: 'portraits', labelAr: 'بورتريه فيكتور ليزري', labelEn: 'Vector Line Portraits' },
    { id: 'corporate_gifts', labelAr: 'أطقم إهداء شركات', labelEn: 'Corporate VIP Gifts' },
  ],
};

export const SpecialtyHubPage: React.FC<SpecialtyHubPageProps> = ({
  specialtyId,
  onSelectSpecialty,
  onBackToHome,
  onSelectProduct,
  onOpenCustomizerModal,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const adminProducts = useAdminStore((state) => state.adminProducts);
  const productsList = adminProducts && adminProducts.length > 0 ? adminProducts : PRODUCTS;
  const { addItem, setIsOpen: setCartOpen } = useCartStore();

  // Current gateway data
  const currentGateway = SPECIALTY_GATEWAYS.find((g) => g.id === specialtyId) || SPECIALTY_GATEWAYS[0];
  const Icon = currentGateway.icon;

  // Filter products matching this specialty
  const specialtyProducts = useMemo(() => {
    return productsList.filter((prod) => {
      // Category matching logic
      let matchesCategory = false;
      if (specialtyId === 'boxes') {
        matchesCategory = prod.category === 'boxes';
      } else if (specialtyId === 'led') {
        matchesCategory = prod.category === 'led';
      } else if (specialtyId === 'cards') {
        matchesCategory = prod.category === 'cards';
      } else if (specialtyId === 'occasions') {
        matchesCategory = prod.category === 'portraits' || prod.category === 'weddings';
      }

      if (!matchesCategory) return false;

      // Subfilter matching
      if (activeSubFilter !== 'all') {
        const textToSearch = `${prod.titleAr} ${prod.titleEn} ${prod.descriptionAr} ${prod.descriptionEn}`.toLowerCase();
        if (activeSubFilter === 'rigid' && !textToSearch.includes('صلب') && !textToSearch.includes('rigid')) return false;
        if (activeSubFilter === 'perfume' && !textToSearch.includes('عطر') && !textToSearch.includes('مجوهر') && !textToSearch.includes('perfume')) return false;
        if (activeSubFilter === 'trophy' && !textToSearch.includes('درع') && !textToSearch.includes('تكريم') && !textToSearch.includes('trophy')) return false;
        if (activeSubFilter === 'desk' && !textToSearch.includes('مكتب') && !textToSearch.includes('desk')) return false;
        if (activeSubFilter === 'optical3d' && !textToSearch.includes('3d') && !textToSearch.includes('مضيئ')) return false;
        if (activeSubFilter === 'cotton' && !textToSearch.includes('قطن') && !textToSearch.includes('cotton')) return false;
        if (activeSubFilter === 'foil' && !textToSearch.includes('بصم') && !textToSearch.includes('foil')) return false;
        if (activeSubFilter === 'weddings' && prod.category !== 'weddings') return false;
        if (activeSubFilter === 'portraits' && prod.category !== 'portraits') return false;
      }

      // Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          prod.titleAr.toLowerCase().includes(q) ||
          prod.titleEn.toLowerCase().includes(q) ||
          prod.descriptionAr.toLowerCase().includes(q) ||
          prod.descriptionEn.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [productsList, specialtyId, activeSubFilter, searchQuery]);

  const subFilters = SPECIALTY_SUBFILTERS[specialtyId] || SPECIALTY_SUBFILTERS.boxes;

  const handleQuickAdd = (prod: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const qty = prod.minQuantity || 1;
    const dim = prod.dimensions?.[0] || { labelAr: 'قياسي', labelEn: 'Standard' };
    const mat = prod.materials?.[0] || { labelAr: 'قياسي فاخر', labelEn: 'Standard' };
    addItem({
      productId: prod.id,
      titleAr: prod.titleAr,
      titleEn: prod.titleEn,
      image: prod.image,
      category: prod.category,
      quantity: qty,
      unitPrice: prod.basePrice,
      totalPrice: prod.basePrice * qty,
      customOptions: {
        dimensionLabelAr: dim.labelAr,
        dimensionLabelEn: dim.labelEn,
        materialLabelAr: mat.labelAr,
        materialLabelEn: mat.labelEn,
      },
    });
    setCartOpen(true);
    toast.success(isAr ? `تمت إضافة "${prod.titleAr}" إلى سلة الطلبات` : `Added "${prod.titleEn}" to cart`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      
      {/* Top Studio Sticky Header & Breadcrumbs / Studio Switcher Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Back Button to Master Gateway */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
              >
                {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{isAr ? 'العودة لكافة استوديوهات نُون والقَلَم' : 'Back to All Studios'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                <span>/</span>
                <span className="font-bold text-slate-800">{isAr ? currentGateway.titleAr : currentGateway.titleEn}</span>
              </div>
            </div>

            {/* Quick Switcher Between the 4 Specialty Studios */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              <span className="text-[11px] font-bold text-slate-400 me-1 hidden lg:inline">
                {isAr ? 'التبديل بين الاستوديوهات:' : 'Switch Studio:'}
              </span>
              {SPECIALTY_GATEWAYS.map((gateway) => {
                const isActive = gateway.id === specialtyId;
                const GatewayIcon = gateway.icon;
                return (
                  <button
                    key={gateway.id}
                    onClick={() => {
                      onSelectSpecialty(gateway.id);
                      setActiveSubFilter('all');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <GatewayIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{isAr ? gateway.titleAr.replace('استوديو ', '') : gateway.titleEn.replace(' Studio', '')}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Dedicated Studio Hero (Microsite Experience) */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100/80 border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Start Column: Studio Description & Authority */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Icon className="w-3.5 h-3.5 text-amber-700" />
                <span>{isAr ? currentGateway.titleAr : currentGateway.titleEn}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {isAr ? currentGateway.headlineAr : currentGateway.headlineEn}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {isAr ? currentGateway.taglineAr : currentGateway.taglineEn}
              </p>

              {/* Craftsmanship Guarantees */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {(isAr ? currentGateway.craftSpecsAr : currentGateway.craftSpecsEn).map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">{spec}</span>
                  </div>
                ))}
              </div>

              {/* Assurance Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold border-t border-slate-200/80">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'تصنيع ورشة نون والقلم - بغداد' : 'Handcrafted in Baghdad Workshop'}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'تنفيذ وتسليم سريع 3-7 أيام' : 'Lead Time 3-7 Days'}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <span>{isAr ? currentGateway.startingPriceAr : currentGateway.startingPriceEn}</span>
                </span>
              </div>
            </div>

            {/* Right/End Column: Cinematic Hero Studio Showcase Photo */}
            <div className="lg:col-span-5">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-2 border-white ring-1 ring-slate-200 bg-slate-950">
                <img
                  src={currentGateway.image}
                  alt={isAr ? currentGateway.titleAr : currentGateway.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white text-xs font-bold">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                    {isAr ? 'تصوير حي من ورشتنا' : 'Live Workshop Photography'}
                  </span>
                  <button
                    onClick={() => onOpenCustomizerModal()}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'طلب نموذج وتجهيز تصميم 🎨' : 'Request Custom Model'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Studio Work Area: Filters & Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Sub-Category Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
              {subFilters.map((sub) => {
                const isActive = activeSubFilter === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubFilter(sub.id)}
                    type="button"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-amber-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isAr ? sub.labelAr : sub.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث في هذا الاستوديو...' : 'Search this studio...'}
                className="w-full ps-9 pe-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>
              {isAr
                ? `عرض ${specialtyProducts.length} من النماذج والمنتجات المصنعة في هذا القسم`
                : `Showing ${specialtyProducts.length} production models in this department`}
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-amber-800 hover:underline font-bold"
              >
                {isAr ? 'مسح البحث' : 'Clear search'}
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {specialtyProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {specialtyProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod.id)}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={isAr ? prod.titleAr : prod.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 start-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold">
                    {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                  </div>
                  <div className="absolute bottom-3 end-3 px-3 py-1 rounded-lg bg-white/95 text-slate-900 text-xs font-black shadow-xs">
                    {prod.basePrice.toLocaleString()} د.ع
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                      {isAr ? prod.titleAr : prod.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {isAr ? prod.descriptionAr : prod.descriptionEn}
                    </p>
                  </div>

                  {/* Specifications Snapshot */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isAr ? 'الحد الأدنى للطلب:' : 'Min Order:'}</span>
                      <span className="font-bold text-slate-800">{prod.minQuantity} قطعة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isAr ? 'مدة التنفيذ والتجهيز:' : 'Lead Time:'}</span>
                      <span className="font-medium text-slate-700">{isAr ? prod.leadTimeAr : prod.leadTimeEn}</span>
                    </div>
                    {prod.tierPricing && prod.tierPricing.length > 1 && (
                      <div className="flex items-center justify-between text-purple-700 font-bold">
                        <span>{isAr ? 'خصم الكميات:' : 'Volume Discount:'}</span>
                        <span>{isAr ? `يصل إلى ${prod.tierPricing[prod.tierPricing.length - 1].discountPercent}%` : `Up to ${prod.tierPricing[prod.tierPricing.length - 1].discountPercent}%`}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(prod.id);
                      }}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'التفاصيل' : 'Details'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(prod, e)}
                      className="w-full py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>{isAr ? 'طلب سريع' : 'Order'}</span>
                      {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Icon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {isAr ? 'لا توجد منتجات مطابقة لهذا الفلتر حالياً' : 'No products matched this filter'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isAr
                ? 'يمكنك إضافة وتعديل منتجات هذا القسم مباشرة من لوحة التحكم أو التواصل معنا لتصنيع نموذج مخصص لك.'
                : 'You can add products from the admin dashboard or contact our engineering workshop directly.'}
            </p>
            <button
              onClick={() => {
                setActiveSubFilter('all');
                setSearchQuery('');
              }}
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800"
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        )}

        {/* Specialized Workshop Custom Quote & Dieline Consultation Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-start">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isAr ? 'طلبيات الشركات والمشاريع الكبيرة' : 'Commercial & Wholesale Projects'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              {isAr
                ? `هل ترغب في إنتاج كمية خاصة من ${currentGateway.titleAr.replace('استوديو ', '')}؟`
                : `Need custom dielines or bulk manufacturing for ${currentGateway.titleEn.replace(' Studio', '')}?`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'نوفر أسعار جملة تصاعدية للمصانع والشركات والمكاتب، مع بروفات طباعة معتمدة وتصنيع قوالب مخصصة للأبعاد الخاصة بك.'
                : 'We offer volume contract pricing, structural CAD dieline prototypes, and physical pre-production sample approvals.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => onOpenCustomizerModal()}
              type="button"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'طلب وتجهيز تصميم خاص 🎨' : 'Request Bespoke Production'}</span>
            </button>

            <a
              href={`https://wa.me/9647800000000?text=${encodeURIComponent(
                `مرحباً نون والقلم، أود الاستفسار وطلب تسعيرة كميات لـ ${isAr ? currentGateway.titleAr : currentGateway.titleEn}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'طلب تسعيرة عبر واتساب' : 'Request Quote via WhatsApp'}</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
