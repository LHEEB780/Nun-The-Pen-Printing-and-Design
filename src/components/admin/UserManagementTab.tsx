import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore, AdminRole, StaffMember } from '../../store/useAdminStore';
import {
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  Key,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  Building,
  Clock,
  Sparkles,
  X,
  AlertTriangle,
} from 'lucide-react';

export const UserManagementTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const {
    staffMembers,
    currentRole,
    updateStaffRole,
    addStaffMember,
    toggleStaffStatus,
  } = useAdminStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+964 780 ');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<AdminRole>('designer');

  const isSuperAdmin = currentRole === 'super_admin';

  const roleDefinitions: Record<
    AdminRole,
    { titleAr: string; titleEn: string; color: string; badgeBg: string; permissionsAr: string[]; permissionsEn: string[] }
  > = {
    super_admin: {
      titleAr: 'المدير العام (Super Admin)',
      titleEn: 'Super Administrator',
      color: 'text-purple-700',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      permissionsAr: [
        'كامل الصلاحيات دون قيود',
        'تعديل وتعيين أدوار الموظفين',
        'تعديل منشئ النماذج الديناميكية',
        'إدارة التسعير المتدرج والمنتجات',
        'الموافقة على المعاملات المالية',
      ],
      permissionsEn: [
        'Unrestricted full system control',
        'Assign and change staff roles',
        'Dynamic Form Builder configuration',
        'Product & tiered pricing management',
        'Approve all payments & transactions',
      ],
    },
    sales_manager: {
      titleAr: 'مدير المبيعات (Sales Manager)',
      titleEn: 'Sales Manager',
      color: 'text-sky-700',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      permissionsAr: [
        'عرض وتحديث فواتير وحالات الطلبات',
        'تأكيد الدفع واستلام زين كاش / FIB',
        'التواصل مع الزبائن وتنسيق الشحن',
        'الاطلاع على تقارير وتحليلات الإيرادات',
      ],
      permissionsEn: [
        'View & update orders workflow',
        'Confirm ZainCash / FIB / COD payments',
        'Client outreach & shipping routing',
        'Access revenue & sales analytics',
      ],
    },
    inventory_manager: {
      titleAr: 'مدير المخزن والخامات (Inventory Manager)',
      titleEn: 'Inventory Manager',
      color: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      permissionsAr: [
        'إضافة وتعديل المنتجات وأسعار الأساس',
        'متابعة كميات ألواح الأكريليك وورق الطباعة',
        'تحديد الخصومات للكميات الكبيرة',
      ],
      permissionsEn: [
        'Add & edit products and base costs',
        'Monitor acrylic sheets and paper stock',
        'Define bulk tiered discounts',
      ],
    },
    designer: {
      titleAr: 'مصمم البروفات والليزر (Designer)',
      titleEn: 'Production Designer',
      color: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      permissionsAr: [
        'تنزيل شعارات وملفات الزبائن المرفوعة',
        'تحديث حالة الطلب إلى "في التصميم والبروفة"',
        'إضافة ملاحظات التصميم والقص بالليزر',
      ],
      permissionsEn: [
        'Download customer logos & vector files',
        'Set status to "In Design & 3D Proof"',
        'Add laser cutting & prepress notes',
      ],
    },
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addStaffMember({
      name,
      email,
      phone,
      department: department || (isAr ? 'قسم التصميم والتنفيذ' : 'Production Dept'),
      role,
      status: 'active',
    });

    setSuccessToast(isAr ? `تمت إضافة الموظف (${name}) بنجاح` : `Staff member (${name}) added successfully`);
    setTimeout(() => setSuccessToast(''), 3500);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setDepartment('');
  };

  const handleRoleChange = (staffId: string, staffName: string, newRole: AdminRole) => {
    if (!isSuperAdmin) {
      alert(isAr ? 'عذراً! فقط المدير العام (Super Admin) يملك صلاحية تغيير أدوار الفريق.' : 'Permission Denied! Only Super Admin can reassign roles.');
      return;
    }
    updateStaffRole(staffId, newRole);
    setSuccessToast(
      isAr
        ? `تم تحديث دور ${staffName} إلى ${roleDefinitions[newRole].titleAr}`
        : `Role for ${staffName} updated to ${roleDefinitions[newRole].titleEn}`
    );
    setTimeout(() => setSuccessToast(''), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="p-1 hover:bg-emerald-100 rounded-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* RBAC Header & Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isAr ? 'إدارة الموظفين والصلاحيات (RBAC)' : 'Staff & Role-Based Access Control'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              {isAr
                ? 'تحكم متقدم في الوصول المبني على الأدوار (Super Admin, Sales Manager, Inventory Manager, Designer). يتيح للمدير العام تفويض الصلاحيات وضبط أمن البيانات.'
                : 'Advanced Role-Based Access Control for Noon & Pen. Empowers Super Admins to assign roles, govern permissions, and ensure workshop data security.'}
            </p>
          </div>

          <div>
            {isSuperAdmin ? (
              <button
                onClick={() => setShowAddModal(true)}
                type="button"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isAr ? 'إضافة موظف جديد' : 'Add New Staff'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'تعيين الأدوار مقتصر على المدير العام' : 'Role assignment requires Super Admin'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Roles Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
          {(Object.keys(roleDefinitions) as AdminRole[]).map((rKey) => {
            const def = roleDefinitions[rKey];
            const activeInRole = staffMembers.filter((m) => m.role === rKey).length;
            return (
              <div
                key={rKey}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${def.badgeBg}`}>
                      {isAr ? def.titleAr.split(' ')[0] : def.titleEn}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {activeInRole} {isAr ? 'أعضاء' : 'staff'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{isAr ? def.titleAr : def.titleEn}</h3>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    {(isAr ? def.permissionsAr : def.permissionsEn).map((perm, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              {isAr ? 'فريق العمل المسجل' : 'Registered Staff Members'}
            </h3>
            <span className="ms-2 px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
              {staffMembers.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {isAr ? 'التعديل الفوري للأدوار مفعل للمدير' : 'Live role reassignment enabled'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 text-start">{isAr ? 'الموظف' : 'Staff Name'}</th>
                <th className="py-3.5 px-6 text-start">{isAr ? 'القسم / التخصص' : 'Department'}</th>
                <th className="py-3.5 px-6 text-start">{isAr ? 'الدور والصلاحية (RBAC)' : 'Role & Access'}</th>
                <th className="py-3.5 px-6 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-6 text-start">{isAr ? 'آخر نشاط' : 'Last Active'}</th>
                <th className="py-3.5 px-6 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-sky-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-200">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{staff.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{staff.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staff.department}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>{staff.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {isSuperAdmin ? (
                      <select
                        value={staff.role}
                        onChange={(e) => handleRoleChange(staff.id, staff.name, e.target.value as AdminRole)}
                        className={`text-xs font-bold rounded-xl px-3 py-1.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                          roleDefinitions[staff.role].badgeBg
                        }`}
                      >
                        <option value="super_admin">{isAr ? 'المدير العام (Super Admin)' : 'Super Admin'}</option>
                        <option value="sales_manager">{isAr ? 'مدير المبيعات (Sales Manager)' : 'Sales Manager'}</option>
                        <option value="inventory_manager">{isAr ? 'مدير المخزن (Inventory Manager)' : 'Inventory Manager'}</option>
                        <option value="designer">{isAr ? 'مصمم البروفات (Designer)' : 'Designer'}</option>
                      </select>
                    ) : (
                      <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border ${roleDefinitions[staff.role].badgeBg}`}>
                        {isAr ? roleDefinitions[staff.role].titleAr : roleDefinitions[staff.role].titleEn}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        staff.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {staff.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'موقوف مؤقتاً' : 'Suspended')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{staff.lastActive}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-end">
                    {isSuperAdmin && (
                      <button
                        onClick={() => toggleStaffStatus(staff.id)}
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border ${
                          staff.status === 'active'
                            ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {staff.status === 'active' ? (isAr ? 'تجميد الحساب' : 'Suspend') : (isAr ? 'تفعيل' : 'Activate')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scale">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isAr ? 'إضافة عضو جديد لفريق نون والقلم' : 'Add New Staff Member'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: أحمد عبد الله' : 'e.g. Ahmed Abdullah'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'البريد الإلكتروني المهني' : 'Work Email'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed@noonwalqalam.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'رقم الهاتف المباشر' : 'Direct Phone'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none text-start"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'القسم أو الورشة' : 'Department'}
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder={isAr ? 'مثال: قسم قص الليزر والحفر' : 'e.g. Laser CNC Department'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'الدور والصلاحية الممنوحة (Role)' : 'Assigned Role'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="designer">{isAr ? 'مصمم بروفات وليزر (Designer)' : 'Production Designer'}</option>
                  <option value="sales_manager">{isAr ? 'مدير مبيعات وفواتير (Sales Manager)' : 'Sales Manager'}</option>
                  <option value="inventory_manager">{isAr ? 'مدير مخزن وخامات (Inventory Manager)' : 'Inventory Manager'}</option>
                  <option value="super_admin">{isAr ? 'مدير عام بصلاحيات كاملة (Super Admin)' : 'Super Administrator'}</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isAr ? 'حفظ وإضافة' : 'Save & Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
