import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// CarOverviewDashboard Page
// Detailed view of a single vehicle — shown to customers before booking.
// Displays specs, pricing, availability and booking action.
// Route: /cars/:id
// TODO: Replace placeholder data with GET /api/v1/vehicles/:id
// ─────────────────────────────────────────────────────────────────────────────

// Placeholder vehicle data — replace with API response
const PLACEHOLDER_CAR = {
  id: 1,
  make: "Toyota",
  model: "Camry",
  year: 2022,
  colour: "Pearl White",
  transmission: "Automatic",
  fuel: "Petrol",
  seats: 5,
  mileage: "45,000 km",
  dailyPrice: 3500,
  hourlyPrice: 500,
  distance: "2.4 km",
  rating: 4.8,
  reviewCount: 24,
  description:
    "Well-maintained Toyota Camry in excellent condition. Perfect for business travel, airport transfers, and family trips around Nairobi. Full AC, Bluetooth, and spacious boot.",
  owner: { name: "James Mwangi", rating: 4.9, verified: true, responseTime: "Under 1 hour" },
  features: ["Air Conditioning", "Bluetooth Audio", "Backup Camera", "USB Charging", "Spare Tyre", "First Aid Kit"],
  specs: [
    { label: "Year", value: "2022" },
    { label: "Engine", value: "2.5L 4-Cylinder" },
    { label: "Transmission", value: "Automatic" },
    { label: "Fuel", value: "Petrol" },
    { label: "Colour", value: "Pearl White" },
    { label: "Seats", value: "5 Passengers" },
    { label: "Mileage", value: "45,000 km" },
    { label: "Insurance", value: "Comprehensive" },
  ],
};

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CarOverviewDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const car = PLACEHOLDER_CAR; // TODO: fetch by id from API

  const [activeTab, setActiveTab] = useState("overview");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calculate rental days and total cost
  const days =
    startDate && endDate
      ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
      : 0;
  const total = days * car.dailyPrice;

  const tabs = ["overview", "specs", "features", "reviews"];

  return (
    <div style={styles.page}>

      {/* ── Header ── */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate("/cars")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Cars
        </button>
        <div style={styles.carTitle}>{car.year} {car.make} {car.model}</div>
        <div style={styles.ratingBadge}>
          <StarIcon /> {car.rating} ({car.reviewCount} reviews)
        </div>
      </div>

      <div style={styles.layout}>

        {/* ── Left column ── */}
        <div style={styles.leftCol}>

          {/* Image placeholder */}
          <div style={styles.imagePlaceholder}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            </svg>
            <span style={styles.imageLabel}>{car.year} {car.make} {car.model}</span>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {tabs.map((t) => (
              <button
                key={t}
                style={{ ...styles.tab, ...(activeTab === t ? styles.tabActive : {}) }}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={styles.tabContent}>

            {activeTab === "overview" && (
              <div>
                <p style={styles.description}>{car.description}</p>
                <div style={styles.ownerCard}>
                  <div style={styles.ownerAvatar}>
                    {car.owner.name.charAt(0)}
                  </div>
                  <div>
                    <div style={styles.ownerName}>
                      {car.owner.name}
                      {car.owner.verified && (
                        <span style={styles.verifiedBadge}>Verified Owner</span>
                      )}
                    </div>
                    <div style={styles.ownerMeta}>
                      <StarIcon /> {car.owner.rating} &nbsp;·&nbsp; Responds {car.owner.responseTime}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div style={styles.specsGrid}>
                {car.specs.map((s) => (
                  <div key={s.label} style={styles.specRow}>
                    <span style={styles.specLabel}>{s.label}</span>
                    <span style={styles.specValue}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "features" && (
              <div style={styles.featuresList}>
                {car.features.map((f) => (
                  <div key={f} style={styles.featureItem}>
                    <CheckIcon /> {f}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div style={styles.reviewsPlaceholder}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p>Reviews will appear here once the backend is connected.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column — Booking panel ── */}
        <div style={styles.rightCol}>
          <div style={styles.bookingCard}>
            <div style={styles.priceRow}>
              <span style={styles.bigPrice}>KSH {car.dailyPrice.toLocaleString()}</span>
              <span style={styles.perDay}> / day</span>
            </div>
            <div style={styles.distanceRow}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {car.distance} from your location
            </div>

            <hr style={styles.divider} />

            <label style={styles.label}>Pick-up Date</label>
            <input
              type="date"
              style={styles.input}
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label style={styles.label}>Return Date</label>
            <input
              type="date"
              style={styles.input}
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
            />

            {days > 0 && (
              <div style={styles.costBreakdown}>
                <div style={styles.costRow}>
                  <span>KSH {car.dailyPrice.toLocaleString()} x {days} day{days > 1 ? "s" : ""}</span>
                  <span>KSH {total.toLocaleString()}</span>
                </div>
                <div style={{ ...styles.costRow, ...styles.costTotal }}>
                  <span>Total</span>
                  <span>KSH {total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              style={{ ...styles.bookBtn, opacity: days === 0 ? 0.5 : 1 }}
              disabled={days === 0}
              onClick={() => navigate("/booking")}
            >
              {days === 0 ? "Select dates to book" : "Book Now"}
            </button>

            <p style={styles.bookingNote}>
              No charge until the owner confirms your booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: { minHeight: "100vh", background: "#f9fafb", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  topBar: { background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 28px", display: "flex", alignItems: "center", gap: "16px" },
  backBtn: { display: "flex", alignItems: "center", gap: "4px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "7px 12px", fontSize: "13px", color: "#374151", cursor: "pointer" },
  carTitle: { flex: 1, fontSize: "17px", fontWeight: 700, color: "#111827" },
  ratingBadge: { display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#374151", fontWeight: 500 },
  layout: { display: "flex", gap: "24px", maxWidth: "1100px", margin: "0 auto", padding: "24px 28px", alignItems: "flex-start" },
  leftCol: { flex: 1 },
  imagePlaceholder: { height: "280px", background: "linear-gradient(135deg,#1e3a5f 0%,#2563EB 100%)", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" },
  imageLabel: { color: "rgba(255,255,255,0.7)", fontSize: "14px" },
  tabs: { display: "flex", gap: "0", borderBottom: "2px solid #e5e7eb", marginBottom: "20px" },
  tab: { padding: "10px 18px", background: "transparent", border: "none", fontSize: "14px", color: "#6b7280", cursor: "pointer", borderBottom: "2px solid transparent", marginBottom: "-2px" },
  tabActive: { color: "#2563EB", borderBottomColor: "#2563EB", fontWeight: 600 },
  tabContent: { background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", padding: "20px" },
  description: { fontSize: "14px", color: "#4b5563", lineHeight: 1.75, marginBottom: "20px" },
  ownerCard: { display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" },
  ownerAvatar: { width: "44px", height: "44px", borderRadius: "50%", background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, flexShrink: 0 },
  ownerName: { fontSize: "14px", fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  verifiedBadge: { fontSize: "11px", background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 },
  ownerMeta: { fontSize: "12.5px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" },
  specsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" },
  specRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6", fontSize: "13.5px" },
  specLabel: { color: "#6b7280" },
  specValue: { color: "#111827", fontWeight: 500 },
  featuresList: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  featureItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#374151" },
  reviewsPlaceholder: { textAlign: "center", padding: "40px 20px", color: "#9ca3af" },
  rightCol: { width: "300px", minWidth: "300px" },
  bookingCard: { background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", position: "sticky", top: "24px" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" },
  bigPrice: { fontSize: "26px", fontWeight: 700, color: "#111827" },
  perDay: { fontSize: "14px", color: "#6b7280" },
  distanceRow: { display: "flex", alignItems: "center", gap: "5px", fontSize: "12.5px", color: "#6b7280", marginBottom: "16px" },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "16px 0" },
  label: { display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", marginTop: "12px" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "7px", fontSize: "13.5px", color: "#111827", outline: "none" },
  costBreakdown: { background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", margin: "16px 0 0" },
  costRow: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#374151", padding: "4px 0" },
  costTotal: { borderTop: "1px solid #e5e7eb", marginTop: "8px", paddingTop: "10px", fontWeight: 700, fontSize: "14px", color: "#111827" },
  bookBtn: { width: "100%", marginTop: "16px", padding: "13px", background: "#2563EB", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14.5px", fontWeight: 600, cursor: "pointer" },
  bookingNote: { fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "10px" },
};

export default CarOverviewDashboard;
