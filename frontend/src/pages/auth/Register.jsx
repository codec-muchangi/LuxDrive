/**
 * LUXDRIVE — Register Page
 *
 * File:  src/pages/auth/Register.jsx
 * Route: /register  (wrapped in GuestRoute inside App.jsx)
 *
 * WIRING:
 *   useAuth().signUp({ email, password, fullName, phone })
 *     → AuthContext → supabase.auth.signUp()
 *   supabase.auth.signInWithOAuth()
 *     → Google OAuth redirect
 *   react-hot-toast  → feedback (already wired in App.jsx)
 *   ROUTES constants → navigation
 *   lucide-react     → icons (installed in package.json)
 *
 * APP.JSX UPDATE (2 lines only):
 *   1. import Register from '@/pages/auth/Register'
 *   2. Change /register route:
 *      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
 *
 * LAYOUT: Left white form | Right dark Porsche image  (mirror of Login)
 */

import { useState }                                           from 'react'
import { Link }                                  from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone,
            ArrowRight, AlertCircle, Loader2, CheckCircle2 }     from 'lucide-react'
import toast                                                  from 'react-hot-toast'
import { useAuth }                                            from '@/context/AuthContext'
import { supabase }                                           from '@/lib/supabase'
import { ROUTES }                                             from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PORSCHE_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80'

// ─── Error mapper ─────────────────────────────────────────────────────────────

function friendlySignUpError(msg = '') {
    const m = msg.toLowerCase()
    if (m.includes('already registered') || m.includes('already exists') || m.includes('user already')) {
    return 'An account with this email already exists. Try signing in instead.'
    }
    if (m.includes('weak password') || (m.includes('password') && m.includes('weak'))) {
    return 'Please choose a stronger password (mix of letters, numbers and symbols).'
    }
    if (m.includes('rate limit') || m.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.'
    }
    if (m.includes('invalid email')) {
    return 'Please enter a valid email address.'
    }
    return 'Account creation failed. Please check your details and try again.'
}

// ─── Shared input style helpers ───────────────────────────────────────────────

const makeInputStyle = (hasError, isDisabled) => ({
    width:        '100%',
    height:       '50px',
    paddingLeft:  '44px',
    paddingRight: '20px',
    border:       `1.5px solid ${hasError ? '#ef4444' : 'rgba(0,0,0,0.12)'}`,
    borderRadius: '100px',
    background:   '#FAFAFA',
    fontFamily:   "'Inter', system-ui, sans-serif",
    fontSize:     '14px',
    fontWeight:   500,
    color:        '#1a1a1a',
    outline:      'none',
    transition:   'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
    boxShadow:    hasError ? '0 0 0 4px rgba(239,68,68,0.10)' : 'none',
    opacity:      isDisabled ? 0.6 : 1,
    cursor:       isDisabled ? 'not-allowed' : 'text',
})

