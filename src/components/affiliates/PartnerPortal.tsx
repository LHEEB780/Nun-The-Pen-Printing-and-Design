import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Users, Award, Wallet, Briefcase, Share2, Copy, Check, ExternalLink, 
  ArrowRight, Phone, MessageCircle, DollarSign, TrendingUp, Sparkles, 
  Plus, Clock, CheckCircle2, AlertCircle, FileText, Download, Printer, 
  HelpCircle, ChevronRight, LogOut, Lock, Key, ShieldCheck, MapPin, 
  Building2, Coffee, Store, QrCode
} from 'lucide-react';
import { 
  useAffiliateStore, PARTNER_RANKS_CONFIG, PartnerRank, 
  CRMDealStage, WithdrawalMethod 
} from '../../store/useAffiliateStore';
import { useAutonomousAgentsStore } from '../../store/useAutonomousAgentsStore';
import { DigitalEmployeeCard } from './DigitalEmployeeCard';
import { PartnerApplicationModal } from './PartnerApplicationModal';

interface PartnerPortalProps {
  onBackToStore: () => void;
  isAr?: boolean;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  onBackToStore,
  isAr = true,
}) => {
  const {
    partners,
    currentPartnerSessionId,
    loginPartner,
    logoutPartner,
    setCurrentPartnerSession,
    getPartnerMetrics,
    commissionLedger,
    linkedClients,
    withdrawals,
    crmDeals,
    academyGuides,
    announcementAr,
    requestWithdrawal,
    addCRMDeal,
    updateCRMDealStage,
    addCRMDealNote,
  } = useAffiliateStore();

  // Navigation tab inside portal
  const [activeTab, setActiveTab] = useState<
    'overview' | 'clients' | 'crm' | 'wallet' | 'tools' | 'card' | 'academy'
  >('overview');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Application modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawalMethod>('zain_cash');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState('');

  // CRM New Deal modal/form state
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [newDealBusiness, setNewDealBusiness] = useState('');
  const [newDealType, setNewDealType] = useState<'restaurant' | 'cafe' | 'office' | 'hotel' | 'clinic' | 'retail' | 'other'>('cafe');
  const [newDealCustomType, setNewDealCustomType] = useState('');
  const [newDealContact, setNewDealContact] = useState('');
  const [newDealPhone, setNewDealPhone] = useState('');
  const [newDealCity, setNewDealCity] = useState('بغداد');
  const [newDealValue, setNewDealValue] = useState<number | ''>(500000);
  const [newDealInitialNote, setNewDealInitialNote] = useState('');

  // CRM Note state for active deal
  const [selectedDealForNote, setSelectedDealForNote] = useState<string | null>(null);
  const [crmNoteText, setCrmNoteText] = useState('');

  // Copied states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPitchIndex, setCopiedPitchIndex] = useState<number | null>(null);

  // Partner Personal QR Data URL
  const [partnerQrDataUrl, setPartnerQrDataUrl] = useState<string>('');

  // Active Partner
  const activePartner = partners.find((p) => p.id === currentPartnerSessionId);
  const metrics = activePartner ? getPartnerMetrics(activePartner.id) : null;

  // Generate Partner QR
  useEffect(() => {
    if (!activePartner) return;
    const url = `${window.location.origin}${window.location.pathname}?ref=${activePartner.referralCode}`;
    QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: '#1c1917', light: '#ffffff' },
    })
      .then(setPartnerQrDataUrl)
      .catch(console.error);
  }, [activePartner]);

  // Filtered data for active partner
  const partnerCommissions = commissionLedger.filter((c) => c.partnerId === activePartner?.id);
  const partnerWithdrawals = withdrawals.filter((w) => w.partnerId === activePartner?.id);
  const partnerDeals = crmDeals.filter((d) => d.partnerId === activePartner?.id);
  const partnerClientsList = Object.values(linkedClients).filter((c) => c.partnerId === activePartner?.id);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginPartner(loginPhone, loginPin);
    if (!res.success) {
      setLoginError(res.error || (isAr ? 'بيانات الدخول غير صحيحة' : 'Invalid login credentials'));
    }
  };

  // Quick Demo Account Switcher
  const handleQuickDemoLogin = (partnerId: string) => {
    setCurrentPartnerSession(partnerId);
    setLoginError('');
  };

  // Handle Withdrawal Request
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawErrorMsg('');
    setWithdrawSuccessMsg('');

    if (!activePartner) return;
    const amount = Number(withdrawAmount);
    if (!amount || amount < 25000) {
      setWithdrawErrorMsg(isAr ? 'الحد الأدنى لطلب السحب هو 25,000 د.ع' : 'Minimum withdrawal is 25,000 IQD');
      return;
    }

    if (!withdrawAccount.trim()) {
      setWithdrawErrorMsg(isAr ? 'يرجى إدخال رقم المحفظة أو تفاصيل الاستلام' : 'Please provide account details');
      return;
    }

    const res = requestWithdrawal(
      activePartner.id,
      amount,
      withdrawMethod,
      withdrawAccount.trim(),
      withdrawNotes.trim() || undefined
    );

    if (res.success) {
      setWithdrawSuccessMsg(isAr ? 'تم رفع طلب السحب بنجاح، سيتم تدقيقه وتحويله خلال ساعات العمل' : 'Withdrawal request submitted successfully');
      
      // Dispatch Autonomous Agent Compliance Check
      const { createTask, sendInterAgentMessage, isGlobalKillSwitchActive } = useAutonomousAgentsStore.getState();
      if (!isGlobalKillSwitchActive) {
        const isCriticalPayout = amount >= 250000;
        createTask({
          agentId: 'agent-partner-network',
          titleAr: `تدقيق ومصادقة سحب رصيد: ${activePartner.fullName} (${amount.toLocaleString()} د.ع)`,
          titleEn: `Payout audit: ${activePartner.fullName} (${amount.toLocaleString()} IQD)`,
          riskLevel: isCriticalPayout ? 'red' : 'yellow',
          priority: isCriticalPayout ? 'critical' : 'high',
          requiresHumanApproval: isCriticalPayout,
          inputData: {
            withdrawalId: res.withdrawal?.id,
            partnerId: activePartner.id,
            partnerName: activePartner.fullName,
            amountIQD: amount,
            method: withdrawMethod,
            accountDetails: withdrawAccount.trim(),
            walletBalance: metrics?.availableBalanceIQD || 0,
          },
          reasoningChain: [
            `تم استقبال طلب السحب بمبلغ ${amount.toLocaleString()} د.ع عبر ${withdrawMethod}.`,
            `الرصيد المتاح في المحفظة كافٍ ومطابق.`,
            isCriticalPayout 
              ? 'المبلغ مصنف ضمن المخاطر الحرجة (Red Risk > 250,000 د.ع)، يتطلب مصادقة المدير العام عبر لوحة التحكم.'
              : 'المبلغ يقع ضمن الصلاحيات المعتمدة، تم إشعار المنسق العام للمتابعة.',
          ],
        });

        sendInterAgentMessage({
          senderAgentId: 'agent-partner-network',
          targetAgentId: 'agent-orchestrator',
          action: 'withdrawal_compliance_checked',
          priority: isCriticalPayout ? 'critical' : 'medium',
          payload: { partnerId: activePartner.id, amount, isCritical: isCriticalPayout },
          reasoningSnippetAr: `تدقيق مالي لشريك المبيعات ${activePartner.fullName}: تم التحقق من الرصيد ورفع المهمة لمكتب المصادقة.`,
        });
      }

      setWithdrawAmount('');
      setWithdrawNotes('');
    } else {
      setWithdrawErrorMsg(res.error || (isAr ? 'حدث خطأ في الطلب' : 'Request error'));
    }
  };

  // Handle Add CRM Deal
  const handleCreateCRMDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePartner || !newDealBusiness.trim() || !newDealPhone.trim()) return;

    addCRMDeal(
      {
        partnerId: activePartner.id,
        businessName: newDealBusiness.trim(),
        businessType: newDealType,
        customBusinessType: newDealType === 'other' ? newDealCustomType.trim() : undefined,
        contactPerson: newDealContact.trim() || (isAr ? 'المسؤول' : 'Manager'),
        phone: newDealPhone.trim(),
        city: newDealCity,
        stage: 'new',
        estimatedValueIQD: Number(newDealValue) || 250000,
      },
      newDealInitialNote.trim() || undefined
    );

    const { sendInterAgentMessage, isGlobalKillSwitchActive } = useAutonomousAgentsStore.getState();
    if (!isGlobalKillSwitchActive) {
      sendInterAgentMessage({
        senderAgentId: 'agent-partner-network',
        targetAgentId: 'agent-orchestrator',
        action: 'crm_deal_registered',
        priority: 'low',
        payload: {
          partnerId: activePartner.id,
          businessName: newDealBusiness.trim(),
          businessType: newDealType === 'other' ? newDealCustomType.trim() : newDealType,
          estimatedValue: Number(newDealValue) || 250000,
        },
        reasoningSnippetAr: `تم تسجيل فرصة بيع جديدة (${newDealBusiness.trim()}) في مسار الـ CRM للشريك ${activePartner.fullName}.`,
      });
    }

    setIsNewDealOpen(false);
    setNewDealBusiness('');
    setNewDealType('cafe');
    setNewDealCustomType('');
    setNewDealContact('');
    setNewDealPhone('');
    setNewDealInitialNote('');
  };

  // Copy referral link
  const handleCopyLink = () => {
    if (!activePartner) return;
    const url = `${window.location.origin}${window.location.pathname}?ref=${activePartner.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy referral code
  const handleCopyCode = () => {
    if (!activePartner) return;
    navigator.clipboard.writeText(activePartner.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy Pitch
  const handleCopyPitch = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPitchIndex(index);
    setTimeout(() => setCopiedPitchIndex(null), 2000);
  };

  // Download Personal QR Code PNG
  const handleDownloadPartnerQr = () => {
    if (!partnerQrDataUrl || !activePartner) return;
    const link = document.createElement('a');
    link.href = partnerQrDataUrl;
    link.download = `noon-partner-qr-${activePartner.referralCode}.png`;
    link.click();
  };

  // ----------------------------------------------------
  // VIEW: If not logged in -> Show Login & Demo Screen
  // ----------------------------------------------------
  if (!activePartner || !metrics) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto w-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition font-medium"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              <span>{isAr ? 'العودة لمتجر نون والقلم' : 'Back to Store'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-stone-600 font-semibold">
                {isAr ? 'بوابة الشركاء وممثلي المبيعات' : 'Sales Partners Portal'}
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left/Right Branding Banner */}
            <div className="lg:col-span-5 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-medium mb-6">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'بوابة فريق المبيعات وتطوير الأعمال' : 'Business Development Team'}</span>
                </div>

                <h1 className="text-3xl font-serif font-bold text-white mb-3">
                  نون والقلم
                </h1>
                <p className="text-amber-200/90 text-sm font-medium mb-6">
                  {isAr 
                    ? 'برنامج شراكة مبيعات متقدم بعمولات متكررة مدى الحياة لكل عميل.' 
                    : 'Advanced Sales Partner Program with lifetime recurring commissions.'}
                </p>

                <div className="space-y-4 text-xs text-stone-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'ارتباط العميل برقمك الوظيفي مدى الحياة تلقائياً' : 'Clients automatically bound to your ID forever'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'سحب فوري للأرباح عبر زين كاش أو آسيا حوالة' : 'Fast payouts via Zain Cash or Asia Hawala'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'هوية رقمية معتمدة ورقم وظيفي رسمي' : 'Certified Digital Employee ID & Official Code'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'نظام CRM ميداني لمتابعة الكافيهات والمطاعم والشركات' : 'Field CRM pipeline to manage B2B leads'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                <span>{isAr ? 'دار نون والقلم - بغداد' : 'Noon & Pen Baghdad'}</span>
                <span className="font-mono text-amber-400/80">NOON-PARTNERS-V1</span>
              </div>
            </div>

            {/* Right/Left Login & Quick Demo Form */}
            <div className="lg:col-span-7 p-8 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-stone-900">
                    {isAr ? 'تسجيل دخول الشريك' : 'Partner Sign In'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {isAr 
                      ? 'أدخل رقم هاتفك المسجل ورمز المرور السريع (PIN المكون من 4 أرقام)' 
                      : 'Enter your registered phone and 4-digit PIN code'}
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute top-3 rtl:right-3 ltr:left-3 text-stone-400" />
                      <input
                        type="tel"
                        dir="ltr"
                        required
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="07701234567"
                        className="w-full py-2.5 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'رمز المرور (PIN 4 أرقام)' : 'Security PIN (4 digits)'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute top-3 rtl:right-3 ltr:left-3 text-stone-400" />
                      <input
                        type="password"
                        maxLength={4}
                        dir="ltr"
                        required
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        placeholder="••••"
                        className="w-full py-2.5 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none tracking-widest text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition shadow-md"
                  >
                    {isAr ? 'دخول لوحة الشريك' : 'Sign In to Portal'}
                  </button>
                </form>

                {/* Quick Demo Switcher Section */}
                <div className="mt-8 pt-6 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isAr ? 'تجربة سريعة (حسابات تجريبية جاهزة):' : 'Instant Demo Login:'}</span>
                    </span>
                    <span className="text-[10px] text-stone-400">{isAr ? 'نقرة واحدة للدخول' : '1-click access'}</span>
                  </div>

                  <div className="space-y-2">
                    {partners.map((p) => {
                      const rankConfig = PARTNER_RANKS_CONFIG[p.rank];
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleQuickDemoLogin(p.id)}
                          className="w-full p-2.5 text-right rtl:text-right ltr:text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                                {p.fullName}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rankConfig.badgeColorClass}`}>
                                {isAr ? rankConfig.badgeAr : rankConfig.badgeEn}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              {p.employeeId} • {p.city} • {isAr ? 'كود:' : 'Code:'} <span className="font-mono font-bold text-stone-700">{p.referralCode}</span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-amber-700 group-hover:underline flex items-center gap-1">
                            <span>{isAr ? 'دخول' : 'Enter'}</span>
                            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Not registered yet? Apply */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-stone-500 mb-2">
                    {isAr ? 'لست شريكاً معتمداً بعد؟' : 'Not an official partner yet?'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-4"
                  >
                    {isAr ? 'تقديم طلب انضمام كشريك وممثل مبيعات جديد' : 'Apply to become a sales partner'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PartnerApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          isAr={isAr}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: Active Logged In Partner Portal
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Bar Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left brand & identity */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToStore}
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition"
                title={isAr ? 'العودة لمتجر نون والقلم' : 'Back to Store'}
              >
                <ArrowRight className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-amber-400 text-base">نون والقلم</span>
                  <span className="text-[11px] text-stone-400 border-r rtl:border-r ltr:border-l border-stone-700 px-2">
                    {isAr ? 'بوابة الشركاء' : 'Partners Portal'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-white">{activePartner.fullName}</span>
                  <span className="text-[10px] font-mono text-amber-300/80 bg-stone-800 px-1.5 py-0.5 rounded">
                    {activePartner.employeeId}
                  </span>
                </div>
              </div>
            </div>

            {/* Right actions: Rank Badge, Digital ID card preview, Logout */}
            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${metrics.rankInfo.badgeColorClass}`}>
                <span>{isAr ? metrics.rankInfo.badgeAr : metrics.rankInfo.badgeEn}</span>
                {metrics.rankInfo.bonusPercent > 0 && (
                  <span className="text-[10px] opacity-80">(+{metrics.rankInfo.bonusPercent}%)</span>
                )}
              </span>

              <button
                onClick={() => setActiveTab('card')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'الهوية الوظيفية' : 'Digital ID'}</span>
              </button>

              <button
                onClick={logoutPartner}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-stone-800 text-xs font-medium transition"
                title={isAr ? 'تسجيل الخروج' : 'Log out'}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'خروج' : 'Exit'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 border-t border-stone-800/80 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isAr ? 'لوحة الأداء' : 'Overview'}</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'clients'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isAr ? 'عملاؤك مدى الحياة' : 'Lifetime Clients'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-stone-700 text-stone-200 text-[10px]">
                {partnerClientsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'crm'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{isAr ? 'إدارة الفرص الميدانية (CRM)' : 'Field CRM'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-stone-700 text-stone-200 text-[10px]">
                {partnerDeals.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'wallet'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isAr ? 'المحفظة وسحب الأرباح' : 'Wallet & Payouts'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'tools'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'أدوات التسويق والمبيعات' : 'Sales Toolkit'}</span>
            </button>

            <button
              onClick={() => setActiveTab('card')}
              className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'card'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'الهوية الوظيفية' : 'Digital ID Card'}</span>
            </button>

            <button
              onClick={() => setActiveTab('academy')}
              className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'academy'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{isAr ? 'أكاديمية المنتجات' : 'Product Academy'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Broadcast Announcement (if present) */}
      {announcementAr && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-950 py-2.5 px-4 text-xs font-medium">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold text-amber-800">{isAr ? 'تنويه إدارة المبيعات:' : 'Sales HQ Broadcast:'}</span>
            <span>{announcementAr}</span>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & METRICS */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Share Banner Card */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'رابط الإحالة والكود الخاص بك' : 'Your Referral Link & Code'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif">
                    {isAr ? 'شارك رابطك المباشر مع العملاء والشركات' : 'Share your direct partner link'}
                  </h2>
                  <p className="text-xs text-stone-300 max-w-xl mt-1">
                    {isAr 
                      ? 'عند دخول العميل عبر رابطك أو كتابة كودك عند الدفع، يرتبط رقم هاتفه بك تلقائياً مدى الحياة وتصلك مكافآت كل طلب يقدمه الآن ومستقبلاً.'
                      : 'When a customer enters via your link or enters your code, their phone is permanently linked to you.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-black/40 border border-stone-700 rounded-2xl px-4 py-2">
                    <span className="text-xs text-stone-400 ml-2">{isAr ? 'كودك:' : 'Code:'}</span>
                    <span className="font-mono font-bold text-amber-400 text-base">{activePartner.referralCode}</span>
                    <button
                      onClick={handleCopyCode}
                      className="mr-3 p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition"
                      title={isAr ? 'نسخ الكود' : 'Copy Code'}
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shadow-md"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? (isAr ? 'تم نسخ الرابط!' : 'Link Copied!') : (isAr ? 'نسخ الرابط المباشر' : 'Copy Direct Link')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Available Balance */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-500">
                    {isAr ? 'الرصيد المتاح للسحب' : 'Available Balance'}
                  </span>
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Wallet className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-stone-900">
                  {metrics.availableBalanceIQD.toLocaleString()} <span className="text-xs font-normal text-stone-500">د.ع</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">{isAr ? 'معلق للصرف:' : 'Pending:'}</span>
                  <span className="font-mono text-amber-700 font-semibold">{metrics.pendingPayoutIQD.toLocaleString()} د.ع</span>
                </div>
              </div>

              {/* Card 2: Total Earned */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-500">
                    {isAr ? 'إجمالي الأرباح التاريخية' : 'Lifetime Commissions'}
                  </span>
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-800">
                  {metrics.totalEarnedIQD.toLocaleString()} <span className="text-xs font-normal text-stone-500">د.ع</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">{isAr ? 'أرباح هذا الشهر:' : 'This Month:'}</span>
                  <span className="font-mono text-emerald-600 font-semibold">{metrics.thisMonthEarnedIQD.toLocaleString()} د.ع</span>
                </div>
              </div>

              {/* Card 3: Linked Clients */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-500">
                    {isAr ? 'العملاء المرتبطين بك' : 'Lifetime Clients'}
                  </span>
                  <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <Users className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-stone-900">
                  {metrics.linkedClientsCount} <span className="text-xs font-normal text-stone-500">{isAr ? 'عميل' : 'clients'}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">{isAr ? 'ارتباط دائم' : 'Lifetime link'}</span>
                  <span className="text-emerald-700 font-semibold">{isAr ? 'نشط 100%' : '100% active'}</span>
                </div>
              </div>

              {/* Card 4: Generated Sales */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-500">
                    {isAr ? 'حجم المبيعات المحققة' : 'Generated Sales'}
                  </span>
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <DollarSign className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-stone-900">
                  {metrics.totalGeneratedSalesIQD.toLocaleString()} <span className="text-xs font-normal text-stone-500">د.ع</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">{isAr ? 'الرتبة الحالية:' : 'Rank:'}</span>
                  <span className="font-semibold text-stone-800">{isAr ? metrics.rankInfo.titleAr : metrics.rankInfo.titleEn}</span>
                </div>
              </div>
            </div>

            {/* Career Progression & Rank Bar */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-bold text-stone-900">
                      {isAr ? 'مسار الترقية والمكافآت الإضافية' : 'Rank Progression & Bonus Tiers'}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {isAr 
                      ? 'كلما زاد عدد عملائك الدائمين أو مبيعاتك، ترتفع رتبتك وتحصل على عمولة إضافية تراكمية تصل إلى +7%.'
                      : 'Accumulate linked clients and sales volume to unlock higher permanent bonus commissions.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">{isAr ? 'رتبتك الحالية:' : 'Current Rank:'}</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${metrics.rankInfo.badgeColorClass}`}>
                    {isAr ? metrics.rankInfo.badgeAr : metrics.rankInfo.badgeEn} (+{metrics.rankInfo.bonusPercent}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              {metrics.nextRankInfo ? (
                <div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border border-stone-200">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${metrics.progressPercentToNextRank}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-stone-600">
                    <span>
                      {isAr ? 'الهدف القادم:' : 'Next Goal:'}{' '}
                      <strong className="text-stone-900">{isAr ? metrics.nextRankInfo.titleAr : metrics.nextRankInfo.titleEn}</strong> (+{metrics.nextRankInfo.bonusPercent}%)
                    </span>
                    <span className="font-semibold text-amber-700">
                      {metrics.progressPercentToNextRank}% {isAr ? 'مكتمل' : 'completed'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>
                    {isAr 
                      ? 'تهانينا! لقد بلغت أعلى رتبة (سفير نون والقلم) وتحصل على أعلى نسبة عمولة إضافية (+7%) بالإضافة للشارة الذهبية الملكية.'
                      : 'Congratulations! You reached the highest rank (Ambassador) with +7% bonus commission.'}
                  </span>
                </div>
              )}

              {/* Ranks breakdown tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100">
                {(Object.keys(PARTNER_RANKS_CONFIG) as PartnerRank[]).map((rKey) => {
                  const cfg = PARTNER_RANKS_CONFIG[rKey];
                  const isCurrent = activePartner.rank === rKey;
                  return (
                    <div 
                      key={rKey} 
                      className={`p-3 rounded-2xl border text-center transition ${
                        isCurrent 
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20' 
                          : 'border-stone-200 bg-stone-50/50'
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-900 mb-0.5">{isAr ? cfg.badgeAr : cfg.badgeEn}</div>
                      <div className="text-[11px] text-amber-800 font-semibold">+{cfg.bonusPercent}% {isAr ? 'عمولة إضافية' : 'bonus'}</div>
                      <div className="text-[10px] text-stone-500 mt-1">{cfg.minClients} {isAr ? 'عميل' : 'clients'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Commissions Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {isAr ? 'سجل العمليات والعمولات الأخيرة' : 'Recent Commission Activity'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {isAr ? 'كل طلب يصدر لعملائك يتم تسجيل عمولتك فورياً هنا' : 'Instant record of customer orders and your earnings'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                >
                  <span>{isAr ? 'طلب سحب رصيد' : 'Withdraw Funds'}</span>
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>

              {partnerCommissions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Clock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-600">
                    {isAr ? 'لا توجد عمولات مسجلة بعد' : 'No commissions recorded yet'}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    {isAr ? 'شارك كودك أو رابطك مع العملاء والشركات لتبدأ بتلقي العمولات المتكررة.' : 'Share your referral link with clients to start receiving earnings.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                        <th className="py-3 px-4">{isAr ? 'العميل' : 'Customer'}</th>
                        <th className="py-3 px-4">{isAr ? 'قيمة الطلب' : 'Order Value'}</th>
                        <th className="py-3 px-4">{isAr ? 'النسبة المطبقة' : 'Applied Rate'}</th>
                        <th className="py-3 px-4">{isAr ? 'مكافأتك' : 'Your Commission'}</th>
                        <th className="py-3 px-4">{isAr ? 'التاريخ' : 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {partnerCommissions.slice(0, 8).map((record) => (
                        <tr key={record.id} className="hover:bg-stone-50/70 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{record.orderId}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-stone-900">{record.clientName}</div>
                            <div className="text-[11px] font-mono text-stone-500">{record.clientPhone}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-700">
                            {record.orderTotalIQD.toLocaleString()} د.ع
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold font-mono">
                              {record.appliedRate}%
                            </span>
                            {record.rankBonusApplied > 0 && (
                              <span className="text-[10px] text-stone-400 block mt-0.5">
                                (+{record.rankBonusApplied}% {isAr ? 'بونص رتبة' : 'rank'})
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-sm">
                            +{record.commissionAmountIQD.toLocaleString()} د.ع
                          </td>
                          <td className="py-3.5 px-4 text-stone-500">
                            {new Date(record.createdAt).toLocaleDateString(isAr ? 'ar-IQ' : 'en-US')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: LIFETIME LINKED CLIENTS */}
        {/* ========================================================= */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-stone-900">
                    {isAr ? 'قاعدة عملائك الدائمين مدى الحياة' : 'Your Lifetime Client Network'}
                  </h2>
                </div>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  {isAr 
                    ? 'هؤلاء العملاء مسجلون حصرياً باسمك. في أي وقت يقوم أي عميل منهم بالشراء مجدداً من المتجر (حتى لو نسي إدخال كودك)، يكتشف النظام رقم هاتفه تلقائياً ويحول عمولتك إلى محفظتك.' 
                    : 'These clients are permanently linked to your Employee ID. All their future purchases automatically credit your wallet.'}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center shrink-0">
                <div className="text-xs text-amber-800 font-semibold">{isAr ? 'إجمالي العملاء المرتبطين' : 'Total Clients'}</div>
                <div className="text-2xl font-bold font-mono text-amber-900 mt-0.5">{partnerClientsList.length}</div>
              </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              {partnerClientsList.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-700">
                    {isAr ? 'لا يوجد عملاء مرتبطون حتى الآن' : 'No linked clients yet'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                    {isAr 
                      ? 'عندما يقوم أي عميل بإتمام أول طلب باستخدام كودك النرويجي، سيظهر اسمه ورقمه هنا ويرتبط بك مدى الحياة.' 
                      : 'When a customer finishes their first order using your code, they will be bound here forever.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                      <tr>
                        <th className="py-3.5 px-4">{isAr ? 'اسم العميل' : 'Client Name'}</th>
                        <th className="py-3.5 px-4">{isAr ? 'رقم الهاتف المعتمد' : 'Registered Phone'}</th>
                        <th className="py-3.5 px-4">{isAr ? 'تاريخ الارتباط' : 'Link Date'}</th>
                        <th className="py-3.5 px-4">{isAr ? 'عدد الطلبات الكلي' : 'Total Orders'}</th>
                        <th className="py-3.5 px-4">{isAr ? 'إجمالي مشترياته' : 'Total Spent'}</th>
                        <th className="py-3.5 px-4">{isAr ? 'حالة الضمان' : 'Guarantee'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {partnerClientsList.map((client) => (
                        <tr key={client.clientPhone} className="hover:bg-stone-50/70 transition">
                          <td className="py-4 px-4 font-bold text-stone-900">
                            {client.clientName}
                          </td>
                          <td className="py-4 px-4 font-mono text-stone-700">
                            {client.clientPhone}
                          </td>
                          <td className="py-4 px-4 text-stone-500">
                            {new Date(client.linkedAt).toLocaleDateString(isAr ? 'ar-IQ' : 'en-US')}
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-stone-800">
                            {client.totalOrdersCount} {isAr ? 'طلبات' : 'orders'}
                          </td>
                          <td className="py-4 px-4 font-mono font-semibold text-stone-900">
                            {client.totalSpentIQD.toLocaleString()} د.ع
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{isAr ? 'محمي مدى الحياة' : 'Lifetime Bound'}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: FIELD CRM KANBAN & LEADS */}
        {/* ========================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header + Add Button */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-stone-900">
                    {isAr ? 'إدارة الفرص الميدانية ومتابعة الشركات' : 'Field Sales CRM Pipeline'}
                  </h2>
                </div>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  {isAr 
                    ? 'سجل زياراتك للمطاعم والكافيهات والمكاتب الحكومية والخاصة لتنظيم عروض الأسعار والتوريد بالجملة والهدايا التذكارية.' 
                    : 'Manage corporate B2B leads, cafes, and restaurant menu packaging deals.'}
                </p>
              </div>

              <button
                onClick={() => setIsNewDealOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة عميل أو شركة جديدة' : 'Add New Lead'}</span>
              </button>
            </div>

            {/* Stages Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { stage: 'new' as CRMDealStage, titleAr: 'فرصة جديدة', titleEn: 'New Lead', color: 'border-stone-300 bg-stone-50' },
                { stage: 'contacted' as CRMDealStage, titleAr: 'تم التواصل', titleEn: 'Contacted', color: 'border-blue-300 bg-blue-50/50' },
                { stage: 'quoted' as CRMDealStage, titleAr: 'عرض سعر', titleEn: 'Quote Sent', color: 'border-purple-300 bg-purple-50/50' },
                { stage: 'negotiating' as CRMDealStage, titleAr: 'مفاوضات', titleEn: 'Negotiating', color: 'border-amber-300 bg-amber-50/50' },
                { stage: 'won' as CRMDealStage, titleAr: 'تم الاتفاق 🎉', titleEn: 'Won 🎉', color: 'border-emerald-300 bg-emerald-50/50' },
                { stage: 'lost' as CRMDealStage, titleAr: 'ملغاة / مؤجلة', titleEn: 'Lost', color: 'border-stone-200 bg-stone-100' },
              ].map(({ stage, titleAr, titleEn, color }) => {
                const stageDeals = partnerDeals.filter((d) => d.stage === stage);
                return (
                  <div key={stage} className={`rounded-2xl border p-3 flex flex-col min-h-[360px] ${color}`}>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200/60">
                      <span className="text-xs font-bold text-stone-800">
                        {isAr ? titleAr : titleEn}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-stone-700 text-[10px] font-mono font-bold shadow-2xs">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition"
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-xs font-bold text-stone-900 line-clamp-1">{deal.businessName}</span>
                            <span className="text-[10px] text-stone-500 font-mono shrink-0">
                              {deal.city}
                            </span>
                          </div>

                          {/* Business category badge */}
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-amber-50/80 text-amber-900 border-amber-200/80">
                              {deal.businessType === 'other' ? (
                                <span>{deal.customBusinessType ? deal.customBusinessType : (isAr ? 'أخرى' : 'Other')}</span>
                              ) : deal.businessType === 'cafe' ? (
                                isAr ? 'كافيه ومقهى' : 'Cafe'
                              ) : deal.businessType === 'restaurant' ? (
                                isAr ? 'مطعم' : 'Restaurant'
                              ) : deal.businessType === 'office' ? (
                                isAr ? 'شركة أو مكتب' : 'Office'
                              ) : deal.businessType === 'hotel' ? (
                                isAr ? 'فندق' : 'Hotel'
                              ) : deal.businessType === 'clinic' ? (
                                isAr ? 'عيادة أو مركز طبي' : 'Clinic'
                              ) : (
                                isAr ? 'متجر تجزئة' : 'Retail'
                              )}
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-600 mb-1.5 flex items-center gap-1">
                            <span>{deal.contactPerson}</span>
                            <span>•</span>
                            <span className="font-mono">{deal.phone}</span>
                          </div>

                          <div className="text-xs font-bold font-mono text-amber-800 mb-2">
                            {deal.estimatedValueIQD.toLocaleString()} د.ع
                          </div>

                          {/* Notes preview */}
                          {deal.notes.length > 0 && (
                            <div className="p-1.5 bg-stone-50 rounded-lg text-[10px] text-stone-600 mb-2 border border-stone-100">
                              "{deal.notes[deal.notes.length - 1].text}"
                            </div>
                          )}

                          {/* Actions: Move Stage & Add Note */}
                          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                            <select
                              value={deal.stage}
                              onChange={(e) => updateCRMDealStage(deal.id, e.target.value as CRMDealStage)}
                              className="text-[10px] py-1 px-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 outline-none"
                            >
                              <option value="new">{isAr ? 'جديدة' : 'New'}</option>
                              <option value="contacted">{isAr ? 'تواصل' : 'Contacted'}</option>
                              <option value="quoted">{isAr ? 'عرض' : 'Quoted'}</option>
                              <option value="negotiating">{isAr ? 'مفاوضات' : 'Negotiate'}</option>
                              <option value="won">{isAr ? 'تم الاتفاق' : 'Won'}</option>
                              <option value="lost">{isAr ? 'ملغاة' : 'Lost'}</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDealForNote(deal.id);
                                setCrmNoteText('');
                              }}
                              className="text-[10px] text-amber-800 font-medium hover:underline"
                            >
                              {isAr ? '+ ملاحظة' : '+ Note'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note addition modal */}
            {selectedDealForNote && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
                  <h3 className="text-sm font-bold text-stone-900 mb-2">
                    {isAr ? 'إضافة ملاحظة ميدانية' : 'Add Field Note'}
                  </h3>
                  <textarea
                    rows={3}
                    value={crmNoteText}
                    onChange={(e) => setCrmNoteText(e.target.value)}
                    placeholder={isAr ? 'مثال: تمت زيارة الكافيه وإعطاؤهم عينة من منيو الجلد الطبيعي، تم الاتفاق على عرض 50 قطعة...' : 'Meeting summary...'}
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none resize-none mb-3"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDealForNote(null)}
                      className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (crmNoteText.trim()) {
                          addCRMDealNote(selectedDealForNote, crmNoteText.trim(), activePartner.fullName);
                        }
                        setSelectedDealForNote(null);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                    >
                      {isAr ? 'حفظ الملاحظة' : 'Save Note'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for adding a new CRM deal */}
            {isNewDealOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
                  <h3 className="text-lg font-bold text-stone-900 mb-1">
                    {isAr ? 'تسجيل فرصة بيع أو شركة جديدة' : 'Add Corporate / B2B Lead'}
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    {isAr ? 'وثّق معلومات المنشأة لتبقى مسجلة في خطتك البيعية' : 'Track client info in your sales pipeline'}
                  </p>

                  <form onSubmit={handleCreateCRMDeal} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {isAr ? 'اسم المنشأة / النشاط' : 'Business Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={newDealBusiness}
                        onChange={(e) => setNewDealBusiness(e.target.value)}
                        placeholder={isAr ? 'مثال: كافيه دجلة الفاخر، شركة الأفق للمحاماة' : 'e.g. Tigris Luxury Cafe'}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {isAr ? 'نوع أو صنف النشاط' : 'Business Type / Category'}
                        </label>
                        <select
                          value={newDealType}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setNewDealType(val);
                            if (val !== 'other') setNewDealCustomType('');
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none bg-white font-medium shadow-2xs"
                        >
                          <option value="cafe">{isAr ? 'كافيه ومقهى' : 'Cafe'}</option>
                          <option value="restaurant">{isAr ? 'مطعم' : 'Restaurant'}</option>
                          <option value="office">{isAr ? 'شركة أو مكتب' : 'Corporate Office'}</option>
                          <option value="hotel">{isAr ? 'فندق' : 'Hotel'}</option>
                          <option value="clinic">{isAr ? 'عيادة أو مركز طبي' : 'Clinic'}</option>
                          <option value="retail">{isAr ? 'متجر تجزئة' : 'Retail'}</option>
                          <option value="other">{isAr ? 'أخرى' : 'Other'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {isAr ? 'المدينة' : 'City'}
                        </label>
                        <input
                          type="text"
                          value={newDealCity}
                          onChange={(e) => setNewDealCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Dynamic Custom Business Field when 'other' is selected */}
                    {newDealType === 'other' && (
                      <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-1.5 shadow-xs">
                        <label className="block text-xs font-bold text-amber-950 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                            {isAr ? 'اكتب نوع العمل أو النشاط التجاري:*' : 'Specify Custom Business / Line of Work:*'}
                          </span>
                          <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                            {isAr ? 'مطلوب للمتابعة' : 'Required'}
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          autoFocus
                          value={newDealCustomType}
                          onChange={(e) => setNewDealCustomType(e.target.value)}
                          placeholder={isAr ? 'مثال: صالون تجميل، مركز تدريب، وكالة دعاية، مدرسة أهلية، معمل حلويات...' : 'e.g. Beauty Salon, Training Center, Advertising Agency, Private School...'}
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-400 bg-white text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none shadow-xs transition"
                        />
                        <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                          {isAr 
                            ? '✨ سيتم حفظ هذا النشاط المخصص وإدراجه تلقائياً في بطاقة الصفقة والتقارير الميدانية لدار نون والقلم.' 
                            : 'This custom business type will be displayed on your CRM deal card and reporting.'}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {isAr ? 'الشخص المسؤول' : 'Contact Person'}
                        </label>
                        <input
                          type="text"
                          value={newDealContact}
                          onChange={(e) => setNewDealContact(e.target.value)}
                          placeholder={isAr ? 'المدير أو المشتريات' : 'Manager'}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {isAr ? 'رقم الهاتف' : 'Phone'} *
                        </label>
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          value={newDealPhone}
                          onChange={(e) => setNewDealPhone(e.target.value)}
                          placeholder="0770XXXXXXX"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {isAr ? 'القيمة التقديرية للصفقة (د.ع)' : 'Estimated Deal Value (IQD)'}
                      </label>
                      <input
                        type="number"
                        step={50000}
                        value={newDealValue}
                        onChange={(e) => setNewDealValue(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {isAr ? 'ملاحظة أولية' : 'Initial Note'}
                      </label>
                      <input
                        type="text"
                        value={newDealInitialNote}
                        onChange={(e) => setNewDealInitialNote(e.target.value)}
                        placeholder={isAr ? 'مهتمون بطلب 40 حافظة منيو خشب وجلد محفورة باللوغو' : 'Interested in custom menu folders...'}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setIsNewDealOpen(false)}
                        className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
                      >
                        {isAr ? 'إضافة الفرصة' : 'Add Deal'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: WALLET & WITHDRAWALS */}
        {/* ========================================================= */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Balance Overview Card */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-stone-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  {isAr ? 'محفظة الأرباح المباشرة' : 'Earnings Wallet'}
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white mt-1">
                  {metrics.availableBalanceIQD.toLocaleString()} <span className="text-sm font-normal text-amber-300">د.ع</span>
                </div>
                <div className="text-xs text-stone-400 mt-2 flex items-center gap-4">
                  <span>{isAr ? 'إجمالي الأرباح:' : 'Total Earned:'} <strong className="text-white font-mono">{metrics.totalEarnedIQD.toLocaleString()} د.ع</strong></span>
                  <span>•</span>
                  <span>{isAr ? 'تم صرفها سابقاً:' : 'Paid Out:'} <strong className="text-emerald-400 font-mono">{metrics.totalPaidOutIQD.toLocaleString()} د.ع</strong></span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs text-stone-300 max-w-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'السحب متاح عبر زين كاش وآسيا حوالة' : 'Zain Cash & Asia Hawala supported'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'الحد الأدنى لطلب السحب: 25,000 د.ع' : 'Min withdrawal: 25,000 IQD'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'التحويل يتم خلال 2-6 ساعات عمل' : 'Processed within 2-6 business hours'}</span>
                </div>
              </div>
            </div>

            {/* Request Withdrawal Form */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-1">
                {isAr ? 'طلب سحب رصيد جديد' : 'Request Payout'}
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                {isAr ? 'حدد المبلغ المطلوب وطريقة الاستلام المناسبة لك' : 'Select amount and payout method'}
              </p>

              {withdrawSuccessMsg && (
                <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{withdrawSuccessMsg}</span>
                </div>
              )}

              {withdrawErrorMsg && (
                <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{withdrawErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'المبلغ المطلوب سحبه (د.ع)' : 'Amount (IQD)'} *
                    </label>
                    <input
                      type="number"
                      min={25000}
                      max={metrics.availableBalanceIQD}
                      step={5000}
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="50,000"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-mono text-stone-900 focus:border-amber-500 outline-none"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      {isAr ? `الحد الأقصى المتاح: ${metrics.availableBalanceIQD.toLocaleString()} د.ع` : `Max: ${metrics.availableBalanceIQD.toLocaleString()} IQD`}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'طريقة التحويل' : 'Payout Method'} *
                    </label>
                    <select
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value as WithdrawalMethod)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:border-amber-500 outline-none bg-white"
                    >
                      <option value="zain_cash">{isAr ? 'محفظة زين كاش (Zain Cash)' : 'Zain Cash'}</option>
                      <option value="asia_hawala">{isAr ? 'محفظة آسيا حوالة (Asia Hawala)' : 'Asia Hawala'}</option>
                      <option value="cash_office">{isAr ? 'استلام نقدي من مقر نون والقلم (بغداد)' : 'Cash at Baghdad Office'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'رقم المحفظة أو تفاصيل المستلم' : 'Wallet Phone / Receiver Details'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                      placeholder={isAr ? 'رقم هاتف المحفظة المسجلة' : 'Wallet phone number'}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'ملاحظات إضافية للمالية' : 'Additional Note'}
                  </label>
                  <input
                    type="text"
                    value={withdrawNotes}
                    onChange={(e) => setWithdrawNotes(e.target.value)}
                    placeholder={isAr ? 'أي تعليمات خاصة بالتحويل...' : 'Transfer notes...'}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={metrics.availableBalanceIQD < 25000}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition shadow-sm"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{isAr ? 'تأكيد رفع طلب السحب' : 'Submit Withdrawal Request'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Withdrawals History Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h3 className="text-base font-bold text-stone-900">
                  {isAr ? 'سجل طلبات السحب والتحويلات' : 'Withdrawal Request History'}
                </h3>
              </div>

              {partnerWithdrawals.length === 0 ? (
                <div className="text-center py-10 text-xs text-stone-400">
                  {isAr ? 'لا توجد طلبات سحب سابقة' : 'No previous withdrawals'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4">{isAr ? 'رقم الطلب' : 'Request ID'}</th>
                        <th className="py-3 px-4">{isAr ? 'المبلغ' : 'Amount'}</th>
                        <th className="py-3 px-4">{isAr ? 'الطريقة' : 'Method'}</th>
                        <th className="py-3 px-4">{isAr ? 'التفاصيل' : 'Details'}</th>
                        <th className="py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                        <th className="py-3 px-4">{isAr ? 'التاريخ' : 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {partnerWithdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-stone-50/70">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{w.id}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                            {w.amountIQD.toLocaleString()} د.ع
                          </td>
                          <td className="py-3.5 px-4 text-stone-700">
                            {w.method === 'zain_cash' ? 'زين كاش' : w.method === 'asia_hawala' ? 'آسيا حوالة' : 'نقدي بالمقر'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-600">{w.accountDetails}</td>
                          <td className="py-3.5 px-4">
                            {w.status === 'paid' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                                {isAr ? 'تم التحويل' : 'Paid'}
                              </span>
                            )}
                            {w.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                                {isAr ? 'قيد المراجعة' : 'Pending'}
                              </span>
                            )}
                            {w.status === 'rejected' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                                {isAr ? 'مرفوض' : 'Rejected'}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-stone-500">
                            {new Date(w.requestedAt).toLocaleDateString(isAr ? 'ar-IQ' : 'en-US')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SALES TOOLKIT & MARKETING */}
        {/* ========================================================= */}
        {activeTab === 'tools' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-stone-900">
                  {isAr ? 'أدوات المبيعات وصيغ المحادثات الجاهزة' : 'Sales Pitch Toolkit'}
                </h2>
              </div>
              <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'صيغ تسويقية احترافية معتمدة تم اختبارها بنجاح مع أصحاب الكافيهات والمطاعم والشركات، انسخها بنقرة واحدة وشاركها عبر الواتساب مع رابطك الخاص.'
                  : 'Pre-written WhatsApp pitch templates tailored for Baghdad restaurants, cafes, and executive offices.'}
              </p>
            </div>

            {/* Personal Marketing QR Code Card */}
            <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                {/* QR Code Container */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="bg-white p-4 rounded-2xl shadow-2xl border-4 border-amber-500/30">
                    {partnerQrDataUrl ? (
                      <img 
                        src={partnerQrDataUrl} 
                        alt={`QR Code ${activePartner.referralCode}`} 
                        className="w-48 h-48 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-stone-100 rounded-lg">
                        <QrCode className="w-12 h-12 text-stone-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold font-mono border border-amber-500/30">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {activePartner.referralCode}
                    </span>
                    <p className="text-[11px] text-stone-400 mt-1">
                      {isAr ? 'يطبق كودك فوراً عند المسح بالكاميرا' : 'Auto-applies code upon scan'}
                    </p>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="flex-1 space-y-4 text-center lg:text-start">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isAr ? 'رمز الباركود المباشر الخاص بالشريك' : 'Personal Referral QR Code'}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-100">
                      {isAr ? 'باركودك الشخصي للطلب والربط المباشر' : 'Your Personal Print-Ready QR Code'}
                    </h3>
                    <p className="text-stone-300 text-xs sm:text-sm mt-1 leading-relaxed max-w-xl">
                      {isAr
                        ? 'اطبع هذا الباركود أو اعرضه من هاتفك لزبائنك وأصحاب الكافيهات والمؤسسات. بمجرد توجيه كاميرا الهاتف نحوه، يُفتح المتجر ويُحفظ كودك الشريك تلقائياً لتسجيل العمولات في حسابك مدى الحياة.'
                        : 'Show this QR from your phone or print it for clients. Scanning automatically sets your referral code and secures lifetime commissions on every purchase.'}
                    </p>
                  </div>

                  {/* Direct link box */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 min-w-0 font-mono text-xs text-amber-200/90 truncate w-full text-center sm:text-start">
                      {`${window.location.origin}${window.location.pathname}?ref=${activePartner.referralCode}`}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition flex items-center gap-1.5 shrink-0"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy URL')}</span>
                    </button>
                  </div>

                  {/* Buttons Action Group */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                    <button
                      onClick={handleDownloadPartnerQr}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs shadow-md transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isAr ? 'تحميل صورة الباركود (PNG عالي الدقة)' : 'Download QR Image (HD PNG)'}</span>
                    </button>

                    <a
                      href={`/?ref=${activePartner.referralCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? 'تجربة فتح المتجر بكودك' : 'Test Auto-Apply Link'}</span>
                    </a>
                  </div>

                  {/* Admin Campaign Notice */}
                  <p className="text-[11px] text-amber-200/60 leading-relaxed border-t border-white/10 pt-3">
                    💡 {isAr
                      ? 'ملاحظة: يمكنك التنسيق مع إدارة دار نون والقلم لتوليد وطباعة استاندات خشبية فاخرة للطاولات (Table Tents) أو ملصقات كرتونية أنيقة لمتاجرك وكافيهاتك الشريكة عبر مصمم الـ QR في لوحة الإدارة.'
                      : 'Note: Management can generate luxury wooden Table Tents or branded stickers tailored for your partner venues from the Admin QR Studio.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pitch Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  titleAr: 'عرض حوافظ وقوائم الطعام (المنيو) للكافيهات والمطاعم',
                  titleEn: 'Luxury Leather Menus for Cafes & Restaurants',
                  icon: Coffee,
                  textAr: `مرحباً أستاذنا العزيز،
معك ${activePartner.fullName} من فريق تطوير الأعمال في دار «نون والقلم» البغدادية.
نقدم لأفخم مطاعم وكافيهات العراق حوافظ منيو خشبية وجلد طبيعي محفورة بدقة بالليزر مع شعاركم الخاص لتعطي انطباع الفخامة والأناقة لكل زبون.
يسعدني تزويدكم بنماذج أعمالنا أو زيارتكم مع عينة مجانية لمعاينتها مباشرة:
${window.location.origin}/?ref=${activePartner.referralCode}
كود الشريك المعتمد: ${activePartner.referralCode}`,
                },
                {
                  titleAr: 'عرض هدايا الشركات والمؤسسات التنفيذية VIP',
                  titleEn: 'Corporate VIP Gift Sets for Executives',
                  icon: Building2,
                  textAr: `تحية طيبة لحضرتكم،
معك ${activePartner.fullName}، ممثل المبيعات المعتمد في «نون والقلم».
نوفر أطقم هدايا مكتبية فاخرة مصنوعة يدوياً من الخشب الطبيعي المطعّم بالصدف والخط العربي الأصيل (صناديق هدايا، أقلام خشبية، دروع تكريم) مخصصة بأسماء المدراء التنفيذيين وشعار مؤسستكم.
يمكنكم استعراض الكتالوج الكامل والطلب مباشرة من متجرنا:
${window.location.origin}/?ref=${activePartner.referralCode}`,
                },
                {
                  titleAr: 'عرض هدايا المناسبات وصناديق رمضان والأعياد',
                  titleEn: 'Seasonal & Ramadan Masterpiece Boxes',
                  icon: Sparkles,
                  textAr: `السلام عليكم ورحمة الله،
يسرني كشريك معتمد لدى دار نون والقلم أن أشارككم تشكيلتنا الحصرية لهدايا المناسبات وصناديق رمضان المبارك والمصحف الشريف المصنوعة بحرفية بغدادية لا مثيل لها.
للطلب مع الحفر المخصص للشخص المهدى إليه:
${window.location.origin}/?ref=${activePartner.referralCode}
كود الشريك: ${activePartner.referralCode}`,
                },
                {
                  titleAr: 'رسالة سريعة للزبائن الشخصيين والأصدقاء',
                  titleEn: 'Quick Personal Message for Friends & Family',
                  icon: MessageCircle,
                  textAr: `أهلاً بك!
إذا كنت تبحث عن تحفة خشبية أو جلدية فاخرة تحمل اسمك أو اسم من تحب بخط عربي أصيل، تفضل بزيارة دار نون والقلم عبر الرابط الخاص بي:
${window.location.origin}/?ref=${activePartner.referralCode}
ولا تنسَ كودي ${activePartner.referralCode} لضمان أولوية التجهيز والحفر المجاني!`,
                },
              ].map((pitch, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <pitch.icon className="w-4 h-4 text-amber-600" />
                      <h3 className="text-sm font-bold text-stone-900">{isAr ? pitch.titleAr : pitch.titleEn}</h3>
                    </div>
                    <pre className="p-3 bg-stone-50 rounded-2xl text-[11px] text-stone-700 whitespace-pre-wrap font-sans border border-stone-100 max-h-48 overflow-y-auto">
                      {pitch.textAr}
                    </pre>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">
                      {isAr ? 'جاهزة للنشر الفوري' : 'Ready to share'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPitch(pitch.textAr, idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition"
                    >
                      {copiedPitchIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPitchIndex === idx ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ النص بالكامل' : 'Copy Pitch')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: DIGITAL EMPLOYEE ID CARD */}
        {/* ========================================================= */}
        {activeTab === 'card' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-stone-900">
                    {isAr ? 'بطاقتك الوظيفية الرقمية المعتمدة' : 'Official Digital Partner Card'}
                  </h2>
                </div>
                <p className="text-xs text-stone-500 mt-1 max-w-xl">
                  {isAr 
                    ? 'هويتك الرسمية المعتمدة كممثل مبيعات وشريك لدار نون والقلم. يمكنك إبرازها للعملاء أو طباعتها كبطاقة عمل رسمية.' 
                    : 'Show this digital ID card to B2B clients or print it as an official credential.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold transition shrink-0"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'طباعة الهوية' : 'Print Card'}</span>
              </button>
            </div>

            <div className="py-6 flex justify-center">
              <DigitalEmployeeCard partner={activePartner} isAr={isAr} />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: PRODUCT ACADEMY & SALES GUIDES */}
        {/* ========================================================= */}
        {activeTab === 'academy' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-stone-900">
                  {isAr ? 'أكاديمية المنتجات وأدلة الإقناع الميداني' : 'Product Sales Academy'}
                </h2>
              </div>
              <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'أدلة إرشادية عملية تفصيلية لكل منتج: الفئة المستهدفة، نقاط الإقناع الحاسمة، الأخطاء الشائعة أثناء العرض، وكيفية الرد على الاعتراضات.'
                  : 'Practical field guides on audience segmentation, pitch points, and objection handling.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academyGuides.map((guide) => (
                <div key={guide.productId} className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between">
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                        {guide.category}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {guide.productId}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 mb-2">
                      {guide.productTitleAr}
                    </h3>

                    <div className="text-xs text-stone-600 mb-4 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <strong className="text-stone-800 block mb-0.5">{isAr ? 'الجمهور المستهدف:' : 'Target:'}</strong>
                      <span>{guide.targetAudienceAr}</span>
                    </div>

                    {/* Pitch points */}
                    <div className="mb-4">
                      <strong className="text-xs font-bold text-stone-800 block mb-1.5">{isAr ? 'أبرز نقاط الإقناع:' : 'Key Pitch Points:'}</strong>
                      <ul className="space-y-1.5 text-xs text-stone-600">
                        {guide.pitchPointsAr.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common mistakes */}
                    <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-rose-900">
                      <strong className="block mb-0.5 text-rose-950 font-semibold">{isAr ? 'خطأ شائع تجنبه:' : 'Common Mistake:'}</strong>
                      <span>{guide.commonMistakesAr}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">
                      {isAr ? 'نصيحة التسعير:' : 'Pricing tip:'}
                    </span>
                    <span className="text-xs font-bold text-amber-800">
                      {guide.pricingTipsAr}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        {isAr 
          ? 'دار نون والقلم للتحف والخط العربي • بوابة ممثلي المبيعات وتطوير الأعمال المعتمدة' 
          : 'Noon & Pen Calligraphy Atelier • Official Sales Partners Portal'}
      </footer>
    </div>
  );
};
