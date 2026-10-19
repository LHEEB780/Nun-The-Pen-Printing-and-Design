import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Clock,
  Percent,
  X,
  RotateCcw,
  Layers,
  Image as ImageIcon,
  Save,
  Check,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useOffersStore, OfferItem, OfferCategory } from '../../store/useOffersStore';
import { toast } from 'sonner';

export const OffersManagementTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const {
    offers,
    addOffer,
    updateOffer,
    deleteOffer,
    toggleOfferActive,
    toggleOfferFeatured,
    resetOffersToDefaults,
  } = useOffersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    taglineAr: '',
    taglineEn: '',
    descriptionAr: '',
    descriptionEn: '',
    discountBadgeAr: '',
    discountBadgeEn: '',
    discountPercentage: 25,
    promoCode: '',
    category: 'boxes' as OfferCategory,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    originalPrice: 150000,
    discountedPrice: 112500,
    currency: 'IQD',
    expiresAt: '2026-11-30',
    featuresArText: 'كرتون مقوى فاخر سماكة 2 ملم\nبصمة ذهبية حرارية مجاناً\nشحن سريع داخل بغداد',
    featuresEnText: '2mm premium rigid core board\nFree metallic gold foil stamp\nExpress delivery in Baghdad',
    isFeatured: true,
    isActive: true,
    productId: 'prod-rigid-perfume-box',
    whatsappInquiryTextAr: '',
    whatsappInquiryTextEn: '',
  });

  const PRESET_IMAGES = [
    { label: isAr ? 'علب كرتون فاخرة' : 'Rigid Boxes', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80' },
    { label: isAr ? 'أكريليك و LED' : 'Acrylic Sign', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80' },
    { label: isAr ? 'كروت قطنية مذهبة' : 'Hot-Foil Cards', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80' },
    { label: isAr ? 'دروع كريستال' : 'Crystal Award', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80' },
    { label: isAr ? 'باقة متكاملة' : 'Full Bundle', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80' },
  ];

  const handleOpenAddModal = () => {
    setEditingOfferId(null);
    setFormData({
      titleAr: '',
      titleEn: '',
      taglineAr: '',
      taglineEn: '',
      descriptionAr: '',
      descriptionEn: '',
      discountBadgeAr: 'خصم 25%',
      discountBadgeEn: '25% OFF',
      discountPercentage: 25,
      promoCode: 'OFFER25',
      category: 'boxes',
      imageUrl: PRESET_IMAGES[0].url,
      originalPrice: 150000,
      discountedPrice: 112500,
      currency: 'IQD',
      expiresAt: '2026-11-30',
      featuresArText: 'تصنيع محلي في بغداد\nدقة قص ليزري ميكروني\nضمان الجودة لسنتين',
      featuresEnText: 'Baghdad workshop crafting\nMicron CNC laser cutting\n2-year quality warranty',
      isFeatured: false,
      isActive: true,
      productId: 'prod-rigid-perfume-box',
      whatsappInquiryTextAr: '',
      whatsappInquiryTextEn: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (offer: OfferItem) => {
    setEditingOfferId(offer.id);
    setFormData({
      titleAr: offer.titleAr,
      titleEn: offer.titleEn,
      taglineAr: offer.taglineAr || '',
      taglineEn: offer.taglineEn || '',
      descriptionAr: offer.descriptionAr,
      descriptionEn: offer.descriptionEn,
      discountBadgeAr: offer.discountBadgeAr,
      discountBadgeEn: offer.discountBadgeEn,
      discountPercentage: offer.discountPercentage,
      promoCode: offer.promoCode,
      category: offer.category,
      imageUrl: offer.imageUrl,
      originalPrice: offer.originalPrice || 0,
      discountedPrice: offer.discountedPrice || 0,
      currency: offer.currency,
      expiresAt: offer.expiresAt,
      featuresArText: (offer.featuresAr || []).join('\n'),
      featuresEnText: (offer.featuresEn || []).join('\n'),
      isFeatured: offer.isFeatured,
      isActive: offer.isActive,
      productId: offer.productId || '',
      whatsappInquiryTextAr: offer.whatsappInquiryTextAr || '',
      whatsappInquiryTextEn: offer.whatsappInquiryTextEn || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleAr.trim() || !formData.promoCode.trim()) {
      toast.error(isAr ? 'يرجى إدخال عنوان العرض وكود الخصم على الأقل' : 'Please provide offer title and promo code');
      return;
    }

    const featuresAr = formData.featuresArText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const featuresEn = formData.featuresEnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingOfferId) {
      updateOffer(editingOfferId, {
        titleAr: formData.titleAr,
        titleEn: formData.titleEn || formData.titleAr,
        taglineAr: formData.taglineAr,
        taglineEn: formData.taglineEn || formData.taglineAr,
        descriptionAr: formData.descriptionAr,
        descriptionEn: formData.descriptionEn || formData.descriptionAr,
        discountBadgeAr: formData.discountBadgeAr,
        discountBadgeEn: formData.discountBadgeEn || formData.discountBadgeAr,
        discountPercentage: Number(formData.discountPercentage),
        promoCode: formData.promoCode.toUpperCase().trim(),
        category: formData.category,
        imageUrl: formData.imageUrl,
        originalPrice: Number(formData.originalPrice),
        discountedPrice: Number(formData.discountedPrice),
        currency: formData.currency,
        expiresAt: formData.expiresAt,
        featuresAr,
        featuresEn,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        productId: formData.productId,
        whatsappInquiryTextAr: formData.whatsappInquiryTextAr,
        whatsappInquiryTextEn: formData.whatsappInquiryTextEn,
      });
      toast.success(isAr ? 'تم تحديث العرض الموسمي بنجاح!' : 'Offer updated successfully!');
    } else {
      addOffer({
        titleAr: formData.titleAr,
        titleEn: formData.titleEn || formData.titleAr,
        taglineAr: formData.taglineAr,
        taglineEn: formData.taglineEn || formData.taglineAr,
        descriptionAr: formData.descriptionAr,
        descriptionEn: formData.descriptionEn || formData.descriptionAr,
        discountBadgeAr: formData.discountBadgeAr,
        discountBadgeEn: formData.discountBadgeEn || formData.discountBadgeAr,
        discountPercentage: Number(formData.discountPercentage),
        promoCode: formData.promoCode.toUpperCase().trim(),
        category: formData.category,
        imageUrl: formData.imageUrl,
        originalPrice: Number(formData.originalPrice),
        discountedPrice: Number(formData.discountedPrice),
        currency: formData.currency,
        expiresAt: formData.expiresAt,
        featuresAr,
        featuresEn,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        productId: formData.productId,
        whatsappInquiryTextAr: formData.whatsappInquiryTextAr,
        whatsappInquiryTextEn: formData.whatsappInquiryTextEn,
      });
      toast.success(isAr ? 'تمت إضافة العرض الموسمي الجديد بنجاح!' : 'New offer added successfully!');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف العرض "${title}"؟` : `Delete offer "${title}"?`)) {
      deleteOffer(id);
      toast.info(isAr ? 'تم حذف العرض بنجاح' : 'Offer deleted');
    }
  };

  const filteredOffers = offers.filter((o) => {
    const matchesCat = selectedCategory === 'all' || o.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      o.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.promoCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4 text-amber-500" />
            <span>{isAr ? 'إدارة العروض الترويجية والموسمية' : 'Seasonal Deals & Campaigns Management'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {isAr ? 'لوحة تحكم عروض وتخفيضات نُون والقَلَم' : 'Offers & Promotions Dashboard'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? 'يمكنك من هنا إضافة عروض جديدة، تعديل نسب الخصم وأكواد الكوبونات، تفعيل أو تعطيل العروض، أو حذفها مباشرة.'
              : 'Add new deals, configure discount percentages, promo codes, toggle visibility, and edit active campaigns.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={resetOffersToDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isAr ? 'استرجاع العروض الافتراضية' : 'Reset to Default Deals'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة عرض جديد' : 'Add New Offer'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالعنوان أو كود الخصم...' : 'Search by title or coupon code...'}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-64 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'boxes', labelAr: 'علب الكرتون', labelEn: 'Boxes' },
            { id: 'acrylic', labelAr: 'الأكريليك', labelEn: 'Acrylic' },
            { id: 'cards', labelAr: 'كروت الأعمال', labelEn: 'Cards' },
            { id: 'awards', labelAr: 'دروع التكريم', labelEn: 'Awards' },
            { id: 'bundles', labelAr: 'الباقات VIP', labelEn: 'Bundles' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isAr ? c.labelAr : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Table / Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => {
          return (
            <div
              key={offer.id}
              className={`bg-white rounded-3xl border shadow-xs overflow-hidden flex flex-col justify-between transition-all ${
                offer.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                {/* Image and Badges */}
                <div className="relative aspect-16/9 bg-slate-950 overflow-hidden select-none">
                  <img
                    src={offer.imageUrl}
                    alt={isAr ? offer.titleAr : offer.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 start-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black shadow-xs">
                      {isAr ? offer.discountBadgeAr : offer.discountBadgeEn}
                    </span>
                    {offer.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-xs">
                        {isAr ? 'مميز' : 'Featured'}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 end-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleOfferActive(offer.id)}
                      className={`p-1.5 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                        offer.isActive
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-slate-800/90 text-slate-300'
                      }`}
                      title={offer.isActive ? (isAr ? 'تعطيل العرض' : 'Deactivate') : (isAr ? 'تفعيل العرض' : 'Activate')}
                    >
                      {offer.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="absolute bottom-2.5 start-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-mono">
                    {offer.promoCode}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{offer.category.toUpperCase()}</span>
                    <span>{isAr ? 'حتى:' : 'Until:'} {offer.expiresAt}</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2">
                    {isAr ? offer.titleAr : offer.titleEn}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {isAr ? offer.descriptionAr : offer.descriptionEn}
                  </p>

                  {offer.originalPrice && offer.discountedPrice && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="line-through text-slate-400 font-mono">
                        {offer.originalPrice.toLocaleString()} IQD
                      </span>
                      <span className="font-extrabold text-purple-700 font-mono">
                        {offer.discountedPrice.toLocaleString()} IQD
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => toggleOfferFeatured(offer.id)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                    offer.isFeatured
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? (offer.isFeatured ? 'مميز ★' : 'تمييز') : (offer.isFeatured ? 'Featured ★' : 'Feature')}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(offer)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title={isAr ? 'تعديل بيانات العرض' : 'Edit Offer'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(offer.id, isAr ? offer.titleAr : offer.titleEn)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title={isAr ? 'حذف العرض نهائياً' : 'Delete Offer'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Offer Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scale">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    {editingOfferId
                      ? (isAr ? 'تعديل بيانات العرض الترويجي' : 'Edit Seasonal Offer')
                      : (isAr ? 'إضافة عرض موسمي جديد' : 'Create New Seasonal Offer')}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {editingOfferId ? `#${editingOfferId}` : (isAr ? 'عرض جديد' : 'New')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'عنوان العرض (عربي) *' : 'Offer Title (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder={isAr ? 'مثال: خصم 25% على علب الكرتون الفاخرة' : 'e.g. 25% off Rigid Boxes'}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'عنوان العرض (إنجليزي)' : 'Offer Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. 25% OFF Luxury Custom Rigid Boxes"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Taglines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'الشعار الفرعي (عربي)' : 'Tagline (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.taglineAr}
                    onChange={(e) => setFormData({ ...formData, taglineAr: e.target.value })}
                    placeholder={isAr ? 'مثال: تصنيع محلي في بغداد بكرتون 1800 غم' : 'e.g. Crafted in Baghdad'}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'الشعار الفرعي (إنجليزي)' : 'Tagline (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.taglineEn}
                    onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                    placeholder="e.g. Handcrafted in Baghdad with 1800gsm board"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Category & Promo Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'قسم العرض *' : 'Category *'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as OfferCategory })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  >
                    <option value="boxes">{isAr ? 'علب الكرتون المقوى' : 'Rigid Boxes'}</option>
                    <option value="acrylic">{isAr ? 'الأكريليك و LED' : 'Acrylic & LED'}</option>
                    <option value="cards">{isAr ? 'كروت الأعمال' : 'Business Cards'}</option>
                    <option value="awards">{isAr ? 'دروع التكريم' : 'Crystal Awards'}</option>
                    <option value="bundles">{isAr ? 'باقات متكاملة' : 'Launch Bundles'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'كود الخصم الترويجي *' : 'Promo Code *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. NOON25"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'نسبة الخصم (%)' : 'Discount %'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Pricing & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'السعر الأصلي (د.ع)' : 'Original Price (IQD)'}
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'السعر بعد الخصم (د.ع)' : 'Discounted Price (IQD)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'تاريخ انتهاء العرض' : 'Expiry Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Badges Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'نص شارة الخصم (عربي)' : 'Discount Badge (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.discountBadgeAr}
                    onChange={(e) => setFormData({ ...formData, discountBadgeAr: e.target.value })}
                    placeholder={isAr ? 'مثال: خصم 25% ذهبي' : '25% OFF'}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'نص شارة الخصم (إنجليزي)' : 'Discount Badge (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.discountBadgeEn}
                    onChange={(e) => setFormData({ ...formData, discountBadgeEn: e.target.value })}
                    placeholder="25% OFF GOLD"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {isAr ? 'تفاصيل ووصف العرض (عربي)' : 'Offer Description (Arabic)'}
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder={isAr ? 'اكتب وصفاً مفصلاً للعرض وما يتضمنه من مزايا وقوالب مجانية...' : 'Detailed description...'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                />
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {isAr ? 'رابط صورة العرض (أو اختر من النماذج الجاهزة)' : 'Image URL or Presets'}
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-mono mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features List Textarea */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'مزايا العرض (عربي - سطر لكل ميزة)' : 'Features (Arabic - one per line)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.featuresArText}
                    onChange={(e) => setFormData({ ...formData, featuresArText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {isAr ? 'مزايا العرض (إنجليزي - سطر لكل ميزة)' : 'Features (English - one per line)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.featuresEnText}
                    onChange={(e) => setFormData({ ...formData, featuresEnText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <span>{isAr ? 'تفعيل العرض فوراً في الموقع (نشط)' : 'Active (Published to Site)'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <span>{isAr ? 'عرض مميز في أعلى الموقع والبنر الرئيسي' : 'Featured Deal'}</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingOfferId ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'نشر العرض الجديد' : 'Publish Offer')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
