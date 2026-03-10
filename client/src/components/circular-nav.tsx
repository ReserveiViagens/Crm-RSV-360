import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Link } from "wouter";
import {
  Home, Hotel, Tag, Ticket, MapPin, Phone,
  Settings, RotateCcw, GripVertical, X,
  ChevronLeft, ChevronRight, Volume2, VolumeX,
  Gavel, Zap, Map, User, Users, Brain, ShoppingCart, Star, CalendarDays, Bus
} from "lucide-react"

interface NavItem {
  id: string
  Icon: typeof Home
  label: string
  href: string
  ring: "outer" | "inner"
}

const allNavItems: NavItem[] = [
  { id: "inicio", Icon: Home, label: "Início", href: "/", ring: "outer" },
  { id: "hoteis", Icon: Hotel, label: "Hotéis", href: "/hoteis", ring: "outer" },
  { id: "promocoes", Icon: Tag, label: "Promoções", href: "/promocoes", ring: "outer" },
  { id: "ingressos", Icon: Ticket, label: "Ingressos", href: "/ingressos", ring: "outer" },
  { id: "atracoes", Icon: MapPin, label: "Atrações", href: "/atracoes", ring: "outer" },
  { id: "flash-deals", Icon: Zap, label: "Ofertas", href: "/flash-deals", ring: "outer" },
  { id: "leilao", Icon: Gavel, label: "Leilão", href: "/leiloes", ring: "outer" },
  { id: "excursoes", Icon: Bus, label: "Excursões", href: "/excursoes", ring: "outer" },
  { id: "contato", Icon: Phone, label: "Contato", href: "/contato", ring: "inner" },
  { id: "mapa", Icon: Map, label: "Mapa", href: "/mapa-caldas-novas", ring: "inner" },
  { id: "perfil", Icon: User, label: "Perfil", href: "/perfil", ring: "inner" },
  { id: "grupos", Icon: Users, label: "Grupos", href: "/viagens-grupo", ring: "inner" },
  { id: "ia", Icon: Brain, label: "CaldasAI", href: "/caldas-ai", ring: "inner" },
  { id: "quem-somos", Icon: Star, label: "Quem Somos", href: "/quem-somos", ring: "inner" },
]

const ALL_IDS = allNavItems.map((m) => m.id)
const DEFAULT_OUTER = allNavItems.filter(i => i.ring === "outer").map(i => i.id)
const DEFAULT_INNER = allNavItems.filter(i => i.ring === "inner").map(i => i.id)

const SK = {
  rotO: "rsv360-rot-outer",
  rotI: "rsv360-rot-inner",
  grpO: "rsv360-grp-outer",
  grpI: "rsv360-grp-inner",
}

const BASE_CX = 170
const BASE_CY = 200
const BASE_W = 340
const BASE_H = 210
const BASE_OUTER = { ir: 112, or: 168, itemR: 140 }
const BASE_INNER = { ir: 50, or: 104, itemR: 77 }
const WEDGE_GAP = 3
const STEP = 25

function getScale(vw: number): number {
  if (vw >= 1920) return 1.7
  if (vw >= 1440) return 1.5
  if (vw >= 1280) return 1.4
  if (vw >= 1024) return 1.25
  if (vw >= 768) return 1.15
  return 1.0
}

function useWindowWidth() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const update = () => setW(window.innerWidth)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return w
}

function toRad(d: number) { return (d * Math.PI) / 180 }

function wedgePath(cx: number, cy: number, ir: number, orr: number, s: number, e: number) {
  const sr = toRad(s), er = toRad(e)
  const ix1 = cx + ir * Math.cos(sr), iy1 = cy - ir * Math.sin(sr)
  const ix2 = cx + ir * Math.cos(er), iy2 = cy - ir * Math.sin(er)
  const ox2 = cx + orr * Math.cos(er), oy2 = cy - orr * Math.sin(er)
  const ox1 = cx + orr * Math.cos(sr), oy1 = cy - orr * Math.sin(sr)
  const la = Math.abs(e - s) > 180 ? 1 : 0
  return `M${ix1},${iy1} A${ir},${ir} 0 ${la} 0 ${ix2},${iy2} L${ox2},${oy2} A${orr},${orr} 0 ${la} 1 ${ox1},${oy1} Z`
}

