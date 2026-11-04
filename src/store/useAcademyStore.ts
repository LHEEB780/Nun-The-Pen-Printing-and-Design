import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReactionType = 'like' | 'love' | 'insight' | 'fire' | 'clap';

export interface AcademyCommentReply {
  id: string;
  authorName: string;
  authorRank: string;
  authorAvatar?: string;
  createdAt: string;
  text: string;
  likesCount: number;
  isLikedByMe?: boolean;
}

export interface AcademyComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRank: string;
  authorCity: string;
  authorAvatar?: string;
  createdAt: string;
  text: string;
  likesCount: number;
  isLikedByMe?: boolean;
  replies: AcademyCommentReply[];
}

export interface ObjectionCard {
  objection: string;
  clientMindset: string;
  bestScriptAr: string;
  avoidSayingAr: string;
}

export interface ArticleSection {
  title: string;
  content: string;
  bulletPoints?: string[];
  goldenQuote?: string;
  fieldTip?: string;
}

export interface AcademyArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  category: 'restaurants_cafes' | 'medical_clinics' | 'corporate_vip' | 'objection_handling' | 'quality_secrets';
  categoryLabelAr: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultyLabelAr: string;
  readingTimeMinutes: number;
  publishedAt: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar: string;
    experienceYears: number;
  };
  summaryAr: string;
  coverImage: string;
  heroBadgeAr: string;
  sections: ArticleSection[];
  wordForWordPitchScript: string;
  objectionsHandled: ObjectionCard[];
  stats: {
    views: number;
    shares: number;
    savedCount: number;
  };
  reactions: Record<ReactionType, number>;
  userReaction: ReactionType | null;
  comments: AcademyComment[];
}

interface AcademyState {
  articles: AcademyArticle[];
  savedArticleIds: string[];
  selectedCategoryId: string;
  searchQuery: string;
  difficultyFilter: string;
  sortBy: 'featured' | 'latest' | 'popular' | 'comments';

  // Actions
  setSelectedCategoryId: (catId: string) => void;
  setSearchQuery: (query: string) => void;
  setDifficultyFilter: (diff: string) => void;
  setSortBy: (sort: 'featured' | 'latest' | 'popular' | 'comments') => void;
  
  toggleSaveArticle: (articleId: string) => void;
  toggleReaction: (articleId: string, reaction: ReactionType) => void;
  
  addComment: (
    articleId: string, 
    comment: { authorId: string; authorName: string; authorRank: string; authorCity: string; text: string }
  ) => void;
  
  toggleCommentLike: (articleId: string, commentId: string) => void;
  
  addReply: (
    articleId: string, 
    commentId: string, 
    reply: { authorName: string; authorRank: string; text: string }
  ) => void;
  
  toggleReplyLike: (articleId: string, commentId: string, replyId: string) => void;
  
  incrementViewCount: (articleId: string) => void;
  shareArticle: (articleId: string) => void;
}

