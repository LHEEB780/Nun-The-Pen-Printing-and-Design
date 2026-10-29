import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, Printer, Download, Copy, Check, ExternalLink, Plus, 
  Trash2, Sparkles, ShieldCheck, ArrowRight, Eye, RefreshCw, 
  Layers, MapPin, Tag, Smartphone, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { 
  useAffiliateStore, QRCampaign, QRCampaignFormat, QRThemeColor, PartnerItem 
} from '../../store/useAffiliateStore';
import { toast } from 'sonner';

interface AdminQRCodesTabProps {
  isAr?: boolean;
}

const THEME_STYLES: Record<QRThemeColor, {
  nameAr: string;
  nameEn: string;
  bgClass: string;
  cardBg: string;
  borderClass: string;
  textGold: string;
  accentBadge: string;
  qrDark: string;
  qrLight: string;
}> = {
  gold_black: {
    nameAr: 'أسود ملكي مع ذهب بغداد',
    nameEn: 'Noir & Baghdad Gold',
    bgClass: 'bg-stone-950 text-amber-100',
    cardBg: 'from-stone-950 via-stone-900 to-stone-950',
    borderClass: 'border-amber-500/40',
    textGold: 'text-amber-400',
    accentBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    qrDark: '#1c1917',
    qrLight: '#ffffff',
  },
  midnight_navy: {
    nameAr: 'كحلي ملكي فخم',
    nameEn: 'Midnight Royal Navy',
    bgClass: 'bg-slate-950 text-sky-100',
    cardBg: 'from-slate-950 via-slate-900 to-slate-950',
    borderClass: 'border-sky-500/40',
    textGold: 'text-sky-300',
    accentBadge: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
    qrDark: '#0f172a',
    qrLight: '#ffffff',
  },
  emerald_luxury: {
    nameAr: 'أخضر زمردي تراثي',
    nameEn: 'Imperial Emerald',
    bgClass: 'bg-emerald-950 text-emerald-100',
    cardBg: 'from-emerald-950 via-emerald-900 to-emerald-950',
    borderClass: 'border-emerald-500/40',
    textGold: 'text-emerald-300',
    accentBadge: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
    qrDark: '#064e3b',
    qrLight: '#ffffff',
  },
  ruby_royal: {
    nameAr: 'عنابي مخملي دافئ',
    nameEn: 'Velvet Ruby',
    bgClass: 'bg-rose-950 text-rose-100',
    cardBg: 'from-rose-950 via-rose-900 to-rose-950',
    borderClass: 'border-rose-500/40',
    textGold: 'text-rose-300',
    accentBadge: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
    qrDark: '#881337',
    qrLight: '#ffffff',
  },
};

