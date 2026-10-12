import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PRODUCTS, ProductItem, DimensionOption, MaterialOption, LedOption } from '../../data/mockData';
import { useCartStore } from '../../store/useCartStore';
import { X, Upload, Check, Sparkles, Sliders, Image as ImageIcon, Lightbulb, Info } from 'lucide-react';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  initialProductId,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { addItem } = useCartStore();

  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS[0]);
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption>(PRODUCTS[0].dimensions[0]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(PRODUCTS[0].materials[0]);
  const [selectedLed, setSelectedLed] = useState<LedOption | undefined>(PRODUCTS[0].ledOptions?.[0]);
  const [customText, setCustomText] = useState<string>('');
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);

  // Sync initial product if passed
  useEffect(() => {
    if (initialProductId) {
      const found = PRODUCTS.find((p) => p.id === initialProductId);
      if (found) {
        setSelectedProduct(found);
        setSelectedDimension(found.dimensions[0]);
        setSelectedMaterial(found.materials[0]);
        setSelectedLed(found.ledOptions?.[0]);
        setQuantity(found.minQuantity);
      }
    }
  }, [initialProductId]);

  // When selectedProduct changes, reset dependent fields
  const handleProductChange = (prodId: string) => {
    const prod = PRODUCTS.find((p) => p.id === prodId);
    if (!prod) return;
    setSelectedProduct(prod);
    setSelectedDimension(prod.dimensions[0]);
    setSelectedMaterial(prod.materials[0]);
    setSelectedLed(prod.ledOptions?.[0]);
    setQuantity(prod.minQuantity);
  };

  // Price calculations
  const unitPrice = Math.round(
    selectedProduct.basePrice * selectedDimension.multiplier + selectedMaterial.priceAdd
  );
  const totalPrice = unitPrice * quantity;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      const url = URL.createObjectURL(file);
      setLogoPreviewUrl(url);
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: selectedProduct.id,
      titleAr: selectedProduct.titleAr,
      titleEn: selectedProduct.titleEn,
      image: selectedProduct.image,
      category: selectedProduct.category,
      quantity,
      unitPrice,
      totalPrice,
      customOptions: {
        customText: customText.trim() || undefined,
        dimensionLabelAr: selectedDimension.labelAr,
        dimensionLabelEn: selectedDimension.labelEn,
        materialLabelAr: selectedMaterial.labelAr,
        materialLabelEn: selectedMaterial.labelEn,
        ledColorNameAr: selectedLed?.nameAr,
        ledColorNameEn: selectedLed?.nameEn,
        ledHex: selectedLed?.hex,
        logoFileName: logoFileName || undefined,
        notes: notes.trim() || undefined,
      },
    });

    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col my-auto animate-scale">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('customizer.title')}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('customizer.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns (Form & Live Preview) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Product Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                {t('customizer.productLabel')}
              </label>
              <select
                value={selectedProduct.id}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isAr ? p.titleAr : p.titleEn}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Custom Engraved / Printed Text */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {t('customizer.customTextLabel')}
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={t('customizer.customTextPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {isAr ? 'سيتم مراجعة الخط العربي وإرسال بروفة رقمية قبل الحفر' : 'Digital calligraphy typography proof provided prior to production'}
              </p>
            </div>

            {/* 3. Dimension Options */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                {t('customizer.dimensionsLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedProduct.dimensions.map((dim) => (
                  <button
                    key={dim.id}
                    type="button"
                    onClick={() => setSelectedDimension(dim)}
                    className={`p-3 rounded-xl border text-start text-xs transition-all cursor-pointer ${
                      selectedDimension.id === dim.id
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-bold ring-1 ring-purple-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="block">{isAr ? dim.labelAr : dim.labelEn}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {dim.multiplier === 1 ? (isAr ? 'المقاس الأساسي' : 'Standard') : `${dim.multiplier}x`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Material Options */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                {t('customizer.materialLabel')}
              </label>
              <div className="space-y-2">
                {selectedProduct.materials.map((mat) => (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                    className={`w-full p-3 rounded-xl border text-start text-xs flex items-center justify-between transition-all cursor-pointer ${
                      selectedMaterial.id === mat.id
                        ? 'border-sky-600 bg-sky-50/60 text-sky-950 font-bold ring-1 ring-sky-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span>{isAr ? mat.labelAr : mat.labelEn}</span>
                    <span className="font-mono text-slate-500 font-normal">
                      {mat.priceAdd > 0 ? `+${mat.priceAdd.toLocaleString()} ${isAr ? 'د.ع' : 'IQD'}` : (isAr ? 'مشمول' : 'Included')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. LED Illumination Color (if product supports it) */}
            {selectedProduct.ledOptions && (
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  {t('customizer.ledColorLabel')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedProduct.ledOptions.map((led) => (
                    <button
                      key={led.id}
                      type="button"
                      onClick={() => setSelectedLed(led)}
                      className={`p-2.5 rounded-xl border text-center text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        selectedLed?.id === led.id
                          ? 'border-slate-900 bg-slate-900 text-white font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: led.hex }}
                      />
                      <span className="text-[11px] truncate w-full">
                        {isAr ? led.nameAr : led.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Logo / Artwork Upload Simulation */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {t('customizer.logoUploadLabel')}
              </label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-2xl p-4 text-center bg-slate-50/60 transition-colors">
                <input
                  type="file"
                  id="logo-upload-input"
                  onChange={handleFileUpload}
                  accept=".png,.jpg,.jpeg,.svg,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <Upload className="w-6 h-6 text-purple-600 mb-1" />
                  <p className="text-xs text-slate-700 font-medium">
                    {t('customizer.uploadHint')}
                  </p>
                  {logoFileName && (
                    <p className="text-xs text-purple-700 font-bold mt-1">
                      {t('customizer.fileSelected')} {logoFileName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 7. Quantity & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  {t('customizer.quantityLabel')}
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(selectedProduct.minQuantity, quantity - 1))}
                    className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={selectedProduct.minQuantity}
                    onChange={(e) => setQuantity(Math.max(selectedProduct.minQuantity, parseInt(e.target.value) || selectedProduct.minQuantity))}
                    className="w-full text-center text-sm font-bold text-slate-900 border-none focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                {selectedProduct.minQuantity > 1 && (
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {isAr ? `الحد الأدنى للطباعة: ${selectedProduct.minQuantity} قطعة` : `Min batch: ${selectedProduct.minQuantity} pcs`}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  {t('customizer.notesLabel')}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('customizer.notesPlaceholder')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Live Preview & Price Estimation Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  {t('customizer.livePreview')}
                </span>
                <span className="text-[11px] text-purple-700 font-semibold">
                  {isAr ? 'محاكاة ثلاثية الأبعاد' : '3D Simulation'}
                </span>
              </div>

              {/* Visual Simulation Canvas */}
              <div className="relative aspect-square w-full rounded-2xl bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center p-4">
                <img
                  src={selectedProduct.image}
                  alt={isAr ? selectedProduct.titleAr : selectedProduct.titleEn}
                  className="w-full h-full object-cover opacity-75"
                />

                {/* Dynamic LED Glow Ring & Backdrop */}
                {selectedLed && (
                  <div
                    className="absolute inset-0 mix-blend-screen pointer-events-none transition-all duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${selectedLed.hex}33 0%, ${selectedLed.hex}11 50%, transparent 80%)`,
                    }}
                  />
                )}

                {/* Simulated Custom Inscription Layer */}
                <div className="absolute inset-x-6 bottom-10 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 text-center shadow-lg">
                  {logoPreviewUrl ? (
                    <div className="mb-1.5 flex justify-center">
                      <img src={logoPreviewUrl} alt="User Logo" className="h-8 max-w-[120px] object-contain" />
                    </div>
                  ) : null}
                  <p
                    className="font-bold text-sm tracking-wide transition-all"
                    style={{ color: selectedLed?.hex || '#ffffff' }}
                  >
                    {customText || (isAr ? 'نص مخصص / نون والقلم' : 'Custom Text Engraving')}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1 font-mono">
                    {isAr ? selectedDimension.labelAr : selectedDimension.labelEn}
                  </p>
                </div>
              </div>

              {/* Real-time breakdown card */}
              <div className="mt-5 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span>{t('customizer.unitPrice')}:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {unitPrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span>{t('customizer.quantityLabel')}:</span>
                  <span className="font-bold text-slate-900 font-mono">× {quantity}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-sm font-extrabold text-slate-900">
                  <span>{t('customizer.totalPrice')}:</span>
                  <span className="text-lg text-purple-700 font-mono">
                    {totalPrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddedSuccess}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isAddedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-purple-700 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white'
                }`}
              >
                {isAddedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('customizer.addedSuccess')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('customizer.addToCart')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
