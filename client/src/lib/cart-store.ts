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

export function addToCart(item: Omit<CartItem, "quantity">, qty: number = 1): CartItem[] {
  const current = getCart();
  const existing = current.find((c) => c.ticketId === item.ticketId);
  let updated: CartItem[];
  if (existing) {
    updated = current.map((c) =>
      c.ticketId === item.ticketId ? { ...c, quantity: c.quantity + qty } : c
    );
  } else {
    updated = [...current, { ...item, quantity: qty }];
  }
  saveCart(updated);
  return updated;
}

export function addManyToCart(items: CartItem[]): CartItem[] {
  const current = getCart();
  for (const it of items) {
    const idx = current.findIndex((c) => c.ticketId === it.ticketId);
    if (idx >= 0) {
      current[idx] = { ...current[idx], quantity: current[idx].quantity + it.quantity };
    } else {
      current.push({ ...it });
    }
  }
  saveCart(current);
  return current;
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
