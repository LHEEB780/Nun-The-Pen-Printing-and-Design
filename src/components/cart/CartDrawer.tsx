import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import { X, Trash2, ShoppingBag, Send, Sparkles, Tag } from 'lucide-react';
import { COMPANY_CONTACT } from '../../data/mockData';

interface CartDrawerProps {
  onNavigateToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCheckout }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
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
      message += `   - السعر الإجمالي: ${item.totalPrice.toLocaleString()} د.ع\n\n`;
    });

    message += `الإجمالي التقديري: *${subtotal.toLocaleString()} د.ع*\n`;
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-700" />
            <h3 className="font-bold text-base text-slate-900">
              {t('cart.title')}
            </h3>
            <span className="text-xs text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <p className="font-bold text-base text-slate-800">
                  {t('cart.empty')}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {t('cart.emptyCta')}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
              >
                {isAr ? 'تصفح المنتجات' : 'Browse Products'}
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
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />

                  {/* Title and price */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 leading-snug truncate">
                        {isAr ? item.titleAr : item.titleEn}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        type="button"
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title={t('cart.remove')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-purple-700 font-mono">
                        {item.totalPrice.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
                        {item.customFormData?.totalPriceUSD && (
                          <span className="text-slate-500 ms-1 font-normal">
                            (${item.customFormData.totalPriceUSD})
                          </span>
                        )}
                      </span>
                      {item.customOptions.discountPercentage ? (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          -{item.customOptions.discountPercentage}%
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Specs Box */}
                <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 space-y-1.5 border border-slate-100">
                  {item.customOptions.customText && (
                    <div className="flex items-center gap-1 font-medium text-slate-800">
                      <span className="text-slate-400">{t('cart.text')}</span>
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
                    <div className="flex items-center gap-1 text-amber-700 font-medium">
                      <span className="text-slate-400">{isAr ? 'البصمة:' : 'Foil:'}</span>
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
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: item.customOptions.ledHex }}
                      />
                      <span>{isAr ? item.customOptions.ledColorNameAr : item.customOptions.ledColorNameEn}</span>
                    </div>
                  )}
                  {item.customOptions.logoFileName && (
                    <div className="flex items-center gap-1 text-purple-700 font-medium">
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
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, item.category === 'cards' ? -50 : -1)}
                      type="button"
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.category === 'cards' ? 50 : 1)}
                      type="button"
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">
                {t('cart.subtotal')}
              </span>
              <span className="text-lg font-extrabold text-slate-900 font-mono">
                {subtotal.toLocaleString()} {isAr ? 'د.ع' : 'IQD'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {t('cart.shippingNote')}
            </p>

            <div className="space-y-2">
              {onNavigateToCheckout && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToCheckout();
                  }}
                  type="button"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-700 to-sky-600 hover:from-purple-800 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'المتابعة لإتمام الطلب والدفع' : 'Proceed to Checkout & Pay'}</span>
                </button>
              )}

              <button
                onClick={handleWhatsAppCheckout}
                type="button"
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('cart.checkoutWhatsApp')}</span>
              </button>
            </div>

            <button
              onClick={clearCart}
              type="button"
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors py-1 cursor-pointer"
            >
              {t('cart.clearCart')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
