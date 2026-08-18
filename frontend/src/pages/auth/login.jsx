import { useState }                                    from 'react'
import { Link, useNavigate, useLocation }              from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight,
            AlertCircle, Loader2 }                        from 'lucide-react'
import toast                                           from 'react-hot-toast'
import { useAuth }                                     from '@/context/AuthContext'
import { supabase }                                    from '@/lib/supabase'
import { ROUTES }                                      from '@/utils/constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Convert raw Supabase error messages to friendly UI copy. */
function friendlyError(msg = '') {
    const m = msg.toLowerCase()
    if (m.includes('invalid login credentials') || m.includes('invalid credentials')) {
    return 'Invalid email or password. Please try again.'  }
    if (m.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.'
    }
    if (m.includes('too many requests') || m.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.'
    }
    if (m.includes('user not found')) {
    return 'No account found with that email address.'
    }
    return 'Sign in failed. Please check your credentials and try again.'
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Login() {
    const { signIn }  = useAuth()
    const navigate    = useNavigate()
    const location    = useLocation()

    /**
   * The path the user was trying to reach before being redirected to /login.
   * Set by ProtectedRoute: <Navigate to="/login" state={{ from: location.pathname }} />
   * We redirect here after a successful sign-in.
   */
  const from = location.state?.from

  // ── Form state ──────────────────────────────────────────────────────────────
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [fieldErrors,  setFieldErrors]  = useState({ email: '', password: '' })
  const [generalError, setGeneralError] = useState('')

  /** Clear one field error while the user is typing. */
  const clearFieldError = (field) =>
    setFieldErrors(prev => ({ ...prev, [field]: '' }))

  /** Client-side validation — returns true only when all fields pass. */
  const validate = () => {
    const errs = { email: '', password: '' }
    let valid  = true
    if (!EMAIL_RE.test(email.trim())) {
      errs.email = 'Please enter a valid email address.'
      valid = false
    }
    if (!password.trim()) {
      errs.password = 'Password is required.'
      valid = false
    }
    setFieldErrors(errs)
    return valid
  }

  // ── Email / password submit ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')
    if (!validate()) return

    setLoading(true)
    try {
      await signIn({ email: email.trim(), password })
      toast.success('Welcome back to LUXDRIVE!')
      /**
       * Navigate to the page the user originally wanted,
       * or fall back to the customer dashboard.
       * GuestRoute will also handle this redirect reactively once
       * isAuthenticated flips to true — this is the explicit fallback.
       */
      navigate(from || ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      const msg = friendlyError(err?.message)
      setGeneralError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Google OAuth ────────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${ROUTES.AUTH_CALLBACK}`,
        },
      })
      if (error) throw error
    } catch {
      toast.error('Google sign in failed. Please try again.')
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display:   'flex',
        height:    '100vh',
        minHeight: '640px',
        background:'#0A0A0A',
      }}
    >

      {/* ══════════════════════════════════════════
          LEFT PANEL — visible md and above
      ══════════════════════════════════════════ */}
      <div
        className="hidden md:flex flex-col justify-between"
        style={{ flex: '0 0 44%', position: 'relative', overflow: 'hidden' }}
      >
        {/* Background car image */}
        <div
          role="img"
          aria-label="Luxury BMW sports car at dusk"
          style={{
            position:           'absolute',
            inset:              0,
            backgroundImage:    "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80')",
            backgroundSize:     'cover',
            backgroundPosition: 'center 38%',
          }}
        />

        {/* Gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(160deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* ── Brand wordmark ── */}
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

        {/* ── Center marketing copy ── */}
        <div
          className="relative z-10 flex flex-col justify-center flex-1"
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
            Luxury Car Rental · Nairobi
          </p>

          <h1
            style={{
              fontFamily:   "'Playfair Display', Georgia, serif",
              fontSize:     'clamp(34px, 3.6vw, 52px)',
              fontWeight:   700,
              lineHeight:   1.12,
              color:        '#f4f4f5',
              marginBottom: '18px',
            }}
          >
            Drive the<br />Extraordinary
          </h1>

          <p
            style={{
              fontSize:     '14px',
              fontWeight:   400,
              lineHeight:   1.78,
              color:        'rgba(244,244,245,0.58)',
              maxWidth:     '300px',
              marginBottom: '32px',
            }}
          >
            Premium vehicles, effortless booking, and an exceptional
            experience from search to drive.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['500+ Vehicles', 'KES Pricing', 'Instant Booking'].map(label => (
              <span
                key={label}
                style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  gap:          '7px',
                  padding:      '7px 16px',
                  background:   'rgba(238,196,83,0.07)',
                  border:       '1px solid rgba(238,196,83,0.25)',
                  borderRadius: '100px',
                  fontSize:     '12px',
                  fontWeight:   600,
                  color:        '#f4f4f5',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#eec453', flexShrink: 0 }}
                />
                {label}
              </span>
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

      {/* ══════════════════════════════════════════
          RIGHT PANEL — white sign-in card
      ══════════════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col bg-white overflow-hidden"
        style={{ borderRadius: '20px 0 0 20px', boxShadow: '-8px 0 48px rgba(0,0,0,0.25)' }}
      >

        {/* ── Top bar ── */}
        <div
          className="flex items-center flex-shrink-0"
          style={{ padding: '26px 44px', justifyContent: 'space-between' }}
        >
          {/* Mobile-only logo (left panel hidden on mobile) */}
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

          {/* Register link — always right-aligned */}
          <div className="flex items-center ml-auto" style={{ gap: '4px' }}>
            <span style={{ fontSize: '13px', color: '#71717a' }}>
              Don't have an account?
            </span>
            <Link
              to={ROUTES.REGISTER}
              style={{
                fontSize:       '13px',
                fontWeight:     700,
                color:          '#d4961a',
                textDecoration: 'none',
                marginLeft:     '4px',
              }}
            >
              Register
            </Link>
          </div>
        </div>

        {/* ── Scrollable form area ── */}
        <div
          className="flex-1 flex items-center justify-center overflow-y-auto"
          style={{ padding: '16px 44px' }}
        >
          <div style={{ width: '100%', maxWidth: '400px' }}>

            {/* Heading */}
            <h2
              style={{
                fontFamily:   "'Playfair Display', Georgia, serif",
                fontSize:     '38px',
                fontWeight:   700,
                color:        '#1a1a1a',
                lineHeight:   1.15,
                marginBottom: '8px',
              }}
            >
              Sign In
            </h2>
            <p
              style={{
                fontSize:     '13px',
                color:        '#71717a',
                lineHeight:   1.65,
                marginBottom: '32px',
              }}
            >
              Welcome back. Enter your details to continue.
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

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="login-email"
                  style={{
                    display:       'block',
                    fontSize:      '10px',
                    fontWeight:    700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color:         'rgba(10,10,10,0.45)',
                    marginBottom:  '8px',
                  }}
                >
                  Email Address
                </label>

                <div style={{ position: 'relative' }}>
                  <Mail
                    size={15}
                    aria-hidden="true"
                    style={{
                      position:      'absolute',
                      left:          '18px',
                      top:           '50%',
                      transform:     'translateY(-50%)',
                      color:         fieldErrors.email ? '#ef4444' : 'rgba(10,10,10,0.28)',
                      pointerEvents: 'none',
                      zIndex:        1,
                    }}
                  />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); clearFieldError('email') }}
                    placeholder="your@email.com"
                    autoComplete="email"
                    disabled={loading}
                    aria-describedby={fieldErrors.email ? 'email-err' : undefined}
                    aria-invalid={!!fieldErrors.email}
                    style={{
                      width:        '100%',
                      height:       '52px',
                      paddingLeft:  '46px',
                      paddingRight: '20px',
                      border:       fieldErrors.email
                        ? '1.5px solid #ef4444'
                        : '1.5px solid rgba(0,0,0,0.12)',
                      borderRadius: '100px',
                      background:   '#FAFAFA',
                      fontFamily:   "'Inter', system-ui, sans-serif",
                      fontSize:     '14px',
                      fontWeight:   500,
                      color:        '#1a1a1a',
                      outline:      'none',
                      transition:   'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
                      boxShadow:    fieldErrors.email
                        ? '0 0 0 4px rgba(239,68,68,0.10)'
                        : 'none',
                      opacity: loading ? 0.6 : 1,
                      cursor:  loading ? 'not-allowed' : 'text',
                    }}
                    onFocus={e => {
                      if (!fieldErrors.email) {
                        e.target.style.borderColor = '#eec453'
                        e.target.style.boxShadow   = '0 0 0 4px rgba(238,196,83,0.15)'
                        e.target.style.background  = '#ffffff'
                      }
                    }}
                    onBlur={e => {
                      if (!fieldErrors.email) {
                        e.target.style.borderColor = 'rgba(0,0,0,0.12)'
                        e.target.style.boxShadow   = 'none'
                        e.target.style.background  = '#FAFAFA'
                      }
                    }}
                  />
                </div>

                {fieldErrors.email && (
                  <p
                    id="email-err"
                    role="alert"
                    style={{
                      marginTop:   '6px',
                      paddingLeft: '18px',
                      fontSize:    '11px',
                      fontWeight:  600,
                      color:       '#ef4444',
                    }}
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '14px' }}>
                <label
                  htmlFor="login-password"
                  style={{
                    display:       'block',
                    fontSize:      '10px',
                    fontWeight:    700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color:         'rgba(10,10,10,0.45)',
                    marginBottom:  '8px',
                  }}
                >
                  Password
                </label>

                <div style={{ position: 'relative' }}>
                  <Lock
                    size={15}
                    aria-hidden="true"
                    style={{
                      position:      'absolute',
                      left:          '18px',
                      top:           '50%',
                      transform:     'translateY(-50%)',
                      color:         fieldErrors.password ? '#ef4444' : 'rgba(10,10,10,0.28)',
                      pointerEvents: 'none',
                      zIndex:        1,
                    }}
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearFieldError('password') }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    aria-describedby={fieldErrors.password ? 'password-err' : undefined}
                    aria-invalid={!!fieldErrors.password}
                    style={{
                      width:        '100%',
                      height:       '52px',
                      paddingLeft:  '46px',
                      paddingRight: '52px',
                      border:       fieldErrors.password
                        ? '1.5px solid #ef4444'
                        : '1.5px solid rgba(0,0,0,0.12)',
                      borderRadius: '100px',
                      background:   '#FAFAFA',
                      fontFamily:   "'Inter', system-ui, sans-serif",
                      fontSize:     '14px',
                      fontWeight:   500,
                      color:        '#1a1a1a',
                      outline:      'none',
                      transition:   'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
                      boxShadow:    fieldErrors.password
                        ? '0 0 0 4px rgba(239,68,68,0.10)'
                        : 'none',
                      opacity: loading ? 0.6 : 1,
                      cursor:  loading ? 'not-allowed' : 'text',
                    }}
                    onFocus={e => {
                      if (!fieldErrors.password) {
                        e.target.style.borderColor = '#eec453'
                        e.target.style.boxShadow   = '0 0 0 4px rgba(238,196,83,0.15)'
                        e.target.style.background  = '#ffffff'
                      }
                    }}
                    onBlur={e => {
                      if (!fieldErrors.password) {
                        e.target.style.borderColor = 'rgba(0,0,0,0.12)'
                        e.target.style.boxShadow   = 'none'
                        e.target.style.background  = '#FAFAFA'
                      }
                    }}
                  />

                  {/* Eye toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={loading}
                    style={{
                      position:     'absolute',
                      right:        '18px',
                      top:          '50%',
                      transform:    'translateY(-50%)',
                      background:   'none',
                      border:       'none',
                      cursor:       loading ? 'not-allowed' : 'pointer',
                      color:        'rgba(10,10,10,0.32)',
                      display:      'flex',
                      alignItems:   'center',
                      padding:      '4px',
                      borderRadius: '4px',
                    }}
                  >
                    {showPassword
                      ? <EyeOff size={15} aria-hidden="true" />
                      : <Eye    size={15} aria-hidden="true" />
                    }
                  </button>
                </div>

                {fieldErrors.password && (
                  <p
                    id="password-err"
                    role="alert"
                    style={{
                      marginTop:   '6px',
                      paddingLeft: '18px',
                      fontSize:    '11px',
                      fontWeight:  600,
                      color:       '#ef4444',
                    }}
                  >
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Forgot password link */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  style={{
                    fontSize:       '12px',
                    fontWeight:     600,
                    color:          '#d4961a',
                    textDecoration: 'none',
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In button */}
              <SignInButton loading={loading} />

              {/* Divider */}
              <div
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '14px',
                  margin:     '26px 0',
                }}
              >
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
                  or continue with
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
              </div>

              {/* Google SSO */}
              <GoogleButton onClick={handleGoogleSignIn} disabled={loading} />

              {/* Terms */}
              <p
                style={{
                  marginTop:  '22px',
                  textAlign:  'center',
                  fontSize:   '11px',
                  lineHeight: 1.75,
                  color:      '#71717a',
                }}
              >
                By signing in you agree to our{' '}
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
              </p>

            </form>
          </div>
        </div>

        {/* ── Panel footer ── */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{ padding: '18px 44px', borderTop: '1px solid rgba(0,0,0,0.06)' }}
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
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Sign In submit button.
 * Shows a Lucide spinner + "Signing in…" while loading.
 * Lifts on hover with an enhanced gold glow.
 */
function SignInButton({ loading }) {
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
        transition:     'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
      }}
    >
      {loading ? (
        <>
          <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          Signing in…
        </>
      ) : (
        <>
          <ArrowRight size={17} aria-hidden="true" />
          Sign In
        </>
      )}
    </button>
  )
}

/**
 * Google OAuth button.
 * CSS-only multicolour G icon — no external image needed.
 */
function GoogleButton({ onClick, disabled }) {
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
        height:         '52px',
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
      {/* CSS-only Google G — conic-gradient circle + white inner circle */}
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
      Continue with Google
    </button>
  )
}
