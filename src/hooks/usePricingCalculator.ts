import { useMemo } from 'react';
import { ProductItem, DimensionOption, MaterialOption } from '../data/mockData';

export interface PricingOptions {
  product: ProductItem;
  quantity: number;
  selectedDimension?: DimensionOption;
  selectedMaterial?: MaterialOption;
  customAddonsTotalUSD?: number;
  customAddonsTotalIQD?: number;
}

export interface PricingBreakdown {
  basePriceUSD: number;
  basePriceIQD: number;
  tieredBasePriceUSD: number;
  tieredBasePriceIQD: number;
  sizeFeeUSD: number;
  sizeFeeIQD: number;
  materialFeeUSD: number;
  materialFeeIQD: number;
  addonsFeeUSD: number;
  addonsFeeIQD: number;
  unitPriceUSD: number;
  unitPriceIQD: number;
  totalPriceUSD: number;
  totalPriceIQD: number;
  originalUnitPriceUSD: number;
  originalUnitPriceIQD: number;
  discountPercent: number;
  savingsTotalUSD: number;
  savingsTotalIQD: number;
  appliedTierLabelAr: string;
  appliedTierLabelEn: string;
  nextTierHintAr?: string;
  nextTierHintEn?: string;
}

export const USD_TO_IQD_RATE = 1300;

