export type PricingInput = {
  unitPrice: number
  originalPrice?: number
  discount?: number
  comboDiscountRate?: number
}

export type PricingResult = {
  originalPrice: number
  comboPrice: number
  savings: number
  effectiveDiscountPct: number
}

const DEFAULT_COMBO_DISCOUNT_RATE = 0.15

export function calculateComboPrice(input: PricingInput): PricingResult {
  const { unitPrice, originalPrice, comboDiscountRate = DEFAULT_COMBO_DISCOUNT_RATE } = input

  const baseOriginalPrice = originalPrice ?? unitPrice
  const comboPrice = Math.round(unitPrice * (1 - comboDiscountRate) * 100) / 100
  const savings = Math.round((baseOriginalPrice - comboPrice) * 100) / 100
  const effectiveDiscountPct =
    Math.round(((baseOriginalPrice - comboPrice) / baseOriginalPrice) * 100 * 10) / 10

  return {
    originalPrice: baseOriginalPrice,
    comboPrice,
    savings,
    effectiveDiscountPct,
  }
}

export type CartComboTotalInput = {
  items: { unitPrice: number; originalPrice?: number; quantity: number }[]
  comboDiscountRate?: number
}

export type CartComboTotal = {
  originalTotal: number
  comboTotal: number
  totalSavings: number
  effectiveDiscountPct: number
}

export function calculateCartComboTotal(input: CartComboTotalInput): CartComboTotal {
  const { items, comboDiscountRate = DEFAULT_COMBO_DISCOUNT_RATE } = input

  let originalTotal = 0
  let comboTotal = 0

  for (const item of items) {
    const basePrice = item.originalPrice ?? item.unitPrice
    originalTotal += basePrice * item.quantity
    comboTotal +=
      Math.round(item.unitPrice * (1 - comboDiscountRate) * 100) / 100 * item.quantity
  }

  originalTotal = Math.round(originalTotal * 100) / 100
  comboTotal = Math.round(comboTotal * 100) / 100
  const totalSavings = Math.round((originalTotal - comboTotal) * 100) / 100
  const effectiveDiscountPct =
    originalTotal > 0
      ? Math.round(((originalTotal - comboTotal) / originalTotal) * 100 * 10) / 10
      : 0

  return { originalTotal, comboTotal, totalSavings, effectiveDiscountPct }
}
