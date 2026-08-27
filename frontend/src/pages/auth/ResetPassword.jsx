/**
 * LUXDRIVE — Reset Password Page
 *
 * File:  src/pages/auth/ResetPassword.jsx
 * Route: /auth/reset-password  (NOT wrapped in GuestRoute — see note below)
 *
 * ─── HOW IT CONNECTS TO ForgotPassword.jsx ───────────────────────────────────
 *   1. ForgotPassword.jsx calls useAuth().resetPassword(email)
 *   2. AuthContext calls supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })
 *   3. Supabase sends an email with a secure link
 *   4. User clicks the link → browser goes to /auth/reset-password with a token in the URL
 *   5. Supabase client automatically processes the token via onAuthStateChange
 *   6. User arrives here, fills in new password → updatePassword(password)
 *   7. Success → navigate to /login
 *
 * WHY NO GuestRoute: The user arrives here with a Supabase PASSWORD_RECOVERY
 *   session token (not a full authenticated session). GuestRoute would incorrectly
 *   redirect them away. The route must be public.
 *
 * APP.JSX UPDATE:
 *   import ResetPassword from '@/pages/auth/ResetPassword'
 *   <Route path="/auth/reset-password" element={<ResetPassword />} />
 *   (No GuestRoute wrapper — required for Supabase recovery flow)
 *
 * DESIGN: Single-page centered card — fits one viewport, NO scrolling.
 *         Compact 2-column requirements grid keeps everything visible at once.
 */

import { useState, useMemo }                         from 'react'
import { Link, useNavigate }                         from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft,
            Loader2, CheckCircle2, Circle,
            AlertCircle }                               from 'lucide-react'
import toast                                         from 'react-hot-toast'
import { useAuth }                                   from '@/context/AuthContext'
import { ROUTES }                                    from '@/utils/constants'

// ─── Password strength requirements ───────────────────────────────────────────

const REQUIREMENTS = [
  { id: 'lower', label: 'One lowercase letter', test: p => /[a-z]/.test(p)  },
  { id: 'len',   label: 'Minimum 8 characters', test: p => p.length >= 8    },
  { id: 'upper', label: 'One uppercase letter', test: p => /[A-Z]/.test(p)  },
  { id: 'num',   label: 'At least one number',  test: p => /[0-9]/.test(p)  },
]

// ─── Error mapper ─────────────────────────────────────────────────────────────

function friendlyError(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('token') || m.includes('expired') || m.includes('invalid'))
    return 'Your reset link has expired. Please request a new one.'
  if (m.includes('same') || m.includes('different'))
    return 'Your new password must be different from your current one.'
  if (m.includes('weak') || (m.includes('password') && m.includes('strong')))
    return 'Please choose a stronger password.'
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait and try again.'
  return 'Failed to reset password. Please try again.'
}

// ─── Input style factory ──────────────────────────────────────────────────────

const mkInput = (hasError, isDisabled) => ({
  width:        '100%',
  height:       '48px',
  paddingLeft:  '44px',
  paddingRight: '48px',
  border:       `1.5px solid ${hasError ? '#ef4444' : 'rgba(0,0,0,0.12)'}`,
  borderRadius: '100px',
  background:   '#FAFAFA',
  fontFamily:   "'Inter', system-ui, sans-serif",
  fontSize:     '14px',
  fontWeight:   500,
  color:        '#1a1a1a',
  outline:      'none',
  transition:   'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
  boxShadow:    hasError ? '0 0 0 3px rgba(239,68,68,0.10)' : 'none',
  opacity:      isDisabled ? 0.6 : 1,
  cursor:       isDisabled ? 'not-allowed' : 'text',
})

// Gold focus / default-blur helpers (DOM mutation between React renders)
const applyGold  = (e, skip) => {
  if (skip) return
  e.target.style.borderColor = '#eec453'
  e.target.style.boxShadow   = '0 0 0 3px rgba(238,196,83,0.15)'
  e.target.style.background  = '#ffffff'
}
const resetBlur  = (e, skip) => {
  if (skip) return
  e.target.style.borderColor = 'rgba(0,0,0,0.12)'
  e.target.style.boxShadow   = 'none'
  e.target.style.background  = '#FAFAFA'
}

// ─── LABEL style (reused) ─────────────────────────────────────────────────────

