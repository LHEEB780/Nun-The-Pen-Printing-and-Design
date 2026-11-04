import React, { useState } from 'react';
import {
  Award, Search, Filter, BookOpen, Clock, Eye, Share2, Bookmark, Check,
  Copy, MessageSquare, Flame, Lightbulb, Heart, ThumbsUp, Send, Reply,
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Printer, ArrowRight,
  ExternalLink, ChevronRight, X, Mail, Smartphone, Plus, Trash2, Image as ImageIcon
} from 'lucide-react';
import { 
  useAcademyStore, 
  ReactionType, 
  AcademyArticle, 
  AcademyComment 
} from '../../store/useAcademyStore';
import { PartnerItem, PARTNER_RANKS_CONFIG } from '../../store/useAffiliateStore';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.19 8.19 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.37 1 2.54c.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
  </svg>
);

const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XPlatformIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MessengerIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.12 7.19V22l3.01-1.65c1.2.33 2.5.52 3.87.52 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.09 13.06l-2.72-2.9-5.3 2.9 5.84-6.2 2.76 2.9 5.25-2.9-5.83 6.2z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74V9.92H5.06v8.58z" />
  </svg>
);

interface PartnerAcademySocialProps {
  activePartner: PartnerItem;
  isAr?: boolean;
}

const CATEGORIES = [
  { id: 'all', labelAr: 'كافة الأقسام والمقالات', labelEn: 'All Categories' },
  { id: 'restaurants_cafes', labelAr: 'المطاعم والكافيهات ☕🍕', labelEn: 'Restaurants & Cafes' },
  { id: 'medical_clinics', labelAr: 'المشافي والعيادات الطبية 🩺', labelEn: 'Clinics & Hospitals' },
  { id: 'corporate_vip', labelAr: 'الشركات والمكاتب التنفيذية VIP 💼', labelEn: 'Corporate & VIP' },
  { id: 'objection_handling', labelAr: 'الرد على الاعتراضات وإغلاق الصفقات 🛡️', labelEn: 'Objection Handling' },
  { id: 'quality_secrets', labelAr: 'أسرار الخامات والطباعة الفاخرة 🔍', labelEn: 'Material Quality' },
];

const REACTION_CONFIG: Record<
  ReactionType, 
  { labelAr: string; emoji: string; colorClass: string; textColor: string }
