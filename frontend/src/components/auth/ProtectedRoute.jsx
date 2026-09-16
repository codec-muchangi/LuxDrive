import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { ROUTES } from "../../constants/routes"

// ── Spinner shown while Supabase rehydrates the session ──────────────────────
function AuthLoadingScreen() {
  return (
    <div
      style={{
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        height:          "100vh",
        background:      "#0A0A0A",
        gap:             16,
      }}
    >
      {/* Gold spinning ring */}
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #2a2a2a", borderTopColor: "#eec453", animation: "luxSpin 0.75s linear infinite" }}>
      </div>
      <span
        style={{
          fontFamily:    "'Manrope', sans-serif",
          fontSize:      13,
          fontWeight:    500,
          color:         "#777",
          letterSpacing: "0.04em",
        }}
      >
        LUXDRIVE
      </span>

      <style>{`
        @keyframes luxSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ── ProtectedRoute ────────────────────────────────────────────────────────────
/**
 * @param {object} props
 * @param {React.ReactNode} props.children     — the page to render when authed
 * @param {"ADMIN"|"CUSTOMER"|undefined} props.requiredRole — optional role gate
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading, isActive } = useAuth()
  const location = useLocation()

  // ── 1. Still hydrating — show spinner, NEVER redirect yet ────────────────
  if (loading) {
    return <AuthLoadingScreen />
  }

  // ── 2. Not logged in — send to login, preserve intended destination ───────
  if (!user) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    )
  }

  // ── 3. Logged in but account is suspended/disabled ────────────────────────
  if (profile && !isActive) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ accountSuspended: true }}
        replace
      />
    )
  }

  // ── 4. Role gate (e.g. admin-only pages) ──────────────────────────────────
  if (requiredRole) {
    const userRole = profile?.role
    if (userRole !== requiredRole) {
      // Customer hitting an admin page → send to cars listing
      return <Navigate to={ROUTES.CARS} replace />
    }
  }

  // ── 5. All checks pass ────────────────────────────────────────────────────
  return children
}
