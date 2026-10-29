import React, { useState } from 'react';
import { 
  Users, CheckCircle2, XCircle, AlertCircle, ShieldCheck, Award, 
  Search, Plus, Phone, Sparkles, Filter, ExternalLink, Link2, 
  MessageCircle, Send, Check, Copy, Edit, Trash2, Megaphone, QrCode
} from 'lucide-react';
import { 
  useAffiliateStore, PARTNER_RANKS_CONFIG, PartnerRank, 
  PartnerStatus, PartnerItem 
} from '../../store/useAffiliateStore';
import { DigitalEmployeeCard } from '../affiliates/DigitalEmployeeCard';
import { AdminQRCodesTab } from './AdminQRCodesTab';

interface AdminSalesPartnersTabProps {
  isAr?: boolean;
}

export const AdminSalesPartnersTab: React.FC<AdminSalesPartnersTabProps> = ({ isAr = true }) => {
  const {
    partners,
    applications,
    linkedClients,
    announcementAr,
    qrCampaigns,
    setAnnouncement,
    approveApplication,
    rejectApplication,
    addPartner,
    updatePartner,
    togglePartnerStatus,
    setPartnerRank,
    linkClientManually,
    unlinkClient,
  } = useAffiliateStore();

  // Active sub-tab
  const [subTab, setSubTab] = useState<'partners' | 'applications' | 'manual_link' | 'broadcast' | 'qr_codes'>('partners');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Approval Modal state
  const [approvedResult, setApprovedResult] = useState<{ partner: PartnerItem; pin: string } | null>(null);

  // Manual link form
  const [linkPhone, setLinkPhone] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkPartnerId, setLinkPartnerId] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');

  // Broadcast text
  const [broadcastDraft, setBroadcastDraft] = useState(announcementAr || '');
  const [broadcastSaved, setBroadcastSaved] = useState(false);

  // Digital card preview modal
  const [previewCardPartner, setPreviewCardPartner] = useState<PartnerItem | null>(null);

  // Add Partner Modal state
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerWhatsapp, setNewPartnerWhatsapp] = useState('');
  const [newPartnerCity, setNewPartnerCity] = useState('بغداد');
  const [newPartnerRank, setNewPartnerRank] = useState<PartnerRank>('junior');
  const [addPartnerError, setAddPartnerError] = useState('');

  // Handle Add Partner Directly
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    setAddPartnerError('');
    if (!newPartnerName.trim() || !newPartnerPhone.trim()) {
      setAddPartnerError(isAr ? 'الاسم ورقم الهاتف مطلوبان' : 'Name and phone required');
      return;
    }

    try {
      addPartner({
        fullName: newPartnerName.trim(),
        phone: newPartnerPhone.trim(),
        whatsapp: newPartnerWhatsapp.trim() || newPartnerPhone.trim(),
        city: newPartnerCity,
        status: 'active',
        rank: newPartnerRank,
        joinedAt: new Date().toISOString(),
      });
      setIsAddPartnerOpen(false);
      setNewPartnerName('');
      setNewPartnerPhone('');
      setNewPartnerWhatsapp('');
    } catch (err: any) {
      setAddPartnerError(err.message || 'Error adding partner');
    }
  };

  // Filter partners
  const filteredPartners = partners.filter((p) => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);

    const matchesRank = rankFilter === 'all' || p.rank === rankFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesRank && matchesStatus;
  });

  // Pending applications
  const pendingApps = applications.filter((a) => a.status === 'pending');

  // Handle manual linking
  const handleManualLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkPhone.trim() || !linkName.trim() || !linkPartnerId) return;

    linkClientManually(linkPhone.trim(), linkName.trim(), linkPartnerId);
    setLinkSuccess(isAr ? `تم ربط العميل ${linkName} بالشريك بنجاح وبشكل دائم` : 'Client linked successfully');
    setLinkPhone('');
    setLinkName('');
    setTimeout(() => setLinkSuccess(''), 4000);
  };

  // Handle broadcast save
  const handleSaveBroadcast = () => {
    setAnnouncement(broadcastDraft.trim());
    setBroadcastSaved(true);
    setTimeout(() => setBroadcastSaved(false), 2500);
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              {isAr ? 'إدارة فريق المبيعات والشركاء المعتمدين' : 'Sales Partners Management'}
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif">
            {isAr ? 'شركاء نون والقلم وممثلو تطوير الأعمال' : 'Noon & Pen Sales Partners'}
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            {isAr 
              ? 'إدارة عقود ممثلي المبيعات، اعتماد طلبات الانضمام، توليد الأرقام الوظيفية والأكواد، وإدارة الارتباط الدائم للعملاء.' 
              : 'Approve new partner applications, issue employee IDs, and maintain lifetime client bindings.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubTab('qr_codes')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/40 font-bold text-xs transition shadow-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'مولّد باركودات QR للحملات' : 'QR Campaigns Generator'}</span>
          </button>

          <button
            onClick={() => setIsAddPartnerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة شريك جديد مباشرة' : 'Add New Partner'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSubTab('partners')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'partners' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isAr ? 'قائمة الشركاء والممثلين' : 'Partners Directory'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-stone-700 text-white text-[10px]">
            {partners.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('qr_codes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'qr_codes' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{isAr ? 'باركودات QR المطبوعة (ستاندات وملصقات)' : 'Printable QR Collateral'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-stone-900 text-[10px] font-mono font-bold">
            {qrCampaigns.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'applications' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isAr ? 'طلبات الانضمام الجديدة' : 'Pending Applications'}</span>
          {pendingApps.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold">
              {pendingApps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('manual_link')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'manual_link' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>{isAr ? 'مدير ربط العملاء الدائم' : 'Lifetime Link Manager'}</span>
        </button>

        <button
          onClick={() => setSubTab('broadcast')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'broadcast' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>{isAr ? 'الرسائل الجماعية والتوجيهات' : 'Broadcast Announcement'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: PARTNERS DIRECTORY */}
      {/* ========================================================= */}
      {subTab === 'partners' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute top-3 rtl:right-3 ltr:left-3 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? 'بحث بالاسم، الرقم الوظيفي، الكود أو الهاتف...' : 'Search by name, ID, code, phone...'}
                className="w-full py-2 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white outline-none"
              >
                <option value="all">{isAr ? 'كل الرتب' : 'All Ranks'}</option>
                <option value="junior">{isAr ? 'مندوب مبتدئ' : 'Junior'}</option>
                <option value="specialist">{isAr ? 'أخصائي معتمد' : 'Specialist'}</option>
                <option value="manager">{isAr ? 'مدير حسابات' : 'Manager'}</option>
                <option value="ambassador">{isAr ? 'سفير ذهبي' : 'Ambassador'}</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white outline-none"
              >
                <option value="all">{isAr ? 'كل الحالات' : 'All Status'}</option>
                <option value="active">{isAr ? 'نشط' : 'Active'}</option>
                <option value="suspended">{isAr ? 'معلق' : 'Suspended'}</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">{isAr ? 'الممثل / الشريك' : 'Partner Name'}</th>
                    <th className="py-3 px-4">{isAr ? 'الرقم الوظيفي' : 'Employee ID'}</th>
                    <th className="py-3 px-4">{isAr ? 'كود الإحالة' : 'Referral Code'}</th>
                    <th className="py-3 px-4">{isAr ? 'الرتبة والعمولة' : 'Rank & Bonus'}</th>
                    <th className="py-3 px-4">{isAr ? 'رمز المرور (PIN)' : 'PIN'}</th>
                    <th className="py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="py-3 px-4">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredPartners.map((partner) => {
                    const rankConfig = PARTNER_RANKS_CONFIG[partner.rank];
                    return (
                      <tr key={partner.id} className="hover:bg-stone-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{partner.fullName}</div>
                          <div className="text-[11px] text-stone-500 font-mono">
                            {partner.phone} • {partner.city}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          {partner.employeeId}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            {partner.referralCode}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={partner.rank}
                            onChange={(e) => setPartnerRank(partner.id, e.target.value as PartnerRank)}
                            className="text-xs py-1 px-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 font-semibold outline-none"
                          >
                            <option value="junior">مندوب مبتدئ (+0%)</option>
                            <option value="specialist">أخصائي معتمد (+2%)</option>
                            <option value="manager">مدير حسابات (+4%)</option>
                            <option value="ambassador">سفير ذهبي (+7%)</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-stone-700">
                          {partner.pinCode}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => togglePartnerStatus(partner.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                              partner.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {partner.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معلق' : 'Suspended')}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewCardPartner(partner)}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium transition cursor-pointer"
                            >
                              {isAr ? 'معاينة الهوية' : 'View ID'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSubTab('qr_codes')}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title={isAr ? 'توليد باركود مطبوع لهذا الشريك' : 'Generate QR'}
                            >
                              <QrCode className="w-3 h-3 text-amber-700" />
                              <span>{isAr ? 'توليد QR' : 'QR'}</span>
                            </button>
                          </div>
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
      {/* SUB-TAB 2: PENDING APPLICATIONS QUEUE */}
      {/* ========================================================= */}
      {subTab === 'applications' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {isAr ? 'طلبات الانضمام المقدمة من المسوقين والممثلين' : 'Partner Applications'}
            </h3>
            <p className="text-xs text-stone-500">
              {isAr ? 'الموافقة بضغطة زر تقوم تلقائياً بإنشاء الرقم الوظيفي وكود الشريك ورمز المرور السريع' : 'Approve with 1 click to auto-generate Employee ID and PIN'}
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
              <CheckCircle2 className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">{isAr ? 'لا توجد طلبات انضمام حالياً' : 'No applications found'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{app.fullName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
                        {app.city}
                      </span>
                      {app.status === 'pending' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                          {isAr ? 'قيد المراجعة' : 'Pending'}
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          {isAr ? 'تمت الموافقة' : 'Approved'}
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                          {isAr ? 'مرفوض' : 'Rejected'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-600 flex items-center gap-3">
                      <span>{isAr ? 'هاتف:' : 'Phone:'} <strong className="font-mono text-stone-800">{app.phone}</strong></span>
                      <span>•</span>
                      <span>{isAr ? 'واتساب:' : 'WhatsApp:'} <strong className="font-mono text-stone-800">{app.whatsapp}</strong></span>
                      <span>•</span>
                      <span className="text-stone-400">{new Date(app.createdAt).toLocaleDateString(isAr ? 'ar-IQ' : 'en-US')}</span>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-xl text-xs text-stone-700 border border-stone-100 mt-2">
                      <div><strong className="text-stone-900">{isAr ? 'الخبرة والشبكة:' : 'Experience:'}</strong> {app.experience}</div>
                      <div className="mt-1"><strong className="text-stone-900">{isAr ? 'دافع الانضمام:' : 'Reason:'}</strong> {app.reason}</div>
                    </div>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const res = approveApplication(app.id, 'junior');
                          if (res) setApprovedResult(res);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isAr ? 'موافقة واعتماد فوري' : 'Approve Partner'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectApplication(app.id)}
                        className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 font-medium text-xs transition"
                      >
                        {isAr ? 'رفض' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: LIFETIME CLIENT LINK MANAGER */}
      {/* ========================================================= */}
      {subTab === 'manual_link' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {isAr ? 'ربط عميل يدوي أو شركة برقم شريك معتمد' : 'Manual Lifetime Client Linker'}
            </h3>
            <p className="text-xs text-stone-500 mb-4 max-w-2xl leading-relaxed">
              {isAr 
                ? 'استخدم هذه الأداة لربط أي زبون أو جهة (كافيه، مطعم، شركة) برقم شريك محدد. بمجرد إتمام هذا الربط، سيتم تسجيل عمولات جميع طلبات هذا الزبون المستقبلية تلقائياً للممثل المختار.' 
                : 'Bind any customer phone permanently to a partner ID.'}
            </p>

            {linkSuccess && (
              <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{linkSuccess}</span>
              </div>
            )}

            <form onSubmit={handleManualLinkSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'اسم العميل أو الجهة' : 'Client / Business Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    placeholder={isAr ? 'مثال: كافيه البندقية أو د. حسام' : 'e.g. Venice Cafe'}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'رقم هاتف العميل (المعرف الأساسي)' : 'Client Phone'} *
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={linkPhone}
                    onChange={(e) => setLinkPhone(e.target.value)}
                    placeholder="0770XXXXXXX"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الشريك / الممثل المستفيد' : 'Target Sales Partner'} *
                  </label>
                  <select
                    required
                    value={linkPartnerId}
                    onChange={(e) => setLinkPartnerId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="">{isAr ? '-- اختر الشريك --' : '-- Select Partner --'}</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.employeeId} - {p.referralCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition shadow-sm"
                >
                  <Link2 className="w-4 h-4" />
                  <span>{isAr ? 'تثبيت الارتباط الدائم مدى الحياة' : 'Bind Lifetime Link'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Linked Clients Master List */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900">
                {isAr ? 'جدول العملاء المرتبطين في النظام (سجل الحماية)' : 'System Bound Clients'}
              </h4>
              <span className="text-xs font-mono text-stone-500">
                {Object.keys(linkedClients).length} {isAr ? 'عميل مرتبط' : 'records'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">{isAr ? 'هاتف العميل' : 'Phone'}</th>
                    <th className="py-3 px-4">{isAr ? 'اسم العميل' : 'Client'}</th>
                    <th className="py-3 px-4">{isAr ? 'الشريك المرتبط به' : 'Assigned Partner'}</th>
                    <th className="py-3 px-4">{isAr ? 'طريقة الربط' : 'Source'}</th>
                    <th className="py-3 px-4">{isAr ? 'الطلبات' : 'Orders'}</th>
                    <th className="py-3 px-4">{isAr ? 'إجمالي المشتريات' : 'Total Spent'}</th>
                    <th className="py-3 px-4">{isAr ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {Object.values(linkedClients).map((c) => {
                    const assignedPartner = partners.find((p) => p.id === c.partnerId);
                    return (
                      <tr key={c.clientPhone} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">{c.clientPhone}</td>
                        <td className="py-3 px-4 font-semibold text-stone-800">{c.clientName}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-stone-900">{assignedPartner?.fullName || c.partnerId}</span>
                          <span className="text-[10px] font-mono text-stone-400 block">{assignedPartner?.employeeId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-mono">
                            {c.source === 'code' ? 'كود الشريك' : 'ربط إداري'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{c.totalOrdersCount}</td>
                        <td className="py-3 px-4 font-mono font-semibold">{c.totalSpentIQD.toLocaleString()} د.ع</td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => unlinkClient(c.clientPhone)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-medium"
                          >
                            {isAr ? 'فك الارتباط' : 'Unlink'}
                          </button>
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
      {/* SUB-TAB 4: BROADCAST ANNOUNCEMENT */}
      {/* ========================================================= */}
      {subTab === 'broadcast' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">
              {isAr ? 'شريط التوجيهات والرسائل الجماعية لبوابة الشركاء' : 'Partner Portal Broadcast Announcement'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 max-w-xl">
            {isAr 
              ? 'يظهر هذا التنبيه في أعلى لوحة تحكم جميع ممثلي المبيعات فور تسجيل دخولهم (مثل إعلانات الحملات الموسمية أو بونص المبيعات).'
              : 'This notification displays across all partner portals.'}
          </p>

          <textarea
            rows={3}
            value={broadcastDraft}
            onChange={(e) => setBroadcastDraft(e.target.value)}
            placeholder={isAr ? 'اكتب نص التوجيه هنا...' : 'Broadcast text...'}
            className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setBroadcastDraft('');
                setAnnouncement('');
              }}
              className="text-xs text-stone-400 hover:text-rose-600"
            >
              {isAr ? 'مسح التنبيه تماماً' : 'Clear broadcast'}
            </button>

              <button
                type="button"
                onClick={handleSaveBroadcast}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition"
              >
                <Send className="w-4 h-4" />
                <span>{broadcastSaved ? (isAr ? 'تم الحفظ!' : 'Saved!') : (isAr ? 'نشر التوجيه للشركاء' : 'Publish Broadcast')}</span>
              </button>
            </div>
          </div>
        )}

      {/* ========================================================= */}
      {/* SUB-TAB 5: PRINTABLE QR MARKETING CAMPAIGNS */}
      {/* ========================================================= */}
      {subTab === 'qr_codes' && (
        <AdminQRCodesTab isAr={isAr} />
      )}

      {/* Approval Success Modal with WhatsApp Message */}
      {approvedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-center text-stone-900 mb-1">
              {isAr ? 'تم اعتماد الشريك بنجاح!' : 'Partner Approved!'}
            </h3>
            <p className="text-xs text-stone-500 text-center mb-4">
              {isAr ? 'تم إنشاء المعرفات الرسمية للشريك ويمكنك إرسال بيانات الدخول إليه مباشرة' : 'Credentials generated successfully'}
            </p>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between">
                <span className="text-stone-500">{isAr ? 'الاسم:' : 'Name:'}</span>
                <span className="font-bold text-stone-900">{approvedResult.partner.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isAr ? 'الرقم الوظيفي:' : 'ID:'}</span>
                <span className="font-bold text-stone-900">{approvedResult.partner.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isAr ? 'كود الإحالة:' : 'Code:'}</span>
                <span className="font-bold text-amber-800">{approvedResult.partner.referralCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isAr ? 'رمز المرور (PIN):' : 'PIN:'}</span>
                <span className="font-bold text-emerald-700">{approvedResult.pin}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setApprovedResult(null)}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                {isAr ? 'تم، إغلاق' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital ID Preview Modal */}
      {previewCardPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-stone-900/95 p-6 rounded-3xl max-w-lg w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 text-white">
              <span className="text-xs font-bold">{isAr ? 'معاينة بطاقة الهوية الرسمية' : 'Digital Employee ID Preview'}</span>
              <button
                onClick={() => setPreviewCardPartner(null)}
                className="text-stone-400 hover:text-white text-xs"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>

            <DigitalEmployeeCard partner={previewCardPartner} isAr={isAr} />
          </div>
        </div>
      )}

      {/* Add Partner Direct Modal */}
      {isAddPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              {isAr ? 'إضافة شريك مبيعات جديد مباشرة' : 'Directly Add New Sales Partner'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {isAr ? 'سيتم توليد الرقم الوظيفي وكود الشريك ورمز المرور تلقائياً' : 'Auto-generates ID, Code and PIN'}
            </p>

            {addPartnerError && (
              <div className="p-3 mb-3 bg-rose-50 text-rose-700 text-xs rounded-xl">
                {addPartnerError}
              </div>
            )}

            <form onSubmit={handleAddPartner} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'الاسم الكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  placeholder={isAr ? 'اسم الشريك' : 'Partner name'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'رقم الهاتف' : 'Phone'} *
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={newPartnerPhone}
                    onChange={(e) => setNewPartnerPhone(e.target.value)}
                    placeholder="0770XXXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'المحافظة' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={newPartnerCity}
                    onChange={(e) => setNewPartnerCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'رتبة البداية' : 'Initial Rank'}
                </label>
                <select
                  value={newPartnerRank}
                  onChange={(e) => setNewPartnerRank(e.target.value as PartnerRank)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none bg-white"
                >
                  <option value="junior">مندوب مبتدئ (+0%)</option>
                  <option value="specialist">أخصائي معتمد (+2%)</option>
                  <option value="manager">مدير حسابات (+4%)</option>
                  <option value="ambassador">سفير ذهبي (+7%)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
                >
                  {isAr ? 'إضافة الشريك' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
