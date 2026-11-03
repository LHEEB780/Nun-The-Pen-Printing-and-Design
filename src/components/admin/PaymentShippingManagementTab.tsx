import React, { useState } from 'react';
import {
  CreditCard,
  Truck,
  Globe,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  Eye,
  RefreshCw,
  Wallet,
  Building,
  Plane,
  Package,
  Sliders,
  DollarSign,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  X,
  Key,
  ExternalLink,
  Layers,
  HelpCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  usePaymentShippingConfigStore,
  PaymentGatewayConfig,
  ShippingCarrierConfig,
  PaymentGatewayId,
  ShippingCarrierId,
} from '../../store/usePaymentShippingConfigStore';
import { SUPPORTED_COUNTRIES } from '../../data/geoData';

interface PaymentShippingManagementTabProps {
  isAr?: boolean;
}

// Pre-built regional presets for 1-click addition
const GATEWAY_PRESETS: Array<Omit<PaymentGatewayConfig, 'isEnabled' | 'isCustom'>> = [
  {
    id: 'qi_card',
    nameAr: 'كي كارد (Qi Card Iraq)',
    nameEn: 'Qi Card Mastercard',
    badgeAr: 'الأوسع انتشاراً في العراق',
    descriptionAr: 'الدفع الإلكتروني المباشر عبر ماستركارد الرافدين والرشيد وخدمات كي كارد العراقية',
    descriptionEn: 'Direct checkout using Iraqi Qi Card & national Mastercard accounts',
    iconType: 'card',
    supportedCountryCodes: ['IQ'],
    supportedCurrencies: ['IQD', 'USD'],
    processingFeePercent: 0,
    isTestMode: true,
    instructionsAr: 'يتم تأكيد عملية الدفع بخصم مباشر من رصيد بطاقة كي كارد أو عبر تطبيق خدماتي.',
  },
  {
    id: 'stc_pay',
    nameAr: 'إس تي سي باي (STC Pay KSA)',
    nameEn: 'STC Pay Digital Wallet',
    badgeAr: 'الأشهر في المملكة العربية السعودية',
    descriptionAr: 'الدفع الفوري الذكي عبر محفظة STC Pay برقم الجوال المعتمد بدون إدخال أرقام بطاقات',
    descriptionEn: 'Instant frictionless mobile wallet payment via STC Pay KSA',
    iconType: 'wallet',
    supportedCountryCodes: ['SA'],
    supportedCurrencies: ['SAR'],
    processingFeePercent: 0,
    isTestMode: true,
    instructionsAr: 'سيصلك إشعار فوري على تطبيق STC Pay للموافقة على عملية الدفع بضغطة زر واحدة.',
  },
  {
    id: 'tamara',
    nameAr: 'تمارا - قسّمها على 4 دفعات (Tamara)',
    nameEn: 'Tamara - Split in 4',
    badgeAr: 'اشتري الآن وادفع لاحقاً بدون فوائد',
    descriptionAr: 'قسّم فاتورتك على 4 دفعات مريحة ومتوافقة مع الشريعة الإسلامية وبدون أي فوائد أو رسوم تأخير',
    descriptionEn: 'Buy now, pay later split into 4 equal installments with zero interest',
    iconType: 'card',
    supportedCountryCodes: ['SA', 'AE', 'KW'],
    supportedCurrencies: ['SAR', 'AED', 'KWD'],
    processingFeePercent: 0,
    isTestMode: true,
    instructionsAr: 'سدد الدفعة الأولى الآن، وباقي الدفعات تجدول شهرياً بدون أي فوائد إضافية.',
  },
  {
    id: 'tabby',
    nameAr: 'تابي - قسّمها على دفعات (Tabby)',
    nameEn: 'Tabby Pay in 4',
    badgeAr: 'تسوق الآن وقسّم مشترياتك',
    descriptionAr: 'قسّم مشترياتك على 4 دفعات شهرية بدون أي فوائد أو رسوم إضافية عبر كروت مدى والبطاقات البنكية',
    descriptionEn: 'Split into 4 monthly payments with zero fees or interest',
    iconType: 'card',
    supportedCountryCodes: ['SA', 'AE', 'KW', 'QA', 'BH'],
    supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD'],
    processingFeePercent: 0,
    isTestMode: true,
    instructionsAr: 'يتم قبول بطاقات مدى وفيزا وماستركارد وتفعيل خطة التقسيط فوراً عند الإتمام.',
  },
  {
    id: 'paymob',
    nameAr: 'باي موب (Paymob Egypt & GCC)',
    nameEn: 'Paymob Payment Gateway',
    badgeAr: 'ميزا، المحافظ، والبطاقات البنكية',
    descriptionAr: 'بوابة الدفع الرائدة في مصر وشمال إفريقيا والخليج بمختلف وسائل الدفع المحلية كالمحافظ وإنستاباي',
    descriptionEn: 'Leading payment aggregator for Egypt, Levant and GCC',
    iconType: 'card',
    supportedCountryCodes: ['EG', 'SA', 'AE', 'GLOBAL'],
    supportedCurrencies: ['EGP', 'SAR', 'AED', 'USD'],
    processingFeePercent: 0,
    isTestMode: true,
    instructionsAr: 'تدعم ميزة، فودافون كاش، أورنج كاش، إنستاباي، والبطاقات الائتمانية البنكية.',
  },
  {
    id: 'myfatoorah',
    nameAr: 'ماي فاتورة (MyFatoorah)',
    nameEn: 'MyFatoorah Regional Gateway',
    badgeAr: 'دفع فوري لكافة دول الشرق الأوسط',
    descriptionAr: 'تغطية شاملة لـ KNET وبنفت ومدى وسداد والبطاقات الدولية برابط دفع مشفر',
    descriptionEn: 'Seamless MENA payment routing with KNET, Benefit, Mada & Credit cards',
    iconType: 'card',
    supportedCountryCodes: ['KW', 'SA', 'AE', 'BH', 'QA', 'OM', 'EG', 'JO'],
    supportedCurrencies: ['KWD', 'SAR', 'AED', 'BHD', 'QAR', 'OMR', 'USD'],
    processingFeePercent: 0,
    isTestMode: true,
    instructionsAr: 'توجيه آمن وفوري إلى بوابة الدفع الوطنية المعتمدة في بلدك.',
  },
];

