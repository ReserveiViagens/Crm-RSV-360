import { type CartItem } from "@shared/schema"

export type { CartItem }

const CART_KEY = "rsv_tickets_cart"

function dedupeCart(items: CartItem[]): CartItem[] {
  const seen = new Map<string, CartItem>()
  for (const item of items) {
    const existing = seen.get(item.ticketId)
    if (existing) {
      seen.set(item.ticketId, { ...existing, quantity: existing.quantity + item.quantity })
    } else {
      seen.set(item.ticketId, { ...item })
    }
  }
  return Array.from(seen.values())
}

function validateCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false
  const obj = item as Record<string, unknown>
  return (
    typeof obj.ticketId === "string" && obj.ticketId.length > 0 &&
    typeof obj.name === "string" && obj.name.length > 0 &&
    typeof obj.unitPrice === "number" && obj.unitPrice > 0 &&
    typeof obj.quantity === "number" && obj.quantity > 0
  )
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const valid = parsed.filter(validateCartItem) as CartItem[]
    return dedupeCart(valid)
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function replaceCart(items: CartItem[]): void {
  const deduplicated = dedupeCart(items)
  localStorage.setItem(CART_KEY, JSON.stringify(deduplicated))
  window.dispatchEvent(new Event("rsv360-cart-updated"))
}

export function addToCart(item: Omit<CartItem, "quantity">, qty: number = 1): CartItem[] {
  const current = getCart()
  const existing = current.find((c) => c.ticketId === item.ticketId)
  let updated: CartItem[]
  if (existing) {
    updated = current.map((c) =>
      c.ticketId === item.ticketId ? { ...c, quantity: c.quantity + qty } : c
    )
  } else {
    updated = [...current, { ...item, quantity: qty }]
  }
  saveCart(updated)
  return updated
}

export function addManyToCart(items: CartItem[]): CartItem[] {
  const current = getCart()
  for (const it of items) {
    const idx = current.findIndex((c) => c.ticketId === it.ticketId)
    if (idx >= 0) {
      current[idx] = { ...current[idx], quantity: current[idx].quantity + it.quantity }
    } else {
      current.push({ ...it })
    }
  }
  saveCart(current)
  return current
}

export function removeFromCart(ticketId: string): CartItem[] {
  const updated = getCart().filter((c) => c.ticketId !== ticketId)
  saveCart(updated)
  return updated
}

export function updateQty(ticketId: string, qty: number): CartItem[] {
  let updated: CartItem[]
  if (qty <= 0) {
    updated = getCart().filter((c) => c.ticketId !== ticketId)
  } else {
    updated = getCart().map((c) =>
      c.ticketId === ticketId ? { ...c, quantity: qty } : c
    )
  }
  saveCart(updated)
  return updated
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY)
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

export function getCartItemQty(items: CartItem[], ticketId: string): number {
  return items.find((c) => c.ticketId === ticketId)?.quantity ?? 0
}

const DATE_KEY = "rsv_visit_date"

export function getSelectedDate(): Date | null {
  try {
    const raw = localStorage.getItem(DATE_KEY)
    if (!raw) return null
    const d = new Date(raw)
    return isNaN(d.getTime()) ? null : d
  } catch {
    return null
  }
}

export function saveSelectedDate(date: Date | null): void {
  try {
    if (date) localStorage.setItem(DATE_KEY, date.toISOString())
    else localStorage.removeItem(DATE_KEY)
  } catch {}
}
