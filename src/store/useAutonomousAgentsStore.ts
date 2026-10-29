import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AgentRole =
  | 'orchestrator'
  | 'orders_customizer'
  | 'catalog_content'
  | 'partner_network'
  | 'campaigns_growth'
  | 'system_health'
  | 'social_media_manager';

export type AgentStatus = 'active' | 'busy' | 'paused' | 'disabled' | 'error';
export type ActionRiskLevel = 'green' | 'yellow' | 'red';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'failed'
  | 'rolled_back';

export interface AgentInfo {
  id: string;
  role: AgentRole;
  nameAr: string;
  nameEn: string;
  badgeAr: string;
  avatarIcon: string;
  colorClass: string;
  descriptionAr: string;
  descriptionEn: string;
  status: AgentStatus;
  allowedRiskLevel: ActionRiskLevel; // highest risk level this agent can execute without approval
  isAutoExecutionEnabled: boolean;
  tasksCompletedCount: number;
  tasksFailedCount: number;
  lastActiveAt?: string;
  activeTaskId?: string;
  capabilitiesAr: string[];
  systemPromptSummary: string;
}

export interface InterAgentMessage {
  id: string;
  senderAgentId: string;
  targetAgentId: string; // or 'broadcast'
  action: string;
  priority: TaskPriority;
  payload: Record<string, any>;
  status: 'sent' | 'processing' | 'processed' | 'rejected';
  reasoningSnippetAr?: string;
  timestamp: string;
}

export interface AgentTask {
  id: string;
  agentId: string;
  titleAr: string;
  titleEn: string;
  riskLevel: ActionRiskLevel;
  priority: TaskPriority;
  status: TaskStatus;
  inputData: Record<string, any>;
  outputResult?: Record<string, any>;
  reasoningChain: string[];
  requiresHumanApproval: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AgentAuditLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentNameAr: string;
  actionType: string;
  riskLevel: ActionRiskLevel;
  summaryAr: string;
  details?: Record<string, any>;
  executionMs: number;
}

interface AutonomousAgentsState {
  // Master switches
  isGlobalKillSwitchActive: boolean;
  operatingMode: 'fully_autonomous' | 'supervised' | 'simulation';
  autoRunIntervalSec: number;
  lastOrchestrationCycleAt?: string;

  // Agents registry
  agents: AgentInfo[];

  // Inter-agent message bus & Queues
  messagesBus: InterAgentMessage[];
  tasksQueue: AgentTask[];
  auditLogs: AgentAuditLog[];

  // Actions - Master Controls
  setGlobalKillSwitch: (active: boolean) => void;
  setOperatingMode: (mode: 'fully_autonomous' | 'supervised' | 'simulation') => void;
  setAutoRunIntervalSec: (sec: number) => void;

  // Actions - Individual Agent Controls
  toggleAgentStatus: (agentId: string, status?: AgentStatus) => void;
  updateAgentConfig: (
    agentId: string,
    updates: Partial<Pick<AgentInfo, 'allowedRiskLevel' | 'isAutoExecutionEnabled'>>
  ) => void;

  // Actions - Message Bus (Agent-to-Agent)
  sendInterAgentMessage: (msg: Omit<InterAgentMessage, 'id' | 'timestamp' | 'status'>) => InterAgentMessage;
  markMessageProcessed: (messageId: string) => void;

  // Actions - Tasks & Human-in-the-Loop
  createTask: (task: Omit<AgentTask, 'id' | 'createdAt' | 'status' | 'reasoningChain'> & { reasoningChain?: string[] }) => AgentTask;
  approveTask: (taskId: string, reviewerName: string, note?: string) => Promise<boolean>;
  rejectTask: (taskId: string, reviewerName: string, reason: string) => void;
  rollbackTask: (taskId: string, note?: string) => void;

  // Actions - Autonomous Orchestration Cycle
  runOrchestrationCycle: () => Promise<{ executedTasks: number; messagesDispatched: number }>;
  clearAuditLogs: () => void;
}

