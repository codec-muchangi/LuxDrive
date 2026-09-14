 /**
  * LUXDRIVE — Car Details Dashboard
  * Route:  /cars/:id  (vehicle details + inline booking panel)
  *
  * Layout: 3-column, 100vh, overflow: hidden — zero vertical scroll
  *   ① Sidebar  74px   — logo · nav · theme toggle
  *   ② Main     flex:1 — header · hero · car image · highlights + performance · why/location/review
  *   ③ Panel    284px  — quick actions · booking card · my dates · payment method
  *
  * Design system: LUXDRIVE dark/light, Bebas Neue display, Manrope body, gold #eec453
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
   ChevronRight,
   ChevronLeft,
   ChevronDown,
   ArrowRight,
   Star,
   Zap,
   Gauge,
   Users,
   Fuel,
   CreditCard,
   Shield,
   BarChart2,
   Moon,
   Sun,
   Wind,
   Music,
   Share2,
   Sparkles,
 } from "lucide-react"
 
 /* ─────────────────────────────────────────────────────────────────────────────
    THEME TOKENS
    ───────────────────────────────────────────────────────────────────────────── */
 const DARK = {
   bg:    "#0A0A0A",
   surf:  "#141414",
   surf2: "#1e1e1e",
   bdr:   "#2a2a2a",
   gold:  "#eec453",
   txt:   "#F5F5F0",
   muted: "#777777",
   sub:   "#aaaaaa",
 }
 
 const LIGHT = {
   bg:    "#ECEAE3",
   surf:  "#FFFFFF",
   surf2: "#F2F0E8",
   bdr:   "#DDDAD0",
   gold:  "#C8860E",
   txt:   "#0A0A0A",
   muted: "#888888",
   sub:   "#555555",
 }
 
 /* ─────────────────────────────────────────────────────────────────────────────
    SPEEDOMETER  (pure SVG — no canvas, no external lib)
    ───────────────────────────────────────────────────────────────────────────── */
 function Speedometer({ c }) {
   const CX = 84
   const CY = 76
   const R  = 58
 
   const toRad = (deg) => (deg * Math.PI) / 180
 
   // arc from angle a → b (degrees)
   const arc = (a, b) => {
     const sx = CX + R * Math.cos(toRad(a))
     const sy = CY + R * Math.sin(toRad(a))
     const ex = CX + R * Math.cos(toRad(b))
     const ey = CY + R * Math.sin(toRad(b))
     const lg = ((b - a) + 360) % 360 > 180 ? 1 : 0
     return `M${sx.toFixed(2)},${sy.toFixed(2)} A${R},${R} 0 ${lg} 1 ${ex.toFixed(2)},${ey.toFixed(2)}`
   }
 
   const START = -210
   const END   = 30
   const VAL   = 290
   const MAX   = 380
   const valDeg = START + (VAL / MAX) * (END - START)
 
   // 9 tick marks along the arc
   const ticks = Array.from({ length: 9 }, (_, i) => {
     const d  = START + (i / 8) * (END - START)
     const ri = R - 8
     return {
       x1: (CX + R  * Math.cos(toRad(d))).toFixed(2),
       y1: (CY + R  * Math.sin(toRad(d))).toFixed(2),
       x2: (CX + ri * Math.cos(toRad(d))).toFixed(2),
       y2: (CY + ri * Math.sin(toRad(d))).toFixed(2),
     }
   })
 
   const nx = (CX + (R - 14) * Math.cos(toRad(valDeg))).toFixed(2)
   const ny = (CY + (R - 14) * Math.sin(toRad(valDeg))).toFixed(2)
 
   return (
     <svg viewBox="0 0 168 100" style={{ width: "100%" }}>
       {/* Track */}
       <path
         d={arc(START, END)}
         fill="none"
         stroke={c.bdr}
         strokeWidth="5"
         strokeLinecap="round"
       />
       {/* Active fill */}
       <path
         d={arc(START, valDeg)}
         fill="none"
         stroke={c.gold}
         strokeWidth="5"
         strokeLinecap="round"
       />
       {/* Tick marks */}
       {ticks.map((t, i) => (
         <line
           key={i}
           x1={t.x1} y1={t.y1}
           x2={t.x2} y2={t.y2}
           stroke={c.bdr}
           strokeWidth="1.5"
           strokeLinecap="round"
         />
       ))}
       {/* Needle */}
       <line
         x1={CX} y1={CY}
         x2={nx}  y2={ny}
         stroke={c.gold}
         strokeWidth="2"
         strokeLinecap="round"
       />
       {/* Pivot */}
       <circle cx={CX} cy={CY} r="4.5" fill={c.gold} />
       <circle cx={CX} cy={CY} r="2"   fill={c.surf} />
       {/* Value label */}
       <text
         x={CX} y={CY + 17}
         textAnchor="middle"
         fill={c.txt}
         fontSize="17"
         fontWeight="900"
         fontFamily="'Bebas Neue', sans-serif"
         letterSpacing="1"
       >
         290
       </text>
       <text
         x={CX} y={CY + 27}
         textAnchor="middle"
         fill={c.muted}
         fontSize="6.5"
         fontFamily="'Manrope', sans-serif"
       >
         km/h
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
 
 const SPEC_CHIPS = [
   { Icon: Users, label: "4 Seats"        },
   { Icon: Zap,   label: "8-Spd Auto"    },
   { Icon: Fuel,  label: "3.0L TwinTurbo"},
   { Icon: Gauge, label: "503 HP"        },
 ]
 
 const HIGHLIGHT_BTNS = [
   { Icon: Wind,   label: "M-Mode"   },
   { Icon: Music,  label: "Harman/K" },
   { Icon: Shield, label: "M-Safety" },
 ]
 
 const PERF_STATS = [
   { label: "0-100 km/h", value: "3.9s"     },
   { label: "Top Speed",  value: "290 km/h" },
   { label: "Torque",     value: "650 Nm"   },
 ]
 
 const WHY_POINTS = [
   "M Twin-Turbo Inline-6 Engine",
   "Adaptive M Suspension Pro",
   "Luxury & Track-Ready Interior",
 ]
 
 const QUICK_ACTIONS = [
   { Icon: Car,        title: "Book a Car",  sub: "Select & book"     },
   { Icon: BarChart2,  title: "Compare",     sub: "Cars & features"   },
   { Icon: Shield,     title: "Insurance",   sub: "Protect your drive"},
   { Icon: CreditCard, title: "Payment",     sub: "Secure checkout"   },
 ]
 
 const WEEK_DAYS = [
   { d: "MON", n: 13            },
   { d: "TUE", n: 14            },
   { d: "WED", n: 15, active: true },
   { d: "THU", n: 16            },
   { d: "FRI", n: 17            },
   { d: "SAT", n: 18, active: true },
   { d: "SUN", n: 19            },
 ]
 
 /* ─────────────────────────────────────────────────────────────────────────────
    ROOT COMPONENT
    ───────────────────────────────────────────────────────────────────────────── */
 export default function CarDetailsDashboard() {
   const [isDark, setIsDark]     = useState(true)
   const [activeNav, setActiveNav] = useState("Overview")
 
   const c = isDark ? DARK : LIGHT
 
   // shared card style
   const card = {
     background:   c.surf,
     border:       `1px solid ${c.bdr}`,
     borderRadius: 14,
   }
 
   return (
     <>
       {/* Google Fonts + global reset */}
       <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
         body { overflow: hidden; }
         button { transition: opacity 0.15s, background 0.2s, color 0.2s; }
         button:hover { opacity: 0.88; }
       `}</style>
 
       {/* ── ROOT FLEX CONTAINER ────────────────────────────────────────────── */}
       <div
         style={{
           display:    "flex",
           width:      "100vw",
           height:     "100vh",
           background: c.bg,
           color:      c.txt,
           fontFamily: "'Manrope', sans-serif",
           overflow:   "hidden",
           transition: "background 0.3s, color 0.3s",
         }}
       >
 
         {/* ════════════════════════════════════════════════════════════════════
             ①  LEFT SIDEBAR
             ════════════════════════════════════════════════════════════════════ */}
         <aside
           style={{
             width:          74,
             flexShrink:     0,
             display:        "flex",
             flexDirection:  "column",
             alignItems:     "center",
             padding:        "18px 0 14px",
             background:     c.surf,
             borderRight:    `1px solid ${c.bdr}`,
             transition:     "background 0.3s",
           }}
         >
           {/* Logo mark */}
           <div
             style={{
               width:        40,
               height:       40,
               borderRadius: "50%",
               border:       `2.5px solid ${c.gold}`,
               display:      "flex",
               alignItems:   "center",
               justifyContent: "center",
               color:        c.gold,
               fontFamily:   "'Bebas Neue', sans-serif",
               fontSize:     14,
               letterSpacing: 2,
               marginBottom: 18,
               userSelect:   "none",
             }}
           >
             LX
           </div>
 
           {/* Navigation */}
           <nav
             style={{
               flex:          1,
               display:       "flex",
               flexDirection: "column",
               gap:           2,
             }}
           >
             {NAV_ITEMS.map(({ Icon, label }) => {
               const isActive = activeNav === label
               return (
                 <button
                   key={label}
                   onClick={() => setActiveNav(label)}
                   title={label}
                   style={{
                     width:          50,
                     height:         50,
                     borderRadius:   12,
                     border:         "none",
                     cursor:         "pointer",
                     display:        "flex",
                     flexDirection:  "column",
                     alignItems:     "center",
                     justifyContent: "center",
                     gap:            3,
                     background:     isActive ? c.gold : "transparent",
                     color:          isActive ? "#0A0A0A" : c.muted,
                   }}
                 >
                   <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
                   <span
                     style={{
                       fontSize:   7.5,
                       fontWeight: isActive ? 700 : 400,
                       lineHeight: 1,
                     }}
                   >
                     {label}
                   </span>
                 </button>
               )
             })}
           </nav>
 
           {/* Dark / Light toggle */}
           <div
             style={{
               display:       "flex",
               flexDirection: "column",
               gap:           3,
               background:    c.surf2,
               borderRadius:  22,
               padding:       3,
               border:        `1px solid ${c.bdr}`,
             }}
           >
             {[
               { Icon: Sun,  isOn: !isDark, onClick: () => setIsDark(false) },
               { Icon: Moon, isOn: isDark,  onClick: () => setIsDark(true)  },
             ].map(({ Icon, isOn, onClick }, idx) => (
               <button
                 key={idx}
                 onClick={onClick}
                 style={{
                   width:          28,
                   height:         28,
                   borderRadius:   "50%",
                   border:         "none",
                   cursor:         "pointer",
                   display:        "flex",
                   alignItems:     "center",
                   justifyContent: "center",
                   background:     isOn ? c.gold : "transparent",
                   color:          isOn ? "#0A0A0A" : c.muted,
                 }}
               >
                 <Icon size={12} />
               </button>
             ))}
           </div>
         </aside>
 
         {/* ════════════════════════════════════════════════════════════════════
             ②  MAIN CONTENT
             ════════════════════════════════════════════════════════════════════ */}
         <main
           style={{
             flex:          1,
             display:       "flex",
             flexDirection: "column",
             overflow:      "hidden",
             minWidth:      0,
           }}
         >
 
           {/* ── HEADER ──────────────────────────────────────────────────── */}
           <header
             style={{
               flexShrink:     0,
               height:         54,
               display:        "flex",
               alignItems:     "center",
               justifyContent: "space-between",
               padding:        "0 20px",
               background:     c.surf,
               borderBottom:   `1px solid ${c.bdr}`,
               transition:     "background 0.3s",
             }}
           >
             {/* Welcome */}
             <span style={{ fontSize: 13, color: c.muted }}>
               Welcome back,&nbsp;
               <strong style={{ color: c.txt, fontWeight: 700 }}>John</strong>
               &nbsp;👋
             </span>
 
             {/* Segment control */}
             <div
               style={{
                 display:      "flex",
                 background:   c.surf2,
                 borderRadius: 24,
                 padding:      3,
                 gap:          2,
               }}
             >
               {["Rent", "Buy", "Subscribe"].map((tab) => (
                 <button
                   key={tab}
                   style={{
                     padding:      "5px 15px",
                     borderRadius: 20,
                     border:       "none",
                     cursor:       "pointer",
                     background:   tab === "Rent" ? c.gold : "transparent",
                     color:        tab === "Rent" ? "#0A0A0A" : c.muted,
                     fontSize:     12,
                     fontWeight:   tab === "Rent" ? 700 : 500,
                     fontFamily:   "'Manrope', sans-serif",
                   }}
                 >
                   {tab}
                 </button>
               ))}
             </div>
 
             {/* Location + Bell + Avatar */}
             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
               <div
                 style={{
                   display:    "flex",
                   alignItems: "center",
                   gap:        4,
                   cursor:     "pointer",
                 }}
               >
                 <MapPin size={13} color={c.gold} />
                 <span style={{ fontSize: 12, color: c.txt, fontWeight: 500 }}>
                   Nairobi, Kenya
                 </span>
                 <ChevronDown size={11} color={c.muted} />
               </div>
 
               <div
                 style={{
                   width:          32,
                   height:         32,
                   borderRadius:   "50%",
                   background:     c.surf2,
                   border:         `1px solid ${c.bdr}`,
                   display:        "flex",
                   alignItems:     "center",
                   justifyContent: "center",
                   cursor:         "pointer",
                 }}
               >
                 <Bell size={14} color={c.muted} />
               </div>
 
               <div
                 style={{
                   width:          32,
                   height:         32,
                   borderRadius:   "50%",
                   background:     c.gold,
                   display:        "flex",
                   alignItems:     "center",
                   justifyContent: "center",
                   color:          "#0A0A0A",
                   fontWeight:     800,
                   fontSize:       12,
                   userSelect:     "none",
                 }}
               >
                 JG
               </div>
             </div>
           </header>
 
           {/* ── BODY ────────────────────────────────────────────────────── */}
           <div
             style={{
               flex:          1,
               display:       "flex",
               flexDirection: "column",
               overflow:      "hidden",
               padding:       "14px 18px",
               gap:           10,
             }}
           >
 
             {/* Hero text row */}
             <div style={{ flexShrink: 0 }}>
               <h1
                 style={{
                   fontFamily:    "'Bebas Neue', sans-serif",
                   fontSize:      32,
                   letterSpacing: "0.03em",
                   lineHeight:    1.05,
                   color:         c.txt,
                   marginBottom:  4,
                 }}
               >
                 BMW M4 Competition
               </h1>
               <p style={{ fontSize: 12, color: c.muted, marginBottom: 8 }}>
                 The pinnacle of performance. Relentless precision.
               </p>
               <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                 {SPEC_CHIPS.map(({ Icon, label }) => (
                   <div
                     key={label}
                     style={{
                       display:    "flex",
                       alignItems: "center",
                       gap:        5,
                       fontSize:   11,
                       color:      c.sub,
                     }}
                   >
                     <Icon size={12} color={c.gold} />
                     {label}
                   </div>
                 ))}
               </div>
             </div>
 
             {/* Content flex row: left col + right mini col */}
             <div
               style={{
                 flex:      1,
                 display:   "flex",
                 gap:       12,
                 overflow:  "hidden",
                 minHeight: 0,
               }}
             >
 
               {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
               <div
                 style={{
                   flex:          1,
                   display:       "flex",
                   flexDirection: "column",
                   gap:           10,
                   overflow:      "hidden",
                   minWidth:      0,
                 }}
               >
 
                 {/* Vehicle image */}
                 <div
                   style={{
                     flex:           2,
                     ...card,
                     display:        "flex",
                     alignItems:     "center",
                     justifyContent: "center",
                     position:       "relative",
                     overflow:       "hidden",
                     background:     isDark
                       ? "radial-gradient(ellipse at 58% 44%, #222222 0%, #0d0d0d 100%)"
                       : "radial-gradient(ellipse at 58% 44%, #e2e0d8 0%, #ceccc4 100%)",
                   }}
                 >
                   {/* Gold accent line at bottom */}
                   <div
                     style={{
                       position:   "absolute",
                       bottom:     0,
                       left:       0,
                       right:      0,
                       height:     2,
                       background: `linear-gradient(90deg, transparent, ${c.gold}80, transparent)`,
                     }}
                   />
                   <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                     <Car
                       size={80}
                       color={isDark ? "#2e2e2e" : "#c0bdb5"}
                       strokeWidth={0.7}
                       style={{ display: "block", margin: "0 auto 8px" }}
                     />
                     <span
                       style={{
                         fontSize:    11,
                         color:       c.muted,
                         display:     "block",
                         marginBottom: 4,
                       }}
                     >
                       BMW M4 Competition
                     </span>
                     <span
                       style={{
                         fontSize:    10,
                         color:       c.gold,
                         fontWeight:  600,
                         letterSpacing: "0.08em",
                         textTransform: "uppercase",
                       }}
                     >
                       [ Vehicle Image ]
                     </span>
                   </div>
                 </div>
 
                 {/* Bottom 2-col grid */}
                 <div
                   style={{
                     flex:                1,
                     display:             "grid",
                     gridTemplateColumns: "1fr 1fr",
                     gap:                 10,
                     overflow:            "hidden",
                     minHeight:           0,
                   }}
                 >
 
                   {/* Car Highlights */}
                   <div
                     style={{
                       ...card,
                       padding:       12,
                       display:       "flex",
                       flexDirection: "column",
                       gap:           8,
                       overflow:      "hidden",
                     }}
                   >
                     <span
                       style={{
                         fontSize:   11,
                         fontWeight: 700,
                         color:      c.txt,
                         flexShrink: 0,
                       }}
                     >
                       Car Highlights
                     </span>
 
                     {/* Top-down car view placeholder */}
                     <div
                       style={{
                         flex:           1,
                         background:     c.surf2,
                         borderRadius:   8,
                         border:         `1px solid ${c.bdr}`,
                         display:        "flex",
                         alignItems:     "center",
                         justifyContent: "center",
                         overflow:       "hidden",
                       }}
                     >
                       <Car
                         size={30}
                         color={c.bdr}
                         strokeWidth={0.9}
                       />
                     </div>
 
                     {/* Feature buttons */}
                     <div
                       style={{
                         display:    "flex",
                         gap:        5,
                         flexShrink: 0,
                       }}
                     >
                       {HIGHLIGHT_BTNS.map(({ Icon, label }) => (
                         <button
                           key={label}
                           style={{
                             flex:          1,
                             padding:       "6px 2px",
                             borderRadius:  7,
                             background:    c.surf2,
                             border:        `1px solid ${c.bdr}`,
                             cursor:        "pointer",
                             display:       "flex",
                             flexDirection: "column",
                             alignItems:    "center",
                             gap:           3,
                           }}
                         >
                           <Icon size={11} color={c.gold} />
                           <span
                             style={{
                               fontSize:   7.5,
                               color:      c.sub,
                               fontFamily: "'Manrope', sans-serif",
                               lineHeight: 1,
                             }}
                           >
                             {label}
                           </span>
                         </button>
                       ))}
                     </div>
                   </div>
 
                   {/* Performance */}
                   <div
                     style={{
                       ...card,
                       padding:       12,
                       display:       "flex",
                       flexDirection: "column",
                       gap:           6,
                       overflow:      "hidden",
                     }}
                   >
                     <span
                       style={{
                         fontSize:   11,
                         fontWeight: 700,
                         color:      c.txt,
                         flexShrink: 0,
                       }}
                     >
                       Performance
                     </span>
 
                     {/* Speedometer */}
                     <div
                       style={{
                         flex:           1,
                         display:        "flex",
                         alignItems:     "center",
                         justifyContent: "center",
                         overflow:       "hidden",
                       }}
                     >
                       <Speedometer c={c} />
                     </div>
 
                     {/* Stats row */}
                     <div
                       style={{
                         display:             "grid",
                         gridTemplateColumns: "1fr 1fr 1fr",
                         gap:                 4,
                         flexShrink:          0,
                       }}
                     >
                       {PERF_STATS.map(({ label, value }) => (
                         <div key={label} style={{ textAlign: "center" }}>
                           <div
                             style={{
                               fontSize:   11,
                               fontWeight: 800,
                               color:      c.txt,
                             }}
                           >
                             {value}
                           </div>
                           <div
                             style={{
                               fontSize:   7.5,
                               color:      c.muted,
                               marginTop:  1,
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
                         padding:        "8px 10px",
                         borderRadius:   8,
                         border:         "none",
                         cursor:         "pointer",
                         flexShrink:     0,
                         display:        "flex",
                         alignItems:     "center",
                         justifyContent: "space-between",
                         background:     c.gold,
                         color:          "#0A0A0A",
                         fontSize:       11,
                         fontWeight:     700,
                         fontFamily:     "'Manrope', sans-serif",
                       }}
                     >
                       View Full Specifications
                       <ArrowRight size={12} />
                     </button>
                   </div>
                 </div>
               </div>
 
               {/* ── RIGHT MINI COLUMN ────────────────────────────────────── */}
               <div
                 style={{
                   width:         208,
                   flexShrink:    0,
                   display:       "flex",
                   flexDirection: "column",
                   gap:           10,
                   overflow:      "hidden",
                 }}
               >
 
                 {/* Why BMW M4 */}
                 <div
                   style={{
                     ...card,
                     padding:       12,
                     flex:          1,
                     display:       "flex",
                     flexDirection: "column",
                     overflow:      "hidden",
                   }}
                 >
                   <span
                     style={{
                       fontSize:     11,
                       fontWeight:   700,
                       color:        c.txt,
                       marginBottom: 10,
                       flexShrink:   0,
                     }}
                   >
                     Why BMW M4 Competition?
                   </span>
 
                   {WHY_POINTS.map((pt) => (
                     <div
                       key={pt}
                       style={{
                         display:      "flex",
                         gap:          7,
                         marginBottom: 8,
                         flexShrink:   0,
                       }}
                     >
                       <div
                         style={{
                           width:          14,
                           height:         14,
                           borderRadius:   "50%",
                           flexShrink:     0,
                           marginTop:      1,
                           background:     `${c.gold}18`,
                           border:         `1px solid ${c.gold}55`,
                           display:        "flex",
                           alignItems:     "center",
                           justifyContent: "center",
                         }}
                       >
                         <span
                           style={{
                             fontSize:   8,
                             color:      c.gold,
                             fontWeight: 700,
                             lineHeight: 1,
                           }}
                         >
                           ✓
                         </span>
                       </div>
                       <span
                         style={{
                           fontSize:   10,
                           color:      c.sub,
                           lineHeight: 1.4,
                         }}
                       >
                         {pt}
                       </span>
                     </div>
                   ))}
 
                   {/* Side-profile placeholder */}
                   <div
                     style={{
                       flex:           1,
                       background:     c.surf2,
                       borderRadius:   8,
                       border:         `1px solid ${c.bdr}`,
                       display:        "flex",
                       alignItems:     "center",
                       justifyContent: "center",
                       overflow:       "hidden",
                     }}
                   >
                     <Car size={26} color={c.bdr} strokeWidth={0.9} />
                   </div>
                 </div>
 
                 {/* Pickup Location */}
                 <div
                   style={{
                     ...card,
                     padding:    10,
                     flexShrink: 0,
                     display:    "flex",
                     alignItems: "center",
                     gap:        8,
                     cursor:     "pointer",
                   }}
                 >
                   <div
                     style={{
                       width:          30,
                       height:         30,
                       borderRadius:   7,
                       background:     c.surf2,
                       border:         `1px solid ${c.bdr}`,
                       display:        "flex",
                       alignItems:     "center",
                       justifyContent: "center",
                       flexShrink:     0,
                     }}
                   >
                     <MapPin size={13} color={c.gold} />
                   </div>
                   <div style={{ flex: 1, minWidth: 0 }}>
                     <div
                       style={{
                         fontSize:   11,
                         fontWeight: 700,
                         color:      c.txt,
                       }}
                     >
                       Pickup Location
                     </div>
                     <div
                       style={{
                         fontSize:     9.5,
                         color:        c.muted,
                         overflow:     "hidden",
                         textOverflow: "ellipsis",
                         whiteSpace:   "nowrap",
                       }}
                     >
                       Westlands, Nairobi
                     </div>
                   </div>
                   <ChevronRight size={13} color={c.muted} />
                 </div>
 
                 {/* Customer Review */}
                 <div
                   style={{
                     ...card,
                     padding:    12,
                     flexShrink: 0,
                   }}
                 >
                   <div
                     style={{
                       display:        "flex",
                       justifyContent: "space-between",
                       alignItems:     "center",
                       marginBottom:   10,
                     }}
                   >
                     <span
                       style={{
                         fontSize:   11,
                         fontWeight: 700,
                         color:      c.txt,
                       }}
                     >
                       Customer Review
                     </span>
                     <div style={{ display: "flex", gap: 4 }}>
                       <ChevronLeft
                         size={12}
                         color={c.muted}
                         style={{ cursor: "pointer" }}
                       />
                       <ChevronRight
                         size={12}
                         color={c.muted}
                         style={{ cursor: "pointer" }}
                       />
                     </div>
                   </div>
 
                   <div style={{ display: "flex", gap: 8 }}>
                     <div
                       style={{
                         width:          28,
                         height:         28,
                         borderRadius:   "50%",
                         flexShrink:     0,
                         background:     c.gold,
                         display:        "flex",
                         alignItems:     "center",
                         justifyContent: "center",
                         color:          "#0A0A0A",
                         fontSize:       9,
                         fontWeight:     800,
                         userSelect:     "none",
                       }}
                     >
                       AN
                     </div>
                     <div>
                       <div
                         style={{
                           display:      "flex",
                           alignItems:   "center",
                           gap:          5,
                           marginBottom: 4,
                         }}
                       >
                         <span
                           style={{
                             fontSize:   11,
                             fontWeight: 700,
                             color:      c.txt,
                           }}
                         >
                           Amani N.
                         </span>
                         <div style={{ display: "flex" }}>
                           {[0, 1, 2, 3, 4].map((i) => (
                             <Star
                               key={i}
                               size={8}
                               fill={c.gold}
                               color={c.gold}
                             />
                           ))}
                         </div>
                       </div>
                       <p
                         style={{
                           fontSize:   10,
                           color:      c.sub,
                           lineHeight: 1.45,
                           margin:     0,
                         }}
                       >
                         LUXDRIVE made it seamless. The M4 is an absolute dream.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           {/* closes body wrapper ↑ */}
         </div>
         </main>
 
         {/* ════════════════════════════════════════════════════════════════════
             ③  RIGHT BOOKING PANEL
             ════════════════════════════════════════════════════════════════════ */}
         <aside
           style={{
             width:         284,
             flexShrink:    0,
             display:       "flex",
             flexDirection: "column",
             gap:           10,
             padding:       "14px",
             background:    c.surf,
             borderLeft:    `1px solid ${c.bdr}`,
             overflow:      "hidden",
             transition:    "background 0.3s",
           }}
         >
 
           {/* Quick Actions */}
           <div style={{ ...card, padding: 12, flexShrink: 0 }}>
             <div
               style={{
                 display:        "flex",
                 justifyContent: "space-between",
                 alignItems:     "flex-start",
                 marginBottom:   10,
               }}
             >
               <div>
                 <p
                   style={{
                     margin:     0,
                     fontSize:   12,
                     fontWeight: 700,
                     color:      c.txt,
                   }}
                 >
                   Quick Actions
                 </p>
                 <p style={{ margin: 0, fontSize: 9.5, color: c.muted }}>
                   What would you like to do?
                 </p>
               </div>
               <Sparkles size={14} color={c.gold} />
             </div>
 
             <div
               style={{
                 display:             "grid",
                 gridTemplateColumns: "1fr 1fr",
                 gap:                 7,
               }}
             >
               {QUICK_ACTIONS.map(({ Icon, title, sub }) => (
                 <button
                   key={title}
                   style={{
                     background:   c.surf2,
                     border:       `1px solid ${c.bdr}`,
                     borderRadius: 9,
                     padding:      "9px 8px",
                     cursor:       "pointer",
                     textAlign:    "left",
                   }}
                 >
                   <Icon
                     size={13}
                     color={c.gold}
                     style={{ display: "block", marginBottom: 5 }}
                   />
                   <div
                     style={{
                       fontSize:   11,
                       fontWeight: 700,
                       color:      c.txt,
                     }}
                   >
                     {title}
                   </div>
                   <div style={{ fontSize: 8.5, color: c.muted }}>{sub}</div>
                 </button>
               ))}
             </div>
           </div>
 
           {/* Booking Card — always dark for premium contrast */}
           <div
             style={{
               borderRadius: 14,
               padding:      "14px",
               background:   "#111111",
               border:       "1px solid #282828",
               flexShrink:   0,
             }}
           >
             <p
               style={{
                 margin:     "0 0 2px",
                 fontSize:   13,
                 fontWeight: 800,
                 color:      "#F5F5F0",
                 fontFamily: "'Manrope', sans-serif",
               }}
             >
               Book BMW M4
             </p>
             <p style={{ margin: "0 0 10px", fontSize: 9.5, color: "#666666" }}>
               Pickup &amp; Return
             </p>
 
             {/* Location row */}
             <div
               style={{
                 display:        "flex",
                 alignItems:     "center",
                 justifyContent: "space-between",
                 background:     "#1a1a1a",
                 borderRadius:   7,
                 padding:        "8px 10px",
                 marginBottom:   5,
               }}
             >
               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                 <MapPin size={11} color={DARK.gold} />
                 <span style={{ fontSize: 10, color: "#bbbbbb" }}>
                   Nairobi CBD, Kenya
                 </span>
               </div>
               <span
                 style={{
                   fontSize:   9,
                   color:      DARK.gold,
                   cursor:     "pointer",
                   fontWeight: 600,
                 }}
               >
                 Change
               </span>
             </div>
 
             {/* Date row */}
             <div
               style={{
                 display:       "flex",
                 alignItems:    "center",
                 gap:           6,
                 background:    "#1a1a1a",
                 borderRadius:  7,
                 padding:       "8px 10px",
                 marginBottom:  12,
               }}
             >
               <Calendar size={11} color={DARK.gold} />
               <span style={{ fontSize: 9.5, color: "#999999" }}>
                 15 Aug 10:00 AM – 18 Aug 10:00 AM
               </span>
             </div>
 
             {/* Price */}
             <div style={{ marginBottom: 12 }}>
               <div
                 style={{ fontSize: 9, color: "#666666", marginBottom: 2 }}
               >
                 Total Price
               </div>
               <div
                 style={{
                   display:    "flex",
                   alignItems: "baseline",
                   gap:        6,
                 }}
               >
                 <span
                   style={{
                     fontFamily:    "'Bebas Neue', sans-serif",
                     fontSize:      24,
                     fontWeight:    900,
                     color:         DARK.gold,
                     letterSpacing: "0.03em",
                   }}
                 >
                   KSh 75,000
                 </span>
                 <span style={{ fontSize: 10.5, color: "#666666" }}>
                   / 3 Days
                 </span>
               </div>
             </div>
 
             {/* Book Now CTA */}
             <button
               style={{
                 width:          "100%",
                 padding:        "11px 14px",
                 borderRadius:   9,
                 border:         "none",
                 cursor:         "pointer",
                 display:        "flex",
                 alignItems:     "center",
                 justifyContent: "space-between",
                 background:     DARK.gold,
                 color:          "#0A0A0A",
                 fontSize:       12,
                 fontWeight:     800,
                 fontFamily:     "'Manrope', sans-serif",
               }}
             >
               Book Now
               <ArrowRight size={15} />
             </button>
           </div>
 
           {/* My Dates */}
           <div style={{ ...card, padding: 12, flexShrink: 0 }}>
             <div
               style={{
                 display:        "flex",
                 justifyContent: "space-between",
                 alignItems:     "center",
                 marginBottom:   4,
               }}
             >
               <span
                 style={{
                   fontSize:   11,
                   fontWeight: 700,
                   color:      c.txt,
                 }}
               >
                 My Dates
               </span>
               <Share2
                 size={11}
                 color={c.muted}
                 style={{ cursor: "pointer" }}
               />
             </div>
             <p
               style={{
                 margin:    "0 0 8px",
                 fontSize:  9.5,
                 color:     c.muted,
               }}
             >
               15 Aug 10:00 AM – 18 Aug 10:00 AM
             </p>
 
             <div
               style={{
                 display:             "grid",
                 gridTemplateColumns: "repeat(7, 1fr)",
                 gap:                 2,
               }}
             >
               {WEEK_DAYS.map(({ d, n, active }) => (
                 <div key={n} style={{ textAlign: "center" }}>
                   <div
                     style={{
                       fontSize:     7.5,
                       color:        c.muted,
                       marginBottom: 3,
                     }}
                   >
                     {d}
                   </div>
                   <div
                     style={{
                       width:          24,
                       height:         24,
                       borderRadius:   "50%",
                       margin:         "0 auto",
                       display:        "flex",
                       alignItems:     "center",
                       justifyContent: "center",
                       background:     active ? c.gold : "transparent",
                       color:          active ? "#0A0A0A" : c.sub,
                       fontSize:       10.5,
                       fontWeight:     active ? 800 : 400,
                       cursor:         "pointer",
                     }}
                   >
                     {n}
                   </div>
                 </div>
               ))}
             </div>
           </div>
 
           {/* Payment Method */}
           <div style={{ ...card, padding: 12, flexShrink: 0 }}>
             <div
               style={{
                 display:        "flex",
                 justifyContent: "space-between",
                 alignItems:     "center",
                 marginBottom:   10,
               }}
             >
               <span
                 style={{
                   fontSize:   11,
                   fontWeight: 700,
                   color:      c.txt,
                 }}
               >
                 Payment Method
               </span>
               <span
                 style={{
                   fontSize:   9.5,
                   color:      c.gold,
                   cursor:     "pointer",
                   fontWeight: 600,
                 }}
               >
                 Change
               </span>
             </div>
 
             <div
               style={{
                 display:      "flex",
                 alignItems:   "center",
                 gap:          10,
                 background:   c.surf2,
                 borderRadius: 8,
                 padding:      "8px 10px",
                 border:       `1px solid ${c.bdr}`,
               }}
             >
               <div
                 style={{
                   width:          30,
                   height:         30,
                   borderRadius:   7,
                   background:     `${c.gold}18`,
                   border:         `1px solid ${c.gold}40`,
                   display:        "flex",
                   alignItems:     "center",
                   justifyContent: "center",
                   flexShrink:     0,
                 }}
               >
                 <CreditCard size={14} color={c.gold} />
               </div>
               <div style={{ flex: 1 }}>
                 <div
                   style={{
                     fontSize:   11,
                     fontWeight: 600,
                     color:      c.txt,
                   }}
                 >
                   M-Pesa Mobile
                 </div>
                 <div style={{ fontSize: 9, color: c.muted }}>
                   +254 7** *** 234
                 </div>
               </div>
               <ChevronDown size={13} color={c.muted} />
             </div>
           </div>
 
         </aside>
       </div>
     </>
   )
 }
  