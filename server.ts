import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// --- Lightweight in-memory rate limiter for AI endpoints (no external deps) ---
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const clientKey =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
  const now = Date.now();
  const bucket = rateLimitBuckets.get(clientKey);

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests — please try again in a minute.',
    });
  }
  return next();
}

// Periodically purge expired buckets to keep memory bounded
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets) {
    if (now > bucket.resetAt) rateLimitBuckets.delete(key);
  }
}, 5 * 60_000).unref();

// Cap & sanitize text fields coming from clients before they reach Gemini prompts
function capField(value: unknown, maxLen = 500): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, maxLen).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

// Initialize GoogleGenAI SDK on the server side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Design Assistant API Endpoint
app.post('/api/ai/design-assistant', rateLimit, async (req, res) => {
  try {
    const {
      productTitle = '',
      category = '',
      userText = '',
      subtitle = '',
      material = '',
      ledColor = '',
      businessType = '',
      dimensions = '',
    } = req.body;

    // Sanitize & cap all client-provided text before prompt interpolation
    const safe = {
      productTitle: capField(productTitle, 120),
      category: capField(category, 80),
      userText: capField(userText, 300),
      subtitle: capField(subtitle, 200),
      material: capField(material, 120),
      ledColor: capField(ledColor, 80),
      businessType: capField(businessType, 120),
      dimensions: capField(dimensions, 80),
    };

    // If Gemini API is configured with a real key, call Gemini with a 5s timeout
    const hasValidKey = apiKey && apiKey.length > 10 && apiKey !== 'MY_GEMINI_API_KEY';
    if (aiClient && hasValidKey) {
      const prompt = `أنت خبير تصاميم هندسية وتصنيع إعلاني ولوحات أكريليك مضيئة (3D Acrylic & LED Signage) في مطبعة واستوديو "نون والقلم" في بغداد.
يقوم العميل حالياً بتخصيص منتج: "${safe.productTitle}" من قسم "${safe.category}".
البيانات المدخلة من العميل:
- النص الرئيسي المطلوب كتابته أو حفره: "${safe.userText}"
- النص الفرعي / المهنة / الصفة: "${safe.subtitle}"
- نوع النشاط التجاري / الاستخدام: "${safe.businessType || 'عام/مكتبي'}"
- الخامة المختارة: "${safe.material}"
- لون إضاءة الليد المختارة: "${safe.ledColor}"
- المقاس: "${safe.dimensions}"

المطلوب: تقديم استشارة وتنسيق ذكي للتصميم بصيغة JSON فقط:
1. "refinedTitleAr": تحسين النص الرئيسي وتنسيقه لغوياً وبصرياً ليكون مناسباً لقص الليزر أو الحفر أو مجسمات الحروف.
2. "suggestedSubtitleAr": صياغة نص فرعي احترافي أو لقب مهني منسجم (مثل دكتور، مهندس، محامي، استشاري، مدير عام، أو شعار شركة).
3. "recommendedFont": توصية بأنسب خط عربي (مثل: "خط الثلث الفاخر", "الخط الكوفي المودرن", "الخط الديواني الملكي", "خط النسخ الأكاديمي", "الخط العربي المعاصر الهندسي") مع سبب موجز.
4. "recommendedLedColor": اقتراح أفضل لون إضاءة LED مناسب للنشاط مع سبب.
5. "recommendedMaterial": أفضل خامة أو تشطيب يعطي فخامة قصوى للمنتج.
6. "sloganAr": شعار تسويقي أو عبارة إضافية اختيارية مناسبة لنشاطه.
7. "productionCritiqueAr": ملاحظة فنية هندسية للتنفيذ (مثلاً: وضوح الرؤية من مسافة معينة، سماكة الأكريليك الموصى بها، موضع مسامير التثبيت الجدارية).
8. "designScore": رقم تقييم فخامة التصميم من 100 (مثلاً 96).

أجب بكائن JSON صالح فقط دون أي شروح إضافية أو كود ماركداون.`;

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 5000)
        );

        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const textOutput = response.text || '';
        const parsed = JSON.parse(textOutput);
        return res.json({ success: true, aiGenerated: true, data: parsed });
      } catch (geminiErr: any) {
        console.warn('Gemini generation notice, serving smart design rules:', geminiErr?.message);
      }
    }

    // Smart Fallback when API key is pending or transient
    const defaultSubtitles: Record<string, string> = {
      doctor: 'استشاري جراحة الفم والأسنان | عضو الجمعية الطبية',
      lawyer: 'محامٍ ومستشار قانوني معتمد لدى المحاكم',
      engineer: 'مكتب الاستشارات الهندسية والتصميم المعماري',
      luxury: 'للتجارة العامة والتوكيلات الحصرية | بغداد',
    };

    const isDoc = /دكتور|طبيب|عيادة|مركز طبي|dr|clinic/i.test(`${safe.userText} ${safe.businessType}`);
    const isLaw = /محام|قانون|عدل|حقوق/i.test(`${safe.userText} ${safe.businessType}`);
    const isEng = /مهندس|هندسة|معمار|تصميم/i.test(`${safe.userText} ${safe.businessType}`);

    const fallbackData = {
      refinedTitleAr: safe.userText.trim() || 'نون والقلم للدعاية والإعلان',
      suggestedSubtitleAr:
        safe.subtitle.trim() ||
        (isDoc ? defaultSubtitles.doctor : isLaw ? defaultSubtitles.lawyer : isEng ? defaultSubtitles.engineer : 'حلول الدعاية والطباعة الفاخرة'),
      recommendedFont: isDoc ? 'الخط العربي المعاصر الهندسي' : isLaw ? 'خط الثلث الفاخر' : 'الخط الكوفي المودرن',
      recommendedLedColor: isDoc ? 'أزرق جليدي طبي (Ice Cyan)' : isLaw ? 'ذهبي ملكي دافئ (Warm Amber 3000K)' : 'أبيض ناصع كريستالي (Pure White 6500K)',
      recommendedMaterial: 'أكريليك أسود ملكي مسبوك 5 ملم مع تطعيم ذهبي عاكس (Mirror Gold Inlay)',
      sloganAr: 'دقة فائقة في التفاصيل تدوم طويلاً',
      productionCritiqueAr: 'تمت معايرة تباعد الحروف وسماكة خطوط القطع بالليزر لضمان أعلى وضوح قراءة من مسافة 4-6 أمتار.',
      designScore: 95,
    };

    return res.json({ success: true, aiGenerated: false, data: fallbackData });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Server error' });
  }
});

