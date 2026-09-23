import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Cars Page
// The main vehicle search and browse page for customers.
// Displays available vehicles with filters and search.
// Route: /cars
// TODO: Wire up to GET /api/v1/vehicles with filter params
// ─────────────────────────────────────────────────────────────────────────────

// Placeholder vehicle data — replace with API call when backend is ready
const PLACEHOLDER_VEHICLES = [
    { id: 1, make: "Toyota", model: "Camry", year: 2022, price: 3500, distance: "2.4 km", seats: 5, fuel: "Petrol", transmission: "Automatic", status: "available" },
    { id: 2, make: "Honda", model: "CR-V", year: 2023, price: 4200, distance: "3.1 km", seats: 7, fuel: "Petrol", transmission: "Automatic", status: "available" },
    { id: 3, make: "Nissan", model: "X-Trail", year: 2021, price: 3800, distance: "5.0 km", seats: 7, fuel: "Diesel", transmission: "Automatic", status: "available" },
    { id: 4, make: "Mazda", model: "CX-5", year: 2023, price: 4500, distance: "6.2 km", seats: 5, fuel: "Petrol", transmission: "Automatic", status: "available" },
    { id: 5, make: "Subaru", model: "Forester", year: 2022, price: 3200, distance: "7.8 km", seats: 5, fuel: "Petrol", transmission: "Automatic", status: "available" },
    { id: 6, make: "Toyota", model: "Land Cruiser", year: 2023, price: 8500, distance: "9.3 km", seats: 8, fuel: "Diesel", transmission: "Automatic", status: "available" },
];

const Cars = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [fuelFilter, setFuelFilter] = useState("All");
    const [sortBy, setSortBy] = useState("distance");

  // Filter and sort vehicles
    const filtered = PLACEHOLDER_VEHICLES
    .filter((v) => {
        const matchesSearch =
        `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase());
        const matchesBudget = maxBudget ? v.price <= Number(maxBudget) : true;
        const matchesFuel = fuelFilter === "All" ? true : v.fuel === fuelFilter;
        return matchesSearch && matchesBudget && matchesFuel;
    })
    .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
        return 0;
    });

    return (
    <div style={styles.page}>

      {/* ── Header bar ── */}
        <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
        </button>
        <h1 style={styles.pageTitle}>Browse Vehicles</h1>
        <span style={styles.count}>{filtered.length} vehicles found</span>
        </div>

        <div style={styles.layout}>

        {/* ── Filters sidebar ── */}
        <aside style={styles.sidebar}>
            <div style={styles.sidebarTitle}>Filters</div>

            <label style={styles.label}>Search</label>
            <input
            style={styles.input}
            placeholder="Make or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />

            <label style={styles.label}>Max Budget (KSH / day)</label>
            <input
            style={styles.input}
            type="number"
            placeholder="e.g. 5000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            />

            <label style={styles.label}>Fuel Type</label>
            <select
            style={styles.select}
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            >
            <option>All</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
            </select>

            <label style={styles.label}>Sort By</label>
            <select
            style={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            >
            <option value="distance">Nearest First</option>
            <option value="price">Lowest Price</option>
            </select>

            <button
            style={styles.clearBtn}
            onClick={() => { setSearch(""); setMaxBudget(""); setFuelFilter("All"); setSortBy("distance"); }}
            >
            Clear Filters
            </button>
        </aside>

        {/* ── Vehicle grid ── */}
        <main style={styles.grid}>
            {filtered.length === 0 ? (
            <div style={styles.empty}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p>No vehicles match your filters.</p>
            </div>
            ) : (
            filtered.map((v) => (
                <div key={v.id} style={styles.card}>
                {/* Placeholder image */}
                <div style={styles.cardImg}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                    stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                    <rect x="9" y="11" width="14" height="10" rx="2" />
                    <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    </svg>
                </div>

                <div style={styles.cardBody}>
                    <div style={styles.cardTitle}>{v.year} {v.make} {v.model}</div>

                    <div style={styles.cardMeta}>
                    <span style={styles.metaTag}>{v.fuel}</span>
                    <span style={styles.metaTag}>{v.transmission}</span>
                    <span style={styles.metaTag}>{v.seats} seats</span>
                    </div>

                    <div style={styles.cardFooter}>
                    <div>
                        <div style={styles.price}>KSH {v.price.toLocaleString()}<span style={styles.perDay}>/day</span></div>
                        <div style={styles.distance}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {v.distance} away
                        </div>
                    </div>
                    <button
                        style={styles.bookBtn}
                        onClick={() => navigate(`/cars/${v.id}`)}
                    >
                        View Details
                    </button>
                    </div>
                </div>
                </div>
            ))
            )}
        </main>
        </div>
    </div>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
    page: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    topBar: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "16px 28px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    },
    backBtn: {
    display: "flex", alignItems: "center", gap: "4px",
    background: "transparent", border: "1px solid #e5e7eb",
    borderRadius: "6px", padding: "7px 12px",
    fontSize: "13px", color: "#374151", cursor: "pointer",
    },
    pageTitle: { fontSize: "18px", fontWeight: 700, color: "#111827", flex: 1 },
    count: { fontSize: "13px", color: "#6b7280" },
    layout: { display: "flex", gap: "0", maxWidth: "1200px", margin: "0 auto", padding: "24px 28px" },
    sidebar: {
    width: "240px", minWidth: "240px", background: "#fff",
    borderRadius: "10px", border: "1px solid #e5e7eb",
    padding: "20px", height: "fit-content", marginRight: "20px",
    },
    sidebarTitle: { fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "16px" },
    label: { display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", marginTop: "14px" },
    input: {
    width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb",
    borderRadius: "6px", fontSize: "13px", color: "#111827", outline: "none",
    },
    select: {
    width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb",
    borderRadius: "6px", fontSize: "13px", color: "#111827", background: "#fff",
    },
    clearBtn: {
    width: "100%", marginTop: "20px", padding: "9px",
    background: "transparent", border: "1px solid #e5e7eb",
    borderRadius: "6px", fontSize: "13px", color: "#6b7280", cursor: "pointer",
    },
    grid: { flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", alignContent: "start" },
    empty: { gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#9ca3af" },
    card: { background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", overflow: "hidden", transition: "box-shadow 0.15s" },
    cardImg: {
    height: "160px", background: "linear-gradient(135deg,#1e3a5f 0%,#2563EB 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    },
    cardBody: { padding: "16px" },
    cardTitle: { fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "10px" },
    cardMeta: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" },
    metaTag: {
    fontSize: "11.5px", background: "#EFF6FF", color: "#1d4ed8",
    padding: "3px 8px", borderRadius: "4px", fontWeight: 500,
    },
    cardFooter: { display: "flex", alignItems: "flex-end", justifyContent: "space-between" },
    price: { fontSize: "18px", fontWeight: 700, color: "#111827" },
    perDay: { fontSize: "12px", fontWeight: 400, color: "#6b7280" },
    distance: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6b7280", marginTop: "2px" },
    bookBtn: {
    padding: "9px 16px", background: "#2563EB", color: "#fff",
    border: "none", borderRadius: "7px", fontSize: "13px",
    fontWeight: 600, cursor: "pointer",
    },
};

export default Cars;
