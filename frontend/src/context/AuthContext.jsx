import { createContext, useContext, useState, useEffect } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// AuthContext
// Provides the authenticated user and auth actions to every component in the app.
// Wrap the app with <AuthProvider> (done in App.jsx) and read auth state
// anywhere with the useAuth() hook.
//
// TODO: Replace placeholder functions with real API calls when backend is ready.
// API endpoints:
//   POST /api/v1/auth/login
//   POST /api/v1/auth/register
//   POST /api/v1/auth/logout
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)  // true on first load while checking session

  // ── Restore session on page reload ────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("sac_user")
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem("sac_user") }
    }
    setLoading(false)
  }, [])

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true)
    try {
      // TODO: replace with real API call
      // const res = await api.post("/auth/login", { email, password })
      // const userData = res.data.user
      const userData = { id: 1, email, name: "Test User", role: "customer" }
      setUser(userData)
      localStorage.setItem("sac_user", JSON.stringify(userData))
      return { success: true, user: userData }
    } catch (err) {
      return { success: false, message: err.message || "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (data) => {
    setLoading(true)
    try {
      // TODO: replace with real API call
      // const res = await api.post("/auth/register", data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message || "Registration failed" }
    } finally {
      setLoading(false)
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null)
    localStorage.removeItem("sac_user")
  }

  const value = { user, loading, login, logout, register, isAuthenticated: !!user }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ── useAuth hook ──────────────────────────────────────────────────────────────
// Usage: const { user, login, logout } = useAuth()
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

export default AuthContext
