import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore } from '../../store/useAdminStore';
import { ProductItem } from '../../data/mockData';
import { toast } from 'sonner';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Tag,
  Clock,
  Ruler,
  Layers,
  Sparkles,
  Zap,
  Check,
  X,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';

export const ProductManagementTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { adminProducts, addProduct, updateProduct, deleteProduct, resetProductsToDefaults } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<'led' | 'boxes' | 'cards' | 'portraits' | 'weddings'>('led');
  const [basePrice, setBasePrice] = useState(35000);
  const [minQuantity, setMinQuantity] = useState(1);
  const [leadTimeAr, setLeadTimeAr] = useState('24 - 48 ساعة');
  const [leadTimeEn, setLeadTimeEn] = useState('24 - 48 Hours');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Tiered Pricing editor state
  const [tier1Discount, setTier1Discount] = useState(10);
  const [tier2Discount, setTier2Discount] = useState(20);
  const [urgentDeliveryCharge, setUrgentDeliveryCharge] = useState(10000);

  const filteredProducts = adminProducts.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setTitleAr('');
    setTitleEn('');
    setCategory('led');
    setBasePrice(45000);
    setMinQuantity(1);
    setLeadTimeAr('24 - 48 ساعة');
    setLeadTimeEn('24 - 48 Hours');
    setDescriptionAr('');
    setDescriptionEn('');
    setImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80');
    setTier1Discount(10);
    setTier2Discount(20);
    setUrgentDeliveryCharge(10000);
    setShowModal(true);
  };

  const handleOpenEditModal = (p: ProductItem) => {
    setEditingProductId(p.id);
    setTitleAr(p.titleAr);
    setTitleEn(p.titleEn);
    setCategory(p.category);
    setBasePrice(p.basePrice);
    setMinQuantity(p.minQuantity);
    setLeadTimeAr(p.leadTimeAr);
    setLeadTimeEn(p.leadTimeEn);
    setDescriptionAr(p.descriptionAr);
    setDescriptionEn(p.descriptionEn);
    setImageUrl(p.image);
    setTier1Discount(p.tierPricing[1]?.discountPercent || 10);
    setTier2Discount(p.tierPricing[2]?.discountPercent || 20);
    setUrgentDeliveryCharge(10000);
    setShowModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr) return;

    const categoryLabels: Record<string, { ar: string; en: string }> = {
      led: { ar: 'إضاءة ومجسمات LED', en: '3D LED Lamps' },
      boxes: { ar: 'علب وتغليف', en: 'Custom Packaging' },
      cards: { ar: 'كروت وهويات', en: 'Business Stationery' },
      portraits: { ar: 'بورتريه ورسومات', en: 'Portraits & Art' },
      weddings: { ar: 'مناسبات وزفاف', en: 'Wedding & Events' },
    };

    const newProductData: ProductItem = {
      id: editingProductId || `prod-${Date.now()}`,
      slug: titleEn.toLowerCase().replace(/\s+/g, '-') || `prod-${Date.now()}`,
      titleAr,
      titleEn: titleEn || titleAr,
      category,
      categoryLabelAr: categoryLabels[category].ar,
      categoryLabelEn: categoryLabels[category].en,
      basePrice,
      descriptionAr: descriptionAr || titleAr,
      descriptionEn: descriptionEn || titleEn,
      image: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
      galleryImages: [imageUrl, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80'],
      featuresAr: ['قص ليزري دقيق بالورشة', 'مواد وخامات مستوردة عالية الجودة', 'ضمان رضا وبروفة مسبقة'],
      featuresEn: ['Precision laser cutting', 'Premium imported materials', 'Free digital proofing'],
      specifications: [
        { keyAr: 'الخامة', keyEn: 'Material', valAr: 'أكريليك نقي / ورق مقوى فاخر', valEn: 'Cast Acrylic / Rigid Stock' },
        { keyAr: 'المنشأ', keyEn: 'Origin', valAr: 'تصنيع ورشة نون والقلم - بغداد', valEn: 'Handcrafted in Baghdad' },
      ],
      dimensions: [
        { id: 'dim-std', labelAr: 'قياسي', labelEn: 'Standard', multiplier: 1.0, widthCm: 20, heightCm: 15 },
        { id: 'dim-lrg', labelAr: 'كبير فاخر', labelEn: 'Large Deluxe', multiplier: 1.5, widthCm: 30, heightCm: 22 },
      ],
      materials: [
        { id: 'mat-std', labelAr: 'تشطيب قياسي فاخر', labelEn: 'Standard Finish', priceAdd: 0 },
      ],
      tierPricing: [
        { minQty: minQuantity, maxQty: minQuantity + 2, discountPercent: 0, labelAr: 'الكمية الأساسية', labelEn: 'Base Batch' },
        { minQty: minQuantity + 3, maxQty: minQuantity + 6, discountPercent: tier1Discount, labelAr: `خصم ${tier1Discount}%`, labelEn: `${tier1Discount}% off` },
        { minQty: minQuantity + 7, discountPercent: tier2Discount, labelAr: `خصم ${tier2Discount}%`, labelEn: `${tier2Discount}% off` },
      ],
      requiresCustomText: true,
      requiresLogoUpload: category !== 'weddings',
      minQuantity,
      leadTimeAr,
      leadTimeEn,
    };

    if (editingProductId) {
      updateProduct(editingProductId, newProductData);
      toast.success(isAr ? 'تم تعديل بيانات المنتج وتحديث المتجر بنجاح' : 'Product updated and store refreshed');
    } else {
      addProduct(newProductData);
      toast.success(isAr ? 'تمت إضافة المنتج الجديد إلى المتجر بنجاح' : 'New product added to store');
    }

    setShowModal(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(isAr ? 'حجم الصورة كبير، يرجى اختيار صورة أقل من 5 ميغابايت' : 'Image too large, maximum 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          toast.success(isAr ? 'تم رفع صورة المنتج بنجاح' : 'Image uploaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm(isAr ? 'هل أنت متأكد من استعادة قائمة المنتجات والتسعيرات الافتراضية؟' : 'Restore default catalog and pricing?')) {
      resetProductsToDefaults();
      toast.success(isAr ? 'تمت استعادة المنتجات الافتراضية بنجاح' : 'Default products restored');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <Tag className="w-4 h-4" />
              <span>{isAr ? 'إدارة المنتجات والتسعير المتدرج' : 'Product & Tiered Pricing Management'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {isAr ? 'كتالوج المنتجات وخصومات الكميات' : 'Product Catalog & Volume Discounts'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleResetDefaults}
              type="button"
              className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-purple-700 hover:bg-purple-50 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              title={isAr ? 'استعادة الكتالوج الافتراضي' : 'Restore Default Catalog'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              type="button"
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة منتج جديد' : 'Add New Product'}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث بالاسم...' : 'Search products...'}
              className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-slate-500 font-medium">{isAr ? 'الفئة:' : 'Category:'}</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-semibold text-slate-800"
            >
              <option value="all">{isAr ? 'الكل' : 'All Categories'}</option>
              <option value="led">{isAr ? 'لوحات وإضاءة LED' : 'LED Signs'}</option>
              <option value="boxes">{isAr ? 'علب وتغليف' : 'Packaging'}</option>
              <option value="cards">{isAr ? 'كروت أعمال' : 'Cards'}</option>
              <option value="portraits">{isAr ? 'بورتريه' : 'Portraits'}</option>
              <option value="weddings">{isAr ? 'مناسبات وزفاف' : 'Weddings'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 ps-6 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                <th className="p-4 text-start">{isAr ? 'الفئة' : 'Category'}</th>
                <th className="p-4 text-start">{isAr ? 'السعر الأساسي' : 'Base Price'}</th>
                <th className="p-4 text-start">{isAr ? 'أقل كمية' : 'Min Qty'}</th>
                <th className="p-4 text-start">{isAr ? 'مدة التجهيز' : 'Lead Time'}</th>
                <th className="p-4 text-start">{isAr ? 'خصومات الكميات' : 'Tiered Discounts'}</th>
                <th className="p-4 pe-6 text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 ps-6">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.titleAr} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">{isAr ? prod.titleAr : prod.titleEn}</span>
                        <span className="text-[11px] text-slate-400 font-mono">ID: {prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold text-[11px]">
                      {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900">
                    {prod.basePrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                  </td>
                  <td className="p-4 font-mono">
                    {prod.minQuantity} {isAr ? 'قطعة' : 'pcs'}
                  </td>
                  <td className="p-4 text-slate-500">
                    {isAr ? prod.leadTimeAr : prod.leadTimeEn}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {prod.tierPricing.map((tp, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono">
                          {tp.discountPercent}%
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 pe-6 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        type="button"
                        className="p-2 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                        title={isAr ? 'تعديل' : 'Edit'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
                            deleteProduct(prod.id);
                            toast.success(isAr ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
                          }
                        }}
                        type="button"
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title={isAr ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-base text-slate-900">
                {editingProductId ? (isAr ? 'تعديل بيانات المنتج والتسعير' : 'Edit Product & Pricing') : (isAr ? 'إضافة منتج مخصص جديد' : 'Add New Custom Product')}
              </h4>
              <button onClick={() => setShowModal(false)} type="button" className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    {isAr ? 'اسم المنتج بالعربية *' : 'Title (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: لوحة أكريليك دائرية مضيئة"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    {isAr ? 'اسم المنتج بالإنجليزية' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Circular LED Acrylic Plaque"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    {isAr ? 'فئة المنتج:' : 'Category:'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="led">{isAr ? 'لوحات وإضاءة LED' : 'LED Signs'}</option>
                    <option value="boxes">{isAr ? 'علب وتغليف' : 'Packaging'}</option>
                    <option value="cards">{isAr ? 'كروت أعمال' : 'Cards'}</option>
                    <option value="portraits">{isAr ? 'بورتريه' : 'Portraits'}</option>
                    <option value="weddings">{isAr ? 'مناسبات وزفاف' : 'Weddings'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    {isAr ? 'السعر الأساسي (د.ع):' : 'Base Price (IQD):'}
                  </label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    {isAr ? 'الحد الأدنى للطلب:' : 'Min Quantity:'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
                  />
                </div>
              </div>

              {/* Tiered Volume Pricing Config */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                <span className="text-xs font-bold text-purple-950 block">
                  {isAr ? 'إعدادات خصومات الكميات المتدرجة (Tiered Pricing):' : 'Volume Discount Tiers:'}
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-700 font-bold mb-1">
                      {isAr ? 'نسبة خصم الدفعة المتوسطة (%):' : 'Mid Batch Discount (%):'}
                    </label>
                    <input
                      type="number"
                      value={tier1Discount}
                      onChange={(e) => setTier1Discount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-700 font-bold mb-1">
                      {isAr ? 'نسبة خصم الدفعة الكبيرة (%):' : 'Bulk Batch Discount (%):'}
                    </label>
                    <input
                      type="number"
                      value={tier2Discount}
                      onChange={(e) => setTier2Discount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    {isAr ? 'وصف المنتج بالعربية:' : 'Description (Arabic):'}
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="وصف تفصيلي للمنتج وخاماته..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    {isAr ? 'وصف المنتج بالإنجليزية:' : 'Description (English):'}
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Detailed product specifications..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white resize-none"
                  />
                </div>
              </div>

              {/* Photo & Artwork Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    <span>{isAr ? 'صورة المنتج والتصميم (Photo & Image):' : 'Product Photo / Artwork:'}</span>
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
                    >
                      {isAr ? 'مسح الصورة' : 'Clear Image'}
                    </button>
                  )}
                </div>

                {/* Live Preview & Direct File Upload */}
                <div className="flex items-start gap-4">
                  {imageUrl ? (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-purple-300 shadow-xs shrink-0 bg-slate-900">
                      <img src={imageUrl} alt="معاينة المنتج" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 inset-x-1 text-center bg-black/70 text-white text-[9px] rounded py-0.5 font-bold">
                        {isAr ? 'معاينة' : 'Preview'}
                      </span>
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 bg-white">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[10px]">{isAr ? 'لا توجد صورة' : 'No image'}</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    {/* Device Upload Input */}
                    <div>
                      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isAr ? 'رفع صورة من الجهاز / الهاتف' : 'Upload from Device / Phone'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {isAr ? 'يدعم صور PNG, JPG, WebP حتى 5MB' : 'Supports PNG, JPG, WebP up to 5MB'}
                      </p>
                    </div>

                    {/* Image URL Input */}
                    <div>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder={isAr ? 'أو ألصق رابط صورة (Image URL)...' : 'Or paste Image URL...'}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Workshop Studio Presets */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    {isAr ? 'مكتبة صور الورشة الجاهزة (اختر بنقرة واحدة):' : 'Studio Preset Library:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: isAr ? 'لوحة أكريليك للأفق' : 'Al-Ufuq Plaque', url: '/images/products/acrylic_led_front_1791779703517.jpg' },
                      { label: isAr ? 'مصباح طائرة 3D' : 'Airplane Lamp', url: '/images/products/led_acrylic_3d_plane_1791816292618.jpg' },
                      { label: isAr ? 'علبة هدايا كرتون' : 'Rigid Box', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80' },
                      { label: isAr ? 'كروت بصمة ذهبية' : 'Gold Foil Cards', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80' },
                      { label: isAr ? 'لوحة زفاف أكريليك' : 'Wedding Sign', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80' },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          toast.info(isAr ? `تم اختيار: ${preset.label}` : `Selected: ${preset.label}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-50 border border-slate-200 text-[10px] font-semibold text-slate-700 hover:text-purple-700 transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  {isAr ? 'حفظ المنتج' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