const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'agent-orchestrator',
    role: 'orchestrator',
    nameAr: 'المايسترو المنسق العام (Conductor)',
    nameEn: 'Orchestrator & Task Conductor',
    badgeAr: 'المنسق المركزي',
    avatarIcon: 'BrainCircuit',
    colorClass: 'text-purple-700 bg-purple-50 border-purple-300',
    descriptionAr: 'العقل المدبر للنظام؛ يستقبل إشارات المتجر والطلبات ويوزع تذاكر العمل التخصصية على بقية الوكلاء ويراقب إنجازها.',
    descriptionEn: 'Central brain that schedules pipelines, routes data between agents, and enforces business rules.',
    status: 'active',
    allowedRiskLevel: 'yellow',
    isAutoExecutionEnabled: true,
    tasksCompletedCount: 142,
    tasksFailedCount: 1,
    lastActiveAt: 'منذ دقيقة',
    capabilitiesAr: [
      'توزيع المهام بين الوكلاء',
      'فصل النزاعات وتحديد الأولويات',
      'إدارة طابور العمل الموزع',
      'رفع التنبيهات الحرجة للمدير العام',
    ],
    systemPromptSummary: 'تنسيق دورة العمل الآلية لدار نون والقلم وضمان تنفيذ قرارات الإدارة بأعلى درجات الدقة.',
  },
  {
    id: 'agent-orders-customizer',
    role: 'orders_customizer',
    nameAr: 'وكيل فحص الطلبات والتخصيص الفني',
    nameEn: 'Order Specs & Laser Proof Auditor',
    badgeAr: 'فاحص الطلبات',
    avatarIcon: 'Cpu',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-300',
    descriptionAr: 'يراقب فورياً كل طلب مخصص، يدقق نصوص الحفر والخط العربي والشعارات المرفوعة، ويفحص مواصفات الأبعاد والتصنيع.',
    descriptionEn: 'Inspects customized orders, validates Arabic calligraphy, vectors, LED selections, and dimensions.',
    status: 'active',
    allowedRiskLevel: 'green',
    isAutoExecutionEnabled: true,
    tasksCompletedCount: 389,
    tasksFailedCount: 3,
    lastActiveAt: 'منذ 3 دقائق',
    capabilitiesAr: [
      'فحص ملفات الشعار (SVG, PDF, PNG)',
      'معايرة تباعد الحروف ومسافة الرؤية',
      'توليد بطاقة التصنيع لورشة الليزر',
      'إنشاء مسودة البروفة الرقمية الآلية',
    ],
    systemPromptSummary: 'التأكد من خلو ملفات الزبائن من أخطاء القياس أو دقة الشعار قبل بدء حفر وتصنيع نون والقلم.',
  },
  {
    id: 'agent-partner-network',
    role: 'partner_network',
    nameAr: 'وكيل شبكة الشركاء ومبيعات B2B',
    nameEn: 'B2B CRM & Partner Network Agent',
    badgeAr: 'مشرف الشركاء',
    avatarIcon: 'Users2',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    descriptionAr: 'يدير دورة حياة ممثلي المبيعات المعتمدين؛ يربط العملاء بالشركاء، يدقق صفقات الـ CRM، ويفحص طلبات السحب المالي قبل اعتمادها.',
    descriptionEn: 'Manages sales representatives, attribution tracking, CRM deals validation, and withdrawal compliance.',
    status: 'active',
    allowedRiskLevel: 'yellow',
    isAutoExecutionEnabled: true,
    tasksCompletedCount: 215,
    tasksFailedCount: 0,
    lastActiveAt: 'منذ 5 دقائق',
    capabilitiesAr: [
      'تدقيق ربط العملاء الدائم مدى الحياة',
      'فحص حسابات السحب المالي (زين كاش)',
      'توليد تصاميم باركودات QR المطبوعة',
      'صياغة نماذج العروض التسويقية (Pitches)',
    ],
    systemPromptSummary: 'حماية حقوق ممثلي المبيعات وحساب العمولات بدقة واقتراح فرص النمو لشركاء بغداد والمحافظات.',
  },
  {
    id: 'agent-catalog-content',
    role: 'catalog_content',
    nameAr: 'وكيل الكتالوج والتحرير وSEO',
    nameEn: 'Catalog & SEO Content Optimizer',
    badgeAr: 'محرر الكتالوج',
    avatarIcon: 'Sparkles',
    colorClass: 'text-sky-700 bg-sky-50 border-sky-300',
    descriptionAr: 'يكتب ويحدث أوصاف التحف والمنتجات الفنية، يحسن التوافق مع محركات البحث، ويراقب التناسق بين الدينار والدولار.',
    descriptionEn: 'Generates rich product copy, audits Schema.org SEO metadata, and optimizes volume tier pricing.',
    status: 'active',
    allowedRiskLevel: 'green',
    isAutoExecutionEnabled: true,
    tasksCompletedCount: 94,
    tasksFailedCount: 0,
    lastActiveAt: 'منذ 12 دقيقة',
    capabilitiesAr: [
      'توليد أوصاف تسويقية باللغتين AR/EN',
      'تحسين الكلمات الدلالية لـ Google',
      'تدقيق أسعار الجملة والخصم المتدرج',
      'اقتراح مقالات لمعرض الأعمال',
    ],
    systemPromptSummary: 'إبراز روح الخط العربي البغدادي والفخامة الحرفية في جميع صفحات ومتجات دار نون والقلم.',
  },
  {
    id: 'agent-campaigns-growth',
    role: 'campaigns_growth',
    nameAr: 'وكيل النمو والعائد الإعلاني ROAS',
    nameEn: 'Growth & AI Ad Attribution Agent',
    badgeAr: 'محلل النمو',
    avatarIcon: 'TrendingUp',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-300',
    descriptionAr: 'يربط نتائج محرك الحملات الذكية ومسارات تيك توك بمبيعات المتجر الفعلية لحساب العائد المباشر ومضاعفة الميزانيات الرابحة.',
    descriptionEn: 'Correlates AI campaign experiments with store revenue, computes granular ROAS, and shifts ad spend.',
    status: 'active',
    allowedRiskLevel: 'yellow',
    isAutoExecutionEnabled: true,
    tasksCompletedCount: 167,
    tasksFailedCount: 2,
    lastActiveAt: 'منذ 8 دقائق',
    capabilitiesAr: [
      'حساب العائد على الإنفاق الإعلاني (ROAS)',
      'مراقبة كفاءة كودات الخصم الموسمية',
      'اقتراح تحويل الميزانيات للحملات الأقوى',
      'تتبع سلوك زوار بوابات الشراء',
    ],
    systemPromptSummary: 'تحقيق أعلى عائد استثماري إعلاني للمتجر ومنع الهدر في الحملات منخفضة التحويل.',
  },
  {
    id: 'agent-system-health',
    role: 'system_health',
    nameAr: 'وكيل الرقابة الفنية والأمان SRE',
    nameEn: 'System Health & Security Sentinel',
    badgeAr: 'حارس الاستقرار',
    avatarIcon: 'ShieldAlert',
    colorClass: 'text-slate-800 bg-slate-100 border-slate-300',
    descriptionAr: 'يراقب استجابة خوادم المتجر وزمن التحميل، يرصد محاولات التلاعب أو الأخطاء، ويضمن استمرارية العمل دون توقف.',
    descriptionEn: 'Monitors endpoint latencies, 500 errors, rate-limiting, and state integrity across storage layers.',
    status: 'active',
    allowedRiskLevel: 'green',
    isAutoExecutionEnabled: true,
    tasksCompletedCount: 820,
    tasksFailedCount: 0,
    lastActiveAt: 'منذ ثوانٍ',
    capabilitiesAr: [
      'مراقبة سلامة نقاط الـ API الخلفية',
      'رصد الاستعلامات الثقيلة وزمن التحميل',
      'فحص تناسق بيانات السلة والطلبات',
      'تنبيه المدير عند أي مؤشر غير طبيعي',
    ],
    systemPromptSummary: 'حماية بيانات عملاء نون والقلم وضمان سرعة وأمان وتوافر المتجر على مدار الساعة.',
  },
  {
    id: 'agent-social-media',
    role: 'social_media_manager',
    nameAr: 'وكيل إدارة السوشيال ميديا وصناعة المحتوى',
    nameEn: 'Social Media Strategy & Content Repurposing Agent',
    badgeAr: 'مدير السوشيال ميديا',
    avatarIcon: 'Share2',
    colorClass: 'text-pink-700 bg-pink-50 border-pink-300',
    descriptionAr: 'المسؤول عن تحويل المقالات وتحديثات المنتجات والتحف الفنية المضيئة إلى منشورات وسيناريوهات تيك توك وإنستغرام ولينكد إن جاذبة للجمهور.',
    descriptionEn: 'Transforms articles, products, and proofs into platform-optimized social assets, hooks, and video concepts.',
    status: 'active',
    allowedRiskLevel: 'green',
    isAutoExecutionEnabled: true,
    tasksCompletedCount: 182,
    tasksFailedCount: 0,
    lastActiveAt: 'منذ دقيقة',
    capabilitiesAr: [
      'إعادة تدوير المقالات والمنتجات إلى محتوى تفاعلي',
      'صياغة خطافات وسيناريوهات تيك توك وإنستغرام ولينكد إن',
      'تنسيق مسودات (Drafts) قابلة للاعتماد والجدولة',
      'صياغة دعوات اتخاذ الإجراء (CTA) وهوية الخط العربي الفاخر',
      'فصل النزاعات وتوجيه المهام غير التسويقية للوكلاء المختصين',
    ],
    systemPromptSummary: 'وكيل إدارة التواصل الاجتماعي لدار نون والقلم. المهام: إعادة تدوير المقالات والتحديثات إلى منشورات وسيناريوهات فيديو لمنصات (تيك توك، إنستغرام، لينكد إن). الحفاظ على نبرة الفخامة والأصالة العربية. الالتزام بحدود الوكلاء وعدم التدخل في قواعد البيانات أو البرمجة. تقديم المخرجات بصيغة مسودة (Draft) تتضمن: المنصة، الخطاف، النص التفاعلي، الدعوة لاتخاذ إجراء (CTA) للعودة لموقع نون والقلم، والوسوم المستهدفة.',
  },
];