const CARRIER_PRESETS: Array<Omit<ShippingCarrierConfig, 'isEnabled' | 'isCustom'>> = [
  {
    id: 'smsa_express',
    nameAr: 'سمسا إكسبريس (SMSA Express)',
    nameEn: 'SMSA Express Priority',
    badgeAr: 'الأوسع انتشاراً في السعودية والخليج',
    descriptionAr: 'شبكة شحن سريع متكاملة لكافة مدن ومحافظات المملكة العربية السعودية ودول الخليج العربي',
    descriptionEn: 'Comprehensive express logistics across all Saudi Arabia and GCC cities',
    iconType: 'truck',
    supportedCountryCodes: ['SA', 'AE', 'KW', 'BH', 'QA', 'OM'],
    deliveryDaysAr: '2 - 4 أيام عمل',
    deliveryDaysEn: '2 - 4 business days',
    basePriceIQD: 22000,
    basePriceUSD: 16,
    freeShippingThresholdIQD: 300000,
    freeShippingThresholdUSD: 200,
    trackingPrefix: 'SMSA',
    trackingUrlTemplate: 'https://www.smsaexpress.com/track?id={TRACKING_NUMBER}',
  },
  {
    id: 'zajil',
    nameAr: 'زاجل إكسبريس (Zajil Express)',
    nameEn: 'Zajil Express Logistics',
    badgeAr: 'شحن اقتصادي وسريع للمملكة',
    descriptionAr: 'توصيل موثوق وسريع مع إمكانية الاستلام من فروع زاجل أو التوصيل المباشر حتى باب المنزل',
    descriptionEn: 'Cost-effective parcel delivery with extensive branch pickup in KSA',
    iconType: 'package',
    supportedCountryCodes: ['SA'],
    deliveryDaysAr: '2 - 3 أيام عمل',
    deliveryDaysEn: '2 - 3 business days',
    basePriceIQD: 18000,
    basePriceUSD: 13,
    freeShippingThresholdIQD: 250000,
    freeShippingThresholdUSD: 180,
    trackingPrefix: 'ZAJ',
    trackingUrlTemplate: 'https://zajil.com/track/{TRACKING_NUMBER}',
  },
  {
    id: 'redbox',
    nameAr: 'الخزائن الذكية ريد بوكس (RedBox)',
    nameEn: 'RedBox Smart Lockers',
    badgeAr: 'استلام ذاتي 24/7 من أقرب خزانة ذكية',
    descriptionAr: 'استلم طردك الفاخر متى ما شئت عبر شبكة الخزائن الذكية الحديثة المنتشرة في السعودية',
    descriptionEn: '24/7 autonomous self-service locker pickup across Saudi Arabia',
    iconType: 'package',
    supportedCountryCodes: ['SA'],
    deliveryDaysAr: '24 - 48 ساعة',
    deliveryDaysEn: '24 - 48 hours',
    basePriceIQD: 14000,
    basePriceUSD: 10,
    freeShippingThresholdIQD: 200000,
    freeShippingThresholdUSD: 150,
    trackingPrefix: 'RDBX',
    trackingUrlTemplate: 'https://redboxsa.com/track?no={TRACKING_NUMBER}',
  },
  {
    id: 'iraq_post',
    nameAr: 'البريد والتوفير العراقي السريع (Iraqi Post EMS)',
    nameEn: 'Iraqi National Post (EMS Priority)',
    badgeAr: 'البريد الحكومي لكافة الأقضية',
    descriptionAr: 'تغطية رسمية متكاملة لجميع المحافظات والأقضية والنواحي في العراق والشحن البريدي الدولي',
    descriptionEn: 'Official government postal delivery covering all Iraqi districts and international mail',
    iconType: 'truck',
    supportedCountryCodes: ['IQ', 'GLOBAL'],
    deliveryDaysAr: '3 - 6 أيام عمل',
    deliveryDaysEn: '3 - 6 business days',
    basePriceIQD: 4000,
    basePriceUSD: 3,
    freeShippingThresholdIQD: 120000,
    freeShippingThresholdUSD: 90,
    trackingPrefix: 'IQ-EMS',
    trackingUrlTemplate: 'https://iraqpost.gov.iq/track/{TRACKING_NUMBER}',
  },
  {
    id: 'barq_express',
    nameAr: 'بارق إكسبريس (Barq Express)',
    nameEn: 'Barq On-demand Courier',
    badgeAr: 'توصيل فوري خلال 12-24 ساعة',
    descriptionAr: 'أسطول سيارات ودراجات مخصصة للتوصيل العاجل الفاخر للهدايا والمناسبات المستعجلة داخل بغداد',
    descriptionEn: 'Same-day urgent white-glove express courier in Baghdad',
    iconType: 'truck',
    supportedCountryCodes: ['IQ'],
    deliveryDaysAr: 'خلال 12 - 24 ساعة (نفس اليوم)',
    deliveryDaysEn: 'Within 12 - 24 hours',
    basePriceIQD: 7000,
    basePriceUSD: 5,
    freeShippingThresholdIQD: 180000,
    freeShippingThresholdUSD: 130,
    trackingPrefix: 'BRQ',
  },
];

