import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore } from '../../store/useAdminStore';
import { ProductItem } from '../../data/mockData';
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
} from 'lucide-react';

export const ProductManagementTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { adminProducts, addProduct, updateProduct, deleteProduct } = useAdminStore();

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
    } else {
      addProduct(newProductData);
    }

    setShowModal(false);
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

          <button
            onClick={handleOpenAddModal}
            type="button"
            className="self-start md:self-auto px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة منتج جديد' : 'Add New Product'}</span>
          </button>
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
                        onClick={() => deleteProduct(prod.id)}
                        type="button"
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'رابط صورة المنتج (Image URL):' : 'Image URL:'}
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
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
