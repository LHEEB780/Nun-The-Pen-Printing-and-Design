import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore, AdminRole } from '../../store/useAdminStore';
import { AnalyticsTab } from './AnalyticsTab';
import { FormBuilderTab } from './FormBuilderTab';
import { ProductManagementTab } from './ProductManagementTab';
import { OrderManagementTab } from './OrderManagementTab';
import { UserManagementTab } from './UserManagementTab';
import { ContentManagementTab } from './ContentManagementTab';
import { OffersManagementTab } from './OffersManagementTab';
import { CampaignsManagementTab } from './CampaignsManagementTab';
import {
  BarChart3,
  Sliders,
  Package,
  ClipboardList,
  Users,
  Shield,
  ArrowLeft,
  ArrowRight,
  Store,
  Sparkles,
  Lock,
  ChevronDown,
  Info,
  FileText,
  Unlock,
  Tag,
  Flame,
} from 'lucide-react';
import { toast } from 'sonner';

export type AdminDashboardTab =
  | 'analytics'
  | 'campaigns'
  | 'offers'
  | 'form_builder'
  | 'products'
  | 'orders'
  | 'users'
  | 'content';

interface AdminDashboardProps {
  onBackToStore: () => void;
  initialTab?: AdminDashboardTab;
  onOpenLandingPreview?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  initialTab = 'analytics',
  onOpenLandingPreview,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { currentRole, setCurrentRole } = useAdminStore();

  const [activeTab, setActiveTab] = useState<AdminDashboardTab>(initialTab);

  // Role metadata and accessible tabs definition
  const roleConfig: Record<
    AdminRole,
    {
      titleAr: string;
      titleEn: string;
      badgeClass: string;
      allowedTabs: AdminDashboardTab[];
      descriptionAr: string;
      descriptionEn: string;
    }
  > = {
    super_admin: {
      titleAr: 'المدير العام (Super Admin)',
      titleEn: 'Super Admin',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      allowedTabs: ['analytics', 'campaigns', 'offers', 'form_builder', 'products', 'orders', 'users', 'content'],
      descriptionAr: 'صلاحيات مطلقة: تحليلات الإيرادات، إدارة صفحات هبوط تيك توك، إدارة عروض الموسم والتخفيضات، إدارة المحتوى، بناء النماذج، وتسعير المنتجات.',
      descriptionEn: 'Full system privileges: Analytics, TikTok Landing Pages, Seasonal Deals, CMS Articles, Form Builder, Products, Orders, and Staff RBAC.',
    },
    sales_manager: {
      titleAr: 'مدير المبيعات (Sales Manager)',
      titleEn: 'Sales Manager',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
      allowedTabs: ['analytics', 'campaigns', 'offers', 'orders'],
      descriptionAr: 'صلاحيات المبيعات: تحليلات الإيرادات، صفحات هبوط تيك توك والإعلانات، إدارة عروض وتخفيضات الموسم، فواتير الطلبات، وبوابات الدفع.',
      descriptionEn: 'Sales permissions: Revenue charts, TikTok Funnels, promotional campaigns & seasonal offers, and customer orders tracking.',
    },
    inventory_manager: {
      titleAr: 'مدير المخزن والخامات (Inventory Manager)',
      titleEn: 'Inventory Manager',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      allowedTabs: ['products', 'orders'],
      descriptionAr: 'صلاحيات المخزون: إضافة وتعديل المنتجات، ضبط الخصومات المتدرجة، ومتابعة خامات الأكريليك والكرتون.',
      descriptionEn: 'Inventory permissions: Manage catalog items, bulk discounts, and track raw materials.',
    },
    designer: {
      titleAr: 'مصمم البروفات والليزر (Designer)',
      titleEn: 'Workshop Designer',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      allowedTabs: ['orders', 'form_builder', 'content'],
      descriptionAr: 'صلاحيات التصميم: فحص شعارات الزبائن، إدارة مقالات وتصاميم المعرض، وضبط حقول النماذج.',
      descriptionEn: 'Design permissions: Inspect logos, CMS articles, and review dynamic form specs.',
    },
  };

  const currentConfig = roleConfig[currentRole];

  // Auto switch tab and handle smooth access
  const handleSelectTab = (tab: AdminDashboardTab) => {
    if (!currentConfig.allowedTabs.includes(tab)) {
      // Auto-elevate to super_admin so admin tabs are never stuck
      setCurrentRole('super_admin');
      toast.info(
        isAr
          ? `تم تمكين الوصول وتفعيل صلاحيات المدير العام لهذا التبويب`
          : `Switched to Super Admin to access this tab`
      );
    }
    setActiveTab(tab);
  };