export function usePricingCalculator({
  product,
  quantity,
  selectedDimension,
  selectedMaterial,
  customAddonsTotalUSD = 0,
  customAddonsTotalIQD = 0,
}: PricingOptions): PricingBreakdown {
  return useMemo(() => {
    const validQty = Math.max(1, isNaN(quantity) ? 1 : quantity);

    // 1. Determine Product Base Price — IQD is the native source of truth,
    //    USD values are display-only and always derived from IQD.
    const baseIQD = product.basePrice;
    const baseUSD = Math.round(baseIQD / USD_TO_IQD_RATE);

    // 2. Specialized Tiered Pricing logic for "Acrylic LED Sign" and generic products
    let tieredBaseIQD = baseIQD;
    let discountPercent = 0;
    let appliedTierLabelAr = 'السعر الأساسي';
    let appliedTierLabelEn = 'Standard Unit Price';
    let nextTierHintAr: string | undefined;
    let nextTierHintEn: string | undefined;

    if (product.id === 'prod-acrylic-led-sign' || product.slug === 'acrylic-led-sign') {
      // Prompt Rule (canonical prices are USD for this product):
      // If Quantity is 1-10, price is $20/unit.
      // If Quantity is 11-50, price drops to $15 per unit.
      // If Quantity > 50, price drops to $10 per unit.
      if (validQty <= 10) {
        tieredBaseIQD = 20 * USD_TO_IQD_RATE;
        discountPercent = 0;
        appliedTierLabelAr = '1 - 10 قطع: 20$ للقطعة';
        appliedTierLabelEn = '1 - 10 units: $20/unit';
        const neededForNext = 11 - validQty;
        nextTierHintAr = `أضف ${neededForNext} قطعة إضافية ليصبح سعر القطعة 15$`;
        nextTierHintEn = `Add ${neededForNext} more to drop to $15/unit`;
      } else if (validQty <= 50) {
        tieredBaseIQD = 15 * USD_TO_IQD_RATE;
        discountPercent = 25; // ($20 - $15) / $20 = 25%
        appliedTierLabelAr = '11 - 50 قطعة: 15$ للقطعة (توفير 25%)';
        appliedTierLabelEn = '11 - 50 units: $15/unit (25% off)';
        const neededForNext = 51 - validQty;
        nextTierHintAr = `أضف ${neededForNext} قطعة إضافية ليصبح سعر القطعة 10$ فقط!`;
        nextTierHintEn = `Add ${neededForNext} more to drop to $10/unit!`;
      } else {
        tieredBaseIQD = 10 * USD_TO_IQD_RATE;
        discountPercent = 50; // ($20 - $10) / $20 = 50%
        appliedTierLabelAr = 'أكثر من 50 قطعة: 10$ للقطعة (أعلى تخفيض 50%)';
        appliedTierLabelEn = '> 50 units: $10/unit (Max 50% savings)';
      }
    } else {
      // Generic product tier discount based on tierPricing configuration,
      // applied natively in IQD to avoid destructive USD round-trips.
      const activeTier = [...(product.tierPricing || [])]
        .reverse()
        .find((tier) => validQty >= tier.minQty);

      if (activeTier) {
        discountPercent = activeTier.discountPercent;
        appliedTierLabelAr = activeTier.labelAr;
        appliedTierLabelEn = activeTier.labelEn;
      }

      tieredBaseIQD = Math.round(baseIQD * (1 - discountPercent / 100));
    }

    // 3. Size extra fee:
    //    Only the explicit 30x30 add-on (id 'dim-30x30') carries the flat $5 fee.
    //    Never match by Arabic label text — labels like "130 سم" or "40 × 30" would false-positive.
    let sizeFeeIQD = 0;

    if (selectedDimension) {
      if (
        selectedDimension.id === 'dim-30x30' ||
        selectedDimension.labelEn.toLowerCase().includes('30x30')
      ) {
        sizeFeeIQD = 5 * USD_TO_IQD_RATE;
      } else if (selectedDimension.multiplier > 1.0) {
        // Multiplier proportional addition
        sizeFeeIQD = Math.round(tieredBaseIQD * (selectedDimension.multiplier - 1));
      }
    }
    const sizeFeeUSD = Math.round(sizeFeeIQD / USD_TO_IQD_RATE);

    // 4. Material and additional options (IQD native)
    const materialFeeIQD = selectedMaterial?.priceAdd || 0;
    const materialFeeUSD = Math.round(materialFeeIQD / USD_TO_IQD_RATE);

    const addonsFeeIQD = customAddonsTotalIQD || Math.round(customAddonsTotalUSD * USD_TO_IQD_RATE);
    const addonsFeeUSD = Math.round(addonsFeeIQD / USD_TO_IQD_RATE);

    // 5. Final Unit Price & Total Price Calculation (IQD native)
    const unitPriceIQD = tieredBaseIQD + sizeFeeIQD + materialFeeIQD + addonsFeeIQD;
    const unitPriceUSD = Math.round(unitPriceIQD / USD_TO_IQD_RATE);

    const totalPriceIQD = unitPriceIQD * validQty;
    const totalPriceUSD = Math.round(totalPriceIQD / USD_TO_IQD_RATE);

    // 6. Savings comparison against original un-discounted base (IQD native)
    const originalUnitPriceIQD = baseIQD + sizeFeeIQD + materialFeeIQD + addonsFeeIQD;
    const originalUnitPriceUSD = Math.round(originalUnitPriceIQD / USD_TO_IQD_RATE);

    const savingsTotalIQD = Math.max(0, (originalUnitPriceIQD - unitPriceIQD) * validQty);
    const savingsTotalUSD = Math.round(savingsTotalIQD / USD_TO_IQD_RATE);

    return {
      basePriceUSD: baseUSD,
      basePriceIQD: baseIQD,
      tieredBasePriceUSD: Math.round(tieredBaseIQD / USD_TO_IQD_RATE),
      tieredBasePriceIQD: tieredBaseIQD,
      sizeFeeUSD,
      sizeFeeIQD,
      materialFeeUSD,
      materialFeeIQD,
      addonsFeeUSD,
      addonsFeeIQD,
      unitPriceUSD,
      unitPriceIQD,
      totalPriceUSD,
      totalPriceIQD,
      originalUnitPriceUSD,
      originalUnitPriceIQD,
      discountPercent,
      savingsTotalUSD,
      savingsTotalIQD,
      appliedTierLabelAr,
      appliedTierLabelEn,
      nextTierHintAr,
      nextTierHintEn,
    };
  }, [
    product,
    quantity,
    selectedDimension,
    selectedMaterial,
    customAddonsTotalUSD,
    customAddonsTotalIQD,
  ]);
}
