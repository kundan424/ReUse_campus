import { getCategoryById } from './categories';

/**
 * Calculates environmental and financial impact for a completed transfer.
 * @param {string} category
 * @param {number} quantity
 * @returns {object} { estimatedSavingsINR, estimatedCarbonSavedKg, wasteDivertedKg }
 */
export function calculateImpact(category, quantity = 1) {
  const cat = getCategoryById(category);
  const qty = Math.max(1, Number(quantity) || 1);

  const estimatedSavingsINR = Math.round(cat.avgCostInr * qty);
  const estimatedCarbonSavedKg = Number((cat.co2KgPerUnit * qty).toFixed(2));
  const wasteDivertedKg = Number((cat.wasteKgPerUnit * qty).toFixed(2));

  return {
    estimatedSavingsINR,
    estimatedCarbonSavedKg,
    wasteDivertedKg,
  };
}
