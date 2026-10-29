import React, { useState, useEffect } from 'react';
import {
  Bot,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Send,
  Sliders,
  Filter,
  Check,
  X,
  FileText,
  Radio,
  Eye,
  Settings,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Cpu,
  Users2,
  Lock,
  Unlock,
  CornerDownLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useAutonomousAgentsStore,
  AgentInfo,
  AgentRole,
  ActionRiskLevel,
  AgentTask,
  TaskStatus,
} from '../../store/useAutonomousAgentsStore';

interface AdminAutonomousAgentsTabProps {
  isAr?: boolean;
}

export const AdminAutonomousAgentsTab: React.FC<AdminAutonomousAgentsTabProps> = ({ isAr = true }) => {
  const {
    isGlobalKillSwitchActive,
    operatingMode,
    autoRunIntervalSec,
    lastOrchestrationCycleAt,
    agents,
    messagesBus,
    tasksQueue,
    auditLogs,
    setGlobalKillSwitch,
    setOperatingMode,
    setAutoRunIntervalSec,
    toggleAgentStatus,
    updateAgentConfig,
    sendInterAgentMessage,
    createTask,
    approveTask,
    rejectTask,
    rollbackTask,
    runOrchestrationCycle,
    clearAuditLogs,
  } = useAutonomousAgentsStore();

  const [activeSubTab, setActiveSubTab] = useState<'agents' | 'hitl' | 'bus' | 'audit'>('agents');
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<AgentInfo | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending_approval' | 'completed' | 'rejected'>('all');
  
  // Rejection modal
  const [rejectModalTaskId, setRejectModalTaskId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Task details modal
  const [inspectTask, setInspectTask] = useState<AgentTask | null>(null);

  // New Inter-Agent Test Dispatcher modal
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchSender, setDispatchSender] = useState<string>('agent-orchestrator');
  const [dispatchTarget, setDispatchTarget] = useState<string>('agent-orders-customizer');
  const [dispatchAction, setDispatchAction] = useState<string>('audit_sample_order');
  const [dispatchReasoning, setDispatchReasoning] = useState<string>('طلب تدقيق فني مستعجل لطلب بقيمة 450,000 د.ع');

  // Stats calculation
  const totalTasksCount = agents.reduce((acc, a) => acc + a.tasksCompletedCount, 0);
  const activeAgentsCount = agents.filter((a) => a.status === 'active').length;
  const pendingApprovalsCount = tasksQueue.filter((t) => t.status === 'pending_approval').length;

  // Periodic Auto-Sync simulation if autonomous mode is active
  useEffect(() => {
    if (isGlobalKillSwitchActive || operatingMode === 'simulation') return;

    const interval = setInterval(() => {
      runOrchestrationCycle().catch(console.error);
    }, autoRunIntervalSec * 1000);

    return () => clearInterval(interval);
  }, [isGlobalKillSwitchActive, operatingMode, autoRunIntervalSec, runOrchestrationCycle]);

  // Handle Manual Cycle Run
  const handleTriggerCycle = async () => {
    setIsSyncing(true);
    try {
      const res = await runOrchestrationCycle();
      toast.success(
        isAr
          ? `اكتملت دورة التنسيق: تم تدقيق المهام وإرسال إشارات التزامن (${res.executedTasks} مهمة)`
          : `Sync cycle completed: ${res.executedTasks} tasks checked`
      );
    } catch {
      toast.error(isAr ? 'فشلت دورة المزامنة' : 'Cycle sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Approve Task
  const handleApprove = async (taskId: string) => {
    const success = await approveTask(taskId, 'المدير العام (Super Admin)', 'تم الفحص والمصادقة على التنفيذ');
    if (success) {
      toast.success(isAr ? 'تمت المصادقة على تنفيذ المهمة بنجاح' : 'Task approved successfully');
    }
  };

  // Handle Reject Task
  const handleConfirmReject = () => {
    if (!rejectModalTaskId) return;
    rejectTask(rejectModalTaskId, 'المدير العام', rejectionReason || 'مرفوض لعدم استيفاء الشروط المالية');
    toast.info(isAr ? 'تم رفض المهمة وتعليق أثرها' : 'Task rejected');
    setRejectModalTaskId(null);
    setRejectionReason('');
  };

  // Handle Test Message Send
  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendInterAgentMessage({
      senderAgentId: dispatchSender,
      targetAgentId: dispatchTarget,
      action: dispatchAction,
      priority: 'high',
      payload: { testTrigger: true, note: dispatchReasoning },
      reasoningSnippetAr: dispatchReasoning,
    });
    setIsDispatchModalOpen(false);
    toast.success(isAr ? 'تم تمرير الرسالة عبر ناقل البيانات البيني للوكلاء' : 'Message dispatched to A2A bus');
  };

  // Risk Badge helper
  const renderRiskBadge = (level: ActionRiskLevel) => {
    switch (level) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {isAr ? 'أخضر (آلي 100%)' : 'Green (Auto)'}
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {isAr ? 'أصفر (آلي خاضع للمراجعة)' : 'Yellow (Guarded)'}
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            {isAr ? 'أحمر (موافقة بشرية إلزامية)' : 'Red (Human Signoff)'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* ========================================================= */}
      {/* TOP COMMAND BAR: MASTER KILL SWITCH & SYSTEM TELEMETRY */}
      {/* ========================================================= */}
      <div className={`p-6 rounded-3xl border shadow-sm transition-all duration-300 ${
        isGlobalKillSwitchActive 
          ? 'bg-gradient-to-r from-rose-950 via-rose-900 to-stone-900 border-rose-600 text-white' 
          : 'bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 border-stone-800 text-white'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`p-2.5 rounded-2xl border ${
                isGlobalKillSwitchActive 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black font-serif">
                    {isAr ? 'منظومة الوكلاء الموظفين المستقلين (Multi-Agent Staff)' : 'Autonomous Multi-Agent Staff Engine'}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    isGlobalKillSwitchActive
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  }`}>
                    {isGlobalKillSwitchActive 
                      ? (isAr ? 'المفتاح الطارئ مفعل (النظام معلق)' : 'KILL-SWITCH ENGAGED')
                      : (isAr ? 'المنظومة في وضع التشغيل الآمن' : 'LIVE & SECURE')}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                  {isAr
                    ? 'فريق متكامل من 6 وكلاء ذكاء اصطناعي متخصصين يعملون في خلفية دار نون والقلم لإدارة وفحص الطلبات، تدقيق العمولات، تعزيز الـ SEO، وحساب العائد الإعلاني مع رقابة بشرية مشددة (HITL).'
                    : 'Fleet of 6 autonomous task-oriented agents coordinating backend operations for Noon & Pen with strict Human-in-the-Loop safeguards.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Emergency Kill Switch & Manual Sync */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (!isGlobalKillSwitchActive) {
                  const confirmKill = window.confirm(
                    isAr 
                      ? '⚠️ تحذير أمني: هل تريد تفعيل زر الإيقاف الطارئ الشامل وتجميد عمل كافة الوكلاء فوراً؟' 
                      : 'Emergency: Freeze all autonomous agent operations immediately?'
                  );
                  if (confirmKill) setGlobalKillSwitch(true);
                } else {
                  setGlobalKillSwitch(false);
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer ${
                isGlobalKillSwitchActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950/60'
              }`}
            >
              {isGlobalKillSwitchActive ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>{isAr ? 'إلغاء الإيقاف الطارئ واستئناف الوكلاء' : 'Disengage Kill-Switch'}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                  <span>{isAr ? 'زر الإيقاف الطارئ الشامل (Kill-Switch)' : 'Master Kill-Switch'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleTriggerCycle}
              disabled={isSyncing || isGlobalKillSwitchActive}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'مزامنة دورة العمل الآن' : 'Run Cycle Now'}</span>
            </button>
          </div>
        </div>

        {/* Live Counters strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-stone-400 text-[11px] mb-1">{isAr ? 'الوكلاء النشطون' : 'Active Agents'}</div>
            <div className="text-xl font-black font-mono text-emerald-400">
              {activeAgentsCount} / {agents.length}
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-stone-400 text-[11px] mb-1">{isAr ? 'المهام المنفذة بنجاح' : 'Completed Tasks'}</div>
            <div className="text-xl font-black font-mono text-amber-300">
              {totalTasksCount.toLocaleString()}
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-stone-400 text-[11px] mb-1">{isAr ? 'مصادقات بشرية بانتظارك' : 'Pending Approvals'}</div>
            <div className="text-xl font-black font-mono text-rose-400 flex items-center gap-1.5">
              <span>{pendingApprovalsCount}</span>
              {pendingApprovalsCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-stone-400 text-[11px] mb-1">{isAr ? 'آخر دورة تزامن آلي' : 'Last Cycle'}</div>
            <div className="text-xs font-bold text-stone-200 mt-1 font-mono">
              {lastOrchestrationCycleAt || 'منذ دقيقة'}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TABS NAVIGATION */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('agents')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'agents'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-500" />
          <span>{isAr ? 'طاقم الوكلاء الموظفين (6 وكلاء)' : 'Agents Fleet'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
            {agents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('hitl')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'hitl'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{isAr ? 'مكتب المصادقة البشرية (HITL Desk)' : 'Human Approval Desk'}</span>
          {pendingApprovalsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
              {pendingApprovalsCount} {isAr ? 'مهمة' : 'tasks'}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('bus')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'bus'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Radio className="w-4 h-4 text-sky-500" />
          <span>{isAr ? 'ناقل التواصل البيني (A2A Message Bus)' : 'Agent-to-Agent Bus'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-800 text-[10px] font-mono">
            {messagesBus.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'audit'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-500" />
          <span>{isAr ? 'سجل الرقابة الفنية والأمان (Audit Logs)' : 'Audit Trail'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: AGENTS DIRECTORY & CONFIGURATION */}
      {/* ========================================================= */}
      {activeSubTab === 'agents' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Operating Mode Bar */}
          <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {isAr ? 'وضع التشغيل العام للنظام' : 'System Autonomy Mode'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isAr
                    ? 'التحكم في درجة استقلالية الوكلاء وصلاحيات اتخاذ القرارات'
                    : 'Control agent decision-making autonomy levels'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl">
              {[
                { id: 'supervised', labelAr: 'مراقب بدقة (موصى به)', labelEn: 'Supervised' },
                { id: 'fully_autonomous', labelAr: 'استقلالية كاملة', labelEn: 'Full Auto' },
                { id: 'simulation', labelAr: 'محاكاة تجريبية', labelEn: 'Dry Run' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setOperatingMode(m.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    operatingMode === m.id
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isAr ? m.labelAr : m.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const isPaused = agent.status === 'paused' || isGlobalKillSwitchActive;
              return (
                <div
                  key={agent.id}
                  className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                    isPaused ? 'border-stone-300 opacity-80 bg-stone-50/50' : 'border-stone-200'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${agent.colorClass}`}>
                          {agent.role === 'orchestrator' && <BrainCircuit className="w-6 h-6" />}
                          {agent.role === 'orders_customizer' && <Cpu className="w-6 h-6" />}
                          {agent.role === 'partner_network' && <Users2 className="w-6 h-6" />}
                          {agent.role === 'catalog_content' && <Sparkles className="w-6 h-6" />}
                          {agent.role === 'campaigns_growth' && <TrendingUp className="w-6 h-6" />}
                          {agent.role === 'system_health' && <ShieldAlert className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{agent.nameAr}</h4>
                          <span className="text-[11px] text-stone-400 font-mono block">{agent.nameEn}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAgentStatus(agent.id)}
                        disabled={isGlobalKillSwitchActive}
                        title={isPaused ? (isAr ? 'تفعيل الوكيل' : 'Activate') : (isAr ? 'تعليق الوكيل' : 'Pause')}
                        className={`p-2 rounded-xl transition cursor-pointer border ${
                          isPaused
                            ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                        }`}
                      >
                        {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {isAr ? agent.descriptionAr : agent.descriptionEn}
                    </p>

                    {/* Risk Level & Capabilities */}
                    <div className="space-y-3 mb-4 pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-medium">{isAr ? 'سقف المخاطرة المصرّح:' : 'Risk Allowance:'}</span>
                        {renderRiskBadge(agent.allowedRiskLevel)}
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-stone-700 block mb-1.5">
                          {isAr ? 'المهام التخصصية المنوطة به:' : 'Core Capabilities:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {agent.capabilitiesAr.map((cap, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Metrics & Actions */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">{isAr ? 'المهام المنجزة' : 'Tasks'}</span>
                      <strong className="text-stone-900 font-mono text-sm">{agent.tasksCompletedCount}</strong>
                    </div>

                    <button
                      onClick={() => setSelectedAgentDetails(agent)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5 text-stone-600" />
                      <span>{isAr ? 'إعدادات الصلاحية' : 'Configure'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: HUMAN-IN-THE-LOOP (HITL) APPROVAL DESK */}
      {/* ========================================================= */}
      {activeSubTab === 'hitl' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Description */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-stone-900">
                  {isAr ? 'مكتب المصادقة البشرية (Human Approval Desk)' : 'Human-in-the-Loop Approval Queue'}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                {isAr
                  ? 'أي إجراء حرج يتجاوز سقف الأمان (مثل صرف مبالغ مالية كبيرة، تعديل أسعار رئيسية، أو تغيير بيانات شريك) يُعلّق آلياً ويُرفع هنا للحصول على موافقة صريحة من المدير البشري قبل تطبيقه في قاعدة البيانات.'
                  : 'High-risk automated actions are gated here. Nothing executes without your explicit, auditable signoff.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">{isAr ? 'تصفية المهام:' : 'Filter:'}</span>
              <select
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-800 focus:border-amber-500 outline-none"
              >
                <option value="all">{isAr ? 'جميع المهام' : 'All Tasks'}</option>
                <option value="pending_approval">{isAr ? 'بانتظار الموافقة' : 'Pending'}</option>
                <option value="completed">{isAr ? 'مكتملة ومصادق عليها' : 'Approved'}</option>
                <option value="rejected">{isAr ? 'مرفوضة' : 'Rejected'}</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasksQueue
              .filter((t) => taskFilter === 'all' || t.status === taskFilter)
              .map((task) => {
                const isPending = task.status === 'pending_approval';
                const agent = agents.find((a) => a.id === task.agentId);

                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs transition-all ${
                      isPending ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-2xl border shrink-0 ${agent?.colorClass || 'bg-stone-100 text-stone-700'}`}>
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-stone-500 font-mono">
                              {task.id}
                            </span>
                            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              {agent?.nameAr}
                            </span>
                            {renderRiskBadge(task.riskLevel)}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              task.status === 'pending_approval' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              task.status === 'approved' || task.status === 'completed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                              'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}>
                              {task.status === 'pending_approval' ? (isAr ? 'بانتظار مصادقتك' : 'Pending Review') :
                               task.status === 'approved' ? (isAr ? 'تمت المصادقة' : 'Approved') :
                               task.status === 'completed' ? (isAr ? 'مكتملة آلياً' : 'Completed') :
                               (isAr ? 'مرفوضة' : 'Rejected')}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-stone-900">{task.titleAr}</h4>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end lg:self-center">
                        <button
                          onClick={() => setInspectTask(task)}
                          className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isAr ? 'سلسلة الاستدلال' : 'View Chain'}</span>
                        </button>

                        {isPending && (
                          <>
                            <button
                              onClick={() => setRejectModalTaskId(task.id)}
                              className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              <span>{isAr ? 'رفض' : 'Reject'}</span>
                            </button>

                            <button
                              onClick={() => handleApprove(task.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>{isAr ? 'مصادقة واعتماد الإجراء' : 'Approve Action'}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Reasoning Chain Preview */}
                    <div className="mt-4 bg-stone-50 rounded-2xl p-4 border border-stone-100 text-xs">
                      <strong className="block text-stone-700 font-bold mb-2 flex items-center gap-1.5">
                        <BrainCircuit className="w-4 h-4 text-purple-600" />
                        <span>{isAr ? 'تقرير استدلال الوكيل وتحليل المخاطر:' : 'Agent Reasoning Chain:'}</span>
                      </strong>
                      <ul className="space-y-1.5 text-stone-600">
                        {task.reasoningChain.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="text-amber-600 shrink-0 font-mono font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>

                      {task.reviewedBy && (
                        <div className="mt-3 pt-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500">
                          <span>{isAr ? `المراجع البشري: ${task.reviewedBy}` : `Reviewed by: ${task.reviewedBy}`}</span>
                          <span className="font-mono">{task.reviewedAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: AGENT-TO-AGENT (A2A) MESSAGE BUS */}
      {/* ========================================================= */}
      {activeSubTab === 'bus' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-sky-600 animate-pulse" />
                <h3 className="text-base font-bold text-stone-900">
                  {isAr ? 'ناقل التواصل والتخاطب البيني للوكلاء (A2A Message Bus)' : 'Inter-Agent Event Bus'}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-xl">
                {isAr
                  ? 'سجل حي لكافة الرسائل والبيانات المتبادلة بين الوكلاء آلياً (مثل: وكيل الطلبات يوجه طلباً لوكيل الشركاء لاحتساب العمولة).'
                  : 'Live event stream showing structured message envelopes exchanged between backend agents.'}
              </p>
            </div>

            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'إرسال إشارة بينية تجريبية' : 'Inject Test Event'}</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="space-y-3">
            {messagesBus.map((msg) => {
              const sender = agents.find((a) => a.id === msg.senderAgentId);
              const target = agents.find((a) => a.id === msg.targetAgentId);

              return (
                <div
                  key={msg.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-900 font-bold text-xs border border-purple-200">
                        {sender?.nameAr || msg.senderAgentId}
                      </span>
                      <ArrowRight className="w-4 h-4 text-stone-400 rtl:rotate-180" />
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
                        {target?.nameAr || msg.targetAgentId}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                        {msg.action}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {msg.reasoningSnippetAr && (
                    <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100 font-medium">
                      {msg.reasoningSnippetAr}
                    </p>
                  )}

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>ID: {msg.id}</span>
                    <span>Status: {msg.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: AUDIT LOGS & SYSTEM SENTINEL */}
      {/* ========================================================= */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-stone-900">
                  {isAr ? 'سجل الرقابة والعمليات الآلية (Audit Trail)' : 'Real-time System Audit Trail'}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {isAr
                  ? 'توثيق كل حركة، فحص أمني، زمن استجابة (ms)، واستدعاء قام به أي وكيل في النظام.'
                  : 'Immutable record of every autonomous tool execution, latency, and status change.'}
              </p>
            </div>

            <button
              onClick={clearAuditLogs}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-medium transition cursor-pointer"
            >
              {isAr ? 'تفريغ السجل' : 'Clear Trail'}
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-stone-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-stone-50/50 transition flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{log.agentNameAr}</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 text-[10px] font-mono">
                        {log.actionType}
                      </span>
                      {renderRiskBadge(log.riskLevel)}
                    </div>
                    <p className="text-stone-600 font-medium">{log.summaryAr}</p>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="font-mono text-stone-400 text-[11px] block">{log.timestamp}</span>
                    <span className="inline-block mt-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold">
                      {log.executionMs} ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: REJECTION REASON MODAL */}
      {/* ========================================================= */}
      {rejectModalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {isAr ? 'رفض تنفيذ المهمة وإشعار الوكيل' : 'Reject Action'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {isAr ? 'يرجى كتابة سبب الرفض ليتم تسجيله في سجل التدقيق وتعديل خطة الوكيل.' : 'Provide rejection reason'}
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={isAr ? 'مثال: الرصيد غير مطابق، يرجى مراجعة العميل هاتفياً أولاً...' : 'Rejection note...'}
              className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-stone-900 focus:border-rose-500 outline-none resize-none mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalTaskId(null)}
                className="px-4 py-2 rounded-xl text-xs text-stone-500 hover:text-stone-800"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                {isAr ? 'تأكيد الرفض' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: AGENT CONFIGURATION DRAWER */}
      {/* ========================================================= */}
      {selectedAgentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900">
                  {isAr ? `إعدادات وصلاحيات: ${selectedAgentDetails.nameAr}` : 'Agent Configuration'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAgentDetails(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  {isAr ? 'سقف المخاطرة المسموح بالتنفيذ التلقائي دون إذن بشري:' : 'Max Auto Risk Level:'}
                </label>
                <select
                  value={selectedAgentDetails.allowedRiskLevel}
                  onChange={(e) => {
                    updateAgentConfig(selectedAgentDetails.id, {
                      allowedRiskLevel: e.target.value as ActionRiskLevel,
                    });
                    setSelectedAgentDetails((prev) =>
                      prev ? { ...prev, allowedRiskLevel: e.target.value as ActionRiskLevel } : null
                    );
                    toast.success(isAr ? 'تم حفظ مستوى المخاطرة' : 'Risk level updated');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-800 focus:border-amber-500 outline-none"
                >
                  <option value="green">{isAr ? 'أخضر فقط (المهام الآمنة 100%)' : 'Green only (Safe)'}</option>
                  <option value="yellow">{isAr ? 'أخضر وأصفر (مهام مع نافذة تراجع)' : 'Green & Yellow'}</option>
                  <option value="red">{isAr ? 'أحمر (صلاحيات حرجة - تتطلب إشرافاً)' : 'Red (Critical)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  {isAr ? 'التعليمات التأسيسية التوجيهية للوكيل (System Prompt):' : 'System Prompt:'}
                </label>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-stone-600 leading-relaxed font-sans">
                  {selectedAgentDetails.systemPromptSummary}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <span className="font-bold block mb-1">💡 {isAr ? 'مبدأ الصلاحيات المعزولة:' : 'Isolated Sandbox:'}</span>
                <span>
                  {isAr 
                    ? 'هذا الوكيل يعمل في بيئة معزولة ولا يملك وصولاً مباشراً لقواعد البيانات الحساسة إلا عبر ناقل الرسائل البيني المعتمد.'
                    : 'This agent runs sandboxed and accesses restricted storage strictly via the validated message bus.'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedAgentDetails(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
              >
                {isAr ? 'إغلاق وحفظ' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: INJECT TEST INTER-AGENT MESSAGE */}
      {/* ========================================================= */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {isAr ? 'إرسال إشارة بينية تجريبية للوكلاء' : 'Inject Inter-Agent Event'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {isAr ? 'اختبار تواصل الوكلاء عبر الـ Message Bus ومراقبة رد الفعل الآلي.' : 'Test A2A event exchange'}
            </p>

            <form onSubmit={handleSendTestMessage} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{isAr ? 'المرسل:' : 'Sender:'}</label>
                  <select
                    value={dispatchSender}
                    onChange={(e) => setDispatchSender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{isAr ? 'المستقبل:' : 'Target:'}</label>
                  <select
                    value={dispatchTarget}
                    onChange={(e) => setDispatchTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">{isAr ? 'اسم العملية (Action):' : 'Action:'}</label>
                <input
                  type="text"
                  value={dispatchAction}
                  onChange={(e) => setDispatchAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">{isAr ? 'سياق ونص الرسالة:' : 'Context:'}</label>
                <textarea
                  rows={2}
                  value={dispatchReasoning}
                  onChange={(e) => setDispatchReasoning(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 text-stone-500"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold"
                >
                  {isAr ? 'إرسال الإشارة' : 'Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: TASK REASONING DETAILS */}
      {/* ========================================================= */}
      {inspectTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">{inspectTask.titleAr}</h3>
              <button
                onClick={() => setInspectTask(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium">{isAr ? 'مستوى الخطورة:' : 'Risk:'}</span>
                {renderRiskBadge(inspectTask.riskLevel)}
                <span className="text-stone-400 font-mono">| {inspectTask.createdAt}</span>
              </div>

              <div>
                <strong className="block text-stone-700 font-bold mb-1">{isAr ? 'مدخلات المهمة:' : 'Input Payload:'}</strong>
                <pre className="p-3 bg-stone-900 text-amber-300 rounded-xl overflow-x-auto text-[11px] font-mono">
                  {JSON.stringify(inspectTask.inputData, null, 2)}
                </pre>
              </div>

              <div>
                <strong className="block text-stone-700 font-bold mb-1">{isAr ? 'سلسلة الاستدلال المنطقي:' : 'Reasoning:'}</strong>
                <ul className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-100 text-stone-700">
                  {inspectTask.reasoningChain.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setInspectTask(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
