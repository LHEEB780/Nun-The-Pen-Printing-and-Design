import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore, SavedDesign } from '../../store/useAuthStore';
import { OrderRecord, ManufacturingStatus, useCartStore } from '../../store/useCartStore';
import { OrderManufacturingTracker, MANUFACTURING_STAGES } from './OrderManufacturingTracker';
import {
  User,
  Package,
  FolderHeart,
  Settings,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Printer,
  Send,
  Upload,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  ShieldCheck,
  Plus,
  X,
  LayoutDashboard,
  Repeat,
  ShoppingBag,
  Download,
  Edit2,
  Check,
  MessageCircle,
  Maximize2,
  Heart,
  Award,
  Coins,
  Crown,
  Gift,
} from 'lucide-react';
import { toast } from 'sonner';
import { PRODUCTS, ProductItem } from '../../data/mockData';
import { useAdminStore, getUnifiedProducts } from '../../store/useAdminStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { LoyaltyPointsTracker } from './LoyaltyPointsTracker';

interface CustomerDashboardProps {
  onBackToShop: () => void;
  onOpenCustomizerWithProduct?: (productId: string) => void;
  initialTab?: 'overview' | 'proofs' | 'orders' | 'designs' | 'wishlist' | 'loyalty' | 'profile';
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onBackToShop,
  onOpenCustomizerWithProduct,
  initialTab = 'overview',
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const {
    user,
    pastOrders,
    savedDesigns,
    digitalProofs,
    wishlist,
    loyaltyPoints,
    removeFromWishlist,
    approveDigitalProof,
    requestProofRevision,
    hasProofNotification,
    dismissProofNotification,
    updateProfile,
    logout,
    deleteSavedDesign,
    renameSavedDesign,
    addSavedDesign,
  } = useAuthStore();

  const { addItem } = useCartStore();
  const { formatPrice, currency, exchangeRate } = useCurrencyStore();
  const adminProducts = useAdminStore((state) => state.adminProducts);
  const allProducts = React.useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  const wishlistedProducts = React.useMemo(() => {
    return wishlist
      .map((id) => allProducts.find((p) => p.id === id) || PRODUCTS.find((p) => p.id === id))
      .filter((p): p is ProductItem => Boolean(p));
  }, [wishlist, allProducts]);

  const handleRemoveFromWishlist = (productId: string, title: string) => {
    removeFromWishlist(productId);
    toast.info(isAr ? `تمت إزالة «${title}» من قائمة رغباتك` : `Removed "${title}" from wishlist`);
  };

  const handleAddToCartFromWishlist = (prod: ProductItem) => {
    addItem({
      productId: prod.id,
      titleAr: prod.titleAr,
      titleEn: prod.titleEn,
      image: prod.image,
      category: prod.category || 'led',
      quantity: 1,
      unitPrice: prod.basePrice,
      totalPrice: prod.basePrice,
      customOptions: {
        customText: isAr ? 'طلب مخصص من المفضلة' : 'Custom from Wishlist',
        fontName: 'الخط الكوفي الملكي',
        dimensionLabelAr: prod.dimensions?.[0]?.labelAr || 'قياسي',
        dimensionLabelEn: prod.dimensions?.[0]?.labelEn || 'Standard',
        materialLabelAr: prod.materials?.[0]?.labelAr || 'تشطيب فاخر',
        materialLabelEn: prod.materials?.[0]?.labelEn || 'Luxury Finish',
        notes: 'إضافة سريعة من قائمة الرغبات',
      },
    });
    toast.success(isAr ? `تمت إضافة «${prod.titleAr}» إلى سلة المشتريات!` : `Added "${prod.titleEn}" to your cart!`);
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'proofs' | 'orders' | 'designs' | 'wishlist' | 'loyalty' | 'profile'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(pastOrders[0]?.orderId || null);
  const [reorderSuccessToast, setReorderSuccessToast] = useState(false);
  const [selectedProofPreview, setSelectedProofPreview] = useState<string | null>(null);
  const [activeRevisionId, setActiveRevisionId] = useState<string | null>(null);
  const [revisionComment, setRevisionComment] = useState<string>('');
  const [approvalToast, setApprovalToast] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | ManufacturingStatus>('all');

  const pendingProofsCount = digitalProofs.filter((p) => p.status === 'pending_approval').length;

  // Rename design state
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  // Profile Form state
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editGovernorate, setEditGovernorate] = useState(user?.governorate || 'بغداد - الكرخ');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Synchronize form values whenever user state updates or hydrates
  useEffect(() => {
    if (user) {
      setEditName(user.fullName || '');
      setEditPhone(user.phone || '');
      setEditGovernorate(user.governorate || 'بغداد - الكرخ');
      setEditAddress(user.address || '');
    }
  }, [user]);

  // Upload new design state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDesignTitle, setNewDesignTitle] = useState('');
  const [newDesignCategory, setNewDesignCategory] = useState('led');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const governorates = [
    'بغداد - الكرخ',
    'بغداد - الرصافة',
    'البصرة',
    'أربيل',
    'النجف الأشرف',
    'كربلاء المقدسة',
    'السليمانية',
    'نينوى / الموصل',
    'بابل / الحلة',
    'كركوك',
    'الأنبار',
    'ذي قار / الناصرية',
    'ديالى',
    'ميسان',
    'المثنى',
    'القادسية',
    'واسط',
    'صلاح الدين',
    'دهوك',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editName,
      phone: editPhone,
      governorate: editGovernorate,
      address: editAddress,
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleAddDesignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesignTitle || !uploadedFileName) return;

