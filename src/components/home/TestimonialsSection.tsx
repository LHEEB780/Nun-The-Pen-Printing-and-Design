import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote, ShieldCheck, CheckCircle2, X, ZoomIn, Sparkles, MapPin } from 'lucide-react';

interface TestimonialItem {
  id: string;
  text: string;
  author: string;
  role: string;
  locationAr: string;
  locationEn: string;
  rating: number;
  studioNameAr: string;
  studioNameEn: string;
  studioTagAr: string;
  studioTagEn: string;
  projectTitleAr: string;
  projectTitleEn: string;
  projectImage: string;
  avatar: string;
  accentColor: {
    border: string;
    badgeBg: string;
    badgeText: string;
    ring: string;
  };
}

export const TestimonialsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [activeZoomImage, setActiveZoomImage] = useState<{
    url: string;
    title: string;
    author: string;
  } | null>(null);

  const reviews: TestimonialItem[] = [
    {
      id: 'rev-led',
      text: t('testimonials.t1Text'),
      author: t('testimonials.t1Author'),
      role: t('testimonials.t1Role'),
      locationAr: 'بغداد - المنصور',
      locationEn: 'Baghdad - Mansour',
      rating: 5,
      studioNameAr: 'استوديو الأكريليك والـ 3D LED',
      studioNameEn: '3D Optical Acrylic & LED Studio',
      studioTagAr: 'لوحات جدارية مضيئة',
      studioTagEn: 'Illuminated Wall Sign',
      projectTitleAr: 'لوحة شعار أكريليك كاست مضيء للمقر التنفيذي',
      projectTitleEn: 'Cast Acrylic Edge-Lit HQ Office Signage',
      projectImage: '/images/products/travel_agency_wall_front_1791817427540.jpg',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      accentColor: {
        border: 'border-violet-200/90 hover:border-violet-400',
        badgeBg: 'bg-violet-900/80 text-violet-100',
        badgeText: 'text-violet-700',
        ring: 'ring-violet-300',
      },
    },
    {
      id: 'rev-boxes',
      text: t('testimonials.t3Text'),
      author: t('testimonials.t3Author'),
      role: t('testimonials.t3Role'),
      locationAr: 'بغداد - الكرادة',
      locationEn: 'Baghdad - Karrada',
      rating: 5,
      studioNameAr: 'استوديو العلب الكرتونية الفاخرة',
      studioNameEn: 'Rigid Box Packaging Atelier',
      studioTagAr: 'تغليف ملكي مقوى',
      studioTagEn: 'Luxury Rigid Boxes',
      projectTitleAr: 'علب كرتون مقوى 1400 غم مع سلوفان مات وبصمة حرارية',
      projectTitleEn: '1400gsm Rigid Perfume Boxes with Gold Foil',
      projectImage: '/images/products/luxury_rigid_box.jpg',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      accentColor: {
        border: 'border-amber-200/90 hover:border-amber-400',
        badgeBg: 'bg-amber-950/85 text-amber-200',
        badgeText: 'text-amber-800',
        ring: 'ring-amber-300',
      },
    },
    {
      id: 'rev-keepsakes',
      text: t('testimonials.t2Text'),
      author: t('testimonials.t2Author'),
      role: t('testimonials.t2Role'),
      locationAr: 'بغداد - الجادرية',
      locationEn: 'Baghdad - Jadriya',
      rating: 5,
      studioNameAr: 'استوديو الهدايا والمناسبات الملكية',
      studioNameEn: 'Milestone & Keepsakes Atelier',
      studioTagAr: 'دروع ومناسبات تذكارية',
      studioTagEn: 'Milestone Plaque',
      projectTitleAr: 'درع تذكاري زفاف بإضاءة LED خافتة مع قاعدة خشب طبيعي',
      projectTitleEn: 'Bespoke Wedding Heirloom with Walnut LED Base',
      projectImage: '/images/products/desk_plaque_studio_bg.jpg',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
      accentColor: {
        border: 'border-rose-200/90 hover:border-rose-400',
        badgeBg: 'bg-rose-950/85 text-rose-200',
        badgeText: 'text-rose-700',
        ring: 'ring-rose-300',
      },
    },
    {
      id: 'rev-cards',
      text: t('testimonials.t4Text'),
      author: t('testimonials.t4Author'),
      role: t('testimonials.t4Role'),
      locationAr: 'بغداد - الحارثية',
      locationEn: 'Baghdad - Harithiya',
      rating: 5,
      studioNameAr: 'استوديو كروت الأعمال والمطبوعات',
      studioNameEn: 'Fine Cotton Stationery Atelier',
      studioTagAr: 'كروت قطنية فاخرة',
      studioTagEn: 'Cotton Gold Foil Cards',
      projectTitleAr: 'كروت أعمال قطنية 600 غم مع بصمة حرارية ذهبية وحواف ناعمة',
      projectTitleEn: '600gsm Duplex Cotton Cards with Hot Gold Foil',
      projectImage: '/images/products/luxury_foil_cards.jpg',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
      accentColor: {
        border: 'border-emerald-200/90 hover:border-emerald-400',
        badgeBg: 'bg-emerald-950/85 text-emerald-200',
        badgeText: 'text-emerald-700',
        ring: 'ring-emerald-300',
      },
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-10 start-1/2 -translate-x-1/2 w-3/4 h-80 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 border border-amber-200 px-3 py-1.5 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'تقييمات موثقة بالصور الواقعية للتنفيذ' : 'Verified Reviews with Production Photos'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t('testimonials.title')}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('testimonials.subtitle')}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1 text-xs font-bold text-amber-600">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span>5.0 / 5.0</span>
            <span className="text-slate-400 font-normal">
              {isAr ? '· متوسط تقييم عملاء الورشة في بغداد' : '· Atelier Average Rating'}
            </span>
          </div>
        </div>

        {/* Testimonials 4-Card Grid with Rich Real Execution Imagery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-white rounded-3xl border ${rev.accentColor.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group`}
            >
              <div>
                {/* 1. Real Project Execution Photo */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer">
                  <img
                    src={rev.projectImage}
                    alt={isAr ? rev.projectTitleAr : rev.projectTitleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onClick={() =>
                      setActiveZoomImage({
                        url: rev.projectImage,
                        title: isAr ? rev.projectTitleAr : rev.projectTitleEn,
                        author: rev.author,
                      })
                    }
                  />

                  {/* Gradient shade over image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 start-2.5 end-2.5 flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-xs ${rev.accentColor.badgeBg}`}>
                      {isAr ? rev.studioTagAr : rev.studioTagEn}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveZoomImage({
                          url: rev.projectImage,
                          title: isAr ? rev.projectTitleAr : rev.projectTitleEn,
                          author: rev.author,
                        })
                      }
                      title={isAr ? 'تكبير صورة التنفيذ' : 'Zoom photo'}
                      className="p-1 rounded-md bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Caption on Image */}
                  <div className="absolute bottom-2 start-2.5 end-2.5 pointer-events-none">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 mb-0.5">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>{isAr ? 'تنفيذ حقيقي في ورشتنا' : 'Verified Craft Execution'}</span>
                    </div>
                    <p className="text-white text-xs font-bold leading-tight line-clamp-1 drop-shadow-xs">
                      {isAr ? rev.projectTitleAr : rev.projectTitleEn}
                    </p>
                  </div>
                </div>

                {/* 2. Review Content */}
                <div className="p-5">
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-amber-200/90" />
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic line-clamp-4 font-normal mb-2">
                    "{rev.text}"
                  </p>
                </div>
              </div>

              {/* 3. Client Profile & Verification */}
              <div className="p-5 pt-0">
                <div className="pt-3.5 border-t border-slate-100 flex items-center gap-3">
                  {/* Client Avatar with fallback */}
                  <div className="relative shrink-0">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className={`w-11 h-11 rounded-full object-cover ring-2 ${rev.accentColor.ring} shadow-xs bg-slate-100`}
                      onError={(e) => {
                        // Fallback placeholder if avatar fails
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div
                      style={{ display: 'none' }}
                      className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 font-bold text-xs items-center justify-center ring-2 ring-amber-200"
                    >
                      {rev.author.slice(0, 2)}
                    </div>
                    <div className="absolute -bottom-1 -end-1 bg-white rounded-full p-0.5 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>

                  {/* Author Name and Role */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                      {rev.author}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate leading-tight">
                      {rev.role}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                      <span>{isAr ? rev.locationAr : rev.locationEn}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Quality Guarantee Seal Footer */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {isAr ? 'التزام ورشة نُون والقَلَم بالجودة والإتقان' : 'Noon & Pen Atelier Quality Commitment'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isAr
                  ? 'لا نعتمد أي طلب للإنتاج النهائي إلا بعد تزويدك ببروفة رقمية وموافقتك التامة على أدق التفاصيل.'
                  : 'Zero final production without prior 3D proof approval and your total satisfaction.'}
              </p>
            </div>
          </div>

          <a
            href="#specialties"
            className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs"
          >
            {isAr ? 'ابدأ طلبك المخصص الآن' : 'Start Your Custom Order'}
          </a>
        </div>

      </div>

      {/* Lightbox Modal for Full Image View */}
      {activeZoomImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveZoomImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-4/3 w-full bg-slate-950">
              <img
                src={activeZoomImage.url}
                alt={activeZoomImage.title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setActiveZoomImage(null)}
                className="absolute top-4 end-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex items-center justify-between gap-4 bg-white border-t border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {activeZoomImage.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr ? `تنفيذ حقيقي للعميل: ${activeZoomImage.author}` : `Executed bespoke for: ${activeZoomImage.author}`}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
                {isAr ? 'ورشة بغداد' : 'Baghdad Atelier'}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