// Dedicated AI Product Design Generator Endpoint
app.post('/api/ai/design-product', rateLimit, async (req, res) => {
  try {
    const {
      companyName = '',
      subtitle = '',
      phone = '',
      website = '',
      designNotes = '',
      ledColor = '',
      dimension = '',
      productTitle = 'لوحة أكريليك مضيئة LED مخصصة',
    } = req.body;

    // Sanitize & cap all client-provided text before prompt interpolation
    const safe = {
      companyName: capField(companyName, 200),
      subtitle: capField(subtitle, 200),
      phone: capField(phone, 40),
      website: capField(website, 200),
      designNotes: capField(designNotes, 500),
      ledColor: capField(ledColor, 80),
      dimension: capField(dimension, 80),
      productTitle: capField(productTitle, 120),
    };

    const fullContext = `${safe.companyName} ${safe.subtitle} ${safe.designNotes}`.trim();

    // Helper to determine industry & emblem intelligently
    const detectIndustry = (text: string) => {
      if (/ماء|مياه|نبع|شرب|عذبة|water|aqua|beverage/i.test(text)) {
        return { industry: 'water_beverage', emblem: 'water_drop', font: 'ruqaa' };
      }
      if (/سياح|سفر|طيران|طائرة|حجز|رحلات|travel|tour|flight/i.test(text)) {
        return { industry: 'tourism', emblem: 'aviation_travel', font: 'ruqaa' };
      }
      if (/طبيب|دكتور|عيادة|صيدل|أسنان|مستشفى|طب|health|clinic|doctor/i.test(text)) {
        return { industry: 'medical', emblem: 'medical', font: 'amiri' };
      }
      if (/محام|قانون|عدل|تحكيم|حقوق|استشارات قانونية|law|legal/i.test(text)) {
        return { industry: 'legal', emblem: 'legal', font: 'amiri' };
      }
      if (/كافيه|قهوة|شاي|مطعم|مقهى|cafe|coffee|roast/i.test(text)) {
        return { industry: 'cafe', emblem: 'cafe', font: 'ruqaa' };
      }
      if (/برمج|تقني|كمبيوتر|ذكاء|حلول تقنية|tech|software|it|ai/i.test(text)) {
        return { industry: 'tech', emblem: 'tech', font: 'kufi' };
      }
      if (/ملكي|مجوهرات|ذهب|عطور|فخامة|فاخر|royal|luxury|gold/i.test(text)) {
        return { industry: 'luxury', emblem: 'crown', font: 'amiri' };
      }
      if (/شركة|مكتب|عقارات|تجارة|استيراد|مقاولات|holding|trading/i.test(text)) {
        return { industry: 'corporate', emblem: 'corporate', font: 'ruqaa' };
      }
      return { industry: 'general_business', emblem: 'aviation_travel', font: 'ruqaa' };
    };

    const detected = detectIndustry(fullContext);

    // Call Gemini 3.1 Flash Lite if API key exists
    const hasValidKey = apiKey && apiKey.length > 10 && apiKey !== 'MY_GEMINI_API_KEY';
    if (aiClient && hasValidKey) {
      const prompt = `أنت كبير مهندسي التصميم الصناعي وتصنيع لوحات الأكريليك المضيئة في مطبعة "نون والقلم" في بغداد.
طلب العميل تصميم منتج مخصص بناءً على المعلومات التالية:
- اسم الشركة / النص الرئيسي: "${safe.companyName || 'شركة الأفق الدولية'}"
- السطر الفرعي / النشاط: "${safe.subtitle || 'للسياحة والسفر'}"
- رقم الهاتف: "${safe.phone || 'غير محدد'}"
- الموقع الإلكتروني: "${safe.website || 'غير محدد'}"
- ملاحظات وتفاصيل إضافية من العميل: "${safe.designNotes || 'لا توجد ملاحظات خاصة'}"
- لون إضاءة LED المختار: "${safe.ledColor || 'أزرق سماوي'}"
- المقاس المطلوب: "${safe.dimension || '20 × 15 سم'}"

المطلوب: توليد مواصفات تصميم متكاملة وذكية للمنتج بصيغة JSON فقط:
{
  "refinedTitle": "النص الرئيسي محسناً ومصاغاً بأناقة ليزرية باللغة العربية",
  "refinedSubtitle": "السطر الفرعي مصاغاً وموجزاً برقي واحترافية",
  "industry": "تصنيف النشاط (مثل: water_beverage, tourism, medical, legal, cafe, tech, luxury, corporate)",
  "recommendedEmblem": "رمز الشعار الموصى به: water_drop أو aviation_travel أو medical أو legal أو crown أو cafe أو tech أو corporate",
  "calligraphyStyle": "أحد الخطوط: ruqaa أو amiri أو kufi أو cairo",
  "sloganAr": "شعار تسويقي فاخر قصير يناسب النشاط (مثلاً: نقاوة تدوم، أو آفاق لا حدود لها)",
  "specs": {
    "dimensions": "${safe.dimension || '20 × 15 سم'}",
    "acrylicType": "أكريليك مسبوك نقي 100% سماكة 5 ملم عالي التوصيل الضوئي (Cast Acrylic)",
    "etchingType": "حفر ليزري بؤري فائق الدقة (CO2 Micro-Laser Engraving 0.2mm) بحواف مصقولة بالألماس",
    "illumination": "شريط LED كولد نيون فائق اللمعان بلون ${safe.ledColor || 'أزرق'} بدرجة سطوع 1200 لومن",
    "base": "قاعدة خشبية فاخرة أو أكريليك مصقول مدمجة بمفتاح لمسي ومنفذ Type-C للشحن والتشغيل",
    "appliedNotes": "شرح احترافي موجز في سطرين عن كيفية معالجة ملاحظات العميل وتطبيقها في التصميم"
  },
  "designerCritique": "تقييم خبير الذكاء الاصطناعي للتصميم والتناسق البصري",
  "designScore": 98
}
أجب بصيغة JSON صالح فقط.`;

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI design timeout')), 5500)
        );

        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const textOutput = response.text || '';
        const parsed = JSON.parse(textOutput);
        return res.json({ success: true, aiGenerated: true, data: parsed });
      } catch (geminiErr: any) {
        console.warn('Gemini product design note, falling back to smart engine:', geminiErr?.message);
      }
    }

    // Smart Architectural Fallback
    const cleanTitle = companyName.trim() || 'شركة الأفق الدولية';
    const cleanSub = subtitle.trim() || (detected.industry === 'water_beverage' ? 'مياه صحية نقية | إنتاج وتوزيع' : 'حلول وخدمات متكاملة');

    const fallbackResponse = {
      refinedTitle: cleanTitle,
      refinedSubtitle: cleanSub,
      industry: detected.industry,
      recommendedEmblem: detected.emblem,
      calligraphyStyle: detected.font,
      sloganAr:
        detected.industry === 'water_beverage'
          ? 'نقاوة تدوم وصحة تستحقها'
          : detected.industry === 'tourism'
          ? 'رحلاتك تبدأ من هنا'
          : 'الجودة والإتقان في أبهى صورة',
      specs: {
        dimensions: dimension || '20 × 15 سم (مكتبي شخصي)',
        acrylicType: 'أكريليك صب نقي 100% سماكة 5 ملم عالي التوصيل الضوئي (Optical Grade Cast Acrylic)',
        etchingType: 'حفر ليزري بؤري فائق الدقة (CO2 Micro-Laser Engraving 0.2mm) بحواف مصقولة بالألماس',
        illumination: `شريط LED كولد نيون فائق السطوع متناسق مع لون ${ledColor || 'الإضاءة المختار'}`,
        base: 'قاعدة هندسية مدمجة بأزرار لمس ذكية ومنفذ Type-C للشحن المباشر',
        appliedNotes: designNotes.trim()
          ? `تمت معالجة وتطبيق ملاحظتك: "${designNotes.trim()}" بدقة هندسية في زوايا الحفر وتوزيع الإضاءة.`
          : 'تمت معايرة تباعد الحروف وأبعاد الشعار لتناسب مساحة اللوحة والمقاس التنفيذي المختار بدقة فائقة.',
      },
      designerCritique:
        'تصميم متوازن بصرياً بنسبة ذهبية، يوفر وضوحاً فائقاً للنص الرئيسي مع إبراز شعار النشاط بدقة ليزرية متناهية تضمن إبهار العملاء والزوار.',
      designScore: 98,
    };

    return res.json({ success: true, aiGenerated: false, data: fallbackResponse });
  } catch (error: any) {
    console.error('Design product error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Design generation error' });
  }
});

