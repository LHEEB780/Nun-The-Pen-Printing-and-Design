import React, { useState, useMemo } from 'react';
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  Send,
  FileText,
  ShoppingBag,
  AlertTriangle,
  Layers,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Radio,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAutonomousAgentsStore } from '../../store/useAutonomousAgentsStore';
import { useContentStore } from '../../store/useContentStore';
import { useAdminStore, getUnifiedProducts } from '../../store/useAdminStore';

interface SocialMediaAgentStudioProps {
  isAr?: boolean;
}

export interface GeneratedSocialPost {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'LinkedIn' | 'Twitter' | 'Facebook';
  platformLabelAr: string;
  platformIconColor: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string;
  targetUrl: string;
  status: 'مسودة قيد المراجعة (Draft Mode)' | 'تمت المصادقة (Approved)';
}

export const SocialMediaAgentStudio: React.FC<SocialMediaAgentStudioProps> = ({ isAr = true }) => {
  const { agents, createTask, sendInterAgentMessage } = useAutonomousAgentsStore();
  const socialAgent = agents.find((a) => a.id === 'agent-social-media');

  const { articles } = useContentStore();
  const adminProducts = useAdminStore((state) => state.adminProducts);
  const products = useMemo(() => getUnifiedProducts(adminProducts), [adminProducts]);

  // Input state
  const [sourceType, setSourceType] = useState<'article' | 'product' | 'custom'>('article');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'Instagram' | 'TikTok' | 'LinkedIn' | 'Twitter'>('all');

  // Generator & UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedDrafts, setGeneratedDrafts] = useState<GeneratedSocialPost[]>([]);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Check for out-of-scope conflict (Conflict Prevention)
  const detectAgentConflict = (text: string): string | null => {
    const lower = text.toLowerCase();
    const technicalKeywords = [
      'database',
      'sql',
      'migration',
      'postgres',
      'cloudsql',
      'bug',
      'server',
      'latency',
      'crash',
      'query',
      'code',
      'endpoint',
      'قاعدة بيانات',
      'استعلام',
      'سيرفر',
      'عطل برمجي',
      'تعديل كود',
      'تذكرة صيانة',
      'تعديل جدول',
    ];

    const supportKeywords = [
      'refund',
      'ticket',
      'complaint',
      'chargeback',
      'استرجاع اموال',
      'شكوى عميل',
      'نزاع دفع',
    ];

    if (technicalKeywords.some((k) => lower.includes(k))) {
      return isAr
        ? '⚠️ تنبيه تناغم الوكلاء: هذا المحتوى يخص الإدارة التقنية أو قواعد البيانات. وفقاً لمبادئ النظام، يحظر على وكيل السوشيال ميديا تعديل الأنظمة أو الاستعلام المباشر؛ تم توجيه المهمة لوكيل الرقابة الفنية والأمان SRE.'
        : '⚠️ Cross-Agent Harmony Guard: Technical/database tasks are out of scope. Routed to System Health Sentinel.';
    }

    if (supportKeywords.some((k) => lower.includes(k))) {
      return isAr
        ? '⚠️ تنبيه تناغم الوكلاء: هذا الطلب يخص شكاوى العملاء واسترداد الأموال المباشر؛ تم توجيهه إلى وكيل فحص الطلبات وخدمة الزبائن.'
        : '⚠️ Cross-Agent Harmony Guard: Support tickets/refunds are handled by Order Customizer Agent.';
    }

    return null;
  };

  // Perform Generation
  const handleGenerate = () => {
    let title = '';
    let description = '';
    let sourceLabel = '';

    if (sourceType === 'article') {
      const art = articles.find((a) => a.id === selectedArticleId) || articles[0];
      if (art) {
        title = isAr ? art.titleAr : art.titleEn;
        description = isAr ? `${art.subtitleAr}\n${art.summaryAr}` : `${art.subtitleEn}\n${art.summaryEn}`;
        sourceLabel = `المقال التحريري: ${art.titleAr}`;
      }
    } else if (sourceType === 'product') {
      const prod = products.find((p) => p.id === selectedProductId) || products[0];
      if (prod) {
        title = isAr ? prod.titleAr : prod.titleEn;
        description = isAr
          ? `${prod.descriptionAr} - خامات: ${prod.materials?.[0]?.labelAr || 'أكريليك ملكي'}، مقاس: ${prod.dimensions?.[0]?.labelAr || 'قياسي'}`
          : `${prod.descriptionEn} - Materials: ${prod.materials?.[0]?.labelEn || 'Luxury Acrylic'}`;
        sourceLabel = `منتج من الكتالوج: ${prod.titleAr}`;
      }
    } else {
      title = customTitle.trim() || (isAr ? 'تحديث فني في دار نون والقلم' : 'Noon & Pen Design Update');
      description = customBody.trim() || (isAr ? 'تفاصيل الإبداع والخط العربي الملكي والطباعة الفاخرة.' : 'Bespoke acrylic craft & laser engineering.');
      sourceLabel = `إدخال يدوي مخصص: ${title}`;
    }

    // Check for agent boundary conflict
    const conflict = detectAgentConflict(`${title} ${description}`);
    if (conflict) {
      setConflictWarning(conflict);
      toast.error(isAr ? 'تم رصد تعارض في مهام الوكيل!' : 'Agent conflict detected!');
      return;
    }
    setConflictWarning(null);

    setIsGenerating(true);

    setTimeout(() => {
      const posts: GeneratedSocialPost[] = [];

      // Instagram Post
      if (selectedPlatform === 'all' || selectedPlatform === 'Instagram') {
        posts.push({
          id: `post-insta-${Date.now()}`,
          platform: 'Instagram',
          platformLabelAr: 'إنستغرام (كاروسيل وبوست فاخر)',
          platformIconColor: 'text-pink-600 bg-pink-50 border-pink-200',
          hook: isAr
            ? `«بين سحر الحرف العربي وهندسة الضوء.. كيف يتحول الأكريليك إلى بصمة لا تُنسى؟» ✨`
            : `“Where Arabic Calligraphy Meets Light: The Art of Luxury Acrylic” ✨`,
          body: isAr
            ? `في دار «نُون والقَلَم»، نؤمن أن التكريم والهدايا ليست مجرد أغراض.. بل هي شهادة حيّة على الفخامة والإنجاز 🖋️🌟\n\n📌 *تفاصيل العمل المتقنة:*\n• ${title}\n• حفر ليزري نقي بدقة الألياف الألمانية\n• إضاءة Edge-Lit متوهجة تبرز عروق الخط الكوفي والديواني الملكي\n• تعبئة وتغليف في علب كرتون مقوى 1800 غرام مع قفل مغناطيسي\n\nاسحب الشاشة لمشاهدة تفاصيل البروفة الرقمية قبل وبعد التصنيع الواقعي في ورشتنا ببغداد 📸👇`
            : `At Noon & Pen, every acrylic piece is a bespoke monument of success. Handcrafted in Baghdad with German laser precision and Edge-Lit glow.\n\nSwipe to see the digital proof transformation! 📸`,
          cta: isAr
            ? '🔗 رابط المتجر واستوديو التخصيص متاح في البايو. اطلب البروفة الرقمية المباشرة لمشروعك الآن عبر موقع نون والقلم.'
            : '🔗 Link in bio to customize your bespoke piece on Noon & Pen website.',
          hashtags: isAr
            ? '#نون_والقلم #طباعة_فاخرة #أكريليك_مضيء #دروع_تكريم #هدايا_شركات #بغداد #العراق_ينتج #تصميم_فاخر #خط_عربي'
            : '#NoonWalQalam #LuxuryPrinting #AcrylicArt #Calligraphy #BaghdadCraft',
          targetUrl: 'https://noon-walqalam.com/shop',
          status: 'مسودة قيد المراجعة (Draft Mode)',
        });
      }

      // TikTok Script
      if (selectedPlatform === 'all' || selectedPlatform === 'TikTok') {
        posts.push({
          id: `post-tiktok-${Date.now()}`,
          platform: 'TikTok',
          platformLabelAr: 'تيك توك (سيناريو فيديو وخطاف بصري 20 ثانية)',
          platformIconColor: 'text-stone-900 bg-stone-100 border-stone-300',
          hook: isAr
            ? `«لا تغلف هديتك القادمة بطريقة تقليدية أبداً بعد رؤية هذا الفيديو!» 🤫🎁🔥`
            : `“Never gift conventionally again after seeing this!” 🤫🎁🔥`,
          body: isAr
            ? `🎬 *سيناريو الفيديو (Concept Flow):*\n\n⏱️ [0:00 - 0:03]: زووم سينمائي مقرب مع صوت خافت لنقش شعاع الليزر على لوح الأكريليك الأسود (ASMR حقيقي).\n⏱️ [0:04 - 0:08]: يد الحرفي تطبق البصمة الحرارية الذهبية اللامعة 600 غرام على الكرتون الصلب.\n⏱️ [0:09 - 0:14]: لحظة تشغيل الإضاءة الزرقاء الجليدية (Ice Cyan) وتوهج النص: "${title}".\n⏱️ [0:15 - 0:20]: تكة إغلاق الغطاء المغناطيسي بصوت فخم ومريح (Satisfying Magnetic Snap).`
            : `🎬 *Video Script Concept:*\n[0-3s]: Cinematic macro shot of laser cutting acrylic.\n[4-8s]: Foil stamping 600gsm stock.\n[9-14s]: Illumination glow test.\n[15-20s]: Magnetic box closing sound.`,
          cta: isAr
            ? '📲 ادخل على الرابط في الحساب الآن، صمم درعك أو علبتك بنفسك، وتصلك بروفة رقمية معتمدة على واتساب قبل بدء التصنيع!'
            : '📲 Click profile link to design yours on Noon & Pen today!',
          hashtags: isAr
            ? '#تيك_توك_العراق #نون_والقلم #حفر_ليزر #أكريليك #هدايا_فخمة #بزنس_بغداد #مشاريع_العراق #fyp #viral'
            : '#Baghdad #LaserCut #CustomGifts #Packaging #ViralTikTok',
          targetUrl: 'https://noon-walqalam.com',
          status: 'مسودة قيد المراجعة (Draft Mode)',
        });
      }

      // LinkedIn B2B
      if (selectedPlatform === 'all' || selectedPlatform === 'LinkedIn') {
        posts.push({
          id: `post-linkedin-${Date.now()}`,
          platform: 'LinkedIn',
          platformLabelAr: 'لينكد إن (محتوى B2B مؤسسي وقيادي)',
          platformIconColor: 'text-sky-700 bg-sky-50 border-sky-200',
          hook: isAr
            ? `«كيف تؤثر الهدايا المؤسسية والدروع التذكارية في ترسيخ صفقاتك الاستراتيجية الكبرى؟»`
            : `“Why Bespoke Corporate Keepsakes Solidify Strategic Partnerships”`,
          body: isAr
            ? `في عالم الأعمال الحديث، الانطباع الأول لا ينتهي عند توقيع العقود؛ بل يبدأ حين تترك بين أيدي شركائك عملاً يخلّد الشراكة بهيبة.\n\nيسرنا في دار «نُون والقَلَم» للطباعة الفاخرة والتصنيع الرقمي المضيء مشاركتكم تفاصيل هذا المسار:\n📌 *${title}*\n\n💼 *حلولنا لقطاع الأعمال والشركات في العراق:*\n1. دروع أكريليك 3D ثلاثية الأبعاد بإضاءة LED خافتة صامتة للمكاتب القيادية.\n2. علب كرتون مقوى (Rigid Boxes) ببطانات مخملية محفورة ليزرياً بدقة 100%.\n3. كروت أعمال قطنية إيطالية 600 غرام مع حواف مذهبة وبصمة حرارية.\n4. تدقيق فني فوري وإصدار بروفات رقمية خلال ساعتين لفرق المشتريات والتسويق.`
            : `In modern executive business, first impressions endure when preserved in bespoke luxury craftsmanship.\n\nNoon & Pen provides B2B corporate awards, rigid boxes, and illuminated signage across Iraq.`,
          cta: isAr
            ? '📌 ندعو مدراء التسويق والمشتريات لزيارة بوابة B2B في موقع دار نون والقلم لتحميل الكتالوج المؤسسي وطلب عينات معتمدة.'
            : '📌 Explore our B2B Corporate Gateway on the Noon & Pen website to request bulk pricing and samples.',
          hashtags: isAr
            ? '#B2B #CorporateGifting #Branding #LuxuryPrinting #NoonWalQalam #BaghdadBusiness #ريادة_الأعمال #العراق #هدايا_شركات'
            : '#B2B #CorporateGifts #ExecutiveBranding #Baghdad #NoonWalQalam',
          targetUrl: 'https://noon-walqalam.com/?portal=partner',
          status: 'مسودة قيد المراجعة (Draft Mode)',
        });
      }

      // Twitter / X
      if (selectedPlatform === 'all' || selectedPlatform === 'Twitter') {
        posts.push({
          id: `post-twitter-${Date.now()}`,
          platform: 'Twitter',
          platformLabelAr: 'منصة X (ثريد وخطاف مركز)',
          platformIconColor: 'text-stone-800 bg-stone-50 border-stone-300',
          hook: isAr
            ? `🧵 ثريد: ما الفرق بين الطباعة التجارية العادية وصناعة التحف المضيئة في «نُون والقَلَم»؟ 1/4`
            : `🧵 Thread: Crafting bespoke light & luxury calligraphy at Noon & Pen. 1/4`,
          body: isAr
            ? `الكثير يسأل: ما الذي يجعل منتج «${title}» يدوم لسنوات دون أن يفقد بريقه؟\n\n1. لا نستخدم لصقاً سطحياً؛ نستخدم حفر ليزر غائر بدقة 0.05 ملم.\n2. إضاءة LED مدمجة تستهلك 5 واط فقط مع محول ألماني آمن.\n3. اختيار الخطوط يتم بإشراف خطاطين محترفين (كوفي، ديواني، رقعة).\n\nالجودة ليست صدفة؛ إنها هندسة مستمرة في بغداد.`
            : `1. True fiber laser engraving, not surface print.\n2. Low-draw 5W LED with German power circuits.\n3. Supervised by master Arabic calligraphers.`,
          cta: isAr
            ? 'تفضل بزيارة موقعنا الرسمي وشاهد آراء مئات العملاء مع خيار التخصيص الفوري.'
            : 'Explore real reviews and customize directly on Noon & Pen website.',
          hashtags: isAr ? '#نون_والقلم #طباعة #العراق #بغداد' : '#NoonWalQalam #Design #Baghdad',
          targetUrl: 'https://noon-walqalam.com',
          status: 'مسودة قيد المراجعة (Draft Mode)',
        });
      }

      setGeneratedDrafts(posts);
      setIsGenerating(false);

      // Create a background task in the autonomous agents store to log execution
      createTask({
        agentId: 'agent-social-media',
        titleAr: `صياغة مسودة سوشيال ميديا لـ (${title})`,
        titleEn: `Social Media Repurposing: ${title}`,
        riskLevel: 'green',
        priority: 'medium',
        requiresHumanApproval: false,
        inputData: { sourceLabel, selectedPlatform, title },
        outputResult: { draftsCount: posts.length, status: 'Draft Mode' },
      });

      toast.success(
        isAr
          ? `تم توليد ${posts.length} مسودة منشورات اجتماعية متوافقة مع الهوية بنجاح!`
          : `Generated ${posts.length} social media drafts!`
      );
    }, 750);
  };

  // Copy helper
  const handleCopy = (post: GeneratedSocialPost, onlyHashtags = false) => {
    const textToCopy = onlyHashtags
      ? post.hashtags
      : `[${post.status}]\n` +
        `منصة النشر: ${post.platform}\n\n` +
        `الخطاف / العنوان:\n${post.hook}\n\n` +
        `النص التفاعلي:\n${post.body}\n\n` +
        `الدعوة لاتخاذ إجراء (CTA):\n${post.cta}\n\n` +
        `الوسوم:\n${post.hashtags}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(post.id);
    toast.success(isAr ? 'تم نسخ المحتوى للحافظة!' : 'Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Approve & Push to Agent-to-Agent Bus
  const handleSendToBus = (post: GeneratedSocialPost) => {
    sendInterAgentMessage({
      senderAgentId: 'agent-social-media',
      targetAgentId: 'agent-orchestrator',
      action: 'social_draft_approved_for_scheduling',
      priority: 'medium',
      payload: {
        platform: post.platform,
        hook: post.hook,
        hashtags: post.hashtags,
        targetUrl: post.targetUrl,
      },
      reasoningSnippetAr: `تمت مراجعة واعتماد مسودة منشور ${post.platform}، جاهزة للجدولة التسويقية.`,
    });

    toast.success(isAr ? 'تم تمرير المسودة المعتمدة للمايسترو عبر ناقل A2A' : 'Draft dispatched to Orchestrator');
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Agent Identity & Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950 via-stone-900 to-amber-950 text-white border border-pink-900/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center shrink-0 shadow-inner">
              <Share2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-500/30 text-pink-200 border border-pink-400/30">
                  {isAr ? 'وكيل متخصص مستقل' : 'Autonomous Specialist Agent'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isAr ? 'نشط 100%' : 'Active'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-stone-300 bg-white/10">
                  ID: agent-social-media
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                {isAr
                  ? 'وكيل إدارة السوشيال ميديا وصناعة المحتوى (Social Media Agent)'
                  : 'Social Media Management & Content Repurposing Agent'}
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                {isAr
                  ? 'يتولى هذا الوكيل تلقائياً تحويل المقالات التحريرية، وتحديثات الكتالوج، وإشعارات الحفر والتصنيع إلى منشورات وسيناريوهات فيديو مخصصة لمنصات التواصل (تيك توك، إنستغرام، لينكد إن) بنبرة فخامة بغدادية أصيلة ودون المساس بقواعد البيانات أو المهام البرمجية.'
                  : 'Repurposes editorial articles, products, and proofs into engaging platform-native drafts.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-stone-300">
              <span className="text-stone-400 me-1">{isAr ? 'وضع الإخراج:' : 'Mode:'}</span>
              <span className="font-bold text-amber-300 font-mono">مسودات معتمدة (Draft Mode)</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-stone-300">
              <span className="text-stone-400 me-1">{isAr ? 'المهام المنجزة:' : 'Completed:'}</span>
              <span className="font-bold text-emerald-400 font-mono">{socialAgent?.tasksCompletedCount || 182}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boundary & Conflict Warning if detected */}
      {conflictWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs leading-relaxed animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              {isAr ? 'مبدأ تناغم الوكلاء وفصل الصلاحيات (Cross-Agent Harmony):' : 'Agent Boundary Guard:'}
            </span>
            <p>{conflictWarning}</p>
          </div>
        </div>
      )}

      {/* Source Selection & Configuration Panel */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>{isAr ? 'مدخلات الوكيل ومصدر المحتوى المراد تدويره' : 'Source Content & Repurposing Input'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isAr
              ? 'اختر مقالاً تحريرياً أو منتجاً من الكتالوج أو اكتب فكرة سريعة ليقوم الوكيل بصياغة الأصول الاجتماعية.'
              : 'Choose an editorial article or catalog product to repurpose.'}
          </p>
        </div>

        {/* Source Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3 flex-wrap">
          <button
            type="button"
            onClick={() => setSourceType('article')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              sourceType === 'article'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isAr ? 'مقالات دار نون والقلم (CMS Articles)' : 'CMS Articles'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
              {articles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType('product')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              sourceType === 'product'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAr ? 'كتالوج المنتجات والتحف (Products Catalog)' : 'Products Catalog'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              sourceType === 'custom'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAr ? 'إدخال مخصص / مسودة حرة' : 'Custom Prompt / Notes'}</span>
          </button>
        </div>

        {/* Source Inputs Form */}
        <div className="space-y-4">
          {sourceType === 'article' && (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                {isAr ? 'اختر المقال المستهدف لإعادة التدوير التسويقي:' : 'Select Target CMS Article:'}
              </label>
              <select
                value={selectedArticleId}
                onChange={(e) => setSelectedArticleId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium bg-stone-50/50 text-stone-900 focus:bg-white focus:border-pink-500 outline-none transition"
              >
                {articles.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.titleAr} ({art.categoryAr})
                  </option>
                ))}
              </select>
            </div>
          )}

          {sourceType === 'product' && (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                {isAr ? 'اختر المنتج من الكتالوج:' : 'Select Catalog Product:'}
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium bg-stone-50/50 text-stone-900 focus:bg-white focus:border-pink-500 outline-none transition"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titleAr} — {p.categoryLabelAr} ({p.basePrice.toLocaleString()} د.ع)
                  </option>
                ))}
              </select>
            </div>
          )}

          {sourceType === 'custom' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  {isAr ? 'عنوان الموضوع أو الفكرة الرئيسية:' : 'Topic Title:'}
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: إطلاق خدمة الحفر الليزري ثلاثي الأبعاد بألوان Edge-Lit الحصرية' : 'e.g. 3D Laser Sign Launch'}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium bg-white text-stone-900 focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  {isAr ? 'ملاحظات أو مسودة المقال الخام:' : 'Raw Content / Notes:'}
                </label>
                <textarea
                  rows={3}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  placeholder={isAr ? 'اكتب أو الصق النص الخام هنا ليقوم الوكيل بتحليله وصياغة الخطافات والـ CTA...' : 'Paste raw notes...'}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium bg-white text-stone-900 focus:border-pink-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Platform filter */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              {isAr ? 'المنصة المستهدفة لصياغة المنشورات:' : 'Target Platform:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'all', labelAr: 'جميع المنصات (Omni)', labelEn: 'All' },
                { id: 'Instagram', labelAr: 'إنستغرام (Instagram)', labelEn: 'Instagram' },
                { id: 'TikTok', labelAr: 'تيك توك (TikTok)', labelEn: 'TikTok' },
                { id: 'LinkedIn', labelAr: 'لينكد إن (LinkedIn)', labelEn: 'LinkedIn' },
                { id: 'Twitter', labelAr: 'منصة إكس (X / Twitter)', labelEn: 'X' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                    selectedPlatform === p.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {isAr ? p.labelAr : p.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Execution Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-pink-700 to-rose-700 hover:from-pink-700 hover:to-rose-800 text-white font-extrabold text-xs shadow-md shadow-pink-600/20 active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'الوكيل يحلل المحتوى ويصيغ الخطافات...' : 'Analyzing & Generating...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-pink-200" />
                  <span>{isAr ? 'توليد مسودات السوشيال ميديا الذكية' : 'Generate Social Media Drafts'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Drafts List */}
      {generatedDrafts.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              <h3 className="font-extrabold text-stone-900 text-sm">
                {isAr
                  ? `المسودات المقترحة للاعتماد والنشر (${generatedDrafts.length})`
                  : `Proposed Drafts for Review (${generatedDrafts.length})`}
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
              {isAr ? 'وضع المسودة: Draft Mode' : 'Draft Mode'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {generatedDrafts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs hover:border-pink-300 transition space-y-4"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${post.platformIconColor}`}>
                      {post.platformLabelAr}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {post.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(post, false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition cursor-pointer"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>{isAr ? 'نسخ المنشور كاملاً' : 'Copy Post'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendToBus(post)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-pink-300" />
                      <span>{isAr ? 'اعتماد وإرسال للمايسترو (A2A Bus)' : 'Dispatch to Bus'}</span>
                    </button>
                  </div>
                </div>

                {/* Structured Sections */}
                <div className="space-y-3.5 text-xs">
                  {/* Hook / Headline */}
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <span className="text-[10px] font-black text-pink-700 uppercase tracking-wider block">
                      📌 {isAr ? 'الخطاف / العنوان الجذاب (Hook / Headline):' : 'Hook / Headline:'}
                    </span>
                    <p className="font-extrabold text-stone-900 text-sm leading-snug">{post.hook}</p>
                  </div>

                  {/* Body / Caption */}
                  <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-100 space-y-1.5">
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider block">
                      📝 {isAr ? 'النص والوصف التفاعلي (Body / Caption):' : 'Body / Caption:'}
                    </span>
                    <p className="text-stone-800 whitespace-pre-line leading-relaxed font-sans">{post.body}</p>
                  </div>

                  {/* Call to Action (CTA) */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                      🎯 {isAr ? 'الدعوة لاتخاذ إجراء للعودة لموقع نون والقلم (CTA):' : 'Call to Action (CTA):'}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-amber-950">{post.cta}</p>
                      <a
                        href={post.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 underline shrink-0"
                      >
                        <span>{isAr ? 'معاينة الرابط' : 'View Link'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-black text-stone-500 block">
                        🏷️ {isAr ? 'الوسوم المستهدفة (Hashtags):' : 'Hashtags:'}
                      </span>
                      <p className="font-mono text-pink-700 text-[11px] truncate">{post.hashtags}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(post, true)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-[10px] font-bold text-stone-700 shrink-0 cursor-pointer"
                    >
                      {isAr ? 'نسخ الوسوم' : 'Copy Tags'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
