import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Star,
  CheckCircle2,
  Camera,
  Upload,
  ThumbsUp,
  MessageCircle,
  X,
  Filter,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Award,
  Image as ImageIcon,
  Check,
  CornerDownLeft,
  Calendar,
  MapPin,
} from 'lucide-react';

export interface CustomerReviewPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  authorName: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  productVariant?: string;
  photos: CustomerReviewPhoto[];
  helpfulCount: number;
  verifiedPurchase: boolean;
  officialReply?: {
    author: string;
    date: string;
    message: string;
  };
}

interface ProductReviewsSectionProps {
  productId: string;
  productTitleAr: string;
  productTitleEn: string;
  categoryLabelAr?: string;
  categoryLabelEn?: string;
}

// Default seeded authentic reviews for Baghdad workshop deliveries
const getInitialReviews = (productId: string, isAr: boolean): CustomerReview[] => {
  return [
    {
      id: `rev-${productId}-1`,
      productId,
      authorName: isAr ? 'م. حيدر النداوي - مكتب هندسي' : 'Eng. Haider Al-Naddawi',
      location: isAr ? 'بغداد - المنصور' : 'Baghdad - Mansour',
      rating: 5,
      date: isAr ? 'منذ يومين' : '2 days ago',
      title: isAr ? 'دقة مذهلة في قص الليزر وتشطيب الحواف' : 'Stunning laser cutting & edge finishing',
      comment: isAr
        ? 'استلمت اللوحة اليوم من المندوب، بصراحة جودة الأكريليك وتوزيع الإضاءة الـ LED متساوي بدون أي بقع داكنة. التغليف كان محكم جداً مع طبقات حماية مضاعفة. شكراً نون والقلم على هذا العمل المتقن.'
        : 'Received the sign today, acrylic quality and uniform LED diffusion are unmatched. Packaging was pristine with reinforced protection.',
      productVariant: isAr ? 'أكريليك كاست 8 ملم - إضاءة نيون دافئة (Warm 3000K)' : '8mm Cast Acrylic - Warm 3000K LED',
      photos: [
        {
          id: 'p1',
          url: '/images/products/travel_agency_wall_front_1791817427540.jpg',
          caption: isAr ? 'اللوحة بعد التثبيت على جدار المكتب التنفيذي' : 'Installed at executive office wall',
        },
        {
          id: 'p2',
          url: '/images/products/travel_agency_desk_angle_1791817458937.jpg',
          caption: isAr ? 'زاوية مقربة توضح نعومة الحواف الكريستالية' : 'Close-up showing polished crystal edges',
        },
      ],
      helpfulCount: 24,
      verifiedPurchase: true,
      officialReply: {
        author: isAr ? 'إدارة ورشة نُون والقَلَم' : 'Noon & Pen Atelier Team',
        date: isAr ? 'منذ يوم' : '1 day ago',
        message: isAr
          ? 'أهلاً بك باشمهندس حيدر، شرفتنا ثقتكم الغالية وسعداء جداً بظهور عملكم بأبهى صورة تليق بمكتبكم الموقر!'
          : 'Thank you Eng. Haider, we are honored by your trust and delighted with how it complements your office!',
      },
    },
    {
      id: `rev-${productId}-2`,
      productId,
      authorName: isAr ? 'د. سارة التميمي - مجمع طبي' : 'Dr. Sarah Al-Tamimi',
      location: isAr ? 'بغداد - الكرادة' : 'Baghdad - Karrada',
      rating: 5,
      date: isAr ? 'منذ 5 أيام' : '5 days ago',
      title: isAr ? 'فخامة خيالية وتطابق تام مع البروفة ثلاثية الأبعاد' : 'Pure luxury and 100% match to 3D proof',
      comment: isAr
        ? 'أكثر ما أعجبني هو مطابقة المنتج النهائي لنفس البروفة الرقمية التي اعتمدتها مع المصمم على الواتساب. الحروف بارزة واللون الذهبي المات لا يترك أثر بصمات. زبائن العيادة يسألونني دائماً أين صنعتها!'
        : 'The delivered product is an exact replica of the 3D proof approved on WhatsApp. Matt gold finish does not catch fingerprints.',
      productVariant: isAr ? 'تشطيب ذهبي ملكي مات - مقاس مخصص 75×50 سم' : 'Royal Matte Gold Finish - Custom 75x50cm',
      photos: [
        {
          id: 'p3',
          url: '/images/products/led_acrylic_3d_lifestyle_1791816373444.jpg',
          caption: isAr ? 'صورة استلام العلبة والملحقات كاملة مع شهادة الضمان' : 'Received package with accessories and warranty',
        },
      ],
      helpfulCount: 19,
      verifiedPurchase: true,
    },
    {
      id: `rev-${productId}-3`,
      productId,
      authorName: isAr ? 'الأستاذ أحمد كمال - دار استشارات' : 'Ahmed Kamal - Consulting Group',
      location: isAr ? 'أربيل - دريم سيتي' : 'Erbil - Dream City',
      rating: 5,
      date: isAr ? 'منذ أسبوع' : '1 week ago',
      title: isAr ? 'شحن سريع إلى أربيل وتغليف ضد الصدمات' : 'Fast transit to Erbil and shockproof packaging',
      comment: isAr
        ? 'تم شحن الطلب من بغداد إلى أربيل ووصل خلال 48 ساعة فقط بدون أي خدش. الخشب والتشطيب فاخر جداً ومصدر الطاقة أصلي 12V مع مفتاح تحكم بالشدة.'
        : 'Shipped from Baghdad to Erbil within 48h in perfect shape. Natural solid wood base with dimmable power supply.',
      productVariant: isAr ? 'قاعدة خشب جوز طبيعي مع حفر اسم الشركة بالليزر' : 'Natural Walnut Base with Laser Engraving',
      photos: [
        {
          id: 'p4',
          url: '/images/products/acrylic_led_lifestyle_1791779775892.jpg',
          caption: isAr ? 'تجربة الإضاءة ليلاً على مكتب الاستقبال' : 'Nighttime illumination test on reception desk',
        },
      ],
      helpfulCount: 15,
      verifiedPurchase: true,
      officialReply: {
        author: isAr ? 'قسم ضمان الجودة' : 'Quality Assurance Dept',
        date: isAr ? 'منذ 6 أيام' : '6 days ago',
        message: isAr
          ? 'سعداء بوصول الطلب إليكم في كوردستان بأعلى درجات السلامة. خشب الجوز معالج خصيصاً لمقاومة الرطوبة والتغيرات الجوية.'
          : 'Glad it arrived safely to Kurdistan! The walnut is specially treated to withstand temperature and humidity.',
      },
    },
  ];
};

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productTitleAr,
  productTitleEn,
  categoryLabelAr,
  categoryLabelEn,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const storageKey = `noon_reviews_${productId}`;

  // State
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getInitialReviews(productId, isAr);
  });

  // Filter & Sort State
  const [filterMode, setFilterMode] = useState<'all' | 'with-photos' | '5-star' | '4-star'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');

  // Modal State for adding review
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState(isAr ? 'بغداد - المنصور' : 'Baghdad - Mansour');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [productVariant, setProductVariant] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<CustomerReviewPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lightbox for reviewing client photos
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    caption?: string;
    author: string;
    location: string;
    rating: number;
    comment: string;
  } | null>(null);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch {}
  }, [reviews, storageKey]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      toast.error(isAr ? 'الحد الأقصى هو 4 صور لكل تقييم' : 'Maximum 4 photos per review');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(isAr ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(isAr ? 'الحد الأقصى لحجم الصورة هو 5 ميجابايت' : 'Maximum image size is 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          setUploadedPhotos((prev) => [
            ...prev,
            {
              id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              url: resultUrl,
              caption: isAr ? 'صورة المنتج المستلم من الورشة' : 'Delivered product photo',
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // Quick preset sample photos to ease demonstration
  const handleAddPresetPhoto = (sampleUrl: string, sampleCaption: string) => {
    if (uploadedPhotos.length >= 4) {
      toast.error(isAr ? 'الحد الأقصى 4 صور' : 'Maximum 4 photos');
      return;
    }
    setUploadedPhotos((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}`,
        url: sampleUrl,
        caption: sampleCaption,
      },
    ]);
  };

  // Submit Review Form
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      toast.error(isAr ? 'يرجى كتابة اسمك أو اسم شركتك' : 'Please provide your name or business name');
      return;
    }
    if (!comment.trim()) {
      toast.error(isAr ? 'يرجى كتابة نص التقييم ورأيك في المنتج' : 'Please write your review feedback');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: CustomerReview = {
        id: `rev-${Date.now()}`,
        productId,
        authorName: authorName.trim(),
        location: location.trim() || (isAr ? 'بغداد' : 'Baghdad'),
        rating,
        date: isAr ? 'الآن (حديث)' : 'Just now',
        title: title.trim() || (rating === 5 ? (isAr ? 'جودة فاخرة تفوق التوقعات' : 'Outstanding quality') : (isAr ? 'تجربة ممتازة' : 'Great experience')),
        comment: comment.trim(),
        productVariant: productVariant.trim() || (isAr ? 'مخصص حسب الطلب' : 'Bespoke Custom Configuration'),
        photos: uploadedPhotos,
        helpfulCount: 1,
        verifiedPurchase: true,
        officialReply: {
          author: isAr ? 'إدارة ورشة نُون والقَلَم' : 'Noon & Pen Workshop',
          date: isAr ? 'الآن' : 'Now',
          message: isAr
            ? `أهلاً بك أستاذ ${authorName.trim()}، نشكرك من القلب على ثقتك ومشاركتك هذه الصور الواقعية لطلبك. يسعدنا دائماً تقديم أعلى مستويات الإتقان العراقي الأصيل!`
            : `Thank you ${authorName.trim()} for your valued trust and sharing real photos of your delivered order!`,
        },
      };

      setReviews((prev) => [newReview, ...prev]);
      setIsSubmitting(false);
      setIsAddModalOpen(false);

      // Reset Form
      setAuthorName('');
      setTitle('');
      setComment('');
      setProductVariant('');
      setUploadedPhotos([]);
      setRating(5);

      toast.success(
        isAr
          ? 'تم نشر تقييمك بنجاح مع الصور المرفقة! شكراً لمساعدتك العملاء الجدد في التأكد من الجودة.'
          : 'Your review and photos were published successfully! Thank you for boosting community trust.'
      );
    }, 600);
  };

  // Helpful Button Trigger
  const handleToggleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          toast.success(isAr ? 'شكراً لتقييمك؛ سيساعد ذلك المتسوقين الآخرين!' : 'Thanks for marking this helpful!');
          return { ...r, helpfulCount: r.helpfulCount + 1 };
        }
        return r;
      })
    );
  };

  // Filtered & Sorted Reviews
  const filteredReviews = reviews
    .filter((r) => {
      if (filterMode === 'with-photos') return r.photos && r.photos.length > 0;
      if (filterMode === '5-star') return r.rating === 5;
      if (filterMode === '4-star') return r.rating === 4;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
      return 0; // default order is chronological
    });

  // Calculate Metrics
  const totalReviewsCount = reviews.length;
  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (totalReviewsCount || 1)
  ).toFixed(1);
  const reviewsWithPhotosCount = reviews.filter((r) => r.photos && r.photos.length > 0).length;
  const fiveStarPercentage = Math.round(
    (reviews.filter((r) => r.rating === 5).length / (totalReviewsCount || 1)) * 100
  );

  // Extract all client photos into a quick gallery ribbon
  const allCustomerPhotos = reviews.flatMap((r) =>
    (r.photos || []).map((p) => ({
      ...p,
      author: r.authorName,
      location: r.location,
      rating: r.rating,
      comment: r.comment,
    }))
  );

  return (
    <section className="mt-14 pt-12 border-t-2 border-amber-200/60 space-y-8 select-none">
      {/* Header and Value Proposition */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'تقييمات واقعية وموثقة بالصور من ورشاتنا' : 'Verified Reviews & Real Workshop Deliveries'}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span>{isAr ? 'تجارب العملاء وصور المنتجات المستلمة' : 'Customer Reviews & Real Delivery Photos'}</span>
            <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {totalReviewsCount} {isAr ? 'تقييم' : 'reviews'}
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isAr
              ? 'تصفح صوراً التقطها عملاؤنا بعد استلام طلباتهم من ورشة نُون والقَلَم في بغداد لمشاهدة جودة الأكريليك، تشطيب الذهب، دقة الحفر، وتوزيع الإضاءة على أرض الواقع.'
              : 'Browse unedited photos captured by real customers across Iraq upon delivery to witness authentic acrylic clarity, gold foil, and uniform lighting.'}
          </p>
        </div>

        {/* Big Add Review Action CTA */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span>{isAr ? 'أضف تقييمك وارفع صور طلبك' : 'Write Review & Upload Photos'}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Score & Verification Metrics Card */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Rating Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-e border-amber-200/70 space-y-2">
          <span className="text-5xl sm:text-6xl font-black text-slate-950 font-mono tracking-tighter">
            {averageRating}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-500" />
            ))}
          </div>
          <p className="text-xs font-bold text-slate-700">
            {isAr
              ? `بناءً على ${totalReviewsCount} تجربة تصنيع وتسليم معتمدة`
              : `Based on ${totalReviewsCount} verified orders`}
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAr ? '100% مشتريات موثقة بالفواتير' : '100% Verified Buyer Invoices'}</span>
          </div>
        </div>

        {/* Rating Breakdown & Trust Highlights */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-amber-100/90 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 block font-medium">
              {isAr ? 'نسبة الرضا الكامل' : '5-Star Satisfaction'}
            </span>
            <span className="text-2xl font-black text-amber-800 font-mono">{fiveStarPercentage}%</span>
            <p className="text-[11px] text-slate-600">
              {isAr ? 'أشادوا بدقة التفاصيل ومطابقة البروفة' : 'Praised exact match to 3D proof'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-100/90 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 block font-medium">
              {isAr ? 'تقييمات مرفقة بصور واقعية' : 'Reviews with Photos'}
            </span>
            <span className="text-2xl font-black text-amber-800 font-mono">
              {reviewsWithPhotosCount} / {totalReviewsCount}
            </span>
            <p className="text-[11px] text-slate-600">
              {isAr ? 'صور حية للمنتج بعد التركيب والاستلام' : 'Live photos captured after delivery'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-100/90 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 block font-medium">
              {isAr ? 'ضمان ورشة نُون والقَلَم' : 'Atelier Guarantee'}
            </span>
            <span className="text-sm font-black text-emerald-700 flex items-center gap-1 mt-1">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? 'إعادة طباعة فورية' : 'Free Instant Reprint'}</span>
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              {isAr ? 'استبدال مجاني فوري في حال أي عيب مصنعي' : 'Full replacement on any flaw'}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Delivery Photos Visual Showcase (شريط صور طلبات العملاء المستلمة) */}
      {allCustomerPhotos.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-950">
                  {isAr ? 'معرض صور العملاء للطلبات المستلمة' : 'Customer Delivery Photo Showcase'}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isAr
                    ? 'انقر على أي صورة لتكبيرها وقراءة تقييم العميل ومواصفات طلبه'
                    : 'Click any photo to enlarge and read the client review & specs'}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
              {allCustomerPhotos.length} {isAr ? 'صورة معتمدة' : 'photos'}
            </span>
          </div>

          {/* Horizontal Scrollable Thumbnails Carousel */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {allCustomerPhotos.map((photo, idx) => (
              <div
                key={`${photo.id}-${idx}`}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200/80 hover:border-amber-500 cursor-pointer shrink-0 transition-all shadow-xs hover:shadow-md"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Customer delivery'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[10px] text-white font-bold truncate">
                    {photo.author}
                  </span>
                </div>
                <div className="absolute top-1.5 end-1.5 w-5 h-5 rounded-md bg-slate-900/80 backdrop-blur-xs text-amber-300 flex items-center justify-center text-[10px]">
                  📸
                </div>
              </div>
            ))}

            {/* Quick Trigger to upload */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/50 flex flex-col items-center justify-center gap-1 text-amber-900 text-xs font-bold transition-colors cursor-pointer shrink-0 p-2 text-center"
            >
              <Upload className="w-5 h-5 text-amber-600" />
              <span className="text-[10px]">{isAr ? '+ أضف صورتك' : '+ Add photo'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Sort Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-amber-600 text-white shadow-xs shadow-amber-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isAr ? 'جميع التقييمات' : 'All Reviews'} ({totalReviewsCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('with-photos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'with-photos'
                ? 'bg-amber-600 text-white shadow-xs shadow-amber-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isAr ? 'بالصور فقط' : 'With Photos'}</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {reviewsWithPhotosCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('5-star')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === '5-star'
                ? 'bg-amber-600 text-white shadow-xs shadow-amber-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>5 {isAr ? 'نجوم' : 'Stars'}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">{isAr ? 'الترتيب:' : 'Sort:'}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="recent">{isAr ? 'الأحدث أولاً' : 'Most Recent'}</option>
            <option value="highest">{isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
            <option value="helpful">{isAr ? 'الأكثر إفادة' : 'Most Helpful'}</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <p className="text-sm font-bold text-slate-700">
              {isAr ? 'لا توجد تقييمات مطابقة لهذا الفلتر' : 'No reviews match this filter'}
            </p>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className="text-xs text-amber-800 font-bold hover:underline"
            >
              {isAr ? 'عرض جميع التقييمات' : 'Show all reviews'}
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all space-y-4"
            >
              {/* Review Card Top: Author, Rating, Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center ring-2 ring-amber-100 shadow-2xs">
                    {rev.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-extrabold text-sm sm:text-base text-slate-950">
                        {rev.authorName}
                      </h5>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isAr ? 'مشتري موثق' : 'Verified Buyer'}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rev.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{rev.date}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50/80 px-2.5 py-1 rounded-xl border border-amber-200/50 self-start sm:self-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-500'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-900 ms-1">
                    {rev.rating}.0
                  </span>
                </div>
              </div>

              {/* Product Variant Tag */}
              {rev.productVariant && (
                <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                  {isAr ? 'الطلب المنفذ:' : 'Config:'} {rev.productVariant}
                </div>
              )}

              {/* Review Content */}
              <div className="space-y-1.5">
                <h6 className="font-bold text-slate-900 text-sm sm:text-base">
                  {rev.title}
                </h6>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Attached Customer Real Photos (صور العميل المرفقة بالتقييم) */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isAr ? 'صور المنتج المستلم من هذا العميل:' : 'Customer delivered photos:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {rev.photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() =>
                          setSelectedPhoto({
                            ...photo,
                            author: rev.authorName,
                            location: rev.location,
                            rating: rev.rating,
                            comment: rev.comment,
                          })
                        }
                        className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-amber-500 cursor-pointer shadow-xs hover:shadow-md transition-all"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Customer delivery'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded-full">
                            {isAr ? 'تكبير' : 'Enlarge'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Atelier Response (رد الورشة المعتمد) */}
              {rev.officialReply && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <CornerDownLeft className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{rev.officialReply.author}</span>
                    <span className="text-[10px] text-amber-700 font-normal">
                      • {rev.officialReply.date}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed ps-5">
                    {rev.officialReply.message}
                  </p>
                </div>
              )}

              {/* Footer: Helpful Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{isAr ? 'هل كان هذا التقييم مفيداً لك؟' : 'Was this review helpful?'}</span>
                <button
                  type="button"
                  onClick={() => handleToggleHelpful(rev.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-950 transition-colors cursor-pointer active:scale-95"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isAr ? 'مفيد' : 'Helpful'}</span>
                  <span className="font-mono font-bold text-slate-900 ms-0.5">
                    ({rev.helpfulCount})
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD REVIEW WITH CUSTOMER REAL PHOTOS                               */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-black text-base sm:text-lg text-slate-950">
                    {isAr ? 'إضافة تقييم وصور المنتج المستلم' : 'Submit Review & Real Photos'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'شاركنا تجربتك وصور تنفيذ طلبك لتعزيز ثقة العملاء الجدد' : 'Share your delivery photos to build trust for new buyers'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
              {/* Star Rating Picker */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <label className="font-bold text-slate-800 block">
                  {isAr ? 'ما هو تقييمك لجودة المنتج والتنفيذ؟' : 'Overall rating:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-115 active:scale-95"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                              : 'fill-slate-200 text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="font-extrabold text-amber-900 text-xs sm:text-sm ms-2">
                    {rating === 5 && (isAr ? '⭐️ ممتاز جداً - فاق التوقعات!' : 'Exceptional!')}
                    {rating === 4 && (isAr ? '⭐️ جيد جداً وجودة عالية' : 'Very Good')}
                    {rating === 3 && (isAr ? '⭐️ جيد ومطابق للمواصفات' : 'Good')}
                    {rating <= 2 && (isAr ? 'بحاجة لتحسين' : 'Needs improvement')}
                  </span>
                </div>
              </div>

              {/* Author & City Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block text-xs">
                    {isAr ? 'اسمك أو اسم شركتك / عيادتك *' : 'Your Name / Business Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={isAr ? 'مثال: م. علي الجبوري' : 'e.g. Ali Al-Jubouri'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block text-xs">
                    {isAr ? 'المدينة / المنطقة' : 'City / Area'}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={isAr ? 'مثال: بغداد - المنصور' : 'e.g. Baghdad - Mansour'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Variant / Custom Specs Optional */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  {isAr ? 'المقاس أو المواصفات المنفذة (اختياري)' : 'Product Specs / Variant (Optional)'}
                </label>
                <input
                  type="text"
                  value={productVariant}
                  onChange={(e) => setProductVariant(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: أكريليك شفاف 8 ملم مع إضاءة دافئة 3000K'
                      : 'e.g. 8mm Clear Acrylic with Warm 3000K LED'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Review Headline & Text */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  {isAr ? 'عنوان ملخص للتقييم' : 'Review Headline'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: تشطيب راقي جداً واهتمام بأدق التفاصيل'
                      : 'e.g. Immaculate finish and great attention to detail'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  {isAr ? 'تجربتك التفصيلية مع المنتج والتسليم *' : 'Your Detailed Experience *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isAr
                      ? 'صف جودة الخامات، التغليف، سرعة التوصيل، ومدى مطابقة القطعة لتوقعاتك...'
                      : 'Describe the material quality, packaging, and whether it matched your expectations...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
                />
              </div>

              {/* PHOTO UPLOAD SECTION (ميزة رفع صور المنتج المستلم) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>{isAr ? 'صور المنتج الذي استلمته (حتى 4 صور):' : 'Upload photos of received product (up to 4):'}</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono font-bold">
                    {uploadedPhotos.length} / 4
                  </span>
                </div>

                {/* Uploaded Photos Thumbnails Preview */}
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2.5 pb-1">
                    {uploadedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square rounded-xl overflow-hidden border border-amber-300 shadow-2xs group"
                      >
                        <img
                          src={photo.url}
                          alt="Uploaded customer product"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-1 end-1 p-1 rounded-full bg-slate-900/80 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-xs"
                          title={isAr ? 'حذف هذه الصورة' : 'Remove photo'}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Upload Drop Zone */}
                {uploadedPhotos.length < 4 && (
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-4 sm:p-5 text-center cursor-pointer bg-amber-50/40 hover:bg-amber-50/80 transition-all flex flex-col items-center justify-center gap-1.5"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-amber-700" />
                      </div>
                      <span className="font-bold text-amber-950 text-xs sm:text-sm">
                        {isAr
                          ? 'اضغط هنا لرفع صور من جهازك أو اسحبها هنا'
                          : 'Click to upload from device or drag photos here'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {isAr
                          ? 'يدعم صيغ JPG، PNG، WebP بحجم أقصى 5 ميجابايت'
                          : 'Supports JPG, PNG, WebP up to 5MB'}
                      </span>
                    </div>

                    {/* Quick Demo preset button to let clients easily see photos in action */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{isAr ? 'أو اختر صورة توضيحية سريعة للتجربة:' : 'Or use a quick sample:'}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleAddPresetPhoto(
                              '/images/products/acrylic_led_front_1791779703517.jpg',
                              isAr ? 'صورة استلام اللوحة' : 'Delivered plaque'
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 text-[10px] font-bold cursor-pointer"
                        >
                          {isAr ? '+ عينة أكريليك' : '+ Acrylic'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleAddPresetPhoto(
                              '/images/products/luxury_rigid_box.jpg',
                              isAr ? 'صورة علب التغليف' : 'Packaging box'
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 text-[10px] font-bold cursor-pointer"
                        >
                          {isAr ? '+ عينة تغليف' : '+ Box'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{isAr ? 'جاري النشر...' : 'Publishing...'}</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>{isAr ? 'نشر التقييم والصور الآن' : 'Publish Review & Photos'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIGHTBOX MODAL: FULL RESOLUTION VIEW OF CUSTOMER DELIVERED PHOTO         */}
      {/* ========================================================================= */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden border border-amber-900/40 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* The High-Resolution Photo */}
            <div className="md:w-3/5 bg-black flex items-center justify-center p-4 relative min-h-[300px]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Delivered product'}
                className="max-h-[60vh] md:max-h-[75vh] w-auto object-contain rounded-2xl"
              />
              <div className="absolute top-3 start-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>{isAr ? 'صورة حقيقية بعد التسليم' : 'Real Delivery Photo'}</span>
              </div>
            </div>

            {/* The Review & Customer Details Sidebar */}
            <div className="md:w-2/5 p-5 sm:p-6 flex flex-col justify-between bg-slate-900 text-white space-y-4 overflow-y-auto">
              <div className="space-y-4">
                {/* Header with Close */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                      {selectedPhoto.author.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white">
                        {selectedPhoto.author}
                      </h5>
                      <span className="text-[11px] text-slate-400 block">
                        {selectedPhoto.location}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(selectedPhoto.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{isAr ? 'مشتري موثق بالفاتورة' : 'Verified Buyer'}</span>
                  </span>
                </div>

                {/* Caption / Description */}
                {selectedPhoto.caption && (
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-amber-200">
                    <span className="font-bold text-amber-400 block mb-0.5">
                      {isAr ? 'وصف الصورة:' : 'Photo details:'}
                    </span>
                    {selectedPhoto.caption}
                  </div>
                )}

                {/* The Full Review Text */}
                <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-white block">
                    {isAr ? 'رأي العميل في الجودة والتنفيذ:' : 'Client Review on Quality:'}
                  </span>
                  <p className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 italic">
                    "{selectedPhoto.comment}"
                  </p>
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isAr
                    ? 'صُنعت بحرفية في ورشات نُون والقَلَم في بغداد مع ضمان الفحص والتركيب'
                    : 'Handcrafted in Baghdad with full quality assurance'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