const onFocusGold  = (e, hasError) => {
    if (!hasError) {
    e.target.style.borderColor = '#eec453'
    e.target.style.boxShadow   = '0 0 0 4px rgba(238,196,83,0.15)'
    e.target.style.background  = '#ffffff'
    }
}
const onBlurReset  = (e, hasError) => {
    if (!hasError) {
    e.target.style.borderColor = 'rgba(0,0,0,0.12)'
    e.target.style.boxShadow   = 'none'
    e.target.style.background  = '#FAFAFA'
    }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Register() {
    const { signUp } = useAuth()
    const navigate = useNavigate()

  // ── Form data ──────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
    fullName:        '',
    email:           '',
    phone:           '',
    password:        '',
    confirmPassword: '',
    acceptTerms:     false,
    })

    const [showPassword,        setShowPassword]        = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading,             setLoading]             = useState(false)
    const [success,             setSuccess]             = useState(false)
    const [fieldErrors,         setFieldErrors]         = useState({})
    const [generalError,        setGeneralError]        = useState('')

  /** Update one field and clear its error simultaneously. */
    const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }

  // ── Validation ─────────────────────────────────────────────────────────────
    const validate = () => {
    const errs = {}
    let ok = true

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
        errs.fullName = 'Please enter your full name (at least 2 characters).'
        ok = false
    }
    if (!EMAIL_RE.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address.'
        ok = false
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 9) {
        errs.phone = 'Please enter a valid phone number (e.g. +254 700 000 000).'
        ok = false
    }
    if (formData.password.length < 8) {
        errs.password = 'Password must be at least 8 characters.'
        ok = false
    }
    if (formData.confirmPassword !== formData.password) {
        errs.confirmPassword = 'Passwords do not match.'
        ok = false
    }
    if (!formData.acceptTerms) {
        errs.acceptTerms = 'You must accept the Terms of Service to continue.'
        ok = false
    }

    setFieldErrors(errs)
    return ok
    }

  // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')
    if (!validate()) return

    setLoading(true)
    try {
        await signUp({
        email:    formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phone:    formData.phone.trim(),
        })
        // REPLACE WITH THIS:
      toast.success('Welcome to LUXDRIVE! Account created successfully.')
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
        const msg = friendlySignUpError(err?.message)
        setGeneralError(msg)
        toast.error(msg)
    } finally {
        setLoading(false)
    }
    }

  // ── Google OAuth ───────────────────────────────────────────────────────────
    const handleGoogleSignUp = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}${ROUTES.AUTH_CALLBACK}` },
        })
        if (error) throw error
    } catch {
        toast.error('Google sign up failed. Please try again.')
    }
    }

  // ── Success screen after registration ──────────────────────────────────────
    if (success) {
    return <SuccessScreen email={formData.email} />
    }

  // ── Main render ────────────────────────────────────────────────────────────
    return (
    <div
        style={{
        display:    'flex',
        height:     '100vh',
        minHeight:  '700px',
        background: '#0A0A0A',
        }}
    >

        {/* ══════════════════════════════════════════
            LEFT PANEL — white form card
      ══════════════════════════════════════════ */}
        <div
        className="flex-1 flex flex-col bg-white overflow-hidden"
        style={{ borderRadius: '0 20px 20px 0', boxShadow: '8px 0 48px rgba(0,0,0,0.25)' }}
        >

        {/* Top bar */}
        <div
            className="flex items-center flex-shrink-0"
            style={{ padding: '24px 44px', justifyContent: 'space-between' }}
        >
          {/* Mobile-only LUXDRIVE logo */}
            <span
            className="md:hidden"
            style={{
                fontFamily:    "'Inter', system-ui, sans-serif",
                fontWeight:    800,
                fontSize:      '17px',
                letterSpacing: '3px',
                color:         '#d4961a',
            }}
            >
            LUXDRIVE
            </span>

          {/* Sign in link */}
            <div className="flex items-center ml-auto" style={{ gap: '4px' }}>
            <span style={{ fontSize: '13px', color: '#71717a' }}>
                Already have an account?
            </span>
            <Link
                to={ROUTES.LOGIN}
                style={{
                fontSize:       '13px',
                fontWeight:     700,
                color:          '#d4961a',
                textDecoration: 'none',
                marginLeft:     '4px',
                }}
            >
                Sign In
            </Link>
            </div>
        </div>

        {/* Scrollable form */}
        <div
            className="flex-1 flex items-start justify-center overflow-y-auto"
            style={{ padding: '8px 44px 28px' }}
        >
            <div style={{ width: '100%', maxWidth: '420px' }}>

            {/* Heading */}
            <h2
                style={{
                fontFamily:   "'Playfair Display', Georgia, serif",
                fontSize:     '36px',
                fontWeight:   700,
                color:        '#1a1a1a',
                lineHeight:   1.15,
                marginBottom: '8px',
                }}
            >
                Create Your Account
            </h2>
            <p
                style={{
                fontSize:     '13px',
                color:        '#71717a',
                lineHeight:   1.65,
                marginBottom: '26px',
                }}
            >
                Join LUXDRIVE and experience Kenya's finest luxury vehicles.
            </p>

            {/* General error banner */}
            {generalError && (
                <div
                role="alert"
                style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '10px',
                    padding:      '12px 16px',
                    background:   'rgba(239,68,68,0.07)',
                    border:       '1px solid rgba(239,68,68,0.22)',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize:     '13px',
                    fontWeight:   500,
                    color:        '#dc2626',
                }}
                >
                <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
                {generalError}
                </div>
            )}

            {/* Google sign-up */}
            <GoogleSignUpButton onClick={handleGoogleSignUp} disabled={loading} />

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '20px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                <span
                style={{
                    fontSize:      '10px',
                    fontWeight:    700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color:         '#71717a',
                    whiteSpace:    'nowrap',
                }}
                >
                or sign up with email
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
            </div>

            {/* ── FORM ─────────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
                <FormField
                id="reg-name"
                label="Full Name"
                error={fieldErrors.fullName}
                icon={<User size={15} aria-hidden="true" />}
                iconColor={fieldErrors.fullName ? '#ef4444' : 'rgba(10,10,10,0.28)'}
                >
                <input
                    id="reg-name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={e => update('fullName', e.target.value)}
                    autoComplete="name"
                    disabled={loading}
                    aria-describedby={fieldErrors.fullName ? 'err-name' : undefined}
                    aria-invalid={!!fieldErrors.fullName}
                    style={makeInputStyle(!!fieldErrors.fullName, loading)}
                    onFocus={e => onFocusGold(e, !!fieldErrors.fullName)}
                    onBlur={e  => onBlurReset(e,  !!fieldErrors.fullName)}
                />
                </FormField>

              {/* Email */}
                <FormField
                id="reg-email"
                label="Email Address"
                error={fieldErrors.email}
                icon={<Mail size={15} aria-hidden="true" />}
                iconColor={fieldErrors.email ? '#ef4444' : 'rgba(10,10,10,0.28)'}
                >
                <input
                    id="reg-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={e => update('email', e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                    aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                    aria-invalid={!!fieldErrors.email}
                    style={makeInputStyle(!!fieldErrors.email, loading)}
                    onFocus={e => onFocusGold(e, !!fieldErrors.email)}
                    onBlur={e  => onBlurReset(e,  !!fieldErrors.email)}
                />
                </FormField>

              {/* Phone */}
                <FormField
                id="reg-phone"
                label="Phone Number"
                error={fieldErrors.phone}
                icon={<Phone size={15} aria-hidden="true" />}
                iconColor={fieldErrors.phone ? '#ef4444' : 'rgba(10,10,10,0.28)'}
                >
                <input
                    id="reg-phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={formData.phone}
                    onChange={e => update('phone', e.target.value)}
                    autoComplete="tel"
                    disabled={loading}
                    aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                    aria-invalid={!!fieldErrors.phone}
                    style={makeInputStyle(!!fieldErrors.phone, loading)}
                    onFocus={e => onFocusGold(e, !!fieldErrors.phone)}
                    onBlur={e  => onBlurReset(e,  !!fieldErrors.phone)}
                />
                </FormField>

              {/* Password */}
                <FormField
                id="reg-password"
                label="Password"
                error={fieldErrors.password}
                icon={<Lock size={15} aria-hidden="true" />}
                iconColor={fieldErrors.password ? '#ef4444' : 'rgba(10,10,10,0.28)'}
                >
                <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={e => update('password', e.target.value)}
                    autoComplete="new-password"
                    disabled={loading}
                    aria-describedby={fieldErrors.password ? 'err-pwd' : undefined}
                    aria-invalid={!!fieldErrors.password}
                    style={{ ...makeInputStyle(!!fieldErrors.password, loading), paddingRight: '52px' }}
                    onFocus={e => onFocusGold(e, !!fieldErrors.password)}
                    onBlur={e  => onBlurReset(e,  !!fieldErrors.password)}
                />
                <EyeToggle
                    show={showPassword}
                    onToggle={() => setShowPassword(v => !v)}
                    disabled={loading}
                />
                </FormField>

              {/* Confirm Password */}
                <FormField
                id="reg-confirm"
                label="Confirm Password"
                error={fieldErrors.confirmPassword}
                icon={<Lock size={15} aria-hidden="true" />}
                iconColor={fieldErrors.confirmPassword ? '#ef4444' : 'rgba(10,10,10,0.28)'}
              >
                <input
                  id="reg-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  aria-describedby={fieldErrors.confirmPassword ? 'err-confirm' : undefined}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  style={{ ...makeInputStyle(!!fieldErrors.confirmPassword, loading), paddingRight: '52px' }}
                  onFocus={e => onFocusGold(e, !!fieldErrors.confirmPassword)}
                  onBlur={e  => onBlurReset(e,  !!fieldErrors.confirmPassword)}
                />
                <EyeToggle
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(v => !v)}
                  disabled={loading}
                />
              </FormField>

              {/* Terms checkbox */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display:    'flex',
                    alignItems: 'flex-start',
                    gap:        '10px',
                    cursor:     loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={e => update('acceptTerms', e.target.checked)}
                    disabled={loading}
                    style={{
                      marginTop:   '2px',
                      accentColor: '#eec453',
                      width:       '15px',
                      height:      '15px',
                      flexShrink:  0,
                      cursor:      loading ? 'not-allowed' : 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '12px', lineHeight: 1.75, color: '#71717a' }}>
                    By creating an account you agree to our{' '}
                    <Link
                      to={ROUTES.TERMS}
                      style={{ color: '#d4961a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      to={ROUTES.PRIVACY}
                      style={{ color: '#d4961a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Privacy Policy
                    </Link>.
                  </span>
                </label>
                {fieldErrors.acceptTerms && (
                  <p
                    role="alert"
                    style={{
                      marginTop:   '6px',
                      paddingLeft: '25px',
                      fontSize:    '11px',
                      fontWeight:  600,
                      color:       '#ef4444',
                    }}
                  >
                    {fieldErrors.acceptTerms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <SubmitButton loading={loading} />

            </form>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{ padding: '16px 44px', borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <span style={{ fontSize: '11px', color: '#71717a' }}>© 2026 LUXDRIVE Inc.</span>
          <Link
            to={ROUTES.CONTACT}
            style={{ fontSize: '11px', color: '#71717a', textDecoration: 'none' }}
          >
            Contact Support
          </Link>
          <span style={{ fontSize: '11px', color: '#71717a' }}>English</span>
        </div>

      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Porsche GT3 image
          (mirrors the Login page left panel)
      ══════════════════════════════════════════ */}
      <div
        className="hidden md:flex flex-col justify-between"
        style={{ flex: '0 0 44%', position: 'relative', overflow: 'hidden' }}
      >
        {/* Porsche GT3 background image */}
        <div
          role="img"
          aria-label="Porsche 911 GT3 luxury sports car"
          style={{
            position:           'absolute',
            inset:              0,
            backgroundImage:    `url('${PORSCHE_IMG}')`,
            backgroundSize:     'cover',
            backgroundPosition: 'center 40%',
          }}
        />

        {/* Gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(160deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.68) 55%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* ── LUXDRIVE logo ── */}
        <div className="relative z-10" style={{ padding: '40px 44px 0' }}>
          <span
            style={{
              fontFamily:    "'Inter', system-ui, sans-serif",
              fontWeight:    800,
              fontSize:      '18px',
              letterSpacing: '3px',
              color:         '#eec453',
            }}
          >
            LUXDRIVE
          </span>
        </div>

        {/* ── Center content ── */}
        <div
          className="relative z-10 flex-1 flex flex-col justify-center"
          style={{ padding: '24px 44px' }}
        >
          <p
            style={{
              fontSize:      '10px',
              fontWeight:    700,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color:         '#eec453',
              marginBottom:  '16px',
            }}
          >
            Your Journey Starts Here
          </p>

          <h2
            style={{
              fontFamily:   "'Playfair Display', Georgia, serif",
              fontSize:     'clamp(30px, 3vw, 46px)',
              fontWeight:   700,
              lineHeight:   1.15,
              color:        '#f4f4f5',
              marginBottom: '18px',
            }}
          >
            Premium Vehicles<br />Await You
          </h2>

          <p
            style={{
              fontSize:     '14px',
              lineHeight:   1.78,
              color:        'rgba(244,244,245,0.58)',
              maxWidth:     '280px',
              marginBottom: '32px',
            }}
          >
            Register today and unlock access to over 500 luxury vehicles
            across Nairobi with instant online booking.
          </p>

          {/* Benefit list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Instant online booking',
              'Transparent KES pricing',
              'Self-drive & chauffeur options',
              'Airport & hotel delivery',
            ].map(benefit => (
              <div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width:        '20px',
                    height:       '20px',
                    borderRadius: '50%',
                    background:   'rgba(238,196,83,0.12)',
                    border:       '1px solid rgba(238,196,83,0.35)',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent:'center',
                    flexShrink:   0,
                  }}
                >
                  <div
                    style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eec453' }}
                  />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(244,244,245,0.82)' }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom tagline ── */}
        <div className="relative z-10" style={{ padding: '0 44px 40px' }}>
          <div style={{ height: '1px', background: 'rgba(238,196,83,0.20)', marginBottom: '12px' }} />
          <p style={{ fontSize: '11px', color: 'rgba(244,244,245,0.36)', letterSpacing: '0.4px' }}>
            Kenya's premier luxury car rental platform
          </p>
        </div>

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Reusable form field wrapper.
 * Renders: label → icon-prefixed input slot → optional error message.
 */
function FormField({ id, label, error, icon, iconColor, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        htmlFor={id}
        style={{
          display:       'block',
          fontSize:      '10px',
          fontWeight:    700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color:         'rgba(10,10,10,0.45)',
          marginBottom:  '7px',
        }}
      >
        {label}
      </label>

      <div style={{ position: 'relative' }}>
        {/* Left icon */}
        <div
          aria-hidden="true"
          style={{
            position:      'absolute',
            left:          '16px',
            top:           '50%',
            transform:     'translateY(-50%)',
            color:         iconColor,
            pointerEvents: 'none',
            zIndex:        1,
            display:       'flex',
            alignItems:    'center',
          }}
        >
          {icon}
        </div>
        {children}
      </div>

      {error && (
        <p
          role="alert"
          style={{
            marginTop:   '5px',
            paddingLeft: '16px',
            fontSize:    '11px',
            fontWeight:  600,
            color:       '#ef4444',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

/** Password visibility toggle button (eye / eye-off). */
function EyeToggle({ show, onToggle, disabled }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? 'Hide password' : 'Show password'}
      disabled={disabled}
      style={{
        position:     'absolute',
        right:        '16px',
        top:          '50%',
        transform:    'translateY(-50%)',
        background:   'none',
        border:       'none',
        cursor:       disabled ? 'not-allowed' : 'pointer',
        color:        'rgba(10,10,10,0.32)',
        display:      'flex',
        alignItems:   'center',
        padding:      '4px',
        borderRadius: '4px',
      }}
    >
      {show
        ? <EyeOff size={15} aria-hidden="true" />
        : <Eye    size={15} aria-hidden="true" />
      }
    </button>
  )
}

/** Google OAuth sign-up button with hover effect. */
function GoogleSignUpButton({ onClick, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:          '100%',
        height:         '50px',
        border:         hov && !disabled
          ? '1.5px solid rgba(0,0,0,0.22)'
          : '1.5px solid rgba(0,0,0,0.10)',
        borderRadius:   '100px',
        background:     '#ffffff',
        color:          '#1a1a1a',
        fontFamily:     "'Inter', system-ui, sans-serif",
        fontSize:       '14px',
        fontWeight:     600,
        cursor:         disabled ? 'not-allowed' : 'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '12px',
        opacity:        disabled ? 0.6 : 1,
        boxShadow:      hov && !disabled ? '0 2px 10px rgba(0,0,0,0.07)' : 'none',
        transition:     'border-color 150ms ease, box-shadow 150ms ease',
      }}
    >
      {/* CSS-only Google G */}
      <div
        aria-hidden="true"
        style={{
          width:        '18px',
          height:       '18px',
          borderRadius: '50%',
          background:   'conic-gradient(#4285F4 0deg 90deg, #EA4335 90deg 180deg, #FBBC05 180deg 270deg, #34A853 270deg 360deg)',
          flexShrink:   0,
          position:     'relative',
        }}
      >
        <div
          style={{
            position:     'absolute',
            top:          '50%',
            left:         '50%',
            transform:    'translate(-50%, -50%)',
            width:        '8px',
            height:       '8px',
            borderRadius: '50%',
            background:   '#ffffff',
          }}
        />
      </div>
      Sign up with Google
    </button>
  )
}

/** Gold gradient submit button with loading + hover states. */
function SubmitButton({ loading }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => { if (!loading) setHov(true)  }}
      onMouseLeave={() => setHov(false)}
      style={{
        width:          '100%',
        height:         '52px',
        border:         'none',
        borderRadius:   '100px',
        background:     loading
          ? 'rgba(238,196,83,0.55)'
          : 'linear-gradient(135deg, #eec453 0%, #d4961a 100%)',
        color:          '#0A0A0A',
        fontFamily:     "'Inter', system-ui, sans-serif",
        fontSize:       '14px',
        fontWeight:     700,
        letterSpacing:  '0.2px',
        cursor:         loading ? 'not-allowed' : 'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '10px',
        boxShadow:      loading
          ? 'none'
          : hov
            ? '0 8px 28px rgba(238,196,83,0.42)'
            : '0 4px 20px rgba(238,196,83,0.28)',
        transform:      hov && !loading ? 'translateY(-2px)' : 'translateY(0)',
        transition:     'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {loading ? (
        <>
          <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          Creating account…
        </>
      ) : (
        <>
          <ArrowRight size={17} aria-hidden="true" />
          Create Account
        </>
      )}
    </button>
  )
}

/**
 * Full-page success state shown after a successful registration.
 * Replaces the entire Register layout so the user cannot re-submit.
 */
function SuccessScreen({ email }) {
  return (
    <div
      style={{
        display:        'flex',
        height:         '100vh',
        alignItems:     'center',
        justifyContent: 'center',
        background:     '#0A0A0A',
        padding:        '20px',
      }}
    >
      <div
        style={{
          background:   '#ffffff',
          borderRadius: '20px',
          padding:      '48px 44px',
          maxWidth:     '440px',
          width:        '100%',
          textAlign:    'center',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.45)',
        }}
      >
        {/* Gold checkmark circle */}
        <div
          style={{
            width:          '60px',
            height:         '60px',
            borderRadius:   '50%',
            background:     'rgba(238,196,83,0.10)',
            border:         '1px solid rgba(238,196,83,0.35)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            margin:         '0 auto 22px',
          }}
        >
          <CheckCircle2 size={28} style={{ color: '#eec453' }} aria-hidden="true" />
        </div>

        <h2
          style={{
            fontFamily:   "'Playfair Display', Georgia, serif",
            fontSize:     '28px',
            fontWeight:   700,
            color:        '#1a1a1a',
            marginBottom: '12px',
          }}
        >
          Check Your Email
        </h2>

        <p
          style={{
            fontSize:     '14px',
            color:        '#71717a',
            lineHeight:   1.75,
            marginBottom: '30px',
          }}
        >
          We've sent a verification link to{' '}
          <strong style={{ color: '#1a1a1a' }}>{email}</strong>.
          Click the link in the email to activate your LUXDRIVE account.
        </p>

        <Link
          to={ROUTES.LOGIN}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '8px',
            width:          '100%',
            height:         '50px',
            borderRadius:   '100px',
            background:     'linear-gradient(135deg, #eec453 0%, #d4961a 100%)',
            color:          '#0A0A0A',
            textDecoration: 'none',
            fontFamily:     "'Inter', system-ui, sans-serif",
            fontSize:       '14px',
            fontWeight:     700,
            boxShadow:      '0 4px 20px rgba(238,196,83,0.28)',
          }}
        >
          <ArrowRight size={16} aria-hidden="true" />
          Back to Sign In
        </Link>

        <p style={{ marginTop: '18px', fontSize: '12px', color: '#71717a' }}>
          Didn't receive it?{' '}
          <span style={{ color: '#d4961a', cursor: 'pointer', fontWeight: 600 }}>
            Resend email
          </span>
        </p>
      </div>
    </div>
  )
}
