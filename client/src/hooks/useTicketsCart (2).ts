import { useEffect, useMemo, useState } from "react"
import {
  type CartItem,
  getCart,
  addToCart,
  addManyToCart,
  updateQty,
  removeFromCart,
  getCartTotal,
} from "@/lib/cart-store"

export function useTicketsCart() {
  const [cart, setCart] = useState<CartItem[]>(() => getCart())

  useEffect(() => {
    setCart(getCart())
  }, [])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "rsv_tickets_cart") {
        setCart(getCart())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const total = useMemo(() => getCartTotal(cart), [cart])

  function addTicket(input: Omit<CartItem, "quantity">, qty: number = 1) {
    const next = addToCart(input, qty)
    setCart(next)
  }

  function addManyTickets(items: CartItem[]) {
    const next = addManyToCart(items)
    setCart(next)
  }

  function updateTicketQty(ticketId: string, quantity: number) {
    const next = updateQty(ticketId, quantity)
    setCart(next)
  }

  function removeTicket(ticketId: string) {
    const next = removeFromCart(ticketId)
    setCart(next)
  }

  return {
    cart,
    total,
    addTicket,
    addManyToCart: addManyTickets,
    updateTicketQty,
    removeTicket,
  }
}