function getWedges(count: number, rotation: number) {
  if (!count) return []
  const ws = (180 - Math.max(0, count - 1) * WEDGE_GAP) / count
  return Array.from({ length: count }, (_, i) => {
    const start = i * (ws + WEDGE_GAP) + rotation
    return { start, end: start + ws, mid: start + ws / 2 }
  })
}

function itemPos(cx: number, cy: number, r: number, deg: number) {
  const rad = toRad(deg)
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

function load<T>(key: string, fb: T): T {
  if (typeof window === "undefined") return fb
  try { const v = localStorage.getItem(key); return v !== null ? (JSON.parse(v) as T) : fb } catch { return fb }
}

let dbTimer: ReturnType<typeof setTimeout> | null = null
function saveDeb(key: string, val: unknown) {
  if (dbTimer) clearTimeout(dbTimer)
  dbTimer = setTimeout(() => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }, 200)
}

function saveNow(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function normalize(a: string[] | null, b: string[] | null) {
  if (!a || !b || !a.length || !b.length)
    return { a: [...DEFAULT_OUTER], b: [...DEFAULT_INNER] }
  const va = a.filter((id) => ALL_IDS.includes(id))
  const vb = b.filter((id) => ALL_IDS.includes(id) && !va.includes(id))
  const used = new Set([...va, ...vb])
  ALL_IDS.filter((id) => !used.has(id)).forEach((id) => {
    va.length <= vb.length ? va.push(id) : vb.push(id)
  })
  if (!va.length || !vb.length)
    return { a: [...DEFAULT_OUTER], b: [...DEFAULT_INNER] }
  return { a: va, b: vb }
}

function isAngleVisible(midAngle: number) {
  const n = ((midAngle % 360) + 360) % 360
  return n >= -5 && n <= 185
}

async function playAirplaneChime() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    if (ctx.state === "suspended") await ctx.resume()
    const chime = (startTime: number, freq: number, duration: number) => {
      [{ f: 1, g: 0.45 }, { f: 2, g: 0.12 }, { f: 3, g: 0.06 }, { f: 4.02, g: 0.025 }].forEach(({ f, g }) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.connect(gainNode); gainNode.connect(ctx.destination)
        osc.type = "sine"; osc.frequency.setValueAtTime(freq * f, startTime)
        gainNode.gain.setValueAtTime(0.001, startTime)
        gainNode.gain.linearRampToValueAtTime(g, startTime + 0.02)
        gainNode.gain.setValueAtTime(g, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(g * 0.5, startTime + duration * 0.4)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
        osc.start(startTime); osc.stop(startTime + duration + 0.1)
      })
    }
    const now = ctx.currentTime + 0.05
    chime(now, 698.46, 0.9); chime(now + 0.6, 523.25, 1.2)
    setTimeout(() => { try { ctx.close() } catch {} }, 3500)
  } catch {}
}

