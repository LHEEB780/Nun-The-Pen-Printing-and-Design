import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useContentStore,
  CMSArticle,
  QuickLinkSectionKey,
  ArticleMetric,
} from '../../store/useContentStore';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  Search,
  Image as ImageIcon,
  Sparkles,
  Layers,
  ArrowUpRight,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  User,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export const ContentManagementTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    toggleArticleActive,
    resetToDefaults,
    setSelectedArticleId,
  } = useContentStore();

  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingArticle, setEditingArticle] = useState<CMSArticle | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form state for Edit / Create modal
  const [formData, setFormData] = useState<Partial<CMSArticle>>({});
  const [newHighlightAr, setNewHighlightAr] = useState('');
  const [newHighlightEn, setNewHighlightEn] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newMetricVal, setNewMetricVal] = useState('');
  const [newMetricLabelAr, setNewMetricLabelAr] = useState('');
  const [newMetricLabelEn, setNewMetricLabelEn] = useState('');

  const sectionOptions: Array<{ key: QuickLinkSectionKey; labelAr: string; labelEn: string }> = [
    { key: 'home', labelAr: 'الرئيسية (Home)', labelEn: 'Home' },
    { key: 'services', labelAr: 'خدماتنا (Services)', labelEn: 'Services' },
    { key: 'portfolio', labelAr: 'معرض الأعمال (Portfolio)', labelEn: 'Portfolio' },
    { key: 'custom_products', labelAr: 'منتجات مخصصة (Custom Products)', labelEn: 'Custom Products' },
    { key: 'why_us', labelAr: 'لماذا نون والقلم؟ (Why Us)', labelEn: 'Why Us' },
    { key: 'contact', labelAr: 'تواصل معنا (Contact Us)', labelEn: 'Contact Us' },
  ];

  // Filtering
  const filteredArticles = articles.filter((art) => {
    const matchesSection = selectedSectionFilter === 'all' || art.sectionKey === selectedSectionFilter;
    const matchesSearch =
      searchQuery === '' ||
      art.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summaryAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summaryEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const handleOpenEdit = (article: CMSArticle) => {
    setIsCreatingNew(false);
    setEditingArticle(article);
    setFormData({ ...article });
  };

  const handleOpenCreate = () => {
    setIsCreatingNew(true);
    const newArt: Partial<CMSArticle> = {
      sectionKey: (selectedSectionFilter !== 'all' ? selectedSectionFilter : 'services') as QuickLinkSectionKey,
      slug: `custom-article-${Date.now()}`,
      titleAr: '',
      titleEn: '',
      subtitleAr: '',
      subtitleEn: '',
      categoryAr: 'مقال ومحتوى مخصص',
      categoryEn: 'Custom Editorial',
      summaryAr: '',
      summaryEn: '',
      contentAr: '',
      contentEn: '',
      coverImage: '/images/products/led_acrylic_3d_plane_1791816292618.jpg',
      galleryImages: ['/images/products/led_acrylic_3d_plane_1791816292618.jpg'],
      authorAr: 'فريق التحرير – نُون والقَلَم',
      authorEn: 'Editorial Desk – Noon & Pen',
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: '4 دقائق',
      highlightsAr: [],
      highlightsEn: [],
      metrics: [],
      isActive: true,
      actionTextAr: 'طلب استشارة أو تصميم',
      actionTextEn: 'Inquire Now',
      actionLink: 'contact',
    };
    setEditingArticle(newArt as CMSArticle);
    setFormData(newArt);
  };

  const handleSaveForm = () => {
    if (!formData.titleAr || !formData.titleEn) {
      toast.error(isAr ? 'يرجى كتابة عنوان المقال باللغتين العربية والإنجليزية' : 'Please provide titles in both AR and EN');
      return;
    }

    if (isCreatingNew) {
      addArticle(formData as Omit<CMSArticle, 'id'>);
      toast.success(isAr ? 'تمت إضافة المقال بنجاح إلى لوحة التحكم والموقع' : 'Article created and published successfully');
    } else if (editingArticle) {
      updateArticle(editingArticle.id, formData);
      toast.success(isAr ? 'تم تحديث بيانات ومحتوى المقال بنجاح' : 'Article content updated successfully');
    }

    setEditingArticle(null);
    setIsCreatingNew(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(isAr ? `هل أنت متأكد من حذف المقال "${title}"؟` : `Delete article "${title}"?`)) {
      deleteArticle(id);
      toast.success(isAr ? 'تم حذف المقال بنجاح' : 'Article deleted');
    }
  };

  const handleReset = () => {
    if (confirm(isAr ? 'هل تريد استعادة جميع المقالات والمحتويات الافتراضية المكتوبة باحترافية؟' : 'Reset all 6 master articles to default?')) {
      resetToDefaults();
      toast.success(isAr ? 'تم استعادة المحتوى والمقالات الافتراضية بنجاح' : 'Master content restored to defaults');
    }
  };

  // Add / remove highlights
  const handleAddHighlight = () => {
    if (!newHighlightAr.trim()) return;
    setFormData((prev) => ({
      ...prev,
      highlightsAr: [...(prev.highlightsAr || []), newHighlightAr.trim()],
      highlightsEn: [...(prev.highlightsEn || []), newHighlightEn.trim() || newHighlightAr.trim()],
    }));
    setNewHighlightAr('');
    setNewHighlightEn('');
  };

  const handleRemoveHighlight = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      highlightsAr: (prev.highlightsAr || []).filter((_, i) => i !== idx),
      highlightsEn: (prev.highlightsEn || []).filter((_, i) => i !== idx),
    }));
  };

  // Add / remove gallery images
  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== idx),
    }));
  };

  // Add / remove metrics
  const handleAddMetric = () => {
    if (!newMetricVal.trim() || !newMetricLabelAr.trim()) return;
    const metric: ArticleMetric = {
      value: newMetricVal.trim(),
      labelAr: newMetricLabelAr.trim(),
      labelEn: newMetricLabelEn.trim() || newMetricLabelAr.trim(),
    };
    setFormData((prev) => ({
      ...prev,
      metrics: [...(prev.metrics || []), metric],
    }));
    setNewMetricVal('');
    setNewMetricLabelAr('');
    setNewMetricLabelEn('');
  };

  const handleRemoveMetric = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Stats */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 text-xs font-semibold border border-purple-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'نظام إدارة المحتوى والمقالات (CMS)' : 'Content Management System (CMS)'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isAr ? 'إدارة صفحات ومقالات الروابط السريعة' : 'Manage Quick Links Content & Articles'}
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'تحكّم كامل بجميع العناوين الستة (الرئيسية، خدماتنا، معرض الأعمال، منتجات مخصصة، لماذا نون والقلم؟، تواصل معنا) مع إمكانية تعديل المقالات، استبدال الصور، وتغيير الإحصائيات لحظياً عبر الموقع.'
                : 'Full CMS control over the 6 quick links (Home, Services, Portfolio, Custom Products, Why Us, Contact Us) with live article editing, high-res photography, and metrics.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/20 transition-all backdrop-blur-md"
              title={isAr ? 'استعادة النصوص الاحترافية الافتراضية' : 'Restore Master Default Content'}
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isAr ? 'استعادة الافتراضي' : 'Restore Defaults'}</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة مقال جديد' : 'New Article / Page'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Section Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSectionFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSectionFilter === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isAr ? 'كافة الأقسام (6)' : 'All Sections'}
          </button>
          {sectionOptions.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setSelectedSectionFilter(sec.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSectionFilter === sec.key
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isAr ? sec.labelAr : sec.labelEn}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في العناوين أو المحتوى...' : 'Search articles by keyword...'}
            className="w-full ps-9 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const sectionMatch = sectionOptions.find((s) => s.key === article.sectionKey);

          return (
            <div
              key={article.id}
              className={`bg-white rounded-3xl border transition-all hover:shadow-lg overflow-hidden flex flex-col ${
                article.isActive ? 'border-slate-200' : 'border-amber-200 bg-amber-50/20 opacity-80'
              }`}
            >
              {/* Cover Image & Category Badge */}
              <div className="relative h-48 bg-slate-100 overflow-hidden group">
                <img
                  src={article.coverImage}
                  alt={isAr ? article.titleAr : article.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback
                    (e.target as HTMLImageElement).src = '/images/products/led_acrylic_3d_plane_1791816292618.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />

                {/* Section Badge */}
                <div className="absolute top-3 start-3">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-purple-900 text-[11px] font-bold shadow-xs">
                    {isAr ? sectionMatch?.labelAr || article.categoryAr : sectionMatch?.labelEn || article.categoryEn}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 end-3">
                  <button
                    onClick={() => toggleArticleActive(article.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      article.isActive
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-amber-500 text-white shadow-xs'
                    }`}
                  >
                    {article.isActive ? (isAr ? 'منشور (نشط)' : 'Published') : (isAr ? 'مسودة (معطل)' : 'Draft')}
                  </button>
                </div>

                {/* Gallery Count */}
                <div className="absolute bottom-3 end-3 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px]">
                  <ImageIcon className="w-3 h-3" />
                  <span>{article.galleryImages?.length || 1} صور</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-500" />
                      <span>{article.readTime}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-sky-500" />
                      <span>{article.publishedDate}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {isAr ? article.titleAr : article.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {isAr ? article.summaryAr : article.summaryEn}
                  </p>
                </div>

                {/* Metrics Preview */}
                {article.metrics && article.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    {article.metrics.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="bg-purple-50/50 p-2 rounded-xl text-center">
                        <span className="block text-xs font-bold text-purple-700">{m.value}</span>
                        <span className="block text-[10px] text-slate-500 truncate">
                          {isAr ? m.labelAr : m.labelEn}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedArticleId(article.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isAr ? 'معاينة المقال' : 'Preview'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(article)}
                    className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                    title={isAr ? 'تعديل المحتوى' : 'Edit Article'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(article.id, isAr ? article.titleAr : article.titleEn)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title={isAr ? 'حذف المقال' : 'Delete Article'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-sm">
            {isAr ? 'لا توجد مقالات مطابقة للبحث' : 'No articles match your query'}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'جرّب البحث بكلمة مختلفة أو اختر قسماً آخر' : 'Try a different filter or reset search'}
          </p>
        </div>
      )}

      {/* Edit / Create Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-2 sm:my-6 max-h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-200">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {isCreatingNew
                      ? isAr
                        ? 'إضافة مقال وصفحة جديدة'
                        : 'Create New Article'
                      : isAr
                      ? 'تعديل محتوى المقال والصفحة'
                      : 'Edit Article Content'}
                  </h3>
                  <p className="text-[11px] text-purple-200">
                    {isAr ? 'تحرير النصوص العربية والإنجليزية والصور والإحصائيات' : 'Bilingual texts, media gallery, highlights and metrics'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Section & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAr ? 'القسم المرتبط في الموقع' : 'Associated Quick Link Section'}
                  </label>
                  <select
                    value={formData.sectionKey}
                    onChange={(e) => setFormData({ ...formData, sectionKey: e.target.value as QuickLinkSectionKey })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    {sectionOptions.map((s) => (
                      <option key={s.key} value={s.key}>
                        {isAr ? s.labelAr : s.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAr ? 'حالة النشر' : 'Publication Status'}
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'draft'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    <option value="active">{isAr ? 'نشط (معروض للزوار)' : 'Active (Published)'}</option>
                    <option value="draft">{isAr ? 'مسودة (مخفي مؤقتاً)' : 'Draft (Hidden)'}</option>
                  </select>
                </div>
              </div>

              {/* Titles AR / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAr ? 'العنوان الرئيسي (باللغة العربية) *' : 'Main Title (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr || ''}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                    placeholder="مثال: خدماتنا المتكاملة – حلول التصنيع الرقمي"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAr ? 'العنوان الرئيسي (باللغة الإنجليزية) *' : 'Main Title (English) *'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn || ''}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 dir-ltr"
                    placeholder="e.g. Our Services – Digital Fabrication & Packaging"
                  />
                </div>
              </div>

              {/* Subtitles AR / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAr ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleAr || ''}
                    onChange={(e) => setFormData({ ...formData, subtitleAr: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAr ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleEn || ''}
                    onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 dir-ltr"
                  />
                </div>
              </div>

              {/* Summaries AR / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAr ? 'ملخص تسويقي قصير (عربي)' : 'Summary / Teaser (Arabic)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summaryAr || ''}
                    onChange={(e) => setFormData({ ...formData, summaryAr: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAr ? 'ملخص تسويقي قصير (إنجليزي)' : 'Summary / Teaser (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summaryEn || ''}
                    onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 dir-ltr"
                  />
                </div>
              </div>

              {/* Full Article Content AR */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{isAr ? 'محتوى المقال الكامل بالتفصيل (عربي) *' : 'Full In-Depth Article Body (Arabic) *'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">يدعم العناوين والرموز وفقرات الماركداون</span>
                </label>
                <textarea
                  rows={8}
                  value={formData.contentAr || ''}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-none focus:border-purple-500"
                  placeholder="اكتب هنا نص المقال الكامل والشرح التسويقي والمواصفات الفنية..."
                />
              </div>

              {/* Full Article Content EN */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{isAr ? 'محتوى المقال الكامل بالتفصيل (إنجليزي) *' : 'Full In-Depth Article Body (English) *'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Markdown headings & paragraphs</span>
                </label>
                <textarea
                  rows={6}
                  value={formData.contentEn || ''}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-none focus:border-purple-500 dir-ltr"
                  placeholder="Write the full English editorial and case study here..."
                />
              </div>

              {/* Images Section */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  <span>{isAr ? 'الصور ومعرض الوسائط' : 'Images & Media Gallery'}</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'رابط الصورة البارزة (الغلاف الرئيسي)' : 'Cover Image URL'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.coverImage || ''}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 dir-ltr"
                      placeholder="/images/products/led_acrylic_3d_plane_1791816292618.jpg"
                    />
                    {formData.coverImage && (
                      <img
                        src={formData.coverImage}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    )}
                  </div>
                </div>

                {/* Gallery Images List */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'صور المعرض الإضافية' : 'Additional Gallery Images'}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.galleryImages?.map((url, idx) => (
                      <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="/images/products/... or https://..."
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 dir-ltr"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImage}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة صورة' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Highlights Section */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'النقاط والمميزات البارزة للمقال' : 'Key Highlights'}</span>
                </h4>

                <div className="space-y-2">
                  {formData.highlightsAr?.map((hl, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{hl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newHighlightAr}
                    onChange={(e) => setNewHighlightAr(e.target.value)}
                    placeholder={isAr ? 'نقطة مميزة بالعربية...' : 'Arabic highlight...'}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlightEn}
                      onChange={(e) => setNewHighlightEn(e.target.value)}
                      placeholder={isAr ? 'النقطة بالإنجليزية (اختياري)...' : 'English highlight...'}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 dir-ltr"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Metrics & Numbers */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>{isAr ? 'الأرقام والإحصائيات البارزة' : 'Metrics & Statistics'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.metrics?.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                      <div>
                        <span className="font-bold text-xs text-purple-800">{m.value}</span>
                        <span className="text-[10px] text-slate-600 block">{m.labelAr}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMetric(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newMetricVal}
                    onChange={(e) => setNewMetricVal(e.target.value)}
                    placeholder={isAr ? 'القيمة (مثال: 0.2 ملم)' : 'Value (e.g. 0.2 mm)'}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    value={newMetricLabelAr}
                    onChange={(e) => setNewMetricLabelAr(e.target.value)}
                    placeholder={isAr ? 'الوصف بالعربية' : 'Label AR'}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMetricLabelEn}
                      onChange={(e) => setNewMetricLabelEn(e.target.value)}
                      placeholder={isAr ? 'الوصف بالإنجليزي' : 'Label EN'}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 dir-ltr"
                    />
                    <button
                      type="button"
                      onClick={handleAddMetric}
                      className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveForm}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'حفظ ونشر التغييرات' : 'Save & Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
