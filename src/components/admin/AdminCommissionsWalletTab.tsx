import React, { useState } from 'react';
import { 
  Wallet, DollarSign, CheckCircle2, XCircle, Clock, Percent, 
  Search, Filter, ArrowUpRight, AlertCircle, Building2, TrendingUp, 
  Sliders, ShieldCheck, ChevronRight
} from 'lucide-react';
import { 
  useAffiliateStore, WithdrawalRequest, CommissionRecord 
} from '../../store/useAffiliateStore';
import { PRODUCTS, ProductItem } from '../../data/mockData';

interface AdminCommissionsWalletTabProps {
  isAr?: boolean;
}

export const AdminCommissionsWalletTab: React.FC<AdminCommissionsWalletTabProps> = ({
  isAr = true,
}) => {
  const {
    commissionLedger,
    withdrawals,
    partners,
    productCommissionRates,
    defaultBaseCommissionPercent,
    approveWithdrawal,
    rejectWithdrawal,
    setProductCommissionRate,
    setDefaultBaseRate,
  } = useAffiliateStore();

  const [activeSubTab, setActiveSubTab] = useState<'withdrawals' | 'ledger' | 'rates'>('withdrawals');

  // Payout confirmation modal state
  const [selectedWithdrawalForAction, setSelectedWithdrawalForAction] = useState<WithdrawalRequest | null>(null);
  const [adminPayoutNote, setAdminPayoutNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  // Search filter
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Rate change state
  const [editingDefaultRate, setEditingDefaultRate] = useState(defaultBaseCommissionPercent);

  // Computations
  const totalCommissionsEarned = commissionLedger.reduce((acc, c) => acc + c.commissionAmountIQD, 0);
  const totalPaidOut = withdrawals
    .filter((w) => w.status === 'paid')
    .reduce((acc, w) => acc + w.amountIQD, 0);
  const totalPendingPayout = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((acc, w) => acc + w.amountIQD, 0);
  const totalPartnerSales = commissionLedger.reduce((acc, c) => acc + c.orderTotalIQD, 0);

  // Filtered ledger
  const filteredLedger = commissionLedger.filter((rec) => {
    const p = partners.find((p) => p.id === rec.partnerId);
    const search = ledgerSearch.toLowerCase();
    return (
      rec.orderId.toLowerCase().includes(search) ||
      rec.clientName.toLowerCase().includes(search) ||
      rec.clientPhone.includes(search) ||
      (p && p.fullName.toLowerCase().includes(search))
    );
  });

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');

  const handleConfirmPayoutAction = () => {
    if (!selectedWithdrawalForAction) return;

    if (actionType === 'approve') {
      approveWithdrawal(
        selectedWithdrawalForAction.id,
        adminPayoutNote.trim() || (isAr ? 'تم التحويل بنجاح' : 'Processed successfully')
      );
    } else {
      rejectWithdrawal(
        selectedWithdrawalForAction.id,
        rejectReason.trim() || (isAr ? 'بيانات غير مطابقة' : 'Invalid details')
      );
    }

    setSelectedWithdrawalForAction(null);
    setAdminPayoutNote('');
    setRejectReason('');
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Wallet className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
              {isAr ? 'المالية وسجل أرباح الشركاء' : 'Commissions & Financial Ledger'}
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif">
            {isAr ? 'محفظة عمولات المبيعات والتحويلات' : 'Sales Partner Payouts & Commission Rates'}
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            {isAr 
              ? 'مراجعة طلبات السحب (زين كاش / آسيا حوالة)، سجل العمولات الصادرة، وضبط نسب الأرباح لكل منتج.'
              : 'Approve withdrawal payouts and configure product-level commission rates.'}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">
            {isAr ? 'طلبات سحب معلقة للصرف' : 'Pending Payouts'}
          </span>
          <div className="text-2xl font-bold font-mono text-amber-700">
            {totalPendingPayout.toLocaleString()} <span className="text-xs font-normal text-stone-500">د.ع</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {pendingWithdrawals.length} {isAr ? 'طلبات بانتظار الاعتماد' : 'requests'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">
            {isAr ? 'إجمالي ما تم تحويله' : 'Total Paid Out'}
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {totalPaidOut.toLocaleString()} <span className="text-xs font-normal text-stone-500">د.ع</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {withdrawals.filter((w) => w.status === 'paid').length} {isAr ? 'حوالات منفذة' : 'transfers'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">
            {isAr ? 'إجمالي الأرباح المستحقة' : 'Total Commissions'}
          </span>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {totalCommissionsEarned.toLocaleString()} <span className="text-xs font-normal text-stone-500">د.ع</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {commissionLedger.length} {isAr ? 'عملية عمولة' : 'ledger entries'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">
            {isAr ? 'مبيعات الشركاء المحققة' : 'Partner Driven Sales'}
          </span>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {totalPartnerSales.toLocaleString()} <span className="text-xs font-normal text-stone-500">د.ع</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {isAr ? 'إجمالي دخل المتجر عبر الشركاء' : 'Total partner GMV'}
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('withdrawals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'withdrawals' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{isAr ? 'طلبات السحب والتحويلات' : 'Withdrawals Queue'}</span>
          {pendingWithdrawals.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold">
              {pendingWithdrawals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'ledger' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{isAr ? 'سجل العمليات والعمولات' : 'Commission Ledger'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-stone-700 text-white text-[10px]">
            {commissionLedger.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('rates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'rates' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isAr ? 'تخصيص نسب الأرباح لكل منتج' : 'Product Commission Rates'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: WITHDRAWALS QUEUE */}
      {/* ========================================================= */}
      {activeSubTab === 'withdrawals' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900">
              {isAr ? 'طلبات تحويل الأرباح للمسوقين' : 'Payout Requests'}
            </h3>
            <p className="text-xs text-stone-500">
              {isAr ? 'تأكيد التحويل عبر زين كاش أو آسيا حوالة وخصم الرصيد تلقائياً' : 'Approve to deduct balance and mark as paid'}
            </p>
          </div>

          {withdrawals.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-400">
              {isAr ? 'لا توجد طلبات سحب حالياً' : 'No payout requests'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">{isAr ? 'رقم الطلب' : 'Request ID'}</th>
                    <th className="py-3 px-4">{isAr ? 'الممثل / الشريك' : 'Partner'}</th>
                    <th className="py-3 px-4">{isAr ? 'المبلغ المطلوب' : 'Amount'}</th>
                    <th className="py-3 px-4">{isAr ? 'طريقة التحويل' : 'Method'}</th>
                    <th className="py-3 px-4">{isAr ? 'تفاصيل المحفظة' : 'Account Details'}</th>
                    <th className="py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="py-3 px-4">{isAr ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {withdrawals.map((w) => {
                    const partner = partners.find((p) => p.id === w.partnerId);
                    return (
                      <tr key={w.id} className="hover:bg-stone-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{w.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{partner?.fullName || w.partnerId}</div>
                          <div className="text-[11px] font-mono text-stone-500">{partner?.employeeId} • {partner?.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900 text-sm">
                          {w.amountIQD.toLocaleString()} د.ع
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-medium text-[11px]">
                            {w.method === 'zain_cash' ? 'زين كاش' : w.method === 'asia_hawala' ? 'آسيا حوالة' : 'نقدي بالمقر'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                          {w.accountDetails}
                        </td>
                        <td className="py-3.5 px-4">
                          {w.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                              {isAr ? 'قيد المراجعة' : 'Pending'}
                            </span>
                          )}
                          {w.status === 'paid' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                              {isAr ? 'تم التحويل' : 'Paid'}
                            </span>
                          )}
                          {w.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                              {isAr ? 'مرفوض' : 'Rejected'}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {w.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedWithdrawalForAction(w);
                                  setActionType('approve');
                                  setAdminPayoutNote(`تم التحويل بنجاح عبر ${w.method === 'zain_cash' ? 'زين كاش' : 'آسيا حوالة'}`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition"
                              >
                                {isAr ? 'تأكيد التحويل' : 'Pay'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedWithdrawalForAction(w);
                                  setActionType('reject');
                                  setRejectReason('بيانات الحساب غير مطابقة أو رقم غير مسجل');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-[11px] font-medium"
                              >
                                {isAr ? 'رفض' : 'Reject'}
                              </button>
                            </div>
                          )}
                          {w.status === 'paid' && w.adminNote && (
                            <span className="text-[11px] text-stone-500 italic">{w.adminNote}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: COMMISSION LEDGER */}
      {/* ========================================================= */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute top-3 rtl:right-3 ltr:left-3 text-stone-400" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder={isAr ? 'بحث برقم الطلب، اسم العميل، هاتفه، أو الشريك...' : 'Search ledger...'}
                className="w-full py-2 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                    <th className="py-3 px-4">{isAr ? 'الشريك المستفيد' : 'Partner'}</th>
                    <th className="py-3 px-4">{isAr ? 'العميل' : 'Customer'}</th>
                    <th className="py-3 px-4">{isAr ? 'قيمة الطلب' : 'Order Total'}</th>
                    <th className="py-3 px-4">{isAr ? 'النسبة المطبقة' : 'Rate'}</th>
                    <th className="py-3 px-4">{isAr ? 'مبلغ العمولة' : 'Commission'}</th>
                    <th className="py-3 px-4">{isAr ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredLedger.map((rec) => {
                    const partner = partners.find((p) => p.id === rec.partnerId);
                    return (
                      <tr key={rec.id} className="hover:bg-stone-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{rec.orderId}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-900 block">{partner?.fullName || rec.partnerId}</span>
                          <span className="text-[10px] font-mono text-stone-400">{partner?.employeeId}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800">{rec.clientName}</span>
                          <span className="text-[11px] font-mono text-stone-500 block">{rec.clientPhone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-stone-800">
                          {rec.orderTotalIQD.toLocaleString()} د.ع
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                          {rec.appliedRate}%
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-sm">
                          +{rec.commissionAmountIQD.toLocaleString()} د.ع
                        </td>
                        <td className="py-3.5 px-4 text-stone-500">
                          {new Date(rec.createdAt).toLocaleDateString(isAr ? 'ar-IQ' : 'en-US')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: PRODUCT-LEVEL COMMISSION RATES */}
      {/* ========================================================= */}
      {activeSubTab === 'rates' && (
        <div className="space-y-6">
          {/* Default Base Rate */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {isAr ? 'النسبة الأساسية الافتراضية لجميع المنتجات' : 'Default Base Commission Rate'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {isAr ? 'تطبق على أي منتج لم يتم تحديد نسبة خاصة به بشكل منفصل' : 'Applies to products without custom override'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={50}
                value={editingDefaultRate}
                onChange={(e) => setEditingDefaultRate(Number(e.target.value))}
                className="w-20 px-3 py-2 rounded-xl border border-stone-200 text-center font-bold text-sm outline-none focus:border-amber-500 font-mono"
              />
              <span className="font-bold text-stone-700">%</span>
              <button
                type="button"
                onClick={() => setDefaultBaseRate(editingDefaultRate)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
              >
                {isAr ? 'حفظ النسبة' : 'Save'}
              </button>
            </div>
          </div>

          {/* Product Rates Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h4 className="text-sm font-bold text-stone-900">
                {isAr ? 'تحديد نسبة مخصصة لكل منتج' : 'Per-Product Commission Overrides'}
              </h4>
            </div>

            <div className="divide-y divide-stone-100">
              {PRODUCTS.slice(0, 10).map((prod: ProductItem) => {
                const currentRate = productCommissionRates[prod.id] ?? defaultBaseCommissionPercent;
                return (
                  <div key={prod.id} className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50/50">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.titleAr}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">{prod.titleAr}</div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {prod.basePrice.toLocaleString()} د.ع • {prod.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">{isAr ? 'نسبة العمولة:' : 'Rate:'}</span>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={currentRate}
                        onChange={(e) => setProductCommissionRate(prod.id, Number(e.target.value))}
                        className="w-16 px-2.5 py-1.5 rounded-xl border border-stone-200 text-center font-bold font-mono text-xs focus:border-amber-500 outline-none"
                      />
                      <span className="font-bold text-stone-700 text-xs">%</span>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold mr-2 rtl:mr-2 ltr:ml-2">
                        ≈ {Math.round((prod.basePrice * currentRate) / 100).toLocaleString()} د.ع / قطعة
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Payouts */}
      {selectedWithdrawalForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {actionType === 'approve'
                ? isAr ? 'تأكيد تحويل أرباح الشريك' : 'Confirm Payout Approval'
                : isAr ? 'رفض طلب السحب' : 'Reject Withdrawal Request'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {isAr 
                ? `المبلغ: ${selectedWithdrawalForAction.amountIQD.toLocaleString()} د.ع عبر ${selectedWithdrawalForAction.method === 'zain_cash' ? 'زين كاش' : 'آسيا حوالة'} (${selectedWithdrawalForAction.accountDetails})`
                : `Amount: ${selectedWithdrawalForAction.amountIQD.toLocaleString()} IQD`}
            </p>

            {actionType === 'approve' ? (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'ملاحظة المالية / رقم إشعار التحويل' : 'Transfer Ref / Note'}
                </label>
                <input
                  type="text"
                  value={adminPayoutNote}
                  onChange={(e) => setAdminPayoutNote(e.target.value)}
                  placeholder={isAr ? 'مثال: تم الإرسال عبر زين كاش - إشعار 4920' : 'e.g. Zain Cash ref #4920'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-emerald-500 outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'سبب الرفض' : 'Rejection Reason'}
                </label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={isAr ? 'سبب الرفض للتوضيح للشريك...' : 'Reason...'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-rose-500 outline-none"
                />
              </div>
            )}

            <div className="pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedWithdrawalForAction(null)}
                className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmPayoutAction}
                className={`px-5 py-2 rounded-xl text-white font-bold text-xs ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionType === 'approve' ? (isAr ? 'تأكيد وصرف الحوالة' : 'Confirm Payout') : (isAr ? 'تأكيد الرفض' : 'Confirm Reject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
