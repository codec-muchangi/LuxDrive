/**
 * LUXDRIVE — Route Guards
 *
 * ProtectedRoute — requires authentication
 * AdminRoute     — requires ADMIN role
 * CustomerRoute  — requires CUSTOMER role
 *
 * These components provide UX-level route protection.
 * They do NOT replace server-side authorization in FastAPI.
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, AUTH_STATE } from '@/context/AuthContext'

// ── Loading Spinner while auth initialises ─────────────────────
function AuthLoading() {
  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 spinner" />
        <p className="text-surface-400 text-sm font-sans tracking-wide">
          Authenticating…
        </p>
      </div>
    </div>
  )
}

// ── ProtectedRoute ─────────────────────────────────────────────
// Requires any authenticated user
export function ProtectedRoute({ children }) {
  const { authState, isAuthenticated } = useAuth()
  const location = useLocation()

  if (authState === AUTH_STATE.INITIALIZING) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return children
}

// ── AdminRoute ─────────────────────────────────────────────────
// Requires ADMIN role
export function AdminRoute({ children }) {
  const { authState, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (authState === AUTH_STATE.INITIALIZING) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  if (!isAdmin) {
    // Authenticated but not an admin — show 403
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// ── CustomerRoute ──────────────────────────────────────────────
// Requires CUSTOMER role specifically
export function CustomerRoute({ children }) {
  const { authState, isAuthenticated, isCustomer } = useAuth()
  const location = useLocation()

  if (authState === AUTH_STATE.INITIALIZING) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  if (!isCustomer) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// ── GuestRoute ─────────────────────────────────────────────────
// Only for unauthenticated users (login, register pages)
// Redirects authenticated users to their dashboard
export function GuestRoute({ children }) {
  const { authState, isAuthenticated, isAdmin } = useAuth()

  if (authState === AUTH_STATE.INITIALIZING) {
    return <AuthLoading />
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
  }

  return children
}
