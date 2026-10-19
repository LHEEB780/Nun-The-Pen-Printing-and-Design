import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Sparkles,
  CreditCard,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Compass,
  Tag,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';

export type SpecialtyId = 'boxes' | 'led' | 'cards' | 'occasions';

export interface SpecialtyGatewayItem {
  id: SpecialtyId;
  slug: string;
  titleAr: string;
  titleEn: string;
  headlineAr: string;
  headlineEn: string;
  taglineAr: string;
  taglineEn: string;
  image: string;
  secondaryImage?: string;
  craftSpecsAr: string[];
  craftSpecsEn: string[];
  subSpecialtiesAr: string[];
  subSpecialtiesEn: string[];
  icon: React.ElementType;
  themeColor: {
    accent: string;
    border: string;
    bgHover: string;
    textAccent: string;
  };
  startingPriceAr: string;
  startingPriceEn: string;
}

export const SPECIALTY_GATEWAYS: SpecialtyGatewayItem[] = [
  {
    id: 'boxes',
    slug: 'rigid-packaging-studio',
    titleAr: 'استوديو العلب الكرتونية الفاخرة والتغليف',
    titleEn: 'Luxury Rigid Boxes & Packaging Studio',
    headlineAr: 'تغليف فاخر صلب يعكس قيمة علامتك ومنتجاتك',
    headlineEn: 'Bespoke Rigid Setup Boxes & Structural Packaging',
    taglineAr: 'كرتون رمادي مقوى 1200 - 1800 غم، ملمس حريري مخملي ناعم، بصمة حرارية ذهبية، وحشوات ليزرية داخلية مطابقة تماماً للمنتج.',
    taglineEn: 'Dense 1200-1800gsm greyboard, Italian soft-touch matte lamination, hot foil stamping, and laser-contoured EVA velvet inserts.',
    image: '/images/products/luxury_rigid_box.jpg',
    craftSpecsAr: [
      'كرتون صلب مقاوم للانثناء والكسر',
      'بصمة حرارية ذهبية وفضية كروز الألمانية',
      'حشوة داخلية إسفنجية ومخملية بالليزر',
      'إغلاق مغناطيسي خفي أو غطاء وقاعدة',
    ],
    craftSpecsEn: [
      'Crush-resistant structural greyboard',
      'German Kurz hot-foil debossing',
      'Laser-sculpted velvet EVA interior',
      'Concealed neodymium magnetic snaps',
    ],
    subSpecialtiesAr: ['علب عطور ومجوهرات', 'علب هدايا فاخرة', 'علب درجية وفتحات مغناطيس', 'علب شحن مقواة'],
    subSpecialtiesEn: ['Perfume & Jewelry Boxes', 'VIP Presentation Boxes', 'Magnetic Drawer Boxes', 'Rigid Mailer Boxes'],
    icon: Package,
    themeColor: {
      accent: 'from-amber-600 to-amber-800',
      border: 'border-amber-200/90 hover:border-amber-500',
      bgHover: 'group-hover:bg-amber-50/50',
      textAccent: 'text-amber-900',
    },
    startingPriceAr: 'من 5,000 د.ع للقطعة',
    startingPriceEn: 'From 5,000 IQD / unit',
  },
  {
    id: 'led',
    slug: 'acrylic-led-studio',
    titleAr: 'استوديو لوحات ودروع الأكريليك وإضاءة 3D LED',
    titleEn: '3D Optical Acrylic Signs & LED Trophies Studio',
    headlineAr: 'حفر ليزري ميكروني وإضاءة ثلاثية الأبعاد تنبض بالجمال',
    headlineEn: 'Precision Laser Engraved Acrylic with Optical 3D Glow',
    taglineAr: 'أكريليك كاست نقي 100% غير قابل للاصفرار بسماكات 4 - 10 مم، حواف مصقولة بلورياً بالماس، مع إضاءة محيطية ذكية تدوم +50,000 ساعة.',
    taglineEn: '100% virgin optical cast acrylic (4-10mm) with diamond-polished edges, capacitive touch bases, and ambient multi-color lighting.',
    image: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
    craftSpecsAr: [
      'حفر ليزري فائق الدقة للشعارات والخطوط',
      'قواعد خشب زان طبيعي أو قواعد لمس إلكترونية',
      'خيارات ألوان متعددة (عنبري، أزرق، بنفسجي)',
      'توصيل USB أو محول مخصص معتمد',
    ],
    craftSpecsEn: [
      'Sub-millimeter laser vector engraving',
      'Natural beech wood or smart touch base',
      'Multi-tone lighting (Amber, Cyan, Violet)',
      'USB & DC certified power options',
    ],
    subSpecialtiesAr: ['دروع التكريم والجوائز', 'لوحات المكاتب والاستقبال', 'مجسمات 3D المضيئة', 'شيلدات جدارية عائمة'],
    subSpecialtiesEn: ['Executive Awards & Trophies', 'Desk & Reception Nameplates', '3D Optical LED Nightlights', 'Floating Wall Signs'],
    icon: Sparkles,
    themeColor: {
      accent: 'from-purple-600 to-indigo-800',
      border: 'border-purple-200/90 hover:border-purple-500',
      bgHover: 'group-hover:bg-purple-50/50',
      textAccent: 'text-purple-900',
    },
    startingPriceAr: 'من 26,000 د.ع',
    startingPriceEn: 'From 26,000 IQD',
  },
  {
    id: 'cards',
    slug: 'business-cards-studio',
    titleAr: 'استوديو كروت الأعمال الراقية والبصمة الحرارية',
    titleEn: 'Luxury Cotton Business Cards & Foil Stamping Studio',
    headlineAr: 'كروت قطنية ثقيلة وحواف مذهبة تصنع انطباعاً أولاً لا يُنسى',
    headlineEn: 'Heavy Cotton Stocks, Mirror Foil Stamping & Gilded Edges',
    taglineAr: 'ورق قطني إيطالي 600 - 700 غم سميك، كبس وضغط غائر (Letterpress Deboss)، تذهيب حواف يدوي 360 درجة، وبصمة رقائق معدنية عاكسة.',
    taglineEn: '600-700gsm duplex Italian cotton stock, tactile deep letterpress debossing, 360-degree hand-burnished foil edges, and metallic foil stamping.',
    image: '/images/products/luxury_foil_cards.jpg',
    craftSpecsAr: [
      'ورق قطني سميك 3 أضعاف الكروت العادية',
      'تذهيب حواف يدوي (ذهبي، فضي، بلاتيني)',
      'كبس بارز وحفر غائر ملموس بالأصابع',
      'خيارات كروت أكريليك شفافة ومفرغة',
    ],
    craftSpecsEn: [
      '3x thicker pure cotton board structure',
      'Hand-burnished metallic edge gilding',
      'Tactile letterpress sculpt & deboss',
      'Frosted & transparent acrylic cards',
    ],
    subSpecialtiesAr: ['كروت قطنية دوبلكس 600 غم', 'كروت بصمة ذهبية وفضية', 'كروت أطراف ملونة مذهبة', 'كروت أكريليك شفافة'],
    subSpecialtiesEn: ['600gsm Duplex Cotton Cards', 'Gold & Silver Hot Foil Cards', 'Gilded Edge Luxury Cards', 'Crystal Acrylic Cards'],
    icon: CreditCard,
    themeColor: {
      accent: 'from-sky-600 to-blue-800',
      border: 'border-sky-200/90 hover:border-sky-500',
      bgHover: 'group-hover:bg-sky-50/50',
      textAccent: 'text-sky-900',
    },
    startingPriceAr: 'من 400 د.ع للكرت (دفاتر جملة)',
    startingPriceEn: 'From 400 IQD / card',
  },
  {
    id: 'occasions',
    slug: 'keepsakes-occasions-studio',
    titleAr: 'استوديو الهدايا التذكارية والدروع والمناسبات',
    titleEn: 'Keepsakes, Event Stationery & Trophies Studio',
    headlineAr: 'توثيق مواعيد العمر واللحظات الخالدة بأرقى الخطوط العربية',
    headlineEn: 'Preserving Lifelong Milestones with Calligraphy & Fine Craft',
    taglineAr: 'دمج الأكريليك الكريستالي مع خشب البلوط والزان الطبيعي، مخطوطات بالخط الديواني والكوفي، ونقش ليزري شخصي يدوم لأجيال.',
    taglineEn: 'Crystal optical acrylic harmonized with natural oak, master calligraphy in Diwani & Kufi, and bespoke milestone keepsakes built to endure.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    craftSpecsAr: [
      'مخطوطات عربية أصلية بالخطوط الملكية',
      'قواعد خشب طبيعي معالج محفورة بالليزر',
      'تغليف هدايا ملكي متكامل مع بطاقة إهداء',
      'بروفة واعتماد رقمي مسبق عبر واتساب',
    ],
    craftSpecsEn: [
      'Authentic classical Arabic calligraphy',
      'Laser-sculpted natural hardwood base',
      'Royal presentation packaging & ribbon',
      'Pre-production digital approval on WhatsApp',
    ],
    subSpecialtiesAr: ['لوحات زفاف وخطوبة', 'هدايا تخرج وأطباء ومهندسين', 'بورتريه فيكتور ليزري', 'أطقم إهداء مخصصة للشركات'],
    subSpecialtiesEn: ['Wedding Milestone Keepsakes', 'Graduation & Medical Trophies', 'Vector Line Art Nightlights', 'Corporate Executive Gift Sets'],
    icon: HeartHandshake,
    themeColor: {
      accent: 'from-rose-600 to-pink-800',
      border: 'border-rose-200/90 hover:border-rose-500',
      bgHover: 'group-hover:bg-rose-50/50',
      textAccent: 'text-rose-900',
    },
    startingPriceAr: 'من 35,000 د.ع',
    startingPriceEn: 'From 35,000 IQD',
  },
];

