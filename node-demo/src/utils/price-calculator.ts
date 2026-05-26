/**
 * Calculate VAT (Value Added Tax) for a given amount.
 *
 * @param amount - Pre-tax amount in paise (smallest currency unit).
 * @param vatRate - VAT rate as decimal (e.g., 0.18 for 18%).
 * @returns The VAT amount, rounded to the nearest paisa.
 *
 * Edge cases:
 * - Negative amounts: throw RangeError.
 * - Zero amount: return 0.
 * - vatRate outside [0, 1]: throw RangeError.
 */
export function calculateVAT(amount: number, vatRate: number): number {
  // Validate inputs
  if (amount < 0) {
    throw new RangeError('Amount cannot be negative.');
  }
  if (vatRate < 0 || vatRate > 1) {
    throw new RangeError('VAT rate must be between 0 and 1.');
  }
  if (amount === 0) {
    return 0;
  }

  const vatAmount = amount * vatRate;
  return Math.round(vatAmount);
}