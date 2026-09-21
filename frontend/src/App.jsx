import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { ROUTES } from "./constants/routes"

// ── Public pages ────────────────────────────────────────────────────────────
import Home          from "./pages/Home"

// ── Auth pages ──────────────────────────────────────────────────────────────
import Login         from "./pages/auth/Login"
import Register      from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import VerifyEmail   from "./pages/auth/VerifyEmail"

// ── Customer pages (protected) ───────────────────────────────────────────────
import Cars          from "./pages/Cars"               // /cars   listing page
import CarOverviewDashboard   from "./pages/CarOverviewDashboard"          // /cars/:id  overview dashboard

// ── Toaster config ───────────────────────────────────────────────────────────
const TOAST_OPTIONS = {
  style: {
    background: "#141414",
    color:      "#F5F5F0",
    border:     "1px solid #2a2a2a",
    fontFamily: "'Inter', sans-serif",
    fontSize:   13,
  },
  success: { iconTheme: { primary: "#eec453", secondary: "#141414" } },
  error:   { iconTheme: { primary: "#ef4444", secondary: "#141414" } },
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          {/* ── PUBLIC ───────────────────────────────────────────────────── */}
          <Route path={ROUTES.HOME}   element={<Home />} />

          {/* ── AUTH ─────────────────────────────────────────────────────── */}
          <Route path={ROUTES.LOGIN}           element={<Login />} />
          <Route path={ROUTES.REGISTER}        element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD}  element={<ResetPassword />} />
          <Route path={ROUTES.VERIFY_EMAIL}    element={<VerifyEmail />} />

          {/* ── PROTECTED: CUSTOMER ──────────────────────────────────────── */}
          <Route
            path={ROUTES.CARS}
            element={
              <ProtectedRoute>
                <Cars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cars/:id"
            element={
              <ProtectedRoute>
                <CarOverviewDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── CATCH-ALL: unknown routes → home ─────────────────────────── */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />

        </Routes>

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={TOAST_OPTIONS}
        />

      </AuthProvider>
    </BrowserRouter>
  )
}
