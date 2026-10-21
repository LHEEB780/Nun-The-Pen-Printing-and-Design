import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCartStore, PaymentMethod, ShippingInfo, OrderRecord } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOffersStore } from '../../store/useOffersStore';
import { useAdminStore } from '../../store/useAdminStore';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Truck,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Send,
  Loader2,
  FileCheck,
  ExternalLink,
  Lock,
  Sparkles,
  MapPin,
  Phone,
  User,
  Tag,
} from 'lucide-react';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderSuccess: (order: OrderRecord) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToCart,
  onOrderSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { items, getSubtotal, clearCart, setLastOrder } = useCartStore();
  const { user } = useAuthStore();
  const { offers } = useOffersStore();
  const { addOrder: addAdminOrder } = useAdminStore();

  const subtotal = getSubtotal();

  // Wizard Steps: 1: Shipping, 2: Review, 3: Payment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Shipping Form State (Auto-fill from user profile if available)
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [governorate, setGovernorate] = useState(user?.governorate || 'بغداد - الكرخ');
  const [address, setAddress] = useState(user?.address || '');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  const [notes, setNotes] = useState('');

  // Promo code redemption (validated against active, non-expired seasonal offers)
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);

  const applyPromoCode = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const now = new Date();
    const match = offers.find(
      (o) =>
        o.promoCode?.toUpperCase() === code &&
        o.isActive &&
        (!o.expiresAt || new Date(`${o.expiresAt}T23:59:59`) >= now)
    );
    if (match) {
      setAppliedPromo({ code, discountPercent: match.discountPercentage });
      toast.success(
        isAr
          ? `تم تطبيق كود الخصم ${code} — خصم ${match.discountPercentage}% على مجموع المنتجات`
          : `Promo code ${code} applied — ${match.discountPercentage}% off subtotal`
      );
    } else {
      setAppliedPromo(null);
      toast.error(
        isAr
          ? `كود الخصم "${code}" غير صالح أو منتهي الصلاحية`
          : `Promo code "${code}" is invalid or expired`
      );
    }
  };

  const promoDiscountIQD = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;

  // Step 2: Proof approval agreement
  const [proofApproved, setProofApproved] = useState(true);

  // Step 3: Payment Gateway Selection
  const [selectedGateway, setSelectedGateway] = useState<PaymentMethod>('zaincash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('');

  // Payment field states
  const [zainCashPhone, setZainCashPhone] = useState('');
  const [zainCashPin, setZainCashPin] = useState('');
  const [stripeCardName, setStripeCardName] = useState('');
  const [stripeCardNumber, setStripeCardNumber] = useState('4242 •••• •••• 4242');
  const [stripeExpiry, setStripeExpiry] = useState('12/28');
  const [stripeCvc, setStripeCvc] = useState('888');

  // Governorates in Iraq
  const governorates = [
    { id: 'bg-karkh', nameAr: 'بغداد - الكرخ', nameEn: 'Baghdad - Karkh', isBaghdad: true },
    { id: 'bg-rusafa', nameAr: 'بغداد - الرصافة', nameEn: 'Baghdad - Rusafa', isBaghdad: true },
    { id: 'basra', nameAr: 'البصرة', nameEn: 'Basra', isBaghdad: false },
    { id: 'erbil', nameAr: 'أربيل', nameEn: 'Erbil', isBaghdad: false },
    { id: 'najaf', nameAr: 'النجف الأشرف', nameEn: 'Najaf', isBaghdad: false },
    { id: 'karbala', nameAr: 'كربلاء المقدسة', nameEn: 'Karbala', isBaghdad: false },
    { id: 'sulaymaniyah', nameAr: 'السليمانية', nameEn: 'Sulaymaniyah', isBaghdad: false },
    { id: 'nineveh', nameAr: 'نينوى / الموصل', nameEn: 'Nineveh / Mosul', isBaghdad: false },
    { id: 'babylon', nameAr: 'بابل / الحلة', nameEn: 'Babylon / Hillah', isBaghdad: false },
    { id: 'kirkuk', nameAr: 'كركوك', nameEn: 'Kirkuk', isBaghdad: false },
    { id: 'anbar', nameAr: 'الأنبار', nameEn: 'Anbar', isBaghdad: false },
    { id: 'dhiqar', nameAr: 'ذي قار / الناصرية', nameEn: 'Dhi Qar', isBaghdad: false },
    { id: 'diyala', nameAr: 'ديالى / بعقوبة', nameEn: 'Diyala', isBaghdad: false },
    { id: 'maysan', nameAr: 'ميسان / العمارة', nameEn: 'Maysan', isBaghdad: false },
    { id: 'muthanna', nameAr: 'المثنى / السماوة', nameEn: 'Muthanna', isBaghdad: false },
    { id: 'qadisiyyah', nameAr: 'القادسية / الديوانية', nameEn: 'Qadisiyyah', isBaghdad: false },
    { id: 'wasit', nameAr: 'واسط / الكوت', nameEn: 'Wasit', isBaghdad: false },
    { id: 'salahaddin', nameAr: 'صلاح الدين / تكريت', nameEn: 'Salah al-Din', isBaghdad: false },
    { id: 'duhok', nameAr: 'دهوك', nameEn: 'Duhok', isBaghdad: false },
  ];

  // Calculate Shipping fee
  const shippingCost = useMemo(() => {
    const isBaghdad = governorate.includes('بغداد') || governorate.toLowerCase().includes('baghdad');
    // Express delivery always carries its flat premium fee
    if (deliveryType === 'express') return 10000;
    // Free standard shipping threshold for large custom orders
    if (subtotal >= 150000) return 0;
    return isBaghdad ? 5000 : 8000;
  }, [governorate, deliveryType, subtotal]);

  const grandTotal = Math.max(0, subtotal - promoDiscountIQD + shippingCost);

  // Placeholder Payment Handlers
  const processZainCashPayment = async (): Promise<{ success: boolean; transactionId: string }> => {
    setProcessingStatusText(isAr ? 'جارٍ الاتصال بمحفظة زين كاش وتأكيد العملية...' : 'Connecting to ZainCash Wallet API...');
    await new Promise((res) => setTimeout(res, 1400));
    return { success: true, transactionId: `ZC-${Math.floor(1000000 + Math.random() * 9000000)}` };
  };

  const processFIBPayment = async (): Promise<{ success: boolean; transactionId: string }> => {
    setProcessingStatusText(isAr ? 'جارٍ التحقق من إشعار الدفع عبر تطبيق المصرف العراقي الأول FIB...' : 'Verifying transaction with First Iraqi Bank API...');
    await new Promise((res) => setTimeout(res, 1400));
    return { success: true, transactionId: `FIB-${Math.floor(1000000 + Math.random() * 9000000)}` };
  };

  const processCODPayment = async (): Promise<{ success: boolean; transactionId: string }> => {
    setProcessingStatusText(isAr ? 'جارٍ تسجيل أمر الدفع عند الاستلام وجدولة شحن الطلب...' : 'Registering Cash on Delivery dispatch manifest...');
    await new Promise((res) => setTimeout(res, 900));
    return { success: true, transactionId: `COD-IRAQ-${Math.floor(100000 + Math.random() * 900000)}` };
  };

  const processStripePayment = async (): Promise<{ success: boolean; transactionId: string }> => {
    setProcessingStatusText(isAr ? 'جارٍ معالجة الدفع الآمن بالبطاقة عبر Stripe...' : 'Securing payment authorization via Stripe...');
    await new Promise((res) => setTimeout(res, 1500));
    return { success: true, transactionId: `ch_${Math.random().toString(36).substring(2, 12)}` };
  };

  const processPayPalPayment = async (): Promise<{ success: boolean; transactionId: string }> => {
    setProcessingStatusText(isAr ? 'جارٍ مصادقة الدفع عبر PayPal Sandbox...' : 'Processing PayPal authorization...');
    await new Promise((res) => setTimeout(res, 1400));
    return { success: true, transactionId: `PAYPAL-TX-${Math.floor(100000 + Math.random() * 900000)}` };
  };

  // Iraqi phone number validation (07XXXXXXXXX / +9647XXXXXXXXX)
  const isValidIraqiPhone = (raw: string): boolean => {
    const normalized = raw.replace(/[\s\-()]/g, '');
    return /^(?:\+?964|0)?7\d{9}$/.test(normalized);
  };

  const handleFinalSubmitPayment = async () => {
    setIsProcessingPayment(true);

    try {
      let result = { success: false, transactionId: '' };

      if (selectedGateway === 'zaincash') {
        result = await processZainCashPayment();
      } else if (selectedGateway === 'fib') {
        result = await processFIBPayment();
      } else if (selectedGateway === 'cod') {
        result = await processCODPayment();
      } else if (selectedGateway === 'stripe') {
        result = await processStripePayment();
      } else if (selectedGateway === 'paypal') {
        result = await processPayPalPayment();
      }

      if (result.success) {
        // Unique, collision-safe Order ID (timestamp-based base36)
        const orderId = `NP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

        const gatewayNames: Record<PaymentMethod, { ar: string; en: string }> = {
          zaincash: { ar: 'زين كاش (ZainCash)', en: 'ZainCash Wallet' },
          fib: { ar: 'المصرف العراقي الأول (FIB)', en: 'First Iraqi Bank (FIB)' },
          cod: { ar: 'الدفع عند الاستلام (COD)', en: 'Cash on Delivery (COD)' },
          stripe: { ar: 'بطاقة ائتمانية (Stripe)', en: 'Credit Card (Stripe)' },
          paypal: { ar: 'باي بال (PayPal)', en: 'PayPal' },
        };

        const completedOrder: OrderRecord = {
          orderId,
          createdAt: new Date().toLocaleDateString(isAr ? 'ar-IQ' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          items: [...items],
          shipping: {
            fullName,
            phone,
            governorate,
            address,
            notes,
            deliveryType,
            shippingCost,
          },
          paymentMethod: selectedGateway,
          paymentDetails: {
            transactionId: result.transactionId,
            status: selectedGateway === 'cod' ? 'pending_cod' : 'paid',
            gatewayNameAr: gatewayNames[selectedGateway].ar,
            gatewayNameEn: gatewayNames[selectedGateway].en,
          },
          subtotal,
          shippingCost,
          grandTotal,
          promoCode: appliedPromo?.code,
          promoDiscountIQD,
        };

        // Mirror the order into the Admin Workshop Pipeline so staff see it immediately
        addAdminOrder(completedOrder);

        setLastOrder(completedOrder);
        clearCart();
        onOrderSuccess(completedOrder);
      }
    } catch (err) {
      console.error('Payment simulation failed:', err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const steps = [
    { num: 1, titleAr: 'بيانات الشحن والعنوان', titleEn: 'Shipping Info' },
    { num: 2, titleAr: 'مراجعة الطلب والبروفة', titleEn: 'Review & Proof' },
    { num: 3, titleAr: 'بوابات الدفع والتأكيد', titleEn: 'Payment Gateway' },
  ];

  if (items.length === 0 && !isProcessingPayment) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl text-center space-y-4 border border-slate-200">
          <p className="font-bold text-slate-800 text-lg">
            {isAr ? 'سلة الطلبات فارغة' : 'Your order cart is empty'}
          </p>
          <p className="text-xs text-slate-500">
            {isAr ? 'يرجى اختيار وتخصيص منتجات أولاً قبل متابعة الدفع.' : 'Please configure custom products before checkout.'}
          </p>
          <button
            onClick={onBackToCart}
            type="button"
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer"
          >
            {isAr ? 'العودة لكتالوج المنتجات' : 'Return to Catalog'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-slate-50/50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBackToCart}
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'الرجوع للمتجر' : 'Back to Store'}</span>
          </button>

          <span className="text-xs text-purple-700 font-bold bg-purple-100 px-3 py-1 rounded-full">
            {isAr ? 'إتمام طلب التصنيع والتنفيذ' : 'Secure Fabrication Checkout'}
          </span>
        </div>

        {/* Multi-Step Wizard Indicator */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 -translate-y-1/2 inset-x-8 h-0.5 bg-slate-200 -z-0" />
            {steps.map((st) => (
              <div key={st.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === st.num
                      ? 'bg-purple-600 text-white ring-4 ring-purple-100 shadow-md'
                      : currentStep > st.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > st.num ? <CheckCircle2 className="w-5 h-5" /> : st.num}
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden sm:block ${
                    currentStep === st.num ? 'text-purple-700 font-bold' : 'text-slate-500'
                  }`}
                >
                  {isAr ? st.titleAr : st.titleEn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Step 1: Shipping Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8 animate-fade-in">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>{isAr ? 'الخطوة الأولى: تفاصيل التوصيل والاستلام' : 'Step 1: Shipping & Delivery Info'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {isAr ? 'عنوان الاستلام في بغداد أو المحافظات' : 'Delivery Address & Contact'}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!fullName.trim() || !phone.trim() || !address.trim()) {
                  toast.error(isAr ? 'يرجى تعبئة جميع الحقول الإلزامية (*)' : 'Please fill all required fields (*)');
                  return;
                }
                if (!isValidIraqiPhone(phone)) {
                  toast.error(
                    isAr
                      ? 'رقم الهاتف غير صحيح — أدخل رقم عراقي صالح مثل 07801234567 أو +9647801234567'
                      : 'Invalid phone — enter a valid Iraqi number e.g. 07801234567 or +9647801234567'
                  );
                  return;
                }
                setCurrentStep(2);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    {isAr ? 'الاسم الكامل للعميل *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isAr ? 'مثال: مصطفى حيدر الربيعي' : 'e.g. Mustafa Hayder'}
                      className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    {isAr ? 'رقم الهاتف / واتساب لتأكيد البروفة *' : 'Phone / WhatsApp for Proof Approval *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+964 780 000 0000"
                      className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {isAr ? 'سنرسل لك صورة البروفة قبل بدء قص الليزر على هذا الرقم' : 'We will send the digital proof sketch to this WhatsApp number'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    {isAr ? 'المحافظة / المدينة *' : 'Governorate / City *'}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {governorates.map((gov) => (
                      <option key={gov.id} value={gov.nameAr}>
                        {isAr ? gov.nameAr : gov.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    {isAr ? 'نوع وسرعة الشحن:' : 'Delivery Priority:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('standard')}
                      className={`p-2.5 rounded-xl border text-xs text-start transition-all cursor-pointer ${
                        deliveryType === 'standard'
                          ? 'border-purple-600 bg-purple-50 font-bold text-purple-900 ring-1 ring-purple-600'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="block">{isAr ? 'شحن اعتيادي' : 'Standard'}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        {subtotal >= 150000 ? (isAr ? 'مجاناً' : 'FREE') : (isAr ? '5,000 - 8,000 د.ع' : '5k - 8k IQD')}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('express')}
                      className={`p-2.5 rounded-xl border text-xs text-start transition-all cursor-pointer ${
                        deliveryType === 'express'
                          ? 'border-purple-600 bg-purple-50 font-bold text-purple-900 ring-1 ring-purple-600'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="block">{isAr ? 'شحن سريع مستعجل' : 'Express Rush'}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        10,000 {isAr ? 'د.ع' : 'IQD'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  {isAr ? 'العنوان التفصيلي (المنطقة، الشارع، أقرب نقطة دالة) *' : 'Detailed Address & Landmark *'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute top-3 start-3.5" />
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={
                      isAr
                        ? 'مثال: بغداد، حي المنصور، شارع 14 رمضان، فرع مطعم الساعة، عمارة الأفق، الطابق 2'
                        : 'e.g. Baghdad, Mansour, 14 Ramadan St, near Al-Saaha, Building 4'
                    }
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  {isAr ? 'ملاحظات إضافية للتوصيل والاستلام:' : 'Delivery Instructions:'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'يرجى الاتصال قبل الوصول بساعة...' : 'Call 1 hour before arrival...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {isAr ? 'كافة القطع مغلفة بصناديق مقواة مضادة للصدمات' : 'All items shipped in shockproof reinforced packaging'}
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{isAr ? 'متابعة لمراجعة الطلب' : 'Proceed to Review'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Wizard Step 2: Review Order & Proof Agreement */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8 animate-fade-in">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
                <FileCheck className="w-4 h-4" />
                <span>{isAr ? 'الخطوة الثانية: مراجعة المواصفات والبروفة' : 'Step 2: Order Specifications & Proof'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {isAr ? 'تأكيد مواصفات المنتجات المخصصة' : 'Review Custom Specifications'}
              </h2>
            </div>

            {/* Itemized List */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.titleAr}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {isAr ? item.titleAr : item.titleEn}
                      </h4>
                      <div className="text-xs text-slate-600 space-y-0.5 mt-1">
                        {item.customOptions.customText && (
                          <p>
                            <strong>{isAr ? 'النص:' : 'Text:'}</strong> "{item.customOptions.customText}"
                          </p>
                        )}
                        <p>
                          <strong>{isAr ? 'المقاس:' : 'Size:'}</strong> {isAr ? item.customOptions.dimensionLabelAr : item.customOptions.dimensionLabelEn}
                        </p>
                        <p>
                          <strong>{isAr ? 'الخامة:' : 'Material:'}</strong> {isAr ? item.customOptions.materialLabelAr : item.customOptions.materialLabelEn}
                        </p>
                        {item.customOptions.ledColorNameAr && (
                          <p className="flex items-center gap-1.5">
                            <strong>{isAr ? 'الإضاءة:' : 'LED:'}</strong>
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.customOptions.ledHex }} />
                            <span>{isAr ? item.customOptions.ledColorNameAr : item.customOptions.ledColorNameEn}</span>
                          </p>
                        )}
                        {item.customOptions.logoFileName && (
                          <p className="text-purple-700 font-semibold font-mono">
                            📎 {item.customOptions.logoFileName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-end sm:border-s sm:border-slate-200 sm:ps-6">
                    <span className="text-xs text-slate-500 block">
                      {item.quantity} {isAr ? 'قطع' : 'pcs'} × {item.unitPrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                    </span>
                    <span className="font-extrabold text-base text-slate-900 font-mono">
                      {item.totalPrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping & Cost Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span>{isAr ? 'مجموع المنتجات:' : 'Subtotal:'}</span>
                <span className="font-mono font-bold">{subtotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}</span>
              </div>

              {/* Promo Code Redemption */}
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-2">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  {isAr ? 'كود الخصم الترويجي (من صفحة العروض)' : 'Promo code (from Seasonal Offers page)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder={isAr ? 'مثال: BOXES25' : 'e.g. BOXES25'}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between mt-2 text-[11px] font-bold text-emerald-700">
                    <span>✓ {appliedPromo.code} (−{appliedPromo.discountPercent}%)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoInput('');
                      }}
                      className="text-slate-400 hover:text-rose-600 underline cursor-pointer"
                    >
                      {isAr ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>

              {promoDiscountIQD > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>{isAr ? `خصم الكود الترويجي (${appliedPromo?.code}):` : `Promo discount (${appliedPromo?.code}):`}</span>
                  <span className="font-mono font-bold">−{promoDiscountIQD.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>
                  {isAr ? 'أجور الشحن والتوصيل (' : 'Delivery Fee ('}
                  {governorate}
                  {'): '}
                </span>
                <span className="font-mono font-bold">
                  {shippingCost === 0 ? (isAr ? 'مجاني (للطلبات +150 ألف)' : 'FREE') : `${shippingCost.toLocaleString()} ${isAr ? 'د.ع' : 'IQD'}`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span>{isAr ? 'المجموع الكلي المطلوب:' : 'Grand Total:'}</span>
                <span className="text-purple-700 font-mono text-base">{grandTotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}</span>
              </div>
            </div>

            {/* Proof Approval Agreement Checkbox */}
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="proof-approval"
                checked={proofApproved}
                onChange={(e) => setProofApproved(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded mt-0.5 cursor-pointer"
              />
              <label htmlFor="proof-approval" className="text-xs text-slate-800 leading-relaxed cursor-pointer">
                <strong>{isAr ? 'ضمان البروفة الرقمية المسبقة: ' : 'Digital Proof Guarantee: '}</strong>
                {isAr
                  ? 'أوافق على استلام صورة ومخطط ثلاثي الأبعاد للمنتج عبر واتساب لاعتماده رسمياً قبل بدء قص الأكريليك بالليزر والطباعة النهائية.'
                  : 'I agree to inspect and approve the digital 3D proof over WhatsApp before laser cutting & physical printing begins.'}
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isAr ? 'تعديل العنوان' : 'Edit Shipping'}
              </button>
              <button
                type="button"
                disabled={!proofApproved}
                onClick={() => setCurrentStep(3)}
                className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                  proofApproved
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{isAr ? 'متابعة لاختيار بوابة الدفع' : 'Proceed to Payment'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Wizard Step 3: Unified Payment Gateways (Local & International) */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8 animate-fade-in relative overflow-hidden">
            {/* Processing Spinner Overlay */}
            {isProcessingPayment && (
              <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <h3 className="font-bold text-lg text-slate-900">
                  {isAr ? 'جارٍ معالجة الدفع...' : 'Processing Payment...'}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm">
                  {processingStatusText}
                </p>
                <span className="text-[11px] text-slate-400">
                  {isAr ? 'يرجى الانتظار، لا تغلق هذه الصفحة' : 'Please wait, do not close or refresh'}
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
                <CreditCard className="w-4 h-4" />
                <span>{isAr ? 'الخطوة الثالثة: بوابات الدفع الإلكتروني المعتمدة' : 'Step 3: Secure Payment Gateways'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {isAr ? 'اختر طريقة الدفع المناسبة' : 'Select Payment Gateway'}
              </h2>
            </div>

            {/* Gateway Category: Local Iraq */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'بوابات الدفع المحلية في العراق:' : 'Local Iraqi Payment Options:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. ZainCash */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('zaincash')}
                  className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    selectedGateway === 'zaincash'
                      ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                        ZainCash
                      </span>
                      <Phone className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {isAr ? 'زين كاش العراق' : 'ZainCash Iraq'}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {isAr ? 'دفع فوري عبر محفظة زين كاش' : 'Direct mobile wallet payment'}
                    </span>
                  </div>
                </button>

                {/* 2. FIB - First Iraqi Bank */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('fib')}
                  className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    selectedGateway === 'fib'
                      ? 'border-sky-600 bg-sky-50/70 ring-2 ring-sky-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">
                        FIB
                      </span>
                      <QrCode className="w-4 h-4 text-sky-600" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {isAr ? 'المصرف العراقي الأول' : 'First Iraqi Bank'}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {isAr ? 'مسح رمز QR عبر تطبيق FIB' : 'Scan dynamic QR via FIB App'}
                    </span>
                  </div>
                </button>

                {/* 3. Cash on Delivery (COD) */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('cod')}
                  className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    selectedGateway === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        COD
                      </span>
                      <Banknote className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {isAr ? 'دفع نقدي لمندوب التوصيل' : 'Pay cash to dispatch courier'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Gateway Category: International */}
            <div className="space-y-3 pt-2">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'بوابات الدفع الدولية / البطاقات المصرفية:' : 'International Payment Methods:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 4. Stripe Card */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('stripe')}
                  className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    selectedGateway === 'stripe'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                        Stripe
                      </span>
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {isAr ? 'بطاقة بنكية (Stripe Card)' : 'Credit Card (Stripe)'}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Visa / Mastercard / QI Card
                    </span>
                  </div>
                </button>

                {/* 5. PayPal */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('paypal')}
                  className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    selectedGateway === 'paypal'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                        PayPal
                      </span>
                      <Lock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 block">
                      PayPal
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {isAr ? 'دفع آمن بالدولار الأمريكي' : 'Secure USD checkout sandbox'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Interactive Gateway Panel */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              {selectedGateway === 'zaincash' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                    <Phone className="w-4 h-4" />
                    <span>{isAr ? 'بوابة زين كاش (ZainCash Gateway):' : 'ZainCash Payment Terminal:'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isAr ? 'رقم محفظة زين كاش المسجل:' : 'ZainCash Wallet Phone Number:'}
                      </label>
                      <input
                        type="tel"
                        value={zainCashPhone}
                        onChange={(e) => setZainCashPhone(e.target.value)}
                        placeholder="078xxxxxxxx"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isAr ? 'رمز PIN المحفظة (تجريبي):' : 'Wallet PIN Code (Simulated):'}
                      </label>
                      <input
                        type="password"
                        value={zainCashPin}
                        onChange={(e) => setZainCashPin(e.target.value)}
                        placeholder="••••"
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isAr
                      ? 'سيتم خصم المبلغ بالدينار العراقي مباشرة من رصيد المحفظة وإصدار إشعار رسمي فوري.'
                      : 'Amount will be deducted instantly in IQD from your ZainCash wallet with live receipt.'}
                  </p>
                </div>
              )}

              {selectedGateway === 'fib' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
                    <QrCode className="w-4 h-4" />
                    <span>{isAr ? 'رمز الدفع السريع - المصرف العراقي الأول (FIB):' : 'First Iraqi Bank Dynamic QR Pay:'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl border border-slate-200">
                    <div className="w-28 h-28 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white shrink-0 shadow-xs">
                      {/* Simulated QR Code SVG */}
                      <div className="w-full h-full border-2 border-white/40 p-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-5 h-5 bg-white" />
                          <div className="w-5 h-5 bg-white" />
                        </div>
                        <div className="text-[9px] font-mono text-center text-sky-400">FIB PAY</div>
                        <div className="flex justify-between">
                          <div className="w-5 h-5 bg-white" />
                          <div className="w-3 h-3 bg-white" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="font-semibold text-slate-900">
                        {isAr ? 'امسح الرمز بكاميرا تطبيق FIB لإتمام الدفع فورياً' : 'Scan this QR code using First Iraqi Bank App'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isAr ? 'المبلغ المطلوب: ' : 'Total: '}
                        <strong className="text-purple-700 font-mono text-sm">{grandTotal.toLocaleString()} د.ع</strong>
                      </p>
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-lg text-[11px] font-bold">
                          <ExternalLink className="w-3 h-3" />
                          {isAr ? 'تطبيق FIB مفتوح وجاهز للاستجابة' : 'FIB Sandbox Connected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedGateway === 'cod' && (
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <Banknote className="w-4 h-4" />
                    <span>{isAr ? 'الدفع نقداً عند استلام الطلب والمعاينة:' : 'Cash on Delivery terms:'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'يمكنك فحص سلامة لوحات الأكريليك ومطبوعات العلب والتأكد من مطابقتها للمواصفات قبل تسليم المبلغ نقداً لمندوب شركة الشحن.'
                      : 'You can inspect the custom acrylic signs and packaging before handing cash over to the courier in Baghdad or any province.'}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {isAr ? 'المبلغ الإجمالي المستحق للمندوب: ' : 'Total due to courier: '}
                    <strong className="text-slate-900 font-mono">{grandTotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}</strong>
                  </p>
                </div>
              )}

              {selectedGateway === 'stripe' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isAr ? 'بوابة الدفع الآمنة المعتمدة (Stripe):' : 'Stripe Certified Payment Gateway:'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">256-bit SSL</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isAr ? 'الاسم على البطاقة:' : 'Cardholder Name:'}
                      </label>
                      <input
                        type="text"
                        value={stripeCardName}
                        onChange={(e) => setStripeCardName(e.target.value)}
                        placeholder="Mustafa Al-Rubaie"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {isAr ? 'رقم البطاقة (تجريبي):' : 'Card Number (Test):'}
                        </label>
                        <input
                          type="text"
                          value={stripeCardNumber}
                          onChange={(e) => setStripeCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          CVC:
                        </label>
                        <input
                          type="text"
                          value={stripeCvc}
                          onChange={(e) => setStripeCvc(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedGateway === 'paypal' && (
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <Lock className="w-3.5 h-3.5" />
                    <span>PayPal Express Sandbox</span>
                  </div>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'سيتم تحويلك إلى نافذة PayPal الآمنة لتفويض الدفع الدولي بضمان حماية المشتري.'
                      : 'You will be connected to PayPal sandbox checkout with instant buyer protection.'}
                  </p>
                </div>
              )}
            </div>

            {/* Total and Final Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">
                  {isAr ? 'المجموع النهائي مع الشحن والتغليف:' : 'Total Payable (Incl. Shipping):'}
                </span>
                <span className="text-2xl font-extrabold text-purple-700 font-mono">
                  {grandTotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {isAr ? 'رجوع' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmitPayment}
                  disabled={isProcessingPayment}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-700 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isAr ? 'تأكيد ودفع الطلب الآن' : 'Authorize & Place Order'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
