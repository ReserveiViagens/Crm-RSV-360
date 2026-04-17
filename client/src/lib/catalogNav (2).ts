import { Trees, Building, Ticket, Bus, Camera, Sparkles } from "lucide-react"
import type { HotelCategory } from "@/components/hotel/HotelCategoryNav"

export type SectionKey = "parques" | "hoteis" | "ingressos" | "excursoes" | "atracoes" | "combos" | "busca" | "promocoes" | "flash-deals"

const SECTION_ITEMS: Array<HotelCategory & { _key: SectionKey }> = [
  {
    _key: "parques",
    label: "Parques",
    value: "__nav_parques",
    icon: Trees,
    filterUpdate: {},
    href: "/parques",
    badge: "NOVO",
    badgeColor: "orange",
    testId: "chip-type-parques",
  },
  {
    _key: "hoteis",
    label: "Hotéis",
    value: "__nav_hoteis",
    icon: Building,
    filterUpdate: {},
    href: "/hoteis",
    testId: "chip-type-hoteis",
  },
  {
    _key: "ingressos",
    label: "Ingressos",
    value: "__nav_ingressos",
    icon: Ticket,
    filterUpdate: {},
    href: "/ingressos",
    testId: "chip-type-ingressos",
  },
  {
    _key: "excursoes",
    label: "Excursões",
    value: "__nav_excursoes",
    icon: Bus,
    filterUpdate: {},
    href: "/excursoes",
    testId: "chip-type-excursoes",
  },
  {
    _key: "atracoes",
    label: "Atrações",
    value: "__nav_atracoes",
    icon: Camera,
    filterUpdate: {},
    href: "/atracoes",
    testId: "chip-type-atracoes",
  },
  {
    _key: "combos",
    label: "Combos",
    value: "__nav_combos",
    icon: Sparkles,
    filterUpdate: {},
    href: "/combos",
    badge: "NOVO",
    badgeColor: "orange",
    testId: "chip-type-combos",
  },
]

export function buildSectionTypeNav(activeSection: SectionKey): HotelCategory[] {
  return SECTION_ITEMS.map((item) => {
    const { _key, ...rest } = item
    if (_key === activeSection) {
      const { href, ...active } = rest
      return { ...active, forceActive: true }
    }
    return rest
  })
}

export const CATALOG_DIVIDER: HotelCategory = {
  label: "__divider",
  value: "__divider",
  filterUpdate: {},
  isDivider: true,
}
