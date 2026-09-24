import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { ROUTES } from "../../constants/routes"

// ─────────────────────────────────────────────────────────────────────────────
// Login Page
// Route: /login
// ─────────────────────────────────────────────────────────────────────────────

const Login = () => {
  const navigate       = useNavigate()
  const { login }      = useAuth()
  const [form, setForm]     = useState({ email: "", password: "" })
  const [error, setError]   = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError("Please fill in all fields."); return }
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate(ROUTES.CARS)
    } else {
      setError(result.message || "Invalid email or password.")
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>Smart Auto Cars</div>
        <h1 style={s.heading}>Welcome back</h1>
        <p style={s.sub}>Sign in to your account to continue</p>

        {/* Error */}
        {error && <div style={s.error}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input
              style={s.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div style={s.field}>
            <div style={s.labelRow}>
              <label style={s.label}>Password</label>
              <Link to={ROUTES.FORGOT_PASSWORD} style={s.forgotLink}>Forgot password?</Link>
            </div>
            <input
              style={s.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={s.switchText}>
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.REGISTER} style={s.link}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: "100vh", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  card: { background: "#fff", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "48px 44px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  logo: { fontSize: "16px", fontWeight: 800, color: "#1e3a5f", marginBottom: "28px" },
  heading: { fontSize: "24px", fontWeight: 700, color: "#111827", marginBottom: "6px" },
  sub: { fontSize: "14px", color: "#6b7280", marginBottom: "28px" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "12px 14px", fontSize: "13.5px", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: "13px", fontWeight: 600, color: "#374151" },
  forgotLink: { fontSize: "12.5px", color: "#2563EB", textDecoration: "none" },
  input: { padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", color: "#111827", outline: "none" },
  btn: { padding: "13px", background: "#2563EB", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginTop: "4px" },
  switchText: { textAlign: "center", fontSize: "13.5px", color: "#6b7280", marginTop: "20px" },
  link: { color: "#2563EB", textDecoration: "none", fontWeight: 600 },
}

export default Login