const INITIAL_MESSAGES_BUS: InterAgentMessage[] = [
  {
    id: 'msg-101',
    senderAgentId: 'agent-orders-customizer',
    targetAgentId: 'agent-partner-network',
    action: 'verify_partner_referral',
    priority: 'high',
    payload: {
      orderId: 'NQ-ORD-9021',
      clientPhone: '07801234567',
      totalIQD: 350000,
      referralCode: 'NQ-9482',
    },
    status: 'processed',
    reasoningSnippetAr: 'تم رصد طلب جديد بقيمة 350,000 د.ع يحتوي كود إحالة، مطلوب التحقق من شريك المبيعات لربط العمولة.',
    timestamp: '2026-04-22 11:45',
  },
  {
    id: 'msg-102',
    senderAgentId: 'agent-partner-network',
    targetAgentId: 'agent-orchestrator',
    action: 'commission_attribution_confirmed',
    priority: 'medium',
    payload: {
      orderId: 'NQ-ORD-9021',
      partnerId: 'partner-1',
      partnerName: 'أحمد الموسوي',
      commissionIQD: 42000,
      ratePercent: 12,
    },
    status: 'processed',
    reasoningSnippetAr: 'تمت مطابقة الكود بنجاح مع الشريك أحمد الموسوي برتبة أخصائي مبيعات (عمولة 12% = 42,000 د.ع).',
    timestamp: '2026-04-22 11:46',
  },
  {
    id: 'msg-103',
    senderAgentId: 'agent-campaigns-growth',
    targetAgentId: 'agent-catalog-content',
    action: 'request_creative_hook_refresh',
    priority: 'medium',
    payload: {
      campaignId: 'camp-ramadan-boxes',
      currentROAS: 4.8,
      recommendation: 'زيادة مخزون علب التغليف الفاخرة وإضافة صور حفر ليزر حديثة لمضاعفة المبيعات.',
    },
    status: 'processed',
    reasoningSnippetAr: 'حملة بوكسات رمضان تحقق ROAS استثنائي (4.8x)، نوصي بتحديث أوصاف الكتالوج لإطالة فترة الذروة.',
    timestamp: '2026-04-22 11:50',
  },
  {
    id: 'msg-104',
    senderAgentId: 'agent-catalog-content',
    targetAgentId: 'agent-social-media',
    action: 'repurpose_article_to_social',
    priority: 'high',
    payload: {
      articleId: 'art-home',
      articleTitle: 'أفق جديد في الطباعة الفاخرة والتصنيع الرقمي المضيء',
      targetPlatforms: ['Instagram', 'TikTok', 'LinkedIn'],
    },
    status: 'processed',
    reasoningSnippetAr: 'تم إرسال المقال الافتتاحي لوكيل السوشيال ميديا لتحويله إلى منشورات وفيديوهات مسودة للمنصات.',
    timestamp: '2026-04-22 12:04',
  },
];

