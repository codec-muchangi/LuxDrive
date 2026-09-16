import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { ROUTES } from "../../constants/routes"
import toast from "react-hot-toast"

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { signIn } = useAuth()

  // After a protected-route bounce, state.from holds where the user wanted to go
  const intendedDestination = location.state?.from?.pathname || ROUTES.CARS

  const [form,       setForm]       = useState({ email: "", password: "" })
  const [showPass,   setShowPass]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState("")

  // ── Field change ─────────────────────────────────────────────────────────
  const onChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Basic client-side guard
    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.")
      return
    }

    setLoading(true)

    const { error: authError } = await signIn({
      email:    form.email,
      password: form.password,
    })

    if (authError) {
      setLoading(false)
      // Map Supabase error messages to user-friendly text
      const msg = authError.message?.toLowerCase() || ""
      if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
        setError("Incorrect email or password. Please try again.")
      } else if (msg.includes("email not confirmed")) {
        setError("Please verify your email before logging in. Check your inbox.")
      } else if (msg.includes("too many requests")) {
        setError("Too many attempts. Please wait a moment and try again.")
      } else {
        setError(authError.message || "Login failed. Please try again.")
      }
      return
    }

    // ── SUCCESS ─────────────────────────────────────────────────────────────
    // signIn returned no error → Supabase session is created.
    // AuthContext's onAuthStateChange has already (or is about to) set user.
    // Navigate with replace so Back button doesn't return to the login page.
    toast.success("Welcome back, John!")
    navigate(intendedDestination, { replace: true })
  }

  // ── Styles (inline, matching LUXDRIVE dark design system) ────────────────
  const S = {
    page: {
      minHeight:      "100vh",
      background:     "#0A0A0A",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "20px",
      fontFamily:     "'Inter', sans-serif",
    },
    card: {
      width:        "100%",
      maxWidth:     440,
      background:   "#141414",
      border:       "1px solid #2a2a2a",
      borderRadius: 20,
      padding:      "40px 36px",
    },
    logo: {
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      marginBottom:   28,
    },
    logoMark: {
      width:          44,
      height:         44,
      borderRadius:   "50%",
      border:         "2.5px solid #eec453",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      color:          "#eec453",
      fontFamily:     "'Bebas Neue', sans-serif",
      fontSize:       16,
      letterSpacing:  2,
    },
    heading: {
      fontFamily:    "'Playfair Display', serif",
      fontSize:      26,
      fontWeight:    700,
      color:         "#F5F5F0",
      textAlign:     "center",
      marginBottom:  6,
    },
    sub: {
      fontSize:   13,
      color:      "#777",
      textAlign:  "center",
      marginBottom: 28,
    },
    errorBox: {
      display:      "flex",
      alignItems:   "flex-start",
      gap:          10,
      background:   "#2d1111",
      border:       "1px solid #5c1f1f",
      borderRadius: 10,
      padding:      "12px 14px",
      marginBottom: 20,
    },
    errorText: {
      fontSize:   13,
      color:      "#ff6b6b",
      lineHeight: 1.5,
    },
    label: {
      display:       "block",
      fontSize:      10.5,
      fontWeight:    700,
      color:         "#777",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom:  8,
    },
    inputWrap: {
      position:     "relative",
      marginBottom: 18,
    },
    inputIcon: {
      position:  "absolute",
      left:      14,
      top:       "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
    },
    input: {
      width:        "100%",
      background:   "#1e1e1e",
      border:       "1px solid #2a2a2a",
      borderRadius: 10,
      padding:      "12px 14px 12px 42px",
      color:        "#F5F5F0",
      fontSize:     14,
      fontFamily:   "'Inter', sans-serif",
      outline:      "none",
      transition:   "border-color 0.2s",
    },
    eyeBtn: {
      position:   "absolute",
      right:      12,
      top:        "50%",
      transform:  "translateY(-50%)",
      background: "transparent",
      border:     "none",
      cursor:     "pointer",
      padding:    4,
      color:      "#555",
    },
    forgotRow: {
      display:        "flex",
      justifyContent: "flex-end",
      marginTop:      -10,
      marginBottom:   22,
    },
    forgotLink: {
      fontSize:    12,
      color:       "#eec453",
      textDecoration: "none",
      fontWeight:  500,
    },
    submitBtn: {
      width:          "100%",
      padding:        "13px 20px",
      borderRadius:   10,
      border:         "none",
      cursor:         loading ? "not-allowed" : "pointer",
      background:     loading ? "#666" : "#eec453",
      color:          "#0A0A0A",
      fontSize:       14,
      fontWeight:     800,
      fontFamily:     "'Inter', sans-serif",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      gap:            8,
      transition:     "opacity 0.2s",
      opacity:        loading ? 0.7 : 1,
    },
    divider: {
      display:        "flex",
      alignItems:     "center",
      gap:            12,
      margin:         "24px 0",
    },
    dividerLine: {
      flex:        1,
      height:      1,
      background:  "#2a2a2a",
    },
    dividerText: {
      fontSize:      11,
      fontWeight:    600,
      color:         "#555",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      whiteSpace:    "nowrap",
    },
    registerLink: {
      textAlign:  "center",
      fontSize:   13,
      color:      "#777",
      marginTop:  22,
    },
  }

  return (
    <div style={S.page}>
      <div style={S.card}>

        {/* Logo */}
        <div style={S.logo}>
          <div style={S.logoMark}>LX</div>
        </div>

        {/* Heading */}
        <h1 style={S.heading}>Welcome Back</h1>
        <p style={S.sub}>Sign in to your LUXDRIVE account</p>

        {/* Error */}
        {error && (
          <div style={S.errorBox}>
            <AlertCircle size={16} color="#ff6b6b" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={S.errorText}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <label style={S.label} htmlFor="email">Email Address</label>
          <div style={S.inputWrap}>
            <div style={S.inputIcon}>
              <Mail size={15} color="#555" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={onChange}
              disabled={loading}
              required
              style={S.input}
              onFocus={e => { e.target.style.borderColor = "#eec453" }}
              onBlur={e  => { e.target.style.borderColor = "#2a2a2a" }}
            />
          </div>

          {/* Password */}
          <label style={S.label} htmlFor="password">Password</label>
          <div style={S.inputWrap}>
            <div style={S.inputIcon}>
              <Lock size={15} color="#555" />
            </div>
            <input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              disabled={loading}
              required
              style={{ ...S.input, paddingRight: 42 }}
              onFocus={e => { e.target.style.borderColor = "#eec453" }}
              onBlur={e  => { e.target.style.borderColor = "#2a2a2a" }}
            />
            <button
              type="button"
              style={S.eyeBtn}
              onClick={() => setShowPass(v => !v)}
              tabIndex={-1}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass
                ? <EyeOff size={15} />
                : <Eye     size={15} />
              }
            </button>
          </div>

          {/* Forgot password */}
          <div style={S.forgotRow}>
            <Link to={ROUTES.FORGOT_PASSWORD} style={S.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={S.submitBtn}
          >
            {loading ? "Signing in…" : "Sign In"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Divider */}
        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>or</span>
          <div style={S.dividerLine} />
        </div>

        {/* Register link */}
        <p style={S.registerLink}>
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            style={{ color: "#eec453", fontWeight: 600, textDecoration: "none" }}
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
