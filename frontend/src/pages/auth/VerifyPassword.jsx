/**
 * LUXDRIVE — Verify Email Page
 *
 * File:  src/pages/auth/VerifyEmail.jsx
 * Route: /auth/verify  (NOT wrapped in GuestRoute)
 *
 * FLOW:
 *   1. User registers in Register.jsx
 *   2. Supabase sends a 6-digit OTP to their email
 *   3. Register.jsx navigates here with: navigate(ROUTES.VERIFY_EMAIL, { state: { email } })
 *   4. User enters the 6-digit code
 *   5. supabase.auth.verifyOtp({ email, token, type:'signup' }) is called
 *   6. Success → navigate to ROUTES.DASHBOARD
 *
 * RESEND: supabase.auth.resend({ type:'signup', email })
 *         60-second cooldown between resend attempts
 *
 * APP.JSX UPDATE (2 lines):
 *   import VerifyEmail from '@/pages/auth/VerifyEmail'
 *   <Route path="/auth/verify" element={<VerifyEmail />} />
 *   (No GuestRoute — user may not have a full session yet)
 *
 * DESIGN: Single-page centered card — NO scrolling.
 *         Everything fits in one viewport height.
 */

import { useState, useRef, useEffect }              from 'react'
import { Link, useLocation, useNavigate }            from 'react-router-dom'
import { Mail, ArrowLeft, Loader2, CheckCircle2 }                 from 'lucide-react'
import toast                                         from 'react-hot-toast'
import { supabase }                                  from '@/lib/supabase'
import { useAuth }                                   from '@/context/AuthContext'
import { ROUTES }                                    from '@/utils/constants'

// ─── Constants ────────────────────────────────────────────────────────────────