const INITIAL_TASKS: AgentTask[] = [
  {
    id: 'task-501',
    agentId: 'agent-partner-network',
    titleAr: 'المصادقة على طلب سحب رصيد شريك (500,000 د.ع)',
    titleEn: 'Partner Payout Request Review (500,000 IQD)',
    riskLevel: 'red',
    priority: 'critical',
    status: 'pending_approval',
    requiresHumanApproval: true,
    inputData: {
      partnerId: 'partner-1',
      partnerName: 'أحمد الموسوي',
      requestedAmountIQD: 500000,
      method: 'zain_cash',
      walletNumber: '07801234567',
      currentAvailableBalance: 615000,
    },
    reasoningChain: [
      '1. تم تدقيق الرصيد المتاح للشريك في المحفظة: 615,000 د.ع (أكبر من المبلغ المطلوب).',
      '2. تم التحقق من رقم محفظة زين كاش: معتمد ومطابق للحساب السابق.',
      '3. لا توجد مطالبات أو نزاعات استرجاع لطلبات العملاء المرتبطة.',
      '4. نظراً لأن المبلغ يتجاوز 250,000 د.ع (مستوى خطر أحمر - Red Risk)، تم تعليق التنفيذ التلقائي لطلب موافقة المدير العام.',
    ],
    createdAt: '2026-04-22 11:30',
  },
  {
    id: 'task-502',
    agentId: 'agent-orders-customizer',
    titleAr: 'فحص ملف ومواصفات حفر لوحة أكريليك 3D LED',
    titleEn: 'Vector Artwork & Specs Check for 3D LED Sign',
    riskLevel: 'green',
    priority: 'high',
    status: 'completed',
    requiresHumanApproval: false,
    inputData: {
      productTitle: 'درع أكريليك مضيء 3D LED مخصص',
      companyName: 'مكتب د. سرمد الجراح',
      material: 'أكريليك أسود ملكي مسبوك مع تطعيم ذهبي',
      ledColor: 'Ice Cyan (أزرق جليدي)',
      dimension: '30 × 20 سم',
    },
    outputResult: {
      passedValidation: true,
      laserCuttingReadiness: '100% Ready',
      fontCompatibility: 'Perfect vector curves',
      productionNotes: 'تمت معايرة مسار الليزر وسماكة 5 ملم للأكريليك مع إدراج وصلة محول 12V ألماني.',
    },
    reasoningChain: [
      'تم فحص التباعد اللغوي وحروف الخط العربي: واضحة تماماً للحفر.',
      'تم التأكد من قدرة إضاءة الليد المختارة على إبراز التطعيم الذهبي.',
      'تم إصدار موافقة فنية آلية وتمرير المواصفات لقسم التنفيذ.',
    ],
    createdAt: '2026-04-22 11:40',
    completedAt: '2026-04-22 11:41',
  },
  {
    id: 'task-503',
    agentId: 'agent-catalog-content',
    titleAr: 'تحديث بيانات السيو والكلمات المفتاحية لعلب البيتزا',
    titleEn: 'SEO Schema & Meta Refresh for Pizza Boxes',
    riskLevel: 'green',
    priority: 'medium',
    status: 'completed',
    requiresHumanApproval: false,
    inputData: {
      productId: 'prod-pizza-box',
      currentScore: 82,
    },
    outputResult: {
      newScore: 96,
      addedKeywords: ['كرتون بيتزا بغداد', 'تغليف مطاعم العراق', 'طباعة علب أوفست فاخرة'],
      schemaStatus: 'Valid Product JSON-LD',
    },
    reasoningChain: [
      'تحليل استعلامات البحث في العراق أظهر طلباً مرتفعاً على عبارة "علب بيتزا كرتون مقوى".',
      'تم تحديث وصف المنتج وبيانات Structured Data تلقائياً.',
    ],
    createdAt: '2026-04-22 10:15',
    completedAt: '2026-04-22 10:16',
  },
  {
    id: 'task-504',
    agentId: 'agent-social-media',
    titleAr: 'صياغة مسودة حملة سوشيال ميديا لمقال «الطباعة الفاخرة والتصنيع الرقمي المضيء»',
    titleEn: 'Social Media Repurposing for Luxury Printing Article',
    riskLevel: 'green',
    priority: 'high',
    status: 'completed',
    requiresHumanApproval: false,
    inputData: {
      source: 'CMS Article: art-home',
      topic: 'دروع الأكريليك المضيئة وعلب الكرتون الصلبة',
      targetPlatforms: ['Instagram', 'TikTok', 'LinkedIn'],
    },
    outputResult: {
      status: 'مسودة جاهزة للمراجعة والاعتماد (Draft Mode)',
      repurposedPosts: [
        {
          platform: 'Instagram (Reel & Carousel)',
          hook: 'هل تساءلت يوماً كيف يتحول لوح أكريليك أسود إلى تحفة فنية مضيئة تنبض بالفخامة؟ ✨',
          body: 'في دار «نُون والقَلَم»، لا نصنع مجرد دروع تكريمية أو علب هدايا... نحن نوثق الإنجاز بهندسة الضوء وأصالة الخط العربي الملكي 🖋️✨\n\n🔹 نقش ليزري دقيق بدقة الميكرون.\n🔹 إضاءة Edge-Lit خافتة وراقية.\n🔹 كرتون مقوى 1800 غرام بتلبيس مخملي وقفل مغناطيسي.\n\nشاهد خطوات الحرفيين في بغداد من البروفة الرقمية وحتى تسليم العمل بين يديك!',
          cta: 'اضغط على الرابط في البايو لاستكشاف استوديو التصميم وطلب بروفة مجانية لمشروعك عبر موقع نون والقلم.',
          hashtags: '#نون_والقلم #طباعة_فاخرة #أكريليك_مضيء #دروع_تكريم #هدايا_شركات #بغداد #العراق_ينتج #تصميم_فاخر',
        },
        {
          platform: 'TikTok (Video Script 20s)',
          hook: '«سر اللمسة الذهبية التي تجعل كبار المدراء يبتسمون عند استلام هذا الصندوق!» 🤫🎁',
          body: '🎬 المشهد الأول (0-3 ثوانٍ): زووم سينمائي سريع على ماكينة الليزر وهي تنقش حروف "نُون والقَلَم" مع تناثر بريق الأكريليك.\n🎬 المشهد الثاني (4-10 ثوانٍ): يد الحرفي تضع التطعيم الذهبي الألماني بدقة، ثم تشغيل إضاءة الليد الزرقاء الجليدية.\n🎬 المشهد الثالث (11-18 ثانية): إغلاق العلبة الصلبة بصوت التكة المغناطيسية الفخم "Click".',
          cta: 'الرابط في الصفحة الرئيسية — صمم لوحتك الآن بلمساتك الخاصة على موقع نون والقلم واحصل على بروفة رقمية قبل الطباعة.',
          hashtags: '#تيك_توك_العراق #صناعة_محتوى #نون_والقلم #ليزر #أكريليك #هدايا_فخمة #بزنس_بغداد',
        },
        {
          platform: 'LinkedIn (B2B Executive Insight)',
          hook: 'كيف تعكس هدايا التكريم والعلب المؤسسية مكانة علامتك التجارية أمام الشركاء الاستراتيجيين؟',
          body: 'الانطباع الأول ليس مجرد بطاقة عمل؛ إنه التجربة الحسية المتكاملة التي تتركها بين أيدي شركائك.\n\nيسرنا في دار «نُون والقَلَم» للطباعة والتصميم المضيء تقديم حلول الإنتاج المؤسسي المتكامل:\n• دروع الأكريليك المضيئة 3D بتقنية التوهج الحصري.\n• علب كرتون مقوى (Rigid Boxes) مصممة لحفظ إرث المناسبات الكبرى.\n• ربط مباشر لنظام موافقات البروفات الرقمية مع فرق التسويق والمشتريات.',
          cta: 'ندعو مسؤولي المشتريات والتسويق لزيارة بوابة B2B في موقع نون والقلم لطلب عينات مجانية وتسعير الكميات.',
          hashtags: '#B2B #CorporateGifting #Branding #PackagingDesign #LuxuryPrinting #NoonWalQalam #BaghdadBusiness',
        },
      ],
    },
    reasoningChain: [
      '1. تم استقبال ملخص المقال من وكيل الكتالوج والتحرير (agent-catalog-content).',
      '2. تم استخراج نقاط القوة البصرية والحسية المناسبة لمنصات الفيديو والمنشورات الاحترافية.',
      '3. تم ضبط النبرة لتجمع بين الفخامة البغدادية والمصطلحات التسويقية الحديثة.',
      '4. تم إدراج الـ CTA المباشر الموجه لموقع نون والقلم مع الوسوم المستهدفة.',
      '5. تم حفظ المخرجات بصيغة [مسودة - Draft Mode] بانتظار الاعتماد النهائي قبل الجدولة.',
    ],
    createdAt: '2026-04-22 12:05',
    completedAt: '2026-04-22 12:06',
  },
];