const INITIAL_ARTICLES: AcademyArticle[] = [
  {
    id: 'art-restaurant-menu',
    titleAr: 'دليل إقناع المطاعم والكافيهات بحوافظ المنيو الجلدية والخشبية والعلب الكرتونية الفاخرة',
    titleEn: 'Pitching Luxury Menus & Packaging to Cafes and Restaurants',
    slug: 'pitching-menus-packaging-cafes',
    category: 'restaurants_cafes',
    categoryLabelAr: 'المطاعم والكافيهات',
    difficulty: 'intermediate',
    difficultyLabelAr: 'متوسط (زيارات ميدانية)',
    readingTimeMinutes: 5,
    publishedAt: 'منذ يومين',
    featured: true,
    author: {
      name: 'أحمد الموسوي',
      role: 'كبير مسؤولي تطوير المبيعات B2B',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      experienceYears: 7,
    },
    summaryAr: 'كيف تقنع مدير مطعم أو كافيه في المنصور أو الكرادة باستبدال قوائم الطعام البلاستيكية القديمة بحوافظ خشبية وجلدية محفورة بالليزر مع علب تغليف مضلعة ترفع قيمة الطلب بنسبة 30%.',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    heroBadgeAr: 'الأعلى إغلاقاً للصفقات في بغداد 🔥',
    sections: [
      {
        title: 'المدخل النفسي لمدير الصالة أو صاحب المطعم',
        content: 'أغلب أصحاب المطاعم يعتبرون قائمة الطعام (المنيو) هي أول مصافحة بصرية بين الزبون والعلامة التجارية. المنيو الممزق أو المغلف بنايلون رخيص ينقل فوراً رسالة سلبية عن جودة الطعام ونظافة المطبخ.',
        bulletPoints: [
          'ركز على أن المنيو الخشبي أو الجلدي الفاخر يدوم أكثر من سنتين دون تلف مقارنة بالورق العادي الذي يتلف كل شهرين.',
          'العميل الذي يمسك منيو ثقيل وفاخر يتقبل الأسعار المرتفعة للوجبات بارتياح نفسي أكبر.',
          'حفر شعار المطعم بالليزر يعطي هيبة استثنائية للصور التي يلتقطها الزبائن لنشرها على إنستغرام وتيك توك.',
        ],
        goldenQuote: 'لا تبع لصاحب المطعم خشباً أو جلداً، بع له شعور الفخامة الذي يجعل زبونه مستعداً لدفع 25 ألف دينار للوجبة دون تردد.',
        fieldTip: 'احمل معك دائماً عينة واحدة جاهزة ومحفورة بعناية في حقيبتك الميدانية. دع العميل يلمس ملمس الجلد الطبيعي ورائحة الخشب المعالج بيده فوراً.',
      },
      {
        title: 'عرض التغليف الكرتوني وعلب البيتزا والبرغر',
        content: 'عند التحدث عن علب التوصيل، لا تنافس على سعر القطعة الفردية، بل نافس على سمعة التوصيل وتجربة الزبون في المنزل.',
        bulletPoints: [
          'كرتون الـ E-Flute ثلاثي الطبقات لدينا يحتفظ بالحرارة ويمنع تشرب الزيوت والتعرق الداخلي الذي يجعل الطعام طرياً ومبللاً.',
          'تصميم العلبة المبتكر والطباعة الحادة يحول كل صندوق توصيل إلى لوحة إعلانية مجانية في كل بيت.',
          'بروفة مجانية معتمدة خلال 24 ساعة لأي كمية تبدأ من 500 قطعة.',
        ],
      },
    ],
    wordForWordPitchScript: `«مرحباً أستاذ [اسم المدير]، أنا [اسمك] شريك تطوير الأعمال في استوديو نون والقلم ببغداد. جئت اليوم خصيصاً لأن مطعمكم معروف بجودة أطباقه وفخامته، لكن لاحظت أن قوائم الطعام لا تعكس نفس مستوى الفخامة التي تقدمونها في المطبخ. أحضرت معي نموذجاً لحافظة منيو جلد طبيعي مع حفر ليزري ميكروني صممناها لمطعم شبيه بكم. تفضل المس جودة الخياطة ووزن الخشب بنفسك.. نحن نضمن لك عمراً تشغيلياً لا يقل عن عامين مع استبدال مجاني لأي قطعة يحدث فيها عيب تصنيعي.»`,
    objectionsHandled: [
      {
        objection: 'الأسعار مرتفعة مقارنة بالمطابع العادية التي نطبع عندها الكروت والمنيو الورقي.',
        clientMindset: 'العميل يقارن تكلفة الورق العادي القابل للتلف بالخشب والجلد المعالج.',
        bestScriptAr: '«أستاذي العزيز، الورق العادي يتلف ويتسخ بالسوائل كل 3 أشهر وتضطر لإعادة طباعته 4 مرات في السنة بمجموع تكلفة يفوق حافظتنا الجلدية التي تخدمك عامين كاملين دون أي تلف، بالإضافة إلى أن انطباع زبائنكم سيكون مختلفاً تماماً.»',
        avoidSayingAr: '«نحن جودتنا أعلى منهم بكثير وهم يبيعون خامات رديئة.» (تجنب مهاجمة المنافس، ركز على المعادلة الاقتصادية).',
      },
      {
        objection: 'نحن نعتمد الآن على قائمة الطعام الإلكترونية عبر كود QR ولا نحتاج منيو مطبوع.',
        clientMindset: 'يريد توفير التكاليف أو مواكبة التقنية الرقمية.',
        bestScriptAr: '«هذا تطور ممتاز أستاذي! لكن دراسات الضيافة تؤكد أن 68% من الزبائن وخاصة العائلات وكبار السن ورجال الأعمال يفضلون تجربة تصفح المنيو الورقي الفاخر بجانب الـ QR، ونحن نوفر لك حامل طاولة خشبي يجمع بين الباركود الذكي والمنيو الملكي المطبوع.»',
        avoidSayingAr: '«منيو الـ QR فاشل والزبائن لا يحبونه.»',
      },
    ],
    stats: {
      views: 342,
      shares: 48,
      savedCount: 65,
    },
    reactions: {
      like: 42,
      love: 28,
      insight: 19,
      fire: 35,
      clap: 14,
    },
    userReaction: 'fire',
    comments: [
      {
        id: 'c1',
        authorId: 'partner-2',
        authorName: 'زينب الخفاجي',
        authorRank: 'أخصائي مبيعات معتمد 🎖️',
        authorCity: 'البصرة',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        createdAt: 'منذ 3 ساعات',
        text: 'طبقت جملة (المعادلة الاقتصادية لعمر المنيو لمدة سنتين) أمس مع كافيه في شارع الجزائر بالبصرة، واقتنع فوراً وطلبنا 30 حافظة جلدية مع 1000 علبة حلويات! نصيحة ممتازة جداً 👏',
        likesCount: 12,
        isLikedByMe: true,
        replies: [
          {
            id: 'r1',
            authorName: 'أحمد الموسوي',
            authorRank: 'كبير مسؤولي تطوير المبيعات',
            createdAt: 'منذ ساعتين',
            text: 'ما شاء الله عليكِ زميلتنا زينب! التركيز على العائد على الاستثمار دائماً يغلق الصفقات أسرع من الحديث عن جمال الشكل وحده. استمري!',
            likesCount: 5,
            isLikedByMe: false,
          },
        ],
      },
      {
        id: 'c2',
        authorId: 'partner-demo-3',
        authorName: 'حيدر الكرخي',
        authorRank: 'مندوب مبيعات معتمد',
        authorCity: 'بغداد',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        createdAt: 'منذ 5 ساعات',
        text: 'سؤال للزملاء: ما هو أفضل وقت لزيارة مدراء المطاعم؟ لأنهم في المساء يكونون مشغولين جداً بالزبائن؟',
        likesCount: 6,
        isLikedByMe: false,
        replies: [
          {
            id: 'r2',
            authorName: 'مصطفى العبيدي',
            authorRank: 'مدير حسابات وعلاقات عملاء',
            createdAt: 'منذ 4 ساعات',
            text: 'أفضل وقت ميداني هو بين الساعة 12 ظهراً والساعة 3 عصراً، قبل ذروة العشاء، ويكون المدير متفرغاً لمراجعة عقود التوريد.',
            likesCount: 8,
            isLikedByMe: true,
          },
        ],
      },
    ],
  },
  {
    id: 'art-acrylic-clinics',
    titleAr: 'دروع ولوحات الأكريليك المضيئة 3D LED: استراتيجية إقناع المشافي والعيادات ومكاتب المحامين',
    titleEn: 'Pitching 3D LED Acrylic Plaques to Clinics and Law Offices',
    slug: 'acrylic-led-clinics-lawyers',
    category: 'medical_clinics',
    categoryLabelAr: 'العيادات والمشافي الطبية',
    difficulty: 'advanced',
    difficultyLabelAr: 'متقدم (صفقات كبرى B2B)',
    readingTimeMinutes: 7,
    publishedAt: 'منذ 3 أيام',
    featured: true,
    author: {
      name: 'سارة التميمي',
      role: 'استشارية تسويق وهدايا الشركات',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      experienceYears: 6,
    },
    summaryAr: 'دليل عملي لاقتناص صفقات التكريم واللوحات التعريفية المضيئة للأطباء الاستشاريين والمستشفيات الخاصة ومكاتب كبار المحامين بعائد عمولة مرتفع.',
    coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    heroBadgeAr: 'أعلى نسبة عمولة شريك (+15%) 💎',
    sections: [
      {
        title: 'لماذا تبحث العيادات والمشافي عن التميز المكتبي؟',
        content: 'الأطباء والمحامون يبيعون الثقة والمكانة العلمية والقانونية. اللوحة التعريفية على طاولة الطبيب أو في بهو الاستقبال هي أول دليل يراه المريض أو الموكل على احترافية المكان.',
        bulletPoints: [
          'الأكريليك الكاست النقي لدينا بسماكة 8 إلى 10 ملم يتمتع بصفاء كريستالي لا يصفر مع الزمن إطلاقاً.',
          'الحفر الليزري الميكروني مع إضاءة الـ LED المحيطية الدافئة (Warm / Ice Blue) يمنح المكتب هيبة استثنائية في الإضاءة الخافتة.',
          'القواعد الخشبية مصنوعة من خشب الزان الطبيعي المصمت مع طلاء ورنيش مقاوم للخدش والتآكل.',
        ],
        goldenQuote: 'الطبيب يدفع بسهولة مقابل الشيء الذي يعكس مكانته العلمية وسنوات دراسته وتفوقه.',
        fieldTip: 'قبل زيارة العيادة، ابحث عن اسم الطبيب وتخصصه الدقيق على صفحته بالفيسبوك، واعرض عليه فوراً صورة رقمية لشعاره مفرغاً على الدرع.',
      },
    ],
    wordForWordPitchScript: `«دكتورنا الفاضل، تحياتي لشخصكم الكريم. نحن في دار نون والقلم نجهز اللوحات والدروع المكتبية الملكية لأكبر المراكز الطبية في بغداد وأربيل. صممنا لحضرتك نموذجاً أولياً لدرع أكريليكي مضيء ثلاثي الأبعاد يحمل اسمك ولقبك العلمي بدقة متناهية مع قاعدة خشب زان طبيعي. الدفع يتم نقداً عند الاستلام بعد أن تعاين القطعة بنفسك على مكتبك وبضمان استبدال ذهبي.»`,
    objectionsHandled: [
      {
        objection: 'عندي لوحة عادية ولا أحتاج لتغييرها حالياً.',
        clientMindset: 'يراها مجرد لوحة اسم وليس عنصراً لتجديد ثقة المرضى والمراجعين.',
        bestScriptAr: '«طبيبنا العزيز، اللوحات القديمة تفقد بريقها مع الوقت، واللوحة المضيئة الحديثة تعطي انطباعاً بالتجدد ومواكبة الحداثة في عيادتكم. يمكننا تجهيز تصميم مجاني بدون أي تكلفة لترى كيف سيغير شكل مكتب الاستقبال.»',
        avoidSayingAr: '«لوحتك القديمة سيئة جداً وعليك تغييرها فوراً.»',
      },
    ],
    stats: {
      views: 289,
      shares: 31,
      savedCount: 52,
    },
    reactions: {
      like: 33,
      love: 24,
      insight: 18,
      fire: 29,
      clap: 12,
    },
    userReaction: 'love',
    comments: [
      {
        id: 'c3',
        authorId: 'partner-1',
        authorName: 'أحمد الموسوي',
        authorRank: 'سفير وشريك رئيسي 👑',
        authorCity: 'بغداد',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        createdAt: 'منذ يوم',
        text: 'دروع الأكريليك بالذات تعتبر من أسهل الصفقات إغلاقاً لأن هامش ربحها ممتاز ورضا العميل عنها مضمون 100%. شكراً أستاذة سارة!',
        likesCount: 9,
        isLikedByMe: false,
        replies: [],
      },
    ],
  },
  {
    id: 'art-objection-price',
    titleAr: 'فن الرد على اعتراض: "وجدنا أسعاراً أرخص في السوق أو شارع المتنبي"',
    titleEn: 'Mastering the Objection: "We found cheaper prices in the market"',
    slug: 'handling-cheaper-price-objection',
    category: 'objection_handling',
    categoryLabelAr: 'التعامل مع الاعتراضات وإغلاق الصفقات',
    difficulty: 'beginner',
    difficultyLabelAr: 'أساسي (لكل الشركاء)',
    readingTimeMinutes: 4,
    publishedAt: 'منذ 4 أيام',
    featured: true,
    author: {
      name: 'عمر الهاشمي',
      role: 'مدرب ومستشار المبيعات التنفيذية',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      experienceYears: 10,
    },
    summaryAr: 'السلاح السري لتحويل اعتراض السعر إلى أقوى نقطة قوة لصالحك دون تقديم أي تنازل أو خصم يؤثر على عمولتك.',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    heroBadgeAr: 'دليل الإقناع الأهم في الميدان 🛡️',
    sections: [
      {
        title: 'القاعدة الذهبية: لا تدافع عن السعر، وضح فرق القيمة',
        content: 'عندما يقول العميل "وجدنا أرخص"، فهو في الحقيقة يقول: "أقنعني لماذا أدفع لك أكثر؟ وما الفارق الذي سأحصل عليه مقابل هذا المبلغ؟". إذا قمت بالخصم فوراً، ستؤكد شكه بأن سعرك كان مبالغاً فيه!',
        bulletPoints: [
          'خطوة 1: اعترف بكلامه ولا تجادله («صحيح أستاذي، السوق مليء بخيارات متفاوتة الأسعار»).',
          'خطوة 2: اسأله سؤال الفحص الذكي («هل تأكدت من نوع الورق وسماكة الجرامات ونوع الحبر المستخدم؟»).',
          'خطوة 3: وضّح المخاطرة المخفية («المطابع الرخيصة تستخدم أحباراً غير مقاومة للرطوبة تبهت بعد أسبوعين من الاستخدام»).',
        ],
        goldenQuote: 'العميل لا يبحث عن الأرخص دائماً، بل يبحث عن الأضمن الذي لا يحرجه أمام زبائنه وضيوفه.',
        fieldTip: 'اطرح عليه دائماً سؤال: "أستاذي، هل تفضل توفير 10 آلاف دينار الآن وتضطر لإعادة العمل بعد شهر، أم تستلم عملاً مضموناً 100% يرفع رأسك؟".',
      },
    ],
    wordForWordPitchScript: `«أتفق معك تماماً أستاذنا العزيز، ومن الطبيعي جداً أن تجد خيارات أقل سعراً في السوق التجاري. لكن اسمح لي بسؤال بسيط: عندما تشتري من السوق الرخيص، هل يضمنون لك عدم انحناء الخشب بعد شهر من حرارة الصيف؟ وهل يتعهدون باستبدال أي قطعة تالفة مجاناً على حسابهم؟ نحن في نون والقلم لا نبيع منتجاً مجهول المصدر، بل نقدم خشب زان معالج، وأكريليك غير قابل للاصفرار، وضمان استبدال فوري عند باب محلك. هل تفضل دفع الفارق البسيط مقابل راحة البال وضمان البريستيج؟»`,
    objectionsHandled: [
      {
        objection: 'المطبعة الفلانية قدمت لي نفس المواصفات بسعر أقل بـ 25%.',
        clientMindset: 'يستخدم المطبعة الأخرى كوسيلة ضغط للمساومة.',
        bestScriptAr: '«يسعدني جداً أنك تقارن وتدقق في الخيارات. لكن في عالم الطباعة والحفر الليزري، التفاصيل الدقيقة هي التي تصنع الفرق؛ مثل حدة خطوط الليزر، وعدم وجود حروق كربونية على الحواف، ونوع الغراء المستخدم. دعني أرسل لك بروفة مجانية واحدة لتقارنها بنفسك جنباً إلى جنب مع منتجهم، والقرار الأخير لك تماماً.»',
        avoidSayingAr: '«تلك المطبعة تغشك ومواصفاتهم كاذبة.»',
      },
    ],
    stats: {
      views: 512,
      shares: 79,
      savedCount: 110,
    },
    reactions: {
      like: 68,
      love: 45,
      insight: 52,
      fire: 61,
      clap: 30,
    },
    userReaction: 'insight',
    comments: [
      {
        id: 'c4',
        authorId: 'partner-3',
        authorName: 'كرار الدليمي',
        authorRank: 'أخصائي مبيعات',
        authorCity: 'الأنبار',
        authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
        createdAt: 'منذ يومين',
        text: 'هذا السيناريو أنقذ مني صفقة لشركة مقاولات في الرمادي كانت مترددة بسبب فرق 50 ألف دينار. العميل لما سمع جملة الضمان المكتوب وافق في نفس اللحظة!',
        likesCount: 17,
        isLikedByMe: true,
        replies: [],
      },
    ],
  },
  {
    id: 'art-cotton-cards-vip',
    titleAr: 'الدليل الحاسم لإغلاق صفقات كروت الأعمال القطنية الإيطالية 600-700 غم للشخصيات التنفيذية',
    titleEn: 'Closing Deals on Luxury 700gsm Italian Cotton Cards',
    slug: 'closing-luxury-cotton-business-cards',
    category: 'corporate_vip',
    categoryLabelAr: 'الشركات والهدايا التنفيذية VIP',
    difficulty: 'intermediate',
    difficultyLabelAr: 'متوسط (مدراء ورجال أعمال)',
    readingTimeMinutes: 6,
    publishedAt: 'منذ 5 أيام',
    featured: false,
    author: {
      name: 'أحمد الموسوي',
      role: 'كبير مسؤولي تطوير المبيعات B2B',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      experienceYears: 7,
    },
    summaryAr: 'كيف تبيع الكرت الشخصي بسعر 10 أضعاف الكرت العادي من خلال إبراز الملمس الحريري والورق القطني الخالي من الأحماض والحواف المذهبة.',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    heroBadgeAr: 'سر انطباع الثواني الثلاث الأولى 💼',
    sections: [
      {
        title: 'الكرت الشخصي ليس وسيلة اتصال، بل بطاقة نفوذ',
        content: 'في الاجتماعات التنفيذية وعالم الأعمال الراقي، لا أحد يقرأ رقم الهاتف من الكرت، بل يلمسون سماكته وملمس الحفر بالذهب ليعرفوا حجم الشركة التي يتعاملون معها.',
        bulletPoints: [
          'ورق قطني طبيعي 100% مستورد من إيطاليا بوزن 600 إلى 700 غم غير قابل للثني بسهولة.',
          'تقنية الحفر الغائر (Letterpress) والختم الحراري بالذهب والفضة (Hot Foil Stamping).',
          'حواف مذهبة يدوياً بماء الذهب لتعطي لمعاناً ساحراً عند إخراج الكرت من المحفظة.',
        ],
        goldenQuote: 'المدير الناجح يصرف ملايين على بدلته وساعته، ولا يقبل أبداً أن يقدم لضيوفه كرتاً ورقياً رخيصاً ينثني في الجيب.',
        fieldTip: 'ضع دائماً في محفظتك الشخصية 3 كروت قطنية بنماذج مختلفة. أثناء حديثك معه، أخرج كرتك وقدمه له بكل هدوء وانتظر حتى يلمس ملمس القطن بأصابعه.',
      },
    ],
    wordForWordPitchScript: `«أستاذنا العزيز، كبار الشخصيات التنفيذية ورؤساء مجالس الإدارة لا يقدمون كروتاً اعتيادية. الكرت القطني 700 غم بحوافه المذهبة هو توقيعك الصامت الذي يفرض هيبتك في أي مؤتمر أو اجتماع عمل. نحن ننتج كميات محدودة بنظام التخصيص الفردي مع صندوق خشبي فاخر لحفظ الكروت على مكتبك مجاناً مع كل طلب 500 كرت.»`,
    objectionsHandled: [
      {
        objection: 'الكرت في النهاية يرمى في سلة المهملات، فلماذا أدفع سعراً باهظاً؟',
        clientMindset: 'تجربته السابقة مع الكروت الورقية العادية الخفيفة.',
        bestScriptAr: '«الكرت العادي 300 غم يرمى فعلاً لأنه لا قيمة له. لكن أتحداك أستاذي أن يقوم أي شخص برمي كرت قطني مذهب وزنه 700 غم ومحفور بالذهب! الزبون يحتفظ به في محفظته كتحفة تذكارية لسنوات، وهذا هو الفرق بين الإعلان العابر والوجود الدائم.»',
        avoidSayingAr: '«لا أحد يرمي كروتنا لأنها غالية.»',
      },
    ],
    stats: {
      views: 395,
      shares: 44,
      savedCount: 78,
    },
    reactions: {
      like: 48,
      love: 38,
      insight: 27,
      fire: 41,
      clap: 19,
    },
    userReaction: null,
    comments: [],
  },
  {
    id: 'art-fabric-secrets',
    titleAr: 'أسرار فحص جودة خامات الأكريليك والجلد المعالج والخشب الطبيعي في دار نون والقلم',
    titleEn: 'Quality Inspection Secrets: Acrylic, Treated Leather & Natural Wood',
    slug: 'quality-inspection-secrets-materials',
    category: 'quality_secrets',
    categoryLabelAr: 'أسرار الخامات والطباعة الفاخرة',
    difficulty: 'beginner',
    difficultyLabelAr: 'أساسي وتثقيفي',
    readingTimeMinutes: 5,
    publishedAt: 'منذ أسبوع',
    featured: false,
    author: {
      name: 'سارة التميمي',
      role: 'استشارية تسويق وهدايا الشركات',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      experienceYears: 6,
    },
    summaryAr: 'الدليل التقني المبسط لشرح الفروقات العلمية للعميل: الأكريليك الصب (Cast) مقابل المسحوب (Extruded)، والجلد الطبيعي المعالج بالحرارة ضد التقشير.',
    coverImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    heroBadgeAr: 'المعرفة الفنية هي قوة إقناعك 🔍',
    sections: [
      {
        title: 'الفرق القاتل بين الأكريليك الأصلي والتقليد التجاري',
        content: 'في السوق التجاري تباع دروع أكريليك بسعر رخيص جداً، لكن بعد 6 أشهر يتحول لونها إلى أصفر مغبش وتظهر فيها تشققات شعرية. السبب أنهم يستخدمون أكريليك Extruded رخيص غير مخصص للحفر الليزري.',
        bulletPoints: [
          'نون والقلم تستخدم فقط أكريليك Cast ألماني وتايواني نقي 100% بنسبة نفاذية ضوء 93% أعلى من الزجاج الطبيعي.',
          'القص بالليزر الصناعي يعطي حوافاً ناعمة كالمرآة بدون أي خشونة أو حاجة للتلميع اليدوي المتعب.',
          'مقاومة فائقة للمنظفات والمطهرات في المشافي والعيادات دون أن يتأثر بريق اللوحة.',
        ],
      },
    ],
    wordForWordPitchScript: `«أستاذي، عندما تشتري من نون والقلم أنت تستثمر في خامة كاست ألمانية معتمدة غير قابلة للاصفرار، مع قاعدة خشب زان طبيعي تم تجفيفها حرارياً في أفران خاصة لتتحمل جو العراق الصيفي دون أي التواء أو تشقق، مع شهادة ضمان معتمدة من ورشتنا في بغداد.»`,
    objectionsHandled: [
      {
        objection: 'كيف أتأكد أن الخشب طبيعي وليس خشب MDF رديء مضغوط؟',
        clientMindset: 'الخوف من الخامات التجارية المغشوشة المنتشرة في السوق.',
        bestScriptAr: '«سؤال ممتاز أستاذي! الخشب المضغوط ينتفخ ويتفكك فوراً إذا تعرض لنقطة ماء واحدة ووزنه خفيف. خشبنا هو زان مصمت ثقيل بتموجات خشبية حية تراها وتلمسها بعينك، ويسعدنا أن تزور ورشتنا في بغداد لترى مراحل التصنيع بنفسك.»',
        avoidSayingAr: '«عليك أن تصدقنا لأننا لا نغش أحداً.»',
      },
    ],
    stats: {
      views: 260,
      shares: 22,
      savedCount: 41,
    },
    reactions: {
      like: 31,
      love: 19,
      insight: 35,
      fire: 16,
      clap: 10,
    },
    userReaction: null,
    comments: [],
  },
];

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      articles: INITIAL_ARTICLES,
      savedArticleIds: ['art-restaurant-menu'],
      selectedCategoryId: 'all',
      searchQuery: '',
      difficultyFilter: 'all',
      sortBy: 'featured',

      setSelectedCategoryId: (catId) => set({ selectedCategoryId: catId }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setDifficultyFilter: (diff) => set({ difficultyFilter: diff }),
      setSortBy: (sort) => set({ sortBy: sort }),

      toggleSaveArticle: (articleId) => {
        set((state) => {
          const isSaved = state.savedArticleIds.includes(articleId);
          const nextSaved = isSaved
            ? state.savedArticleIds.filter((id) => id !== articleId)
            : [...state.savedArticleIds, articleId];

          const updatedArticles = state.articles.map((art) => {
            if (art.id === articleId) {
              return {
                ...art,
                stats: {
                  ...art.stats,
                  savedCount: isSaved ? Math.max(0, art.stats.savedCount - 1) : art.stats.savedCount + 1,
                },
              };
            }
            return art;
          });

          return { savedArticleIds: nextSaved, articles: updatedArticles };
        });
      },

      toggleReaction: (articleId, reaction) => {
        set((state) => {
          const updatedArticles = state.articles.map((art) => {
            if (art.id !== articleId) return art;

            const current = art.userReaction;
            const newReactions = { ...art.reactions };

            if (current === reaction) {
              // User is un-reacting
              newReactions[reaction] = Math.max(0, newReactions[reaction] - 1);
              return {
                ...art,
                userReaction: null,
                reactions: newReactions,
              };
            }

            // If user had a different reaction previously, decrement it
            if (current) {
              newReactions[current] = Math.max(0, newReactions[current] - 1);
            }

            // Increment new reaction
            newReactions[reaction] = (newReactions[reaction] || 0) + 1;

            return {
              ...art,
              userReaction: reaction,
              reactions: newReactions,
            };
          });

          return { articles: updatedArticles };
        });
      },

      addComment: (articleId, { authorId, authorName, authorRank, authorCity, text }) => {
        if (!text.trim()) return;

        const newComment: AcademyComment = {
          id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          authorId,
          authorName,
          authorRank,
          authorCity,
          authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=1c1917,78350f,0f766e`,
          createdAt: 'الآن',
          text: text.trim(),
          likesCount: 0,
          isLikedByMe: false,
          replies: [],
        };

        set((state) => ({
          articles: state.articles.map((art) => {
            if (art.id !== articleId) return art;
            return {
              ...art,
              comments: [newComment, ...art.comments],
            };
          }),
        }));
      },

      toggleCommentLike: (articleId, commentId) => {
        set((state) => ({
          articles: state.articles.map((art) => {
            if (art.id !== articleId) return art;
            return {
              ...art,
              comments: art.comments.map((comm) => {
                if (comm.id !== commentId) return comm;
                const wasLiked = comm.isLikedByMe;
                return {
                  ...comm,
                  isLikedByMe: !wasLiked,
                  likesCount: wasLiked ? Math.max(0, comm.likesCount - 1) : comm.likesCount + 1,
                };
              }),
            };
          }),
        }));
      },

      addReply: (articleId, commentId, { authorName, authorRank, text }) => {
        if (!text.trim()) return;

        const newReply: AcademyCommentReply = {
          id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          authorName,
          authorRank,
          authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=1c1917,78350f`,
          createdAt: 'الآن',
          text: text.trim(),
          likesCount: 0,
          isLikedByMe: false,
        };

        set((state) => ({
          articles: state.articles.map((art) => {
            if (art.id !== articleId) return art;
            return {
              ...art,
              comments: art.comments.map((comm) => {
                if (comm.id !== commentId) return comm;
                return {
                  ...comm,
                  replies: [...comm.replies, newReply],
                };
              }),
            };
          }),
        }));
      },

      toggleReplyLike: (articleId, commentId, replyId) => {
        set((state) => ({
          articles: state.articles.map((art) => {
            if (art.id !== articleId) return art;
            return {
              ...art,
              comments: art.comments.map((comm) => {
                if (comm.id !== commentId) return comm;
                return {
                  ...comm,
                  replies: comm.replies.map((rep) => {
                    if (rep.id !== replyId) return rep;
                    const wasLiked = rep.isLikedByMe;
                    return {
                      ...rep,
                      isLikedByMe: !wasLiked,
                      likesCount: wasLiked ? Math.max(0, rep.likesCount - 1) : rep.likesCount + 1,
                    };
                  }),
                };
              }),
            };
          }),
        }));
      },

      incrementViewCount: (articleId) => {
        set((state) => ({
          articles: state.articles.map((art) => {
            if (art.id !== articleId) return art;
            return {
              ...art,
              stats: {
                ...art.stats,
                views: art.stats.views + 1,
              },
            };
          }),
        }));
      },

      shareArticle: (articleId) => {
        set((state) => ({
          articles: state.articles.map((art) => {
            if (art.id !== articleId) return art;
            return {
              ...art,
              stats: {
                ...art.stats,
                shares: art.stats.shares + 1,
              },
            };
          }),
        }));
      },
    }),
    {
      name: 'noon-academy-social-storage-v1',
    }
  )
);
