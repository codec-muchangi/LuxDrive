import { useNavigate } from "react-router-dom"
import { ROUTES } from "../constants/routes"

// ─────────────────────────────────────────────────────────────────────────────
// Home — Public landing page
// Route: /
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["How It Works", "Browse Cars", "Become an Owner", "Contact"]

const STATS = [
  { value: "500+", label: "Verified Vehicles" },
  { value: "2,000+", label: "Happy Customers" },
  { value: "50+", label: "Cities Covered" },
  { value: "4.9", label: "Average Rating" },
]

const HOW_IT_WORKS = [
  { step: "01", title: "Search", desc: "Enter your location, dates and budget to find available vehicles near you." },
  { step: "02", title: "Book", desc: "Select your vehicle, review the details and send a booking request to the owner." },
  { step: "03", title: "Drive", desc: "Once confirmed and paid, pick up the vehicle and enjoy your rental." },
]

const FEATURES = [
  { title: "Budget Filtering", desc: "Find vehicles that fit exactly what you can spend per day." },
  { title: "Location Search", desc: "See vehicles on a map sorted by distance from your pickup point." },
  { title: "Verified Owners", desc: "Every vehicle owner is identity-verified before listing." },
  { title: "Secure Payments", desc: "Pay via M-Pesa or card. Funds are held safely until rental starts." },
  { title: "Live Tracking", desc: "Track your rental vehicle in real time during active trips." },
  { title: "Instant Receipts", desc: "Every transaction generates a downloadable receipt automatically." },
]