const LABEL = {
  display:       'block',
  fontSize:      '10px',
  fontWeight:    700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color:         'rgba(10,10,10,0.45)',
  marginBottom:  '6px',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate           = useNavigate()

  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword,    setShowPassword]    = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [success,         setSuccess]         = useState(false)
  const [fieldErrors,     setFieldErrors]     = useState({ password: '', confirm: '' })
  const [generalError,    setGeneralError]    = useState('')

  // Real-time requirement checks derived from password value
  const checks = useMemo(
    () => REQUIREMENTS.map(req => ({ ...req, met: req.test(password) })),
    [password]
  )
  const allMet         = checks.every(r => r.met)
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const canSubmit      = allMet && passwordsMatch

  const clearErr = field => setFieldErrors(prev => ({ ...prev, [field]: '' }))

  const validate = () => {
    const errs = { password: '', confirm: '' }
    let ok = true
    if (!allMet)                      { errs.password = 'Please meet all password requirements.'; ok = false }
    if (password !== confirmPassword) { errs.confirm  = 'Passwords do not match.';                ok = false }
    setFieldErrors(errs)
    return ok
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setGeneralError('')
    if (!validate()) return
    setLoading(true)
    try {
      await updatePassword(password)
      setSuccess(true)
      toast.success('Password updated! Redirecting…')
      setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 2000)
    } catch (err) {
      const msg = friendlyError(err?.message)
      setGeneralError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return <SuccessScreen />
  }

  // ── Main render ────────────────────────────────────────────────────────────
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
      <div
        style={{
          width:        '100%',
          maxWidth:     '460px',
          background:   '#ffffff',
          borderRadius: '24px',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.45)',
          padding:      '32px 40px',
          overflow:     'hidden',
        }}
      >

        {/* LUXDRIVE wordmark */}
        <div style={{ textAlign: 'center', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800, fontSize: '16px', letterSpacing: '3px', color: '#eec453', marginBottom: '12px' }}>
          LUXDRIVE
        </div>

        {/* Gold rule */}
        <div aria-hidden="true" style={{ width: '36px', height: '1px', background: 'rgba(238,196,83,0.35)', margin: '0 auto 18px' }} />

        {/* Heading */}
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: '6px' }}>
          Reset Password
        </h1>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '13px', color: '#71717a', textAlign: 'center', lineHeight: 1.6, marginBottom: '20px' }}>
          Create a new secure password for your LUXDRIVE account.
        </p>

        {/* General error banner */}
        {generalError && (
          <div
            role="alert"
            style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: '10px', marginBottom: '14px', fontSize: '12px', fontWeight: 500, color: '#dc2626' }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true" />
            <span>
              {generalError}
              {generalError.includes('expired') && (
                <> <Link to={ROUTES.FORGOT_PASSWORD} style={{ color: '#d4961a', fontWeight: 700 }}>Request new link</Link></>
              )}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── New Password field ─────────────────────────────────────────── */}
          <div style={{ marginBottom: '8px' }}>
            <label htmlFor="rp-pwd" style={LABEL}>New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={14}
                aria-hidden="true"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.password ? '#ef4444' : 'rgba(10,10,10,0.28)', pointerEvents: 'none', zIndex: 1 }}
              />
              <input
                id="rp-pwd"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); clearErr('password') }}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                disabled={loading}
                aria-describedby="pwd-reqs"
                style={mkInput(!!fieldErrors.password, loading)}
                onFocus={e => applyGold(e, !!fieldErrors.password)}
                onBlur={e  => resetBlur(e, !!fieldErrors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', color: 'rgba(10,10,10,0.32)', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                {showPassword ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p role="alert" style={{ marginTop: '4px', paddingLeft: '14px', fontSize: '11px', fontWeight: 600, color: '#ef4444' }}>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* ── Requirements — compact 2-column grid (saves vertical space) ── */}
          <div
            id="pwd-reqs"
            aria-label="Password requirements"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', background: '#FAFAFA', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px' }}
          >
            {checks.map(req => (
              <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {req.met
                  ? <CheckCircle2 size={12} style={{ color: '#16a34a', flexShrink: 0 }} aria-hidden="true" />
                  : <Circle       size={12} style={{ color: '#d1d5db', flexShrink: 0 }} aria-hidden="true" />
                }
                <span style={{ fontSize: '11px', fontWeight: 500, color: req.met ? '#16a34a' : '#71717a', whiteSpace: 'nowrap' }}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Confirm Password field ─────────────────────────────────────── */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="rp-confirm" style={LABEL}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={14}
                aria-hidden="true"
                style={{
                  position:      'absolute',
                  left:          '16px',
                  top:           '50%',
                  transform:     'translateY(-50%)',
                  color:         fieldErrors.confirm
                    ? '#ef4444'
                    : passwordsMatch ? '#16a34a' : 'rgba(10,10,10,0.28)',
                  pointerEvents: 'none',
                  zIndex:        1,
                }}
              />
              <input
                id="rp-confirm"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); clearErr('confirm') }}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={loading}
                aria-invalid={!!fieldErrors.confirm}
                style={{
                  ...mkInput(!!fieldErrors.confirm, loading),
                  borderColor: fieldErrors.confirm
                    ? '#ef4444'
                    : passwordsMatch ? '#16a34a' : 'rgba(0,0,0,0.12)',
                  boxShadow: fieldErrors.confirm
                    ? '0 0 0 3px rgba(239,68,68,0.10)'
                    : passwordsMatch ? '0 0 0 3px rgba(22,163,74,0.10)' : 'none',
                }}
                onFocus={e => applyGold(e, !!fieldErrors.confirm)}
                onBlur={e => {
                  if (!fieldErrors.confirm) {
                    e.target.style.borderColor = passwordsMatch ? '#16a34a' : 'rgba(0,0,0,0.12)'
                    e.target.style.boxShadow   = passwordsMatch ? '0 0 0 3px rgba(22,163,74,0.10)' : 'none'
                    e.target.style.background  = '#FAFAFA'
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                disabled={loading}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', color: 'rgba(10,10,10,0.32)', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                {showConfirm ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
              </button>
            </div>

            {/* Match indicator */}
            {confirmPassword.length > 0 && !fieldErrors.confirm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', paddingLeft: '14px' }}>
                {passwordsMatch
                  ? <><CheckCircle2 size={11} style={{ color: '#16a34a' }} aria-hidden="true" /><span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Passwords match</span></>
                  : <><Circle       size={11} style={{ color: '#d1d5db' }} aria-hidden="true" /><span style={{ fontSize: '11px', color: '#71717a' }}>Passwords do not match yet</span></>
                }
              </div>
            )}

            {fieldErrors.confirm && (
              <p role="alert" style={{ marginTop: '4px', paddingLeft: '14px', fontSize: '11px', fontWeight: 600, color: '#ef4444' }}>
                {fieldErrors.confirm}
              </p>
            )}
          </div>

          {/* ── Action buttons ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <CancelButton loading={loading} />
            <ResetButton  loading={loading} disabled={!canSubmit} />
          </div>

        </form>

        {/* Footer back link */}
        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <Link
            to={ROUTES.LOGIN}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#71717a', textDecoration: 'none' }}
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Back to{' '}
            <span style={{ color: '#d4961a', fontWeight: 700 }}>Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Ghost cancel button — navigates back in browser history. */
function CancelButton({ loading }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => window.history.back()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex:         1,
        height:       '48px',
        border:       `1.5px solid ${hov ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.12)'}`,
        borderRadius: '100px',
        background:   hov ? '#FAFAFA' : '#ffffff',
        color:        '#3f3f46',
        fontFamily:   "'Inter', system-ui, sans-serif",
        fontSize:     '14px',
        fontWeight:   600,
        cursor:       loading ? 'not-allowed' : 'pointer',
        opacity:      loading ? 0.6 : 1,
        transition:   'border-color 150ms ease, background 150ms ease',
      }}
    >
      Cancel
    </button>
  )
}

/**
 * Gold gradient submit button.
 * Disabled (dimmed) until all requirements are met AND passwords match.
 */
function ResetButton({ loading, disabled }) {
  const [hov, setHov] = useState(false)
  const off = loading || disabled
  return (
    <button
      type="submit"
      disabled={off}
      onMouseEnter={() => { if (!off) setHov(true) }}
      onMouseLeave={() => setHov(false)}
      style={{
        flex:           2,
        height:         '48px',
        border:         'none',
        borderRadius:   '100px',
        background:     off
          ? 'rgba(238,196,83,0.30)'
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
        ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />Updating…</>
        : <><Lock size={14} aria-hidden="true" />Reset Password</>
      }
    </button>
  )
}

/**
 * Full-page success card — shown after password is updated.
 * Auto-redirects to /login after 2 seconds (triggered in handleSubmit).
 */
function SuccessScreen() {
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
      <div
        style={{
          width:        '100%',
          maxWidth:     '400px',
          background:   '#ffffff',
          borderRadius: '24px',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.45)',
          padding:      '44px 40px',
          textAlign:    'center',
        }}
      >
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800, fontSize: '16px', letterSpacing: '3px', color: '#eec453', marginBottom: '12px' }}>
          LUXDRIVE
        </div>
        <div aria-hidden="true" style={{ width: '36px', height: '1px', background: 'rgba(238,196,83,0.35)', margin: '0 auto 22px' }} />

        {/* Gold checkmark circle */}
        <div
          style={{ width: '62px', height: '62px', borderRadius: '50%', background: 'rgba(238,196,83,0.10)', border: '1px solid rgba(238,196,83,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}
        >
          <CheckCircle2 size={30} style={{ color: '#eec453' }} aria-hidden="true" />
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '26px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>
          Password Updated
        </h1>
        <p style={{ fontSize: '13px', color: '#71717a', lineHeight: 1.75, marginBottom: '26px' }}>
          Your password has been reset successfully.
          Redirecting you to sign in…
        </p>

        <Link
          to={ROUTES.LOGIN}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', borderRadius: '100px', background: 'linear-gradient(135deg, #eec453 0%, #d4961a 100%)', color: '#0A0A0A', textDecoration: 'none', fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', fontWeight: 700, boxShadow: '0 4px 20px rgba(238,196,83,0.28)' }}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Sign In Now
        </Link>
      </div>
    </div>
  )
}