const OTP_LENGTH      = 6
const RESEND_COOLDOWN = 60   // seconds

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  /**
   * Email comes from Register.jsx via:
   *   navigate(ROUTES.VERIFY_EMAIL, { state: { email: formData.email } })
   * Falls back to the Supabase session email if state is missing.
   */
  const displayEmail = location.state?.email || user?.email || 'your email'

  // ── State ───────────────────────────────────────────────────────────────────
  const [digits,      setDigits]      = useState(Array(OTP_LENGTH).fill(''))
  const [acceptTerms, setAcceptTerms] = useState(true)
  const [loading,     setLoading]     = useState(false)
  const [resending,   setResending]   = useState(false)
  const [countdown,   setCountdown]   = useState(0)

  // Refs for each OTP input box (enables programmatic focus)
  const inputRefs = useRef([])

  // Derived values
  const code      = digits.join('')
  const isComplete = digits.every(d => d !== '')
  const canSubmit  = isComplete && acceptTerms

  // ── 60-second resend cooldown ───────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // Auto-focus first input on mount
  useEffect(() => {
    const id = setTimeout(() => inputRefs.current[0]?.focus(), 120)
    return () => clearTimeout(id)
  }, [])

  // ── OTP input handlers ──────────────────────────────────────────────────────

  const handleChange = (index, value) => {
    // Keep only the last digit typed (handles Android autocomplete)
    const digit = value.replace(/\D/g, '').slice(-1)
    const next  = [...digits]
    next[index] = digit
    setDigits(next)
    // Auto-advance to next box
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        // Clear current box
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        // Move back and clear previous box
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
        inputRefs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft'  && index > 0)             inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = (e.clipboardData || window.clipboardData).getData('text')
    const nums   = pasted.replace(/\D/g, '').slice(0, OTP_LENGTH)
    const next   = Array(OTP_LENGTH).fill('')
    nums.split('').forEach((d, i) => { next[i] = d })
    setDigits(next)
    // Focus next empty box or last box
    const focusIdx = Math.min(nums.length, OTP_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  // ── Resend OTP ──────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (countdown > 0 || resending || loading) return
    setResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type:  'signup',
        email: displayEmail,
      })
      if (error) throw error
      toast.success('Verification code resent! Check your inbox.')
      setCountdown(RESEND_COOLDOWN)
      setDigits(Array(OTP_LENGTH).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    } catch (err) {
      toast.error(err?.message || 'Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  // ── Verify OTP ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: displayEmail,
        token: code,
        type:  'signup',
      })
      if (error) throw error
      toast.success('Email verified! Welcome to LUXDRIVE.')
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      const msg = err?.message || 'Invalid code. Please check and try again.'
      toast.error(msg)
      // Clear inputs and re-focus for retry
      setDigits(Array(OTP_LENGTH).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 80)
    } finally {
      setLoading(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        height:         '100vh',
        background:     '#0A0A0A',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '16px',
        overflow:       'hidden',
      }}
    >
      {/* ── White card ─────────────────────────────────────────────────────── */}
      <div
        style={{
          width:        '100%',
          maxWidth:     '440px',
          background:   '#ffffff',
          borderRadius: '24px',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.45)',
          padding:      '28px 36px',
          overflow:     'hidden',
        }}
      >

        {/* LUXDRIVE wordmark */}
        <div
          style={{
            textAlign:     'center',
            fontFamily:    "'Inter', system-ui, sans-serif",
            fontWeight:    800,
            fontSize:      '16px',
            letterSpacing: '3px',
            color:         '#eec453',
            marginBottom:  '12px',
          }}
        >
          LUXDRIVE
        </div>

        {/* Gold separator */}
        <div
          aria-hidden="true"
          style={{ width: '36px', height: '1px', background: 'rgba(238,196,83,0.35)', margin: '0 auto 16px' }}
        />

        {/* Mail icon circle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div
            style={{
              width:          '52px',
              height:         '52px',
              borderRadius:   '50%',
              background:     'rgba(238,196,83,0.10)',
              border:         '1px solid rgba(238,196,83,0.30)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            <Mail size={24} style={{ color: '#eec453' }} aria-hidden="true" />
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily:   "'Playfair Display', Georgia, serif",
            fontSize:     '26px',
            fontWeight:   700,
            color:        '#1a1a1a',
            textAlign:    'center',
            marginBottom: '6px',
          }}
        >
          Check Your Email
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily:   "'Inter', system-ui, sans-serif",
            fontSize:     '13px',
            color:        '#71717a',
            textAlign:    'center',
            marginBottom: '2px',
          }}
        >
          We sent a 6-digit verification code to
        </p>
        <p
          style={{
            fontFamily:   "'Inter', system-ui, sans-serif",
            fontSize:     '14px',
            fontWeight:   600,
            color:        '#1a1a1a',
            textAlign:    'center',
            marginBottom: '20px',
          }}
        >
          {displayEmail}
        </p>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── 6 OTP input boxes ──────────────────────────────────────────── */}
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '14px' }}
            aria-label="6-digit verification code"
            role="group"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                disabled={loading}
                style={{
                  width:        '44px',
                  height:       '52px',
                  textAlign:    'center',
                  fontSize:     '20px',
                  fontWeight:   700,
                  fontFamily:   "'Inter', system-ui, sans-serif",
                  border:       digit
                    ? '2px solid #16a34a'
                    : '2px solid rgba(0,0,0,0.15)',
                  borderRadius: '10px',
                  background:   digit ? 'rgba(22,163,74,0.05)' : '#FAFAFA',
                  color:        '#1a1a1a',
                  outline:      'none',
                  transition:   'border-color 150ms ease, background 150ms ease, box-shadow 150ms ease',
                  cursor:       loading ? 'not-allowed' : 'text',
                  opacity:      loading ? 0.6 : 1,
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#eec453'
                  e.target.style.boxShadow   = '0 0 0 3px rgba(238,196,83,0.18)'
                  e.target.style.background  = '#ffffff'
                }}
                onBlur={e => {
                  e.target.style.boxShadow   = 'none'
                  e.target.style.borderColor = digit ? '#16a34a' : 'rgba(0,0,0,0.15)'
                  e.target.style.background  = digit ? 'rgba(22,163,74,0.05)' : '#FAFAFA'
                }}
              />
            ))}
          </div>

          {/* ── Resend ─────────────────────────────────────────────────────── */}
          <div
            style={{
              textAlign:    'center',
              marginBottom: '14px',
              fontSize:     '13px',
              color:        '#71717a',
              fontFamily:   "'Inter', system-ui, sans-serif",
            }}
          >
            Didn't get the code?{' '}
            {countdown > 0 ? (
              <span style={{ color: '#a3a3a3', fontWeight: 500 }}>
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || loading}
                style={{
                  background:  'none',
                  border:      'none',
                  cursor:      resending || loading ? 'not-allowed' : 'pointer',
                  color:       '#d4961a',
                  fontWeight:  700,
                  fontSize:    '13px',
                  fontFamily:  "'Inter', system-ui, sans-serif",
                  padding:     0,
                  opacity:     resending ? 0.6 : 1,
                }}
              >
                {resending ? 'Sending…' : 'Resend'}
              </button>
            )}
          </div>

          {/* ── Terms checkbox ─────────────────────────────────────────────── */}
          <div
            style={{
              display:      'flex',
              alignItems:   'flex-start',
              gap:          '8px',
              marginBottom: '18px',
              textAlign:    'left',
            }}
          >
            <input
              type="checkbox"
              id="ve-terms"
              checked={acceptTerms}
              onChange={e => setAcceptTerms(e.target.checked)}
              disabled={loading}
              style={{
                marginTop:   '2px',
                width:       '14px',
                height:      '14px',
                accentColor: '#eec453',
                flexShrink:  0,
                cursor:      loading ? 'not-allowed' : 'pointer',
              }}
            />
            <label
              htmlFor="ve-terms"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize:   '11px',
                color:      '#71717a',
                lineHeight: 1.65,
                cursor:     loading ? 'not-allowed' : 'pointer',
              }}
            >
              By continuing, you agree to our{' '}
              <Link
                to={ROUTES.TERMS}
                style={{ color: '#d4961a', textDecoration: 'none', fontWeight: 600 }}
              >
                Terms of Service
              </Link>
              {' '}&amp;{' '}
              <Link
                to={ROUTES.PRIVACY}
                style={{ color: '#d4961a', textDecoration: 'none', fontWeight: 600 }}
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* ── Verify button ───────────────────────────────────────────────── */}
          <VerifyButton loading={loading} disabled={!canSubmit} />

        </form>

        {/* Footer link */}
        <div
          style={{
            marginTop:  '16px',
            paddingTop: '14px',
            borderTop:  '1px solid rgba(0,0,0,0.06)',
            textAlign:  'center',
          }}
        >
          <Link
            to={ROUTES.LOGIN}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '5px',
              fontSize:       '12px',
              color:          '#71717a',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Back to{' '}
            <span style={{ color: '#d4961a', fontWeight: 700, marginLeft: '2px' }}>
              Sign In
            </span>
          </Link>
        </div>

      </div>
    </div>
  )
}

