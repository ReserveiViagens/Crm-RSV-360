import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import type { SearchFilters } from "@/types/search"

export interface HotelCategory {
  label: string
  value: string
  icon: LucideIcon
  filterUpdate: Partial<SearchFilters>
}

interface HotelCategoryNavProps {
  categories: HotelCategory[]
  activeFilter: string
  onSelect: (category: HotelCategory) => void
}

function getAnimClass(value: string, label: string): string {
  if (label === "Casal") return "rsv-cat-heartbeat"
  if (label === "Família") return "rsv-cat-bounce"
  if (label === "Resort") return "rsv-cat-wave"
  if (label.includes("Estrelas") || label === "Premium") return "rsv-cat-star"
  if (label === "Econômico") return "rsv-cat-wiggle"
  if (value.startsWith("ent:")) return "rsv-cat-slide"
  return "rsv-cat-float"
}

export function HotelCategoryNav({ categories, activeFilter, onSelect }: HotelCategoryNavProps) {
  const [popping, setPopping] = useState<string | null>(null)

  function handleClick(cat: HotelCategory) {
    setPopping(cat.value)
    setTimeout(() => setPopping(null), 350)
    onSelect(cat)
  }

  return (
    <>
      <style>{`
        @keyframes rsv-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes rsv-bounce-cat {
          0%, 100% { transform: translateY(0) scale(1); }
          35% { transform: translateY(-7px) scale(1.08); }
          65% { transform: translateY(-3px) scale(1.03); }
        }
        @keyframes rsv-heartbeat {
          0%, 100% { transform: scale(1); }
          20% { transform: scale(1.18); }
          40% { transform: scale(1); }
          60% { transform: scale(1.10); }
          80% { transform: scale(1); }
        }
        @keyframes rsv-wave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-4deg); }
          75% { transform: translateY(-2px) rotate(4deg); }
        }
        @keyframes rsv-star-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes rsv-wiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-10deg); }
          40% { transform: rotate(8deg); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(4deg); }
        }
        @keyframes rsv-slide-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes rsv-pop-click {
          0% { transform: scale(1); }
          40% { transform: scale(1.35); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }

        .rsv-hotel-cat-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px 16px 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
          min-width: 72px;
          transition: opacity 0.15s;
        }
        .rsv-hotel-cat-btn:active { opacity: 0.75; }

        .rsv-hotel-cat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          transition: color 0.2s, background 0.2s, transform 0.15s;
          color: #9CA3AF;
          background: #F3F4F6;
        }
        .rsv-hotel-cat-btn--active .rsv-hotel-cat-icon {
          color: #2563EB;
          background: #EFF6FF;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-icon {
          color: #2563EB;
          background: #EFF6FF;
          transform: translateY(-3px);
        }
        .rsv-hotel-cat-btn--active:hover .rsv-hotel-cat-icon {
          transform: translateY(-2px);
        }

        .rsv-hotel-cat-icon.rsv-cat-popping {
          animation: rsv-pop-click 0.32s ease-out !important;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-icon.rsv-cat-float {
          animation: rsv-float 0.9s ease-in-out infinite;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-icon.rsv-cat-bounce {
          animation: rsv-bounce-cat 0.7s ease-in-out infinite;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-icon.rsv-cat-heartbeat {
          animation: rsv-heartbeat 0.8s ease-in-out infinite;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-icon.rsv-cat-wave {
          animation: rsv-wave 0.85s ease-in-out infinite;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-icon.rsv-cat-star {
          animation: rsv-star-spin 1s ease-in-out infinite;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-icon.rsv-cat-wiggle {
          animation: rsv-wiggle 0.6s ease-in-out infinite;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-icon.rsv-cat-slide {
          animation: rsv-slide-up 0.8s ease-in-out infinite;
        }

        .rsv-hotel-cat-label {
          font-size: 11px;
          font-weight: 600;
          color: #9CA3AF;
          white-space: nowrap;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }
        .rsv-hotel-cat-btn--active .rsv-hotel-cat-label {
          color: #2563EB;
          font-weight: 700;
        }
        .rsv-hotel-cat-btn:hover .rsv-hotel-cat-label {
          color: #2563EB;
        }

        .rsv-hotel-cat-underline {
          height: 2.5px;
          width: 0;
          background: #2563EB;
          border-radius: 2px;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 2px;
          align-self: stretch;
        }
        .rsv-hotel-cat-btn--active .rsv-hotel-cat-underline {
          width: 100%;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 0,
          overflowX: "auto",
          scrollbarWidth: "none",
          flex: 1,
          minWidth: 0,
        }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = activeFilter === cat.value
          const isPopping = popping === cat.value
          const animClass = getAnimClass(cat.value, cat.label)

          return (
            <button
              key={cat.value}
              data-testid={`button-filter-${cat.value}`}
              className={`rsv-hotel-cat-btn${isActive ? " rsv-hotel-cat-btn--active" : ""}`}
              onClick={() => handleClick(cat)}
            >
              <div
                className={`rsv-hotel-cat-icon ${animClass}${isPopping ? " rsv-cat-popping" : ""}`}
              >
                <Icon size={28} strokeWidth={isActive ? 2.2 : 1.8} />
              </div>
              <span className="rsv-hotel-cat-label">{cat.label}</span>
              <div className="rsv-hotel-cat-underline" />
            </button>
          )
        })}
      </div>
    </>
  )
}
