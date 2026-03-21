export interface CartItem {
  ticketId: string;
  name: string;
  unitPrice: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  image?: string;
}

const CART_KEY = "rsv_tickets_cart";

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">): CartItem[] {
  const current = getCart();
  const existing = current.find((c) => c.ticketId === item.ticketId);
  let updated: CartItem[];
  if (existing) {
    updated = current.map((c) =>
      c.ticketId === item.ticketId ? { ...c, quantity: c.quantity + 1 } : c
    );
  } else {
    updated = [...current, { ...item, quantity: 1 }];
  }
  saveCart(updated);
  return updated;
}

export function removeFromCart(ticketId: string): CartItem[] {
  const updated = getCart().filter((c) => c.ticketId !== ticketId);
  saveCart(updated);
  return updated;
}

export function updateQty(ticketId: string, qty: number): CartItem[] {
  let updated: CartItem[];
  if (qty <= 0) {
    updated = getCart().filter((c) => c.ticketId !== ticketId);
  } else {
    updated = getCart().map((c) =>
      c.ticketId === ticketId ? { ...c, quantity: qty } : c
    );
  }
  saveCart(updated);
  return updated;
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function getCartItemQty(items: CartItem[], ticketId: string): number {
  return items.find((c) => c.ticketId === ticketId)?.quantity ?? 0;
}
