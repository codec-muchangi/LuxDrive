/**
 * LUXDRIVE — AuthContext.jsx
 * frontend/src/context/AuthContext.jsx
 *
 * FIX: Session is set BEFORE any navigation fires.
 *      AuthContext never calls navigate() itself — that belongs
 *      in Login.jsx after the await resolves.
 *      ProtectedRoute reads `loading` to avoid bouncing the user
 *      back to /login while Supabase is still hydrating.
 */

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"           // adjust path if needed
import toast from "react-hot-toast"

// ── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null)

  /**
   * loading = true  →  Supabase is still checking the stored session.
   *                    ProtectedRoute must render null/spinner, NOT redirect.
   * loading = false →  We know the auth state. Redirect decisions are safe.
   */
  const [loading, setLoading] = useState(true)

  // ── Fetch the LUXDRIVE profile row after auth ──────────────────────────
  const fetchProfile = async (userId) => {
    if (!userId) return null
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error) {
        console.error("[AuthContext] fetchProfile error:", error.message)
        return null
      }
      return data
    } catch (err) {
      console.error("[AuthContext] fetchProfile unexpected:", err)
      return null
    }
  }

  // ── Initialise: check existing session on mount ───────────────────────
  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession()

        if (mounted) {
          if (existingSession) {
            setSession(existingSession)
            setUser(existingSession.user)
            const p = await fetchProfile(existingSession.user.id)
            if (mounted) setProfile(p)
          }
          // Always mark loading done regardless of whether a session exists
          setLoading(false)
        }
      } catch (err) {
        console.error("[AuthContext] init error:", err)
        if (mounted) setLoading(false)
      }
    }

    init()

    // ── Listen for auth state changes (login / logout / token refresh) ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setSession(newSession)
          setUser(newSession?.user ?? null)
          if (newSession?.user) {
            const p = await fetchProfile(newSession.user.id)
            if (mounted) setProfile(p)
          }
          // NOTE: we do NOT navigate here.
          // Login.jsx calls navigate() AFTER its await resolves.
          setLoading(false)
        }

        if (event === "SIGNED_OUT") {
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ── Auth actions ─────────────────────────────────────────────────────────

  /**
   * signIn — returns { error } so Login.jsx can decide whether to navigate.
   * Never throws; always returns a result object.
   */
  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) return { error }
      // State is set by onAuthStateChange above — just return success
      return { error: null, user: data.user }
    } catch (err) {
      return { error: { message: "Unexpected error. Please try again." } }
    }
  }

  /**
   * signUp — creates the Supabase auth user.
   * The profiles trigger in Supabase creates the profile row automatically.
   */
  const signUp = async ({ email, password, fullName }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName },
        },
      })
      if (error) return { error }
      return { error: null, user: data.user }
    } catch (err) {
      return { error: { message: "Unexpected error. Please try again." } }
    }
  }

  /** signOut — clears state; caller can redirect afterwards */
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
    } catch (err) {
      console.error("[AuthContext] signOut error:", err)
    }
  }

  // ── Derived helpers ───────────────────────────────────────────────────────
  const isAuthenticated = !!user && !loading
  const isAdmin         = profile?.role === "ADMIN"
  const isCustomer      = profile?.role === "CUSTOMER"
  const isActive        = profile?.account_status === "ACTIVE"

  // ── Value ─────────────────────────────────────────────────────────────────
  const value = {
    user,
    profile,
    session,
    loading,
    isAuthenticated,
    isAdmin,
    isCustomer,
    isActive,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
