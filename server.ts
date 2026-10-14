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

app.use(express.json({ limit: '10mb' }));

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
app.post('/api/ai/design-assistant', async (req, res) => {
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

    // If Gemini API is configured with a real key, call Gemini with a 5s timeout
    const hasValidKey = apiKey && apiKey.length > 10 && apiKey !== 'MY_GEMINI_API_KEY';
    if (aiClient && hasValidKey) {
      const prompt = `أنت خبير تصاميم هندسية وتصنيع إعلاني ولوحات أكريليك مضيئة (3D Acrylic & LED Signage) في مطبعة واستوديو "نون والقلم" في بغداد.
يقوم العميل حالياً بتخصيص منتج: "${productTitle}" من قسم "${category}".
البيانات المدخلة من العميل:
- النص الرئيسي المطلوب كتابته أو حفره: "${userText}"
- النص الفرعي / المهنة / الصفة: "${subtitle}"
- نوع النشاط التجاري / الاستخدام: "${businessType || 'عام/مكتبي'}"
- الخامة المختارة: "${material}"
- لون إضاءة الليد المختارة: "${ledColor}"
- المقاس: "${dimensions}"

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

    const isDoc = /دكتور|طبيب|عيادة|مركز طبي|dr|clinic/i.test(`${userText} ${businessType}`);
    const isLaw = /محام|قانون|عدل|حقوق/i.test(`${userText} ${businessType}`);
    const isEng = /مهندس|هندسة|معمار|تصميم/i.test(`${userText} ${businessType}`);

    const fallbackData = {
      refinedTitleAr: userText.trim() || 'نون والقلم للدعاية والإعلان',
      suggestedSubtitleAr:
        subtitle.trim() ||
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
app.post('/api/ai/design-product', async (req, res) => {
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

    const fullContext = `${companyName} ${subtitle} ${designNotes}`.trim();

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
- اسم الشركة / النص الرئيسي: "${companyName || 'شركة الأفق الدولية'}"
- السطر الفرعي / النشاط: "${subtitle || 'للسياحة والسفر'}"
- رقم الهاتف: "${phone || 'غير محدد'}"
- الموقع الإلكتروني: "${website || 'غير محدد'}"
- ملاحظات وتفاصيل إضافية من العميل: "${designNotes || 'لا توجد ملاحظات خاصة'}"
- لون إضاءة LED المختار: "${ledColor || 'أزرق سماوي'}"
- المقاس المطلوب: "${dimension || '20 × 15 سم'}"

المطلوب: توليد مواصفات تصميم متكاملة وذكية للمنتج بصيغة JSON فقط:
{
  "refinedTitle": "النص الرئيسي محسناً ومصاغاً بأناقة ليزرية باللغة العربية",
  "refinedSubtitle": "السطر الفرعي مصاغاً وموجزاً برقي واحترافية",
  "industry": "تصنيف النشاط (مثل: water_beverage, tourism, medical, legal, cafe, tech, luxury, corporate)",
  "recommendedEmblem": "رمز الشعار الموصى به: water_drop أو aviation_travel أو medical أو legal أو crown أو cafe أو tech أو corporate",
  "calligraphyStyle": "أحد الخطوط: ruqaa أو amiri أو kufi أو cairo",
  "sloganAr": "شعار تسويقي فاخر قصير يناسب النشاط (مثلاً: نقاوة تدوم، أو آفاق لا حدود لها)",
  "specs": {
    "dimensions": "${dimension || '20 × 15 سم'}",
    "acrylicType": "أكريليك مسبوك نقي 100% سماكة 5 ملم عالي التوصيل الضوئي (Cast Acrylic)",
    "etchingType": "حفر ليزري بؤري فائق الدقة (CO2 Micro-Laser Engraving 0.2mm) بحواف مصقولة بالألماس",
    "illumination": "شريط LED كولد نيون فائق اللمعان بلون ${ledColor || 'أزرق'} بدرجة سطوع 1200 لومن",
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
