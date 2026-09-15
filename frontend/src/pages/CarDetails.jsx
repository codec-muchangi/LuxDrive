/**
 * LUXDRIVE — Car Overview Dashboard (CarDetails page)
 * Route: /cars/:id  →  frontend/src/pages/CarDetails.jsx
 *
 * Changes v3:
 *  · Real BMW M4 Competition photographs (Unsplash, no AI)
 *  · Removed AI Assistant panel
 *  · Font upgraded: Plus Jakarta Sans + Bebas Neue
 *  · Full-page vertical scroll — no overflow:hidden prison
 *  · Sticky sidebar + sticky header while content scrolls
 *  · Improved SVG speedometer with glow needle
 *  · BMW M4 overhead image in Car Highlights
 *  · BMW M4 side-profile image in Why section
 *  · LUXDRIVE logo bigger & thicker
 *  · Zero spacing waste — aspect-ratio images flow naturally
 */

import { useState } from "react"
import {
  LayoutGrid,
  Search,
  Car,
  Calendar,
  Heart,
  MessageSquare,
  Settings,
  Bell,
  MapPin,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Star,
  Zap,
  Gauge,
  Users,
  Fuel,
  CreditCard,
  Shield,
  Moon,
  Sun,
  Wind,
  Music,
  Share2,
  BadgeCheck,
  Check,
} from "lucide-react"

/* ─────────────────────────────────────────────────────────────────────────────
   REAL BMW M4 COMPETITION PHOTO URLS  (Unsplash — no AI generated)
   ───────────────────────────────────────────────────────────────────────────── */
const IMGS = {
  // Main hero — BMW M4 Competition front-three-quarter silver
  hero: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=90",
  // Car Highlights — BMW M4 overhead top-down cockpit view
  topDown: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=85",
  // Why BMW M4 — side profile studio shot
  sideProfile: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=420&q=85",
}

/* ─────────────────────────────────────────────────────────────────────────────
   THEME TOKENS
   ───────────────────────────────────────────────────────────────────────────── */
const DARK = {
  bg:    "#0A0A0A",
  surf:  "#131313",
  surf2: "#1c1c1c",
  bdr:   "#272727",
  gold:  "#eec453",
  txt:   "#F4F3EE",
  muted: "#6b6b6b",
  sub:   "#999999",
}

const LIGHT = {
  bg:    "#F2F1EB",
  surf:  "#FFFFFF",
  surf2: "#F7F6F0",
  bdr:   "#E3E0D8",
  gold:  "#C8860E",
  txt:   "#0A0A0A",
  muted: "#888888",
  sub:   "#555555",
}

/* ─────────────────────────────────────────────────────────────────────────────
   SPEEDOMETER  — SVG semicircle gauge with glowing needle
   ───────────────────────────────────────────────────────────────────────────── */
