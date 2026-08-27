/**
 * LUXDRIVE — Forgot Password Page
 *
 * File:  src/pages/auth/ForgotPassword.jsx
 * Route: /forgot-password  (wrapped in GuestRoute in App.jsx)
 *
 * WIRING:
 *   useAuth().resetPassword(email)
 *     → AuthContext → supabase.auth.resetPasswordForEmail()
 *     → Supabase emails the user a secure reset link
 *     → User clicks link → lands on /auth/reset-password
 *   react-hot-toast  → success / error feedback
 *   ROUTES constants → all navigation links
 *   lucide-react     → icons (already installed)
 *
 * APP.JSX UPDATE (2 lines):
 *   import ForgotPassword from '@/pages/auth/ForgotPassword'
 *   <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
 *
 * DESIGN: Centered white card on full-page dark (#0A0A0A) background.
 *         NOT split-screen — focused, distraction-free flow.
 */

import { useState }                                  from 'react'
import { Link }                                      from 'react-router-dom'
import { Mail, ArrowLeft, Loader2,
          CheckCircle2, AlertCircle }                 from 'lucide-react'
import toast                                         from 'react-hot-toast'
import { useAuth }                                   from '@/context/AuthContext'
import { ROUTES }                                    from '@/utils/constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function friendlyError(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('user not found') || m.includes('no user'))
    return 'No account found with that email address.'
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many requests. Please wait a moment and try again.'
  if (m.includes('invalid email'))
    return 'Please enter a valid email address.'
  return 'Failed to send reset link. Please try again.'
}

/** Apply gold focus ring to a pill input. */
const applyGold = (e, hasErr) => {
  if (!hasErr) {
    e.target.style.borderColor = '#eec453'
    e.target.style.boxShadow   = '0 0 0 4px rgba(238,196,83,0.15)'
    e.target.style.background  = '#ffffff'
  }
}

