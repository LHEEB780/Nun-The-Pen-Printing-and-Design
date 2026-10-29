import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  PenTool,
  Printer,
  PackageCheck,
  Truck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Cpu,
  Layers,
  ShieldCheck,
  Info,
  PlayCircle
} from 'lucide-react';
import { OrderRecord, ManufacturingStatus } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { COMPANY_CONTACT } from '../../data/mockData';

export interface StageDefinition {
  id: ManufacturingStatus;
  stepNumber: number;
  titleAr: string;
  titleEn: string;
  shortAr: string;
  shortEn: string;
  badgeBg: string;
  badgeText: string;
  ringColor: string;
  icon: React.ComponentType<{ className?: string }>;
  descriptionAr: string;
  descriptionEn: string;
  estimatedTimeAr: string;
  estimatedTimeEn: string;
  workshopStationAr: string;
  workshopStationEn: string;
  machinesAr: string[];
  machinesEn: string[];
  checklistAr: string[];
  checklistEn: string[];
  supervisorAr: string;
  supervisorEn: string;
}

export const MANUFACTURING_STAGES: StageDefinition[] = [
  {
    id: 'under_review',
    stepNumber: 1,
    titleAr: 'قيد المراجعة والتدقيق الفني',
    titleEn: 'Under Review & Technical Audit',
    shortAr: 'قيد المراجعة',
    shortEn: 'Under Review',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    ringColor: 'ring-amber-500',
    icon: FileSearch,
    descriptionAr: 'يقوم مهندسو الإنتاج بفحص ملف الشعار الفيكتور المرفوع، وتدقيق توافق الأبعاد والخطوط وسماكة الأكريليك والمقاسات بالمليمتر.',
    descriptionEn: 'Engineering team is auditing vector artwork, dimensions, font typography, and acrylic tolerances.',
    estimatedTimeAr: '1 - 3 ساعات عمل',
    estimatedTimeEn: '1 - 3 Business Hours',
    workshopStationAr: 'مكتب التدقيق الهندسي وفحص الفيكتور - بغداد',
    workshopStationEn: 'Vector CAD Audit Desk - Baghdad',
    machinesAr: ['برامج التصميم الفيكتوري الهندسي', 'نظام فحص دقة 300DPI'],
    machinesEn: ['Vector CAD Audit Suite', '300DPI Resolution Validator'],
    checklistAr: [
      'تدقيق دقة ووضوح الشعار والمخطوطة',
      'فحص ملاءمة المقاس والأبعاد المختارة',
      'مطابقة تفاصيل الألوان والخط الكوفي'
    ],
    checklistEn: [
      'Vector logo resolution validated',
      'Dimensions & material verified',
      'Arabic calligraphy typography inspected'
    ],
    supervisorAr: 'م. سرمد البغدادي (رئيس قسم التدقيق الفني)',
    supervisorEn: 'Eng. Sarmad Al-Baghdadi (QA Lead)'
  },
  {
    id: 'designing',
    stepNumber: 2,
    titleAr: 'قيد التصميم والخط العربي',
    titleEn: 'In Design & Calligraphy Studio',
    shortAr: 'قيد التصميم',
    shortEn: 'In Design',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    ringColor: 'ring-indigo-500',
    icon: PenTool,
    descriptionAr: 'يتولى خطاطو نُون والقَلَم رسم المخطوطة الكوفية ثلاثية الأبعاد وإعداد بروفة التصميم الرقمية وإرسالها لحسابك وعلى واتساب للاعتماد.',
    descriptionEn: 'Artisan calligraphers craft your bespoke 3D preview, dispatched to your account & WhatsApp for sign-off.',
    estimatedTimeAr: '3 - 6 ساعات عمل',
    estimatedTimeEn: '3 - 6 Business Hours',
    workshopStationAr: 'استوديو الخط العربي والتصميم الرقمي 3D',
    workshopStationEn: 'Arabic Calligraphy & 3D Studio',
    machinesAr: ['ألواح الرسم الرقمي Wacom Cintiq Pro', 'برنامج محاكاة البروفات ثلاثية الأبعاد'],
    machinesEn: ['Wacom Cintiq Pro Calligraphy Tablets', '3D Photorealistic Proofing Engine'],
    checklistAr: [
      'رسم المخطوطة بالخط العربي المختار',
      'توليد البروفة الرقمية ثلاثية الأبعاد',
      'إرسال إشعار ونسخة إلى الحساب وواتساب'
    ],
    checklistEn: [
      'Calligraphic text hand-lettered',
      'Photorealistic 3D render generated',
      'Proof dispatched to account & WhatsApp'
    ],
    supervisorAr: 'الخطاط أ. حيدر الهاشمي (كبير خطاطي الورشة)',
    supervisorEn: 'Master Calligrapher Haidar Al-Hashimi'
  },
  {
    id: 'printing',
    stepNumber: 3,
    titleAr: 'في المطبعة وخطوط الإنتاج',
    titleEn: 'In Printing & Laser Fabrication',
    shortAr: 'في المطبعة',
    shortEn: 'In Print / Laser',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    ringColor: 'ring-amber-500',
    icon: Printer,
    descriptionAr: 'بدء الطباعة بالأشعة فوق البنفسجية UV اليابانية وقص الأكريليك الكريستالي بالليزر الألماني وتلميع الحواف الماسية وتثبيت الإضاءة.',
    descriptionEn: 'High-precision UV printing, German CNC laser cutting, diamond edge flame polishing & LED module integration.',
    estimatedTimeAr: '12 - 24 ساعة عمل',
    estimatedTimeEn: '12 - 24 Business Hours',
    workshopStationAr: 'خط الإنتاج رقم 2 - ورشة المنصور / بغداد',
    workshopStationEn: 'Production Line #2 - Mansour Workshop, Baghdad',
    machinesAr: [
      'طابعة UV Mimaki JFX200 اليابانية المسطحة',
      'ماكينة قص ليزر Trotec Speedy الألمانية 130W',
      'جهاز تلميع الأكريليك بالحرارة والماس'
    ],
    machinesEn: [
      'Mimaki JFX200 UV Flatbed Printer (1440 DPI)',
      'Trotec Speedy 130W German Laser CNC',
      'Diamond Flame Edge Polisher'
    ],
    checklistAr: [
      'معايرة سماكة الأكريليك وجودة الكريستال',
      'الطباعة بالأشعة فوق البنفسجية المقاومة للخدش',
      'القص الليزري الدقيق وتلميع الحواف',
      'تركيب دارات إضاءة LED واختبار الفولتية'
    ],
    checklistEn: [
      'Acrylic thickness calibrated',
      'Scratchproof UV print applied',
      'Laser CNC precision cutting & flame polish',
      'LED circuitry soldered and voltage tested'
    ],
    supervisorAr: 'م. كرار العبيدي (مدير خطوط الليزر والطباعة)',
    supervisorEn: 'Eng. Karrar Al-Obeidi (Fab Supervisor)'
  },
  {
    id: 'ready_for_shipping',
    stepNumber: 4,
    titleAr: 'جاهز للشحن والتغليف الآمن',
    titleEn: 'Ready for Shipping & Packaging',
    shortAr: 'جاهز للشحن',
    shortEn: 'Ready to Ship',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    ringColor: 'ring-sky-500',
    icon: PackageCheck,
    descriptionAr: 'اجتياز فحص الجودة الشامل 100%، التغليف بصناديق فاخرة مبطنة بالإسفنج المقاوم للصدمات، وتسليم الشحنة لشركة التوصيل السريع.',
    descriptionEn: 'Passed 100% Quality Assurance, secured in shockproof custom foam packaging, and handed to dispatch courier.',
    estimatedTimeAr: 'تسليم بنفس اليوم أو صباح الغد',
    estimatedTimeEn: 'Same Day / Next Morning Handover',
    workshopStationAr: 'قسم الفحص النهائي والتغليف واللوجستيات',
    workshopStationEn: 'Final QA, Packing & Logistics Hub',
    machinesAr: ['ميزان الوزن الحجمي', 'جهاز التغليف الحراري الفاكيوم المانع للخدش'],
    machinesEn: ['Volumetric Precision Scale', 'Thermal Vacuum Anti-Scratch Wrapping System'],
    checklistAr: [
      'فحص الجودة النهائي واختبار ثبات الألوان',
      'إرفاق مسامير التثبيت وقاعدة التركيب والضمان',
      'التغليف داخل صندوق هدايا مبطن فاخر',
      'طباعة بوليصة الشحن وتسليمها لمندوب التوصيل'
    ],
    checklistEn: [
      '100% Final QA & color fastness inspected',
      'Mounting hardware & warranty card inserted',
      'Boxed in custom shock-absorbing gift package',
      'Courier shipping label generated and scanned'
    ],
    supervisorAr: 'أ. عمار الزبيدي (مسؤول مراقبة الجودة واللوجستيات)',
    supervisorEn: 'Ammar Al-Zubaidi (QA & Logistics Chief)'
  },
  {
    id: 'delivered',
    stepNumber: 5,
    titleAr: 'تم التسليم بنجاح للعميل',
    titleEn: 'Delivered to Customer',
    shortAr: 'تم التسليم',
    shortEn: 'Delivered',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    ringColor: 'ring-emerald-500',
    icon: CheckCircle2,
    descriptionAr: 'تم تسليم الطلب بنجاح إلى العنوان المحدد وتوقيع إشعار الاستلام. شكراً لثقتكم باستوديو نُون والقَلَم!',
    descriptionEn: 'Order successfully delivered to your registered destination. Thank you for choosing Noon & Pen!',
    estimatedTimeAr: 'مكتمل بنجاح',
    estimatedTimeEn: 'Completed',
    workshopStationAr: 'تم التسليم لدى العميل',
    workshopStationEn: 'Delivered at Destination',
    machinesAr: ['إيصال استلام إلكتروني موثق'],
    machinesEn: ['Digital Delivery Confirmation'],
    checklistAr: [
      'تأكيد استلام العميل للمنتج بحالة ممتازة',
      'تفعيل كفالة الجودة لمدة سنتين'
    ],
    checklistEn: [
      'Customer verified receipt in pristine condition',
      '2-Year craftsmanship warranty active'
    ],
    supervisorAr: 'فريق خدمة عملاء نُون والقَلَم',
    supervisorEn: 'Noon & Pen VIP Support Team'
  }
];

