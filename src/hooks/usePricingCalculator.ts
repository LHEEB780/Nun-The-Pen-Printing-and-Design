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

    // 1. Determine Product Base Price in USD & IQD
    const baseUSD = product.basePriceUSD ?? Math.round(product.basePrice / USD_TO_IQD_RATE);
    const baseIQD = product.basePrice;

    // 2. Specialized Tiered Pricing logic for "Acrylic LED Sign" and generic products
    let tieredBaseUSD = baseUSD;
    let discountPercent = 0;
    let appliedTierLabelAr = 'السعر الأساسي';
    let appliedTierLabelEn = 'Standard Unit Price';
    let nextTierHintAr: string | undefined;
    let nextTierHintEn: string | undefined;

    if (product.id === 'prod-acrylic-led-sign' || product.slug === 'acrylic-led-sign') {
      // Prompt Rule:
      // Base price is $20.
      // If Quantity is 1-10, price is $20.
      // If Quantity is 11-50, price drops to $15 per unit.
      // If Quantity > 50, price drops to $10 per unit.
      if (validQty <= 10) {
        tieredBaseUSD = 20;
        discountPercent = 0;
        appliedTierLabelAr = '1 - 10 قطع: 20$ للقطعة';
        appliedTierLabelEn = '1 - 10 units: $20/unit';
        const neededForNext = 11 - validQty;
        nextTierHintAr = `أضف ${neededForNext} قطعة إضافية ليصبح سعر القطعة 15$`;
        nextTierHintEn = `Add ${neededForNext} more to drop to $15/unit`;
      } else if (validQty <= 50) {
        tieredBaseUSD = 15;
        discountPercent = 25; // ($20 - $15) / $20 = 25%
        appliedTierLabelAr = '11 - 50 قطعة: 15$ للقطعة (توفير 25%)';
        appliedTierLabelEn = '11 - 50 units: $15/unit (25% off)';
        const neededForNext = 51 - validQty;
        nextTierHintAr = `أضف ${neededForNext} قطعة إضافية ليصبح سعر القطعة 10$ فقط!`;
        nextTierHintEn = `Add ${neededForNext} more to drop to $10/unit!`;
      } else {
        tieredBaseUSD = 10;
        discountPercent = 50; // ($20 - $10) / $20 = 50%
        appliedTierLabelAr = 'أكثر من 50 قطعة: 10$ للقطعة (أعلى تخفيض 50%)';
        appliedTierLabelEn = '> 50 units: $10/unit (Max 50% savings)';
      }
    } else {
      // Generic product tier discount based on tierPricing configuration
      const activeTier = [...(product.tierPricing || [])]
        .reverse()
        .find((tier) => validQty >= tier.minQty);

      if (activeTier) {
        discountPercent = activeTier.discountPercent;
        appliedTierLabelAr = activeTier.labelAr;
        appliedTierLabelEn = activeTier.labelEn;
      }

      tieredBaseUSD = Math.round(baseUSD * (1 - discountPercent / 100));
    }

    const tieredBaseIQD = Math.round(tieredBaseUSD * USD_TO_IQD_RATE);

    // 3. Size extra fee:
    // For Acrylic LED Sign: 30x30cm adds $5.
    let sizeFeeUSD = 0;
    let sizeFeeIQD = 0;

    if (selectedDimension) {
      if (
        selectedDimension.id === 'dim-30x30' ||
        selectedDimension.labelEn.toLowerCase().includes('30x30') ||
        selectedDimension.labelAr.includes('30')
      ) {
        sizeFeeUSD = 5;
        sizeFeeIQD = 5 * USD_TO_IQD_RATE;
      } else if (selectedDimension.multiplier > 1.0) {
        // Multiplier proportional addition
        sizeFeeUSD = Math.round(tieredBaseUSD * (selectedDimension.multiplier - 1));
        sizeFeeIQD = Math.round(tieredBaseIQD * (selectedDimension.multiplier - 1));
      }
    }

    // 4. Material and additional options
    const materialFeeIQD = selectedMaterial?.priceAdd || 0;
    const materialFeeUSD = Math.round(materialFeeIQD / USD_TO_IQD_RATE);

    const addonsFeeUSD = customAddonsTotalUSD;
    const addonsFeeIQD = customAddonsTotalIQD || customAddonsTotalUSD * USD_TO_IQD_RATE;

    // 5. Final Unit Price & Total Price Calculation
    const unitPriceUSD = tieredBaseUSD + sizeFeeUSD + materialFeeUSD + addonsFeeUSD;
    const unitPriceIQD = tieredBaseIQD + sizeFeeIQD + materialFeeIQD + addonsFeeIQD;

    const totalPriceUSD = unitPriceUSD * validQty;
    const totalPriceIQD = unitPriceIQD * validQty;

    // 6. Savings comparison against original un-discounted base
    const originalUnitPriceUSD = baseUSD + sizeFeeUSD + materialFeeUSD + addonsFeeUSD;
    const originalUnitPriceIQD = baseIQD + sizeFeeIQD + materialFeeIQD + addonsFeeIQD;

    const savingsTotalUSD = Math.max(0, (originalUnitPriceUSD - unitPriceUSD) * validQty);
    const savingsTotalIQD = Math.max(0, (originalUnitPriceIQD - unitPriceIQD) * validQty);

    return {
      basePriceUSD: baseUSD,
      basePriceIQD: baseIQD,
      tieredBasePriceUSD: tieredBaseUSD,
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
