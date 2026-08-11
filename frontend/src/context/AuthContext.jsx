/**
 * LUXDRIVE — Authentication Context
 *
 * Central auth state provider. Wraps the entire app.
 * Provides:
 *   - session / user / profile
 *   - loading states
 *   - auth methods: signIn, signUp, signOut, resetPassword
 *   - role helpers: isCustomer, isAdmin
 *
 * Auth states:
 *   INITIALIZING → AUTHENTICATED | UNAUTHENTICATED
 *
 * Security note:
 *   The role is sourced from the profiles table in the DB,
 *   not from the JWT or any client-side value.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { authAPI } from '@/services/api'

// ── Context ────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ── Auth States ────────────────────────────────────────────────
export const AUTH_STATE = {
  INITIALIZING:    'INITIALIZING',
  AUTHENTICATED:   'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  ERROR:           'ERROR',
}

// ── Provider ───────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [authState, setAuthState]   = useState(AUTH_STATE.INITIALIZING)
  const [session, setSession]       = useState(null)
  const [user, setUser]             = useState(null)     // Supabase Auth user
  const [profile, setProfile]       = useState(null)     // LUXDRIVE profile (role, status, etc.)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError]     = useState(null)

  // ── Load Profile from FastAPI ────────────────────────────────
  // Called after Supabase Auth confirms the session.
  // FastAPI returns the profile with role & account_status from DB.
  const loadProfile = useCallback(async () => {
    setProfileLoading(true)
    setProfileError(null)
    try {
      const response = await authAPI.me()
      setProfile(response.data?.data || response.data)
      setAuthState(AUTH_STATE.AUTHENTICATED)
    } catch (err) {
      console.error('[AuthContext] Failed to load profile:', err)
      setProfileError(err)
      // If we can't load the profile, treat as unauthenticated
      // to avoid showing partial/incorrect UI
      setAuthState(AUTH_STATE.UNAUTHENTICATED)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  // ── Session Initialisation ───────────────────────────────────
  // On mount, check if a session already exists (page refresh, etc.)
  useEffect(() => {
    let mounted = true

    const initialise = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()

        if (!mounted) return

        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)
          await loadProfile()
        } else {
          setAuthState(AUTH_STATE.UNAUTHENTICATED)
        }
      } catch (err) {
        if (!mounted) return
        console.error('[AuthContext] Initialisation error:', err)
        setAuthState(AUTH_STATE.UNAUTHENTICATED)
      }
    }

    initialise()

    // ── Subscribe to auth state changes ──────────────────────
    // Handles: login, logout, token refresh, password reset, email confirm
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return

        if (import.meta.env.DEV) {
          console.log('[AuthContext] Auth event:', event)
        }

        if (newSession) {
          setSession(newSession)
          setUser(newSession.user)

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await loadProfile()
          }
        } else {
          // Signed out or session expired
          setSession(null)
          setUser(null)
          setProfile(null)
          setAuthState(AUTH_STATE.UNAUTHENTICATED)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadProfile])

  // ── Auth Methods ─────────────────────────────────────────────

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async ({ email, password, fullName, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone?.trim() || null,
        },
        // Redirect URL after email confirmation
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    setProfile(null)
    setUser(null)
    setSession(null)
    setAuthState(AUTH_STATE.UNAUTHENTICATED)
    const { error } = await supabase.auth.signOut()
    if (error) console.error('[AuthContext] signOut error:', error)
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    )
    if (error) throw error
  }

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  const refreshProfile = useCallback(() => loadProfile(), [loadProfile])

  // ── Derived State ─────────────────────────────────────────────
  const isInitializing  = authState === AUTH_STATE.INITIALIZING
  const isAuthenticated = authState === AUTH_STATE.AUTHENTICATED
  const isAdmin         = isAuthenticated && profile?.role === 'ADMIN'
  const isCustomer      = isAuthenticated && profile?.role === 'CUSTOMER'
  const isActive        = profile?.account_status === 'ACTIVE'
  const isEmailVerified = user?.email_confirmed_at != null

  // ── Context Value ─────────────────────────────────────────────
  const value = {
    // State
    authState,
    session,
    user,
    profile,
    profileLoading,
    profileError,

    // Derived booleans
    isInitializing,
    isAuthenticated,
    isAdmin,
    isCustomer,
    isActive,
    isEmailVerified,

    // Methods
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