const Home = () => {
  const navigate = useNavigate()

  return (
    <div style={s.page}>

      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <div style={s.navLogo}>Smart Auto Cars</div>
        <div style={s.navLinks}>
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" style={s.navLink}>{l}</a>
          ))}
        </div>
        <div style={s.navActions}>
          <button style={s.navGhost} onClick={() => navigate(ROUTES.LOGIN)}>Sign In</button>
          <button style={s.navPrimary} onClick={() => navigate(ROUTES.REGISTER)}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>Nairobi&apos;s Trusted Vehicle Rental Platform</div>
          <h1 style={s.heroHeading}>
            Find the right car<br />at the right price
          </h1>
          <p style={s.heroSub}>
            Browse hundreds of verified rental vehicles near you. Filter by budget,
            distance and vehicle type — book in minutes.
          </p>
          <div style={s.heroActions}>
            <button style={s.btnPrimary} onClick={() => navigate(ROUTES.REGISTER)}>
              Browse Vehicles
            </button>
            <button style={s.btnOutline} onClick={() => navigate(ROUTES.LOGIN)}>
              Sign In
            </button>
          </div>
        </div>

        {/* Hero visual */}
        <div style={s.heroVisual}>
          <div style={s.heroCard}>
            <div style={s.heroCardImg}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                <rect x="9" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              </svg>
            </div>
            <div style={s.heroCardBody}>
              <div style={s.heroCardTitle}>2023 Toyota Camry</div>
              <div style={s.heroCardMeta}>Automatic · Petrol · 5 Seats</div>
              <div style={s.heroCardFooter}>
                <span style={s.heroCardPrice}>KSH 3,500<span style={s.perDay}>/day</span></span>
                <span style={s.heroCardDist}>2.4 km away</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={s.stats}>
        {STATS.map((st) => (
          <div key={st.label} style={s.statItem}>
            <div style={s.statValue}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </section>

      {/* ── How it works ── */}
      <section style={s.section}>
        <div style={s.sectionLabel}>Simple Process</div>
        <h2 style={s.sectionHeading}>How Smart Auto Cars Works</h2>
        <p style={s.sectionSub}>From search to keys in hand — three steps is all it takes.</p>
        <div style={s.howGrid}>
          {HOW_IT_WORKS.map((h) => (
            <div key={h.step} style={s.howCard}>
              <div style={s.howStep}>{h.step}</div>
              <div style={s.howTitle}>{h.title}</div>
              <div style={s.howDesc}>{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ ...s.section, background: "#EFF6FF" }}>
        <div style={s.sectionLabel}>Why Choose Us</div>
        <h2 style={s.sectionHeading}>Everything you need, nothing you don&apos;t</h2>
        <div style={s.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={s.featureCard}>
              <div style={s.featureDot} />
              <div style={s.featureTitle}>{f.title}</div>
              <div style={s.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.cta}>
        <h2 style={s.ctaHeading}>Ready to find your vehicle?</h2>
        <p style={s.ctaSub}>Join thousands of customers who rent smarter with Smart Auto Cars.</p>
        <button style={s.btnPrimary} onClick={() => navigate(ROUTES.REGISTER)}>
          Create a Free Account
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>Smart Auto Cars</div>
        <div style={s.footerLinks}>
          {["About", "Privacy Policy", "Terms", "Help Centre", "Contact"].map((l) => (
            <a key={l} href="#" style={s.footerLink}>{l}</a>
          ))}
        </div>
        <div style={s.footerCopy}>© 2026 Smart Auto Cars. All rights reserved.</div>
      </footer>

    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = {
  page: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#111827", background: "#FDFAF5" },

  // Nav
  nav: { display: "flex", alignItems: "center", padding: "0 40px", height: "64px", background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100 },
  navLogo: { fontWeight: 800, fontSize: "18px", color: "#1e3a5f", marginRight: "auto" },
  navLinks: { display: "flex", gap: "28px", marginRight: "32px" },
  navLink: { fontSize: "14px", color: "#4b5563", textDecoration: "none" },
  navActions: { display: "flex", gap: "10px" },
  navGhost: { padding: "8px 18px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "7px", fontSize: "14px", color: "#374151", cursor: "pointer" },
  navPrimary: { padding: "8px 18px", background: "#2563EB", border: "none", borderRadius: "7px", fontSize: "14px", color: "#fff", fontWeight: 600, cursor: "pointer" },

  // Hero
  hero: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "80px 40px", maxWidth: "1100px", margin: "0 auto", gap: "40px" },
  heroContent: { maxWidth: "520px" },
  heroBadge: { display: "inline-block", background: "#EFF6FF", color: "#1d4ed8", fontSize: "12.5px", fontWeight: 600, padding: "6px 14px", borderRadius: "20px", marginBottom: "20px", border: "1px solid #bfdbfe" },
  heroHeading: { fontSize: "48px", fontWeight: 800, color: "#1e3a5f", lineHeight: 1.15, marginBottom: "16px" },
  heroSub: { fontSize: "16px", color: "#4b5563", lineHeight: 1.75, marginBottom: "32px" },
  heroActions: { display: "flex", gap: "12px" },
  btnPrimary: { padding: "13px 28px", background: "#2563EB", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer" },
  btnOutline: { padding: "13px 28px", background: "transparent", color: "#2563EB", border: "2px solid #2563EB", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer" },

  // Hero card
  heroVisual: { flexShrink: 0 },
  heroCard: { width: "280px", background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb" },
  heroCardImg: { height: "160px", background: "linear-gradient(135deg,#1e3a5f,#2563EB)", display: "flex", alignItems: "center", justifyContent: "center" },
  heroCardBody: { padding: "16px" },
  heroCardTitle: { fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "4px" },
  heroCardMeta: { fontSize: "12.5px", color: "#6b7280", marginBottom: "12px" },
  heroCardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  heroCardPrice: { fontSize: "20px", fontWeight: 700, color: "#111827" },
  perDay: { fontSize: "12px", fontWeight: 400, color: "#6b7280" },
  heroCardDist: { fontSize: "12px", color: "#6b7280" },

  // Stats
  stats: { display: "flex", justifyContent: "center", gap: "0", background: "#1e3a5f", padding: "40px" },
  statItem: { flex: 1, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)", padding: "0 32px" },
  statValue: { fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "4px" },
  statLabel: { fontSize: "13.5px", color: "rgba(255,255,255,0.65)" },

  // Sections
  section: { padding: "80px 40px", textAlign: "center" },
  sectionLabel: { fontSize: "12.5px", fontWeight: 700, color: "#2563EB", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px" },
  sectionHeading: { fontSize: "34px", fontWeight: 800, color: "#1e3a5f", marginBottom: "12px" },
  sectionSub: { fontSize: "15px", color: "#6b7280", marginBottom: "48px" },

  // How it works
  howGrid: { display: "flex", gap: "24px", justifyContent: "center", maxWidth: "900px", margin: "0 auto" },
  howCard: { flex: 1, background: "#fff", borderRadius: "12px", padding: "32px 24px", border: "1px solid #e5e7eb", textAlign: "left" },
  howStep: { fontSize: "36px", fontWeight: 800, color: "#EFF6FF", marginBottom: "12px" },
  howTitle: { fontSize: "17px", fontWeight: 700, color: "#111827", marginBottom: "8px" },
  howDesc: { fontSize: "14px", color: "#6b7280", lineHeight: 1.7 },

  // Features
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", maxWidth: "960px", margin: "0 auto", textAlign: "left" },
  featureCard: { background: "#fff", borderRadius: "10px", padding: "24px", border: "1px solid #e5e7eb" },
  featureDot: { width: "8px", height: "8px", background: "#2563EB", borderRadius: "50%", marginBottom: "14px" },
  featureTitle: { fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" },
  featureDesc: { fontSize: "13.5px", color: "#6b7280", lineHeight: 1.65 },

  // CTA
  cta: { background: "#2563EB", padding: "80px 40px", textAlign: "center" },
  ctaHeading: { fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "10px" },
  ctaSub: { fontSize: "16px", color: "rgba(255,255,255,0.8)", marginBottom: "32px" },

  // Footer
  footer: { background: "#1e3a5f", padding: "40px", textAlign: "center" },
  footerLogo: { fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "20px" },
  footerLinks: { display: "flex", justifyContent: "center", gap: "28px", marginBottom: "20px" },
  footerLink: { fontSize: "13.5px", color: "rgba(255,255,255,0.6)", textDecoration: "none" },
  footerCopy: { fontSize: "12.5px", color: "rgba(255,255,255,0.4)" },
}

export default Home