    addSavedDesign({
      titleAr: newDesignTitle,
      titleEn: newDesignTitle,
      fileName: uploadedFileName,
      fileSize: '2.1 MB',
      fileType: 'svg',
      previewUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      productCategory: newDesignCategory,
      productId: newDesignCategory === 'led' ? 'prod-travel-acrylic-sign' : 'prod-rigid-boxes',
    });

    setNewDesignTitle('');
    setUploadedFileName('');
    setShowUploadModal(false);
  };

  const handleWhatsAppTrack = (order: OrderRecord) => {
    const text = isAr
      ? `مرحباً نون والقلم 🌟\nاستفسار عن مسار تصنيع طلبي رقم: *${order.orderId}*\nالاسم: ${order.shipping.fullName}\nالمبلغ: ${order.grandTotal.toLocaleString()} د.ع\nيرجى تزويدي بآخر تحديث للتصنيع.`
      : `Hello Noon & Pen 🌟\nTracking my order *${order.orderId}*\nCustomer: ${order.shipping.fullName}\nTotal: ${order.grandTotal.toLocaleString()} IQD.`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/9647800000000?text=${encoded}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      addItem({
        productId: item.productId,
        titleAr: item.titleAr,
        titleEn: item.titleEn,
        image: item.image,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        customOptions: { ...item.customOptions },
        customFormData: item.customFormData ? { ...item.customFormData } : undefined,
      });
    });
    setReorderSuccessToast(true);
    setTimeout(() => setReorderSuccessToast(false), 3000);
  };

  const handleDownloadInvoice = (order: OrderRecord) => {
    // Generate clean printable receipt
    const printableWindow = window.open('', '_blank');
    if (printableWindow) {
      printableWindow.document.write(`
        <!DOCTYPE html>
        <html dir="${isAr ? 'rtl' : 'ltr'}">
        <head>
          <title>${isAr ? 'فاتورة ضريبية رسمية' : 'Official Invoice'} - ${order.orderId}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #9333ea; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .title { font-size: 24px; font-weight: bold; color: #6b21a8; }
            .details { margin-bottom: 30px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: ${isAr ? 'right' : 'left'}; }
            th { background-color: #f8fafc; }
            .total { font-size: 18px; font-weight: bold; color: #6b21a8; text-align: ${isAr ? 'left' : 'right'}; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">${isAr ? 'شركة نون والقلم للطباعة والتصميم' : 'Noon & Pen Design & Printing'}</div>
              <div>${isAr ? 'بغداد، شارع 14 رمضان، المنصور' : 'Mansour, Baghdad, Iraq'} | +964 780 000 0000</div>
            </div>
            <div>
              <h3>${isAr ? 'فاتورة طلب' : 'INVOICE'}</h3>
              <p>#${order.orderId}</p>
              <p>${order.createdAt}</p>
            </div>
          </div>
          <div class="details">
            <strong>${isAr ? 'العميل:' : 'Customer:'}</strong> ${order.shipping.fullName}<br/>
            <strong>${isAr ? 'الهاتف:' : 'Phone:'}</strong> ${order.shipping.phone}<br/>
            <strong>${isAr ? 'العنوان:' : 'Address:'}</strong> ${order.shipping.address} (${order.shipping.governorate})<br/>
            <strong>${isAr ? 'طريقة الدفع:' : 'Payment:'}</strong> ${isAr ? order.paymentDetails.gatewayNameAr : order.paymentDetails.gatewayNameEn} (${order.paymentDetails.transactionId || 'COD'})
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>${isAr ? 'المنتج والمواصفات المخصصة' : 'Product & Custom Specs'}</th>
                <th>${isAr ? 'الكمية' : 'Qty'}</th>
                <th>${isAr ? 'سعر الوحدة' : 'Unit Price'}</th>
                <th>${isAr ? 'المجموع' : 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (it, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>
                    <strong>${isAr ? it.titleAr : it.titleEn}</strong><br/>
                    ${it.customOptions.customText ? `<em>${it.customOptions.customText}</em><br/>` : ''}
                    <small>${isAr ? it.customOptions.dimensionLabelAr : it.customOptions.dimensionLabelEn} | ${isAr ? it.customOptions.materialLabelAr : it.customOptions.materialLabelEn}</small>
                  </td>
                  <td>${it.quantity}</td>
                  <td>${it.unitPrice.toLocaleString()} IQD</td>
                  <td>${it.totalPrice.toLocaleString()} IQD</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="total">
            ${isAr ? 'المجموع النهائي الواجب سداده:' : 'Grand Total:'} ${order.grandTotal.toLocaleString()} IQD
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printableWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="pt-24 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Banner Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 ring-4 ring-amber-100/90 shrink-0">
              {user?.fullName?.charAt(0) || 'م'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {user?.fullName || (isAr ? 'حساب العميل' : 'Customer Account')}
                </h1>
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200/90 text-amber-900 text-[11px] font-black inline-flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-600 inline" />
                  {isAr ? 'عميل مميز' : 'Verified Client'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="dir-ltr">{user?.phone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user?.governorate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-s border-slate-200 pt-4 md:pt-0 md:ps-8">
            <div className="text-center">
              <span className="text-xl font-black text-slate-900 font-mono block">
                {pastOrders.length}
              </span>
              <span className="text-xs text-slate-500">{isAr ? 'الطلبات المنفذة' : 'Total Orders'}</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-black text-amber-700 font-mono block">
                {savedDesigns.length}
              </span>
              <span className="text-xs text-slate-500">{isAr ? 'التصاميم المحفوظة' : 'Saved Designs'}</span>
            </div>
            {/* Wishlist Quick Metric */}
            <div
              onClick={() => setActiveTab('wishlist')}
              className="text-center cursor-pointer group hover:opacity-80 transition-opacity"
              title={isAr ? 'عرض قائمة الرغبات والمفضلة' : 'View Wishlist'}
            >
              <span className="text-xl font-black text-rose-600 font-mono block group-hover:scale-105 transition-transform">
                {wishlist.length}
              </span>
              <span className="text-xs text-slate-500 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline" />
                <span>{isAr ? 'قائمة الرغبات' : 'Wishlist'}</span>
              </span>
            </div>

            {/* Loyalty Points Quick Metric */}
            <div
              onClick={() => setActiveTab('loyalty')}
              className="text-center cursor-pointer group hover:opacity-80 transition-opacity"
              title={isAr ? 'عرض رصيد نقاط الولاء والمكافآت' : 'View Loyalty Points'}
            >
              <span className="text-xl font-black text-amber-600 font-mono block group-hover:scale-105 transition-transform tabular-nums">
                {loyaltyPoints.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600 inline" />
                <span>{isAr ? 'نقاط الولاء' : 'Points'}</span>
              </span>
            </div>
            <button
              onClick={logout}
              type="button"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Log Out'}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Re-order success toast */}
        {reorderSuccessToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{isAr ? 'تمت إضافة عناصر الطلب والمواصفات المخصصة إلى سلة الشراء بنجاح!' : 'Items with custom specifications re-added to your cart successfully!'}</span>
            </div>
            <button
              onClick={() => onBackToShop()}
              className="px-3 py-1 rounded-lg bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              {isAr ? 'عرض السلة' : 'View Cart'}
            </button>
          </div>
        )}

        {/* Top Design Proof Alert Banner (واشعار في أعلى حساب للتنبيه) */}
        {(pendingProofsCount > 0 || hasProofNotification) && (
          <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/80 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-scale border border-amber-500/40 relative overflow-hidden">
            {/* Subtle brand glow in background */}
            <div className="absolute -top-12 -end-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center text-xl shrink-0 shadow-inner">
                🔔
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-base sm:text-lg text-amber-100 tracking-tight">
                    {isAr ? 'تنبيه عاجل: بروفة التصميم الخاصة بطلبك جاهزة للاعتماد!' : 'Alert: Design proof is ready for approval!'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    {isAr ? 'إجراء مطلوب' : 'Action Required'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {isAr
                    ? 'قام مهندسو وخطاطو نُون والقَلَم بإعداد مسودة التصميم وأرسلوا نسخة إلى حسابك هنا ونسخة على واتساب للتواصل السريع. يرجى معاينتها واعتمادها للبدء بالتصنيع الفوري.'
                    : 'Our craft artisans prepared your digital proof and sent a copy to your account and WhatsApp. Please review and approve to begin production.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto relative z-10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('proofs');
                  dismissProofNotification();
                }}
                className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                {isAr ? 'معاينة واعتماد التصميم الآن 🎨' : 'Review Design Proof Now'}
              </button>

              <a
                href={`https://wa.me/9647800000000?text=${encodeURIComponent(
                  isAr
                    ? 'مرحباً استوديو نون والقلم، بخصوص بروفة التصميم المرسلة لحسابي أود متابعتها معكم واعتمادها.'
                    : 'Hello Noon & Pen, regarding the design proof sent to my account.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs sm:text-sm font-bold shrink-0"
                title={isAr ? 'تواصل فوري عبر واتساب' : 'WhatsApp'}
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Approval Success Toast notification */}
        {approvalToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{approvalToast}</span>
            </div>
            <button
              onClick={() => setApprovalToast(null)}
              className="p-1 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'overview'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'نظرة عامة والنشاط' : 'Overview & Activity'}</span>
          </button>

          {/* Dedicated Tab: Digital Proofs */}
          <button
            onClick={() => {
              setActiveTab('proofs');
              dismissProofNotification();
            }}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'proofs'
                ? 'border-amber-600 text-amber-900 bg-amber-50/70 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'بروفات التصاميم الرقمية' : 'Digital Proofs'}</span>
            {pendingProofsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                {pendingProofsCount} {isAr ? 'بانتظار الاعتماد' : 'Pending'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono">
                {digitalProofs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'سجل الطلبات وتتبع التصنيع' : 'Order History & Tracking'}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono">
              {pastOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('designs')}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'designs'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderHeart className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'التصاميم والشعارات المحفوظة' : 'Saved Designs & Logos'}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono">
              {savedDesigns.length}
            </span>
          </button>

          {/* DEDICATED TAB: WISHLIST (قائمة الرغبات والمفضلة) */}
          <button
            onClick={() => setActiveTab('wishlist')}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'wishlist'
                ? 'border-rose-500 text-rose-950 bg-rose-50/70 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{isAr ? 'قائمة الرغبات والمفضلة' : 'Wishlist & Favorites'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
              wishlist.length > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {wishlist.length}
            </span>
          </button>

          {/* DEDICATED TAB: LOYALTY POINTS & REWARDS (نقاط الولاء والمكافآت) */}
          <button
            onClick={() => setActiveTab('loyalty')}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'loyalty'
                ? 'border-amber-600 text-amber-950 bg-amber-50/80 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className={`w-4 h-4 ${activeTab === 'loyalty' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>{isAr ? 'نقاط الولاء والمكافآت' : 'Loyalty & Rewards'}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 tabular-nums">
              {loyaltyPoints.toLocaleString()}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'profile'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'إدارة الحساب والعناوين' : 'Profile & Addresses'}</span>
          </button>
        </div>

        {/* TAB 0: DASHBOARD OVERVIEW & QUICK ACTIONS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome banner with quick stats */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'منصة العملاء المتقدمة' : 'Noon & Pen VIP Client Portal'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {isAr ? `أهلاً وسهلاً بك، ${user?.fullName?.split(' ')[0] || 'عزيزنا العميل'}!` : `Welcome back, ${user?.fullName || 'Customer'}!`}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {isAr
                    ? 'تابع دورة تصنيع مجسمات الأكريليك وكروت البصمة الخاصة بك مباشرة من ورشتنا في بغداد، أو ابدأ تصميماً جديداً بضغطة زر.'
                    : 'Track your custom acrylic signs and foil business cards directly from our Baghdad fabrication facility, or initiate a new bespoke project.'}
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (onOpenCustomizerWithProduct) {
                        onOpenCustomizerWithProduct('prod-acrylic-led-sign');
                      } else {
                        onBackToShop();
                      }
                    }}
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAr ? 'بدء تخصيص منتج جديد' : 'Start a New Customization'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (pastOrders[0]) {
                        handleWhatsAppTrack(pastOrders[0]);
                      }
                    }}
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? 'تتبع آخر طلب (#NP)' : 'Track an Order'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-amber-300" />
                    <span>{isAr ? 'عرض كافة الطلبات' : 'View All Orders'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* FEATURED: Customer Loyalty Points Progress Bar & Tier Spotlight */}
            <LoyaltyPointsTracker
              variant="compact"
              onSelectTab={(tab) => setActiveTab(tab as any)}
              onNavigateToShop={onBackToShop}
            />

            {/* FEATURED: Live Manufacturing Pipeline Spotlight for Latest Order */}
            {pastOrders[0] && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{isAr ? 'مسار تصنيع طلبك النشط (تتبع بصري وتفاعلي مباشر)' : 'Live Active Order Manufacturing Timeline'}</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isAr
                        ? 'متابعة حية لمراحل تصنيع طلبك في ورشتنا: قيد المراجعة، قيد التصميم، في المطبعة، وجاهز للشحن'
                        : 'Real-time interactive tracking across all milestones: Under Review, Designing, In Printing, and Ready for Shipping'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    type="button"
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                  >
                    {isAr ? 'عرض كافة الطلبات ←' : 'View all orders →'}
                  </button>
                </div>

                <OrderManufacturingTracker
                  order={pastOrders[0]}
                  variant="spotlight"
                  allowInteractiveSimulation={true}
                />
              </div>
            )}

            {/* Recent Orders Spotlight */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {isAr ? 'كافة الطلبات المسجلة وحالة التصنيع' : 'All Orders & Fabrication Status'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'نظرة سريعة على كافة طلباتك ومراحلها الفنية في خطوط الإنتاج' : 'Quick overview of custom products in production queues'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('orders')}
                  type="button"
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                >
                  {isAr ? 'عرض السجل الكامل ←' : 'View full history →'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastOrders.map((ord) => {
                  const currentStage =
                    MANUFACTURING_STAGES.find((s) => s.id === (ord.manufacturingStatus || 'under_review')) ||
                    MANUFACTURING_STAGES[0];
                  const StageIcon = currentStage.icon;

                  return (
                    <div
                      key={ord.orderId}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all bg-slate-50/50 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">{ord.orderId}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 shadow-2xs ${currentStage.badgeBg} ${currentStage.badgeText}`}>
                            <StageIcon className="w-3 h-3" />
                            <span>{isAr ? currentStage.shortAr : currentStage.shortEn}</span>
                          </span>
                        </div>

                        {/* Compact Progress Bar */}
                        <OrderManufacturingTracker order={ord} variant="compact" />

                        <div className="space-y-2 pt-1">
                          {ord.items.map((it) => (
                            <div key={it.id} className="flex items-center gap-2.5">
                              <img src={it.image} alt={it.titleAr} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h5 className="font-bold text-xs text-slate-900 truncate">{isAr ? it.titleAr : it.titleEn}</h5>
                                <p className="text-[11px] text-slate-500 font-mono">
                                  {it.quantity} {isAr ? 'قطع' : 'pcs'} · {it.totalPrice.toLocaleString()} IQD
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">{ord.createdAt.split(' ')[0]}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setActiveTab('orders');
                              setExpandedOrderId(ord.orderId);
                            }}
                            type="button"
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isAr ? 'تفاصيل المسار' : 'Track'}</span>
                          </button>
                          <button
                            onClick={() => handleWhatsAppTrack(ord)}
                            type="button"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title={isAr ? 'تتبع واتساب' : 'WhatsApp'}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: DIGITAL DESIGN PROOFS (بروفات التصاميم الرقمية) */}
        {activeTab === 'proofs' && (
          <div className="space-y-6 animate-fade-in">
            {/* Explanatory Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'قسم بروفات التصاميم الرقمية والاعتماد' : 'Digital Proof Review & Approval Studio'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {isAr ? 'بروفات التصاميم المرسلة لحسابك من ورشتنا' : 'Design Proofs Sent to Your Account'}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                  {isAr
                    ? 'تصميم المنتج من اختصاص كادر نُون والقَلَم: بعد تقديم طلبك ورفع بياناتك، يقوم خطاطونا ومهندسونا بإعداد مسودة التصميم وإرسال نسخة هنا لحسابك مع إشعار تنبيهي بأعلى الموقع، بالإضافة لإرسال نسخة على واتساب للاعتماد السريع قبل بدء التصنيع والقص.'
                    : 'Bespoke design is handcrafted by Noon & Pen artisans: review your digital proof here, approve for production, or request adjustments before precision fabrication starts.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/9647800000000?text=${encodeURIComponent(isAr ? 'مرحباً استوديو نون والقلم، أود الاستفسار عن حالة بروفة التصميم الخاصة بطلبي.' : 'Hello Noon & Pen, inquiry regarding my design proof.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>{isAr ? 'مراسلة الورشة عبر واتساب' : 'Chat via WhatsApp'}</span>
                </a>
              </div>
            </div>

            {/* Proofs List */}
            {digitalProofs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 space-y-4">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-800 text-base">
                  {isAr ? 'لا توجد بروفات تصاميم مسجلة حالياً' : 'No design proofs recorded yet'}
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {isAr
                    ? 'عندما تطلب أي منتج وترفع بياناتك، سيقوم فريق التصميم بإعداد البروفة وإرسالها مباشرة إلى هذا القسم.'
                    : 'When you place an order with your data, our craft engineers will upload your digital proof directly here.'}
                </p>
                <button
                  onClick={onBackToShop}
                  type="button"
                  className="px-6 py-2.5 rounded-xl bg-amber-900 text-white font-bold text-xs hover:bg-amber-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'تصفح المنتجات وبدء طلب جديد' : 'Browse Products'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {digitalProofs.map((proof) => {
                  const isPending = proof.status === 'pending_approval';
                  const isApproved = proof.status === 'approved';
                  const isRevision = proof.status === 'revision_requested';

                  return (
                    <div
                      key={proof.id}
                      className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
                        isPending
                          ? 'border-amber-400/80 ring-2 ring-amber-400/20 shadow-md'
                          : 'border-slate-200/90'
                      }`}
                    >
                      <div>
                        {/* Proof Image Box */}
                        <div className="relative aspect-16/10 bg-slate-950 overflow-hidden group select-none">
                          <img
                            src={proof.previewUrl}
                            alt={isAr ? proof.productTitleAr : proof.productTitleEn}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                            onClick={() => setSelectedProofPreview(proof.previewUrl)}
                          />

                          {/* Status Badge */}
                          <div className="absolute top-3.5 start-3.5">
                            {isPending && (
                              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 animate-pulse">
                                <span>⏳</span>
                                <span>{isAr ? 'بانتظار موافقتك للاعتماد' : 'Pending Your Approval'}</span>
                              </span>
                            )}
                            {isApproved && (
                              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-md flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isAr ? 'معتمد للتصنيع الفوري' : 'Approved for Production'}</span>
                              </span>
                            )}
                            {isRevision && (
                              <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-black shadow-md flex items-center gap-1.5">
                                <span>✏️</span>
                                <span>{isAr ? 'جاري تنفيذ التعديلات المطلوبة' : 'Revision in Progress'}</span>
                              </span>
                            )}
                          </div>

                          {/* Fullscreen Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedProofPreview(proof.previewUrl)}
                            className="absolute top-3.5 end-3.5 p-2 rounded-xl bg-slate-950/70 backdrop-blur-md text-white hover:text-amber-300 transition-colors cursor-pointer border border-white/20"
                            title={isAr ? 'معاينة ملء الشاشة' : 'Fullscreen'}
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>

                          {/* Order ID Pill */}
                          <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 text-xs font-mono font-bold">
                            #{proof.orderId}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-3.5">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-extrabold text-base text-slate-900 line-clamp-1">
                                {isAr ? proof.productTitleAr : proof.productTitleEn}
                              </h4>
                              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                                {proof.createdAt}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                              <strong className="text-slate-800 block mb-0.5">{isAr ? 'المواصفات والأبعاد المعتمدة:' : 'Specs:'}</strong>
                              {isAr ? proof.specsAr : proof.specsEn}
                            </p>

                            {proof.clientNotes && (
                              <p className="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 mt-2 font-medium">
                                <strong className="block mb-0.5">{isAr ? 'ملاحظات وتعديلات العميل:' : 'Client Notes:'}</strong>
                                {proof.clientNotes}
                              </p>
                            )}
                          </div>

                          {/* Inline revision form */}
                          {activeRevisionId === proof.id && (
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-scale">
                              <label className="text-xs font-bold text-slate-800 block">
                                {isAr ? 'اكتب التعديلات المطلوبة على البروفة بالتفصيل:' : 'Specify required adjustments:'}
                              </label>
                              <textarea
                                rows={3}
                                value={revisionComment}
                                onChange={(e) => setRevisionComment(e.target.value)}
                                placeholder={isAr ? 'مثال: أرجو تصغير الشعار قليلاً وتغيير لون الخط إلى الذهبي' : 'e.g. Slightly decrease logo size'}
                                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveRevisionId(null);
                                    setRevisionComment('');
                                  }}
                                  className="px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-200"
                                >
                                  {isAr ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!revisionComment.trim()) return;
                                    requestProofRevision(proof.id, revisionComment);
                                    setActiveRevisionId(null);
                                    setRevisionComment('');
                                    setApprovalToast(
                                      isAr
                                        ? `تم إرسال طلب التعديل لطلبك #${proof.orderId}. سيقوم فريقنا بتحديث البروفة فوراً!`
                                        : `Adjustment request sent for #${proof.orderId}`
                                    );
                                  }}
                                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                                >
                                  {isAr ? 'إرسال التعديل للورشة' : 'Send Revisions'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-5 pt-0 space-y-2">
                        {isPending && activeRevisionId !== proof.id && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                approveDigitalProof(proof.id);
                                setApprovalToast(
                                  isAr
                                    ? `تهانينا! تم اعتماد تصميم طلب #${proof.orderId} بنجاح، وبدأت عملية التصنيع في الورشة!`
                                    : `Design approved for #${proof.orderId}! Fabrication initiated.`
                                );
                              }}
                              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01]"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isAr ? 'اعتماد التصميم للتصنيع ✅' : 'Approve for Production'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveRevisionId(proof.id);
                                setRevisionComment(proof.clientNotes || '');
                              }}
                              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>✏️</span>
                              <span>{isAr ? 'طلب تعديل على البروفة' : 'Request Adjustments'}</span>
                            </button>
                          </div>
                        )}

                        {/* WhatsApp Direct Send Link */}
                        <a
                          href={`https://wa.me/9647800000000?text=${encodeURIComponent(
                            isAr
                              ? `مرحباً استوديو نون والقلم، بخصوص بروفة تصميم طلب رقم *#${proof.orderId}* (${proof.productTitleAr})\nالحالة: ${isApproved ? 'معتمد للتصنيع' : 'بانتظار المتابعة'}\nالمواصفات: ${proof.specsAr}\nأرجو المتابعة والتأكيد.`
                              : `Hello Noon & Pen, regarding design proof for order #${proof.orderId}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          <span>{isAr ? 'إرسال نسخة ومناقشة البروفة على واتساب 💬' : 'Send Copy & Chat on WhatsApp 💬'}</span>
                        </a>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: ORDER HISTORY & PRODUCTION TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Manufacturing Milestone Filter Tabs */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                  <span>{isAr ? 'تصفية الطلبات بحسب مسار تصنيع الطلب في الورشة:' : 'Filter by Workshop Manufacturing Stage:'}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {pastOrders.length} {isAr ? 'طلبات مسجلة' : 'total orders'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setOrderStatusFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    orderStatusFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{isAr ? 'كافة الطلبات' : 'All Orders'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                    {pastOrders.length}
                  </span>
                </button>

                {MANUFACTURING_STAGES.map((stage) => {
                  const count = pastOrders.filter(
                    (o) => (o.manufacturingStatus || 'under_review') === stage.id
                  ).length;
                  const isSelected = orderStatusFilter === stage.id;
                  const StageIcon = stage.icon;

                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setOrderStatusFilter(stage.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <StageIcon className="w-3.5 h-3.5" />
                      <span>{isAr ? stage.shortAr : stage.shortEn}</span>
                      {count > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {pastOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 space-y-4">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-800 text-base">
                  {isAr ? 'لا توجد طلبات سابقة مسجلة' : 'No past orders recorded yet'}
                </p>
                <button
                  onClick={onBackToShop}
                  type="button"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                >
                  {isAr ? 'تصفح المتجر وابدأ أول طلب' : 'Explore Shop & Place First Order'}
                </button>
              </div>
            ) : (
              (() => {
                const displayedOrders =
                  orderStatusFilter === 'all'
                    ? pastOrders
                    : pastOrders.filter(
                        (ord) => (ord.manufacturingStatus || 'under_review') === orderStatusFilter
                      );

                if (displayedOrders.length === 0) {
                  return (
                    <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
                      <p className="font-bold text-slate-800 mb-2">
                        {isAr ? 'لا توجد طلبات في هذه المرحلة المحددة حالياً' : 'No orders in this stage currently'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('all')}
                        className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                      >
                        {isAr ? 'عرض كافة الطلبات' : 'Show All Orders'}
                      </button>
                    </div>
                  );
                }

                return displayedOrders.map((ord, idx) => {
                  const isExpanded = expandedOrderId === ord.orderId;
                  const currentStage =
                    MANUFACTURING_STAGES.find((s) => s.id === (ord.manufacturingStatus || 'under_review')) ||
                    MANUFACTURING_STAGES[0];
                  const StageIcon = currentStage.icon;

                  return (
                    <div
                      key={ord.orderId}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                    >
                      {/* Order Summary Row */}
                      <div
                        onClick={() => setExpandedOrderId(isExpanded ? null : ord.orderId)}
                        className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono font-extrabold text-slate-900 text-base">
                                {ord.orderId}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1.5 shadow-2xs ${currentStage.badgeBg} ${currentStage.badgeText}`}>
                                <StageIcon className="w-3.5 h-3.5" />
                                <span>{isAr ? currentStage.titleAr : currentStage.titleEn}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5" />
                                {ord.createdAt}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>
                                {ord.items.length} {isAr ? 'منتج مخصص' : 'custom items'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                          <div className="text-start md:text-end">
                            <span className="text-[11px] text-slate-400 block">{isAr ? 'إجمالي الطلب:' : 'Total:'}</span>
                            <span className="font-extrabold text-base text-amber-800 font-mono">
                              {ord.grandTotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                            </span>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 justify-end mt-0.5 shadow-2xs">
                              <Coins className="w-3 h-3 text-amber-600 inline" />
                              <span>+{ord.pointsEarned ?? Math.max(10, Math.floor(ord.grandTotal / 1000))} {isAr ? 'نقطة ولاء' : 'pts'}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsAppTrack(ord);
                              }}
                              type="button"
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title={isAr ? 'تتبع عبر واتساب' : 'Track on WhatsApp'}
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.print();
                              }}
                              type="button"
                              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                              title={isAr ? 'طباعة الفاتورة' : 'Download Invoice'}
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Order Details */}
                      {isExpanded && (
                        <div className="p-6 bg-slate-50/70 border-t border-slate-100 space-y-6 animate-fade-in">
                          {/* Visual Interactive Manufacturing Tracking Pipeline */}
                          <OrderManufacturingTracker
                            order={ord}
                            variant="detailed"
                            allowInteractiveSimulation={true}
                          />

                        {/* Items in this Order */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            {isAr ? 'المنتجات والمواصفات المصنعة:' : 'Fabricated Items in this Order:'}
                          </h4>
                          <div className="space-y-2">
                            {ord.items.map((it) => (
                              <div key={it.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <img src={it.image} alt={it.titleAr} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                  <div>
                                    <h5 className="font-bold text-sm text-slate-900">{isAr ? it.titleAr : it.titleEn}</h5>
                                    <div className="text-xs text-slate-600 space-y-0.5 mt-1">
                                      {it.customOptions.customText && (
                                        <p><strong>{isAr ? 'النص:' : 'Text:'}</strong> "{it.customOptions.customText}"</p>
                                      )}
                                      <p>
                                        <strong>{isAr ? 'المقاس:' : 'Size:'}</strong> {isAr ? it.customOptions.dimensionLabelAr : it.customOptions.dimensionLabelEn}
                                      </p>
                                      <p>
                                        <strong>{isAr ? 'الخامة:' : 'Material:'}</strong> {isAr ? it.customOptions.materialLabelAr : it.customOptions.materialLabelEn}
                                      </p>
                                      {it.customOptions.logoFileName && (
                                        <p className="text-amber-800 font-mono text-[11px]">📎 {it.customOptions.logoFileName}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-start sm:text-end">
                                  <span className="text-xs text-slate-500 block">
                                    {it.quantity} {isAr ? 'قطع' : 'pcs'}
                                  </span>
                                  <span className="font-bold text-sm text-slate-900 font-mono">
                                    {it.totalPrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Destination & Actions */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                          <div>
                            <span className="font-bold text-slate-900 block mb-0.5">{isAr ? 'عنوان الاستلام والتوصيل:' : 'Delivery Address:'}</span>
                            <span>{ord.shipping.fullName} · {ord.shipping.phone} · {ord.shipping.address} ({ord.shipping.governorate})</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block mb-0.5">{isAr ? 'بوابة السداد:' : 'Payment:'}</span>
                            <span className="font-mono text-amber-800 font-semibold">{ord.paymentDetails.gatewayNameAr} ({ord.paymentDetails.transactionId})</span>
                          </div>
                        </div>

                        {/* Order Actions: Reorder and Invoice */}
                        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadInvoice(ord);
                            }}
                            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4 text-slate-500" />
                            <span>{isAr ? 'تحميل الفاتورة الضريبية (PDF)' : 'Download Invoice (PDF)'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorder(ord);
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Repeat className="w-4 h-4" />
                            <span>{isAr ? 'إعادة طلب هذه المنتجات المخصصة' : 'Re-order this Custom Order'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()
          )}
        </div>
      )}

        {/* TAB 2: SAVED DESIGNS LIBRARY */}
        {activeTab === 'designs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {isAr ? 'مكتبة الشعارات والتصاميم المرفوعة' : 'Saved Logos & Vector Artworks'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? 'يمكنك استخدام أي شعار محفوظ لإعادة الطلب بضغطة زر دون الحاجة لرفعه مجدداً' : 'Re-order custom products using previously uploaded vectors and assets'}
                </p>
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'رفع تصميم جديد' : 'Upload Design'}</span>
              </button>
            </div>

            {/* Designs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedDesigns.map((des) => (
                <div
                  key={des.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-16/10 w-full rounded-2xl bg-slate-950 overflow-hidden mb-3">
                      <img src={des.previewUrl} alt={des.titleAr} className="w-full h-full object-cover opacity-80" />
                      <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded bg-white/90 text-[10px] font-mono font-bold uppercase text-slate-900">
                        {des.fileType}
                      </span>
                    </div>

                    {editingDesignId === des.id ? (
                      <div className="flex items-center gap-1.5 mb-2">
                        <input
                          type="text"
                          value={editingTitleText}
                          onChange={(e) => setEditingTitleText(e.target.value)}
                          className="flex-1 px-2 py-1 text-xs rounded-lg border border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editingTitleText.trim()) {
                              renameSavedDesign(des.id, editingTitleText.trim());
                            }
                            setEditingDesignId(null);
                          }}
                          className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          title={isAr ? 'حفظ الاسم' : 'Save'}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDesignId(null)}
                          className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
                          title={isAr ? 'إلغاء' : 'Cancel'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {isAr ? des.titleAr : des.titleEn}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDesignId(des.id);
                            setEditingTitleText(isAr ? des.titleAr : des.titleEn);
                          }}
                          className="p-1 text-slate-400 hover:text-amber-700 transition-colors"
                          title={isAr ? 'تعديل اسم التصميم' : 'Rename artwork'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 space-y-0.5 mt-2 font-mono">
                      <p>📎 {des.fileName}</p>
                      <p className="text-[11px] text-slate-400">{des.fileSize} · {des.uploadedAt}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (des.productId && onOpenCustomizerWithProduct) {
                          onOpenCustomizerWithProduct(des.productId);
                        } else {
                          onBackToShop();
                        }
                      }}
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isAr ? 'اطلب تصنيع بهذا الشعار' : 'Re-order with this Logo'}</span>
                    </button>

                    <button
                      onClick={() => deleteSavedDesign(des.id)}
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title={isAr ? 'حذف من المكتبة' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Design Modal */}
            {showUploadModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-slate-900">
                      {isAr ? 'رفع شعار أو تصميم جديد للمكتبة' : 'Upload New Design to Library'}
                    </h4>
                    <button onClick={() => setShowUploadModal(false)} type="button" className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddDesignSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                        {isAr ? 'عنوان الشعار / اسم المشروع:' : 'Artwork Title:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newDesignTitle}
                        onChange={(e) => setNewDesignTitle(e.target.value)}
                        placeholder={isAr ? 'مثال: شعار مطعم بغداد الجديد' : 'e.g. Restaurant Logo 2026'}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                        {isAr ? 'فئة المنتج المقترحة:' : 'Product Category:'}
                      </label>
                      <select
                        value={newDesignCategory}
                        onChange={(e) => setNewDesignCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="led">{isAr ? 'لوحات وإضاءة LED' : 'LED Acrylic Signs'}</option>
                        <option value="boxes">{isAr ? 'علب وتغليف فاخر' : 'Luxury Packaging'}</option>
                        <option value="cards">{isAr ? 'كروت أعمال وبصمة' : 'Business Cards'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                        {isAr ? 'اختيار الملف (SVG, AI, PDF, PNG):' : 'Select Artwork File:'}
                      </label>
                      <input
                        type="file"
                        required
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedFileName(file.name);
                        }}
                        className="w-full text-xs text-slate-600 file:me-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20"
                      >
                        {isAr ? 'حفظ في المكتبة' : 'Save to Library'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: WISHLIST & FAVORITES (قائمة الرغبات والمفضلة) */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{isAr ? 'قائمة الرغبات والمفضلة المحفوظة' : 'Saved Wishlist & Favorites'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {isAr ? 'المنتجات التي قمت بحفظها للرجوع إليها لاحقاً' : 'Products Saved to Your Wishlist'}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                  {isAr
                    ? 'يمكنك معاينة مواصفات كل قطعة، أو تخصيصها وطلبها فوراً، أو إضافتها بضغطة زر إلى سلة مشترياتك.'
                    : 'Easily return to your favorite bespoke models, configure dimensions and illumination, or move directly to cart.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onBackToShop}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'استكشاف المزيد من المتجر' : 'Explore More Products'}</span>
                </button>
              </div>
            </div>

            {/* Wishlist Items Grid */}
            {wishlistedProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-lg">
                  {isAr ? 'قائمة رغباتك فارغة حالياً' : 'Your wishlist is currently empty'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'أثناء تصفحك للمتجر أو صفحة تفاصيل أي منتج، اضغط على أيقونة القلب ❤️ لحفظ المنتجات في حسابك والرجوع إليها في أي وقت.'
                    : 'While exploring our catalog or product pages, tap the heart icon ❤️ to save items to your account.'}
                </p>
                <button
                  onClick={onBackToShop}
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:shadow-lg transition-all cursor-pointer"
                >
                  {isAr ? 'تصفح كتالوج المتجر الآن' : 'Browse Shop Catalog'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden">
                        <img
                          src={prod.image}
                          alt={isAr ? prod.titleAr : prod.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 start-3 px-3 py-1 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold rounded-lg shadow-2xs">
                          {isAr ? prod.categoryLabelAr : prod.categoryLabelEn}
                        </div>

                        {/* Remove from Wishlist Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFromWishlist(prod.id, isAr ? prod.titleAr : prod.titleEn)}
                          className="absolute top-3 end-3 w-8 h-8 rounded-xl bg-white/95 hover:bg-rose-50 text-rose-500 flex items-center justify-center transition-all cursor-pointer shadow-md"
                          title={isAr ? 'حذف من قائمة الرغبات' : 'Remove from wishlist'}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>

                        <div className="absolute bottom-3 end-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#87CEEB]" />
                          <span>{isAr ? prod.leadTimeAr : prod.leadTimeEn}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h4 className="font-extrabold text-base text-slate-950 leading-snug line-clamp-1">
                          {isAr ? prod.titleAr : prod.titleEn}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {isAr ? prod.descriptionAr : prod.descriptionEn}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">
                              {isAr ? 'السعر الأساسي يبدأ من' : 'Base price from'}
                            </span>
                            <span className="font-mono font-black text-slate-900 text-base">
                              {formatPrice(prod.basePrice, { isAr })}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            {isAr ? 'ضمان ورشة نون والقلم' : 'Atelier Guaranteed'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenCustomizerWithProduct) {
                              onOpenCustomizerWithProduct(prod.id);
                            } else {
                              onBackToShop();
                            }
                          }}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                          <span>{isAr ? 'تخصيص وطلب' : 'Customize'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToCartFromWishlist(prod)}
                          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                          <span>{isAr ? 'أضف للسلة' : 'Add to Cart'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromWishlist(prod.id, isAr ? prod.titleAr : prod.titleEn)}
                        className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        {isAr ? 'إزالة من قائمة الرغبات' : 'Remove from wishlist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE MANAGEMENT & DEFAULT ADDRESSES */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs max-w-2xl animate-fade-in space-y-6">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                {isAr ? 'بيانات الحساب والعنوان الافتراضي' : 'Profile & Default Delivery Address'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isAr ? 'يتم استخدام هذه البيانات تلقائياً لملء حقول الشحن والتواصل عبر واتساب' : 'Pre-fills your checkout details and WhatsApp communications'}
              </p>
            </div>

            {profileSavedToast && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'تم حفظ التعديلات بنجاح!' : 'Profile updated successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'الاسم الكامل:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'رقم الهاتف / واتساب:' : 'Phone / WhatsApp:'}
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'المحافظة:' : 'Governorate:'}
                </label>
                <select
                  value={editGovernorate}
                  onChange={(e) => setEditGovernorate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'العنوان التفصيلي (المنطقة والشارع):' : 'Detailed Address in Iraq:'}
                </label>
                <textarea
                  rows={3}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                >
                  {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: DEDICATED LOYALTY POINTS & REWARDS PROGRAM */}
        {activeTab === 'loyalty' && (
          <LoyaltyPointsTracker
            variant="full"
            onNavigateToShop={onBackToShop}
          />
        )}
      </div>

      {/* Fullscreen Proof Preview Modal */}
      {selectedProofPreview && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedProofPreview(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedProofPreview(null)}
            className="absolute top-6 end-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden p-2 shadow-2xl border border-white/20">
            <img
              src={selectedProofPreview}
              alt="Proof full preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl mx-auto"
            />
            <div className="p-3 text-center text-xs text-white/80 font-bold">
              {isAr ? 'بروفة تصميم معتمدة - اضغط في أي مكان للإغلاق' : 'Official Proof - Click anywhere to close'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
