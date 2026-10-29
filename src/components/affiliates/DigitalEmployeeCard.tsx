import React from 'react';
import { useTranslation } from 'react-i18next';
import { PartnerItem, PARTNER_RANKS_CONFIG } from '../../store/useAffiliateStore';
import { Award, ShieldCheck, QrCode, MapPin, Phone, Calendar, Printer, CheckCircle2 } from 'lucide-react';

interface DigitalEmployeeCardProps {
  partner: PartnerItem;
  isAr?: boolean;
  onPrint?: () => void;
}

export const DigitalEmployeeCard: React.FC<DigitalEmployeeCardProps> = ({
  partner,
  isAr: propIsAr,
  onPrint,
}) => {
  const { i18n } = useTranslation();
  const isAr = propIsAr ?? (i18n.language === 'ar');
  const rankInfo = PARTNER_RANKS_CONFIG[partner.rank];

  const handleCardPrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Print / Download Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCardPrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-stone-500" />
          <span>{isAr ? 'طباعة بطاقة العمل' : 'Print ID Card'}</span>
        </button>
      </div>

      {/* Official Identity Card Frame */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border-2 border-amber-500/50 p-6 sm:p-7 text-white shadow-2xl space-y-6">
        {/* Subtle Decorative Gold Watermarks */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Brand Logo & Classification */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-1 border border-amber-400/80 shadow-md flex items-center justify-center shrink-0">
              <img
                src="/images/noon_walqalam_logo.png"
                alt="شعار نون والقلم"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-100 tracking-tight leading-snug">
                نُون والقَلَم للطباعة والتصميم
              </h3>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Baghdad Atelier • Official Sales Partner
              </p>
            </div>
          </div>

          <div className="text-end">
            <span className="text-[9px] text-stone-400 block font-mono">ID NO.</span>
            <span className="font-mono text-xs font-black text-amber-300 tracking-wider">
              {partner.employeeId}
            </span>
          </div>
        </div>

        {/* Middle Body: Partner Photo & Official Details */}
        <div className="flex items-start gap-4 relative z-10">
          {/* Avatar / Portrait Box */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-amber-500/20 via-stone-800 to-amber-700/20 border-2 border-amber-400/60 p-1 flex items-center justify-center shadow-inner overflow-hidden">
              <div className="w-full h-full rounded-xl bg-stone-800 flex items-center justify-center text-amber-300 font-black text-xl">
                {partner.fullName.slice(0, 2)}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-stone-900 flex items-center justify-center text-white text-[10px]" title="شريك نشط ومعتمد">
              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${rankInfo.badgeColorClass}`}>
                {rankInfo.badgeAr}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-black text-white leading-tight truncate">
              {partner.fullName}
            </h4>

            <p className="text-xs text-stone-300 font-medium">
              {isAr ? 'مندوب تطوير أعمال وشريك معتمد' : 'Business Development Partner'}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{partner.city}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-amber-400" />
                <span className="font-mono">{partner.phone}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Partner Referral Code Strip */}
        <div className="p-3 rounded-2xl bg-stone-950/80 border border-amber-500/30 flex items-center justify-between gap-3 relative z-10">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">
              {isAr ? 'كود الشريك المعتمد في المتجر:' : 'Partner Referral Code:'}
            </span>
            <span className="text-base font-black text-amber-400 font-mono tracking-widest">
              {partner.referralCode}
            </span>
          </div>

          <div className="text-end">
            <span className="text-[9px] text-stone-400 block">
              {isAr ? 'نسبة العمولة والحافز:' : 'Commission & Bonus:'}
            </span>
            <span className="text-xs font-black text-emerald-400 font-mono">
              10% + {rankInfo.bonusPercent}% حافز رتبة
            </span>
          </div>
        </div>

        {/* Footer: Official Seal & Verification */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[10px] text-stone-400 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              ★
            </div>
            <div>
              <p className="font-bold text-stone-300">{isAr ? 'معتمد رسمياً من استوديو بغداد' : 'Baghdad Workshop Verified'}</p>
              <p className="text-[9px] font-mono text-stone-500">تاريخ التعيين: {partner.joinedAt}</p>
            </div>
          </div>

          <div className="text-end font-mono text-[9px] text-stone-500">
            SECURE VERIFIED B2B
          </div>
        </div>
      </div>
    </div>
  );
};