export default function CircularNav() {
  const vw = useWindowWidth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const scale = mounted && vw ? getScale(vw) : 1
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  const d = useMemo(() => {
    const s = scale
    return {
      W: BASE_W * s, H: BASE_H * s, CX: BASE_CX * s, CY: BASE_CY * s,
      oIr: BASE_OUTER.ir * s, oOr: BASE_OUTER.or * s, oR: BASE_OUTER.itemR * s,
      iIr: BASE_INNER.ir * s, iOr: BASE_INNER.or * s, iR: BASE_INNER.itemR * s,
      navIcon: 18 * s, oBtn: 38 * s, iBtn: 32 * s,
      oFont: `${0.5 * s}rem`, iFont: `${0.45 * s}rem`,
      tglOpen: Math.round(44 * s), tglClosed: Math.round(56 * s),
      tglFontOpen: `${0.55 * s}rem`, tglFontClosed: `${0.7 * s}rem`,
      tglIcon: 20 * s, tglBottomOpen: Math.round(28 * s),
      ctrlBtn: Math.round(30 * s), ctrlIcon: 14 * s,
      ctrlGap: Math.round(5 * s), ctrlBottom: Math.round(4 * s),
      pillPh: Math.round(8 * s), pillPv: Math.round(3 * s),
      pillFont: `${0.55 * s}rem`, pillRadius: Math.round(10 * s),
      cfgW: Math.min(Math.round(280 * s), 450), cfgBottom: Math.round(60 * s),
      cfgPad: Math.round(20 * s), cfgRadius: Math.round(16 * s),
      cfgTitleFont: `${Math.min(0.9 * s, 1.2)}rem`, cfgLabelFont: `${Math.min(0.7 * s, 0.9)}rem`,
      cfgItemFont: `${Math.min(0.8 * s, 1.0)}rem`, cfgBtnFont: `${Math.min(0.6 * s, 0.8)}rem`,
      cfgResetFont: `${Math.min(0.75 * s, 0.95)}rem`,
      cfgItemPad: `${Math.round(8 * s)}px ${Math.round(12 * s)}px`,
      cfgBtnPad: `${Math.round(3 * s)}px ${Math.round(8 * s)}px`,
      cfgIconSm: Math.min(12 * s, 18), cfgIconMd: Math.min(20 * s, 28),
      cfgGripIcon: Math.min(12 * s, 16),
      planeW: Math.round(80 * s), planeH: Math.round(40 * s),
    }
  }, [scale])

  const [isOpen, setIsOpen] = useState(false)
  const [rotO, setRotO] = useState(0)
  const [rotI, setRotI] = useState(0)
  const [outerIds, setOuterIds] = useState<string[]>(DEFAULT_OUTER)
  const [innerIds, setInnerIds] = useState<string[]>(DEFAULT_INNER)
  const [active, setActive] = useState<"outer" | "inner">("outer")
  const [showCfg, setShowCfg] = useState(false)
  const [ready, setReady] = useState(false)
  const [showPlane, setShowPlane] = useState(false)
  const [soundOn, setSoundOn] = useState(true)

  const containerRef = useRef<HTMLElement>(null)
  const dragRef = useRef<{
    ring: "outer" | "inner"; startAngle: number; startRot: number; cx: number; cy: number
  } | null>(null)

  useEffect(() => {
    setRotO(load(SK.rotO, 0)); setRotI(load(SK.rotI, 0))
    const n = normalize(load(SK.grpO, null), load(SK.grpI, null))
    setOuterIds(n.a); setInnerIds(n.b)
    const savedSound = load<boolean | null>("rsv360-sound-enabled", null)
    if (savedSound !== null) setSoundOn(savedSound)
    setReady(true)
  }, [])

  useEffect(() => { if (ready) saveDeb(SK.rotO, rotO) }, [rotO, ready])
  useEffect(() => { if (ready) saveDeb(SK.rotI, rotI) }, [rotI, ready])

  const outerItems = outerIds.map((id) => allNavItems.find((n) => n.id === id)).filter(Boolean) as NavItem[]
  const innerItems = innerIds.map((id) => allNavItems.find((n) => n.id === id)).filter(Boolean) as NavItem[]
  const outerW = getWedges(outerItems.length, rotO)
  const innerW = getWedges(innerItems.length, rotI)

  const close = useCallback(() => { setIsOpen(false); setShowCfg(false) }, [])

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => { const next = !prev; saveNow("rsv360-sound-enabled", next); return next })
  }, [])

  const toggle = useCallback(() => {
    if (isOpen) { close() } else {
      setIsOpen(true)
      if (soundOn) { void playAirplaneChime(); setShowPlane(true); setTimeout(() => setShowPlane(false), 1800) }
    }
  }, [isOpen, close, soundOn])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (showCfg) setShowCfg(false); else close() }
    }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [close, showCfg])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const rotateActive = useCallback((dir: number) => {
    if (active === "outer") setRotO((r) => r + dir * STEP)
    else setRotI((r) => r + dir * STEP)
  }, [active])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current || showCfg) return
    const rect = containerRef.current.getBoundingClientRect()
    const s = scaleRef.current
    const cx = rect.left + rect.width / 2
    const cy = rect.top + (BASE_CY / BASE_H) * rect.height
    const dx = e.clientX - cx, dy = -(e.clientY - cy)
    const dist = Math.sqrt(dx * dx + dy * dy)
    const threshold = ((BASE_INNER.or + BASE_OUTER.ir) / 2) * s
    const ring: "outer" | "inner" = dist > threshold ? "outer" : "inner"
    setActive(ring)
    const startAngle = Math.atan2(dy, dx) * (180 / Math.PI)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    dragRef.current = { ring, startAngle, startRot: ring === "outer" ? rotO : rotI, cx, cy }
  }, [rotO, rotI, showCfg])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.cx, dy = -(e.clientY - dragRef.current.cy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    const delta = angle - dragRef.current.startAngle
    const newRot = dragRef.current.startRot + delta
    if (dragRef.current.ring === "outer") setRotO(newRot); else setRotI(newRot)
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId); dragRef.current = null
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const dir = e.deltaY > 0 ? STEP : -STEP
    if (active === "outer") setRotO((r) => r + dir); else setRotI((r) => r + dir)
  }, [active])

  const moveItem = useCallback((itemId: string, to: "outer" | "inner") => {
    setOuterIds((pO) => {
      setInnerIds((pI) => {
        const cO = pO.filter((id) => id !== itemId), cI = pI.filter((id) => id !== itemId)
        const nO = to === "outer" ? [...cO, itemId] : cO
        const nI = to === "inner" ? [...cI, itemId] : cI
        if (!nO.length || !nI.length) return pI
        saveNow(SK.grpO, nO); saveNow(SK.grpI, nI); setOuterIds(nO); return nI
      }); return pO
    })
  }, [])

  const resetAll = useCallback(() => {
    setOuterIds([...DEFAULT_OUTER]); setInnerIds([...DEFAULT_INNER])
    setRotO(0); setRotI(0)
    saveNow(SK.grpO, DEFAULT_OUTER); saveNow(SK.grpI, DEFAULT_INNER)
    saveNow(SK.rotO, 0); saveNow(SK.rotI, 0)
  }, [])

  const renderItem = (item: NavItem, p: { x: number; y: number }, ring: "outer" | "inner", delay: number) => {
    const isOuter = ring === "outer"
    const btnSize = isOuter ? d.oBtn : d.iBtn
    const fontSize = isOuter ? d.oFont : d.iFont
    const iconSize = d.navIcon
    const bg = isOuter
      ? "linear-gradient(135deg, #22c55e, #15803d)"
      : "linear-gradient(135deg, #2563EB, #1e3a5f)"
    const shadow = isOuter
      ? "0 3px 10px rgba(34,197,94,0.5)"
      : "0 3px 10px rgba(37,99,235,0.5)"

    return (
      <Link key={item.id} href={item.href}
        onClick={(e) => { e.stopPropagation(); close() }}
        tabIndex={isOpen ? 0 : -1}
        style={{
          position: "absolute", left: p.x, top: p.y,
          transform: "translate(-50%, -50%)", display: "flex",
          flexDirection: "column", alignItems: "center",
          textDecoration: "none", color: "#fff", zIndex: 3,
          opacity: isOpen ? 1 : 0, transition: `opacity 0.3s ease ${delay}s`,
        }}
      >
        <div style={{
          width: btnSize, height: btnSize, borderRadius: "50%",
          background: bg, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: shadow, border: "2px solid rgba(255,255,255,0.2)",
        }}>
          <item.Icon style={{ width: iconSize, height: iconSize }} />
        </div>
        <span style={{
          fontSize, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
        }}>{item.label}</span>
      </Link>
    )
  }

  const smallBtn: React.CSSProperties = {
    width: d.ctrlBtn, height: d.ctrlBtn, borderRadius: "50%",
    border: "none", background: "rgba(255,255,255,0.12)",
    color: "#fff", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
  }

  const pillBtn = (isActive: boolean, color: string): React.CSSProperties => ({
    padding: `${d.pillPv}px ${d.pillPh}px`, borderRadius: d.pillRadius,
    border: "none", background: isActive ? color : "rgba(255,255,255,0.08)",
    color: "#fff", fontSize: d.pillFont, fontWeight: 700,
    cursor: "pointer", transition: "background 0.2s", textTransform: "uppercase",
  })

  const icoStyle = { width: d.ctrlIcon, height: d.ctrlIcon }

  return (
    <>
      <div onClick={close} style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0,0,0,0.6)", opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none", transition: "opacity 0.3s", zIndex: 90,
      }} />

      {showPlane && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          zIndex: 94, pointerEvents: "none", overflow: "hidden",
        }}>
          <svg width={d.planeW} height={d.planeH} viewBox="0 0 80 40" fill="none"
            style={{ position: "absolute", animation: "planeIntro 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards" }}
          >
            <path d="M70 20 L50 20 L40 10 L38 20 L20 16 L18 20 L35 22 L30 30 L34 28 L38 22 L48 22 L70 20Z" fill="rgba(255,255,255,0.9)" />
            <path d="M10 20 L35 20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
            <path d="M0 20 L18 20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 4" />
          </svg>
          <style>{`
            @keyframes planeIntro {
              0% { left: -100px; bottom: 30px; opacity: 0; transform: rotate(-15deg) scale(0.6); }
              10% { opacity: 1; }
              50% { left: 45%; bottom: 55%; transform: rotate(-8deg) scale(1); opacity: 1; }
              80% { opacity: 0.7; transform: rotate(-5deg) scale(0.8); }
              100% { left: 110%; bottom: 70%; opacity: 0; transform: rotate(-3deg) scale(0.5); }
            }
          `}</style>
        </div>
      )}

      <nav ref={containerRef} id="circular-nav" aria-label="Menu de navegação principal"
        onPointerDown={isOpen && !showCfg ? handlePointerDown : undefined}
        onPointerMove={isOpen ? handlePointerMove : undefined}
        onPointerUp={isOpen ? handlePointerUp : undefined}
        onWheel={isOpen ? handleWheel : undefined}
        style={{
          position: "fixed", bottom: 0, left: "50%", width: d.W, height: d.H,
          marginLeft: -(d.W / 2),
          transform: isOpen ? "scale(1)" : "scale(0)",
          transformOrigin: `${d.CX}px ${d.CY}px`,
          transition: "transform 0.45s cubic-bezier(0.175,0.885,0.32,1.275)",
          zIndex: 95, pointerEvents: isOpen ? "auto" : "none",
          touchAction: "none", overflow: "hidden",
        }}
      >
        <svg width={d.W} height={d.H} viewBox={`0 0 ${d.W} ${d.H}`}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          <defs><clipPath id="semi-clip"><rect x="0" y="0" width={d.W} height={d.CY + 2} /></clipPath></defs>
          <g clipPath="url(#semi-clip)">
            {outerW.map((w, i) => (
              <path key={`ow${i}`} d={wedgePath(d.CX, d.CY, d.oIr, d.oOr, w.start, w.end)}
                fill={active === "outer" ? "#2a3a4e" : "#1e2d3d"}
                stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" style={{ transition: "fill 0.2s" }}
              />
            ))}
            {innerW.map((w, i) => (
              <path key={`iw${i}`} d={wedgePath(d.CX, d.CY, d.iIr, d.iOr, w.start, w.end)}
                fill={active === "inner" ? "#2a3a4e" : "#1e2d3d"}
                stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" style={{ transition: "fill 0.2s" }}
              />
            ))}
          </g>
        </svg>

        {outerItems.map((item, i) => {
          if (!outerW[i] || !isAngleVisible(outerW[i].mid)) return null
          return renderItem(item, itemPos(d.CX, d.CY, d.oR, outerW[i].mid), "outer", i * 0.04)
        })}
        {innerItems.map((item, i) => {
          if (!innerW[i] || !isAngleVisible(innerW[i].mid)) return null
          return renderItem(item, itemPos(d.CX, d.CY, d.iR, innerW[i].mid), "inner", i * 0.04 + 0.08)
        })}
      </nav>

      {isOpen && !showCfg && (
        <div style={{
          position: "fixed", bottom: d.ctrlBottom, left: "50%",
          transform: "translateX(-50%)", zIndex: 101,
          display: "flex", alignItems: "center", gap: d.ctrlGap,
        }}>
          <button onClick={() => rotateActive(-1)} style={smallBtn} aria-label="Girar esquerda">
            <ChevronLeft style={icoStyle} />
          </button>
          <button onClick={() => setActive("outer")} style={pillBtn(active === "outer", "rgba(34,197,94,0.7)")}>Ext</button>
          <button onClick={() => setActive("inner")} style={pillBtn(active === "inner", "rgba(37,99,235,0.7)")}>Int</button>
          <button onClick={() => rotateActive(1)} style={smallBtn} aria-label="Girar direita">
            <ChevronRight style={icoStyle} />
          </button>
          <button onClick={toggleSound}
            style={{ ...smallBtn, background: soundOn ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)", transition: "background 0.2s" }}
            aria-label={soundOn ? "Desativar som" : "Ativar som"}
          >
            {soundOn ? <Volume2 style={icoStyle} /> : <VolumeX style={{ ...icoStyle, opacity: 0.5 }} />}
          </button>
          <button onClick={() => setShowCfg(true)} style={{ ...smallBtn, marginLeft: 2 }} aria-label="Configurações">
            <Settings style={icoStyle} />
          </button>
        </div>
      )}

      <button onClick={toggle} aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen} aria-controls="circular-nav"
        style={{
          position: "fixed",
          bottom: isOpen ? d.tglBottomOpen : 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: isOpen ? d.tglOpen : d.tglClosed,
          height: isOpen ? d.tglOpen : d.tglClosed,
          borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)",
          background: isOpen
            ? "linear-gradient(135deg, #DC2626, #EF4444)"
            : "linear-gradient(135deg, #1e3a5f, #2563EB)",
          color: "#fff", cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          boxShadow: isOpen
            ? "0 2px 12px rgba(220,38,38,0.5)"
            : "0 4px 20px rgba(37,99,235,0.5)",
          zIndex: 100, transition: "all 0.35s ease",
        }}
      >
        {isOpen ? (
          <X style={{ width: d.tglIcon, height: d.tglIcon }} />
        ) : (
          <>
            <span style={{ fontSize: d.tglFontClosed, fontWeight: 900, lineHeight: 1, letterSpacing: -0.5 }}>
              RSV<span style={{ color: "#F57C00" }}>360</span>
            </span>
          </>
        )}
      </button>

      {showCfg && (
        <div style={{
          position: "fixed", bottom: d.cfgBottom, left: "50%",
          transform: "translateX(-50%)", width: d.cfgW, maxWidth: "90vw",
          background: "#1e2d3d", color: "#fff", borderRadius: d.cfgRadius,
          padding: d.cfgPad, zIndex: 102, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: d.cfgTitleFont, fontWeight: 700 }}>Configurar Menu</span>
            <button onClick={() => setShowCfg(false)}
              style={{ ...smallBtn, width: 28, height: 28, background: "rgba(255,255,255,0.1)" }}
            ><X style={{ width: 14, height: 14 }} /></button>
          </div>

          {(["outer", "inner"] as const).map((ring) => {
            const ids = ring === "outer" ? outerIds : innerIds
            const label = ring === "outer" ? "Anel Externo (Verde)" : "Anel Interno (Azul)"
            const color = ring === "outer" ? "#22C55E" : "#2563EB"
            return (
              <div key={ring} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: d.cfgLabelFont, fontWeight: 600, color, marginBottom: 6 }}>{label}</p>
                {ids.map((id) => {
                  const item = allNavItems.find((n) => n.id === id)
                  if (!item) return null
                  const target = ring === "outer" ? "inner" : "outer"
                  return (
                    <div key={id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: d.cfgItemPad, background: "rgba(255,255,255,0.05)",
                      borderRadius: 8, marginBottom: 4,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <GripVertical style={{ width: d.cfgGripIcon, height: d.cfgGripIcon, opacity: 0.4 }} />
                        <item.Icon style={{ width: d.cfgIconSm, height: d.cfgIconSm }} />
                        <span style={{ fontSize: d.cfgItemFont }}>{item.label}</span>
                      </div>
                      <button onClick={() => moveItem(id, target)}
                        style={{
                          padding: d.cfgBtnPad, borderRadius: 6, border: "none",
                          background: "rgba(255,255,255,0.1)", color: "#fff",
                          fontSize: d.cfgBtnFont, cursor: "pointer",
                        }}
                      >{ring === "outer" ? "→ Int" : "→ Ext"}</button>
                    </div>
                  )
                })}
              </div>
            )
          })}

          <button onClick={resetAll} style={{
            width: "100%", padding: "8px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent", color: "#fff", fontSize: d.cfgResetFont, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <RotateCcw style={{ width: d.cfgIconSm, height: d.cfgIconSm }} /> Restaurar padrão
          </button>
        </div>
      )}
    </>
  )
}