interface OrderManufacturingTrackerProps {
  order: OrderRecord;
  variant?: 'spotlight' | 'detailed' | 'compact';
  allowInteractiveSimulation?: boolean;
}

export const OrderManufacturingTracker: React.FC<OrderManufacturingTrackerProps> = ({
  order,
  variant = 'detailed',
  allowInteractiveSimulation = true,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { updateOrderManufacturingStatus } = useAuthStore();

  const currentStatus: ManufacturingStatus = order.manufacturingStatus || 'under_review';
  const currentStageIndex = MANUFACTURING_STAGES.findIndex((s) => s.id === currentStatus);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  // Selected stage for inspection in the interactive drawer
  const [inspectedStageId, setInspectedStageId] = useState<ManufacturingStatus>(currentStatus);
  const [showSimulationModal, setShowSimulationModal] = useState<boolean>(false);

  const inspectedStage =
    MANUFACTURING_STAGES.find((s) => s.id === inspectedStageId) ||
    MANUFACTURING_STAGES[activeIndex];

  // Helper to change stage (interactive demo for customer evaluation)
  const handleStageChange = (newStatus: ManufacturingStatus) => {
    updateOrderManufacturingStatus(order.orderId, newStatus);
    setInspectedStageId(newStatus);
  };

  const handleNextStage = () => {
    if (activeIndex < MANUFACTURING_STAGES.length - 1) {
      handleStageChange(MANUFACTURING_STAGES[activeIndex + 1].id);
    }
  };

  const handlePrevStage = () => {
    if (activeIndex > 0) {
      handleStageChange(MANUFACTURING_STAGES[activeIndex - 1].id);
    }
  };

  // WhatsApp inquiry URL with current stage context
  const whatsappStageUrl = `${COMPANY_CONTACT.whatsappUrl}?text=${encodeURIComponent(
    isAr
      ? `مرحباً استوديو نُون والقَلَم، أود الاستفسار عن تفاصيل تصنيع طلبي رقم *#${order.orderId}*.\nالمرحلة الحالية: *${inspectedStage.titleAr}*\nالمنتجات: ${order.items.map((i) => i.titleAr).join(', ')}`
      : `Hello Noon & Pen, inquiry regarding my order #${order.orderId} at stage "${inspectedStage.titleEn}".`
  )}`;

  // Progress percentage calculation
  const progressPercent = Math.min(100, Math.round(((activeIndex) / (MANUFACTURING_STAGES.length - 1)) * 100));

  // COMPACT VARIANT: for dashboard overview cards
  if (variant === 'compact') {
    return (
      <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{isAr ? 'مسار التصنيع:' : 'Fabrication Track:'}</span>
            <span className="text-amber-800 font-extrabold">{isAr ? inspectedStage.shortAr : inspectedStage.shortEn}</span>
          </span>
          <span className="text-slate-500 font-mono text-[11px]">{progressPercent}%</span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(15, progressPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{isAr ? 'المرحلة' : 'Step'} {activeIndex + 1} / {MANUFACTURING_STAGES.length}</span>
          <span className="text-emerald-700 font-medium">
            {order.estimatedDelivery || (isAr ? 'خلال 24-48 ساعة' : 'Within 24-48h')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6">
      {/* Top Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 border-b border-amber-500/20 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{isAr ? 'مسار تصنيع الطلب المباشر - ورشة بغداد' : 'Live Order Manufacturing Pipeline'}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-amber-200">
              #{order.orderId}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>{isAr ? 'المرحلة الحالية:' : 'Current Status:'}</span>
            <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4">
              {isAr ? MANUFACTURING_STAGES[activeIndex].titleAr : MANUFACTURING_STAGES[activeIndex].titleEn}
            </span>
          </h3>

          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {isAr
              ? 'تتبع خطوات التدقيق والتصميم والطباعة والقص الليزري والتغليف خطوة بخطوة مع إمكانية فحص تفاصيل كل مرحلة.'
              : 'Interactive real-time progress of verification, design proofing, UV printing, CNC laser cutting, and delivery.'}
          </p>
        </div>

        {/* Live Estimated Delivery Pill */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 shrink-0">
          <span className="text-[11px] text-amber-200 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{isAr ? 'الموعد التقديري:' : 'Est. Completion:'}</span>
          </span>
          <span className="font-extrabold text-xs sm:text-sm text-white font-mono">
            {order.estimatedDelivery || (isAr ? 'خلال 24-48 ساعة' : 'Within 24-48h')}
          </span>
        </div>
      </div>

      {/* Main Interactive Stepper Track */}
      <div className="px-5 sm:px-8 pt-2">
        {/* Progress percent banner */}
        <div className="flex items-center justify-between mb-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAr ? 'نسبة إنجاز التصنيع الكلي:' : 'Overall Manufacturing Progress:'}</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono font-black text-xs">
              {progressPercent}%
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-normal">
            {isAr ? 'انقر على أي مرحلة لعرض التفاصيل الفنية' : 'Click any milestone to inspect technical details'}
          </span>
        </div>

        {/* Responsive Stepper Container */}
        <div className="relative py-4">
          {/* Connector Line behind steps (Desktop) */}
          <div className="hidden md:block absolute top-10 start-8 end-8 h-1.5 bg-slate-100 rounded-full -z-0">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 relative z-10">
            {MANUFACTURING_STAGES.map((stage, idx) => {
              const isCompleted = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isInspected = inspectedStageId === stage.id;
              const StageIcon = stage.icon;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setInspectedStageId(stage.id)}
                  className={`p-3 sm:p-4 rounded-2xl text-start transition-all cursor-pointer relative flex flex-row md:flex-col items-center md:items-center gap-3 md:gap-2.5 ${
                    isInspected
                      ? 'bg-amber-50/90 border-2 border-amber-500 shadow-sm scale-[1.02]'
                      : isCurrent
                      ? 'bg-amber-50/70 border-2 border-amber-400 shadow-xs'
                      : isCompleted
                      ? 'bg-slate-50 border border-emerald-200 hover:border-emerald-300'
                      : 'bg-slate-50/50 border border-slate-200 opacity-60 hover:opacity-90'
                  }`}
                >
                  {/* Step Icon / Circle */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform duration-300 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-md ring-4 ring-amber-200 animate-pulse'
                        : isInspected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    ) : (
                      <StageIcon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="min-w-0 flex-1 md:text-center">
                    <div className="flex items-center md:justify-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        0{stage.stepNumber}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                          {isAr ? 'الآن' : 'Active'}
                        </span>
                      )}
                    </div>
                    <h5
                      className={`font-black text-xs md:text-xs leading-snug line-clamp-1 ${
                        isCurrent
                          ? 'text-amber-900'
                          : isCompleted
                          ? 'text-emerald-900 font-extrabold'
                          : 'text-slate-600'
                      }`}
                    >
                      {isAr ? stage.shortAr : stage.shortEn}
                    </h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isCompleted ? (isAr ? 'تم بنجاح ✓' : 'Completed') : stage.estimatedTimeAr}
                    </span>
                  </div>

                  {/* Active selection dot for inspected state */}
                  {isInspected && (
                    <div className="hidden md:block absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rotate-45" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Stage Inspection Details Drawer */}
      <div className="px-5 sm:px-8 pb-6">
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5 animate-fade-in">
          {/* Inspected Stage Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
                <inspectedStage.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                    {isAr ? `المرحلة ${inspectedStage.stepNumber} من 5` : `Step ${inspectedStage.stepNumber} of 5`}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {inspectedStage.estimatedTimeAr}
                  </span>
                </div>
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                  {isAr ? inspectedStage.titleAr : inspectedStage.titleEn}
                </h4>
              </div>
            </div>

            {/* Current status matching badge */}
            <div className="flex items-center gap-2">
              {inspectedStage.id === currentStatus ? (
                <span className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                  <span>{isAr ? 'الطلب متواجد في هذه المرحلة حالياً' : 'Order is currently at this milestone'}</span>
                </span>
              ) : MANUFACTURING_STAGES.findIndex((s) => s.id === inspectedStage.id) < activeIndex ? (
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'تم إنجاز هذه المرحلة بالكامل' : 'This milestone is completed'}</span>
                </span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-xs font-medium">
                  {isAr ? 'مرحلة لاحقة في الانتظار' : 'Upcoming milestone'}
                </span>
              )}
            </div>
          </div>

          {/* Description & Technical Workshop Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-600">
            {/* Description & Notes */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <strong className="block text-slate-900 font-bold mb-1">
                  {isAr ? 'ما يجري في هذه المرحلة داخل ورشتنا:' : 'Workshop Activity at this Stage:'}
                </strong>
                <p className="text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
                  {isAr ? inspectedStage.descriptionAr : inspectedStage.descriptionEn}
                </p>
              </div>

              {/* Order Specific Workshop Notes (if any) */}
              {order.workshopNotes && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 text-amber-900">
                  <strong className="block font-bold mb-1 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>{isAr ? 'ملاحظات فريق التصنيع الخاصة بطلبك:' : 'Artisan Workshop Notes for this Order:'}</span>
                  </strong>
                  <p className="leading-relaxed font-medium">
                    {order.workshopNotes}
                  </p>
                </div>
              )}

              {/* Quality Checklist */}
              <div>
                <strong className="block text-slate-900 font-bold mb-2">
                  {isAr ? 'قائمة معايير الجودة والتدقيق لهذه المرحلة:' : 'Quality & Precision Checklist:'}
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isAr ? inspectedStage.checklistAr : inspectedStage.checklistEn).map((check, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-medium">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment & Machine Metadata Sidebar */}
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase">
                  {isAr ? 'محطة التصنيع:' : 'Fabrication Station:'}
                </span>
                <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">
                  {isAr ? inspectedStage.workshopStationAr : inspectedStage.workshopStationEn}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase">
                  {isAr ? 'المشرف الهندسي المسؤول:' : 'Lead Supervisor:'}
                </span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? inspectedStage.supervisorAr : inspectedStage.supervisorEn}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase mb-1.5">
                  {isAr ? 'الآلات والتقنيات المستخدمة:' : 'Equipment & Technologies:'}
                </span>
                <ul className="space-y-1.5">
                  {(isAr ? inspectedStage.machinesAr : inspectedStage.machinesEn).map((m, mIdx) => (
                    <li key={mIdx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-mono">
                      <Cpu className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct WhatsApp Contact Button for this Stage */}
              <div className="pt-2 border-t border-slate-100">
                <a
                  href={whatsappStageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>{isAr ? 'استفسار واتساب عن هذه المرحلة 💬' : 'Chat on WhatsApp About Stage 💬'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Bar (Demo Mode for testing the visual tracker interactively) */}
          {allowInteractiveSimulation && (
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-amber-700" />
                <span className="font-extrabold text-amber-950">
                  {isAr ? 'تجربة تفاعلية (محاكاة تغيير مسار الطلب):' : 'Interactive Demo (Simulate Status Update):'}
                </span>
                <span className="text-amber-800/90 text-[11px]">
                  {isAr ? 'يمكنك التبديل بين المراحل لمشاهدة التغير البصري المباشر' : 'Toggle stages to preview visual changes live'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  onClick={handlePrevStage}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  <span>{isAr ? 'المرحلة السابقة' : 'Previous Step'}</span>
                </button>

                {/* Quick Stage Buttons */}
                <div className="hidden sm:flex items-center gap-1">
                  {MANUFACTURING_STAGES.map((s, sIdx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleStageChange(s.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        activeIndex === sIdx
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {sIdx + 1}. {isAr ? s.shortAr : s.shortEn}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={activeIndex === MANUFACTURING_STAGES.length - 1}
                  onClick={handleNextStage}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                >
                  <span>{isAr ? 'المرحلة التالية' : 'Next Step'}</span>
                  <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
