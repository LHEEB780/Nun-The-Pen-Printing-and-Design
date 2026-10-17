import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderRecord } from '../../store/useCartStore';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Send,
  Printer,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Truck,
  FileCheck,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  order: OrderRecord;
  onReturnHome: () => void;
  onBrowseShop: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onReturnHome,
  onBrowseShop,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const handleWhatsAppTrack = () => {
    const text = isAr
      ? `مرحباً نون والقلم 🌟\nأود الاستفسار ومتابعة حالة طلبي رقم: *${order.orderId}*\nالاسم: ${order.shipping.fullName}\nالمحافظة: ${order.shipping.governorate}\nالمبلغ: ${order.grandTotal.toLocaleString()} د.ع\nيرجى تزويدي بالبروفة الرقمية لمراجعتها.`
      : `Hello Noon & Pen 🌟\nInquiring about my custom order *${order.orderId}*\nName: ${order.shipping.fullName}\nCity: ${order.shipping.governorate}\nTotal: ${order.grandTotal.toLocaleString()} IQD\nLooking forward to the digital 3D proof.`;

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-24 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl text-center space-y-6 mb-10">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-scale">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'تم استلام وتأكيد الطلب بنجاح' : 'Order Confirmed & Received'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'شكراً لثقتكم بنون والقلم للطباعة والتصميم' : 'Thank You for Choosing Noon & Pen'}
            </h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
              {isAr
                ? 'فريق التصميم والتصنيع بدأ بتجهيز ملفاتك وسيقوم بإرسال البروفة الرقمية عبر واتساب للمراجعة والاعتماد النهائي.'
                : 'Our design and fabrication workshop has logged your custom specifications and will send your 3D digital proof via WhatsApp.'}
            </p>
          </div>

          {/* Order ID Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">{isAr ? 'رقم الطلب المرجعي:' : 'Order Tracking ID:'}</span>
              <span className="text-xl font-extrabold text-purple-700 font-mono tracking-wider">
                {order.orderId}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div>
              <span className="text-slate-400 block">{isAr ? 'تاريخ التثبيت:' : 'Date:'}</span>
              <span className="font-semibold text-slate-800 font-mono">{order.createdAt}</span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div>
              <span className="text-slate-400 block">{isAr ? 'حالة الطلب:' : 'Status:'}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                {isAr ? 'بانتظار اعتماد البروفة' : 'Digital Proofing'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleWhatsAppTrack}
              type="button"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'متابعة الطلب واستلام البروفة عبر واتساب' : 'Track & Receive Proof via WhatsApp'}</span>
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? 'طباعة فاتورة الطلب' : 'Print Receipt'}</span>
            </button>
          </div>
        </div>

        {/* Detailed Itemized Receipt */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'تفاصيل المنتجات والمواصفات المصنعة:' : 'Fabricated Items & Custom Specs:'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {order.items.length} {isAr ? 'منتجات' : 'items'}
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-slate-100">
            {order.items.map((item, index) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.titleAr}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {isAr ? item.titleAr : item.titleEn}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {item.quantity} {isAr ? 'قطع' : 'pcs'} × {item.unitPrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                      </span>
                    </div>
                  </div>

                  <span className="font-bold text-sm text-slate-900 font-mono">
                    {item.totalPrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                  </span>
                </div>

                {/* Specs block */}
                <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 space-y-1 border border-slate-100">
                  {item.customOptions.customText && (
                    <p className="font-medium text-slate-800">
                      <strong>{isAr ? 'النص المطلوب:' : 'Custom Text:'}</strong> "{item.customOptions.customText}"
                    </p>
                  )}
                  {item.customOptions.fontName && (
                    <p>
                      <strong>{isAr ? 'نوع الخط المعتمد:' : 'Font Style:'}</strong> {item.customOptions.fontName}
                    </p>
                  )}
                  <p>
                    <strong>{isAr ? 'المقاس / الأبعاد:' : 'Dimensions:'}</strong> {isAr ? item.customOptions.dimensionLabelAr : item.customOptions.dimensionLabelEn}
                  </p>
                  <p>
                    <strong>{isAr ? 'الخامة والتشطيب:' : 'Material:'}</strong> {isAr ? item.customOptions.materialLabelAr : item.customOptions.materialLabelEn}
                  </p>
                  {item.customOptions.ledColorNameAr && (
                    <p className="flex items-center gap-1.5">
                      <strong>{isAr ? 'إضاءة LED:' : 'LED Tone:'}</strong>
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.customOptions.ledHex }} />
                      <span>{isAr ? item.customOptions.ledColorNameAr : item.customOptions.ledColorNameEn}</span>
                    </p>
                  )}
                  {item.customOptions.logoFileName && (
                    <p className="text-purple-700 font-semibold font-mono">
                      📎 {isAr ? 'الملف المرفق:' : 'File:'} {item.customOptions.logoFileName}
                    </p>
                  )}
                  {item.customOptions.notes && (
                    <p className="italic text-slate-500">
                      <strong>{isAr ? 'ملاحظات:' : 'Notes:'}</strong> {item.customOptions.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping & Payment Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            {/* Delivery Details */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>{isAr ? 'عنوان الاستلام والتوصيل:' : 'Delivery Destination:'}</span>
              </div>
              <p>
                <strong>{isAr ? 'الاسم:' : 'Recipient:'}</strong> {order.shipping.fullName}
              </p>
              <p>
                <strong>{isAr ? 'الهاتف:' : 'Phone:'}</strong> {order.shipping.phone}
              </p>
              <p>
                <strong>{isAr ? 'المحافظة:' : 'City:'}</strong> {order.shipping.governorate}
              </p>
              <p>
                <strong>{isAr ? 'العنوان:' : 'Address:'}</strong> {order.shipping.address}
              </p>
            </div>

            {/* Payment Info */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>{isAr ? 'طريقة الدفع والتفويض:' : 'Payment & Authorization:'}</span>
              </div>
              <p>
                <strong>{isAr ? 'البوابة:' : 'Gateway:'}</strong> {isAr ? order.paymentDetails.gatewayNameAr : order.paymentDetails.gatewayNameEn}
              </p>
              <p>
                <strong>{isAr ? 'رقم المعاملة:' : 'Reference TX:'}</strong>{' '}
                <span className="font-mono font-bold text-purple-700">{order.paymentDetails.transactionId}</span>
              </p>
              <p>
                <strong>{isAr ? 'حالة الدفع:' : 'Payment Status:'}</strong>{' '}
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  {order.paymentDetails.status === 'paid' ? (isAr ? 'مدفوع بنجاح' : 'Paid') : (isAr ? 'مستحق عند الاستلام' : 'Pay on Delivery')}
                </span>
              </p>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span>{isAr ? 'المجموع الفرعي للمنتجات:' : 'Subtotal:'}</span>
              <span className="font-mono font-bold">{order.subtotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{isAr ? 'أجور الشحن والتوصيل والتأمين:' : 'Shipping & Handling:'}</span>
              <span className="font-mono font-bold">
                {order.shippingCost === 0 ? (isAr ? 'مجاناً' : 'FREE') : `${order.shippingCost.toLocaleString()} ${isAr ? 'د.ع' : 'IQD'}`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-purple-200 text-base font-extrabold text-slate-900">
              <span>{isAr ? 'المجموع الكلي النهائي:' : 'Grand Total Paid:'}</span>
              <span className="text-purple-700 font-mono text-lg">{order.grandTotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}</span>
            </div>
          </div>

          {/* Direct WhatsApp Transmission Button */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Send className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  {isAr ? 'أرسل نسخة فورية من طلبك عبر واتساب' : 'Send Instant Order Copy via WhatsApp'}
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  {isAr ? 'للتواصل السريع وتلقي بروفة التصميم الرقمية من كادر نون والقلم' : 'For fast communication and receiving your digital proof'}
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/9647800000000?text=${encodeURIComponent(
                isAr
                  ? `مرحباً استوديو نون والقلم 🌟\nتم تثبيت طلبي بنجاح برقم: *${order.orderId}*\nالاسم: ${order.shipping.fullName}\nالهاتف: ${order.shipping.phone}\nالعنوان: ${order.shipping.governorate} - ${order.shipping.address}\nإجمالي المبلغ: ${order.grandTotal.toLocaleString()} د.ع\nالمنتجات:\n${order.items.map(it => `- ${it.titleAr} (${it.quantity} قطعة)`).join('\n')}\nأرجو إرسال بروفة التصميم للاعتماد السريع.`
                  : `Hello Noon & Pen 🌟\nOrder placed successfully: *${order.orderId}*\nCustomer: ${order.shipping.fullName}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center gap-2 shrink-0 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'إرسال نسخة الطلب لواتساب 💬' : 'Send Copy to WhatsApp'}</span>
            </a>
          </div>

          {/* Return Links */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onReturnHome}
              type="button"
              className="text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
            >
              {isAr ? 'العودة للصفحة الرئيسية' : 'Return to Homepage'}
            </button>
            <button
              onClick={onBrowseShop}
              type="button"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {isAr ? 'تصفح المزيد من المنتجات' : 'Browse More Products'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