function Speedometer({ c, isDark }) {
  const CX = 95, CY = 88, R = 68
  const toRad = (d) => (d * Math.PI) / 180
  const START = -210, END = 30, VAL = 290, MAX = 400
  const valDeg = START + (VAL / MAX) * (END - START)

  const pt = (angle, radius) => ({
    x: (CX + radius * Math.cos(toRad(angle))).toFixed(2),
    y: (CY + radius * Math.sin(toRad(angle))).toFixed(2),
  })

  const arcD = (a, b) => {
    const s = pt(a, R), e = pt(b, R)
    const lg = ((b - a) + 360) % 360 > 180 ? 1 : 0
    return `M${s.x},${s.y} A${R},${R} 0 ${lg} 1 ${e.x},${e.y}`
  }

  const ticks = Array.from({ length: 9 }, (_, i) => ({
    outer: pt(START + (i / 8) * (END - START), R),
    inner: pt(START + (i / 8) * (END - START), R - 10),
    label: pt(START + (i / 8) * (END - START), R + 16),
    n: i,
  }))

  const needleTip = pt(valDeg, R - 10)
  const glowId = "gaugeGlow"

  return (
    <svg viewBox="0 0 190 140" style={{ width: "100%", maxWidth: 190 }}>
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={c.gold} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.gold} stopOpacity="1"   />
        </linearGradient>
      </defs>

      {/* Outer ring subtle */}
      <circle
        cx={CX} cy={CY} r={R + 2}
        fill="none"
        stroke={c.bdr}
        strokeWidth="1"
        strokeOpacity="0.4"
        strokeDasharray="4 3"
      />

      {/* Track */}
      <path
        d={arcD(START, END)}
        fill="none"
        stroke={isDark ? "#242424" : "#e0ddd6"}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Active arc */}
      <path
        d={arcD(START, valDeg)}
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />

      {/* Tick marks + labels */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={t.outer.x} y1={t.outer.y}
            x2={t.inner.x} y2={t.inner.y}
            stroke={c.bdr}
            strokeWidth={i % 2 === 0 ? "2" : "1.2"}
            strokeLinecap="round"
          />
          <text
            x={t.label.x}
            y={t.label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={c.muted}
            fontSize="7.5"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="500"
          >
            {t.n}
          </text>
        </g>
      ))}

      {/* Needle */}
      <line
        x1={CX} y1={CY}
        x2={needleTip.x} y2={needleTip.y}
        stroke={c.gold}
        strokeWidth="2.5"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />

      {/* Pivot */}
      <circle cx={CX} cy={CY} r="6"   fill={c.gold} />
      <circle cx={CX} cy={CY} r="3"   fill={isDark ? "#111" : "#fff"} />
      <circle cx={CX} cy={CY} r="1.5" fill={c.gold} />

      {/* Value */}
      <text
        x={CX} y={CY + 22}
        textAnchor="middle"
        fill={c.txt}
        fontSize="22"
        fontWeight="800"
        fontFamily="'Bebas Neue', sans-serif"
        letterSpacing="2"
      >
        315
      </text>
      <text
        x={CX} y={CY + 33}
        textAnchor="middle"
        fill={c.muted}
        fontSize="7.5"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="500"
        letterSpacing="1.5"
      >
        KM/H
      </text>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATIC DATA
   ───────────────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { Icon: LayoutGrid,    label: "Overview"  },
  { Icon: Search,        label: "Search"    },
  { Icon: Car,           label: "Garage"    },
  { Icon: Calendar,      label: "Bookings"  },
  { Icon: Heart,         label: "Favorites" },
  { Icon: MessageSquare, label: "Messages"  },
  { Icon: Settings,      label: "Settings"  },
]

const SPEC_ITEMS = [
  { Icon: Users, value: "4 Seats",      label: null           },
  { Icon: Zap,   value: "8G-DCT",       label: "Transmission" },
  { Icon: Fuel,  value: "3.0L TwinTurbo",label: "Engine"      },
  { Icon: Gauge, value: "503 HP",        label: "Power"       },
]

const HIGHLIGHTS = [
  { Icon: Wind,   title: "M-MODE",    sub: "Active aero" },
  { Icon: Music,  title: "HARMAN/K",  sub: "3D surround" },
  { Icon: Shield, title: "M CARBON",  sub: "Full kit"    },
]

const PERF_STATS = [
  { label: "0–100 km/h", value: "3.9s"     },
  { label: "Top Speed",  value: "315 km/h" },
  { label: "Torque",     value: "650 Nm"   },
]

const WEEK_DAYS = [
  { d: "MON", n: 18            },
  { d: "TUE", n: 19            },
  { d: "WED", n: 20, sel: true },
  { d: "THU", n: 21            },
  { d: "FRI", n: 22, sel: true },
  { d: "SAT", n: 23            },
  { d: "SUN", n: 24            },
]

const WHY_POINTS = [
  "Iconic M Performance Design",
  "Powerful Twin-Turbo Inline-6",
  "Luxury & Cutting-Edge Tech",
]

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT
   ───────────────────────────────────────────────────────────────────────────── */