  const handleRoleChange = (role: AdminRole) => {
    setCurrentRole(role);
    const newConfig = roleConfig[role];
    if (!newConfig.allowedTabs.includes(activeTab)) {
      setActiveTab(newConfig.allowedTabs[0]);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Control Bar: Role Switcher & Back to Store */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              type="button"
              className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer"
            >
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isAr ? 'العودة للمتجر الرئيسي' : 'Back to Storefront'}</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-base sm:text-lg font-black text-slate-900">
                  {isAr ? 'لوحة تحكم نون والقلم (RBAC Admin)' : 'Noon & Pen Admin Studio (RBAC)'}
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                {isAr
                  ? 'إدارة المنتجات، النماذج الديناميكية، تدفق الورشة، وفريق العمل'
                  : 'Manage dynamic forms, tiered pricing, workshop pipeline & RBAC'}
              </p>
            </div>
          </div>

          {/* Interactive Role Switcher Selector */}
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 ps-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">{isAr ? 'تبديل دور الإدارة:' : 'Active Role:'}</span>
            </div>

            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
              className="bg-white border border-slate-300 text-xs font-extrabold text-slate-900 rounded-xl px-3 py-1.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
            >
              <option value="super_admin">{isAr ? '👑 المدير العام (Super Admin)' : '👑 Super Admin'}</option>
              <option value="sales_manager">{isAr ? '💼 مدير المبيعات (Sales Manager)' : '💼 Sales Manager'}</option>
              <option value="inventory_manager">{isAr ? '📦 مدير المخزن (Inventory Manager)' : '📦 Inventory Manager'}</option>
              <option value="designer">{isAr ? '🎨 مصمم الورشة (Designer)' : '🎨 Designer'}</option>
            </select>
          </div>
        </div>

        {/* Role Privileges Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs text-purple-200 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-purple-200">{isAr ? 'الصلاحيات النشطة:' : 'Current Permissions:'}</span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  {isAr ? currentConfig.titleAr : currentConfig.titleEn}
                </span>
              </div>
              <p className="text-xs text-purple-100/90 mt-1 max-w-3xl">
                {isAr ? currentConfig.descriptionAr : currentConfig.descriptionEn}
              </p>
            </div>
          </div>

          <div className="text-xs text-purple-200 shrink-0 font-medium">
            <span>{isAr ? 'التبويبات المتاحة لك:' : 'Accessible tabs:'} </span>
            <span className="font-mono font-bold text-white">
              {currentConfig.allowedTabs.length} / 6
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            {
              id: 'analytics' as const,
              labelAr: 'لوحة التحليلات والإيرادات',
              labelEn: 'Analytics & Revenue',
              icon: BarChart3,
            },
            {
              id: 'campaigns' as const,
              labelAr: 'صفحات هبوط تيك توك والحملات',
              labelEn: 'TikTok Landing Pages & Campaigns',
              icon: Flame,
            },
            {
              id: 'offers' as const,
              labelAr: 'عروض الموسم والتخفيضات',
              labelEn: 'Seasonal Deals & Offers',
              icon: Tag,
            },
            {
              id: 'content' as const,
              labelAr: 'إدارة المحتوى والمقالات (CMS)',
              labelEn: 'CMS Content & Articles',
              icon: FileText,
            },
            {
              id: 'form_builder' as const,
              labelAr: 'منشئ النماذج الديناميكية',
              labelEn: 'Dynamic Form Builder',
              icon: Sliders,
            },
            {
              id: 'products' as const,
              labelAr: 'إدارة المنتجات والتسعير المتدرج',
              labelEn: 'Products & Tiered Pricing',
              icon: Package,
            },
            {
              id: 'orders' as const,
              labelAr: 'خط إنتاج الورشة والطلبات',
              labelEn: 'Workshop Pipeline & Orders',
              icon: ClipboardList,
            },
            {
              id: 'users' as const,
              labelAr: 'إدارة الفريق والأدوار (RBAC)',
              labelEn: 'Staff & RBAC Management',
              icon: Users,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isAllowed = currentConfig.allowedTabs.includes(tab.id);
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                type="button"
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-600/20'
                    : 'bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 border-slate-200 shadow-2xs'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                {!isAllowed && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 font-normal">
                    {isAr ? 'ترقية' : 'Elevate'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'campaigns' && <CampaignsManagementTab onOpenPreview={onOpenLandingPreview} />}
          {activeTab === 'offers' && <OffersManagementTab />}
          {activeTab === 'content' && <ContentManagementTab />}
          {activeTab === 'form_builder' && <FormBuilderTab />}
          {activeTab === 'products' && <ProductManagementTab />}
          {activeTab === 'orders' && <OrderManagementTab />}
          {activeTab === 'users' && <UserManagementTab />}
        </div>
      </div>
    </div>
  );
};
