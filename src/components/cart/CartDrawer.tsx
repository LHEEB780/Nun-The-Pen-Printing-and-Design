import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { X, Trash2, ShoppingBag, Send, Sparkles, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  onNavigateToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCheckout }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { formatPrice, currency } = useCurrencyStore();
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    clearCart,
  } = useCartStore();

  const subtotal = getSubtotal();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    let message = isAr
      ? `مرحباً نون والقلم للطباعة والتصميم 🌟\nأود تأكيد طلب تفصيل للمنتجات التالية:\n\n`
      : `Hello Noon & Pen Printing & Design 🌟\nI would like to place an order for the following custom items:\n\n`;

    items.forEach((item, index) => {
      const title = isAr ? item.titleAr : item.titleEn;
      message += `${index + 1}. *${title}* (الكمية: ${item.quantity})\n`;
      if (item.customOptions.customText) {
        message += `   - النص المطلوب: ${item.customOptions.customText}\n`;
      }
      if (item.customOptions.fontName) {
        message += `   - الخط المعتمد: ${item.customOptions.fontName}\n`;
      }
      message += `   - المقاس: ${isAr ? item.customOptions.dimensionLabelAr : item.customOptions.dimensionLabelEn}\n`;
      message += `   - الخامة: ${isAr ? item.customOptions.materialLabelAr : item.customOptions.materialLabelEn}\n`;

      if (item.customOptions.paperTypeAr) {
        message += `   - نوع الورق: ${isAr ? item.customOptions.paperTypeAr : item.customOptions.paperTypeEn}\n`;
      }
      if (item.customOptions.foilFinishAr) {
        message += `   - البصمة الحرارية: ${isAr ? item.customOptions.foilFinishAr : item.customOptions.foilFinishEn}\n`;
      }
      if (item.customOptions.boxStyleAr) {
        message += `   - نمط العلبة: ${isAr ? item.customOptions.boxStyleAr : item.customOptions.boxStyleEn}\n`;
      }
      if (item.customOptions.boxInsertAr) {
        message += `   - الحشوة: ${isAr ? item.customOptions.boxInsertAr : item.customOptions.boxInsertEn}\n`;
      }
      if (item.customOptions.ledColorNameAr) {
        message += `   - لون الإضاءة: ${isAr ? item.customOptions.ledColorNameAr : item.customOptions.ledColorNameEn}\n`;
      }
      if (item.customOptions.logoFileName) {
        message += `   - ملف الشعار: ${item.customOptions.logoFileName} (سأقوم بإرفاقه)\n`;
      }
      if (item.customOptions.discountPercentage) {
        message += `   - خصم الكميات المطبق: ${item.customOptions.discountPercentage}%\n`;
      }
      if (item.customOptions.notes) {
        message += `   - ملاحظات: ${item.customOptions.notes}\n`;
      }
      message += `   - السعر الإجمالي: ${formatPrice(item.totalPrice, { isAr })}\n\n`;
    });

    message += `الإجمالي التقديري: *${formatPrice(subtotal, { isAr })}*\n`;
    message += `يرجى تزويدي بالبروفة وتفاصيل الدفع والشحن في بغداد.\nشكراً جزيلاً!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/9647800000000?text=${encoded}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Calculate estimated points earned
  const estimatedPoints = Math.max(10, Math.floor(subtotal / 1000));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header - Brand warm luxury palette */}
        <div className="p-4 sm:p-5 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200/80 shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">
                  {t('cart.title')}
                </h3>
                <span className="text-xs text-amber-900 font-bold bg-amber-100/90 border border-amber-300/60 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <p className="text-[10px] text-amber-800/80 font-medium">
                {isAr ? 'نون والقلم • جودة صياغة وطباعة فاخرة' : 'Noon & Pen • Bespoke Printing'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-amber-950 hover:bg-amber-100/70 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-amber-100/60">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-8 h-8 opacity-80" />
              </div>
              <div>
                <p className="font-extrabold text-base text-slate-900">
                  {t('cart.empty')}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  {t('cart.emptyCta')}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-sm hover:shadow transition-all cursor-pointer"
              >
                {isAr ? 'تصفح باقات ومنتجات المتجر' : 'Browse Products'}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={isAr ? item.titleAr : item.titleEn}
                    className="w-16 h-16 rounded-xl object-cover border border-amber-200/60 shrink-0 shadow-xs"
                  />

                  {/* Title and price */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 leading-snug truncate hover:text-amber-800 transition-colors">
                        {isAr ? item.titleAr : item.titleEn}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        type="button"
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title={t('cart.remove')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs font-black text-amber-900 bg-amber-50/90 border border-amber-200/80 px-2 py-0.5 rounded-md font-mono shadow-2xs">
                        {formatPrice(item.totalPrice, { isAr })}
                      </span>
                      {currency === 'USD' && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({item.totalPrice.toLocaleString()} د.ع)
                        </span>
                      )}
                      {item.customOptions.discountPercentage ? (
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md">
                          -{item.customOptions.discountPercentage}%
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Specs Box - Warm Luxury Styling */}
                <div className="bg-amber-50/30 rounded-xl p-3 text-[11px] text-slate-700 space-y-1.5 border border-amber-100/80 shadow-2xs">
                  {item.customOptions.customText && (
                    <div className="flex items-center gap-1 font-semibold text-slate-900">
                      <span className="text-amber-800/80">{t('cart.text')}</span>
                      <span>"{item.customOptions.customText}"</span>
                    </div>
                  )}
                  {item.customOptions.fontName && (
                    <div className="flex items-center gap-1 text-slate-700">
                      <span className="text-slate-400">{isAr ? 'الخط:' : 'Font:'}</span>
                      <span>{item.customOptions.fontName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">{t('cart.dimension')}</span>
                    <span>{isAr ? item.customOptions.dimensionLabelAr : item.customOptions.dimensionLabelEn}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">{t('cart.material')}</span>
                    <span>{isAr ? item.customOptions.materialLabelAr : item.customOptions.materialLabelEn}</span>
                  </div>
                  {item.customOptions.paperTypeAr && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">{isAr ? 'الورق:' : 'Paper:'}</span>
                      <span>{isAr ? item.customOptions.paperTypeAr : item.customOptions.paperTypeEn}</span>
                    </div>
                  )}
                  {item.customOptions.foilFinishAr && (
                    <div className="flex items-center gap-1 text-amber-800 font-semibold">
                      <span className="text-amber-600/80">{isAr ? 'البصمة:' : 'Foil:'}</span>
                      <span>{isAr ? item.customOptions.foilFinishAr : item.customOptions.foilFinishEn}</span>
                    </div>
                  )}
                  {item.customOptions.boxStyleAr && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">{isAr ? 'النمط:' : 'Style:'}</span>
                      <span>{isAr ? item.customOptions.boxStyleAr : item.customOptions.boxStyleEn}</span>
                    </div>
                  )}
                  {item.customOptions.ledColorNameAr && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">{t('cart.led')}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300"
                        style={{ backgroundColor: item.customOptions.ledHex }}
                      />
                      <span>{isAr ? item.customOptions.ledColorNameAr : item.customOptions.ledColorNameEn}</span>
                    </div>
                  )}
                  {item.customOptions.logoFileName && (
                    <div className="flex items-center gap-1 text-amber-800 font-medium">
                      <span>{t('cart.logoFile')}</span>
                      <span className="font-mono truncate">{item.customOptions.logoFileName}</span>
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-medium">
                    {t('cart.quantity')}:
                  </span>
                  <div className="flex items-center border border-amber-200/80 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.category === 'cards' ? -50 : -1)}
                      type="button"
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-black text-slate-900 font-mono bg-amber-50/30">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.category === 'cards' ? 50 : 1)}
                      type="button"
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout - Brand Cohesive Luxury Design */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-amber-100 bg-gradient-to-b from-white via-amber-50/30 to-amber-50/50 space-y-3.5 shadow-lg">
            {/* Loyalty points hint */}
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-50/90 border border-amber-200/70 text-[11px] text-amber-950">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAr ? 'نقاط الولاء المكتسبة مع هذا الطلب:' : 'Loyalty points earned with order:'}</span>
              </span>
              <span className="font-extrabold font-mono text-amber-800 bg-white px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs">
                +{estimatedPoints.toLocaleString()} {isAr ? 'نقطة' : 'pts'}
              </span>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between pt-0.5">
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  {t('cart.subtotal')}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isAr ? 'شامل التدقيق الفني المسبق للبروفات' : 'Includes artwork pre-flight check'}
                </span>
              </div>
              <div className="text-end">
                <span className="text-xl font-black text-slate-950 font-mono block">
                  {formatPrice(subtotal, { isAr })}
                </span>
                {currency === 'USD' && (
                  <span className="text-[11px] text-slate-400 font-mono block">
                    ({subtotal.toLocaleString()} د.ع)
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              {t('cart.shippingNote')}
            </p>

            {/* Action buttons matching brand identity */}
            <div className="space-y-2 pt-1">
              {onNavigateToCheckout && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToCheckout();
                  }}
                  type="button"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 active:scale-[0.99] text-white shadow-md shadow-amber-900/15 hover:shadow-lg hover:shadow-amber-900/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{isAr ? 'المتابعة لإتمام الطلب والدفع' : 'Proceed to Checkout & Pay'}</span>
                </button>
              )}

              <button
                onClick={handleWhatsAppCheckout}
                type="button"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('cart.checkoutWhatsApp')}</span>
              </button>
            </div>

            <button
              onClick={clearCart}
              type="button"
              className="w-full text-center text-xs text-slate-400 hover:text-rose-600 hover:underline transition-colors py-1 cursor-pointer"
            >
              {t('cart.clearCart')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
