/**
 * LUXDRIVE — Root Application Component
 *
 * Sets up:
 *   - BrowserRouter (React Router v6)
 *   - AuthProvider (global auth state)
 *   - Toaster (react-hot-toast notifications)
 *   - All application routes
 *
 * Route structure:
 *   Public    → /  /cars  /cars/:id  /about  /contact  etc.
 *   Auth      → /login  /register  /forgot-password  etc.
 *   Customer  → /dashboard/**  (ProtectedRoute)
 *   Admin     → /admin/**     (AdminRoute)
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import {
  ProtectedRoute,
  AdminRoute,
  GuestRoute,
} from '@/components/auth/ProtectedRoute'

// ── Lazy-loaded pages will be added as we build them ─────────
// For now we use placeholder components so the router works
import ComingSoon from '@/pages/ComingSoon.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background:  '#1a1a1a',
              color:       '#f4f4f5',
              border:      '1px solid rgba(255,255,255,0.08)',
              borderRadius:'8px',
              fontSize:    '14px',
              fontFamily:  'Inter, system-ui, sans-serif',
            },
            success: {
              iconTheme: { primary: '#eec453', secondary: '#0a0a0a' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' },
            },
          }}
        />

        <Routes>
          {/* ── Public Routes ────────────────────────────── */}
          <Route path="/"              element={<ComingSoon page="Home" />} />
          <Route path="/cars"          element={<ComingSoon page="Cars" />} />
          <Route path="/cars/:id"      element={<ComingSoon page="Car Details" />} />
          <Route path="/services"      element={<ComingSoon page="Services" />} />
          <Route path="/about"         element={<ComingSoon page="About" />} />
          <Route path="/contact"       element={<ComingSoon page="Contact" />} />
          <Route path="/faq"           element={<ComingSoon page="FAQ" />} />
          <Route path="/terms"         element={<ComingSoon page="Terms" />} />
          <Route path="/privacy"       element={<ComingSoon page="Privacy Policy" />} />
          <Route path="/unauthorized"  element={<ComingSoon page="Unauthorized" />} />

          {/* ── Auth Routes (guests only) ─────────────────── */}
          <Route path="/login"           element={<GuestRoute><ComingSoon page="Login" /></GuestRoute>} />
          <Route path="/register"        element={<GuestRoute><ComingSoon page="Register" /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ComingSoon page="Forgot Password" /></GuestRoute>} />
          <Route path="/auth/reset-password" element={<ComingSoon page="Reset Password" />} />
          <Route path="/auth/callback"   element={<ComingSoon page="Auth Callback" />} />
          <Route path="/auth/verify"     element={<ComingSoon page="Verify Email" />} />

          {/* ── Customer Dashboard (protected) ────────────── */}
          <Route path="/dashboard" element={<ProtectedRoute><ComingSoon page="Dashboard" /></ProtectedRoute>} />
          <Route path="/dashboard/bookings" element={<ProtectedRoute><ComingSoon page="My Bookings" /></ProtectedRoute>} />
          <Route path="/dashboard/bookings/:id" element={<ProtectedRoute><ComingSoon page="Booking Detail" /></ProtectedRoute>} />
          <Route path="/dashboard/favorites" element={<ProtectedRoute><ComingSoon page="Favorites" /></ProtectedRoute>} />
          <Route path="/dashboard/profile"   element={<ProtectedRoute><ComingSoon page="Profile" /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><ComingSoon page="Notifications" /></ProtectedRoute>} />
          <Route path="/dashboard/payments"  element={<ProtectedRoute><ComingSoon page="Payment History" /></ProtectedRoute>} />

          {/* ── Booking Flow (protected) ──────────────────── */}
          <Route path="/booking/:carId"   element={<ProtectedRoute><ComingSoon page="Booking" /></ProtectedRoute>} />
          <Route path="/checkout/:bookingId" element={<ProtectedRoute><ComingSoon page="Checkout" /></ProtectedRoute>} />
          <Route path="/booking/confirmation/:bookingId" element={<ProtectedRoute><ComingSoon page="Confirmation" /></ProtectedRoute>} />

          {/* ── Admin Routes (admin only) ──────────────────── */}
          <Route path="/admin"                     element={<AdminRoute><ComingSoon page="Admin Dashboard" /></AdminRoute>} />
          <Route path="/admin/dashboard"           element={<AdminRoute><ComingSoon page="Admin Dashboard" /></AdminRoute>} />
          <Route path="/admin/cars"                element={<AdminRoute><ComingSoon page="Cars Management" /></AdminRoute>} />
          <Route path="/admin/cars/new"            element={<AdminRoute><ComingSoon page="Add Car" /></AdminRoute>} />
          <Route path="/admin/cars/:id/edit"       element={<AdminRoute><ComingSoon page="Edit Car" /></AdminRoute>} />
          <Route path="/admin/bookings"            element={<AdminRoute><ComingSoon page="Bookings Management" /></AdminRoute>} />
          <Route path="/admin/bookings/:id"        element={<AdminRoute><ComingSoon page="Booking Detail" /></AdminRoute>} />
          <Route path="/admin/customers"           element={<AdminRoute><ComingSoon page="Customers" /></AdminRoute>} />
          <Route path="/admin/customers/:id"       element={<AdminRoute><ComingSoon page="Customer Detail" /></AdminRoute>} />
          <Route path="/admin/payments"            element={<AdminRoute><ComingSoon page="Payments" /></AdminRoute>} />
          <Route path="/admin/locations"           element={<AdminRoute><ComingSoon page="Locations" /></AdminRoute>} />
          <Route path="/admin/services"            element={<AdminRoute><ComingSoon page="Services" /></AdminRoute>} />
          <Route path="/admin/reviews"             element={<AdminRoute><ComingSoon page="Reviews" /></AdminRoute>} />
          <Route path="/admin/settings"            element={<AdminRoute><ComingSoon page="Settings" /></AdminRoute>} />

          {/* ── 404 ───────────────────────────────────────── */}
          <Route path="*" element={<ComingSoon page="404 — Page Not Found" />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