const INITIAL_AUDIT_LOGS: AgentAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-04-22 11:55:02',
    agentId: 'agent-system-health',
    agentNameAr: 'وكيل الرقابة الفنية والأمان',
    actionType: 'HEALTH_CHECK_ALL_PASS',
    riskLevel: 'green',
    summaryAr: 'فحص دوري لزمن استجابة واجهات المتجر وسرعة التحميل: معدل 120ms (ممتاز ولا توجد أخطاء).',
    executionMs: 85,
  },
  {
    id: 'log-2',
    timestamp: '2026-04-22 11:50:30',
    agentId: 'agent-campaigns-growth',
    agentNameAr: 'وكيل النمو والعائد الإعلاني',
    actionType: 'ROAS_ATTRIBUTION_SYNC',
    riskLevel: 'green',
    summaryAr: 'تم احتساب العائد الإعلاني المجمع لـ 4 حملات نشطة: متوسط العائد 4.1x (توصية بالاستمرار).',
    executionMs: 140,
  },
  {
    id: 'log-3',
    timestamp: '2026-04-22 11:46:12',
    agentId: 'agent-partner-network',
    agentNameAr: 'وكيل شبكة الشركاء ومبيعات B2B',
    actionType: 'ATTRIBUTION_RESOLVED',
    riskLevel: 'green',
    summaryAr: 'تم ربط طلب جديد للشريك "أحمد الموسوي" واحتساب عمولة 42,000 د.ع تلقائياً.',
    executionMs: 95,
  },
];