// ─── Sub-component ────────────────────────────────────────────────────────────

/**
 * Gold gradient verify button.
 * Dimmed until all 6 digits are filled AND terms are accepted.
 * Shows Loader2 spinner while verifying.
 */
function VerifyButton({ loading, disabled }) {
  const [hov, setHov] = useState(false)
  const off = loading || disabled
  return (
    <button
      type="submit"
      disabled={off}
      onMouseEnter={() => { if (!off) setHov(true) }}
      onMouseLeave={() => setHov(false)}
      style={{
        width:          '100%',
        height:         '48px',
        border:         'none',
        borderRadius:   '100px',
        background:     off
          ? 'rgba(238,196,83,0.28)'
          : 'linear-gradient(135deg, #eec453 0%, #d4961a 100%)',
        color:          '#0A0A0A',
        fontFamily:     "'Inter', system-ui, sans-serif",
        fontSize:       '14px',
        fontWeight:     700,
        cursor:         off ? 'not-allowed' : 'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '8px',
        boxShadow:      off ? 'none'
          : hov ? '0 8px 28px rgba(238,196,83,0.42)'
                : '0 4px 20px rgba(238,196,83,0.28)',
        transform:      hov && !off ? 'translateY(-2px)' : 'translateY(0)',
        transition:     'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {loading
        ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />Verifying…</>
        : <><CheckCircle2 size={16} aria-hidden="true" />Verify Email</>
      }
    </button>
  )
}