interface SpecialtyGatewaysSectionProps {
  onSelectSpecialty: (specialtyId: SpecialtyId) => void;
  onSelectProduct?: (productId: string) => void;
}

export const SpecialtyGatewaysSection: React.FC<SpecialtyGatewaysSectionProps> = ({
  onSelectSpecialty,
  onSelectProduct: _onSelectProduct,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section id="specialties" className="py-20 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/90 relative overflow-hidden">
      {/* Subtle architectural ambient lights */}
      <div className="absolute top-1/4 start-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 end-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Pacdora-inspired Gateway Header) */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-xl shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'بوابة استوديوهات نُون والقَلَم المتخصصة' : 'Noon & Pen Specialized Production Studios'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? 'اختر التخصص الحرفي الذي ترغب في استكشافه' : 'Select a Specialized Craft Studio to Explore'}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {isAr
              ? 'كل اختصاص يمثل استوديو إنتاج متكامل في ورشتنا ببغداد، مجهز بأحدث ماكينات الليزر والقص والطباعة الفاخرة لتقديم أعلى معايير الجودة العالمية.'
              : 'Each studio represents a dedicated production division at our Baghdad workshop, engineered with advanced laser optics and luxury finishing.'}
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'تصنيع محلي في بغداد' : 'Handcrafted in Baghdad'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>{isAr ? 'بروفة رقمية مجانية مسبقة' : 'Free Digital Proofing'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'تخصيص كامل للأبعاد والخامات' : 'Full Custom Sizing & Specs'}</span>
            </span>
          </div>
        </div>

        {/* 4 Majestic Gateways Grid (Wide, High-Prestige Portals) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {SPECIALTY_GATEWAYS.map((gateway, index) => {
            const Icon = gateway.icon;
            return (
              <div
                key={gateway.id}
                onClick={() => onSelectSpecialty(gateway.id)}
                className={`group relative bg-white rounded-3xl border ${gateway.themeColor.border} shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between`}
              >
                {/* Gateway Card Visual Banner (16:9 cinematic aspect ratio) */}
                <div className="relative aspect-16/10 sm:aspect-16/9 overflow-hidden bg-slate-950">
                  <img
                    src={gateway.image}
                    alt={isAr ? gateway.titleAr : gateway.titleEn}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  
                  {/* Subtle Dark Vignette & Gradient for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                  {/* Top Floating Badge with Studio Icon */}
                  <div className="absolute top-4 start-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-white text-xs font-bold shadow-md">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? gateway.titleAr : gateway.titleEn}</span>
                  </div>

                  {/* Starting Price Tag */}
                  <div className="absolute top-4 end-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-slate-950 text-xs font-black shadow-md border border-white/40">
                    {isAr ? gateway.startingPriceAr : gateway.startingPriceEn}
                  </div>

                  {/* Bottom Image Headline Overlay */}
                  <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 text-white space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-200 transition-colors drop-shadow-md">
                      {isAr ? gateway.headlineAr : gateway.headlineEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed opacity-90 drop-shadow-xs">
                      {isAr ? gateway.taglineAr : gateway.taglineEn}
                    </p>
                  </div>
                </div>

                {/* Card Content & Craftsmanship Body */}
                <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                  
                  {/* Sub-Specialties List (Clean typographic list, Zero-Pill) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {isAr ? 'أبرز النماذج والحلول المتاحة داخل الاستوديو:' : 'Specialized Formats & Models Available:'}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-700 font-semibold">
                      {(isAr ? gateway.subSpecialtiesAr : gateway.subSpecialtiesEn).map((sub, sIdx, arr) => (
                        <React.Fragment key={sIdx}>
                          <span className="hover:text-amber-900 transition-colors">{sub}</span>
                          {sIdx < arr.length - 1 && <span className="text-slate-300" aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Craft Specs Grid (Workshop Precision Details) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    {(isAr ? gateway.craftSpecsAr : gateway.craftSpecsEn).map((spec, spIdx) => (
                      <div key={spIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* High-Impact Entry Button (Pacdora-inspired Studio Entry) */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500 font-medium">
                      <span>{isAr ? 'انتقال مباشر لاستوديو القسم' : 'Direct specialized studio hub'}</span>
                    </div>

                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r ${gateway.themeColor.accent} shadow-md group-hover:shadow-lg transition-all duration-300 cursor-pointer transform group-hover:scale-102`}
                    >
                      <span>{isAr ? `دخول ${gateway.titleAr}` : `Explore ${gateway.titleEn}`}</span>
                      {isAr ? (
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                      ) : (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-900 font-black text-xl">
              ن
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {isAr ? 'هل لديك مواصفات خاصة أو مشروع تجاري كبير؟' : 'Need Custom Specifications or Commercial Bulk Runs?'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {isAr
                  ? 'فريق المهندسين والفنيين في نُون والقَلَم جاهز لتصميم قوالب كرتون مخصصة وتصنيع نماذج أولية (Mockups) بدقة متناهية.'
                  : 'Our production engineering team creates custom dielines, structural mockups, and bulk manufacturing runs.'}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/9647800000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <span>{isAr ? 'استشارة مهندس إنتاج عبر واتساب' : 'Consult Production Engineer'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </div>

      </div>
    </section>
  );
};