export const useAutonomousAgentsStore = create<AutonomousAgentsState>()(
  persist(
    (set, get) => ({
      isGlobalKillSwitchActive: false,
      operatingMode: 'supervised',
      autoRunIntervalSec: 30,
      lastOrchestrationCycleAt: 'منذ دقيقة',

      agents: INITIAL_AGENTS,
      messagesBus: INITIAL_MESSAGES_BUS,
      tasksQueue: INITIAL_TASKS,
      auditLogs: INITIAL_AUDIT_LOGS,

      // Master Kill Switch
      setGlobalKillSwitch: (active: boolean) => {
        set((state) => ({
          isGlobalKillSwitchActive: active,
          agents: state.agents.map((a) => ({
            ...a,
            status: active ? 'paused' : 'active',
          })),
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('ar-IQ'),
              agentId: 'system',
              agentNameAr: 'نظام التحكم المركزي',
              actionType: active ? 'KILL_SWITCH_ENGAGED' : 'KILL_SWITCH_DISENGAGED',
              riskLevel: 'red',
              summaryAr: active
                ? '⚠️ تم تفعيل زر الإيقاف الطارئ الشامل (Master Kill-Switch)! تم تعليق عمل جميع الوكلاء فورياً.'
                : '✅ تم إلغاء تفعيل زر الإيقاف الطارئ واستئناف عمل الوكلاء المعتمدين.',
              executionMs: 10,
            },
            ...state.auditLogs,
          ],
        }));
      },

      setOperatingMode: (mode) => {
        set({ operatingMode: mode });
      },

      setAutoRunIntervalSec: (sec) => {
        set({ autoRunIntervalSec: sec });
      },

      toggleAgentStatus: (agentId, explicitStatus) => {
        set((state) => ({
          agents: state.agents.map((agent) => {
            if (agent.id !== agentId) return agent;
            const nextStatus: AgentStatus = explicitStatus
              ? explicitStatus
              : agent.status === 'active'
              ? 'paused'
              : 'active';
            return { ...agent, status: nextStatus };
          }),
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('ar-IQ'),
              agentId,
              agentNameAr: state.agents.find((a) => a.id === agentId)?.nameAr || agentId,
              actionType: 'AGENT_STATUS_TOGGLE',
              riskLevel: 'yellow',
              summaryAr: `تم تعديل حالة الوكيل يدوياً. الحالة الجديدة: ${explicitStatus || 'تبديل نشاط'}.`,
              executionMs: 15,
            },
            ...state.auditLogs,
          ],
        }));
      },

      updateAgentConfig: (agentId, updates) => {
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === agentId ? { ...agent, ...updates } : agent
          ),
        }));
      },

      sendInterAgentMessage: (msg) => {
        const newMsg: InterAgentMessage = {
          ...msg,
          id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: 'sent',
          timestamp: new Date().toLocaleTimeString('ar-IQ'),
        };

        set((state) => ({
          messagesBus: [newMsg, ...state.messagesBus].slice(0, 100), // keep last 100
        }));

        return newMsg;
      },

      markMessageProcessed: (messageId) => {
        set((state) => ({
          messagesBus: state.messagesBus.map((m) =>
            m.id === messageId ? { ...m, status: 'processed' } : m
          ),
        }));
      },

      createTask: (taskData) => {
        const newTask: AgentTask = {
          ...taskData,
          id: `task-${Date.now()}`,
          status: taskData.requiresHumanApproval ? 'pending_approval' : 'completed',
          reasoningChain: taskData.reasoningChain || [
            `تم استقبال المهمة وتحديد مستوى الأمان: ${taskData.riskLevel.toUpperCase()}`,
            taskData.requiresHumanApproval
              ? 'تتطلب المهمة مصادقة بشرية لضمان الامتثال وعدم تجاوز الصلاحيات.'
              : 'المهمة تقع ضمن مستوى الخطر المصرّح للوكيل، تم التنفيذ آلياً.',
          ],
          createdAt: new Date().toLocaleTimeString('ar-IQ'),
        };

        set((state) => ({
          tasksQueue: [newTask, ...state.tasksQueue],
        }));

        return newTask;
      },

      approveTask: async (taskId, reviewerName, note) => {
        let success = false;
        set((state) => {
          const task = state.tasksQueue.find((t) => t.id === taskId);
          if (!task) return state;

          success = true;
          const updatedTasks = state.tasksQueue.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: 'approved' as TaskStatus,
                  reviewedBy: reviewerName,
                  reviewedAt: new Date().toLocaleTimeString('ar-IQ'),
                  reviewNote: note,
                  completedAt: new Date().toLocaleTimeString('ar-IQ'),
                  reasoningChain: [
                    ...t.reasoningChain,
                    `✅ تمت المصادقة اليدوية من قبل: ${reviewerName} (${note || 'تم التأكيد والموافقة'})`,
                  ],
                }
              : t
          );

          const agent = state.agents.find((a) => a.id === task.agentId);
          const updatedAgents = state.agents.map((a) =>
            a.id === task.agentId
              ? { ...a, tasksCompletedCount: a.tasksCompletedCount + 1 }
              : a
          );

          const auditLog: AgentAuditLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('ar-IQ'),
            agentId: task.agentId,
            agentNameAr: agent?.nameAr || task.agentId,
            actionType: 'HUMAN_APPROVAL_EXECUTED',
            riskLevel: task.riskLevel,
            summaryAr: `تم اعتماد وتنفيذ المهمة الحرجة (${task.titleAr}) بنجاح بواسطة ${reviewerName}.`,
            details: task.inputData,
            executionMs: 120,
          };

          return {
            tasksQueue: updatedTasks,
            agents: updatedAgents,
            auditLogs: [auditLog, ...state.auditLogs],
          };
        });

        return success;
      },

      rejectTask: (taskId, reviewerName, reason) => {
        set((state) => ({
          tasksQueue: state.tasksQueue.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: 'rejected',
                  reviewedBy: reviewerName,
                  reviewedAt: new Date().toLocaleTimeString('ar-IQ'),
                  reviewNote: reason,
                  reasoningChain: [
                    ...t.reasoningChain,
                    `❌ تم رفض المهمة من قبل: ${reviewerName}. السبب: ${reason}`,
                  ],
                }
              : t
          ),
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('ar-IQ'),
              agentId: 'human',
              agentNameAr: reviewerName,
              actionType: 'TASK_REJECTED',
              riskLevel: 'yellow',
              summaryAr: `رفض مهمة معلقة للوكيل: ${reason}`,
              executionMs: 40,
            },
            ...state.auditLogs,
          ],
        }));
      },

      rollbackTask: (taskId, note) => {
        set((state) => ({
          tasksQueue: state.tasksQueue.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: 'rolled_back',
                  reviewNote: note || 'تم التراجع عن الإجراء آلياً أو يدوياً',
                  reasoningChain: [
                    ...t.reasoningChain,
                    `↩️ تم التراجع عن تأثيرات المهمة (Rollback). الملاحظة: ${note || 'إلغاء أمني'}`,
                  ],
                }
              : t
          ),
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('ar-IQ'),
              agentId: 'system',
              agentNameAr: 'مدير التراجع والأمان',
              actionType: 'TASK_ROLLED_BACK',
              riskLevel: 'yellow',
              summaryAr: `تم التراجع عن تنفيذ مهمة بنجاح (${taskId}) وإعادة الحالة السابقة.`,
              executionMs: 65,
            },
            ...state.auditLogs,
          ],
        }));
      },

      runOrchestrationCycle: async () => {
        const { isGlobalKillSwitchActive, agents } = get();
        if (isGlobalKillSwitchActive) {
          return { executedTasks: 0, messagesDispatched: 0 };
        }

        const activeAgents = agents.filter((a) => a.status === 'active' && a.isAutoExecutionEnabled);
        if (activeAgents.length === 0) {
          return { executedTasks: 0, messagesDispatched: 0 };
        }

        // Generate synthetic or real tasks cycle
        const nowStr = new Date().toLocaleTimeString('ar-IQ');

        // New inter-agent message
        const randomTarget = activeAgents[Math.floor(Math.random() * activeAgents.length)];
        const generatedMessage: InterAgentMessage = {
          id: `msg-${Date.now()}`,
          senderAgentId: 'agent-orchestrator',
          targetAgentId: randomTarget.id,
          action: 'health_and_queue_sync',
          priority: 'low',
          payload: { cycleId: `cycle-${Date.now()}`, timestamp: nowStr },
          status: 'processed',
          reasoningSnippetAr: `دورة تفقد روتينية ومزامنة طابور العمليات للوكيل: ${randomTarget.nameAr}`,
          timestamp: nowStr,
        };

        // Increment count and audit
        set((state) => ({
          lastOrchestrationCycleAt: nowStr,
          messagesBus: [generatedMessage, ...state.messagesBus].slice(0, 100),
          agents: state.agents.map((a) =>
            a.id === randomTarget.id
              ? {
                  ...a,
                  tasksCompletedCount: a.tasksCompletedCount + 1,
                  lastActiveAt: 'الآن',
                }
              : a
          ),
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: nowStr,
              agentId: 'agent-orchestrator',
              agentNameAr: 'المايسترو المنسق العام',
              actionType: 'ORCHESTRATION_TICK',
              riskLevel: 'green' as ActionRiskLevel,
              summaryAr: `تمت دورة المزامنة الذاتية بنجاح وتفقد جاهزية ${activeAgents.length} وكيل نشط.`,
              executionMs: 48,
            },
            ...state.auditLogs,
          ].slice(0, 200),
        }));

        return { executedTasks: 1, messagesDispatched: 1 };
      },

      clearAuditLogs: () => {
        set({ auditLogs: [] });
      },
    }),
    {
      name: 'noon-autonomous-agents-storage',
      version: 2,
      migrate: (persistedState: any, _version: number) => {
        if (!persistedState) return persistedState;
        if (Array.isArray(persistedState.agents)) {
          INITIAL_AGENTS.forEach((initAgent) => {
            if (!persistedState.agents.some((a: any) => a.id === initAgent.id)) {
              persistedState.agents.push(initAgent);
            }
          });
        }
        return persistedState;
      },
      partialize: (state) => ({
        isGlobalKillSwitchActive: state.isGlobalKillSwitchActive,
        operatingMode: state.operatingMode,
        autoRunIntervalSec: state.autoRunIntervalSec,
        agents: state.agents,
        tasksQueue: state.tasksQueue,
        messagesBus: state.messagesBus,
        auditLogs: state.auditLogs,
      }),
    }
  )
);