export const PaymentShippingManagementTab: React.FC<PaymentShippingManagementTabProps> = ({
  isAr = true,
}) => {
  const {
    gateways,
    carriers,
    toggleGateway,
    toggleGatewayTestMode,
    addGateway,
    deleteGateway,
    toggleCarrier,
    addCarrier,
    deleteCarrier,
    getAvailableGateways,
    getAvailableCarriers,
    resetToDefaults,
  } = usePaymentShippingConfigStore();

  const [activeSubTab, setActiveSubTab] = useState<'gateways' | 'carriers' | 'simulator'>('gateways');
  const [simulatorCountry, setSimulatorCountry] = useState<string>('IQ');

  // Modal States
  const [isAddGatewayModalOpen, setIsAddGatewayModalOpen] = useState(false);
  const [isAddCarrierModalOpen, setIsAddCarrierModalOpen] = useState(false);

  // New Gateway Form State
  const [newGwId, setNewGwId] = useState('');
  const [newGwNameAr, setNewGwNameAr] = useState('');
  const [newGwNameEn, setNewGwNameEn] = useState('');
  const [newGwBadgeAr, setNewGwBadgeAr] = useState('');
  const [newGwDescAr, setNewGwDescAr] = useState('');
  const [newGwIconType, setNewGwIconType] = useState<PaymentGatewayConfig['iconType']>('card');
  const [newGwCountries, setNewGwCountries] = useState<string[]>(['IQ']);
  const [newGwCurrencies, setNewGwCurrencies] = useState<string[]>(['IQD', 'USD']);
  const [newGwIsTest, setNewGwIsTest] = useState(true);
  const [newGwMerchantId, setNewGwMerchantId] = useState('');
  const [newGwApiKey, setNewGwApiKey] = useState('');
  const [newGwInstructions, setNewGwInstructions] = useState('');

  // New Carrier Form State
  const [newCarrierId, setNewCarrierId] = useState('');
  const [newCarrierNameAr, setNewCarrierNameAr] = useState('');
  const [newCarrierNameEn, setNewCarrierNameEn] = useState('');
  const [newCarrierBadgeAr, setNewCarrierBadgeAr] = useState('');
  const [newCarrierDescAr, setNewCarrierDescAr] = useState('');
  const [newCarrierIconType, setNewCarrierIconType] = useState<ShippingCarrierConfig['iconType']>('truck');
  const [newCarrierDeliveryDaysAr, setNewCarrierDeliveryDaysAr] = useState('2 - 4 أيام عمل');
  const [newCarrierPriceIQD, setNewCarrierPriceIQD] = useState<number>(15000);
  const [newCarrierPriceUSD, setNewCarrierPriceUSD] = useState<number>(10);
  const [newCarrierFreeIQD, setNewCarrierFreeIQD] = useState<number>(250000);
  const [newCarrierPrefix, setNewCarrierPrefix] = useState('TRK');
  const [newCarrierTrackingUrl, setNewCarrierTrackingUrl] = useState('');
  const [newCarrierCountries, setNewCarrierCountries] = useState<string[]>(['SA']);

  // Stats
  const enabledGatewaysCount = gateways.filter((g) => g.isEnabled).length;
  const enabledCarriersCount = carriers.filter((c) => c.isEnabled).length;

  const handleToggleGateway = (id: PaymentGatewayId, name: string) => {
    toggleGateway(id);
    const target = gateways.find((g) => g.id === id);
    const willBeEnabled = !target?.isEnabled;
    toast.success(
      isAr
        ? `تم ${willBeEnabled ? 'تفعيل' : 'تعطيل'} بوابة [${name}] بنجاح — تظهر في صفحة الدفع فوراً`
        : `Payment gateway [${name}] has been ${willBeEnabled ? 'enabled' : 'disabled'}`
    );
  };

  const handleToggleCarrier = (id: ShippingCarrierId, name: string) => {
    toggleCarrier(id);
    const target = carriers.find((c) => c.id === id);
    const willBeEnabled = !target?.isEnabled;
    toast.success(
      isAr
        ? `تم ${willBeEnabled ? 'تفعيل' : 'تعطيل'} شركة الشحن [${name}] — ستظهر خيارات التوصيل بناءً على ذلك`
        : `Carrier [${name}] has been ${willBeEnabled ? 'enabled' : 'disabled'}`
    );
  };

  const handleDeleteGateway = (id: string, name: string) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف بوابة الدفع [${name}]؟` : `Delete gateway ${name}?`)) {
      deleteGateway(id);
      toast.info(isAr ? `تم حذف بوابة [${name}] من المتجر` : `Gateway deleted`);
    }
  };

  const handleDeleteCarrier = (id: string, name: string) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف شركة الشحن [${name}]؟` : `Delete carrier ${name}?`)) {
      deleteCarrier(id);
      toast.info(isAr ? `تم حذف شركة الشحن [${name}] من المتجر` : `Carrier deleted`);
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        isAr
          ? 'هل أنت متأكد من رغبتك في استعادة ضبط بوابات الدفع وشركات الشحن إلى الإعدادات القياسية الأصلية؟'
          : 'Are you sure you want to reset all payment and shipping configurations to default?'
      )
    ) {
      resetToDefaults();
      toast.info(isAr ? 'تمت استعادة الإعدادات الأصلية بنجاح' : 'Settings reset to defaults');
    }
  };

  // Preset Selection for Gateways
  const applyGatewayPreset = (preset: typeof GATEWAY_PRESETS[0]) => {
    setNewGwId(preset.id);
    setNewGwNameAr(preset.nameAr);
    setNewGwNameEn(preset.nameEn);
    setNewGwBadgeAr(preset.badgeAr);
    setNewGwDescAr(preset.descriptionAr);
    setNewGwIconType(preset.iconType);
    setNewGwCountries(preset.supportedCountryCodes);
    setNewGwCurrencies(preset.supportedCurrencies);
    setNewGwIsTest(preset.isTestMode);
    setNewGwInstructions(preset.instructionsAr || '');
    toast.success(isAr ? `تم تعبئة بيانات [${preset.nameAr}] تلقائياً` : 'Preset applied');
  };

  // Preset Selection for Carriers
  const applyCarrierPreset = (preset: typeof CARRIER_PRESETS[0]) => {
    setNewCarrierId(preset.id);
    setNewCarrierNameAr(preset.nameAr);
    setNewCarrierNameEn(preset.nameEn);
    setNewCarrierBadgeAr(preset.badgeAr);
    setNewCarrierDescAr(preset.descriptionAr);
    setNewCarrierIconType(preset.iconType);
    setNewCarrierDeliveryDaysAr(preset.deliveryDaysAr);
    setNewCarrierPriceIQD(preset.basePriceIQD);
    setNewCarrierPriceUSD(preset.basePriceUSD);
    setNewCarrierFreeIQD(preset.freeShippingThresholdIQD || 250000);
    setNewCarrierPrefix(preset.trackingPrefix);
    setNewCarrierTrackingUrl(preset.trackingUrlTemplate || '');
    setNewCarrierCountries(preset.supportedCountryCodes);
    toast.success(isAr ? `تم تعبئة بيانات [${preset.nameAr}] تلقائياً` : 'Carrier preset applied');
  };

  // Submit New Gateway
  const handleSaveNewGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGwId.trim() || !newGwNameAr.trim()) {
      toast.error(isAr ? 'يرجى كتابة معرّف البوابة واسمها بالعربية' : 'Please provide ID and Arabic name');
      return;
    }

    const payload: PaymentGatewayConfig = {
      id: newGwId.trim().toLowerCase().replace(/\s+/g, '_'),
      nameAr: newGwNameAr.trim(),
      nameEn: newGwNameEn.trim() || newGwNameAr.trim(),
      descriptionAr: newGwDescAr.trim() || 'بوابة دفع إلكتروني آمنة ومعتمدة',
      descriptionEn: newGwNameEn.trim() || 'Secure digital checkout gateway',
      badgeAr: newGwBadgeAr.trim() || 'بوابة دفع معتمدة',
      isEnabled: true,
      isTestMode: newGwIsTest,
      iconType: newGwIconType,
      supportedCountryCodes: newGwCountries.length > 0 ? newGwCountries : ['GLOBAL'],
      supportedCurrencies: newGwCurrencies.length > 0 ? newGwCurrencies : ['IQD', 'USD'],
      processingFeePercent: 0,
      isCustom: true,
      merchantId: newGwMerchantId.trim(),
      apiKey: newGwApiKey.trim(),
      instructionsAr: newGwInstructions.trim(),
    };

    addGateway(payload);
    setIsAddGatewayModalOpen(false);
    toast.success(
      isAr
        ? `✓ تم إضافة بوابة [${payload.nameAr}] بنجاح إلى المتجر وتفعيلها في صفحة الدفع!`
        : `Payment gateway [${payload.nameAr}] successfully added and enabled!`
    );
  };

  // Submit New Carrier
  const handleSaveNewCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarrierId.trim() || !newCarrierNameAr.trim()) {
      toast.error(isAr ? 'يرجى كتابة معرّف شركة الشحن واسمها بالعربية' : 'Please provide ID and Arabic name');
      return;
    }

    const payload: ShippingCarrierConfig = {
      id: newCarrierId.trim().toLowerCase().replace(/\s+/g, '_'),
      nameAr: newCarrierNameAr.trim(),
      nameEn: newCarrierNameEn.trim() || newCarrierNameAr.trim(),
      descriptionAr: newCarrierDescAr.trim() || 'توصيل سريع وآمن مع تغليف معتمد',
      descriptionEn: newCarrierNameEn.trim() || 'Fast and secure logistics courier',
      badgeAr: newCarrierBadgeAr.trim() || 'شحن سريع',
      isEnabled: true,
      iconType: newCarrierIconType,
      supportedCountryCodes: newCarrierCountries.length > 0 ? newCarrierCountries : ['GLOBAL'],
      deliveryDaysAr: newCarrierDeliveryDaysAr.trim() || '2 - 4 أيام عمل',
      deliveryDaysEn: '2 - 4 business days',
      basePriceIQD: Number(newCarrierPriceIQD) || 15000,
      basePriceUSD: Number(newCarrierPriceUSD) || 10,
      freeShippingThresholdIQD: Number(newCarrierFreeIQD) || undefined,
      trackingPrefix: newCarrierPrefix.trim().toUpperCase() || 'TRK',
      trackingUrlTemplate: newCarrierTrackingUrl.trim(),
      isCustom: true,
    };

    addCarrier(payload);
    setIsAddCarrierModalOpen(false);
    toast.success(
      isAr
        ? `✓ تم إضافة شركة الشحن [${payload.nameAr}] بنجاح إلى المتجر وتفعيلها!`
        : `Carrier [${payload.nameAr}] successfully added and enabled!`
    );
  };

  // Helper icons
  const renderGatewayIcon = (iconType: PaymentGatewayConfig['iconType']) => {
    switch (iconType) {
      case 'wallet':
        return <Wallet className="w-5 h-5 text-amber-600" />;
      case 'bank':
        return <Building className="w-5 h-5 text-indigo-600" />;
      case 'card':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'paypal':
        return <Globe className="w-5 h-5 text-blue-600" />;
      case 'truck':
        return <Truck className="w-5 h-5 text-teal-600" />;
      case 'building':
        return <Building className="w-5 h-5 text-slate-700" />;
      default:
        return <CreditCard className="w-5 h-5 text-purple-600" />;
    }
  };

  const renderCarrierIcon = (iconType: ShippingCarrierConfig['iconType']) => {
    switch (iconType) {
      case 'plane':
        return <Plane className="w-5 h-5 text-rose-600" />;
      case 'truck':
        return <Truck className="w-5 h-5 text-amber-600" />;
      case 'package':
        return <Package className="w-5 h-5 text-emerald-600" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-blue-600" />;
      default:
        return <Truck className="w-5 h-5 text-slate-600" />;
    }
  };

  // Simulated items for selected country
  const simulatedGateways = getAvailableGateways(simulatorCountry);
  const simulatedCarriers = getAvailableCarriers(simulatorCountry);
  const selectedCountryObj = SUPPORTED_COUNTRIES.find((c) => c.code === simulatorCountry) || SUPPORTED_COUNTRIES[0];

  return (
    <div className="space-y-6">
      {/* Top Header Card (The exact banner shown in the user's screenshot) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Glow ambient background decoration */}
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                <Globe className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold tracking-wider text-purple-300 uppercase">
                {isAr ? 'التحول للتجارة الدولية' : 'Global Commerce Hub'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {isAr ? 'التحكم في بوابات الدفع وشركات الشحن الدولي' : 'Payment Gateways & International Logistics'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isAr
                ? 'تحكم بسهولة بظهور أو إخفاء أي بوابة دفع أو شركة شحن حسب بلد العميل، أو أضف بوابات وشركات شحن جديدة فوراً بضغطة زر واحدة.'
                : 'Instantly toggle, add, and configure payment processors and shipping providers.'}
            </p>
          </div>

          {/* Action Buttons Directly in the Header Card */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setActiveSubTab('gateways');
                setIsAddGatewayModalOpen(true);
              }}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-950/20 cursor-pointer transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isAr ? 'إضافة بوابة دفع جديدة' : 'Add Payment Gateway'}</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('carriers');
                setIsAddCarrierModalOpen(true);
              }}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black shadow-md shadow-amber-950/20 cursor-pointer transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isAr ? 'إضافة شركة شحن جديدة' : 'Add Carrier'}</span>
            </button>

            <button
              onClick={handleResetDefaults}
              type="button"
              title={isAr ? 'استعادة الإعدادات الأصلية' : 'Reset to Defaults'}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isAr ? 'استعادة الأصلية' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-300 block">{isAr ? 'البوابات المفعلة' : 'Active Gateways'}</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              {enabledGatewaysCount} <span className="text-xs font-normal text-slate-400">/ {gateways.length}</span>
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-300 block">{isAr ? 'شركات الشحن المفعلة' : 'Active Carriers'}</span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">
              {enabledCarriersCount} <span className="text-xs font-normal text-slate-400">/ {carriers.length}</span>
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-300 block">{isAr ? 'تغطية الشحن الدولي' : 'Global Delivery'}</span>
            <span className="text-sm font-extrabold text-blue-300 mt-1 block">
              {isAr ? 'العراق + الخليج + دولي' : 'Worldwide Network'}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-300 block">{isAr ? 'حالة التزامن' : 'Sync Status'}</span>
            <span className="text-sm font-extrabold text-purple-300 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isAr ? 'مباشر مع المتجر والسلة' : 'Real-time Live Sync'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setActiveSubTab('gateways')}
          type="button"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'gateways'
              ? 'bg-white text-purple-900 shadow-xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{isAr ? 'بوابات الدفع الإلكتروني' : 'Payment Gateways'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800">
            {gateways.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('carriers')}
          type="button"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'carriers'
              ? 'bg-white text-purple-900 shadow-xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{isAr ? 'شركات الشحن والتوصيل' : 'Shipping Carriers'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
            {carriers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          type="button"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'simulator'
              ? 'bg-white text-purple-900 shadow-xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{isAr ? 'محاكي تجربة العميل حسب الدولة' : 'Live Country Simulator'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
            Live
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: PAYMENT GATEWAYS */}
      {activeSubTab === 'gateways' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'قائمة بوابات الدفع المدعومة وخيارات التحكم' : 'Configured Payment Processors'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'انقر على المفتاح لتفعيل أو حظر البوابة فوراً، أو أضف بوابة جديدة (كي كارد، STC Pay، تمارا، تابي، باي موب...)'
                  : 'Toggle to enable/disable or add custom gateways.'}
              </p>
            </div>

            <button
              onClick={() => setIsAddGatewayModalOpen(true)}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? '+ إضافة بوابة دفع جديدة' : '+ Add Gateway'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gateways.map((gateway) => {
              const isGlobal = gateway.supportedCountryCodes.includes('GLOBAL');
              const isGCC =
                gateway.supportedCountryCodes.includes('SA') && gateway.supportedCountryCodes.includes('AE');
              const isIraq = gateway.supportedCountryCodes.includes('IQ') && !isGlobal && !isGCC;

              return (
                <div
                  key={gateway.id}
                  className={`p-5 rounded-3xl border transition-all relative ${
                    gateway.isEnabled
                      ? 'bg-white border-slate-200/90 shadow-2xs hover:border-purple-200'
                      : 'bg-slate-50/80 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200/80">
                        {renderGatewayIcon(gateway.iconType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-sm">{gateway.nameAr}</h4>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isIraq
                                ? 'bg-emerald-100 text-emerald-800'
                                : isGCC
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {gateway.badgeAr}
                          </span>
                          {gateway.isCustom && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                              {isAr ? 'مضافة يدوياً' : 'Custom'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{gateway.nameEn}</p>
                      </div>
                    </div>

                    {/* Toggle Switch & Delete if custom */}
                    <div className="flex items-center gap-2">
                      {gateway.isCustom && (
                        <button
                          onClick={() => handleDeleteGateway(gateway.id, gateway.nameAr)}
                          type="button"
                          title={isAr ? 'حذف هذه البوابة' : 'Delete Gateway'}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleGateway(gateway.id, gateway.nameAr)}
                        type="button"
                        aria-label={`Toggle ${gateway.nameAr}`}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                          gateway.isEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {gateway.descriptionAr}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Coverage badge */}
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-600">
                        {isGlobal
                          ? isAr
                            ? 'نطاق الظهور: كافة دول العالم'
                            : 'Coverage: Worldwide'
                          : isGCC
                          ? isAr
                            ? 'نطاق الظهور: دول الخليج العربي'
                            : 'Coverage: GCC'
                          : isAr
                          ? `نطاق الظهور: ${gateway.supportedCountryCodes.join(', ')}`
                          : `Coverage: ${gateway.supportedCountryCodes.join(', ')}`}
                      </span>
                    </div>

                    {/* Sandbox / Live indicator */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{isAr ? 'البيئة:' : 'Mode:'}</span>
                      <button
                        onClick={() => toggleGatewayTestMode(gateway.id)}
                        type="button"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          gateway.isTestMode
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {gateway.isTestMode
                          ? isAr
                            ? 'وضع تجريبي (Sandbox)'
                            : 'Test Sandbox'
                          : isAr
                          ? 'وضع حي (Live)'
                          : 'Live Production'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SHIPPING CARRIERS */}
      {activeSubTab === 'carriers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'شركات التوصيل والشحن المعتمدة وأسعارها' : 'Shipping Carriers & Freight Settings'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'حدد مدة التوصيل وتكلفة الشحن، أو أضف شركات شحن إضافية (سمسا، زاجل، ريد بوكس، البريد العراقي...)'
                  : 'Manage delivery speed, rates, or add new logistics partners.'}
              </p>
            </div>

            <button
              onClick={() => setIsAddCarrierModalOpen(true)}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? '+ إضافة شركة شحن جديدة' : '+ Add Carrier'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {carriers.map((carrier) => {
              const isGlobal = carrier.supportedCountryCodes.includes('GLOBAL');
              const isIraq = carrier.supportedCountryCodes.includes('IQ') && !isGlobal;

              return (
                <div
                  key={carrier.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    carrier.isEnabled
                      ? 'bg-white border-slate-200/90 shadow-2xs hover:border-amber-200'
                      : 'bg-slate-50/80 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                        {renderCarrierIcon(carrier.iconType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-sm">{carrier.nameAr}</h4>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {carrier.badgeAr}
                          </span>
                          {carrier.isCustom && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              {isAr ? 'مضافة يدوياً' : 'Custom'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{carrier.nameEn}</p>
                      </div>
                    </div>

                    {/* Toggle Switch & Delete if custom */}
                    <div className="flex items-center gap-2">
                      {carrier.isCustom && (
                        <button
                          onClick={() => handleDeleteCarrier(carrier.id, carrier.nameAr)}
                          type="button"
                          title={isAr ? 'حذف شركة الشحن' : 'Delete Carrier'}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleCarrier(carrier.id, carrier.nameAr)}
                        type="button"
                        aria-label={`Toggle ${carrier.nameAr}`}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                          carrier.isEnabled ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {carrier.descriptionAr}
                  </p>

                  {/* Carrier Specifications */}
                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isAr ? 'المدة المقدرة:' : 'Est. Delivery:'}</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {carrier.deliveryDaysAr}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">{isAr ? 'سعر الشحن الأساسي:' : 'Base Shipping Rate:'}</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        {isIraq
                          ? `${carrier.basePriceIQD.toLocaleString()} د.ع`
                          : `$${carrier.basePriceUSD} (${carrier.basePriceIQD.toLocaleString()} د.ع)`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono">
                      {isAr ? 'بادئة التتبع:' : 'Tracking Prefix:'} <strong className="text-slate-700">{carrier.trackingPrefix}-XXXXXX</strong>
                    </span>
                    <span className="text-emerald-700 font-bold">
                      {carrier.freeShippingThresholdIQD
                        ? isAr
                          ? `شحن مجاني للطلبات فوق ${carrier.freeShippingThresholdIQD.toLocaleString()} د.ع`
                          : `Free on orders over ${carrier.freeShippingThresholdIQD.toLocaleString()} IQD`
                        : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LIVE SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="font-black text-slate-900 text-sm">
                  {isAr ? 'محاكي تجربة الشراء الحية حسب بلد العميل' : 'Live Customer Experience Simulator'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isAr
                  ? 'اختر أي دولة لتشاهد في الحال ما سيظهر للعميل في صفحة الدفع (شركات الشحن وبوابات الدفع النشطة)'
                  : 'Select any country to inspect exactly which options the client will see.'}
              </p>
            </div>

            {/* Country Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{isAr ? 'الدولة المستهدفة:' : 'Target Country:'}</span>
              <select
                value={simulatorCountry}
                onChange={(e) => setSimulatorCountry(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.nameAr} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result for chosen country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping options available for this country */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  {isAr ? 'خيارات الشحن المتاحة للعميل في ' : 'Carriers shown in '}
                  <span className="text-purple-700">{selectedCountryObj.nameAr}</span>:
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {simulatedCarriers.length} {isAr ? 'شركة متاحة' : 'carriers'}
                </span>
              </div>

              {simulatedCarriers.length === 0 ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? 'تنبيه: لا توجد شركات شحن مفعلة لهذه الدولة حالياً! قم بتفعيل شركة في تبويب شركات الشحن.'
                      : 'Warning: No carriers currently enabled for this country.'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {simulatedCarriers.map((carrier) => (
                    <div
                      key={carrier.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          {renderCarrierIcon(carrier.iconType)}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs">{carrier.nameAr}</h5>
                          <span className="text-[10px] text-slate-400 block">{carrier.deliveryDaysAr}</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="text-xs font-black text-emerald-700 block">
                          {selectedCountryObj.code === 'IQ'
                            ? `${carrier.basePriceIQD.toLocaleString()} د.ع`
                            : `$${carrier.basePriceUSD} (${carrier.basePriceIQD.toLocaleString()} د.ع)`}
                        </span>
                        <span className="text-[10px] text-emerald-600">
                          {carrier.freeShippingThresholdIQD ? (isAr ? 'شحن مجاني متاح' : 'Free available') : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment options available for this country */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  {isAr ? 'بوابات الدفع المتاحة للعميل في ' : 'Gateways shown in '}
                  <span className="text-purple-700">{selectedCountryObj.nameAr}</span>:
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {simulatedGateways.length} {isAr ? 'بوابة متاحة' : 'gateways'}
                </span>
              </div>

              {simulatedGateways.length === 0 ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? 'تنبيه: لا توجد بوابات دفع مفعلة لهذه الدولة! قم بتفعيل أو إضافة بوابة دفع في التبويب.'
                      : 'Warning: No gateways enabled for this country.'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {simulatedGateways.map((gateway) => (
                    <div
                      key={gateway.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          {renderGatewayIcon(gateway.iconType)}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs">{gateway.nameAr}</h5>
                          <span className="text-[10px] text-slate-400 block">{gateway.nameEn}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800">
                        {isAr ? 'جاهزة للدفع' : 'Ready'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW PAYMENT GATEWAY */}
      {/* ========================================================================= */}
      {isAddGatewayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-800">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isAr ? 'إضافة بوابة دفع إلكتروني جديدة' : 'Add New Payment Gateway'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr
                      ? 'اختر من القوالب الجاهزة أو أدخل بيانات بوابتك المخصصة لربطها فوراً'
                      : 'Choose a regional template or configure custom gateway parameters.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddGatewayModalOpen(false)}
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                {isAr ? 'قوالب بوابات دفع إقليمية جاهزة (نقرة واحدة للتعبئة):' : 'Popular Regional Presets (1-Click Fill):'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GATEWAY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyGatewayPreset(preset)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-start transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-xs text-slate-900 group-hover:text-purple-950 block leading-tight">
                      {preset.nameAr}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{preset.badgeAr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNewGateway} className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'معرّف البوابة البرمجي الفريد (ID) *:' : 'Gateway ID (Unique) *:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newGwId}
                    onChange={(e) => setNewGwId(e.target.value)}
                    placeholder="مثال: qi_card أو stc_pay"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'الشارة الترويجية (Badge):' : 'Promo Badge:'}
                  </label>
                  <input
                    type="text"
                    value={newGwBadgeAr}
                    onChange={(e) => setNewGwBadgeAr(e.target.value)}
                    placeholder="مثال: دفع محلي فوري، تقسيط 0%"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'اسم البوابة بالعربية *:' : 'Gateway Name (Arabic) *:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newGwNameAr}
                    onChange={(e) => setNewGwNameAr(e.target.value)}
                    placeholder="مثال: كي كارد (Qi Card Iraq)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'الاسم بالإنجليزية:' : 'Gateway Name (English):'}
                  </label>
                  <input
                    type="text"
                    value={newGwNameEn}
                    onChange={(e) => setNewGwNameEn(e.target.value)}
                    placeholder="e.g. Qi Card Mastercard"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'وصف البوابة المختصر للعميل:' : 'Customer Description:'}
                </label>
                <textarea
                  rows={2}
                  value={newGwDescAr}
                  onChange={(e) => setNewGwDescAr(e.target.value)}
                  placeholder="مثال: الدفع الفوري الآمن ببطاقة كي كارد أو حساب مصرف الرافدين"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Supported Countries Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isAr ? 'الدول المسموح بظهور البوابة لعملائها:' : 'Supported Destination Countries:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (newGwCountries.includes('GLOBAL')) {
                        setNewGwCountries(['IQ']);
                      } else {
                        setNewGwCountries(['GLOBAL']);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      newGwCountries.includes('GLOBAL')
                        ? 'bg-purple-900 text-white ring-2 ring-purple-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    🌍 {isAr ? 'كافة دول العالم (GLOBAL)' : 'Worldwide (GLOBAL)'}
                  </button>

                  {SUPPORTED_COUNTRIES.map((c) => {
                    const isSelected = newGwCountries.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          const withoutGlobal = newGwCountries.filter((code) => code !== 'GLOBAL');
                          if (isSelected) {
                            setNewGwCountries(withoutGlobal.filter((code) => code !== c.code));
                          } else {
                            setNewGwCountries([...withoutGlobal, c.code]);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                          isSelected && !newGwCountries.includes('GLOBAL')
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.nameAr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Developer Credentials & Settings */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <Key className="w-4 h-4 text-purple-700" />
                  <span>{isAr ? 'إعدادات ومفاتيح الربط البرمجي (اختياري للمطور):' : 'API Credentials & Integration:'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? 'معرّف التاجر (Merchant ID):' : 'Merchant ID:'}
                    </label>
                    <input
                      type="text"
                      value={newGwMerchantId}
                      onChange={(e) => setNewGwMerchantId(e.target.value)}
                      placeholder="e.g. MERCH_994829"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isAr ? 'مفتاح الربط العام (Public API Key):' : 'Public API Key:'}
                    </label>
                    <input
                      type="text"
                      value={newGwApiKey}
                      onChange={(e) => setNewGwApiKey(e.target.value)}
                      placeholder="pk_live_xxxxxxxx or pk_test_xxxxxxxx"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-200/60">
                  <span className="text-xs text-slate-700 font-bold">
                    {isAr ? 'تفعيل وضع الاختبار المبدئي (Sandbox):' : 'Enable Sandbox / Test Mode:'}
                  </span>
                  <input
                    type="checkbox"
                    checked={newGwIsTest}
                    onChange={(e) => setNewGwIsTest(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer accent-purple-600"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddGatewayModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer shadow-md shadow-purple-900/20"
                >
                  {isAr ? 'حفظ وإضافة البوابة إلى المتجر' : 'Save & Enable Gateway'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD NEW SHIPPING CARRIER */}
      {/* ========================================================================= */}
      {isAddCarrierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isAr ? 'إضافة شركة شحن وتوصيل جديدة' : 'Add New Shipping Carrier'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr
                      ? 'اختر من الشركات الإقليمية الرائدة (سمسا، زاجل، ريد بوكس...) أو أنشئ خيار شحن مخصص'
                      : 'Choose a regional carrier preset or set up a custom logistics partner.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCarrierModalOpen(false)}
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                {isAr ? 'شركات شحن شائعة (نقرة واحدة للتعبئة):' : 'Popular Shipping Presets (1-Click Fill):'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CARRIER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyCarrierPreset(preset)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-start transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-xs text-slate-900 group-hover:text-amber-950 block leading-tight">
                      {preset.nameAr}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{preset.badgeAr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNewCarrier} className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'معرّف شركة الشحن البرمجي (ID) *:' : 'Carrier ID *:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCarrierId}
                    onChange={(e) => setNewCarrierId(e.target.value)}
                    placeholder="مثال: smsa_express أو zajil"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'الشارة الترويجية (Badge):' : 'Promo Badge:'}
                  </label>
                  <input
                    type="text"
                    value={newCarrierBadgeAr}
                    onChange={(e) => setNewCarrierBadgeAr(e.target.value)}
                    placeholder="مثال: سريع ومضمون، استلام 24/7"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'اسم شركة الشحن بالعربية *:' : 'Carrier Name (Arabic) *:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCarrierNameAr}
                    onChange={(e) => setNewCarrierNameAr(e.target.value)}
                    placeholder="مثال: سمسا إكسبريس (SMSA Express)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'الاسم بالإنجليزية:' : 'Carrier Name (English):'}
                  </label>
                  <input
                    type="text"
                    value={newCarrierNameEn}
                    onChange={(e) => setNewCarrierNameEn(e.target.value)}
                    placeholder="e.g. SMSA Express Courier"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'مدة التوصيل المتوقعة:' : 'Est. Delivery Duration:'}
                  </label>
                  <input
                    type="text"
                    value={newCarrierDeliveryDaysAr}
                    onChange={(e) => setNewCarrierDeliveryDaysAr(e.target.value)}
                    placeholder="مثال: 2 - 4 أيام عمل"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'بادئة رقم التتبع (Prefix):' : 'Tracking Prefix:'}
                  </label>
                  <input
                    type="text"
                    value={newCarrierPrefix}
                    onChange={(e) => setNewCarrierPrefix(e.target.value)}
                    placeholder="مثال: SMSA أو ZAJ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white uppercase focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'سعر الشحن (دينار عراقي):' : 'Base Price (IQD):'}
                  </label>
                  <input
                    type="number"
                    value={newCarrierPriceIQD}
                    onChange={(e) => setNewCarrierPriceIQD(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'سعر الشحن (دولار USD):' : 'Base Price (USD):'}
                  </label>
                  <input
                    type="number"
                    value={newCarrierPriceUSD}
                    onChange={(e) => setNewCarrierPriceUSD(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'حد الشحن المجاني (د.ع):' : 'Free Shipping If Above:'}
                  </label>
                  <input
                    type="number"
                    value={newCarrierFreeIQD}
                    onChange={(e) => setNewCarrierFreeIQD(Number(e.target.value))}
                    placeholder="250000"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
              </div>

              {/* Supported Countries Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isAr ? 'الدول المشمولة بخدمة هذا الشحن:' : 'Supported Shipping Destinations:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (newCarrierCountries.includes('GLOBAL')) {
                        setNewCarrierCountries(['SA']);
                      } else {
                        setNewCarrierCountries(['GLOBAL']);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      newCarrierCountries.includes('GLOBAL')
                        ? 'bg-amber-900 text-white ring-2 ring-amber-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    🌍 {isAr ? 'كافة دول العالم (GLOBAL)' : 'Worldwide (GLOBAL)'}
                  </button>

                  {SUPPORTED_COUNTRIES.map((c) => {
                    const isSelected = newCarrierCountries.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          const withoutGlobal = newCarrierCountries.filter((code) => code !== 'GLOBAL');
                          if (isSelected) {
                            setNewCarrierCountries(withoutGlobal.filter((code) => code !== c.code));
                          } else {
                            setNewCarrierCountries([...withoutGlobal, c.code]);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                          isSelected && !newCarrierCountries.includes('GLOBAL')
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.nameAr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tracking Link URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'قالب رابط التتبع المباشر للعميل (اختياري):' : 'Tracking URL Template (Optional):'}
                </label>
                <input
                  type="text"
                  value={newCarrierTrackingUrl}
                  onChange={(e) => setNewCarrierTrackingUrl(e.target.value)}
                  placeholder="https://track.carrier.com?no={TRACKING_NUMBER}"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {isAr
                    ? 'سيتم استبدال {TRACKING_NUMBER} تلقائياً برقم شحنة العميل عند الضغط على تتبع الطلب'
                    : '{TRACKING_NUMBER} is replaced dynamically by customer shipment tracking code.'}
                </span>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCarrierModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-amber-900/20"
                >
                  {isAr ? 'حفظ وإضافة شركة الشحن إلى المتجر' : 'Save & Enable Carrier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
