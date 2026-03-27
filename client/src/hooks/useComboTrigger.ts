import { useEffect, useRef, useState } from "react"

const DISMISS_KEY = "combo_ia_dismissed"
const TRIGGER_DELAY_MS = 1750

export type UseComboTriggerOptions = {
  cartSize: number
  enabled?: boolean
}

export function useComboTrigger({ cartSize, enabled = true }: UseComboTriggerOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevSizeRef = useRef<number>(cartSize)

  const isDismissed = (): boolean => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1"
    } catch {
      return false
    }
  }

  const markDismissed = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1")
    } catch {}
  }

  useEffect(() => {
    if (!enabled) return
    if (cartSize === 0) return
    if (isDismissed()) return

    const prevSize = prevSizeRef.current
    prevSizeRef.current = cartSize

    if (cartSize <= prevSize) return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      if (!isDismissed()) {
        setIsOpen(true)
      }
    }, TRIGGER_DELAY_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [cartSize, enabled])

  const dismiss = () => {
    setIsOpen(false)
    markDismissed()
  }

  const open = () => {
    if (!isDismissed()) setIsOpen(true)
  }

  return { isOpen, dismiss, open }
}
