import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore, OrderWorkflowStatus, AdminOrderRecord } from '../../store/useAdminStore';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Download,
  AlertCircle,
  Eye,
  CreditCard,
  MapPin,
  Phone,
  FileText,
  Zap,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const OrderManagementTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { adminOrders, updateOrderStatus, updatePaymentStatus, updateDesignerNotes } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderWorkflowStatus>('all');
  const [inspectOrder, setInspectOrder] = useState<AdminOrderRecord | null>(adminOrders[0] || null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState('');

  const filteredOrders = adminOrders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.workflowStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      ord.orderId.toLowerCase().includes(q) ||
      ord.shipping.fullName.toLowerCase().includes(q) ||
      ord.shipping.phone.includes(q);
    return matchesStatus && matchesSearch;
  });

  const getWorkflowBadge = (status: OrderWorkflowStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">{isAr ? 'قيد المراجعة' : 'Pending'}</span>;
      case 'in_design':
        return <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">{isAr ? 'في التصميم والبروفة' : 'In Design'}</span>;
      case 'printing':
        return <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">{isAr ? 'قص الليزر والطباعة' : 'Printing / Laser'}</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">{isAr ? 'في الشحن مع المندوب' : 'Shipped'}</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">{isAr ? 'تم التسليم' : 'Delivered'}</span>;
    }
  };

  const handleDownloadFile = (fileName: string) => {
    setDownloadSuccessToast(`${isAr ? 'تم بدء تنزيل الملف المرفق:' : 'Downloading file:'} ${fileName}`);
    setTimeout(() => setDownloadSuccessToast(''), 3000);
  };

  const handleSendWhatsAppUpdate = (order: AdminOrderRecord) => {
    const statusLabels: Record<OrderWorkflowStatus, string> = {
      pending: isAr ? 'قيد المراجعة الفنية' : 'Pending Review',
      in_design: isAr ? 'في قسم الرسم وإعداد البروفة 3D' : 'In Design & 3D Proofing',
      printing: isAr ? 'في مرحلة القص بالليزر والتجميع' : 'In Laser Cutting & Assembly',
      shipped: isAr ? 'خرجت مع مندوب التوصيل' : 'Out for Delivery',
      delivered: isAr ? 'تم التسليم بنجاح' : 'Delivered',
    };

    const text = isAr
      ? `مرحباً ${order.shipping.fullName} 🌟\nتحديث رسمي من ورشة نون والقلم للطباعة والتصميم:\nطلبكم رقم: *${order.orderId}*\nالحالة الحالية: *${statusLabels[order.workflowStatus]}*\nتفاصيل الطلب: ${order.items[0]?.titleAr}\nشكراً لثقتكم بنا!`
      : `Hello ${order.shipping.fullName} 🌟\nUpdate on your Noon & Pen order *${order.orderId}*:\nCurrent status: *${statusLabels[order.workflowStatus]}*`;

    const encoded = encodeURIComponent(text);
    const phoneClean = order.shipping.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${phoneClean || '9647800000000'}?text=${encoded}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed top-24 end-8 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs font-bold flex items-center gap-2 animate-scale">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Header and Filter Toolbar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {isAr ? 'إدارة الطلبات المخصصة والتصنيع' : 'Custom Order & Production Pipeline'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'متابعة مسار كل قطعة مخصصة، تنزيل ملفات الشعارات، وتحديث حالات الدفع والإنتاج' : 'Track bespoke orders, inspect uploaded logos, and manage delivery status'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
              {filteredOrders.length} {isAr ? 'طلبات مسجلة' : 'Total Orders'}
            </span>
          </div>
        </div>

        {/* Toolbar: Search & Status Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث برقم الطلب (NP-...) أو اسم العميل...' : 'Search by order ID or name...'}
              className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full md:w-auto no-scrollbar">
            {(
              [
                { id: 'all', labelAr: 'الكل' },
                { id: 'pending', labelAr: 'قيد المراجعة' },
                { id: 'in_design', labelAr: 'في التصميم' },
                { id: 'printing', labelAr: 'القص والطباعة' },
                { id: 'shipped', labelAr: 'في الشحن' },
                { id: 'delivered', labelAr: 'تم التسليم' },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {st.labelAr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2 Columns: Orders Table & Deep Customization Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Orders Table List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto opacity-50" />
                <p className="text-xs font-medium">{isAr ? 'لا توجد طلبات مطابقة للبحث' : 'No orders found'}</p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isSelected = inspectOrder?.orderId === ord.orderId;
                return (
                  <div
                    key={ord.orderId}
                    onClick={() => setInspectOrder(ord)}
                    className={`p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected ? 'bg-purple-50/80 border-s-4 border-purple-600' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-slate-900">{ord.orderId}</span>
                        {getWorkflowBadge(ord.workflowStatus)}
                        {ord.urgentDispatch && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5">
                            <Zap className="w-3 h-3 text-amber-600" />
                            {isAr ? 'مستعجل' : 'Rush'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-semibold">{ord.shipping.fullName}</p>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {ord.createdAt} · {ord.shipping.governorate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-start sm:text-end">
                        <span className="font-mono font-bold text-sm text-slate-900 block">
                          {ord.grandTotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            ord.paymentDetails.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {ord.paymentDetails.status === 'paid' ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'دفع عند الاستلام' : 'Pending COD')}
                        </span>
                      </div>

                      <Eye className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-slate-300'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Order Inspection & Workflow Controls (5 cols) */}
        {inspectOrder ? (
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] text-slate-400 block">{isAr ? 'تفاصيل الطلب المحدد:' : 'Inspecting Order:'}</span>
                <span className="font-mono font-extrabold text-lg text-purple-700">{inspectOrder.orderId}</span>
              </div>
              <button
                onClick={() => handleSendWhatsAppUpdate(inspectOrder)}
                type="button"
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'مراسلة العميل' : 'WhatsApp Client'}</span>
              </button>
            </div>

            {/* Workflow Status Mutation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                {isAr ? 'تحديث حالة مسار التصنيع:' : 'Update Workflow Stage:'}
              </label>
              <select
                value={inspectOrder.workflowStatus}
                onChange={(e) => updateOrderStatus(inspectOrder.orderId, e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="pending">{isAr ? '1. قيد المراجعة الفنية' : '1. Pending Review'}</option>
                <option value="in_design">{isAr ? '2. في التصميم والبروفة 3D' : '2. In Design & 3D Proof'}</option>
                <option value="printing">{isAr ? '3. قص الليزر والطباعة والتجميع' : '3. Laser Cutting & Assembly'}</option>
                <option value="shipped">{isAr ? '4. تم الشحن مع مندوب التوصيل' : '4. Shipped / Out for Delivery'}</option>
                <option value="delivered">{isAr ? '5. تم التسليم للعميل' : '5. Delivered'}</option>
              </select>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">{isAr ? 'حالة السداد:' : 'Payment Status:'}</span>
                <button
                  type="button"
                  onClick={() =>
                    updatePaymentStatus(
                      inspectOrder.orderId,
                      inspectOrder.paymentDetails.status === 'paid' ? 'pending_cod' : 'paid'
                    )
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    inspectOrder.paymentDetails.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {inspectOrder.paymentDetails.status === 'paid' ? (isAr ? 'مدفوع بالكامل ✓' : 'Fully Paid') : (isAr ? 'تأكيد استلام المبلغ نقداً' : 'Mark as Paid')}
                </button>
              </div>
            </div>

            {/* Customization Specs & Files */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                {isAr ? 'مواصفات التخصيص وملفات العميل:' : 'Custom Specifications & Artwork:'}
              </h4>
              {inspectOrder.items.map((it) => (
                <div key={it.id} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
                  <span className="font-bold text-slate-900 block">{isAr ? it.titleAr : it.titleEn} (×{it.quantity})</span>
                  {it.customOptions.customText && (
                    <p className="text-slate-700 bg-slate-50 p-2 rounded-lg font-medium">
                      <strong>{isAr ? 'النص المطلوب:' : 'Text:'}</strong> "{it.customOptions.customText}"
                    </p>
                  )}
                  <div className="space-y-0.5 text-slate-600 text-[11px]">
                    <p><strong>{isAr ? 'المقاس:' : 'Size:'}</strong> {isAr ? it.customOptions.dimensionLabelAr : it.customOptions.dimensionLabelEn}</p>
                    <p><strong>{isAr ? 'الخامة:' : 'Material:'}</strong> {isAr ? it.customOptions.materialLabelAr : it.customOptions.materialLabelEn}</p>
                    {it.customOptions.ledColorNameAr && (
                      <p><strong>{isAr ? 'الإضاءة:' : 'LED:'}</strong> {isAr ? it.customOptions.ledColorNameAr : it.customOptions.ledColorNameEn}</p>
                    )}
                  </div>

                  {it.customOptions.logoFileName && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-mono text-purple-700 text-[11px] truncate max-w-[180px]">
                        📎 {it.customOptions.logoFileName}
                      </span>
                      <button
                        onClick={() => handleDownloadFile(it.customOptions.logoFileName!)}
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>{isAr ? 'تنزيل الملف' : 'Download'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Designer Workshop Notes Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                {isAr ? 'ملاحظات المصمم / الفني بالورشة:' : 'Internal Workshop Notes:'}
              </label>
              <textarea
                rows={2}
                value={inspectOrder.designerNotes || ''}
                onChange={(e) => updateDesignerNotes(inspectOrder.orderId, e.target.value)}
                placeholder={isAr ? 'ملاحظات عن فحص الليزر، كابل التوصيل، أو وقت الإرسال...' : 'Laser inspection, wire length notes...'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            {/* Shipping & Contact Details */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                <span>{inspectOrder.shipping.fullName} · {inspectOrder.shipping.governorate}</span>
              </div>
              <p className="ps-5">{inspectOrder.shipping.address}</p>
              <p className="ps-5 font-mono dir-ltr text-end">{inspectOrder.shipping.phone}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