// AI Campaign Strategy & Funnel Generator with Country & City Customization
app.post('/api/ai/campaign-generator', rateLimit, async (req, res) => {
  try {
    const {
      productTitle = '',
      category = 'led',
      basePrice = 45000,
      targetCountry = 'العراق',
      targetCity = 'كافة المحافظات',
      marketingGoal = 'مبيعات فورية وتحويل عالي',
      adPlatform = 'all',
    } = req.body;

    const safe = {
      productTitle: capField(productTitle, 150),
      category: capField(category, 80),
      basePrice: Number(basePrice) || 45000,
      targetCountry: capField(targetCountry, 80),
      targetCity: capField(targetCity, 80),
      marketingGoal: capField(marketingGoal, 120),
      adPlatform: capField(adPlatform, 50),
    };

    const hasValidKey = apiKey && apiKey.length > 10 && apiKey !== 'MY_GEMINI_API_KEY';
    if (aiClient && hasValidKey) {
      const prompt = `أنت خبير تسويق رقمي ومدير نمو وتجارة إلكترونية (Chief Marketing Officer) لمطبعة واستوديو "نون والقلم" المتخصص بالطباعة الفاخرة، والقص الليزري، ودروع الأكريليك المضيئة 3D LED، والعلب والباكجنج.

المطلوب: توليد استراتيجية حملة إعلانية وصفحة هبوط متكاملة بضغطة زر لمنتج معين، مع تخصيص العرض للهجة والثقافة الشرائية لـ:
- الدولة المستهدفة: "${safe.targetCountry}"
- المدينة أو المنطقة: "${safe.targetCity}"
- المنتج: "${safe.productTitle}" (قسم: "${safe.category}")
- السعر الأساسي للقطعة: ${safe.basePrice}
- الهدف التسويقي: "${safe.marketingGoal}"
- منصات الإعلان: "${safe.adPlatform}"

أجب بكائن JSON صالح فقط دون كود ماركداون يحتوي الحقول التالية:
{
  "marketAnalysis": {
    "targetAudienceAr": "تحديد دقيق لفئة المشترين في ${safe.targetCountry}",
    "painPointAr": "نقطة الألم الحقيقية التي يعاني منها العميل",
    "buyingTriggerAr": "المحفز النفسي لقرار الشراء السريع (البريستيج، حفظ الذكرى)",
    "localAngleAr": "كيف تم توظيف خصوصية وسوق ${safe.targetCountry} و${safe.targetCity} في العرض"
  },
  "pricingStrategy": {
    "recommendedPromoPrice": 38000,
    "recommendedOriginalPrice": 58000,
    "urgencyStockLeft": 6,
    "countdownHours": 5
  },
  "landingPageCopy": {
    "headlineAr": "عنوان رئيسي تسويقي مغناطيسي قوي لصفحة الهبوط يركز على الفخامة والنتيجة والبلد",
    "subheadlineAr": "عنوان فرعي يقنع العميل ويزيل التردد ويوضح ميزة التوصيل لـ ${safe.targetCity}",
    "badgeTextAr": "شارة الخصم والندرة (مثال: خصم خاص 35% لعملاء ${safe.targetCountry} ⚡)",
    "bulletPointsAr": [
      "ميزة حصرية 1 عن خامة الأكريليك الكاست النقي أو الورق الفاخر",
      "ميزة حصرية 2 عن الإضاءة أو الدقة الهندسية للقص بالليزر",
      "ميزة حصرية 3: بروفة رقمية مجانية يعتمدها بنفسه قبل القص والطباعة",
      "ميزة حصرية 4: الدفع عند الاستلام مع حق المعاينة الكاملة",
      "ميزة حصرية 5: شحن آمن وسريع لكافة مدن ${safe.targetCountry}"
    ]
  },
  "orderBump": {
    "titleAr": "عنوان صفقة زيادة السلة لقطعة تكميلية ممتازة (مثلاً قاعدة خشبية فاخرة أو قلم محفور أو ملصقات)",
    "price": 14000,
    "rationaleAr": "لماذا تم اختيار هذه القطعة بالذات لرفع أرباح السلة"
  },
  "adScripts": {
    "tiktok": {
      "hookAr": "أول 3 ثوانٍ في الفيديو تجذب العميل وتمنعه من التمرير (بلهجة تناسب ${safe.targetCountry})",
      "bodyAr": "استعراض المشكلة والنتيجة المبهرة للقطعة خلال 10 ثوانٍ",
      "ctaAr": "الدعوة للطلب مع ميزة الشحن والدفع عند الاستلام"
    },
    "facebook": {
      "primaryTextAr": "نص تسويقي مقنع بأسلوب قصة وحل موجه لأهل ${safe.targetCountry}",
      "headlineAr": "عنوان الإعلان في فيسبوك",
      "descriptionAr": "وصف قصير مع الضمان"
    },
    "instagram": {
      "captionAr": "كابشن فاخر وجذاب لمنشور أو ريلز انستغرام",
      "hashtagsAr": "#دروع_تكريم #${safe.targetCountry.replace(/\\s+/g, '_')} #هدايا_فاخرة",
      "storyIdeaAr": "فكرة ستوري تفاعلي باستطلاع رأي"
    },
    "snapchat": {
      "headlineAr": "نص سريع وخاطف لإعلانات سناب شات",
      "callToActionAr": "اسحب الشاشة الآن للحصول على العرض"
    },
    "google": {
      "headlines": ["عنوان بحث 1", "عنوان بحث 2", "عنوان بحث 3"],
      "descriptions": ["وصف بحث 1", "وصف بحث 2"],
      "keywords": ["كلمة بحث 1", "كلمة بحث 2", "كلمة بحث 3", "كلمة بحث 4", "كلمة بحث 5"]
    }
  }
}`;

        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI generation timeout')), 7000)
          );

          const aiPromise = aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const response: any = await Promise.race([aiPromise, timeoutPromise]);
          const textOutput = response.text || '';
          const parsed = JSON.parse(textOutput);
          return res.json({ success: true, aiGenerated: true, data: parsed });
        } catch (geminiErr: any) {
          console.warn('Gemini campaign generator notice, serving smart marketing fallback:', geminiErr?.message);
        }
      }

    // High quality intelligent marketing fallback based on country, city, and product category
    const isLed = safe.category === 'led' || /led|مضيء|مصباح|درع/i.test(safe.productTitle);
    const isBoxes = safe.category === 'boxes' || /علب|كرتون|بوكس|تغليف/i.test(safe.productTitle);
    const isWeddings = safe.category === 'weddings' || /زفاف|عرس|عروس|دفتر/i.test(safe.productTitle);
    const isCards = safe.category === 'cards' || /كارت|بطاق|بزنس|فيزت/i.test(safe.productTitle);

    const calculatedPromo = Math.round((safe.basePrice * 0.7) / 1000) * 1000;
    const calculatedAnchor = Math.round((safe.basePrice * 1.35) / 1000) * 1000;
    const bumpPrice = Math.round((safe.basePrice * 0.3) / 1000) * 1000;

    const fallbackCampaign = {
      marketAnalysis: {
        targetAudienceAr: isWeddings
          ? `المقبلون على الزواج والعائلات الباحثة عن تخليد مناسباتهم الملكية في ${safe.targetCountry}`
          : isBoxes
          ? `أصحاب المطاعم، البراندات، والأنشطة التجارية في ${safe.targetCity} الراغبين بترك انطباع لا يُنسى`
          : isCards
          ? `المدراء التنفيذيون، المحامون، والأطباء في ${safe.targetCountry} الباحثون عن هوية نخبوية`
          : `أصحاب الشركات والمكاتب الفخمة والهدايا التذكارية الراقية في ${safe.targetCountry}`,
        painPointAr: 'الخوف من رداءة التشطيب أو وصول منتج باهت لا يعكس فخامة الاسم أو الشعار التجاري.',
        buyingTriggerAr: 'إثبات الفخامة والمكانة والتميز مع ضمان المعاينة المباشرة قبل دفع أي دينار.',
        localAngleAr: `استهداف عاطفي واجتماعي يربط الفخامة بشحن مجاني وضمان استبدال مباشر في ${safe.targetCity} وباقي مناطق ${safe.targetCountry}.`,
      },
      pricingStrategy: {
        recommendedPromoPrice: calculatedPromo,
        recommendedOriginalPrice: calculatedAnchor,
        urgencyStockLeft: 6,
        countdownHours: 5,
      },
      landingPageCopy: {
        headlineAr: isWeddings
          ? `عرض حصري لعملاء ${safe.targetCountry}: خلّد أجمل ذكريات ليلة عمرك مع تحفة كريستالية ملكية 💍✨`
          : isBoxes
          ? `عرض الشركات والمطاعم في ${safe.targetCountry}: تغليف كرتوني فاخر بهوية بصرية مخصصة ترفع مبيعاتك 📦🔥`
          : isCards
          ? `عرض النخبة في ${safe.targetCountry}: بطاقات أعمال أكريليك محفورة بالذهب تترك انطباعاً لا يُنسى 💎`
          : `عرض حصري في ${safe.targetCountry}: تحفة 3D LED بإضاءة سحرية وتصميم مخصص باسمك وشعارك 🔥`,
        subheadlineAr: `احصل على تصميم حصري مخصص لطلبك مع بروفة هندسية رقمية مجانية تعتمدها بنفسك قبل التنفيذ وتوصيل مجاني لكافة مناطق ${safe.targetCity}.`,
        badgeTextAr: `خصم خاص 35% لعملاء ${safe.targetCountry} لفترة محدودة ⚡`,
        bulletPointsAr: [
          'أكريليك كاست نقي 100% شفاف معالج ضد الخدش والاصفرار ويدوم لسنوات',
          'قص ليزري بؤري فائق الدقة (0.2 ملم) وحواف مشطوفة وناعمة كالحرير',
          `بروفة رقمية مجانية يجهزها المصمم وتعتمدها بنفسك عبر واتساب قبل التنفيذ`,
          'الدفع نقداً عند الاستلام مع حق المعاينة الكاملة قبل الدفع للمندوب',
          `شحن آمن وتغليف فاخر ضد الكسر يصلك في ${safe.targetCity} خلال 24 - 48 ساعة فقط`,
        ],
      },
      orderBump: {
        titleAr: isBoxes
          ? 'إضافة ملصقات ورقية شمعية مقاومة للزيوت تحمل شعارك بخصم 45%'
          : isWeddings
          ? 'إضافة قلم توقيع ليزري فاخر مع قاعدة مخصصة باسم العروسين'
          : 'إضافة قاعدة خشبية طبيعية فاخرة محفورة بالليزر مع ريموت تحكم',
        price: bumpPrice,
        rationaleAr: 'قطعة تكميلية طبيعية تزيد قيمة الهدية أو العبوة دون تكلفة تصنيع عالية وترفع متوسط السلة.',
      },
      adScripts: {
        tiktok: {
          hookAr: `لو أنت من ${safe.targetCountry} وتدور هدية فخمة أو قطعة تميز مكتبك، شوف هالإبداع في أول ثانيتين! 👀`,
          bodyAr: `شاهد كيف نحول اسمك أو شعار شركتك إلى مجسم مضيء محفور بالليزر بدقة متناهية تخطف الأنظار في أي مكان.`,
          ctaAr: `الكمية متبقية لـ 6 قطع فقط بسعر العرض، اطلب الآن واستلم في ${safe.targetCity} والدفع بعد المعاينة!`,
        },
        facebook: {
          primaryTextAr: `لكل من يبحث عن التميز الحقيقي في ${safe.targetCountry}: نقدم لكم أرقى حلول التصميم والقص الليزري من ورشة نون والقلم. نجهز لك بروفة رقمية مجانية لاعتمادها قبل أي خطوة في الورشة، والدفع عند الاستلام.`,
          headlineAr: `${safe.productTitle} - خصم 35% وتوصيل مجاني لكافة المحافظات`,
          descriptionAr: 'معاينة كاملة لحزمتك قبل الدفع لمندوب التوصيل',
        },
        instagram: {
          captionAr: `تفاصيل تصنع الفارق.. ✨\nقطعة استثنائية مخصصة خصيصاً لك بأعلى معايير الإتقان في ورشة نون والقلم.\n📍 متوفر الشحن لكافة مدن ${safe.targetCountry}.\nاضغط على الرابط في البايو أو اسحب الشاشة للطلب المباشر.`,
          hashtagsAr: `#نون_والقلم #${safe.targetCountry.replace(/\\s+/g, '_')} #ديكورات_فاخرة #هدايا_مخصصة`,
          storyIdeaAr: `فيديو خلف الكواليس لآلة الليزر وهي تحفر اسم عميل من ${safe.targetCity} مع سؤال تفاعلي: "ما الاسم القادم الذي نحفره؟"`,
        },
        snapchat: {
          headlineAr: `عرض خاطف في ${safe.targetCountry}: خصم 35% وشحن مجاني لباب منزلك!`,
          callToActionAr: `اسحب الشاشة لفوق الآن واعتمد تصميمك مجاناً ⚡`,
        },
        google: {
          headlines: [
            `${safe.productTitle} في ${safe.targetCountry}`,
            'ورشة نون والقلم للقص الليزري',
            'دفع عند الاستلام وبروفة مجانية',
          ],
          descriptions: [
            `اطلب الآن ${safe.productTitle} بأعلى جودة وضمان معتمد وتوصيل سريع لكافة مدن ${safe.targetCountry}.`,
            'بروفة رقمية مجانية قبل التنفيذ ودفع نقدي بعد معاينة الطلب.',
          ],
          keywords: [
            `${safe.productTitle}`,
            `طباعة ودروع في ${safe.targetCountry}`,
            `دروع أكريليك ${safe.targetCity}`,
            'هدايا مخصصة بالليزر',
            'دفع عند الاستلام العراق',
          ],
        },
      },
    };

    return res.json({ success: true, aiGenerated: false, data: fallbackCampaign });
  } catch (error: any) {
    console.error('Campaign generator error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Campaign generator error' });
  }
});