> = {
  like: { labelAr: 'أعجبني', emoji: '👍', colorClass: 'bg-blue-50 text-blue-600 border-blue-200', textColor: 'text-blue-600' },
  love: { labelAr: 'أحببته', emoji: '❤️', colorClass: 'bg-rose-50 text-rose-600 border-rose-200', textColor: 'text-rose-600' },
  insight: { labelAr: 'فكرة ملهمة', emoji: '💡', colorClass: 'bg-amber-50 text-amber-600 border-amber-200', textColor: 'text-amber-600' },
  fire: { labelAr: 'فعال وقوي', emoji: '🔥', colorClass: 'bg-orange-50 text-orange-600 border-orange-200', textColor: 'text-orange-600' },
  clap: { labelAr: 'شكراً وتصفيق', emoji: '👏', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-200', textColor: 'text-emerald-600' },
};

export const PartnerAcademySocial: React.FC<PartnerAcademySocialProps> = ({
  activePartner,
  isAr = true,
}) => {
  const {
    articles,
    savedArticleIds,
    selectedCategoryId,
    searchQuery,
    difficultyFilter,
    sortBy,
    setSelectedCategoryId,
    setSearchQuery,
    setDifficultyFilter,
    setSortBy,
    toggleSaveArticle,
    toggleReaction,
    addComment,
    toggleCommentLike,
    addReply,
    toggleReplyLike,
    incrementViewCount,
    shareArticle,
    addArticle,
    deleteArticle,
    resetToDefaults,
  } = useAcademyStore();

  // Full-article modal state
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);
  const [activeReactionPickerId, setActiveReactionPickerId] = useState<string | null>(null);

  // App Sharing Modal state
  const [sharingArticle, setSharingArticle] = useState<AcademyArticle | null>(null);
  const [copiedModalLink, setCopiedModalLink] = useState(false);

  // Quick comment box toggle per article in card feed
  const [openCommentFeedId, setOpenCommentFeedId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);

  // Create article modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'restaurants_cafes' | 'medical_clinics' | 'corporate_vip' | 'objection_handling' | 'quality_secrets'>('restaurants_cafes');
  const [newDifficulty, setNewDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [newReadingTime, setNewReadingTime] = useState(4);
  const [newSummary, setNewSummary] = useState('');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80');
  const [newHeroBadge, setNewHeroBadge] = useState('جديد في الأكاديمية 💡');
  const [newPitchScript, setNewPitchScript] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('المدخل الذكي لإغلاق الصفقة');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newObjection, setNewObjection] = useState('');
  const [newObjectionScript, setNewObjectionScript] = useState('');

  // Active full article
  const currentModalArticle = articles.find((a) => a.id === selectedArticleId);

  // Filtered and sorted articles
  const filteredArticles = articles.filter((art) => {
    // Category match
    if (selectedCategoryId !== 'all' && art.category !== selectedCategoryId) {
      return false;
    }
    // Difficulty match
    if (difficultyFilter !== 'all' && art.difficulty !== difficultyFilter) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.titleAr.toLowerCase().includes(q) || art.titleEn.toLowerCase().includes(q);
      const matchSummary = art.summaryAr.toLowerCase().includes(q);
      const matchPitch = art.wordForWordPitchScript.toLowerCase().includes(q);
      const matchObjections = art.objectionsHandled.some(
        (o) => o.objection.toLowerCase().includes(q) || o.bestScriptAr.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchSummary && !matchPitch && !matchObjections) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') {
      const totalReactionsA = Object.values(a.reactions).reduce((sum, val) => sum + val, 0);
      const totalReactionsB = Object.values(b.reactions).reduce((sum, val) => sum + val, 0);
      return totalReactionsB - totalReactionsA;
    }
    if (sortBy === 'comments') {
      return b.comments.length - a.comments.length;
    }
    if (sortBy === 'latest') {
      return b.id.localeCompare(a.id);
    }
    // default 'featured'
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  // Handle open full article reader
  const handleOpenArticle = (art: AcademyArticle) => {
    incrementViewCount(art.id);
    setSelectedArticleId(art.id);
  };

  // Handle copy pitch script
  const handleCopyPitch = (script: string, id: string) => {
    navigator.clipboard.writeText(script);
    setCopiedPitchId(id);
    setTimeout(() => setCopiedPitchId(null), 2200);
  };

  // Generate direct share link including partner's referral code
  const getShareUrl = (articleId: string) => {
    return `${window.location.origin}${window.location.pathname}?tab=academy&art=${articleId}&ref=${activePartner.referralCode}`;
  };

  // Open the share sheet with all applications + copy button
  const handleOpenShare = (art: AcademyArticle) => {
    shareArticle(art.id);
    setSharingArticle(art);
    setCopiedModalLink(false);
  };

  // Trigger native system share drawer (shows all apps on Android/iOS)
  const handleNativeDeviceShare = async (art: AcademyArticle) => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        const url = getShareUrl(art.id);
        await navigator.share({
          title: art.titleAr,
          text: `${art.titleAr}\n${art.summaryAr}\n`,
          url: url,
        });
      } catch (err) {
        console.log('Native share cancelled or closed:', err);
      }
    }
  };

  // Copy share URL with visual feedback
  const handleCopyShareUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedModalLink(true);
    setTimeout(() => setCopiedModalLink(false), 2500);
  };

  // Submit comment
  const handleSendComment = (articleId: string) => {
    const text = commentInputs[articleId] || '';
    if (!text.trim()) return;

    const rankCfg = PARTNER_RANKS_CONFIG[activePartner.rank];
    addComment(articleId, {
      authorId: activePartner.id,
      authorName: activePartner.fullName,
      authorRank: isAr ? rankCfg.badgeAr : rankCfg.badgeEn,
      authorCity: activePartner.city,
      text: text.trim(),
    });

    setCommentInputs((prev) => ({ ...prev, [articleId]: '' }));
    setOpenCommentFeedId(articleId);
  };

  // Submit reply
  const handleSendReply = (articleId: string, commentId: string) => {
    const text = replyInputs[commentId] || '';
    if (!text.trim()) return;

    const rankCfg = PARTNER_RANKS_CONFIG[activePartner.rank];
    addReply(articleId, commentId, {
      authorName: activePartner.fullName,
      authorRank: isAr ? rankCfg.badgeAr : rankCfg.badgeEn,
      text: text.trim(),
    });

  };

  // Preset cover images for quick selection
  const PRESET_COVERS = [
    { labelAr: 'مطبوعات ورقية وكرتونية', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
    { labelAr: 'مطاعم وقوائم طعام فاخرة', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
    { labelAr: 'عيادات ومراكز طبية', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80' },
    { labelAr: 'دروع خشبية وأكريليك وليزر', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' },
    { labelAr: 'شركات ومكاتب VIP', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
  ];

  // Publish new article handler
  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === newCategory);
    const difficultyLabels = {
      beginner: isAr ? 'أساسي (مبتدئ)' : 'Beginner',
      intermediate: isAr ? 'متوسط (زيارات ميدانية)' : 'Intermediate',
      advanced: isAr ? 'متقدم (صفقات B2B كبرى)' : 'Advanced Deals',
    };

    addArticle({
      titleAr: newTitle.trim(),
      titleEn: newTitle.trim(),
      slug: `custom-guide-${Date.now()}`,
      category: newCategory,
      categoryLabelAr: catObj ? catObj.labelAr.replace(/[^\u0600-\u06FF\s&]/g, '').trim() : 'دليل ميداني',
      difficulty: newDifficulty,
      difficultyLabelAr: difficultyLabels[newDifficulty],
      readingTimeMinutes: Number(newReadingTime) || 4,
      author: {
        name: activePartner.fullName || 'شريك استوديو نون والقلم',
        role: `${activePartner.city} • مستشار تطوير مبيعات`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        experienceYears: 4,
      },
      summaryAr: newSummary.trim(),
      coverImage: newCoverImage || PRESET_COVERS[0].url,
      heroBadgeAr: newHeroBadge || 'دليل تدريبي جديد 💡',
      sections: [
        {
          title: newSectionTitle || (isAr ? 'خطة الإقناع الميداني ومزايا المنتج' : 'Field Persuasion Strategy'),
          content: newSectionContent.trim() || newSummary.trim(),
          bulletPoints: [
            isAr ? 'التركيز على القيمة الإجمالية وتوفير تكاليف الاستبدال للمشتري.' : 'Focus on value and long-term durability.',
            isAr ? 'تقديم عينة واقعية ملموسة باليد لإبهار العميل فوراً.' : 'Present tangible sample for immediate impact.',
            isAr ? 'ضمان التسليم السريع وجودة الطباعة من استوديو نون والقلم.' : 'Guarantee fast turnaround and highest printing standards.',
          ],
        },
      ],
      wordForWordPitchScript:
        newPitchScript.trim() ||
        `«مرحباً أستاذ، أنا ${activePartner.fullName} من استوديو نون والقلم ببغداد. أحضرت لك نموذجاً حصرياً ومميزاً يناسب نشاطكم الراقي لرفع مبيعاتكم وترسيخ علامتكم التجارية...»`,
      objectionsHandled: newObjection.trim()
        ? [
            {
              objection: newObjection.trim(),
              clientMindset: isAr
                ? 'العميل يقارن بالسعر الظاهري للخيارات الرخيصة دون حساب العمر التشغيلي وهيبة البراند.'
                : 'Client compares price without considering longevity.',
              bestScriptAr:
                newObjectionScript.trim() ||
                (isAr
                  ? 'بالتأكيد أستاذنا، ولكن الفارق أن خاماتنا تعيش لسنوات دون تلف، مما يوفر عليك تكلفة الاستبدال المتكرر ويحمي سمعة المكان.'
                  : 'Certainly, but our premium build lasts years without wearing out.'),
              avoidSayingAr: isAr ? '«خاماتنا أفضل وخامات غيرنا رديئة»' : 'Never badmouth competitors directly',
            },
          ]
        : [],
    });

    setIsCreateModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewSummary('');
    setNewPitchScript('');
    setNewSectionContent('');
    setNewObjection('');
    setNewObjectionScript('');
  };

  // Helper to calculate total reactions count
  const getTotalReactions = (reactions: Record<ReactionType, number>) => {
    return Object.values(reactions).reduce((acc, curr) => acc + curr, 0);
  };

  // Render top 3 reaction emojis
  const renderTopReactionEmojis = (reactions: Record<ReactionType, number>) => {
    const sorted = (Object.entries(reactions) as [ReactionType, number][])
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (sorted.length === 0) return null;

    return (
      <div className="flex items-center -space-x-1 rtl:space-x-reverse ml-1.5">
        {sorted.map(([type]) => (
          <span 
            key={type} 
            className="w-5 h-5 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-xs leading-none"
            title={REACTION_CONFIG[type].labelAr}
          >
            {REACTION_CONFIG[type].emoji}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" dir={isAr ? 'rtl' : 'ltr'}>
      {/* ========================================================= */}
      {/* 1. HERO HEADER: Community Knowledge Hub */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>{isAr ? 'أكاديمية نون والقلم للمبيعات والإقناع الميداني' : 'Noon & Pen Sales Academy'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              {isAr ? 'أدلة إقناع الشركات ومجتمع خبرات الشركاء' : 'B2B Field Pitch Guides & Partner Community'}
            </h1>
            
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {isAr 
                ? 'مقالات متخصصة وسيناريوهات محادثة كلمة بكلمة، وبنك التعامل مع الاعتراضات. تفاعل مع زملائك، شارك تجاربك الميدانية، واطرح أسئلتك على كبار مسؤولي المبيعات.'
                : 'Word-for-word scripts, objection counters, and live Facebook-style partner discussions.'}
            </p>
          </div>

          {/* Quick Partner Status Badge */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-lg font-serif">
              {activePartner.fullName.charAt(0)}
            </div>
            <div>
              <div className="text-xs text-stone-400">{isAr ? 'مشارك باسم:' : 'Posting as:'}</div>
              <div className="text-sm font-bold text-white">{activePartner.fullName}</div>
              <div className="text-[11px] text-amber-400/90 font-medium mt-0.5">
                {activePartner.city} • <span className="font-mono">{activePartner.employeeId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CATEGORY TABS & SEARCH & FILTERS */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-4">
        {/* Horizontal Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count = cat.id === 'all' 
              ? articles.length 
              : articles.filter((a) => a.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2.5 rounded-2xl font-medium transition flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-xs ring-2 ring-amber-600/20'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-amber-700/80 text-white' : 'bg-stone-200/70 text-stone-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar + Sub Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-stone-100">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute top-3 rtl:right-3.5 ltr:left-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في المقالات، سيناريوهات الإقناع، أو الرد على الاعتراضات...' : 'Search articles, pitch scripts, objections...'}
              className="w-full py-2.5 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 rounded-xl border border-stone-200 text-stone-900 text-xs sm:text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none bg-stone-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-3 rtl:left-3 ltr:right-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:border-amber-500 outline-none w-full sm:w-auto"
            >
              <option value="all">{isAr ? 'كافة المستويات' : 'All Levels'}</option>
              <option value="beginner">{isAr ? 'أساسي (مبتدئ)' : 'Beginner'}</option>
              <option value="intermediate">{isAr ? 'متوسط (زيارات ميدانية)' : 'Intermediate'}</option>
              <option value="advanced">{isAr ? 'متقدم (صفقات B2B كبرى)' : 'Advanced Deals'}</option>
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:border-amber-500 outline-none w-full sm:w-auto"
            >
              <option value="featured">{isAr ? 'المقالات المميزة أولاً' : 'Featured First'}</option>
              <option value="popular">{isAr ? 'الأكثر تفاعلاً (Facebook)' : 'Most Reacted'}</option>
              <option value="comments">{isAr ? 'الأكثر نقاشاً وتعليقاً' : 'Most Commented'}</option>
              <option value="latest">{isAr ? 'الأحدث نشراً' : 'Latest Added'}</option>
            </select>

            {/* New Guide Action Button */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition shrink-0 w-full sm:w-auto"
              title={isAr ? 'نشر مقالة أو دليل جديد في الأكاديمية' : 'Publish new guide'}
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'نشر دليل جديد' : 'New Guide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ARTICLES FEED: Responsive Grid Layout Cards */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-stone-200">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 mb-1">
              {isAr ? 'لا توجد مقالات مطابقة لبحثك' : 'No articles match your criteria'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {isAr ? 'جرب تغيير عبارة البحث أو اختيار قسم آخر من شريط التصنيفات أعلاه.' : 'Try adjusting your search query or filters.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
                setDifficultyFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition"
            >
              {isAr ? 'إعادة ضبط كافة الفلاتر' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isSaved = savedArticleIds.includes(article.id);
            const totalReactions = getTotalReactions(article.reactions);
            const currentReactionCfg = article.userReaction ? REACTION_CONFIG[article.userReaction] : null;
            const isCommentsOpen = openCommentFeedId === article.id;

            return (
              <article
                key={article.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* 1) Cover Image Header (صورة الغلاف) */}
                  <div 
                    className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => handleOpenArticle(article)}
                  >
                    <img
                      src={article.coverImage}
                      alt={article.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Badges: Category & Bookmark */}
                    <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-white/20">
                        {article.categoryLabelAr}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveArticle(article.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition ${
                          isSaved 
                            ? 'bg-amber-500 text-stone-950 shadow-sm' 
                            : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                        title={isSaved ? (isAr ? 'محفوظ في مفضلة الميدان' : 'Saved') : (isAr ? 'حفظ المقالة للرجوع إليها' : 'Save article')}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Badges on Image: Reading time & Featured tag */}
                    <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between text-[11px] text-white/95 z-10">
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{article.readingTimeMinutes} {isAr ? 'دقائق قراءة' : 'min read'}</span>
                      </span>

                      {article.heroBadgeAr && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] shadow-xs">
                          {article.heroBadgeAr}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2) Card Content Body */}
                  <div className="p-5 space-y-3.5">
                    {/* Author metadata */}
                    <div className="flex items-center gap-2.5">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shadow-2xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">{article.author.name}</div>
                        <div className="text-[10px] text-stone-500 truncate">{article.author.role} • {article.publishedAt}</div>
                      </div>
                    </div>

                    {/* Title & Fast Summary (ملخص سريع) */}
                    <div className="space-y-1.5">
                      <h3 
                        onClick={() => handleOpenArticle(article)}
                        className="text-base font-bold font-serif text-stone-900 group-hover:text-amber-700 transition line-clamp-2 leading-snug cursor-pointer"
                      >
                        {article.titleAr}
                      </h3>
                      
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {article.summaryAr}
                      </p>
                    </div>

                    {/* Highlight Pitch Script Callout Box */}
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 relative text-xs">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{isAr ? 'سيناريو الإقناع الذهبي:' : 'Pitch Script:'}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopyPitch(article.wordForWordPitchScript, article.id)}
                          className="text-[10px] font-bold text-amber-800 hover:text-amber-950 bg-amber-200/60 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition"
                        >
                          {copiedPitchId === article.id ? (
                            <span className="text-emerald-700 font-bold">{isAr ? 'تم!' : 'Copied!'}</span>
                          ) : (
                            <span>{isAr ? 'نسخ' : 'Copy'}</span>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-800 line-clamp-2 italic leading-relaxed">
                        {article.wordForWordPitchScript}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3) Engagement Stats Summary Bar */}
                <div>
                  <div className="px-5 py-2 bg-stone-50/80 border-t border-b border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      {renderTopReactionEmojis(article.reactions)}
                      <span className="font-semibold text-stone-700 font-mono text-[11px]">
                        {totalReactions.toLocaleString()} {isAr ? 'تفاعل' : 'reactions'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <button
                        onClick={() => setOpenCommentFeedId(isCommentsOpen ? null : article.id)}
                        className="hover:underline text-stone-600 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 text-stone-400" />
                        <span>{article.comments.length}</span>
                      </button>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-stone-400">
                        <Eye className="w-3 h-3" />
                        <span>{article.stats.views}</span>
                      </span>
                    </div>
                  </div>

                  {/* 4) Facebook-Style Action Buttons Bar */}
                  <div className="px-3 py-2 flex items-center justify-between relative border-b border-stone-100 bg-white">
                    {/* Reaction Button with Hover / Tap Picker */}
                    <div 
                      className="relative"
                      onMouseEnter={() => setActiveReactionPickerId(article.id)}
                      onMouseLeave={() => setActiveReactionPickerId(null)}
                    >
                      <button
                        type="button"
                        onClick={() => toggleReaction(article.id, article.userReaction || 'like')}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition hover:bg-stone-100 ${
                          currentReactionCfg ? currentReactionCfg.textColor : 'text-stone-600'
                        }`}
                      >
                        {currentReactionCfg ? (
                          <>
                            <span className="text-base leading-none">{currentReactionCfg.emoji}</span>
                            <span className="hidden sm:inline">{currentReactionCfg.labelAr}</span>
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="w-4 h-4 text-stone-500" />
                            <span className="hidden sm:inline">{isAr ? 'أعجبني' : 'Like'}</span>
                          </>
                        )}
                      </button>

                      {/* Floating Reaction Bar (Facebook Style) */}
                      {activeReactionPickerId === article.id && (
                        <div className="absolute bottom-full mb-1 rtl:right-0 ltr:left-0 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xl border border-stone-200 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
                          {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((rKey) => {
                            const cfg = REACTION_CONFIG[rKey];
                            const isSelected = article.userReaction === rKey;
                            return (
                              <button
                                key={rKey}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleReaction(article.id, rKey);
                                  setActiveReactionPickerId(null);
                                }}
                                className={`p-1.5 rounded-full hover:scale-125 transition duration-150 flex flex-col items-center group relative ${
                                  isSelected ? 'bg-amber-100 scale-110' : 'hover:bg-stone-100'
                                }`}
                                title={cfg.labelAr}
                              >
                                <span className="text-2xl leading-none">{cfg.emoji}</span>
                                <span className="absolute -top-7 px-2 py-0.5 bg-stone-900 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-sm">
                                  {cfg.labelAr}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Comment Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setOpenCommentFeedId(isCommentsOpen ? null : article.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
                    >
                      <MessageSquare className="w-4 h-4 text-stone-500" />
                      <span className="hidden sm:inline">{isAr ? 'تعليق' : 'Comment'}</span>
                    </button>

                    {/* Share Button (opens all apps & copy modal) */}
                    <button
                      type="button"
                      onClick={() => handleOpenShare(article)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-amber-800 hover:bg-amber-50 transition"
                      title={isAr ? 'مشاركة المقالة عبر التطبيقات' : 'Share article'}
                    >
                      <Share2 className="w-4 h-4 text-stone-500" />
                      <span className="hidden sm:inline">{isAr ? 'مشاركة' : 'Share'}</span>
                    </button>

                    {/* Full Article Reader CTA */}
                    <button
                      type="button"
                      onClick={() => handleOpenArticle(article)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition shadow-2xs"
                    >
                      <span>{isAr ? 'قراءة' : 'Read'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>

                {/* 6) Facebook-Style Comments Thread (Collapsible or Expandable) */}
                {isCommentsOpen && (
                  <div className="bg-stone-50/80 p-5 sm:p-6 space-y-4 border-t border-stone-100 animate-in fade-in duration-150">
                    {/* Add Comment Input Composer */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs">
                        {activePartner.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="relative">
                          <textarea
                            rows={2}
                            value={commentInputs[article.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({ ...prev, [article.id]: e.target.value }))
                            }
                            placeholder={isAr ? `اكتب تعليقك أو شارك تجربتك الميدانية مع الشركاء يا ${activePartner.fullName}...` : 'Write a comment or share your field experience...'}
                            className="w-full p-3 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none shadow-2xs"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleSendComment(article.id)}
                            disabled={!commentInputs[article.id]?.trim()}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                            <span>{isAr ? 'نشر التعليق' : 'Post'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    {article.comments.length === 0 ? (
                      <div className="text-center py-4 text-xs text-stone-400">
                        {isAr ? 'لا توجد تعليقات بعد. كن أول من يشارك تجربته مع الزملاء!' : 'No comments yet. Be the first to comment!'}
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2">
                        {article.comments.map((comm) => (
                          <div key={comm.id} className="space-y-2">
                            {/* Comment Bubble */}
                            <div className="flex items-start gap-2.5">
                              <img
                                src={comm.authorAvatar}
                                alt={comm.authorName}
                                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-stone-300"
                              />
                              <div className="flex-1">
                                <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs inline-block max-w-full">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-stone-900">{comm.authorName}</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                                      {comm.authorRank}
                                    </span>
                                    {comm.authorCity && (
                                      <span className="text-[10px] text-stone-400">({comm.authorCity})</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
                                    {comm.text}
                                  </p>
                                </div>

                                {/* Comment Meta Actions (Like, Reply, Time) */}
                                <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1 mr-2 rtl:mr-2 ltr:ml-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleCommentLike(article.id, comm.id)}
                                    className={`font-semibold transition ${
                                      comm.isLikedByMe ? 'text-blue-600 font-bold' : 'hover:underline'
                                    }`}
                                  >
                                    {isAr ? 'أعجبني' : 'Like'} {comm.likesCount > 0 && `(${comm.likesCount})`}
                                  </button>

                                  <span>•</span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveReplyCommentId(
                                        activeReplyCommentId === comm.id ? null : comm.id
                                      )
                                    }
                                    className="font-semibold hover:underline"
                                  >
                                    {isAr ? 'رد' : 'Reply'}
                                  </button>

                                  <span>•</span>

                                  <span>{comm.createdAt}</span>
                                </div>

                                {/* Reply Input Box */}
                                {activeReplyCommentId === comm.id && (
                                  <div className="mt-2 flex items-center gap-2 mr-4 rtl:mr-4 ltr:ml-4">
                                    <input
                                      type="text"
                                      value={replyInputs[comm.id] || ''}
                                      onChange={(e) =>
                                        setReplyInputs((prev) => ({ ...prev, [comm.id]: e.target.value }))
                                      }
                                      placeholder={isAr ? `الرد على ${comm.authorName}...` : `Reply to ${comm.authorName}...`}
                                      className="flex-1 py-1.5 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white focus:border-amber-500 outline-none"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSendReply(article.id, comm.id);
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSendReply(article.id, comm.id)}
                                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
                                    >
                                      {isAr ? 'إرسال' : 'Reply'}
                                    </button>
                                  </div>
                                )}

                                {/* Nested Replies Thread */}
                                {comm.replies.length > 0 && (
                                  <div className="mt-2 mr-4 rtl:mr-4 ltr:ml-4 space-y-2 border-r-2 rtl:border-r-2 ltr:border-l-2 border-stone-200 pr-3 rtl:pr-3 ltr:pl-3">
                                    {comm.replies.map((rep) => (
                                      <div key={rep.id} className="flex items-start gap-2">
                                        <div className="w-6 h-6 rounded-full bg-stone-800 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                                          {rep.authorName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                          <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs inline-block max-w-full">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                              <span className="text-xs font-bold text-stone-900">{rep.authorName}</span>
                                              <span className="text-[9px] text-amber-800 font-medium">({rep.authorRank})</span>
                                            </div>
                                            <p className="text-xs text-stone-800">{rep.text}</p>
                                          </div>
                                          <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5 mr-1">
                                            <button
                                              type="button"
                                              onClick={() => toggleReplyLike(article.id, comm.id, rep.id)}
                                              className={`font-semibold ${
                                                rep.isLikedByMe ? 'text-blue-600 font-bold' : 'hover:underline'
                                              }`}
                                            >
                                              {isAr ? 'أعجبني' : 'Like'} {rep.likesCount > 0 && `(${rep.likesCount})`}
                                            </button>
                                            <span>•</span>
                                            <span>{rep.createdAt}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. FULL ARTICLE READER MODAL */}
      {/* ========================================================= */}
      {currentModalArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Bar */}
            <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  {currentModalArticle.categoryLabelAr}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  {currentModalArticle.difficultyLabelAr}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition"
                  title={isAr ? 'طباعة كدليل ميداني' : 'Print guide'}
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الدليل من الأكاديمية؟' : 'Delete this guide from Academy?')) {
                      deleteArticle(currentModalArticle.id);
                      setSelectedArticleId(null);
                    }
                  }}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition"
                  title={isAr ? 'حذف هذا الدليل' : 'Delete guide'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArticleId(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-stone-900">
              {/* Cover Image Banner */}
              {currentModalArticle.coverImage && (
                <div className="w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-2xl overflow-hidden shadow-sm relative border border-stone-200">
                  <img
                    src={currentModalArticle.coverImage}
                    alt={currentModalArticle.titleAr}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 rtl:right-4 ltr:left-4 text-xs font-semibold text-amber-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentModalArticle.readingTimeMinutes} {isAr ? 'دقائق قراءة متأنية' : 'min read'}</span>
                  </div>
                </div>
              )}

              {/* Author & Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mb-3">
                  {currentModalArticle.titleAr}
                </h1>
                
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
                  <img
                    src={currentModalArticle.author.avatar}
                    alt={currentModalArticle.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400"
                  />
                  <div>
                    <div className="font-bold text-stone-900">{currentModalArticle.author.name}</div>
                    <div className="text-stone-500">
                      {currentModalArticle.author.role} • خبرة {currentModalArticle.author.experienceYears} سنوات
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="text-sm text-stone-700 leading-relaxed font-medium bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
                {currentModalArticle.summaryAr}
              </div>

              {/* Word-for-Word Pitch Script Hero */}
              <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-white p-6 rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'سيناريو المحادثة والإقناع كلمة بكلمة:' : 'Word-for-Word Pitch Script:'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyPitch(currentModalArticle.wordForWordPitchScript, 'modal')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
                  >
                    {copiedPitchId === 'modal' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تم النسخ بنجاح!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isAr ? 'نسخ النص بالكامل' : 'Copy Full Script'}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans bg-black/40 p-4 rounded-xl border border-white/10 whitespace-pre-wrap">
                  {currentModalArticle.wordForWordPitchScript}
                </p>
              </div>

              {/* Article Sections */}
              <div className="space-y-6 pt-2">
                {currentModalArticle.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-3 bg-stone-50/60 p-5 rounded-2xl border border-stone-200">
                    <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      <span>{sec.title}</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {sec.content}
                    </p>

                    {sec.bulletPoints && (
                      <ul className="space-y-2 pt-1 text-xs sm:text-sm text-stone-700">
                        {sec.bulletPoints.map((pt, ptIdx) => (
                          <li key={ptIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {sec.goldenQuote && (
                      <div className="p-3 bg-amber-100/70 border-r-4 rtl:border-r-4 ltr:border-l-4 border-amber-600 rounded-xl text-xs font-semibold text-amber-950 italic">
                        💡 {sec.goldenQuote}
                      </div>
                    )}

                    {sec.fieldTip && (
                      <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-950 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <span><strong>{isAr ? 'تكتيك الحقل الميداني:' : 'Field Tactic:'}</strong> {sec.fieldTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Objection Handling Flashcards */}
              {currentModalArticle.objectionsHandled.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-bold text-stone-900">
                      {isAr ? 'بنك الرد على الاعتراضات الميدانية' : 'Objection Handling Flashcards'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {currentModalArticle.objectionsHandled.map((obj, oIdx) => (
                      <div key={oIdx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs sm:text-sm">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{isAr ? 'اعتراض العميل:' : 'Client Objection:'} «{obj.objection}»</span>
                        </div>

                        <div className="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          <strong>{isAr ? 'ما الذي يفكر فيه العميل في باطنه؟' : 'Client Mindset:'}</strong> {obj.clientMindset}
                        </div>

                        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                          <strong className="block mb-1 text-emerald-900 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isAr ? 'أفضل رد مقنع بالكلمات:' : 'Best Response Script:'}</span>
                          </strong>
                          <span>{obj.bestScriptAr}</span>
                        </div>

                        {obj.avoidSayingAr && (
                          <div className="text-[11px] text-rose-600 bg-rose-50/50 p-2 rounded-xl">
                            ❌ {isAr ? 'احذر أن تقول:' : 'Avoid saying:'} {obj.avoidSayingAr}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenShare(currentModalArticle)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition"
              >
                <Share2 className="w-4 h-4 text-amber-700" />
                <span>{isAr ? 'مشاركة المقالة عبر التطبيقات' : 'Share Article'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedArticleId(null)}
                className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition"
              >
                {isAr ? 'إغلاق الدليل' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. APPS SHARING MODAL & DIRECT COPY (Requested by user) */}
      {/* ========================================================= */}
      {sharingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-white">
                    {isAr ? 'مشاركة عبر التطبيقات' : 'Share via Applications'}
                  </h3>
                  <p className="text-[11px] text-stone-300 line-clamp-1 max-w-[260px]">
                    {sharingArticle.titleAr}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSharingArticle(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Device System Apps Sheet (Android / iOS native app drawer) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={() => handleNativeDeviceShare(sharingArticle)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 group"
                >
                  <Smartphone className="w-4 h-4 group-hover:scale-110 transition" />
                  <span>{isAr ? 'مشاركة عبر كافة تطبيقات الهاتف 📱' : 'Share via Device Apps Sheet'}</span>
                </button>
              )}

              {/* Grid of All Major Social & Messaging Apps */}
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-3">
                  {isAr ? 'اختر التطبيق للمشاركة المباشرة:' : 'Or choose app directly:'}
                </span>

                <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `*${sharingArticle.titleAr}*\n\n${sharingArticle.summaryAr}\n\n📖 اقرأ الدليل كاملاً من نون والقلم:\n${getShareUrl(sharingArticle.id)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-emerald-50 hover:border-emerald-300 transition group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                      <WhatsAppIcon className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 group-hover:text-emerald-700">واتساب</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      getShareUrl(sharingArticle.id)
                    )}&text=${encodeURIComponent(sharingArticle.titleAr)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-sky-50 hover:border-sky-300 transition group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                      <TelegramIcon className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 group-hover:text-sky-700">تليغرام</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      getShareUrl(sharingArticle.id)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-blue-50 hover:border-blue-300 transition group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                      <FacebookIcon className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 group-hover:text-blue-700">فيسبوك</span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `${sharingArticle.titleAr}\n${getShareUrl(sharingArticle.id)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-200 hover:border-stone-400 transition group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                      <XPlatformIcon className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 group-hover:text-black">منصة X</span>
                  </a>

                  {/* Messenger */}
                  <a
                    href={`fb-messenger://share?link=${encodeURIComponent(getShareUrl(sharingArticle.id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-purple-50 hover:border-purple-300 transition group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                      <MessengerIcon className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 group-hover:text-purple-700">ماسنجر</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      getShareUrl(sharingArticle.id)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-sky-50 hover:border-sky-300 transition group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                      <LinkedInIcon className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 group-hover:text-sky-800">لينكد إن</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(sharingArticle.titleAr)}&body=${encodeURIComponent(
                      `${sharingArticle.titleAr}\n\n${sharingArticle.summaryAr}\n\nرابط المقالة المعتمد:\n${getShareUrl(
                        sharingArticle.id
                      )}`
                    )}`}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-rose-50 hover:border-rose-300 transition group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 group-hover:text-rose-700">البريد</span>
                  </a>

                  {/* SMS */}
                  <a
                    href={`sms:?body=${encodeURIComponent(
                      `${sharingArticle.titleAr} ${getShareUrl(sharingArticle.id)}`
                    )}`}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-amber-50 hover:border-amber-300 transition group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 group-hover:text-amber-800">رسالة SMS</span>
                  </a>
                </div>
              </div>

              {/* Direct Link & Copy Button (Requested by user) */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{isAr ? 'نسخ الرابط المباشر:' : 'Direct Link:'}</span>
                  <span className="text-[10px] text-amber-700 font-mono font-semibold">
                    {isAr ? 'كودك:' : 'Code:'} {activePartner.referralCode}
                  </span>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-1.5 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl(sharingArticle.id)}
                    className="flex-1 min-w-0 bg-transparent px-3 text-xs font-mono text-stone-700 outline-none select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyShareUrl(getShareUrl(sharingArticle.id))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition shrink-0 shadow-2xs"
                  >
                    {copiedModalLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isAr ? 'نسخ الرابط' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-stone-50 border-t border-stone-100 text-center">
              <button
                type="button"
                onClick={() => setSharingArticle(null)}
                className="w-full py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition"
              >
                {isAr ? 'إلغاء وإغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. CREATE NEW ACADEMY ARTICLE / GUIDE MODAL */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-white">
                    {isAr ? 'نشر دليل ميداني أو مقال تدريبي جديد' : 'Publish New Academy Field Guide'}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    {isAr ? 'ينشر مباشرة في بطاقات الأكاديمية ويظهر فوراً لشركاء التوظيف وفريق المبيعات' : 'Visible immediately in the partner grid feed'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handlePublishArticle} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-900 block">
                  {isAr ? 'عنوان الدليل أو المقالة:' : 'Guide Title:'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: دليل إقناع الفنادق والمطاعم بحوافظ المنيو الجلدية الفاخرة' : 'e.g. Luxury VIP corporate pitch guide'}
                  className="w-full p-3 rounded-xl border border-stone-200 focus:border-amber-500 outline-none text-stone-900 text-xs sm:text-sm bg-stone-50"
                />
              </div>

              {/* Category, Difficulty & Read time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="font-bold text-stone-900 block">{isAr ? 'القسم:' : 'Category:'}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-amber-500 outline-none bg-white text-stone-800"
                  >
                    <option value="restaurants_cafes">المطاعم والكافيهات ☕</option>
                    <option value="medical_clinics">العيادات والمشافي 🩺</option>
                    <option value="corporate_vip">شركات ومكاتب VIP 💼</option>
                    <option value="objection_handling">الرد على الاعتراضات 🛡️</option>
                    <option value="quality_secrets">أسرار الخامات والطباعة 🔍</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-900 block">{isAr ? 'مستوى الصعوبة:' : 'Difficulty:'}</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-amber-500 outline-none bg-white text-stone-800"
                  >
                    <option value="beginner">أساسي (مبتدئ)</option>
                    <option value="intermediate">متوسط (ميداني)</option>
                    <option value="advanced">متقدم (B2B)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-900 block">{isAr ? 'وقت القراءة (دقائق):' : 'Read Time (min):'}</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newReadingTime}
                    onChange={(e) => setNewReadingTime(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-amber-500 outline-none bg-white text-stone-800"
                  />
                </div>
              </div>

              {/* Cover Image with Presets */}
              <div className="space-y-2">
                <label className="font-bold text-stone-900 block">{isAr ? 'صورة الغلاف (اختر قالباً جاهزاً أو أدخل رابطاً):' : 'Cover Image:'}</label>
                
                {/* Presets chips */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setNewCoverImage(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                        newCoverImage === preset.url
                          ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {preset.labelAr}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newCoverImage}
                    onChange={(e) => setNewCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 p-2.5 rounded-xl border border-stone-200 focus:border-amber-500 outline-none text-stone-800 text-xs font-mono bg-stone-50"
                  />
                  {newCoverImage && (
                    <img
                      src={newCoverImage}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Fast Summary */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-900 block">
                  {isAr ? 'الملخص السريع (سيعرض في واجهة البطاقة الشبكية):' : 'Quick Summary:'} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder={isAr ? 'ملخص عملي في سطرين أو ثلاثة يوضح جوهر الدليل للزملاء...' : 'Summary shown on card...'}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-amber-500 outline-none text-stone-900 bg-stone-50 resize-none"
                />
              </div>

              {/* Word-for-Word Pitch Script */}
              <div className="space-y-1.5 p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                <label className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isAr ? 'سيناريو الإقناع الذهبي كلمة بكلمة (Pitch Script):' : 'Golden Pitch Script:'}</span>
                </label>
                <textarea
                  rows={2}
                  value={newPitchScript}
                  onChange={(e) => setNewPitchScript(e.target.value)}
                  placeholder={isAr ? '«مرحباً أستاذ، أنا فلان من استوديو نون والقلم... جئت اليوم لأنني لاحظت...»' : 'Word-for-word pitch script...'}
                  className="w-full p-2.5 rounded-xl border border-amber-300 focus:border-amber-500 outline-none text-stone-900 bg-white resize-none text-xs"
                />
              </div>

              {/* Objection Handling */}
              <div className="space-y-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="font-bold text-stone-900 block">{isAr ? 'أبرز اعتراض وكيفية الرد الذكي عليه:' : 'Key Objection & Counter Script:'}</label>
                <input
                  type="text"
                  value={newObjection}
                  onChange={(e) => setNewObjection(e.target.value)}
                  placeholder={isAr ? 'اعتراض العميل: مثال «الأسعار مرتفعة مقارنة بالخيارات العادية»' : 'Client objection...'}
                  className="w-full p-2 rounded-xl border border-stone-200 focus:border-amber-500 outline-none text-stone-900 bg-white"
                />
                <textarea
                  rows={2}
                  value={newObjectionScript}
                  onChange={(e) => setNewObjectionScript(e.target.value)}
                  placeholder={isAr ? 'ردك الميداني: «بالتأكيد أستاذنا، ولكن الفارق أن خاماتنا تعيش سنتين دون تلف مما يوفر عليك تكلفة الاستبدال المستمر...»' : 'Best counter response...'}
                  className="w-full p-2 rounded-xl border border-stone-200 focus:border-amber-500 outline-none text-stone-900 bg-white resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 font-semibold transition"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'نشر في الأكاديمية فوراً' : 'Publish to Academy'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
