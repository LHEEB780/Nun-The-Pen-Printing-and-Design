import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore, DynamicFormField, CustomFieldType } from '../../store/useAdminStore';
import {
  Plus,
  Trash2,
  Edit2,
  Sliders,
  Type,
  List,
  Upload,
  Palette,
  Hash,
  Sparkles,
  Check,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';

export const FormBuilderTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { customFormFields, addField, updateField, deleteField } = useAdminStore();

  const [selectedCategory, setSelectedCategory] = useState<'led' | 'boxes' | 'cards' | 'portraits' | 'weddings'>('led');
  const [showModal, setShowModal] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  // Form State for creating/editing field
  const [labelAr, setLabelAr] = useState('');
  const [labelEn, setLabelEn] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldType>('text');
  const [required, setRequired] = useState(true);
  const [placeholderAr, setPlaceholderAr] = useState('');
  const [placeholderEn, setPlaceholderEn] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<Array<{ id: string; labelAr: string; labelEn: string; priceAdd: number }>>([
    { id: 'opt-1', labelAr: 'خيار قياسي أساسي', labelEn: 'Standard Option', priceAdd: 0 },
  ]);

  const categories = [
    { id: 'led', nameAr: 'لوحات وإضاءة LED والأكريليك', nameEn: 'LED & Acrylic Signs' },
    { id: 'boxes', nameAr: 'علب كرتون مقوى وتغليف (Rigid Boxes)', nameEn: 'Luxury Packaging Boxes' },
    { id: 'cards', nameAr: 'كروت أعمال وبصمة حرارية', nameEn: 'Business Cards & Stationery' },
    { id: 'portraits', nameAr: 'لوحات بورتريه فيكتور ورسومات', nameEn: 'Vector Portraits' },
    { id: 'weddings', nameAr: 'لوحات توثيق مناسبات وزفاف', nameEn: 'Wedding & Keepsakes' },
  ];

  const currentCategoryFields = customFormFields.filter((f) => f.category === selectedCategory);

  const handleOpenAddModal = () => {
    setEditingFieldId(null);
    setLabelAr('');
    setLabelEn('');
    setFieldType('text');
    setRequired(true);
    setPlaceholderAr('');
    setPlaceholderEn('');
    setDropdownOptions([{ id: 'opt-1', labelAr: 'خيار قياسي', labelEn: 'Standard', priceAdd: 0 }]);
    setShowModal(true);
  };

  const handleOpenEditModal = (field: DynamicFormField) => {
    setEditingFieldId(field.id);
    setLabelAr(field.labelAr);
    setLabelEn(field.labelEn);
    setFieldType(field.fieldType);
    setRequired(field.required);
    setPlaceholderAr(field.placeholderAr || '');
    setPlaceholderEn(field.placeholderEn || '');
    setDropdownOptions(field.options || [{ id: 'opt-1', labelAr: 'خيار قياسي', labelEn: 'Standard', priceAdd: 0 }]);
    setShowModal(true);
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelAr) return;

    if (editingFieldId) {
      updateField(editingFieldId, {
        labelAr,
        labelEn: labelEn || labelAr,
        fieldType,
        required,
        placeholderAr,
        placeholderEn,
        options: fieldType === 'dropdown' || fieldType === 'color_picker' ? dropdownOptions : undefined,
      });
    } else {
      addField({
        category: selectedCategory,
        labelAr,
        labelEn: labelEn || labelAr,
        fieldType,
        required,
        placeholderAr,
        placeholderEn,
        options: fieldType === 'dropdown' || fieldType === 'color_picker' ? dropdownOptions : undefined,
      });
    }

    setShowModal(false);
  };

  const handleAddOption = () => {
    setDropdownOptions([
      ...dropdownOptions,
      { id: `opt-${Date.now()}`, labelAr: '', labelEn: '', priceAdd: 0 },
    ]);
  };

  const handleUpdateOption = (index: number, key: string, val: any) => {
    const updated = [...dropdownOptions];
    updated[index] = { ...updated[index], [key]: val };
    setDropdownOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    setDropdownOptions(dropdownOptions.filter((_, i) => i !== index));
  };

  const getFieldTypeIcon = (type: CustomFieldType) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4 text-purple-600" />;
      case 'dropdown':
        return <List className="w-4 h-4 text-sky-600" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-emerald-600" />;
      case 'color_picker':
        return <Palette className="w-4 h-4 text-pink-600" />;
      case 'number':
        return <Hash className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and Category Selector */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>{isAr ? 'منشئ الحقول الديناميكية بدون تعديل الكود' : 'No-Code Dynamic Form Builder'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {isAr ? 'تخصيص استمارات الطلب حسب فئة المنتج' : 'Customize Product Order Forms'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isAr
                ? 'تحكم بالحقول التي يراها العميل عند تخصيص منتجات هذه الفئة: أضف حقول نصوص، قوائم خيارات مع تسعير إضافي، أو حقول رفع ملفات.'
                : 'Manage customer customization fields for each product line. Create text inputs, dropdowns with surcharges, or file upload requirements.'}
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            type="button"
            className="self-start md:self-auto px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة حقل جديد' : 'Add Custom Field'}</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {isAr ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* 2 Columns: Configured Fields List & Live Client Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Fields List (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">
              {isAr ? 'الحقول الفعالة حالياً في هذه الفئة' : 'Active Form Fields'}
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              {currentCategoryFields.length} {isAr ? 'حقول' : 'fields'}
            </span>
          </div>

          {currentCategoryFields.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs font-medium">
                {isAr ? 'لا توجد حقول مخصصة مضافة لهذه الفئة حالياً' : 'No custom fields configured for this category'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentCategoryFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 bg-slate-50/50 hover:bg-white transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {getFieldTypeIcon(field.fieldType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {isAr ? field.labelAr : field.labelEn}
                          </span>
                          {field.required && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              {isAr ? 'إجباري' : 'Required'}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {field.fieldType === 'text' && (isAr ? 'حقل نص حر' : 'Text Input')}
                          {field.fieldType === 'dropdown' && (isAr ? `قائمة منسدلة (${field.options?.length || 0} خيارات)` : `Dropdown (${field.options?.length || 0} options)`)}
                          {field.fieldType === 'upload' && (isAr ? 'رفع ملف وشعار' : 'File Upload')}
                          {field.fieldType === 'color_picker' && (isAr ? 'اختيار نغمة إضاءة' : 'LED Tone Picker')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(field)}
                        type="button"
                        className="p-2 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                        title={isAr ? 'تعديل الحقل' : 'Edit Field'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteField(field.id)}
                        type="button"
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title={isAr ? 'حذف الحقل' : 'Delete Field'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Options tags preview */}
                  {field.options && field.options.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {field.options.map((opt) => (
                        <span
                          key={opt.id}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700"
                        >
                          {isAr ? opt.labelAr : opt.labelEn}
                          {opt.priceAdd > 0 && ` (+${opt.priceAdd.toLocaleString()} د.ع)`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Live Customer Form Preview Canvas (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Eye className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'المعاينة الحية لما يراه العميل' : 'Live Customer Form Preview'}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              {isAr ? 'متزامن تلقائياً' : 'Real-time Sync'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            {currentCategoryFields.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {isAr ? f.labelAr : f.labelEn}
                  {f.required && <span className="text-red-500 ms-1">*</span>}
                </label>

                {f.fieldType === 'text' && (
                  <input
                    type="text"
                    disabled
                    placeholder={isAr ? (f.placeholderAr || 'أدخل النص هنا...') : (f.placeholderEn || 'Enter text...')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-500"
                  />
                )}

                {f.fieldType === 'dropdown' && (
                  <select disabled className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700">
                    {f.options?.map((opt) => (
                      <option key={opt.id}>
                        {isAr ? opt.labelAr : opt.labelEn} {opt.priceAdd > 0 ? `(+${opt.priceAdd.toLocaleString()} د.ع)` : ''}
                      </option>
                    ))}
                  </select>
                )}

                {f.fieldType === 'upload' && (
                  <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-white text-slate-500 text-xs flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <span>{isAr ? (f.placeholderAr || 'رفع ملف الشعار') : (f.placeholderEn || 'Upload Artwork')}</span>
                  </div>
                )}

                {f.fieldType === 'color_picker' && (
                  <div className="flex items-center gap-1.5">
                    {f.options?.map((opt) => (
                      <div key={opt.id} className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-bold">
                        {isAr ? opt.labelAr : opt.labelEn}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            {isAr
              ? 'أي تعديل تقوم به هنا يظهر فورياً لجميع العملاء في استمارة تخصيص المنتج بدون الحاجة لإعادة نشر التطبيق.'
              : 'Any fields saved here immediately update the customer personalization interface across the application.'}
          </p>
        </div>
      </div>

      {/* Add / Edit Field Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-base text-slate-900">
                {editingFieldId ? (isAr ? 'تعديل الحقل الديناميكي' : 'Edit Dynamic Field') : (isAr ? 'إضافة حقل تخصيص جديد' : 'Add New Custom Field')}
              </h4>
              <button onClick={() => setShowModal(false)} type="button" className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveField} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'اسم الحقل بالعربية *' : 'Field Label (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={labelAr}
                  onChange={(e) => setLabelAr(e.target.value)}
                  placeholder="مثال: نوع الخط العربي المعتمد"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'اسم الحقل بالإنجليزية' : 'Field Label (English)'}
                </label>
                <input
                  type="text"
                  value={labelEn}
                  onChange={(e) => setLabelEn(e.target.value)}
                  placeholder="e.g. Calligraphy Style"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    {isAr ? 'نوع الحقل:' : 'Field Type:'}
                  </label>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="text">{isAr ? 'نص حر (Text Input)' : 'Text Input'}</option>
                    <option value="dropdown">{isAr ? 'قائمة خيارات (Dropdown)' : 'Dropdown Options'}</option>
                    <option value="upload">{isAr ? 'رفع ملف (File Upload)' : 'File Upload'}</option>
                    <option value="color_picker">{isAr ? 'اختيار لون (Color Picker)' : 'Color Picker'}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="field-required"
                    checked={required}
                    onChange={(e) => setRequired(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                  <label htmlFor="field-required" className="text-xs font-bold text-slate-800 cursor-pointer">
                    {isAr ? 'حقل إجباري (Required)' : 'Mandatory'}
                  </label>
                </div>
              </div>

              {/* If dropdown or color_picker: Options editor */}
              {(fieldType === 'dropdown' || fieldType === 'color_picker') && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {isAr ? 'خيارات القائمة والإضافات السعرية:' : 'Options & Price Surcharges:'}
                    </span>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة خيار' : 'Add Option'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {dropdownOptions.map((opt, i) => (
                      <div key={opt.id || i} className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={opt.labelAr}
                          onChange={(e) => handleUpdateOption(i, 'labelAr', e.target.value)}
                          placeholder={isAr ? 'اسم الخيار بالعربية' : 'Option AR'}
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                        <input
                          type="number"
                          value={opt.priceAdd}
                          onChange={(e) => handleUpdateOption(i, 'priceAdd', parseInt(e.target.value) || 0)}
                          placeholder={isAr ? '+ السعر د.ع' : '+ Price IQD'}
                          className="w-24 px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                        />
                        {dropdownOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(i)}
                            className="p-1.5 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'نص توضيحي إرشادي للمستخدم:' : 'Helper Placeholder Text:'}
                </label>
                <input
                  type="text"
                  value={placeholderAr}
                  onChange={(e) => setPlaceholderAr(e.target.value)}
                  placeholder={isAr ? 'مثال: اكتب الاسم أو العبارة بدقة...' : 'e.g. Enter name here...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  {isAr ? 'حفظ الحقل' : 'Save Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