export const AdminQRCodesTab: React.FC<AdminQRCodesTabProps> = ({ isAr = true }) => {
  const { 
    partners, 
    qrCampaigns, 
    addQRCampaign, 
    deleteQRCampaign,
    incrementQRCampaignScans 
  } = useAffiliateStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaignForPrint, setSelectedCampaignForPrint] = useState<QRCampaign | null>(null);

  // Form State for New Campaign
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || '');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignLocation, setCampaignLocation] = useState('بغداد - المنصور');
  const [destinationPath, setDestinationPath] = useState<'home' | 'offers' | 'product_menus' | 'product_led' | 'custom'>('home');
  const [customPath, setCustomPath] = useState('');
  const [format, setFormat] = useState<QRCampaignFormat>('table_tent');
  const [themeColor, setThemeColor] = useState<QRThemeColor>('gold_black');
  const [discountNote, setDiscountNote] = useState('امسح للطلب الفوري مع خدمة حفر الشعار مجاناً');
  const [includeLogo, setIncludeLogo] = useState(true);

  // Generated Live QR Data URL
  const [previewQrDataUrl, setPreviewQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Selected Partner object
  const activePartner = partners.find((p) => p.id === selectedPartnerId) || partners[0];

  // Resolve current landing URL payload
  const resolvedPayloadUrl = React.useMemo(() => {
    if (!activePartner) return window.location.origin;
    const base = window.location.origin;
    const refParam = `ref=${encodeURIComponent(activePartner.referralCode)}`;
    const qrParam = `qr=${encodeURIComponent(campaignTitle ? campaignTitle.replace(/\s+/g, '-').toLowerCase() : 'campaign')}`;

    if (destinationPath === 'home') {
      return `${base}/?${refParam}&${qrParam}&utm_source=qr_${format}`;
    } else if (destinationPath === 'offers') {
      return `${base}/?${refParam}&${qrParam}&offers=true&utm_source=qr_${format}`;
    } else if (destinationPath === 'product_menus') {
      return `${base}/?${refParam}&${qrParam}&product=prod-pizza-box&utm_source=qr_${format}`;
    } else if (destinationPath === 'product_led') {
      return `${base}/?${refParam}&${qrParam}&product=prod-acrylic-led-sign&utm_source=qr_${format}`;
    } else {
      const cleanCustom = customPath.replace(/^\//, '');
      return `${base}/${cleanCustom}${cleanCustom.includes('?') ? '&' : '?'}${refParam}&${qrParam}&utm_source=qr_${format}`;
    }
  }, [activePartner, destinationPath, customPath, campaignTitle, format]);

  // Generate QR Code dynamically when payload or theme changes
  useEffect(() => {
    let isCancelled = false;
    const theme = THEME_STYLES[themeColor];

    QRCode.toDataURL(resolvedPayloadUrl, {
      width: 600,
      margin: 2,
      color: {
        dark: theme.qrDark,
        light: theme.qrLight,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (!isCancelled) {
          setPreviewQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Error generating QR Code:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [resolvedPayloadUrl, themeColor]);

  // Copy URL
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success(isAr ? 'تم نسخ الرابط المباشر التلقائي!' : 'Direct campaign URL copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Download High-Res QR Image
  const handleDownloadQR = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename || 'noon-qr-campaign'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(isAr ? 'تم تحميل صورة الباركود بدقة عالية' : 'QR code image downloaded');
  };

  // Handle Save New Campaign
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePartner) return;

    const code = `CAMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCamp = addQRCampaign({
      campaignCode: code,
      titleAr: campaignTitle.trim() || (isAr ? `ستاند ${activePartner.fullName}` : `Campaign ${activePartner.fullName}`),
      titleEn: campaignTitle.trim() || `Campaign ${activePartner.fullName}`,
      partnerId: activePartner.id,
      partnerCode: activePartner.referralCode,
      partnerName: activePartner.fullName,
      targetLocation: campaignLocation.trim(),
      destinationPath: resolvedPayloadUrl,
      campaignDiscountNoteAr: discountNote.trim(),
      campaignDiscountNoteEn: discountNote.trim(),
      format,
      themeColor,
      includeLogo,
      qrPayloadUrl: resolvedPayloadUrl,
    });

    toast.success(isAr ? 'تم إنشاء وحفظ حملة الباركود بنجاح!' : 'QR Campaign saved successfully!');
    setIsCreateModalOpen(false);
    setSelectedCampaignForPrint(newCamp);
    setCampaignTitle('');
  };

  // Launch browser native print dialog
  const handlePrintCollateral = (campaign: QRCampaign) => {
    setSelectedCampaignForPrint(campaign);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Simulate scan (test auto-apply)
  const handleSimulateScan = (url: string, partnerCode: string) => {
    try {
      localStorage.setItem('noon_applied_partner_code', partnerCode);
      const urlObj = new URL(url);
      const qrCode = urlObj.searchParams.get('qr');
      if (qrCode) {
        incrementQRCampaignScans(qrCode);
      }
      toast.success(
        isAr 
          ? `محاكاة مسح ناجحة! تم تثبيت كود الشريك (${partnerCode}) تلقائياً وسيُطبّق عند السلة والدفع.`
          : `Scan simulation successful! Partner code (${partnerCode}) is now locked in.`
      );
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <QrCode className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              {isAr ? 'حملات الباركود المطبوعة للكافيهات والمطاعم' : 'Printable QR Marketing Engine'}
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif">
            {isAr ? 'توليد باركودات QR للحملات والممثلين' : 'Printable Campaign QR Generator'}
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            {isAr 
              ? 'صمّم واطبع ستاندات طاولات للكافيهات، بوسترات المعارض، وملصقات البوكسات مع كود الشريك المعتمد الذي يُطبّق تلقائياً بمجرد مسح الكود.'
              : 'Generate print-ready QR collateral for restaurants, cafes, and packaging with auto-applying partner codes.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء وتصميم باركود جديد' : 'Generate New Campaign QR'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">
            {isAr ? 'إجمالي الحملات النشطة' : 'Active QR Campaigns'}
          </span>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {qrCampaigns.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {isAr ? 'ستاندات، بوسترات وملصقات' : 'Table tents, posters, stickers'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">
            {isAr ? 'إجمالي عمليات المسح' : 'Total QR Scans'}
          </span>
          <div className="text-2xl font-bold font-mono text-amber-700">
            {qrCampaigns.reduce((acc, c) => acc + c.scanCount, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {isAr ? 'تفاعل مباشر عبر كاميرات الهواتف' : 'Direct mobile camera interactions'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">
            {isAr ? 'الطلبات المكتملة عبر QR' : 'Orders via QR'}
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {qrCampaigns.reduce((acc, c) => acc + c.totalOrdersCount, 0)} {isAr ? 'طلب' : 'orders'}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {isAr ? 'تم ربطهم تلقائياً بالشريك' : 'Auto-bound to sales partners'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">
            {isAr ? 'مبيعات باركودات QR' : 'Total Revenue via QR'}
          </span>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {qrCampaigns.reduce((acc, c) => acc + c.totalSalesIQD, 0).toLocaleString()} <span className="text-xs font-normal text-stone-500">د.ع</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {isAr ? 'عوائد مباشرة من المواد المطبوعة' : 'Revenue from printed collateral'}
          </span>
        </div>
      </div>

      {/* Campaigns Grid / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            {isAr ? 'قائمة باركودات الحملات الجاهزة للطباعة' : 'Printable Campaign QR Roster'}
          </h3>
          <span className="text-xs font-mono text-stone-500">
            {qrCampaigns.length} {isAr ? 'حملات مسجلة' : 'campaigns'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {qrCampaigns.map((camp) => {
            const theme = THEME_STYLES[camp.themeColor] || THEME_STYLES.gold_black;
            return (
              <div 
                key={camp.id} 
                className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-amber-400/60 transition group"
              >
                {/* Header card preview miniature */}
                <div className={`p-5 bg-gradient-to-br ${theme.cardBg} text-white relative overflow-hidden`}>
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.accentBadge}`}>
                        {camp.format === 'table_tent' ? (isAr ? 'ستاند طاولة كافيهات' : 'Table Tent')
                          : camp.format === 'poster' ? (isAr ? 'بوستر جداري A4' : 'Wall Poster')
                          : camp.format === 'sticker' ? (isAr ? 'ملصق علب هدايا' : 'Gift Sticker')
                          : (isAr ? 'بطاقة ممثل VIP' : 'VIP Card')}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1.5 line-clamp-1">{camp.titleAr}</h4>
                      <p className="text-[11px] text-stone-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{camp.targetLocation || (isAr ? 'العراق' : 'Iraq')}</span>
                      </p>
                    </div>

                    <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-md shrink-0 flex items-center justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(camp.qrPayloadUrl)}`}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-300">
                    <div>
                      <span className="text-[10px] text-stone-400 block">{isAr ? 'الممثل المعتمد:' : 'Partner:'}</span>
                      <strong className="text-white text-xs">{camp.partnerName}</strong>
                    </div>
                    <div className="text-left rtl:text-left ltr:text-right">
                      <span className="text-[10px] text-stone-400 block">{isAr ? 'كود التفعيل:' : 'Code:'}</span>
                      <strong className="font-mono text-amber-400 text-xs">{camp.partnerCode}</strong>
                    </div>
                  </div>
                </div>

                {/* Metrics & Details */}
                <div className="p-4 space-y-3 bg-white">
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-stone-50 rounded-2xl border border-stone-100 text-center">
                    <div>
                      <span className="text-[10px] text-stone-500 block">{isAr ? 'المسحات' : 'Scans'}</span>
                      <strong className="font-mono text-xs text-stone-900">{camp.scanCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">{isAr ? 'الطلبات' : 'Orders'}</span>
                      <strong className="font-mono text-xs text-emerald-700">{camp.totalOrdersCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">{isAr ? 'المبيعات' : 'Sales'}</span>
                      <strong className="font-mono text-[11px] text-amber-800">{camp.totalSalesIQD.toLocaleString()} د.ع</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-600 line-clamp-1 italic">
                    "{camp.campaignDiscountNoteAr}"
                  </p>

                  {/* Actions buttons */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePrintCollateral(camp)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      title={isAr ? 'طباعة الستاند أو الملصق بجودة عالية' : 'Print Collateral'}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isAr ? 'طباعة' : 'Print'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateScan(camp.qrPayloadUrl, camp.partnerCode)}
                      className="py-2 px-2.5 rounded-xl border border-stone-200 hover:bg-amber-50 text-amber-900 font-medium text-xs transition flex items-center gap-1 cursor-pointer"
                      title={isAr ? 'محاكاة المسح وتجربة التطبيق التلقائي للكود' : 'Simulate Scan'}
                    >
                      <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">{isAr ? 'تجربة' : 'Test'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyUrl(camp.qrPayloadUrl)}
                      className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition cursor-pointer"
                      title={isAr ? 'نسخ الرابط التلقائي' : 'Copy Link'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteQRCampaign(camp.id)}
                      className="p-2 rounded-xl border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                      title={isAr ? 'حذف الحملة' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INTERACTIVE QR CAMPAIGN GENERATOR & DESIGNER */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <div>
                <span className="text-xs uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isAr ? 'استوديو تصميم المواد الدعائية للشركاء' : 'Partner Print Studio'}</span>
                </span>
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  {isAr ? 'توليد باركود QR لحملة تسويقية مطبوعة' : 'Generate Campaign QR Collateral'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Controls (Left/Right) */}
              <form onSubmit={handleSaveCampaign} className="lg:col-span-7 space-y-4">
                {/* 1. Target Partner */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>{isAr ? 'الشريك / ممثل المبيعات المستفيد' : 'Assigned Sales Partner'} *</span>
                    <span className="text-[10px] text-amber-800 font-mono">
                      {activePartner ? `${activePartner.employeeId} • ${activePartner.referralCode}` : ''}
                    </span>
                  </label>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 bg-white"
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.employeeId} - كود: {p.referralCode}) - {p.city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Campaign Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {isAr ? 'اسم الحملة أو النشاط' : 'Campaign Title'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={campaignTitle}
                      onChange={(e) => setCampaignTitle(e.target.value)}
                      placeholder={isAr ? 'مثال: ستاند كافيه دجلة لاونج' : 'e.g. Tigris Cafe Stand'}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {isAr ? 'المدينة أو المكان المستهدف' : 'Location / Venue'}
                    </label>
                    <input
                      type="text"
                      value={campaignLocation}
                      onChange={(e) => setCampaignLocation(e.target.value)}
                      placeholder={isAr ? 'مثال: المنصور - شارع 14 رمضان' : 'Baghdad - Mansour'}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 3. Physical Format Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isAr ? 'نوع التصميم والمقاس المطبوع' : 'Printable Format & Dimension'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'table_tent' as QRCampaignFormat, nameAr: 'ستاند طاولة', descAr: '10×15 سم مزدوج', nameEn: 'Table Tent' },
                      { id: 'sticker' as QRCampaignFormat, nameAr: 'ملصق علب', descAr: '7×7 سم دائري', nameEn: 'Box Sticker' },
                      { id: 'poster' as QRCampaignFormat, nameAr: 'بوستر جداري', descAr: 'A4 / A5 ريسبشن', nameEn: 'Wall Poster' },
                      { id: 'vip_card' as QRCampaignFormat, nameAr: 'بطاقة VIP', descAr: 'حجم بطاقة العمل', nameEn: 'VIP Card' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormat(f.id)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          format === f.id
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 text-amber-950 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="text-xs">{isAr ? f.nameAr : f.nameEn}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{f.descAr}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Luxury Color Theme */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isAr ? 'طابع الهوية والألوان الفاخرة' : 'Luxury Atelier Theme'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(THEME_STYLES) as QRThemeColor[]).map((themeKey) => {
                      const t = THEME_STYLES[themeKey];
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => setThemeColor(themeKey)}
                          className={`p-2 rounded-xl border text-center transition cursor-pointer flex items-center gap-2 ${
                            themeColor === themeKey
                              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50 text-stone-900 font-bold'
                              : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full shrink-0 border border-stone-300"
                            style={{ backgroundColor: t.qrDark }}
                          />
                          <span className="text-[11px] truncate">{isAr ? t.nameAr.split(' ')[0] : t.nameEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Destination on Scan */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isAr ? 'صفحة الهبوط عند مسح الباركود' : 'Landing Destination upon Scan'}
                  </label>
                  <select
                    value={destinationPath}
                    onChange={(e) => setDestinationPath(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="home">{isAr ? 'الصفحة الرئيسية للمتجر مع تطبيق كود الشريك' : 'Storefront Home'}</option>
                    <option value="offers">{isAr ? 'صفحة عروض الموسم والتخفيضات الكبرى (خصم 33%)' : 'Seasonal Offers'}</option>
                    <option value="product_menus">{isAr ? 'كتالوج علب وحوافظ المنيو والتغليف الفاخر' : 'Luxury Packaging & Menus'}</option>
                    <option value="product_led">{isAr ? 'كتالوج لوحات الأكريليك المضيئة LED' : 'Acrylic 3D LED Signs'}</option>
                    <option value="custom">{isAr ? 'رابط مخصص أو صفحة هبوط تيك توك...' : 'Custom URL'}</option>
                  </select>

                  {destinationPath === 'custom' && (
                    <input
                      type="text"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value)}
                      placeholder="/?campaign=ramadan_cafe"
                      className="mt-2 w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono text-stone-900 outline-none"
                    />
                  )}
                </div>

                {/* 6. Promotional Offer / Incentive Text */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isAr ? 'النص التحفيزي أو الميزة المطبوعة على الستاند' : 'Incentive / Customer Hook'}
                  </label>
                  <input
                    type="text"
                    value={discountNote}
                    onChange={(e) => setDiscountNote(e.target.value)}
                    placeholder={isAr ? 'امسح للطلب مع حفر ليزر مخصص مجاناً' : 'Scan for free custom engraving'}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-amber-500"
                  />
                </div>

                {/* Generated URL & Auto-Apply Guarantee Notice */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5 text-xs text-amber-950">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'الارتباط التلقائي مضمون 100%:' : 'Guaranteed Auto-Apply Link:'}</span>
                  </div>
                  <div className="font-mono text-[11px] text-amber-900/80 break-all p-2 bg-white rounded-xl border border-amber-200">
                    {resolvedPayloadUrl}
                  </div>
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    {isAr 
                      ? 'بمجرد أن يوجّه العميل كاميرا هاتفه نحو هذا الباركود، يدخل المتجر ويُحفظ كود الممثل تلقائياً في السلة والدفع.'
                      : 'Scanning auto-injects and locks the partner code into the customer checkout.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 text-xs text-stone-500 hover:text-stone-800 transition"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                  >
                    {isAr ? 'حفظ وتجهيز للطباعة' : 'Save & Prepare for Print'}
                  </button>
                </div>
              </form>

              {/* Real-time Physical Preview (Right/Left) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-stone-100 rounded-3xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 mb-3 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-stone-400" />
                  <span>{isAr ? 'معاينة التصميم الواقعي المطبوع' : 'Physical Print Preview'}</span>
                </span>

                {/* Preview Card Shell */}
                <div 
                  className={`w-full max-w-[280px] p-6 rounded-3xl shadow-xl border ${THEME_STYLES[themeColor].borderClass} bg-gradient-to-br ${THEME_STYLES[themeColor].cardBg} text-white flex flex-col items-center text-center relative overflow-hidden`}
                >
                  {/* Baghdad Atelier Header */}
                  <div className="mb-3">
                    <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold block">
                      {isAr ? 'دار نُون والقَلَم • بغداد' : 'NOON & PEN CALLIGRAPHY'}
                    </span>
                    <h4 className="text-base font-bold font-serif text-white mt-0.5">
                      {campaignTitle || (isAr ? 'خدمة الطلب المباشر' : 'Direct Order')}
                    </h4>
                    {campaignLocation && (
                      <span className="text-[10px] text-stone-300 block">{campaignLocation}</span>
                    )}
                  </div>

                  {/* QR Image Box */}
                  <div className="w-44 h-44 bg-white p-2.5 rounded-2xl shadow-lg border-2 border-amber-400/80 my-2 flex items-center justify-center relative">
                    {previewQrDataUrl ? (
                      <img 
                        src={previewQrDataUrl} 
                        alt="QR Code" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="animate-pulse text-stone-400 text-xs font-mono">{isAr ? 'جاري التوليد...' : 'Generating...'}</div>
                    )}
                  </div>

                  {/* Discount / Hook */}
                  <p className="text-[11px] font-semibold text-amber-300 mt-2 px-2 leading-relaxed">
                    {discountNote}
                  </p>

                  {/* Partner ID & Code pill */}
                  <div className="mt-3 pt-3 border-t border-white/10 w-full flex items-center justify-between text-[10px]">
                    <span className="text-stone-300">{activePartner?.fullName}</span>
                    <span className="font-mono font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded-md border border-amber-500/30">
                      {activePartner?.referralCode}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center w-full">
                  <button
                    type="button"
                    onClick={() => handleDownloadQR(previewQrDataUrl, `noon-${activePartner?.referralCode}`)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تحميل PNG' : 'PNG'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(resolvedPayloadUrl)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ الرابط' : 'Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRINTABLE COLLATERAL DISPLAY (Print Sheet) */}
      {/* ========================================================================= */}
      {selectedCampaignForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto flex flex-col justify-between"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* Top Toolbar (Hidden on print) */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-stone-900 text-sm">
                  {isAr ? 'معاينة الطباعة المعتمدة (جاهز للقص والستاند)' : 'Print-Ready Collateral Sheet'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:from-amber-700 hover:to-amber-800 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isAr ? 'طباعة فورية الآن' : 'Print Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCampaignForPrint(null)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>

            {/* PRINTABLE CONTAINER (This is what prints) */}
            <div className="printable-qr-sheet flex flex-col items-center justify-center py-6 px-4">
              {/* Table Tent layout (front & fold line) */}
              {selectedCampaignForPrint.format === 'table_tent' && (
                <div className="w-full max-w-md border-2 border-dashed border-stone-300 p-4 rounded-3xl bg-stone-50">
                  <div className="text-[10px] text-stone-400 text-center mb-2 font-mono print:hidden">
                    ✂️ خط الثني والقص لستاند الأكريليك (10×15 سم)
                  </div>

                  <div className="p-8 rounded-3xl shadow-xl bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white border-2 border-amber-500/50 text-center">
                    {/* Calligraphy logo */}
                    <div className="mb-4">
                      <div className="inline-block p-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-widest uppercase mb-1">
                        نُون والقَلَم • بغداد
                      </div>
                      <h3 className="text-xl font-bold font-serif text-amber-200">
                        {selectedCampaignForPrint.titleAr}
                      </h3>
                      {selectedCampaignForPrint.targetLocation && (
                        <p className="text-xs text-stone-300 mt-0.5">{selectedCampaignForPrint.targetLocation}</p>
                      )}
                    </div>

                    {/* QR Code */}
                    <div className="w-52 h-52 bg-white p-3 rounded-2xl mx-auto shadow-2xl border-2 border-amber-400">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedCampaignForPrint.qrPayloadUrl)}`}
                        alt="Campaign QR"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Instruction & Hook */}
                    <div className="mt-4 space-y-1">
                      <p className="text-xs font-bold text-amber-300">
                        {selectedCampaignForPrint.campaignDiscountNoteAr}
                      </p>
                      <p className="text-[11px] text-stone-300">
                        امسح الكود بكاميرا هاتفك للطلب مع الضمان الذهبي
                      </p>
                    </div>

                    {/* Partner ID Stamp */}
                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <div className="text-right">
                        <span className="text-[9px] text-stone-400 block">ممثل المبيعات المعتمد</span>
                        <strong className="text-white font-medium">{selectedCampaignForPrint.partnerName}</strong>
                      </div>
                      <div className="text-left font-mono">
                        <span className="text-[9px] text-stone-400 block">كود الشريك الحصري</span>
                        <strong className="text-amber-400 font-bold bg-white/10 px-2 py-0.5 rounded">
                          {selectedCampaignForPrint.partnerCode}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sticker format (Circular seal) */}
              {selectedCampaignForPrint.format === 'sticker' && (
                <div className="w-72 h-72 rounded-full border-4 border-amber-500/80 p-5 bg-gradient-to-br from-stone-950 to-stone-900 text-white text-center flex flex-col items-center justify-center shadow-xl">
                  <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">
                    نُون والقَلَم • ختم التجهيز
                  </span>

                  <div className="w-32 h-32 bg-white p-2 rounded-xl my-2 border border-amber-300">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(selectedCampaignForPrint.qrPayloadUrl)}`}
                      alt="Sticker QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span className="text-[10px] text-stone-200 font-bold">
                    امسح لإعادة طلب نفس البوكس
                  </span>
                  <span className="font-mono text-[10px] text-amber-400">
                    كود: {selectedCampaignForPrint.partnerCode}
                  </span>
                </div>
              )}

              {/* Poster format (A4) */}
              {(selectedCampaignForPrint.format === 'poster' || selectedCampaignForPrint.format === 'vip_card') && (
                <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white border-2 border-amber-500/40 text-center shadow-2xl">
                  <div className="mb-4">
                    <span className="text-[10px] tracking-widest text-amber-400 font-bold block mb-1">
                      دار نُون والقَلَم للتحف والمطبوعات الفاخرة
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-white">
                      {selectedCampaignForPrint.titleAr}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">{selectedCampaignForPrint.campaignDiscountNoteAr}</p>
                  </div>

                  <div className="w-56 h-56 bg-white p-3.5 rounded-2xl mx-auto shadow-2xl border-2 border-amber-400 my-4">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(selectedCampaignForPrint.qrPayloadUrl)}`}
                      alt="Poster QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 mt-4 flex items-center justify-between text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">الممثل والشريك</span>
                      <strong className="text-white">{selectedCampaignForPrint.partnerName}</strong>
                    </div>
                    <div className="text-left font-mono">
                      <span className="text-[10px] text-stone-400 block">كود التفعيل</span>
                      <strong className="text-amber-400 font-bold">{selectedCampaignForPrint.partnerCode}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Print Instructions */}
            <div className="text-center text-xs text-stone-400 pt-4 border-t border-stone-200 print:hidden">
              {isAr 
                ? 'اضغط زر "طباعة فورية الآن" أعلاه لطباعة التصميم بدقة 300DPI مناسبة للقص والتركيب المباشر.'
                : 'Click "Print Now" to output 300DPI crisp collateral for stands and packaging.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