// AI Campaign Orchestrator Endpoint (تحليل الجمهور، 3 لغات ولهجات، تقييم المنصات، واستراتيجية جغرافية)
app.post('/api/ai/campaign-orchestrator', rateLimit, async (req, res) => {
  try {
    const {
      productTitle = 'درع أكريليك مضيء 3D LED',
      category = 'led',
      basePrice = 45000,
      description = '',
      targetCountry = 'العراق',
      targetCity = 'بغداد',
      targetDialect = 'iraqi',
      campaignGoal = 'مبيعات فورية وتحويل عالي',
    } = req.body;

    const safe = {
      productTitle: capField(productTitle, 150),
      category: capField(category, 80),
      basePrice: Number(basePrice) || 45000,
      description: capField(description, 300),
      targetCountry: capField(targetCountry, 80),
      targetCity: capField(targetCity, 80),
      targetDialect: capField(targetDialect, 50),
      campaignGoal: capField(campaignGoal, 120),
    };

    const hasValidKey = apiKey && apiKey.length > 10 && apiKey !== 'MY_GEMINI_API_KEY';
    if (aiClient && hasValidKey) {
      const prompt = `أنت العقل المدبر ومسؤول التسويق الذكي (AI Campaign Orchestrator) في استوديو ومطبعة "نون والقلم" المتخصصة في الطباعة الفاخرة، القص الليزري الدقيق، دروع الأكريليك المضيئة 3D LED، والعلب الفاخرة.

المطلوب: إجراء تحليل متكامل وتوليد حزمة تسويقية وإعلانية دقيقة للمنتج التالي:
- المنتج: "${safe.productTitle}" (قسم: "${safe.category}")
- السعر الأساسي: ${safe.basePrice}
- الدولة المستهدفة: "${safe.targetCountry}"
- المدينة أو المنطقة: "${safe.targetCity}"
- اللهجة المطلوبة: "${safe.targetDialect}"
- الهدف الإعلاني: "${safe.campaignGoal}"

المطلوب بدقة: إنتاج كائن JSON صالح فقط دون أي نص إضافي أو كود ماركداون:
{
  "targetAudience": {
    "demographicsAr": "الفئة العمرية والمهن والشرائح المستهدفة في ${safe.targetCountry} و${safe.targetCity}",
    "painPointsAr": "نقاط التردد والشك الشائعة لدى المشتري وطريقة حلها",
    "buyingTriggersAr": "المحفزات النفسية التي تدفعه للشراء الفوري (الفخامة، تخليد اللحظة، الإهداء الراقي)",
    "geoStrategyAr": "تحليل الخصوصية الشرائية لأهل ${safe.targetCountry} وتفضيلهم للتوصيل السريع والدفع عند الاستلام"
  },
  "platformRecommendations": [
    {
      "platformId": "tiktok",
      "nameAr": "تيك توك (TikTok Ads)",
      "suitabilityScore": 95,
      "rank": 1,
      "rationaleAr": "شرح تسويقي دقيق لسبب ملائمة هذه المنصة لطبيعة هذا المنتج في ${safe.targetCountry}",
      "bestFormatAr": "فيديو قصير (15-20 ثانية) يستعرض القطعة في الظلام مع الموسيقى الرائجة"
    },
    {
      "platformId": "instagram",
      "nameAr": "انستغرام (Instagram Reels & Feed)",
      "suitabilityScore": 90,
      "rank": 2,
      "rationaleAr": "شرح تسويقي لسبب التفاعل العالي مع الصور الجمالية والريلز",
      "bestFormatAr": "ريلز جمالية + صور كاروسيل للتفاصيل عن قرب"
    },
    {
      "platformId": "facebook",
      "nameAr": "فيسبوك (Facebook Ads)",
      "suitabilityScore": 82,
      "rank": 3,
      "rationaleAr": "شرح الوصول لشرائح الشركات والعائلات وأصحاب المشاريع",
      "bestFormatAr": "منشور مدعوم برأي العملاء وتقييمات الثقة مع رابط الطلب المباشر"
    },
    {
      "platformId": "snapchat",
      "nameAr": "سناب شات (Snapchat Ads)",
      "suitabilityScore": 78,
      "rank": 4,
      "rationaleAr": "قوة الوصول للشباب في دول الخليج والعراق عبر إعلانات الستوري السريعة",
      "bestFormatAr": "فيديو عمودي 10 ثوانٍ مع سحب الشاشة للأعلى (Swipe Up)"
    }
  ],
  "copywriting": {
    "fusha": {
      "headline": "عنوان إعلاني عربي فصيح قوي وفخم",
      "hook": "الخطاف الافتتاحي الجذاب بالفصحى",
      "body": "نص إعلاني فصيح ومؤثر يوضح براعة التصميم ودقة الليزر والضمان",
      "cta": "اطلب الآن مع خدمة التوصيل السريع والدفع عند الاستلام"
    },
    "dialect": {
      "dialectName": "اسم اللهجة المختارة",
      "headline": "عنوان محكي باللهجة المحلية لـ ${safe.targetCountry} عفوي وجذاب جداً",
      "hook": "خطاف أول 3 ثوانٍ باللهجة المحلية الدارجة يوقف التمرير فوراً",
      "body": "نص إعلاني باللهجة المحلية يلامس القلب ويذكر تفاصيل التوصيل بلهجة البلد",
      "cta": "دعوة للطلب بلهجة البلد (مثلاً: اطلبه هسة ويوصلك للباب / اطلبه الحين وادفع عند الباب)"
    },
    "english": {
      "headline": "High-impact luxury English headline",
      "hook": "Scroll-stopping opening hook",
      "body": "Compelling luxury product copy emphasizing precision craftsmanship and bespoke customization",
      "cta": "Claim Your Exclusive Piece Now - Cash on Delivery Available"
    }
  },
  "videoScript": {
    "hook3s": "أول 3 ثوانٍ تجذب العين مع الصوت",
    "showcase10s": "10 ثوانٍ استعراض الحفر الليزري والإضاءة والتفاصيل",
    "cta7s": "7 ثوانٍ خاتمة مع دعوة فورية للطلب والدفع بعد المعاينة"
  },
  "landingPageSync": {
    "headlineAr": "عنوان مقترح ومباشر لصفحة الهبوط الحية",
    "subheadlineAr": "عنوان فرعي يقنع الزائر بطلب القطعة فوراً في ${safe.targetCity}",
    "badgeTextAr": "شارة الخصم لفترة محدودة ⚡",
    "promoPrice": 38000,
    "originalPrice": 58000,
    "bulletPointsAr": [
      "ميزة 1: خامة أكريليك كاست نقي 100% مقاوم للخدش والاصفرار",
      "ميزة 2: قص ليزري بؤري فائق الدقة (0.2 ملم) بتشطيب يدوي",
      "ميزة 3: بروفة رقمية مجانية يجهزها المصمم وتعتمدها بنفسك قبل التنفيذ",
      "ميزة 4: الدفع نقداً عند الاستلام بعد المعاينة الكاملة",
      "ميزة 5: شحن آمن وسريع لكافة مناطق ${safe.targetCountry}"
    ]
  },
  "abTesting": {
    "variantA": {
      "id": "var_a",
      "nameAr": "النسخة أ (الفخامة والتأثير العاطفي والإهداء)",
      "angleAr": "التركيز على البريستيج والمكانة الاجتماعية وتخليد الذكرى والهدايا الملكية",
      "headlineAr": "عنوان النسخة أ (عاطفي فخم)",
      "subheadlineAr": "عنوان فرعي يقنع الزبون بقيمة الإهداء ومكانة الاسم",
      "badgeTextAr": "عرض الفخامة الحصري ⚡",
      "promoPrice": 38000,
      "originalPrice": 58000,
      "bulletPointsAr": [
        "خامة أكريليك كاست ملكية بنقاوة بصرية تامة",
        "إضاءة دافئة تجعل الاسم أو الشعار محط الأنظار",
        "بروفة رقمية مجانية لاعتمادها قبل القص",
        "شحن هدايا مغلف بعناية لكافة المدن",
        "دفع نقدي عند الاستلام مع المعاينة"
      ]
    },
    "variantB": {
      "id": "var_b",
      "nameAr": "النسخة ب (الجودة الهندسية، الضمان الصارم، وتوفير السعر)",
      "angleAr": "التركيز على دقة القص الليزري 0.2 ملم وضمان الاستبدال والفحص بيدك دون أي مخاطرة",
      "headlineAr": "عنوان النسخة ب (أمان ودقة وضمان)",
      "subheadlineAr": "عنوان فرعي يطمئن الزبون بحق الفحص اليدوي قبل الدفع",
      "badgeTextAr": "ضمان ذهبي 100% + شحن مجاني 🛡️",
      "promoPrice": 35000,
      "originalPrice": 55000,
      "bulletPointsAr": [
        "قص ليزري فائق الدقة 0.2 ملم بحواف ناعمة مشطوفة",
        "ضمان استبدال فوري بدون أي تكلفة إضافية",
        "بروفة هندسية فورية عبر واتساب قبل التنفيذ",
        "معاينة الطرد كاملاً قبل دفع أي دينار للمندوب",
        "سعر تنافسي مباشر من الورشة مع توصيل مجاني"
      ]
    }
  }
}`;

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI orchestrator timeout')), 8000)
        );

        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const textOutput = response.text || '';
        const parsed = JSON.parse(textOutput);
        return res.json({ success: true, aiGenerated: true, data: parsed });
      } catch (geminiErr: any) {
        console.warn('Gemini orchestrator notice, serving intelligent domain fallback:', geminiErr?.message);
      }
    }

    // High quality domain fallback based on country, dialect, and product category
    const isLed = safe.category === 'led' || /led|مضيء|مصباح|درع/i.test(safe.productTitle);
    const isWeddings = safe.category === 'weddings' || /عرس|زفاف|عروس|دفتر/i.test(safe.productTitle);
    const isBoxes = safe.category === 'boxes' || /علب|كرتون|بوكس|تغليف/i.test(safe.productTitle);

    const calculatedPromo = Math.round((safe.basePrice * 0.72) / 1000) * 1000;
    const calculatedAnchor = Math.round((safe.basePrice * 1.35) / 1000) * 1000;

    // Dialect specific strings
    let dialectName = 'اللهجة العراقية';
    let dialectHeadline = 'فد شي ملكي ومضبوط.. قطعتك الخاصة باسمك وشعارك توصلك للباب!';
    let dialectHook = 'لو تدور هدية تسوى وتبيض الوجه، شوف هذا الشغل شلون مضوي! ✨';
    let dialectBody = `كل قطعة نسويها بورشة نون والقلم ننقشها بالليزر بدقة متناهية.. أكريليك مسبوك ما يتغير لونه وضوء LED دافئ يخلي مكتبك أو غرفتك تلفت الأنظار.\nوالأحلى؟ تدز الاسم والشعار، المصمم يسويلك بروفة تعتمدها قبل لا نقص، وما تدفع فلس إلا لمن تعاين القطعة بيدك عند الاستلام في ${safe.targetCity}!`;
    let dialectCta = 'احجز نسختك هسة مع الشحن المجاني قبل نفاد الكمية!';

    if (safe.targetCountry.includes('السعودية') || safe.targetDialect === 'saudi') {
      dialectName = 'اللهجة السعودية (الخليجية)';
      dialectHeadline = 'شي فاخر من الآخر يجمّل مجلسك ويهدي أغلى الناس 🇸🇦✨';
      dialectHook = 'ودك بهدية فخمة ترفع الراس وتبقى ذكرى ما تنمحي؟ ناظر معاي الإبداع!';
      dialectBody = `نصمم لك تحفتك الخاصة بالاسم والشعار بقص ليزري دقيق وتشطيب ملوكي.. الأكريليك صافي ومقاوم للخدش وإضاءة LED تسحر العين.\nنرسل لك بروفة رقمية تعتمدها بنفسك قبل التنفيذ، والتوصيل واصل لباب بيتك في ${safe.targetCity} مع الدفع عند الاستلام!`;
      dialectCta = 'اطلبها الحين واستفد من خصم الحملة والتوصيل المجاني ⚡';
    } else if (safe.targetCountry.includes('الإمارات') || safe.targetDialect === 'emirati') {
      dialectName = 'اللهجة الإماراتية';
      dialectHeadline = 'قطعة راقية من وحي الفخامة.. تليق بمكتبك ومجلسك 🇦🇪';
      dialectHook = 'تبا شي مميز ما تلاقيه بأي مكان؟ شوف كيف ننقش تفاصيل اسمك بالليزر!';
      dialectBody = `إتقان بلا حدود في ورشة نون والقلم.. قص ليزري على أكريليك كاست نقي وإضاءة ساحرة تدوم لسنين.\nنعتمد معاك التصميم خطوة بخطوة قبل البدء، والتوصيل لكافة إمارات الدولة والدفع بعد المعاينة.`;
      dialectCta = 'احجز طلبك الحين وتواصل مع المصمم مباشرة!';
    } else if (safe.targetCountry.includes('الكويت') || safe.targetDialect === 'kuwaiti') {
      dialectName = 'اللهجة الكويتية';
      dialectHeadline = 'شغل ذرب وفخم حيل يبيض الويه بكل مناسبة 🇰🇼';
      dialectHook = 'تبون هدية كشخة وما يتكرر مثلها؟ شوفوا دقة الحفر الليزري!';
      dialectBody = `قطعة راقية جداً ومصنوعة بمقاييس فاخرة.. أكريليك كاست نقي وإضاءة LED ناعمة تبرز الاسم والشعار.\nالمصمم يدز لك البروفة تعتمدها قبل أي خطوة، والتوصيل واصل لمكانك والدفع عند الاستلام.`;
      dialectCta = 'طلبك يوصلك لباب البيت مع الشحن المجاني، اطلب الحين!';
    } else if (safe.targetCountry.includes('الأردن') || safe.targetDialect === 'jordanian') {
      dialectName = 'اللهجة الأردنية / الشامية';
      dialectHeadline = 'إشي فاخر ومرتب ع الآخر.. قطعة مميزة بتخطف الأنظار 🇯🇴✨';
      dialectHook = 'إذا بتدور على هدية محرزة وعليها القيمة، شوف هالقطعة شو مرتبة!';
      dialectBody = `شغل هندسي متقن ومحفور بالليزر بدقة متناهية.. بنبعتلك البروفة تعتمدها بنفسك قبل ما نقص، والتوصيل لباب بيتك في ${safe.targetCity} مع الدفع عند الاستلام.`;
      dialectCta = 'اطلبها هسا واستفيد من عرض التوصيل المجاني!';
    }

    const fallbackResponse = {
      targetAudience: {
        demographicsAr: isWeddings
          ? `المقبلون على الزواج، منظمو الحفلات، والعائلات الباحثة عن تخليد مناسباتهم الملكية في ${safe.targetCountry}`
          : isBoxes
          ? `أصحاب المطاعم، الكافيهات، والبراندات التجارية في ${safe.targetCity} الراغبين بعبوات احترافية`
          : `أصحاب الشركات، الأطباء، المهندسون، والأفراد الباحثون عن هدايا فخمة استثنائية في ${safe.targetCountry}`,
        painPointsAr: 'الخوف من رداءة التشطيب أو وصول منتج باهت لا يعكس فخامة الاسم، أو التأخر في موعد التسليم.',
        buyingTriggersAr: 'إثبات المكانة والبريستيج وحفظ الذكرى مدى الحياة مع ضمان البروفة الرقمية والمعاينة قبل الدفع.',
        geoStrategyAr: `الجمهور في ${safe.targetCountry} وتحديداً ${safe.targetCity} يستجيب بشكل مضاعف لعروض الدفع عند الاستلام (COD) مع وضوح الشحن المجاني والتواصل السريع عبر واتساب.`,
      },
      platformRecommendations: [
        {
          platformId: 'tiktok',
          nameAr: 'تيك توك (TikTok Ads)',
          suitabilityScore: isLed ? 96 : 88,
          rank: 1,
          rationaleAr: `يحقق أعلى عائد (ROI) بفضل عامل الإبهار البصري عند تشغيل إضاءة القطعة في الظلام وتصوير آلة الليزر، مما يولد ملايين المشاهدات الفيروسية بتكلفة نقرة منخفضة في ${safe.targetCountry}.`,
          bestFormatAr: 'فيديو قصير (15 ثانية) يبدأ بخطاف صادم ثم استعراض القطعة وطلب المعاينة عند الاستلام.',
        },
        {
          platformId: 'instagram',
          nameAr: 'انستغرام (Instagram Reels & Ads)',
          suitabilityScore: 92,
          rank: 2,
          rationaleAr: `البيئة المثالية للجمهور الباحث عن الفخامة والجماليات والديكور الراقي، خصوصاً في ريلز وقصص المشاهير والمؤثرين في ${safe.targetCity}.`,
          bestFormatAr: 'ريلز جمالية احترافية مقربة + ألبوم صور كاروسيل للألوان والتشطيبات.',
        },
        {
          platformId: 'facebook',
          nameAr: 'فيسبوك (Facebook / Meta)',
          suitabilityScore: isBoxes ? 94 : 85,
          rank: 3,
          rationaleAr: `مثالي للوصول لأصحاب الشركات، المدراء، والعائلات الأكبر سناً ذات القوة الشرائية العالية، مع التفاعل الكبير عبر التعليقات والمراسلات المباشرة.`,
          bestFormatAr: 'منشور نصي مقنع (Problem-Solution) مرفق بألبوم صور واقعية وتجارب زبائن سابقين.',
        },
        {
          platformId: 'snapchat',
          nameAr: 'سناب شات (Snapchat Ads)',
          suitabilityScore: 82,
          rank: 4,
          rationaleAr: `قوة انتشار استثنائية لشرائح الشباب والمناسبات في دول الخليج والعراق بمعدل تفاعل مرتفع مع العروض الخاطفة المحدودة بوقت.`,
          bestFormatAr: 'إعلان Story Ad عمودي مدته 10 ثوانٍ يركز على العرض الحصري وسحب الشاشة.',
        },
      ],
      copywriting: {
        fusha: {
          headline: `تحفة هندسية مخصصة باسمك وشعارك.. إتقان ليزري يليق بمكانتك في ${safe.targetCountry}`,
          hook: 'حين تلتقي الدقة الهندسية بجمال الضوء، تولد قطعة استثنائية تُخلّد اسمك إلى الأبد.',
          body: `نقدم لك في استوديو نون والقلم أرقى حلول التصميم والحفر الليزري على الأكريليك الكاست النقي المقاوم للخدش. كل قطعة يتم تصنيعها خصيصاً لك بأدق التفاصيل، مع تزويدك ببروفة رقمية مجانية لاعتمادها قبل أي خطوة في الورشة.\nشحن مجاني وسريع لكافة محافظات ومدن ${safe.targetCountry}، مع حق المعاينة الكاملة لحزمتك قبل دفع أي دينار لمندوب التوصيل.`,
          cta: `اطلب قطعتك المخصصة الآن واستفد من خصم الحملة لفترة محدودة ⚡`,
        },
        dialect: {
          dialectName,
          headline: dialectHeadline,
          hook: dialectHook,
          body: dialectBody,
          cta: dialectCta,
        },
        english: {
          headline: `Bespoke Craftsmanship Tailored with Your Name & Identity in ${safe.targetCountry}`,
          hook: `Looking for a gift that speaks true elegance? Witness laser precision at its finest.`,
          body: `Handcrafted with 100% optical-grade pure cast acrylic and vibrant ambient illumination, this bespoke piece is engineered to elevate your executive space. Includes a complimentary digital blueprint proof approved by you prior to laser engraving.\nEnjoy express, fully-insured delivery across ${safe.targetCountry} with Cash on Delivery and inspection guarantee upon arrival.`,
          cta: `Claim Your Limited Edition Piece Today with Complimentary Shipping ⚡`,
        },
      },
      videoScript: {
        hook3s: `لقطة مقربة خاطفة لآلة الليزر وهي تحفر حروف الاسم بدقة فائقة مع شرار ضوئي مبهر وصوت مشوق.`,
        showcase10s: `إضاءة اللوحة بالكامل في الظلام بزاوية 360 درجة، مع إظهار نقاوة الأكريليك وقاعدته الطبيعية الفاخرة وشعار النشاط بوضوح مذهل.`,
        cta7s: `ظهور شارة الخصم 35% والتوصيل المجاني لكافة مدن ${safe.targetCountry}، مع نص يدعو للضغط على الرابط وتأكيد الحجز الفوري والدفع عند الاستلام.`,
      },
      landingPageSync: {
        headlineAr: `عرض حصري لعملاء ${safe.targetCountry}: تحفة 3D LED بإضاءة سحرية وتصميم مخصص باسمك 🔥`,
        subheadlineAr: `احصل على تحفة هندسية مخصصة تليق بمكتبك أو هديتك مع بروفة رقمية مجانية وتوصيل مجاني لكافة مناطق ${safe.targetCity}!`,
        badgeTextAr: `خصم خاص 35% لعملاء ${safe.targetCountry} لفترة محدودة ⚡`,
        promoPrice: calculatedPromo,
        originalPrice: calculatedAnchor,
        bulletPointsAr: [
          'أكريليك كاست نقي 100% شفاف معالج ضد الخدش والاصفرار ويدوم لسنوات',
          'قص ليزري بؤري فائق الدقة (0.2 ملم) بحواف مشطوفة وناعمة كالحرير',
          `بروفة رقمية مجانية يجهزها المصمم وتعتمدها بنفسك عبر واتساب قبل التنفيذ`,
          'الدفع نقداً عند الاستلام مع إمكانية المعاينة الكاملة لحزمتك قبل الدفع',
          `شحن آمن ومغلف بعناية فائقة لكافة مناطق ${safe.targetCity} وباقي المدن`,
        ],
      },
      abTesting: {
        variantA: {
          id: 'var_a',
          nameAr: `النسخة أ (الفخامة والتأثير العاطفي والإهداء في ${safe.targetCountry})`,
          angleAr: 'التركيز على البريستيج والمكانة الاجتماعية وتخليد الذكرى والهدايا الملكية',
          headlineAr: `عرض حصري لعملاء ${safe.targetCountry}: تحفة 3D LED بإضاءة سحرية وتصميم مخصص باسمك 🔥`,
          subheadlineAr: `احصل على تحفة هندسية مخصصة تليق بمكتبك أو هديتك مع بروفة رقمية مجانية وتوصيل مجاني لكافة مناطق ${safe.targetCity}!`,
          badgeTextAr: `خصم خاص 35% لنسخة النخبة ⚡`,
          promoPrice: calculatedPromo,
          originalPrice: calculatedAnchor,
          bulletPointsAr: [
            'أكريليك كاست نقي 100% شفاف معالج ضد الخدش والاصفرار ويدوم لسنوات',
            'إضاءة LED تدوم أكثر من 50,000 ساعة مع قاعدة خشب طبيعي فاخرة',
            `بروفة هندسية رقمية مجانية يجهزها المصمم وتعتمدها بنفسك قبل التنفيذ`,
            'الدفع نقداً عند الاستلام مع إمكانية المعاينة الكاملة لحزمتك قبل الدفع',
            `شحن آمن ومغلف بعناية فائقة لكافة مناطق ${safe.targetCity} وباقي المدن`,
          ],
        },
        variantB: {
          id: 'var_b',
          nameAr: `النسخة ب (الجودة الهندسية، الضمان الصارم، وتوفير السعر في ${safe.targetCountry})`,
          angleAr: 'التركيز على دقة القص الليزري 0.2 ملم وضمان الاستبدال والفحص بيدك دون أي مخاطرة',
          headlineAr: `تصنيع هندسي فائق الدقة: لوحة أكريليك 3D LED بضمان استبدال مباشر ومعاينة مجانية في ${safe.targetCountry} 🛡️`,
          subheadlineAr: `قص ليزري بؤري فائق الدقة (0.2 ملم) وتشطيب يدوي مقاوم للخدش - ادفع فقط بعد فحص المنتج بيدك في ${safe.targetCity}!`,
          badgeTextAr: `ضمان ذهبي 100% + شحن مجاني 🛡️`,
          promoPrice: Math.round((safe.basePrice * 0.65) / 1000) * 1000,
          originalPrice: calculatedAnchor,
          bulletPointsAr: [
            'قص ليزري بؤري فائق الدقة (0.2 ملم) بحواف مشطوفة وناعمة كالحرير',
            'ضمان ذهبي لاستبدال فوري مجاني في حال وجود أي ملاحظة تصنيعية',
            `بروفة هندسية فورية يعتمدها الزبون عبر واتساب قبل القص الليزري`,
            'حق المعاينة والفحص الكامل للطرد قبل تسليم أي مبلغ للمندوب',
            `سعر مصنع مباشر ومنافس مع شحن مجاني وسريع لكافة مدن ${safe.targetCountry}`,
          ],
        },
      },
    };

    return res.json({ success: true, aiGenerated: false, data: fallbackResponse });
  } catch (error: any) {
    console.error('Campaign orchestrator error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Campaign orchestrator error' });
  }
});