/** Remove gold ring on blur. */
const removeGold = (e, hasErr) => {
  if (!hasErr) {
    e.target.style.borderColor = 'rgba(0,0,0,0.12)'
    e.target.style.boxShadow   = 'none'
    e.target.style.background  = '#FAFAFA'
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ForgotPassword() {
  const { resetPassword } = useAuth()

  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(email.trim())
      setSent(true)
      toast.success('Reset link sent! Check your inbox.')
    } catch (err) {
      const msg = friendlyError(err?.message)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight:      '100vh',
        background:     '#0A0A0A',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '24px 16px',
      }}
    >
      <div
        style={{
          width:        '100%',
          maxWidth:     '460px',
          background:   '#ffffff',
          borderRadius: '24px',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.45)',
          padding:      'clamp(32px,5vw,52px)',
          textAlign:    'center',
        }}
      >
        {/* LUXDRIVE wordmark */}
        <div
          style={{
            fontFamily:    "'Inter', system-ui, sans-serif",
            fontWeight:    800,
            fontSize:      '17px',
            letterSpacing: '3px',
            color:         '#eec453',
            marginBottom:  '16px',
          }}
        >
          LUXDRIVE
        </div>

        {/* Gold separator */}
        <div
          aria-hidden="true"
          style={{
            width:       '40px',
            height:      '1px',
            background:  'rgba(238,196,83,0.35)',
            margin:      '0 auto 28px',
          }}
        />

        {/* Conditionally render sent confirmation or the form */}
        {sent
          ? <SentConfirmation email={email} onResend={() => { setSent(false); setError('') }} />
          : <ForgotForm
              email={email}
              setEmail={setEmail}
              loading={loading}
              error={error}
              setError={setError}
              onSubmit={handleSubmit}
            />
        }

        {/* Footer link */}
        <div
          style={{
            marginTop:  '28px',
            paddingTop: '20px',
            borderTop:  '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Link
            to={ROUTES.LOGIN}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '6px',
              fontSize:       '13px',
              fontWeight:     500,
              color:          '#71717a',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Remembered your password?&nbsp;
            <span style={{ color: '#d4961a', fontWeight: 700 }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ForgotForm({ email, setEmail, loading, error, setError, onSubmit }) {
  return (
    <>
      <h1
        style={{
          fontFamily:   "'Playfair Display', Georgia, serif",
          fontSize:     'clamp(26px,4vw,34px)',
          fontWeight:   700,
          color:        '#1a1a1a',
          lineHeight:   1.18,
          marginBottom: '10px',
        }}
      >
        Forgot Password?
      </h1>

      <p
        style={{
          fontFamily:   "'Inter', system-ui, sans-serif",
          fontSize:     '13px',
          color:        '#71717a',
          lineHeight:   1.7,
          marginBottom: '32px',
        }}
      >
        Enter your email address and we'll send you a link
        to reset your LUXDRIVE password.
      </p>

      {/* Error banner */}
      {error && (
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
            textAlign:    'left',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        {/* Email field */}
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <label
            htmlFor="fp-email"
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
                color:         error ? '#ef4444' : 'rgba(10,10,10,0.28)',
                pointerEvents: 'none',
                zIndex:        1,
              }}
            />
            <input
              id="fp-email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="your@email.com"
              autoComplete="email"
              disabled={loading}
              aria-describedby={error ? 'fp-error' : undefined}
              aria-invalid={!!error}
              style={{
                width:        '100%',
                height:       '52px',
                paddingLeft:  '46px',
                paddingRight: '20px',
                border:       error
                  ? '1.5px solid #ef4444'
                  : '1.5px solid rgba(0,0,0,0.12)',
                borderRadius: '100px',
                background:   '#FAFAFA',
                fontFamily:   "'Inter', system-ui, sans-serif",
                fontSize:     '14px',
                fontWeight:   500,
                color:        '#1a1a1a',
                outline:      'none',
                transition:   'border-color 150ms ease, box-shadow 150ms ease',
                boxShadow:    error ? '0 0 0 4px rgba(239,68,68,0.10)' : 'none',
                opacity:      loading ? 0.6 : 1,
                cursor:       loading ? 'not-allowed' : 'text',
              }}
              onFocus={e => applyGold(e, !!error)}
              onBlur={e  => removeGold(e, !!error)}
            />
          </div>
        </div>

        {/* Submit */}
        <SendButton loading={loading} />
      </form>

      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize:   '12px',
          color:      '#71717a',
          marginTop:  '18px',
          lineHeight: 1.65,
        }}
      >
        We'll send you a secure link. Check your spam folder
        if you don't see it within a few minutes.
      </p>
    </>
  )
}

function SentConfirmation({ email, onResend }) {
  return (
    <>
      <div
        style={{
          width:          '64px',
          height:         '64px',
          borderRadius:   '50%',
          background:     'rgba(238,196,83,0.10)',
          border:         '1px solid rgba(238,196,83,0.35)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          margin:         '0 auto 22px',
        }}
      >
        <CheckCircle2 size={30} style={{ color: '#eec453' }} aria-hidden="true" />
      </div>

      <h1
        style={{
          fontFamily:   "'Playfair Display', Georgia, serif",
          fontSize:     'clamp(24px,3.5vw,30px)',
          fontWeight:   700,
          color:        '#1a1a1a',
          marginBottom: '12px',
        }}
      >
        Check Your Email
      </h1>

      <p
        style={{
          fontSize:     '14px',
          color:        '#71717a',
          lineHeight:   1.75,
          marginBottom: '28px',
        }}
      >
        We've sent a password reset link to{' '}
        <strong style={{ color: '#1a1a1a' }}>{email}</strong>.
        Click the link in the email to create a new password.
      </p>

      <Link
        to={ROUTES.LOGIN}
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '8px',
          height:         '52px',
          borderRadius:   '100px',
          background:     'linear-gradient(135deg,#eec453 0%,#d4961a 100%)',
          color:          '#0A0A0A',
          textDecoration: 'none',
          fontFamily:     "'Inter', system-ui, sans-serif",
          fontSize:       '14px',
          fontWeight:     700,
          boxShadow:      '0 4px 20px rgba(238,196,83,0.28)',
        }}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Sign In
      </Link>

      <button
        type="button"
        onClick={onResend}
        style={{
          marginTop:  '14px',
          background: 'none',
          border:     'none',
          fontSize:   '12px',
          color:      '#71717a',
          cursor:     'pointer',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        Didn't receive it?{' '}
        <span style={{ color: '#d4961a', fontWeight: 600 }}>Resend email</span>
      </button>
    </>
  )
}

function SendButton({ loading }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => { if (!loading) setHov(true) }}
      onMouseLeave={() => setHov(false)}
      style={{
        width:          '100%',
        height:         '52px',
        border:         'none',
        borderRadius:   '100px',
        background:     loading
          ? 'rgba(238,196,83,0.55)'
          : 'linear-gradient(135deg,#eec453 0%,#d4961a 100%)',
        color:          '#0A0A0A',
        fontFamily:     "'Inter', system-ui, sans-serif",
        fontSize:       '14px',
        fontWeight:     700,
        cursor:         loading ? 'not-allowed' : 'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '10px',
        boxShadow:      loading ? 'none'
          : hov ? '0 8px 28px rgba(238,196,83,0.42)'
                : '0 4px 20px rgba(238,196,83,0.28)',
        transform:      hov && !loading ? 'translateY(-2px)' : 'translateY(0)',
        transition:     'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {loading ? (
        <><Loader2 size={17} className="animate-spin" aria-hidden="true" />Sending…</>
      ) : (
        <><Mail size={16} aria-hidden="true" />Send Reset Link</>
      )}
    </button>
  )
}
