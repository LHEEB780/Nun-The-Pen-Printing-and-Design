import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Truck,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Globe2,
  ExternalLink,
  Clock,
  CircleDollarSign,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useShippingStore, ShippingCompany } from '../../store/useShippingStore';

interface CompanyFormState {
  nameAr: string;
  nameEn: string;
  baseFeeIQD: number;
  minDays: number;
  maxDays: number;
  coverageAr: string;
  coverageEn: string;
  trackingUrl: string;
  notesAr: string;
  notesEn: string;
  isActive: boolean;
}

const EMPTY_FORM: CompanyFormState = {
  nameAr: '',
  nameEn: '',
  baseFeeIQD: 100000,
  minDays: 5,
  maxDays: 10,
  coverageAr: '',
  coverageEn: '',
  trackingUrl: '',
  notesAr: '',
  notesEn: '',
  isActive: true,
};

export const ShippingManagementTab: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const {
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
    toggleCompanyActive,
    resetCompaniesToDefaults,
  } = useShippingStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CompanyFormState>(EMPTY_FORM);

  const activeCount = companies.filter((c) => c.isActive).length;

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (company: ShippingCompany) => {
    setEditingId(company.id);
    setForm({
      nameAr: company.nameAr,
      nameEn: company.nameEn,
      baseFeeIQD: company.baseFeeIQD,
      minDays: company.minDays,
      maxDays: company.maxDays,
      coverageAr: company.coverageAr,
      coverageEn: company.coverageEn,
      trackingUrl: company.trackingUrl ?? '',
      notesAr: company.notesAr ?? '',
      notesEn: company.notesEn ?? '',
      isActive: company.isActive,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.nameAr.trim() || !form.nameEn.trim()) {
      toast.error(isAr ? 'اسم الشركة بالعربية والإنجليزية مطلوب' : 'Company name (AR & EN) is required');
      return;
    }
    if (!form.baseFeeIQD || form.baseFeeIQD <= 0) {
      toast.error(isAr ? 'أدخل أجرة شحن صحيحة بالدينار' : 'Enter a valid shipping fee in IQD');
      return;
    }
    if (form.minDays > form.maxDays) {
      toast.error(isAr ? 'أقل مدة تسليم لا يمكن أن تتجاوز الأعلى' : 'Min days cannot exceed max days');
      return;
    }

    if (editingId) {
      updateCompany(editingId, { ...form });
      toast.success(isAr ? 'تم حفظ تعديلات شركة الشحن' : 'Shipping company updated');
    } else {
      addCompany({ ...form });
      toast.success(isAr ? 'تمت إضافة شركة الشحن الدولي' : 'International courier added');
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (company: ShippingCompany) => {
    if (
      window.confirm(
        isAr
          ? `حذف "${company.nameAr}" نهائياً؟ لن يظهر للعملاء في صفحة الدفع.`
          : `Delete "${company.nameEn}" permanently? Customers will no longer see it at checkout.`
      )
    ) {
      deleteCompany(company.id);
      if (editingId === company.id) {
        setShowForm(false);
        setEditingId(null);
      }
      toast.success(isAr ? 'تم حذف شركة الشحن' : 'Shipping company deleted');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        isAr
          ? 'استعادة الشركات الافتراضية؟ سيتم استبدال القائمة الحالية بالكامل.'
          : 'Restore default couriers? The current list will be fully replaced.'
      )
    ) {
      resetCompaniesToDefaults();
      setShowForm(false);
      setEditingId(null);
      toast.success(isAr ? 'تمت استعادة القائمة الافتراضية' : 'Default courier list restored');
    }
  };

  const numInput = (val: string): number => Math.max(0, Math.floor(Number(val) || 0));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>{isAr ? 'الشحن الدولي' : 'International Shipping'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {isAr ? 'إدارة شركات الشحن الدولي' : 'International Couriers Management'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isAr
              ? 'أضف شركات الشحن الدولية واضبط أجورها ومدد التسليم، وفعّلها لتظهر فوراً للعملاء في صفحة الدفع.'
              : 'Add international couriers, set their fees & transit times, and activate them to appear instantly at checkout.'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {isAr ? `${activeCount} مفعّلة` : `${activeCount} active`}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            {isAr ? `${companies.length} إجمالاً` : `${companies.length} total`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => (showForm ? setShowForm(false) : openCreate())}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {isAr ? 'إضافة شركة شحن' : 'Add Courier'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          {isAr ? 'استعادة الافتراضي' : 'Restore Defaults'}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-purple-200 shadow-md p-6 space-y-5 ring-2 ring-purple-600/10">
          <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-purple-600" />
            {editingId
              ? isAr
                ? 'تعديل بيانات الشركة'
                : 'Edit Courier Details'
              : isAr
                ? 'شركة شحن دولي جديدة'
                : 'New International Courier'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'الاسم بالعربية *' : 'Arabic Name *'}
              </label>
              <input
                type="text"
                value={form.nameAr}
                onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                placeholder="مثال: دي إتش إل إكسبرس"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'الاسم بالإنجليزية *' : 'English Name *'}
              </label>
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                placeholder="e.g. DHL Express"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'الأجرة (د.ع) *' : 'Fee (IQD) *'}
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={form.baseFeeIQD}
                onChange={(e) => setForm({ ...form, baseFeeIQD: numInput(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'أقل مدة (يوم)' : 'Min Days'}
              </label>
              <input
                type="number"
                min={1}
                value={form.minDays}
                onChange={(e) => setForm({ ...form, minDays: numInput(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'أعلى مدة (يوم)' : 'Max Days'}
              </label>
              <input
                type="number"
                min={1}
                value={form.maxDays}
                onChange={(e) => setForm({ ...form, maxDays: numInput(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'الحالة' : 'Status'}
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold transition-colors cursor-pointer ${
                  form.isActive
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-300 text-slate-500'
                }`}
              >
                {form.isActive
                  ? isAr
                    ? 'مفعّلة ✓'
                    : 'Active ✓'
                  : isAr
                    ? 'معطّلة'
                    : 'Inactive'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'وصف التغطية (عربي)' : 'Coverage (AR)'}
              </label>
              <input
                type="text"
                value={form.coverageAr}
                onChange={(e) => setForm({ ...form, coverageAr: e.target.value })}
                placeholder="مثال: شحن دولي إلى أكثر من 200 دولة"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'وصف التغطية (إنجليزي)' : 'Coverage (EN)'}
              </label>
              <input
                type="text"
                value={form.coverageEn}
                onChange={(e) => setForm({ ...form, coverageEn: e.target.value })}
                placeholder="e.g. Worldwide shipping to 200+ countries"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'رابط تتبع الشحنة (اختياري)' : 'Tracking URL (optional)'}
              </label>
              <input
                type="url"
                value={form.trackingUrl}
                onChange={(e) => setForm({ ...form, trackingUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {isAr ? 'ملاحظة للعميل (عربي)' : 'Customer Note (AR)'}
              </label>
              <input
                type="text"
                value={form.notesAr}
                onChange={(e) => setForm({ ...form, notesAr: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
              {isAr ? 'ملاحظة للعميل (إنجليزي)' : 'Customer Note (EN)'}
            </label>
            <input
              type="text"
              value={form.notesEn}
              onChange={(e) => setForm({ ...form, notesEn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors cursor-pointer"
            >
              {editingId
                ? isAr
                  ? 'حفظ التعديلات'
                  : 'Save Changes'
                : isAr
                  ? 'إضافة الشركة'
                  : 'Add Company'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className={`bg-white rounded-3xl border p-5 shadow-sm transition-all ${
              company.isActive ? 'border-emerald-200' : 'border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 truncate">
                    {isAr ? company.nameAr : company.nameEn}
                  </h4>
                  {company.isActive ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {isAr ? 'مفعّلة' : 'Active'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      <XCircle className="w-3 h-3" />
                      {isAr ? 'معطّلة' : 'Inactive'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isAr ? company.coverageAr || company.coverageEn : company.coverageEn || company.coverageAr}
                </p>
              </div>

              {/* Activation Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={company.isActive}
                onClick={() => {
                  toggleCompanyActive(company.id);
                  toast.success(
                    company.isActive
                      ? isAr
                        ? `تم تعطيل ${company.nameAr} — اختفت من صفحة الدفع`
                        : `${company.nameEn} deactivated — hidden from checkout`
                      : isAr
                        ? `تم تفعيل ${company.nameAr} — ظاهرة الآن في صفحة الدفع`
                        : `${company.nameEn} activated — now visible at checkout`
                  );
                }}
                className={`relative w-12 h-6.5 rounded-full transition-colors shrink-0 cursor-pointer ${
                  company.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
                title={isAr ? 'تفعيل / تعطيل' : 'Activate / Deactivate'}
              >
                <span
                  className={`absolute top-0.75 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    company.isActive ? 'start-6.5' : 'start-0.75'
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-bold text-purple-700">
                <CircleDollarSign className="w-3.5 h-3.5" />
                {company.baseFeeIQD.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {company.minDays}–{company.maxDays} {isAr ? 'أيام' : 'days'}
              </span>
              {company.trackingUrl && (
                <a
                  href={company.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {isAr ? 'رابط التتبع' : 'Tracking'}
                </a>
              )}
            </div>

            {(company.notesAr || company.notesEn) && (
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {isAr ? company.notesAr || company.notesEn : company.notesEn || company.notesAr}
              </p>
            )}

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => openEdit(company)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                {isAr ? 'تعديل' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(company)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isAr ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-bold">
            {isAr ? 'لا توجد شركات شحن بعد' : 'No shipping companies yet'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'أضف شركة شحن دولي لتتمكن من تفعيلها للعملاء.'
              : 'Add an international courier to make it available to customers.'}
          </p>
        </div>
      )}
    </div>
  );
};