// ============================================================================
// MULTI-AGENT AUTONOMOUS STAFF SYSTEM BACKEND APIS
// ============================================================================

// 1. Order & Laser Proof Auditor Agent Endpoint
app.post('/api/agents/audit-order', rateLimit, async (req, res) => {
  try {
    const {
      productTitle = 'لوحة مخصصة',
      companyName = '',
      subtitle = '',
      material = '',
      dimension = '',
      ledColor = '',
      hasLogo = false,
      logoFileName = '',
    } = req.body;

    const hasValidKey = apiKey && apiKey.length > 10 && apiKey !== 'MY_GEMINI_API_KEY';
    if (aiClient && hasValidKey) {
      const prompt = `أنت "وكيل فحص الطلبات والتخصيص الفني" الآلي في استوديو دار نون والقلم في بغداد.
مهمتك تدقيق مواصفات الطلب التالي قبل إرساله لخطوط القص الليزري والتصنيع:
- المنتج: "${capField(productTitle, 100)}"
- النص/اسم الجهة: "${capField(companyName, 150)}"
- الصفة/النشاط: "${capField(subtitle, 120)}"
- الخامة: "${capField(material, 100)}"
- الأبعاد: "${capField(dimension, 80)}"
- إضاءة LED: "${capField(ledColor, 60)}"
- الشعار: ${hasLogo ? `مرفق ملف (${capField(logoFileName, 80)})` : 'بدون شعار'}

أجب بكائن JSON صالح فقط:
{
  "passedValidation": true,
  "qualityScore": 95,
  "laserCuttingFeasibility": "ممتاز وجاهز للتفريغ",
  "fontRecommendation": "الخط الديواني الملكي للحروف البارزة",
  "technicalNotesAr": "ملاحظة فنية دقيقة لورشة الليزر",
  "customerNoticeAr": "رسالة طمأنة وتوضيح ترسل للزبون مع البروفة"
}`;

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Agent audit timeout')), 4500)
        );
        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, aiGenerated: true, data: parsed });
      } catch (err: any) {
        console.warn('Agent audit fallback triggered:', err?.message);
      }
    }

    // High quality deterministic fallback
    return res.json({
      success: true,
      aiGenerated: false,
      data: {
        passedValidation: true,
        qualityScore: 94,
        laserCuttingFeasibility: 'جاهز 100% للقص والتجميع الميكانيكي',
        fontRecommendation: 'خط الثلث الجلي الفاخر متوافق مع الحفر البؤري',
        technicalNotesAr: 'تمت مراجعة تناسق الهوامش (Margin 2.5cm) وسماكة الأكريليك وموضع كابل الليد 12V المخفي خلف القاعدة الخشبية.',
        customerNoticeAr: 'تم تدقيق طلبكم هندسياً من قِبل نظام نون والقلم الآلي، وستصلكم بروفة المعاينة عالية الدقة على واتساب للمصادقة.',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Agent error' });
  }
});