export default function CarOverviewDashboard() {
  const [isDark,    setIsDark]    = useState(true)
  const [activeNav, setActiveNav] = useState("Overview")
  const [imgErr,    setImgErr]    = useState({})

  const c    = isDark ? DARK : LIGHT
  const card = {
    background:   c.surf,
    border:       `1px solid ${c.bdr}`,
    borderRadius: 16,
  }
  const handleImgErr = (key) => setImgErr(prev => ({ ...prev, [key]: true }))

  return (
    <>
      {/* ── FONTS + GLOBAL ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${c.bg}; overflow-x: hidden; }
        button { font-family: 'Plus Jakarta Sans', sans-serif; transition: opacity 0.15s, background 0.2s, color 0.2s, transform 0.15s; }
        button:not(:disabled):hover { opacity: 0.88; }
        img { display: block; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? "#333" : "#ccc"}; border-radius: 2px; }
      `}</style>

      {/* ── ROOT  flex row — no height lock — page scrolls naturally ───────── */}
      <div
        style={{
          display:    "flex",
          minHeight:  "100vh",
          background: c.bg,
          color:      c.txt,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: "background 0.3s, color 0.3s",
        }}
      >

        {/* ══════════════════════════════════════════════════════════════════
            SIDEBAR — sticky so it stays while content scrolls
            ════════════════════════════════════════════════════════════════ */}
        <aside
          style={{
            position:      "sticky",
            top:           0,
            height:        "100vh",
            width:         78,
            flexShrink:    0,
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            padding:       "20px 0 16px",
            background:    c.surf,
            borderRight:   `1px solid ${c.bdr}`,
            zIndex:        200,
            transition:    "background 0.3s",
          }}
        >
          {/* LUXDRIVE Logo — bigger & thicker */}
          <div
            style={{
              width:          52,
              height:         52,
              borderRadius:   "50%",
              border:         `3px solid ${c.gold}`,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          c.gold,
              fontFamily:     "'Bebas Neue', sans-serif",
              fontSize:       16,
              letterSpacing:  3,
              marginBottom:   20,
              userSelect:     "none",
              boxShadow:      `0 0 12px ${c.gold}30`,
            }}
          >
            LX
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_ITEMS.map(({ Icon, label }) => {
              const a = activeNav === label
              return (
                <button
                  key={label}
                  onClick={() => setActiveNav(label)}
                  title={label}
                  style={{
                    width:          54,
                    height:         54,
                    borderRadius:   14,
                    border:         "none",
                    cursor:         "pointer",
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            4,
                    background:     a ? c.gold : "transparent",
                    color:          a ? "#0A0A0A" : c.muted,
                    boxShadow:      a ? `0 4px 12px ${c.gold}40` : "none",
                  }}
                >
                  <Icon size={18} strokeWidth={a ? 2.5 : 1.7} />
                  <span
                    style={{
                      fontSize:   7.5,
                      fontWeight: a ? 700 : 500,
                      lineHeight: 1,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Theme toggle */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              gap:           3,
              background:    c.surf2,
              borderRadius:  24,
              padding:       4,
              border:        `1px solid ${c.bdr}`,
            }}
          >
            {[
              { Icon: Sun,  isOn: !isDark, fn: () => setIsDark(false) },
              { Icon: Moon, isOn: isDark,  fn: () => setIsDark(true)  },
            ].map(({ Icon, isOn, fn }, idx) => (
              <button
                key={idx}
                onClick={fn}
                style={{
                  width:          30,
                  height:         30,
                  borderRadius:   "50%",
                  border:         "none",
                  cursor:         "pointer",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  background:     isOn ? c.gold : "transparent",
                  color:          isOn ? "#0A0A0A" : c.muted,
                  boxShadow:      isOn ? `0 2px 8px ${c.gold}50` : "none",
                }}
              >
                <Icon size={13} />
              </button>
            ))}
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════════
            CONTENT AREA  flex:1 — scrolls naturally
            ════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            flex:          1,
            display:       "flex",
            flexDirection: "column",
            minWidth:      0,
          }}
        >

          {/* ── STICKY HEADER ──────────────────────────────────────────────── */}
          <header
            style={{
              position:       "sticky",
              top:            0,
              zIndex:         100,
              flexShrink:     0,
              height:         58,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "0 22px",
              background:     isDark ? "rgba(19,19,19,0.96)" : "rgba(255,255,255,0.96)",
              borderBottom:   `1px solid ${c.bdr}`,
              gap:            12,
              backdropFilter: "blur(12px)",
              transition:     "background 0.3s",
            }}
          >
            {/* Greeting */}
            <span
              style={{
                fontSize:   13,
                color:      c.muted,
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              Welcome back,&nbsp;
              <strong style={{ color: c.txt, fontWeight: 700 }}>John</strong>
            </span>

            {/* Segment */}
            <div
              style={{
                display:      "flex",
                background:   c.surf2,
                borderRadius: 28,
                padding:      3,
                gap:          2,
                border:       `1px solid ${c.bdr}`,
              }}
            >
              {["Rent", "Buy", "Subscribe"].map((tab) => (
                <button
                  key={tab}
                  style={{
                    padding:      "5px 18px",
                    borderRadius: 24,
                    border:       "none",
                    cursor:       "pointer",
                    background:   tab === "Rent" ? c.gold : "transparent",
                    color:        tab === "Rent" ? "#0A0A0A" : c.muted,
                    fontSize:     12,
                    fontWeight:   tab === "Rent" ? 700 : 500,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <MapPin size={13} color={c.gold} />
                <span style={{ fontSize: 12, color: c.txt, fontWeight: 600 }}>
                  Nairobi, Kenya
                </span>
                <ChevronDown size={11} color={c.muted} />
              </div>
              <div
                style={{
                  width:          34,
                  height:         34,
                  borderRadius:   "50%",
                  background:     c.surf2,
                  border:         `1px solid ${c.bdr}`,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  cursor:         "pointer",
                }}
              >
                <Bell size={15} color={c.muted} />
              </div>
              <div
                style={{
                  width:          34,
                  height:         34,
                  borderRadius:   "50%",
                  background:     c.gold,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  color:          "#0A0A0A",
                  fontWeight:     800,
                  fontSize:       12,
                  userSelect:     "none",
                  boxShadow:      `0 2px 8px ${c.gold}50`,
                }}
              >
                JG
              </div>
            </div>
          </header>

          {/* ── BODY — flex row: main + right panel ────────────────────────── */}
          <div
            style={{
              display: "flex",
              flex:    1,
              minWidth: 0,
            }}
          >

            {/* ── MAIN ───────────────────────────────────────────────────── */}
            <main
              style={{
                flex:    1,
                minWidth: 0,
                padding: "22px 20px 0",
              }}
            >

              {/* HERO — car name + subtitle + specs */}
              <div style={{ marginBottom: 20 }}>
                <h1
                  style={{
                    fontFamily:    "'Bebas Neue', sans-serif",
                    fontSize:      clamp(38, 46),
                    letterSpacing: "0.04em",
                    lineHeight:    0.95,
                    color:         c.txt,
                    marginBottom:  6,
                  }}
                >
                  BMW M4
                  <br />
                  Competition
                </h1>
                <p
                  style={{
                    fontSize:      13,
                    fontWeight:    400,
                    color:         c.muted,
                    marginBottom:  16,
                    letterSpacing: "0.01em",
                  }}
                >
                  The pinnacle of performance. Relentless precision.
                </p>

                {/* Spec chips */}
                <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                  {SPEC_ITEMS.map(({ Icon, value, label }) => (
                    <div
                      key={value}
                      style={{ display: "flex", alignItems: "center", gap: 7 }}
                    >
                      <div
                        style={{
                          width:          28,
                          height:         28,
                          borderRadius:   8,
                          background:     `${c.gold}15`,
                          border:         `1px solid ${c.gold}30`,
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                          flexShrink:     0,
                        }}
                      >
                        <Icon size={13} color={c.gold} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize:   11.5,
                            fontWeight: 700,
                            color:      c.txt,
                            lineHeight: 1.2,
                          }}
                        >
                          {value}
                        </div>
                        {label && (
                          <div
                            style={{
                              fontSize:      9.5,
                              fontWeight:    500,
                              color:         c.muted,
                              lineHeight:    1.1,
                              letterSpacing: "0.02em",
                            }}
                          >
                            {label}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── HERO CAR IMAGE ────────────────────────────────────────── */}
              <div
                style={{
                  position:     "relative",
                  width:        "100%",
                  aspectRatio:  "16 / 7",
                  borderRadius: 20,
                  overflow:     "hidden",
                  marginBottom: 16,
                  background:   isDark
                    ? "radial-gradient(ellipse at 60% 44%, #1e1e1e 0%, #0a0a0a 100%)"
                    : "radial-gradient(ellipse at 60% 44%, #e4e2da 0%, #cec9c0 100%)",
                  border:       `1px solid ${c.bdr}`,
                }}
              >
                {/* Gold accent line */}
                <div
                  style={{
                    position:   "absolute",
                    bottom:     0,
                    left:       0,
                    right:      0,
                    height:     2,
                    background: `linear-gradient(90deg, transparent, ${c.gold}90, transparent)`,
                    zIndex:     2,
                  }}
                ></div>

                {!imgErr.hero ? (
                  <img
                    src={IMGS.hero}
                    alt="BMW M4 Competition"
                    onError={() => handleImgErr("hero")}
                    style={{
                      width:      "100%",
                      height:     "100%",
                      objectFit:  "cover",
                      objectPosition: "center 40%",
                      transition: "transform 0.6s ease",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width:          "100%",
                      height:         "100%",
                      display:        "flex",
                      flexDirection:  "column",
                      alignItems:     "center",
                      justifyContent: "center",
                      gap:            8,
                    }}
                  >
                    <Car size={80} color={isDark ? "#2a2a2a" : "#c0bdb5"} strokeWidth={0.6} />
                    <span style={{ fontSize: 11, color: c.muted }}>BMW M4 Competition</span>
                  </div>
                )}

                {/* Gradient overlay — bottom fade for better text contrast */}
                <div
                  style={{
                    position:   "absolute",
                    bottom:     0,
                    left:       0,
                    right:      0,
                    height:     "35%",
                    background: isDark
                      ? "linear-gradient(to top, rgba(0,0,0,0.55), transparent)"
                      : "linear-gradient(to top, rgba(0,0,0,0.12), transparent)",
                    zIndex:     1,
                  }}
                ></div>

                {/* Badge overlaid on image */}
                <div
                  style={{
                    position:   "absolute",
                    top:        14,
                    left:       14,
                    zIndex:     3,
                    background: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.85)",
                    borderRadius: 20,
                    padding:    "4px 12px",
                    border:     `1px solid ${c.bdr}`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    style={{
                      fontSize:      10,
                      fontWeight:    700,
                      color:         c.gold,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Featured Vehicle
                  </span>
                </div>
              </div>

              {/* ── BOTTOM 2-COL: Car Highlights + Performance ────────────── */}
              <div
                style={{
                  display:             "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap:                 16,
                  marginBottom:        20,
                }}
              >

                {/* CAR HIGHLIGHTS */}
                <div
                  style={{
                    ...card,
                    padding:       16,
                    display:       "flex",
                    flexDirection: "column",
                    gap:           12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontSize:      13,
                        fontWeight:    700,
                        color:         c.txt,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Car Highlights
                    </span>
                    <span
                      style={{
                        fontSize:      10,
                        fontWeight:    600,
                        color:         c.gold,
                        cursor:        "pointer",
                        letterSpacing: "0.02em",
                      }}
                    >
                      View all
                    </span>
                  </div>

                  {/* BMW M4 overhead photo */}
                  <div
                    style={{
                      width:        "100%",
                      aspectRatio:  "4 / 3",
                      borderRadius: 12,
                      overflow:     "hidden",
                      background:   c.surf2,
                      border:       `1px solid ${c.bdr}`,
                    }}
                  >
                    {!imgErr.topDown ? (
                      <img
                        src={IMGS.topDown}
                        alt="BMW M4 Competition top view"
                        onError={() => handleImgErr("topDown")}
                        style={{
                          width:     "100%",
                          height:    "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width:          "100%",
                          height:         "100%",
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                        }}
                      >
                        <Car size={36} color={c.bdr} strokeWidth={0.8} />
                      </div>
                    )}
                  </div>

                  {/* Feature buttons */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {HIGHLIGHTS.map(({ Icon, title, sub }) => (
                      <button
                        key={title}
                        style={{
                          flex:          1,
                          padding:       "10px 4px",
                          borderRadius:  10,
                          background:    c.surf2,
                          border:        `1px solid ${c.bdr}`,
                          cursor:        "pointer",
                          display:       "flex",
                          flexDirection: "column",
                          alignItems:    "center",
                          gap:           4,
                        }}
                      >
                        <div
                          style={{
                            width:          26,
                            height:         26,
                            borderRadius:   8,
                            background:     `${c.gold}15`,
                            border:         `1px solid ${c.gold}30`,
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={12} color={c.gold} />
                        </div>
                        <span
                          style={{
                            fontSize:      8.5,
                            fontWeight:    700,
                            color:         c.txt,
                            letterSpacing: "0.04em",
                            lineHeight:    1,
                          }}
                        >
                          {title}
                        </span>
                        <span
                          style={{
                            fontSize:   7.5,
                            color:      c.muted,
                            textAlign:  "center",
                            lineHeight: 1.2,
                            fontWeight: 500,
                          }}
                        >
                          {sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PERFORMANCE */}
                <div
                  style={{
                    ...card,
                    padding:       16,
                    display:       "flex",
                    flexDirection: "column",
                    gap:           12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontSize:      13,
                        fontWeight:    700,
                        color:         c.txt,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Performance
                    </span>
                    <span
                      style={{
                        fontSize:   10,
                        fontWeight: 600,
                        color:      c.muted,
                      }}
                    >
                      Top speed
                    </span>
                  </div>

                  {/* Speedometer */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Speedometer c={c} isDark={isDark} />
                  </div>

                  {/* Stats row */}
                  <div
                    style={{
                      display:             "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap:                 4,
                      borderTop:           `1px solid ${c.bdr}`,
                      paddingTop:          12,
                    }}
                  >
                    {PERF_STATS.map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          textAlign: "center",
                          padding:   "2px 0",
                        }}
                      >
                        <div
                          style={{
                            fontSize:      14,
                            fontWeight:    800,
                            color:         c.txt,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {value}
                        </div>
                        <div
                          style={{
                            fontSize:      9,
                            fontWeight:    500,
                            color:         c.muted,
                            marginTop:     2,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    style={{
                      width:          "100%",
                      padding:        "10px 14px",
                      borderRadius:   10,
                      border:         "none",
                      cursor:         "pointer",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      background:     isDark ? "#1e1e1e" : "#0A0A0A",
                      color:          "#FFFFFF",
                      fontSize:       12,
                      fontWeight:     600,
                      letterSpacing:  "0.02em",
                    }}
                  >
                    View Full Specifications
                    <div
                      style={{
                        width:          24,
                        height:         24,
                        borderRadius:   "50%",
                        background:     c.gold,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                      }}
                    >
                      <ArrowRight size={12} color="#0A0A0A" />
                    </div>
                  </button>
                </div>
              </div>

              {/* ── FOOTER ROW: Location + Why BMW + Review ───────────────── */}
              <div
                style={{
                  display:             "grid",
                  gridTemplateColumns: "220px 1fr 1fr",
                  gap:                 16,
                  paddingBottom:       28,
                }}
              >

                {/* PICKUP LOCATION */}
                <div
                  style={{
                    ...card,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap:        12,
                    cursor:     "pointer",
                  }}
                >
                  <div
                    style={{
                      width:          42,
                      height:         42,
                      borderRadius:   12,
                      background:     `${c.gold}15`,
                      border:         `1px solid ${c.gold}30`,
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      flexShrink:     0,
                    }}
                  >
                    <MapPin size={18} color={c.gold} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize:      10,
                        fontWeight:    700,
                        color:         c.muted,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        marginBottom:  3,
                      }}
                    >
                      Pickup Location
                    </div>
                    <div
                      style={{
                        fontSize:     13,
                        fontWeight:   600,
                        color:        c.txt,
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace:   "nowrap",
                      }}
                    >
                      Westlands, Nairobi
                    </div>
                  </div>
                  <ChevronRight size={16} color={c.muted} />
                </div>

                {/* WHY BMW M4 */}
                <div
                  style={{
                    ...card,
                    padding: "14px 16px",
                    display: "flex",
                    gap:     16,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize:      11,
                        fontWeight:    700,
                        color:         c.txt,
                        marginBottom:  10,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Why BMW M4 Competition?
                    </div>
                    {WHY_POINTS.map((pt) => (
                      <div
                        key={pt}
                        style={{
                          display:      "flex",
                          alignItems:   "center",
                          gap:          8,
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            width:          15,
                            height:         15,
                            borderRadius:   "50%",
                            background:     `${c.gold}20`,
                            border:         `1px solid ${c.gold}60`,
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            flexShrink:     0,
                          }}
                        >
                          <Check size={8} color={c.gold} strokeWidth={2.5} />
                        </div>
                        <span
                          style={{
                            fontSize:   10.5,
                            fontWeight: 500,
                            color:      c.sub,
                            lineHeight: 1.3,
                          }}
                        >
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Side profile photo */}
                  <div
                    style={{
                      width:        80,
                      alignSelf:    "center",
                      aspectRatio:  "4 / 3",
                      borderRadius: 10,
                      overflow:     "hidden",
                      flexShrink:   0,
                      background:   c.surf2,
                      border:       `1px solid ${c.bdr}`,
                    }}
                  >
                    {!imgErr.sideProfile ? (
                      <img
                        src={IMGS.sideProfile}
                        alt="BMW M4 side profile"
                        onError={() => handleImgErr("sideProfile")}
                        style={{
                          width:     "100%",
                          height:    "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width:          "100%",
                          height:         "100%",
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                        }}
                      >
                        <Car size={22} color={c.bdr} strokeWidth={0.8} />
                      </div>
                    )}
                  </div>
                </div>

                {/* CUSTOMER REVIEW */}
                <div style={{ ...card, padding: "14px 16px" }}>
                  <div
                    style={{
                      display:        "flex",
                      justifyContent: "space-between",
                      alignItems:     "center",
                      marginBottom:   12,
                    }}
                  >
                    <span
                      style={{
                        fontSize:      11,
                        fontWeight:    700,
                        color:         c.txt,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Customer Review
                    </span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        style={{
                          width:          22,
                          height:         22,
                          borderRadius:   "50%",
                          border:         `1px solid ${c.bdr}`,
                          background:     "transparent",
                          cursor:         "pointer",
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                        }}
                      >
                        <ChevronLeft size={11} color={c.muted} />
                      </button>
                      <button
                        style={{
                          width:          22,
                          height:         22,
                          borderRadius:   "50%",
                          border:         `1px solid ${c.bdr}`,
                          background:     "transparent",
                          cursor:         "pointer",
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                        }}
                      >
                        <ChevronRight size={11} color={c.muted} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <div
                      style={{
                        width:          36,
                        height:         36,
                        borderRadius:   "50%",
                        background:     `linear-gradient(135deg, ${c.gold}, ${c.gold}88)`,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        color:          "#0A0A0A",
                        fontSize:       10,
                        fontWeight:     800,
                        flexShrink:     0,
                        userSelect:     "none",
                      }}
                    >
                      AN
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display:      "flex",
                          alignItems:   "center",
                          gap:          5,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{ fontSize: 12, fontWeight: 700, color: c.txt }}
                        >
                          Amani N.
                        </span>
                        <BadgeCheck size={12} color={c.gold} />
                        <div style={{ display: "flex", gap: 1.5 }}>
                          {[0,1,2,3,4].map((i) => (
                            <Star key={i} size={9} fill={c.gold} color={c.gold} />
                          ))}
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize:   10.5,
                          fontWeight: 400,
                          color:      c.sub,
                          lineHeight: 1.5,
                          margin:     0,
                        }}
                      >
                        Absolutely incredible experience. LUXDRIVE and the M4 — perfection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
            <aside
              style={{
                width:         294,
                flexShrink:    0,
                display:       "flex",
                flexDirection: "column",
                gap:           14,
                padding:       "22px 18px 28px",
                borderLeft:    `1px solid ${c.bdr}`,
                alignSelf:     "flex-start",
                position:      "sticky",
                top:           58,
                background:    c.surf,
                transition:    "background 0.3s",
              }}
            >

              {/* BOOKING CARD — always dark */}
              <div
                style={{
                  borderRadius: 18,
                  padding:      "18px 16px",
                  background:   "#0f0f0f",
                  border:       "1px solid #252525",
                }}
              >
                {/* Title */}
                <div
                  style={{
                    fontSize:      15,
                    fontWeight:    800,
                    color:         "#F4F3EE",
                    marginBottom:  3,
                    letterSpacing: "0.01em",
                  }}
                >
                  Book BMW M4
                </div>
                <div
                  style={{
                    fontSize:     11,
                    fontWeight:   500,
                    color:        "#555",
                    marginBottom: 14,
                  }}
                >
                  Pick-up &amp; Return
                </div>

                {/* Location */}
                <div
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    background:     "#181818",
                    borderRadius:   10,
                    padding:        "9px 12px",
                    marginBottom:   6,
                    border:         "1px solid #222",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <MapPin size={12} color="#eec453" />
                    <span style={{ fontSize: 11, fontWeight: 500, color: "#ccc" }}>
                      Nairobi CBD, Kenya
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize:   10,
                      fontWeight: 700,
                      color:      "#eec453",
                      cursor:     "pointer",
                    }}
                  >
                    Change
                  </span>
                </div>

                {/* Date */}
                <div
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          7,
                    background:   "#181818",
                    borderRadius: 10,
                    padding:      "9px 12px",
                    marginBottom: 16,
                    border:       "1px solid #222",
                  }}
                >
                  <Calendar size={12} color="#eec453" />
                  <span style={{ fontSize: 10.5, fontWeight: 500, color: "#888" }}>
                    20 Jul 10:00 AM – 22 Jul 10:00 AM
                  </span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#555", marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Total Price
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                    <span
                      style={{
                        fontFamily:    "'Bebas Neue', sans-serif",
                        fontSize:      30,
                        fontWeight:    900,
                        color:         "#eec453",
                        letterSpacing: "0.04em",
                      }}
                    >
                      KSh 75,000
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: "#555" }}>
                      / 3 Days
                    </span>
                  </div>
                </div>

                {/* Book Now */}
                <button
                  style={{
                    width:          "100%",
                    padding:        "13px 16px",
                    borderRadius:   12,
                    border:         "none",
                    cursor:         "pointer",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    background:     "#eec453",
                    color:          "#0A0A0A",
                    fontSize:       13,
                    fontWeight:     800,
                    letterSpacing:  "0.01em",
                    boxShadow:      "0 4px 16px rgba(238,196,83,0.35)",
                  }}
                >
                  Book Now
                  <div
                    style={{
                      width:          28,
                      height:         28,
                      borderRadius:   "50%",
                      background:     "rgba(0,0,0,0.15)",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowRight size={15} color="#0A0A0A" />
                  </div>
                </button>
              </div>

              {/* MY DATES */}
              <div style={{ ...card, padding: "16px" }}>
                <div
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    marginBottom:   6,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.txt }}>
                    My Dates
                  </span>
                  <Share2 size={13} color={c.muted} style={{ cursor: "pointer" }} />
                </div>
                <div
                  style={{
                    fontSize:      11,
                    fontWeight:    500,
                    color:         c.muted,
                    marginBottom:  12,
                  }}
                >
                  20 Jul 10:00 AM – 22 Jul 10:00 AM
                </div>

                {/* Day headers */}
                <div
                  style={{
                    display:             "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap:                 3,
                    marginBottom:        4,
                  }}
                >
                  {WEEK_DAYS.map(({ d }) => (
                    <div
                      key={d}
                      style={{
                        textAlign:     "center",
                        fontSize:      8,
                        fontWeight:    600,
                        color:         c.muted,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Date circles */}
                <div
                  style={{
                    display:             "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap:                 3,
                  }}
                >
                  {WEEK_DAYS.map(({ n, sel }) => (
                    <div
                      key={n}
                      style={{
                        height:         30,
                        borderRadius:   "50%",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        background:     sel ? c.gold : "transparent",
                        color:          sel ? "#0A0A0A" : c.sub,
                        fontSize:       12,
                        fontWeight:     sel ? 800 : 500,
                        cursor:         "pointer",
                        boxShadow:      sel ? `0 2px 8px ${c.gold}50` : "none",
                        transition:     "all 0.15s",
                      }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div style={{ ...card, padding: "16px" }}>
                <div
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    marginBottom:   12,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.txt }}>
                    Payment Method
                  </span>
                  <span
                    style={{
                      fontSize:      10.5,
                      fontWeight:    700,
                      color:         c.gold,
                      cursor:        "pointer",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Change
                  </span>
                </div>

                <div
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          12,
                    background:   c.surf2,
                    borderRadius: 10,
                    padding:      "10px 12px",
                    border:       `1px solid ${c.bdr}`,
                  }}
                >
                  <div
                    style={{
                      width:          36,
                      height:         36,
                      borderRadius:   10,
                      background:     `${c.gold}18`,
                      border:         `1px solid ${c.gold}40`,
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      flexShrink:     0,
                    }}
                  >
                    <CreditCard size={16} color={c.gold} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.txt }}>
                      M-Pesa Mobile
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: c.muted }}>
                      +254 7** *** 234
                    </div>
                  </div>
                  <ChevronDown size={14} color={c.muted} />
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

/* tiny helper — clamps a px value (no CSS clamp needed in inline styles) */
function clamp(min, max) {
  return `clamp(${min}px, 4vw, ${max}px)`
}
