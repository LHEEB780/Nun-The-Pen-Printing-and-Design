import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  FileCheck2,
  Layers,
  Ruler,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  Info,
  Maximize2,
  Palette,
  ShieldCheck,
  Scissors,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export type KnowledgeGuideId = 'file-prep' | 'materials' | 'design-rules';

export interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGuideId?: KnowledgeGuideId;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  initialGuideId = 'file-prep',
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [activeGuide, setActiveGuide] = useState<KnowledgeGuideId>(initialGuideId);
  const [activeAcrylicFinish, setActiveAcrylicFinish] = useState<'matte' | 'glossy'>('matte');
  const [copiedChecklist, setCopiedChecklist] = useState(false);

  useEffect(() => {
    if (initialGuideId) {
      setActiveGuide(initialGuideId);
    }
  }, [initialGuideId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyChecklist = () => {
    const checklistText = isAr
      ? `قائمة التحقق الفنية قبل إرسال ملفات الطباعة والقص إلى نُون والقَلَم:
1. نظام الألوان: CMYK (وليس RGB) بمعيار ISO Fogra39.
2. الدقة: 300 DPI على الأقل بمقاس 1:1 بدون تكبير عشوائي.
3. الهوامش والتنظيف: 3 ملم Bleed إضافي حول أطراف التصميم.
4. منطقة الأمان: النصوص والشعارات تبعد 5 ملم على الأقل عن خط القص.
5. تحويل الخطوط: Convert all fonts to Outlines/Curves (Ctrl+Shift+O).
6. صيغة الملف: PDF/X-1a أو Vector AI/EPS مع دمج الصور.`
      : `Noon & Pen Pre-Press Technical Checklist:
1. Color Mode: CMYK (not RGB) with ISO Fogra39 profile.
2. Resolution: Minimum 300 DPI at 1:1 actual print scale.
3. Bleed: 3mm minimum bleed around all outer edges.
4. Safe Margin: Keep typography and logos at least 5mm inside cut lines.
5. Outlines: Convert all typefaces to Outlines/Curves (Ctrl+Shift+O).
6. Format: PDF/X-1a or Vector AI/EPS with embedded raster assets.`;

    navigator.clipboard.writeText(checklistText);
    setCopiedChecklist(true);
    toast.success(isAr ? 'تم نسخ قائمة التحقق الفنية بنجاح!' : 'Pre-press checklist copied to clipboard!');
    setTimeout(() => setCopiedChecklist(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 bg-gradient-to-r from-amber-50/70 via-white to-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-800 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  {isAr ? 'قاعدة المعرفة والأدلة الفنية' : 'Knowledge Base & Engineering Guides'}
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                  {isAr ? 'استوديو نُون والقَلَم' : 'Noon & Pen Atelier'}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-slate-900 mt-0.5">
                {isAr ? 'دليل إعداد التصاميم واختيار الخامات' : 'File Preparation & Material Guide'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Switcher Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-1 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => setActiveGuide('file-prep')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeGuide === 'file-prep'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{isAr ? '1. تجهيز ملفات الطباعة (CMYK & Bleed)' : '1. File Preparation (CMYK & Bleed)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuide('materials')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeGuide === 'materials'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isAr ? '2. مقارنة الخامات (أكريليك مات ولماع)' : '2. Material Differences (Matte vs Glossy)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuide('design-rules')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeGuide === 'design-rules'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>{isAr ? '3. إرشادات التصميم والدايكت' : '3. Common Design Guidelines'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          
          {/* ========================================================
              GUIDE 1: FILE PREPARATION FOR PRINT
             ======================================================== */}
          {activeGuide === 'file-prep' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Overview Banner */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-black text-amber-950 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-amber-700" />
                    <span>{isAr ? 'كيف تجهز ملفك الطباعي بجودة استوديو احترافية؟' : 'How to prepare print-ready files for zero errors?'}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'اتّباع هذه القواعد يضمن أن تخرج الألوان على أرض الواقع تماماً كما صممتها، دون مفاجآت أو بهتان أو حواف بيضاء غير مرغوبة.'
                      : 'Follow these core principles to ensure physical print reproduction matches your screen intent with precise fidelity.'}
                  </p>
                </div>

                <button
                  onClick={handleCopyChecklist}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  {copiedChecklist ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedChecklist ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ قائمة التدقيق' : 'Copy Checklist')}</span>
                </button>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Pillar 1: CMYK vs RGB */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span>{isAr ? 'نظام الألوان: CMYK مقابل RGB' : 'Color Mode: CMYK vs RGB'}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {isAr ? 'ضروري جداً' : 'Crucial'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'الشاشات تعرض الألوان بنظام الضوء المنبعث (RGB)، بينما طابعاتنا وماكينات الأوفست تستخدم خلط الأحبار الفيزيائية (Cyan, Magenta, Yellow, Key Black). احرص على تحويل وثيقتك إلى CMYK لتجنب تبهيت درجات الأزرق والأخضر الفاقعة.'
                      : 'Screens emit RGB light, whereas industrial presses mix physical inks (CMYK). Always design in CMYK (FOGRA39 profile) to prevent neon blues and greens from turning muddy in print.'}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span className="text-rose-600">RGB (شاشات فقط)</span>
                      <span className="text-emerald-700">CMYK (طباعة معتمدة)</span>
                    </div>
                    <div className="flex items-center gap-1.5 h-3 w-full rounded-md overflow-hidden">
                      <div className="h-full flex-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400" />
                      <div className="h-full w-4 bg-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Pillar 2: Resolution 300 DPI */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-sky-600" />
                      <span>{isAr ? 'دقة الصور: 300 DPI على الأقل' : 'Resolution: Minimum 300 DPI'}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {isAr ? 'بدون تشويش' : 'Sharp Print'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'صور الويب بدقة 72 DPI تبدو واضحة على شاشة الهاتف لكنها تظهر مبكسلة ومغبشة عند الطباعة. اجعل كل الصور النقطية بدقة 300 بكسل/بوصة عند مقياس 1:1 الحقيقي.'
                      : 'Web graphics at 72 DPI pixelate terribly on paper. Ensure all embedded raster images are at least 300 DPI at 100% finished size.'}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] flex items-center justify-between font-semibold">
                    <span className="text-slate-500">{isAr ? 'مطبوعات صغيرة (كروت/علب):' : 'Fine Print:'} <strong>300 - 450 DPI</strong></span>
                    <span className="text-slate-500">{isAr ? 'لوحات جدارية ضخمة:' : 'Large Signs:'} <strong>150 - 200 DPI</strong></span>
                  </div>
                </div>

                {/* Pillar 3: Bleed & Trim Margin */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Scissors className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? 'إضافة هامش تنظيف وقص (3mm Bleed)' : 'Bleed Margins (3mm)'}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {isAr ? 'يحمي الحواف' : 'Safety Edge'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'عند قص العلب الكرتونية والبطاقات بالمقص الآلي، قد يحدث تفاوت بأجزاء من المليمتر. إضافة 3 ملم فيكتور أو خلفية متمددة خارج المقاس النهائي تضمن عدم ظهور أي حافة بيضاء غير مقصودة.'
                      : 'High-speed guillotine cutters have a micro-tolerance of ~0.5mm. Extend background art 3mm beyond the trim boundary to prevent accidental white slivers.'}
                  </p>

                  {/* Bleed Visual Diagram */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-emerald-300 relative text-center">
                    <div className="text-[10px] font-bold text-emerald-800">
                      [ +3mm Bleed إضافي للخلفية ]
                    </div>
                    <div className="my-1 p-2 bg-white rounded-lg border border-slate-300 text-[11px] font-black text-slate-800">
                      ✂️ خط القص الفعلي (Trim Box)
                      <div className="mt-1 p-1.5 bg-emerald-50/70 rounded border border-emerald-200 text-[10px] text-emerald-900 font-normal">
                        منطقة الأمان (Safe Zone 5mm للنصوص والشعار)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pillar 4: Vector & Fonts Outlines */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>{isAr ? 'تحويل الخطوط إلى مسارات (Outlines)' : 'Convert Fonts to Outlines'}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Ctrl + Shift + O
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'إذا لم يكن الخط الذي صممت به مثبتاً على حواسيب ماكينات القص الليزري لدينا، سيقوم البرنامج باستبداله بخط افتراضي! حوّل كل النصوص العربية إلى منحنيات ومسارات ثابتة (Create Outlines) قبل التصدير.'
                      : 'If your custom Arabic font is not installed on our RIP servers, it will be substituted by a fallback. Always convert all typography to paths/outlines before sharing.'}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] flex items-center justify-between">
                    <span className="font-bold text-slate-700">{isAr ? 'الصيغ الموصى بها:' : 'Recommended Formats:'}</span>
                    <span className="font-mono font-bold text-amber-900">PDF/X-1a, AI (vCC), EPS, SVG</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================
              GUIDE 2: MATERIAL DIFFERENCES (MATTE VS GLOSSY)
             ======================================================== */}
          {activeGuide === 'materials' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Interactive Acrylic Finishes Comparator */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>{isAr ? 'مقارنة فيزيائية تفاعلية' : 'Interactive Finish Lab'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {isAr ? 'الأكريليك المطفي (Matte) مقابل اللامع (Glossy)' : 'Matte Frosted Acrylic vs Ultra-Gloss Cast Acrylic'}
                    </h3>
                  </div>

                  {/* Toggle Switch */}
                  <div className="inline-flex p-1 rounded-2xl bg-slate-800 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setActiveAcrylicFinish('matte')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeAcrylicFinish === 'matte'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {isAr ? 'المات المطفي (Frosted)' : 'Matte Frosted'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveAcrylicFinish('glossy')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeAcrylicFinish === 'glossy'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {isAr ? 'اللامع الكريستالي (Glossy)' : 'Ultra Glossy'}
                    </button>
                  </div>
                </div>

                {/* Dynamic Finish Card Preview */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs space-y-3">
                  {activeAcrylicFinish === 'matte' ? (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                        <span>✨ مميزات الأكريليك المات (Matte Finish):</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {isAr
                          ? 'سطح حريري ناعم مضاد لانعكاس الضوء المباشر (Anti-Glare) ومقاوم تماماً لآثار البصمات والأتربة. يمنح اللوحة فخامة ناعمة وهادئة دون إزعاج بصري.'
                          : 'Silky, diffuse satin surface that eliminates direct light glares and repels finger smudges. Ideal for high-end executive plaques and ambient desk signage.'}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200">✅ مكاتب الرؤساء والشركات</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200">✅ لوحات ترحيب الأعراس</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200">✅ إضاءة هادئة غير مشتتة</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                        <span>💎 مميزات الأكريليك اللامع الكريستالي (Glossy Finish):</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {isAr
                          ? 'نفاذية ضوئية فائقة تصل إلى 93% (أعلى من الزجاج الطبيعي). يعكس الإضاءة بأناقة براقة ويمنح الحفر الليزري عمقاً ثلاثي الأبعاد وتوهجاً نيونياً أخاذاً.'
                          : 'Exceptional 93% optical clarity surpassing ordinary glass. Produces high-contrast edge-lit refractions and mirror-like jewel reflection.'}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200">✅ لوحات LED المضيئة ثلاثية الأبعاد</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200">✅ دروع التكريم الكريستالية</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200">✅ شعارات بارزة شديدة البريق</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comprehensive Materials Matrix Table */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <Layers className="w-4 h-4 text-amber-800" />
                  <span>{isAr ? 'جدول مقارنة الخامات المعتمدة في ورشتنا:' : 'Workshop Material Specifications:'}</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden text-xs">
                  
                  {/* Row 1: Cast vs Extruded Acrylic */}
                  <div className="p-3.5 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="font-bold text-slate-900">
                      {isAr ? 'أكريليك كاست (Cast) مقابل التجاري (Extruded)' : 'Cast vs Extruded Acrylic'}
                    </span>
                    <span className="sm:col-span-2 text-slate-600 leading-relaxed">
                      {isAr
                        ? 'نحن نعتمد حصراً على كاست الأكريليك البكر (Virgin Cast) المستورد من ألمانيا وتايوان؛ لأنه لا يصفر تحت أشعة الشمس ويمنح حوافاً مصقولة ناعمة عند القص الليزري دون تشققات أو روائح محترقة.'
                        : 'We exclusively mill virgin cast PMMA. It will not yellow over time, resists UV degradation, and yields flame-polished edges without micro-crazing.'}
                    </span>
                  </div>

                  {/* Row 2: Rigid Box Greyboard */}
                  <div className="p-3.5 bg-white grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="font-bold text-slate-900">
                      {isAr ? 'الكرتون المقوى الفاخر (Rigid Greyboard)' : 'Rigid Gift Box Greyboard'}
                    </span>
                    <span className="sm:col-span-2 text-slate-600 leading-relaxed">
                      {isAr
                        ? 'سماكات صلبة تتراوح بين 1.8 ملم إلى 2.8 ملم (كثافة 1200 - 1800 غ/م²)، مكسوة بورق فني فاخر أو قماش كتان إيطالي مع قفل مغناطيسي خفي نيوديميوم (Neodymium) قوي.'
                        : 'Dense greyboard core (1.8mm to 2.8mm, 1200-1800 gsm) wrapped with soft-touch coated art sheet, fitted with concealed neodymium magnetic closures.'}
                    </span>
                  </div>

                  {/* Row 3: Hot Foil Stamping vs UV Print */}
                  <div className="p-3.5 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="font-bold text-slate-900">
                      {isAr ? 'البصمة الحرارية (Foil) مقابل الطباعة المباشرة (UV)' : 'Hot Foil Stamping vs Direct UV'}
                    </span>
                    <span className="sm:col-span-2 text-slate-600 leading-relaxed">
                      {isAr
                        ? 'البصمة الحرارية (ذهب، فضة، روز غولد بأشرطة Kurz الألمانية) تعطي بريقاً معدنياً مرآوياً حقيقياً لا يمكن محاكاته بالأحبار العادية. بينما طباعة UV ممتازة للتدرجات والوجوه والصور الملونة المعقدة.'
                        : 'Hot stamping with German Kurz foils delivers genuine specular metallic sheen. UV direct printing is ideal for multi-color gradients, intricate portraits, and CMYK color art.'}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              GUIDE 3: COMMON DESIGN GUIDELINES & DIE-LINES
             ======================================================== */}
          {activeGuide === 'design-rules' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1">
                <h3 className="text-sm font-black text-purple-950 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-purple-700" />
                  <span>{isAr ? 'قواعد الخطوط والسماكات لتجنب أخطاء القص والطباعة' : 'Line Weight & Die-line Engineering Standards'}</span>
                </h3>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  {isAr
                    ? 'الماكينات الصناعية لها حدود فيزيائية دنيا؛ الخطوط الرقيقة جداً قد تنقطع أثناء حفر الليزر أو لا تلتقط الحبر والبصمة الحرارية.'
                    : 'Milling bits and laser focal spots have physical minimum limits. Ensure your vector geometries adhere to these tolerances.'}
                </p>
              </div>

              {/* Minimum Tolerances Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-center">
                  <span className="text-xs font-bold text-slate-500">{isAr ? 'أقل سماكة للقص الليزري' : 'Min Laser Cut Width'}</span>
                  <div className="text-2xl font-black text-amber-900 font-mono">0.5 mm</div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {isAr ? 'الأجزاء الأرق من ذلك قد تذوب أو تنكسر أثناء التبريد.' : 'Thinner strokes risk thermal melting or breakage during handling.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-center">
                  <span className="text-xs font-bold text-slate-500">{isAr ? 'أقل سماكة للبصمة الحرارية' : 'Min Foil Stroke'}</span>
                  <div className="text-2xl font-black text-amber-900 font-mono">0.3 mm (0.8pt)</div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {isAr ? 'لضمان التصاق شريط الذهب المعدني بوضوح ودون تشوه.' : 'Ensures clean foil release without clogging fine loops.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-center">
                  <span className="text-xs font-bold text-slate-500">{isAr ? 'هامش الأمان الداخلي' : 'Internal Safe Margin'}</span>
                  <div className="text-2xl font-black text-emerald-800 font-mono">5.0 mm</div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {isAr ? 'المسافة المطلوبة بين النص وحافة الكرتون أو الأكريليك.' : 'Safe buffer distance from cut edge to typography.'}
                  </p>
                </div>

              </div>

              {/* Die-line Color Standards */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'معايير ألوان خطوط السكين والدايكت (Die-line Legend):' : 'Die-Line Layer Naming & Spot Colors:'}</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-pink-50/80 border border-pink-200">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-pink-500 shrink-0" />
                      <span className="font-bold text-pink-950">{isAr ? 'خط القص الخارجي (Thru-Cut):' : 'Through Cut Line:'}</span>
                    </div>
                    <span className="font-mono font-bold text-pink-900 text-[11px]">100% Magenta (Spot Color: "Cut")</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-50/80 border border-cyan-200">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 shrink-0" />
                      <span className="font-bold text-cyan-950">{isAr ? 'خط التجعيد والطي (Crease/Score):' : 'Crease & Fold Line:'}</span>
                    </div>
                    <span className="font-mono font-bold text-cyan-900 text-[11px]">100% Cyan (Spot Color: "Crease")</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 border border-amber-200">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="font-bold text-amber-950">{isAr ? 'منطقة الحفر السطحي (Laser Engrave):' : 'Surface Kiss-Cut / Engrave:'}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-900 text-[11px]">100% Yellow / Black 100%</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {isAr
                ? 'هل لديك ملف بحاجة لفحص فني مباشر؟ تواصل مع مهندس ما قبل الطباعة:'
                : 'Need a complimentary file pre-flight check? Contact our prepress engineer:'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://wa.me/9647800000000?text=مرحباً%20استوديو%20نون%20والقلم،%20أريد%20استشارة%20فنية%20بشأن%20تجهيز%20ملف%20للطباعة%20والقص."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'استشارة المهندس الفني عبر واتساب' : 'Technical WhatsApp Chat'}</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer w-full sm:w-auto"
            >
              {isAr ? 'إغلاق الدليل' : 'Close Guide'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