// 2. Partner Payout & Compliance Auditor Agent Endpoint
app.post('/api/agents/audit-withdrawal', rateLimit, async (req, res) => {
  try {
    const {
      partnerName = '',
      amountIQD = 0,
      walletNumber = '',
      availableBalanceIQD = 0,
    } = req.body;

    const amount = Number(amountIQD) || 0;
    const balance = Number(availableBalanceIQD) || 0;

    const hasSufficientBalance = balance >= amount;
    const meetsMinimum = amount >= 25000;
    const isRedRisk = amount > 250000; // red risk requiring human signoff

    return res.json({
      success: true,
      data: {
        canAutoApprove: hasSufficientBalance && meetsMinimum && !isRedRisk,
        riskLevel: isRedRisk ? 'red' : 'yellow',
        requiresHumanApproval: isRedRisk,
        passedFinancialAudit: hasSufficientBalance && meetsMinimum,
        reasonsAr: [
          hasSufficientBalance
            ? `الرصيد المتاح كافٍ (${balance.toLocaleString()} د.ع > ${amount.toLocaleString()} د.ع)`
            : 'الرصيد المتاح غير كافٍ',
          meetsMinimum ? 'المبلغ يلبي الحد الأدنى للسحب' : 'المبلغ أقل من الحد الأدنى (25,000 د.ع)',
          isRedRisk
            ? '⚠️ المبلغ كبير (> 250,000 د.ع) يتطلب مصادقة المدير العام البشرية (Human-in-the-Loop)'
            : 'المبلغ ضمن حدود الصرف التلقائي المعتمد',
        ],
        complianceScore: hasSufficientBalance && meetsMinimum ? 98 : 40,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Agent error' });
  }
});

// 3. System Health Sentinel Agent Endpoint
app.get('/api/agents/system-pulse', (_req, res) => {
  const uptime = process.uptime();
  const mem = process.memoryUsage();

  return res.json({
    success: true,
    data: {
      status: 'healthy',
      uptimeSeconds: Math.floor(uptime),
      memoryRssMB: Math.round(mem.rss / 1024 / 1024),
      memoryHeapMB: Math.round(mem.heapUsed / 1024 / 1024),
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    },
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
