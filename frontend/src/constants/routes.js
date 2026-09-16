export const ROUTES = {
  // ── Public ──────────────────────────────────────────────────────────────
  HOME:             "/",
  ABOUT:            "/about",
  CONTACT:          "/contact",

  // ── Auth ────────────────────────────────────────────────────────────────
  LOGIN:            "/login",
  REGISTER:         "/register",
  FORGOT_PASSWORD:  "/forgot-password",
  RESET_PASSWORD:   "/reset-password",
  VERIFY_EMAIL:     "/verify-email",

  // ── Customer (protected) ─────────────────────────────────────────────────
  CARS:             "/cars",             // ← cars listing page
  CAR_DETAIL:       "/cars/:id",         // ← car overview dashboard
  DASHBOARD:        "/cars",             // ← alias: login success lands here
  BOOKINGS:         "/bookings",
  FAVORITES:        "/favorites",
  PROFILE:          "/profile",

  // ── Admin (protected, role=ADMIN) ────────────────────────────────────────
  ADMIN:            "/admin",
  ADMIN_CARS:       "/admin/cars",
  ADMIN_BOOKINGS:   "/admin/bookings",
  ADMIN_CUSTOMERS:  "/admin/customers",
  ADMIN_PAYMENTS:   "/admin/payments",

  // ── Helpers ──────────────────────────────────────────────────────────────
  /**
   * Build a concrete car-detail URL from a vehicle id.
   * Usage: ROUTES.carDetail("abc-123") → "/cars/abc-123"
   */
  carDetail: (id) => `/cars/${id}`,
}
